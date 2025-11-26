const imageData = [
  { id: 'img1', src: 'DSC_8629.jpg', alt: 'Portrait DSC_8629' },
  { id: 'img2', src: 'DSC_8656.jpg', alt: 'Portrait DSC_8656' },
  { id: 'img3', src: 'DSC_8715.jpg', alt: 'Portrait DSC_8715' },
  { id: 'img4', src: 'DSC_8722.jpg', alt: 'Portrait DSC_8722' },
  { id: 'img5', src: 'DSC_8879.jpg', alt: 'Portrait DSC_8879' },
  { id: 'img6', src: 'DSC_8935.jpg', alt: 'Portrait DSC_8935' },
  { id: 'img7', src: 'DSC_8970.jpg', alt: 'Portrait DSC_8970' },
  { id: 'img8', src: 'DSC_8979.jpg', alt: 'Portrait DSC_8979' },
  { id: 'img9', src: 'DSC_9004.jpg', alt: 'Portrait DSC_9004' },
  { id: 'img10', src: 'DSC_9016.jpg', alt: 'Portrait DSC_9016' },
  { id: 'img11', src: 'DSC_8843.jpg', alt: 'Portrait DSC_9016 (1)' },
  { id: 'img12', src: 'DSC_9024.jpg', alt: 'Portrait DSC_9024' }
];

const ADMIN_PASS = 'capture123';

const galleryGrid = document.getElementById('galleryGrid');
const adminToggle = document.getElementById('adminToggle');
const viewPortfolio = document.getElementById('viewPortfolio');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');

let isAdmin = localStorage.getItem('isAdmin') === 'true';
let order = JSON.parse(localStorage.getItem('galleryOrder') || 'null');
let draggedId = null;

const orderedImages = () => {
  if (!order) {
    return imageData;
  }
  const map = new Map(imageData.map((img) => [img.id, img]));
  const sorted = order.map((id) => map.get(id)).filter(Boolean);
  const remaining = imageData.filter((img) => !order.includes(img.id));
  return [...sorted, ...remaining];
};

const persistOrder = () => {
  if (!galleryGrid) return;
  order = [...galleryGrid.querySelectorAll('.gallery-item')].map((item) => item.dataset.id);
  localStorage.setItem('galleryOrder', JSON.stringify(order));
};

const handleDragStart = (event) => {
  if (!isAdmin) return;
  draggedId = event.currentTarget.dataset.id;
  event.dataTransfer.effectAllowed = 'move';
  event.currentTarget.classList.add('dragging');
};

const handleDragOver = (event) => {
  if (!isAdmin) return;
  event.preventDefault();
  const target = event.currentTarget;
  const draggedEl = galleryGrid.querySelector('.dragging');
  if (!draggedEl || draggedEl === target) return;
  const items = [...galleryGrid.querySelectorAll('.gallery-item')];
  const targetIndex = items.indexOf(target);
  const draggedIndex = items.indexOf(draggedEl);

  if (draggedIndex < targetIndex) {
    galleryGrid.insertBefore(draggedEl, target.nextSibling);
  } else {
    galleryGrid.insertBefore(draggedEl, target);
  }
};

const handleDrop = (event) => {
  if (!isAdmin) return;
  event.preventDefault();
  persistOrder();
};

const handleDragEnd = (event) => {
  event.currentTarget.classList.remove('dragging');
  if (isAdmin) {
    persistOrder();
  }
};

const addDragListeners = (element) => {
  element.addEventListener('dragstart', handleDragStart);
  element.addEventListener('dragover', handleDragOver);
  element.addEventListener('drop', handleDrop);
  element.addEventListener('dragend', handleDragEnd);
};

const updateAdminUI = () => {
  if (adminToggle) {
    adminToggle.textContent = isAdmin ? 'Exit admin' : 'Admin login';
  }
  if (galleryGrid) {
    galleryGrid.querySelectorAll('.gallery-item').forEach((item) => {
      item.setAttribute('draggable', isAdmin);
    });
  }
};

const initAdminToggle = () => {
  if (!adminToggle) return;
  adminToggle.addEventListener('click', () => {
    if (isAdmin) {
      isAdmin = false;
      localStorage.setItem('isAdmin', 'false');
      updateAdminUI();
      return;
    }
    const pass = prompt('Enter admin password');
    if (pass === ADMIN_PASS) {
      isAdmin = true;
      localStorage.setItem('isAdmin', 'true');
      updateAdminUI();
    } else if (pass) {
      alert('Incorrect password.');
    }
  });
};

const initHeroScroll = () => {
  if (!viewPortfolio) return;
  viewPortfolio.addEventListener('click', () => {
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
  });
};

function openLightbox(src, alt) {
  if (!lightbox || !lightboxImage) return;
  lightboxImage.src = src;
  lightboxImage.alt = alt || 'Enlarged photo';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
}

const renderGallery = () => {
  if (!galleryGrid) return;
  galleryGrid.innerHTML = '';
  orderedImages().forEach((img) => {
    const card = document.createElement('article');
    card.className = 'gallery-item';
    card.dataset.id = img.id;
    card.setAttribute('draggable', isAdmin);
    card.innerHTML = `
      <img src="${img.src}" alt="${img.alt}">
    `;
    addDragListeners(card);
    card.addEventListener('click', () => openLightbox(img.src, img.alt));
    galleryGrid.appendChild(card);
  });
};

const initLightbox = () => {
  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeLightbox();
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  renderGallery();
  updateAdminUI();
  initAdminToggle();
  initHeroScroll();
  initLightbox();
});
