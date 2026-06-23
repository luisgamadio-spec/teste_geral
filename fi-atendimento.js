const SUPABASE_URL = "https://yacqlelpzchcotgngwbh.supabase.co";
const SUPABASE_KEY = "sb_publishable__J96gDH1kOqlc4iFW24Z2Q_u_lWAg5_";

async function falarComAnalista() {
  try {
    mostrarStatusAnalista("Procurando analista disponível...");

    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/chamar_analista_fi`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    });

    if (!response.ok) {
      throw new Error("Erro ao consultar analista disponível.");
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      mostrarStatusAnalista("Nenhum analista disponível no momento.");
      return;
    }

    const analista = data[0];
    const telefone = limparTelefone(analista.whatsapp);

    if (!telefone) {
      mostrarStatusAnalista("Analista encontrado, mas WhatsApp não cadastrado.");
      return;
    }

    mostrarStatusAnalista(`Analista encontrado: ${analista.nome}. Abrindo WhatsApp...`);

    const mensagem = encodeURIComponent("Olá, preciso de apoio em uma simulação F&I.");
    const urlWhatsApp = `https://wa.me/${telefone}?text=${mensagem}`;

    setTimeout(() => {
      window.open(urlWhatsApp, "_blank");
    }, 800);
  } catch (error) {
    console.error(error);
    mostrarStatusAnalista("Não foi possível localizar um analista agora.");
  }
}

function limparTelefone(valor) {
  if (!valor) return "";
  return String(valor).replace(/\D/g, "");
}

function mostrarStatusAnalista(mensagem) {
  let box = document.getElementById("statusAnalistaFI");

  if (!box) {
    box = document.createElement("div");
    box.id = "statusAnalistaFI";
    box.style.position = "fixed";
    box.style.left = "50%";
    box.style.bottom = "24px";
    box.style.transform = "translateX(-50%)";
    box.style.zIndex = "99999";
    box.style.maxWidth = "calc(100vw - 32px)";
    box.style.background = "rgba(10, 14, 25, 0.96)";
    box.style.color = "#ffffff";
    box.style.padding = "14px 18px";
    box.style.borderRadius = "14px";
    box.style.fontFamily = "Arial, sans-serif";
    box.style.fontSize = "14px";
    box.style.fontWeight = "700";
    box.style.textAlign = "center";
    box.style.boxShadow = "0 12px 30px rgba(0,0,0,.35)";
    box.style.border = "1px solid rgba(255,255,255,.16)";
    document.body.appendChild(box);
  }

  box.textContent = mensagem;
  box.style.display = "block";

  clearTimeout(box._timer);
  box._timer = setTimeout(() => {
    box.style.display = "none";
  }, 5000);
}
