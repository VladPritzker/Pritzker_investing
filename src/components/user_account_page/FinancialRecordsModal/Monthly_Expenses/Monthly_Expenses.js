import React, { useState, useEffect } from 'react';
import '../Monthly_Expenses/Monthly_Expenses.css';

function MonthlyExpensesModal({ user, onClose }) {
    const [expenses, setExpenses] = useState([]);
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
    const [newExpenseTitle, setNewExpenseTitle] = useState('');
    const [newExpenseAmount, setNewExpenseAmount] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        console.log('Fetching expenses for user ID:', user.id); // Debugging line
        fetchExpenses();
    }, [user.id]); // Ensure dependency array is correct

    const fetchExpenses = async () => {
        const url = `http://127.0.0.1:8000/expenses/${user.id}`;
        console.log('Fetching expenses from:', url);  // Debugging line to check the URL
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setExpenses(data);
                calculateTotal(data);
            } else {
                throw new Error(`Failed to fetch monthly expenses: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching monthly expenses:', error);
        }
    };

    const deleteExpense = async (expenseId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/expenses/${user.id}/${expenseId}/`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                const newExpenses = expenses.filter(expense => expense.id !== expenseId);
                setExpenses(newExpenses);
                calculateTotal(newExpenses);
                alert('Expense deleted successfully!');
            } else {
                throw new Error('Failed to delete the expense.');
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
            alert('Error deleting expense.');
        }
    };

    const calculateTotal = (expenses) => {
        const total = expenses.reduce((sum, record) => sum + parseFloat(record.amount), 0);
        setTotalAmount(Math.round(total * 100) / 100);
    };

    const addExpense = async () => {
        const payload = {
            title: newExpenseTitle,
            amount: newExpenseAmount
        };
        try {
            const response = await fetch(`http://127.0.0.1:8000/expenses/${user.id}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                const addedExpense = await response.json();
                setExpenses([...expenses, addedExpense]);
                calculateTotal([...expenses, addedExpense]);
                setShowAddExpenseModal(false);
            } else {
                throw new Error('Failed to add new expense.');
            }
        } catch (error) {
            console.error('Error adding new expense:', error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content" style={{marginTop: '10%'}}>
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Monthly Expenses</h2>
                <button style={{marginTop: '10px', marginBottom: '10px'}} onClick={() => setShowAddExpenseModal(true)}>Add New Expense</button>
                {showAddExpenseModal && (
                    
                    <div>
                        <input style={{marginTop: '10px', marginBottom: '10px'}} type="text" placeholder="Title" value={newExpenseTitle} onChange={e => setNewExpenseTitle(e.target.value)} />
                        <input style={{marginTop: '10px', marginBottom: '10px'}} type="number" placeholder="Amount" value={newExpenseAmount} onChange={e => setNewExpenseAmount(e.target.value)} />
                        <button style={{marginTop: '10px', marginBottom: '10px'}}  onClick={addExpense}>Submit</button>
                        <button style={{marginTop: '10px', marginBottom: '10px'}}  onClick={() => setShowAddExpenseModal(false)}>Cancel</button>
                    </div>
                )}
                <table className="financial-records-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map(expense => (
                            <tr key={expense.id}>
                                <td>{expense.title}</td>
                                <td>${parseFloat(expense.amount).toFixed(2)}</td>
                                <td>
                                    <button onClick={() => deleteExpense(expense.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot style={{marginTop: '10px'}}>
                        <tr>
                            <th>Total:</th>
                            <th>${totalAmount.toFixed(2)}</th>
                            <th></th>
                        </tr>
                    </tfoot>
                </table>
            </div>
            {/* Conditional rendering of AddNewExpense if needed later */}
        </div>
    );
}

export default MonthlyExpensesModal;
