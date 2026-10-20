// Atualização automática: o programa (e a extensão) baixam a versão nova do repositório público
// e passam a usá-la no próximo início. Só JavaScript é baixado (o pacote único com o quadro), o
// Node que roda tudo continua o mesmo.
//
// <URL>/versao.json = { "versao": "2.2.0", "arquivo": "quadro-bundle.js", "sha256": "…", "notas": "…" }

"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const WINDOWS = process.platform === "win32";
const URL_PADRAO = "https://raw.githubusercontent.com/viniruanovr/quadro-artcraft/main/";

const PASTA = path.join(
  WINDOWS ? process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local") : path.join(os.homedir(), ".local", "share"),
  "ArtCraftClaude", "atualizacao",
);

// De onde vêm as atualizações: variável de ambiente, ou o usuário do GitHub informado no ⚙ do
// quadro (repositório público <usuário>/quadro-artcraft).
const ARQ_ORIGEM = path.join(PASTA, "origem.json");
function lerOrigem() { try { return JSON.parse(fs.readFileSync(ARQ_ORIGEM, "utf8")).usuario || ""; } catch { return ""; } }
function gravarOrigem(usuario) {
  usuario = String(usuario || "").trim().replace(/^@/, "").replace(/^https?:\/\/github\.com\//i, "").split("/")[0];
  if (usuario && !/^[A-Za-z0-9-]{1,39}$/.test(usuario)) throw new Error("usuário do GitHub inválido");
  fs.mkdirSync(PASTA, { recursive: true });
  fs.writeFileSync(ARQ_ORIGEM, JSON.stringify({ usuario }));
  return usuario;
}

// Proteção contra pacote ruim: cada início com um pacote baixado é contado em tentativa.json e só
// vira "bom" depois que o programa ficou de pé por um tempo. Três inícios seguidos sem ficar bom
// e o pacote vai para ruins.json: o programa volta para a versão embutida e não baixa o mesmo de novo.
const ARQ_TENT = path.join(PASTA, "tentativa.json");
const ARQ_RUINS = path.join(PASTA, "ruins.json");
const lerArq = (a, padrao) => { try { return JSON.parse(fs.readFileSync(a, "utf8")); } catch { return padrao; } };
const ruins = () => lerArq(ARQ_RUINS, []);
const ehRuim = (sha) => !!sha && ruins().includes(sha);
function marcarRuim(sha) {
  if (!sha) return;
  try { fs.mkdirSync(PASTA, { recursive: true }); fs.writeFileSync(ARQ_RUINS, JSON.stringify([...new Set([...ruins(), sha])].slice(-20))); } catch {}
}
function registrarTentativa(v) {
  try {
    const t = lerArq(ARQ_TENT, {});
    const n = t.sha === v.sha256 && !t.bom ? (t.n || 0) + 1 : 1;
    if (n > 3) { marcarRuim(v.sha256); fs.rmSync(ARQ_TENT, { force: true }); return false; }
    fs.writeFileSync(ARQ_TENT, JSON.stringify({ sha: v.sha256, versao: v.versao, n, bom: false }));
  } catch {}
  return true;
}
function marcarBom() {
  try { const t = lerArq(ARQ_TENT, null); if (t && !t.bom) fs.writeFileSync(ARQ_TENT, JSON.stringify({ ...t, bom: true })); } catch {}
}

function urlBase() {
  const v = (process.env.ARTCRAFT_ATUALIZACAO_URL || "").trim();
  const usuario = lerOrigem();
  const u = v && !v.startsWith("${") ? v : usuario ? `https://raw.githubusercontent.com/${usuario}/quadro-artcraft/main/` : URL_PADRAO;
  // só https (http apenas para a própria máquina, em testes): o pacote baixado é código que vai rodar
  if (u && !/^https:\/\//i.test(u) && !/^http:\/\/(127\.0\.0\.1|localhost)[:/]/i.test(u)) return "";
  return u && !u.endsWith("/") ? `${u}/` : u;
}

// "2.10.0" > "2.9.3"
function maisNova(a, b) {
  const pa = String(a || "0").split(".").map(Number), pb = String(b || "0").split(".").map(Number);
  for (let i = 0; i < 3; i++) if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) > (pb[i] || 0);
  return false;
}

function lerInstalada() {
  try {
    const v = JSON.parse(fs.readFileSync(path.join(PASTA, "versao.json"), "utf8"));
    const arq = path.join(PASTA, path.basename(v.arquivo || "quadro-bundle.js"));
    return fs.existsSync(arq) ? { ...v, caminho: arq } : null;
  } catch { return null; }
}

// Caminho do pacote baixado, se ele for mais novo que a versão que está rodando.
function pacoteMaisNovo(versaoAtual) {
  const v = lerInstalada();
  if (!v || !maisNova(v.versao, versaoAtual) || ehRuim(v.sha256)) return null;
  // arquivo truncado ou trocado: não roda
  try { if (crypto.createHash("sha256").update(fs.readFileSync(v.caminho)).digest("hex") !== v.sha256) return null; } catch { return null; }
  return registrarTentativa(v) ? v.caminho : null;
}

let ultima = null; // { versao, notas } baixada nesta execução e ainda não em uso

async function verificar(versaoAtual, log = () => {}) {
  const base = urlBase();
  if (!base) return null;
  const pegar = async (nome) => {
    const r = await fetch(`${base}${nome}?t=${Date.now()}`, { headers: { "Cache-Control": "no-cache" }, signal: AbortSignal.timeout(60000) });
    if (!r.ok) throw new Error(`${nome}: HTTP ${r.status}`);
    return Buffer.from(await r.arrayBuffer());
  };
  const info = JSON.parse((await pegar("versao.json")).toString("utf8"));
  const instalada = lerInstalada();
  const sha = String(info.sha256 || "").trim().toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(sha)) throw new Error("versao.json sem sha256 válido: ignorado");
  if (!maisNova(info.versao, versaoAtual) || ehRuim(sha)) return null;
  if (instalada && instalada.versao === info.versao && instalada.sha256 === sha) { ultima = { versao: info.versao, notas: info.notas || "" }; return ultima; }
  const nome = path.basename(info.arquivo || "quadro-bundle.js");
  const bytes = await pegar(nome);
  const hash = crypto.createHash("sha256").update(bytes).digest("hex");
  if (hash !== sha) throw new Error("o arquivo baixado não confere (sha256); tento de novo mais tarde");
  fs.mkdirSync(PASTA, { recursive: true });
  const tmp = path.join(PASTA, `${nome}.${process.pid}.baixando`);
  fs.writeFileSync(tmp, bytes);
  fs.renameSync(tmp, path.join(PASTA, nome));
  fs.writeFileSync(path.join(PASTA, "versao.json"), JSON.stringify({ versao: info.versao, arquivo: nome, sha256: hash, notas: info.notas || "" }, null, 2));
  log(`atualização ${info.versao} baixada`);
  ultima = { versao: info.versao, notas: info.notas || "" };
  return ultima;
}

// Confere agora e a cada 20 minutos, sem atrapalhar nada se a internet falhar.
function acompanhar(versaoAtual, log = () => {}) {
  const rodar = () => verificar(versaoAtual, log).catch((e) => log(`atualização: ${e.message}`));
  setTimeout(rodar, 5000).unref();
  setInterval(rodar, 20 * 60 * 1000).unref();
}

module.exports = { marcarBom, PASTA, urlBase, lerOrigem, gravarOrigem, maisNova, pacoteMaisNovo, verificar, acompanhar, pronta: () => ultima };
