let email = document.getElementById("email");
let password = document.getElementById("password");
let botonIngresar = document.getElementById("ingresar");

function ingresar() {
    location.replace("main.html")
  }

function showEmailError() {
    document.getElementById("correo").innerHTML += `
    <p style="color:#FF0000">Ingresa tu e-mail</p>`;
    email.style.borderColor = "red";
}

function showContError() {
    document.getElementById("contrasenia").innerHTML += `
    <p style="color:#FF0000">Ingresa tu contraseña</p>`;
    password.style.borderColor = "red";
}

botonIngresar.addEventListener("click", (evt) => {
    if (email.value.length >= 1 && password.value.length >= 1) {
        ingresar(); 
        localStorage.setItem("user", email.value);
    } else if (password.value.length < 1 && email.value.length < 1) {
        showContError();
        showEmailError();
    } else if (email.value.length < 1) {
        showEmailError();
    } else if (password.value.length < 1) {
        showContError();
    }
});

//console.log(localStorage.getItem("user"));