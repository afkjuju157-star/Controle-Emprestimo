"use strict";

/* =========================================================
   CREDIFÁCIL — CONTROLE DE EMPRÉSTIMOS
   Cadastro, login, clientes, empréstimos, pagamentos,
   recibos, despesas e encerramento diário às 23h.
   ========================================================= */

const KEYS = {
  users: "credifacil_users_v1",
  session: "credifacil_session_v1",
  customers: "credifacil_customers_v1",
  loans: "credifacil_loans_v1",
  payments: "credifacil_payments_v1",
  expenses: "credifacil_expenses_v1",
  lastEmail: "credifacil_last_email_v1",
  logoutDay: "credifacil_logout_day_v1"
};

const $ = (id) => document.getElementById(id);

let currentUser = null;
let currentReceipt = null;
let messageTimer = null;
let logoutTimer = null;

/* =========================================================
   ARMAZENAMENTO
   ========================================================= */

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
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return Date.now().toString(36) +
    Math.random().toString(36).slice(2);
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

/* Liga eventos somente quando o elemento existe. */

function on(idName, eventName, callback) {
  const element = $(idName);

  if (element) {
    element.addEventListener(eventName, callback);
  }

  return element;
}

function ownRecords(key) {
  if (!currentUser) return [];

  return read(key).filter(item => item.userId === currentUser.id);
}

function replaceOwn(key, records) {
  if (!currentUser) return;

  const all = read(key).filter(
    item => item.userId !== currentUser.id
  );

  save(key, [...all, ...records]);
}

/* =========================================================
   MENSAGENS
   ========================================================= */

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

/* =========================================================
   SENHAS
   ========================================================= */

async function hashPassword(password) {
  if (window.crypto?.subtle) {
    try {
      const bytes = new TextEncoder().encode(password);

      const hash = await window.crypto.subtle.digest(
        "SHA-256",
        bytes
      );

      return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
    } catch (error) {
      console.warn("Não foi possível calcular o hash da senha.");
    }
  }

  /*
   * Compatibilidade com contas antigas que possam ter sido
   * criadas quando o aplicativo estava aberto localmente.
   *
   * Para segurança real de contas, use um servidor de
   * autenticação. O armazenamento local não é um servidor.
   */
  return password;
}

/* =========================================================
   SESSÃO E ENCERRAMENTO ÀS 23H
   ========================================================= */

function currentDayKey() {
  return today();
}

function saveLastEmail(email) {
  try {
    if (email) {
      localStorage.setItem(KEYS.lastEmail, email.trim().toLowerCase());
    }
  } catch (error) {
    console.warn("Não foi possível guardar o e-mail.");
  }
}

function restoreLastEmail() {
  const input = $("login-email");

  if (!input) return;

  try {
    const email = localStorage.getItem(KEYS.lastEmail) || "";

    if (email && !input.value) {
      input.value = email;
    }
  } catch (error) {
    // O login continua disponível mesmo sem armazenamento.
  }
}

function stopLogoutTimer() {
  if (logoutTimer !== null) {
    clearTimeout(logoutTimer);
    logoutTimer = null;
  }
}

function logout() {
  stopLogoutTimer();

  try {
    localStorage.removeItem(KEYS.session);
  } catch (error) {
    console.warn("Não foi possível encerrar a sessão salva.");
  }

  currentUser = null;
  currentReceipt = null;

  if ($("app-screen")) $("app-screen").hidden = true;
  if ($("auth-screen")) $("auth-screen").hidden = false;

  switchAuth("login");

  if ($("login-password")) {
    $("login-password").value = "";
  }

  restoreLastEmail();

  showMessage(
    "Sua sessão foi encerrada. Entre novamente no Credifácil.",
    false,
    true
  );
}

function logoutAtElevenPM() {
  const now = new Date();

  const target = new Date(now);
  target.setHours(23, 0, 0, 0);

  /*
   * Se o horário de 23h de hoje já passou, agenda para
   * as 23h do próximo dia.
   */
  if (now.getTime() >= target.getTime()) {
    target.setDate(target.getDate() + 1);
  }

  const delay = target.getTime() - now.getTime();

  stopLogoutTimer();

  logoutTimer = setTimeout(() => {
    /*
     * O marcador impede que o aplicativo repita o
     * encerramento várias vezes no mesmo dia.
     */
    try {
      localStorage.setItem(KEYS.logoutDay, currentDayKey());
    } catch (error) {
      console.warn("Não foi possível salvar o horário.");
    }

    if (currentUser) {
      logout();
      showMessage(
        "São 23h. Sua sessão foi encerrada. Entre novamente amanhã ou quando desejar.",
        false,
        true
      );
    }

    /*
     * Agenda novamente para as 23h do dia seguinte.
     */
    logoutAtElevenPM();

  }, Math.min(delay, 2147483647));
}

function checkSessionAtStartup() {
  let session = null;

  try {
    session = JSON.parse(
      localStorage.getItem(KEYS.session) || "null"
    );
  } catch {
    session = null;
  }

  /*
   * Se o aplicativo foi fechado durante a noite, não é
   * possível executar JavaScript em segundo plano.
   * Na próxima abertura, a sessão é conferida novamente.
   */
  let logoutDay = "";

  try {
    logoutDay = localStorage.getItem(KEYS.logoutDay) || "";
  } catch {
    logoutDay = "";
  }

  const now = new Date();
  const afterEleven = now.getHours() >= 23;

  if (session?.userId && afterEleven && logoutDay !== today()) {
    try {
      localStorage.setItem(KEYS.logoutDay, today());
      localStorage.removeItem(KEYS.session);
    } catch (error) {
      console.warn("Não foi possível atualizar a sessão.");
    }

    session = null;
  }

  if (session?.userId) {
    currentUser = read(KEYS.users).find(
      user => user.id === session.userId
    ) || null;
  }

  if (currentUser) {
    showApp();
  } else {
    currentUser = null;

    if ($("auth-screen")) $("auth-screen").hidden = false;
    if ($("app-screen")) $("app-screen").hidden = true;

    switchAuth("login");
    restoreLastEmail();
  }

  logoutAtElevenPM();
}

/* =========================================================
   CLIENTES E EMPRÉSTIMOS
   ========================================================= */

function getCustomer(customerId) {
  return ownRecords(KEYS.customers).find(
    customer => customer.id === customerId
  );
}

function getLoan(loanId) {
  return ownRecords(KEYS.loans).find(
    loan => loan.id === loanId
  );
}

function getPayments(loanId) {
  return ownRecords(KEYS.payments).filter(
    payment => payment.loanId === loanId
  );
}

function loanReceived(loanId) {
  return getPayments(loanId).reduce(
    (sum, payment) => sum + numberValue(payment.amount),
    0
  );
}

function loanTotal(loan) {
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

/* =========================================================
   DATAS E PRAZOS
   ========================================================= */

function setDefaultDates() {
  ["loan-date", "payment-date", "expense-date"].forEach(idName => {
    const input = $(idName);

    if (input && !input.value) {
      input.value = today();
    }
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

  if ($("loan-total-preview")) {
    $("loan-total-preview").textContent = money(total);
  }

  if ($("loan-preview-detail")) {
    $("loan-preview-detail").textContent = daily > 0
      ? `${term} parcelas de ${money(daily)}. Total previsto: ${money(total)}.`
      : `Informe o valor da parcela diária para ${term} dias.`;
  }
}

/* =========================================================
   LOGIN E CADASTRO — TELAS
   ========================================================= */

function switchAuth(tab) {
  if ($("login-form")) {
    $("login-form").hidden = tab !== "login";
  }

  if ($("register-form")) {
    $("register-form").hidden = tab !== "register";
  }

  document.querySelectorAll("[data-auth-tab]").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.authTab === tab
    );
  });

  if ($("auth-message")) {
    $("auth-message").textContent = "";
  }

  if (tab === "login") {
    restoreLastEmail();
  }
}

function showApp() {
  if (!currentUser) return;

  if ($("auth-screen")) $("auth-screen").hidden = true;
  if ($("app-screen")) $("app-screen").hidden = false;

  if ($("sidebar-user-name")) {
    $("sidebar-user-name").textContent = currentUser.name || "Usuário";
  }

  if ($("sidebar-user-email")) {
    $("sidebar-user-email").textContent = currentUser.email || "";
  }

  if ($("today-label")) {
    $("today-label").textContent = new Date().toLocaleDateString(
      "pt-BR",
      {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  }

  setDefaultDates();
  renderAll();
  navigate("dashboard");
}

/* =========================================================
   NAVEGAÇÃO
   ========================================================= */

function navigate(page) {
  const validPages = [
    "dashboard",
    "customers",
    "loans",
    "payments",
    "expenses",
    "history"
  ];

  if (!validPages.includes(page)) {
    page = "dashboard";
  }

  document.querySelectorAll(".page").forEach(section => {
    section.classList.toggle(
      "active",
      section.id === `page-${page}`
    );
  });

  document.querySelectorAll(".nav-link").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.page === page
    );
  });

  const titles = {
    dashboard: "Painel",
    customers: "Clientes",
    loans: "Empréstimos",
    payments: "Pagamentos",
    expenses: "Despesas",
    history: "Histórico"
  };

  if ($("page-title")) {
    $("page-title").textContent = titles[page];
  }

  if (page === "loans") populateLoanCustomers();
  if (page === "payments") populatePaymentLoans();
}

/* =========================================================
   TABELAS
   ========================================================= */

function emptyTable(message) {
  return `<div class="empty-state">${escapeHTML(message)}</div>`;
}

function table(headers, rows, emptyMessage) {
  if (!rows.length) {
    return emptyTable(emptyMessage);
  }

  return `
    <table>
      <thead>
        <tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>
      </thead>
      <tbody>${rows.join("")}</tbody>
    </table>
  `;
}

function actionButton(action, recordId, label, style = "secondary") {
  return `
    <button
      type="button"
      class="btn ${style} small"
      data-action="${action}"
      data-id="${escapeHTML(recordId)}"
    >${escapeHTML(label)}</button>
  `;
}

/* =========================================================
   CLIENTES
   ========================================================= */

function renderCustomers() {
  if (!$("customers-list")) return;

  const query = ($("customer-search")?.value || "")
    .trim()
    .toLowerCase();

  const customers = ownRecords(KEYS.customers)
    .filter(customer =>
      `${customer.name} ${customer.phone || ""} ${customer.document || ""}`
        .toLowerCase()
        .includes(query)
    )
    .sort((a, b) =>
      String(a.name).localeCompare(String(b.name), "pt-BR")
    );

  $("customers-list").innerHTML = table(
    ["Cliente", "Telefone", "CPF", "Empréstimos", "Ações"],
    customers.map(customer => {
      const count = ownRecords(KEYS.loans).filter(
        loan => loan.customerId === customer.id
      ).length;

      return `
        <tr>
          <td>
            <strong>${escapeHTML(customer.name)}</strong>
            <small>${escapeHTML(customer.address || "")}</small>
          </td>
          <td>${escapeHTML(customer.phone || "—")}</td>
          <td>${escapeHTML(customer.document || "—")}</td>
          <td>${count}</td>
          <td>
            <div class="table-actions">
              ${actionButton("delete-customer", customer.id, "Excluir", "danger")}
            </div>
          </td>
        </tr>
      `;
    }),
    "Nenhum cliente cadastrado."
  );

  populateLoanCustomers();
}

function populateLoanCustomers() {
  const select = $("loan-customer");

  if (!select) return;

  const previous = select.value;

  const customers = ownRecords(KEYS.customers).sort(
    (a, b) => String(a.name).localeCompare(String(b.name), "pt-BR")
  );

  select.innerHTML =
    '<option value="">Selecione um cliente</option>' +
    customers.map(customer =>
      `<option value="${escapeHTML(customer.id)}">${escapeHTML(customer.name)}</option>`
    ).join("");

  if (customers.some(customer => customer.id === previous)) {
    select.value = previous;
  }
}

/* =========================================================
   EMPRÉSTIMOS
   ========================================================= */

function renderLoans() {
  if (!$("loans-list")) return;

  const query = ($("loan-search")?.value || "")
    .trim()
    .toLowerCase();

  const loans = ownRecords(KEYS.loans)
    .filter(loan =>
      customerName(loan.customerId).toLowerCase().includes(query)
    )
    .sort((a, b) =>
      String(b.createdAt || b.date || "")
        .localeCompare(String(a.createdAt || a.date || ""))
    );

  $("loans-list").innerHTML = table(
    [
      "Cliente / data",
      "Contrato",
      "Prazo",
      "Recebido",
      "Saldo",
      "Situação",
      "Ações"
    ],
    loans.map(loan => {
      const received = loanReceived(loan.id);
      const balance = loanBalance(loan);
      const term = loan.term || loan.days || "—";
      const daily = numberValue(loan.dailyPayment);

      const status = isPaid(loan)
        ? '<span class="status paid">Quitado</span>'
        : '<span class="status open">Em aberto</span>';

      return `
        <tr>
          <td>
            <strong>${escapeHTML(customerName(loan.customerId))}</strong>
            <small>${dateBR(loan.date)}</small>
          </td>
          <td>
            <strong>${money(loanTotal(loan))}</strong>
            <small>Emprestado: ${money(loan.amount)}</small>
            ${daily ? `<small>Parcela: ${money(daily)}</small>` : ""}
          </td>
          <td>
            ${escapeHTML(term)}${term !== "—" ? " dias" : ""}
            <small>Final: ${dateBR(loan.dueDate)}</small>
          </td>
          <td>${money(received)}</td>
          <td><strong>${money(balance)}</strong></td>
          <td>${status}</td>
          <td>
            <div class="table-actions">
              ${!isPaid(loan) ? actionButton("pay-loan", loan.id, "Receber", "primary") : ""}
              ${actionButton("delete-loan", loan.id, "Excluir", "danger")}
            </div>
          </td>
        </tr>
      `;
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
    .filter(loan => !isPaid(loan))
    .sort((a, b) =>
      customerName(a.customerId).localeCompare(
        customerName(b.customerId),
        "pt-BR"
      )
    );

  select.innerHTML =
    '<option value="">Selecione um empréstimo</option>' +
    loans.map(loan =>
      `<option value="${escapeHTML(loan.id)}">${escapeHTML(loanLabel(loan))}</option>`
    ).join("");

  if (loans.some(loan => loan.id === previous)) {
    select.value = previous;
  }

  const selected = getLoan(select.value);
  const amount = $("payment-amount");

  if (selected && amount && !amount.dataset.edited) {
    amount.value = numberValue(selected.dailyPayment) > 0
      ? Math.min(
          numberValue(selected.dailyPayment),
          loanBalance(selected)
        ).toFixed(2)
      : loanBalance(selected).toFixed(2);
  }
}

/* =========================================================
   PAGAMENTOS E RECIBOS
   ========================================================= */

function renderPayments() {
  if (!$("payments-list")) return;

  const payments = ownRecords(KEYS.payments).sort(
    (a, b) =>
      String(b.createdAt || b.date || "")
        .localeCompare(String(a.createdAt || a.date || ""))
  );

  $("payments-list").innerHTML = table(
    ["Data", "Cliente", "Valor", "Empréstimo", "Ações"],
    payments.map(payment => {
      const loan = getLoan(payment.loanId);

      return `
        <tr>
          <td>${dateBR(payment.date)}</td>
          <td>
            <strong>${escapeHTML(loan ? customerName(loan.customerId) : "Empréstimo removido")}</strong>
          </td>
          <td><strong>${money(payment.amount)}</strong></td>
          <td>
            ${loan ? money(loanTotal(loan)) : "—"}
            ${loan ? `<small>Saldo atual: ${money(loanBalance(loan))}</small>` : ""}
          </td>
          <td>
            <div class="table-actions">
              ${actionButton("receipt", payment.id, "Recibo", "secondary")}
              ${actionButton("delete-payment", payment.id, "Excluir", "danger")}
            </div>
          </td>
        </tr>
      `;
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
  const payment = ownRecords(KEYS.payments).find(
    item => item.id === paymentId
  );

  if (!payment) {
    return showMessage("Pagamento não encontrado.", true);
  }

  currentReceipt = payment;

  const loan = getLoan(payment.loanId);
  const customer = loan ? getCustomer(loan.customerId) : null;

  if (!$("receipt-content") || !$("receipt-modal")) {
    return showMessage("A tela do recibo não foi encontrada.", true);
  }

  $("receipt-content").innerHTML = `
    <div class="receipt">
      <h2>CrediFácil</h2>
      <p class="muted">Recibo de pagamento</p>
      <div class="receipt-row">
        <span>Cliente</span>
        <strong>${escapeHTML(customer?.name || "Cliente")}</strong>
      </div>
      <div class="receipt-row">
        <span>Valor recebido</span>
        <strong>${money(payment.amount)}</strong>
      </div>
      <div class="receipt-row">
        <span>Data</span>
        <strong>${dateBR(payment.date)}</strong>
      </div>
      <div class="receipt-row">
        <span>Referência</span>
        <strong>${escapeHTML(payment.notes || "Pagamento")}</strong>
      </div>
      ${loan ? `<div class="receipt-row"><span>Total do contrato</span><strong>${money(loanTotal(loan))}</strong></div>` : ""}
      ${loan ? `<div class="receipt-row"><span>Total recebido</span><strong>${money(loanReceived(loan.id))}</strong></div>` : ""}
      ${loan ? `<div class="receipt-row"><span>Saldo restante</span><strong>${money(loanBalance(loan))}</strong></div>` : ""}
      <p class="muted small-note">Guarde este recibo para conferência.</p>
    </div>
  `;

  $("receipt-modal").hidden = false;
}

function deletePayment(paymentId) {
  const payment = ownRecords(KEYS.payments).find(
    item => item.id === paymentId
  );

  if (!payment) {
    return showMessage("Pagamento não encontrado.", true);
  }

  const confirmText =
    `Excluir o pagamento de ${money(payment.amount)} registrado em ${dateBR(payment.date)}?\n\n` +
    "O saldo do empréstimo será recalculado automaticamente.";

  if (!confirm(confirmText)) return;

  replaceOwn(
    KEYS.payments,
    ownRecords(KEYS.payments).filter(
      item => item.id !== paymentId
    )
  );

  renderAll();
  showMessage("Pagamento excluído. O saldo e o histórico foram atualizados.");
}

/* =========================================================
   DESPESAS
   ========================================================= */

function renderExpenses() {
  if (!$("expenses-list")) return;

  const expenses = ownRecords(KEYS.expenses).sort(
    (a, b) => String(b.date || "").localeCompare(String(a.date || ""))
  );

  const total = expenses.reduce(
    (sum, expense) => sum + numberValue(expense.amount),
    0
  );

  if ($("expenses-total")) {
    $("expenses-total").textContent = money(total);
  }

  $("expenses-list").innerHTML = table(
    ["Data", "Descrição", "Categoria", "Valor", "Ações"],
    expenses.map(expense => `
      <tr>
        <td>${dateBR(expense.date)}</td>
        <td><strong>${escapeHTML(expense.description)}</strong></td>
        <td>${escapeHTML(expense.category || "Geral")}</td>
        <td><strong>${money(expense.amount)}</strong></td>
        <td>
          <div class="table-actions">
            ${actionButton("delete-expense", expense.id, "Excluir", "danger")}
          </div>
        </td>
      </tr>
    `),
    "Nenhuma despesa cadastrada."
  );
}

/* =========================================================
   PAINEL
   ========================================================= */

function renderDashboard() {
  const loans = ownRecords(KEYS.loans);
  const payments = ownRecords(KEYS.payments);

  const totalLent = loans.reduce(
    (sum, loan) => sum + numberValue(loan.amount),
    0
  );

  const totalReceived = payments.reduce(
    (sum, payment) => sum + numberValue(payment.amount),
    0
  );

  const outstanding = loans.reduce(
    (sum, loan) => sum + loanBalance(loan),
    0
  );

  const activeLoans = loans.filter(loan => !isPaid(loan)).length;

  if ($("stat-active-loans")) {
    $("stat-active-loans").textContent = activeLoans;
  }

  if ($("stat-lent")) {
    $("stat-lent").textContent = money(totalLent);
  }

  if ($("stat-received")) {
    $("stat-received").textContent = money(totalReceived);
  }

  if ($("stat-outstanding")) {
    $("stat-outstanding").textContent = money(outstanding);
  }

  if ($("dashboard-loans")) {
    const recentLoans = [...loans]
      .sort((a, b) =>
        String(b.createdAt || b.date || "")
          .localeCompare(String(a.createdAt || a.date || ""))
      )
      .slice(0, 5);

    $("dashboard-loans").innerHTML = table(
      ["Cliente", "Contrato", "Saldo", "Situação"],
      recentLoans.map(loan => `
        <tr>
          <td>
            <strong>${escapeHTML(customerName(loan.customerId))}</strong>
            <small>${dateBR(loan.date)}</small>
          </td>
          <td>${money(loanTotal(loan))}</td>
          <td>${money(loanBalance(loan))}</td>
          <td>
            ${isPaid(loan)
              ? '<span class="status paid">Quitado</span>'
              : '<span class="status open">Em aberto</span>'}
          </td>
        </tr>
      `),
      "Nenhum empréstimo cadastrado."
    );
  }

  if ($("dashboard-payments")) {
    const recentPayments = [...payments]
      .sort((a, b) =>
        String(b.createdAt || b.date || "")
          .localeCompare(String(a.createdAt || a.date || ""))
      )
      .slice(0, 5);

    $("dashboard-payments").innerHTML = table(
      ["Data", "Cliente", "Valor"],
      recentPayments.map(payment => {
        const loan = getLoan(payment.loanId);

        return `
          <tr>
            <td>${dateBR(payment.date)}</td>
            <td>${escapeHTML(loan ? customerName(loan.customerId) : "Empréstimo removido")}</td>
            <td><strong>${money(payment.amount)}</strong></td>
          </tr>
        `;
      }),
      "Nenhum pagamento registrado."
    );
  }
}

/* =========================================================
   HISTÓRICO
   ========================================================= */

function renderHistory() {
  if (!$("history-list")) return;

  const payments = ownRecords(KEYS.payments);
  const expenses = ownRecords(KEYS.expenses);

  const received = payments.reduce(
    (sum, payment) => sum + numberValue(payment.amount),
    0
  );

  const spent = expenses.reduce(
    (sum, expense) => sum + numberValue(expense.amount),
    0
  );

  if ($("history-received")) {
    $("history-received").textContent = money(received);
  }

  if ($("history-expenses")) {
    $("history-expenses").textContent = money(spent);
  }

  if ($("history-net")) {
    $("history-net").textContent = money(received - spent);
  }

  const events = [
    ...payments.map(payment => ({
      date: payment.date,
      sort: payment.createdAt || payment.date,
      type: "Pagamento recebido",
      description: customerName(
        getLoan(payment.loanId)?.customerId
      ),
      amount: numberValue(payment.amount),
      positive: true
    })),

    ...expenses.map(expense => ({
      date: expense.date,
      sort: expense.createdAt || expense.date,
      type: "Despesa",
      description: expense.description,
      amount: numberValue(expense.amount),
      positive: false
    })),

    ...ownRecords(KEYS.loans).map(loan => ({
      date: loan.date,
      sort: loan.createdAt || loan.date,
      type: "Empréstimo cadastrado",
      description: customerName(loan.customerId),
      amount: numberValue(loan.amount),
      positive: false
    }))
  ].sort((a, b) =>
    String(b.sort || "").localeCompare(String(a.sort || ""))
  );

  $("history-list").innerHTML = table(
    ["Data", "Movimentação", "Descrição", "Valor"],
    events.map(event => `
      <tr>
        <td>${dateBR(event.date)}</td>
        <td>${escapeHTML(event.type)}</td>
        <td>${escapeHTML(event.description || "—")}</td>
        <td><strong>${event.positive ? "+" : ""}${money(event.amount)}</strong></td>
      </tr>
    `),
    "Nenhuma movimentação registrada."
  );
}

/* =========================================================
   ATUALIZAÇÃO DAS TELAS
   ========================================================= */

function renderAll() {
  if (!currentUser) return;

  renderCustomers();
  renderLoans();
  renderPayments();
  renderExpenses();
  renderDashboard();
  renderHistory();
}

/* =========================================================
   EXCLUSÕES
   ========================================================= */

function deleteCustomer(customerId) {
  const customer = getCustomer(customerId);

  if (!customer) return;

  const relatedLoans = ownRecords(KEYS.loans).filter(
    loan => loan.customerId === customerId
  );

  if (relatedLoans.length) {
    return showMessage(
      "Este cliente tem empréstimos vinculados. Exclua primeiro os empréstimos relacionados.",
      true
    );
  }

  if (!confirm(`Deseja excluir o cliente "${customer.name}"?`)) {
    return;
  }

  replaceOwn(
    KEYS.customers,
    ownRecords(KEYS.customers).filter(
      item => item.id !== customerId
    )
  );

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

  replaceOwn(
    KEYS.payments,
    ownRecords(KEYS.payments).filter(
      payment => payment.loanId !== loanId
    )
  );

  replaceOwn(
    KEYS.loans,
    ownRecords(KEYS.loans).filter(
      item => item.id !== loanId
    )
  );

  renderAll();
  showMessage("Empréstimo excluído.");
}

function deleteExpense(expenseId) {
  const expense = ownRecords(KEYS.expenses).find(
    item => item.id === expenseId
  );

  if (!expense) return;

  if (!confirm(
    `Excluir a despesa "${expense.description}" de ${money(expense.amount)}?`
  )) {
    return;
  }

  replaceOwn(
    KEYS.expenses,
    ownRecords(KEYS.expenses).filter(
      item => item.id !== expenseId
    )
  );

  renderAll();
  showMessage("Despesa excluída.");
}

/* =========================================================
   LOGIN
   ========================================================= */

on("login-form", "submit", async event => {
  event.preventDefault();

  const email = $("login-email")?.value.trim().toLowerCase() || "";
  const password = $("login-password")?.value || "";

  if (!email || !password) {
    return showMessage(
      "Informe seu e-mail e sua senha.",
      true,
      true
    );
  }

  const users = read(KEYS.users);

  const user = users.find(
    item => String(item.email).toLowerCase() === email
  );

  if (!user) {
    return showMessage(
      "E-mail ou senha incorretos. Se ainda não tem conta, toque em Criar conta.",
      true,
      true
    );
  }

  const hashed = await hashPassword(password);
  const storedHash = user.passwordHash ?? user.password;

  if (storedHash !== hashed && storedHash !== password) {
    return showMessage(
      "E-mail ou senha incorretos.",
      true,
      true
    );
  }

  currentUser = user;

  saveLastEmail(email);

  try {
    localStorage.setItem(
      KEYS.session,
      JSON.stringify({
        userId: user.id,
        startedAt: new Date().toISOString()
      })
    );
  } catch (error) {
    currentUser = null;

    return showMessage(
      "Não foi possível salvar a sessão. Verifique o armazenamento do navegador.",
      true,
      true
    );
  }

  showApp();
  showMessage("Bem-vindo ao Credifácil!");
});

/* =========================================================
   CRIAR CONTA
   ========================================================= */

on("register-form", "submit", async event => {
  event.preventDefault();

  const name = $("register-name")?.value.trim() || "";
  const email = $("register-email")?.value.trim().toLowerCase() || "";
  const password = $("register-password")?.value || "";

  if (name.length < 2) {
    return showMessage(
      "Informe seu nome completo.",
      true,
      true
    );
  }

  if (!email || !email.includes("@") || !email.includes(".")) {
    return showMessage(
      "Informe um e-mail válido.",
      true,
      true
    );
  }

  if (password.length < 4) {
    return showMessage(
      "A senha precisa ter pelo menos 4 caracteres.",
      true,
      true
    );
  }

  const users = read(KEYS.users);

  if (users.some(
    user => String(user.email).toLowerCase() === email
  )) {
    return showMessage(
      "Já existe uma conta com esse e-mail. Entre pela tela de login.",
      true,
      true
    );
  }

  const user = {
    id: id(),
    name,
    email,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString()
  };

  try {
    users.push(user);
    save(KEYS.users, users);

    currentUser = user;
    saveLastEmail(email);

    localStorage.setItem(
      KEYS.session,
      JSON.stringify({
        userId: user.id,
        startedAt: new Date().toISOString()
      })
    );
  } catch (error) {
    currentUser = null;

    return showMessage(
      "Não foi possível criar a conta. Verifique o armazenamento disponível.",
      true,
      true
    );
  }

  showApp();
  showMessage("Conta criada com sucesso!");
});

/* =========================================================
   CADASTRAR CLIENTE
   ========================================================= */

on("customer-form", "submit", event => {
  event.preventDefault();

  if (!currentUser) {
    return showMessage("Entre no Credifácil primeiro.", true);
  }

  const name = $("customer-name")?.value.trim() || "";

  if (!name) {
    return showMessage("Informe o nome do cliente.", true);
  }

  const customer = {
    id: id(),
    userId: currentUser.id,
    name,
    phone: $("customer-phone")?.value.trim() || "",
    document: $("customer-document")?.value.trim() || "",
    address: $("customer-address")?.value.trim() || "",
    notes: $("customer-notes")?.value.trim() || "",
    createdAt: new Date().toISOString()
  };

  try {
    save(
      KEYS.customers,
      [...read(KEYS.customers), customer]
    );
  } catch (error) {
    return showMessage(
      "Não foi possível salvar o cliente. Verifique o espaço disponível.",
      true
    );
  }

  $("customer-form").reset();

  renderAll();
  showMessage("Cliente cadastrado com sucesso!");
});

/* =========================================================
   CADASTRAR EMPRÉSTIMO
   ========================================================= */

on("loan-form", "submit", event => {
  event.preventDefault();

  if (!currentUser) {
    return showMessage("Entre no Credifácil primeiro.", true);
  }

  const customerId = $("loan-customer")?.value || "";
  const amount = numberValue($("loan-amount")?.value);
  const rate = numberValue($("loan-interest")?.value);
  const term = numberValue($("loan-term")?.value);
  const dailyPayment = numberValue($("loan-daily-payment")?.value);
  const date = $("loan-date")?.value || "";
  const dueDate = $("loan-due-date")?.value || "";

  if (!getCustomer(customerId)) {
    return showMessage("Selecione um cliente cadastrado.", true);
  }

  if (amount <= 0) {
    return showMessage("Informe um valor de empréstimo válido.", true);
  }

  if (![20, 25].includes(term)) {
    return showMessage("Selecione um prazo de 20 ou 25 dias.", true);
  }

  if (dailyPayment <= 0) {
    return showMessage("Informe o valor da parcela diária.", true);
  }

  if (!date || !dueDate || dueDate < date) {
    return showMessage("Confira as datas do empréstimo.", true);
  }

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
    notes: $("loan-notes")?.value.trim() || "",
    createdAt: new Date().toISOString()
  };

  try {
    save(KEYS.loans, [...read(KEYS.loans), loan]);
  } catch (error) {
    return showMessage(
      "Não foi possível salvar o empréstimo.",
      true
    );
  }

  $("loan-form").reset();

  if ($("loan-date")) $("loan-date").value = today();
  if ($("loan-term")) $("loan-term").value = "20";

  updateDueDate();
  renderAll();

  showMessage(
    `Empréstimo cadastrado. Total das ${term} parcelas: ${money(total)}.`
  );
});

/* =========================================================
   REGISTRAR PAGAMENTO
   ========================================================= */

on("payment-form", "submit", event => {
  event.preventDefault();

  if (!currentUser) {
    return showMessage("Entre no Credifácil primeiro.", true);
  }

  const loanId = $("payment-loan")?.value || "";
  const loan = getLoan(loanId);
  const amount = numberValue($("payment-amount")?.value);
  const date = $("payment-date")?.value || "";

  if (!loan) {
    return showMessage("Selecione um empréstimo em aberto.", true);
  }

  if (amount <= 0) {
    return showMessage("Informe um valor de pagamento válido.", true);
  }

  if (!date) {
    return showMessage("Informe a data do pagamento.", true);
  }

  const balance = loanBalance(loan);

  if (amount > balance + 0.005) {
    return showMessage(
      `O pagamento não pode ser maior que o saldo restante (${money(balance)}).`,
      true
    );
  }

  const payment = {
    id: id(),
    userId: currentUser.id,
    loanId,
    amount: Math.round(amount * 100) / 100,
    date,
    notes: $("payment-notes")?.value.trim() || "",
    createdAt: new Date().toISOString()
  };

  try {
    save(
      KEYS.payments,
      [...read(KEYS.payments), payment]
    );
  } catch (error) {
    return showMessage(
      "Não foi possível salvar o pagamento.",
      true
    );
  }

  $("payment-form").reset();

  if ($("payment-date")) {
    $("payment-date").value = today();
  }

  if ($("payment-amount")) {
    $("payment-amount").dataset.edited = "";
  }

  renderAll();
  openReceipt(payment.id);

  showMessage(
    "Pagamento registrado. Confira o recibo para compartilhar."
  );
});

/* =========================================================
   CADASTRAR DESPESA
   ========================================================= */

on("expense-form", "submit", event => {
  event.preventDefault();

  if (!currentUser) {
    return showMessage("Entre no Credifácil primeiro.", true);
  }

  const description = $("expense-description")?.value.trim() || "";
  const amount = numberValue($("expense-amount")?.value);
  const date = $("expense-date")?.value || "";

  if (!description || amount <= 0 || !date) {
    return showMessage(
      "Preencha a descrição, o valor e a data da despesa.",
      true
    );
  }

  const expense = {
    id: id(),
    userId: currentUser.id,
    description,
    amount,
    date,
    category: $("expense-category")?.value || "Geral",
    createdAt: new Date().toISOString()
  };

  try {
    save(
      KEYS.expenses,
      [...read(KEYS.expenses), expense]
    );
  } catch (error) {
    return showMessage(
      "Não foi possível salvar a despesa.",
      true
    );
  }

  $("expense-form").reset();

  if ($("expense-date")) {
    $("expense-date").value = today();
  }

  renderAll();
  showMessage("Despesa cadastrada.");
});

/* =========================================================
   ABAS DE LOGIN E CADASTRO
   ========================================================= */

document.querySelectorAll("[data-auth-tab]").forEach(button => {
  button.addEventListener("click", () => {
    switchAuth(button.dataset.authTab);
  });
});

/* =========================================================
   BOTÕES DE NAVEGAÇÃO
   ========================================================= */

document.querySelectorAll("[data-page]").forEach(button => {
  button.addEventListener("click", () => {
    navigate(button.dataset.page);
  });
});

document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => {
    navigate(button.dataset.go);
  });
});

on("logout-btn", "click", logout);

/* =========================================================
   ATUALIZAÇÃO DE PRAZO E VALORES
   ========================================================= */

on("loan-term", "change", updateDueDate);
on("loan-date", "change", updateDueDate);
on("loan-daily-payment", "input", updateLoanPreview);

on("payment-loan", "change", () => {
  const loan = getLoan($("payment-loan")?.value);
  const input = $("payment-amount");

  if (!input) return;

  input.dataset.edited = "";

  if (loan) {
    input.value = Math.min(
      numberValue(loan.dailyPayment) || loanBalance(loan),
      loanBalance(loan)
    ).toFixed(2);
  } else {
    input.value = "";
  }
});

on("payment-amount", "input", event => {
  event.target.dataset.edited = "1";
});

on("customer-search", "input", renderCustomers);
on("loan-search", "input", renderLoans);

/* =========================================================
   AÇÕES DAS TABELAS
   ========================================================= */

document.addEventListener("click", event => {
  const button = event.target.closest("[data-action]");

  if (!button) return;

  const { action, id: recordId } = button.dataset;

  switch (action) {
    case "delete-customer":
      deleteCustomer(recordId);
      break;

    case "delete-loan":
      deleteLoan(recordId);
      break;

    case "delete-payment":
      deletePayment(recordId);
      break;

    case "delete-expense":
      deleteExpense(recordId);
      break;

    case "receipt":
      openReceipt(recordId);
      break;

    case "pay-loan":
      navigate("payments");

      if ($("payment-loan")) {
        $("payment-loan").value = recordId;
        $("payment-loan").dispatchEvent(new Event("change"));
      }

      $("payment-amount")?.focus();
      break;
  }
});

/* =========================================================
   MODAL DO RECIBO
   ========================================================= */

on("receipt-close", "click", () => {
  if ($("receipt-modal")) {
    $("receipt-modal").hidden = true;
  }

  currentReceipt = null;
});

on("receipt-modal", "click", event => {
  if (event.target === $("receipt-modal")) {
    $("receipt-modal").hidden = true;
    currentReceipt = null;
  }
});

/* =========================================================
   COMPARTILHAR RECIBO PELO WHATSAPP
   ========================================================= */

on("receipt-whatsapp", "click", () => {
  if (!currentReceipt) return;

  const text = encodeURIComponent(receiptText(currentReceipt));
  const url = `https://wa.me/?text=${text}`;

  window.open(url, "_blank", "noopener,noreferrer");
});

/* =========================================================
   PROTEGER A SESSÃO AO VOLTAR PARA O APLICATIVO
   ========================================================= */

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    const now = new Date();

    if (
      currentUser &&
      now.getHours() >= 23 &&
      (() => {
        try {
          return localStorage.getItem(KEYS.logoutDay) !== today();
        } catch {
          return true;
        }
      })()
    ) {
      try {
        localStorage.setItem(KEYS.logoutDay, today());
      } catch {}

      logout();

      showMessage(
        "Sua sessão foi encerrada às 23h. Entre novamente no Credifácil.",
        false,
        true
      );
    }
  }
});

/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

function init() {
  restoreLastEmail();
  setDefaultDates();
  checkSessionAtStartup();
}

init();