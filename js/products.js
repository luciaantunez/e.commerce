const container = document.getElementById("container");
let currentProductsArray = [];
let minCount = document.getElementById("rangeFilterCountMin");
let maxCount = document.getElementById("rangeFilterCountMax");
let btnFilterByCount = document.getElementById("rangeFilterCount");
let relevance = document.getElementById("sortByCount");
let sortAsc = document.getElementById("sortAsc");
let sortDesc = document.getElementById("sortDesc");
let catID = localStorage.getItem("catID");
let url = getProdUrl(catID);
let catName = "";
let inputSearch = document.getElementById("input-search");

function setProdID(id) {
    localStorage.setItem("prodID", id);
    window.location = "product-info.html";
}

function showProductList(array) {
    let htmlContentToAppend = "";
    for (let i = 0; i < array.length; i++) {
        let product = array[i];
        htmlContentToAppend += `  
            <div onclick="setProdID(${product.id})" id="${product.id
            }" class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${product.image}" alt="${product.description
            }" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${product.name} ${" - "} ${product.currency
            } ${product.cost} </h4>
                            <small class="text-muted">${product.soldCount
            } artículos</small>
                        </div>
                        <p class="mb-1">${product.description}</p>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML = htmlContentToAppend;
    }
    document.getElementById(
        "subtitle"
    ).innerText = `Verás aquí todos los productos de la categoría ${catName}`;
}

document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(url).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentProductsArray = resultObj.data.products;
            catName = resultObj.data.catName;
            showProductList(currentProductsArray);
            console.log(currentProductsArray);
        }
    });
});

//BUSCADOR
inputSearch.addEventListener("input", () => {
    const search = currentProductsArray.filter((prod) =>
        prod.name.toLowerCase().includes(inputSearch.value.toLowerCase())
    );
    showProductList(search);
});

//FILTRAR POR PRECIO
btnFilterByCount.addEventListener("click", () => {
    if (minCount.value && maxCount.value) {
        const filter = currentProductsArray.filter(
            (prod) => prod.cost > minCount.value && prod.cost < maxCount.value
        );
        showProductList(filter);
    } else if (minCount.value) {
        const minCountFilter = currentProductsArray.filter(
            (prod) => prod.cost > minCount.value
        );
        showProductList(minCountFilter);
    } else if (maxCount.value) {
        const maxCountFilter = currentProductsArray.filter(
            (prod) => prod.cost < maxCount.value
        );
        showProductList(maxCountFilter);
    } else {
        showProductList(currentProductsArray);
    }
});
document.getElementById("clearRangeFilter").addEventListener("click", () => {
    showProductList(currentProductsArray);
});

//ORDENAR POR REELEVANCIA
relevance.addEventListener("click", () => {
    let arr = Array.from(currentProductsArray);
    arr.sort(function (a, b) {
        return a.soldCount - b.soldCount;
    });
    arr.reverse();
    showProductList(arr);
});

//ORDENAR POR PRECIO DESCENDENTE
sortDesc.addEventListener("click", () => {
    let arrDesc = Array.from(currentProductsArray);
    arrDesc.sort(function (a, b) {
        return a.cost - b.cost;
    });
    showProductList(arrDesc);
});

//ORDENAR POR PRECIO ASCENDENTE
sortAsc.addEventListener("click", () => {
    let sortAsc = Array.from(currentProductsArray);
    sortAsc.sort(function (a, b) {
        return a.cost - b.cost;
    });
    sortAsc.reverse();
    showProductList(sortAsc);
});
