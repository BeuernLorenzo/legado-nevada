// =====================================================
// NEVADA ADMIN — DEMO
// =====================================================


// LOGIN

const loginScreen =
    document.getElementById("loginScreen");

const adminApp =
    document.getElementById("adminApp");

const demoLogin =
    document.getElementById("demoLogin");

const logoutButton =
    document.getElementById("logoutButton");


demoLogin.addEventListener("click", () => {

    loginScreen.classList.add("hidden");

    adminApp.classList.add("active");

});


logoutButton.addEventListener("click", () => {

    adminApp.classList.remove("active");

    loginScreen.classList.remove("hidden");

});


// =====================================================
// NAV
// =====================================================

const navItems =
    document.querySelectorAll(".nav-item");

const sections =
    document.querySelectorAll(".admin-section");

const pageTitle =
    document.getElementById("pageTitle");

// =====================================================
// MODO PROPRIETÁRIA
// =====================================================

let ownerMode = false;


const ownerOnlyItems =
    document.querySelectorAll(".owner-only");


const profileRole =
    document.getElementById("profileRole");


ownerOnlyItems.forEach(item => {

    item.addEventListener(
        "click",
        function(event) {

            if (ownerMode) {
                return;
            }


            /*
                Capturamos o clique antes da
                navegação normal.
            */

            event.preventDefault();

            event.stopImmediatePropagation();


            const code =
                prompt(
                    "Área exclusiva da proprietária.\n\nDigite o código de demonstração:"
                );


            /*
                DEMONSTRAÇÃO SOMENTE.

                Em produção isso será autenticação
                real no servidor.
            */

            if (code === "1983") {

                ownerMode = true;


                document.body.classList.add(
                    "owner-mode"
                );


                /*
                    Libera automaticamente o painel
                    geral da proprietária também.
                */

                if (
                    typeof ownerLock !== "undefined" &&
                    ownerLock
                ) {

                    ownerLock.classList.add(
                        "hidden"
                    );

                }


                if (
                    typeof ownerDashboard !== "undefined" &&
                    ownerDashboard
                ) {

                    ownerDashboard.classList.add(
                        "active"
                    );

                }


                if (profileRole) {

                    profileRole.textContent =
                        "Proprietária";

                }


                /*
                    Executa novamente o clique,
                    agora com a permissão liberada.
                */

                item.click();

            }

            else {

                alert(
                    "Acesso reservado exclusivamente à proprietária."
                );

            }

        },

        true
    );

});
navItems.forEach(item => {

    item.addEventListener("click", () => {

        navItems.forEach(nav =>
            nav.classList.remove("active")
        );

        item.classList.add("active");


        sections.forEach(section =>
            section.classList.remove("active")
        );


        const targetId =
            item.dataset.section;


        const target =
            document.getElementById(targetId);


        if (target) {

            target.classList.add("active");

        }


        pageTitle.textContent =
    item.dataset.title ||
    item.textContent
        .replace(/[0-9]/g, "")
        .trim();


        sidebar.classList.remove("open");

    });

});


// =====================================================
// MOBILE MENU
// =====================================================

const sidebar =
    document.getElementById("sidebar");

const mobileMenu =
    document.getElementById("mobileMenu");


mobileMenu.addEventListener("click", () => {

    sidebar.classList.toggle("open");

});


// =====================================================
// DATE
// =====================================================

const currentDate =
    document.getElementById("currentDate");


const formattedDate =
    new Intl.DateTimeFormat(
        "pt-BR",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    ).format(new Date());


currentDate.textContent =
    formattedDate;


// =====================================================
// SERVICE WORKER
// =====================================================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker.register("sw.js");

    });

}// =====================================================
// ADMINISTRAÇÃO GERAL — DEMO DA PROPRIETÁRIA
// =====================================================

const unlockOwner =
    document.getElementById("unlockOwner");

const ownerLock =
    document.getElementById("ownerLock");

const ownerDashboard =
    document.getElementById("ownerDashboard");

const ownerClock =
    document.getElementById("ownerClock");


if (
    unlockOwner &&
    ownerLock &&
    ownerDashboard
) {

    unlockOwner.addEventListener(
        "click",
        () => {

            const code =
                prompt(
                    "Código de demonstração da proprietária:"
                );


            /*
               SOMENTE DEMONSTRAÇÃO.

               Este código NÃO constitui segurança real.
               Quando o sistema for implantado, usaremos
               autenticação e permissões do servidor.
            */

            if (code === "1983") {

                ownerLock.classList.add(
                    "hidden"
                );

                ownerDashboard.classList.add(
                    "active"
                );

            } else {

                alert(
                    "Acesso reservado à proprietária."
                );

            }

        }
    );

}


// =====================================================
// RELÓGIO — ÁREA DA PROPRIETÁRIA
// =====================================================

function updateOwnerClock() {

    if (!ownerClock) {
        return;
    }

    const now =
        new Date();


    ownerClock.textContent =
        now.toLocaleTimeString(
            "pt-BR",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );

}


updateOwnerClock();

setInterval(
    updateOwnerClock,
    1000
);
// =====================================================
// TERMINAL DE PONTO — SINCRONIZAÇÃO DEMONSTRATIVA
// =====================================================

const PUNCH_STORAGE_KEY = "nevadaPunches";
const recentPunchList = document.getElementById("recentPunchList");
const todayPunchCount = document.getElementById("todayPunchCount");
const employeesWorking = document.getElementById("employeesWorking");
const refreshPunches = document.getElementById("refreshPunches");
const openPunchTerminal = document.getElementById("openPunchTerminal");

function getNevadaPunches() {
    try {
        return JSON.parse(localStorage.getItem(PUNCH_STORAGE_KEY) || "[]");
    } catch {
        return [];
    }
}

function isToday(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    return date.getFullYear() === now.getFullYear()
        && date.getMonth() === now.getMonth()
        && date.getDate() === now.getDate();
}

function renderNevadaPunches() {
    if (!recentPunchList) return;

    const punches = getNevadaPunches()
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const today = punches.filter(item => isToday(item.timestamp));

    if (todayPunchCount) {
        todayPunchCount.textContent = String(today.length);
    }

    // Calcula quem está em serviço pelo último estado registrado de cada matrícula.
    if (employeesWorking) {
        const latestByEmployee = new Map();
        today.forEach(item => {
            if (!latestByEmployee.has(item.employeeId)) {
                latestByEmployee.set(item.employeeId, item);
            }
        });

        const working = [...latestByEmployee.values()].filter(item =>
            item.action === "Entrada" || item.action === "Retorno"
        ).length;

        employeesWorking.textContent = String(working);
    }

    if (!punches.length) {
        recentPunchList.innerHTML = `
            <div class="empty-punch-state">
                <strong>Nenhum registro realizado ainda.</strong>
                <p>Abra o Terminal de Ponto e faça um registro demonstrativo.</p>
            </div>
        `;
        return;
    }

    recentPunchList.innerHTML = punches.slice(0, 8).map(item => `
        <article class="recent-punch-item">
            <div>
                <span class="panel-label">${item.action.toUpperCase()}</span>
                <strong>${item.employeeName}</strong>
                <p>${item.role || "Equipe Nevada"} • matrícula ${item.employeeId}</p>
            </div>
            <div class="recent-punch-time">
                <strong>${item.time}</strong>
                <span>${item.date}</span>
            </div>
        </article>
    `).join("");
}

if (refreshPunches) {
    refreshPunches.addEventListener("click", renderNevadaPunches);
}

if (openPunchTerminal) {
    openPunchTerminal.addEventListener("click", () => {
        window.open("ponto.html", "_blank", "noopener");
    });
}

// Atualiza quando outra aba do mesmo navegador registra o ponto.
window.addEventListener("storage", event => {
    if (event.key === PUNCH_STORAGE_KEY) {
        renderNevadaPunches();
    }
});

if ("BroadcastChannel" in window) {
    const nevadaAdminChannel = new BroadcastChannel("nevada-admin");
    nevadaAdminChannel.addEventListener("message", event => {
        if (event.data?.type === "punch-created") {
            renderNevadaPunches();
        }
    });
}

renderNevadaPunches();


// =====================================================
// CENTRAL DA PROPRIETÁRIA — ALERTAS E NAVEGAÇÃO
// =====================================================

const ownerAlertCount = document.getElementById("ownerAlertCount");
const ownerKpiAlerts = document.getElementById("ownerKpiAlerts");
const ownerLastPunch = document.getElementById("ownerLastPunch");
const ownerLastPunchMeta = document.getElementById("ownerLastPunchMeta");

function navigateAdminSection(sectionId) {
    const nav = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
    if (nav) nav.click();
}

document.querySelectorAll("[data-go-section]").forEach(button => {
    button.addEventListener("click", () => {
        navigateAdminSection(button.dataset.goSection);
    });
});

function updateOwnerAlertCounters() {
    const unresolved = document.querySelectorAll(
        ".owner-alert-card:not(.resolved):not(.priority-live)"
    ).length;

    if (ownerAlertCount) ownerAlertCount.textContent = String(unresolved);
    if (ownerKpiAlerts) ownerKpiAlerts.textContent = String(unresolved);
}

document.querySelectorAll(".owner-alert-resolve").forEach(button => {
    button.addEventListener("click", () => {
        const card = button.closest(".owner-alert-card");
        if (!card) return;
        card.classList.toggle("resolved");
        button.textContent = card.classList.contains("resolved")
            ? "Reabrir análise"
            : "Marcar como analisado";
        updateOwnerAlertCounters();
    });
});

updateOwnerAlertCounters();

// =====================================================
// NOTAS PRIVADAS — PERSISTÊNCIA LOCAL DA DEMONSTRAÇÃO
// =====================================================

const ownerNotes = document.querySelector(".owner-notes textarea");
if (ownerNotes) {
    ownerNotes.value = localStorage.getItem("nevadaOwnerNotes") || "";
    ownerNotes.addEventListener("input", () => {
        localStorage.setItem("nevadaOwnerNotes", ownerNotes.value);
    });
}

// =====================================================
// DEEP LINK DEMONSTRATIVO
// Ex.: index.html?section=avaliacoes
// =====================================================

const deepLinkParams = new URLSearchParams(window.location.search);
const requestedSection = deepLinkParams.get("section");
let pendingDeepLinkSection = requestedSection;

function applyPendingDeepLink() {
    if (!pendingDeepLinkSection) return;
    const nav = document.querySelector(`.nav-item[data-section="${pendingDeepLinkSection}"]`);
    if (!nav) return;

    // Áreas comuns abrem imediatamente. Áreas privadas mantêm o fluxo de código.
    nav.click();
    pendingDeepLinkSection = null;
}

if (demoLogin) {
    demoLogin.addEventListener("click", () => {
        setTimeout(applyPendingDeepLink, 60);
    });
}

// =====================================================
// COMPLEMENTO DA SINCRONIZAÇÃO DO PONTO NO PAINEL DA DONA
// =====================================================

function updateOwnerPunchWidget() {
    const punches = getNevadaPunches()
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const latest = punches[0];

    if (!ownerLastPunch || !ownerLastPunchMeta) return;

    if (!latest) {
        ownerLastPunch.textContent = "Terminal de ponto aguardando novo registro";
        ownerLastPunchMeta.textContent =
            "Ao registrar Entrada, Intervalo, Retorno ou Saída, esta área é atualizada automaticamente nesta demonstração.";
        return;
    }

    ownerLastPunch.textContent =
        `${latest.employeeName} • ${latest.action} às ${latest.time}`;

    ownerLastPunchMeta.textContent =
        `${latest.role || "Equipe Nevada"} • matrícula ${latest.employeeId} • ${latest.date}. ` +
        "Na implantação em nuvem, o mesmo evento poderá aparecer no iPhone da proprietária em tempo real.";
}

const originalRenderNevadaPunches = renderNevadaPunches;
renderNevadaPunches = function() {
    originalRenderNevadaPunches();
    updateOwnerPunchWidget();
};

renderNevadaPunches();
