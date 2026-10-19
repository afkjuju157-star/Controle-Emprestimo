"use strict";

const $ = (id) => document.getElementById(id);

const KEYS = {
  users: "credifacil_users_v2",
  session: "credifacil_session_v2",
  customers: "credifacil_customers_v2",
  loans: "credifacil_loans_v2",
  payments: "credifacil_payments_v2",
  expenses: "credifacil_expenses_v2",
  history: "credifacil_history_v2"
};

let toastTimer;
let editingPaymentId = null;
let editingCustomerId = null;

function read(key, fallback = []) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function id() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function currentSession() {
  return read(KEYS.session, null);
}

function userKey(base) {
  const session = currentSession();
  return `${base}_${session?.userId || "guest"}`;
}

function myRows(base) {
  return read(userKey(base), []);
}

function saveRows(base, rows) {
  write(userKey(base), rows);
}

function money(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function today() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDate(value) {
  if (!value) return "—";
  const parts = String(value).slice(0, 10).split("-");
  return parts.length === 3
    ? `${parts[2]}/${parts[1]}/${parts[0]}`
    : value;
}

function number(value) {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function notify(message, type = "success") {
  const element = $("toast");

  if (!element) {
    alert(message);
    return;
  }

  element.textContent = message;
  element.className = `toast show ${type}`;

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    element.className = "toast";
  }, 3200);
}

function setMessage(id, message, type = "") {
  const element = $(id);
  if (!element) return;

  element.textContent = message;
  element.className = `message ${type}`;
}

function showScreen(screen) {
  ["login-screen", "register-screen", "app-shell"].forEach((id) => {
    $(id)?.classList.add("hidden");
  });

  $(screen)?.classList.remove("hidden");
}

function recordHistory(type, description, amount = 0) {
  const history = myRows(KEYS.history);

  history.unshift({
    id: id(),
    type,
    description,
    amount: number(amount),
    date: new Date().toISOString()
  });

  saveRows(KEYS.history, history.slice(0, 1000));
}

function getCustomer(customerId) {
  return myRows(KEYS.customers).find((item) => item.id === customerId);
}

function getLoan(loanId) {
  return myRows(KEYS.loans).find((item) => item.id === loanId);
}

function loanPaid(loanId, excludingPaymentId = null) {
  return myRows(KEYS.payments)
    .filter((payment) =>
      payment.loanId === loanId &&
      payment.id !== excludingPaymentId
    )
    .reduce((sum, payment) => sum + number(payment.amount), 0);
}

function loanTotal(loan) {
  return number(loan.amount) * (1 + number(loan.interest) / 100);
}

function loanBalance(loan, excludingPaymentId = null) {
  return Math.max(
    0,
    loanTotal(loan) - loanPaid(loan.id, excludingPaymentId)
  );
}

/* Calcula o valor de cada parcela a partir do total com juros. */
function installmentValue(loan) {
  if (!loan) return 0;

  const installments = Math.max(
    1,
    Math.floor(number(loan.installments))
  );

  return Math.round((loanTotal(loan) / installments) * 100) / 100;
}

function nextInstallmentNumber(loan) {
  if (!loan) return 1;

  const value = installmentValue(loan);
  if (value <= 0) return 1;

  const paid = loanPaid(loan.id);

  return Math.min(
    Math.max(1, Math.floor(number(loan.installments))),
    Math.floor((paid + 0.001) / value) + 1
  );
}

/* Atualiza o valor da parcela ao selecionar um empréstimo. */
function updatePaymentSuggestion() {
  const loan = getLoan($("payment-loan")?.value);
  const installmentField = $("payment-installment-value");
  const amountField = $("payment-amount");

  if (!installmentField || !amountField) return;

  if (!loan) {
    installmentField.value = "";
    amountField.value = "";
    return;
  }

  const value = installmentValue(loan);
  const balance = loanBalance(loan);

  installmentField.value = money(value);
  amountField.value = Math.min(value, balance).toFixed(2);
}

function renderDashboard() {
  const customers = myRows(KEYS.customers);
  const loans = myRows(KEYS.loans);
  const payments = myRows(KEYS.payments);
  const expenses = myRows(KEYS.expenses);

  const totalLent = loans.reduce(
    (sum, loan) => sum + number(loan.amount), 0
  );

  const totalReceived = payments.reduce(
    (sum, payment) => sum + number(payment.amount), 0
  );

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + number(expense.amount), 0
  );

  const receivedToday = payments
    .filter((payment) => payment.date === today())
    .reduce((sum, payment) => sum + number(payment.amount), 0);

  const open = loans.reduce(
    (sum, loan) => sum + loanBalance(loan), 0
  );

  $("total-customers").textContent = String(customers.length);
  $("total-loans").textContent = String(loans.length);
  $("total-lent").textContent = money(totalLent);
  $("total-received").textContent = money(totalReceived);
  $("total-open").textContent = money(open);
  $("total-expenses").textContent = money(totalExpenses);
  $("financial-result").textContent = money(totalReceived - totalExpenses);
  $("received-today").textContent = money(receivedToday);

  const recent = [...payments]
    .sort((a, b) =>
      `${b.date}${b.createdAt || ""}`.localeCompare(
        `${a.date}${a.createdAt || ""}`
      )
    )
    .slice(0, 8);

  $("dashboard-payments").innerHTML = recent.length ? `
    <table>
      <thead>
        <tr><th>Cliente</th><th>Data</th><th>Valor</th></tr>
      </thead>
      <tbody>
        ${recent.map((payment) => {
          const loan = getLoan(payment.loanId);
          const customer =
            getCustomer(payment.customerId) ||
            getCustomer(loan?.customerId);

          return `
            <tr>
              <td>${escapeHtml(customer?.name || "Cliente não encontrado")}</td>
              <td>${formatDate(payment.date)}</td>
              <td>${money(payment.amount)}</td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  ` : '<div class="empty-state">Nenhum pagamento registrado ainda.</div>';
}

function renderCustomers() {
  const search = ($("customer-search").value || "").trim().toLowerCase();

  const customers = myRows(KEYS.customers).filter((customer) =>
    `${customer.name} ${customer.phone || ""} ${customer.document || ""}`
      .toLowerCase()
      .includes(search)
  );

  $("customers-list").innerHTML = customers.length ? `
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Telefone</th>
          <th>CPF</th>
          <th>Endereço</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${customers.map((customer) => `
          <tr>
            <td>${escapeHtml(customer.name)}</td>
            <td>${escapeHtml(customer.phone || "—")}</td>
            <td>${escapeHtml(customer.document || "—")}</td>
            <td>${escapeHtml(customer.address || "—")}</td>
            <td>
              <button type="button"
                data-action="edit-customer"
                data-id="${escapeHtml(customer.id)}">Editar</button>

              <button type="button"
                data-action="delete-customer"
                data-id="${escapeHtml(customer.id)}">Excluir</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  ` : '<div class="empty-state">Nenhum cliente encontrado.</div>';

  renderCustomerOptions();
}

function renderCustomerOptions() {
  const customers = myRows(KEYS.customers);
  const select = $("loan-customer");
  const selected = select.value;

  select.innerHTML =
    '<option value="">Selecione um cliente</option>' +
    customers.map((customer) => `
      <option value="${escapeHtml(customer.id)}">
        ${escapeHtml(customer.name)}
      </option>
    `).join("");

  if (customers.some((customer) => customer.id === selected)) {
    select.value = selected;
  }
}

function renderLoans() {
  const search = ($("loan-search").value || "").trim().toLowerCase();

  const loans = myRows(KEYS.loans).filter((loan) => {
    const customer = getCustomer(loan.customerId);
    return `${customer?.name || ""} ${loan.id}`
      .toLowerCase()
      .includes(search);
  });

  $("loans-list").innerHTML = loans.length ? `
    <table>
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Valor</th>
          <th>Total com juros</th>
          <th>Parcelas</th>
          <th>Valor da parcela</th>
          <th>Recebido</th>
          <th>Saldo</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${loans.map((loan) => `
          <tr>
            <td>${escapeHtml(getCustomer(loan.customerId)?.name || "Cliente removido")}</td>
            <td>${money(loan.amount)}</td>
            <td>${money(loanTotal(loan))}</td>
            <td>${escapeHtml(loan.installments)}</td>
            <td>${money(installmentValue(loan))}</td>
            <td>${money(loanPaid(loan.id))}</td>
            <td>${money(loanBalance(loan))}</td>
            <td>
              <button type="button"
                data-action="delete-loan"
                data-id="${escapeHtml(loan.id)}">Excluir</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  ` : '<div class="empty-state">Nenhum empréstimo encontrado.</div>';

  renderLoanOptions();
}

function renderLoanOptions() {
  const select = $("payment-loan");
  const selected = select.value;

  const loans = myRows(KEYS.loans).filter(
    (loan) => loanBalance(loan) > 0
  );

  select.innerHTML =
    '<option value="">Selecione um empréstimo</option>' +
    loans.map((loan) => {
      const name = getCustomer(loan.customerId)?.name || "Cliente removido";

      return `
        <option value="${escapeHtml(loan.id)}">
          ${escapeHtml(name)} — parcela ${money(installmentValue(loan))}
          — saldo ${money(loanBalance(loan))}
        </option>
      `;
    }).join("");

  if (loans.some((loan) => loan.id === selected)) {
    select.value = selected;
  }
}

function renderPayments() {
  const payments = [...myRows(KEYS.payments)]
    .sort((a, b) => b.date.localeCompare(a.date));

  $("payments-list").innerHTML = payments.length ? `
    <table>
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Data</th>
          <th>Valor</th>
          <th>Observação</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${payments.map((payment) => {
          const loan = getLoan(payment.loanId);
          const customer =
            getCustomer(payment.customerId) ||
            getCustomer(loan?.customerId);

          return `
            <tr>
              <td>${escapeHtml(customer?.name || "Cliente removido")}</td>
              <td>${formatDate(payment.date)}</td>
              <td>${money(payment.amount)}</td>
              <td>${escapeHtml(payment.notes || "—")}</td>
              <td>
                <button type="button"
                  data-action="view-receipt"
                  data-id="${escapeHtml(payment.id)}">Comprovante</button>

                <button type="button"
                  data-action="edit-payment"
                  data-id="${escapeHtml(payment.id)}">Editar</button>

                <button type="button"
                  data-action="delete-payment"
                  data-id="${escapeHtml(payment.id)}">Excluir</button>
              </td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  ` : '<div class="empty-state">Nenhum pagamento registrado.</div>';
}

function renderExpenses() {
  const expenses = [...myRows(KEYS.expenses)]
    .sort((a, b) => b.date.localeCompare(a.date));

  $("expenses-list").innerHTML = expenses.length ? `
    <table>
      <thead>
        <tr>
          <th>Descrição</th>
          <th>Categoria</th>
          <th>Data</th>
          <th>Valor</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${expenses.map((expense) => `
          <tr>
            <td>${escapeHtml(expense.description)}</td>
            <td>${escapeHtml(expense.category)}</td>
            <td>${formatDate(expense.date)}</td>
            <td>${money(expense.amount)}</td>
            <td>
              <button type="button"
                data-action="delete-expense"
                data-id="${escapeHtml(expense.id)}">Excluir</button>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  ` : '<div class="empty-state">Nenhuma despesa registrada.</div>';
}

function renderHistory() {
  const history = myRows(KEYS.history);

  $("history-list").innerHTML = history.length ? `
    <table>
      <thead>
        <tr>
          <th>Data e hora</th>
          <th>Movimentação</th>
          <th>Descrição</th>
          <th>Valor</th>
        </tr>
      </thead>
      <tbody>
        ${history.map((item) => `
          <tr>
            <td>${new Date(item.date).toLocaleString("pt-BR")}</td>
            <td>${escapeHtml(item.type)}</td>
            <td>${escapeHtml(item.description)}</td>
            <td>${money(item.amount)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  ` : '<div class="empty-state">Nenhuma movimentação registrada.</div>';
}

function renderAll() {
  renderDashboard();
  renderCustomers();
  renderLoans();
  renderPayments();
  renderExpenses();
  renderHistory();
}

function resetCustomerForm() {
  $("customer-form").reset();
  $("customer-id").value = "";
  editingCustomerId = null;
  $("customer-form-title").textContent = "Novo cliente";
  $("customer-cancel").textContent = "Limpar";
}

function saveCustomer(event) {
  event.preventDefault();

  const customers = myRows(KEYS.customers);

  const customer = {
    id: editingCustomerId || id(),
    name: $("customer-name").value.trim(),
    phone: $("customer-phone").value.trim(),
    document: $("customer-document").value.trim(),
    address: $("customer-address").value.trim(),
    updatedAt: new Date().toISOString()
  };

  if (!customer.name) {
    return notify("Informe o nome do cliente.", "error");
  }

  if (editingCustomerId) {
    const index = customers.findIndex(
      (item) => item.id === editingCustomerId
    );

    if (index < 0) {
      return notify("Cliente não encontrado.", "error");
    }

    customers[index] = { ...customers[index], ...customer };
    recordHistory("Cliente atualizado", customer.name);
  } else {
    customer.createdAt = new Date().toISOString();
    customers.push(customer);
    recordHistory("Cliente cadastrado", customer.name);
  }

  saveRows(KEYS.customers, customers);
  resetCustomerForm();
  renderAll();
  notify("Cliente salvo com sucesso.");
}

function editCustomer(customerId) {
  const customer = getCustomer(customerId);

  if (!customer) {
    return notify("Cliente não encontrado.", "error");
  }

  editingCustomerId = customer.id;
  $("customer-id").value = customer.id;
  $("customer-name").value = customer.name || "";
  $("customer-phone").value = customer.phone || "";
  $("customer-document").value = customer.document || "";
  $("customer-address").value = customer.address || "";
  $("customer-form-title").textContent = "Editar cliente";
  $("customer-cancel").textContent = "Cancelar edição";

  $("customer-form").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function deleteCustomer(customerId) {
  const customer = getCustomer(customerId);
  if (!customer) return;

  const hasLoan = myRows(KEYS.loans).some(
    (loan) => loan.customerId === customerId
  );

  if (hasLoan) {
    return notify(
      "Este cliente tem empréstimos. Exclua ou resolva os empréstimos primeiro.",
      "error"
    );
  }

  if (!confirm(`Excluir o cliente ${customer.name}?`)) return;

  saveRows(
    KEYS.customers,
    myRows(KEYS.customers).filter((item) => item.id !== customerId)
  );

  recordHistory("Cliente excluído", customer.name);
  renderAll();
  notify("Cliente excluído.");
}

function saveLoan(event) {
  event.preventDefault();

  const customerId = $("loan-customer").value;
  const amount = number($("loan-amount").value);
  const interest = number($("loan-interest").value);
  const installments = Math.floor(number($("loan-installments").value));
  const date = $("loan-start-date").value;

  if (!getCustomer(customerId)) {
    return notify("Selecione um cliente válido.", "error");
  }

  if (amount <= 0 || installments < 1 || interest < 0 || !date) {
    return notify("Confira os dados do empréstimo.", "error");
  }

  const loan = {
    id: id(),
    customerId,
    amount,
    interest,
    installments,
    frequency: $("loan-frequency").value,
    date,
    createdAt: new Date().toISOString()
  };

  const loans = myRows(KEYS.loans);
  loans.push(loan);
  saveRows(KEYS.loans, loans);

  recordHistory(
    "Empréstimo cadastrado",
    getCustomer(customerId).name,
    amount
  );

  $("loan-form").reset();
  $("loan-start-date").value = today();
  $("loan-interest").value = "0";
  $("loan-installments").value = "1";

  renderAll();
  notify("Empréstimo cadastrado.");
}

function savePayment(event) {
  event.preventDefault();

  const loanId = $("payment-loan").value;
  const loan = getLoan(loanId);
  const amount = number($("payment-amount").value);
  const date = $("payment-date").value;
  const notes = $("payment-notes").value.trim();

  if (!loan) {
    return notify("Selecione um empréstimo válido.", "error");
  }

  if (amount <= 0 || !date) {
    return notify("Informe o valor e a data.", "error");
  }

  const balanceBefore = loanBalance(loan);

  if (amount > balanceBefore + 0.005) {
    return notify(
      `O valor supera o saldo restante de ${money(balanceBefore)}.`,
      "error"
    );
  }

  const payment = {
    id: id(),
    loanId,
    customerId: loan.customerId,
    amount,
    date,
    notes,
    installmentValue: installmentValue(loan),
    installmentNumber: nextInstallmentNumber(loan),
    createdAt: new Date().toISOString()
  };

  const payments = myRows(KEYS.payments);
  payments.push(payment);
  saveRows(KEYS.payments, payments);

  recordHistory(
    "Pagamento recebido",
    getCustomer(loan.customerId)?.name || "Cliente",
    amount
  );

  $("payment-form").reset();
  $("payment-date").value = today();

  renderAll();
  updatePaymentSuggestion();

  notify("Pagamento registrado. Abrindo comprovante.");
  showReceipt(payment.id);
}

/*
  Mantém a possibilidade de corrigir um pagamento lançado
  no cliente ou empréstimo errado.
*/
function editPayment(paymentId) {
  const payment = myRows(KEYS.payments).find(
    (item) => item.id === paymentId
  );

  if (!payment) {
    return notify("Pagamento não encontrado.", "error");
  }

  const loans = myRows(KEYS.loans);

  const choices = loans.map((loan, index) => {
    const name = getCustomer(loan.customerId)?.name || "Cliente removido";

    return `${index + 1}. ${name} — empréstimo de ${money(loan.amount)} (saldo incluindo este pagamento: ${money(loanBalance(loan, payment.id))})`;
  }).join("\n");

  const defaultIndex = Math.max(
    0,
    loans.findIndex((loan) => loan.id === payment.loanId) + 1
  );

  const choice = prompt(
    `Corrigir pagamento: digite o número do empréstimo correto.\n\n${choices}`,
    String(defaultIndex)
  );

  if (choice === null) return;

  const index = Number(choice) - 1;

  if (!Number.isInteger(index) || index < 0 || index >= loans.length) {
    return notify("Número de empréstimo inválido.", "error");
  }

  const targetLoan = loans[index];

  const amountInput = prompt(
    "Valor correto do pagamento (R$):",
    String(payment.amount).replace(".", ",")
  );

  if (amountInput === null) return;

  const amount = Number(
    amountInput
      .replace(/\s/g, "")
      .replace(/\./g, "")
      .replace(",", ".")
  );

  if (!Number.isFinite(amount) || amount <= 0) {
    return notify("Valor inválido.", "error");
  }

  if (amount > loanBalance(targetLoan, payment.id) + 0.005) {
    return notify(
      "O valor ultrapassa o saldo do empréstimo selecionado.",
      "error"
    );
  }

  const date = prompt("Data correta (AAAA-MM-DD):", payment.date);

  if (date === null) return;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return notify("Data inválida.", "error");
  }

  const notes = prompt("Observação:", payment.notes || "");
  if (notes === null) return;

  const payments = myRows(KEYS.payments);

  const paymentIndex = payments.findIndex(
    (item) => item.id === paymentId
  );

  if (paymentIndex < 0) return;

  payments[paymentIndex] = {
    ...payments[paymentIndex],
    loanId: targetLoan.id,
    customerId: targetLoan.customerId,
    amount,
    date,
    notes: notes.trim(),
    installmentValue: installmentValue(targetLoan),
    updatedAt: new Date().toISOString()
  };

  saveRows(KEYS.payments, payments);

  recordHistory(
    "Pagamento corrigido",
    getCustomer(targetLoan.customerId)?.name || "Cliente",
    amount
  );

  renderAll();
  updatePaymentSuggestion();
  notify("Pagamento corrigido com sucesso.");
}

function deletePayment(paymentId) {
  const payments = myRows(KEYS.payments);

  const payment = payments.find(
    (item) => item.id === paymentId
  );

  if (!payment) return;

  if (!confirm(`Excluir o pagamento de ${money(payment.amount)}?`)) {
    return;
  }

  saveRows(
    KEYS.payments,
    payments.filter((item) => item.id !== paymentId)
  );

  recordHistory(
    "Pagamento excluído",
    getCustomer(payment.customerId)?.name || "Cliente",
    payment.amount
  );

  renderAll();
  updatePaymentSuggestion();
  notify("Pagamento excluído.");
}

function showReceipt(paymentId) {
  const payment = myRows(KEYS.payments).find(
    (item) => item.id === paymentId
  );

  if (!payment) {
    return notify("Pagamento não encontrado.", "error");
  }

  const loan = getLoan(payment.loanId);

  const customer =
    getCustomer(payment.customerId) ||
    getCustomer(loan?.customerId);

  if (!loan) {
    return notify("Empréstimo do pagamento não encontrado.", "error");
  }

  const installment =
    number(payment.installmentValue) || installmentValue(loan);

  const balance = loanBalance(loan);
  const receiptNumber = String(payment.id).slice(-8).toUpperCase();
  const installmentNumber =
    payment.installmentNumber || nextInstallmentNumber(loan);

  const receiptWindow = window.open(
    "",
    "_blank",
    "width=600,height=750"
  );

  if (!receiptWindow) {
    return notify(
      "O navegador bloqueou o comprovante. Permita pop-ups para este app.",
      "error"
    );
  }

  receiptWindow.document.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Comprovante CrediFácil</title>
<style>
*{box-sizing:border-box}
body{margin:0;padding:24px;background:#f4f4f6;color:#201925;font-family:Arial,sans-serif}
.receipt{max-width:480px;margin:auto;padding:28px;background:#fff;border-radius:12px;border:1px solid #e6dce8}
h1{margin:0;color:#e92d89;font-size:27px}
h2{font-size:18px;margin-top:26px}
.muted{color:#706777;font-size:13px}
.line{display:flex;justify-content:space-between;gap:16px;padding:11px 0;border-bottom:1px solid #eee8f0}
.line span:first-child{color:#706777}
.line strong{text-align:right;overflow-wrap:anywhere}
.total{margin-top:20px;padding:18px;background:#fff0f7;border-radius:8px;text-align:center}
.total strong{display:block;margin-top:8px;color:#e92d89;font-size:28px}
.actions{margin-top:24px;text-align:center}
button{padding:12px 20px;margin:4px;border:0;border-radius:8px;background:#e92d89;color:white;font-weight:bold;cursor:pointer}
button.secondary{background:#29212e}
@media print{
  body{padding:0;background:white}
  .receipt{border:0;border-radius:0}
  .actions{display:none}
}
</style>
</head>
<body>
<main class="receipt">
  <h1>CrediFácil</h1>
  <p class="muted">Comprovante de pagamento · Nº ${escapeHtml(receiptNumber)}</p>
  <h2>Dados do pagamento</h2>

  <div class="line">
    <span>Cliente</span>
    <strong>${escapeHtml(customer?.name || "Cliente não encontrado")}</strong>
  </div>

  <div class="line">
    <span>Data</span>
    <strong>${formatDate(payment.date)}</strong>
  </div>

  <div class="line">
    <span>Parcela de referência</span>
    <strong>${escapeHtml(installmentNumber)} de ${escapeHtml(loan.installments)}</strong>
  </div>

  <div class="line">
    <span>Valor da parcela</span>
    <strong>${money(installment)}</strong>
  </div>

  <div class="line">
    <span>Valor emprestado</span>
    <strong>${money(loan.amount)}</strong>
  </div>

  <div class="line">
    <span>Total com juros</span>
    <strong>${money(loanTotal(loan))}</strong>
  </div>

  <div class="line">
    <span>Saldo restante</span>
    <strong>${money(balance)}</strong>
  </div>

  ${payment.notes ? `
    <div class="line">
      <span>Observação</span>
      <strong>${escapeHtml(payment.notes)}</strong>
    </div>
  ` : ""}

  <div class="total">
    VALOR RECEBIDO
    <strong>${money(payment.amount)}</strong>
  </div>

  <p class="muted" style="margin-top:24px;text-align:center">
    Comprovante gerado pelo sistema CrediFácil.
  </p>

  <div class="actions">
    <button onclick="window.print()">Imprimir comprovante</button>
    <button class="secondary" onclick="window.close()">Fechar</button>
  </div>
</main>
</body>
</html>`);

  receiptWindow.document.close();
}

function deleteLoan(loanId) {
  const loan = getLoan(loanId);
  if (!loan) return;

  const hasPayments = myRows(KEYS.payments).some(
    (payment) => payment.loanId === loanId
  );

  if (hasPayments) {
    return notify(
      "Este empréstimo possui pagamentos. Exclua os pagamentos primeiro.",
      "error"
    );
  }

  if (!confirm("Excluir este empréstimo?")) return;

  saveRows(
    KEYS.loans,
    myRows(KEYS.loans).filter((item) => item.id !== loanId)
  );

  recordHistory(
    "Empréstimo excluído",
    getCustomer(loan.customerId)?.name || "Cliente",
    loan.amount
  );

  renderAll();
}

function saveExpense(event) {
  event.preventDefault();

  const description = $("expense-description").value.trim();
  const amount = number($("expense-amount").value);
  const date = $("expense-date").value;

  if (!description || amount <= 0 || !date) {
    return notify("Confira os dados da despesa.", "error");
  }

  const expense = {
    id: id(),
    description,
    amount,
    date,
    category: $("expense-category").value,
    createdAt: new Date().toISOString()
  };

  const expenses = myRows(KEYS.expenses);
  expenses.push(expense);
  saveRows(KEYS.expenses, expenses);

  recordHistory("Despesa cadastrada", description, amount);

  $("expense-form").reset();
  $("expense-date").value = today();

  renderAll();
  notify("Despesa salva.");
}

function deleteExpense(expenseId) {
  const expenses = myRows(KEYS.expenses);

  const expense = expenses.find(
    (item) => item.id === expenseId
  );

  if (!expense || !confirm(`Excluir a despesa "${expense.description}"?`)) {
    return;
  }

  saveRows(
    KEYS.expenses,
    expenses.filter((item) => item.id !== expenseId)
  );

  recordHistory(
    "Despesa excluída",
    expense.description,
    expense.amount
  );

  renderAll();
  notify("Despesa excluída.");
}

function showPage(pageName) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.page === pageName);
  });

  $(`page-${pageName}`)?.classList.add("active");
  $("sidebar").classList.remove("open");
}

function enterApp(user) {
  write(KEYS.session, {
    userId: user.id,
    name: user.name,
    email: user.email
  });

  $("current-user-name").textContent = user.name;

  showScreen("app-shell");
  renderAll();
  updatePaymentSuggestion();
}

function register(event) {
  event.preventDefault();

  const name = $("register-name").value.trim();
  const email = $("register-email").value.trim().toLowerCase();
  const password = $("register-password").value;
  const confirmPassword = $("register-confirm").value;

  if (name.length < 2) {
    return setMessage(
      "register-message",
      "Informe seu nome completo.",
      "error"
    );
  }

  if (password.length < 6) {
    return setMessage(
      "register-message",
      "A senha deve ter pelo menos 6 caracteres.",
      "error"
    );
  }

  if (password !== confirmPassword) {
    return setMessage(
      "register-message",
      "As senhas não coincidem.",
      "error"
    );
  }

  const users = read(KEYS.users);

  if (users.some((user) => user.email === email)) {
    return setMessage(
      "register-message",
      "Este e-mail já está cadastrado.",
      "error"
    );
  }

  const user = {
    id: id(),
    name,
    email,
    password,
    createdAt: new Date().toISOString()
  };

  users.push(user);
  write(KEYS.users, users);

  enterApp(user);
  $("register-form").reset();

  notify("Conta criada com sucesso.");
}

function login(event) {
  event.preventDefault();

  const email = $("login-email").value.trim().toLowerCase();
  const password = $("login-password").value;

  const user = read(KEYS.users).find(
    (item) => item.email === email && item.password === password
  );

  if (!user) {
    return setMessage(
      "login-message",
      "E-mail ou senha incorretos.",
      "error"
    );
  }

  setMessage("login-message", "", "");
  enterApp(user);
  $("login-form").reset();
}

function logout() {
  localStorage.removeItem(KEYS.session);
  showScreen("login-screen");
}

function exportData() {
  const data = {
    exportedAt: new Date().toISOString(),
    customers: myRows(KEYS.customers),
    loans: myRows(KEYS.loans),
    payments: myRows(KEYS.payments),
    expenses: myRows(KEYS.expenses),
    history: myRows(KEYS.history)
  };

  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `credifacil-backup-${today()}.json`;
  anchor.click();

  URL.revokeObjectURL(url);
  notify("Backup exportado.");
}

function init() {
  $("show-register").addEventListener("click", () => {
    setMessage("register-message", "");
    showScreen("register-screen");
  });

  $("show-login").addEventListener("click", () => {
    showScreen("login-screen");
  });

  $("login-form").addEventListener("submit", login);
  $("register-form").addEventListener("submit", register);
  $("logout-button").addEventListener("click", logout);

  $("customer-form").addEventListener("submit", saveCustomer);
  $("customer-cancel").addEventListener("click", resetCustomerForm);

  $("loan-form").addEventListener("submit", saveLoan);
  $("payment-form").addEventListener("submit", savePayment);
  $("payment-loan").addEventListener("change", updatePaymentSuggestion);

  $("expense-form").addEventListener("submit", saveExpense);

  $("customer-search").addEventListener("input", renderCustomers);
  $("loan-search").addEventListener("input", renderLoans);

  $("export-data").addEventListener("click", exportData);

  $("menu-toggle").addEventListener("click", () => {
    $("sidebar").classList.toggle("open");
  });

  document.querySelectorAll(".nav-link").forEach((button) => {
    button.addEventListener("click", () => {
      showPage(button.dataset.page);
    });
  });

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const { action, id: itemId } = button.dataset;

    if (action === "edit-customer") editCustomer(itemId);
    if (action === "delete-customer") deleteCustomer(itemId);
    if (action === "delete-loan") deleteLoan(itemId);
    if (action === "edit-payment") editPayment(itemId);
    if (action === "delete-payment") deletePayment(itemId);
    if (action === "view-receipt") showReceipt(itemId);
    if (action === "delete-expense") deleteExpense(itemId);
  });

  $("loan-start-date").value = today();
  $("payment-date").value = today();
  $("expense-date").value = today();

  const session = currentSession();

  if (session) {
    const user = read(KEYS.users).find(
      (item) => item.id === session.userId
    );

    if (user) return enterApp(user);

    localStorage.removeItem(KEYS.session);
  }

  showScreen("login-screen");
}

document.addEventListener("DOMContentLoaded", init);