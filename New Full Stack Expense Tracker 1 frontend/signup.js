const existingUserButton = document.getElementById('existing-user-button');
existingUserButton.addEventListener('click', existingUserHandling);

function existingUserHandling(e){
        const destinationURL = "login.html";
        // Redirect to the destination page
        window.location.href = destinationURL;
        //redirecting to login page
}


const signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', formSubmitHandler);

function formSubmitHandler(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (name === null || email === null || password === null) {
        alert('Please fill in all fields with valid data.');
    } else {
        console.log(name);
        console.log(email);
        console.log(password);
        signupUser(name, email, password);

        const destinationURL = "login.html";
        // Redirect to the destination page
        window.location.href = destinationURL;
        //redirecting to login page
        // Reset the form
        e.target.reset();
    }

}

function signupUser(name, email, password){
    user = {name, email, password};
    saveUserOnServer(user);
}

function saveUserOnServer(user)
{
    axios.post("http://localhost:8000/user/signup", user)
    .then(response =>{

    })
    .catch(err =>{
        console.log(err);
    })
}