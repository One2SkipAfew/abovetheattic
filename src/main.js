/* ============================================
   Above the Attic — Main JavaScript
   ============================================ */

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
let lastScrollY = 0;

function handleNavScroll() {
  const currentScrollY = window.scrollY;
  
  if (currentScrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  lastScrollY = currentScrollY;
}

window.addEventListener('scroll', handleNavScroll, { passive: true });

// ── Mobile hamburger menu ──
const hamburger = document.getElementById('nav-hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.classList.toggle('nav-open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close mobile nav on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.classList.remove('nav-open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ── Smooth scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ── Intersection Observer for reveal animations ──
const revealElements = document.querySelectorAll('.platform-card, .section-header, .coming-soon-content, .mailing-form, .coming-soon-alt');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal', 'visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

revealElements.forEach((el, index) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${index * 100}ms`;
  revealObserver.observe(el);
});

// ── Hero floating particles ──
function createParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;
  
  const shapes = ['▼', '▲', '◆', '◇', '▸', '◂'];
  const particleCount = 20;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('span');
    particle.className = 'hero-particle';
    particle.textContent = shapes[Math.floor(Math.random() * shapes.length)];
    
    const size = Math.random() * 16 + 8;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 6;
    const duration = Math.random() * 4 + 4;
    const opacity = Math.random() * 0.12 + 0.03;
    
    particle.style.cssText = `
      left: ${x}%;
      top: ${y}%;
      font-size: ${size}px;
      color: white;
      opacity: ${opacity};
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
    `;
    
    container.appendChild(particle);
  }
}

createParticles();

// ── Modal System Control ──
const contactModal = document.getElementById('contact-modal');
const successModal = document.getElementById('success-modal');
const successTitle = document.getElementById('success-modal-title');
const successText = document.getElementById('success-modal-text');

function openModal(modal) {
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('nav-open'); // lock body scroll
}

function closeModal(modal) {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  const activeModals = document.querySelectorAll('.modal.active');
  if (activeModals.length === 0) {
    document.body.classList.remove('nav-open');
  }
}

// Attach listeners to contact modal triggers
document.querySelectorAll('.trigger-contact-modal').forEach(trigger => {
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(contactModal);
  });
});

// Close buttons listeners
const contactCloseBtn = document.getElementById('contact-modal-close');
const contactOverlay = document.getElementById('contact-modal-overlay');

if (contactCloseBtn) {
  contactCloseBtn.addEventListener('click', () => closeModal(contactModal));
}
if (contactOverlay) {
  contactOverlay.addEventListener('click', () => closeModal(contactModal));
}

const successOkBtn = document.getElementById('success-modal-ok');
const successOverlay = document.getElementById('success-modal-overlay');

if (successOkBtn) {
  successOkBtn.addEventListener('click', () => closeModal(successModal));
}
if (successOverlay) {
  successOverlay.addEventListener('click', () => closeModal(successModal));
}

// Esc key to close active modals
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const activeModals = document.querySelectorAll('.modal.active');
    activeModals.forEach(modal => closeModal(modal));
  }
});

// ── Contact form submit handler ──
const contactForm = document.getElementById('contact-form');
const contactSubmit = document.getElementById('contact-submit');

if (contactForm && contactSubmit) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('contact-first-name').value.trim();
    const lastName = document.getElementById('contact-last-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    
    if (!firstName || !lastName || !email || !message) return;
    
    const submitText = contactSubmit.querySelector('.submit-text');
    const submitLoading = contactSubmit.querySelector('.submit-loading');
    
    // Show loading state
    submitText.style.display = 'none';
    submitLoading.style.display = 'inline-flex';
    contactSubmit.disabled = true;
    
    try {
      const response = await fetch('https://formsubmit.co/ajax/admin@fromb2c.africa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email: email,
          message: message
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        closeModal(contactModal);
        contactForm.reset();
        
        successTitle.textContent = "Message Sent!";
        successText.innerHTML = `Your message has been sent successfully to <span style="font-weight: 700; color: var(--color-sky-blue);">admin@fromb2c.africa</span>. We'll be in touch soon!`;
        openModal(successModal);
      } else {
        throw new Error(result.message || 'Form submission failed');
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      alert('Oops! There was a problem submitting your message. Please try again.');
    } finally {
      submitText.style.display = 'inline';
      submitLoading.style.display = 'none';
      contactSubmit.disabled = false;
    }
  });
}

// ── Mailing list form handler ──
const mailingForm = document.getElementById('mailing-form');
const mailingSubmit = document.getElementById('mailing-submit');
const mailingError = document.getElementById('mailing-error');

if (mailingForm && mailingSubmit) {
  mailingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('mailing-name').value.trim();
    const email = document.getElementById('mailing-email').value.trim();
    
    if (!name || !email) return;
    
    // Show loading state
    const submitText = mailingSubmit.querySelector('.mailing-submit-text');
    const submitLoading = mailingSubmit.querySelector('.mailing-submit-loading');
    submitText.style.display = 'none';
    submitLoading.style.display = 'inline-flex';
    mailingSubmit.disabled = true;
    mailingError.style.display = 'none';
    
    try {
      // Submit AJAX POST request to Netlify Forms endpoint
      const formData = new URLSearchParams();
      formData.append('form-name', 'mailing-list');
      formData.append('name', name);
      formData.append('email', email);
      
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      });
      
      if (!response.ok) throw new Error('Failed to subscribe');
      
      // Clear forms and show modal success
      mailingForm.reset();
      successTitle.textContent = "Joined!";
      successText.textContent = "🎉 You're on the list! We'll be in touch when something exciting drops.";
      openModal(successModal);
      
    } catch (err) {
      console.error('Mailing list error:', err);
      mailingError.style.display = 'block';
    } finally {
      submitText.style.display = 'inline';
      submitLoading.style.display = 'none';
      mailingSubmit.disabled = false;
    }
  });
}

// ── Platform card stagger animation ──
const platformCards = document.querySelectorAll('.platform-card');
platformCards.forEach((card, i) => {
  card.style.transitionDelay = `${i * 150}ms`;
});

// ── Platform slider horizontal navigation ──
const sliderGrid = document.querySelector('.platform-grid');
const prevBtn = document.getElementById('slider-prev');
const nextBtn = document.getElementById('slider-next');

if (sliderGrid && prevBtn && nextBtn) {
  const getScrollAmount = () => {
    const firstCard = sliderGrid.querySelector('.platform-card');
    if (!firstCard) return 300;
    // Scroll by one card width + gap (gap is 2rem = 32px)
    return firstCard.offsetWidth + 32;
  };

  nextBtn.addEventListener('click', () => {
    sliderGrid.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
  });

  prevBtn.addEventListener('click', () => {
    sliderGrid.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
  });

  sliderGrid.addEventListener('scroll', () => {
    const isAtStart = sliderGrid.scrollLeft <= 15;
    const maxScrollLeft = sliderGrid.scrollWidth - sliderGrid.clientWidth;
    const isAtEnd = sliderGrid.scrollLeft >= maxScrollLeft - 15;
    
    prevBtn.disabled = isAtStart;
    nextBtn.disabled = isAtEnd;
  }, { passive: true });
}

// ── Coming Soon card "Get Notified" smooth scroll & focus ──
const comingSoonCta = document.querySelector('.platform-card--coming-soon .platform-link');
if (comingSoonCta) {
  comingSoonCta.addEventListener('click', (e) => {
    e.preventDefault();
    const mailSection = document.getElementById('coming-soon');
    if (mailSection) {
      const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
      const targetPosition = mailSection.getBoundingClientRect().top + window.scrollY - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Focus name input after scroll finishes
      setTimeout(() => {
        const nameInput = document.getElementById('mailing-name');
        if (nameInput) nameInput.focus();
      }, 800);
    }
  });
}
