const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');

const buildBody = ({ name, email, message, date, time }) => {
  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Preferred date: ${date || 'Not specified'}`,
    `Preferred time: ${time || 'Not specified'}`,
    '',
    'Message:',
    message
  ];
  return encodeURIComponent(lines.join('\n'));
};

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const message = formData.get('message')?.toString().trim();
  const date = formData.get('date')?.toString();
  const time = formData.get('time')?.toString();

  if (!name || !email || !message) {
    statusEl.textContent = 'Please fill out name, email, and message.';
    return;
  }

  const subject = encodeURIComponent('Portfolio inquiry');
  const body = buildBody({ name, email, message, date, time });
  statusEl.textContent = 'Opening your email app...';
  window.location.href = `mailto:capturegnd@gmail.com?subject=${subject}&body=${body}`;
  form.reset();
  setTimeout(() => {
    window.location.href = 'thankyou.html';
  }, 400);
});
