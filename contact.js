function contactEscape(value) {
  return String(value || '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

async function submitContactForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('.contact-submit-btn');
  const note = form.querySelector('.contact-form-note');
  const data = new FormData(form);
  const payload = {
    name: String(data.get('name') || '').trim(),
    email: String(data.get('email') || '').trim(),
    phone: String(data.get('phone') || '').trim(),
    message: String(data.get('message') || '').trim(),
    category: 'new',
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    modifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
    takenAt: null,
    dateKey: new Date().toISOString().slice(0, 10)
  };

  if (!payload.name || !payload.email || !payload.phone || !payload.message || typeof db === 'undefined') {
    if (note) note.textContent = 'Please complete all fields before sending.';
    return;
  }

  if (button) {
    button.disabled = true;
    button.innerHTML = 'Sending...';
  }

  try {
    await db.collection('contacts').add(payload);
    form.reset();
    if (note) note.textContent = 'Message sent successfully. Thank you for reaching out.';
    showContactSuccessPopup();
  } catch (error) {
    console.error('Contact submission failed:', error);
    if (note) note.textContent = 'Unable to send right now. Please try again.';
  } finally {
    if (button) {
      button.disabled = false;
      button.innerHTML = 'Submit Message <span aria-hidden="true">→</span>';
    }
  }
}

function showContactSuccessPopup() {
  const popup = document.getElementById('contactSuccessPopup');
  if (!popup) return;
  popup.classList.add('is-visible');
  popup.setAttribute('aria-hidden', 'false');
}

function closeContactSuccessPopup() {
  const popup = document.getElementById('contactSuccessPopup');
  if (!popup) return;
  popup.classList.remove('is-visible');
  popup.setAttribute('aria-hidden', 'true');
}
