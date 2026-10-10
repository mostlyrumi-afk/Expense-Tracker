let transactions = [
    {
        id: 1,
        date: "2025-01-14",
        amount: -440,
        status: "success",
        category: "Subscription",
        type: "expense",
        description: "Subscription"
    },
    {
        id: 2,
        date: "2025-01-10",
        amount: -440,
        status: "success",
        category: "Subscription",
        type: "expense",
        description: "Subscription"
    },
    {
        id: 3,
        date: "2025-01-08",
        amount: -440,
        status: "success",
        category: "Subscription",
        type: "expense",
        description: "Subscription"
    }
];

let monthlyIncome = 2645;
let monthlyExpenses = 1895;

const spendingLimit = 12645;

const today = new Date().toISOString().split("T")[0];


// INITIALIZE DASHBOARD
document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("incomeDate").value = today;
    document.getElementById("expenseDate").value = today;

    updateDashboard();
    updateTransactionsTable();

});


// OPEN INCOME MODAL
function openIncomeModal() {

    document.getElementById("incomeModal").style.display = "block";

    document.body.style.overflow = "hidden";

}


// OPEN EXPENSE MODAL
function openExpenseModal() {

    document.getElementById("expenseModal").style.display = "block";

    document.body.style.overflow = "hidden";

}


// CLOSE MODAL
function closeModal(modalId) {

    const modal = document.getElementById(modalId);

    if (!modal) {
        return;
    }

    modal.style.display = "none";

    document.body.style.overflow = "auto";

    if (modalId === "incomeModal") {

        document.getElementById("incomeForm").reset();

        document.getElementById("incomeDate").value = today;

    } else if (modalId === "expenseModal") {

        document.getElementById("expenseForm").reset();

        document.getElementById("expenseDate").value = today;

    }

}


// CLOSE MODAL WHEN CLICKING OUTSIDE
window.addEventListener("click", function (event) {

    const incomeModal = document.getElementById("incomeModal");

    const expenseModal = document.getElementById("expenseModal");

    if (event.target === incomeModal) {

        closeModal("incomeModal");

    }

    if (event.target === expenseModal) {

        closeModal("expenseModal");

    }

});


// ADD EXPENSE
function addExpense() {

    const amount = parseFloat(
        document.getElementById("expenseAmount").value
    );

    const category =
        document.getElementById("expenseCategory").value;

    const description =
        document.getElementById("expenseDescription").value.trim();

    const date =
        document.getElementById("expenseDate").value;


    if (
        !Number.isFinite(amount) ||
        amount <= 0 ||
        !category ||
        !date
    ) {

        alert("Please fill in all required fields with valid information.");

        return;

    }


    const newTransaction = {

        id: Date.now(),

        date: date,

        category: category.charAt(0).toUpperCase() + category.slice(1),

        amount: -amount,

        status: "success",

        type: "expense",

        description: description

    };


    transactions.unshift(newTransaction);

    monthlyExpenses += amount;


    updateDashboard();

    updateTransactionsTable();


    closeModal("expenseModal");


    showNotification("Expense added successfully", "success");

}


// ADD INCOME
function addIncome() {

    const amount = parseFloat(
        document.getElementById("incomeAmount").value
    );

    const category =
        document.getElementById("incomeCategory").value;

    const description =
        document.getElementById("incomeDescription").value.trim();

    const date =
        document.getElementById("incomeDate").value;


    if (
        !Number.isFinite(amount) ||
        amount <= 0 ||
        !category ||
        !date
    ) {

        alert("Please fill in all required fields with valid information.");

        return;

    }


    const newTransaction = {

        id: Date.now(),

        date: date,

        category: category.charAt(0).toUpperCase() + category.slice(1),

        amount: amount,

        status: "success",

        type: "income",

        description: description

    };


    transactions.unshift(newTransaction);

    monthlyIncome += amount;


    updateDashboard();

    updateTransactionsTable();


    closeModal("incomeModal");


    showNotification("Income added successfully", "success");

}


// UPDATE DASHBOARD
function updateDashboard() {

    const incomeElement =
        document.querySelector(".income-amount");

    const expenseElement =
        document.querySelector(".expense-amount");


    const formatAmount = function (amount) {

        return amount.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    };


    if (incomeElement) {

        incomeElement.innerHTML =
            `<i class="fa-solid fa-indian-rupee-sign"></i>${formatAmount(monthlyIncome)}`;

    }


    if (expenseElement) {

        expenseElement.innerHTML =
            `<i class="fa-solid fa-indian-rupee-sign"></i>${formatAmount(monthlyExpenses)}`;

    }


    const remainingAmount =
        spendingLimit - monthlyExpenses;

    const percentage =
        (monthlyExpenses / spendingLimit) * 100;


    const spendingElement =
        document.querySelector(".spending-limit");

    const progressElement =
        document.querySelector(".progress-fill");


    if (spendingElement) {

        spendingElement.textContent =
            `₹${formatAmount(remainingAmount)}`;

    }


    if (progressElement) {

        progressElement.style.width =
            `${Math.min(Math.max(percentage, 0), 100)}%`;

    }

}


// UPDATE TRANSACTIONS TABLE
function updateTransactionsTable() {

    const tbody =
        document.querySelector(".transaction-table tbody");


    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    const recentTransactions = transactions.slice(0, 10);


    recentTransactions.forEach(function (transaction) {

        const row = document.createElement("tr");


        const formattedDate = new Date(
            `${transaction.date}T00:00:00`
        ).toLocaleDateString("en-US", {

            month: "short",

            day: "numeric",

            year: "numeric"

        });


        const amountDisplay =
            `${transaction.amount > 0 ? "+" : "-"}₹${Math.abs(transaction.amount).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;


        const category =
            transaction.category ||
            transaction.description ||
            "Other";


        const amountColor =
            transaction.amount > 0 ? "#10b981" : "#ef4444";


        row.innerHTML = `

            <td>${formattedDate}</td>

            <td>${escapeHTML(category)}</td>

            <td style="color: ${amountColor}">
                ${amountDisplay}
            </td>

            <td>
                <span class="status-success">
                    ${escapeHTML(transaction.status)}
                </span>
            </td>

            <td>
                <button
                    class="action-btn"
                    type="button"
                    aria-label="Transaction actions">

                    <i class="fas fa-ellipsis-h"></i>

                </button>
            </td>

        `;


        tbody.appendChild(row);

    });

}


// ESCAPE HTML
function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, function (character) {

        const entities = {

            "&": "&amp;",

            "<": "&lt;",

            ">": "&gt;",

            '"': "&quot;",

            "'": "&#39;"

        };

        return entities[character];

    });

}


// SHOW NOTIFICATION
function showNotification(message, type = "success") {

    const notification = document.createElement("div");


    notification.style.cssText = `

        position: fixed;

        top: 2rem;

        right: 2rem;

        color: white;

        padding: 1rem 1.5rem;

        border-radius: 8px;

        box-shadow: 0 4px 12px rgba(0,0,0,0.15);

        z-index: 1001;

        animation: slideInRight 0.3s ease;

        background: ${type === "success" ? "#10b981" : "#ef4444"};

    `;


    notification.textContent = message;


    document.body.appendChild(notification);


    setTimeout(function () {

        notification.style.animation =
            "slideOutRight 0.3s ease";


        setTimeout(function () {

            notification.remove();

        }, 300);

    }, 3000);

}


// NOTIFICATION ANIMATIONS
const notificationStyles = document.createElement("style");


notificationStyles.textContent = `

    @keyframes slideInRight {

        from {

            transform: translateX(100%);

            opacity: 0;

        }

        to {

            transform: translateX(0);

            opacity: 1;

        }

    }


    @keyframes slideOutRight {

        from {

            transform: translateX(0);

            opacity: 1;

        }

        to {

            transform: translateX(100%);

            opacity: 0;

        }

    }

`;


document.head.appendChild(notificationStyles);




function renderMonthlyChart() {
    const chart = document.querySelector(".chart-container");
    const labels = document.querySelector(".chart-labels");

    if (!chart || !labels) return;

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const data = months.map((month, i) => {
        const income = transactions
            .filter(t => t.type === "income" && new Date(t.date + "T00:00:00").getMonth() === i)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        const expense = transactions
            .filter(t => t.type === "expense" && new Date(t.date + "T00:00:00").getMonth() === i)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        return { month, income, expense, total: income + expense };
    });

    const max = Math.max(...data.map(d => d.total), 1);

    chart.innerHTML = "";
    labels.innerHTML = "";

    data.forEach(d => {
        const bar = document.createElement("div");
        bar.className = "chart-bar";
        bar.style.cssText = `height:${d.total ? Math.max(d.total / max * 240, 4) : 0}px;width:40px;background:transparent;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden`;

        [["#10b981", d.income], ["#ea580c", d.expense]].forEach(([color, amount]) => {
            const part = document.createElement("div");
            part.style.cssText = `height:${d.total ? amount / d.total * 100 : 0}%;width:100%;flex:none;background:${color}`;
            bar.appendChild(part);
        });

        bar.title = `${d.month}\nIncome: ₹${d.income}\nExpenses: ₹${d.expense}`;
        chart.appendChild(bar);

        const label = document.createElement("span");
        label.textContent = d.month;
        labels.appendChild(label);
    });
}


