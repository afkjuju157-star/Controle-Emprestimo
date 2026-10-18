
"use strict";

/* =========================================================
   CREDIFÁCIL — CONTROLE FINANCEIRO
   Cadastro, login, clientes, empréstimos, parcelas,
   pagamentos, correções, recibos PNG, gastos e histórico.
   Cobrança: segunda a sábado, inclusive feriados.
   Fechamento diário às 23h e recuperação ao reabrir.
   ========================================================= */

const $ = id => document.getElementById(id);

const KEYS = {
  users: "ce_users_v1",
  session: "ce_session_v1",
  customers: "ce_customers_v1",
  loans: "ce_loans_v1",
  expenses: "ce_expenses_v1",
  payments: "ce_payments_v1",
  dailyClosures: "ce_daily_closures_v1"
};

let noticeTimeout = null;
let manualInstallment = false;
let dailyTimer = null;

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
    console.error("Erro ao salvar dados:", error);
    showNotice("Não foi possível salvar os dados neste navegador.", true);
    return false;
  }
}

function makeId() {
  return globalThis.crypto?.randomUUID
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

function formatDate(value) {
  if (!value) return "—";

  const parts = String(value).split("-");

  return parts.length === 3
    ? `${parts[2]}/${parts[1]}/${parts[0]}`
    : value;
}

function today() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

function showNotice(message, error = false) {
  const element = $("app-notice");
  if (!element) return;

  clearTimeout(noticeTimeout);

  element.textContent = message;
  element.classList.toggle("error", error);
  element.hidden = false;

  noticeTimeout = setTimeout(() => {
    element.hidden = true;
  }, 6000);
}

function currentUser() {
  const session = read(KEYS.session, null);
  if (!session?.userId) return null;

  return read(KEYS.users, []).find(
    user => user.id === session.userId
  ) || null;
}

function myRows(key) {
  const user = currentUser();
  if (!user) return [];

  return read(key, []).filter(row => row.userId === user.id);
}

function saveMyRows(key, rows) {
  const user = currentUser();

  if (!user) {
    showNotice("Sua sessão terminou. Entre novamente.", true);
    showScreen("login");
    return false;
  }

  const all = read(key, []);

  return write(key, [
    ...all.filter(row => row.userId !== user.id),
    ...rows
  ]);
}

/* ==================== TELAS E MENU ==================== */

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

    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });

  const nav = $("main-nav");
  const menuButton = $("mobile-menu-toggle");

  if (nav) nav.classList.remove("open");

  if (menuButton) {
    menuButton.setAttribute("aria-expanded", "false");
  }

  if (page === "dashboard") renderDashboard();
  if (page === "customers") renderCustomers();

  if (page === "installments") {
    renderCustomerOptions();
    renderLoans();
    updateLoanTotal();
  }

  if (page === "expenses") renderExpenses();
  if (page === "history") renderHistory();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ==================== AUTENTICAÇÃO ==================== */

async function hashPassword(password) {
  if (!globalThis.crypto?.subtle) {
    return "local:" + password;
  }

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

  const users = read(KEYS.users, []);

  if (users.some(user =>
    String(user.email).toLowerCase() === email
  )) {
    error.textContent =
      "Este e-mail já está cadastrado neste navegador.";
    return;
  }

  let passwordDigest;

  try {
    passwordDigest = await hashPassword(password);
  } catch (exception) {
    console.error(exception);
    error.textContent =
      "Não foi possível processar a senha. Tente novamente.";
    return;
  }

  const user = {
    id: makeId(),
    name,
    email,
    passwordDigest,
    createdAt: new Date().toISOString()
  };

  if (!write(KEYS.users, [...users, user])) {
    error.textContent = "Não foi possível salvar a conta.";
    return;
  }

  if (!write(KEYS.session, { userId: user.id })) {
    error.textContent =
      "Conta criada. Entre novamente para iniciar a sessão.";
    return;
  }

  $("register-form").reset();

  enterApp();
  showNotice("Conta criada com sucesso!");
}

async function login(event) {
  event.preventDefault();

  const email = $("login-email").value.trim().toLowerCase();
  const password = $("login-password").value;
  const error = $("login-error");

  error.textContent = "";

  let digest;

  try {
    digest = await hashPassword(password);
  } catch (exception) {
    console.error(exception);
    error.textContent = "Não foi possível verificar a senha.";
    return;
  }

  const user = read(KEYS.users, []).find(item =>
    String(item.email).toLowerCase() === email &&
    (
      item.passwordDigest === digest ||
      item.passwordDigest === "local:" + password
    )
  );

  if (!user) {
    error.textContent =
      "E-mail ou senha incorretos. Confira os dados cadastrados.";
    return;
  }

  if (!write(KEYS.session, { userId: user.id })) {
    error.textContent = "Não foi possível iniciar a sessão.";
    return;
  }

  $("login-form").reset();

  enterApp();
  showNotice("Bem-vindo(a), " + user.name + "!");
}

function enterApp() {
  const user = currentUser();

  if (!user) {
    showScreen("login");
    return;
  }

  showScreen("app");

  $("user-avatar").textContent = user.name.trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0])
    .join("")
    .toUpperCase() || "CF";

  processDailyClosures();
  renderAll();
  showPage("dashboard");
  startDailyTimer();
}

function logout() {
  stopDailyTimer();

  try {
    localStorage.removeItem(KEYS.session);
  } catch (error) {
    console.error(error);
  }

  showScreen("login");
}

/* ==================== CLIENTES ==================== */

function addCustomer(event) {
  event.preventDefault();

  const user = currentUser();
  if (!user) return showScreen("login");

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

function customerLoanStatus(customerId) {
  const loans = myRows(KEYS.loans).filter(
    loan => loan.customerId === customerId
  );

  if (!loans.length) {
    return {
      label: "Novo",
      className: "status-attention",
      color: "violet"
    };
  }

  if (loans.every(loan => balanceForLoan(loan) <= 0)) {
    return {
      label: "Quitado",
      className: "status status-paid",
      color: "green"
    };
  }

  if (loans.some(loan =>
    balanceForLoan(loan) > 0 &&
    makeSchedule(loan).some(date => date < today())
  )) {
    return {
      label: "Atrasado",
      className: "status status-overdue",
      color: "red"
    };
  }

  return {
    label: "Em dia",
    className: "status status-pending",
    color: "amber"
  };
}

function renderCustomers() {
  const tbody = $("customer-list");
  if (!tbody) return;

  const query = $("customer-search").value.trim().toLowerCase();
  const allCustomers = myRows(KEYS.customers);

  const customers = allCustomers
    .filter(customer =>
      `${customer.name} ${customer.phone} ${customer.location || ""} ${customer.document || ""}`
        .toLowerCase()
        .includes(query)
    )
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  $("customer-count").textContent =
    `${allCustomers.length} cliente${allCustomers.length === 1 ? "" : "s"} cadastrado${allCustomers.length === 1 ? "" : "s"}`;

  if (!customers.length) {
    tbody.innerHTML = `<tr><td colspan="4" class="empty-state">${
      query
        ? "Nenhum cliente encontrado."
        : "Nenhum cliente cadastrado ainda."
    }</td></tr>`;
    return;
  }

  tbody.innerHTML = customers.map(customer => {
    const status = customerLoanStatus(customer.id);

    return `
      <tr>
        <td>
          <strong>
            <span class="customer-dot dot-${status.color}"></span>
            ${escapeHTML(customer.name)}
          </strong>
        </td>
        <td>${escapeHTML(customer.phone)}</td>
        <td>${escapeHTML(customer.location || "—")}</td>
        <td>
          <span class="${status.className}">${status.label}</span>
          <button type="button"
            data-delete-customer="${escapeHTML(customer.id)}">
            Excluir
          </button>
        </td>
      </tr>
    `;
  }).join("");
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

  if (!confirm("Deseja realmente excluir este cliente?")) return;

  const updated = myRows(KEYS.customers).filter(
    customer => customer.id !== customerId
  );

  if (!saveMyRows(KEYS.customers, updated)) return;

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

/* ==================== PLANOS E DATAS ==================== */

function installmentCount() {
  const plan = $("loan-plan").value;
  const term = Number($("loan-term").value);

  if (plan === "weekly") return 3;

  return term === 24 ? 24 : 20;
}

function selectedPlanName(loan) {
  if (loan.plan === "weekly") return "Semanal · 3 semanas";

  return `Diário · ${Number(loan.term) || 20} dias`;
}

function isNationalHoliday(date) {
  // No CrediFácil, feriados têm cobrança normalmente.
  return false;
}

function localDateFromString(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

function dateToInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function nextCollectionDate(date, daysToAdd = 1) {
  const next = new Date(date);
  next.setDate(next.getDate() + daysToAdd);

  // Somente domingo é pulado.
  while (next.getDay() === 0) {
    next.setDate(next.getDate() + 1);
  }

  return next;
}

function isCollectionDay(dateString) {
  return localDateFromString(dateString).getDay() !== 0;
}

function nextBusinessDate(dateString) {
  let date = localDateFromString(dateString);

  do {
    date.setDate(date.getDate() + 1);
  } while (date.getDay() === 0);

  return dateToInput(date);
}

function collectionDateForNow() {
  const now = new Date();
  const currentDate = today();

  // Depois das 23h, a lista passa para o próximo dia de cobrança.
  if (
    now.getHours() >= 23 ||
    localDateFromString(currentDate).getDay() === 0
  ) {
    return nextBusinessDate(currentDate);
  }

  return currentDate;
}

function makeSchedule(loan) {
  const count = Number(loan.installments || (
    loan.plan === "weekly"
      ? 3
      : Number(loan.term || 20)
  ));

  const start = localDateFromString(loan.dueDate || loan.date);
  const schedule = [];
  let current = new Date(start);

  for (let i = 0; i < count; i++) {
    while (current.getDay() === 0) {
      current.setDate(current.getDate() + 1);
    }

    schedule.push(dateToInput(current));

    current = loan.plan === "weekly"
      ? nextCollectionDate(current, 7)
      : nextCollectionDate(current, 1);
  }

  return schedule;
}

function updateLoanTotal() {
  const amount = Number($("loan-amount").value || 0);
  const rate = Number($("loan-interest").value || 0);
  const count = installmentCount();

  const expectedTotal = amount * (1 + rate / 100);
  const installmentInput = $("loan-installment");

  if (!manualInstallment || !installmentInput.value) {
    installmentInput.value = amount > 0
      ? (expectedTotal / count).toFixed(2)
      : "";
  }

  const installment = Number(installmentInput.value || 0);
  const total = installment * count;

  $("loan-total").textContent = money(total);

  $("loan-installment-preview").textContent =
    "Parcela: " + money(installment);

  $("loan-installment-summary").textContent =
    `Quantidade de parcelas: ${count}`;

  const date = $("loan-date").value;
  const due = $("loan-due-date");

  if (date && (!due.value || due.value < date)) {
    due.value = date;
  }

  const plan = $("loan-plan").value;
  const term = $("loan-term");

  term.querySelector('option[value="20"]').disabled =
    plan === "weekly";

  term.querySelector('option[value="24"]').disabled =
    plan === "weekly";

  term.querySelector('option[value="3"]').disabled =
    plan !== "weekly";

  if (plan === "weekly") term.value = "3";
  else if (term.value === "3") term.value = "20";
}

function addLoan(event) {
  event.preventDefault();

  const user = currentUser();
  if (!user) return showScreen("login");

  const customerId = $("loan-customer").value;

  const customer = myRows(KEYS.customers).find(
    item => item.id === customerId
  );

  const amount = Number($("loan-amount").value);
  const rate = Number($("loan-interest").value);
  const installment = Number($("loan-installment").value);
  const plan = $("loan-plan").value;
  const term = Number($("loan-term").value);
  const count = installmentCount();
  const date = $("loan-date").value;
  const dueDate = $("loan-due-date").value;

  if (!customer) {
    showNotice("Selecione um cliente cadastrado.", true);
    return;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    showNotice("Informe um valor emprestado válido.", true);
    return;
  }

  if (!Number.isFinite(installment) || installment <= 0) {
    showNotice("Informe o valor de cada parcela.", true);
    return;
  }

  if (!date || !dueDate || dueDate < date) {
    showNotice(
      "O primeiro vencimento deve ser igual ou posterior à data do empréstimo.",
      true
    );
    return;
  }

  const total = Math.round(installment * count * 100) / 100;

  const loan = {
    id: makeId(),
    userId: user.id,
    customerId,
    amount,
    rate,
    total,
    installment,
    installments: count,
    plan,
    term: plan === "weekly" ? 3 : term,
    date,
    dueDate,
    notes: $("loan-notes").value.trim(),
    createdAt: new Date().toISOString()
  };

  const loans = myRows(KEYS.loans);
  loans.push(loan);

  if (!saveMyRows(KEYS.loans, loans)) return;

  $("loan-form").reset();

  manualInstallment = false;

  $("loan-interest").value = "20";
  $("loan-plan").value = "daily";
  $("loan-term").value = "20";
  $("loan-date").value = today();
  $("loan-due-date").value = today();

  updateLoanTotal();
  renderCustomerOptions();
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
    .reduce((sum, payment) =>
      sum + Number(payment.amount || 0), 0);
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
    container.innerHTML =
      '<p class="empty-state">Nenhum empréstimo registrado. Cadastre um cliente antes de criar um empréstimo.</p>';
    return;
  }

  container.innerHTML = loans.map(loan => {
    const paid = paidForLoan(loan.id);
    const balance = balanceForLoan(loan);
    const schedule = makeSchedule(loan);
    const overdue = balance > 0 && schedule.some(
      date => date < today()
    );

    let status;

    if (balance <= 0) {
      status = '<span class="status status-paid">Pago</span>';
    } else if (overdue) {
      status = '<span class="status status-overdue">Atrasado</span>';
    } else {
      status = '<span class="status status-pending">Pendente</span>';
    }

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
        <p>Plano: ${escapeHTML(selectedPlanName(loan))}</p>
        <p>Juros registrados: ${Number(loan.rate || 0)}%</p>
        <p>Parcelas: <strong>${Number(loan.installments || schedule.length)} × ${money(loan.installment || (loan.total / schedule.length))}</strong></p>
        <p>Total previsto: <strong>${money(loan.total)}</strong></p>
        <p>Recebido: <strong class="money-in">${money(paid)}</strong></p>
        <p>Saldo pendente: <strong>${money(balance)}</strong></p>
        <p>Primeiro vencimento: ${escapeHTML(formatDate(loan.dueDate))}</p>
        ${loan.notes ? `<p>Observações: ${escapeHTML(loan.notes)}</p>` : ""}
        <details>
          <summary>Ver calendário de parcelas</summary>
          <ol class="schedule-list">
            ${schedule.map((date, index) => `
              <li>Parcela ${index + 1} — ${escapeHTML(formatDate(date))}</li>
            `).join("")}
          </ol>
        </details>
        ${balance > 0 ? `<button type="button" data-payment-loan="${escapeHTML(loan.id)}">＋ Registrar pagamento</button>` : ""}
        <button type="button" data-receipt-loan="${escapeHTML(loan.id)}">Gerar recibo PNG</button>
      </article>
    `;
  }).join("");
}

/* ==================== PAGAMENTOS ==================== */

function parseMoneyInput(value) {
  const trimmed = String(value).trim().replace(/\s/g, "");

  if (!trimmed) return NaN;

  if (trimmed.includes(",") && trimmed.includes(".")) {
    return Number(trimmed.replace(/\./g, "").replace(",", "."));
  }

  if (trimmed.includes(",")) {
    return Number(trimmed.replace(",", "."));
  }

  return Number(trimmed);
}

function registerPayment(loanId) {
  const user = currentUser();
  if (!user) return showScreen("login");

  const loan = myRows(KEYS.loans).find(
    item => item.id === loanId
  );

  if (!loan) {
    showNotice("Empréstimo não encontrado.", true);
    return;
  }

  const balance = balanceForLoan(loan);

  if (balance <= 0) {
    showNotice("Este empréstimo já está totalmente pago.", true);
    return;
  }

  const input = prompt(
    `Cliente: ${customerName(loan.customerId)}\nSaldo pendente: ${money(balance)}\n\nDigite o valor recebido:`
  );

  if (input === null) return;

  const amount = parseMoneyInput(input);

  if (
    !Number.isFinite(amount) ||
    amount <= 0 ||
    amount > balance + 0.000001
  ) {
    showNotice(
      "Informe um valor maior que zero e até o saldo pendente.",
      true
    );
    return;
  }

  const payments = myRows(KEYS.payments);

  const payment = {
    id: makeId(),
    userId: user.id,
    loanId,
    amount: Math.round(amount * 100) / 100,
    date: today(),
    createdAt: new Date().toISOString()
  };

  payments.push(payment);

  if (!saveMyRows(KEYS.payments, payments)) return;

  renderLoans();
  renderDashboard();
  renderHistory();
  renderCustomers();

  showNotice("Pagamento registrado. Preparando o recibo PNG…");

  generateReceipt("payment", payment, loan);
}

function editPayment(paymentId) {
  const payments = myRows(KEYS.payments);
  const payment = payments.find(item => item.id === paymentId);

  if (!payment) {
    showNotice("Pagamento não encontrado.", true);
    return;
  }

  const loans = myRows(KEYS.loans);

  if (!loans.length) {
    showNotice("Não há empréstimos cadastrados.", true);
    return;
  }

  const options = loans.map((loan, index) => {
    const balance = balanceForLoan(loan) +
      (loan.id === payment.loanId ? Number(payment.amount) : 0);

    return `${index + 1}. ${customerName(loan.customerId)} — saldo ${money(balance)} — ${formatDate(loan.dueDate)}`;
  }).join("\n");

  const currentIndex = Math.max(
    0,
    loans.findIndex(loan => loan.id === payment.loanId)
  );

  const choice = prompt(
    "CORRIGIR PAGAMENTO\n\nDigite o número do empréstimo correto:\n\n" + options,
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

  const targetBalance = balanceForLoan(targetLoan) +
    (targetLoan.id === payment.loanId ? Number(payment.amount) : 0);

  const amountText = prompt(
    "Informe o valor correto do pagamento:",
    String(payment.amount).replace(".", ",")
  );

  if (amountText === null) return;

  const amount = parseMoneyInput(amountText);

  if (
    !Number.isFinite(amount) ||
    amount <= 0 ||
    amount > targetBalance + 0.000001
  ) {
    showNotice(
      "Valor inválido ou superior ao saldo do empréstimo escolhido.",
      true
    );
    return;
  }

  const updated = payments.map(item =>
    item.id === paymentId
      ? {
          ...item,
          loanId: targetLoan.id,
          amount: Math.round(amount * 100) / 100,
          date: item.date || today(),
          updatedAt: new Date().toISOString()
        }
      : item
  );

  if (!saveMyRows(KEYS.payments, updated)) return;

  renderLoans();
  renderDashboard();
  renderHistory();
  renderCustomers();

  showNotice(
    "Pagamento corrigido e vinculado ao empréstimo escolhido."
  );
}

function deletePayment(paymentId) {
  const payment = myRows(KEYS.payments).find(
    item => item.id === paymentId
  );

  if (!payment) {
    showNotice("Pagamento não encontrado.", true);
    return;
  }

  if (!confirm(
    "Deseja excluir este pagamento? O saldo será atualizado."
  )) return;

  const updated = myRows(KEYS.payments).filter(
    item => item.id !== paymentId
  );

  if (!saveMyRows(KEYS.payments, updated)) return;

  renderLoans();
  renderDashboard();
  renderHistory();
  renderCustomers();

  showNotice("Pagamento excluído. O saldo foi atualizado.");
}

/* ==================== RECIBOS PNG ==================== */

function generateReceipt(type, record, loan = null) {
  if (type === "loan") {
    loan = record;
  }

  if (!loan) {
    showNotice(
      "Não foi possível localizar o empréstimo do recibo.",
      true
    );
    return;
  }

  const isPayment = type === "payment";
  const customer = customerName(loan.customerId);
  const amount = isPayment ? record.amount : loan.total;
  const date = isPayment ? record.date : loan.date;

  const title = isPayment
    ? "RECIBO DE PAGAMENTO"
    : "RECIBO DE EMPRÉSTIMO";

  const lines = [
    "CrediFácil — Controle Financeiro",
    "",
    title,
    "--------------------------------------",
    "Cliente: " + customer,
    "Data: " + formatDate(date),
    "Valor: " + money(amount),
    isPayment
      ? "Referente a pagamento recebido."
      : "Valor original: " + money(loan.amount),
    "Plano: " + selectedPlanName(loan),
    "Total contratado: " + money(loan.total),
    "Saldo atual: " + money(balanceForLoan(loan)),
    "Contrato: " + loan.id.slice(0, 8),
    "",
    "Documento gerado localmente pelo CrediFácil."
  ];

  const canvas = document.createElement("canvas");

  canvas.width = 900;
  canvas.height = 760;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    showNotice("Não foi possível criar a imagem do recibo.", true);
    return;
  }

  ctx.fillStyle = "#100c15";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const gradient = ctx.createLinearGradient(0, 0, 900, 200);

  gradient.addColorStop(0, "#ff3d9a");
  gradient.addColorStop(1, "#8d37e8");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 900, 170);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 42px Arial";
  ctx.fillText("CrediFácil", 48, 68);

  ctx.font = "20px Arial";
  ctx.fillText("GESTÃO DE CRÉDITOS", 50, 105);

  ctx.fillStyle = "#f8f3fb";
  ctx.font = "bold 30px Arial";
  ctx.fillText(title, 48, 225);

  ctx.strokeStyle = "#49304b";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(48, 252);
  ctx.lineTo(852, 252);
  ctx.stroke();

  let y = 305;

  lines.slice(4).forEach(line => {
    ctx.fillStyle = "#e8ddeb";
    ctx.font = "22px Arial";
    ctx.fillText(line, 50, y);
    y += 39;
  });

  ctx.fillStyle = "#a69bad";
  ctx.font = "16px Arial";

  ctx.fillText(
    "Guarde esta imagem como comprovante da movimentação.",
    50,
    710
  );

  canvas.toBlob(blob => {
    if (!blob) {
      showNotice("Não foi possível gerar o recibo PNG.", true);
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;

    link.download =
      `credifacil-recibo-${isPayment ? "pagamento" : "emprestimo"}-${Date.now()}.png`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1500);

    showNotice("Recibo PNG gerado. Confira os downloads do navegador.");
  }, "image/png");
}

/* ==================== GASTOS ==================== */

function addExpense(event) {
  event.preventDefault();

  const user = currentUser();
  if (!user) return showScreen("login");

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
      <p>Valor: <strong class="money-out">${money(expense.amount)}</strong></p>
      <p>Data: ${escapeHTML(formatDate(expense.date))}</p>
      <button type="button"
        data-delete-expense="${escapeHTML(expense.id)}">
        Excluir gasto
      </button>
    </article>
  `).join("");
}

function deleteExpense(expenseId) {
  if (!myRows(KEYS.expenses).some(
    item => item.id === expenseId
  )) {
    showNotice("Gasto não encontrado.", true);
    return;
  }

  if (!confirm("Deseja realmente excluir este gasto?")) return;

  const expenses = myRows(KEYS.expenses).filter(
    item => item.id !== expenseId
  );

  if (!saveMyRows(KEYS.expenses, expenses)) return;

  renderExpenses();
  renderDashboard();
  renderHistory();

  showNotice("Gasto excluído.");
}

/* ==================== COBRANÇA DO DIA ==================== */

function collectionCustomersForDate(date) {
  const customers = myRows(KEYS.customers);
  const loans = myRows(KEYS.loans);

  const results = [];

  for (const loan of loans) {
    if (balanceForLoan(loan) <= 0) continue;

    const schedule = makeSchedule(loan);

    if (!schedule.includes(date)) continue;

    const customer = customers.find(
      item => item.id === loan.customerId
    );

    if (!customer) continue;

    results.push({
      customer,
      loan,
      date,
      amount: Math.min(
        Number(loan.installment || 0),
        balanceForLoan(loan)
      ),
      balance: balanceForLoan(loan)
    });
  }

  return results.sort((a, b) =>
    a.customer.name.localeCompare(b.customer.name, "pt-BR")
  );
}

function renderCollectionList() {
  const container = $("collection-list");
  if (!container) return;

  const date = collectionDateForNow();

  const dateLabel = $("collection-date");
  if (dateLabel) {
    dateLabel.textContent =
      `Lista de cobranças para ${formatDate(date)}`;
  }

  if (!isCollectionDay(date)) {
    container.innerHTML =
      '<p class="empty-state">Domingo sem cobrança. A lista será preparada para o próximo dia permitido.</p>';
    return;
  }

  const results = collectionCustomersForDate(date);

  if (!results.length) {
    container.innerHTML =
      '<p class="empty-state">Nenhuma parcela prevista para este dia.</p>';
    return;
  }

  container.innerHTML = `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Telefone</th>
            <th>Parcela prevista</th>
            <th>Saldo pendente</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          ${results.map(item => `
            <tr>
              <td><strong>${escapeHTML(item.customer.name)}</strong></td>
              <td>${escapeHTML(item.customer.phone)}</td>
              <td>${money(item.amount)}</td>
              <td>${money(item.balance)}</td>
              <td>
                <button type="button"
                  data-payment-loan="${escapeHTML(item.loan.id)}">
                  Registrar pagamento
                </button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

/* ==================== FECHAMENTO DIÁRIO ==================== */

function getClosedDates() {
  return myRows(KEYS.dailyClosures);
}

function closureExists(date) {
  return getClosedDates().some(item => item.date === date);
}

function createDailyClosure(date) {
  if (closureExists(date)) return false;

  const user = currentUser();
  if (!user) return false;

  const loans = myRows(KEYS.loans);
  const payments = myRows(KEYS.payments);
  const expenses = myRows(KEYS.expenses);

  const dailyPayments = payments.filter(
    payment => payment.date === date
  );

  const dailyLoans = loans.filter(
    loan => loan.date === date
  );

  const dailyExpenses = expenses.filter(
    expense => expense.date === date
  );

  const closure = {
    id: makeId(),
    userId: user.id,
    date,
    closedAt: new Date().toISOString(),
    paymentCount: dailyPayments.length,
    paymentTotal: dailyPayments.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    ),
    loanCount: dailyLoans.length,
    loanTotal: dailyLoans.reduce(
      (sum, loan) => sum + Number(loan.amount || 0),
      0
    ),
    expenseCount: dailyExpenses.length,
    expenseTotal: dailyExpenses.reduce(
      (sum, expense) => sum + Number(expense.amount || 0),
      0
    ),
    collectionCustomers: collectionCustomersForDate(date).length
  };

  const all = read(KEYS.dailyClosures, []);

  const updated = [
    ...all.filter(item =>
      item.userId !== user.id || item.date !== date
    ),
    closure
  ];

  if (!write(KEYS.dailyClosures, updated)) return false;

  return true;
}

function processDailyClosures() {
  const user = currentUser();
  if (!user) return;

  const now = new Date();
  const currentDate = today();

  const lastClosure = getClosedDates()
    .map(item => item.date)
    .filter(Boolean)
    .sort()
    .pop();

  // Primeira execução: não cria fechamentos retroativos.
  // Após 23h, fecha o dia atual.
  if (!lastClosure) {
    if (now.getHours() >= 23) {
      createDailyClosure(currentDate);
    }

    updateDailyCloseStatus();
    return;
  }

  // Recupera dias que ficaram sem fechamento enquanto
  // o navegador ou notebook estava desligado.
  let cursor = localDateFromString(lastClosure);

  cursor.setDate(cursor.getDate() + 1);

  const target = now.getHours() >= 23
    ? localDateFromString(currentDate)
    : localDateFromString(
        dateToInput(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 12))
      );

  let safety = 0;

  while (cursor <= target && safety < 400) {
    const date = dateToInput(cursor);

    if (!closureExists(date)) {
      createDailyClosure(date);
    }

    cursor.setDate(cursor.getDate() + 1);
    safety++;
  }

  if (now.getHours() >= 23 && !closureExists(currentDate)) {
    createDailyClosure(currentDate);
  }

  updateDailyCloseStatus();
}

function updateDailyCloseStatus() {
  const status = $("daily-close-status");
  const summary = $("daily-close-summary");

  if (!status && !summary) return;

  const now = new Date();
  const date = today();
  const closed = closureExists(date);

  if (status) {
    status.textContent = closed
      ? "Fechado"
      : "Em andamento";

    status.classList.toggle("status-paid", closed);
    status.classList.toggle("status-pending", !closed);
  }

  if (summary) {
    if (closed) {
      summary.textContent =
        `Movimento de ${formatDate(date)} fechado. O histórico foi preservado.`;
    } else {
      summary.textContent =
        "O fechamento diário está programado para as 23h.";
    }
  }
}

function startDailyTimer() {
  stopDailyTimer();

  dailyTimer = setInterval(() => {
    if (!currentUser()) return;

    processDailyClosures();
    renderCollectionList();
  }, 30000);
}

function stopDailyTimer() {
  if (dailyTimer !== null) {
    clearInterval(dailyTimer);
    dailyTimer = null;
  }
}

/* ==================== PAINEL ==================== */

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

  if (recent) {
    const latest = [...loans]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 4);

    if (!latest.length) {
      recent.innerHTML =
        '<p class="empty-state">Nenhum empréstimo registrado.</p>';
    } else {
      recent.innerHTML = latest.map(loan => {
        const name = customerName(loan.customerId);

        const initials = name
          .split(/\s+/)
          .slice(0, 2)
          .map(word => word[0] || "")
          .join("")
          .toUpperCase();

        return `
          <div class="recent-row">
            <span class="customer-avatar">${escapeHTML(initials)}</span>
            <span class="recent-info">
              <b>${escapeHTML(name)}</b>
              <small>${escapeHTML(formatDate(loan.date))} · ${balanceForLoan(loan) <= 0 ? "Pago" : "Em andamento"}</small>
            </span>
            <span class="recent-amount">
              ${money(loan.total)}
              <small>Saldo: ${money(balanceForLoan(loan))}</small>
            </span>
          </div>
        `;
      }).join("");
    }
  }

  renderCollectionList();
  updateDailyCloseStatus();
}

/* ==================== HISTÓRICO ==================== */

function renderHistory() {
  const container = $("history-list");
  if (!container) return;

  const loans = myRows(KEYS.loans);
  const payments = myRows(KEYS.payments);
  const expenses = myRows(KEYS.expenses);
  const closures = getClosedDates();

  const items = [
    ...loans.map(loan => ({
      id: loan.id,
      date: loan.date,
      createdAt: loan.createdAt || "",
      type: "Empréstimo",
      description: customerName(loan.customerId),
      amount: loan.amount,
      sign: "out"
    })),

    ...payments.map(payment => {
      const loan = loans.find(
        item => item.id === payment.loanId
      );

      return {
        id: payment.id,
        date: payment.date,
        createdAt: payment.createdAt || "",
        type: "Pagamento recebido",
        description: loan
          ? customerName(loan.customerId)
          : "Empréstimo não encontrado",
        amount: payment.amount,
        sign: "in",
        paymentId: payment.id,
        loanId: payment.loanId
      };
    }),

    ...expenses.map(expense => ({
      id: expense.id,
      date: expense.date,
      createdAt: expense.createdAt || "",
      type: "Gasto",
      description: expense.description,
      amount: expense.amount,
      sign: "out"
    })),

    ...closures.map(closure => ({
      id: closure.id,
      date: closure.date,
      createdAt: closure.closedAt || "",
      type: "Fechamento diário",
      description:
        `Recebido: ${money(closure.paymentTotal)} · ` +
        `Empréstimos: ${money(closure.loanTotal)} · ` +
        `Gastos: ${money(closure.expenseTotal)}`,
      amount: closure.paymentTotal,
      sign: "in",
      isClosure: true
    }))
  ].sort((a, b) => {
    const order = b.date.localeCompare(a.date);

    return order !== 0
      ? order
      : b.createdAt.localeCompare(a.createdAt);
  });

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
                ${
                  item.isClosure
                    ? `<strong>${money(item.amount)}</strong>`
                    : `<strong class="${item.sign === "in" ? "money-in" : "money-out"}">${item.sign === "in" ? "+" : "−"} ${money(item.amount)}</strong>`
                }
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
                    <button type="button"
                      data-receipt-payment="${escapeHTML(item.paymentId)}">
                      Recibo PNG
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

/* ==================== ATUALIZAÇÃO GERAL ==================== */

function renderAll() {
  renderDashboard();
  renderCustomers();
  renderCustomerOptions();
  renderLoans();
  renderExpenses();
  renderHistory();
}

/* ==================== INICIALIZAÇÃO ==================== */

document.addEventListener("DOMContentLoaded", () => {
  const headerDate = $("header-date");

  if (headerDate) {
    headerDate.textContent = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(new Date());
  }

  $("show-register").addEventListener("click", () => {
    $("login-error").textContent = "";
    $("register-error").textContent = "";

    showScreen("register");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  $("show-login").addEventListener("click", () => {
    $("login-error").textContent = "";
    $("register-error").textContent = "";

    showScreen("login");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  $("register-form").addEventListener("submit", register);
  $("login-form").addEventListener("submit", login);
  $("logout-button").addEventListener("click", logout);

  $("customer-form").addEventListener("submit", addCustomer);
  $("loan-form").addEventListener("submit", addLoan);
  $("expense-form").addEventListener("submit", addExpense);

  $("customer-search").addEventListener("input", renderCustomers);

  $("loan-amount").addEventListener("input", () => {
    manualInstallment = false;
    updateLoanTotal();
  });

  $("loan-interest").addEventListener("change", () => {
    manualInstallment = false;
    updateLoanTotal();
  });

  $("loan-plan").addEventListener("change", () => {
    manualInstallment = false;
    updateLoanTotal();
  });

  $("loan-term").addEventListener("change", () => {
    manualInstallment = false;
    updateLoanTotal();
  });

  $("loan-installment").addEventListener("input", () => {
    manualInstallment = true;
    updateLoanTotal();
  });

  $("loan-date").addEventListener("change", updateLoanTotal);

  $("loan-due-date").addEventListener("change", () => {
    if ($("loan-due-date").value < $("loan-date").value) {
      $("loan-due-date").value = $("loan-date").value;

      showNotice(
        "O primeiro vencimento não pode ser anterior ao empréstimo.",
        true
      );
    }
  });

  document.querySelectorAll("[data-page]").forEach(button => {
    button.addEventListener("click", () =>
      showPage(button.dataset.page)
    );
  });

  document.querySelectorAll("[data-open-page]").forEach(button => {
    button.addEventListener("click", () =>
      showPage(button.dataset.openPage)
    );
  });

  const menuButton = $("mobile-menu-toggle");
  const nav = $("main-nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const opened = nav.classList.toggle("open");

      menuButton.setAttribute(
        "aria-expanded",
        String(opened)
      );
    });
  }

  document.addEventListener("click", event => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const deleteCustomerButton =
      target.closest("[data-delete-customer]");

    const paymentButton =
      target.closest("[data-payment-loan]");

    const deleteExpenseButton =
      target.closest("[data-delete-expense]");

    const editPaymentButton =
      target.closest("[data-edit-payment]");

    const deletePaymentButton =
      target.closest("[data-delete-payment]");

    const loanReceiptButton =
      target.closest("[data-receipt-loan]");

    const paymentReceiptButton =
      target.closest("[data-receipt-payment]");

    if (deleteCustomerButton) {
      deleteCustomer(
        deleteCustomerButton.dataset.deleteCustomer
      );
    }

    if (paymentButton) {
      registerPayment(
        paymentButton.dataset.paymentLoan
      );
    }

    if (deleteExpenseButton) {
      deleteExpense(
        deleteExpenseButton.dataset.deleteExpense
      );
    }

    if (editPaymentButton) {
      editPayment(
        editPaymentButton.dataset.editPayment
      );
    }

    if (deletePaymentButton) {
      deletePayment(
        deletePaymentButton.dataset.deletePayment
      );
    }

    if (loanReceiptButton) {
      const loan = myRows(KEYS.loans).find(
        item => item.id === loanReceiptButton.dataset.receiptLoan
      );

      if (loan) generateReceipt("loan", loan);
    }

    if (paymentReceiptButton) {
      const payment = myRows(KEYS.payments).find(
        item => item.id === paymentReceiptButton.dataset.receiptPayment
      );

      const loan = payment
        ? myRows(KEYS.loans).find(
            item => item.id === payment.loanId
          )
        : null;

      if (payment && loan) {
        generateReceipt("payment", payment, loan);
      } else {
        showNotice(
          "Não foi possível localizar o pagamento ou empréstimo.",
          true
        );
      }
    }
  });

  // Verifica fechamentos ao voltar para a aba.
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && currentUser()) {
      processDailyClosures();
      renderDashboard();
    }
  });

  // Datas iniciais dos formulários.
  $("loan-date").value = today();
  $("loan-due-date").value = today();
  $("expense-date").value = today();
  $("loan-interest").value = "20";
  $("loan-plan").value = "daily";
  $("loan-term").value = "20";

  updateLoanTotal();

  if (currentUser()) {
    enterApp();
  } else {
    showScreen("login");
  }
});
