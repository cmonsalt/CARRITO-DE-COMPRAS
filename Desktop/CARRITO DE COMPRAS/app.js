document.addEventListener(`DOMContentLoaded`, () => {
  fetchData(); // Espera que se cargue todo el doc HTLM y ejecuta la funcion fetchData
  // if (localStorage.getItem(`carrito`)) {
  //   carrito = JSON.parse(localStorage.getItem(`carrito`));
  //   pintarCarrito();
  // }
});
const fetchData = async () => {
  try {
    const res = await fetch(`api.json`);
    const data = await res.json();
    pintarProductos(data);
    detectarBotones(data);
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

// Se crea objeto carrito y se realiza funcionalidad para que se agregen los productos al carrito
let carrito = {};
const detectarBotones = (data) => {
  const botones = document.querySelectorAll(`.card button`); //Detectar los Botones Comprar
  botones.forEach((btn) => {
    btn.addEventListener(`click`, () => {
      const producto = data.find(
        (item) => item.id === parseInt(btn.dataset.id) //Buscamos en la data el objeto que contiene el boton que se preciono y se agrega a la variable producto
      );
      //Se agregan los productos al carrito si tienen stock suficiente
      producto.cantidad = 1;
      if (producto.stock <= 0) {
        swal(
          "Oops!",
          "No contamos con mas unidades de este producto!",
          "error"
        );
      }
      if (producto.stock > 0) {
        carrito[producto.id] = { ...producto };
        pintarCarrito();
      }
    });
  });
};

//Pinta el carrito
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

    //Botenes de incremento y decremento
    template.querySelector(`.btn-info`).dataset.id = producto.id;
    template.querySelector(`.btn-primary`).dataset.id = producto.id;
    const clone = template.cloneNode(true);
    fragment.appendChild(clone);
  });
  nombreProductos.appendChild(fragment);

  pintarFooterCar();
  accionBotones();
  console.log(carrito);
  // localStorage.setItem(`carrito`, JSON.stringify(carrito));
};

//Pintar el footer del carrito
const footerCar = document.querySelector(`#footer-car`);
const pintarFooterCar = () => {
  footerCar.innerHTML = ``;
  const template = document.querySelector(`#template-footer`).content;
  const fragment = document.createDocumentFragment();
  const cantidadTotal = Object.values(carrito).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  ); // calcula la cantidad total de todos los producto presentes en el carrito

  const precioTotal = Object.values(carrito).reduce(
    (acc, { cantidad, unit_price }) => acc + cantidad * unit_price,
    0
  ); //Calcula el precio Total de todos los productos presentes en el carrito
  //Pinta el footer del carrito
  template.querySelectorAll(`td`)[0].textContent = cantidadTotal;
  template.querySelector(`span`).textContent = precioTotal;
  const clone = template.cloneNode(true);
  fragment.appendChild(clone);
  footerCar.appendChild(fragment);

  const boton = document.querySelector(`#vaciar-carrito`);
  boton.addEventListener(`click`, () => {
    carrito = {};
    pintarCarrito();
  });

  if (Object.keys(carrito).length === 0) {
    footerCar.innerHTML = `<th scope="row" colspan="4">Carrito vacío</th>`;
    return;
  }
};

const accionBotones = () => {
  botonAumentar = document.querySelectorAll(`#nombreProductos .btn-info`);
  botonDisminuir = document.querySelectorAll(`#nombreProductos .btn-primary`);
  botonAumentar.forEach((btn) => {
    btn.addEventListener(`click`, () => {
      const producto = carrito[btn.dataset.id];
      producto.stock = carrito[producto.id].stock - 1;
      if (producto.stock <= 0) {
        swal(
          "Oops!",
          "No contamos con mas unidades de este producto!",
          "error"
        );
      }
      if (producto.stock > 0) {
        producto.cantidad = carrito[producto.id].cantidad + 1;
        carrito[btn.dataset.id] = { ...producto };
      }
      pintarCarrito();
    });
  });
  botonDisminuir.forEach((btn) => {
    btn.addEventListener(`click`, () => {});
  });
};
