const newUserButton = document.getElementById('new-user-button');
newUserButton.addEventListener('click', newUserHandling);

function newUserHandling(e){
    //redirecting to signup page
    const destinationURL = "signup.html";
    // Redirect to the destination page
    window.location.href = destinationURL;     
}


const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', formSubmitHandler);

function formSubmitHandler(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email === null || password === null) {
        alert('Please fill in all fields with valid data.');
    } else {
        console.log(email);
        console.log(password);
        loginUser(email, password);
        // Reset the form
        e.target.reset();
    }

}

function loginUser(email, password){
    user = {email, password};
    loginUserOnServer(user);
}

function loginUserOnServer(user)
{
    axios.post("http://localhost:8000/user/login", user)
    .then(response =>{
        console.log(response);
        if(response.data.success === true){
            // Assume you receive a successful response from the backend
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('isPremiumUser', response.data.user.isPremiumUser);
            console.log(`user is a premium user ::: ${response.data.user.isPremiumUser}`)
            window.location.href = "ExpenseTracker.html"; 
        }
    })
    .catch(err =>{
        console.log(err);
    })
}