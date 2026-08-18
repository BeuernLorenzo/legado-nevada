// =====================================================
// HOTEL NEVADA — INTERAÇÕES DO PROTÓTIPO
// =====================================================


// -------------------------------------
// HEADER AO ROLAR
// -------------------------------------

const header = document.getElementById("header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 60) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

});


// -------------------------------------
// MENU MOBILE
// -------------------------------------

const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");

menuButton.addEventListener("click", () => {

    mobileMenu.classList.toggle("active");

});


// fecha o menu ao clicar em uma opção

const mobileLinks = mobileMenu.querySelectorAll("a");

mobileLinks.forEach(link => {

    link.addEventListener("click", () => {

        mobileMenu.classList.remove("active");

    });

});// =====================================================
// QR CODE — CONCIERGE NEVADA
// =====================================================

const qrContainer = document.getElementById("nevadaQRCode");

if (qrContainer && typeof QRCode !== "undefined") {

    const whatsappNevada =
        "https://wa.me/5512992041783?text=" +
        encodeURIComponent(
            "Olá! Estou hospedado no Hotel Nevada e gostaria de utilizar o Concierge Nevada."
        );

    new QRCode(qrContainer, {

        text: whatsappNevada,

        width: 220,
        height: 220,

        colorDark: "#171410",
        colorLight: "#ffffff",

        correctLevel: QRCode.CorrectLevel.H

    });

}// =====================================================
// CLUBE NEVADA — DEMONSTRAÇÃO DE CADASTRO
// =====================================================

const clubeForm = document.getElementById("clubeForm");
const clubeSuccess = document.getElementById("clubeSuccess");

if (clubeForm && clubeSuccess) {

    clubeForm.addEventListener("submit", function(event) {

        // impede envio real do formulário
        event.preventDefault();

        // exibe apenas uma confirmação visual
        clubeSuccess.classList.add("active");

        // limpa os campos
        clubeForm.reset();

    });

}// =====================================================
// CONSULTA DE DISPONIBILIDADE — WHATSAPP
// =====================================================

const availabilityForm =
    document.getElementById("availabilityForm");


if (availabilityForm) {

    const checkinInput =
        document.getElementById("checkin");

    const checkoutInput =
        document.getElementById("checkout");


    // -------------------------------------
    // IMPEDE ESCOLHER DATAS PASSADAS
    // -------------------------------------

    const today =
        new Date().toISOString().split("T")[0];

    checkinInput.min = today;
    checkoutInput.min = today;


    // -------------------------------------
    // CHECK-OUT NÃO PODE VIR
    // ANTES DO CHECK-IN
    // -------------------------------------

    checkinInput.addEventListener("change", () => {

        checkoutInput.min =
            checkinInput.value;

        if (
            checkoutInput.value &&
            checkoutInput.value < checkinInput.value
        ) {

            checkoutInput.value = "";

        }

    });


    // -------------------------------------
    // ENVIA CONSULTA AO WHATSAPP
    // -------------------------------------

    availabilityForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const checkin =
                checkinInput.value;

            const checkout =
                checkoutInput.value;

            const guests =
                document.getElementById("guests").value;


            // FORMATA DATA BRASILEIRA

            function formatDate(dateString) {

                const [year, month, day] =
                    dateString.split("-");

                return `${day}/${month}/${year}`;

            }


            const message =
`Olá! Gostaria de consultar a disponibilidade no Hotel Nevada.

Check-in: ${formatDate(checkin)}
Check-out: ${formatDate(checkout)}
Hóspedes: ${guests}

Poderiam me informar as opções disponíveis?`;


            const whatsappURL =
                "https://wa.me/5512992041783?text=" +
                encodeURIComponent(message);


            window.open(
                whatsappURL,
                "_blank",
                "noopener,noreferrer"
            );

        }
    );

}// =====================================================
// FOOTER — ANO AUTOMÁTICO
// =====================================================

const currentYear =
    document.getElementById("currentYear");

if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}// =====================================================
// NAVEGAÇÃO SUAVE ENTRE SEÇÕES
// =====================================================

function nevadaSmoothScroll(targetY, duration = 1200) {

    const startY = window.scrollY;
    const distance = targetY - startY;

    let startTime = null;


    // Curva de aceleração/desaceleração
    function easeInOutCubic(t) {

        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;

    }


    function animation(currentTime) {

        if (!startTime) {
            startTime = currentTime;
        }

        const elapsed = currentTime - startTime;

        const progress =
            Math.min(elapsed / duration, 1);

        const easedProgress =
            easeInOutCubic(progress);


        window.scrollTo(
            0,
            startY + distance * easedProgress
        );


        if (progress < 1) {

            requestAnimationFrame(animation);

        }

    }


    requestAnimationFrame(animation);

}



// =====================================================
// APLICA O SCROLL NOS LINKS INTERNOS
// =====================================================

const internalLinks =
    document.querySelectorAll('a[href^="#"]');


internalLinks.forEach(link => {

    link.addEventListener("click", function(event) {

        const destination =
            this.getAttribute("href");


        // Ignora links provisórios href="#"
        if (!destination || destination === "#") {
            return;
        }


        const target =
            document.querySelector(destination);


        if (!target) {
            return;
        }


        event.preventDefault();


        // Altura do menu fixo
        const header =
            document.getElementById("header");

        const headerHeight =
            header ? header.offsetHeight : 0;


        // Posição da seção
        const targetPosition =
            target.getBoundingClientRect().top
            + window.scrollY
            - headerHeight;


        // Fecha menu mobile, se estiver aberto
        if (
            typeof mobileMenu !== "undefined" &&
            mobileMenu
        ) {

            mobileMenu.classList.remove("active");

        }


        // Executa a animação
        nevadaSmoothScroll(
            targetPosition,
            1500
        );

    });

});