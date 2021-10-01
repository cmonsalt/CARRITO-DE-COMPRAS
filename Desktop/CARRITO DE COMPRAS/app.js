document.addEventListener(`DOMContentLoaded`, () => {
  fetchData(); // Espera que se cargue todo el doc HTLM y ejecuta la funcion fetchData
});
const fetchData = async () => {
  try {
    const res = await fetch(`api.json`);
    const data = await res.json();
    pintarProductos(data);
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

    const clone = template.cloneNode(true);
    fragment.appendChild(clone);
  });
  contenedorProductos.appendChild(fragment);
};
