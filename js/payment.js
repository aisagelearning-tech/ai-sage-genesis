// =====================================
// AI SAGE PAYMENT / REGISTRATION
// Production Version
// =====================================

console.log("===== AI Sage Payment JS Loaded =====");


// =====================================
// GOOGLE APPS SCRIPT WEB APP URL
// =====================================

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbyICEPSo23ZXQn42V13jTnPEHDIkOF6jbj4eiCpW0ACRDJ6eDmsG-YiE1MlwsQ-XTr1/exec";


// =====================================
// CONFIGURATION
// =====================================

const MAX_SCREENSHOT_SIZE =
    5 * 1024 * 1024; // 5 MB


const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp"
];


// =====================================
// CONTINUE BUTTON
// =====================================

const verifyButton =
    document.getElementById("verifyPayment");


if (!verifyButton) {

    console.error(
        "ERROR: verifyPayment button not found."
    );

} else {

    verifyButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            submitRegistration();

        }
    );

}


// =====================================
// SUBMIT REGISTRATION
// =====================================

async function submitRegistration() {

    console.log(
        "Step 1 : Function Started"
    );


    // =================================
    // READ REGISTRATION DATA
    // =================================

    let registration;

    try {

        registration =
            JSON.parse(
                localStorage.getItem(
                    "registrationData"
                )
            );

    }

    catch (error) {

        console.error(
            "Invalid registrationData:",
            error
        );

        alert(
            "Registration information is invalid."
        );

        window.location.href =
            "register.html";

        return;

    }


    if (!registration) {

        alert(
            "Registration information not found."
        );

        window.location.href =
            "register.html";

        return;

    }


    // =================================
    // READ TRANSACTION ID
    // =================================

    const transactionInput =
        document.getElementById(
            "transactionId"
        );


    if (!transactionInput) {

        alert(
            "Transaction ID field not found."
        );

        return;

    }


    const transaction =
        transactionInput.value.trim();


    // =================================
    // READ SCREENSHOT
    // =================================

    const screenshotInput =
        document.getElementById(
            "paymentScreenshot"
        );


    if (!screenshotInput) {

        alert(
            "Payment screenshot field not found."
        );

        return;

    }


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


    // =================================
    // VALIDATE TRANSACTION ID
    // =================================

    if (!transaction) {

        console.log(
            "Validation Failed : Transaction ID Missing"
        );

        alert(
            "Please enter your UPI Transaction ID."
        );

        return;

    }


    if (transaction.length < 6) {

        alert(
            "Please enter a valid UPI Transaction ID."
        );

        return;

    }


    // =================================
    // VALIDATE SCREENSHOT
    // =================================

    if (!screenshot) {

        console.log(
            "Validation Failed : Screenshot Missing"
        );

        alert(
            "Please upload payment screenshot."
        );

        return;

    }


    // =================================
    // VALIDATE IMAGE TYPE
    // =================================

    if (
        !ALLOWED_IMAGE_TYPES.includes(
            screenshot.type
        )
    ) {

        alert(
            "Please upload a JPG, PNG or WEBP image."
        );

        return;

    }


    // =================================
    // VALIDATE FILE SIZE
    // =================================

    if (
        screenshot.size >
        MAX_SCREENSHOT_SIZE
    ) {

        alert(
            "Payment screenshot must be smaller than 5 MB."
        );

        return;

    }


    console.log(
        "Validation Passed"
    );


    // =================================
    // DISABLE BUTTON
    // =================================

    verifyButton.disabled =
        true;


    verifyButton.innerText =
        "Submitting...";


    // =================================
    // SHOW LOADING SCREEN
    // =================================

    console.log(
        "Step 2 : Showing Loading Screen"
    );


    const loadingBox =
        document.getElementById(
            "loadingBox"
        );


    if (loadingBox) {

        loadingBox.style.display =
            "flex";

    }


    try {

        // =================================
        // CONVERT SCREENSHOT TO BASE64
        // =================================

        console.log(
            "Step 3 : Reading Screenshot"
        );


        const screenshotData =
            await convertFileToBase64(
                screenshot
            );


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

        const response =
            await fetch(

                SCRIPT_URL,

                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify(data),

                    redirect:
                        "follow"

                }

            );


        console.log(
            "Step 6 : Response Received"
        );


        console.log(
            "HTTP Status =",
            response.status
        );


        console.log(
            "Response URL =",
            response.url
        );


        // =================================
        // READ RESPONSE
        // =================================

        const responseText =
            await response.text();


        console.log(
            "Step 7 : Raw Server Response =",
            responseText
        );


        // =================================
        // PARSE JSON
        // =================================

        let result;


        try {

            result =
                JSON.parse(
                    responseText
                );

        }

        catch (parseError) {

            console.error(
                "JSON parsing failed."
            );

            console.error(
                "Server response:",
                responseText
            );

            throw new Error(
                "Server returned an invalid response."
            );

        }


        console.log(
            "Apps Script Result =",
            result
        );


        // =================================
        // SUCCESS
        // =================================

        if (
            result &&
            result.result === "success"
        ) {

            console.log(
                "Registration Successful"
            );


            console.log(
                "Student ID =",
                result.studentID
            );


            // ---------------------------------
            // Remove temporary registration data
            // ---------------------------------

            localStorage.removeItem(
                "registrationData"
            );


            // ---------------------------------
            // Save Student ID
            // ---------------------------------

            localStorage.setItem(
                "studentID",
                result.studentID
            );


            // ---------------------------------
            // Save transaction ID
            // ---------------------------------

            localStorage.setItem(
                "transactionID",
                transaction
            );


            // ---------------------------------
            // Go to success page
            // ---------------------------------

            window.location.replace(
                "success.html"
            );


            return;

        }


        // =================================
        // SERVER REPORTED ERROR
        // =================================

        throw new Error(
            result?.message ||
            "Registration failed."
        );

    }


    catch (error) {

        console.error(
            "Registration Error:",
            error
        );


        // =================================
        // HIDE LOADING
        // =================================

        if (loadingBox) {

            loadingBox.style.display =
                "none";

        }


        // =================================
        // RE-ENABLE BUTTON
        // =================================

        verifyButton.disabled =
            false;


        verifyButton.innerText =
            "Continue";


        // =================================
        // USER MESSAGE
        // =================================

        alert(
            "Unable to complete registration.\n\n" +
            "Please check your internet connection and try again."
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


            reader.readAsDataURL(
                file
            );

        }
    );

}
