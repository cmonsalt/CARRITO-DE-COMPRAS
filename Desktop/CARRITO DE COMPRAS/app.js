document.addEventListener(`DOMContentLoaded` , () =>{ 
    fetchData()// Espera que se cargue todo el doc HTLM y ejecuta la funcion fetchData
})
const fetchData = async () => {
  try {
    const res = await fetch(`api.json`)
    const data = await res.json( )
    console.log(data)
  } catch (error) {
    console.log(error)
  }
}

