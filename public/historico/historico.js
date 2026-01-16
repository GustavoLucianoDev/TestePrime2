const MAX_TIME = 20000; // 20s
const start = Date.now();
let fired = false;
isFirstTime = true;

function isFlutterViewReady(el) {
  if (!el) return false;
  if (isFirstTime) {
    el.style.width = "401px";
    el.style.height = "811px";
    isFirstTime = false;
  }

  const style = window.getComputedStyle(el);

  const visible =
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    parseFloat(style.opacity) !== 0;

  const positioned = style.position === "absolute" && style.inset === "0px";

  const sized = style.width === "402px" && style.height === "812px";

  return visible && positioned && sized;
}

function check() {
  const flutterView = document.querySelector("flutter-view");

  if (isFlutterViewReady(flutterView)) {
    fired = true;
    observer.disconnect();
    clearInterval(interval);

    const div = document.createElement("div");
    div.className = "historico-icon-menu";
    div.onclick = () => ativarUIHistorico();

    document.body.appendChild(div);
  }
}

// Observa mudanças no DOM
const observer = new MutationObserver(check);
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ["style", "class"],
});

// Fallback por intervalo
const interval = setInterval(() => {
  if (fired) return;

  if (Date.now() - start > MAX_TIME) {
    clearInterval(interval);
    observer.disconnect();
    console.warn("[Inject] ❌ timeout esperando flutter-view visível");
  } else {
    check();
  }
}, 200);

document.addEventListener("click", (event) => {
  const historico = document.getElementById("historico-root");
  const historicoIconMenu = document.querySelector(".historico-icon-menu");

  if (!historico && !historicoIconMenu) return;

  // Se o clique NÃO foi dentro do historico-root
  if (!historico.contains(event.target) && !historicoIconMenu.contains(event.target)) {
    console.log("👉 Clique fora do historico");
    
    // ação desejada
    historico.remove(); // ou hide
  }
});


function ativarUIHistorico() {
  if (!document.getElementById("historico-root")) {
    fetch("/inject/historico/historico.html")
      .then((res) => res.text())
      .then((html) => {
        const container = document.createElement("div");
        container.id = "historico-root";
        container.innerHTML = html;
        document.body.appendChild(container);
      });
  }
}
