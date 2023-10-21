const expenses = [];

const dailyExpensesButton = document.getElementById("daily-expenses-button");
dailyExpensesButton.addEventListener('click', filterDaily);
const weeklyExpensesButton = document.getElementById("weekly-expenses-button");
weeklyExpensesButton.addEventListener('click', filterWeekly);
const monthlyExpensesButton = document.getElementById("monthly-expenses-button");
monthlyExpensesButton.addEventListener('click', filterMonthly);


function filterDaily() {
    showAddOptions();
    const today = new Date();
    const filteredExpenses = expenses.filter(expense => {
        return expense.date.toDateString() === today.toDateString();
    });
    updateExpensesList(filteredExpenses);
}

function filterWeekly() {
    hideAddOptions();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const filteredExpenses = expenses.filter(expense => {
        return expense.date >= oneWeekAgo;
    });
    updateExpensesList(filteredExpenses);
}

function filterMonthly() {
    hideAddOptions();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const filteredExpenses = expenses.filter(expense => {
        return expense.date >= oneMonthAgo;
    });
    updateExpensesList(filteredExpenses);
}


function updateExpensesList(filteredExpenses) {
    const expenseList = document.getElementById("expenseList");
    expenseList.innerHTML = '';

    const listToDisplay = filteredExpenses || expenses;

    listToDisplay.forEach(expense => {
        const listItem = document.createElement("li");
        listItem.textContent = `${expense.type === 'expense' ? '-' : '+'} $${expense.amount.toFixed(2)}: ${expense.description} (${expense.date.toLocaleDateString()})`;
        expenseList.appendChild(listItem);
    });
}





function showAddOptions() {
    const addOptions = document.getElementById("add-options");
    addOptions.style.display = "block";
}

function hideAddOptions() {
    const addOptions = document.getElementById("add-options");
    addOptions.style.display = "none";
}

function addIncome() {
    hideAddOptions();
    const destinationURL = "addIncome.html";
    // Redirect to the destination page
    window.location.href = destinationURL;
}

function addExpense() {
    hideAddOptions();
    const destinationURL = "ExpenseTracker.html";
    // Redirect to the destination page
    window.location.href = destinationURL;
}

// ... (The rest of your JavaScript code remains the same)




// function addTransaction() {
//     const amount = parseFloat(document.getElementById("amount").value);
//     const description = document.getElementById("description").value;
//     const type = document.getElementById("type").value;

//     if (isNaN(amount) || description.trim() === "") {
//         alert("Please enter a valid amount and description.");
//         return;
//     }

//     const expense = {
//         amount,
//         description,
//         type,
//         date: new Date()
//     };

//     transactions.push(expense);
//     updateExpansesList();
// }