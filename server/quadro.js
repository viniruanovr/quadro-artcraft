// Quadro de cenas: um quadro de nós (estilo Miro/Blender) que roda no navegador em localhost.
//
// O usuário sobe imagens (personagem, cenário), liga os nós com "fios" e escreve no fio o que
// gerar. O nó "Gerar" junta as referências e o texto dos fios, gera a foto ou o vídeo pela API
// da ArtCraft (ou fal.ai), guarda as versões e envia o resultado para o FilmCraft / EffectCraft,
// numa pasta (bin) com o nome da cena. O Claude lê e edita o mesmo quadro pelas ferramentas MCP.
//
// Tudo fica em arquivos comuns: <pasta do quadro>/<projeto>/quadro.json e midia/.

"use strict";

const { spawn } = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");

const WINDOWS = process.platform === "win32";

function lerConfig(nome) {
  const v = (process.env[nome] || "").trim();
  return v && !v.startsWith("${") ? v : "";
}

const RAIZ = lerConfig("ARTCRAFT_QUADRO_PASTA") || path.join(os.homedir(), "Documents", "ArtCraft Quadro");
const PORTA = Number(lerConfig("ARTCRAFT_QUADRO_PORTA") || 7700);
const URL_QUADRO = `http://localhost:${PORTA}`;
const WEB = path.join(__dirname, "web");
// No programa .exe os arquivos da tela vão embutidos (globalThis.__QUADRO_WEB = {nome: texto}).
const WEB_EMBUTIDO = globalThis.__QUADRO_WEB || null;

const EXT_IMAGEM = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"]);
const EXT_VIDEO = new Set([".mp4", ".mov", ".webm", ".mkv", ".m4v"]);
const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".gif": "image/gif", ".bmp": "image/bmp", ".mp4": "video/mp4", ".mov": "video/quicktime", ".webm": "video/webm",
  ".mkv": "video/x-matroska", ".m4v": "video/mp4", ".json": "application/json",
};

// ---------------------------------------------------------------------------------------------
// Modelos de geração
// ---------------------------------------------------------------------------------------------

const MODELOS = {
  artcraft: {
    imagem: ["nano_banana_pro", "nano_banana_2", "nano_banana", "gpt_image_2", "gpt_image_2p5_flare", "gpt_image_1p5",
      "seedream_5p0_pro", "seedream_5p0_pro_u", "seedream_4p5", "flux_pro_1p1_ultra", "flux_1_dev"],
    video: ["seedance_2p0", "seedance_2p0_fast", "seedance_1p5_pro", "kling_2p6_pro", "kling_2p5_turbo_pro", "veo_3p1",
      "veo_3p1_fast", "veo_3p1_lite", "vidu_q3", "vidu_q3_turbo", "minimax_h3", "flux_3"],
  },
  fal: {
    imagem: ["fal-ai/nano-banana-pro/edit", "fal-ai/nano-banana/edit", "fal-ai/bytedance/seedream/v4/edit", "fal-ai/flux-pro/kontext"],
    video: ["fal-ai/kling-video/v2.5-turbo/pro/image-to-video", "fal-ai/veo3.1/fast/image-to-video", "fal-ai/bytedance/seedance/v1/pro/image-to-video"],
  },
};

const PROPORCAO_ARTCRAFT = {
  "16:9": "wide_sixteen_by_nine", "9:16": "tall_nine_by_sixteen", "1:1": "square", "4:3": "wide_four_by_three",
  "3:4": "tall_three_by_four", "21:9": "wide_twenty_one_by_nine", "4:5": "tall_four_by_five", "3:2": "wide_three_by_two",
};

// ---------------------------------------------------------------------------------------------
// Configuração do quadro (motor e chaves). As chaves do Claude Desktop vêm por variável de
// ambiente; as digitadas no quadro ficam no computador, na pasta de dados do conector.
// ---------------------------------------------------------------------------------------------

module.exports = function criarQuadro({
  DADOS, log, VERSAO, prepararApp, sessao, appAberto = async () => false, appRodando = async () => null,
  atualizacao = () => null, controlePermanente = null, origemAtualizacao = null, abrirApp = null, pastaDoApp = () => null,
}) {
  let reiniciar = null;
  const ARQ_CONFIG = path.join(DADOS, "quadro-config.json");

  // Só devolve o padrão se o arquivo não existe. Arquivo ilegível/quebrado é guardado ao lado
  // (.corrompido-…) e vira erro: assim ele nunca é regravado por cima de um projeto ou de chaves.
  function lerJson(arq, padrao) {
    let texto;
    try { texto = fs.readFileSync(arq, "utf8"); } catch (e) {
      if (e.code === "ENOENT") return padrao;
      throw new Error(`não consegui ler ${arq}: ${e.message}`);
    }
    try { return JSON.parse(texto.replace(/^\uFEFF/, "")); } catch {
      const guardado = `${arq}.corrompido-${Date.now()}`;
      try { fs.copyFileSync(arq, guardado); } catch {}
      throw new Error(`${path.basename(arq)} está danificado (cópia em ${guardado})`);
    }
  }

  const esperaSincrona = (ms) => { try { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms); } catch {} };
  function gravarJson(arq, obj) {
    fs.mkdirSync(path.dirname(arq), { recursive: true });
    const tmp = `${arq}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(obj, null, 1));
    // OneDrive/antivírus às vezes seguram o arquivo por instantes (EPERM/EBUSY no Windows)
    for (let i = 0; ; i++) {
      try { fs.renameSync(tmp, arq); return; } catch (e) {
        if (i >= 5) {
          try { fs.writeFileSync(arq, fs.readFileSync(tmp)); fs.rmSync(tmp, { force: true }); return; } catch { fs.rmSync(tmp, { force: true }); throw e; }
        }
        esperaSincrona(80 * (i + 1));
      }
    }
  }

  function config() {
    let c = {};
    try { c = lerJson(ARQ_CONFIG, {}); } catch (e) { log(e.message); }
    const artcraftKey = c.artcraftKey || lerConfig("ARTCRAFT_API_KEY");
    const falKey = c.falKey || lerConfig("FAL_KEY");
    const motor = c.motor || (artcraftKey ? "artcraft" : falKey ? "fal" : "manual");
    return { motor, artcraftKey, falKey, ativo: c.ativo || "", comfyUrl: String(c.comfyUrl || "http://127.0.0.1:8188").replace(/\/+$/, "") };
  }

  function salvarConfig(mudancas) {
    const c = lerJson(ARQ_CONFIG, {});
    for (const k of ["motor", "artcraftKey", "falKey", "ativo", "comfyUrl"]) if (mudancas[k] !== undefined) c[k] = mudancas[k];
    gravarJson(ARQ_CONFIG, c);
  }

  // -------------------------------------------------------------------------------------------
  // Projetos e documento do quadro
  // -------------------------------------------------------------------------------------------

  const limparNome = (s) => {
    let n = String(s || "").replace(/[<>:"/\\|?*\x00-\x1f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80).replace(/[. ]+$/, "");
    if (/^(con|prn|aux|nul|com\d|lpt\d)(\..*)?$/i.test(n)) n = `_${n}`; // nomes reservados do Windows
    return n;
  };
  const pastaProjeto = (p) => path.join(RAIZ, p);
  const docs = new Map();
  const timersSalvar = new Map();

  function listarProjetos() {
    try {
      return fs.readdirSync(RAIZ, { withFileTypes: true })
        .filter((d) => d.isDirectory() && fs.existsSync(path.join(RAIZ, d.name, "quadro.json")))
        .map((d) => d.name).sort((a, b) => a.localeCompare(b));
    } catch { return []; }
  }

  function projetoAtivo(pedido) {
    if (pedido) return limparNome(pedido);
    const c = config();
    const lista = listarProjetos();
    if (c.ativo && lista.includes(c.ativo)) return c.ativo;
    return lista[0] || "Meu projeto";
  }

  function novoDoc(nome) {
    return {
      versao: 1, nome, seq: 2, rev: 0,
      cenas: [{ id: "c1", nome: "Cena 1" }],
      nos: [], ligacoes: [], midias: {},
    };
  }

  function carregar(proj) {
    proj = limparNome(proj) || "Meu projeto";
    if (docs.has(proj)) return docs.get(proj);
    const arq = path.join(pastaProjeto(proj), "quadro.json");
    let doc = lerJson(arq, null);
    if (!doc) {
      doc = novoDoc(proj);
      fs.mkdirSync(path.join(pastaProjeto(proj), "midia"), { recursive: true });
      gravarJson(arq, doc);
    }
    doc.nome = proj;
    docs.set(proj, doc);
    return doc;
  }

  function salvar(doc) {
    doc.rev++;
    clearTimeout(timersSalvar.get(doc.nome));
    timersSalvar.set(doc.nome, setTimeout(() => {
      try { gravarJson(path.join(pastaProjeto(doc.nome), "quadro.json"), doc); } catch (e) {
        log(`quadro: falha ao salvar ${doc.nome}: ${e.message}; tento de novo em 5 s`);
        timersSalvar.set(doc.nome, setTimeout(() => salvar(doc), 5000));
      }
    }, 150));
    avisar(doc.nome, { tipo: "quadro", rev: doc.rev });
  }

  // Desfazer / refazer: fotos do estado do quadro antes de cada mudança feita pela pessoa ou pelo
  // Claude. O que a geração faz (versões, progresso) não se desfaz: é mantido ao restaurar.
  const historico = new Map(); // nome → { antes: [json], depois: [json] }
  const hist = (doc) => { if (!historico.has(doc.nome)) historico.set(doc.nome, { antes: [], depois: [] }); return historico.get(doc.nome); };
  function marcarHistorico(doc) {
    const h = hist(doc);
    h.antes.push(JSON.stringify({ cenas: doc.cenas, nos: doc.nos, ligacoes: doc.ligacoes }));
    if (h.antes.length > 60) h.antes.shift();
    h.depois = [];
  }
  function voltarHistorico(doc, refazer) {
    const h = hist(doc);
    const de = refazer ? h.depois : h.antes, para = refazer ? h.antes : h.depois;
    if (!de.length) return false;
    para.push(JSON.stringify({ cenas: doc.cenas, nos: doc.nos, ligacoes: doc.ligacoes }));
    const v = JSON.parse(de.pop());
    const vivos = new Map(doc.nos.filter((n) => n.tipo === "gerar").map((n) => [n.id, n]));
    // nós Gerar que ainda existem mantêm o MESMO objeto: uma geração em andamento escreve nele
    const GER = ["versoes", "atual", "estado", "job", "progresso", "erro", "envios"];
    v.nos = v.nos.map((n) => {
      const agora = vivos.get(n.id);
      if (!agora) { if (n.estado === "gerando") { n.estado = n.versoes && n.versoes.length ? "pronto" : "vazio"; delete n.job; delete n.progresso; } return n; }
      const guardado = Object.fromEntries(GER.map((k) => [k, agora[k]]));
      for (const k of Object.keys(agora)) delete agora[k];
      return Object.assign(agora, n, guardado);
    });
    Object.assign(doc, v);
    salvar(doc);
    return true;
  }

  // Volta o documento para uma cópia em JSON mantendo os mesmos objetos de nó (uma geração em
  // andamento guarda o objeto do nó e continua escrevendo nele).
  function restaurarDoc(doc, copia) {
    const vivos = new Map(doc.nos.map((n) => [n.id, n]));
    const v = JSON.parse(copia);
    v.nos = v.nos.map((n) => {
      const a = vivos.get(n.id);
      if (!a) return n;
      for (const k of Object.keys(a)) delete a[k];
      return Object.assign(a, n);
    });
    Object.assign(doc, v);
  }

  function salvarJa() {
    for (const [nome, t] of timersSalvar) {
      clearTimeout(t);
      const doc = docs.get(nome);
      if (doc) try { gravarJson(path.join(pastaProjeto(nome), "quadro.json"), doc); } catch {}
    }
    timersSalvar.clear();
  }

  function novoId(doc, prefixo) {
    const usados = new Set([...doc.cenas, ...doc.nos, ...doc.ligacoes].map((x) => x.id).concat(Object.keys(doc.midias)));
    let id;
    do id = `${prefixo}${doc.seq++}`; while (usados.has(id));
    return id;
  }
  const acharNo = (doc, id) => doc.nos.find((n) => n.id === id);
  const acharCena = (doc, idOuNome) => {
    if (!idOuNome) return null;
    const s = String(idOuNome).toLowerCase().trim();
    return doc.cenas.find((c) => c.id === idOuNome) || doc.cenas.find((c) => c.nome.toLowerCase() === s)
      || doc.cenas.find((c) => c.nome.toLowerCase().replace(/^cena\s*0*/, "") === s.replace(/^cena\s*0*/, ""));
  };

  // -------------------------------------------------------------------------------------------
  // Mídia
  // -------------------------------------------------------------------------------------------

  function tipoPorExt(nome) {
    const ext = path.extname(nome).toLowerCase();
    if (EXT_IMAGEM.has(ext)) return "imagem";
    if (EXT_VIDEO.has(ext)) return "video";
    return null;
  }

  function nomeLivre(doc, desejado) {
    const pasta = path.join(pastaProjeto(doc.nome), "midia");
    fs.mkdirSync(pasta, { recursive: true });
    const ext = path.extname(desejado).toLowerCase();
    const base = limparNome(path.basename(desejado, path.extname(desejado))) || "midia";
    let nome = `${base}${ext}`;
    for (let i = 2; fs.existsSync(path.join(pasta, nome)); i++) nome = `${base} (${i})${ext}`;
    return nome;
  }

  // Largura e altura de PNG/JPEG/WebP lendo só o cabeçalho (para posicionar os nós sem sobrepor).
  function dimensoes(b) {
    try {
      if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
      if (b[0] === 0xff && b[1] === 0xd8) {
        let i = 2;
        while (i + 9 < b.length) {
          if (b[i] !== 0xff) { i++; continue; }
          const m = b[i + 1];
          if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) };
          i += 2 + b.readUInt16BE(i + 2);
        }
      }
      if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
        const t = b.toString("ascii", 12, 16);
        if (t === "VP8X") return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
        if (t === "VP8 ") return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
        if (t === "VP8L") { const v = b.readUInt32LE(21); return { w: 1 + (v & 0x3fff), h: 1 + ((v >> 14) & 0x3fff) }; }
      }
    } catch {}
    return null;
  }

  function registrarMidia(doc, nomeArquivo, origem, extra = {}) {
    const tipo = tipoPorExt(nomeArquivo);
    const id = novoId(doc, "m");
    doc.midias[id] = { id, arquivo: nomeArquivo, tipo, origem, criado: new Date().toISOString(), ...extra };
    return doc.midias[id];
  }

  function guardarBytes(doc, nomeDesejado, bytes, origem, extra) {
    if (!tipoPorExt(nomeDesejado)) throw new Error(`formato não suportado: ${path.extname(nomeDesejado) || nomeDesejado} (use imagem png/jpg/webp ou vídeo mp4/mov/webm)`);
    const hash = crypto.createHash("sha1").update(bytes).digest("hex").slice(0, 16);
    const igual = Object.values(doc.midias).find((m) => m.hash === hash && fs.existsSync(caminhoMidia(doc, m)));
    if (igual && origem !== "gerado") return igual; // o mesmo arquivo de novo: reusa, sem duplicar
    extra = { ...extra, hash };
    const nome = nomeLivre(doc, nomeDesejado);
    fs.writeFileSync(path.join(pastaProjeto(doc.nome), "midia", nome), bytes);
    return registrarMidia(doc, nome, origem, { ...(dimensoes(bytes) || {}), ...extra });
  }

  function importarArquivo(doc, caminho) {
    if (!path.isAbsolute(caminho)) throw new Error(`use o caminho completo do arquivo: ${caminho}`);
    if (!fs.existsSync(caminho)) throw new Error(`arquivo não encontrado: ${caminho}`);
    return guardarBytes(doc, path.basename(caminho), fs.readFileSync(caminho), "importado");
  }

  const caminhoMidia = (doc, m) => path.join(pastaProjeto(doc.nome), "midia", m.arquivo);
  const caminhoMini = (doc, id) => path.join(pastaProjeto(doc.nome), "miniaturas", `${id}.jpg`);
  const midiaDoNo = (doc, no) => {
    const id = no.tipo === "gerar" ? no.atual : no.trecho && no.trechoMidia && doc.midias[no.trechoMidia] ? no.trechoMidia : no.midia;
    return id ? doc.midias[id] || null : null;
  };

  // -------------------------------------------------------------------------------------------
  // Operações (as mesmas para o quadro no navegador e para o Claude)
  // -------------------------------------------------------------------------------------------

  const CAMPOS_NO = ["titulo", "texto", "prompt", "saida", "modelo", "proporcao", "duracao", "motor", "x", "y", "w", "cor", "trecho"];

  function aplicarOps(doc, ops) {
    const refs = {};
    const res = (v) => (v && refs[v]) || v;
    const semPosicao = [];
    const criados = [];
    for (const op of ops || []) {
      switch (op.op) {
        case "cena": {
          let c = op.id ? acharCena(doc, op.id) : null;
          if (!c) {
            c = { id: novoId(doc, "c"), nome: limparNome(op.nome) || `Cena ${doc.cenas.length + 1}` };
            doc.cenas.push(c);
            criados.push(c.id);
          } else if (op.nome) c.nome = limparNome(op.nome);
          if (op.notas !== undefined) c.notas = String(op.notas);
          if (op.ref) refs[op.ref] = c.id;
          break;
        }
        case "remover_cena": {
          const c = acharCena(doc, res(op.id));
          if (!c) throw new Error(`cena não encontrada: ${op.id}`);
          if (doc.cenas.length === 1) throw new Error("o quadro precisa de pelo menos uma cena");
          const ids = new Set(doc.nos.filter((n) => n.cena === c.id).map((n) => n.id));
          doc.nos = doc.nos.filter((n) => !ids.has(n.id));
          doc.ligacoes = doc.ligacoes.filter((l) => !ids.has(l.de) && !ids.has(l.para));
          doc.cenas = doc.cenas.filter((x) => x !== c);
          break;
        }
        case "no": {
          let no = op.id ? acharNo(doc, res(op.id)) : null;
          if (op.id && !no) throw new Error(`nó não encontrado: ${op.id}`);
          if (!no) {
            const tipo = op.tipo || (op.arquivo || op.midia ? "midia" : "gerar");
            if (!["midia", "gerar", "nota"].includes(tipo)) throw new Error(`tipo de nó inválido: ${tipo} (use midia, gerar ou nota)`);
            const cena = acharCena(doc, res(op.cena)) || doc.cenas[0];
            no = { id: novoId(doc, "n"), cena: cena.id, tipo, titulo: "" };
            if (tipo === "gerar") Object.assign(no, { saida: "imagem", proporcao: "16:9", duracao: 5, estado: "vazio", versoes: [], atual: null, prompt: "" });
            if (tipo === "nota") no.texto = "";
            doc.nos.push(no);
            criados.push(no.id);
            if (op.x === undefined || op.y === undefined) semPosicao.push(no);
          }
          if (op.ref) refs[op.ref] = no.id;
          if (op.cena && op.id) { const c = acharCena(doc, res(op.cena)); if (c) no.cena = c.id; }
          for (const k of CAMPOS_NO) {
            if (op[k] === undefined) continue;
            if (["x", "y", "w", "duracao"].includes(k)) { if (Number.isFinite(Number(op[k]))) no[k] = Number(op[k]); }
            else if (k === "trecho") no[k] = !!op[k];
            else no[k] = String(op[k]);
          }
          if (no.saida) no.saida = String(no.saida).trim().toLowerCase().normalize("NFD").replace(/\p{M}/gu, "") === "video" ? "video" : "imagem";
          if (op.arquivo) {
            const m = importarArquivo(doc, op.arquivo);
            if (no.tipo === "gerar") adicionarVersao(no, m.id); else no.midia = m.id;
            if (!no.titulo) no.titulo = path.basename(op.arquivo, path.extname(op.arquivo));
          }
          if (op.midia) {
            if (!doc.midias[op.midia]) throw new Error(`mídia não encontrada: ${op.midia}`);
            if (no.tipo === "gerar") adicionarVersao(no, op.midia); else no.midia = op.midia;
          }
          break;
        }
        case "ligar": {
          const de = acharNo(doc, res(op.de));
          const para = acharNo(doc, res(op.para));
          if (!de || !para) throw new Error(`ligação com nó inexistente: ${op.de} → ${op.para}`);
          if (para.tipo !== "gerar") throw new Error(`o fio precisa terminar num nó Gerar (${para.id} é ${para.tipo})`);
          if (de.id === para.id) throw new Error("um nó não pode ligar nele mesmo");
          if (cria_ciclo(doc, de.id, para.id)) throw new Error("essa ligação faria um ciclo");
          let l = op.id ? doc.ligacoes.find((x) => x.id === op.id) : doc.ligacoes.find((x) => x.de === de.id && x.para === para.id);
          if (!l) {
            l = { id: novoId(doc, "l"), de: de.id, para: para.id, texto: "" };
            doc.ligacoes.push(l);
            criados.push(l.id);
          }
          if (op.texto !== undefined) l.texto = String(op.texto);
          if (op.ref) refs[op.ref] = l.id;
          break;
        }
        case "texto_ligacao": {
          const l = doc.ligacoes.find((x) => x.id === res(op.id));
          if (!l) throw new Error(`ligação não encontrada: ${op.id}`);
          l.texto = String(op.texto || "");
          break;
        }
        case "remover": {
          const id = res(op.id);
          if (doc.ligacoes.some((l) => l.id === id)) doc.ligacoes = doc.ligacoes.filter((l) => l.id !== id);
          else if (acharNo(doc, id)) {
            doc.nos = doc.nos.filter((n) => n.id !== id);
            doc.ligacoes = doc.ligacoes.filter((l) => l.de !== id && l.para !== id);
          } else throw new Error(`nada com o id ${op.id}`);
          break;
        }
        case "versao": {
          const no = acharNo(doc, res(op.no));
          if (!no || no.tipo !== "gerar" || !no.versoes.includes(op.midia)) throw new Error("versão inválida");
          no.atual = op.midia;
          break;
        }
        case "mover": {
          for (const it of op.nos || []) {
            const no = acharNo(doc, it.id);
            if (no && Number.isFinite(Number(it.x)) && Number.isFinite(Number(it.y))) { no.x = Math.round(Number(it.x)); no.y = Math.round(Number(it.y)); }
          }
          break;
        }
        default:
          throw new Error(`operação desconhecida: ${op.op}`);
      }
    }
    posicionar(doc, semPosicao);
    return { refs, criados };
  }

  function cria_ciclo(doc, de, para) {
    // para → ... → de já existe?
    const pilha = [para];
    const vistos = new Set();
    while (pilha.length) {
      const atual = pilha.pop();
      if (atual === de) return true;
      if (vistos.has(atual)) continue;
      vistos.add(atual);
      for (const l of doc.ligacoes) if (l.de === atual) pilha.push(l.para);
    }
    return false;
  }

  function adicionarVersao(no, midiaId) {
    if (!no.versoes.includes(midiaId)) no.versoes.push(midiaId);
    no.atual = midiaId;
    no.estado = "pronto";
    no.erro = "";
  }

  // Nós criados sem posição (pelo Claude): entradas à esquerda, nó Gerar à direita delas.
  function alturaEstimada(doc, n) {
    if (n.tipo === "nota") return 200;
    const m = midiaDoNo(doc, n);
    const img = m && m.w && m.h ? Math.min(320, Math.round(((n.tipo === "gerar" ? 300 : 240) * m.h) / m.w)) : 180;
    return 40 + img + (n.tipo === "gerar" ? 200 : 32);
  }

  function posicionar(doc, nos) {
    if (!nos.length) return;
    const pendentes = new Set(nos.map((n) => n.id));
    const ocupados = (cena) => doc.nos.filter((n) => n.cena === cena && !pendentes.has(n.id));
    for (const no of nos.filter((n) => n.tipo !== "gerar")) {
      const outros = ocupados(no.cena);
      const yMax = outros.filter((n) => n.x < 400).reduce((m, n) => Math.max(m, n.y + alturaEstimada(doc, n) + 40), 80);
      no.x = 80; no.y = yMax;
      pendentes.delete(no.id);
    }
    for (const no of nos.filter((n) => n.tipo === "gerar")) {
      const entradas = doc.ligacoes.filter((l) => l.para === no.id).map((l) => acharNo(doc, l.de)).filter((n) => n && n.x !== undefined);
      if (entradas.length) {
        no.x = Math.max(...entradas.map((n) => n.x)) + 380;
        no.y = Math.round(entradas.reduce((s, n) => s + n.y, 0) / entradas.length);
      } else {
        const outros = ocupados(no.cena);
        no.x = outros.reduce((m, n) => Math.max(m, n.x + 380), 80);
        no.y = 80;
      }
      pendentes.delete(no.id);
    }
  }

  // -------------------------------------------------------------------------------------------
  // Prompt montado a partir dos fios
  // -------------------------------------------------------------------------------------------

  function entradas(doc, no) {
    return doc.ligacoes.filter((l) => l.para === no.id).map((l) => ({ l, de: acharNo(doc, l.de) })).filter((x) => x.de);
  }

  function montarPrompt(doc, no, { simples = false } = {}) {
    const imagens = [];
    const videos = [];
    const rotulos = [];
    const instrucoes = [];
    for (const { l, de } of entradas(doc, no)) {
      const m = midiaDoNo(doc, de);
      const nome = de.titulo || (m ? path.basename(m.arquivo, path.extname(m.arquivo)) : de.id);
      if (m && m.tipo === "imagem") { imagens.push(m.id); rotulos.push(`imagem ${imagens.length} = ${nome}`); }
      else if (m && m.tipo === "video") { videos.push(m.id); rotulos.push(videos.length === 1 ? `vídeo 1 (vídeo base: movimento e câmera) = ${nome}` : `vídeo ${videos.length} (referência) = ${nome}`); }
      if (de.tipo === "nota" && de.texto) instrucoes.push(de.texto.trim());
      if (l.texto && l.texto.trim()) instrucoes.push(l.texto.trim());
    }
    if (no.prompt && no.prompt.trim()) instrucoes.push(no.prompt.trim());
    const partes = [];
    if (!simples && (rotulos.length > 1 || (rotulos.length === 1 && no.saida !== "video"))) partes.push(`Referências: ${rotulos.join("; ")}.`);
    partes.push(...instrucoes);
    return { prompt: partes.join("\n"), imagens, videos };
  }

  // -------------------------------------------------------------------------------------------
  // Motores de geração
  // -------------------------------------------------------------------------------------------

  const API_ARTCRAFT = (lerConfig("ARTCRAFT_API_URL") || "https://api.storyteller.ai").replace(/\/$/, "");

  async function lerResposta(r, quem) {
    const corpo = await r.text();
    let json = null;
    try { json = JSON.parse(corpo); } catch {}
    if (!r.ok) {
      const msg = (json && (json.error_message || json.error || json.detail || json.message)) || corpo.slice(0, 300);
      const dica = r.status === 401 ? " (chave inválida ou sem acesso à API)" : r.status === 402 ? " (créditos insuficientes)" : "";
      const erro = new Error(`${quem} recusou (HTTP ${r.status})${dica}: ${typeof msg === "string" ? msg : JSON.stringify(msg)}`);
      erro.fatal = r.status >= 400 && r.status < 500 && ![408, 425, 429].includes(r.status);
      throw erro;
    }
    return json || {};
  }

  const MOTORES = {
    artcraft: {
      nome: "ArtCraft",
      async enviarMidia(doc, m, chave) {
        if (m.artcraft) return m.artcraft;
        const fd = new FormData();
        fd.append("uuid_idempotency_token", crypto.randomUUID());
        const bytes = fs.readFileSync(caminhoMidia(doc, m));
        const ext = path.extname(m.arquivo).toLowerCase();
        fd.append("file", new Blob([bytes], { type: MIME[ext] || "application/octet-stream" }), `ref${ext}`);
        const r = await fetch(`${API_ARTCRAFT}/v1/omni_api/upload/${m.tipo === "video" ? "video" : "image"}`, {
          method: "POST", headers: { Authorization: `Bearer ${chave}` }, body: fd,
        });
        const j = await lerResposta(r, "ArtCraft (envio de referência)");
        if (!j.media_file_token) throw new Error("ArtCraft não devolveu o token da mídia enviada");
        m.artcraft = j.media_file_token;
        return m.artcraft;
      },
      async iniciar(doc, no, cfg) {
        if (!cfg.artcraftKey) throw new Error("falta a chave da API da ArtCraft (⚙ no quadro, ou nas configurações do conector)");
        const { prompt, imagens, videos } = montarPrompt(doc, no);
        const tokensImg = [];
        for (const id of imagens) tokensImg.push(await this.enviarMidia(doc, doc.midias[id], cfg.artcraftKey));
        const tokensVid = [];
        for (const id of videos) tokensVid.push(await this.enviarMidia(doc, doc.midias[id], cfg.artcraftKey));
        const video = no.saida === "video";
        const corpo = { idempotency_token: crypto.randomUUID(), model: no.modelo || MODELOS.artcraft[video ? "video" : "imagem"][0], prompt };
        const prop = PROPORCAO_ARTCRAFT[no.proporcao];
        if (prop) corpo.aspect_ratio = prop;
        if (video) {
          // Com vídeo base, todas as imagens entram como referência (exemplo 3 da API: imagens + vídeo).
          if (tokensVid.length) {
            corpo.reference_video_media_tokens = tokensVid;
            if (tokensImg.length) corpo.reference_image_media_tokens = tokensImg;
          } else {
            if (tokensImg.length) corpo.start_frame_image_media_token = tokensImg[0];
            if (tokensImg.length > 1) corpo.reference_image_media_tokens = tokensImg.slice(1);
          }
          corpo.duration_seconds = Number(no.duracao) || 5;
          corpo.video_batch_count = 1;
          corpo.generate_audio = !!no.audio;
        } else {
          if (tokensImg.length) corpo.image_media_tokens = tokensImg;
          corpo.image_batch_count = 1;
        }
        const r = await fetch(`${API_ARTCRAFT}/v1/omni_api/generate/${video ? "video" : "image"}`, {
          method: "POST", headers: { Authorization: `Bearer ${cfg.artcraftKey}`, "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(corpo),
        });
        const j = await lerResposta(r, "ArtCraft");
        if (!j.inference_job_token) throw new Error("ArtCraft não devolveu o número do trabalho");
        return { token: j.inference_job_token, modelo: corpo.model, prompt };
      },
      async consultar(job, cfg) {
        const r = await fetch(`${API_ARTCRAFT}/v1/omni_api/job_status/job/${encodeURIComponent(job.token)}`, {
          headers: { Authorization: `Bearer ${cfg.artcraftKey}`, Accept: "application/json" },
        });
        const j = await lerResposta(r, "ArtCraft");
        const st = j.state || {};
        const s = (st.status && st.status.status) || "pending";
        if (s === "complete_success") {
          const url = st.maybe_result && st.maybe_result.media_links && st.maybe_result.media_links.cdn_url;
          if (!url) throw new Error("trabalho concluído sem link do resultado");
          const links = st.maybe_result.media_links;
          const modelo = links.maybe_thumbnail_template || (links.maybe_video_previews && links.maybe_video_previews.still_thumbnail_template);
          return { fim: true, url, mini: modelo ? modelo.replace("{WIDTH}", "512") : null };
        }
        if (["complete_failure", "dead", "cancelled_by_user", "cancelled_by_system"].includes(s)) {
          const cat = st.status.maybe_failure_category;
          throw new Error(`a geração falhou na ArtCraft (${s}${cat ? `: ${cat}` : ""})`);
        }
        return { fim: false, progresso: (st.status && st.status.progress_percentage) || 0, fase: s };
      },
    },

    fal: {
      nome: "fal.ai",
      dataUri(doc, m) {
        const ext = path.extname(m.arquivo).toLowerCase();
        return `data:${MIME[ext] || "application/octet-stream"};base64,${fs.readFileSync(caminhoMidia(doc, m)).toString("base64")}`;
      },
      async iniciar(doc, no, cfg) {
        if (!cfg.falKey) throw new Error("falta a chave da fal.ai (⚙ no quadro)");
        const { prompt, imagens, videos } = montarPrompt(doc, no);
        const video = no.saida === "video";
        if (video && videos.length) throw new Error("a fal.ai não aceita vídeo de referência; troque o motor para ArtCraft em ⚙ (ou tire o vídeo base do fio)");
        let modelo = no.modelo || MODELOS.fal[video ? "video" : "imagem"][0];
        const urls = imagens.map((id) => this.dataUri(doc, doc.midias[id]));
        const corpo = { prompt };
        if (video) {
          if (!urls.length) throw new Error("vídeo na fal.ai precisa de uma imagem ligada (quadro inicial)");
          corpo.image_url = urls[0];
          const d = Number(no.duracao) || 5;
          corpo.duration = /veo/.test(modelo) ? `${d}s` : String(d);
          if (no.proporcao && no.proporcao !== "auto") corpo.aspect_ratio = no.proporcao;
        } else {
          if (urls.length) corpo.image_urls = urls;
          else modelo = modelo.replace(/\/edit$/, "");
          corpo.num_images = 1;
          if (no.proporcao && no.proporcao !== "auto") corpo.aspect_ratio = no.proporcao;
        }
        const r = await fetch(`https://queue.fal.run/${modelo}`, {
          method: "POST", headers: { Authorization: `Key ${cfg.falKey}`, "Content-Type": "application/json" }, body: JSON.stringify(corpo),
        });
        const j = await lerResposta(r, "fal.ai");
        if (!j.status_url || !j.response_url) throw new Error("fal.ai não devolveu o endereço do pedido");
        return { token: j.request_id, status_url: j.status_url, response_url: j.response_url, modelo, prompt };
      },
      async consultar(job, cfg) {
        const h = { Authorization: `Key ${cfg.falKey}` };
        const s = await lerResposta(await fetch(job.status_url, { headers: h }), "fal.ai");
        if (s.status === "COMPLETED") {
          const res = await lerResposta(await fetch(job.response_url, { headers: h }), "fal.ai");
          const url = (res.images && res.images[0] && res.images[0].url) || (res.image && res.image.url) || (res.video && res.video.url);
          if (!url) throw new Error("fal.ai concluiu sem link do resultado");
          return { fim: true, url };
        }
        if (s.status === "IN_QUEUE" || s.status === "IN_PROGRESS") return { fim: false, progresso: s.status === "IN_PROGRESS" ? 50 : 5, fase: s.status };
        throw new Error(`fal.ai: estado inesperado ${s.status}`);
      },
    },
  };

  // Nós vindos da timeline com "trecho" ligado mandam o vídeo do clipe (e não só o quadro parado)
  // como vídeo base: o FilmCraft exporta o trecho em mp4 pequeno, ou usa o arquivo original.
  const MAX_TRECHO = 15;
  async function prepararTrechos(doc, gerarNo) {
    for (const { de } of entradas(doc, gerarNo)) {
      if (!de.trecho || !de.fc) continue;
      await exigirFc();
      const nome = `trecho ${de.fc.clip} ${tc(de.fc.ini).replace(":", "m")}s`.replace(/[^\w. -]/g, "_");
      const saida = path.join(pastaProjeto(doc.nome), "midia", `${nome}.mp4`);
      fs.mkdirSync(path.dirname(saida), { recursive: true });
      fs.rmSync(saida, { force: true });
      let arq = null;
      try {
        await comando("filmcraft", "file.exportMedia", { path: saida, format: "mp4", range: "custom", startSeconds: de.fc.ini, endSeconds: de.fc.ini + Math.min(de.fc.dur, MAX_TRECHO), scale: 0.5, audio: false, wait: true });
        if (fs.existsSync(saida) && fs.statSync(saida).size > 0) arq = saida;
      } catch (e) { log(`exportar trecho: ${e.message}`); }
      if (!arq) {
        await atualizarArquivosFc([de.fc.item]).catch(() => {});
        const orig = arquivosFc.get(de.fc.item);
        if (orig && EXT_VIDEO.has(path.extname(orig).toLowerCase()) && fs.existsSync(orig)) arq = orig;
      }
      if (!arq) throw new Error(`não consegui tirar o vídeo do clipe "${de.titulo}" do FilmCraft; desligue 🎬 no nó ou gere por fora`);
      let m = de.trechoMidia && doc.midias[de.trechoMidia];
      if (arq === saida) {
        if (m && m.arquivo === path.basename(saida)) delete m.artcraft; // arquivo regravado: o envio antigo não vale mais
        else m = registrarMidia(doc, path.basename(saida), "filmcraft", { trecho: true });
      } else m = importarArquivo(doc, arq);
      de.trechoMidia = m.id;
    }
    salvar(doc);
  }

  // Modo manual: junta numa pasta o vídeo base (trecho exportado) e as imagens, com os mesmos
  // números do prompt, e abre a pasta para a pessoa arrastar para o ArtCraft.
  async function prepararPacote(proj, noId) {
    const doc = carregar(proj);
    const no = acharNo(doc, noId);
    if (!no || no.tipo !== "gerar") throw new Error("nó Gerar não encontrado");
    await prepararTrechos(doc, no);
    const { prompt, imagens, videos } = montarPrompt(doc, no);
    const pasta = path.join(pastaProjeto(doc.nome), "para-artcraft", no.id);
    fs.rmSync(pasta, { recursive: true, force: true });
    fs.mkdirSync(pasta, { recursive: true });
    const arquivos = [];
    const copiar = (id, rotulo, n) => {
      const m = doc.midias[id];
      const ext = path.extname(m.arquivo);
      const nome = `${rotulo} ${n} - ${limparNome(path.basename(m.arquivo, ext)).slice(0, 40)}${ext}`;
      fs.copyFileSync(caminhoMidia(doc, m), path.join(pasta, nome));
      arquivos.push(nome);
    };
    videos.forEach((id, i) => copiar(id, "video", i + 1));
    imagens.forEach((id, i) => copiar(id, "imagem", i + 1));
    fs.writeFileSync(path.join(pasta, "prompt.txt"), prompt);
    abrirNoSistema(pasta, false);
    return { pasta, arquivos, prompt };
  }

  // -------------------------------------------------------------------------------------------
  // Motor local: ComfyUI (programa gratuito que roda os modelos abertos na placa de vídeo do PC)
  // -------------------------------------------------------------------------------------------
  // A pessoa salva no ComfyUI uma "receita" (Workflow › Export (API)) para foto e outra para vídeo.
  // O quadro troca nela o prompt, as imagens e os vídeos de referência, sorteia a semente e manda rodar.

  const PASTA_COMFY = path.join(DADOS, "comfy");
  const arqReceita = (tipo) => path.join(PASTA_COMFY, `${tipo === "video" ? "video" : "imagem"}.json`);

  function validarReceita(wf) {
    if (!wf || typeof wf !== "object" || Array.isArray(wf)) throw new Error("o arquivo não é uma receita do ComfyUI");
    if (Array.isArray(wf.nodes) && Array.isArray(wf.links)) throw new Error("esse arquivo está no formato de tela. No ComfyUI use Workflow › Export (API) e escolha o arquivo gerado");
    const nos = Object.values(wf);
    if (!nos.length || !nos.every((n) => n && typeof n === "object" && typeof n.class_type === "string" && n.inputs && typeof n.inputs === "object")) throw new Error("receita inválida: use Workflow › Export (API) no ComfyUI");
    return wf;
  }

  // Receita pronta (Wan 2.2 5B, imagem → vídeo). Os mesmos nós que o ComfyUI gera em Workflow › Export (API);
  // nomes dos modelos como em Comfy-Org/Wan_2.2_ComfyUI_Repackaged. Cópia em receitas/.
  const RECEITA_WAN22_5B = {"1":{"class_type":"UNETLoader","inputs":{"unet_name":"wan2.2_ti2v_5B_fp16.safetensors","weight_dtype":"default"},"_meta":{"title":"Modelo Wan 2.2 5B"}},"2":{"class_type":"CLIPLoader","inputs":{"clip_name":"umt5_xxl_fp8_e4m3fn_scaled.safetensors","type":"wan","device":"default"},"_meta":{"title":"Texto"}},"3":{"class_type":"VAELoader","inputs":{"vae_name":"wan2.2_vae.safetensors"},"_meta":{"title":"VAE"}},"4":{"class_type":"ModelSamplingSD3","inputs":{"model":["1",0],"shift":8.0},"_meta":{"title":"Shift"}},"5":{"class_type":"CLIPTextEncode","inputs":{"text":"","clip":["2",0]},"_meta":{"title":"Positive"}},"6":{"class_type":"CLIPTextEncode","inputs":{"text":"blurry, low quality, distorted, deformed, static, watermark, text, subtitles, worst quality, jpeg artifacts","clip":["2",0]},"_meta":{"title":"Negative"}},"7":{"class_type":"LoadImage","inputs":{"image":"example.png"},"_meta":{"title":"Imagem inicial"}},"8":{"class_type":"Wan22ImageToVideoLatent","inputs":{"vae":["3",0],"width":832,"height":480,"length":73,"batch_size":1,"start_image":["7",0]},"_meta":{"title":"Latente de vídeo"}},"9":{"class_type":"KSampler","inputs":{"model":["4",0],"seed":1,"steps":20,"cfg":5.0,"sampler_name":"uni_pc","scheduler":"simple","positive":["5",0],"negative":["6",0],"latent_image":["8",0],"denoise":1.0},"_meta":{"title":"Amostrador"}},"10":{"class_type":"VAEDecode","inputs":{"samples":["9",0],"vae":["3",0]},"_meta":{"title":"Decodificar"}},"11":{"class_type":"CreateVideo","inputs":{"images":["10",0],"fps":24.0},"_meta":{"title":"Criar vídeo"}},"12":{"class_type":"SaveVideo","inputs":{"video":["11",0],"filename_prefix":"video/quadro","format":"mp4","format.codec":"auto"},"_meta":{"title":"Salvar vídeo"}}};
  const RECEITAS_PRONTAS = { "wan22-5b": RECEITA_WAN22_5B };

  const ehLigacao = (v) => Array.isArray(v) && v.length === 2 && typeof v[0] !== "object";

  // Procura, a partir de um nó, o nó de texto que alimenta o prompt (sobe pelas ligações).
  function acharTexto(wf, id, vistos = new Set(), prof = 0) {
    if (!wf[id] || vistos.has(id) || prof > 6) return null;
    vistos.add(id);
    const n = wf[id];
    if (typeof n.inputs.text === "string" || typeof n.inputs.prompt === "string") return { no: n, campo: typeof n.inputs.text === "string" ? "text" : "prompt" };
    for (const v of Object.values(n.inputs)) if (ehLigacao(v)) { const r = acharTexto(wf, String(v[0]), vistos, prof + 1); if (r) return r; }
    return null;
  }

  function injetarReceita(wf, { prompt, imagens, videos }) {
    wf = JSON.parse(JSON.stringify(wf));
    const ids = Object.keys(wf).sort((a, b) => Number(a) - Number(b));
    // prompt: o texto ligado à entrada "positive" de algum amostrador; senão o primeiro sem "negative" no nome
    let alvo = null;
    for (const id of ids) {
      const pos = wf[id].inputs.positive;
      if (ehLigacao(pos)) { alvo = acharTexto(wf, String(pos[0])); if (alvo) break; }
    }
    if (!alvo) {
      for (const id of ids) {
        const n = wf[id];
        const titulo = String((n._meta && n._meta.title) || "");
        if (/TextEncode|Prompt/i.test(n.class_type) && typeof n.inputs.text === "string" && !/neg/i.test(titulo)) { alvo = { no: n, campo: "text" }; break; }
      }
    }
    if (!alvo) throw new Error("não achei onde entra o prompt na receita (precisa de um nó CLIPTextEncode ligado ao positivo)");
    alvo.no.inputs[alvo.campo] = prompt;
    // semente nova a cada geração
    for (const id of ids) for (const k of ["seed", "noise_seed"]) if (typeof wf[id].inputs[k] === "number") wf[id].inputs[k] = Math.floor(Math.random() * 2 ** 48);
    // imagens e vídeos de referência, na ordem dos nós de carga
    const cargaImg = ids.filter((id) => /^(LoadImage|LoadImageMask|VHS_LoadImage)/.test(wf[id].class_type) && typeof wf[id].inputs.image === "string");
    const cargaVid = ids.filter((id) => /LoadVideo/.test(wf[id].class_type) && typeof wf[id].inputs.video === "string");
    const usados = { imagens: Math.min(cargaImg.length, imagens.length), videos: Math.min(cargaVid.length, videos.length) };
    cargaImg.slice(0, usados.imagens).forEach((id, i) => { wf[id].inputs.image = imagens[i]; });
    cargaVid.slice(0, usados.videos).forEach((id, i) => { wf[id].inputs.video = videos[i]; });
    if (cargaImg.length && !imagens.length) throw new Error("essa receita parte de uma imagem: ligue uma imagem (ou um clipe da timeline) ao nó Gerar");
    // carga que sobrou sem arquivo ligado: avisa em vez de gerar com a imagem de exemplo da receita
    if (cargaImg.length > imagens.length && imagens.length) usados.faltamImagens = cargaImg.length - imagens.length;
    return { wf, usados, deixouDeLado: { imagens: imagens.length - usados.imagens, videos: videos.length - usados.videos } };
  }

  async function comfyPedir(cfg, rota, opts = {}) {
    const r = await fetch(`${cfg.comfyUrl}${rota}`, { signal: AbortSignal.timeout(opts.timeout || 20000), ...opts }).catch((e) => {
      throw new Error(`não consegui falar com o ComfyUI em ${cfg.comfyUrl} (${e.cause && e.cause.code ? e.cause.code : e.message}). Abra o ComfyUI e deixe-o rodando`);
    });
    return r;
  }

  async function comfyEstado() {
    const cfg = config();
    const receitas = { imagem: fs.existsSync(arqReceita("imagem")), video: fs.existsSync(arqReceita("video")) };
    try {
      const r = await comfyPedir(cfg, "/system_stats", { timeout: 3000 });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      const gpu = ((j.devices || []).find((d) => d.type !== "cpu") || (j.devices || [])[0]) || null;
      return { url: cfg.comfyUrl, ligado: true, placa: gpu ? gpu.name : null, vramGB: gpu && gpu.vram_total ? Math.round((gpu.vram_total / 1073741824) * 10) / 10 : null, receitas };
    } catch (e) { return { url: cfg.comfyUrl, ligado: false, erro: e.message, receitas }; }
  }

  async function enviarAoComfy(cfg, doc, m) {
    const fd = new FormData();
    const ext = path.extname(m.arquivo);
    fd.append("image", new Blob([fs.readFileSync(caminhoMidia(doc, m))], { type: MIME[ext.toLowerCase()] || "application/octet-stream" }), `quadro_${m.id}${ext}`);
    fd.append("overwrite", "true");
    const r = await comfyPedir(cfg, "/upload/image", { method: "POST", body: fd, timeout: 120000 });
    if (!r.ok) throw new Error(`ComfyUI recusou o envio de ${m.arquivo} (HTTP ${r.status})`);
    const j = await r.json();
    return j.subfolder ? `${j.subfolder}/${j.name}` : j.name;
  }

  function receitaTemVideo(saida) {
    try { return Object.values(JSON.parse(fs.readFileSync(arqReceita(saida === "video" ? "video" : "imagem"), "utf8"))).some((n) => /LoadVideo/.test(n.class_type)); } catch { return true; }
  }

  MOTORES.comfy = {
    nome: "Local (ComfyUI)",
    async iniciar(doc, no, cfg) {
      const video = no.saida === "video";
      let wf;
      try { wf = validarReceita(JSON.parse(fs.readFileSync(arqReceita(video ? "video" : "imagem"), "utf8"))); } catch (e) {
        if (e.code === "ENOENT") throw new Error(`falta a receita de ${video ? "vídeo" : "foto"} do ComfyUI. Em ⚙ › Local, escolha o arquivo exportado do ComfyUI (Workflow › Export (API))`);
        throw e;
      }
      const { prompt, imagens, videos } = montarPrompt(doc, no, { simples: true }); // modelos locais não entendem "imagem 1 = …"
      const sobe = async (ids) => { const r = []; for (const id of ids) r.push(await enviarAoComfy(cfg, doc, doc.midias[id])); return r; };
      const temCargaVideo = Object.values(wf).some((n) => /LoadVideo/.test(n.class_type));
      if (!imagens.length && videos.length && !temCargaVideo) throw new Error("essa receita parte de uma imagem e não usa vídeo: no clipe da timeline desligue o 🎬 (assim vai o quadro parado como imagem inicial)");
      const arqImg = await sobe(imagens), arqVid = temCargaVideo ? await sobe(videos) : [];
      const { wf: pronta, deixouDeLado } = injetarReceita(wf, { prompt, imagens: arqImg, videos: arqVid });
      const r = await comfyPedir(cfg, "/prompt", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: pronta, client_id: "quadro-artcraft" }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        const det = j.node_errors ? Object.values(j.node_errors).map((n) => (n.errors || []).map((e) => e.message).join("; ")).filter(Boolean).join(" | ") : "";
        throw new Error(`ComfyUI recusou a receita: ${(j.error && (j.error.message || j.error)) || `HTTP ${r.status}`}${det ? ` (${det})` : ""}`);
      }
      const aviso = deixouDeLado.imagens || deixouDeLado.videos ? ` (a receita só tem lugar para parte das referências: ${deixouDeLado.imagens} imagem(ns) e ${deixouDeLado.videos} vídeo(s) ficaram de fora)` : "";
      if (aviso) log(`comfy:${aviso}`);
      return { token: j.prompt_id, modelo: "ComfyUI local", prompt, avisoReceita: aviso.trim() };
    },
    async consultar(job, cfg) {
      const r = await comfyPedir(cfg, `/history/${encodeURIComponent(job.token)}`, { timeout: 15000 });
      const h = (await r.json().catch(() => ({})))[job.token];
      if (!h) return { fim: false, progresso: 0, fase: "na fila" };
      const st = h.status || {};
      if (st.status_str === "error") {
        const msg = (st.messages || []).find((m) => m[0] === "execution_error");
        const e = new Error(`a geração falhou no ComfyUI${msg && msg[1] ? `: ${msg[1].exception_message || msg[1].node_type || ""}` : ""}`);
        e.fatal = true;
        throw e;
      }
      if (!st.completed && st.status_str !== "success") return { fim: false, progresso: 0, fase: "gerando" };
      const video = EXT_VIDEO, imagem = EXT_IMAGEM;
      const arquivos = Object.values(h.outputs || {}).flatMap((o) => ["images", "gifs", "videos"].flatMap((k) => o[k] || [])).filter((f) => f && f.filename && f.type !== "temp");
      const alvo = arquivos.reverse().find((f) => video.has(path.extname(f.filename).toLowerCase())) || arquivos.find((f) => imagem.has(path.extname(f.filename).toLowerCase()));
      if (!alvo) { const e = new Error("o ComfyUI terminou, mas a receita não salvou nenhuma imagem ou vídeo (precisa de um nó Save)"); e.fatal = true; throw e; }
      return { fim: true, url: `${cfg.comfyUrl}/view?filename=${encodeURIComponent(alvo.filename)}&subfolder=${encodeURIComponent(alvo.subfolder || "")}&type=${alvo.type || "output"}`, ext: path.extname(alvo.filename).toLowerCase() };
    },
  };

  const semChaves = (msg, cfg = config()) => [cfg.artcraftKey, cfg.falKey].filter((k) => k && k.length > 6).reduce((t, k) => t.split(k).join("***"), String(msg));

  const trabalhos = new Map(); // `${proj}:${no}` → Promise

  async function gerar(proj, noId) {
    const doc = carregar(proj);
    const no = acharNo(doc, noId);
    if (!no) throw new Error(`nó não encontrado: ${noId}`);
    if (no.tipo !== "gerar") throw new Error(`${noId} não é um nó Gerar`);
    const k = `${doc.nome}:${no.id}`;
    if (trabalhos.has(k)) return { ja: true };
    const cfg = config();
    const motorId = no.motor || cfg.motor;
    const motor = MOTORES[motorId];
    if (!motor) throw new Error("nenhum motor de geração configurado. Abra ⚙ no quadro e informe a chave da ArtCraft (ou da fal.ai), ou gere por fora e arraste o resultado para o nó.");
    const { prompt } = montarPrompt(doc, no);
    if (!prompt.trim()) throw new Error("escreva no fio (ou no nó) o que gerar");
    no.estado = "gerando"; no.progresso = 0; no.erro = "";
    no.job = { motor: motorId, inicio: Date.now() };
    salvar(doc);
    const p = (async () => {
      try {
        if (motorId !== "comfy" || receitaTemVideo(no.saida)) await prepararTrechos(doc, no); // receita só de imagem não usa o vídeo base
        const info = await motor.iniciar(doc, no, cfg);
        no.job = { ...no.job, ...info };
        salvar(doc);
        await acompanhar(doc, no);
      } catch (e) {
        no.estado = "erro"; no.erro = semChaves(e.message, cfg); delete no.job;
        salvar(doc);
      } finally {
        trabalhos.delete(k);
      }
    })();
    trabalhos.set(k, p);
    return { iniciado: true };
  }

  async function acompanhar(doc, no) {
    const motor = MOTORES[no.job.motor];
    const limite = no.job.inicio + 45 * 60 * 1000;
    let falhasRede = 0;
    while (Date.now() < limite) {
      await new Promise((r) => setTimeout(r, 4000));
      if (!acharNo(doc, no.id)) return; // nó apagado
      let r;
      try { r = await motor.consultar(no.job, config()); falhasRede = 0; } catch (e) {
        if (e.fatal || /falhou na ArtCraft|inesperado|sem link/.test(e.message) || ++falhasRede > 8) throw e;
        continue;
      }
      if (r.fim) {
        let resp;
        for (let t = 0; t < 4; t++) { // o link do resultado pode demorar uns segundos para propagar
          resp = await fetch(r.url).catch(() => null);
          if (resp && resp.ok) break;
          await new Promise((ok) => setTimeout(ok, 3000 * (t + 1)));
        }
        if (!resp || !resp.ok) throw new Error(`não consegui baixar o resultado (${resp ? `HTTP ${resp.status}` : "sem conexão"}); o link ficou: ${r.url}`);
        const bytes = Buffer.from(await resp.arrayBuffer());
        const tipoHttp = resp.headers.get("content-type") || "";
        let ext = r.ext || path.extname(new URL(r.url).pathname).toLowerCase();
        if (!tipoPorExt(`x${ext}`)) ext = tipoHttp.includes("video") ? ".mp4" : tipoHttp.includes("png") ? ".png" : tipoHttp.includes("webp") ? ".webp" : ".jpg";
        const cena = doc.cenas.find((c) => c.id === no.cena);
        const base = `${cena ? cena.nome : "Cena"} - ${no.titulo || (no.saida === "video" ? "video" : "foto")} v${no.versoes.length + 1}`;
        const m = guardarBytes(doc, `${base}${ext}`, bytes, "gerado", { prompt: no.job.prompt, modelo: no.job.modelo, motor: no.job.motor, no: no.id });
        if (r.mini) {
          try {
            const rm = await fetch(r.mini);
            if (rm.ok && /jpe?g/.test(rm.headers.get("content-type") || "jpeg")) {
              fs.mkdirSync(path.dirname(caminhoMini(doc, m.id)), { recursive: true });
              fs.writeFileSync(caminhoMini(doc, m.id), Buffer.from(await rm.arrayBuffer()));
            }
          } catch {}
        }
        adicionarVersao(no, m.id);
        delete no.job; delete no.progresso;
        salvar(doc);
        return;
      }
      if (r.progresso !== no.progresso) { no.progresso = r.progresso; avisar(doc.nome, { tipo: "progresso", no: no.id, progresso: r.progresso }); }
    }
    throw new Error("a geração passou de 45 minutos sem terminar");
  }

  function retomarTrabalhos() {
    for (const proj of listarProjetos()) {
      const doc = carregar(proj);
      for (const no of doc.nos) {
        if (no.estado !== "gerando") continue;
        if (!no.job || !no.job.token || !MOTORES[no.job.motor]) { no.estado = "erro"; no.erro = "a geração foi interrompida; gere de novo"; salvar(doc); continue; }
        const k = `${doc.nome}:${no.id}`;
        const p = acompanhar(doc, no).catch((e) => { no.estado = "erro"; no.erro = semChaves(e.message); delete no.job; salvar(doc); }).finally(() => trabalhos.delete(k));
        trabalhos.set(k, p);
      }
    }
  }

  // -------------------------------------------------------------------------------------------
  // Envio para FilmCraft / EffectCraft
  // -------------------------------------------------------------------------------------------

  function textoResultado(r) {
    const t = (r.content || []).filter((c) => c.type === "text").map((c) => c.text).join("\n");
    if (r.isError) throw new Error(t || "o app recusou o comando");
    try { return JSON.parse(t); } catch { return t; }
  }

  async function comando(app, id, params) {
    return textoResultado(await sessao(app, "janela").chamar("command_run", { id, params }));
  }

  async function enviarFilmcraft(pasta, arquivos) {
    const proj = await comando("filmcraft", "project.inspect", {});
    const raiz = (proj && proj.root && proj.root.children) || [];
    const achado = raiz.find((c) => c.children && c.name === pasta);
    let bin = achado ? achado.id : null;
    if (bin === null) bin = (await comando("filmcraft", "file.newBin", { name: pasta })).bin;
    const r = await comando("filmcraft", "file.import", { paths: arquivos, bin });
    const erros = (r && r.errors) || [];
    if (erros.length) throw new Error(`FilmCraft não importou: ${erros.join("; ")}`);
    return { texto: `FilmCraft: ${arquivos.length} arquivo(s) no bin "${pasta}"`, itens: (r && r.items) || [] };
  }

  async function enviarEffectcraft(pasta, arquivos, comentarios) {
    const r = await comando("effectcraft", "file.import", { paths: arquivos });
    const itens = (r && r.items) || [];
    const erros = (r && r.errors) || [];
    if (erros.length && !itens.length) throw new Error(`EffectCraft não importou: ${erros.join("; ")}`);
    if (itens.length) {
      try { await comando("effectcraft", "project.move", { items: itens, folder: pasta }); } catch {
        const f = await comando("effectcraft", "project.newFolder", { name: pasta });
        await comando("effectcraft", "project.move", { items: itens, folder: f.item });
      }
      for (let i = 0; i < itens.length && i < comentarios.length; i++) {
        if (comentarios[i]) await comando("effectcraft", "project.setComment", { items: [itens[i]], comment: comentarios[i].slice(0, 500) }).catch(() => {});
      }
    }
    return `EffectCraft: ${itens.length} arquivo(s) na pasta "${pasta}"${erros.length ? ` (${erros.length} com erro)` : ""}`;
  }

  async function enviar(proj, { nos, cena, app }) {
    const doc = carregar(proj);
    const porCena = !(nos && nos.length);
    let lista;
    if (!porCena) lista = nos.map((id) => acharNo(doc, id)).filter(Boolean);
    else {
      const c = acharCena(doc, cena);
      if (!c) throw new Error(`cena não encontrada: ${cena}`);
      lista = doc.nos.filter((n) => n.cena === c.id && n.tipo === "gerar" && n.atual);
    }
    lista = lista.filter((no) => midiaDoNo(doc, no));
    if (!lista.length) throw new Error("nada para enviar: nenhum desses nós tem foto ou vídeo pronto");
    const apps = app === "ambos" ? ["filmcraft", "effectcraft"] : [app];
    const linhas = [];
    for (const a of apps) {
      if (!["filmcraft", "effectcraft"].includes(a)) throw new Error(`app inválido: ${a}`);
      const nome = a === "filmcraft" ? "FilmCraft" : "EffectCraft";
      // Pela cena, manda só o que ainda não foi (ou mudou de versão) para não duplicar no app.
      const daVez = porCena ? lista.filter((no) => !(no.envios || []).some((e) => e.app === a && e.midia === midiaDoNo(doc, no).id)) : lista;
      if (!daVez.length) { linhas.push(`${nome}: nada novo, tudo desta cena já está lá`); continue; }
      await prepararApp(a);
      const grupos = new Map();
      for (const no of daVez) {
        const c = doc.cenas.find((x) => x.id === no.cena);
        const pasta = c ? c.nome : "Quadro";
        if (!grupos.has(pasta)) grupos.set(pasta, []);
        grupos.get(pasta).push({ no, m: midiaDoNo(doc, no) });
      }
      for (const [pasta, itens] of grupos) {
        const arquivos = itens.map((x) => caminhoMidia(doc, x.m));
        linhas.push(a === "filmcraft"
          ? (await enviarFilmcraft(pasta, arquivos)).texto
          : await enviarEffectcraft(pasta, arquivos, itens.map((x) => x.m.prompt || "")));
        for (const { no, m } of itens) {
          no.envios = (no.envios || []).filter((e) => e.app !== a).concat({ app: a, midia: m.id, quando: new Date().toISOString() });
        }
        salvar(doc);
      }
    }
    return linhas.join("\n");
  }

  // -------------------------------------------------------------------------------------------
  // Timeline do FilmCraft: o quadro mostra a sequência aberta no FilmCraft e troca coisas com ela
  // -------------------------------------------------------------------------------------------

  const TICKS = 254016000000; // 1 segundo no FilmCraft
  const seg = (t) => (typeof t === "number" ? t / TICKS : null);
  const tc = (s) => { s = Math.max(0, s || 0); const m = Math.floor(s / 60); return `${String(m).padStart(2, "0")}:${(s - m * 60).toFixed(1).padStart(4, "0")}`; };
  const arquivosFc = new Map(); // item do FilmCraft → caminho do arquivo no disco

  async function exigirFc() {
    if (!(await appAberto("filmcraft"))) throw new Error("o FilmCraft não está aberto com o controle ligado (clique em Abrir FilmCraft)");
  }

  let arquivosFcEm = 0;
  async function atualizarArquivosFc(itens) {
    // ids de item recomeçam em cada projeto: o mapa só vale por alguns segundos
    if (Date.now() - arquivosFcEm < 5000 && itens.every((i) => arquivosFc.has(i))) return;
    const lista = await comando("filmcraft", "media.status", {});
    arquivosFc.clear();
    arquivosFcEm = Date.now();
    for (const x of Array.isArray(lista) ? lista : []) if (x.path) arquivosFc.set(x.item, x.path);
  }

  function faixasDe(q) {
    const f = (lista, tipo) => (lista || []).map((t, i) => ({
      nome: `${tipo}${i + 1}`, bloqueada: !!t.locked, oculta: t.enabled === false || !!t.muted,
      clipes: (t.items || []).map((c) => ({ clip: c.clip, item: c.item, nome: c.name, ini: seg(c.start), dur: seg(c.duration), inSrc: seg(c.sourceIn) || 0, cor: c.label, ativo: c.enabled !== false })),
    }));
    return { video: f(q.video, "V"), audio: f(q.audio, "A") };
  }

  let rodandoFc = { quando: 0, valor: null };
  async function fcRodando() {
    if (Date.now() - rodandoFc.quando > 4000) rodandoFc = { quando: Date.now(), valor: await appRodando("filmcraft").catch(() => null) };
    return rodandoFc.valor;
  }

  async function linhaFilmcraft() {
    if (!(await appAberto("filmcraft"))) return { conectado: false, rodando: await fcRodando() };
    let q;
    try { q = await comando("filmcraft", "sequence.inspect", {}); } catch (e) { return { conectado: true, sequencia: null, aviso: e.message }; }
    if (!q || typeof q !== "object") return { conectado: true, sequencia: null };
    const { video, audio } = faixasDe(q);
    const itens = [...new Set([...video, ...audio].flatMap((t) => t.clipes.map((c) => c.item)))];
    await atualizarArquivosFc(itens).catch(() => {});
    const tipos = {};
    for (const i of itens) {
      const ext = path.extname(arquivosFc.get(i) || "").toLowerCase();
      tipos[i] = EXT_IMAGEM.has(ext) ? "imagem" : EXT_VIDEO.has(ext) ? "video" : arquivosFc.has(i) ? "outro" : "";
    }
    const fr = (q.settings && q.settings.frame_rate) || { num: 24, den: 1 };
    return {
      conectado: true,
      sequencia: {
        id: q.id, nome: q.name, duracao: seg(q.duration) || 0, playhead: seg(q.playhead) || 0, fps: fr.num / (fr.den || 1),
        largura: q.settings && q.settings.width, altura: q.settings && q.settings.height,
        marcadores: (q.markers || []).map((m) => ({ ini: seg(m.start), nome: m.name, cor: m.color })),
        selecao: q.selection || [], video, audio, tipos,
      },
    };
  }

  async function quadroDoFilme(seconds, maxLado = 1280) {
    const r = await sessao("filmcraft", "janela").chamar("render_frame", seconds === undefined ? { max_side: maxLado } : { seconds, max_side: maxLado });
    const img = (r.content || []).find((c) => c.type === "image");
    if (r.isError || !img) throw new Error(((r.content || []).find((c) => c.type === "text") || {}).text || "o FilmCraft não devolveu a imagem");
    return Buffer.from(img.data, "base64");
  }

  // Traz a sequência (ou só alguns clipes) para uma cena: um nó de mídia por clipe de vídeo, na
  // ordem da timeline. Foto vira a própria foto; vídeo vira o quadro do filme no meio do clipe.
  async function importarSequencia(proj, { clips, cena, x, y }) {
    await exigirFc();
    const q = await comando("filmcraft", "sequence.inspect", {});
    if (!q || !q.video) throw new Error("não há sequência aberta no FilmCraft");
    const { video } = faixasDe(q);
    let lista = video.flatMap((t, f) => (t.oculta ? [] : t.clipes.filter((c) => c.ativo).map((c) => ({ ...c, faixa: f }))));
    if (clips && clips.length) lista = lista.filter((c) => clips.includes(c.clip));
    if (!lista.length) throw new Error("a sequência não tem clipes de vídeo");
    lista.sort((a, b) => a.ini - b.ini || a.faixa - b.faixa);
    await atualizarArquivosFc(lista.map((c) => c.item)).catch(() => {});
    const doc = carregar(proj);
    marcarHistorico(doc);
    const nomeCena = limparNome(cena || q.name || "Sequência");
    let c = acharCena(doc, nomeCena);
    if (!c) { aplicarOps(doc, [{ op: "cena", nome: nomeCena }]); c = doc.cenas[doc.cenas.length - 1]; }
    const ja = new Set(doc.nos.filter((n) => n.cena === c.id && n.fc).map((n) => n.fc.clip));
    // nós que já vieram da timeline: atualiza onde o clipe começa no arquivo (para mostrar o vídeo real)
    for (const n of doc.nos) {
      const cl = n.fc && lista.find((x) => x.clip === n.fc.clip);
      if (!cl) continue;
      Object.assign(n.fc, { item: cl.item, ini: cl.ini, dur: cl.dur, src: cl.inSrc || 0 });
      if (n.trecho === undefined && EXT_VIDEO.has(path.extname(arquivosFc.get(cl.item) || "").toLowerCase())) n.trecho = true;
    }
    const novos = lista.filter((x) => !ja.has(x.clip));
    let x0 = Math.max(40, ...doc.nos.filter((n) => n.cena === c.id && n.fc).map((n) => n.x + 270));
    const criados = [];
    try {
    for (const cl of novos) {
      const arq = arquivosFc.get(cl.item);
      let m;
      if (arq && EXT_IMAGEM.has(path.extname(arq).toLowerCase()) && fs.existsSync(arq)) m = importarArquivo(doc, arq);
      else {
        const png = await quadroDoFilme(momentoLimpo(video, cl));
        m = guardarBytes(doc, `${path.parse(cl.nome || "clipe").name} ${tc(cl.ini).replace(":", "m").replace(/\.\d$/, "")}s.png`, png, "filmcraft");
      }
      // Clipes avulsos (arrastados da timeline) vão onde foram soltos ou o quadro acha um lugar.
      const pos = clips && clips.length ? (typeof x === "number" ? { x: Math.round(x), y: Math.round(y) } : {}) : { x: x0, y: 60 + cl.faixa * 20 };
      const r = aplicarOps(doc, [{ op: "no", tipo: "midia", cena: c.id, midia: m.id, titulo: `${tc(cl.ini)} · ${cl.nome}`, ...pos }]);
      if (typeof x === "number") x += 270;
      const no = acharNo(doc, r.criados[0]);
      no.fc = { clip: cl.clip, item: cl.item, ini: cl.ini, dur: cl.dur, src: cl.inSrc || 0, faixa: `V${cl.faixa + 1}` };
      if (EXT_VIDEO.has(path.extname(arq || "").toLowerCase())) no.trecho = true; // clipe de vídeo: vira vídeo base na geração
      criados.push(no.id);
      x0 += 270;
    }
    } finally { salvar(doc); } // mesmo se um quadro falhar, o que já entrou não se perde
    return { cena: c.id, criados, texto: `${criados.length} clipe(s) de "${q.name}" na cena "${c.nome}"${novos.length < lista.length ? ` (${lista.length - novos.length} já estavam)` : ""}` };
  }

  // O quadro do filme mostra todas as faixas juntas; procura um instante do clipe sem nada por
  // cima (título, foto em V2…) para a referência sair limpa. Sem instante limpo, usa o meio.
  function momentoLimpo(video, cl) {
    const acima = video.slice(cl.faixa + 1).flatMap((t) => t.clipes).filter((c) => c.ativo);
    for (const k of [0.5, 0.3, 0.7, 0.15, 0.85, 0.05, 0.95]) {
      const t = cl.ini + cl.dur * k;
      if (!acima.some((c) => c.ini <= t && c.ini + c.dur > t)) return t;
    }
    return cl.ini + cl.dur / 2;
  }

  // Importa (ou reusa) o arquivo no FilmCraft e devolve o item.
  async function itemNoFilmcraft(pasta, arquivo) {
    const lista = await comando("filmcraft", "media.status", {});
    const ja = (Array.isArray(lista) ? lista : []).find((x) => x.path && path.resolve(x.path) === path.resolve(arquivo));
    if (ja) return ja.item;
    return (await enviarFilmcraft(pasta, [arquivo])).itens[0];
  }

  // Coloca o resultado de um nó na timeline, no playhead (ou em 'seconds'), na primeira faixa de
  // vídeo livre naquele trecho; cria uma faixa nova em vez de cobrir o que já está editado.
  async function colocarNaTimeline(proj, { no: id, midia, cena, seconds }) {
    const doc = carregar(proj);
    const no = id ? acharNo(doc, id) : null;
    const m = no ? midiaDoNo(doc, no) : doc.midias[midia] || null;
    if (!m) throw new Error(no || !midia ? "esse nó não tem foto ou vídeo pronto" : "mídia não encontrada");
    await prepararApp("filmcraft");
    const c = no ? doc.cenas.find((x) => x.id === no.cena) : acharCena(doc, cena);
    const item = await itemNoFilmcraft(c ? c.nome : "Quadro", caminhoMidia(doc, m));
    if (item === undefined) throw new Error("o FilmCraft não importou o arquivo");
    let q = await comando("filmcraft", "sequence.inspect", {});
    if (!q || !q.video) throw new Error("abra uma sequência no FilmCraft antes");
    const t = typeof seconds === "number" ? seconds : seg(q.playhead) || 0;
    const props = (await comando("filmcraft", "file.mediaProperties", { items: [item] }).catch(() => []))[0] || {};
    const dur = (props.duration && props.duration.seconds) || 5;
    const livre = (faixas) => faixas.findIndex((f) => !f.locked && !(f.items || []).some((x) => seg(x.start) < t + dur - 1e-6 && seg(x.start) + seg(x.duration) > t + 1e-6));
    let v = livre(q.video);
    let a = props.audio ? livre(q.audio || []) : 0;
    if (v < 0 || a < 0) {
      await comando("filmcraft", "sequence.addTracks", { video: v < 0 ? 1 : 0, audio: a < 0 ? 1 : 0 });
      q = await comando("filmcraft", "sequence.inspect", {});
      if (v < 0) v = q.video.length - 1;
      if (a < 0) a = q.audio.length - 1;
    }
    const params = { item, track: `V${v + 1}`, seconds: t, duration: Math.round(dur * TICKS) }; // a mesma duração testada acima
    if (props.audio) params.audioTrack = `A${a + 1}`;
    await comando("filmcraft", "timeline.place", params);
    if (no) {
      no.envios = (no.envios || []).filter((e) => e.app !== "filmcraft").concat({ app: "filmcraft", midia: m.id, quando: new Date().toISOString() });
      salvar(doc);
    }
    return { texto: `"${(no && no.titulo) || m.arquivo}" na timeline em ${tc(t)}, faixa V${v + 1}` };
  }

  // Projetos do FilmCraft: os recentes do próprio FilmCraft e os .fcproj das pastas do usuário.
  function prefsFilmcraft() {
    const pastas = [];
    const env = (k) => (process.env[k] || "").trim();
    if (env("FILMCRAFT_DATA_DIR")) pastas.push(env("FILMCRAFT_DATA_DIR"));
    const inst = pastaDoApp("filmcraft");
    if (inst) pastas.push(path.join(inst, "data"));
    if (WINDOWS) pastas.push(path.join(env("APPDATA") || path.join(os.homedir(), "AppData", "Roaming"), "FilmCraft"));
    else if (process.platform === "darwin") pastas.push(path.join(os.homedir(), "Library", "Application Support", "FilmCraft"));
    else pastas.push(path.join(env("XDG_DATA_HOME") || path.join(os.homedir(), ".local", "share"), "filmcraft"));
    for (const p of pastas) {
      try { return JSON.parse(fs.readFileSync(path.join(p, "preferences.json"), "utf8")); } catch {}
    }
    return {};
  }

  let achadosFc = { quando: 0, lista: [] };
  function procurarProjetosFc() {
    if (Date.now() - achadosFc.quando < 60000) return achadosFc.lista;
    const lista = [];
    const raizes = ["Documents", "Documentos", "Videos", "Vídeos", "Desktop", "Área de Trabalho", "Downloads"].map((d) => path.join(os.homedir(), d));
    const visitar = (dir, nivel) => {
      if (lista.length >= 60 || nivel > 4) return;
      let itens;
      try { itens = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
      for (const it of itens) {
        if (it.name.startsWith(".") || it.name === "node_modules") continue;
        const p = path.join(dir, it.name);
        if (it.isDirectory()) visitar(p, nivel + 1);
        else if (/\.fcproj$/i.test(it.name)) lista.push(p);
      }
    };
    for (const r of [...new Set(raizes)]) visitar(r, 0);
    achadosFc = { quando: Date.now(), lista };
    return lista;
  }

  async function projetosFilmcraft() {
    const conectado = await appAberto("filmcraft");
    const r = { conectado, rodando: conectado ? true : await fcRodando(), atual: null, sequencias: [], ativa: null, recentes: [], encontrados: [] };
    if (conectado) {
      try {
        const p = await comando("filmcraft", "project.inspect", {});
        r.atual = { nome: p.name, path: p.path, alterado: !!p.dirty };
        r.ativa = p.activeSequence;
        const seqs = [];
        const andar = (n) => { for (const c of n.children || []) { if (c.type === "Sequence") seqs.push({ item: c.item, nome: c.name }); if (c.children) andar(c); } };
        andar(p.root || {});
        r.sequencias = seqs;
      } catch (e) { r.aviso = e.message; }
    }
    const rec = ((prefsFilmcraft().general || {}).recent_projects || []).filter((x) => typeof x === "string");
    const item = (p) => ({ path: p, nome: path.basename(p).replace(/\.fcproj$/i, ""), pasta: path.dirname(p), existe: fs.existsSync(p) });
    r.recentes = rec.map(item);
    const ja = new Set(rec.map((p) => path.resolve(p)));
    r.encontrados = procurarProjetosFc().filter((p) => !ja.has(path.resolve(p))).map(item);
    return r;
  }

  // Abre um projeto no FilmCraft. Aberto com controle: troca o projeto (salvando antes, se ele
  // pedir). Fechado: abre já no projeto. Aberto sem controle: não dá para falar com ele.
  async function abrirProjetoFc({ path: arq, salvar }) {
    if (arq && !fs.existsSync(arq)) throw new Error(`projeto não encontrado: ${arq}`);
    if (await appAberto("filmcraft")) {
      if (!arq) return { ok: true, texto: "FilmCraft já está conectado" };
      const p = await comando("filmcraft", "project.inspect", {});
      if (p.path && path.resolve(p.path) === path.resolve(arq)) return { ok: true, texto: `"${p.name}" já está aberto` };
      if (p.dirty) {
        if (!salvar) return { precisaSalvar: true, nome: p.name, semCaminho: !p.path };
        if (!p.path) throw new Error(`"${p.name}" nunca foi salvo. Salve no FilmCraft (Ctrl+S) e tente de novo.`);
        await comando("filmcraft", "file.save", {});
      }
      await comando("filmcraft", "file.open", { path: arq });
      return { ok: true, texto: `Abri "${path.basename(arq)}" no FilmCraft` };
    }
    if (await appRodando("filmcraft")) return { semControle: true };
    const r = await abrirApp("filmcraft", arq || undefined);
    const t = ((r.content || [])[0] || {}).text || "";
    if (r.isError) throw new Error(t);
    return { ok: true, texto: arq ? `FilmCraft aberto em "${path.basename(arq)}"` : "FilmCraft aberto" };
  }

  // Clipes da timeline que deram origem a um nó (seguindo os fios para trás).
  function origemTimeline(doc, no) {
    const vistos = new Set(), achados = [];
    const fila = [no.id];
    while (fila.length) {
      const id = fila.shift();
      if (vistos.has(id)) continue;
      vistos.add(id);
      const n = acharNo(doc, id);
      if (n && n.fc && n.id !== no.id) achados.push(n.fc);
      for (const l of doc.ligacoes) if (l.para === id) fila.push(l.de);
    }
    return achados;
  }

  // Troca, na timeline do FilmCraft, o clipe de origem pelo resultado do nó (mesmo lugar e duração;
  // dá para desfazer no FilmCraft com Ctrl+Z).
  async function substituirNaTimeline(proj, { no: id, clip }) {
    const doc = carregar(proj);
    const no = acharNo(doc, id);
    const m = no && midiaDoNo(doc, no);
    if (!m) throw new Error("esse nó não tem resultado pronto");
    const origens = origemTimeline(doc, no);
    const alvo = origens.find((o) => !clip || o.clip === clip);
    if (!alvo) throw new Error("esse nó não está ligado a um clipe da timeline (traga o clipe com Sequência → cena ou arrastando da timeline)");
    await exigirFc();
    const q = await comando("filmcraft", "sequence.inspect", {});
    const { video } = faixasDe(q || {});
    const todos = video.flatMap((t) => t.clipes.map((c) => ({ ...c, faixa: t.nome })));
    // o id do clipe muda se ele foi recortado; aí procura pelo mesmo arquivo no mesmo tempo
    const atual = todos.find((c) => c.clip === alvo.clip && c.item === alvo.item) || todos.find((c) => c.item === alvo.item && Math.abs(c.ini - alvo.ini) < 0.05);
    if (!atual) throw new Error("não achei mais esse clipe na sequência aberta (ele foi apagado ou a sequência é outra)");
    const c = doc.cenas.find((x) => x.id === no.cena);
    const item = await itemNoFilmcraft(c ? c.nome : "Quadro", caminhoMidia(doc, m));
    if (item === undefined) throw new Error("o FilmCraft não importou o arquivo");
    const r = await comando("filmcraft", "clip.replaceFromBin", { clips: [atual.clip], item });
    no.envios = (no.envios || []).filter((e) => e.app !== "filmcraft").concat({ app: "filmcraft", midia: m.id, quando: new Date().toISOString(), clip: atual.clip });
    salvar(doc);
    const curto = r && r.short && r.short.length;
    return { texto: `Clipe "${atual.nome}" em ${tc(atual.ini)} (${atual.faixa}) trocado pela versão ${no.versoes.indexOf(m.id) + 1}${curto ? ". O resultado é mais curto que o clipe: o fim ficou vazio." : ""}. Para voltar, Ctrl+Z no FilmCraft.` };
  }

  // Modo manual sem trabalho: depois do Gerar, o quadro fica de olho nas pastas onde o ArtCraft
  // costuma salvar (Downloads, Área de Trabalho, Vídeos, Imagens) e puxa o arquivo novo sozinho.
  // A pasta de download do próprio ArtCraft (Settings › Downloads) vem primeiro: ~/Artcraft/settings/app_preferences.json.
  function pastaDoArtcraft() {
    try {
      const p = JSON.parse(fs.readFileSync(path.join(os.homedir(), "Artcraft", "settings", "app_preferences.json"), "utf8"));
      const d = p.preferred_download_directory;
      if (d && typeof d === "object" && d.custom) return String(d.custom);
      if (d && typeof d === "object" && d.system === "documents") return path.join(os.homedir(), "Documents");
      if (d === "documents") return path.join(os.homedir(), "Documents");
    } catch {}
    return null;
  }
  function pastasEspera() {
    const casa = os.homedir();
    const nuvem = [process.env.OneDrive, process.env.OneDriveConsumer, process.env.OneDriveCommercial].filter(Boolean);
    const nomes = ["Downloads", "Desktop", "Área de Trabalho", "Videos", "Vídeos", "Pictures", "Imagens", "Documents", "Documentos"];
    const lista = [pastaDoArtcraft(), path.join(casa, "Artcraft", "downloads"), ...nomes.map((d) => path.join(casa, d)), ...nuvem.flatMap((n) => nomes.map((d) => path.join(n, d)))];
    return [...new Set(lista.filter((p) => p && fs.existsSync(p)))];
  }
  const esperas = new Map(); // "proj:no" → { desde, saida, visto: {arq, tam} }
  let timerEspera = null;

  function esperarResultado(proj, id) {
    const doc = carregar(proj);
    const no = acharNo(doc, id);
    if (!no || no.tipo !== "gerar") throw new Error("nó Gerar não encontrado");
    no.estado = "aguardando";
    no.erro = "";
    no.aguardando = { desde: Date.now() - 2000, saida: no.saida };
    salvar(doc);
    esperas.set(`${doc.nome}\n${no.id}`, { proj: doc.nome, no: no.id });
    if (!timerEspera) timerEspera = setInterval(varrerEsperas, 2000);
  }

  function cancelarEspera(proj, id) {
    const doc = carregar(proj);
    const no = acharNo(doc, id);
    esperas.delete(`${doc.nome}\n${id}`);
    if (no && no.estado === "aguardando") { no.estado = no.atual ? "pronto" : "vazio"; delete no.aguardando; salvar(doc); }
  }

  const tamanhos = new Map(); // arquivo → tamanho na varredura anterior (só puxa quando parou de crescer)
  function varrerEsperas() {
    if (!esperas.size) { clearInterval(timerEspera); timerEspera = null; return; }
    const usados = new Set();
    for (const [k, e] of esperas) {
      try { varrerUma(k, e, usados); } catch (err) { log(`vigia: ${err.message}`); }
    }
  }

  const consumidos = new Set(); // arquivos já viraram versão de algum nó (caminho + data)
  function varrerUma(k, e, usados) {
    {
      const doc = carregar(e.proj);
      const no = acharNo(doc, e.no);
      if (!no || no.estado !== "aguardando" || !no.aguardando) { esperas.delete(k); return; }
      if (Date.now() - no.aguardando.desde > 3 * 3600000) { no.estado = "erro"; no.erro = "nenhum arquivo novo em 3 h. No ArtCraft, baixe o resultado (ou ligue Settings › Downloads › Auto Download) ou arraste o arquivo para o nó"; delete no.aguardando; esperas.delete(k); salvar(doc); return; }
      const extOk = no.aguardando.saida === "video" ? EXT_VIDEO : EXT_IMAGEM;
      let melhor = null;
      for (const pasta of pastasEspera()) {
        let itens;
        try { itens = fs.readdirSync(pasta); } catch { continue; }
        for (const nome of itens) {
          if (!extOk.has(path.extname(nome).toLowerCase())) continue;
          const arq = path.join(pasta, nome);
          if (usados.has(arq)) continue;
          let st;
          try { st = fs.statSync(arq); } catch { continue; }
          if (!st.isFile() || st.size === 0 || Math.max(st.mtimeMs, st.birthtimeMs || 0) < no.aguardando.desde) continue;
          if (consumidos.has(`${arq}|${st.mtimeMs}`)) continue;
          if (!melhor || st.mtimeMs > melhor.t) melhor = { arq, t: st.mtimeMs, tam: st.size };
        }
      }
      if (!melhor) return;
      // só entra depois de 3 varreduras seguidas com o mesmo tamanho e 3 s sem mexer (download terminou)
      const chave = `${k}|${melhor.arq}`;
      const visto = tamanhos.get(chave);
      if (!visto || visto.tam !== melhor.tam) { tamanhos.set(chave, { tam: melhor.tam, n: 1 }); return; }
      if (++visto.n < 3 || Date.now() - melhor.t < 3000) return;
      tamanhos.delete(chave);
      usados.add(melhor.arq);
      consumidos.add(`${melhor.arq}|${melhor.t}`);
      try {
        const c = doc.cenas.find((x) => x.id === no.cena);
        const nomeFinal = `${c ? c.nome : "Quadro"} - ${no.titulo || "resultado"} v${no.versoes.length + 1}${path.extname(melhor.arq).toLowerCase()}`;
        const m = guardarBytes(doc, nomeFinal, lerArquivoGrande(melhor.arq), "gerado", { prompt: montarPrompt(doc, no).prompt, motor: "manual", arquivoOriginal: melhor.arq });
        adicionarVersao(no, m.id);
        delete no.aguardando;
        esperas.delete(k);
        salvar(doc);
        log(`quadro: ${path.basename(melhor.arq)} virou a versão nova de ${no.id}`);
      } catch (err) { no.estado = "erro"; no.erro = err.message; delete no.aguardando; esperas.delete(k); salvar(doc); }
    }
  }

  function lerArquivoGrande(arq) {
    const tam = fs.statSync(arq).size;
    if (tam > 1.5 * 1024 ** 3) throw new Error(`${path.basename(arq)} é grande demais (${Math.round(tam / 1048576)} MB) para importar de uma vez; arraste um arquivo menor para o nó`);
    return fs.readFileSync(arq);
  }

  function retomarEsperas() {
    for (const proj of listarProjetos()) {
      const doc = carregar(proj);
      for (const no of doc.nos) if (no.estado === "aguardando" && no.aguardando) esperas.set(`${doc.nome}\n${no.id}`, { proj: doc.nome, no: no.id });
    }
    if (esperas.size && !timerEspera) timerEspera = setInterval(varrerEsperas, 2000);
  }

  function resumoTimeline(l) {
    if (!l.conectado) return "FilmCraft fechado ou sem o controle ligado.";
    const s = l.sequencia;
    if (!s) return "FilmCraft aberto, sem sequência ativa.";
    const linhas = [`Sequência "${s.nome}" · ${tc(s.duracao)} · ${s.largura}x${s.altura} ${Math.round(s.fps * 100) / 100}fps · playhead ${tc(s.playhead)}`];
    if (s.marcadores.length) linhas.push(`marcadores: ${s.marcadores.map((m) => `${tc(m.ini)} ${m.nome}`).join(" | ")}`);
    for (const f of [...s.video].reverse().concat(s.audio)) {
      if (!f.clipes.length) continue;
      linhas.push(`${f.nome}: ${f.clipes.map((c) => `[${tc(c.ini)}-${tc(c.ini + c.dur)}] ${c.nome} (clip ${c.clip})`).join(" · ")}`);
    }
    return linhas.join("\n");
  }

  // -------------------------------------------------------------------------------------------
  // Resumo compacto (para o Claude gastar poucos tokens)
  // -------------------------------------------------------------------------------------------

  function resumo(proj, cenaPedida) {
    const doc = carregar(proj);
    const cfg = config();
    const linhas = [`Projeto "${doc.nome}" · motor ${cfg.motor}${cfg.motor !== "manual" && !(cfg.motor === "artcraft" ? cfg.artcraftKey : cfg.falKey) ? " (SEM CHAVE)" : ""} · ${URL_QUADRO}`];
    linhas.push(`Cenas: ${doc.cenas.map((c) => `${c.id} "${c.nome}" (${doc.nos.filter((n) => n.cena === c.id).length} nós)`).join(", ")}`);
    const cenas = cenaPedida ? [acharCena(doc, cenaPedida)].filter(Boolean) : doc.cenas;
    if (cenaPedida && !cenas.length) linhas.push(`(cena "${cenaPedida}" não existe)`);
    for (const c of cenas) {
      const nos = doc.nos.filter((n) => n.cena === c.id);
      if (!nos.length) continue;
      linhas.push("", `## ${c.id} ${c.nome}${c.notas ? ` · notas: ${c.notas}` : ""}`);
      for (const n of nos) {
        const m = midiaDoNo(doc, n);
        let l = `${n.id} ${n.tipo}`;
        if (n.tipo === "gerar") {
          l += ` ${n.saida}${n.saida === "video" ? ` ${n.duracao}s` : ""} ${n.proporcao || ""} ${n.modelo || "(modelo padrão)"} [${n.estado}${n.estado === "gerando" && n.progresso ? ` ${n.progresso}%` : ""}${n.versoes.length ? ` v${n.versoes.indexOf(n.atual) + 1}/${n.versoes.length}` : ""}]`;
        }
        if (n.titulo) l += ` "${n.titulo}"`;
        if (m) l += ` ${m.id}=${m.arquivo}${m.w ? ` ${m.w}x${m.h}` : ""}`;
        if (n.tipo === "nota" && n.texto) l += `: ${n.texto.replace(/\s+/g, " ").slice(0, 200)}`;
        if (n.tipo === "gerar" && n.prompt) l += ` · instrução: ${n.prompt.replace(/\s+/g, " ").slice(0, 200)}`;
        const ent = entradas(doc, n);
        if (ent.length) l += ` ← ${ent.map(({ l: f, de }) => `${de.id}${f.texto ? ` "${f.texto.replace(/\s+/g, " ").slice(0, 160)}"` : ""} (${f.id})`).join(", ")}`;
        if (n.erro) l += ` · ERRO: ${n.erro}`;
        if (n.envios && n.envios.length) l += ` · enviado: ${n.envios.map((e) => e.app).join("+")}`;
        linhas.push(l);
      }
    }
    return linhas.join("\n");
  }

  // -------------------------------------------------------------------------------------------
  // Servidor HTTP (só 127.0.0.1)
  // -------------------------------------------------------------------------------------------

  const ouvintes = new Map(); // projeto → Set(res)

  function avisar(proj, ev) {
    const set = ouvintes.get(proj);
    if (!set) return;
    const linha = `data: ${JSON.stringify(ev)}\n\n`;
    for (const res of set) { try { res.write(linha); } catch {} }
  }

  function json(res, status, obj) {
    const corpo = JSON.stringify(obj);
    res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
    res.end(corpo);
  }

  function lerCorpo(req, limite = 600 * 1024 * 1024) {
    return new Promise((resolve, reject) => {
      const partes = [];
      let tam = 0;
      req.on("data", (d) => { tam += d.length; if (tam > limite) { reject(new Error("arquivo grande demais")); req.destroy(); } else partes.push(d); });
      req.on("end", () => resolve(Buffer.concat(partes)));
      req.on("error", reject);
    });
  }

  function servirArquivo(req, res, arq) {
    let st;
    try { st = fs.statSync(arq); } catch { res.writeHead(404); return res.end(); }
    if (!st.isFile()) { res.writeHead(404); return res.end(); }
    const tipo = MIME[path.extname(arq).toLowerCase()] || "application/octet-stream";
    const range = req.headers.range && /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
    if (range && (range[1] || range[2])) {
      let ini = range[1] ? Number(range[1]) : st.size - Number(range[2]);
      let fim = range[1] && range[2] ? Number(range[2]) : st.size - 1;
      if (ini < 0) ini = 0;
      if (fim >= st.size) fim = st.size - 1;
      if (ini > fim) { res.writeHead(416, { "Content-Range": `bytes */${st.size}` }); return res.end(); }
      res.writeHead(206, { "Content-Type": tipo, "Content-Length": fim - ini + 1, "Content-Range": `bytes ${ini}-${fim}/${st.size}`, "Accept-Ranges": "bytes" });
      return enviarStream(res, fs.createReadStream(arq, { start: ini, end: fim }));
    }
    res.writeHead(200, { "Content-Type": tipo, "Content-Length": st.size, "Accept-Ranges": "bytes", "Cache-Control": arq.startsWith(WEB) ? "no-cache" : "private, max-age=3600" });
    enviarStream(res, fs.createReadStream(arq));
  }

  // arquivo que some/trava no meio do envio não pode derrubar o programa; seek cancelado fecha o arquivo
  function enviarStream(res, stream) {
    stream.on("error", () => res.destroy());
    res.on("close", () => stream.destroy());
    stream.pipe(res);
  }

  function abrirNoSistema(alvo, selecionar) {
    let cmd, args;
    if (WINDOWS) {
      if (selecionar) { cmd = "explorer"; args = [`/select,${alvo}`]; } else { cmd = "rundll32"; args = ["url.dll,FileProtocolHandler", alvo]; }
    } else if (process.platform === "darwin") { cmd = "open"; args = selecionar ? ["-R", alvo] : [alvo]; }
    else { cmd = "xdg-open"; args = [selecionar ? path.dirname(alvo) : alvo]; }
    try { const p = spawn(cmd, args, { detached: true, stdio: "ignore", windowsHide: true }); p.on("error", () => {}); p.unref(); } catch {}
  }

  const CSP = "default-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'";

  async function rotear(req, res) {
    const u = new URL(req.url, URL_QUADRO);
    const host = (req.headers.host || "").replace(/:\d+$/, "");
    if (!["localhost", "127.0.0.1", "[::1]"].includes(host)) { res.writeHead(403); return res.end(); }
    const rota = u.pathname;
    const proj = projetoAtivo(u.searchParams.get("p"));

    if (req.method === "GET") {
      const estatico = rota === "/" ? "index.html" : /^\/(index\.html|app\.js|style\.css|icone\.svg)$/.test(rota) ? rota.slice(1) : null;
      if (estatico && WEB_EMBUTIDO) {
        res.writeHead(200, { "Content-Type": MIME[path.extname(estatico)], "Cache-Control": "no-cache", "X-Content-Type-Options": "nosniff", ...(estatico === "index.html" ? { "Content-Security-Policy": CSP } : {}) });
        return res.end(WEB_EMBUTIDO[estatico]);
      }
      if (estatico) return servirArquivo(req, res, path.join(WEB, estatico));
      if (rota.startsWith("/midia/")) {
        const doc = carregar(proj);
        let idm = "";
        try { idm = decodeURIComponent(rota.slice(7)); } catch {}
        const m = Object.hasOwn(doc.midias, idm) ? doc.midias[idm] : null;
        if (!m) { res.writeHead(404); return res.end(); }
        return servirArquivo(req, res, caminhoMidia(doc, m));
      }
      if (rota.startsWith("/mini/")) return servirArquivo(req, res, caminhoMini(carregar(proj), path.basename(rota.slice(6), ".jpg")));
      if (rota === "/api/ping") return json(res, 200, { artcraftQuadro: true, versao: VERSAO, pid: process.pid });
      if (rota === "/api/projetos") return json(res, 200, { projetos: listarProjetos(), ativo: proj });
      if (rota === "/api/quadro") {
        const doc = carregar(proj);
        const minis = new Set();
        try { for (const f of fs.readdirSync(path.join(pastaProjeto(doc.nome), "miniaturas"))) minis.add(path.basename(f, ".jpg")); } catch {}
        return json(res, 200, { ...doc, miniaturas: [...minis], gerando: doc.nos.filter((n) => n.estado === "gerando").map((n) => n.id) });
      }
      if (rota === "/api/resumo") return json(res, 200, { texto: resumo(proj, u.searchParams.get("cena")) });
      if (rota === "/api/prompt") {
        const doc = carregar(proj);
        const no = acharNo(doc, u.searchParams.get("no"));
        if (!no) return json(res, 404, { erro: "nó não encontrado" });
        const r = montarPrompt(doc, no);
        return json(res, 200, { ...r, arquivos: r.imagens.concat(r.videos).map((id) => caminhoMidia(doc, doc.midias[id])) });
      }
      if (rota === "/api/comfy") return json(res, 200, await comfyEstado());
      if (rota === "/api/config") {
        const c = config();
        return json(res, 200, {
          motor: c.motor, comfyUrl: c.comfyUrl, comfy: fs.existsSync(arqReceita("imagem")) || fs.existsSync(arqReceita("video")), artcraft: !!c.artcraftKey, fal: !!c.falKey, modelos: MODELOS, pasta: RAIZ, versao: VERSAO,
          github: origemAtualizacao ? origemAtualizacao.ler() : null,
          proporcoes: ["16:9", "9:16", "1:1", "4:3", "3:4", "21:9", "4:5", "auto"],
        });
      }
      if (rota === "/api/filmcraft/linha") {
        try { return json(res, 200, await linhaFilmcraft()); } catch (e) { return json(res, 200, { conectado: true, sequencia: null, aviso: e.message }); }
      }
      if (rota === "/api/filmcraft/monitor") {
        try {
          const png = await quadroDoFilme(undefined, Math.min(Number(u.searchParams.get("lado")) || 640, 1280));
          res.writeHead(200, { "Content-Type": "image/png", "Cache-Control": "no-store" });
          return res.end(png);
        } catch (e) { return json(res, 409, { erro: e.message }); }
      }
      if (rota === "/api/filmcraft/projetos") return json(res, 200, await projetosFilmcraft());
      if (rota === "/api/atualizacao") return json(res, 200, { versao: VERSAO, pronta: atualizacao(), podeReiniciar: !!reiniciar });
      if (rota === "/api/filmcraft/arquivo") {
        // Só serve arquivos que o próprio FilmCraft listou como mídia do projeto.
        const arq = arquivosFc.get(Number(u.searchParams.get("item")));
        if (!arq) { res.writeHead(404); return res.end(); }
        return servirArquivo(req, res, arq);
      }
      if (rota === "/api/eventos") {
        res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-store", Connection: "keep-alive" });
        res.write(`data: ${JSON.stringify({ tipo: "ola" })}\n\n`);
        if (!ouvintes.has(proj)) ouvintes.set(proj, new Set());
        ouvintes.get(proj).add(res);
        const pulso = setInterval(() => { try { res.write(": pulso\n\n"); } catch {} }, 25000);
        req.on("close", () => { clearInterval(pulso); ouvintes.get(proj).delete(res); });
        return;
      }
      res.writeHead(404);
      return res.end();
    }

    if (req.method !== "POST") { res.writeHead(405); return res.end(); }
    // Pedidos que mudam algo precisam deste cabeçalho: um site de fora não consegue mandá-lo sem
    // permissão (CORS), então só o próprio quadro e o conector conseguem.
    if (req.headers["x-quadro"] !== "1") { res.writeHead(403); return res.end(); }
    const origem = req.headers.origin; // páginas de outros sites não mandam no quadro
    if (origem && origem !== "null" && !/^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origem)) { res.writeHead(403); return res.end(); }
    if (req.headers["sec-fetch-site"] && !["same-origin", "none"].includes(req.headers["sec-fetch-site"])) { res.writeHead(403); return res.end(); }

    try {
      if (rota === "/api/upload") {
        const doc = carregar(proj);
        const bytes = await lerCorpo(req);
        const m = guardarBytes(doc, u.searchParams.get("nome") || "imagem.png", bytes, "upload");
        const noId = u.searchParams.get("no");
        if (noId) marcarHistorico(doc);
        let r = { midia: m.id };
        if (noId) r = { ...r, ...aplicarOps(doc, [{ op: "no", id: noId, midia: m.id }]) };
        salvar(doc);
        return json(res, 200, r);
      }
      if (rota === "/api/miniatura") {
        const doc = carregar(proj);
        const id = u.searchParams.get("m");
        if (!doc.midias[id]) return json(res, 404, { erro: "mídia não encontrada" });
        const bytes = await lerCorpo(req, 4 * 1024 * 1024);
        fs.mkdirSync(path.dirname(caminhoMini(doc, id)), { recursive: true });
        fs.writeFileSync(caminhoMini(doc, id), bytes);
        return json(res, 200, { ok: true });
      }
      const corpo = JSON.parse((await lerCorpo(req, 2 * 1024 * 1024)).toString("utf8") || "{}");
      if (rota === "/api/projetos") {
        const nome = limparNome(corpo.nome);
        if (!nome) return json(res, 400, { erro: "nome vazio" });
        carregar(nome);
        salvarConfig({ ativo: nome });
        return json(res, 200, { ativo: nome, projetos: listarProjetos() });
      }
      if (rota === "/api/ops") {
        const doc = carregar(proj);
        const copia = JSON.stringify(doc);
        try {
          if (!corpo.semHistorico) marcarHistorico(doc);
          const r = aplicarOps(doc, corpo.ops);
          salvar(doc);
          return json(res, 200, { ok: true, ...r, rev: doc.rev });
        } catch (e) {
          restaurarDoc(doc, copia); // desfaz o lote inteiro
          if (!corpo.semHistorico) hist(doc).antes.pop();
          return json(res, 400, { erro: e.message });
        }
      }
      if (rota === "/api/gerar") {
        const r = [];
        for (const id of corpo.nos || [corpo.no]) {
          try { r.push({ no: id, ...(await gerar(proj, id)) }); } catch (e) { r.push({ no: id, erro: e.message }); }
        }
        if (corpo.aguardar) {
          const limite = Date.now() + Math.min(Number(corpo.aguardar) || 45, 50) * 1000;
          const doc = carregar(proj);
          const pend = () => r.filter((x) => trabalhos.has(`${doc.nome}:${x.no}`)).map((x) => trabalhos.get(`${doc.nome}:${x.no}`));
          while (pend().length && Date.now() < limite) await Promise.race([...pend(), new Promise((ok) => setTimeout(ok, 1000))]);
        }
        return json(res, 200, { resultados: r });
      }
      if (rota === "/api/enviar") return json(res, 200, { texto: await enviar(proj, corpo) });
      if (rota === "/api/filmcraft/abrir") return json(res, 200, await abrirProjetoFc(corpo));
      if (rota === "/api/filmcraft/sequencia") {
        await exigirFc();
        await comando("filmcraft", "sequence.open", { item: Number(corpo.item) });
        return json(res, 200, { ok: true });
      }
      if (rota === "/api/filmcraft/controle") {
        if (!controlePermanente) throw new Error("indisponível aqui");
        const r = await controlePermanente({ ativar: true });
        const t = ((r.content || [])[0] || {}).text || "";
        if (r.isError) throw new Error(t);
        return json(res, 200, { texto: t });
      }
      if (rota === "/api/reiniciar") {
        if (!reiniciar) throw new Error("reinicie o Claude Desktop para usar a versão nova");
        json(res, 200, { ok: true });
        setTimeout(reiniciar, 300);
        return;
      }
      if (rota === "/api/filmcraft/playhead") {
        await exigirFc();
        await comando("filmcraft", "playhead.set", { seconds: Math.max(0, Number(corpo.seconds) || 0) });
        return json(res, 200, { ok: true });
      }
      if (rota === "/api/desfazer" || rota === "/api/refazer") {
        const doc = carregar(proj);
        return json(res, 200, { ok: voltarHistorico(doc, rota === "/api/refazer") });
      }
      if (rota === "/api/filmcraft/importar") return json(res, 200, await importarSequencia(proj, corpo));
      if (rota === "/api/filmcraft/substituir") return json(res, 200, await substituirNaTimeline(proj, corpo));
      if (rota === "/api/esperar") {
        if (corpo.cancelar) cancelarEspera(proj, corpo.no); else esperarResultado(proj, corpo.no);
        return json(res, 200, { ok: true, pastas: pastasEspera() });
      }
      if (rota === "/api/filmcraft/colocar") return json(res, 200, await colocarNaTimeline(proj, corpo));
      if (rota === "/api/config") {
        const m = {};
        if (corpo.motor !== undefined) m.motor = ["artcraft", "fal", "comfy", "manual"].includes(corpo.motor) ? corpo.motor : undefined;
        if (corpo.artcraftKey !== undefined) m.artcraftKey = String(corpo.artcraftKey).trim();
        if (corpo.falKey !== undefined) m.falKey = String(corpo.falKey).trim();
        if (corpo.comfyUrl !== undefined) { const u = String(corpo.comfyUrl).trim(); if (u && !/^http:\/\/(127\.0\.0\.1|localhost|\[::1\])(:\d+)?\/?$/i.test(u) && !/^https?:\/\/[\w.-]+(:\d+)?\/?$/i.test(u)) throw new Error("endereço do ComfyUI inválido (ex.: http://127.0.0.1:8188)"); m.comfyUrl = u || "http://127.0.0.1:8188"; }
        if (corpo.github !== undefined && origemAtualizacao) origemAtualizacao.gravar(corpo.github);
        salvarConfig(m);
        return json(res, 200, { ok: true });
      }
      if (rota === "/api/comfy/receita") {
        const pronta = corpo.padrao && RECEITAS_PRONTAS[corpo.padrao];
        if (corpo.padrao && !pronta) throw new Error("receita pronta desconhecida");
        const wf = validarReceita(pronta || (typeof corpo.json === "string" ? JSON.parse(corpo.json) : corpo.json));
        fs.mkdirSync(PASTA_COMFY, { recursive: true });
        fs.writeFileSync(arqReceita(corpo.tipo), JSON.stringify(wf));
        return json(res, 200, { ok: true, nos: Object.keys(wf).length });
      }
      if (rota === "/api/pacote") return json(res, 200, await prepararPacote(proj, corpo.no));
      if (rota === "/api/mostrar") {
        const doc = carregar(proj);
        const m = doc.midias[corpo.midia];
        abrirNoSistema(m ? caminhoMidia(doc, m) : pastaProjeto(doc.nome), true);
        return json(res, 200, { ok: true });
      }
      return json(res, 404, { erro: "rota desconhecida" });
    } catch (e) {
      return json(res, 400, { erro: e.message || String(e) });
    }
  }

  let servidor = null;
  let estadoServidor = "parado"; // proprio | outro | erro

  function iniciar() {
    fs.mkdirSync(RAIZ, { recursive: true });
    return new Promise((resolve) => {
      servidor = http.createServer((req, res) => {
        rotear(req, res).catch((e) => { try { json(res, 500, { erro: e.message }); } catch {} });
      });
      servidor.on("error", async (e) => {
        if (e.code === "EADDRINUSE") {
          // Outro processo (outra janela do Claude, por exemplo) já serve o quadro: usamos o dele.
          try {
            const r = await fetch(`${URL_QUADRO}/api/ping`);
            const j = await r.json();
            estadoServidor = j.artcraftQuadro ? "outro" : "erro";
          } catch { estadoServidor = "erro"; }
          if (estadoServidor === "erro") log(`quadro: a porta ${PORTA} está ocupada por outro programa`);
        } else { estadoServidor = "erro"; log(`quadro: ${e.message}`); }
        resolve(estadoServidor);
      });
      servidor.listen(PORTA, "127.0.0.1", () => {
        estadoServidor = "proprio";
        log(`quadro em ${URL_QUADRO} (pasta ${RAIZ})`);
        retomarTrabalhos();
        retomarEsperas();
        resolve(estadoServidor);
      });
    });
  }

  function parar() {
    salvarJa();
    if (servidor) try { servidor.close(); } catch {}
  }

  // -------------------------------------------------------------------------------------------
  // Ferramentas MCP do quadro (sempre via HTTP, então funcionam mesmo se outro processo serve)
  // -------------------------------------------------------------------------------------------

  let pronto = null;
  async function garantirServidor() {
    if (!pronto) pronto = iniciar();
    const est = await pronto;
    if (est === "erro") { pronto = null; throw new Error(`o quadro não conseguiu usar a porta ${PORTA}. Feche o programa que está nela ou mude a porta nas configurações do conector.`); }
    return est;
  }

  async function api(metodo, rota, proj, corpo) {
    await garantirServidor();
    const u = `${URL_QUADRO}${rota}${rota.includes("?") ? "&" : "?"}p=${encodeURIComponent(proj || "")}`;
    const r = await fetch(u, metodo === "GET" ? {} : { method: metodo, headers: { "Content-Type": "application/json", "X-Quadro": "1" }, body: JSON.stringify(corpo || {}) });
    const t = await r.text();
    let j = {};
    try { j = JSON.parse(t); } catch {}
    if (!r.ok) throw new Error(j.erro || `HTTP ${r.status}${t ? "" : " (o quadro que está aberto é de uma versão antiga: feche-o e abra de novo)"}`);
    return j;
  }

  const txt = (t, erro = false) => ({ content: [{ type: "text", text: t }], isError: erro });
  const esquemaProjeto = { type: "string", description: "Nome do projeto (opcional; padrão: o projeto aberto no quadro)." };

  const FERRAMENTAS = [
    {
      name: "quadro_abrir",
      title: "Abrir o quadro de cenas",
      description: "Abre o quadro de cenas no navegador do usuário (localhost) e devolve o endereço e o resumo do projeto. Com 'projeto', cria ou troca de projeto.",
      inputSchema: { type: "object", properties: { projeto: esquemaProjeto, navegador: { type: "boolean", description: "false = só garante que o quadro está no ar, sem abrir o navegador." } }, additionalProperties: false },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    {
      name: "quadro_ver",
      title: "Ver o quadro",
      description: "Resumo compacto do quadro: cenas, nós (id, tipo, título, arquivo, estado) e fios com o texto escrito neles (← id \"texto\"). Com 'miniaturas', inclui imagens pequenas dos nós pedidos (custa tokens: peça só as que precisa ver).",
      inputSchema: {
        type: "object",
        properties: {
          projeto: esquemaProjeto,
          cena: { type: "string", description: "Só esta cena (id como c4, ou nome como \"Cena 4\" ou \"4\")." },
          miniaturas: { type: "array", items: { type: "string" }, description: "Ids de nós para ver a imagem (máx. 6)." },
        },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
    {
      name: "quadro_editar",
      title: "Editar o quadro",
      description: [
        "Aplica várias mudanças no quadro de uma vez (o navegador atualiza na hora). 'acoes' é uma lista; cada item tem 'op':",
        "cena {nome, id?, notas?} cria ou renomeia cena;",
        "no {id? (para editar), cena, tipo: midia|gerar|nota, titulo, arquivo (caminho completo de imagem/vídeo no PC para importar), texto (nota), prompt (instrução extra do nó Gerar), saida: imagem|video, modelo, proporcao (16:9, 9:16, 1:1...), duracao (s), x?, y?};",
        "ligar {de, para (nó Gerar), texto} cria o fio e escreve nele o que gerar; texto_ligacao {id, texto};",
        "remover {id} (nó ou fio); versao {no, midia} escolhe a versão atual.",
        "Use 'ref' num item para nomeá-lo e citar esse nome em de/para/id nos itens seguintes. Sem x/y, o quadro posiciona sozinho.",
        "Se uma ação falhar, nada do lote é aplicado.",
      ].join(" "),
      inputSchema: {
        type: "object",
        properties: { projeto: esquemaProjeto, acoes: { type: "array", items: { type: "object", additionalProperties: true } } },
        required: ["acoes"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: false },
    },
    {
      name: "quadro_gerar",
      title: "Gerar foto ou vídeo",
      description: "Dispara a geração dos nós Gerar indicados (gasta créditos da ArtCraft ou da fal.ai: só use quando o usuário pedir para gerar). O prompt é montado com as referências ligadas e o texto dos fios. Com 'aguardar' (até 50 s), espera e devolve a miniatura do que ficou pronto; vídeo costuma levar minutos, então confira depois com quadro_ver.",
      inputSchema: {
        type: "object",
        properties: { projeto: esquemaProjeto, nos: { type: "array", items: { type: "string" } }, aguardar: { type: "boolean" } },
        required: ["nos"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    {
      name: "quadro_enviar",
      title: "Enviar para FilmCraft / EffectCraft",
      description: "Importa o resultado atual dos nós (ou de todos os nós Gerar prontos de uma cena) no FilmCraft e/ou EffectCraft abertos, num bin/pasta com o nome da cena. Abre o app com o controle ligado se estiver fechado.",
      inputSchema: {
        type: "object",
        properties: {
          projeto: esquemaProjeto,
          app: { type: "string", enum: ["filmcraft", "effectcraft", "ambos"] },
          nos: { type: "array", items: { type: "string" }, description: "Ids dos nós (opcional se informar a cena)." },
          cena: { type: "string", description: "Envia todos os resultados prontos desta cena." },
        },
        required: ["app"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    },
    {
      name: "quadro_timeline",
      title: "Timeline do FilmCraft",
      description: "Liga o quadro à sequência aberta no FilmCraft. acao: ver (faixas, clipes com tempos, marcadores e playhead, em texto curto; com 'quadro' devolve a imagem do monitor), importar (traz os clipes de vídeo da sequência para uma cena do quadro, um nó por clipe; 'clips' limita a alguns, 'cena' escolhe o nome), colocar (põe o resultado do nó 'no' na timeline no playhead ou em 'segundos', numa faixa livre, sem cobrir a edição), substituir (troca o clipe da timeline de onde o nó 'no' veio pelo resultado dele; só com o OK do usuário).",
      inputSchema: {
        type: "object",
        properties: {
          projeto: esquemaProjeto,
          acao: { type: "string", enum: ["ver", "importar", "colocar", "substituir"] },
          quadro: { type: "boolean" },
          clips: { type: "array", items: { type: "number" } },
          cena: { type: "string" },
          no: { type: "string" },
          segundos: { type: "number" },
        },
        required: ["acao"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: false },
    },
  ];

  async function miniaturaConteudo(proj, doc, noId) {
    const no = doc.nos.find((n) => n.id === noId);
    if (!no) return null;
    const mId = no.tipo === "gerar" ? no.atual : no.midia;
    const m = mId && doc.midias[mId];
    if (!m) return null;
    const pasta = pastaProjeto(limparNome(doc.nome));
    let arq = path.join(pasta, "miniaturas", `${m.id}.jpg`);
    let mime = "image/jpeg";
    if (!fs.existsSync(arq)) {
      if (m.tipo !== "imagem") return { type: "text", text: `${noId}: vídeo sem miniatura ainda (abra o quadro no navegador para gerá-la)` };
      arq = path.join(pasta, "midia", m.arquivo);
      mime = MIME[path.extname(arq).toLowerCase()] || "image/png";
      if (fs.statSync(arq).size > 1024 * 1024) return { type: "text", text: `${noId}: sem miniatura ainda e o original é grande (${m.arquivo}); abra o quadro no navegador para gerar as miniaturas` };
    }
    return { type: "image", data: fs.readFileSync(arq).toString("base64"), mimeType: mime };
  }

  const EXECUTORES = {
    async quadro_abrir({ projeto, navegador }) {
      await garantirServidor();
      let proj = projeto;
      if (projeto) proj = (await api("POST", "/api/projetos", "", { nome: projeto })).ativo;
      const url = `${URL_QUADRO}/${proj ? `?p=${encodeURIComponent(proj)}` : ""}`;
      if (navegador !== false) abrirNoSistema(url, false);
      const r = await api("GET", "/api/resumo", proj);
      return txt(`${navegador !== false ? "Quadro aberto no navegador" : "Quadro no ar"}: ${url}\n${r.texto}`);
    },
    async quadro_ver({ projeto, cena, miniaturas }) {
      const r = await api("GET", `/api/resumo${cena ? `?cena=${encodeURIComponent(cena)}` : ""}`, projeto);
      const content = [{ type: "text", text: r.texto }];
      if (miniaturas && miniaturas.length) {
        const doc = await api("GET", "/api/quadro", projeto);
        for (const id of miniaturas.slice(0, 6)) {
          const c = await miniaturaConteudo(projeto, doc, id);
          if (c) content.push(...(c.type === "image" ? [{ type: "text", text: id }, c] : [c]));
        }
      }
      return { content };
    },
    async quadro_editar({ projeto, acoes }) {
      const r = await api("POST", "/api/ops", projeto, { ops: acoes });
      const refs = Object.entries(r.refs || {}).map(([k, v]) => `${k}=${v}`).join(", ");
      return txt(`ok${r.criados && r.criados.length ? ` · criados: ${r.criados.join(", ")}` : ""}${refs ? ` · refs: ${refs}` : ""}`);
    },
    async quadro_gerar({ projeto, nos, aguardar }) {
      const r = await api("POST", "/api/gerar", projeto, { nos, aguardar: aguardar ? 50 : 0 });
      const erroDe = Object.fromEntries(r.resultados.filter((x) => x.erro).map((x) => [x.no, x.erro]));
      const doc = await api("GET", "/api/quadro", projeto);
      const linhas = [];
      const imagens = [];
      for (const id of nos) {
        const no = doc.nos.find((n) => n.id === id);
        if (erroDe[id] || !no) { linhas.push(`${id}: não gerou · ${erroDe[id] || "nó não encontrado"}`); continue; }
        linhas.push(`${id}: ${no.estado}${no.progresso ? ` ${no.progresso}%` : ""}${no.erro ? ` · ${no.erro}` : ""}`);
        if (aguardar && no.estado === "pronto") {
          const c = await miniaturaConteudo(projeto, doc, id);
          if (c) imagens.push(c);
        }
      }
      return { content: [{ type: "text", text: linhas.join("\n") }, ...imagens], isError: Object.keys(erroDe).length === nos.length };
    },
    async quadro_timeline({ projeto, acao, quadro, clips, cena, no, segundos }) {
      if (acao === "importar") return txt((await api("POST", "/api/filmcraft/importar", projeto, { clips, cena })).texto);
      if (acao === "substituir") return txt((await api("POST", "/api/filmcraft/substituir", projeto, { no })).texto);
      if (acao === "colocar") return txt((await api("POST", "/api/filmcraft/colocar", projeto, { no, seconds: segundos })).texto);
      const l = await api("GET", "/api/filmcraft/linha", projeto);
      const content = [{ type: "text", text: resumoTimeline(l) }];
      if (quadro && l.sequencia) {
        try { content.push({ type: "image", data: (await quadroDoFilme(undefined, 640)).toString("base64"), mimeType: "image/png" }); } catch (e) { content.push({ type: "text", text: `(sem imagem: ${e.message})` }); }
      }
      return { content };
    },
    async quadro_enviar({ projeto, app, nos, cena }) {
      const r = await api("POST", "/api/enviar", projeto, { app, nos, cena });
      return txt(r.texto);
    },
  };

  const INSTRUCOES = [
    `Quadro de cenas (${URL_QUADRO}): o usuário monta cada cena com nós de mídia (fotos de personagem, cenário), notas e nós Gerar ligados por fios.`,
    "O texto escrito no fio diz o que gerar. Quando ele falar de uma cena (\"cena 4\"), use quadro_ver com a cena antes de agir e responda curto.",
    "Para a edição em andamento no FilmCraft use quadro_timeline (ver a sequência, importar clipes como cena, colocar resultado no playhead).",
    "Para melhorar uma cena: ajuste os textos dos fios / instrução do nó com quadro_editar e só gere (quadro_gerar) quando ele pedir. Para levar à edição: quadro_enviar (FilmCraft = montagem, EffectCraft = VFX/motion).",
  ].join(" ");

  return { iniciar: garantirServidor, parar, definirReinicio: (f) => { reiniciar = f; }, FERRAMENTAS, EXECUTORES, INSTRUCOES, URL_QUADRO, RAIZ, _interno: { aplicarOps, montarPrompt, carregar, resumo, novoDoc } };
};
