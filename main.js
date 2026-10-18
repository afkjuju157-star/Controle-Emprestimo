
"use strict";

/* CREDIFÁCIL — CONTROLE DE EMPRÉSTIMOS */

const KEYS = {
  users: "credifacil_users_v1",
  session: "credifacil_session_v1",
  customers: "credifacil_customers_v1",
  loans: "credifacil_loans_v1",
  payments: "credifacil_payments_v1",
  expenses: "credifacil_expenses_v1"
};

const $ = (id) => document.getElementById(id);

let currentUser = null;
let currentReceipt = null;
let messageTimer = null;

function read(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function id() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function numberValue(value) {
  return Number(String(value ?? "").replace(",", ".")) || 0;
}

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dateBR(value) {
  if (!value) return "—";
  const parts = String(value).slice(0, 10).split("-");
  if (parts.length !== 3) return escapeHTML(value);
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

function ownRecords(key) {
  return read(key).filter(item => item.userId === currentUser?.id);
}

function replaceOwn(key, records) {
  const all = read(key).filter(item => item.userId !== currentUser.id);
  save(key, [...all, ...records]);
}

function showMessage(text, error = false, auth = false) {
  const el = $(auth ? "auth-message" : "app-message");
  if (!el) return;

  if (auth) {
    el.textContent = text;
    el.className = "message" + (error ? " error" : " success");
    return;
  }

  el.textContent = text;
  el.className = "app-message" + (error ? " error" : "");
  el.hidden = false;

  clearTimeout(messageTimer);
  messageTimer = setTimeout(() => {
    el.hidden = true;
  }, 4500);
}

async function hashPassword(password) {
  if (window.crypto?.subtle) {
    const bytes = new TextEncoder().encode(password);
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  }
  return password;
}

function getCustomer(customerId) {
  return ownRecords(KEYS.customers).find(c => c.id === customerId);
}

function getLoan(loanId) {
  return ownRecords(KEYS.loans).find(l => l.id === loanId);
}

function getPayments(loanId) {
  return ownRecords(KEYS.payments).filter(p => p.loanId === loanId);
}

function loanReceived(loanId) {
  return getPayments(loanId).reduce((sum, p) => sum + numberValue(p.amount), 0);
}

function loanTotal(loan) {
  // Contratos antigos continuam usando o total que já foi salvo.
  return numberValue(loan.total);
}

function loanBalance(loan) {
  return Math.max(0, loanTotal(loan) - loanReceived(loan.id));
}

function isPaid(loan) {
  return loanBalance(loan) < 0.005;
}

function customerName(customerId) {
  return getCustomer(customerId)?.name || "Cliente removido";
}

function loanLabel(loan) {
  return `${customerName(loan.customerId)} — saldo ${money(loanBalance(loan))}`;
}

function setDefaultDates() {
  ["loan-date", "payment-date", "expense-date"].forEach(idName => {
    const input = $(idName);
    if (input && !input.value) input.value = today();
  });
  updateDueDate();
}

function addDays(dateString, days) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + Number(days));
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function updateDueDate() {
  const start = $("loan-date")?.value;
  const term = numberValue($("loan-term")?.value || 20);
  if (start && $("loan-due-date")) {
    $("loan-due-date").value = addDays(start, term);
  }
  updateLoanPreview();
}

function updateLoanPreview() {
  const term = numberValue($("loan-term")?.value || 20);
  const daily = numberValue($("loan-daily-payment")?.value);
  const total = term * daily;

  if ($("loan-total-preview")) $("loan-total-preview").textContent = money(total);
  if ($("loan-preview-detail")) {
    $("loan-preview-detail").textContent = daily > 0
      ? `${term} parcelas de ${money(daily)}. Total previsto: ${money(total)}.`
      : `Informe o valor da parcela diária para ${term} dias.`;
  }
}

function switchAuth(tab) {
  $("login-form").hidden = tab !== "login";
  $("register-form").hidden = tab !== "register";

  document.querySelectorAll("[data-auth-tab]").forEach(button => {
    button.classList.toggle("active", button.dataset.authTab === tab);
  });
  $("auth-message").textContent = "";
}

function showApp() {
  $("auth-screen").hidden = true;
  $("app-screen").hidden = false;
  $("sidebar-user-name").textContent = currentUser.name || "Usuário";
  $("sidebar-user-email").textContent = currentUser.email || "";
  $("today-label").textContent = new Date().toLocaleDateString("pt-BR", {
    weekday: "short", day: "2-digit", month: "short", year: "numeric"
  });

  setDefaultDates();
  renderAll();
  navigate("dashboard");
}

function logout() {
  localStorage.removeItem(KEYS.session);
  currentUser = null;
  $("app-screen").hidden = true;
  $("auth-screen").hidden = false;
  switchAuth("login");
  $("login-form").reset();
  $("register-form").reset();
}

function navigate(page) {
  const validPages = ["dashboard", "customers", "loans", "payments", "expenses", "history"];
  if (!validPages.includes(page)) page = "dashboard";

  document.querySelectorAll(".page").forEach(section => {
    section.classList.toggle("active", section.id === `page-${page}`);
  });

  document.querySelectorAll(".nav-link").forEach(button => {
    button.classList.toggle("active", button.dataset.page === page);
  });

  const titles = {
    dashboard: "Painel",
    customers: "Clientes",
    loans: "Empréstimos",
    payments: "Pagamentos",
    expenses: "Despesas",
    history: "Histórico"
  };

  $("page-title").textContent = titles[page];
  if (page === "loans") populateLoanCustomers();
  if (page === "payments") populatePaymentLoans();
}

function emptyTable(message) {
  return `<div class="empty-state">${escapeHTML(message)}</div>`;
}

function table(headers, rows, emptyMessage) {
  if (!rows.length) return emptyTable(emptyMessage);
  return `<table><thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table>`;
}

function actionButton(action, recordId, label, style = "secondary") {
  return `<button type="button" class="btn ${style} small" data-action="${action}" data-id="${escapeHTML(recordId)}">${escapeHTML(label)}</button>`;
}

/* CLIENTES */

function renderCustomers() {
  const query = ($("customer-search")?.value || "").trim().toLowerCase();
  const customers = ownRecords(KEYS.customers)
    .filter(c => `${c.name} ${c.phone || ""} ${c.document || ""}`.toLowerCase().includes(query))
    .sort((a, b) => String(a.name).localeCompare(String(b.name), "pt-BR"));

  $("customers-list").innerHTML = table(
    ["Cliente", "Telefone", "CPF", "Empréstimos", "Ações"],
    customers.map(c => {
      const count = ownRecords(KEYS.loans).filter(l => l.customerId === c.id).length;
      return `<tr>
        <td><strong>${escapeHTML(c.name)}</strong><small>${escapeHTML(c.address || "")}</small></td>
        <td>${escapeHTML(c.phone || "—")}</td>
        <td>${escapeHTML(c.document || "—")}</td>
        <td>${count}</td>
        <td><div class="table-actions">${actionButton("delete-customer", c.id, "Excluir", "danger")}</div></td>
      </tr>`;
    }),
    "Nenhum cliente cadastrado."
  );

  populateLoanCustomers();
}

function populateLoanCustomers() {
  const select = $("loan-customer");
  if (!select) return;
  const previous = select.value;
  const customers = ownRecords(KEYS.customers).sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  select.innerHTML = '<option value="">Selecione um cliente</option>' +
    customers.map(c => `<option value="${escapeHTML(c.id)}">${escapeHTML(c.name)}</option>`).join("");

  if (customers.some(c => c.id === previous)) select.value = previous;
}

/* EMPRÉSTIMOS */

function renderLoans() {
  const query = ($("loan-search")?.value || "").trim().toLowerCase();
  const loans = ownRecords(KEYS.loans)
    .filter(l => customerName(l.customerId).toLowerCase().includes(query))
    .sort((a, b) => String(b.createdAt || b.date || "").localeCompare(String(a.createdAt || a.date || "")));

  $("loans-list").innerHTML = table(
    ["Cliente / data", "Contrato", "Prazo", "Recebido", "Saldo", "Situação", "Ações"],
    loans.map(loan => {
      const received = loanReceived(loan.id);
      const balance = loanBalance(loan);
      const term = loan.term || loan.days || "—";
      const daily = numberValue(loan.dailyPayment);
      const status = isPaid(loan)
        ? '<span class="status paid">Quitado</span>'
        : '<span class="status open">Em aberto</span>';

      return `<tr>
        <td><strong>${escapeHTML(customerName(loan.customerId))}</strong><small>${dateBR(loan.date)}</small></td>
        <td><strong>${money(loanTotal(loan))}</strong><small>Emprestado: ${money(loan.amount)}</small>${daily ? `<small>Parcela: ${money(daily)}</small>` : ""}</td>
        <td>${escapeHTML(term)}${term !== "—" ? " dias" : ""}<small>Final: ${dateBR(loan.dueDate)}</small></td>
        <td>${money(received)}</td>
        <td><strong>${money(balance)}</strong></td>
        <td>${status}</td>
        <td><div class="table-actions">
          ${!isPaid(loan) ? actionButton("pay-loan", loan.id, "Receber", "primary") : ""}
          ${actionButton("delete-loan", loan.id, "Excluir", "danger")}
        </div></td>
      </tr>`;
    }),
    "Nenhum empréstimo cadastrado."
  );

  populatePaymentLoans();
}

function populatePaymentLoans() {
  const select = $("payment-loan");
  if (!select) return;

  const previous = select.value;
  const loans = ownRecords(KEYS.loans)
    .filter(l => !isPaid(l))
    .sort((a, b) => customerName(a.customerId).localeCompare(customerName(b.customerId), "pt-BR"));

  select.innerHTML = '<option value="">Selecione um empréstimo</option>' +
    loans.map(l => `<option value="${escapeHTML(l.id)}">${escapeHTML(loanLabel(l))}</option>`).join("");

  if (loans.some(l => l.id === previous)) select.value = previous;

  const selected = getLoan(select.value);
  const amount = $("payment-amount");
  if (selected && amount && !amount.dataset.edited) {
    amount.value = numberValue(selected.dailyPayment) > 0
      ? Math.min(numberValue(selected.dailyPayment), loanBalance(selected)).toFixed(2)
      : loanBalance(selected).toFixed(2);
  }
}

/* PAGAMENTOS E RECIBOS */

function renderPayments() {
  const payments = ownRecords(KEYS.payments)
    .sort((a, b) => String(b.createdAt || b.date || "").localeCompare(String(a.createdAt || a.date || "")));

  $("payments-list").innerHTML = table(
    ["Data", "Cliente", "Valor", "Empréstimo", "Ações"],
    payments.map(p => {
      const loan = getLoan(p.loanId);
      return `<tr>
        <td>${dateBR(p.date)}</td>
        <td><strong>${escapeHTML(loan ? customerName(loan.customerId) : "Empréstimo removido")}</strong></td>
        <td><strong>${money(p.amount)}</strong></td>
        <td>${loan ? money(loanTotal(loan)) : "—"}${loan ? `<small>Saldo atual: ${money(loanBalance(loan))}</small>` : ""}</td>
        <td><div class="table-actions">
          ${actionButton("receipt", p.id, "Recibo", "secondary")}
          ${actionButton("delete-payment", p.id, "Excluir", "danger")}
        </div></td>
      </tr>`;
    }),
    "Nenhum pagamento registrado."
  );
}

function receiptText(payment) {
  const loan = getLoan(payment.loanId);
  const customer = loan ? getCustomer(loan.customerId) : null;
  const name = customer?.name || "Cliente";
  const balance = loan ? loanBalance(loan) : 0;

  return [
    "🧾 *RECIBO DE PAGAMENTO — CREDIFÁCIL*",
    "",
    `Cliente: ${name}`,
    `Valor recebido: ${money(payment.amount)}`,
    `Data: ${dateBR(payment.date)}`,
    `Referência: ${payment.notes || "Pagamento de empréstimo"}`,
    loan ? `Total do contrato: ${money(loanTotal(loan))}` : "",
    loan ? `Total recebido até agora: ${money(loanReceived(loan.id))}` : "",
    loan ? `Saldo restante: ${money(balance)}` : "",
    "",
    "Recibo de registro de pagamento. Guarde esta mensagem para conferência."
  ].filter(Boolean).join("\n");
}

function openReceipt(paymentId) {
  const payment = ownRecords(KEYS.payments).find(p => p.id === paymentId);
  if (!payment) return showMessage("Pagamento não encontrado.", true);

  currentReceipt = payment;
  const loan = getLoan(payment.loanId);
  const customer = loan ? getCustomer(loan.customerId) : null;

  $("receipt-content").innerHTML = `
    <div class="receipt">
      <h2>CrediFácil</h2>
      <p class="muted">Recibo de pagamento</p>
      <div class="receipt-row"><span>Cliente</span><strong>${escapeHTML(customer?.name || "Cliente")}</strong></div>
      <div class="receipt-row"><span>Valor recebido</span><strong>${money(payment.amount)}</strong></div>
      <div class="receipt-row"><span>Data</span><strong>${dateBR(payment.date)}</strong></div>
      <div class="receipt-row"><span>Referência</span><strong>${escapeHTML(payment.notes || "Pagamento")}</strong></div>
      ${loan ? `<div class="receipt-row"><span>Total do contrato</span><strong>${money(loanTotal(loan))}</strong></div>` : ""}
      ${loan ? `<div class="receipt-row"><span>Total recebido</span><strong>${money(loanReceived(loan.id))}</strong></div>` : ""}
      ${loan ? `<div class="receipt-row"><span>Saldo restante</span><strong>${money(loanBalance(loan))}</strong></div>` : ""}
      <p class="muted small-note">Guarde este recibo para conferência.</p>
    </div>`;

  $("receipt-modal").hidden = false;
}

function deletePayment(paymentId) {
  const payment = ownRecords(KEYS.payments).find(p => p.id === paymentId);
  if (!payment) return showMessage("Pagamento não encontrado.", true);

  const confirmText =
    `Excluir o pagamento de ${money(payment.amount)} registrado em ${dateBR(payment.date)}?\n\n` +
    "O saldo do empréstimo será recalculado automaticamente.";

  if (!confirm(confirmText)) return;

  const remaining = ownRecords(KEYS.payments).filter(p => p.id !== paymentId);
  replaceOwn(KEYS.payments, remaining);

  renderAll();
  showMessage("Pagamento excluído. O saldo e o histórico foram atualizados.");
}

/* DESPESAS */

function renderExpenses() {
  const expenses = ownRecords(KEYS.expenses)
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));

  const total = expenses.reduce((sum, expense) => sum + numberValue(expense.amount), 0);
  $("expenses-total").textContent = money(total);

  $("expenses-list").innerHTML = table(
    ["Data", "Descrição", "Categoria", "Valor", "Ações"],
    expenses.map(e => `<tr>
      <td>${dateBR(e.date)}</td>
      <td><strong>${escapeHTML(e.description)}</strong></td>
      <td>${escapeHTML(e.category || "Geral")}</td>
      <td><strong>${money(e.amount)}</strong></td>
      <td><div class="table-actions">${actionButton("delete-expense", e.id, "Excluir", "danger")}</div></td>
    </tr>`),
    "Nenhuma despesa cadastrada."
  );
}

/* PAINEL E HISTÓRICO */

function renderDashboard() {
  const loans = ownRecords(KEYS.loans);
  const payments = ownRecords(KEYS.payments);
  const totalLent = loans.reduce((sum, l) => sum + numberValue(l.amount), 0);
  const totalReceived = payments.reduce((sum, p) => sum + numberValue(p.amount), 0);
  const outstanding = loans.reduce((sum, l) => sum + loanBalance(l), 0);
  const activeLoans = loans.filter(l => !isPaid(l)).length;

  $("stat-active-loans").textContent = activeLoans;
  $("stat-lent").textContent = money(totalLent);
  $("stat-received").textContent = money(totalReceived);
  $("stat-outstanding").textContent = money(outstanding);

  const recentLoans = [...loans]
    .sort((a, b) => String(b.createdAt || b.date || "").localeCompare(String(a.createdAt || a.date || "")))
    .slice(0, 5);

  $("dashboard-loans").innerHTML = table(
    ["Cliente", "Contrato", "Saldo", "Situação"],
    recentLoans.map(l => `<tr>
      <td><strong>${escapeHTML(customerName(l.customerId))}</strong><small>${dateBR(l.date)}</small></td>
      <td>${money(loanTotal(l))}</td>
      <td>${money(loanBalance(l))}</td>
      <td>${isPaid(l) ? '<span class="status paid">Quitado</span>' : '<span class="status open">Em aberto</span>'}</td>
    </tr>`),
    "Nenhum empréstimo cadastrado."
  );

  const recentPayments = [...payments]
    .sort((a, b) => String(b.createdAt || b.date || "").localeCompare(String(a.createdAt || a.date || "")))
    .slice(0, 5);

  $("dashboard-payments").innerHTML = table(
    ["Data", "Cliente", "Valor"],
    recentPayments.map(p => {
      const loan = getLoan(p.loanId);
      return `<tr>
        <td>${dateBR(p.date)}</td>
        <td>${escapeHTML(loan ? customerName(loan.customerId) : "Empréstimo removido")}</td>
        <td><strong>${money(p.amount)}</strong></td>
      </tr>`;
    }),
    "Nenhum pagamento registrado."
  );
}

function renderHistory() {
  const payments = ownRecords(KEYS.payments);
  const expenses = ownRecords(KEYS.expenses);
  const received = payments.reduce((sum, p) => sum + numberValue(p.amount), 0);
  const spent = expenses.reduce((sum, e) => sum + numberValue(e.amount), 0);

  $("history-received").textContent = money(received);
  $("history-expenses").textContent = money(spent);
  $("history-net").textContent = money(received - spent);

  const events = [
    ...payments.map(p => ({
      date: p.date,
      sort: p.createdAt || p.date,
      type: "Pagamento recebido",
      description: customerName(getLoan(p.loanId)?.customerId),
      amount: numberValue(p.amount),
      positive: true
    })),
    ...expenses.map(e => ({
      date: e.date,
      sort: e.createdAt || e.date,
      type: "Despesa",
      description: e.description,
      amount: numberValue(e.amount),
      positive: false
    })),
    ...ownRecords(KEYS.loans).map(l => ({
      date: l.date,
      sort: l.createdAt || l.date,
      type: "Empréstimo cadastrado",
      description: customerName(l.customerId),
      amount: numberValue(l.amount),
      positive: false
    }))
  ].sort((a, b) => String(b.sort || "").localeCompare(String(a.sort || "")));

  $("history-list").innerHTML = table(
    ["Data", "Movimentação", "Descrição", "Valor"],
    events.map(e => `<tr>
      <td>${dateBR(e.date)}</td>
      <td>${escapeHTML(e.type)}</td>
      <td>${escapeHTML(e.description || "—")}</td>
      <td><strong>${e.positive ? "+" : ""}${money(e.amount)}</strong></td>
    </tr>`),
    "Nenhuma movimentação registrada."
  );
}

function renderAll() {
  if (!currentUser) return;
  renderCustomers();
  renderLoans();
  renderPayments();
  renderExpenses();
  renderDashboard();
  renderHistory();
}

/* EXCLUSÕES */

function deleteCustomer(customerId) {
  const customer = getCustomer(customerId);
  if (!customer) return;

  const relatedLoans = ownRecords(KEYS.loans).filter(l => l.customerId === customerId);
  if (relatedLoans.length) {
    return showMessage("Este cliente tem empréstimos vinculados. Exclua primeiro os empréstimos relacionados.", true);
  }

  if (!confirm(`Deseja excluir o cliente "${customer.name}"?`)) return;

  replaceOwn(KEYS.customers, ownRecords(KEYS.customers).filter(c => c.id !== customerId));
  renderAll();
  showMessage("Cliente excluído.");
}

function deleteLoan(loanId) {
  const loan = getLoan(loanId);
  if (!loan) return;

  const relatedPayments = getPayments(loanId);
  let message = `Excluir o empréstimo de ${customerName(loan.customerId)}?`;
  if (relatedPayments.length) {
    message += "\n\nOs pagamentos relacionados também serão excluídos do histórico.";
  }
  if (!confirm(message)) return;

  replaceOwn(KEYS.payments, ownRecords(KEYS.payments).filter(p => p.loanId !== loanId));
  replaceOwn(KEYS.loans, ownRecords(KEYS.loans).filter(l => l.id !== loanId));
  renderAll();
  showMessage("Empréstimo excluído.");
}

function deleteExpense(expenseId) {
  const expense = ownRecords(KEYS.expenses).find(e => e.id === expenseId);
  if (!expense) return;
  if (!confirm(`Excluir a despesa "${expense.description}" de ${money(expense.amount)}?`)) return;

  replaceOwn(KEYS.expenses, ownRecords(KEYS.expenses).filter(e => e.id !== expenseId));
  renderAll();
  showMessage("Despesa excluída.");
}

/* EVENTOS DOS FORMULÁRIOS */

$("login-form").addEventListener("submit", async event => {
  event.preventDefault();

  const email = $("login-email").value.trim().toLowerCase();
  const password = $("login-password").value;
  const users = read(KEYS.users);
  const user = users.find(u => String(u.email).toLowerCase() === email);

  if (!user) return showMessage("E-mail ou senha incorretos.", true, true);

  const hashed = await hashPassword(password);
  const storedHash = user.passwordHash ?? user.password;
  if (storedHash !== hashed && storedHash !== password) {
    return showMessage("E-mail ou senha incorretos.", true, true);
  }

  currentUser = user;
  localStorage.setItem(KEYS.session, JSON.stringify({ userId: user.id }));
  showApp();
});

$("register-form").addEventListener("submit", async event => {
  event.preventDefault();

  const name = $("register-name").value.trim();
  const email = $("register-email").value.trim().toLowerCase();
  const password = $("register-password").value;

  if (name.length < 2) return showMessage("Informe seu nome completo.", true, true);
  if (password.length < 4) return showMessage("A senha precisa ter pelo menos 4 caracteres.", true, true);

  const users = read(KEYS.users);
  if (users.some(u => String(u.email).toLowerCase() === email)) {
    return showMessage("Já existe uma conta com esse e-mail.", true, true);
  }

  const user = {
    id: id(),
    name,
    email,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString()
  };

  users.push(user);
  save(KEYS.users, users);

  currentUser = user;
  localStorage.setItem(KEYS.session, JSON.stringify({ userId: user.id }));
  showApp();
  showMessage("Conta criada com sucesso!");
});

$("customer-form").addEventListener("submit", event => {
  event.preventDefault();

  const name = $("customer-name").value.trim();
  if (!name) return showMessage("Informe o nome do cliente.", true);

  const customer = {
    id: id(),
    userId: currentUser.id,
    name,
    phone: $("customer-phone").value.trim(),
    document: $("customer-document").value.trim(),
    address: $("customer-address").value.trim(),
    notes: $("customer-notes").value.trim(),
    createdAt: new Date().toISOString()
  };

  save(KEYS.customers, [...read(KEYS.customers), customer]);
  $("customer-form").reset();
  renderAll();
  showMessage("Cliente cadastrado com sucesso!");
});

$("loan-form").addEventListener("submit", event => {
  event.preventDefault();

  const customerId = $("loan-customer").value;
  const amount = numberValue($("loan-amount").value);
  const rate = numberValue($("loan-interest").value);
  const term = numberValue($("loan-term").value);
  const dailyPayment = numberValue($("loan-daily-payment").value);
  const date = $("loan-date").value;
  const dueDate = $("loan-due-date").value;

  if (!getCustomer(customerId)) return showMessage("Selecione um cliente cadastrado.", true);
  if (amount <= 0) return showMessage("Informe um valor de empréstimo válido.", true);
  if (![20, 25].includes(term)) return showMessage("Selecione um prazo de 20 ou 25 dias.", true);
  if (dailyPayment <= 0) return showMessage("Informe o valor da parcela diária.", true);
  if (!date || !dueDate || dueDate < date) return showMessage("Confira as datas do empréstimo.", true);

  const total = Math.round(dailyPayment * term * 100) / 100;

  const loan = {
    id: id(),
    userId: currentUser.id,
    customerId,
    amount,
    rate,
    term,
    days: term,
    dailyPayment,
    total,
    date,
    dueDate,
    notes: $("loan-notes").value.trim(),
    createdAt: new Date().toISOString()
  };

  save(KEYS.loans, [...read(KEYS.loans), loan]);
  $("loan-form").reset();
  $("loan-date").value = today();
  $("loan-term").value = "20";
  updateDueDate();
  renderAll();
  showMessage(`Empréstimo cadastrado. Total das ${term} parcelas: ${money(total)}.`);
});

$("payment-form").addEventListener("submit", event => {
  event.preventDefault();

  const loanId = $("payment-loan").value;
  const loan = getLoan(loanId);
  const amount = numberValue($("payment-amount").value);
  const date = $("payment-date").value;

  if (!loan) return showMessage("Selecione um empréstimo em aberto.", true);
  if (amount <= 0) return showMessage("Informe um valor de pagamento válido.", true);
  if (!date) return showMessage("Informe a data do pagamento.", true);

  const balance = loanBalance(loan);
  if (amount > balance + 0.005) {
    return showMessage(`O pagamento não pode ser maior que o saldo restante (${money(balance)}).`, true);
  }

  const payment = {
    id: id(),
    userId: currentUser.id,
    loanId,
    amount: Math.round(amount * 100) / 100,
    date,
    notes: $("payment-notes").value.trim(),
    createdAt: new Date().toISOString()
  };

  save(KEYS.payments, [...read(KEYS.payments), payment]);
  $("payment-form").reset();
  $("payment-date").value = today();
  $("payment-amount").dataset.edited = "";
  renderAll();
  openReceipt(payment.id);
  showMessage("Pagamento registrado. Confira o recibo para compartilhar.");
});

$("expense-form").addEventListener("submit", event => {
  event.preventDefault();

  const description = $("expense-description").value.trim();
  const amount = numberValue($("expense-amount").value);
  const date = $("expense-date").value;

  if (!description || amount <= 0 || !date) {
    return showMessage("Preencha a descrição, o valor e a data da despesa.", true);
  }

  const expense = {
    id: id(),
    userId: currentUser.id,
    description,
    amount,
    date,
    category: $("expense-category").value,
    createdAt: new Date().toISOString()
  };

  save(KEYS.expenses, [...read(KEYS.expenses), expense]);
  $("expense-form").reset();
  $("expense-date").value = today();
  renderAll();
  showMessage("Despesa cadastrada.");
});

/* NAVEGAÇÃO E BOTÕES */

document.querySelectorAll("[data-auth-tab]").forEach(button => {
  button.addEventListener("click", () => switchAuth(button.dataset.authTab));
});

document.querySelectorAll("[data-page]").forEach(button => {
  button.addEventListener("click", () => navigate(button.dataset.page));
});

document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => navigate(button.dataset.go));
});

$("logout-btn").addEventListener("click", logout);

$("loan-term").addEventListener("change", updateDueDate);
$("loan-date").addEventListener("change", updateDueDate);
$("loan-daily-payment").addEventListener("input", updateLoanPreview);

$("payment-loan").addEventListener("change", () => {
  const loan = getLoan($("payment-loan").value);
  const input = $("payment-amount");
  input.dataset.edited = "";
  if (loan) {
    input.value = Math.min(numberValue(loan.dailyPayment) || loanBalance(loan), loanBalance(loan)).toFixed(2);
  } else {
    input.value = "";
  }
});

$("payment-amount").addEventListener("input", event => {
  event.target.dataset.edited = "1";
});

$("customer-search").addEventListener("input", renderCustomers);
$("loan-search").addEventListener("input", renderLoans);

document.addEventListener("click", event => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const { action, id: recordId } = button.dataset;

  switch (action) {
    case "delete-customer": deleteCustomer(recordId); break;
    case "delete-loan": deleteLoan(recordId); break;
    case "delete-payment": deletePayment(recordId); break;
    case "delete-expense": deleteExpense(recordId); break;
    case "receipt": openReceipt(recordId); break;
    case "pay-loan": {
      navigate("payments");
      $("payment-loan").value = recordId;
      $("payment-loan").dispatchEvent(new Event("change"));
      $("payment-amount").focus();
      break;
    }
  }
});

$("receipt-close").addEventListener("click", () => {
  $("receipt-modal").hidden = true;
  currentReceipt = null;
});

$("receipt-modal").addEventListener("click", event => {
  if (event.target === $("receipt-modal")) {
    $("receipt-modal").hidden = true;
    currentReceipt = null;
  }
});

$("receipt-whatsapp").addEventListener("click", () => {
  if (!currentReceipt) return;
  const text = encodeURIComponent(receiptText(currentReceipt));
  const url = `https://wa.me/?text=${text}`;
  window.open(url, "_blank", "noopener,noreferrer");
});

/* INICIALIZAÇÃO */

function init() {
  setDefaultDates();

  let session = null;
  try {
    session = JSON.parse(localStorage.getItem(KEYS.session) || "null");
  } catch {
    session = null;
  }

  if (session?.userId) {
    currentUser = read(KEYS.users).find(user => user.id === session.userId) || null;
  }

  if (currentUser) {
    showApp();
  } else {
    $("auth-screen").hidden = false;
    $("app-screen").hidden = true;
    switchAuth("login");
  }
}

init();
