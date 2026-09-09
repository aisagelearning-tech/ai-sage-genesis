// =====================================
// AI SAGE Payment / Registration
// =====================================

console.log("===== AI Sage Payment JS Loaded =====");


// =====================================
// GOOGLE APPS SCRIPT URL
// =====================================

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbyICEPSo23ZXQn42V13jTnPEHDIkOF6jbj4eiCpW0ACRDJ6eDmsG-YiE1MlwsQ-XTr1/exec";


// =====================================
// CONTINUE BUTTON
// =====================================

const verifyButton =
    document.getElementById("verifyPayment");


verifyButton.addEventListener("click", function(event) {

    event.preventDefault();

    submitRegistration();

});


// =====================================
// SUBMIT REGISTRATION
// =====================================

async function submitRegistration() {

    console.log("Step 1 : Function Started");


    // ---------------------------------
    // Read Registration Data
    // ---------------------------------

    const registration =
        JSON.parse(
            localStorage.getItem("registrationData")
        );


    if (!registration) {

        alert("Registration information not found.");

        window.location.href = "register.html";

        return;

    }


    // ---------------------------------
    // Read Payment Screenshot
    // ---------------------------------

    const transactionInput =
        document.getElementById("transactionId");


    const transaction =
        transactionInput.value.trim();


    const screenshotInput =
        document.getElementById("paymentScreenshot");


    const screenshot =
        screenshotInput.files[0];


    console.log(
        "Transaction ID =",
        transaction
    );


    console.log(
        "Screenshot =",
        screenshot
    );

    // ---------------------------------
    // Validate Transaction ID
    // ---------------------------------

    if (!transaction) {
    
        console.log(
            "Validation Failed : Transaction ID Missing"
        );

        alert(
            "Please enter your UPI Transaction ID."
        );

        return;

    }

    // ---------------------------------
    // Validate Screenshot
    // ---------------------------------

    if (!screenshot) {

        console.log(
            "Validation Failed : Screenshot Missing"
        );

        alert(
            "Please upload payment screenshot."
        );

        return;

    }


    console.log(
        "Validation Passed"
    );


    // ---------------------------------
    // Disable Button
    // ---------------------------------

    const button =
        document.getElementById("verifyPayment");


    button.disabled = true;

    button.innerText =
        "Submitting...";


    // ---------------------------------
    // Show Loading Screen
    // ---------------------------------

    console.log(
        "Step 2 : Showing Loading Screen"
    );


    const loadingBox =
        document.getElementById("loadingBox");


    if (loadingBox) {

        loadingBox.style.display = "flex";

    }


    // =================================
    // CONVERT SCREENSHOT TO BASE64
    // =================================

    console.log(
        "Step 3 : Reading Screenshot"
    );


    const screenshotData =
        await convertFileToBase64(screenshot);


    console.log(
        "Step 4 : Screenshot Converted"
    );


    // =================================
    // PREPARE DATA
    // =================================

    const data = {

        name:
            registration.name || "",

        email:
            registration.email || "",

        mobile:
            registration.mobile || "",

        profession:
            registration.profession || "",

        transaction:
            transaction,

        screenshotData:
            screenshotData,

        screenshotName:
            screenshot.name,

        screenshotType:
            screenshot.type,

        status:
            "Payment Submitted"

    };


    console.log(
        "Step 5 : Sending Registration Data"
    );


    // =================================
    // SEND TO GOOGLE APPS SCRIPT
    // =================================

    try {

        const response =
            await fetch(

                SCRIPT_URL,

                {

                    method: "POST",

                    body:
                        JSON.stringify(data)

                }

            );


        console.log(
            "Step 6 : Response Received"
        );


        const result =
            await response.json();


        console.log(
            "Apps Script Result =",
            result
        );


        // =================================
        // SUCCESS
        // =================================

        if (
            result.result === "success"
        ) {

            console.log(
                "Registration Successful"
            );


            // Remove temporary registration data

            localStorage.removeItem(
                "registrationData"
            );


            // Save generated Student ID

            localStorage.setItem(
                "studentID",
                result.studentID
            );


            console.log(
                "Student ID =",
                result.studentID
            );


            // Go to success page

            window.location.replace(
                "success.html"
            );


        }

        // =================================
        // SERVER ERROR
        // =================================

        else {

            console.error(
                "Registration Failed:",
                result.message
            );


            if (loadingBox) {

                loadingBox.style.display =
                    "none";

            }


            button.disabled = false;

            button.innerText =
                "Continue";


            alert(
                "Registration failed.\n\n" +
                (result.message || "Please try again.")
            );

        }

    }


    // =================================
    // CONNECTION ERROR
    // =================================

    catch (error) {

        console.error(
            "Connection Error:",
            error
        );


        if (loadingBox) {

            loadingBox.style.display =
                "none";

        }


        button.disabled = false;

        button.innerText =
            "Continue";


        alert(
            "Unable to connect to AI Sage Server."
        );

    }

}


// =====================================
// CONVERT FILE TO BASE64
// =====================================

function convertFileToBase64(file) {

    return new Promise(
        function(resolve, reject) {

            const reader =
                new FileReader();


            reader.onload =
                function() {

                    resolve(
                        reader.result
                    );

                };


            reader.onerror =
                function(error) {

                    reject(error);

                };


            reader.readAsDataURL(file);

        }
    );

}
