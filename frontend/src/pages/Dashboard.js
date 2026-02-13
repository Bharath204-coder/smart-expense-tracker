import { useEffect, useState } from "react";
import API from "../api/api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function Dashboard() {

  const user = localStorage.getItem("user");  

  const [page, setPage] = useState("dashboard");
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState("");
  const [dark, setDark] = useState(false);

  const fetchExpenses = async () => {
    const res = await API.get("/expenses/");
    setExpenses(res.data);
  };

  const fetchSummary = async () => {
    const res = await API.get("/expenses/summary");
    setTotal(res.data.total_spent);
  };

  const addExpense = async () => {
    if (!date) return alert("Select a date");

    await API.post("/expenses/", { title, amount, date });

    setTitle("");
    setAmount("");
    setDate("");

    fetchExpenses();
    fetchSummary();
  };

  const deleteExpense = async (id) => {
    await API.delete(`/expenses/${id}`);
    fetchExpenses();
    fetchSummary();
  };

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, []);

  const monthlyTotals = {};
  expenses.forEach(e => {
    const month = e.date.slice(0, 7);
    monthlyTotals[month] = (monthlyTotals[month] || 0) + e.amount;
  });

  const monthlyTotal = expenses
    .filter(e => filter && e.date.includes(`-${filter}-`))
    .reduce((sum, e) => sum + e.amount, 0);

  const chartData = {
    labels: Object.keys(monthlyTotals),
    datasets: [
      {
        label: "Monthly Expenses",
        data: Object.values(monthlyTotals),
        backgroundColor: "#4f46e5"
      }
    ]
  };

  return (
    <div className={`layout ${dark ? "dark" : ""}`}>

      <aside className="sidebar">
        <h2>💰 ExpensePro</h2>

        <p style={{cursor:"pointer"}} onClick={() => setPage("dashboard")}>
          Dashboard
        </p>

        <p style={{cursor:"pointer"}} onClick={() => setPage("analytics")}>
          Analytics
        </p>
      </aside>

      <main className="main">

        {page === "dashboard" && (
          <>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>

              <div>
                <h1>Hello, {user}</h1>
                <p style={{color:"#6b7280", marginTop:"4px"}}>
                  Track your spending smartly and stay in control
                </p>
              </div>

              <div>
                <button
                  onClick={() => setDark(!dark)}
                  style={{
                    marginRight: "10px",
                    background:"#4f46e5",
                    color:"white",
                    border:"none",
                    padding:"8px 14px",
                    borderRadius:"8px",
                    cursor:"pointer"
                  }}
                >
                  🌙
                </button>

                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/";
                  }}
                  style={{
                    background:"#ef4444",
                    color:"white",
                    border:"none",
                    padding:"8px 14px",
                    borderRadius:"8px",
                    cursor:"pointer"
                  }}
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="card">
              <h3>Total Spent</h3>
              <h2 style={{color:"#4f46e5"}}>₹{total}</h2>
            </div>

            {filter && (
              <div className="card">
                <h3>Selected Month Total</h3>
                <h2 style={{color:"#10b981"}}>₹{monthlyTotal}</h2>
              </div>
            )}

            <div className="card">
              <h3>Add Expense</h3>
              <div className="form-row">
                <input
                  placeholder="Title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
                <input
                  placeholder="Amount"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
                <button onClick={addExpense}>Add</button>
              </div>
            </div>

            <div className="card">
              <h3>Your Expenses</h3>

              <select
                onChange={e => setFilter(e.target.value)}
                style={{marginBottom:"15px", padding:"8px"}}
              >
                <option value="">All Months</option>
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>

              {expenses
                .filter(e => !filter || e.date.includes(`-${filter}-`))
                .map(e => (
                  <div key={e.id} className="expense-row">
                    <span>{e.title}</span>
                    <strong>₹{e.amount}</strong>
                    <button
                      style={{background:"#ef4444"}}
                      onClick={() => deleteExpense(e.id)}
                    >
                      ✖
                    </button>
                  </div>
                ))}
            </div>
          </>
        )}

        {page === "analytics" && (
          <>
            <h1>Analytics</h1>

            {filter && (
              <div className="card">
                <h3>Selected Month Total</h3>
                <h2 style={{color:"#10b981"}}>₹{monthlyTotal}</h2>
              </div>
            )}

            <div className="card">
              <h3>Monthly Expense Analytics</h3>
              <Bar data={chartData} />
            </div>
          </>
        )}

      </main>
    </div>
  );
}
