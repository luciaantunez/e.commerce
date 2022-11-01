const container = document.getElementById("container");
const container2 = document.getElementById("container2");
const container3 = document.getElementById("container3");
const container4 = document.getElementById("container4");
let prodID = localStorage.getItem("prodID");
let prodUrl = getProdInfoUrl(prodID);
let prodCommentsUrl = getProdComments(prodID);
let productsInfoArray = [];
let productCommentsArray = [];

//de addComment
const sendButton = document.getElementById("send");
const newComment = document.getElementById("userOpinion");
const stars = document.getElementById("userPoints");
let user = localStorage.getItem("user");
let newCommentsList = [];

let date = new Date();
year = date.getFullYear();
month = date.getMonth() + 1; //el +1 va porque por alguna razón te devuelve el mes anterior
day = date.getDate();
hour = date.getHours();
minutes = date.getMinutes();
seconds = date.getSeconds();

function setProdID(id) {
  localStorage.setItem("prodID", id);
  window.location = "product-info.html"
}

function showProductInfo(productsInfoArray) {
    let htmlContentToAppend = "";
    let htmlRelatedProducts = "";
    for (let i = 0; i < productsInfoArray.length; i++) {
    let product = productsInfoArray[i];
    htmlContentToAppend += `
            <button type="submit" class="btn-success" style="border-radius: 10%; float: right; padding: 5px; margin-top: 1.5em;" 
            onclick="addToCartProductsArray('${product.id}','${product.images[0]}','${product.name}','${product.currency}','${product.cost}')" > 
            Comprar</button>    
            <div id="${product.id}" class="row" style="font-size:.8rem">
                <h2 class="p-4" style="border-bottom: 1px solid rgba(0, 0, 0, .125)">${product.name}</h2>
                <b>Precio:</b>
                <p>${product.currency} ${product.cost}</p>
                <b>Descripción:</b>
                <p>${product.description}</p>
                <b>Categoría:</b>
                <p>${product.category}</p>
                <b>Cantidad de vendidos:</b>
                <p>${product.soldCount}</p>
                <b>Imágenes ilustrativas:</b>
                <br>
            </div>
            
            
            <div id="carouselControls" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-inner"> 
                <div class="carousel-item active">
                  <img src="${product.images[i]}" class="d-block w-100">
                </div>
        `;
    // IMÁGENES SIN CARRUSEL:    
    /* for (let j = 0; j < product.images.length; j++) {
        htmlContentToAppend += `
            <img class="img-thumbnail" src="${product.images[j]}" style="width: 230px; margin-top: 0.5rem;
            margin-bottom: 2rem">
        `;
    } */
    
    for (let j = 1; j < product.images.length; j++) {
      htmlContentToAppend += `
        <div class="carousel-item">
          <img src="${product.images[j]}" class="d-block w-100">
        </div>
      `;
      }
    htmlContentToAppend += `
      </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselControls" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselControls" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>`;  

    // PRODUCTOS RELACIONADOS:
    for (let k = 0; k < product.relatedProducts.length; k++) {
    let related = product.relatedProducts[k];
    htmlRelatedProducts += `    
                <div onclick="setProdID(${related.id})"class="relatedProd img-thumbnail" style="width: 230px; margin-top: 0.5rem; margin-bottom: 2rem">
                  <img class="card-img-top" src="${related.image}"> 
                  <br>
                  <span style="font-size:.8rem" >${related.name}</span>
                </div>
        `;
    }
}
  container.innerHTML += htmlContentToAppend;
  container4.innerHTML += ` <div style="border-top: 1px solid rgba(0, 0, 0, .125)"></div><br>
  <p>Productos Relacionados:</p>`
    + `<div class="row" style="margin-left: 0px" >` + htmlRelatedProducts +`</div>`;
}

function showProductComments(productCommentsArray) {
  let htmlContentToAppend = "";
  for (let i = 0; i < productCommentsArray.length; i++) {
    let comment = productCommentsArray[i];
    let score = parseInt(comment.score);
    let contador = 0;
    let max = 5;

    htmlContentToAppend += `   
            <div class="card" style="font-size:.8rem; margin-bottom:1em; margin-top:1em">
                <span style="margin-left:.5em; margin-top:.3em"> 
                    <b>${comment.user}</b> - ${comment.dateTime}
        `;
    while (contador < score) {
      htmlContentToAppend += '<span class="fa fa-star checked"></span>';
      contador++;
    }
    while (max > score) {
      htmlContentToAppend += '<span class="fa fa-star-o"></span>';
      max--;
    }
    htmlContentToAppend += ` 
                </span>
                <span style="margin-left:.5em; margin-bottom:.3em">${comment.description}</span>               
            </div>
        `;
  }
  container2.innerHTML += `<h5>Comentarios</h5>` + htmlContentToAppend;
}

document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(prodUrl).then(function (resultObj) {
    if (resultObj.status === "ok") {
      productsInfoArray = [resultObj.data];
      showProductInfo(productsInfoArray);
    }
  });
  getJSONData(prodCommentsUrl).then((result) => {
    if (result.status === "ok") {
      productCommentsArray = result.data;
      showProductComments(productCommentsArray);
    }
  });
  if (localStorage.getItem("commentsList") != null) {
    newCommentsList = localStorage.getItem("commentsList").split(",");
    newCommentsList.forEach(
      (element) => (container3.innerHTML += "<div>" + element + "</div>")
    );
  }
});

// ADD COMMENT
sendButton.addEventListener("click", () => {
  window.addEventListener("submit", function (e) {
    e.preventDefault();
  });
  let contador = 0;
  let max = 5;
  let htmlContentToAppend = "";
  if (newComment.value != null) {
    htmlContentToAppend += `   
      <div class="card" style="font-size:.8rem; margin-bottom:1em; margin-top:1em">
          <span style="margin-left:.5em; margin-top:.3em"> 
              <b>${user}</b>
               - ${year +"-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds + " "}
      `;
    while (contador < stars.value) {
      htmlContentToAppend += '<span class="fa fa-star checked"></span>';
      contador++;
    }
    while (max > stars.value) {
      htmlContentToAppend += '<span class="fa fa-star-o"></span>';
      max--;
    }
    htmlContentToAppend += ` </span>
            <span style="margin-left:.5em; margin-bottom:.3em">${newComment.value}</span>               
        </div>
      `;
    newCommentsList.push(htmlContentToAppend);
    localStorage.setItem("commentsList", newCommentsList);
    newCommentsList = localStorage.getItem("commentsList").split(",");
    container3.innerHTML = "";
    newComment.value = "";
    newCommentsList.forEach(
      (element) => (container3.innerHTML += "<div>" + element + "</div>")
    );
  }
});


