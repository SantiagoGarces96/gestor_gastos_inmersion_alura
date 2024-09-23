// script.js

document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const expensesList = document.getElementById('expenses-list');
    const expenseInput = document.getElementById('expense-inpt');
    const categoryInput = document.getElementById('category-inpt');
    const noteInput = document.getElementById('note-inpt');
    const amountDisplay = document.getElementById('amount');

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let editingIndex = null;
    let totalExpenses = parseFloat(localStorage.getItem('totalExpenses')) || 0;

    const updateLocalStorage = () => {
        localStorage.setItem('expenses', JSON.stringify(expenses));
        localStorage.setItem('totalExpenses', totalExpenses.toFixed(2));
    };

    const addExpenseToTotal = (amount) => {
        totalExpenses += parseFloat(amount);
        updateTotalExpenseDisplay();
    };

    const updateTotalAfterEdit = (newAmount, oldAmount) => {
        totalExpenses += parseFloat(newAmount) - parseFloat(oldAmount);
        updateTotalExpenseDisplay();
    };

    const updateTotalExpenseDisplay = () => {
        amountDisplay.textContent = totalExpenses.toFixed(2);
        updateLocalStorage();
    };

    const getDataForm = (e) => {
        e.preventDefault();
        const category = categoryInput.value.trim();
        const note = noteInput.value.trim();
        const expense = parseFloat(expenseInput.value).toFixed(2);

        if (!category || !note || isNaN(expense) || expense <= 0) {
            alert('Por favor, completa todos los campos con valores válidos.');
            return;
        }

        const expenseData = { category, note, expense };

        if (editingIndex !== null) {
            const oldExpense = expenses[editingIndex].expense;
            updateTotalAfterEdit(expense, oldExpense);
            expenses[editingIndex] = expenseData;
        } else {
            expenses.unshift(expenseData);
            addExpenseToTotal(expense);
        }

        updateLocalStorage();
        resetForm();
        renderExpensesItems();
    };

    const resetForm = () => {
        expenseForm.reset();
        editingIndex = null;
        expenseForm.querySelector('button[type="submit"]').textContent = 'Agregar Gasto';
    };

    const renderExpensesItems = () => {
        if (expenses.length === 0) {
            expensesList.innerHTML = '<li class="expenses-list__empty">No hay gastos registrados.</li>';
            return;
        }

        const itemHTML = expenses.map((expense, index) => `
        <li class="expenses-list__item">
          <div class="expense-details">
            <h3 class="expenses-list__category">${expense.category}</h3>
            <p class="expenses-list__note">${expense.note}</p>
          </div>
          <div class="expense-actions">
            <p class="expenses-list__expense">$ <span>${expense.expense}</span></p>
            <div class="expenses-list__buttons">
              <button type="button" class="edit-btn" data-index="${index}" aria-label="Editar gasto">
                <!-- SVG para editar -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" aria-hidden="true" role="img">
                  <path fill="currentColor"
                    d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z" />
                </svg>
              </button>
              <button type="button" class="del-btn" data-index="${index}" aria-label="Eliminar gasto">
                <!-- SVG para eliminar -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" aria-hidden="true" role="img">
                  <path fill="currentColor"
                    d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z" />
                </svg>
              </button>
            </div>
          </div>
        </li>
      `).join('');
        expensesList.innerHTML = itemHTML;

        // Añadir event listeners
        document.querySelectorAll('.edit-btn').forEach(button => button.addEventListener('click', editExpense));
        document.querySelectorAll('.del-btn').forEach(button => button.addEventListener('click', deleteExpense));
    };

    const editExpense = (e) => {
        const index = e.currentTarget.dataset.index;
        const { category, note, expense } = expenses[index];

        categoryInput.value = category;
        noteInput.value = note;
        expenseInput.value = expense;

        editingIndex = index;
        expenseForm.querySelector('button[type="submit"]').textContent = 'Actualizar Gasto';
    };

    const deleteExpense = (e) => {
        const index = e.currentTarget.dataset.index;
        const expenseToDel = parseFloat(expenses[index].expense);
        totalExpenses -= expenseToDel;
        updateTotalExpenseDisplay();

        expenses.splice(index, 1);
        updateLocalStorage();
        renderExpensesItems();
    };

    expenseForm.addEventListener('submit', getDataForm);

    // Inicializar la aplicación
    updateTotalExpenseDisplay();
    renderExpensesItems();
});
