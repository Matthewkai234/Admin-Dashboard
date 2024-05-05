let passwordField = document.getElementById("inputPassword");
let registerButton = document.getElementById("register-user");

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
   let isThereUnderscore = /[_]/;

   if(!(passwordValue.length >= 8 && passwordValue.length <= 16))
        flag++;
   else
   {
        if(!isThereSmall.test(passwordValue))
            flag++;
        if(!isThereCapital.test(passwordValue))
            flag++;
        if(!isThereNumber.test(passwordValue))
            flag++;
        if(!isThereUnderscore.test(passwordValue))
            flag++;
    }

    return !(flag > 0);
}