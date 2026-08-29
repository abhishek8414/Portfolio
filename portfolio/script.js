const body = document.body;
const nav = document.querySelector('.site-header');
const navLinks = [...document.querySelectorAll('.nav-menu a')];
const navToggle = document.querySelector('.nav-toggle');
const navPanel = document.querySelector('.nav-panel');
const themeToggle = document.querySelector('.theme-toggle');
const backToTop = document.querySelector('.back-to-top');
const revealItems = document.querySelectorAll('.reveal');
const typingEl = document.querySelector('.typing-text');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.getElementById('contactForm');

const typedWords = [
  'Full Stack Developer',
  'Java & DSA Learner',
  'Problem Solver',
  'Web Developer'
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
  const currentWord = typedWords[wordIndex];

  if (!typingEl) return;

  if (isDeleting) {
    typingEl.textContent = currentWord.substring(0, charIndex--);
  } else {
    typingEl.textContent = currentWord.substring(0, charIndex++);
  }

  const speed = isDeleting ? 70 : 120;

  if (!isDeleting && charIndex > currentWord.length) {
    isDeleting = true;
    setTimeout(typeWriter, 1200);
    return;
  }

  if (isDeleting && charIndex < 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % typedWords.length;
    charIndex = 0;
  }

  setTimeout(typeWriter, speed);
}

themeToggle?.addEventListener('click', () => {
  body.classList.toggle('light-mode');
  const isLight = body.classList.contains('light-mode');
  themeToggle.textContent = isLight ? '☀️' : '🌙';
});

function toggleMenu() {
  const isOpen = navPanel.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
}

navToggle?.addEventListener('click', toggleMenu);

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      navPanel.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.18 });

revealItems.forEach((item) => observer.observe(item));

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }

  const sections = document.querySelectorAll('main section[id]');
  let current = 'home';

  sections.forEach((section) => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === `#${current}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));

    projectCards.forEach((card) => {
      const shouldShow = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !shouldShow);
    });
  });
});

function validateField(input) {
  const field = input.closest('.field');
  const messageEl = field.querySelector('.error-message');
  let error = '';

  if (input.name === 'name' && input.value.trim().length < 2) {
    error = 'Please enter your name.';
  }

  if (input.name === 'email') {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(input.value.trim())) {
      error = 'Please enter a valid email address.';
    }
  }

  if (input.name === 'message' && input.value.trim().length < 10) {
    error = 'Please enter a message with at least 10 characters.';
  }

  input.classList.toggle('input-error', Boolean(error));
  messageEl.textContent = error;
  return !error;
}

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const formFields = [...contactForm.querySelectorAll('input, textarea')];
  const valid = formFields.every(validateField);
  const status = document.getElementById('formStatus');

  if (!valid) {
    status.textContent = 'Please correct the highlighted fields and try again.';
    status.style.color = '#ff7b7b';
    return;
  }

  status.textContent = 'Your message has been sent successfully!';
  status.style.color = '#57d39f';
  contactForm.reset();

  formFields.forEach((field) => field.classList.remove('input-error'));
  formFields.forEach((field) => {
    const fieldWrap = field.closest('.field');
    if (fieldWrap) {
      const errorEl = fieldWrap.querySelector('.error-message');
      if (errorEl) errorEl.textContent = '';
    }
  });
});

const contactFields = contactForm ? [...contactForm.querySelectorAll('input, textarea')] : [];
contactFields.forEach((field) => {
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    if (field.classList.contains('input-error')) {
      validateField(field);
    }
  });
});

typeWriter();
