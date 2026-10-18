"use strict";

/*
 * CrediFácil — controle de empréstimos.
 * Os dados ficam guardados no navegador deste aparelho.
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
  } catch (error) {
    console.error("Erro ao ler dados:", error);
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error("Não foi possível salvar os dados:", error);
    showNotice(
      "Não foi possível salvar os dados neste navegador.",
      true
    );
    return false;
  }
}

function makeId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return Date.now() + "-" + Math.random().toString(36).slice(2);
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

function formatDate(value) {
  if (!value) return "—";

  const parts = value.split("-");

  return parts.length === 3
    ? `${parts[2]}/${parts[1]}/${parts[0]}`
    : value;
}

function today() {
  const date = new Date();

  date.setMinutes(
    date.getMinutes() - date.getTimezoneOffset()
  );

  return date.toISOString().slice(0, 10);
}

function showNotice(message, error = false) {
  const element = $("app-notice");

  if (!element) return;

  element.hidden = false;
  element.textContent = message;
  element.classList.toggle("error", error);
}

function currentUser() {
  const session = read(KEYS.session, null);

  if (!session) return null;

  return read(KEYS.users, []).find(
    user => user.id === session.userId
  ) || null;
}

function myRows(key) {
  const user = currentUser();

  if (!user) return [];

  return read(key, []).filter(
    row => row.userId === user.id
  );
}

function saveMyRows(key, rows) {
  const user = currentUser();

  if (!user) return false;

  const all = read(key, []);

  const otherUsersRows = all.filter(
    row => row.userId !== user.id
  );

  return write(key, [...otherUsersRows, ...rows]);
}

function showScreen(screen) {
  $("login-screen").hidden = screen !== "login";
  $("register-screen").hidden = screen !== "register";
  $("app-shell").hidden = screen !== "app";
}

const pageTitles = {
  dashboard: "Painel principal",
  customers: "Clientes",
  installments: "Empréstimos",
  expenses: "Gastos",
  history: "Histórico financeiro"
};

function showPage(page) {
  if (!pageTitles[page]) return;

  document.querySelectorAll("#app-shell .page").forEach(section => {
    section.hidden = section.id !== "page-" + page;
  });

  document.querySelectorAll("[data-page]").forEach(button => {
    const active = button.dataset.page === page;

    button.classList.toggle("active", active);

    if (active) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
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

/*
 * Cadastro e login:
 * Em HTTPS, usamos SHA-256.
 * Ao abrir o HTML diretamente no notebook, alguns navegadores não
 * disponibilizam crypto.subtle. Nesse caso, o cadastro local continua
 * funcionando com o prefixo "local:".
 *
 * Este sistema é uma demonstração local, não autenticação de servidor.
 */

async function hashPassword(password) {
  if (!globalThis.crypto?.subtle) {
    return "local:" + password;
  }

  const bytes = new TextEncoder().encode(password);

  const hash = await globalThis.crypto.subtle.digest(
    "SHA-256",
    bytes
  );

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

  const users = read(KEYS.users, []);

  if (users.some(user => user.email === email)) {
    error.textContent =
      "Este e-mail já está cadastrado neste navegador.";
    return;
  }

  let passwordDigest;

  try {
    passwordDigest = await hashPassword(password);
  } catch (exception) {
    console.error("Erro ao preparar a senha:", exception);
    error.textContent =
      "Não foi possível processar a senha. Atualize a página e tente novamente.";
    return;
  }

  const user = {
    id: makeId(),
    name,
    email,
    passwordDigest,
    createdAt: new Date().toISOString()
  };

  users.push(user);

  if (!write(KEYS.users, users)) {
    error.textContent =
      "Não foi possível salvar a conta neste navegador.";
    return;
  }

  if (!write(KEYS.session, { userId: user.id })) {
    error.textContent =
      "A conta foi criada, mas a sessão não pôde ser salva. Tente entrar novamente.";
    return;
  }

  $("register-form").reset();

  enterApp();

  showNotice(
    "Conta criada com sucesso neste navegador."
  );
}

async function login(event) {
  event.preventDefault();

  const email = $("login-email").value.trim().toLowerCase();
  const password = $("login-password").value;
  const error = $("login-error");

  error.textContent = "";

  let passwordDigest;

  try {
    passwordDigest = await hashPassword(password);
  } catch (exception) {
    console.error("Erro ao verificar a senha:", exception);
    error.textContent =
      "Não foi possível verificar a senha. Atualize a página e tente novamente.";
    return;
  }

  const user = read(KEYS.users, []).find(item =>
    item.email === email &&
    item.passwordDigest === passwordDigest
  );

  if (!user) {
    error.textContent =
      "E-mail ou senha incorretos. Use a conta cadastrada neste mesmo navegador e endereço do site.";
    return;
  }

  if (!write(KEYS.session, { userId: user.id })) {
    error.textContent =
      "Não foi possível manter sua sessão neste navegador.";
    return;
  }

  $("login-form").reset();

  enterApp();

  showNotice("Bem-vindo(a), " + user.name + "!");
}

function enterApp() {
  showScreen("app");

  const user = currentUser();

  $("user-avatar").textContent =
    user?.name?.trim()?.split(/\s+/)
      .slice(0, 2)
      .map(part => part[0])
      .join("")
      .toUpperCase() || "CF";

  renderAll();
  showPage("dashboard");
}

function logout() {
  try {
    localStorage.removeItem(KEYS.session);
  } catch (error) {
    console.error("Não foi possível encerrar a sessão:", error);
  }

  showScreen("login");
}

/* =========================
   CLIENTES
========================= */

function addCustomer(event) {
  event.preventDefault();

  const user = currentUser();

  if (!user) {
    showScreen("login");
    return;
  }

  const name = $("customer-name").value.trim();
  const phone = $("customer-phone").value.trim();

  if (!name || !phone) {
    showNotice("Informe o nome e o telefone do cliente.", true);
    return;
  }

  const customers = myRows(KEYS.customers);

  customers.push({
    id: makeId(),
    userId: user.id,
    name,
    phone,
    location: $("customer-location").value.trim(),
    document: $("customer-document").value.trim(),
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
  const tbody = $("customer-list");

  if (!tbody) return;

  const query = $("customer-search").value.trim().toLowerCase();
  const allCustomers = myRows(KEYS.customers);

  const customers = allCustomers
    .filter(customer =>
      `${customer.name} ${customer.phone} ${customer.location || ""}`
        .toLowerCase()
        .includes(query)
    )
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  $("customer-count").textContent =
    `${allCustomers.length} cliente${allCustomers.length === 1 ? "" : "s"} cadastrado${allCustomers.length === 1 ? "" : "s"}`;

  if (!customers.length) {
    tbody.innerHTML =
      '<tr><td colspan="4">Nenhum cliente encontrado.</td></tr>';
    return;
  }

  tbody.innerHTML = customers.map(customer => `
    <tr>
      <td><strong>${escapeHTML(customer.name)}</strong></td>
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
  if (myRows(KEYS.loans).some(
    loan => loan.customerId === customerId
  )) {
    showNotice(
      "Este cliente possui empréstimos registrados e não pode ser excluído.",
      true
    );
    return;
  }

  if (!confirm("Deseja excluir este cliente?")) return;

  saveMyRows(
    KEYS.customers,
    myRows(KEYS.customers).filter(
      customer => customer.id !== customerId
    )
  );

  renderCustomers();
  renderCustomerOptions();
  renderDashboard();

  showNotice("Cliente excluído.");
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

  if (customers.some(customer => customer.id === previous)) {
    select.value = previous;
  }
}

/* =========================
   EMPRÉSTIMOS E PAGAMENTOS
========================= */

function updateLoanTotal() {
  const amount = Number($("loan-amount").value || 0);
  const rate = Number($("loan-interest").value || 0);

  $("loan-total").textContent =
    money(amount + amount * rate / 100);
}

function addLoan(event) {
  event.preventDefault();

  const user = currentUser();

  if (!user) {
    showScreen("login");
    return;
  }

  const customerId = $("loan-customer").value;

  const customer = myRows(KEYS.customers).find(
    item => item.id === customerId
  );

  const amount = Number($("loan-amount").value);
  const rate = Number($("loan-interest").value);
  const date = $("loan-date").value;
  const dueDate = $("loan-due-date").value;

  if (!customer) {
    showNotice("Selecione um cliente cadastrado.", true);
    return;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    showNotice("Informe um valor válido.", true);
    return;
  }

  if (!Number.isFinite(rate) || rate < 0 || rate > 50) {
    showNotice("Confira a porcentagem dos juros.", true);
    return;
  }

  if (!date || !dueDate || dueDate < date) {
    showNotice(
      "O vencimento deve ser igual ou posterior à data do empréstimo.",
      true
    );
    return;
  }

  const loan = {
    id: makeId(),
    userId: user.id,
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

  if (!saveMyRows(KEYS.loans, loans)) return;

  $("loan-form").reset();
  $("loan-date").value = today();
  $("loan-due-date").value = "";

  updateLoanTotal();
  renderLoans();
  renderDashboard();
  renderHistory();

  showNotice("Empréstimo registrado com sucesso.");
}

function customerName(customerId) {
  return myRows(KEYS.customers).find(
    customer => customer.id === customerId
  )?.name || "Cliente removido";
}

function paidForLoan(loanId) {
  return myRows(KEYS.payments)
    .filter(payment => payment.loanId === loanId)
    .reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    );
}

function balanceForLoan(loan) {
  return Math.max(
    0,
    Number(loan.total || 0) - paidForLoan(loan.id)
  );
}

function renderLoans() {
  const container = $("loan-list");

  if (!container) return;

  const loans = myRows(KEYS.loans)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (!loans.length) {
    container.innerHTML = `
      <p class="empty-state">
        Nenhum empréstimo registrado. Cadastre um cliente antes de criar um empréstimo.
      </p>
    `;
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

        ${loan.notes
          ? `<p>Observações: ${escapeHTML(loan.notes)}</p>`
          : ""}

        ${balance > 0
          ? `<button type="button" data-payment-loan="${escapeHTML(loan.id)}">＋ Registrar pagamento</button>`
          : ""}
      </article>
    `;
  }).join("");
}

function parseMoneyInput(value) {
  const trimmed = value.trim().replace(/\s/g, "");

  if (!trimmed) return NaN;

  if (trimmed.includes(",") && trimmed.includes(".")) {
    return Number(
      trimmed.replace(/\./g, "").replace(",", ".")
    );
  }

  if (trimmed.includes(",")) {
    return Number(trimmed.replace(",", "."));
  }

  return Number(trimmed);
}

function registerPayment(loanId) {
  const user = currentUser();

  if (!user) {
    showScreen("login");
    return;
  }

  const loan = myRows(KEYS.loans).find(
    item => item.id === loanId
  );

  if (!loan) return;

  const balance = balanceForLoan(loan);

  const input = prompt(
    `Cliente: ${customerName(loan.customerId)}\n` +
    `Saldo pendente: ${money(balance)}\n` +
    "Digite o valor recebido:"
  );

  if (input === null) return;

  const amount = parseMoneyInput(input);

  if (
    !Number.isFinite(amount) ||
    amount <= 0 ||
    amount > balance + 0.000001
  ) {
    showNotice(
      "Informe um valor válido, até o saldo pendente.",
      true
    );
    return;
  }

  const payments = myRows(KEYS.payments);

  payments.push({
    id: makeId(),
    userId: user.id,
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

/*
 * Corrigir pagamento:
 * permite escolher o empréstimo correto quando um pagamento foi
 * lançado no cliente errado, e também corrigir o valor.
 */

function editPayment(paymentId) {
  const payments = myRows(KEYS.payments);

  const payment = payments.find(
    item => item.id === paymentId
  );

  if (!payment) return;

  const loans = myRows(KEYS.loans);

  if (!loans.length) {
    showNotice(
      "Não há empréstimos cadastrados para vincular este pagamento.",
      true
    );
    return;
  }

  const options = loans.map((loan, index) => {
    const balance = balanceForLoan(loan) +
      (loan.id === payment.loanId ? payment.amount : 0);

    return `${index + 1}. ${customerName(loan.customerId)} — vencimento ${formatDate(loan.dueDate)} — saldo ${money(balance)}`;
  }).join("\n");

  const currentIndex = Math.max(
    0,
    loans.findIndex(loan => loan.id === payment.loanId)
  );

  const choice = prompt(
    "Corrigir pagamento. Digite o número do empréstimo correto:\n\n" +
    options,
    String(currentIndex + 1)
  );

  if (choice === null) return;

  const index = Number.parseInt(choice, 10) - 1;

  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index >= loans.length
  ) {
    showNotice("Número de empréstimo inválido.", true);
    return;
  }

  const targetLoan = loans[index];

  const currentBalance = balanceForLoan(targetLoan) +
    (targetLoan.id === payment.loanId ? payment.amount : 0);

  const amountText = prompt(
    "Informe o valor correto do pagamento:",
    String(payment.amount).replace(".", ",")
  );

  if (amountText === null) return;

  const amount = parseMoneyInput(amountText);

  if (
    !Number.isFinite(amount) ||
    amount <= 0 ||
    amount > currentBalance + 0.000001
  ) {
    showNotice(
      "Valor inválido ou maior que o saldo pendente do empréstimo escolhido.",
      true
    );
    return;
  }

  const updated = payments.map(item =>
    item.id === paymentId
      ? {
          ...item,
          loanId: targetLoan.id,
          amount,
          date: item.date || today(),
          updatedAt: new Date().toISOString()
        }
      : item
  );

  if (!saveMyRows(KEYS.payments, updated)) return;

  renderLoans();
  renderDashboard();
  renderHistory();

  showNotice(
    "Pagamento corrigido e vinculado ao empréstimo escolhido."
  );
}

function deletePayment(paymentId) {
  if (!confirm(
    "Deseja excluir este pagamento? O saldo do empréstimo será atualizado."
  )) {
    return;
  }

  const payments = myRows(KEYS.payments).filter(
    payment => payment.id !== paymentId
  );

  if (!saveMyRows(KEYS.payments, payments)) return;

  renderLoans();
  renderDashboard();
  renderHistory();

  showNotice("Pagamento excluído.");
}

/* =========================
   GASTOS
========================= */

function addExpense(event) {
  event.preventDefault();

  const user = currentUser();

  if (!user) {
    showScreen("login");
    return;
  }

  const description = $("expense-description").value.trim();
  const amount = Number($("expense-amount").value);
  const date = $("expense-date").value;

  if (
    !description ||
    !date ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    showNotice(
      "Preencha corretamente a descrição, o valor e a data.",
      true
    );
    return;
  }

  const expenses = myRows(KEYS.expenses);

  expenses.push({
    id: makeId(),
    userId: user.id,
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

  const expenses = myRows(KEYS.expenses)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (!expenses.length) {
    container.innerHTML =
      '<p class="empty-state">Nenhum gasto registrado.</p>';
    return;
  }

  container.innerHTML = expenses.map(expense => `
    <article class="expense-card">
      <h3>${escapeHTML(expense.description)}</h3>
      <p>Valor: <strong>${money(expense.amount)}</strong></p>
      <p>Data: ${escapeHTML(formatDate(expense.date))}</p>
      <button type="button"
        data-delete-expense="${escapeHTML(expense.id)}">
        Excluir gasto
      </button>
    </article>
  `).join("");
}

function deleteExpense(expenseId) {
  if (!confirm("Deseja excluir este gasto?")) return;

  const expenses = myRows(KEYS.expenses).filter(
    expense => expense.id !== expenseId
  );

  if (!saveMyRows(KEYS.expenses, expenses)) return;

  renderExpenses();
  renderDashboard();
  renderHistory();

  showNotice("Gasto excluído.");
}

/* =========================
   PAINEL E HISTÓRICO
========================= */

function renderDashboard() {
  const loans = myRows(KEYS.loans);
  const customers = myRows(KEYS.customers);
  const payments = myRows(KEYS.payments);

  const totalLoaned = loans.reduce(
    (sum, loan) => sum + Number(loan.amount || 0),
    0
  );

  const totalReceived = payments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0
  );

  const totalPending = loans.reduce(
    (sum, loan) => sum + balanceForLoan(loan),
    0
  );

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
    recent.innerHTML =
      '<p class="empty-state">Nenhum empréstimo registrado.</p>';
    return;
  }

  recent.innerHTML = latestLoans.map(loan => `
    <div class="recent-row">
      <span class="customer-avatar">
        ${escapeHTML(
          customerName(loan.customerId)
            .split(/\s+/)
            .slice(0, 2)
            .map(word => word[0] || "")
            .join("")
            .toUpperCase()
        )}
      </span>

      <span class="recent-info">
        <b>${escapeHTML(customerName(loan.customerId))}</b>
        <small>
          ${escapeHTML(formatDate(loan.date))} ·
          ${balanceForLoan(loan) <= 0 ? "Pago" : "Em andamento"}
        </small>
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
      description: customerName(
        loans.find(loan => loan.id === payment.loanId)?.customerId
      ),
      amount: payment.amount,
      sign: "in",
      paymentId: payment.id
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
    container.innerHTML =
      '<p class="empty-state">Nenhuma movimentação registrada.</p>';
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
            <th>Valor e ações</th>
          </tr>
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

                ${item.paymentId ? `
                  <div class="history-actions">
                    <button type="button"
                      data-edit-payment="${escapeHTML(item.paymentId)}">
                      Corrigir
                    </button>
                    <button type="button"
                      data-delete-payment="${escapeHTML(item.paymentId)}">
                      Excluir
                    </button>
                  </div>
                ` : ""}
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

/* =========================
   INICIALIZAÇÃO E EVENTOS
========================= */

document.addEventListener("DOMContentLoaded", () => {
  $("header-date").textContent = new Intl.DateTimeFormat(
    "pt-BR",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  ).format(new Date());

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
    button.addEventListener("click", () => {
      showPage(button.dataset.page);
    });
  });

  document.querySelectorAll("[data-open-page]").forEach(button => {
    button.addEventListener("click", () => {
      showPage(button.dataset.openPage);
    });
  });

  document.addEventListener("click", event => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const deleteCustomerButton = target.closest("[data-delete-customer]");
    const paymentButton = target.closest("[data-payment-loan]");
    const deleteExpenseButton = target.closest("[data-delete-expense]");
    const editPaymentButton = target.closest("[data-edit-payment]");
    const deletePaymentButton = target.closest("[data-delete-payment]");

    if (deleteCustomerButton) {
      deleteCustomer(deleteCustomerButton.dataset.deleteCustomer);
    }

    if (paymentButton) {
      registerPayment(paymentButton.dataset.paymentLoan);
    }

    if (deleteExpenseButton) {
      deleteExpense(deleteExpenseButton.dataset.deleteExpense);
    }

    if (editPaymentButton) {
      editPayment(editPaymentButton.dataset.editPayment);
    }

    if (deletePaymentButton) {
      deletePayment(deletePaymentButton.dataset.deletePayment);
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