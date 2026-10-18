"use strict";

/*
 * CONTROLE DE EMPRÉSTIMOS
 * Compatível com o index.html enviado.
 * Os dados ficam salvos localmente neste navegador.
 * Não use dados reais de clientes sem configurar autenticação
 * e banco de dados seguros.
 */

const KEYS = {
  users: "ce_users_v1",
  session: "ce_session_v1",
  customers: "ce_customers_v1",
  loans: "ce_loans_v1",
  expenses: "ce_expenses_v1",
  payments: "ce_payments_v1"
};

const $ = id => document.getElementById(id);

function read(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function makeId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now() + "-" + Math.random().toString(36).slice(2);
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function today() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

function message(text, error = false) {
  let element = $("app-notice");

  if (!element) {
    element = document.createElement("p");
    element.id = "app-notice";
    element.setAttribute("role", "status");
    element.style.cssText =
      "padding:12px;margin:10px 0;border-radius:8px;" +
      "background:#14213d;color:white;";
    document.querySelector("main").prepend(element);
  }

  element.textContent = text;
  element.style.background = error ? "#9b2226" : "#14213d";
}

function currentUser() {
  const session = read(KEYS.session, null);
  if (!session) return null;

  return read(KEYS.users, []).find(user =>
    user.id === session.userId
  ) || null;
}

function myRows(key) {
  const user = currentUser();
  if (!user) return [];

  return read(key, []).filter(row => row.userId === user.id);
}

function saveMyRows(key, rows) {
  const user = currentUser();
  if (!user) return;

  const all = read(key, []);
  write(key, [
    ...all.filter(row => row.userId !== user.id),
    ...rows
  ]);
}

function showScreen(screen) {
  $("login-screen").hidden = screen !== "login";
  $("register-screen").hidden = screen !== "register";
  $("app-shell").hidden = screen !== "app";
}

function showPage(page) {
  document.querySelectorAll("#app-shell .page").forEach(section => {
    section.hidden = section.id !== "page-" + page;
  });

  document.querySelectorAll("[data-page]").forEach(button => {
    button.setAttribute(
      "aria-current",
      button.dataset.page === page ? "page" : "false"
    );
  });

  if (page === "dashboard") renderDashboard();
  if (page === "customers") renderCustomers();
  if (page === "installments") {
    renderCustomerOptions();
    renderLoans();
    updateLoanTotal();
  }
  if (page === "expenses") renderExpenses();
  if (page === "history") renderHistory();
}

async function hashPassword(password) {
  if (!crypto.subtle) return null;

  const bytes = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(hash))
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function register(event) {
  event.preventDefault();

  const name = $("register-name").value.trim();
  const email = $("register-email").value.trim().toLowerCase();
  const password = $("register-password").value;
  const error = $("register-error");

  error.textContent = "";

  if (!name || !email || password.length < 8) {
    error.textContent =
      "Preencha os campos e use uma senha de pelo menos 8 caracteres.";
    return;
  }

  if (!crypto.subtle) {
    error.textContent =
      "Abra o aplicativo por HTTPS para realizar o cadastro de teste.";
    return;
  }

  const users = read(KEYS.users, []);

  if (users.some(user => user.email === email)) {
    error.textContent = "Este e-mail já está cadastrado neste navegador.";
    return;
  }

  const passwordDigest = await hashPassword(password);

  const user = {
    id: makeId(),
    name,
    email,
    passwordDigest,
    createdAt: new Date().toISOString()
  };

  users.push(user);
  write(KEYS.users, users);
  write(KEYS.session, { userId: user.id });

  $("register-form").reset();

  enterApp();
  message(
    "Cadastro de teste concluído neste navegador. Configure autenticação segura para uso real."
  );
}

async function login(event) {
  event.preventDefault();

  const email = $("login-email").value.trim().toLowerCase();
  const password = $("login-password").value;
  const error = $("login-error");

  error.textContent = "";

  const passwordDigest = await hashPassword(password);

  const user = read(KEYS.users, []).find(item =>
    item.email === email &&
    item.passwordDigest === passwordDigest
  );

  if (!user) {
    error.textContent =
      "E-mail ou senha incorretos, ou conta não cadastrada neste navegador.";
    return;
  }

  write(KEYS.session, { userId: user.id });
  $("login-form").reset();

  enterApp();
  message("Bem-vindo(a), " + user.name + "!");
}

function enterApp() {
  showScreen("app");
  renderAll();
  showPage("dashboard");
}

function logout() {
  localStorage.removeItem(KEYS.session);
  showScreen("login");
  message("Sessão encerrada.");
}

/* CLIENTES */

function addCustomer(event) {
  event.preventDefault();

  const name = $("customer-name").value.trim();
  const phone = $("customer-phone").value.trim();

  if (!name || !phone) {
    message("Informe o nome e o telefone do cliente.", true);
    return;
  }

  const customers = myRows(KEYS.customers);

  customers.push({
    id: makeId(),
    userId: currentUser().id,
    name,
    phone,
    location: $("customer-location").value.trim(),
    document: $("customer-document").value.trim(),
    createdAt: new Date().toISOString()
  });

  saveMyRows(KEYS.customers, customers);
  $("customer-form").reset();

  renderCustomers();
  renderCustomerOptions();
  renderDashboard();

  message("Cliente cadastrado com sucesso.");
}

function renderCustomers() {
  const tbody = $("customer-list");
  if (!tbody) return;

  const query = $("customer-search").value
    .trim()
    .toLowerCase();

  const customers = myRows(KEYS.customers)
    .filter(customer =>
      (
        customer.name + " " +
        customer.phone + " " +
        customer.location
      ).toLowerCase().includes(query)
    )
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  if (!customers.length) {
    tbody.innerHTML =
      '<tr><td colspan="4">Nenhum cliente encontrado.</td></tr>';
    return;
  }

  tbody.innerHTML = customers.map(customer => `
    <tr>
      <td>${escapeHTML(customer.name)}</td>
      <td>${escapeHTML(customer.phone)}</td>
      <td>${escapeHTML(customer.location || "—")}</td>
      <td>
        <button type="button"
          data-delete-customer="${escapeHTML(customer.id)}">
          Excluir
        </button>
      </td>
    </tr>
  `).join("");
}

function deleteCustomer(customerId) {
  const loans = myRows(KEYS.loans);

  if (loans.some(loan => loan.customerId === customerId)) {
    message(
      "Este cliente possui empréstimos registrados e não pode ser excluído.",
      true
    );
    return;
  }

  if (!confirm("Deseja excluir este cliente?")) return;

  saveMyRows(
    KEYS.customers,
    myRows(KEYS.customers).filter(c => c.id !== customerId)
  );

  renderCustomers();
  renderCustomerOptions();
  renderDashboard();
  message("Cliente excluído.");
}

function renderCustomerOptions() {
  const select = $("loan-customer");
  if (!select) return;

  const previous = select.value;
  const customers = myRows(KEYS.customers)
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  select.innerHTML =
    '<option value="">Selecione um cliente</option>' +
    customers.map(customer => `
      <option value="${escapeHTML(customer.id)}">
        ${escapeHTML(customer.name)}
      </option>
    `).join("");

  if (customers.some(c => c.id === previous)) {
    select.value = previous;
  }
}

/* EMPRÉSTIMOS */

function updateLoanTotal() {
  const amount = Number($("loan-amount").value || 0);
  const rate = Number($("loan-interest").value || 0);

  $("loan-total").textContent = money(
    amount + amount * rate / 100
  );
}

function addLoan(event) {
  event.preventDefault();

  const customerId = $("loan-customer").value;
  const customer = myRows(KEYS.customers)
    .find(c => c.id === customerId);

  const amount = Number($("loan-amount").value);
  const rate = Number($("loan-interest").value);
  const date = $("loan-date").value;
  const dueDate = $("loan-due-date").value;

  if (!customer) {
    message("Selecione um cliente cadastrado.", true);
    return;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    message("Informe um valor válido.", true);
    return;
  }

  if (!Number.isFinite(rate) || rate < 0 || rate > 50) {
    message("Confira a porcentagem dos juros.", true);
    return;
  }

  if (!date || !dueDate || dueDate < date) {
    message("Confira as datas do empréstimo.", true);
    return;
  }

  const loan = {
    id: makeId(),
    userId: currentUser().id,
    customerId,
    amount,
    rate,
    total: amount * (1 + rate / 100),
    date,
    dueDate,
    notes: $("loan-notes").value.trim(),
    createdAt: new Date().toISOString()
  };

  const loans = myRows(KEYS.loans);
  loans.push(loan);
  saveMyRows(KEYS.loans, loans);

  $("loan-form").reset();
  $("loan-date").value = today();

  updateLoanTotal();
  renderLoans();
  renderDashboard();
  renderHistory();

  message("Empréstimo registrado com sucesso.");
}

function customerName(customerId) {
  return myRows(KEYS.customers)
    .find(c => c.id === customerId)?.name || "Cliente removido";
}

function paidForLoan(loanId) {
  return myRows(KEYS.payments)
    .filter(p => p.loanId === loanId)
    .reduce((sum, p) => sum + p.amount, 0);
}

function balanceForLoan(loan) {
  return Math.max(0, loan.total - paidForLoan(loan.id));
}

function renderLoans() {
  const container = $("loan-list");
  if (!container) return;

  const loans = myRows(KEYS.loans)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (!loans.length) {
    container.innerHTML = "<p>Nenhum empréstimo registrado.</p>";
    return;
  }

  container.innerHTML = loans.map(loan => {
    const paid = paidForLoan(loan.id);
    const balance = balanceForLoan(loan);

    return `
      <article class="loan-card">
        <h3>${escapeHTML(customerName(loan.customerId))}</h3>
        <p>Valor emprestado: ${money(loan.amount)}</p>
        <p>Juros: ${loan.rate}%</p>
        <p>Total previsto: ${money(loan.total)}</p>
        <p>Recebido: ${money(paid)}</p>
        <p>Saldo pendente: ${money(balance)}</p>
        <p>Data: ${escapeHTML(loan.date)}</p>
        <p>Vencimento: ${escapeHTML(loan.dueDate)}</p>
        <p>Status: <strong>${balance <= 0 ? "Pago" : "Pendente"}</strong></p>
        ${loan.notes ? `<p>Observações: ${escapeHTML(loan.notes)}</p>` : ""}
        ${balance > 0 ? `
          <button type="button" data-payment-loan="${escapeHTML(loan.id)}">
            Registrar pagamento
          </button>
        ` : ""}
      </article>
    `;
  }).join("");
}

function registerPayment(loanId) {
  const loan = myRows(KEYS.loans)
    .find(item => item.id === loanId);

  if (!loan) return;

  const balance = balanceForLoan(loan);
  const input = prompt(
    "Saldo pendente: " + money(balance) +
    "\nDigite o valor recebido:"
  );

  if (input === null) return;

  const amount = Number(
    input.trim().replace(/\./g, "").replace(",", ".")
  );

  if (
    !Number.isFinite(amount) ||
    amount <= 0 ||
    amount > balance + 0.000001
  ) {
    message("Informe um valor válido, até o saldo pendente.", true);
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

  saveMyRows(KEYS.payments, payments);

  renderLoans();
  renderDashboard();
  renderHistory();

  message("Pagamento registrado com sucesso.");
}

/* GASTOS */

function addExpense(event) {
  event.preventDefault();

  const description = $("expense-description").value.trim();
  const amount = Number($("expense-amount").value);
  const date = $("expense-date").value;

  if (
    !description ||
    !date ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    message("Preencha corretamente a descrição, o valor e a data.", true);
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

  saveMyRows(KEYS.expenses, expenses);

  $("expense-form").reset();
  $("expense-date").value = today();

  renderExpenses();
  renderDashboard();
  renderHistory();

  message("Gasto registrado com sucesso.");
}

function renderExpenses() {
  const container = $("expense-list");
  if (!container) return;

  const expenses = myRows(KEYS.expenses)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (!expenses.length) {
    container.innerHTML = "<p>Nenhum gasto registrado.</p>";
    return;
  }

  container.innerHTML = expenses.map(expense => `
    <article class="expense-card">
      <h3>${escapeHTML(expense.description)}</h3>
      <p>Valor: ${money(expense.amount)}</p>
      <p>Data: ${escapeHTML(expense.date)}</p>
      <button type="button"
        data-delete-expense="${escapeHTML(expense.id)}">
        Excluir gasto
      </button>
    </article>
  `).join("");
}

function deleteExpense(expenseId) {
  if (!confirm("Deseja excluir este gasto?")) return;

  saveMyRows(
    KEYS.expenses,
    myRows(KEYS.expenses).filter(e => e.id !== expenseId)
  );

  renderExpenses();
  renderDashboard();
  renderHistory();
  message("Gasto excluído.");
}

/* PAINEL E HISTÓRICO */

function renderDashboard() {
  const loans = myRows(KEYS.loans);
  const customers = myRows(KEYS.customers);
  const payments = myRows(KEYS.payments);

  const totalLoaned = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalReceived = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalPending = loans.reduce(
    (sum, loan) => sum + balanceForLoan(loan),
    0
  );

  $("total-loaned").textContent = money(totalLoaned);
  $("total-received").textContent = money(totalReceived);
  $("total-pending").textContent = money(totalPending);
  $("total-customers").textContent = String(customers.length);
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
      amount: loan.amount
    })),
    ...payments.map(payment => ({
      date: payment.date,
      type: "Pagamento recebido",
      description: customerName(
        loans.find(loan => loan.id === payment.loanId)?.customerId
      ),
      amount: payment.amount
    })),
    ...expenses.map(expense => ({
      date: expense.date,
      type: "Gasto",
      description: expense.description,
      amount: expense.amount
    }))
  ].sort((a, b) => b.date.localeCompare(a.date));

  if (!items.length) {
    container.innerHTML = "<p>Nenhuma movimentação registrada.</p>";
    return;
  }

  container.innerHTML = `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipo</th>
            <th>Descrição</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td>${escapeHTML(item.date)}</td>
              <td>${escapeHTML(item.type)}</td>
              <td>${escapeHTML(item.description)}</td>
              <td>${money(item.amount)}</td>
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

  console.log("Controle de Empréstimos carregado.");
});