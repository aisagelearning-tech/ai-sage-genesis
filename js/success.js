//==================================
// AI Sage Success Page
//==================================

document.addEventListener("DOMContentLoaded", function(){

    const studentID = localStorage.getItem("studentID");

    if(studentID){

        document.getElementById("studentID").textContent = studentID;

    }

});