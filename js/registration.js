//==============================
// AI Sage Registration
//==============================

const form = document.getElementById("registrationForm");

form.addEventListener("submit", function(e){

    e.preventDefault();

    const registrationData = {

        name:
        document.getElementById("name").value,

        email:
        document.getElementById("email").value,

        mobile:
        document.getElementById("mobile").value,

        profession:
        document.getElementById("profession").value

    };

    localStorage.setItem(

        "registrationData",

        JSON.stringify(registrationData)

    );

    window.location.href = "payment.html";

});