document.addEventListener('DOMContentLoaded', function () {
    const passwordInput = document.getElementById('inputPassword');
    const confirmPasswordInput = document.getElementById('inputPasswordConfirm');
    const lengthRequirement = document.getElementById('pasLen');
    const capitalRequirement = document.getElementById('pasCap');
    const smallRequirement = document.getElementById('pasSmall');
    const numberRequirement = document.getElementById('pasNum');
    const specialRequirement = document.getElementById('pasSc');
    const passwordMatchRequirement = document.getElementById('pasMatch');

    let firstNameField = document.getElementById("inputFirstName");
    let lastNameField = document.getElementById("inputLastName");
    let emailField = document.getElementById("inputEmail");
    let logBtn = document.getElementById("RegButton");
    let errorMsgs = document.getElementsByClassName("error-msg");

    if (!passwordInput || !confirmPasswordInput || !lengthRequirement || !capitalRequirement || !smallRequirement || !numberRequirement || !specialRequirement) {
        console.error('One or more elements are missing.');
        return;
    }

    function updateRequirement(requirement, condition) {
        const icon = requirement.querySelector('svg');
        if (icon) {
            if (condition) {
                requirement.classList.remove('invalid');
                requirement.classList.add('valid');
                icon.classList.replace('fa-circle-xmark', 'fa-circle-check');
            } else {
                requirement.classList.remove('valid');
                requirement.classList.add('invalid');
                icon.classList.replace('fa-circle-check', 'fa-circle-xmark');
            }
        } else {
            console.error('SVG element not found in', requirement);
        }
    }

    function validatePassword() {
        const value = passwordInput.value;
        const confirmValue = confirmPasswordInput.value;

        // Length validation
        updateRequirement(lengthRequirement, value.length >= 8 && value.length <= 16);

        // Capital letters validation
        updateRequirement(capitalRequirement, /[A-Z]/.test(value));

        // Small letters validation
        updateRequirement(smallRequirement, /[a-z]/.test(value));

        // Numbers validation
        updateRequirement(numberRequirement, /\d/.test(value));

        // Special character validation
        updateRequirement(specialRequirement, /[!@#$%^&*()_+=-]/.test(value));

        // Password match validation
        updateRequirement(passwordMatchRequirement, value === confirmValue);
    }

    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validatePassword);

    function regButtonError(valid) {
        if (!valid) {
            logBtn.style.backgroundColor = "#D32F2F";
            logBtn.textContent = "Oopsie whoopsie!, there's something wrong in the form";
            setTimeout(() => {
                logBtn.style.backgroundColor = "#0d6efd"; // Reset to default background color
                logBtn.textContent = "Create Account"; // Reset to default text
            }, 3000); // 3000 milliseconds = 3 seconds
        } else {
            logBtn.style.backgroundColor = "#4CAF50";
            logBtn.textContent = "Success!";
        }
    }

    function formValidation() {
        let isValid = 0;

        //-------------------------------- PASSWORD FIELD --------------------------------
        if (!(
            passwordInput.value.length >= 8 && 
            passwordInput.value.length <= 16 &&
            /[a-z]/.test(passwordInput.value) &&
            /[A-Z]/.test(passwordInput.value) &&
            /\d/.test(passwordInput.value) &&
            /[!@#$%^&*()_+=-]/.test(passwordInput.value)
        ))
            isValid++;
        //-------------------------------- CONFIRM PASSWORD FIELD --------------------------------
        if (confirmPasswordInput.value !== passwordInput.value)
            isValid++;

        //-------------------------------- NAME & EMAIL FIELD --------------------------------
        if (firstNameField.value === "") {
            isValid++;
        }

        if (lastNameField.value === "") {
            isValid++;
        }

        if (emailField.value === "") {
            isValid++;
        }

        //-------------------------------- RESULT --------------------------------
        if (isValid === 0) {
            regButtonError(true);
            const data = {
                firstName: firstNameField.value,
                lastName: lastNameField.value,
                email: emailField.value,
                password: passwordInput.value,
                createdAt: new Date(),
            };

            insertData(data)
                .then(() => {
                    console.log("Data inserted successfully!");
                })
                .catch((error) => {
                    console.error("Error inserting data:", error);
                });
        } else {
            regButtonError(false);
        }
    }
    
    logBtn.addEventListener("click", formValidation);
});