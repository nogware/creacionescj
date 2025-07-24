document.addEventListener("DOMContentLoaded", () => {
  // SLIDER PRINCIPAL
  const slider = document.querySelector('#slider > div');
  if (slider) {
    const slides = slider.children.length;
    let index = 0;
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');

    const showSlide = () => {
      slider.style.transform = `translateX(-${index * 100}%)`;
    };

    nextBtn?.addEventListener('click', () => {
      index = (index + 1) % slides;
      showSlide();
    });

    prevBtn?.addEventListener('click', () => {
      index = (index - 1 + slides) % slides;
      showSlide();
    });

    let autoplay = setInterval(() => {
      index = (index + 1) % slides;
      showSlide();
    }, 4000);

    const sliderContainer = document.querySelector('#slider');
    sliderContainer?.addEventListener('mouseenter', () => clearInterval(autoplay));
    sliderContainer?.addEventListener('mouseleave', () => {
      autoplay = setInterval(() => {
        index = (index + 1) % slides;
        showSlide();
      }, 4000);
    });
  }

  // NAVBAR
  const navbar = document.getElementById('main-navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  menuToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('hidden');
    // Opcional: bloquear scroll al abrir menú
    // document.body.classList.toggle('overflow-hidden');
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY <= 10) {
      navbar?.classList.remove('navbar-faded');
      navbar?.classList.add('navbar-original');
    }
  });

  document.querySelectorAll('#nav-links a').forEach(link => {
    link.addEventListener('click', function () {
      if (this.getAttribute('href').startsWith('#')) {
        navbar?.classList.remove('navbar-original');
        navbar?.classList.add('navbar-faded');
        if (window.innerWidth < 768) {
          navLinks?.classList.add('hidden');
          // document.body.classList.remove('overflow-hidden'); // si bloqueas scroll, desbloquearlo aquí
        }
      }
    });
  });

  // GALERÍA - CARRUSEL
  function moveSlide(container, direction) {
    const total = container.children.length;
    let index = parseInt(container.dataset.index || 0);
    index = (index + direction + total) % total;
    container.style.transform = `translateX(-${index * 100}%)`;
    container.dataset.index = index;
  }

  window.nextSlide = (btn) => {
    const container = btn.closest('.relative').querySelector('.carousel-images');
    moveSlide(container, 1);
  };

  window.prevSlide = (btn) => {
    const container = btn.closest('.relative').querySelector('.carousel-images');
    moveSlide(container, -1);
  };

  // Variables globales para modal de GALERÍA
  const modalGaleria = document.getElementById('imageModal');
  const modalImagesContainer = document.getElementById('modalImagesContainer');
  const modalImages = document.getElementById('modalImages');

  let modalCurrentIndex = 0;
  let modalImgs = [];

  // MODAL: abrir con carrusel imágenes (GALERÍA)
  window.openModal = (clickedImg) => {
    const carousel = clickedImg.closest('.carousel-images');
    modalImgs = Array.from(carousel.querySelectorAll('img'));

    modalImages.innerHTML = '';
    modalImgs.forEach(img => {
      const clone = img.cloneNode();
      clone.removeAttribute('class');
      clone.classList.add('min-w-full', 'h-full', 'object-contain', 'flex-shrink-0');
      modalImages.appendChild(clone);
    });

    modalGaleria.classList.remove('hidden');

    modalCurrentIndex = modalImgs.indexOf(clickedImg);
    modalImages.style.transform = `translateX(-${modalCurrentIndex * 100}%)`;
  };

  window.closeModal = () => {
    modalGaleria.classList.add('hidden');
    modalImages.innerHTML = '';
    modalImgs = [];
    modalCurrentIndex = 0;
  };

  window.modalNext = () => {
    modalCurrentIndex = (modalCurrentIndex + 1) % modalImgs.length;
    modalImages.style.transform = `translateX(-${modalCurrentIndex * 100}%)`;
  };

  window.modalPrev = () => {
    modalCurrentIndex = (modalCurrentIndex - 1 + modalImgs.length) % modalImgs.length;
    modalImages.style.transform = `translateX(-${modalCurrentIndex * 100}%)`;
  };

  // SWIPE EN MODAL (GALERÍA)
  let startX = 0;
  let isSwiping = false;

  modalImagesContainer.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    isSwiping = true;
  });

  modalImagesContainer.addEventListener('touchmove', e => {
    if (!isSwiping) return;
    const deltaX = e.touches[0].clientX - startX;
    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) window.modalNext();
      else window.modalPrev();
      isSwiping = false;
    }
  });

  modalImagesContainer.addEventListener('touchend', () => {
    isSwiping = false;
  });

  // SWIPE EN CARRUSEL (GALERÍA)
  document.querySelectorAll('.carousel-images').forEach(container => {
    let startX = 0;
    let isSwiping = false;

    container.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isSwiping = true;
    });

    container.addEventListener('touchmove', (e) => {
      if (!isSwiping) return;
      const deltaX = e.touches[0].clientX - startX;
      if (Math.abs(deltaX) > 50) {
        moveSlide(container, deltaX < 0 ? 1 : -1);
        isSwiping = false;
      }
    });

    container.addEventListener('touchend', () => {
      isSwiping = false;
    });
  });

  // CARRITO
  const carrito = {};
  const carritoLista = document.getElementById('carrito-lista');
  const botonesAgregar = document.querySelectorAll('.agregar-carrito');
  const btnWhatsapp = document.getElementById('enviar-whatsapp');
  const carritoContenedor = document.getElementById('carrito-contenedor');
  const btnCerrar = document.getElementById('cerrar-carrito');
  const btnLimpiar = document.getElementById('limpiar-carrito');

  // Opcional: cargar carrito de localStorage
  
  if(localStorage.getItem('carrito')) {
    const saved = JSON.parse(localStorage.getItem('carrito'));
    Object.assign(carrito, saved);
    renderCarrito();
    carritoContenedor?.classList.remove('hidden');
  }
  

  botonesAgregar.forEach(btn => {
    btn.addEventListener('click', () => {
      const producto = btn.getAttribute('data-producto');
      carrito[producto] = (carrito[producto] || 0) + 1;
      renderCarrito();
      carritoContenedor?.classList.remove('hidden');
      // Guardar en localStorage
      localStorage.setItem('carrito', JSON.stringify(carrito));
    });
  });

  btnCerrar?.addEventListener('click', () => {
    carritoContenedor?.classList.add('hidden');
  });

  btnLimpiar?.addEventListener('click', () => {
    Object.keys(carrito).forEach(k => delete carrito[k]);
    renderCarrito();
     localStorage.removeItem('carrito');
  });

  function renderCarrito() {
    if (!carritoLista) return;
    carritoLista.innerHTML = '';
    Object.keys(carrito).forEach(producto => {
      const li = document.createElement('li');
      li.textContent = `${producto} x${carrito[producto]}`;
      carritoLista.appendChild(li);
    });
  }

  btnWhatsapp?.addEventListener('click', () => {
    const productos = Object.keys(carrito);
    if (productos.length === 0) {
      alert('El carrito está vacío.');
      return;
    }
    const mensaje = encodeURIComponent(
      '¡Hola! Quiero pedir:\n' + productos.map(p => `- ${p} x${carrito[p]}`).join('\n')
    );
    window.open(`https://wa.me/5491167081404?text=${mensaje}`, '_blank');
  });

  // TIENDA - MODAL DE IMAGEN (separado del modal de galería)
  const imagenes = document.querySelectorAll('#tienda img');
  const modalTienda = document.getElementById('modal-imagen');
  const imagenModal = document.getElementById('imagen-modal');
  const cerrarModal = document.getElementById('cerrar-modal');

  imagenes.forEach(imagen => {
    imagen.addEventListener('click', () => {
      imagenModal.src = imagen.src;
      modalTienda.classList.remove('hidden');
    });
  });

  cerrarModal?.addEventListener('click', () => {
    modalTienda.classList.add('hidden');
    imagenModal.src = '';
  });

  modalTienda?.addEventListener('click', (e) => {
    if (e.target === modalTienda) {
      modalTienda.classList.add('hidden');
      imagenModal.src = '';
    }
  });
  
});


