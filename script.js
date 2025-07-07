let products = [];

// =======================
// CARGAR MENÚ DESDE menu.json
// =======================
async function cargarMenu() {
  try {
    const res = await fetch("menu.json");
    products = await res.json();
    renderMenu();
  } catch (error) {
    console.error("Error al cargar el menú:", error);
  }
}

function renderMenu() {
  const menu = document.querySelector(".menu-container");
  if (!menu) return;

  menu.innerHTML = "";
  products.forEach(p => {
    const a = document.createElement("a");
    a.className = "dish";
    a.href = `plato.html?id=${p.id}`;
    a.innerHTML = `
      <img src="${p.img}" alt="${p.nombre}">
      <div class="dish-name">${p.nombre}</div>
      <div>${p.desc}</div>
      <div class="price">$${p.precio} CUP</div>
    `;
    menu.appendChild(a);
  });
}

// Ejecutar solo en index.html
if (window.location.pathname.includes("index.html") || window.location.pathname === "/" || window.location.pathname === "/index.html") {
  cargarMenu();
}

// =======================
// DETALLE DEL PLATO EN plato.html
// =======================
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

async function mostrarPlato() {
  const id = getQueryParam("id");
  try {
    const res = await fetch("menu.json");
    const data = await res.json();
    const plato = data.find(p => p.id === id);

    if (!plato) {
      document.body.innerHTML = "<p style='text-align:center;'>Plato no encontrado.</p>";
      return;
    }

    document.getElementById("plato-img").src = plato.img;
    document.getElementById("plato-img").alt = plato.nombre;
    document.getElementById("plato-nombre").textContent = plato.nombre;
    document.getElementById("plato-desc").textContent = plato.desc;
    document.getElementById("plato-precio").textContent = `$${plato.precio} CUP`;

    window.platoActual = { id, ...plato };
  } catch (error) {
    console.error("Error al cargar el plato:", error);
  }
}

function agregarAlCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.push(window.platoActual);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert(`${window.platoActual.nombre} agregado al carrito`);
}

if (window.location.pathname.includes("plato.html")) {
  mostrarPlato();
}

// =======================
// CARRITO EN carrito.html
// =======================
if (window.location.pathname.includes("carrito.html")) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const lista = document.getElementById("lista-carrito");
  const total = document.getElementById("total-carrito");

  function renderCarrito() {
    lista.innerHTML = "";
    let suma = 0;

    carrito.forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${item.nombre} - $${item.precio} CUP
        <button onclick="eliminarDelCarrito(${index})" class="eliminar-btn">❌</button>
      `;
      lista.appendChild(li);
      suma += item.precio;
    });

    total.textContent = `Total: ${suma} CUP`;
  }

  window.eliminarDelCarrito = function(index) {
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCarrito();
  };

  window.enviarSMS = function() {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    let mensaje = "Hola, quiero pedir:\n";
    let total = 0;

    carrito.forEach(item => {
      mensaje += `- ${item.nombre} - $${item.precio} CUP\n`;
      total += item.precio;
    });

    mensaje += `Total: $${total} CUP`;

    const smsLink = `sms:+5359279157?body=${encodeURIComponent(mensaje)}`;
    window.location.href = smsLink;
  };

  renderCarrito();
}