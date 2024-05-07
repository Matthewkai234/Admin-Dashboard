let passwordField = document.getElementById("inputPassword");
let confirmPasswordField = document.getElementById("inputPasswordConfirm");

let firstNameField = document.getElementById("inputFirstName");
let lastNameField = document.getElementById("inputLastName");

let emailField = document.getElementById("inputEmail");

let registerButton = document.getElementById("RegButton");
let errorMsgs = document.getElementsByClassName("error-msg");

import insertData from '../../server/connector_mongodb';
//------------------------------ FUNCTIONS ------------------------------
function checkPassword(passwordValue)
{
    /*
        Validation Rules:
            Value must have: 
            1.capital letters AND small letters 
            2.numbers.
            3.special characters.
            4.length between 8 and 16 digits.
        Validation Error Message:
            If the pattern is incorrect: 
                "Password must contain capital letters, small letters, numbers, and any special character and length between 8 and 16 digits."
    */
   let flag = 0;
   let isThereSmall = /[a-z]/;
   let isThereCapital = /[A-Z]/;
   let isThereNumber = /[0-9]/;
   let isThereSpecialChar = /[^\w\s]/;

   if(!(passwordValue.length >= 8 && passwordValue.length <= 16))
    {
        flag++;
    }
   else
   {
        if(!isThereSmall.test(passwordValue))
            flag++;
        if(!isThereCapital.test(passwordValue))
            flag++;
        if(!isThereNumber.test(passwordValue))
            flag++;
        if(!isThereSpecialChar.test(passwordValue))
            flag++;
    }

    return !(flag > 0);
}

function formValidation()
{
    let isValid = 0;
    //-------------------------------- PASSWORD FIELD --------------------------------
    if(!checkPassword(passwordField.value))
    {
        document.getElementById("passwordHelpBlock").style.display = "none";
        errorMsgs[0].textContent = "Password must contain capital letters, small letters, numbers, and special character and length between 8 and 16 digits.";
        isValid++;
    }
    else
        errorMsgs[0].textContent = "";

    //-------------------------------- CONFIRM PASSWORD FIELD --------------------------------
    if(confirmPasswordField.value !== passwordField.value)
    {
        errorMsgs[1].textContent = "Passwords doesn't match!";
        isValid++;
    }
    else
        errorMsgs[1].textContent = "";
    //-------------------------------- NAME & EMAIL FIELD --------------------------------
    if (firstNameField.value == '') {
        isValid++;
    }
    
    if (lastNameField.value == '') {
        isValid++;
    }

    if (emailField.value == '') {
        isValid++;
    }
    //-------------------------------- RESULT --------------------------------
    if(isValid == 0)// Register the user?
    {
        alert("User registered!");

        const data =
        {
            firstName: firstNameField.value,
            lastName: lastNameField.value,
            email: emailField.value,
            password: passwordField.value,
            createdAt: new Date()
        };

        insertData(data)
        .then(() => {
            console.log("Data inserted successfully!");
        })
        .catch((error) => {
            console.error("Error inserting data:", error);
        });
    }
    else
        alert("Oops, form not valid!");
}
//--------------------------- EVENT LISTENERS ---------------------------
passwordField.addEventListener("input", function (){
    errorMsgs[0].textContent = "";
    errorMsgs[1].textContent = "";
    document.getElementById("passwordHelpBlock").style.display = "block";
});

registerButton.addEventListener("click", formValidation);