// const recoverPasswordButton = document.getElementById('recover-password-button');
// recoverPasswordButton.addEventListener('click', recoverPasswordHandling);

// function recoverPasswordHandling(e) {
//     //redirecting to signup page
//     const destinationURL = "";
//     // Redirect to the destination page
//     window.location.href = destinationURL;
// }


const recoverPasswordForm = document.getElementById('forget-password-form');
recoverPasswordForm.addEventListener('submit', formSubmitHandler);

function formSubmitHandler(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;


    if (email === null) {
        alert('Please fill in all fields with valid data.');
    } else {
        console.log(email);
        recoverUser(email);
        // Reset the form
        //e.target.reset();
    }

}



function recoverUser(email) {
    user = { email };
    recoverUserOnServer(user);
}

async function recoverUserOnServer(user) {
    try {
        const response = await axios.post("http://localhost:8000/password/forgetpassword", user)
        console.log(response); 
    } catch (error) {
        console.log(error);
    }
}