// =====================================================
// HOTEL NEVADA — TERMINAL DE PONTO (DEMONSTRAÇÃO)
// Persistência local + sincronização com Nevada Admin
// =====================================================

const EMPLOYEES = {
    "1001": { name: "Funcionário 01", role: "Recepção" },
    "1002": { name: "Funcionário 02", role: "Governança" },
    "1003": { name: "Funcionário 03", role: "Operação" }
};

const STORAGE_KEY = "nevadaPunches";
const channel = "BroadcastChannel" in window
    ? new BroadcastChannel("nevada-admin")
    : null;

const terminalClock = document.getElementById("terminalClock");
const terminalDate = document.getElementById("terminalDate");
const pinScreen = document.getElementById("pinScreen");
const actionScreen = document.getElementById("actionScreen");
const pinDisplay = document.getElementById("pinDisplay");
const clearPin = document.getElementById("clearPin");
const confirmPin = document.getElementById("confirmPin");
const backToPin = document.getElementById("backToPin");
const employeeName = document.getElementById("employeeName");
const lastPunch = document.getElementById("lastPunch");
const confirmationOverlay = document.getElementById("confirmationOverlay");
const confirmationAction = document.getElementById("confirmationAction");
const confirmationTime = document.getElementById("confirmationTime");
const confirmationEmployee = document.getElementById("confirmationEmployee");
const closeConfirmation = document.getElementById("closeConfirmation");
const numberButtons = document.querySelectorAll("[data-number]");
const punchButtons = document.querySelectorAll(".punch-button[data-action]");

let currentPin = "";
let currentEmployeeId = null;

function updateClock() {
    const now = new Date();
    terminalClock.textContent = now.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    terminalDate.textContent = new Intl.DateTimeFormat("pt-BR", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(now).replace(/\./g, "").toUpperCase();
}

updateClock();
setInterval(updateClock, 1000);

function renderPin() {
    if (!currentPin) {
        pinDisplay.textContent = "• • • •";
        pinDisplay.classList.remove("has-value");
        return;
    }

    pinDisplay.textContent = currentPin
        .split("")
        .map(() => "•")
        .join(" ");
    pinDisplay.classList.add("has-value");
}

numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (currentPin.length >= 4) return;
        currentPin += button.dataset.number;
        renderPin();
    });
});

clearPin.addEventListener("click", () => {
    currentPin = "";
    renderPin();
});

confirmPin.addEventListener("click", identifyEmployee);

function identifyEmployee() {
    const employee = EMPLOYEES[currentPin];

    if (!employee) {
        pinDisplay.textContent = "CÓDIGO INVÁLIDO";
        pinDisplay.classList.add("has-value");
        setTimeout(() => {
            currentPin = "";
            renderPin();
        }, 1100);
        return;
    }

    currentEmployeeId = currentPin;
    employeeName.textContent = employee.name;
    pinScreen.classList.remove("active");
    actionScreen.classList.add("active");
    renderLastPunch();
}

backToPin.addEventListener("click", resetTerminal);

function getPunches() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
        return [];
    }
}

function savePunches(punches) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(punches));
}

function renderLastPunch() {
    if (!currentEmployeeId) return;

    const punches = getPunches();
    const latest = punches
        .filter(item => item.employeeId === currentEmployeeId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

    if (!latest) {
        lastPunch.innerHTML = "Nenhum registro anterior neste terminal.";
        return;
    }

    lastPunch.innerHTML = `Último registro: <strong>${latest.action}</strong> às <strong>${latest.time}</strong>.`;
}

punchButtons.forEach(button => {
    button.addEventListener("click", () => {
        registerPunch(button.dataset.action);
    });
});
// =====================================================
// NEVADA CLOUD — SINCRONIZAÇÃO DO PONTO
// =====================================================

async function sendPunchToCloud(punch) {

    if (
        typeof nevadaSupabase === "undefined"
    ) {

        console.warn(
            "Nevada Cloud não está disponível."
        );

        return false;
    }


    const { data, error } =
        await nevadaSupabase
            .from("demo_punches")
            .insert({

    client_ref:
        punch.id,

    employee_code:
        punch.employeeId,

    employee_name:
        punch.employeeName,

    employee_role:
        punch.role,

    action:
        punch.action,

    punched_at:
        punch.timestamp,

    source:
        punch.source
})
            .select()
            .single();


    if (error) {

        console.error(
            "Nevada Cloud — erro ao sincronizar:",
            error
        );

        return false;
    }


    console.log(
        "Nevada Cloud — ponto sincronizado:",
        data
    );


    return true;
}
function registerPunch(action) {
    const employee = EMPLOYEES[currentEmployeeId];
    if (!employee) return;

    const now = new Date();
    const punch = {
        id: `${now.getTime()}-${currentEmployeeId}`,
        employeeId: currentEmployeeId,
        employeeName: employee.name,
        role: employee.role,
        action,
        timestamp: now.toISOString(),
        date: now.toLocaleDateString("pt-BR"),
        time: now.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }),
        source: "Terminal Nevada — Demo"
    };

    const punches = getPunches();

punches.unshift(punch);

savePunches(
    punches.slice(0, 250)
);


// ==============================================
// NUVEM — SUPABASE
// ==============================================

sendPunchToCloud(punch);


// ==============================================
// SINCRONIZAÇÃO LOCAL
// ==============================================

if (channel) {

    channel.postMessage({
        type: "punch-created",
        punch
    });

}

    confirmationAction.textContent = action;
    confirmationTime.textContent = punch.time.slice(0, 5);
    confirmationEmployee.textContent = employee.name;
    confirmationOverlay.classList.add("active");

    if (navigator.vibrate) {
        navigator.vibrate(80);
    }

    renderLastPunch();
}

closeConfirmation.addEventListener("click", () => {
    confirmationOverlay.classList.remove("active");
    resetTerminal();
});

confirmationOverlay.addEventListener("click", event => {
    if (event.target === confirmationOverlay) {
        confirmationOverlay.classList.remove("active");
        resetTerminal();
    }
});

function resetTerminal() {
    currentPin = "";
    currentEmployeeId = null;
    renderPin();
    actionScreen.classList.remove("active");
    pinScreen.classList.add("active");
    lastPunch.innerHTML = "";
}

// Teclado físico também funciona em um terminal com teclado numérico.
window.addEventListener("keydown", event => {
    if (!pinScreen.classList.contains("active")) return;

    if (/^\d$/.test(event.key) && currentPin.length < 4) {
        currentPin += event.key;
        renderPin();
    }

    if (event.key === "Backspace" || event.key === "Delete") {
        currentPin = currentPin.slice(0, -1);
        renderPin();
    }

    if (event.key === "Enter") {
        identifyEmployee();
    }
});
