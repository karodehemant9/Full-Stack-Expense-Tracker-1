console.log('app started');

let expenses;

const token = localStorage.getItem('token');

getExpenses();

function getExpenses() {
    //fetching the stored token from local storage
    let storedExpenses = axios.get("http://localhost:8000/expense/get-expenses", { headers: { "Authorization": token } });

    storedExpenses
        .then((response) => {
            console.log(response);
            expenses = [...response.data.expenses] || [];


            // Display existing expenses on page load
            displayExpenses();
        })
        .catch((error) => console.log(error));
}



// Function to save expenses to Crud Crud server 
function saveExpenseToServer(expense) {
    axios.post("http://localhost:8000/expense/add-expense", expense, { headers: { "Authorization": token } })
        .then((response) => {
            // Display the updated list
            location.reload();
            getExpenses();
            console.log(response);
        })
        .catch((error) => console.log(error));
}


function editExpenseOnServer(expenseID, expense) {
    axios.put(`http://localhost:8000/expense/edit-expense/${expenseID}`, expense, { headers: { "Authorization": token } })
        .then((response) => {
            // Display the updated list
            location.reload();
            getExpenses();
            console.log(response);
        })
        .catch((error) => console.log(error));
}



function deleteExpenseFromServer(expenseID) {
    axios.delete(`http://localhost:8000/expense/delete-expense/${expenseID}`, { headers: { "Authorization": token } })
        .then((response) => {
            console.log(response);
            location.reload();
            getExpenses();

        })
        .catch((error) => console.log(error));
}


// Function to add an expense to the list
function addExpense(amount, description, category) {
    const newExpense = { 'amount': amount, 'description': description, 'category': category };
    saveExpenseToServer(newExpense);
}






const expenseForm = document.getElementById('expenseForm');
expenseForm.addEventListener('submit', handleExpenseSubmission);

const buyPremiumButton = document.getElementById('buy-premium-button');
buyPremiumButton.addEventListener('click', handleBuyPremium);


async function handleBuyPremium(e) {
    e.preventDefault();
    let response = await axios.get("http://localhost:8000/purchase/premiummembership", { headers: { "Authorization": token } });
    console.log('hii everyone');
    console.log(response);

    var options = {
        "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
        "order_id": response.data.order.orderid, //This is a sample Order ID for 1 time payment. Pass the `id` obtained in the response of Step 1

        //this handler function is a callback function which will handle the success payments
        "handler": async function (response) {
            await axios.post("http://localhost:8000/purchase/updatetransactionstatus", {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id
            }, { headers: { "Authorization": token } })

            alert('you are a premium user now');
        }
    };

    var rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function (response) {
        //in case your payment fails
        console.log(response);
    });
}


function handleExpenseSubmission(e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const description = document.getElementById('expenseDescription').value;
    const category = document.getElementById('expenseCategory').value;

    if (!isNaN(amount) && description && category) {
        addExpense(amount, description, category);
        displayExpenses();
        e.target.reset();
    } else {
        alert('Please fill in all fields with valid data.');
    }
}




function displayExpenses() {
    console.log('displaying expenses array : ');
    console.log(expenses);

    const expenseList = document.getElementById('expenseList');
    expenseList.innerHTML = '';

    expenses.forEach((expense, index) => {
        const expenseElement = document.createElement('div');
        expenseElement.className = 'alert alert-info';

        expenseElement.innerHTML = `
            <p><strong>Amount:</strong> ${expense.amount} Rs</p>
            <p><strong>Description:</strong> ${expense.description}</p>
            <p><strong>Category:</strong> ${expense.category}</p>
        `;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger delete-edit-buttons';
        deleteButton.textContent = 'Delete Expense';
        deleteButton.addEventListener('click', () => {
            deleteExpenseFromServer(expense.id);
            getExpenses();
        });

        const editButton = document.createElement('button');
        editButton.className = 'btn btn-warning delete-edit-buttons';
        editButton.textContent = 'Edit Expense';
        editButton.addEventListener('click', () => {
            editExpense(index);
        });

        expenseElement.appendChild(deleteButton);
        expenseElement.appendChild(editButton);

        expenseList.appendChild(expenseElement);
    });
}


function editExpense(index) {
    const editedExpense = expenses[index];
    const expenseForm = document.getElementById('expenseForm');

    document.getElementById('expenseAmount').value = editedExpense.amount;
    document.getElementById('expenseDescription').value = editedExpense.description;
    document.getElementById('expenseCategory').value = editedExpense.category;


    expenseForm.removeEventListener('submit', handleExpenseSubmission);

    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('expenseAmount').value);
        const description = document.getElementById('expenseDescription').value;
        const category = document.getElementById('expenseCategory').value;

        if (!isNaN(amount) && description && category) {
            const updatedExpense = { 'amount': amount, 'description': description, 'category': category };
            editExpenseOnServer(editedExpense.id, updatedExpense);
            expenseForm.reset();
        }
        else {
            alert('Please fill in all fields with valid data.');
        }
    });
}



