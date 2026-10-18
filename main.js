"use strict";

const $ = (id) => document.getElementById(id);

const KEYS = {
  users: "credifacil_users_v1",
  session: "credifacil_session_v1",
  customers: "credifacil_customers_v1",
  loans: "credifacil_loans_v1",
  payments: "credifacil_payments_v1",
  expenses: "credifacil_expenses_v1"
};

function readStore(key, fallback = []) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    showNotice("Não foi possível salvar os dados neste navegador.", true);
    return false;
  }
}

function makeId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function today() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
}

function money(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(Number(value) || 0);
}

function formatDate(value) {
  if (!value) return "—";
  const parts = value.split("-");
  if (parts.length !== 3) return value;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function currentUser() {
  const session = readStore(KEYS.session, null);
  if (!session?.id) return null;
  return readStore(KEYS.users, []).find(user => user.id === session.id) || null;
}

function myRows(key) {
  const user = currentUser();
  if (!user) return [];
  return readStore(key, []).filter(row => row.userId === user.id);
}

function saveMyRows(key, rows) {
  const user = currentUser();
  if (!user) return false;
  const allRows = readStore(key, []).filter(row => row.userId !== user.id);
  return writeStore(key, [...allRows, ...rows.filter(row => row.userId === user.id)]);
}

function showNotice(message, isError = false) {
  const notice = $("app-notice");
  if (!notice) return;
  notice.textContent = message;
  notice.classList.toggle("error", isError);
  notice.hidden = false;
  window.clearTimeout(showNotice.timer);
  showNotice.timer = window.setTimeout(() => {
    notice.hidden = true;
  }, 4500);
}

function showScreen(screen) {
  $("login-screen").hidden = screen !== "login";
  $("register-screen").hidden = screen !== "register";
  $("app-shell").hidden = screen !== "app";
}

function showPage(page) {
  document.querySelectorAll(".page").forEach(section => {
    section.hidden = section.id !== `page-${page}`;
  });

  document.querySelectorAll("[data-page]").forEach(button => {
    button.classList.toggle("active", button.dataset.page === page);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function enterApp() {
  showScreen("app");
  const user = currentUser();
  $("user-avatar").textContent = user
    ? user.name.split(/\s+/).slice(0, 2).map(part => part[0] || "").join("").toUpperCase()
    : "CF";
  renderAll();
  showPage("dashboard");
}

async function hashPassword(password) {
  if (window.crypto?.subtle) {
    const data = new TextEncoder().encode(password);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
      .map(byte => byte.toString(16).padStart(2, "0"))
      .join("");
  }
  return password;
}

/* CONTA E LOGIN */
async function register(event) {
  event.preventDefault();

  const name = $("register-name").value.trim();
  const email = $("register-email").value.trim().toLowerCase();
  const password = $("register-password").value;
  const error = $("register-error");
  error.textContent = "";

  if (!name || !email || password.length < 8) {
    error.textContent = "Preencha os campos e use uma senha de pelo menos 8 caracteres.";
    return;
  }

  const users = readStore(KEYS.users, []);
  if (users.some(user => user.email === email)) {
    error.textContent = "Já existe uma conta com esse e-mail.";
    return;
  }

  const user = {
    id: makeId(),
    name,
    email,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString()
  };

  if (!writeStore(KEYS.users, [...users, user])) return;
  if (!writeStore(KEYS.session, { id: user.id })) return;

  $("register-form").reset();
  enterApp();
}

async function login(event) {
  event.preventDefault();

  const email = $("login-email").value.trim().toLowerCase();
  const password = $("login-password").value;
  const error = $("login-error");
  error.textContent = "";

  const users = readStore(KEYS.users, []);
  const user = users.find(item => item.email === email);

  if (!user || user.passwordHash !== await hashPassword(password)) {
    error.textContent = "E-mail ou senha incorretos.";
    return;
  }

  if (!writeStore(KEYS.session, { id: user.id })) return;
  $("login-form").reset();
  enterApp();
}

function logout() {
  localStorage.removeItem(KEYS.session);
  showScreen("login");
  showPage("dashboard");
}

/* CLIENTES */
function addCustomer(event) {
  event.preventDefault();

  const name = $("customer-name").value.trim();
  const phone = $("customer-phone").value.trim();
  const location = $("customer-location").value.trim();
  const documentNumber = $("customer-document").value.trim();

  if (!name || !phone) {
    showNotice("Informe o nome e o telefone do cliente.", true);
    return;
  }

  const customers = myRows(KEYS.customers);
  customers.push({
    id: makeId(),
    userId: currentUser().id,
    name,
    phone,
    location,
    documentNumber,
    createdAt: new Date().toISOString()
  });

  if (!saveMyRows(KEYS.customers, customers)) return;

  $("customer-form").reset();
  renderCustomers();
  renderCustomerOptions();
  renderDashboard();
  showNotice("Cliente cadastrado com sucesso.");
}

function renderCustomers() {
  const container = $("customer-list");
  if (!container) return;

  const search = ($("customer-search")?.value || "").trim().toLowerCase();
  const customers = myRows(KEYS.customers).filter(customer =>
    `${customer.name} ${customer.phone} ${customer.location}`.toLowerCase().includes(search)
  );

  $("customer-count").textContent = `${customers.length} cliente(s)`;

  if (!customers.length) {
    container.innerHTML = `<tr><td colspan="4">Nenhum cliente encontrado.</td></tr>`;
    return;
  }

  container.innerHTML = customers.map(customer => `
    <tr>
      <td><strong>${escapeHTML(customer.name)}</strong></td>
      <td>${escapeHTML(customer.phone)}</td>
      <td>${escapeHTML(customer.location || "—")}</td>
      <td><button type="button" data-delete-customer="${escapeHTML(customer.id)}">Excluir</button></td>
    </tr>
  `).join("");
}

function deleteCustomer(customerId) {
  const hasLoans = myRows(KEYS.loans).some(loan => loan.customerId === customerId);
  if (hasLoans) {
    showNotice("Este cliente tem empréstimos registrados. Não é possível excluí-lo.", true);
    return;
  }

  if (!confirm("Deseja realmente excluir este cliente?")) return;

  const customers = myRows(KEYS.customers).filter(customer => customer.id !== customerId);
  if (!saveMyRows(KEYS.customers, customers)) return;

  renderCustomers();
  renderCustomerOptions();
  renderDashboard();
  showNotice("Cliente excluído.");
}

function renderCustomerOptions() {
  const select = $("loan-customer");
  if (!select) return;

  const previous = select.value;
  const customers = myRows(KEYS.customers);

  select.innerHTML = '<option value="">Selecione um cliente</option>' +
    customers.map(customer =>
      `<option value="${escapeHTML(customer.id)}">${escapeHTML(customer.name)}</option>`
    ).join("");

  if (customers.some(customer => customer.id === previous)) {
    select.value = previous;
  }
}

/* EMPRÉSTIMOS */
function updateLoanTotal() {
  const amount = Number($("loan-amount")?.value || 0);
  const interest = Number($("loan-interest")?.value || 0);
  const total = amount + (amount * interest / 100);
  const preview = $("loan-total-preview");
  if (preview) preview.textContent = money(total);
}

function addLoan(event) {
  event.preventDefault();

  const customerId = $("loan-customer").value;
  const amount = Number($("loan-amount").value);
  const rate = Number($("loan-interest").value || 0);
  const date = $("loan-date").value;
  const dueDate = $("loan-due-date").value;
  const notes = $("loan-notes").value.trim();

  const customerExists = myRows(KEYS.customers).some(customer => customer.id === customerId);

  if (!customerExists) {
    showNotice("Cadastre ou selecione um cliente antes de continuar.", true);
    return;
  }

  if (!Number.isFinite(amount) || amount <= 0 || !Number.isFinite(rate) || rate < 0) {
    showNotice("Informe um valor e uma taxa de juros válidos.", true);
    return;
  }

  if (!date || !dueDate || dueDate < date) {
    showNotice("Confira as datas do empréstimo e do vencimento.", true);
    return;
  }

  const total = amount + (amount * rate / 100);
  const loans = myRows(KEYS.loans);

  loans.push({
    id: makeId(),
    userId: currentUser().id,
    customerId,
    amount,
    rate,
    total,
    date,
    dueDate,
    notes,
    createdAt: new Date().toISOString()
  });

  if (!saveMyRows(KEYS.loans, loans)) return;

  $("loan-form").reset();
  $("loan-date").value = today();
  $("loan-interest").value = "0";
  updateLoanTotal();
  renderLoans();
  renderDashboard();
  renderHistory();
  showNotice("Empréstimo registrado com sucesso.");
}

function customerName(customerId) {
  const customer = myRows(KEYS.customers).find(item => item.id === customerId);
  return customer ? customer.name : "Cliente não encontrado";
}

function paidForLoan(loanId) {
  return myRows(KEYS.payments)
    .filter(payment => payment.loanId === loanId)
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
}

function balanceForLoan(loan) {
  return Math.max(0, Number(loan.total || 0) - paidForLoan(loan.id));
}

function renderLoans() {
  const container = $("loan-list");
  if (!container) return;

  const loans = myRows(KEYS.loans).sort((a, b) => b.date.localeCompare(a.date));

  if (!loans.length) {
    container.innerHTML = '<p class="empty-state">Nenhum empréstimo registrado. Cadastre um cliente antes de criar um empréstimo.</p>';
    return;
  }

  container.innerHTML = loans.map(loan => {
    const paid = paidForLoan(loan.id);
    const balance = balanceForLoan(loan);
    const overdue = balance > 0 && loan.dueDate < today();

    const status = balance <= 0
      ? '<span class="status status-paid">Pago</span>'
      : overdue
        ? '<span class="status status-overdue">Atrasado</span>'
        : '<span class="status status-pending">Pendente</span>';

    return `
      <article class="loan-card">
        <div class="panel-heading">
          <div>
            <h3>${escapeHTML(customerName(loan.customerId))}</h3>
            <p>Contrato · ${escapeHTML(formatDate(loan.date))}</p>
          </div>
          ${status}
        </div>
        <p>Valor emprestado: <strong>${money(loan.amount)}</strong></p>
        <p>Juros: ${Number(loan.rate)}%</p>
        <p>Total previsto: <strong>${money(loan.total)}</strong></p>
        <p>Recebido: <strong>${money(paid)}</strong></p>
        <p>Saldo pendente: <strong>${money(balance)}</strong></p>
        <p>Vencimento: ${escapeHTML(formatDate(loan.dueDate))}</p>
        ${loan.notes ? `<p>Observações: ${escapeHTML(loan.notes)}</p>` : ""}
        ${balance > 0 ? `<button type="button" data-payment-loan="${escapeHTML(loan.id)}">＋ Registrar pagamento</button>` : ""}
      </article>
    `;
  }).join("");
}

function parseMoneyInput(value) {
  const trimmed = value.trim().replace(/\s/g, "");
  if (!trimmed) return NaN;

  if (trimmed.includes(",") && trimmed.includes(".")) {
    return Number(trimmed.replace(/\./g, "").replace(",", "."));
  }

  if (trimmed.includes(",")) return Number(trimmed.replace(",", "."));
  return Number(trimmed);
}

function registerPayment(loanId) {
  const loan = myRows(KEYS.loans).find(item => item.id === loanId);
  if (!loan) return;

  const balance = balanceForLoan(loan);
  const input = prompt(
    `Cliente: ${customerName(loan.customerId)}\nSaldo pendente: ${money(balance)}\nDigite o valor recebido:`
  );

  if (input === null) return;

  const amount = parseMoneyInput(input);

  if (!Number.isFinite(amount) || amount <= 0 || amount > balance + 0.000001) {
    showNotice("Informe um valor válido, até o saldo pendente.", true);
    return;
  }

  const payments = myRows(KEYS.payments);
  payments.push({
    id: makeId(),
    userId: currentUser().id,
    loanId,
    amount,
    date: today(),
    createdAt: new Date().toISOString()
  });

  if (!saveMyRows(KEYS.payments, payments)) return;

  renderLoans();
  renderDashboard();
  renderHistory();
  showNotice("Pagamento registrado com sucesso.");
}

/* GASTOS */
function addExpense(event) {
  event.preventDefault();

  const description = $("expense-description").value.trim();
  const amount = Number($("expense-amount").value);
  const date = $("expense-date").value;

  if (!description || !date || !Number.isFinite(amount) || amount <= 0) {
    showNotice("Preencha corretamente a descrição, o valor e a data.", true);
    return;
  }

  const expenses = myRows(KEYS.expenses);
  expenses.push({
    id: makeId(),
    userId: currentUser().id,
    description,
    amount,
    date,
    createdAt: new Date().toISOString()
  });

  if (!saveMyRows(KEYS.expenses, expenses)) return;

  $("expense-form").reset();
  $("expense-date").value = today();
  renderExpenses();
  renderDashboard();
  renderHistory();
  showNotice("Gasto registrado com sucesso.");
}

function renderExpenses() {
  const container = $("expense-list");
  if (!container) return;

  const expenses = myRows(KEYS.expenses).sort((a, b) => b.date.localeCompare(a.date));

  if (!expenses.length) {
    container.innerHTML = '<p class="empty-state">Nenhum gasto registrado.</p>';
    return;
  }

  container.innerHTML = expenses.map(expense => `
    <article class="expense-card">
      <h3>${escapeHTML(expense.description)}</h3>
      <p>Valor: <strong>${money(expense.amount)}</strong></p>
      <p>Data: ${escapeHTML(formatDate(expense.date))}</p>
      <button type="button" data-delete-expense="${escapeHTML(expense.id)}">Excluir gasto</button>
    </article>
  `).join("");
}

function deleteExpense(expenseId) {
  if (!confirm("Deseja excluir este gasto?")) return;

  saveMyRows(
    KEYS.expenses,
    myRows(KEYS.expenses).filter(expense => expense.id !== expenseId)
  );

  renderExpenses();
  renderDashboard();
  renderHistory();
  showNotice("Gasto excluído.");
}

/* PAINEL E HISTÓRICO */
function renderDashboard() {
  const loans = myRows(KEYS.loans);
  const customers = myRows(KEYS.customers);
  const payments = myRows(KEYS.payments);

  const totalLoaned = loans.reduce((sum, loan) => sum + Number(loan.amount || 0), 0);
  const totalReceived = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const totalPending = loans.reduce((sum, loan) => sum + balanceForLoan(loan), 0);

  $("total-loaned").textContent = money(totalLoaned);
  $("total-received").textContent = money(totalReceived);
  $("total-pending").textContent = money(totalPending);
  $("total-customers").textContent = String(customers.length);

  const recent = $("dashboard-recent");
  if (!recent) return;

  const latestLoans = [...loans]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);

  if (!latestLoans.length) {
    recent.innerHTML = '<p class="empty-state">Nenhum empréstimo registrado.</p>';
    return;
  }

  recent.innerHTML = latestLoans.map(loan => `
    <div class="recent-row">
      <span class="customer-avatar">${escapeHTML(
        customerName(loan.customerId)
          .split(/\s+/)
          .slice(0, 2)
          .map(word => word[0] || "")
          .join("")
          .toUpperCase()
      )}</span>
      <span class="recent-info">
        <b>${escapeHTML(customerName(loan.customerId))}</b>
        <small>${escapeHTML(formatDate(loan.date))} · ${balanceForLoan(loan) <= 0 ? "Pago" : "Em andamento"}</small>
      </span>
      <span class="recent-amount">
        ${money(loan.total)}
        <small>Saldo: ${money(balanceForLoan(loan))}</small>
      </span>
    </div>
  `).join("");
}

function renderHistory() {
  const container = $("history-list");
  if (!container) return;

  const loans = myRows(KEYS.loans);
  const payments = myRows(KEYS.payments);
  const expenses = myRows(KEYS.expenses);

  const items = [
    ...loans.map(loan => ({
      date: loan.date,
      type: "Empréstimo",
      description: customerName(loan.customerId),
      amount: loan.amount,
      sign: "out"
    })),
    ...payments.map(payment => ({
      date: payment.date,
      type: "Pagamento recebido",
      description: customerName(loans.find(loan => loan.id === payment.loanId)?.customerId),
      amount: payment.amount,
      sign: "in"
    })),
    ...expenses.map(expense => ({
      date: expense.date,
      type: "Gasto",
      description: expense.description,
      amount: expense.amount,
      sign: "out"
    }))
  ].sort((a, b) => b.date.localeCompare(a.date));

  if (!items.length) {
    container.innerHTML = '<p class="empty-state">Nenhuma movimentação registrada.</p>';
    return;
  }

  container.innerHTML = `
    <div class="table-container">
      <table>
        <thead>
          <tr><th>Data</th><th>Tipo</th><th>Descrição</th><th>Valor</th></tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td>${escapeHTML(formatDate(item.date))}</td>
              <td>${escapeHTML(item.type)}</td>
              <td>${escapeHTML(item.description)}</td>
              <td>
                <strong class="${item.sign === "in" ? "money-in" : "money-out"}">
                  ${item.sign === "in" ? "+" : "−"} ${money(item.amount)}
                </strong>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderAll() {
  renderDashboard();
  renderCustomers();
  renderCustomerOptions();
  renderLoans();
  renderExpenses();
  renderHistory();
}

/* INICIALIZAÇÃO */
document.addEventListener("DOMContentLoaded", () => {
  $("header-date").textContent = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date());

  $("show-register").addEventListener("click", () => {
    $("login-error").textContent = "";
    $("register-error").textContent = "";
    showScreen("register");
  });

  $("show-login").addEventListener("click", () => {
    $("login-error").textContent = "";
    $("register-error").textContent = "";
    showScreen("login");
  });

  $("register-form").addEventListener("submit", register);
  $("login-form").addEventListener("submit", login);
  $("logout-button").addEventListener("click", logout);
  $("customer-form").addEventListener("submit", addCustomer);
  $("loan-form").addEventListener("submit", addLoan);
  $("expense-form").addEventListener("submit", addExpense);

  $("customer-search").addEventListener("input", renderCustomers);
  $("loan-amount").addEventListener("input", updateLoanTotal);
  $("loan-interest").addEventListener("change", updateLoanTotal);

  document.querySelectorAll("[data-page]").forEach(button => {
    button.addEventListener("click", () => showPage(button.dataset.page));
  });

  document.querySelectorAll("[data-open-page]").forEach(button => {
    button.addEventListener("click", () => showPage(button.dataset.openPage));
  });

  document.addEventListener("click", event => {
    const deleteCustomerButton = event.target.closest("[data-delete-customer]");
    const paymentButton = event.target.closest("[data-payment-loan]");
    const deleteExpenseButton = event.target.closest("[data-delete-expense]");

    if (deleteCustomerButton) {
      deleteCustomer(deleteCustomerButton.dataset.deleteCustomer);
    }

    if (paymentButton) {
      registerPayment(paymentButton.dataset.paymentLoan);
    }

    if (deleteExpenseButton) {
      deleteExpense(deleteExpenseButton.dataset.deleteExpense);
    }
  });

  $("loan-date").value = today();
  $("expense-date").value = today();
  updateLoanTotal();

  if (currentUser()) {
    enterApp();
  } else {
    showScreen("login");
  }
});