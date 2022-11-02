const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";
let cartProductsArray = [];


const getProdUrl = (idCat) => PRODUCTS_URL+idCat+EXT_TYPE;
const getProdInfoUrl = (idProd) => PRODUCT_INFO_URL+idProd+EXT_TYPE;
const getProdComments = (idProd) => PRODUCT_INFO_COMMENTS_URL+idProd+EXT_TYPE;
const getCartUrl = (idUser) => CART_INFO_URL+idUser+EXT_TYPE;

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

document.getElementById("usuario").innerHTML = (localStorage.getItem("user"));

function cerrarSesion () {
  localStorage.removeItem("user");
  window.location = "index.html";
}

document.addEventListener('DOMContentLoaded', () => {
  user = localStorage.getItem("user");
  if (!user) {
      window.location = "index.html";
  }
});

//AGREGAR AL CARRITO
function addToCartProductsArray(id, imagen, nombre, currency, costo) { 
  let currentObj = {id, imagen, nombre, currency, costo};
  cartProductsArray = JSON.parse(localStorage.getItem("cartProductsArray")); 
  if (!cartProductsArray) { cartProductsArray = [currentObj];
  } else if (cartProductsArray.some(e => e.id === id)) { alert("este producto ya está en el carrito");
  } else {cartProductsArray.push(currentObj);
  alert(nombre+" ha sido añadido al carrito")}
  localStorage.setItem("cartProductsArray", JSON.stringify(cartProductsArray));
}
