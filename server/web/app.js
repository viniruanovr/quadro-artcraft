// Quadro de Cenas: interface no navegador. Sem bibliotecas: tudo em DOM + SVG.
"use strict";

const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const PORTA_Y = 20;
const LARGURA = { midia: 240, nota: 240, gerar: 300 };

const est = {
  proj: new URLSearchParams(location.search).get("p") || "",
  doc: null,
  cfg: null,
  cena: null,
  vista: { x: 60, y: 40, z: 1 },
  sel: new Set(),
  minis: new Set(),
  editandoRotulo: null,
};

// ---------------------------------------------------------------------------------------------
// Servidor
// ---------------------------------------------------------------------------------------------

const qp = (extra = "") => `p=${encodeURIComponent(est.proj)}${extra}`;

async function pegar(rota) {
  const r = await fetch(`${rota}${rota.includes("?") ? "&" : "?"}${qp()}`);
  const j = await r.json();
  if (!r.ok) throw new Error(j.erro || r.statusText);
  return j;
}

async function postar(rota, corpo) {
  const r = await fetch(`${rota}${rota.includes("?") ? "&" : "?"}${qp()}`, {
    method: "POST", headers: { "Content-Type": "application/json", "X-Quadro": "1" }, body: JSON.stringify(corpo || {}),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.erro || r.statusText);
  return j;
}

async function ops(lista, silencioso) {
  try {
    const r = await postar("/api/ops", { ops: lista });
    await carregarDoc();
    return r;
  } catch (e) {
    if (!silencioso) aviso(e.message, true);
    await carregarDoc();
    throw e;
  }
}

async function subir(arquivo, extra = "") {
  const r = await fetch(`/api/upload?${qp(`&nome=${encodeURIComponent(arquivo.name || "colado.png")}${extra}`)}`, {
    method: "POST", headers: { "X-Quadro": "1", "Content-Type": "application/octet-stream" }, body: arquivo,
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.erro || r.statusText);
  return j;
}

function aviso(texto, erro = false, ms = 4500) {
  const d = document.createElement("div");
  d.className = `aviso${erro ? " erro" : ""}`;
  d.textContent = texto;
  $("#avisos").appendChild(d);
  setTimeout(() => d.remove(), erro ? ms * 2 : ms);
}

// ---------------------------------------------------------------------------------------------
// Carregar e desenhar
// ---------------------------------------------------------------------------------------------

let carregando = null;
async function carregarDoc() {
  if (carregando) return carregando;
  carregando = (async () => {
    try {
      const d = await pegar("/api/quadro");
      // só pergunta quando chega uma versão nova (não quando ele navega entre versões)
      const antes = est.doc && est.doc.nome === d.nome ? new Map(est.doc.nos.filter((n) => n.tipo === "gerar").map((n) => [n.id, n.versoes.length])) : null;
      est.doc = d;
      for (const id of [...est.sel]) if (!acharNo(id) && !d.ligacoes.some((l) => l.id === id)) est.sel.delete(id);
      if (antes) for (const n of d.nos) if (n.tipo === "gerar" && n.atual && antes.has(n.id) && n.versoes.length > antes.get(n.id) && n.estado === "pronto") oferecerTroca(n);
      est.proj = d.nome;
      est.minis = new Set(d.miniaturas || []);
      if (!est.cena || !d.cenas.some((c) => c.id === est.cena)) {
        const salva = lerLocal(`cena:${d.nome}`);
        est.cena = d.cenas.some((c) => c.id === salva) ? salva : d.cenas[0].id;
        restaurarVista();
      }
      desenhar();
      fazerMiniaturas();
    } finally { carregando = null; }
  })();
  return carregando;
}

function lerLocal(k) { try { return localStorage.getItem(k); } catch { return null; } }
function gravarLocal(k, v) { try { localStorage.setItem(k, v); } catch {} }

const nosDaCena = () => est.doc.nos.filter((n) => n.cena === est.cena);
const acharNo = (id) => est.doc.nos.find((n) => n.id === id);
const midiaDe = (no) => { const id = no.tipo === "gerar" ? no.atual : no.midia; return id ? est.doc.midias[id] : null; };
const urlMidia = (m) => `/midia/${m.id}?${qp()}`;
const urlMini = (m) => (est.minis.has(m.id) ? `/mini/${m.id}.jpg?${qp()}` : m.tipo === "imagem" ? urlMidia(m) : "");
const tipoFio = (no) => { if (no.tipo === "nota") return "nota"; const m = midiaDe(no); return (m && m.tipo === "video") || (no.tipo === "gerar" && no.saida === "video") ? "video" : ""; };

function desenhar() {
  desenharTopo();
  desenharBiblioteca();
  desenharNos();
  desenharFios();
  aplicarVista();
  $("#vazio").hidden = nosDaCena().length > 0;
}

function desenharTopo() {
  const d = est.doc;
  $("#cenas").innerHTML = d.cenas.map((c) => `<button data-cena="${c.id}" class="${c.id === est.cena ? "ativa" : ""}" title="Clique duas vezes para renomear">${esc(c.nome)}</button>`).join("")
    + `<button class="nova" data-cena="+" title="Nova cena">＋ cena</button>`;
  const sel = $("#projeto");
  const lista = est.projetos || [d.nome];
  sel.innerHTML = [...new Set([...lista, d.nome])].map((p) => `<option ${p === d.nome ? "selected" : ""}>${esc(p)}</option>`).join("") + `<option value="+">＋ Novo projeto…</option>`;
  if (est.cfg) {
    const c = est.cfg;
    const nomes = { artcraft: "ArtCraft", fal: "fal.ai", comfy: "ComfyUI", kaggle: "Nuvem grátis", manual: "Manual" };
    const tem = c.motor === "manual" || c.motor === "comfy" || c[c.motor];
    const s = $("#motor span");
    s.textContent = `${nomes[c.motor] || c.motor}${c.motor === "manual" ? "" : tem ? " ✓" : c.motor === "kaggle" ? " · falta a conta" : " · sem chave"}`;
    s.className = tem ? "ok" : "falta";
  }
}

function desenharBiblioteca() {
  const ms = Object.values(est.doc.midias).reverse();
  $("#lista-midia").innerHTML = ms.map((m) => {
    const src = urlMini(m);
    const conteudo = src ? `<img src="${src}" loading="lazy" alt="">` : `<video src="${urlMidia(m)}#t=0.1" muted preload="metadata"></video>`;
    return `<div class="item" draggable="true" data-midia="${m.id}" title="${esc(m.arquivo)}">${conteudo}${m.tipo === "video" ? '<span class="v">▶</span>' : ""}</div>`;
  }).join("") || `<p class="dica" style="grid-column: span 2">Nada ainda. Arraste fotos e vídeos para o quadro.</p>`;
}

function htmlPrevia(m, no) {
  const soltar = `<div class="soltar">Soltar como nova versão</div>`;
  if (!m) {
    const msg = no.tipo === "gerar"
      ? (no.estado === "gerando" ? "Gerando…" : "Ligue referências, escreva no fio e clique em Gerar.<br>Ou arraste aqui um resultado feito por fora.")
      : "Sem arquivo";
    return `<div class="previa"><div class="vazia">${msg}</div>${soltar}</div>`;
  }
  if (no.tipo === "midia" && no.fc && no.trecho && no.fc.src !== undefined) {
    // clipe da timeline: toca o vídeo de verdade (o trecho do clipe), não um print
    const poster = ` poster="${urlMini(m) || urlMidia(m)}"`;
    return `<div class="previa"><video src="/api/filmcraft/arquivo?item=${no.fc.item}#t=${no.fc.src},${(no.fc.src + no.fc.dur).toFixed(2)}" controls muted loop playsinline preload="metadata"${poster}></video>${soltar}</div>`;
  }
  if (m.tipo === "video") {
    const poster = est.minis.has(m.id) ? ` poster="/mini/${m.id}.jpg?${qp()}"` : "";
    return `<div class="previa" data-ver="${m.id}"><video src="${urlMidia(m)}" muted loop playsinline preload="metadata"${poster}></video>${soltar}</div>`;
  }
  return `<div class="previa" data-ver="${m.id}"><img src="${urlMini(m) || urlMidia(m)}" alt="" draggable="false">${soltar}</div>`;
}

function opcoesModelo(no) {
  const c = est.cfg;
  if (c && c.motor === "comfy") return `<option value="">receita do ComfyUI</option>`;
  if (c && c.motor === "kaggle") return `<option value="">Wan 2.2 (nuvem grátis)</option>`;
  const motor = c && c.motor !== "manual" ? c.motor : "artcraft";
  const lista = (c && c.modelos[motor] && c.modelos[motor][no.saida === "video" ? "video" : "imagem"]) || [];
  const todos = no.modelo && !lista.includes(no.modelo) ? [no.modelo, ...lista] : lista;
  return `<option value="">padrão (${esc(lista[0] || "—")})</option>` + todos.map((m) => `<option value="${esc(m)}" ${m === no.modelo ? "selected" : ""}>${esc(m.replace(/^fal-ai\//, ""))}</option>`).join("");
}

function htmlNo(no) {
  const m = midiaDe(no);
  const tipoMidia = m ? m.tipo : "";
  const enviado = (no.envios || []).filter((e) => m && e.midia === m.id).map((e) => (e.app === "filmcraft" ? "FilmCraft" : "EffectCraft")).join(" + ");
  if (no.tipo === "nota") {
    return `<div class="porta saida" title="Puxe até um nó Gerar"></div>
      <div class="cab"><span class="tag nota">NOTA</span><input class="titulo" data-campo="titulo" value="${esc(no.titulo)}" placeholder="Título"><button class="x" data-acao="remover" title="Apagar">×</button></div>
      <textarea data-campo="texto" placeholder="Roteiro, direção, falas…">${esc(no.texto)}</textarea>`;
  }
  if (no.tipo === "midia") {
    return `<div class="porta saida" title="Puxe até um nó Gerar (ou solte no vazio para criar um)"></div>
      <div class="cab"><span class="tag ${tipoMidia === "video" || no.trecho ? "video" : ""}">${tipoMidia === "video" || no.trecho ? "VÍDEO BASE" : "IMAGEM"}</span><input class="titulo" data-campo="titulo" value="${esc(no.titulo)}" placeholder="ex.: Ana (personagem)"><button class="x" data-acao="remover" title="Apagar">×</button></div>
      ${htmlPrevia(m, no)}
      <div class="rodape"><span class="nome" title="${esc(m ? m.arquivo : "")}">${esc(m ? m.arquivo : "")}</span>
        ${no.fc ? `<button data-acao="trecho" class="${no.trecho ? "on" : ""}" title="${no.trecho ? "Vai como VÍDEO base na geração (clique para mandar só o quadro parado)" : "Vai só como imagem. Clique para mandar o vídeo do clipe como base"}">🎬</button>` : ""}<button data-acao="timeline" title="Colocar na timeline do FilmCraft, no playhead">TL</button><button data-acao="enviar-filmcraft" title="Importar no FilmCraft">FC</button><button data-acao="enviar-effectcraft" title="Importar no EffectCraft">EC</button></div>`;
  }
  const video = no.saida === "video";
  const n = no.versoes.length;
  const iv = no.versoes.indexOf(no.atual);
  const prop = ((est.cfg && est.cfg.proporcoes) || ["16:9"]).map((p) => `<option ${p === no.proporcao ? "selected" : ""}>${p}</option>`).join("");
  let estado = "";
  if (no.estado === "gerando") estado = `<div class="barra ${no.progresso ? "" : "indef"}"><i style="width:${no.progresso || 0}%"></i></div><div class="estado">${esc(no.fase || "Gerando")}${no.progresso ? ` · ${no.progresso}%` : "…"}</div>`;
  else if (no.estado === "erro") estado = `<div class="estado erro">${esc(no.erro)}</div>`;
  else if (no.estado === "aguardando") estado = `<div class="barra indef"><i></i></div><div class="estado">Esperando o ${no.saida === "video" ? "vídeo" : "arquivo"} baixado do ArtCraft… <button data-acao="cancelar-espera">Cancelar</button></div>`;
  return `<div class="porta entrada" title="Entradas: referências e notas"></div><div class="porta saida" title="Puxe para usar este resultado em outro nó (ex.: animar a foto)"></div>
    <div class="cab"><span class="tag gerar">${video ? "GERAR VÍDEO" : "GERAR FOTO"}</span><input class="titulo" data-campo="titulo" value="${esc(no.titulo)}" placeholder="Nome do plano"><button class="x" data-acao="remover" title="Apagar">×</button></div>
    ${htmlPrevia(m, no)}
    <div class="controles">
      <div class="linha">
        <div class="seg"><button data-acao="saida-imagem" class="${video ? "" : "on"}">Foto</button><button data-acao="saida-video" class="${video ? "on" : ""}">Vídeo</button></div>
        <select class="modelo" data-campo="modelo" title="Modelo">${opcoesModelo(no)}</select>
      </div>
      <div class="linha">
        <select data-campo="proporcao" title="Proporção">${prop}</select>
        ${video ? `<input class="duracao" data-campo="duracao" type="number" min="1" max="20" value="${no.duracao || 5}" title="Duração (s)"><span class="estado">s</span>` : ""}
        <span style="flex:1"></span>
        ${n ? `<span class="versoes"><button data-acao="versao-ant" ${iv <= 0 ? "disabled" : ""}>‹</button> v${iv + 1}/${n} <button data-acao="versao-prox" ${iv >= n - 1 ? "disabled" : ""}>›</button></span>` : ""}
      </div>
      <textarea data-campo="prompt" placeholder="Instrução extra (opcional). O principal vai escrito nos fios.">${esc(no.prompt)}</textarea>
      ${estado}
      <div class="linha">
        <button class="gerar-btn" data-acao="gerar" ${no.estado === "gerando" ? "disabled" : ""}>${n ? "↻ Gerar de novo" : "✦ Gerar"}</button>
        <button data-acao="copiar" title="Copiar o prompt montado (para gerar por fora)">Prompt</button>
        ${origemTimeline(no).length ? `<button data-acao="substituir" title="Trocar o clipe de origem na timeline por este resultado" ${m ? "" : "disabled"}>⇄</button>` : ""}
        <button data-acao="timeline" title="Colocar na timeline do FilmCraft, no playhead" ${m ? "" : "disabled"}>TL</button>
        <button data-acao="enviar-filmcraft" title="Importar no FilmCraft" ${m ? "" : "disabled"}>FC</button>
        <button data-acao="enviar-effectcraft" title="Importar no EffectCraft" ${m ? "" : "disabled"}>EC</button>
      </div>
      ${enviado ? `<div class="enviado">✓ enviado para ${enviado}</div>` : ""}
    </div>`;
}

function desenharNos() {
  const camada = $("#camada-nos");
  const vivos = new Set();
  const foco = document.activeElement;
  for (const no of nosDaCena()) {
    vivos.add(no.id);
    let el = camada.querySelector(`.no[data-id="${no.id}"]`);
    const m = midiaDe(no);
    const assinatura = JSON.stringify([no, m && m.arquivo, m && est.minis.has(m.id), est.cfg && est.cfg.motor]);
    if (!el) {
      el = document.createElement("div");
      el.dataset.id = no.id;
      camada.appendChild(el);
    }
    el.className = `no ${no.tipo}${m && m.tipo === "video" ? " video" : ""}${no.tipo === "gerar" ? ` saida-${no.saida}` : ""}${no.estado === "gerando" ? " gerando" : ""}${est.sel.has(no.id) ? " sel" : ""}`;
    el.style.left = `${no.x || 0}px`;
    el.style.top = `${no.y || 0}px`;
    if (el.dataset.sig !== assinatura && !(foco && el.contains(foco) && foco.matches("input, textarea"))) {
      el.dataset.sig = assinatura;
      el.innerHTML = htmlNo(no);
    }
  }
  for (const el of [...camada.children]) if (!vivos.has(el.dataset.id)) el.remove();
}

function pontaSaida(no) { return { x: (no.x || 0) + LARGURA[no.tipo] + 1, y: (no.y || 0) + PORTA_Y }; }
function pontaEntrada(no) { return { x: (no.x || 0) - 1, y: (no.y || 0) + PORTA_Y }; }
function curva(a, b) {
  const dx = Math.max(60, Math.abs(b.x - a.x) * 0.5);
  return `M${a.x},${a.y} C${a.x + dx},${a.y} ${b.x - dx},${b.y} ${b.x},${b.y}`;
}
function meio(a, b) {
  const dx = Math.max(60, Math.abs(b.x - a.x) * 0.5);
  const t = 0.5, u = 1 - t;
  const p1 = { x: a.x + dx, y: a.y }, p2 = { x: b.x - dx, y: b.y };
  return { x: u * u * u * a.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * b.x, y: u * u * u * a.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * b.y };
}

function desenharFios() {
  const svg = $("#fios");
  const temp = $("#fio-temp");
  svg.querySelectorAll("path:not(#fio-temp)").forEach((p) => p.remove());
  const rotulos = $("#camada-rotulos");
  const vivos = new Set();
  const ids = new Set(nosDaCena().map((n) => n.id));
  // Número de cada referência, na mesma ordem em que o prompt as cita ("imagem 2", "vídeo 1").
  const numeros = {};
  const contagem = {};
  for (const l of est.doc.ligacoes) {
    const de = acharNo(l.de);
    if (!de) continue;
    const m = midiaDe(de);
    const tipo = de.trecho && de.fc ? "video" : m && m.tipo;
    if (tipo !== "imagem" && tipo !== "video") continue;
    const c = contagem[l.para] || (contagem[l.para] = { imagem: 0, video: 0 });
    numeros[l.id] = `${tipo === "video" ? "🎬 vídeo" : "🖼 imagem"} ${++c[tipo]}`;
  }
  for (const l of est.doc.ligacoes) {
    if (!ids.has(l.de) || !ids.has(l.para)) continue;
    const de = acharNo(l.de), para = acharNo(l.para);
    const a = pontaSaida(de), b = pontaEntrada(para);
    const tipo = tipoFio(de);
    const d = curva(a, b);
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", d);
    p.setAttribute("class", `fio ${tipo}${est.sel.has(l.id) ? " sel" : ""}`);
    const alvo = document.createElementNS("http://www.w3.org/2000/svg", "path");
    alvo.setAttribute("d", d);
    alvo.setAttribute("class", "alvo");
    alvo.dataset.fio = l.id;
    svg.insertBefore(p, temp);
    svg.insertBefore(alvo, temp);
    vivos.add(l.id);
    let r = rotulos.querySelector(`[data-fio="${l.id}"]`);
    if (!r) { r = document.createElement("div"); r.dataset.fio = l.id; rotulos.appendChild(r); }
    const pm = meio(a, b);
    r.style.left = `${pm.x}px`;
    r.style.top = `${pm.y}px`;
    if (est.editandoRotulo === l.id) continue;
    r.className = `rotulo ${tipo}${l.texto ? "" : " vazio"}${est.sel.has(l.id) ? " sel" : ""}`;
    const num = numeros[l.id];
    r.textContent = (num ? `${num} · ` : "") + (l.texto || (num ? "＋ instrução" : "＋ o que gerar?"));
    r.title = "Clique para escrever o que gerar com esta ligação";
  }
  for (const r of [...rotulos.children]) if (!vivos.has(r.dataset.fio)) r.remove();
}

// ---------------------------------------------------------------------------------------------
// Vista (pan e zoom)
// ---------------------------------------------------------------------------------------------

function aplicarVista() {
  const v = est.vista;
  $("#mundo").style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.z})`;
  const palco = $("#palco");
  const g = 22 * v.z;
  palco.style.backgroundSize = `${g}px ${g}px`;
  palco.style.backgroundPosition = `${v.x}px ${v.y}px`;
  $("#zoom").textContent = `${Math.round(v.z * 100)}%`;
}

let timerVista;
function guardarVista() {
  clearTimeout(timerVista);
  timerVista = setTimeout(() => gravarLocal(`vista:${est.proj}:${est.cena}`, JSON.stringify(est.vista)), 300);
}

function restaurarVista() {
  try {
    const v = JSON.parse(lerLocal(`vista:${est.proj}:${est.cena}`) || "null");
    if (v && isFinite(v.z)) { est.vista = v; return; }
  } catch {}
  est.vista = { x: 60, y: 40, z: 1 };
  requestAnimationFrame(enquadrar);
}

function enquadrar() {
  const nos = nosDaCena();
  const palco = $("#palco").getBoundingClientRect();
  if (!nos.length) { est.vista = { x: 60, y: 40, z: 1 }; aplicarVista(); return; }
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const n of nos) {
    const el = $(`.no[data-id="${n.id}"]`);
    const h = el ? el.offsetHeight : 260;
    x0 = Math.min(x0, n.x); y0 = Math.min(y0, n.y); x1 = Math.max(x1, n.x + LARGURA[n.tipo]); y1 = Math.max(y1, n.y + h);
  }
  const z = Math.min(1.2, Math.max(0.25, Math.min((palco.width - 120) / (x1 - x0), (palco.height - 140) / (y1 - y0))));
  est.vista = { z, x: (palco.width - (x1 - x0) * z) / 2 - x0 * z, y: (palco.height - 60 - (y1 - y0) * z) / 2 - y0 * z };
  aplicarVista();
  guardarVista();
}

function paraMundo(cx, cy) {
  const r = $("#palco").getBoundingClientRect();
  return { x: (cx - r.left - est.vista.x) / est.vista.z, y: (cy - r.top - est.vista.y) / est.vista.z };
}

function centroVista() {
  const r = $("#palco").getBoundingClientRect();
  return paraMundo(r.left + r.width / 2, r.top + r.height / 2);
}

$("#palco").addEventListener("wheel", (e) => {
  const ta = e.target.closest && e.target.closest("textarea");
  if (ta && !e.ctrlKey && ta.scrollHeight > ta.clientHeight) return; // rolar o texto do nó, sem zoom
  e.preventDefault();
  if (e.deltaMode === 1) { e = { ctrlKey: e.ctrlKey, deltaX: e.deltaX * 16, deltaY: e.deltaY * 16, deltaMode: 0, clientX: e.clientX, clientY: e.clientY }; }
  const r = $("#palco").getBoundingClientRect();
  const v = est.vista;
  if (!e.ctrlKey && Math.abs(e.deltaX) > Math.abs(e.deltaY) * 0.8 && e.deltaMode === 0) {
    v.x -= e.deltaX; v.y -= e.deltaY; // trackpad: rolar de lado move
  } else {
    const z = Math.min(2.5, Math.max(0.2, v.z * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015))));
    const px = e.clientX - r.left, py = e.clientY - r.top;
    v.x = px - ((px - v.x) * z) / v.z;
    v.y = py - ((py - v.y) * z) / v.z;
    v.z = z;
  }
  aplicarVista();
  guardarVista();
}, { passive: false });

// ---------------------------------------------------------------------------------------------
// Ponteiro: mover fundo, arrastar nós, puxar fios
// ---------------------------------------------------------------------------------------------

let gesto = null;

$("#palco").addEventListener("pointerdown", (e) => {
  fecharMenu();
  if (e.button !== 0 && e.button !== 1) return;
  const porta = e.target.closest(".porta.saida");
  const no = e.target.closest(".no");
  const fio = e.target.closest("[data-fio]");
  if (porta && no) {
    e.preventDefault();
    gesto = { tipo: "fio", de: no.dataset.id };
    $("#palco").setPointerCapture(e.pointerId);
    return;
  }
  if (fio && !e.target.closest("textarea")) {
    selecionar(fio.dataset.fio, e.shiftKey);
    if (fio.classList.contains("rotulo")) editarRotulo(fio.dataset.fio);
    return;
  }
  if (no) {
    if (e.target.closest("input, textarea, select, button, video[controls]")) return;
    const id = no.dataset.id;
    if (!est.sel.has(id) || e.shiftKey) selecionar(id, e.shiftKey);
    const inicio = paraMundo(e.clientX, e.clientY);
    gesto = { tipo: "nos", inicio, movido: false, nos: [...est.sel].map(acharNo).filter(Boolean).map((n) => ({ n, x: n.x, y: n.y })) };
    $("#palco").setPointerCapture(e.pointerId);
    return;
  }
  if (e.shiftKey && e.button === 0) {
    gesto = { tipo: "caixa", cx: e.clientX, cy: e.clientY, antes: new Set(est.sel) };
    const c = document.createElement("div");
    c.id = "caixa";
    document.body.appendChild(c);
    $("#palco").setPointerCapture(e.pointerId);
    return;
  }
  gesto = { tipo: "fundo", cx: e.clientX, cy: e.clientY, vx: est.vista.x, vy: est.vista.y, movido: false };
  $("#palco").setPointerCapture(e.pointerId);
});

$("#palco").addEventListener("pointermove", (e) => {
  if (!gesto) return;
  if (gesto.tipo === "fundo") {
    const dx = e.clientX - gesto.cx, dy = e.clientY - gesto.cy;
    if (Math.abs(dx) + Math.abs(dy) > 3) { gesto.movido = true; $("#palco").classList.add("movendo"); }
    est.vista.x = gesto.vx + dx; est.vista.y = gesto.vy + dy;
    aplicarVista();
  } else if (gesto.tipo === "caixa") {
    const x1 = Math.min(gesto.cx, e.clientX), y1 = Math.min(gesto.cy, e.clientY), x2 = Math.max(gesto.cx, e.clientX), y2 = Math.max(gesto.cy, e.clientY);
    Object.assign($("#caixa").style, { left: `${x1}px`, top: `${y1}px`, width: `${x2 - x1}px`, height: `${y2 - y1}px` });
    const sel = new Set(gesto.antes);
    document.querySelectorAll("#camada-nos .no").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.left < x2 && r.right > x1 && r.top < y2 && r.bottom > y1) sel.add(el.dataset.id);
    });
    est.sel = sel;
    desenharNos();
  } else if (gesto.tipo === "nos") {
    const p = paraMundo(e.clientX, e.clientY);
    const dx = p.x - gesto.inicio.x, dy = p.y - gesto.inicio.y;
    if (Math.abs(dx) + Math.abs(dy) > 2) gesto.movido = true;
    for (const it of gesto.nos) {
      it.n.x = Math.round(it.x + dx); it.n.y = Math.round(it.y + dy);
      const el = $(`.no[data-id="${it.n.id}"]`);
      if (el) { el.style.left = `${it.n.x}px`; el.style.top = `${it.n.y}px`; }
    }
    desenharFios();
    if (linha.aberta) mostrarAlvo(sobreLinha(e.clientX, e.clientY) ? e.clientX : null);
  } else if (gesto.tipo === "fio") {
    const de = acharNo(gesto.de);
    const p = paraMundo(e.clientX, e.clientY);
    $("#fio-temp").setAttribute("d", curva(pontaSaida(de), p));
    document.querySelectorAll(".no.alvo-fio").forEach((x) => x.classList.remove("alvo-fio"));
    const alvo = document.elementFromPoint(e.clientX, e.clientY);
    const noAlvo = alvo && alvo.closest(".no.gerar");
    if (noAlvo && noAlvo.dataset.id !== gesto.de) noAlvo.classList.add("alvo-fio");
  }
});

$("#palco").addEventListener("pointerup", async (e) => {
  const g = gesto;
  gesto = null;
  $("#palco").classList.remove("movendo");
  if (!g) return;
  if (g.tipo === "caixa") { const c = $("#caixa"); if (c) c.remove(); desenharFios(); return; }
  if (g.tipo === "fundo") {
    guardarVista();
    if (!g.movido) { est.sel.clear(); desenharNos(); desenharFios(); }
  } else if (g.tipo === "nos" && g.movido && sobreLinha(e.clientX, e.clientY)) {
    // soltou o nó em cima da timeline: volta para o lugar e vai para o FilmCraft naquele tempo
    mostrarAlvo(null);
    for (const it of g.nos) { it.n.x = it.x; it.n.y = it.y; }
    desenharNos(); desenharFios();
    const t = tempoNaLinha(e.clientX);
    for (const it of g.nos) if (midiaDe(it.n)) await colocarNaLinha({ no: it.n.id }, t);
  } else if (g.tipo === "nos" && g.movido) {
    ops([{ op: "mover", nos: g.nos.map((it) => ({ id: it.n.id, x: it.n.x, y: it.n.y })) }], true).catch(() => {});
  } else if (g.tipo === "fio") {
    $("#fio-temp").setAttribute("d", "");
    document.querySelectorAll(".no.alvo-fio").forEach((x) => x.classList.remove("alvo-fio"));
    const alvo = document.elementFromPoint(e.clientX, e.clientY);
    const noEl = alvo && alvo.closest(".no");
    const de = acharNo(g.de);
    try {
      if (noEl) {
        if (noEl.dataset.id === g.de) return;
        const para = acharNo(noEl.dataset.id);
        if (para.tipo !== "gerar") return aviso("O fio precisa terminar num nó Gerar. Solte no vazio para criar um.", true);
        const r = await ops([{ op: "ligar", de: g.de, para: para.id, ref: "f" }]);
        editarRotulo(r.refs.f);
      } else if (alvo && alvo.closest("#palco")) {
        const p = paraMundo(e.clientX, e.clientY);
        const saida = tipoFio(de) === "video" && de.tipo !== "gerar" ? "video" : de.tipo === "gerar" ? "video" : "imagem";
        const r = await ops([
          { op: "no", ref: "g", cena: est.cena, tipo: "gerar", saida, x: Math.round(p.x), y: Math.round(p.y - PORTA_Y) },
          { op: "ligar", de: g.de, para: "g", ref: "f" },
        ]);
        selecionar(r.refs.g);
        editarRotulo(r.refs.f);
      }
    } catch {}
  }
});

$("#palco").addEventListener("dblclick", (e) => {
  if (e.target.closest(".no, .rotulo")) return;
  abrirMenu(e.clientX, e.clientY);
});

function selecionar(id, somar) {
  if (!somar) est.sel.clear();
  if (somar && est.sel.has(id)) est.sel.delete(id); else est.sel.add(id);
  desenharNos();
  desenharFios();
}

// ---------------------------------------------------------------------------------------------
// Texto no fio
// ---------------------------------------------------------------------------------------------

function editarRotulo(id) {
  const r = $(`#camada-rotulos [data-fio="${id}"]`) || (desenharFios(), $(`#camada-rotulos [data-fio="${id}"]`));
  if (!r || r.querySelector("textarea")) return;
  const l = est.doc.ligacoes.find((x) => x.id === id);
  est.editandoRotulo = id;
  r.classList.remove("vazio");
  r.innerHTML = `<textarea placeholder="ex.: usar essa pessoa neste cenário, plano médio, luz de fim de tarde">${esc(l ? l.texto : "")}</textarea>`;
  const ta = r.querySelector("textarea");
  ta.focus();
  ta.setSelectionRange(ta.value.length, ta.value.length);
  let feito = false;
  const fechar = async (salvar) => {
    if (feito) return;
    feito = true;
    est.editandoRotulo = null;
    if (salvar && l && ta.value !== l.texto) await ops([{ op: "texto_ligacao", id, texto: ta.value }]).catch(() => {});
    else desenharFios();
  };
  ta.addEventListener("keydown", (e) => {
    e.stopPropagation();
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); fechar(true); }
    if (e.key === "Escape") fechar(false);
  });
  ta.addEventListener("blur", () => fechar(true));
}

// ---------------------------------------------------------------------------------------------
// Campos e botões dentro dos nós
// ---------------------------------------------------------------------------------------------

const timersCampo = new Map();
function campoMudou(el, imediato) {
  const no = el.closest(".no");
  if (!no) return;
  const id = no.dataset.id, campo = el.dataset.campo;
  let valor = el.value;
  if (campo === "duracao") valor = Number(valor) || 5;
  const k = `${id}:${campo}`;
  clearTimeout(timersCampo.get(k));
  const enviar = () => {
    timersCampo.delete(k);
    const n = acharNo(id);
    if (n) n[campo] = valor;
    postar("/api/ops", { ops: [{ op: "no", id, [campo]: valor }] }).catch((e) => aviso(e.message, true));
  };
  enviarPendentes.set(k, enviar);
  if (imediato) enviar(); else timersCampo.set(k, setTimeout(enviar, 500));
}
const enviarPendentes = new Map();
function enviarTudoPendente() {
  for (const [k, t] of timersCampo) { clearTimeout(t); const f = enviarPendentes.get(k); if (f) f(); }
}

$("#camada-nos").addEventListener("input", (e) => { if (e.target.dataset.campo && e.target.tagName !== "SELECT") campoMudou(e.target, false); });
$("#camada-nos").addEventListener("change", (e) => { if (e.target.dataset.campo) campoMudou(e.target, true); });
$("#camada-nos").addEventListener("keydown", (e) => { if (e.target.matches("input.titulo") && e.key === "Enter") e.target.blur(); });

$("#camada-nos").addEventListener("click", async (e) => {
  const ver = e.target.closest("[data-ver]");
  const btn = e.target.closest("[data-acao]");
  const el = e.target.closest(".no");
  if (!el) return;
  const no = acharNo(el.dataset.id);
  if (ver && !btn) return abrirVisor(est.doc.midias[ver.dataset.ver]);
  if (!btn || !no) return;
  const a = btn.dataset.acao;
  try {
    if (a === "remover") {
      if (no.tipo === "gerar" && no.versoes.length && !confirm("Apagar este nó? Os arquivos gerados continuam na biblioteca.")) return;
      await ops([{ op: "remover", id: no.id }]);
    } else if (a === "saida-imagem" || a === "saida-video") {
      await ops([{ op: "no", id: no.id, saida: a === "saida-video" ? "video" : "imagem", modelo: "" }]);
    } else if (a === "versao-ant" || a === "versao-prox") {
      const i = no.versoes.indexOf(no.atual) + (a === "versao-prox" ? 1 : -1);
      if (no.versoes[i]) await ops([{ op: "versao", no: no.id, midia: no.versoes[i] }]);
    } else if (a === "gerar") {
      enviarTudoPendente();
      document.activeElement && document.activeElement.blur();
      await new Promise((r) => setTimeout(r, 50));
      const campos = {};
      el.querySelectorAll("[data-campo]").forEach((c) => { campos[c.dataset.campo] = c.dataset.campo === "duracao" ? Number(c.value) || 5 : c.value; });
      await postar("/api/ops", { ops: [{ op: "no", id: no.id, ...campos }] });
      if (est.cfg && est.cfg.motor === "manual") {
        if (!(await copiarPrompt(no, true))) return;
        await postar("/api/esperar", { no: no.id });
        return carregarDoc();
      }
      if (!(await nuvemPronta(no))) return;
      btn.disabled = true;
      const r = await postar("/api/gerar", { no: no.id });
      const x = r.resultados && r.resultados[0];
      if (x && x.erro) aviso(x.erro, true);
      await carregarDoc();
    } else if (a === "trecho") {
      await ops([{ op: "no", id: no.id, trecho: !no.trecho }]);
    } else if (a === "copiar") {
      await copiarPrompt(no, false);
    } else if (a === "substituir") {
      await substituirClipe(no);
    } else if (a === "cancelar-espera") {
      await postar("/api/esperar", { no: no.id, cancelar: true });
      await carregarDoc();
    } else if (a === "timeline") {
      await colocarNaLinha({ no: no.id });
    } else if (a === "enviar-filmcraft" || a === "enviar-effectcraft") {
      const app = a.replace("enviar-", "");
      aviso(`Enviando para o ${app === "filmcraft" ? "FilmCraft" : "EffectCraft"}…`);
      const r = await postar("/api/enviar", { nos: [no.id], app });
      aviso(r.texto);
      await carregarDoc();
    }
  } catch (err) { aviso(err.message, true); btn.disabled = false; }
});

async function copiarPrompt(no, manual) {
  // modo manual: monta a pasta primeiro (o vídeo base só vira "vídeo 1" depois de exportado)
  let pacote = null;
  if (manual) {
    aviso("Preparando o vídeo e as imagens numerados…", false, 6000);
    try { pacote = await postar("/api/pacote", { no: no.id }); } catch (e) { aviso(`Não consegui montar a pasta: ${e.message}`, true, 12000); }
  }
  const r = pacote ? { prompt: pacote.prompt, arquivos: pacote.arquivos } : await pegar(`/api/prompt?no=${no.id}`);
  if (!r.prompt.trim()) { aviso("Escreva no fio (ou na instrução extra) o que gerar.", true); return false; }
  try { await navigator.clipboard.writeText(r.prompt); } catch { prompt("Copie o prompt:", r.prompt); }
  const refs = r.arquivos.length ? `\nReferências (na ordem): ${r.arquivos.map((a) => a.split(/[\\/]/).pop()).join(", ")}` : "";
  aviso(pacote
    ? `Prompt copiado e pasta aberta (${pacote.arquivos.join(", ")}). No ArtCraft: cole o prompt, arraste esses arquivos, gere e baixe o resultado. Eu puxo o arquivo novo sozinho.`
    : `${manual ? "Prompt copiado. No ArtCraft: cole, anexe as referências, gere e baixe o resultado. Eu puxo o arquivo novo sozinho." : "Prompt copiado."}${refs}`, false, 14000);
  return true;
}

// Clipes da timeline de onde um nó veio (seguindo os fios para trás).
function origemTimeline(no) {
  const vistos = new Set(), achados = [];
  const fila = [no.id];
  while (fila.length) {
    const id = fila.shift();
    if (vistos.has(id)) continue;
    vistos.add(id);
    const n = acharNo(id);
    if (n && n.fc && n.id !== no.id) achados.push({ ...n.fc, nome: n.titulo });
    for (const l of est.doc.ligacoes) if (l.para === id) fila.push(l.de);
  }
  return achados;
}

// Resultado novo num nó que veio da timeline: pergunta se troca o clipe original.
function oferecerTroca(no) {
  const o = origemTimeline(no)[0];
  if (!o) return;
  const d = document.createElement("div");
  d.className = "aviso pergunta";
  d.innerHTML = `<div>Versão ${no.versoes.indexOf(no.atual) + 1} de <b>${esc(no.titulo || "Gerar")}</b> pronta. Substituir o clipe <b>${esc(o.nome || "")}</b> na timeline do FilmCraft?</div><div class="acoes"><button class="btn primario" data-sim>Substituir</button><button class="btn" data-nao>Agora não</button></div>`;
  $("#avisos").appendChild(d);
  d.querySelector("[data-nao]").onclick = () => d.remove();
  d.querySelector("[data-sim]").onclick = async () => { d.remove(); await substituirClipe(no); };
}
async function substituirClipe(no) {
  aviso("Trocando o clipe na timeline…");
  try {
    const r = await postar("/api/filmcraft/substituir", { no: no.id });
    aviso(r.texto, false, 9000);
    await carregarDoc();
    if (linha.aberta) { linha.assinatura = ""; buscarLinha(); }
  } catch (err) { aviso(err.message, true); }
}

// ---------------------------------------------------------------------------------------------
// Arquivos: arrastar, colar, escolher
// ---------------------------------------------------------------------------------------------

let posNovo = null;

async function criarMidias(arquivos, ponto) {
  const p = ponto || centroVista();
  const lista = [...arquivos].filter((f) => /^(image|video)\//.test(f.type) || /\.(png|jpe?g|webp|gif|bmp|mp4|mov|webm|mkv|m4v)$/i.test(f.name));
  if (!lista.length) return aviso("Só imagens e vídeos.", true);
  const acoes = [];
  for (let i = 0; i < lista.length; i++) {
    try {
      aviso(`Enviando ${lista[i].name || "imagem"}…`, false, 1500);
      const r = await subir(lista[i]);
      const nome = (lista[i].name || "").replace(/\.[^.]+$/, "");
      acoes.push({ op: "no", cena: est.cena, tipo: "midia", midia: r.midia, titulo: nome === "image" ? "" : nome, x: Math.round(p.x - 120 + i * 270), y: Math.round(p.y - 120) });
    } catch (e) { aviso(e.message, true); }
  }
  if (acoes.length) await ops(acoes);
}

const palco = $("#palco");
palco.addEventListener("dragover", (e) => {
  e.preventDefault();
  document.querySelectorAll(".no.arrastando-arquivo").forEach((x) => x.classList.remove("arrastando-arquivo"));
  const no = e.target.closest && e.target.closest(".no.gerar");
  if (no && e.dataTransfer.types.includes("Files")) no.classList.add("arrastando-arquivo");
});
palco.addEventListener("dragleave", (e) => { if (e.target === palco) document.querySelectorAll(".no.arrastando-arquivo").forEach((x) => x.classList.remove("arrastando-arquivo")); });
palco.addEventListener("drop", async (e) => {
  e.preventDefault();
  document.querySelectorAll(".no.arrastando-arquivo").forEach((x) => x.classList.remove("arrastando-arquivo"));
  const p = paraMundo(e.clientX, e.clientY);
  const midia = e.dataTransfer.getData("application/x-midia");
  const clipeFc = e.dataTransfer.getData("application/x-clipe-fc");
  if (clipeFc) return trazerClipe(Number(clipeFc), { x: p.x, y: p.y });
  const noGerar = e.target.closest && e.target.closest(".no.gerar");
  try {
    if (midia) {
      if (noGerar) return ops([{ op: "no", id: noGerar.dataset.id, midia }]);
      const m = est.doc.midias[midia];
      return ops([{ op: "no", cena: est.cena, tipo: "midia", midia, titulo: m ? m.arquivo.replace(/\.[^.]+$/, "") : "", x: Math.round(p.x), y: Math.round(p.y) }]);
    }
    if (!e.dataTransfer.files.length) return;
    if (noGerar) {
      await subir(e.dataTransfer.files[0], `&no=${noGerar.dataset.id}`);
      aviso("Nova versão adicionada.");
      return carregarDoc();
    }
    await criarMidias(e.dataTransfer.files, p);
  } catch (err) { aviso(err.message, true); }
});

$("#lista-midia").addEventListener("dragstart", (e) => {
  const it = e.target.closest("[data-midia]");
  if (it) e.dataTransfer.setData("application/x-midia", it.dataset.midia);
});
$("#lista-midia").addEventListener("dblclick", (e) => {
  const it = e.target.closest("[data-midia]");
  if (it) abrirVisor(est.doc.midias[it.dataset.midia]);
});

document.addEventListener("paste", (e) => {
  if (e.target.closest && e.target.closest("input, textarea, select, dialog")) return;
  const arquivos = [...(e.clipboardData ? e.clipboardData.files : [])];
  if (arquivos.length) { e.preventDefault(); criarMidias(arquivos); return; }
  const texto = e.clipboardData ? e.clipboardData.getData("text/plain") : "";
  // os nós copiados aqui mesmo: o texto no sistema é só uma marca
  if (areaNos && (texto.startsWith(MARCA_NOS) || !texto)) { e.preventDefault(); colarNos(); return; }
  if (texto.trim()) {
    e.preventDefault();
    const p = centroVista();
    const caminho = texto.trim().replace(/^"|"$/g, "");
    if (/^([a-zA-Z]:\\|\/).+\.(png|jpe?g|webp|gif|bmp|mp4|mov|webm|mkv|m4v)$/i.test(caminho)) {
      ops([{ op: "no", cena: est.cena, tipo: "midia", arquivo: caminho, x: Math.round(p.x - 120), y: Math.round(p.y - 60) }]).catch(() => {});
    } else {
      ops([{ op: "no", cena: est.cena, tipo: "nota", texto: texto.slice(0, 5000), x: Math.round(p.x - 120), y: Math.round(p.y - 60) }]).catch(() => {});
    }
  }
});

$("#arquivo").addEventListener("change", async (e) => {
  await criarMidias(e.target.files, posNovo);
  posNovo = null;
  e.target.value = "";
});

// ---------------------------------------------------------------------------------------------
// Criar nós (barra e menu de duplo clique)
// ---------------------------------------------------------------------------------------------

async function novo(tipo, ponto) {
  const p = ponto || centroVista();
  const base = { op: "no", ref: "n", cena: est.cena, x: Math.round(p.x - 120), y: Math.round(p.y - 60) };
  if (tipo === "imagem") { posNovo = ponto || null; return $("#arquivo").click(); }
  const op = tipo === "nota" ? { ...base, tipo: "nota" } : { ...base, tipo: "gerar", saida: tipo === "gerar-video" ? "video" : "imagem" };
  const r = await ops([op]);
  selecionar(r.refs.n);
  const el = $(`.no[data-id="${r.refs.n}"] ${tipo === "nota" ? "textarea" : ".titulo"}`);
  if (el) el.focus();
}

$("#ferramentas").addEventListener("click", (e) => {
  const b = e.target.closest("[data-novo]");
  if (b) novo(b.dataset.novo).catch(() => {});
});
$("#centralizar").addEventListener("click", enquadrar);

function abrirMenu(cx, cy) {
  const menu = $("#menu-rapido");
  const p = paraMundo(cx, cy);
  menu.innerHTML = `<button data-n="imagem">🖼 Mídia do computador</button><button data-n="nota">✎ Nota</button><button data-n="gerar-imagem">✦ Gerar foto</button><button data-n="gerar-video">▶ Gerar vídeo</button>`;
  menu.style.left = `${cx}px`;
  menu.style.top = `${cy}px`;
  menu.hidden = false;
  menu.onclick = (e) => {
    const b = e.target.closest("[data-n]");
    if (!b) return;
    fecharMenu();
    novo(b.dataset.n, { x: p.x + 120, y: p.y + 60 }).catch(() => {});
  };
}
function fecharMenu() { $("#menu-rapido").hidden = true; }
document.addEventListener("pointerdown", (e) => { if (!e.target.closest("#menu-rapido")) fecharMenu(); }, true);

// ---------------------------------------------------------------------------------------------
// Teclado
// ---------------------------------------------------------------------------------------------

document.addEventListener("keydown", async (e) => {
  if (e.target.closest && e.target.closest("input, textarea, select, dialog")) return;
  if (!$("#visor").hidden && e.key !== "Escape") return; // visor aberto: os atalhos não valem atrás dele
  if (e.repeat && !["ArrowLeft", "ArrowRight"].includes(e.key)) return; // segurar a tecla não cria dezenas de nós
  const ctrl = e.ctrlKey || e.metaKey;
  const k = e.key.toLowerCase();
  if (e.key === "Escape") { fecharVisor(); fecharMenu(); fecharProjetosFc(); est.sel.clear(); desenharNos(); desenharFios(); return; }
  if ((e.key === "Delete" || e.key === "Backspace") && est.sel.size) {
    e.preventDefault();
    const ids = [...est.sel];
    const temResultado = ids.some((id) => { const n = acharNo(id); return n && n.tipo === "gerar" && n.versoes.length; });
    if (temResultado && !confirm(`Apagar ${ids.length} item(ns)? Os arquivos gerados continuam na biblioteca.`)) return;
    est.sel.clear();
    await ops(ids.map((id) => ({ op: "remover", id }))).catch(() => {});
    return;
  }
  if (ctrl) {
    if (k === "z" && !e.shiftKey) { e.preventDefault(); return voltar(false); }
    if (k === "y" || (k === "z" && e.shiftKey)) { e.preventDefault(); return voltar(true); }
    if (k === "c" && est.sel.size) { e.preventDefault(); return copiarNos(); }
    if (k === "d" && est.sel.size) { e.preventDefault(); copiarNos(true); return colarNos(); }
    if (k === "a") { e.preventDefault(); est.sel = new Set(est.doc.nos.filter((n) => n.cena === est.cena).map((n) => n.id)); desenharNos(); desenharFios(); return; }
    if (k === "i") { e.preventDefault(); return novo("imagem").catch(() => {}); }
    if (e.key === "Enter") { e.preventDefault(); return gerarSelecionados(); }
    return;
  }
  if (e.altKey) return;
  if (linha.aberta && linha.dados && linha.dados.sequencia && ["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
    e.preventDefault();
    const s = linha.dados.sequencia;
    const passo = e.shiftKey ? 1 : 1 / (s.fps || 24);
    const t = e.key === "Home" ? 0 : e.key === "End" ? s.duracao : s.playhead + (e.key === "ArrowLeft" ? -passo : passo);
    return irPara(Math.max(0, Math.min(s.duracao, t)));
  }
  if (e.key === "?") { e.preventDefault(); return alternarGuia(); }
  if (k === "f") enquadrar();
  if (k === "n") novo("nota").catch(() => {});
  if (k === "g") novo("gerar-imagem").catch(() => {});
  if (k === "v") novo("gerar-video").catch(() => {});
  if (k === "i") novo("imagem").catch(() => {});
  if (k === "t") alternarLinha(!linha.aberta);
  if (k === "p") {
    const nos = [...est.sel].map(acharNo).filter((n) => n && midiaDe(n));
    if (!nos.length) return aviso("Selecione um nó com foto ou vídeo pronto.", true);
    for (const n of nos) await colocarNaLinha({ no: n.id });
  }
});

// Antes de gerar vídeo: se não há onde gerar (sem conta do Kaggle, ou ComfyUI desligado), pede só
// o usuário e o token do Kaggle numa janelinha e já liga a nuvem grátis.
async function nuvemPronta(no) {
  const c = est.cfg || {};
  if (no.saida !== "video") return true;
  if (c.motor === "kaggle" && c.kaggle) return true;
  if (!["kaggle", "comfy"].includes(c.motor)) return true;
  if (c.motor === "comfy") { try { if ((await pegar("/api/comfy")).ligado) return true; } catch {} }
  const d = $("#dlg-nuvem"), f = d.querySelector("form");
  f.usuario.value = c.kaggle || ""; f.token.value = ""; $("#nuvem-erro").textContent = "";
  for (;;) {
    d.returnValue = "";
    d.showModal();
    await new Promise((ok) => d.addEventListener("close", ok, { once: true }));
    if (d.returnValue !== "ok") return false;
    const usuario = f.usuario.value.trim().replace(/^@/, "").replace(/^.*kaggle\.com\//i, "").replace(/[/?#].*$/, "");
    const token = f.token.value.trim();
    if (!usuario || !token) { $("#nuvem-erro").textContent = "Preencha os dois campos."; continue; }
    try {
      await postar("/api/config", { motor: "kaggle", kaggle: { username: usuario, key: token } });
      est.cfg = await pegar("/api/config");
      desenhar();
      aviso("Nuvem grátis ligada. Gerando…");
      return true;
    } catch (err) { $("#nuvem-erro").textContent = err.message; }
  }
}
$("#nuvem-cancelar").addEventListener("click", () => $("#dlg-nuvem").close(""));

async function voltar(refazer) {
  try {
    const r = await postar(refazer ? "/api/refazer" : "/api/desfazer");
    if (!r.ok) aviso(refazer ? "Nada para refazer." : "Nada para desfazer.");
    await carregarDoc();
    if (!est.doc.cenas.some((c) => c.id === est.cena)) trocarCena(est.doc.cenas[0].id);
  } catch (err) { aviso(err.message, true); }
}

async function gerarSelecionados() {
  const ids = [...est.sel].filter((id) => { const n = acharNo(id); return n && n.tipo === "gerar" && n.estado !== "gerando"; });
  if (!ids.length) return aviso("Selecione um ou mais nós Gerar.", true);
  if (est.cfg && est.cfg.motor === "manual") return aviso("No modo Manual, use o botão Gerar de cada nó (ele copia o prompt).", true);
  try {
    const r = await postar("/api/gerar", { nos: ids });
    for (const x of r.resultados || []) if (x.erro) aviso(`${x.no}: ${x.erro}`, true);
    await carregarDoc();
  } catch (err) { aviso(err.message, true); }
}

// Copiar / colar nós (com os fios entre eles). Vale entre cenas e entre projetos abertos no mesmo navegador.
let areaNos = null;
const MARCA_NOS = "quadro-artcraft-nos:";
function copiarNos(semSistema) {
  const ids = new Set([...est.sel].filter((id) => acharNo(id)));
  const nos = est.doc.nos.filter((n) => ids.has(n.id)).map((n) => JSON.parse(JSON.stringify(n)));
  const ligs = est.doc.ligacoes.filter((l) => ids.has(l.de) && ids.has(l.para)).map((l) => ({ ...l }));
  areaNos = { proj: est.proj, nos, ligs, vezes: 0 };
  if (!semSistema) {
    try { navigator.clipboard.writeText(MARCA_NOS + nos.length).catch(() => {}); } catch {}
    aviso(`${nos.length} nó(s) copiado(s).`);
  }
}
async function colarNos() {
  if (!areaNos || !areaNos.nos.length) return;
  areaNos.vezes++;
  const d = 40 * areaNos.vezes;
  const mesmoProj = areaNos.proj === est.proj;
  const lista = [];
  for (const n of areaNos.nos) {
    const op = { op: "no", ref: `r_${n.id}`, cena: est.cena, tipo: n.tipo, titulo: n.titulo, x: n.x + d, y: n.y + d };
    for (const c of ["texto", "prompt", "saida", "modelo", "proporcao", "duracao", "w", "cor"]) if (n[c] !== undefined && n[c] !== null) op[c] = n[c];
    const m = n.tipo === "gerar" ? n.atual : n.midia;
    if (m && mesmoProj && est.doc.midias[m]) op.midia = m;
    lista.push(op);
  }
  for (const l of areaNos.ligs) lista.push({ op: "ligar", de: `r_${l.de}`, para: `r_${l.para}`, texto: l.texto || "" });
  try {
    const r = await ops(lista);
    est.sel = new Set(areaNos.nos.map((n) => r.refs[`r_${n.id}`]).filter(Boolean));
    desenharNos(); desenharFios();
  } catch {}
}

// ---------------------------------------------------------------------------------------------
// Cenas, projetos, envio da cena, configuração
// ---------------------------------------------------------------------------------------------

$("#cenas").addEventListener("click", async (e) => {
  const b = e.target.closest("[data-cena]");
  if (!b) return;
  if (b.dataset.cena === "+") {
    const n = est.doc.cenas.length + 1;
    const nome = prompt("Nome da cena:", `Cena ${n}`);
    if (!nome) return;
    const r = await ops([{ op: "cena", nome, ref: "c" }]);
    trocarCena(r.refs.c);
    return;
  }
  trocarCena(b.dataset.cena);
});
$("#cenas").addEventListener("dblclick", async (e) => {
  const b = e.target.closest("[data-cena]");
  if (!b || b.dataset.cena === "+") return;
  const c = est.doc.cenas.find((x) => x.id === b.dataset.cena);
  const nome = prompt("Renomear cena (deixe vazio para apagar a cena):", c.nome);
  if (nome === null) return;
  if (nome.trim() === "") {
    if (confirm(`Apagar "${c.nome}" e todos os nós dela? Os arquivos continuam na biblioteca.`)) await ops([{ op: "remover_cena", id: c.id }]);
    return;
  }
  await ops([{ op: "cena", id: c.id, nome }]);
});

function trocarCena(id) {
  est.cena = id;
  est.sel.clear();
  gravarLocal(`cena:${est.proj}`, id);
  $("#camada-nos").innerHTML = "";
  $("#camada-rotulos").innerHTML = "";
  restaurarVista();
  desenhar();
}

$("#projeto").addEventListener("change", async (e) => {
  let nome = e.target.value;
  if (nome === "+") {
    nome = prompt("Nome do novo projeto (ex.: Clipe Badauê):");
    if (!nome) { desenharTopo(); return; }
  }
  const r = await postar("/api/projetos", { nome });
  location.search = `?p=${encodeURIComponent(r.ativo)}`;
});

async function enviarCena(app) {
  const nome = app === "filmcraft" ? "FilmCraft" : "EffectCraft";
  const cena = est.doc.cenas.find((c) => c.id === est.cena);
  aviso(`Enviando "${cena.nome}" para o ${nome}…`);
  try {
    const r = await postar("/api/enviar", { cena: est.cena, app });
    aviso(r.texto);
    await carregarDoc();
  } catch (e) { aviso(e.message, true); }
}
$("#enviar-film").addEventListener("click", () => enviarCena("filmcraft"));
$("#enviar-effect").addEventListener("click", () => enviarCena("effectcraft"));

$("#motor").addEventListener("click", () => {
  const d = $("#dlg-config");
  const f = d.querySelector("form");
  f.motor.value = est.cfg.motor;
  f.artcraftKey.value = "";
  f.falKey.value = "";
  f.comfyUrl.value = est.cfg.comfyUrl || "";
  f.kaggleUser.value = est.cfg.kaggle || "";
  f.kaggleToken.value = "";
  f.kaggleToken.placeholder = est.cfg.kaggle ? "•••••• (configurado)" : "KGAT_…";
  mostrarSecoes();
  verificarComfy();
  verificarKaggle();
  f.artcraftKey.placeholder = est.cfg.artcraft ? "•••••• (configurada)" : "artcraft_api_…";
  f.falKey.placeholder = est.cfg.fal ? "•••••• (configurada)" : "…";
  $("#cfg-pasta").textContent = est.cfg.pasta;
  f.github.value = est.cfg.github || "";
  f.github.disabled = est.cfg.github === null;
  $("#cfg-versao").textContent = `Versão atual: ${est.cfg.versao}.`;
  d.returnValue = "";
  d.showModal();
});
function mostrarSecoes() {
  const m = $("#dlg-config form").motor.value;
  for (const sec of document.querySelectorAll("#dlg-config .cfg-sec")) sec.hidden = sec.dataset.para !== m;
}
$("#dlg-config form").motor.addEventListener("change", mostrarSecoes);
async function verificarKaggle() {
  const e = $("#cfg-kaggle-estado");
  e.textContent = "Verificando o Kaggle…";
  try {
    const k = await pegar("/api/kaggle");
    e.textContent = !k.conta ? "Conta do Kaggle ainda não ligada: cole o usuário e o token acima e clique em Salvar." : `Conta ligada: ${k.usuario}. GPU na nuvem ${k.ligada ? "ligada agora" : k.ligando ? "ligando…" : "desligada (liga sozinha ao gerar)"}.`;
  } catch (err) { e.textContent = err.message; }
}
$("#kaggle-json").addEventListener("change", async (ev) => {
  const arq = ev.target.files[0];
  if (!arq) return;
  try {
    await postar("/api/config", { kaggle: await arq.text() });
    est.cfg = await pegar("/api/config");
    $("#dlg-config form").motor.value = "kaggle";
    mostrarSecoes();
    aviso("Conta do Kaggle ligada. Agora é só clicar em Gerar num nó de vídeo.");
  } catch (err) { aviso(err.message, true, 10000); }
  ev.target.value = "";
  verificarKaggle();
});
async function verificarComfy() {
  const e = $("#cfg-comfy-estado");
  e.textContent = "Verificando o ComfyUI…";
  try {
    const c = await pegar("/api/comfy");
    const rec = `receita de foto ${c.receitas.imagem ? "✓" : "—"} · de vídeo ${c.receitas.video ? "✓" : "—"}`;
    e.textContent = c.ligado ? `ComfyUI ligado${c.placa ? ` · ${c.placa}` : ""}${c.vramGB ? ` · ${c.vramGB} GB de memória de vídeo` : ""} · ${rec}` : `ComfyUI desligado (${c.url}). Abra o ComfyUI para gerar localmente · ${rec}`;
  } catch (err) { e.textContent = err.message; }
}
for (const tipo of ["imagem", "video"]) {
  $(`#receita-${tipo}`).addEventListener("change", async (ev) => {
    const arq = ev.target.files[0];
    if (!arq) return;
    try {
      const r = await postar("/api/comfy/receita", { tipo, json: await arq.text() });
      aviso(`Receita de ${tipo === "video" ? "vídeo" : "foto"} salva (${r.nos} nós).`);
      est.cfg = await pegar("/api/config");
    } catch (err) { aviso(err.message, true, 10000); }
    ev.target.value = "";
    verificarComfy();
  });
}
$("#receita-pronta").addEventListener("click", async () => {
  try {
    await postar("/api/comfy/receita", { tipo: "video", padrao: "wan22-5b" });
    aviso("Receita pronta de vídeo salva (Wan 2.2 5B). Ligue uma imagem ao nó Gerar vídeo.");
    est.cfg = await pegar("/api/config");
  } catch (err) { aviso(err.message, true, 10000); }
  verificarComfy();
});
$("#cfg-cancelar").addEventListener("click", () => $("#dlg-config").close("cancelar"));
$("#dlg-config").addEventListener("close", async () => {
  const d = $("#dlg-config");
  if (d.returnValue !== "salvar") return;
  const f = d.querySelector("form");
  const corpo = { motor: f.motor.value };
  if (f.artcraftKey.value.trim()) corpo.artcraftKey = f.artcraftKey.value.trim();
  if (f.falKey.value.trim()) corpo.falKey = f.falKey.value.trim();
  if (f.comfyUrl.value.trim() !== (est.cfg.comfyUrl || "")) corpo.comfyUrl = f.comfyUrl.value.trim();
  if (!f.github.disabled && f.github.value.trim() !== (est.cfg.github || "")) corpo.github = f.github.value.trim();
  const kTok = f.kaggleToken.value.trim(), kUser = f.kaggleUser.value.trim().replace(/^@/, "").replace(/^.*kaggle\.com\//i, "").replace(/\/.*$/, "");
  if (kTok || (kUser && kUser !== est.cfg.kaggle)) {
    if (!kTok || !kUser) return aviso("Para ligar o Kaggle preencha o usuário e o token.", true, 8000);
    corpo.kaggle = { username: kUser, key: kTok };
  }
  try { await postar("/api/config", corpo); } catch (err) { return aviso(err.message, true); }
  est.cfg = await pegar("/api/config");
  if (corpo.github) setTimeout(conferirAtualizacao, 8000);
  aviso("Configuração salva.");
  desenhar();
});

$("#bib-fechar").addEventListener("click", () => alternarBiblioteca(false));
$("#bib-abrir").addEventListener("click", () => alternarBiblioteca(true));
function alternarBiblioteca(abrir) {
  $("#biblioteca").classList.toggle("fechada", !abrir);
  document.body.classList.toggle("sem-bib", !abrir);
  $("#bib-abrir").hidden = abrir;
  gravarLocal("biblioteca", abrir ? "1" : "0");
}

// ---------------------------------------------------------------------------------------------
// Visor (tela cheia)
// ---------------------------------------------------------------------------------------------

function abrirVisor(m) {
  if (!m) return;
  const v = $("#visor");
  const legenda = [m.arquivo, m.modelo && `${m.motor} · ${m.modelo}`, m.prompt].filter(Boolean).join("\n");
  v.querySelector(".visor-conteudo").innerHTML = (m.tipo === "video"
    ? `<video src="${urlMidia(m)}" controls autoplay loop></video>`
    : `<img src="${urlMidia(m)}" alt="">`) + `<div class="legenda">${esc(legenda)}</div>`;
  v.hidden = false;
}
function fecharVisor() { $("#visor").hidden = true; $("#visor .visor-conteudo").innerHTML = ""; }
$("#visor").addEventListener("click", (e) => { if (!e.target.closest("video")) fecharVisor(); });

// vídeos dos nós tocam ao passar o mouse
$("#camada-nos").addEventListener("pointerover", (e) => { const v = e.target.closest(".previa video"); if (v) v.play().catch(() => {}); });
$("#camada-nos").addEventListener("pointerout", (e) => { const v = e.target.closest(".previa video"); if (v) v.pause(); });

// ---------------------------------------------------------------------------------------------
// Miniaturas (o navegador gera; o Claude usa para ver o quadro gastando pouco)
// ---------------------------------------------------------------------------------------------

const fila = new Set();
let fazendo = false;
async function fazerMiniaturas() {
  for (const m of Object.values(est.doc.midias)) if (!est.minis.has(m.id)) fila.add(m.id);
  if (fazendo) return;
  fazendo = true;
  try {
    for (const id of fila) {
      fila.delete(id);
      const m = est.doc.midias[id];
      if (!m) continue;
      try {
        const blob = await miniatura(m);
        if (!blob) continue;
        await fetch(`/api/miniatura?${qp(`&m=${id}`)}`, { method: "POST", headers: { "X-Quadro": "1" }, body: blob });
        est.minis.add(id);
      } catch {}
    }
  } finally { fazendo = false; }
}

function miniatura(m) {
  return new Promise((resolve) => {
    const desenharEm = (fonte, w, h) => {
      const k = Math.min(1, 512 / Math.max(w, h));
      const c = document.createElement("canvas");
      c.width = Math.max(1, Math.round(w * k)); c.height = Math.max(1, Math.round(h * k));
      c.getContext("2d").drawImage(fonte, 0, 0, c.width, c.height);
      c.toBlob((b) => resolve(b), "image/jpeg", 0.8);
    };
    const tempo = setTimeout(() => resolve(null), 20000);
    if (m.tipo === "video") {
      const v = document.createElement("video");
      v.muted = true; v.preload = "auto"; v.src = urlMidia(m);
      v.addEventListener("loadeddata", () => { v.currentTime = Math.min(0.5, (v.duration || 1) / 3); }, { once: true });
      v.addEventListener("seeked", () => { clearTimeout(tempo); desenharEm(v, v.videoWidth, v.videoHeight); }, { once: true });
      v.addEventListener("error", () => { clearTimeout(tempo); resolve(null); }, { once: true });
    } else {
      const i = new Image();
      i.onload = () => { clearTimeout(tempo); desenharEm(i, i.naturalWidth, i.naturalHeight); };
      i.onerror = () => { clearTimeout(tempo); resolve(null); };
      i.src = urlMidia(m);
    }
  });
}

// ---------------------------------------------------------------------------------------------
// Timeline do FilmCraft (painel de baixo): mostra a sequência aberta no FilmCraft, ao vivo
// ---------------------------------------------------------------------------------------------

const linha = { aberta: false, dados: null, assinatura: "", pps: 1, monitor: true, timer: null, buscando: false, fotoEm: null, fotoBuscando: false, minis: new Map(), arrastando: null };
const tcLinha = (s, fps) => {
  s = Math.max(0, s || 0);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = Math.floor(s % 60), f = Math.floor((s % 1) * (fps || 24) + 1e-6);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(x).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
};

function alternarLinha(abrir) {
  linha.aberta = abrir;
  $("#linha").hidden = !abrir;
  document.body.classList.toggle("com-linha", abrir);
  $("#linha-alternar").classList.toggle("primario", abrir);
  gravarLocal("linha", abrir ? "1" : "0");
  clearInterval(linha.timer);
  if (abrir) { buscarLinha(); linha.timer = setInterval(() => { if (!document.hidden) buscarLinha(); }, 1000); }
}
$("#linha-alternar").addEventListener("click", () => alternarLinha(!linha.aberta));
$("#linha-fechar").addEventListener("click", () => alternarLinha(false));
$("#linha-ver-monitor").addEventListener("click", () => {
  linha.monitor = !linha.monitor;
  $("#linha").classList.toggle("sem-monitor", !linha.monitor);
  gravarLocal("linha-monitor", linha.monitor ? "1" : "0");
  linha.fotoEm = null;
  desenharLinha(true);
});
$("#linha-abrir").addEventListener("click", (e) => { e.stopPropagation(); abrirProjetosFc(); });
$("#fc-projeto").addEventListener("click", (e) => { e.stopPropagation(); if ($("#fc-projetos").hidden) abrirProjetosFc(); else fecharProjetosFc(); });
$("#linha-controle").addEventListener("click", async (e) => {
  e.target.disabled = true;
  try { const r = await postar("/api/filmcraft/controle"); aviso(r.texto, false, 12000); } catch (err) { aviso(err.message, true); }
  e.target.disabled = false;
});
document.addEventListener("pointerdown", (e) => { if (!e.target.closest("#fc-projetos, #fc-projeto, #linha-abrir")) fecharProjetosFc(); }, true);

// Seletor de projeto: o que está aberto, os recentes do FilmCraft e os .fcproj achados no PC.
function fecharProjetosFc() { $("#fc-projetos").hidden = true; }
async function abrirProjetosFc() {
  const caixa = $("#fc-projetos");
  caixa.hidden = false;
  caixa.innerHTML = `<p class="dica" style="padding:6px">Procurando projetos…</p>`;
  let r;
  try { r = await pegar("/api/filmcraft/projetos"); } catch (err) { caixa.innerHTML = `<p class="dica" style="padding:6px">${esc(err.message)}</p>`; return; }
  const botao = (p, atual) => `<button class="proj${atual ? " atual" : ""}" data-path="${esc(p.path)}" ${p.existe === false ? "disabled title=\"arquivo não encontrado\"" : ""}>${esc(p.nome)}<small>${esc(p.pasta || "")}</small></button>`;
  let h = "";
  if (r.atual) {
    h += `<h5>Aberto agora no FilmCraft</h5><button class="proj atual" disabled>${esc(r.atual.nome)}${r.atual.alterado ? " •" : ""}<small>${esc(r.atual.path || "ainda não salvo")}</small></button>`;
    if (r.sequencias.length) h += `<h5>Sequências deste projeto</h5>${r.sequencias.map((q) => `<button class="proj${q.item === r.ativa ? " atual" : ""}" data-seq="${q.item}">🎞 ${esc(q.nome)}</button>`).join("")}`;
  } else if (!r.conectado && r.rodando) {
    h += `<p class="dica" style="padding:6px">O FilmCraft está aberto sem sincronização. Salve e feche o FilmCraft e escolha o projeto abaixo, ou use “Ligar sincronização permanente”.</p>`;
  }
  const atualPath = r.atual && r.atual.path;
  const rec = r.recentes.filter((p) => p.path !== atualPath);
  if (rec.length) h += `<h5>Recentes do FilmCraft</h5>${rec.map((p) => botao(p)).join("")}`;
  if (r.encontrados.length) h += `<h5>Encontrados no computador</h5>${r.encontrados.map((p) => botao(p)).join("")}`;
  if (!rec.length && !r.encontrados.length) h += `<p class="dica" style="padding:6px">Não achei projetos (.fcproj) nos recentes nem em Documentos, Vídeos, Área de Trabalho e Downloads.</p>`;
  h += `<h5>Outro projeto</h5><div class="caminho"><input placeholder="Cole o caminho do .fcproj (Shift + botão direito › Copiar como caminho)"><button class="btn" data-caminho>Abrir</button></div>`;
  if (!r.conectado && !r.rodando) h += `<div class="caminho"><button class="btn" data-vazio>Abrir o FilmCraft sem projeto</button></div>`;
  caixa.innerHTML = h;
}
$("#fc-projetos").addEventListener("click", async (e) => {
  const b = e.target.closest("button");
  if (!b || b.disabled) return;
  if (b.dataset.seq) {
    try { await postar("/api/filmcraft/sequencia", { item: Number(b.dataset.seq) }); fecharProjetosFc(); linha.assinatura = ""; buscarLinha(); } catch (err) { aviso(err.message, true); }
    return;
  }
  let caminho = b.dataset.path;
  if (b.hasAttribute("data-caminho")) caminho = $("#fc-projetos input").value.trim().replace(/^"|"$/g, "");
  if (b.hasAttribute("data-caminho") && !caminho) return;
  fecharProjetosFc();
  await abrirProjetoFc(caminho || "");
});
async function abrirProjetoFc(caminho, salvar) {
  aviso(caminho ? `Abrindo ${caminho.split(/[\\/]/).pop()} no FilmCraft…` : "Abrindo o FilmCraft…");
  try {
    const r = await postar("/api/filmcraft/abrir", { path: caminho || undefined, salvar: !!salvar });
    if (r.precisaSalvar) {
      if (r.semCaminho) return aviso(`"${r.nome}" tem mudanças e nunca foi salvo. Salve no FilmCraft (Ctrl+S) e tente de novo.`, true);
      if (confirm(`O projeto "${r.nome}" tem mudanças não salvas. Salvar e abrir o outro projeto?`)) return abrirProjetoFc(caminho, true);
      return;
    }
    if (r.semControle) return aviso("O FilmCraft está aberto sem sincronização. Salve e feche o FilmCraft e tente de novo, ou ligue a sincronização permanente.", true, 9000);
    aviso(r.texto);
    linha.assinatura = "";
    buscarLinha();
  } catch (err) { aviso(err.message, true); }
}
$("#fc-sequencia").addEventListener("change", async (e) => {
  try { await postar("/api/filmcraft/sequencia", { item: Number(e.target.value) }); linha.assinatura = ""; buscarLinha(); } catch (err) { aviso(err.message, true); }
});
// nome do projeto e lista de sequências no topo da timeline (só quando mudam)
let projetoFcVisto = "";
async function atualizarCabecalhoFc(s) {
  const chave = `${s.id}|${linha.assinatura.length}`;
  if (chave === projetoFcVisto) return;
  projetoFcVisto = chave;
  try {
    const r = await pegar("/api/filmcraft/projetos");
    $("#fc-projeto span").textContent = r.atual ? r.atual.nome : "Projeto";
    const sel = $("#fc-sequencia");
    sel.innerHTML = r.sequencias.map((q) => `<option value="${q.item}" ${q.item === r.ativa ? "selected" : ""}>${esc(q.nome)}</option>`).join("");
    sel.hidden = r.sequencias.length < 2;
  } catch {}
}
function irPara(t) {
  const s = linha.dados.sequencia;
  s.playhead = t;
  $("#linha-cabeca").style.left = `${34 + t * linha.pps}px`;
  $("#linha-tc").textContent = tcLinha(t, s.fps);
  postar("/api/filmcraft/playhead", { seconds: t }).catch((err) => aviso(err.message, true));
}

async function buscarLinha() {
  if (linha.buscando) return;
  linha.buscando = true;
  try {
    const d = await pegar("/api/filmcraft/linha");
    const s = d.sequencia;
    const assinatura = JSON.stringify(s ? { ...s, playhead: 0 } : d);
    const mudou = assinatura !== linha.assinatura;
    linha.dados = d;
    linha.assinatura = assinatura;
    desenharLinha(mudou);
  } catch {
    linha.dados = { conectado: false, falha: true };
    desenharLinha(true);
  } finally { linha.buscando = false; }
}

function desenharLinha(tudo) {
  const d = linha.dados || {};
  const s = d.sequencia;
  const off = $("#linha-off");
  off.hidden = !!s;
  if (!s) {
    $("#linha-nome").textContent = "";
    $("#linha-tc").textContent = "";
    const semControle = !d.conectado && d.rodando === true;
    off.querySelector("p").textContent = d.falha ? "Não consegui falar com o quadro." : semControle
      ? "O FilmCraft está aberto, mas sem a sincronização ligada, então o quadro não enxerga a timeline. Ligue a sincronização permanente uma vez (depois feche e abra o FilmCraft) ou salve, feche o FilmCraft e escolha o projeto aqui."
      : !d.conectado
        ? "O FilmCraft está fechado. Escolha o projeto e eu abro já sincronizado com o quadro."
        : `O FilmCraft está conectado, mas sem sequência aberta. Escolha uma sequência em 📂 Projeto.${d.aviso ? ` (${d.aviso})` : ""}`;
    $("#linha-abrir").hidden = semControle;
    $("#linha-abrir").textContent = d.conectado ? "📂 Escolher projeto ou sequência" : "📂 Escolher projeto e abrir";
    $("#linha-controle").hidden = !semControle;
    $("#fc-sequencia").hidden = true;
    $("#fc-projeto span").textContent = d.conectado ? "Projeto" : "Abrir projeto";
    return;
  }
  $("#linha-nome").textContent = `${s.nome} · ${s.largura}×${s.altura} · ${Math.round(s.fps * 100) / 100} fps`;
  atualizarCabecalhoFc(s);
  $("#linha-tc").textContent = tcLinha(s.playhead, s.fps);
  const area = $("#linha-faixas");
  const largura = Math.max(100, area.clientWidth - 34 - 8);
  const total = Math.max(s.duracao * 1.04, 5);
  const pps = largura / total;
  if (tudo || pps !== linha.pps) {
    linha.pps = pps;
    // régua: marcas a cada 1, 2, 5, 10, 30, 60… segundos, o que couber
    const passo = [1, 2, 5, 10, 15, 30, 60, 120, 300, 600].find((p) => p * pps >= 70) || 1200;
    let regua = "";
    for (let t = 0; t <= total; t += passo) regua += `<i style="left:${t * pps}px">${tcLinha(t, s.fps).replace(/^00:/, "").slice(0, -3)}</i>`;
    for (const m of s.marcadores) regua += `<b class="marca-fc" style="left:${m.ini * pps}px" title="${esc(tcLinha(m.ini, s.fps))} ${esc(m.nome)}"></b>`;
    $("#linha-regua").innerHTML = regua;
    const noQuadro = new Set((est.doc ? est.doc.nos : []).filter((n) => n.fc).map((n) => n.fc.clip));
    const trilha = (f, audio) => `<div class="trilha${audio ? " audio" : ""}" data-trilha="${f.nome}"><div class="nome-trilha">${f.nome}</div>${f.clipes.map((c) => {
      const tipo = s.tipos[c.item] || "";
      const classes = ["clipe", s.selecao.includes(c.clip) && "sel", noQuadro.has(c.clip) && "no-quadro", !c.ativo && "off"].filter(Boolean).join(" ");
      return `<div class="${classes}" ${audio ? "" : `draggable="true" data-clip="${c.clip}" data-item="${c.item}" data-tipo="${tipo}" data-meio="${c.inSrc + c.dur / 2}"`} style="left:${c.ini * pps}px;width:${Math.max(2, c.dur * pps - 1)}px" title="${esc(c.nome)} · ${tcLinha(c.ini, s.fps)} → ${tcLinha(c.ini + c.dur, s.fps)}${audio ? "" : "\nArraste para o quadro (ou clique duas vezes) para usar como referência"}"><span>${esc(c.nome)}</span></div>`;
    }).join("")}</div>`;
    $("#linha-trilhas").innerHTML = [...s.video].reverse().map((f) => trilha(f, false)).join("") + s.audio.map((f) => trilha(f, true)).join("");
    document.querySelectorAll("#linha-trilhas .clipe[data-clip]").forEach(pintarClipe);
  }
  $("#linha-cabeca").style.left = `${34 + s.playhead * linha.pps}px`;
  atualizarMonitor(s);
}

// Miniatura do clipe: o navegador tira um quadro do arquivo original (foto ou vídeo).
function pintarClipe(el) {
  const chave = `${el.dataset.item}:${(+el.dataset.meio).toFixed(2)}`;
  const pronta = linha.minis.get(chave);
  if (pronta) { if (pronta !== "x") el.style.backgroundImage = `url("${pronta}")`; return; }
  linha.minis.set(chave, "x");
  const url = `/api/filmcraft/arquivo?${qp(`&item=${el.dataset.item}`)}`;
  const usar = (u) => { linha.minis.set(chave, u); document.querySelectorAll(`#linha-trilhas .clipe[data-item="${el.dataset.item}"]`).forEach((x) => { if (`${x.dataset.item}:${(+x.dataset.meio).toFixed(2)}` === chave) x.style.backgroundImage = `url("${u}")`; }); };
  const reduzir = (fonte, w, h) => {
    const c = document.createElement("canvas");
    c.height = 60; c.width = Math.max(1, Math.round((w / h) * 60));
    c.getContext("2d").drawImage(fonte, 0, 0, c.width, c.height);
    usar(c.toDataURL("image/jpeg", 0.7));
  };
  if (el.dataset.tipo === "imagem") {
    const i = new Image();
    i.onload = () => reduzir(i, i.naturalWidth, i.naturalHeight);
    i.src = url;
  } else if (el.dataset.tipo === "video") {
    const v = document.createElement("video");
    v.muted = true; v.preload = "auto"; v.src = url;
    v.addEventListener("loadedmetadata", () => { v.currentTime = Math.min(+el.dataset.meio, Math.max(0, (v.duration || 1) - 0.05)); }, { once: true });
    v.addEventListener("seeked", () => { reduzir(v, v.videoWidth, v.videoHeight); v.removeAttribute("src"); v.load(); }, { once: true });
  }
}

function atualizarMonitor(s) {
  if (!linha.monitor || linha.fotoBuscando) return;
  const chave = `${s.playhead.toFixed(3)}|${linha.assinatura.length}`;
  if (chave === linha.fotoEm) return;
  linha.fotoBuscando = true;
  fetch(`/api/filmcraft/monitor?${qp("&lado=640")}`).then(async (r) => {
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).erro || "sem imagem");
    const u = URL.createObjectURL(await r.blob());
    const img = $("#linha-monitor img");
    if (img.src.startsWith("blob:")) URL.revokeObjectURL(img.src);
    img.src = u;
    $("#linha-monitor span").textContent = "";
    linha.fotoEm = chave;
  }).catch((e) => { $("#linha-monitor span").textContent = e.message; linha.fotoEm = chave; })
    .finally(() => { linha.fotoBuscando = false; });
}

const tempoNaLinha = (clientX) => {
  const r = $("#linha-faixas").getBoundingClientRect();
  return Math.max(0, (clientX - r.left - 34) / linha.pps);
};

// clicar / arrastar na régua ou nas faixas = mover o playhead do FilmCraft
let raspando = null;
$("#linha-faixas").addEventListener("pointerdown", (e) => {
  const s = linha.dados && linha.dados.sequencia;
  if (!s || e.button !== 0 || e.target.closest(".clipe[draggable]")) return;
  raspando = { ultimo: 0 };
  moverPlayhead(e.clientX, true);
  $("#linha-faixas").setPointerCapture(e.pointerId);
});
$("#linha-faixas").addEventListener("pointermove", (e) => { if (raspando) moverPlayhead(e.clientX, false); });
$("#linha-faixas").addEventListener("pointerup", (e) => { if (raspando) { moverPlayhead(e.clientX, true); raspando = null; } });
$("#linha-faixas").addEventListener("click", (e) => {
  // clique simples num clipe de vídeo também move o playhead
  const c = e.target.closest(".clipe[draggable]");
  if (c && linha.dados && linha.dados.sequencia) moverPlayhead(e.clientX, true);
});
function moverPlayhead(clientX, ja) {
  const s = linha.dados.sequencia;
  const t = Math.min(tempoNaLinha(clientX), s.duracao);
  s.playhead = t;
  $("#linha-cabeca").style.left = `${34 + t * linha.pps}px`;
  $("#linha-tc").textContent = tcLinha(t, s.fps);
  const agora = Date.now();
  if (!ja && raspando && agora - raspando.ultimo < 120) return;
  if (raspando) raspando.ultimo = agora;
  postar("/api/filmcraft/playhead", { seconds: t }).catch((err) => aviso(err.message, true));
}

// clipe da timeline → quadro (arrastar ou duplo clique)
$("#linha-trilhas").addEventListener("dragstart", (e) => {
  const c = e.target.closest(".clipe[data-clip]");
  if (c) e.dataTransfer.setData("application/x-clipe-fc", c.dataset.clip);
});
$("#linha-trilhas").addEventListener("dblclick", (e) => {
  const c = e.target.closest(".clipe[data-clip]");
  if (c) trazerClipe(Number(c.dataset.clip));
});
async function trazerClipe(clip, p) {
  const cena = est.doc.cenas.find((c) => c.id === est.cena);
  aviso("Trazendo o clipe para o quadro…");
  try {
    const r = await postar("/api/filmcraft/importar", { clips: [clip], cena: cena.id, ...(p ? { x: p.x, y: p.y } : {}) });
    aviso(r.texto);
    await carregarDoc();
    linha.assinatura = "";
  } catch (err) { aviso(err.message, true); }
}

$("#linha-importar").addEventListener("click", async (e) => {
  e.target.disabled = true;
  aviso("Trazendo a sequência para o quadro…");
  try {
    const r = await postar("/api/filmcraft/importar", {});
    aviso(r.texto);
    await carregarDoc();
    trocarCena(r.cena);
    linha.assinatura = "";
  } catch (err) { aviso(err.message, true); }
  e.target.disabled = false;
});

// biblioteca → timeline (soltar no tempo onde caiu)
const painelLinha = $("#linha");
painelLinha.addEventListener("dragover", (e) => {
  if (!e.dataTransfer.types.includes("application/x-midia") || !(linha.dados && linha.dados.sequencia)) return;
  e.preventDefault();
  mostrarAlvo(e.clientX);
});
painelLinha.addEventListener("dragleave", (e) => { if (!painelLinha.contains(e.relatedTarget)) mostrarAlvo(null); });
painelLinha.addEventListener("drop", (e) => {
  const midia = e.dataTransfer.getData("application/x-midia");
  mostrarAlvo(null);
  if (!midia) return;
  e.preventDefault();
  colocarNaLinha({ midia, cena: est.cena }, tempoNaLinha(e.clientX));
});
function mostrarAlvo(clientX) {
  const alvo = $("#linha-alvo");
  painelLinha.classList.toggle("soltar", clientX !== null);
  if (clientX === null) { alvo.hidden = true; return; }
  const t = tempoNaLinha(clientX);
  alvo.hidden = false;
  alvo.style.left = `${34 + t * linha.pps}px`;
  alvo.dataset.tc = tcLinha(t, linha.dados.sequencia.fps);
}
// nó arrastado do quadro e solto em cima da timeline
function sobreLinha(clientX, clientY) {
  if (!linha.aberta || !(linha.dados && linha.dados.sequencia)) return false;
  const r = $("#linha-faixas").getBoundingClientRect();
  return clientY >= r.top && clientY <= r.bottom && clientX >= r.left && clientX <= r.right;
}
async function colocarNaLinha(corpo, seconds) {
  aviso("Colocando na timeline do FilmCraft…");
  try {
    const r = await postar("/api/filmcraft/colocar", { ...corpo, ...(typeof seconds === "number" ? { seconds } : {}) });
    aviso(r.texto);
    await carregarDoc();
    if (linha.aberta) buscarLinha();
  } catch (err) { aviso(err.message, true); }
}
window.addEventListener("resize", () => { if (linha.aberta) desenharLinha(true); });

// ---------------------------------------------------------------------------------------------
// Guia, aviso de atualização
// ---------------------------------------------------------------------------------------------

function alternarGuia(abrir) {
  if (abrir === undefined) abrir = $("#guia").hidden;
  $("#guia").hidden = !abrir;
  document.body.classList.toggle("com-guia", abrir);
  $("#guia-alternar").classList.toggle("primario", abrir);
  gravarLocal("guia", abrir ? "1" : "0");
  if (linha.aberta) desenharLinha(true);
}
$("#guia-alternar").addEventListener("click", () => alternarGuia());
$("#guia-fechar").addEventListener("click", () => alternarGuia(false));

let atualizacaoVista = "";
async function conferirAtualizacao() {
  try {
    const r = await pegar("/api/atualizacao");
    if (!r.pronta || r.pronta.versao === atualizacaoVista) return;
    const b = $("#atualizacao");
    b.querySelector("span").textContent = `Versão ${r.pronta.versao} pronta${r.pronta.notas ? `: ${r.pronta.notas}` : ""}`;
    const btn = b.querySelector(".btn");
    btn.textContent = r.podeReiniciar ? "Reiniciar e atualizar" : "Entra quando reiniciar o Claude";
    btn.disabled = !r.podeReiniciar;
    b.hidden = false;
  } catch {}
}
$("#atualizacao .mini").addEventListener("click", () => {
  atualizacaoVista = $("#atualizacao span").textContent.replace(/^Versão (\S+).*/, "$1");
  $("#atualizacao").hidden = true;
});
$("#atualizacao .btn").addEventListener("click", async (e) => {
  e.target.disabled = true;
  e.target.textContent = "Reiniciando…";
  try { await postar("/api/reiniciar"); } catch (err) { aviso(err.message, true); return; }
  // espera o programa voltar e recarrega a página
  const t0 = Date.now();
  await new Promise((r) => setTimeout(r, 2500));
  while (Date.now() - t0 < 60000) {
    try { const r = await fetch("/api/ping", { cache: "no-store" }); if (r.ok) return location.reload(); } catch {}
    await new Promise((r) => setTimeout(r, 1000));
  }
  aviso("O programa não voltou sozinho. Abra o Quadro ArtCraft.exe de novo.", true);
});

// ---------------------------------------------------------------------------------------------
// Início e atualização ao vivo
// ---------------------------------------------------------------------------------------------

function conectarEventos() {
  const es = new EventSource(`/api/eventos?${qp()}`);
  let t;
  es.onmessage = (ev) => {
    const d = JSON.parse(ev.data);
    if (d.tipo === "quadro" && (!est.doc || d.rev !== est.doc.rev)) { clearTimeout(t); t = setTimeout(carregarDoc, 80); }
    if (d.tipo === "progresso") {
      const n = est.doc && acharNo(d.no);
      if (n) { n.progresso = d.progresso; if (d.fase) n.fase = d.fase; desenharNos(); }
    }
  };
  es.onerror = () => { es.close(); setTimeout(() => { conectarEventos(); carregarDoc(); }, 3000); }; // pega o que mudou durante a queda
}

(async function iniciar() {
  try {
    const [cfg, projs] = await Promise.all([pegar("/api/config"), pegar("/api/projetos")]);
    est.cfg = cfg;
    est.projetos = projs.projetos;
    if (!est.proj) est.proj = projs.ativo;
    if (lerLocal("biblioteca") === "0") alternarBiblioteca(false);
    if (lerLocal("linha-monitor") === "0") { linha.monitor = false; $("#linha").classList.add("sem-monitor"); }
    if (lerLocal("linha") === "1") alternarLinha(true);
    if (lerLocal("guia") !== "0") alternarGuia(true);
    conferirAtualizacao();
    setInterval(conferirAtualizacao, 2 * 60 * 1000);
    await carregarDoc();
    conectarEventos();
    document.title = `${est.doc.nome} · Quadro de Cenas`;
  } catch (e) {
    document.body.innerHTML = `<p style="padding:40px">Não consegui falar com o quadro: ${esc(e.message)}. Ele roda junto com o Claude Desktop: abra o Claude e recarregue esta página.</p>`;
  }
})();

// Barra de menus (Arquivo, Editar, Exibir, Janela, Atalhos, Configurações): reaproveita as ações que já existem.
const tecla = (k, o = {}) => document.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, ...o }));
const MENUS = {
  "Arquivo": [
    ["Importar foto ou vídeo…", "I", () => novo("imagem")],
    ["Nova nota", "N", () => novo("nota")],
    ["Novo Gerar foto", "G", () => novo("gerar-imagem")],
    ["Novo Gerar vídeo", "V", () => novo("gerar-video")],
    null,
    ["Cena → FilmCraft", "", () => enviarCena("filmcraft")],
    ["Cena → EffectCraft", "", () => enviarCena("effectcraft")],
  ],
  "Editar": [
    ["Desfazer", "Ctrl+Z", () => voltar(false)],
    ["Refazer", "Ctrl+Y", () => voltar(true)],
    null,
    ["Copiar", "Ctrl+C", () => tecla("c", { ctrlKey: true })],
    ["Colar", "Ctrl+V", () => colarNos()],
    ["Duplicar", "Ctrl+D", () => tecla("d", { ctrlKey: true })],
    ["Selecionar tudo", "Ctrl+A", () => tecla("a", { ctrlKey: true })],
    ["Apagar", "Del", () => tecla("Delete")],
    null,
    ["Gerar os selecionados", "Ctrl+Enter", () => gerarSelecionados()],
  ],
  "Exibir": [
    ["Enquadrar a cena", "F", () => enquadrar()],
    ["Timeline do FilmCraft", "T", () => alternarLinha(!linha.aberta)],
    ["Biblioteca", "", () => alternarBiblioteca($("#biblioteca").classList.contains("fechada"))],
  ],
  "Janela": [
    ["Tela cheia", "F11", () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {})],
    ["Recarregar o quadro", "", () => location.reload()],
    ["Procurar atualização", "", async () => { aviso("Procurando atualização…"); let erro = ""; try { erro = (await postar("/api/atualizacao/verificar")).erro || ""; } catch (e) { erro = e.message; } atualizacaoVista = ""; await conferirAtualizacao(); if (!$("#atualizacao").hidden) return; aviso(erro ? `Não consegui procurar atualização: ${erro}` : `Você já está na versão mais recente (${est.cfg.versao}).`, !!erro); }],
  ],
  "Atalhos": [
    ["Ver todos os atalhos", "?", () => alternarGuia()],
  ],
  "Configurações": [
    ["Motor de geração e chaves…", "", () => $("#motor").click()],
    ["Atualizações automáticas…", "", () => $("#motor").click()],
  ],
};
function fecharAba() {
  const a = $("#menu-aba");
  if (a) a.hidden = true;
  for (const b of $("#menus").children) b.classList.remove("aberto");
}
function abrirAba(btn, nome) {
  let a = $("#menu-aba");
  if (!a) { a = document.createElement("div"); a.id = "menu-aba"; document.body.append(a); }
  const aberto = btn.classList.contains("aberto");
  fecharAba();
  if (aberto) return;
  a.replaceChildren();
  for (const it of MENUS[nome]) {
    if (!it) { a.append(document.createElement("hr")); continue; }
    const b = document.createElement("button");
    b.type = "button";
    const t = document.createElement("span"); t.textContent = it[0];
    const k = document.createElement("kbd"); k.textContent = it[1];
    b.append(t, k);
    b.addEventListener("click", () => { fecharAba(); Promise.resolve().then(it[2]).catch((e) => aviso(e.message, true)); });
    a.append(b);
  }
  btn.classList.add("aberto");
  const r = btn.getBoundingClientRect();
  a.style.left = Math.min(r.left, innerWidth - 270) + "px";
  a.style.top = r.bottom + 4 + "px";
  a.hidden = false;
}
for (const nome of Object.keys(MENUS)) {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = nome;
  b.addEventListener("click", (e) => { e.stopPropagation(); abrirAba(b, nome); });
  b.addEventListener("mouseenter", () => { if ($("#menus .aberto") && !b.classList.contains("aberto")) abrirAba(b, nome); });
  $("#menus").append(b);
}
document.addEventListener("click", fecharAba);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") fecharAba(); });

// Soltar um arquivo fora do quadro não pode abrir o arquivo no navegador e perder a sessão.
for (const nome of ["dragover", "drop"]) window.addEventListener(nome, (e) => { if (e.dataTransfer && [...(e.dataTransfer.types || [])].includes("Files")) e.preventDefault(); });
