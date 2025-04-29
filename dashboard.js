let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

function addExpense() {
  const name = document.getElementById('expenseName').value.trim();
  const amount = parseFloat(document.getElementById('expenseAmount').value);

  if (!name || isNaN(amount)) {
    alert("Please enter a valid name and amount!");
    return;
  }

  expenses.push({ name, amount });
  saveExpenses();
  renderExpenses();
  document.getElementById('expenseName').value = '';
  document.getElementById('expenseAmount').value = '';

  showNotification("💵 Budget Updated!");
}

function saveExpenses() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function renderExpenses() {
  const list = document.getElementById('expenseList');
  const totalSpent = document.getElementById('totalSpent');
  list.innerHTML = "";

  let total = 0;
  expenses.forEach(exp => {
    const li = document.createElement('li');
    li.textContent = `${exp.name}: $${exp.amount}`;
    list.appendChild(li);
    total += exp.amount;
  });

  totalSpent.textContent = total.toFixed(2);
}

// Notification function (same style as Home Page)
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerText = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2500);
}

// Initial rendering
renderExpenses();
