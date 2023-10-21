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
        // Reset the form
        e.target.reset();
    }

}

function generatePassword(email, password){
    user = {email, password};
    generatePasswordOnServer(user);
}

function generatePasswordOnServer(user)
{
    axios.post("http://localhost:8000/password/updatepassword", user)
    .then(response =>{
        console.log(response);
           
    })
    .catch(err =>{
        console.log(err);
    })
}