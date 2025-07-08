document.addEventListener('DOMContentLoaded', function () {
  // Slider
// Slider
const slider = document.querySelector('#slider > div');
if (slider) {
  const slides = slider.children.length;
  let index = 0;

  const nextBtn = document.getElementById('next');
  const prevBtn = document.getElementById('prev');

  const showSlide = () => {
    slider.style.transform = `translateX(-${index * 100}%)`;
  };

  if (nextBtn) {
    nextBtn.onclick = () => {
      index = (index + 1) % slides;
      showSlide();
    };
  }

  if (prevBtn) {
    prevBtn.onclick = () => {
      index = (index - 1 + slides) % slides;
      showSlide();
    };
  }

  // Autoplay
  let autoplay = setInterval(() => {
    index = (index + 1) % slides;
    showSlide();
  }, 4000);

  // Pausar al pasar el mouse
  const sliderContainer = document.querySelector('#slider');
  sliderContainer.addEventListener('mouseenter', () => {
    clearInterval(autoplay);
  });

  //  Reanudar al salir del mouse
  sliderContainer.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => {
      index = (index + 1) % slides;
      showSlide();
    }, 4000);
  });
}


  

  // Navbar transparencia y menú hamburguesa
  const navbar = document.getElementById('main-navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      navLinks.classList.toggle('hidden');
    });
  }

  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY === 0) {
        navbar.classList.remove('transparent');
      }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', function () {
        navbar.classList.add('transparent');
        if (window.innerWidth < 768 && navLinks) {
          navLinks.classList.add('hidden');
        }
      });
    });
  }

  // Carrito
  const carrito = {};
  const carritoLista = document.getElementById('carrito-lista');
  const botonesAgregar = document.querySelectorAll('.agregar-carrito');
  const btnWhatsapp = document.getElementById('enviar-whatsapp');
  const carritoContenedor = document.getElementById('carrito-contenedor');
  const btnCerrar = document.getElementById('cerrar-carrito');
  const btnLimpiar = document.getElementById('limpiar-carrito');

  botonesAgregar.forEach(btn => {
    btn.addEventListener('click', () => {
      const producto = btn.getAttribute('data-producto');
      if (carrito[producto]) {
        carrito[producto]++;
      } else {
        carrito[producto] = 1;
      }
      renderCarrito();
      carritoContenedor?.classList.remove('hidden');
    });
  });

  btnCerrar?.addEventListener('click', () => {
    carritoContenedor?.classList.add('hidden');
  });

  btnLimpiar?.addEventListener('click', () => {
    for (let key in carrito) {
      delete carrito[key];
    }
    renderCarrito();
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
      '¡Hola! Quiero pedir:\n' +
      productos.map(p => `- ${p} x${carrito[p]}`).join('\n')
    );
    window.open(`https://wa.me/5491136204786?text=${mensaje}`, '_blank');
  });
  
});

document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.getElementById('main-navbar');
    const navLinks = document.querySelectorAll('#nav-links a');

    // Al hacer clic en un link tipo "#"
    navLinks.forEach(link => {
      link.addEventListener('click', function () {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
          navbar.classList.remove('navbar-original');
          navbar.classList.add('navbar-faded');
        }
      });
    });

    // Solo volver al original si el scroll está arriba de todo
    window.addEventListener('scroll', function () {
      if (window.scrollY <= 10) {
        navbar.classList.remove('navbar-faded');
        navbar.classList.add('navbar-original');
      }
    });
  });

// Modal para mostrar imagen
const imagenes = document.querySelectorAll('#tienda img');
  const modal = document.getElementById('modal-imagen');
  const imagenModal = document.getElementById('imagen-modal');
  const cerrarModal = document.getElementById('cerrar-modal');

  imagenes.forEach(imagen => {
    imagen.addEventListener('click', () => {
      imagenModal.src = imagen.src;
      modal.classList.remove('hidden');
    });
  });

  cerrarModal.addEventListener('click', () => {
    modal.classList.add('hidden');
    imagenModal.src = '';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      imagenModal.src = '';
    }
  });