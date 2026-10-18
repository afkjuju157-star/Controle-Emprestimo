"use strict";

/* =========================================================
   CREDIFÁCIL — CONTROLE DE EMPRÉSTIMOS
   Clientes, empréstimos, parcelas, pagamentos, recibos PNG,
   despesas, painel financeiro, histórico e login.
   Armazenamento local por conta.
   ========================================================= */

const $ = (id) => document.getElementById(id);

const KEYS = {
  users: "credifacil_users_v2",
  session: "credifacil_session_v2",
  data: "credifacil_data_v2_"
};

const PAGE_TITLES = {
  dashboard: "Painel financeiro",
  customers: "Clientes",
  loans: "Empréstimos",
  payments: "Pagamentos",
  expenses: "Despesas",
  history: "Histórico"
};

const money = (value) =>
  Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

const fmtDate = (value) => {
  if (!value) return "—";
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("pt-BR");
};

const localISO = (date = new Date()) => {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

const today = () => localISO();

const uid = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`;

const escapeHTML = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function emptyData() {
  return {
    customers: [],
    loans: [],
    payments: [],
    expenses: [],
    history: []
  };
}

let currentUser = null;
let db = emptyData();
let toastTimeout = null;

function dataKey() {
  return KEYS.data + currentUser.id;
}

function saveData() {
  if (currentUser) writeJSON(dataKey(), db);
}

function logAction(action, description) {
  db.history.unshift({
    id: uid(),
    action,
    description,
    date: today(),
    time: new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    })
  });

  db.history = db.history.slice(0, 2000);
  saveData();
}

function notify(message, error = false) {
  const toast = $("toast");
  if (!toast) {
    alert(message);
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");
  toast.classList.toggle("error", error);

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show", "error");
  }, 3500);
}

/* =========================================================
   LOGIN E CADASTRO
   ========================================================= */

async function passwordHash(password) {
  if (window.crypto?.subtle) {
    try {
      const bytes = new TextEncoder().encode(password);
      const hash = await crypto.subtle.digest("SHA-256", bytes);
      return Array.from(new Uint8Array(hash))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
    } catch {
      // Usa o método alternativo abaixo.
    }
  }

  return "local:" + password;
}

function getUsers() {
  return readJSON(KEYS.users, []);
}

function setAuthMode(mode) {
  const loginForm = $("loginForm");
  const registerForm = $("registerForm");

  if (loginForm) loginForm.hidden = mode !== "login";
  if (registerForm) registerForm.hidden = mode !== "register";

  $("loginTab")?.classList.toggle("active", mode === "login");
  $("registerTab")?.classList.toggle("active", mode === "register");
}

$("loginTab")?.addEventListener("click", () => setAuthMode("login"));
$("registerTab")?.addEventListener("click", () => setAuthMode("register"));

$("registerForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = $("registerName")?.value.trim();
  const email = $("registerEmail")?.value.trim().toLowerCase();
  const password = $("registerPassword")?.value;
  const confirm = $("registerConfirm")?.value;

  if (!name || !email || !password) {
    notify("Preencha todos os campos.", true);
    return;
  }

  if (password.length < 4) {
    notify("A senha precisa ter pelo menos 4 caracteres.", true);
    return;
  }

  if (password !== confirm) {
    notify("As senhas não são iguais.", true);
    return;
  }

  const users = getUsers();

  if (users.some((user) => user.email === email)) {
    notify("Este e-mail já está cadastrado.", true);
    return;
  }

  const user = {
    id: uid(),
    name,
    email,
    password: await passwordHash(password)
  };

  users.push(user);
  writeJSON(KEYS.users, users);

  currentUser = user;
  db = emptyData();
  saveData();

  openApp();
  logAction("Cadastro", "Conta criada");
  notify("Conta criada com sucesso!");
});

$("loginForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nameOrEmail = $("loginName")?.value.trim().toLowerCase();
  const password = $("loginPassword")?.value;

  const users = getUsers();
  const user = users.find((item) =>
    item.email === nameOrEmail ||
    item.name.toLowerCase() === nameOrEmail
  );

  if (!user) {
    notify("Conta não encontrada.", true);
    return;
  }

  const hash = await passwordHash(password);

  if (user.password !== hash && user.password !== "local:" + password) {
    notify("Senha incorreta.", true);
    return;
  }

  currentUser = user;
  db = {
    ...emptyData(),
    ...readJSON(dataKey(), {})
  };

  writeJSON(KEYS.session, user.id);
  openApp();
});

function openApp() {
  const auth = $("authScreen");
  const app = $("appScreen");

  if (auth) auth.hidden = true;
  if (app) app.hidden = false;

  if ($("sidebarUser")) $("sidebarUser").textContent = currentUser.name;
  if ($("topUserName")) $("topUserName").textContent = currentUser.name;
  if ($("todayLabel")) $("todayLabel").textContent = fmtDate(today());

  saveData();
  renderAll();
  showPage("dashboard");
}

function logout() {
  localStorage.removeItem(KEYS.session);
  currentUser = null;
  db = emptyData();

  if ($("appScreen")) $("appScreen").hidden = true;
  if ($("authScreen")) $("authScreen").hidden = false;

  setAuthMode("login");
}

$("logoutBtn")?.addEventListener("click", logout);

/* =========================================================
   NAVEGAÇÃO
   ========================================================= */

function showPage(page) {
  if (!PAGE_TITLES[page]) page = "dashboard";

  document.querySelectorAll("[data-page]").forEach((element) => {
    element.classList.toggle("active", element.dataset.page === page);
  });

  document.querySelectorAll(".page").forEach((element) => {
    element.hidden = element.id !== `${page}Page`;
  });

  if ($("pageTitle")) $("pageTitle").textContent = PAGE_TITLES[page];

  $("sidebar")?.classList.remove("open");
}

document.querySelectorAll("[data-page]").forEach((element) => {
  element.addEventListener("click", () => showPage(element.dataset.page));
});

$("menuBtn")?.addEventListener("click", () => {
  $("sidebar")?.classList.toggle("open");
});

document.addEventListener("click", (event) => {
  const sidebar = $("sidebar");
  const menuBtn = $("menuBtn");

  if (
    sidebar &&
    window.innerWidth <= 900 &&
    sidebar.classList.contains("open") &&
    !sidebar.contains(event.target) &&
    !menuBtn?.contains(event.target)
  ) {
    sidebar.classList.remove("open");
  }
});

/* =========================================================
   DATAS E DIAS DE COBRANÇA
   ========================================================= */

function easterDate(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day, 12);
}

function fixedDate(year, month, day) {
  return new Date(year, month - 1, day, 12);
}

function nationalHolidays(year) {
  const easter = easterDate(year);
  const holidays = [
    fixedDate(year, 1, 1),
    fixedDate(year, 4, 21),
    fixedDate(year, 5, 1),
    fixedDate(year, 9, 7),
    fixedDate(year, 10, 12),
    fixedDate(year, 11, 2),
    fixedDate(year, 11, 15),
    fixedDate(year, 11, 20),
    fixedDate(year, 12, 25)
  ];

  const carnivalMonday = new Date(easter);
  carnivalMonday.setDate(easter.getDate() - 48);

  const carnivalTuesday = new Date(easter);
  carnivalTuesday.setDate(easter.getDate() - 47);

  const goodFriday = new Date(easter);
  goodFriday.setDate(easter.getDate() - 2);

  const corpusChristi = new Date(easter);
  corpusChristi.setDate(easter.getDate() + 60);

  holidays.push(carnivalMonday, carnivalTuesday, goodFriday, corpusChristi);

  return holidays.map(localISO);
}

function isNonPaymentDay(date) {
  const d = new Date(`${date}T12:00:00`);
  const day = d.getDay();

  return day === 0 || nationalHolidays(d.getFullYear()).includes(date);
}

function nextPaymentDay(date) {
  const d = new Date(`${date}T12:00:00`);

  while (isNonPaymentDay(localISO(d))) {
    d.setDate(d.getDate() + 1);
  }

  return localISO(d);
}

function addCalendarDays(date, days) {
  const d = new Date(`${date}T12:00:00`);
  d.setDate(d.getDate() + days);
  return localISO(d);
}

function firstMondayAfter(date) {
  const d = new Date(`${date}T12:00:00`);
  d.setDate(d.getDate() + 1);

  while (d.getDay() !== 1) {
    d.setDate(d.getDate() + 1);
  }

  return localISO(d);
}

function installmentDates(start, plan, count) {
  const dates = [];
  let date = start;

  for (let i = 0; i < count; i++) {
    if (plan === "daily20" || plan === "daily24") {
      if (i === 0) {
        date = nextPaymentDay(date);
      } else {
        date = nextPaymentDay(addCalendarDays(date, 1));
      }
    } else {
      if (i === 0) {
        date = firstMondayAfter(date);
      } else {
        date = addCalendarDays(date, 7);
        date = nextPaymentDay(date);
      }
    }

    dates.push(date);
  }

  return dates;
}

function planDetails(plan) {
  if (plan === "daily20") return { count: 20, label: "Diário — 20 parcelas" };
  if (plan === "daily24") return { count: 24, label: "Diário — 24 parcelas" };
  return { count: 3, label: "Semanal — 3 parcelas" };
}

/* =========================================================
   CLIENTES
   ========================================================= */

function findCustomer(id) {
  return db.customers.find((customer) => customer.id === id);
}

function customerLoans(customerId) {
  return db.loans.filter((loan) => loan.customerId === customerId);
}

function loanPayments(loanId) {
  return db.payments.filter((payment) => payment.loanId === loanId);
}

function installmentReceived(loanId, installment) {
  return db.payments
    .filter((payment) =>
      payment.loanId === loanId &&
      Number(payment.installment) === Number(installment)
    )
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
}

function installmentBalance(loan, installment) {
  const received = installmentReceived(loan.id, installment.number);
  return Math.max(0, Number(installment.amount) - received);
}

function installmentStatus(loan, installment) {
  const balance = installmentBalance(loan, installment);
  if (balance <= 0.009) return "Pago";

  if (installment.date < today()) return "Atrasado";

  return "Em aberto";
}

function customerStatus(customerId) {
  const loans = customerLoans(customerId);

  if (!loans.length) return "Sem empréstimo";

  const installments = loans.flatMap((loan) =>
    loan.installments.map((installment) => ({
      loan,
      installment
    }))
  );

  if (installments.length && installments.every(({ loan, installment }) =>
    installmentBalance(loan, installment) <= 0.009
  )) {
    return "Quitado";
  }

  if (installments.some(({ loan, installment }) =>
    installmentStatus(loan, installment) === "Atrasado"
  )) {
    return "Atrasado";
  }

  return "Ativo";
}

function openCustomerForm(customer = null) {
  const panel = $("customerFormPanel");
  if (!panel) return;

  panel.hidden = false;

  $("customerId").value = customer?.id || "";
  $("customerName").value = customer?.name || "";
  $("customerPhone").value = customer?.phone || "";
  $("customerEmail").value = customer?.email || "";
  $("customerNotes").value = customer?.notes || "";

  panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

$("newCustomerBtn")?.addEventListener("click", () => openCustomerForm());

$("customerForm")?.addEventListener("submit", (event) => {
  event.preventDefault();

  const id = $("customerId").value;
  const name = $("customerName").value.trim();

  if (!name) {
    notify("Informe o nome do cliente.", true);
    return;
  }

  const customerData = {
    id: id || uid(),
    name,
    phone: $("customerPhone").value.trim(),
    email: $("customerEmail").value.trim(),
    notes: $("customerNotes").value.trim(),
    updatedAt: today()
  };

  if (id) {
    const index = db.customers.findIndex((customer) => customer.id === id);
    if (index >= 0) db.customers[index] = {
      ...db.customers[index],
      ...customerData
    };
    logAction("Cliente atualizado", name);
  } else {
    customerData.createdAt = today();
    db.customers.push(customerData);
    logAction("Cliente cadastrado", name);
  }

  saveData();
  $("customerForm").reset();
  $("customerId").value = "";

  if ($("customerFormPanel")) $("customerFormPanel").hidden = true;

  renderAll();
  notify("Cliente salvo com sucesso!");
});

function deleteCustomer(id) {
  const customer = findCustomer(id);
  if (!customer) return;

  if (customerLoans(id).length) {
    notify("Este cliente possui empréstimos. Não é possível excluí-lo.", true);
    return;
  }

  if (!confirm(`Excluir o cliente ${customer.name}?`)) return;

  db.customers = db.customers.filter((item) => item.id !== id);
  logAction("Cliente excluído", customer.name);
  saveData();
  renderAll();
  notify("Cliente excluído.");
}

function renderCustomers() {
  const list = $("customerList");
  if (!list) return;

  const search = ($("customerSearch")?.value || "").toLowerCase();
  const filter = $("customerFilter")?.value || "all";

  const customers = db.customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(search) ||
      (customer.phone || "").toLowerCase().includes(search) ||
      (customer.email || "").toLowerCase().includes(search);

    const status = customerStatus(customer.id);
    const matchesFilter = filter === "all" ||
      status.toLowerCase() === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  if (!customers.length) {
    list.innerHTML = `<div class="empty-state">Nenhum cliente encontrado.</div>`;
    return;
  }

  list.innerHTML = customers.map((customer) => {
    const status = customerStatus(customer.id);
    const loans = customerLoans(customer.id);
    const total = loans.reduce((sum, loan) => sum + loan.total, 0);

    return `
      <article class="item-card">
        <div class="item-main">
          <h3>${escapeHTML(customer.name)}</h3>
          <p>${escapeHTML(customer.phone || "Sem telefone")}</p>
          <p>${escapeHTML(customer.email || "")}</p>
          <p>Empréstimos: ${loans.length} · Total: ${money(total)}</p>
          <span class="status">${escapeHTML(status)}</span>
          ${customer.notes ? `<p>${escapeHTML(customer.notes)}</p>` : ""}
        </div>
        <div class="item-actions">
          <button type="button" class="btn-secondary"
            data-edit-customer="${customer.id}">Editar</button>
          <button type="button" class="btn-danger"
            data-delete-customer="${customer.id}">Excluir</button>
        </div>
      </article>
    `;
  }).join("");

  list.querySelectorAll("[data-edit-customer]").forEach((button) => {
    button.addEventListener("click", () =>
      openCustomerForm(findCustomer(button.dataset.editCustomer))
    );
  });

  list.querySelectorAll("[data-delete-customer]").forEach((button) => {
    button.addEventListener("click", () =>
      deleteCustomer(button.dataset.deleteCustomer)
    );
  });
}

$("customerSearch")?.addEventListener("input", renderCustomers);
$("customerFilter")?.addEventListener("change", renderCustomers);

/* =========================================================
   EMPRÉSTIMOS
   ========================================================= */

function selectedPlan() {
  return $("loanPlan")?.value || "daily20";
}

function loanCalculation() {
  const principal = Number($("loanPrincipal")?.value || 0);
  const interest = Number($("loanInterest")?.value || 0);
  const plan = planDetails(selectedPlan());

  const total = principal + principal * interest / 100;
  const installment = plan.count ? total / plan.count : 0;

  return {
    principal,
    interest,
    count: plan.count,
    total,
    installment
  };
}

function updateLoanPreview() {
  const calculation = loanCalculation();

  if ($("interestLabel")) {
    $("interestLabel").textContent = `${calculation.interest}%`;
  }

  if ($("loanPreviewTotal")) {
    $("loanPreviewTotal").textContent = money(calculation.total);
  }

  if ($("loanPreviewInstallment")) {
    $("loanPreviewInstallment").textContent = money(calculation.installment);
  }

  if ($("loanPreviewCount")) {
    $("loanPreviewCount").textContent = calculation.count;
  }

  if ($("loanPreviewAmount")) {
    $("loanPreviewAmount").textContent = money(calculation.principal);
  }
}

["loanPrincipal", "loanInterest", "loanPlan", "loanStart"].forEach((id) => {
  $(id)?.addEventListener("input", updateLoanPreview);
  $(id)?.addEventListener("change", updateLoanPreview);
});

function refreshLoanCustomerOptions() {
  const select = $("loanCustomer");
  if (!select) return;

  const selected = select.value;

  select.innerHTML = `<option value="">Selecione um cliente</option>` +
    db.customers.map((customer) =>
      `<option value="${customer.id}">${escapeHTML(customer.name)}</option>`
    ).join("");

  if (db.customers.some((customer) => customer.id === selected)) {
    select.value = selected;
  }
}

$("loanForm")?.addEventListener("submit", (event) => {
  event.preventDefault();

  const customerId = $("loanCustomer").value;
  const customer = findCustomer(customerId);
  const calculation = loanCalculation();
  const start = $("loanStart")?.value || today();
  const plan = selectedPlan();

  if (!customer) {
    notify("Selecione um cliente.", true);
    return;
  }

  if (calculation.principal <= 0) {
    notify("Informe um valor de empréstimo válido.", true);
    return;
  }

  if (calculation.interest < 0) {
    notify("A taxa de juros não pode ser negativa.", true);
    return;
  }

  const dates = installmentDates(start, plan, calculation.count);

  const loan = {
    id: uid(),
    customerId,
    principal: calculation.principal,
    interest: calculation.interest,
    total: calculation.total,
    plan,
    planLabel: planDetails(plan).label,
    startDate: start,
    notes: $("loanNotes")?.value.trim() || "",
    installments: dates.map((date, index) => ({
      number: index + 1,
      date,
      amount: calculation.installment
    })),
    createdAt: today()
  };

  db.loans.push(loan);
  logAction("Empréstimo criado", `${customer.name} — ${money(loan.total)}`);
  saveData();

  $("loanForm").reset();
  if ($("loanStart")) $("loanStart").value = today();

  updateLoanPreview();
  renderAll();
  notify("Empréstimo cadastrado com sucesso!");
});

function deleteLoan(id) {
  const loan = db.loans.find((item) => item.id === id);
  if (!loan) return;

  if (loanPayments(id).length) {
    notify("Este empréstimo possui pagamentos. Exclua os pagamentos primeiro.", true);
    return;
  }

  const customer = findCustomer(loan.customerId);

  if (!confirm(`Excluir o empréstimo de ${customer?.name || "cliente"}?`)) return;

  db.loans = db.loans.filter((item) => item.id !== id);
  logAction("Empréstimo excluído", customer?.name || id);
  saveData();
  renderAll();
  notify("Empréstimo excluído.");
}

function renderLoans() {
  const list = $("loanList");
  if (!list) return;

  if (!db.loans.length) {
    list.innerHTML = `<div class="empty-state">Nenhum empréstimo cadastrado.</div>`;
    return;
  }

  list.innerHTML = db.loans.slice().reverse().map((loan) => {
    const customer = findCustomer(loan.customerId);
    const received = loanPayments(loan.id)
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    const balance = Math.max(0, loan.total - received);

    return `
      <article class="item-card">
        <div class="item-main">
          <h3>${escapeHTML(customer?.name || "Cliente excluído")}</h3>
          <p>${escapeHTML(loan.planLabel || planDetails(loan.plan).label)}</p>
          <p>Capital: ${money(loan.principal)}</p>
          <p>Juros: ${Number(loan.interest)}%</p>
          <p>Total: ${money(loan.total)}</p>
          <p>Recebido: ${money(received)}</p>
          <p>Saldo: ${money(balance)}</p>
          <p>Início: ${fmtDate(loan.startDate)}</p>
          ${loan.notes ? `<p>${escapeHTML(loan.notes)}</p>` : ""}
        </div>
        <div class="item-actions">
          <button type="button" class="btn-danger"
            data-delete-loan="${loan.id}">Excluir</button>
        </div>
      </article>
    `;
  }).join("");

  list.querySelectorAll("[data-delete-loan]").forEach((button) => {
    button.addEventListener("click", () => deleteLoan(button.dataset.deleteLoan));
  });
}

/* =========================================================
   PAGAMENTOS E PARCELAS
   ========================================================= */

function refreshPaymentLoanOptions(selectedLoanId = "") {
  const select = $("paymentLoan");
  if (!select) return;

  const previous = selectedLoanId || select.value;

  select.innerHTML = `<option value="">Selecione um empréstimo</option>` +
    db.loans.map((loan) => {
      const customer = findCustomer(loan.customerId);
      return `
        <option value="${loan.id}">
          ${escapeHTML(customer?.name || "Cliente")} — ${money(loan.total)}
        </option>
      `;
    }).join("");

  if (db.loans.some((loan) => loan.id === previous)) {
    select.value = previous;
  }

  refreshInstallmentOptions();
}

function refreshInstallmentOptions(selectedNumber = "") {
  const select = $("paymentInstallment");
  if (!select) return;

  const loanId = $("paymentLoan")?.value;
  const loan = db.loans.find((item) => item.id === loanId);

  if (!loan) {
    select.innerHTML = `<option value="">Selecione o empréstimo primeiro</option>`;
    if ($("paymentAmount")) $("paymentAmount").value = "";
    return;
  }

  const previous = selectedNumber || select.value;

  select.innerHTML = loan.installments.map((installment) => {
    const balance = installmentBalance(loan, installment);
    const status = installmentStatus(loan, installment);

    return `
      <option value="${installment.number}" ${balance <= 0.009 ? "disabled" : ""}>
        Parcela ${installment.number} — ${fmtDate(installment.date)}
        — ${money(balance)} (${status})
      </option>
    `;
  }).join("");

  if (previous && loan.installments.some((item) =>
    String(item.number) === String(previous) &&
    installmentBalance(loan, item) > 0.009
  )) {
    select.value = previous;
  }

  updatePaymentAmount();
}

function updatePaymentAmount() {
  const loan = db.loans.find((item) => item.id === $("paymentLoan")?.value);
  const number = Number($("paymentInstallment")?.value);
  const installment = loan?.installments.find((item) => item.number === number);

  if (!installment || !$("paymentAmount")) return;

  $("paymentAmount").value = installmentBalance(loan, installment).toFixed(2);
}

$("paymentLoan")?.addEventListener("change", () => refreshInstallmentOptions());
$("paymentInstallment")?.addEventListener("change", updatePaymentAmount);

$("paymentForm")?.addEventListener("submit", (event) => {
  event.preventDefault();

  const loan = db.loans.find((item) => item.id === $("paymentLoan").value);
  const number = Number($("paymentInstallment").value);
  const installment = loan?.installments.find((item) => item.number === number);
  const amount = Number($("paymentAmount").value);
  const date = $("paymentDate")?.value || today();

  if (!loan || !installment) {
    notify("Selecione o empréstimo e a parcela.", true);
    return;
  }

  if (amount <= 0) {
    notify("Informe um valor válido.", true);
    return;
  }

  if (amount - installmentBalance(loan, installment) > 0.009) {
    notify("O valor é maior que o saldo restante desta parcela.", true);
    return;
  }

  const customer = findCustomer(loan.customerId);

  const payment = {
    id: uid(),
    loanId: loan.id,
    customerId: loan.customerId,
    installment: number,
    amount,
    date,
    notes: $("paymentNotes")?.value.trim() || "",
    createdAt: new Date().toISOString()
  };

  db.payments.push(payment);

  logAction(
    "Pagamento registrado",
    `${customer?.name || "Cliente"} — ${money(amount)} — parcela ${number}`
  );

  saveData();
  $("paymentForm").reset();

  if ($("paymentDate")) $("paymentDate").value = today();

  refreshPaymentLoanOptions();
  renderAll();
  notify("Pagamento registrado com sucesso!");

  if (confirm("Deseja gerar o recibo deste pagamento em PNG?")) {
    showReceipt(payment.id);
  }
});

/* =========================================================
   CORRIGIR PAGAMENTO
   Permite corrigir cliente, empréstimo, parcela, valor e data.
   ========================================================= */

function correctPayment(paymentId) {
  const payment = db.payments.find((item) => item.id === paymentId);
  if (!payment) return;

  const oldLoan = db.loans.find((item) => item.id === payment.loanId);
  if (!oldLoan) {
    notify("O empréstimo deste pagamento não foi encontrado.", true);
    return;
  }

  const customerOptions = db.customers.map((customer, index) =>
    `${index + 1}. ${customer.name}`
  ).join("\n");

  if (!db.customers.length) {
    notify("Cadastre um cliente antes de corrigir o pagamento.", true);
    return;
  }

  const currentCustomer = findCustomer(payment.customerId) ||
    findCustomer(oldLoan.customerId);

  const currentIndex = db.customers.findIndex((customer) =>
    customer.id === currentCustomer?.id
  );

  const customerChoice = prompt(
    "Corrigir pagamento — escolha o número do cliente:\n\n" +
    customerOptions +
    "\n\nDigite o número do cliente correto:",
    String(currentIndex + 1)
  );

  if (customerChoice === null) return;

  const customerIndex = Number(customerChoice) - 1;
  const newCustomer = db.customers[customerIndex];

  if (!newCustomer) {
    notify("Número de cliente inválido.", true);
    return;
  }

  const availableLoans = customerLoans(newCustomer.id);

  if (!availableLoans.length) {
    notify("Este cliente não possui empréstimos cadastrados.", true);
    return;
  }

  const loanOptions = availableLoans.map((loan, index) => {
    const customer = findCustomer(loan.customerId);
    return `${index + 1}. ${customer?.name || "Cliente"} — ${money(loan.total)} — ${loan.planLabel || loan.plan}`;
  }).join("\n");

  const existingLoanIndex = availableLoans.findIndex((loan) =>
    loan.id === payment.loanId
  );

  const loanChoice = prompt(
    "Escolha o empréstimo correto:\n\n" + loanOptions +
    "\n\nDigite o número do empréstimo:",
    String(existingLoanIndex >= 0 ? existingLoanIndex + 1 : 1)
  );

  if (loanChoice === null) return;

  const newLoan = availableLoans[Number(loanChoice) - 1];

  if (!newLoan) {
    notify("Número de empréstimo inválido.", true);
    return;
  }

  const installmentOptions = newLoan.installments.map((installment) => {
    const receivedOtherPayments = db.payments
      .filter((item) =>
        item.loanId === newLoan.id &&
        Number(item.installment) === Number(installment.number) &&
        item.id !== payment.id
      )
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const balance = Math.max(0, installment.amount - receivedOtherPayments);

    return `${installment.number}. Parcela ${installment.number} — ${fmtDate(installment.date)} — saldo ${money(balance)}`;
  }).join("\n");

  const installmentChoice = prompt(
    "Escolha a parcela correta:\n\n" + installmentOptions +
    "\n\nDigite o número da parcela:",
    String(payment.installment)
  );

  if (installmentChoice === null) return;

  const newInstallment = newLoan.installments.find((item) =>
    Number(item.number) === Number(installmentChoice)
  );

  if (!newInstallment) {
    notify("Número de parcela inválido.", true);
    return;
  }

  const otherPayments = db.payments
    .filter((item) =>
      item.loanId === newLoan.id &&
      Number(item.installment) === Number(newInstallment.number) &&
      item.id !== payment.id
    )
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const maxAmount = Math.max(0, newInstallment.amount - otherPayments);

  const amountInput = prompt(
    `Valor do pagamento (máximo ${money(maxAmount)}):`,
    String(payment.amount)
  );

  if (amountInput === null) return;

  const newAmount = Number(amountInput.replace(",", "."));

  if (!Number.isFinite(newAmount) || newAmount <= 0 || newAmount - maxAmount > 0.009) {
    notify("Valor inválido ou superior ao saldo da parcela.", true);
    return;
  }

  const newDate = prompt(
    "Data do pagamento (AAAA-MM-DD):",
    payment.date || today()
  );

  if (newDate === null) return;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
    notify("Data inválida. Use o formato AAAA-MM-DD.", true);
    return;
  }

  const newNotes = prompt(
    "Observações do pagamento:",
    payment.notes || ""
  );

  if (newNotes === null) return;

  const oldCustomerName =
    findCustomer(payment.customerId)?.name ||
    findCustomer(oldLoan.customerId)?.name ||
    "Cliente";

  payment.customerId = newCustomer.id;
  payment.loanId = newLoan.id;
  payment.installment = newInstallment.number;
  payment.amount = newAmount;
  payment.date = newDate;
  payment.notes = newNotes.trim();

  logAction(
    "Pagamento corrigido",
    `${oldCustomerName} → ${newCustomer.name} — ${money(newAmount)}`
  );

  saveData();
  renderAll();
  notify("Pagamento corrigido com sucesso!");
}

function deletePayment(paymentId) {
  const payment = db.payments.find((item) => item.id === paymentId);
  if (!payment) return;

  if (!confirm(`Excluir o pagamento de ${money(payment.amount)}?`)) return;

  const customer =
    findCustomer(payment.customerId) ||
    findCustomer(db.loans.find((loan) => loan.id === payment.loanId)?.customerId);

  db.payments = db.payments.filter((item) => item.id !== paymentId);

  logAction(
    "Pagamento excluído",
    `${customer?.name || "Cliente"} — ${money(payment.amount)}`
  );

  saveData();
  renderAll();
  notify("Pagamento excluído.");
}

function renderPayments() {
  const list = $("paymentList");
  if (!list) return;

  const payments = db.payments.slice().sort((a, b) =>
    (b.date || "").localeCompare(a.date || "") ||
    (b.createdAt || "").localeCompare(a.createdAt || "")
  );

  if (!payments.length) {
    list.innerHTML = `<div class="empty-state">Nenhum pagamento registrado.</div>`;
    return;
  }

  list.innerHTML = payments.map((payment) => {
    const loan = db.loans.find((item) => item.id === payment.loanId);
    const customer =
      findCustomer(payment.customerId) ||
      findCustomer(loan?.customerId);

    return `
      <article class="item-card">
        <div class="item-main">
          <h3>${escapeHTML(customer?.name || "Cliente não encontrado")}</h3>
          <p>Valor: <strong>${money(payment.amount)}</strong></p>
          <p>Parcela: ${payment.installment}</p>
          <p>Data: ${fmtDate(payment.date)}</p>
          ${payment.notes ? `<p>${escapeHTML(payment.notes)}</p>` : ""}
        </div>
        <div class="item-actions">
          <button type="button" class="btn-secondary"
            data-receipt="${payment.id}">Recibo PNG</button>
          <button type="button" class="btn-secondary"
            data-correct-payment="${payment.id}">Corrigir</button>
          <button type="button" class="btn-danger"
            data-delete-payment="${payment.id}">Excluir</button>
        </div>
      </article>
    `;
  }).join("");

  list.querySelectorAll("[data-receipt]").forEach((button) => {
    button.addEventListener("click", () => showReceipt(button.dataset.receipt));
  });

  list.querySelectorAll("[data-correct-payment]").forEach((button) => {
    button.addEventListener("click", () =>
      correctPayment(button.dataset.correctPayment)
    );
  });

  list.querySelectorAll("[data-delete-payment]").forEach((button) => {
    button.addEventListener("click", () =>
      deletePayment(button.dataset.deletePayment)
    );
  });
}

/* =========================================================
   RECIBO PNG
   ========================================================= */

function receiptDetails(paymentId) {
  const payment = db.payments.find((item) => item.id === paymentId);
  if (!payment) return null;

  const loan = db.loans.find((item) => item.id === payment.loanId);

  const customer =
    findCustomer(payment.customerId) ||
    findCustomer(loan?.customerId);

  return {
    payment,
    loan,
    customer,
    customerName: customer?.name || "Cliente",
    customerPhone: customer?.phone || "",
    paymentDate: fmtDate(payment.date),
    amount: money(payment.amount),
    installment: payment.installment,
    loanTotal: money(loan?.total || 0),
    notes: payment.notes || "",
    receiptNumber: payment.id.slice(-8).toUpperCase()
  };
}

function drawReceiptCanvas(details) {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 1120;

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#f4f7fb";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(35, 35, 830, 1050);

  ctx.fillStyle = "#123b6d";
  ctx.fillRect(35, 35, 830, 190);

  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 54px Arial";
  ctx.fillText("CREDIFÁCIL", 450, 112);

  ctx.font = "28px Arial";
  ctx.fillText("COMPROVANTE DE PAGAMENTO", 450, 170);

  ctx.textAlign = "left";
  ctx.fillStyle = "#223047";
  ctx.font = "bold 30px Arial";
  ctx.fillText("RECIBO", 85, 285);

  ctx.font = "22px Arial";
  ctx.fillStyle = "#64748b";
  ctx.fillText(`Nº ${details.receiptNumber}`, 85, 325);

  ctx.fillStyle = "#e7eef7";
  ctx.fillRect(80, 360, 740, 150);

  ctx.fillStyle = "#64748b";
  ctx.font = "22px Arial";
  ctx.fillText("VALOR RECEBIDO", 110, 410);

  ctx.fillStyle = "#123b6d";
  ctx.font = "bold 54px Arial";
  ctx.fillText(details.amount, 110, 470);

  const rows = [
    ["Cliente", details.customerName],
    ["Telefone", details.customerPhone || "Não informado"],
    ["Data do pagamento", details.paymentDate],
    ["Parcela", String(details.installment)],
    ["Valor total do empréstimo", details.loanTotal]
  ];

  let y = 585;

  rows.forEach(([label, value]) => {
    ctx.fillStyle = "#64748b";
    ctx.font = "21px Arial";
    ctx.fillText(label, 95, y);

    ctx.fillStyle = "#223047";
    ctx.font = "bold 25px Arial";
    ctx.fillText(String(value).slice(0, 48), 400, y);

    ctx.strokeStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.moveTo(95, y + 20);
    ctx.lineTo(805, y + 20);
    ctx.stroke();

    y += 75;
  });

  if (details.notes) {
    ctx.fillStyle = "#64748b";
    ctx.font = "20px Arial";
    ctx.fillText("Observações:", 95, y + 5);

    ctx.fillStyle = "#223047";
    ctx.font = "21px Arial";
    ctx.fillText(details.notes.slice(0, 60), 95, y + 40);
  }

  ctx.fillStyle = "#64748b";
  ctx.textAlign = "center";
  ctx.font = "20px Arial";
  ctx.fillText("Comprovante gerado pelo sistema CrediFácil", 450, 1025);

  ctx.font = "18px Arial";
  ctx.fillText(`Emitido em ${new Date().toLocaleString("pt-BR")}`, 450, 1055);

  return canvas;
}

async function showReceipt(paymentId) {
  const details = receiptDetails(paymentId);

  if (!details) {
    notify("Pagamento não encontrado.", true);
    return;
  }

  try {
    const canvas = drawReceiptCanvas(details);

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((result) => {
        if (result) resolve(result);
        else reject(new Error("Não foi possível criar a imagem."));
      }, "image/png");
    });

    const fileName =
      `recibo-credifacil-${details.receiptNumber}.png`;

    const file = new File([blob], fileName, {
      type: "image/png"
    });

    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({
          files: [file],
          title: "Recibo CrediFácil",
          text: `Comprovante de pagamento de ${details.customerName}`
        });

        return;
      } catch (error) {
        if (error.name === "AbortError") return;
      }
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 30000);

    notify("Recibo PNG gerado. Verifique os downloads do aparelho.");
  } catch (error) {
    console.error(error);
    notify("Não foi possível gerar o recibo PNG.", true);
  }
}

/* =========================================================
   DESPESAS
   ========================================================= */

$("expenseForm")?.addEventListener("submit", (event) => {
  event.preventDefault();

  const description = $("expenseDescription").value.trim();
  const amount = Number($("expenseAmount").value);
  const date = $("expenseDate")?.value || today();
  const category = $("expenseCategory")?.value || "Geral";

  if (!description) {
    notify("Informe a descrição da despesa.", true);
    return;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    notify("Informe um valor válido para a despesa.", true);
    return;
  }

  db.expenses.push({
    id: uid(),
    description,
    amount,
    date,
    category,
    createdAt: new Date().toISOString()
  });

  logAction("Despesa cadastrada", `${description} — ${money(amount)}`);
  saveData();

  $("expenseForm").reset();
  if ($("expenseDate")) $("expenseDate").value = today();

  renderAll();
  notify("Despesa cadastrada.");
});

function deleteExpense(id) {
  const expense = db.expenses.find((item) => item.id === id);
  if (!expense) return;

  if (!confirm(`Excluir a despesa "${expense.description}"?`)) return;

  db.expenses = db.expenses.filter((item) => item.id !== id);
  logAction("Despesa excluída", expense.description);
  saveData();
  renderAll();
  notify("Despesa excluída.");
}

function renderExpenses() {
  const list = $("expenseList");
  if (!list) return;

  const total = db.expenses.reduce((sum, expense) =>
    sum + Number(expense.amount || 0), 0
  );

  if ($("expenseTotal")) $("expenseTotal").textContent = money(total);

  if (!db.expenses.length) {
    list.innerHTML = `<div class="empty-state">Nenhuma despesa cadastrada.</div>`;
    return;
  }

  list.innerHTML = db.expenses.slice().sort((a, b) =>
    (b.date || "").localeCompare(a.date || "")
  ).map((expense) => `
    <article class="item-card">
      <div class="item-main">
        <h3>${escapeHTML(expense.description)}</h3>
        <p>Valor: ${money(expense.amount)}</p>
        <p>Data: ${fmtDate(expense.date)}</p>
        <p>Categoria: ${escapeHTML(expense.category)}</p>
      </div>
      <div class="item-actions">
        <button type="button" class="btn-danger"
          data-delete-expense="${expense.id}">Excluir</button>
      </div>
    </article>
  `).join("");

  list.querySelectorAll("[data-delete-expense]").forEach((button) => {
    button.addEventListener("click", () =>
      deleteExpense(button.dataset.deleteExpense)
    );
  });
}

/* =========================================================
   PAINEL FINANCEIRO
   ========================================================= */

function allInstallments() {
  return db.loans.flatMap((loan) =>
    loan.installments.map((installment) => ({
      loan,
      installment,
      balance: installmentBalance(loan, installment),
      status: installmentStatus(loan, installment)
    }))
  );
}

function renderDashboard() {
  const received = db.payments.reduce((sum, payment) =>
    sum + Number(payment.amount || 0), 0
  );

  const principal = db.loans.reduce((sum, loan) =>
    sum + Number(loan.principal || 0), 0
  );

  const expected = db.loans.reduce((sum, loan) =>
    sum + Number(loan.total || 0), 0
  );

  const expenses = db.expenses.reduce((sum, expense) =>
    sum + Number(expense.amount || 0), 0
  );

  const installments = allInstallments();
  const paid = installments.filter((item) => item.balance <= 0.009).length;
  const late = installments.filter((item) => item.status === "Atrasado").length;
  const open = installments.filter((item) => item.balance > 0.009).length;
  const percentage = installments.length
    ? Math.round(paid / installments.length * 100)
    : 0;

  const values = {
    statCustomers: db.customers.length,
    statReceived: money(received),
    statOpen: money(Math.max(0, expected - received)),
    statLate: late,
    statCapital: money(principal),
    statExpected: money(expected),
    statExpenses: money(expenses),
    statCash: money(received - expenses),
    paidPercentage: `${percentage}%`,
    statPaidInstallments: paid,
    statTotalInstallments: installments.length
  };

  Object.entries(values).forEach(([id, value]) => {
    if ($(id)) $(id).textContent = value;
  });

  if ($("paidProgress")) {
    $("paidProgress").style.width = `${percentage}%`;
  }

  const upcomingList = $("upcomingList");

  if (upcomingList) {
    const upcoming = installments
      .filter((item) => item.balance > 0.009)
      .sort((a, b) =>
        a.installment.date.localeCompare(b.installment.date)
      )
      .slice(0, 8);

    upcomingList.innerHTML = upcoming.length
      ? upcoming.map(({ loan, installment, balance, status }) => {
          const customer = findCustomer(loan.customerId);

          return `
            <article class="item-card">
              <div class="item-main">
                <h3>${escapeHTML(customer?.name || "Cliente")}</h3>
                <p>Parcela ${installment.number} · ${fmtDate(installment.date)}</p>
                <p>Saldo: ${money(balance)}</p>
                <span class="status">${escapeHTML(status)}</span>
              </div>
            </article>
          `;
        }).join("")
      : `<div class="empty-state">Nenhuma parcela pendente.</div>`;
  }
}

/* =========================================================
   HISTÓRICO E EXPORTAÇÃO
   ========================================================= */

function renderHistory() {
  const list = $("historyList");
  if (!list) return;

  const search = ($("historySearch")?.value || "").toLowerCase();

  const history = db.history.filter((item) =>
    `${item.action} ${item.description} ${item.date}`
      .toLowerCase()
      .includes(search)
  );

  if (!history.length) {
    list.innerHTML = `<div class="empty-state">Nenhum registro no histórico.</div>`;
    return;
  }

  list.innerHTML = history.map((item) => `
    <article class="item-card">
      <div class="item-main">
        <h3>${escapeHTML(item.action)}</h3>
        <p>${escapeHTML(item.description)}</p>
        <p>${fmtDate(item.date)} ${escapeHTML(item.time || "")}</p>
      </div>
    </article>
  `).join("");
}

$("historySearch")?.addEventListener("input", renderHistory);

function exportCSV() {
  const rows = [
    ["Tipo", "Cliente", "Descrição", "Valor", "Data", "Detalhes"]
  ];

  db.customers.forEach((customer) => {
    rows.push([
      "Cliente",
      customer.name,
      customer.phone || "",
      "",
      customer.createdAt || "",
      customer.email || ""
    ]);
  });

  db.loans.forEach((loan) => {
    const customer = findCustomer(loan.customerId);

    rows.push([
      "Empréstimo",
      customer?.name || "",
      loan.planLabel || loan.plan,
      loan.total,
      loan.startDate,
      `Capital: ${loan.principal}; Juros: ${loan.interest}%`
    ]);
  });

  db.payments.forEach((payment) => {
    const customer =
      findCustomer(payment.customerId) ||
      findCustomer(db.loans.find((loan) => loan.id === payment.loanId)?.customerId);

    rows.push([
      "Pagamento",
      customer?.name || "",
      `Parcela ${payment.installment}`,
      payment.amount,
      payment.date,
      payment.notes || ""
    ]);
  });

  db.expenses.forEach((expense) => {
    rows.push([
      "Despesa",
      "",
      expense.description,
      expense.amount,
      expense.date,
      expense.category
    ]);
  });

  const csv = rows.map((row) =>
    row.map((cell) =>
      `"${String(cell ?? "").replace(/"/g, '""')}"`
    ).join(";")
  ).join("\r\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `credifacil-${today()}.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 30000);

  notify("Relatório exportado.");
}

$("exportBtn")?.addEventListener("click", exportCSV);

/* =========================================================
   ATUALIZAÇÃO GERAL
   ========================================================= */

function renderAll() {
  refreshLoanCustomerOptions();
  refreshPaymentLoanOptions();

  renderCustomers();
  renderLoans();
  renderPayments();
  renderExpenses();
  renderDashboard();
  renderHistory();
}

function initialize() {
  if ($("customerFormPanel")) $("customerFormPanel").hidden = true;

  if ($("loanStart")) $("loanStart").value = today();
  if ($("paymentDate")) $("paymentDate").value = today();
  if ($("expenseDate")) $("expenseDate").value = today();

  updateLoanPreview();

  const sessionId = readJSON(KEYS.session, null);
  const users = getUsers();
  const user = users.find((item) => item.id === sessionId);

  if (user) {
    currentUser = user;
    db = {
      ...emptyData(),
      ...readJSON(dataKey(), {})
    };

    openApp();
  } else {
    if ($("appScreen")) $("appScreen").hidden = true;
    if ($("authScreen")) $("authScreen").hidden = false;
    setAuthMode("login");
  }
}

initialize();