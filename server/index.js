#!/usr/bin/env node
// ArtCraft para Claude: um servidor MCP que liga o Claude aos apps da suíte ArtCraft.
//
// Cada app da suíte já traz o próprio servidor MCP (`<app>-cli mcp`). Este servidor junta
// todos num lugar só: descobre o que está instalado, abre os apps com o canal de controle
// ligado, inicia o servidor MCP de cada app só quando ele é usado e repassa as chamadas.
// Também serve o Quadro de Cenas (quadro.js): um quadro de nós no navegador, em localhost.
// Sem dependências: só Node.js (o Claude Desktop já traz um).

"use strict";

const { spawn, execFile } = require("node:child_process");
const fs = require("node:fs");
const net = require("node:net");
const os = require("node:os");
const path = require("node:path");

const VERSAO = "2.7.0";
const WINDOWS = process.platform === "win32";
const atualizar = require("./atualizar");

// Se já foi baixada uma versão mais nova, ela é que roda (o programa e a extensão se atualizam
// sozinhos). ARTCRAFT_SEM_ATUALIZACAO=1 desliga.
if (require.main === module && !globalThis.__ARTCRAFT_CARREGADO && !process.env.ARTCRAFT_SEM_ATUALIZACAO) {
  const novo = atualizar.pacoteMaisNovo(VERSAO);
  if (novo) {
    globalThis.__ARTCRAFT_CARREGADO = true;
    try {
      require("node:module").createRequire(novo)(novo);
      return;
    } catch (e) {
      process.stderr.write(`[artcraft] a versão baixada falhou (${e.message}); usando a ${VERSAO}\n`);
    }
  }
}
const ehEntrada = require.main === module || globalThis.__ARTCRAFT_CARREGADO === true;
if (globalThis.__ARTCRAFT_CARREGADO) globalThis.__ARTCRAFT_CARREGADO = "rodando";

// ---------------------------------------------------------------------------------------------
// Catálogo dos apps
// ---------------------------------------------------------------------------------------------

// porta: porta do canal de controle que este conector usa (uma por app, sem colisão).
// janela: argumentos do `<app>-cli` para dirigir o app aberto; null = o app não tem.
// arquivo: argumentos para uma sessão sem janela.
// pastas: o modo sem janela aceita --automation-read-root / --automation-write-root.
const APPS = {
  photocraft: {
    nome: "PhotoCraft", area: "edição de imagens, camadas, máscaras, retoque (equivale ao Photoshop)",
    porta: 7878, janela: (p) => ["mcp", "--bridge", `127.0.0.1:${p}`], arquivo: ["mcp"], pastas: true,
    token: true,
  },
  vectorcraft: {
    nome: "VectorCraft", area: "ilustração vetorial, logos, tipografia (equivale ao Illustrator)",
    porta: 7979, janela: (p) => ["mcp", "--connect", `127.0.0.1:${p}`], arquivo: ["mcp", "--headless"], pastas: true,
  },
  filmcraft: {
    nome: "FilmCraft", area: "edição de vídeo, cortes, cor e som na timeline (equivale ao Premiere Pro)",
    porta: 9876, janela: (p) => ["mcp", "--bridge", `127.0.0.1:${p}`], arquivo: ["mcp"], pastas: false,
  },
  lightcraft: {
    nome: "LightCraft", area: "biblioteca de fotos e revelação RAW (equivale ao Lightroom)",
    porta: 7980, janela: (p) => ["mcp", "--connect", `127.0.0.1:${p}`], arquivo: ["mcp", "--headless"], pastas: false,
  },
  pdfcraft: {
    nome: "PdfCraft", area: "leitura, organização e proteção de PDFs (equivale ao Acrobat)",
    porta: null, janela: null, arquivo: ["mcp"], pastas: true,
  },
  effectcraft: {
    nome: "EffectCraft", area: "motion graphics, composições e efeitos visuais (equivale ao After Effects)",
    porta: 9877, janela: (p) => ["mcp", "--bridge", `127.0.0.1:${p}`], arquivo: ["mcp"], pastas: true,
  },
  designcraft: {
    nome: "DesignCraft", area: "diagramação de páginas e publicação (equivale ao InDesign)",
    porta: 7982, janela: (p) => ["mcp", "--connect", `127.0.0.1:${p}`], arquivo: ["mcp"], pastas: true,
  },
  figcraft: {
    nome: "FigCraft", area: "design de interfaces e protótipos (equivale ao Figma)",
    porta: 7983, janela: (p) => ["mcp", "--attach", String(p)], arquivo: ["mcp"], pastas: true,
  },
  wordcraft: {
    nome: "WordCraft", area: "escrita e design de documentos (equivale ao Word)",
    porta: 7981, janela: (p) => ["mcp", "--connect", `127.0.0.1:${p}`], arquivo: ["mcp"], pastas: true,
  },
  soundcraft: {
    nome: "SoundCraft", area: "gravação, edição e mixagem de áudio (equivale ao Audition)",
    porta: 7801, janela: (p) => ["mcp", "--connect", `127.0.0.1:${p}`], arquivo: ["mcp"], pastas: true,
  },
  deckcraft: {
    nome: "DeckCraft", area: "apresentações e slides (equivale ao PowerPoint)",
    porta: 7990, janela: (p) => ["mcp", "--connect", `127.0.0.1:${p}`], arquivo: ["mcp"], pastas: true,
  },
  cadcraft: {
    nome: "CADCraft", area: "desenho técnico e projeto (equivale ao AutoCAD)",
    porta: 7984, janela: (p) => ["mcp", "--connect", `127.0.0.1:${p}`], arquivo: ["mcp"], pastas: false,
  },
  gridcraft: {
    nome: "GridCraft", area: "planilhas e dados (equivale ao Excel)",
    porta: 7985, janela: (p) => ["mcp", "--connect", String(p)], arquivo: ["mcp"], pastas: false,
  },
};

const varPorta = (id) => `${id.toUpperCase()}_CONTROL_PORT`;

// ---------------------------------------------------------------------------------------------
// Configuração (vem do Claude Desktop pelo manifesto, ou de variáveis de ambiente)
// ---------------------------------------------------------------------------------------------

function lerConfig(nome) {
  const v = (process.env[nome] || "").trim();
  return v && !v.startsWith("${") ? v : "";
}

const DADOS = path.join(
  WINDOWS ? process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local") : path.join(os.homedir(), ".local", "share"),
  "ArtCraftClaude",
);
const TOKEN_PHOTOCRAFT = path.join(DADOS, "photocraft-control.token");
const PASTA_LEITURA = lerConfig("ARTCRAFT_PASTA_LEITURA") || os.homedir();
const PASTA_SAIDA = lerConfig("ARTCRAFT_PASTA_SAIDA") || path.join(os.homedir(), "Documents", "ArtCraft Claude");
const PASTAS_EXTRAS = lerConfig("ARTCRAFT_PASTAS_INSTALACAO").split(";").map((s) => s.trim()).filter(Boolean);
const TEMPO_LIMITE_MS = Number(lerConfig("ARTCRAFT_TEMPO_LIMITE_S") || 600) * 1000;

function log(...partes) {
  process.stderr.write(`[artcraft] ${partes.join(" ")}\n`);
}

// ---------------------------------------------------------------------------------------------
// Onde os apps estão instalados
// ---------------------------------------------------------------------------------------------

function existe(p) {
  try { return fs.statSync(p).isFile(); } catch { return false; }
}

function pastasCandidatas(app) {
  const pastas = [...PASTAS_EXTRAS.map((p) => path.join(p, app.nome)), ...PASTAS_EXTRAS];
  if (WINDOWS) {
    for (const v of ["ProgramW6432", "ProgramFiles", "ProgramFiles(x86)"]) {
      if (process.env[v]) pastas.push(path.join(process.env[v], app.nome));
    }
    pastas.push(path.join("C:\\Program Files", app.nome));
    if (process.env.LOCALAPPDATA) pastas.push(path.join(process.env.LOCALAPPDATA, "Programs", app.nome));
  } else if (process.platform === "darwin") {
    pastas.push(`/Applications/${app.nome}.app/Contents/MacOS`, path.join(os.homedir(), "Applications", `${app.nome}.app`, "Contents", "MacOS"));
  }
  for (const p of (process.env.PATH || "").split(path.delimiter)) if (p) pastas.push(p);
  return [...new Set(pastas)];
}

const cacheInstalacao = new Map();

function localizar(id) {
  if (cacheInstalacao.has(id)) return cacheInstalacao.get(id);
  const app = APPS[id];
  const ext = WINDOWS ? ".exe" : "";
  let achado = null;
  for (const pasta of pastasCandidatas(app)) {
    const cli = path.join(pasta, `${id}-cli${ext}`);
    if (existe(cli)) {
      const exe = path.join(pasta, `${id}${ext}`);
      achado = { cli, exe: existe(exe) ? exe : null, pasta };
      break;
    }
  }
  if (achado && !achado.exe && process.platform === "darwin") {
    const mac = `/Applications/${app.nome}.app/Contents/MacOS/${id}`;
    if (existe(mac)) achado.exe = mac;
  }
  if (achado) cacheInstalacao.set(id, achado);
  return achado;
}

// ---------------------------------------------------------------------------------------------
// Estado dos apps abertos
// ---------------------------------------------------------------------------------------------

function portaAberta(porta, ms = 600) {
  return new Promise((resolve) => {
    if (!porta) return resolve(false);
    const s = net.connect({ host: "127.0.0.1", port: porta });
    const fim = (ok) => { s.destroy(); resolve(ok); };
    s.setTimeout(ms, () => fim(false));
    s.once("connect", () => fim(true));
    s.once("error", () => fim(false));
  });
}

function processosAbertos() {
  return new Promise((resolve) => {
    if (!WINDOWS) {
      execFile("ps", ["-A", "-o", "comm="], (err, out) => {
        resolve(err ? null : new Set(out.split("\n").map((l) => path.basename(l.trim()).toLowerCase())));
      });
      return;
    }
    execFile("tasklist", ["/FO", "CSV", "/NH"], { windowsHide: true }, (err, out) => {
      if (err) return resolve(null);
      const nomes = new Set();
      for (const linha of out.split(/\r?\n/)) {
        const m = linha.match(/^"([^"]+)"/);
        if (m) nomes.add(m[1].toLowerCase().replace(/\.exe$/, ""));
      }
      resolve(nomes);
    });
  });
}

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

function envDoApp(id) {
  const env = { ...process.env };
  const app = APPS[id];
  if (app.porta) env[varPorta(id)] = String(app.porta);
  if (app.token) {
    fs.mkdirSync(DADOS, { recursive: true });
    env.PHOTOCRAFT_CONTROL_TOKEN_FILE = TOKEN_PHOTOCRAFT;
  }
  return env;
}

// ---------------------------------------------------------------------------------------------
// Cliente MCP para o `<app>-cli mcp` de cada app
// ---------------------------------------------------------------------------------------------

class SessaoApp {
  constructor(id, modo) {
    this.id = id;
    this.modo = modo;
    this.proc = null;
    this.pendentes = new Map();
    this.proximoId = 1;
    this.buffer = "";
    this.stderr = "";
    this.ferramentas = null;
    this.pronta = null;
  }

  argumentos() {
    const app = APPS[this.id];
    if (this.modo === "janela") return app.janela(app.porta);
    const args = [...app.arquivo];
    if (app.pastas) {
      fs.mkdirSync(PASTA_SAIDA, { recursive: true });
      args.push("--automation-read-root", PASTA_LEITURA, "--automation-write-root", PASTA_SAIDA);
    }
    return args;
  }

  iniciar() {
    if (this.pronta) return this.pronta;
    this.pronta = (async () => {
      const inst = localizar(this.id);
      if (!inst) throw new Error(`${APPS[this.id].nome} não foi encontrado. Instale pelo ArtCraft Launcher ou informe a pasta de instalação nas configurações do conector.`);
      const args = this.argumentos();
      log(`iniciando ${inst.cli} ${args.join(" ")}`);
      const proc = spawn(inst.cli, args, { env: envDoApp(this.id), windowsHide: true, stdio: ["pipe", "pipe", "pipe"] });
      this.proc = proc;
      proc.stdout.setEncoding("utf8");
      proc.stdin.on("error", () => {}); // app fechado no meio de uma chamada (EPIPE)
      proc.stdout.on("data", (d) => { if (this.proc === proc) this.receber(d); });
      proc.stderr.setEncoding("utf8");
      proc.stderr.on("data", (d) => { this.stderr = (this.stderr + d).slice(-4000); });
      proc.on("error", (e) => { if (this.proc === proc) this.encerrou(`não foi possível iniciar: ${e.message}`); });
      proc.on("exit", (code) => { if (this.proc === proc) this.encerrou(`o servidor do app terminou (código ${code})`); });
      let init;
      try {
        init = await this.pedir("initialize", {
          protocolVersion: "2025-06-18",
          capabilities: {},
          clientInfo: { name: "artcraft-claude", version: VERSAO },
        }, 30000);
      } catch (e) {
        // não deixa um processo meio vivo para trás: a próxima tentativa começa limpa
        if (this.proc === proc) this.proc = null;
        try { proc.kill(); } catch {}
        throw e;
      }
      this.notificar("notifications/initialized", {});
      this.instrucoes = init && init.instructions;
      return this;
    })();
    this.pronta.catch(() => { this.pronta = null; });
    return this.pronta;
  }

  receber(dados) {
    this.buffer += dados;
    let i;
    while ((i = this.buffer.indexOf("\n")) >= 0) {
      const linha = this.buffer.slice(0, i).trim();
      this.buffer = this.buffer.slice(i + 1);
      if (!linha) continue;
      let msg;
      try { msg = JSON.parse(linha); } catch { continue; }
      if (msg.id !== undefined && msg.id !== null && (msg.result !== undefined || msg.error !== undefined) && !msg.method) {
        const p = this.pendentes.get(msg.id);
        if (!p) continue;
        this.pendentes.delete(msg.id);
        clearTimeout(p.timer);
        if (msg.error) p.reject(new Error(msg.error.message || JSON.stringify(msg.error)));
        else p.resolve(msg.result);
      } else if (msg.method && msg.id !== undefined) {
        // Pedido do app para nós (ping, roots/list...): responder para não travar.
        const resposta = msg.method === "ping"
          ? { jsonrpc: "2.0", id: msg.id, result: {} }
          : msg.method === "roots/list"
            ? { jsonrpc: "2.0", id: msg.id, result: { roots: [] } }
            : { jsonrpc: "2.0", id: msg.id, error: { code: -32601, message: "não suportado" } };
        this.escrever(resposta);
      } else if (msg.method === "notifications/tools/list_changed") {
        this.ferramentas = null;
      }
    }
  }

  escrever(obj) {
    if (this.proc && this.proc.stdin.writable) this.proc.stdin.write(JSON.stringify(obj) + "\n");
  }

  notificar(method, params) {
    this.escrever({ jsonrpc: "2.0", method, params });
  }

  pedir(method, params, ms = TEMPO_LIMITE_MS) {
    return new Promise((resolve, reject) => {
      if (!this.proc) return reject(new Error("sessão não iniciada"));
      const id = this.proximoId++;
      const timer = setTimeout(() => {
        this.pendentes.delete(id);
        this.notificar("notifications/cancelled", { requestId: id, reason: "tempo esgotado" });
        reject(new Error(`o app não respondeu em ${Math.round(ms / 1000)} s (a operação pode ter sido aplicada; confira antes de repetir)`));
      }, ms);
      this.pendentes.set(id, { resolve, reject, timer });
      this.escrever({ jsonrpc: "2.0", id, method, params });
    });
  }

  encerrou(motivo) {
    const detalhe = this.stderr.trim() ? `\n${this.stderr.trim().split("\n").slice(-8).join("\n")}` : "";
    for (const p of this.pendentes.values()) {
      clearTimeout(p.timer);
      p.reject(new Error(`${motivo}${detalhe}`));
    }
    this.pendentes.clear();
    this.proc = null;
    this.pronta = null;
    this.ferramentas = null;
    if (sessoes.get(chave(this.id, this.modo)) === this) sessoes.delete(chave(this.id, this.modo));
  }

  async listarFerramentas() {
    await this.iniciar();
    if (this.ferramentas) return this.ferramentas;
    const todas = [];
    let cursor;
    do {
      const r = await this.pedir("tools/list", cursor ? { cursor } : {}, 30000);
      todas.push(...(r.tools || []));
      cursor = r.nextCursor;
    } while (cursor);
    this.ferramentas = todas;
    return todas;
  }

  async chamar(nome, args) {
    await this.iniciar();
    return this.pedir("tools/call", { name: nome, arguments: args || {} });
  }

  fechar() {
    if (this.proc) {
      try { this.proc.stdin.end(); } catch {}
      const p = this.proc;
      setTimeout(() => { try { p.kill(); } catch {} }, 3000);
    }
  }
}

const sessoes = new Map();
const chave = (id, modo) => `${id}:${modo}`;

function sessao(id, modo) {
  const k = chave(id, modo);
  if (!sessoes.has(k)) sessoes.set(k, new SessaoApp(id, modo));
  return sessoes.get(k);
}

// ---------------------------------------------------------------------------------------------
// Ferramentas que o Claude enxerga
// ---------------------------------------------------------------------------------------------

const IDS = Object.keys(APPS);
const textoApps = IDS.map((id) => `${id} = ${APPS[id].area}`).join("; ");

const esquemaApp = { type: "string", enum: IDS, description: `Qual app. ${textoApps}.` };
const esquemaModo = {
  type: "string",
  enum: ["janela", "arquivo"],
  description: "janela (padrão): mexe no app aberto na tela, o usuário vê as mudanças. arquivo: sessão sem janela, para trabalhar direto em arquivos (abrir, editar, exportar). O PdfCraft só tem o modo arquivo.",
};

const FERRAMENTAS = [
  {
    name: "artcraft_status",
    title: "Ver apps ArtCraft",
    description: "Lista os apps ArtCraft instalados, quais estão abertos e prontos para receber comandos, e as pastas que o modo arquivo pode usar. Use primeiro, para saber o que dá para controlar agora.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  },
  {
    name: "artcraft_abrir",
    title: "Abrir app ArtCraft",
    description: "Abre um app ArtCraft com o canal de controle ligado, para o Claude poder executar comandos nele (opcionalmente já abrindo um arquivo). Se o app já estiver aberto sem o canal de controle, avisa: o usuário precisa fechá-lo para o Claude reabrir.",
    inputSchema: {
      type: "object",
      properties: {
        app: esquemaApp,
        arquivo: { type: "string", description: "Caminho absoluto de um arquivo para abrir junto (opcional)." },
      },
      required: ["app"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  },
  {
    name: "artcraft_ferramentas",
    title: "Ver comandos de um app",
    description: "Lista as ferramentas MCP do próprio app (por exemplo command_list, command_run, doc_inspect, render_preview, ui_screenshot). Sem 'ferramenta', traz nome e resumo de cada uma; com 'ferramenta', traz a descrição completa e o esquema de argumentos dela. Use antes de artcraft_usar.",
    inputSchema: {
      type: "object",
      properties: {
        app: esquemaApp,
        modo: esquemaModo,
        ferramenta: { type: "string", description: "Nome exato de uma ferramenta para ver os detalhes completos (opcional)." },
        filtro: { type: "string", description: "Mostra só as ferramentas cujo nome ou descrição contém este texto (opcional)." },
      },
      required: ["app"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  },
  {
    name: "artcraft_usar",
    title: "Executar no app",
    description: "Executa uma ferramenta MCP do app (as listadas por artcraft_ferramentas) e devolve o resultado, inclusive imagens de prévia e capturas de tela. As edições ficam no histórico do app e podem ser desfeitas.",
    inputSchema: {
      type: "object",
      properties: {
        app: esquemaApp,
        modo: esquemaModo,
        ferramenta: { type: "string", description: "Nome da ferramenta do app, por exemplo command_run." },
        argumentos: { type: "object", description: "Argumentos da ferramenta, no formato do esquema dela.", additionalProperties: true },
      },
      required: ["app", "ferramenta"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: false },
  },
  {
    name: "artcraft_encerrar_sessao",
    title: "Encerrar sessão de um app",
    description: "Encerra a conexão do Claude com um app (não fecha a janela do app). No modo arquivo, descarta o documento em memória que não foi salvo. Use para recomeçar do zero ou quando a conexão travar.",
    inputSchema: {
      type: "object",
      properties: { app: esquemaApp, modo: esquemaModo },
      required: ["app"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  },
  {
    name: "artcraft_controle_permanente",
    title: "Ligar controle ao abrir pelo launcher",
    description: "Liga ou desliga, para o usuário do Windows, as variáveis que fazem cada app ArtCraft abrir já com o canal de controle (mesmo aberto pelo ArtCraft Launcher ou pelo menu Iniciar). Vale para os apps abertos depois disso; o launcher precisa ser reiniciado. Só use quando o usuário pedir.",
    inputSchema: {
      type: "object",
      properties: { ativar: { type: "boolean", description: "true liga, false desliga." } },
      required: ["ativar"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  },
];

const INSTRUCOES = [
  "Conector para a suíte ArtCraft (apps de criação open source). O usuário dita ordens de edição em português; você executa nos apps.",
  `Apps: ${textoApps}.`,
  "Fluxo: 1) artcraft_status; 2) se o app não está pronto, artcraft_abrir; 3) artcraft_ferramentas para ver as ferramentas do app;",
  "4) entenda o documento aberto (doc_inspect, ou o equivalente do app) e descubra o comando certo (command_list com filtro, ou o equivalente);",
  "5) execute com artcraft_usar (command_run / command_batch); 6) confira o resultado com render_preview ou ui_screenshot e mostre ao usuário;",
  "7) se ficou errado, desfaça com o comando edit.undo do app.",
  "Nunca salve por cima, exporte sobrescrevendo, apague arquivos ou feche documentos sem o usuário pedir. Prefira trabalhar numa cópia quando a mudança for grande.",
].join(" ");

function texto(t, erro = false) {
  return { content: [{ type: "text", text: t }], isError: erro };
}

function appValido(id) {
  if (!APPS[id]) throw new Error(`app desconhecido: ${id}. Use um destes: ${IDS.join(", ")}`);
  return APPS[id];
}

function modoDe(id, modo) {
  const app = APPS[id];
  if (!app.janela) return "arquivo";
  return modo === "arquivo" ? "arquivo" : "janela";
}

async function exigirJanela(id) {
  const app = APPS[id];
  if (await portaAberta(app.porta)) return;
  const procs = await processosAbertos();
  const aberto = procs && procs.has(id);
  throw new Error(aberto
    ? `${app.nome} está aberto, mas sem o canal de controle (foi aberto pelo launcher ou pelo menu). Peça ao usuário para salvar e fechar o ${app.nome}, e então use artcraft_abrir. Outra opção: modo "arquivo".`
    : `${app.nome} não está aberto. Use artcraft_abrir para abri-lo com o controle ligado, ou use o modo "arquivo".`);
}

async function status() {
  const procs = await processosAbertos();
  const linhas = [];
  for (const id of IDS) {
    const app = APPS[id];
    const inst = localizar(id);
    if (!inst) { linhas.push(`- ${app.nome} (${id}): não encontrado`); continue; }
    const pronto = await portaAberta(app.porta);
    let estado;
    if (!app.janela) estado = "só modo arquivo";
    else if (pronto) estado = `aberto e pronto para comandos (porta ${app.porta})`;
    else if (procs && procs.has(id)) estado = "aberto SEM canal de controle (precisa fechar e reabrir com artcraft_abrir)";
    else estado = "fechado";
    const conectado = [...sessoes.keys()].filter((k) => k.startsWith(id + ":")).map((k) => k.split(":")[1]);
    linhas.push(`- ${app.nome} (${id}): ${estado}${conectado.length ? `; sessão do Claude ativa: ${conectado.join(", ")}` : ""}`);
  }
  linhas.push("", `Modo arquivo: lê em ${PASTA_LEITURA} e grava em ${PASTA_SAIDA} (PhotoCraft, VectorCraft, PdfCraft, EffectCraft, DesignCraft, FigCraft, WordCraft, SoundCraft e DeckCraft respeitam essas pastas).`);
  return texto(linhas.join("\n"));
}

async function abrir({ app: id, arquivo }) {
  const app = appValido(id);
  if (!app.janela) return texto(`${app.nome} não tem canal de controle; use o modo arquivo direto em artcraft_usar.`);
  if (await portaAberta(app.porta)) return texto(`${app.nome} já está aberto e pronto para comandos.`);
  const procs = await processosAbertos();
  if (procs && procs.has(id)) {
    return texto(`${app.nome} já está aberto, mas sem o canal de controle. Peça ao usuário para salvar e fechar o ${app.nome}; depois chame artcraft_abrir de novo.`, true);
  }
  const inst = localizar(id);
  if (!inst || !inst.exe) return texto(`Não encontrei o executável do ${app.nome}.`, true);
  const args = arquivo ? [arquivo] : [];
  const filho = spawn(inst.exe, args, { env: envDoApp(id), detached: true, stdio: "ignore", windowsHide: false, cwd: inst.pasta });
  filho.on("error", (e) => log(`falha ao abrir ${id}: ${e.message}`));
  filho.unref();
  for (let i = 0; i < 90; i++) {
    await esperar(500);
    if (await portaAberta(app.porta, 400)) return texto(`${app.nome} aberto e pronto para comandos.`);
  }
  return texto(`Mandei abrir o ${app.nome}, mas o canal de controle não respondeu em 45 s. Confira se a janela abriu; se abriu, tente artcraft_status de novo em instantes.`, true);
}

function resumo(desc) {
  const d = (desc || "").replace(/\s+/g, " ").trim();
  const m = d.match(/^(.{0,220}?[.!?])(\s|$)/);
  return m ? m[1] : d.slice(0, 220);
}

async function ferramentas({ app: id, modo, ferramenta, filtro }) {
  const app = appValido(id);
  const m = modoDe(id, modo);
  if (m === "janela") await exigirJanela(id);
  const s = sessao(id, m);
  const lista = await s.listarFerramentas();
  if (ferramenta) {
    const t = lista.find((x) => x.name === ferramenta);
    if (!t) return texto(`${app.nome} não tem a ferramenta ${ferramenta}. Disponíveis: ${lista.map((x) => x.name).join(", ")}`, true);
    return texto(JSON.stringify({ name: t.name, description: t.description, inputSchema: t.inputSchema }, null, 2));
  }
  const f = (filtro || "").toLowerCase();
  const escolhidas = lista.filter((t) => !f || t.name.toLowerCase().includes(f) || (t.description || "").toLowerCase().includes(f));
  const linhas = escolhidas.map((t) => `- ${t.name}: ${resumo(t.description)}`);
  const cabecalho = `${app.nome}, modo ${m}: ${escolhidas.length} de ${lista.length} ferramentas.`;
  const extra = s.instrucoes ? `\n\nInstruções do próprio app:\n${s.instrucoes}` : "";
  return texto(`${cabecalho}\n${linhas.join("\n")}${extra}`);
}

async function usar({ app: id, modo, ferramenta, argumentos }) {
  appValido(id);
  if (!ferramenta) throw new Error("informe a ferramenta");
  const m = modoDe(id, modo);
  if (m === "janela") await exigirJanela(id);
  const r = await sessao(id, m).chamar(ferramenta, argumentos);
  return { content: r.content || [{ type: "text", text: JSON.stringify(r) }], isError: !!r.isError, ...(r.structuredContent ? { structuredContent: r.structuredContent } : {}) };
}

function encerrar({ app: id, modo }) {
  const app = appValido(id);
  const modos = modo ? [modoDe(id, modo)] : ["janela", "arquivo"];
  let n = 0;
  for (const m of modos) {
    const s = sessoes.get(chave(id, m));
    if (s) { s.fechar(); sessoes.delete(chave(id, m)); n++; }
  }
  return texto(n ? `Sessão com o ${app.nome} encerrada.` : `Não havia sessão aberta com o ${app.nome}.`);
}

function rodar(cmd, args) {
  return new Promise((resolve) => execFile(cmd, args, { windowsHide: true }, (err, out, errOut) => resolve({ ok: !err, msg: (errOut || out || "").trim() })));
}

async function controlePermanente({ ativar }) {
  if (!WINDOWS) return texto("Essa opção é só para Windows. No Linux/macOS, exporte as variáveis <APP>_CONTROL_PORT no seu perfil do shell.", true);
  const vars = IDS.filter((id) => APPS[id].porta).map((id) => [varPorta(id), String(APPS[id].porta)]);
  vars.push(["PHOTOCRAFT_CONTROL_TOKEN_FILE", TOKEN_PHOTOCRAFT]);
  fs.mkdirSync(DADOS, { recursive: true });
  const falhas = [];
  for (const [nome, valor] of vars) {
    const r = ativar ? await rodar("setx", [nome, valor]) : await rodar("reg", ["delete", "HKCU\\Environment", "/v", nome, "/f"]);
    if (!r.ok && ativar) falhas.push(`${nome}: ${r.msg}`);
  }
  if (falhas.length) return texto(`Algumas variáveis falharam:\n${falhas.join("\n")}`, true);
  return texto(ativar
    ? "Pronto: os apps ArtCraft vão abrir com o canal de controle ligado, inclusive pelo launcher. Feche e reabra o ArtCraft Launcher (e os apps que estiverem abertos) para valer. O canal só aceita conexões do próprio computador."
    : "Pronto: as variáveis foram removidas. Apps abertos pelo launcher voltam ao normal depois de reabertos; o Claude ainda pode abri-los com artcraft_abrir.");
}

// Usado pelo quadro: garante o app aberto e com o canal de controle antes de mandar arquivos.
async function prepararApp(id) {
  if (await portaAberta(APPS[id].porta)) return;
  const r = await abrir({ app: id });
  if (r.isError) throw new Error(r.content[0].text);
}

const quadro = require("./quadro")({
  DADOS, log, VERSAO, prepararApp, sessao, appAberto: (id) => portaAberta(APPS[id].porta),
  atualizacao: () => atualizar.pronta(), controlePermanente,
  origemAtualizacao: { ler: atualizar.lerOrigem, gravar: (u) => { const r = atualizar.gravarOrigem(u); atualizar.verificar(VERSAO, log).catch((e) => log(`atualização: ${e.message}`)); return r; } }, appRodando: async (id) => { const p = await processosAbertos(); return p ? p.has(id) : null; },
  abrirApp: (id, arquivo) => abrir({ app: id, arquivo }), pastaDoApp: (id) => (localizar(id) || {}).pasta,
});
FERRAMENTAS.push(...quadro.FERRAMENTAS);

const EXECUTORES = {
  ...quadro.EXECUTORES,
  artcraft_status: status,
  artcraft_abrir: abrir,
  artcraft_ferramentas: ferramentas,
  artcraft_usar: usar,
  artcraft_encerrar_sessao: encerrar,
  artcraft_controle_permanente: controlePermanente,
};

// ---------------------------------------------------------------------------------------------
// Servidor MCP (stdio, JSON por linha)
// ---------------------------------------------------------------------------------------------

function responder(id, result) {
  process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, result }) + "\n");
}

function erro(id, code, message) {
  process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } }) + "\n");
}

async function tratar(msg) {
  if (!msg || typeof msg !== "object" || Array.isArray(msg)) return erro(null, -32600, "requisição inválida");
  const { id, method, params } = msg;
  const ehPedido = id !== undefined && id !== null;
  try {
    switch (method) {
      case "initialize":
        return responder(id, {
          protocolVersion: (params && params.protocolVersion) || "2025-06-18",
          capabilities: { tools: { listChanged: false } },
          serverInfo: { name: "artcraft", title: "ArtCraft", version: VERSAO },
          instructions: `${INSTRUCOES} ${quadro.INSTRUCOES}`,
        });
      case "ping":
        return ehPedido && responder(id, {});
      case "tools/list":
        return responder(id, { tools: FERRAMENTAS });
      case "tools/call": {
        const nome = params && params.name;
        const fn = EXECUTORES[nome];
        if (!fn) return erro(id, -32602, `ferramenta desconhecida: ${nome}`);
        try {
          return responder(id, await fn((params && params.arguments) || {}));
        } catch (e) {
          return responder(id, texto(e.message || String(e), true));
        }
      }
      default:
        if (ehPedido && !String(method).startsWith("notifications/")) erro(id, -32601, `método não suportado: ${method}`);
    }
  } catch (e) {
    if (ehPedido) erro(id, -32603, e.message || String(e));
  }
}

function principal() {
  let buffer = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (d) => {
    buffer += d;
    let i;
    while ((i = buffer.indexOf("\n")) >= 0) {
      const linha = buffer.slice(0, i).trim();
      buffer = buffer.slice(i + 1);
      if (!linha) continue;
      let msg;
      try { msg = JSON.parse(linha); } catch { erro(null, -32700, "JSON inválido"); continue; }
      tratar(msg);
    }
  });
  process.stdin.on("end", () => {
    quadro.parar();
    for (const s of sessoes.values()) s.fechar();
    setTimeout(() => process.exit(0), 500);
  });
  quadro.iniciar().catch((e) => log(`quadro: ${e.message}`));
  atualizar.acompanhar(VERSAO, log);
  setTimeout(atualizar.marcarBom, 20000).unref(); // ficou de pé: o pacote baixado é bom
  log(`ArtCraft para Claude ${VERSAO} pronto`);
}

// Um erro solto numa chamada não pode derrubar o conector inteiro (e levar o Claude a perder as ferramentas).
process.on("uncaughtException", (e) => process.stderr.write(`[artcraft] erro: ${e && e.stack || e}\n`));
process.on("unhandledRejection", (e) => process.stderr.write(`[artcraft] erro: ${e && e.stack || e}\n`));

// `node index.js --quadro`: só o quadro, sem o Claude (útil para abrir o quadro direto).
if (ehEntrada) {
  let ehExe = false;
  try { ehExe = require("node:sea").isSea(); } catch {}
  if (ehExe || process.argv.includes("--quadro")) programaQuadro(ehExe);
  else principal();
}

// Atalho "Quadro ArtCraft" na Área de Trabalho, com o ícone do programa. Criado na primeira
// abertura de cada local do .exe; se a pessoa apagar o atalho depois, não é recriado.
function criarAtalho() {
  if (!WINDOWS) return;
  const marca = path.join(atualizar.PASTA, "atalho.json");
  try { if (JSON.parse(fs.readFileSync(marca, "utf8")).alvo === process.execPath) return; } catch {}
  // o ícone vai junto do pacote, assim o atalho fica certo também depois de uma atualização automática
  let ico = process.execPath;
  try {
    const dados = globalThis.__QUADRO_ICO ? Buffer.from(globalThis.__QUADRO_ICO, "base64") : fs.readFileSync(path.join(__dirname, "..", "assets", "icone.ico"));
    fs.mkdirSync(atualizar.PASTA, { recursive: true });
    ico = path.join(atualizar.PASTA, "icone.ico");
    fs.writeFileSync(ico, dados);
  } catch {}
  const ps = `$d=[Environment]::GetFolderPath('Desktop');$s=(New-Object -ComObject WScript.Shell).CreateShortcut((Join-Path $d 'Quadro ArtCraft.lnk'));`
    + `$s.TargetPath=$env:QUADRO_EXE;$s.WorkingDirectory=(Split-Path $env:QUADRO_EXE);$s.IconLocation=$env:QUADRO_ICO;$s.Description='Quadro ArtCraft';$s.Save()`;
  execFile("powershell.exe", ["-NoProfile", "-NonInteractive", "-WindowStyle", "Hidden", "-Command", ps], { env: { ...process.env, QUADRO_EXE: process.execPath, QUADRO_ICO: ico.endsWith(".ico") ? ico : `${ico},0` }, windowsHide: true, timeout: 20000 }, (e) => {
    if (e) return log(`atalho: ${e.message}`);
    try { fs.mkdirSync(atualizar.PASTA, { recursive: true }); fs.writeFileSync(marca, JSON.stringify({ alvo: process.execPath })); } catch {}
  });
}

// Modo programa: abre o quadro no navegador e fica rodando até fechar a janela.
function programaQuadro(ehExe) {
  const url = `${quadro.URL_QUADRO}/`;
  const abrirNavegador = () => {
    const [cmd, args] = WINDOWS ? ["rundll32", ["url.dll,FileProtocolHandler", url]] : process.platform === "darwin" ? ["open", [url]] : ["xdg-open", [url]];
    try { const p = spawn(cmd, args, { detached: true, stdio: "ignore", windowsHide: true }); p.on("error", () => {}); p.unref(); } catch {}
  };
  const sair = (codigo) => { quadro.parar(); setTimeout(() => process.exit(codigo), 300); };
  const reinicio = process.argv.includes("--reinicio");
  // Reiniciar para atualizar: abre uma cópia nova (que espera esta sair) e fecha esta.
  quadro.definirReinicio(() => {
    const args = process.argv.slice(1).filter((a) => a !== "--reinicio" && !(ehExe && a === process.execPath)).concat("--reinicio");
    const filho = spawn(process.execPath, ehExe ? args.filter((a) => a.startsWith("--")) : args, { detached: true, stdio: "ignore", windowsHide: false });
    filho.unref();
    sair(0);
  });
  atualizar.acompanhar(VERSAO, log);
  setTimeout(atualizar.marcarBom, 20000).unref();
  (reinicio ? esperar(1500) : Promise.resolve()).then(() => quadro.iniciar()).then((estado) => {
    if (estado === "outro") {
      process.stdout.write(`\n  O quadro já está rodando (aberto pelo Claude). Abrindo ${url}\n`);
      abrirNavegador();
      return setTimeout(() => process.exit(0), 4000);
    }
    process.stdout.write(`\n  Quadro de Cenas ArtCraft ${VERSAO}\n  Aberto em ${url}\n  Arquivos em ${quadro.RAIZ}\n\n  Deixe esta janela aberta enquanto usa o quadro. Para parar, feche a janela.\n\n`);
    if (!reinicio && (ehExe || process.argv.includes("--abrir"))) abrirNavegador();
    if (ehExe && !reinicio) criarAtalho();
  }, (e) => {
    process.stdout.write(`\n  Não consegui iniciar o quadro: ${e.message}\n`);
    if (ehExe) setTimeout(() => sair(1), 15000); else sair(1);
  });
  process.on("SIGINT", () => sair(0));
}

module.exports = { APPS, localizar, SessaoApp, quadro, tratar };
