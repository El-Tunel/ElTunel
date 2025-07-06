// =======================
// BASE DE DATOS DE PLATOS
// =======================
let products = JSON.parse(localStorage.getItem("products")) || [
  {
    id: "ropa-vieja",
    nombre: "Ropa Vieja",
    desc: "Con arroz moro y plátanos maduros",
    precio: 350,
    img: "img/ropa-vieja.jpg"
  },
  {
    id: "tostones",
    nombre: "Tostones con Mojo",
    desc: "Crujientes y sabrosos",
    precio: 150,
    img: "img/tostones.jpg"
  },
  {
    id: "langostinos",
    nombre: "Langostinos en Kataifi",
    desc: "Con emulsión de mango y ají cachucha",
    precio: 480,
    img: "img/langostinos.jpg"
  },
  {
    id: "flan-coco",
    nombre: "Flan de Coco",
    desc: "Con caramelo de ron y ralladura de limón",
    precio: 120,
    img: "img/flan-coco.jpg"
  }
];

// =======================
// RENDERIZAR MENÚ EN index.html
// =======================
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

  localStorage.setItem("products", JSON.stringify(products));
}

renderMenu();

// =======================
// DETALLE DEL PLATO EN plato.html
// =======================
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function mostrarPlato() {
  const id = getQueryParam("id");
  const plato = products.find(p => p.id === id);

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

// =======================
// PANEL DE ADMINISTRACIÓN
// =======================
const adminToggle = document.getElementById("admin-toggle");
if (adminToggle) {
  adminToggle.addEventListener("click", () => {
    const panel = document.getElementById("admin-panel");
    panel.style.display = panel.style.display === "none" ? "block" : "none";
    renderDeleteList();
  });
}

function addNewProduct() {
  const nombre = document.getElementById("new-name").value;
  const desc = document.getElementById("new-desc").value;
  const precio = parseInt(document.getElementById("new-price").value);
  const img = document.getElementById("new-img").value;

  if (!nombre || !desc || !precio || !img) {
    alert("Completa todos los campos.");
    return;
  }

  const id = nombre.toLowerCase().replace(/\s+/g, "-");
  products.push({ id, nombre, desc, precio, img });
  localStorage.setItem("products", JSON.stringify(products));
  renderMenu();
  renderDeleteList();

  // Limpiar campos
  document.getElementById("new-name").value = "";
  document.getElementById("new-desc").value = "";
  document.getElementById("new-price").value = "";
  document.getElementById("new-img").value = "";
}

function renderDeleteList() {
  const list = document.getElementById("delete-list");
  if (!list) return;

  list.innerHTML = "";
  products.forEach((p, index) => {
    const li = document.createElement("li");
    li.textContent = p.nombre;
    const btn = document.createElement("button");
    btn.textContent = "Eliminar";
    btn.onclick = () => {
      products.splice(index, 1);
      localStorage.setItem("products", JSON.stringify(products));
      renderMenu();
      renderDeleteList();
    };
    li.appendChild(btn);
    list.appendChild(li);
  });
}

// =======================
// CÓDIGO DE ACCESO SECRETO
// =======================
function verificarCodigo() {
  const input = document.getElementById("admin-code").value;
  const correcto = "Eltunel2025"; // Cambia esto por tu código secreto

  if (input === correcto) {
    document.getElementById("admin-toggle").style.display = "block";
    document.getElementById("unlock-panel").style.display = "none";
    alert("Acceso concedido");
  } else {
    alert("Código incorrecto");
  }
}