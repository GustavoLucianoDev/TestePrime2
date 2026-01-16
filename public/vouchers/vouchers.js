// rota alvo
const TARGET_ROUTE = "#/home/profile/vouchers";
const HTML_VOUCHERS = `
<h1>🎟️ Vouchers Custom</h1>
<p>UI 100% HTML / JS</p>
<button id="btn-voltar" onclick="voltarParaPerfil()">⬅ Voltar</button>
`;

// =============================
// OBSERVA MUDANÇA DE ROTA
// =============================
let lastHash = location.hash;

setInterval(() => {
  if (location.hash !== lastHash) {
    lastHash = location.hash;
    onRouteChange(location.hash);
  }
}, 200);

// =============================
// QUANDO MUDA A ROTA
// =============================
function onRouteChange(hash) {
  console.log("[Inject] rota:", hash);

  if (hash.startsWith(TARGET_ROUTE)) {
    ativarUIVouchers();
  }
}

// =============================
// ATIVA UI CUSTOM
// =============================
function ativarUIVouchers() {
  if (!document.getElementById("vouchers-root")) {
    const container = document.createElement("div");
    container.id = "vouchers-root";
    container.innerHTML = HTML_VOUCHERS;
    document.body.appendChild(container);
  }
}

// =============================
// DESATIVA UI CUSTOM
// =============================
function desativarUIVouchers() {
  const ui = document.getElementById("vouchers-root");
  if (ui) ui.remove();
}

// =============================
// VOLTAR PARA ANTERIOR
// =============================
function voltarParaPerfil() {
  console.log("[Inject] voltando para Flutter");
  history.back();
  desativarUIVouchers();
}
