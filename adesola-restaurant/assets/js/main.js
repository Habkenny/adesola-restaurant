'use strict';

// Use Bootstrap's modal for a keyboard-friendly gallery lightbox.
const galleryModalElement = document.querySelector('#galleryModal');
const galleryModal = galleryModalElement && window.bootstrap ? new bootstrap.Modal(galleryModalElement) : null;
document.querySelectorAll('[data-gallery-image]').forEach((button) => {
  button.addEventListener('click', () => {
    const image = document.querySelector('#galleryModalImage');
    const title = document.querySelector('#galleryModalLabel');
    if (!image || !galleryModal) return;
    image.src = button.dataset.galleryImage || '';
    image.alt = button.dataset.galleryAlt || 'Restaurant gallery image';
    title.textContent = button.dataset.galleryAlt || 'Adesola Gallery';
    galleryModal.show();
  });
});
galleryModalElement?.addEventListener('hidden.bs.modal', () => {
  const image = document.querySelector('#galleryModalImage');
  if (image) { image.src = ''; image.alt = ''; }
});

function setMinimumReservationDate() {
  const dateInput = document.querySelector('#resDate');
  if (!dateInput) return;
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dateInput.min = localDate;
}
setMinimumReservationDate();

async function submitNetlifyForm(form, status, successMessage) {
  const button = form.querySelector('button[type="submit"]');
  if (!form || !status) return;
  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    status.hidden = false;
    status.textContent = 'Please check the highlighted fields and try again.';
    status.className = 'form-status mt-3';
    form.querySelector(':invalid')?.focus();
    return;
  }
  form.classList.add('was-validated');
  if (button) { button.disabled = true; button.setAttribute('aria-busy', 'true'); }
  status.hidden = false;
  status.textContent = 'Sending…';
  status.className = 'form-status mt-3';
  try {
    const body = new URLSearchParams(new FormData(form));
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    });
    if (!response.ok) throw new Error(`Submission failed (${response.status})`);
    status.textContent = successMessage;
    status.className = 'form-status mt-3 form-status-success';
    form.reset();
    setMinimumReservationDate();
  } catch (error) {
    status.textContent = 'We could not send this form. Please try again later or contact the restaurant directly.';
    status.className = 'form-status mt-3 form-status-error';
  } finally {
    if (button) { button.disabled = false; button.removeAttribute('aria-busy'); }
  }
}

document.querySelector('#reservationForm')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const dateInput = form.querySelector('[name="date"]');
  if (dateInput && dateInput.value && dateInput.value < dateInput.min) {
    dateInput.setCustomValidity('Please choose today or a future date.');
  } else if (dateInput) {
    dateInput.setCustomValidity('');
  }
  submitNetlifyForm(form, document.querySelector('#reservationStatus'), 'Your booking request has been received. This is not a confirmed table reservation: instant confirmation requires a live table-availability booking system.');
});

document.querySelector('#contactForm')?.addEventListener('submit', (event) => {
  event.preventDefault();
  submitNetlifyForm(event.currentTarget, document.querySelector('#contactStatus'), 'Thank you — your message has been submitted.');
});
