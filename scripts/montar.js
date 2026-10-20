#!/usr/bin/env node
// Monta tudo a partir do código em server/:
//   dist/quadro-bundle.js            um arquivo só (servidor + quadro + tela), usado pelo .exe
//   versao.json + quadro-bundle.js   na raiz: é o que a atualização automática baixa
//   dist/artcraft-claude.mcpb        extensão do Claude Desktop
//   dist/quadro-artcraft-windows.zip programa Windows (Node SEA), com --exe
//
// Uso: node scripts/montar.js [--exe] [--notas "o que mudou"]
"use strict";

const { execFileSync } = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const RAIZ = path.resolve(__dirname, "..");
const SRV = path.join(RAIZ, "server");
const DIST = path.join(RAIZ, "dist");
const args = process.argv.slice(2);
const notas = args.includes("--notas") ? args[args.indexOf("--notas") + 1] || "" : "";
const VERSAO = /const VERSAO = "([^"]+)"/.exec(fs.readFileSync(path.join(SRV, "index.js"), "utf8"))[1];

fs.mkdirSync(DIST, { recursive: true });
const rodar = (cmd, a, opts = {}) => execFileSync(cmd, a, { stdio: "inherit", ...opts });

// 1. Versão igual em todo lugar
for (const arq of ["manifest.json", "package.json"]) {
  const p = path.join(RAIZ, arq);
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  j.version = VERSAO;
  fs.writeFileSync(p, `${JSON.stringify(j, null, 2)}\n`);
}

// 2. Pacote único (index.js + quadro.js + atualizar.js + tela)
const web = {};
for (const f of ["index.html", "app.js", "style.css", "icone.svg"]) web[f] = fs.readFileSync(path.join(SRV, "web", f), "utf8");
const modulo = (nome) => `(function () { const module = { exports: {} }; (function (module, exports) {\n${fs.readFileSync(path.join(SRV, nome), "utf8")}\n})(module, module.exports); return module.exports; })()`;
let index = fs.readFileSync(path.join(SRV, "index.js"), "utf8").replace(/^#!.*\n/, "");
index = index.replace('require("./quadro")', "__quadroModulo()").replace('require("./atualizar")', "__atualizarModulo");
const pacote = `"use strict";
globalThis.__QUADRO_WEB = ${JSON.stringify(web)};
function __quadroModulo() { return ${modulo("quadro.js")}; }
const __atualizarModulo = ${modulo("atualizar.js")};
${index}
`;
const arqPacote = path.join(DIST, "quadro-bundle.js");
fs.writeFileSync(arqPacote, pacote);
rodar(process.execPath, ["--check", arqPacote]);

// 3. Atualização automática: o programa baixa versao.json e quadro-bundle.js da raiz do repositório
fs.copyFileSync(arqPacote, path.join(RAIZ, "quadro-bundle.js"));
const sha256 = crypto.createHash("sha256").update(pacote).digest("hex");
const anterior = (() => { try { return JSON.parse(fs.readFileSync(path.join(RAIZ, "versao.json"), "utf8")); } catch { return {}; } })();
fs.writeFileSync(path.join(RAIZ, "versao.json"), `${JSON.stringify({ versao: VERSAO, arquivo: "quadro-bundle.js", sha256, notas: notas || (anterior.versao === VERSAO ? anterior.notas || "" : "") }, null, 2)}\n`);

// 4. Extensão do Claude Desktop (.mcpb = zip)
const mcpb = path.join(DIST, "artcraft-claude.mcpb");
fs.rmSync(mcpb, { force: true });
fs.copyFileSync(path.join(RAIZ, "docs", "GUIA.md"), path.join(DIST, "LEIA-ME.md"));
rodar("zip", ["-qr", mcpb, "manifest.json", "server", "skill"], { cwd: RAIZ });
rodar("zip", ["-qj", mcpb, path.join(DIST, "LEIA-ME.md")]);

// 5. Programa Windows: Node oficial + pacote injetado (Node SEA)
if (args.includes("--exe")) {
  const nodeWin = path.join(DIST, `node-${process.version}-win.exe`);
  if (!fs.existsSync(nodeWin)) {
    rodar("curl", ["-fsSL", "-o", nodeWin, `https://nodejs.org/dist/${process.version}/win-x64/node.exe`]);
    const somas = execFileSync("curl", ["-fsSL", `https://nodejs.org/dist/${process.version}/SHASUMS256.txt`]).toString();
    const esperado = (somas.split("\n").find((l) => l.endsWith(" win-x64/node.exe")) || "").split(/\s+/)[0];
    const obtido = crypto.createHash("sha256").update(fs.readFileSync(nodeWin)).digest("hex");
    if (!esperado || esperado !== obtido) { fs.rmSync(nodeWin); throw new Error("node.exe baixado não confere com SHASUMS256"); }
  }
  const cfg = path.join(DIST, "sea-config.json");
  const blob = path.join(DIST, "sea-prep.blob");
  fs.writeFileSync(cfg, JSON.stringify({ main: arqPacote, output: blob, disableExperimentalSEAWarning: true, useCodeCache: false }));
  rodar(process.execPath, ["--experimental-sea-config", cfg]);
  const exe = path.join(DIST, "Quadro ArtCraft.exe");
  fs.copyFileSync(nodeWin, exe);
  rodar("npx", ["-y", "postject@1.0.0-alpha.6", exe, "NODE_SEA_BLOB", blob, "--sentinel-fuse", "NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2"]);
  // a assinatura da Node.js Foundation deixa de valer depois da injeção: tira a referência a ela
  const f = fs.readFileSync(exe);
  const pe = f.readUInt32LE(0x3c);
  const dd = pe + 24 + 112 + 4 * 8;
  f.writeUInt32LE(0, dd);
  f.writeUInt32LE(0, dd + 4);
  fs.writeFileSync(exe, f);
  const zip = path.join(DIST, "quadro-artcraft-windows.zip");
  fs.rmSync(zip, { force: true });
  rodar("zip", ["-q", "-9", "-j", zip, exe]);
  for (const x of [cfg, blob]) fs.rmSync(x, { force: true });
}

console.log(`montado ${VERSAO}`);
