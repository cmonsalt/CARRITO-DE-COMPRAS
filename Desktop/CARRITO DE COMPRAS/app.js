document.addEventListener(`DOMContentLoaded`, () => {
  fetchData(); // Espera que se cargue todo el doc HTLM y ejecuta la funcion fetchData
});
const fetchData = async () => {
  try {
    const res = await fetch(`api.json`);
    const data = await res.json();
    pintarProductos(data);
    detectarBotones(data);
    // console.log(data);
  } catch (error) {
    console.log(error);
  }
};

//Pinta las cards en el contenedor-productos
const contenedorProductos = document.querySelector(`#contenedor-productos`);
const pintarProductos = (data) => {
  const template = document.querySelector(`#template-productos`).content;
  const fragment = document.createDocumentFragment();
  data.forEach((producto) => {
    template.querySelector(`img`).setAttribute(`src`, producto.image);
    template.querySelector(`h5`).textContent = producto.name;
    template.querySelector(`span`).textContent = producto.unit_price;
    template.querySelector(`button`).dataset.id = producto.id;

    const clone = template.cloneNode(true);
    fragment.appendChild(clone);
  });
  contenedorProductos.appendChild(fragment);
};

let carrito = {};
const detectarBotones = (data) => {
  const botones = document.querySelectorAll(`.card button`); //Detectar los Botones Comprar
  botones.forEach((btn) => {
    btn.addEventListener(`click`, () => {
      const producto = data.find(
        (item) => item.id === parseInt(btn.dataset.id)
      );
      producto.cantidad = 1;
      if (producto.stock === 0) {
        swal(
          "Oops!",
          "No contamos con mas Unidades de este producto!",
          "error"
        );
      }

      if (producto.stock > 0) {
        if (carrito.hasOwnProperty(producto.id)) {
          producto.cantidad = carrito[producto.id].cantidad + 1;
        }
        carrito[producto.id] = { ...producto };
        producto.stock = carrito[producto.id].stock - 1;
      }

      console.log(carrito);
      pintarCarrito();
    });
  });
};

//Pintar carrito
const nombreProductos = document.querySelector(`#nombreProductos`);
const pintarCarrito = () => {
  nombreProductos.innerHTML = ``;
  const template = document.querySelector(`#template-carrito`).content;
  const fragment = document.createDocumentFragment();
  Object.values(carrito).forEach((producto) => {
    template.querySelector(`th`).textContent = producto.name;
    template.querySelectorAll(`td`)[0].textContent = producto.cantidad;
    template.querySelector(`span`).textContent =
      producto.unit_price * producto.cantidad;

    const clone = template.cloneNode(true);
    fragment.appendChild(clone);
  });
  nombreProductos.appendChild(fragment);
};
