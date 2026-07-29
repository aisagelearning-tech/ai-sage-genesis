//=====================================
// AI Sage Payment
//=====================================

console.log("===== AI Sage Payment JS Loaded =====");
// Google Apps Script URL

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbyICEPSo23ZXQn42V13jTnPEHDIkOF6jbj4eiCpW0ACRDJ6eDmsG-YiE1MlwsQ-XTr1/exec";


// Continue Button

const verifyButton =
document.getElementById("verifyPayment");

verifyButton.addEventListener("click", function(event){

    event.preventDefault();

    submitRegistration();

});

//=====================================
// Submit Registration
//=====================================

async function submitRegistration(){

    console.log("Step 1 : Function Started");
    // Read Registration Data

    const registration =
    JSON.parse(localStorage.getItem("registrationData"));

    if(!registration){

        alert("Registration information not found.");

        window.location.href="register.html";

        return;

    }

    // Read Payment Details

    const transactionID =
    document.getElementById("transactionID").value.trim();
    console.log("Transaction ID =", transactionID);

    const screenshot =
    document.getElementById("paymentScreenshot").files[0];
    console.log("Screenshot =", screenshot);

    // Validation

    if(transactionID===""){

        
        console.log("Validation Failed : Transaction ID Empty");
        alert("Please enter Transaction ID.");

        return;

    }

    if(!screenshot){

        console.log("Validation Failed : Screenshot Missing");
        

        alert("Please upload payment screenshot.");

        return;

    }

    console.log("Validation Passed");

    const button =
    document.getElementById("verifyPayment");

    button.disabled = true;

    button.innerText = "Submitting...";

    console.log("Step 6 : Showing Loading Screen");

    document.getElementById("loadingBox").style.display="flex";


    // Prepare Data

    const data = {

        name:
        registration.name,

        email:
        registration.email,

        mobile:
        registration.mobile,

        profession:
        registration.profession,

        transaction:
        transactionID,

        screenshot:
        screenshot.name,

        status:
        "Paid"

    };

    try{

        const response =
        await fetch(

            SCRIPT_URL,

            {

                method:"POST",

                body:JSON.stringify(data)

            }

        );

    const result =
        await response.json();

        console.log(result);

     if(result.result==="success")
        {

         localStorage.removeItem("registrationData");

         localStorage.setItem("transactionID",transactionID);

         localStorage.setItem("studentID",result.studentID);

         window.location.replace("success.html");

        }

        else{

            document.getElementById("loadingBox").style.display="none";

            button.disabled = false;

            button.innerText = "Continue";
            alert("Registration failed.");

        }

    }

    catch(error){


        document.getElementById("loadingBox").style.display="none";


        button.disabled = false;

        button.innerText = "Continue";
        
        
        alert("Unable to connect to AI Sage Server.");

        console.log(error);

    }

}