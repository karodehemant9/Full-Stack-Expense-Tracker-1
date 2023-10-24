const recoverPasswordForm = document.getElementById('recoverpassword-form');
recoverPasswordForm.addEventListener('submit', formSubmitHandler);

function formSubmitHandler(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email === null || password === null) {
        alert('Please fill in all fields with valid data.');
    } else {

        console.log(email);
        console.log(password);
        generatePassword(email, password);
        e.target.reset();
    }

}

function generatePassword(email, password) {
    user = { email, password };
    generatePasswordOnServer(user);
}

function generatePasswordOnServer(user) {
    axios.post("http://localhost:8000/password/updatepassword", user)
        .then(response => {

            console.log('response of generatePasswordOnServer POST request');
            
            console.log(response);
            //console.log(response.data.success);

            if (response.data.success === true) {
                alert('Password Changed Successfully');
                //redirecting to login page
                const destinationURL = "http://127.0.0.1:5500/login.html";
                // Redirect to the destination page
                window.location.href = destinationURL;
                //Reset the form
            }
            else{
                console.log('In else vblock');
                
                alert('Incorrect Email ID');
            }


        })
        .catch(err => {
            console.log(err);
        })
}