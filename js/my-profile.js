btnSaveChanges = document.getElementById("btn-send-changes");
email = document.getElementById("email");
firstName = document.getElementById("firstName");
lastname = document.getElementById("firstLastname");
phoneNumber = document.getElementById("phoneNumber");
secondLastname = document.getElementById("secondLastname");
secondName = document.getElementById("secondName");
imgPreview = document.getElementById("imgPreview");
defaultImage = document.getElementById("defaultImage");

document.addEventListener("DOMContentLoaded", (event) => {
  /*   const recentImageDataURL = localStorage.getItem("recent-image");
    if (recentImageDataURL) {
        document.querySelector("#imgPreview").setAttribute("src", recentImageDataURL);
    } */
  user = localStorage.getItem("user");
  userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (userInfo && userInfo.email == user) {
    email.value = userInfo.email;
    firstName.value = userInfo.firstName;
    lastname.value = userInfo.lastname;
    if (userInfo.secondName) {
      secondName.value = userInfo.secondName;
    }
    if (userInfo.secondLastname) {
      secondLastname.value = userInfo.secondLastname;
    }
    if (userInfo.phoneNumber) {
      phoneNumber.value = userInfo.phoneNumber;
    }
    if (userInfo.img) {
        imgPreview.src = userInfo.img;
        defaultImage.classList.add("invisible");
        imgPreview.classList.remove("invisible");
    }else{
        imgPreview.src = userInfo.img;
        defaultImage.classList.remove("invisible");
        imgPreview.classList.add("invisible");
    }
  } else {
    email.value = user;
  }
});

function requiredFields() {
  !email.value
    ? email.classList.add("is-invalid")
    : email.classList.remove("is-invalid");
  !firstName.value
    ? firstName.classList.add("is-invalid")
    : firstName.classList.remove("is-invalid");
  !lastname.value
    ? lastname.classList.add("is-invalid")
    : lastname.classList.remove("is-invalid");
}

btnSaveChanges.addEventListener("click", (e) => {
  requiredFields();
  if (email.value && firstName.value && lastname.value) {
    userInfo = {
      email: email.value,
      firstName: firstName.value,
      lastname: lastname.value,
    };
    if (secondName.value) {
      userInfo.secondName = secondName.value;
    }
    if (secondLastname.value) {
      userInfo.secondLastname = secondLastname.value;
    }
    if (phoneNumber.value) {
      userInfo.phoneNumber = phoneNumber.value;
    }
    if (imgPreview.src) {
        userInfo.img = imgPreview.src;
        defaultImage.classList.add("invisible");
        imgPreview.classList.remove("invisible");
    }
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  }
});

//https://www.youtube.com/watch?v=8K2ihr3NC40&ab_channel=midudev
document.querySelector("#profilePhoto").addEventListener("change", function(){
    userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const reader = new FileReader();
    reader.addEventListener("load", () => {
        if (reader.result) {
            userInfo.img = reader.result;
          }
        imgPreview.src = userInfo.img;
        defaultImage.classList.add("invisible");
        imgPreview.classList.remove("invisible");
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
    });
    reader.readAsDataURL(this.files[0]);
});
