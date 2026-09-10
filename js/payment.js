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

    console.log("=================================");
    console.log("AI SAGE REGISTRATION STARTED");
    console.log("=================================");


    // ---------------------------------
    // Read Registration Data
    // ---------------------------------

    const registrationData =
        localStorage.getItem("registrationData");


    console.log(
        "Registration data exists:",
        !!registrationData
    );


    if (!registrationData) {

        alert(
            "Registration information not found."
        );

        window.location.href =
            "register.html";

        return;

    }


    let registration;


    try {

        registration =
            JSON.parse(registrationData);

    } catch (error) {

        console.error(
            "Registration JSON error:",
            error
        );

        alert(
            "Registration information is corrupted. Please register again."
        );

        return;

    }


    console.log(
        "Registration data:",
        registration
    );


    // ---------------------------------
    // Read Transaction ID
    // ---------------------------------

    const transactionInput =
        document.getElementById("transactionId");


    if (!transactionInput) {

        console.error(
            "ERROR: transactionId input not found."
        );

        alert(
            "Transaction ID field not found."
        );

        return;

    }


    const transaction =
        transactionInput.value.trim();


    console.log(
        "Transaction ID:",
        transaction
    );


    // ---------------------------------
    // Read Screenshot
    // ---------------------------------

    const screenshotInput =
        document.getElementById("paymentScreenshot");


    if (!screenshotInput) {

        console.error(
            "ERROR: paymentScreenshot input not found."
        );

        alert(
            "Payment screenshot field not found."
        );

        return;

    }


    const screenshot =
        screenshotInput.files[0];


    console.log(
        "Screenshot:",
        screenshot
    );


    // =================================
    // VALIDATE TRANSACTION ID
    // =================================

    if (!transaction) {

        console.log(
            "Validation failed: Transaction ID missing."
        );

        alert(
            "Please enter your UPI Transaction ID."
        );

        return;

    }


    // =================================
    // VALIDATE SCREENSHOT
    // =================================

    if (!screenshot) {

        console.log(
            "Validation failed: Screenshot missing."
        );

        alert(
            "Please upload payment screenshot."
        );

        return;

    }


    console.log(
        "Validation passed."
    );


    // =================================
    // DISABLE BUTTON
    // =================================

    const button =
        document.getElementById("verifyPayment");


    button.disabled = true;

    button.innerText =
        "Submitting...";


    // =================================
    // SHOW LOADING SCREEN
    // =================================

    const loadingBox =
        document.getElementById("loadingBox");


    if (loadingBox) {

        loadingBox.style.display =
            "flex";

    }


    try {

        // =================================
        // CONVERT SCREENSHOT TO BASE64
        // =================================

        console.log(
            "Step 1: Converting screenshot..."
        );


        const screenshotData =
            await convertFileToBase64(
                screenshot
            );


        console.log(
            "Step 2: Screenshot converted."
        );


        console.log(
            "Screenshot Base64 length:",
            screenshotData.length
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
            "Step 3: Registration payload prepared."
        );


        console.log(
            "Sending to Apps Script:"
        );

        console.log(
            SCRIPT_URL
        );


        // =================================
        // SEND TO GOOGLE APPS SCRIPT
        // =================================

        const response =
            await fetch(

                SCRIPT_URL,

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify(data)

                }

            );


        // =================================
        // CHECK HTTP RESPONSE
        // =================================

        console.log(
            "Step 4: HTTP response received."
        );


        console.log(
            "HTTP status:",
            response.status
        );


        console.log(
            "HTTP status text:",
            response.statusText
        );


        console.log(
            "Response URL:",
            response.url
        );


        // =================================
        // READ RESPONSE AS TEXT FIRST
        // =================================

        const responseText =
            await response.text();


        console.log(
            "Step 5: Raw server response:"
        );


        console.log(
            responseText
        );


        // =================================
        // CHECK EMPTY RESPONSE
        // =================================

        if (!responseText) {

            throw new Error(
                "Google Apps Script returned an empty response."
            );

        }


        // =================================
        // PARSE JSON
        // =================================

        let result;


        try {

            result =
                JSON.parse(responseText);

        } catch (jsonError) {

            console.error(
                "JSON parsing failed:",
                jsonError
            );

            console.error(
                "Raw response was:",
                responseText
            );

            throw new Error(
                "Server returned a non-JSON response."
            );

        }


        console.log(
            "Step 6: Parsed Apps Script result:"
        );


        console.log(
            result
        );


        // =================================
        // SUCCESS
        // =================================

        if (
            result.result === "success"
        ) {

            console.log(
                "================================="
            );

            console.log(
                "REGISTRATION SUCCESSFUL"
            );

            console.log(
                "Student ID:",
                result.studentID
            );

            console.log(
                "================================="
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
            // Go to success page
            // ---------------------------------

            window.location.replace(
                "success.html"
            );


            return;

        }


        // =================================
        // SERVER RETURNED ERROR
        // =================================

        console.error(
            "Registration failed on server:"
        );


        console.error(
            result
        );


        throw new Error(
            result.message ||
            "Google Apps Script returned an error."
        );

    }


    // =================================
    // ERROR HANDLER
    // =================================

    catch (error) {

        console.error(
            "================================="
        );

        console.error(
            "AI SAGE REGISTRATION ERROR"
        );

        console.error(
            error
        );

        console.error(
            "================================="
        );


        if (loadingBox) {

            loadingBox.style.display =
                "none";

        }


        button.disabled = false;

        button.innerText =
            "Continue";


        alert(
            "Registration could not be completed.\n\n" +
            error.message +
            "\n\nPlease open the browser console for details."
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
