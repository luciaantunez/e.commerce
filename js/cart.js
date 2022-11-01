let defaultCartUrl = getCartUrl(25801);
let defaultProduct = document.getElementById("rowProduct");
let tbody = document.getElementById("tbody");

let subtotalGeneral = document.getElementById("subtotal-general");
let costoDeEnvio = document.getElementById("costo-de-envio");
let envioPremium = document.getElementById("premium");
let envioExpress = document.getElementById("express");
let envioStandard = document.getElementById("standard");
let total = document.getElementById("total");

let numero = document.getElementById("numero");

let cardNumber = document.getElementById("card-number");
let securityCode = document.getElementById("security-code");
let expiration = document.getElementById("expiration");
let accountNumber = document.getElementById("account-number");

let tarjeta = document.getElementById("tarjeta");
let transferencia = document.getElementById("transferencia");
let metodoDePago = document.getElementById("metodo-de-pago");
let alertaMtdPago = document.getElementById("metodo-de-pago-alert");

let successAlert = document.getElementById("cartel");
let btnFinalizarCompra = document.getElementById("btn-finalizar-compra");

document.addEventListener("DOMContentLoaded", function (e) {
  defaultCartObj = JSON.parse(localStorage.getItem("defaultCartObj"));
  if (!defaultCartObj) {
    getJSONData(defaultCartUrl).then((result) => {
      if (result.status === "ok") {
        let defaultCartObj = {
          id: result.data.articles[0].id,
          imagen: result.data.articles[0].image,
          nombre: result.data.articles[0].name,
          currency: result.data.articles[0].currency,
          costo: result.data.articles[0].unitCost,
        };
        localStorage.setItem("defaultCartObj", JSON.stringify(defaultCartObj));
        initializeCart(defaultCartObj);
        calcSubtotalGeneral();
      }
    });
  } else {
    initializeCart();
    calcSubtotalGeneral();
  }
});

function initializeCart() {
  defaultCartObj = JSON.parse(localStorage.getItem("defaultCartObj"));
  cartProductsArray = JSON.parse(localStorage.getItem("cartProductsArray"));
  if (!cartProductsArray) {
    cartProductsArray = [defaultCartObj];
  } else if (!cartProductsArray.some((e) => e.id === 50924)) {
    cartProductsArray.unshift(defaultCartObj);
  }
    localStorage.setItem("cartProductsArray", JSON.stringify(cartProductsArray));
    showArticles(cartProductsArray);
}

function showArticles(cartProductsArray) {
  if (cartProductsArray) {
    cartProductsArray.forEach((element, index) => {
      let cost = element.costo;
      if (element.currency === "UYU") {
        cost = (element.costo * 0.025).toFixed(2);
        //cost = Math.round(element.costo * 0.025);
      }
      tbody.innerHTML += `
                <tr class="trcart">
                    <td><img src="${element.imagen}" alt="" style="width:5rem"></td>
                    <td>${element.nombre}</td>
                    <td>$USD<span class="unitCost">${cost}</span></td>
                    <td><input type="number" class="cantidadArticulos" min="0" value=1 oninput="calcSubtotal(${cost},${index})" /></td>
                    <td>$USD<span class="subtotal"> ${cost}</span></td>
                    <td><button class="btn" onclick="borrarElem(${index})"><i class="fa fa-trash"></i></button></td>
                </tr>
            `;
    });
  }
}

function calcSubtotal(costo, index) {
  let cantidadArticulos = document.getElementsByClassName("cantidadArticulos")[index].value;
  let subtotal = document.getElementsByClassName("subtotal")[index];
  subt = cantidadArticulos * costo;
  subtotal.innerHTML = ` ${subt}`;
  calcSubtotalGeneral();
}

function calcSubtotalGeneral() {
  let subtotalGral = document.getElementsByClassName("subtotal");
  let subtotalArray = [];
  for (let i = 0; i < subtotalGral.length; i++) {
    isubt = parseInt(subtotalGral[i].textContent);
    subtotalArray.push(isubt);
  }
  let subtotal = subtotalArray.reduce((a, b) => a + b, 0);
  subtotalGeneral.innerText = `$USD ${subtotal}`;
  calcCostoEnvio();
  calcTotal();
}

function calcCostoEnvio() {
  let subt = document.getElementById("subtotal-general");
  let subtotal = parseInt(subt.innerText.replace(/[^0-9]+/g, ""));
  let standardPercent = subtotal * (5 / 100);
  let expressPercent = subtotal * (7 / 100);
  let premiumPercent = subtotal * (15 / 100);
  if (envioPremium.checked) {
    costoDeEnvio.innerText = `$USD ${Math.round(premiumPercent)}`;
  } else if (envioExpress.checked) {
    costoDeEnvio.innerText = `$USD ${Math.round(expressPercent)}`;
  } else if (envioStandard.checked) {
    costoDeEnvio.innerText = `$USD ${Math.round(standardPercent)}`;
  } else {
    costoDeEnvio.innerHTML = `<p class="text-danger" style="font-size: 0.9rem;">seleccione un tipo de envío</p>`;
  }
  calcTotal();
}

function calcTotal() {
  let subt = document.getElementById("subtotal-general");
  let subtotal = parseInt(subt.innerText.replace(/[^0-9]+/g, ""));
  let envio = document.getElementById("costo-de-envio");
  if (envio.innerText == "seleccione un tipo de envío") {
    total.innerText = `$USD ${subtotal}`;
  } else {
    let costoEnvio = parseInt(envio.innerText.replace(/[^0-9]+/g, ""));
    let calcTotal = costoEnvio + subtotal;
    total.innerText = `$USD ${Math.round(calcTotal)}`;
  }
}

function modal() {
  if (tarjeta.checked) {
    accountNumber.disabled = true;
    cardNumber.disabled = false;
    securityCode.disabled = false;
    expiration.disabled = false;
    metodoDePago.innerText = "Tarjeta de Crédito  ";
    alertaMtdPago.innerHTML = "";
  } else if (transferencia.checked) {
    cardNumber.disabled = true;
    securityCode.disabled = true;
    expiration.disabled = true;
    accountNumber.disabled = false;
    metodoDePago.innerText = "Transferencia bancaria  ";
    alertaMtdPago.innerHTML = "";
  }
}

btnFinalizarCompra.addEventListener("click", () => {
  let cantidadArticulos = document.getElementsByClassName("cantidadArticulos");
  let calle = document.getElementById("calle");
  let numero = document.getElementById("numero");
  let esquina = document.getElementById("esquina");
  let htmlContentToAppend = `<div class="alert alert-success alert-dismissible">
                                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                                <p>Has comprado con éxito!</p>
                             </div>`;
  //CARTELES VALIDACIÓN INDIVIDUALES
  !calle.value
    ? calle.classList.add("is-invalid")
    : calle.classList.remove("is-invalid");
  !numero.value
    ? numero.classList.add("is-invalid")
    : numero.classList.remove("is-invalid");
  !esquina.value
    ? esquina.classList.add("is-invalid")
    : esquina.classList.remove("is-invalid");

  tarjeta.checked || transferencia.checked
    ? (alertaMtdPago.innerText = "")
    : (alertaMtdPago.innerText = "Debe seleccionar un método de pago");

  // VALIDACIÓN GENERAL
  let arrCantidadArticulos = [];
  for (let i=0; i<cantidadArticulos.length; i++) {
    const element = parseInt(cantidadArticulos[i].value);
    arrCantidadArticulos.push(element);
  }
  let e = arrCantidadArticulos.some((elem) => elem <= 0);
  if (
    e == false &&
    calle.value &&
    numero.value &&
    esquina.value &&
    (envioPremium.checked || envioExpress.checked || envioStandard.checked)
  ) {
    if (
      tarjeta.checked &&
      (cardNumber.value.length = 12) &&
      (securityCode.value.length = 3) &&
      expiration.value.length > 4
    ) {
      successAlert.innerHTML = htmlContentToAppend;
    } else if (transferencia.checked && accountNumber.value.length > 4) {
      successAlert.innerHTML = htmlContentToAppend;
    }
  }
});

function borrarElem(index) {
    cartProductsArray = JSON.parse(localStorage.getItem("cartProductsArray"));
    cartProductsArray.splice(index , 1);
    localStorage.setItem("cartProductsArray", JSON.stringify(cartProductsArray));
    tbody.innerHTML = "";
    showArticles(cartProductsArray);
}

cardNumber.onkeydown = function(e){
  if (e.key == 'Backspace') return true;// Permitir la tecla para borrar
	if (e.key == 'ArrowLeft') return true;// Permitir flecha izquierda
	if (e.key == 'ArrowRight') return true;// Permitir flecha derecha
	if (e.key == ' ') return false;// Bloquear tecla de espacio
	if (isNaN(e.key)) return false;// Bloquear tecla si no es un numero

    if (cardNumber.value.length > 13) {
    cardNumber.value = cardNumber.value.slice(0,13)};//no permitir más 14 caracteres (contando espacios)

    cardNumber.value = cardNumber.value
        .replace(/\s/g, '')// Borrar todos los espacios
        .replace(/([0-9]{4})/g, '$1 ')// Agregar un espacio cada cuatro numeros
        .trim();// Borrar espacio al final
};
securityCode.onkeydown = function(e){
  if (e.key == 'Backspace') return true;// Permitir la tecla para borrar
	if (e.key == 'ArrowLeft') return true;// Permitir flecha izquierda
	if (e.key == 'ArrowRight') return true;// Permitir flecha derecha
	if (e.key == ' ') return false;// Bloquear tecla de espacio
	if (isNaN(e.key)) return false;// Bloquear tecla si no es un numero
    if (securityCode.value.length > 2) {
    securityCode.value = securityCode.value.slice(0,2)};//no permitir más de 3 caracteres
};
expiration.onkeydown = function(e){
    if (e.key == 'Backspace') return true;// Permitir la tecla para borrar
	if (e.key == 'ArrowLeft') return true;// Permitir flecha izquierda
	if (e.key == 'ArrowRight') return true;// Permitir flecha derecha
	if (e.key == ' ') return false;// Bloquear tecla de espacio
	if (isNaN(e.key)) return false;// Bloquear tecla si no es un numero
    if (expiration.value.length > 4) {
        expiration.value = expiration.value.slice(0,4)//no permitir más de 5 caracteres
    };
    if (expiration.value.length == 2) {
        expiration.value = expiration.value
            .replace(/\s/g, "/")// Borrar todos los /
            .replace(/([0-9]{2})/g, '$1/')// Agregar un / cada dos numeros
    };
};
accountNumber.onkeydown = function(e){
    if (e.key == 'Backspace') return true;// Permitir la tecla para borrar
	if (e.key == 'ArrowLeft') return true;// Permitir flecha izquierda
	if (e.key == 'ArrowRight') return true;// Permitir flecha derecha
	if (e.key == ' ') return false;// Bloquear tecla de espacio
	if (isNaN(e.key)) return false;// Bloquear tecla si no es un numero
    if (accountNumber.value.length > 9) {
        accountNumber.value = accountNumber.value.slice(0,9)};//no permitir más de 10 caracteres
};
numero.onkeydown = function(e){
    if (e.key == 'Backspace') return true;// Permitir la tecla para borrar
	if (e.key == 'ArrowLeft') return true;// Permitir flecha izquierda
	if (e.key == 'ArrowRight') return true;// Permitir flecha derecha
	if (e.key == ' ') return false;// Bloquear tecla de espacio
	if (isNaN(e.key)) return false;// Bloquear tecla si no es un numero
    if (numero.value.length > 4) {
        numero.value = numero.value.slice(0,4)};//no permitir más de 5 caracteres
};

/* 
function controls(e){
  if (e.key == 'Backspace') return true;// Permitir la tecla para borrar
	if (e.key == 'ArrowLeft') return true;// Permitir flecha izquierda
	if (e.key == 'ArrowRight') return true;// Permitir flecha derecha
	if (e.key == ' ') return false;// Bloquear tecla de espacio
	if (isNaN(e.key)) return false;// Bloquear tecla si no es un numero
};
cardNumber.addEventListener("keydown", (e) => {
  controls(e);
  if (cardNumber.value.length > 13) {
    cardNumber.value = cardNumber.value.slice(0,13)};//no permitir más 14 caracteres (contando espacios)

    cardNumber.value = cardNumber.value
        .replace(/\s/g, '')// Borrar todos los espacios
        .replace(/([0-9]{4})/g, '$1 ')// Agregar un espacio cada cuatro numeros
        .trim();// Borrar espacio al final
});
securityCode.addEventListener("keydown", (e) => {
  controls(e);
  if (securityCode.value.length > 2) {
    securityCode.value = securityCode.value.slice(0,2)};//no permitir más de 3 caracteres
});
expiration.addEventListener("keydown", (e) => {
  controls(e);
  if (expiration.value.length > 4) {
    expiration.value = expiration.value.slice(0,4)//no permitir más de 5 caracteres
};
if (expiration.value.length == 2) {
    expiration.value = expiration.value
        .replace(/\s/g, "/")// Borrar todos los /
        .replace(/([0-9]{2})/g, '$1/')// Agregar un / cada dos numeros
};
});
accountNumber.addEventListener("keydown", (e) => {
  controls(e);
  if (accountNumber.value.length > 9) {
    accountNumber.value = accountNumber.value.slice(0,9)};//no permitir más de 10 caracteres
});
numero.addEventListener("keydown", (e) => {
  controls(e);
  if (numero.value.length > 4) {
    numero.value = numero.value.slice(0,4)};//no permitir más de 5 caracteres
});
 */