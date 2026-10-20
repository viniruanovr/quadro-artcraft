"use strict";
globalThis.__QUADRO_WEB = {"index.html":"<!doctype html>\n<html lang=\"pt-BR\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n<title>Quadro de Cenas</title>\n<link rel=\"icon\" href=\"icone.svg\">\n<link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n<header id=\"topo\">\n  <div class=\"marca\"><img src=\"icone.svg\" alt=\"\"> Quadro</div>\n  <select id=\"projeto\" title=\"Projeto\"></select>\n  <nav id=\"cenas\"></nav>\n  <div class=\"espaco\"></div>\n  <button id=\"linha-alternar\" class=\"btn\" title=\"Mostra a timeline da sequência aberta no FilmCraft embaixo do quadro\">🎞 Timeline</button>\n  <button id=\"enviar-film\" class=\"btn\" title=\"Importa os resultados prontos desta cena no FilmCraft, num bin com o nome da cena\">Cena → FilmCraft</button>\n  <button id=\"enviar-effect\" class=\"btn\" title=\"Importa os resultados prontos desta cena no EffectCraft, numa pasta com o nome da cena\">Cena → EffectCraft</button>\n  <button id=\"motor\" class=\"btn\" title=\"Motor de geração e chaves\">⚙ <span></span></button>\n  <button id=\"guia-alternar\" class=\"btn\" title=\"Guia: atalhos e funções (tecla ?)\">?</button>\n</header>\n\n<aside id=\"biblioteca\">\n  <div class=\"bib-cab\">Biblioteca <button id=\"bib-fechar\" class=\"mini\" title=\"Recolher\">‹</button></div>\n  <div id=\"lista-midia\"></div>\n  <p class=\"dica\">Arraste para o quadro para reusar em outra cena.</p>\n</aside>\n<button id=\"bib-abrir\" class=\"mini\" title=\"Biblioteca\" hidden>›</button>\n\n<main id=\"palco\">\n  <div id=\"mundo\">\n    <svg id=\"fios\" width=\"1\" height=\"1\"><path id=\"fio-temp\" d=\"\"/></svg>\n    <div id=\"camada-nos\"></div>\n    <div id=\"camada-rotulos\"></div>\n  </div>\n  <div id=\"vazio\" hidden>\n    <h2>Monte a cena</h2>\n    <p>Arraste fotos (personagem, cenário) para cá, puxe um fio da bolinha da direita e solte no vazio para criar um nó <b>Gerar</b>. Escreva no fio o que gerar.</p>\n    <p class=\"dica\">Clique duas vezes no fundo para adicionar · roda do mouse = zoom · arraste o fundo para mover</p>\n  </div>\n</main>\n\n<div id=\"ferramentas\">\n  <button data-novo=\"imagem\" title=\"Enviar imagem ou vídeo do computador\">🖼 Mídia</button>\n  <button data-novo=\"nota\" title=\"Nota de texto (roteiro, direção)\">✎ Nota</button>\n  <button data-novo=\"gerar-imagem\" title=\"Nó que gera uma foto\">✦ Gerar foto</button>\n  <button data-novo=\"gerar-video\" title=\"Nó que gera um vídeo\">▶ Gerar vídeo</button>\n  <span class=\"sep\"></span>\n  <button id=\"centralizar\" title=\"Enquadrar a cena\">⤢</button>\n  <span id=\"zoom\">100%</span>\n</div>\n\n<section id=\"linha\" hidden>\n  <div class=\"linha-cab\">\n    <b>FilmCraft</b>\n    <button id=\"fc-projeto\" class=\"btn\" title=\"Escolher o projeto do FilmCraft\">📂 <span>Projeto</span> ▾</button>\n    <select id=\"fc-sequencia\" title=\"Sequência aberta na timeline\" hidden></select>\n    <span id=\"linha-nome\" class=\"suave\"></span><span id=\"linha-tc\"></span>\n    <span class=\"espaco\"></span>\n    <span class=\"dica\" id=\"linha-dica\">clique = mover o playhead · arraste um clipe para o quadro · arraste um nó para cá</span>\n    <button id=\"linha-importar\" class=\"btn\" title=\"Traz os clipes de vídeo da sequência para uma cena com o nome dela, um nó por clipe\">Sequência → cena</button>\n    <button id=\"linha-ver-monitor\" class=\"mini\" title=\"Mostrar/ocultar o monitor do programa\">▣</button>\n    <button id=\"linha-fechar\" class=\"mini\" title=\"Fechar a timeline\">×</button>\n  </div>\n  <div class=\"linha-corpo\">\n    <div id=\"linha-faixas\"><div id=\"linha-regua\"></div><div id=\"linha-trilhas\"></div><div id=\"linha-cabeca\"></div><div id=\"linha-alvo\" hidden></div></div>\n    <div id=\"linha-monitor\"><img alt=\"\"><span></span></div>\n  </div>\n  <div id=\"linha-off\" hidden><p></p><div class=\"acoes-off\"><button id=\"linha-abrir\" class=\"btn primario\">📂 Escolher projeto e abrir</button><button id=\"linha-controle\" class=\"btn\" hidden>Ligar sincronização permanente</button></div></div>\n  <div id=\"fc-projetos\" hidden></div>\n</section>\n\n<aside id=\"guia\" hidden>\n  <div class=\"guia-cab\"><b>Guia</b><button id=\"guia-fechar\" class=\"mini\" title=\"Fechar (tecla ?)\">×</button></div>\n  <div class=\"guia-corpo\">\n    <h4>Começar</h4>\n    <ol>\n      <li>Arraste fotos para o quadro (ou <kbd>Ctrl</kbd>+<kbd>V</kbd>).</li>\n      <li>Puxe um fio da bolinha da direita e solte no vazio: nasce um nó <b>Gerar</b>.</li>\n      <li>Escreva no fio o que gerar e clique em <b>✦ Gerar</b>.</li>\n      <li><b>TL</b> manda o resultado para o playhead do FilmCraft.</li>\n    </ol>\n    <h4>Quadro</h4>\n    <dl>\n      <dt><kbd>Ctrl</kbd>+<kbd>Z</kbd></dt><dd>desfazer</dd>\n      <dt><kbd>Ctrl</kbd>+<kbd>Y</kbd></dt><dd>refazer (ou <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>)</dd>\n      <dt><kbd>Ctrl</kbd>+<kbd>C</kbd> / <kbd>V</kbd></dt><dd>copiar e colar nós (vale entre cenas); colar imagem ou texto cria nó</dd>\n      <dt><kbd>Ctrl</kbd>+<kbd>D</kbd></dt><dd>duplicar o selecionado</dd>\n      <dt><kbd>Ctrl</kbd>+<kbd>A</kbd></dt><dd>selecionar tudo da cena</dd>\n      <dt><kbd>Shift</kbd>+arrastar</dt><dd>selecionar com caixa (no fundo) · somar à seleção (no nó)</dd>\n      <dt><kbd>Del</kbd></dt><dd>apagar o selecionado</dd>\n      <dt><kbd>I</kbd> ou <kbd>Ctrl</kbd>+<kbd>I</kbd></dt><dd>importar foto ou vídeo do PC</dd>\n      <dt><kbd>N</kbd></dt><dd>nova nota (o <kbd>Ctrl</kbd>+<kbd>N</kbd> o navegador não libera)</dd>\n      <dt><kbd>G</kbd> / <kbd>V</kbd></dt><dd>novo Gerar foto / Gerar vídeo</dd>\n      <dt><kbd>Ctrl</kbd>+<kbd>Enter</kbd></dt><dd>gerar os nós selecionados</dd>\n      <dt><kbd>F</kbd></dt><dd>enquadrar a cena</dd>\n      <dt>roda do mouse</dt><dd>zoom · arrastar o fundo move</dd>\n      <dt>duplo clique</dt><dd>no fundo: menu rápido · na foto: tela cheia</dd>\n    </dl>\n    <h4>Timeline do FilmCraft</h4>\n    <dl>\n      <dt><kbd>T</kbd></dt><dd>mostrar/ocultar a timeline</dd>\n      <dt>📂 Projeto</dt><dd>escolher e abrir o projeto e a sequência</dd>\n      <dt>clique</dt><dd>mover o playhead do FilmCraft</dd>\n      <dt><kbd>←</kbd> <kbd>→</kbd></dt><dd>1 quadro · com <kbd>Shift</kbd>, 1 segundo</dd>\n      <dt><kbd>Home</kbd> / <kbd>End</kbd></dt><dd>início / fim da sequência</dd>\n      <dt><kbd>P</kbd></dt><dd>colocar o nó selecionado no playhead</dd>\n      <dt>arrastar clipe ↑</dt><dd>traz o clipe para o quadro</dd>\n      <dt>arrastar nó ↓</dt><dd>coloca na timeline no ponto solto, sem cobrir a edição</dd>\n      <dt>Sequência → cena</dt><dd>traz a sequência inteira, um nó por clipe</dd>\n    </dl>\n    <p class=\"dica\">Tudo salva sozinho em Documentos\\ArtCraft Quadro.</p>\n  </div>\n</aside>\n\n<div id=\"atualizacao\" hidden><span></span><button class=\"btn primario\">Reiniciar e atualizar</button><button class=\"mini\" title=\"Depois\">×</button></div>\n\n<div id=\"menu-rapido\" hidden></div>\n<div id=\"avisos\"></div>\n<input type=\"file\" id=\"arquivo\" multiple accept=\"image/*,video/*\" hidden>\n\n<div id=\"visor\" hidden><div class=\"visor-conteudo\"></div></div>\n\n<dialog id=\"dlg-config\">\n  <form method=\"dialog\">\n    <h3>Motor de geração</h3>\n    <label>Gerar com\n      <select name=\"motor\">\n        <option value=\"artcraft\">ArtCraft (seus créditos da ArtCraft)</option>\n        <option value=\"fal\">fal.ai</option>\n        <option value=\"manual\">Manual (copio o prompt e gero por fora)</option>\n      </select>\n    </label>\n    <label>Chave da API ArtCraft <input name=\"artcraftKey\" type=\"password\" autocomplete=\"off\" placeholder=\"artcraft_api_…\"></label>\n    <p class=\"dica\">Em app.getartcraft.com › Account › Settings › API Keys. Se a seção não aparecer, a ArtCraft precisa liberar a API na sua conta (Discord da ArtCraft).</p>\n    <label>Chave da fal.ai (opcional) <input name=\"falKey\" type=\"password\" autocomplete=\"off\" placeholder=\"…\"></label>\n    <p class=\"dica\">fal.ai/dashboard/keys. Cobra direto no cartão, por geração.</p>\n    <label>Atualizações automáticas: seu usuário do GitHub <input name=\"github\" autocomplete=\"off\" placeholder=\"ex.: viniciusruano\"></label>\n    <p class=\"dica\">O quadro baixa as versões novas do repositório público github.com/<b>usuário</b>/quadro-artcraft. <span id=\"cfg-versao\"></span></p>\n    <p class=\"dica\">Deixe a chave em branco para manter a atual. Os arquivos do quadro ficam em <code id=\"cfg-pasta\"></code>.</p>\n    <div class=\"acoes\"><button value=\"cancelar\" class=\"btn\">Cancelar</button><button value=\"salvar\" class=\"btn primario\">Salvar</button></div>\n  </form>\n</dialog>\n\n<script src=\"app.js\"></script>\n</body>\n</html>\n","app.js":"// Quadro de Cenas: interface no navegador. Sem bibliotecas: tudo em DOM + SVG.\n\"use strict\";\n\nconst $ = (s, el = document) => el.querySelector(s);\nconst esc = (s) => String(s == null ? \"\" : s).replace(/[&<>\"']/g, (c) => ({ \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" }[c]));\nconst PORTA_Y = 20;\nconst LARGURA = { midia: 240, nota: 240, gerar: 300 };\n\nconst est = {\n  proj: new URLSearchParams(location.search).get(\"p\") || \"\",\n  doc: null,\n  cfg: null,\n  cena: null,\n  vista: { x: 60, y: 40, z: 1 },\n  sel: new Set(),\n  minis: new Set(),\n  editandoRotulo: null,\n};\n\n// ---------------------------------------------------------------------------------------------\n// Servidor\n// ---------------------------------------------------------------------------------------------\n\nconst qp = (extra = \"\") => `p=${encodeURIComponent(est.proj)}${extra}`;\n\nasync function pegar(rota) {\n  const r = await fetch(`${rota}${rota.includes(\"?\") ? \"&\" : \"?\"}${qp()}`);\n  const j = await r.json();\n  if (!r.ok) throw new Error(j.erro || r.statusText);\n  return j;\n}\n\nasync function postar(rota, corpo) {\n  const r = await fetch(`${rota}${rota.includes(\"?\") ? \"&\" : \"?\"}${qp()}`, {\n    method: \"POST\", headers: { \"Content-Type\": \"application/json\", \"X-Quadro\": \"1\" }, body: JSON.stringify(corpo || {}),\n  });\n  const j = await r.json().catch(() => ({}));\n  if (!r.ok) throw new Error(j.erro || r.statusText);\n  return j;\n}\n\nasync function ops(lista, silencioso) {\n  try {\n    const r = await postar(\"/api/ops\", { ops: lista });\n    await carregarDoc();\n    return r;\n  } catch (e) {\n    if (!silencioso) aviso(e.message, true);\n    await carregarDoc();\n    throw e;\n  }\n}\n\nasync function subir(arquivo, extra = \"\") {\n  const r = await fetch(`/api/upload?${qp(`&nome=${encodeURIComponent(arquivo.name || \"colado.png\")}${extra}`)}`, {\n    method: \"POST\", headers: { \"X-Quadro\": \"1\", \"Content-Type\": \"application/octet-stream\" }, body: arquivo,\n  });\n  const j = await r.json().catch(() => ({}));\n  if (!r.ok) throw new Error(j.erro || r.statusText);\n  return j;\n}\n\nfunction aviso(texto, erro = false, ms = 4500) {\n  const d = document.createElement(\"div\");\n  d.className = `aviso${erro ? \" erro\" : \"\"}`;\n  d.textContent = texto;\n  $(\"#avisos\").appendChild(d);\n  setTimeout(() => d.remove(), erro ? ms * 2 : ms);\n}\n\n// ---------------------------------------------------------------------------------------------\n// Carregar e desenhar\n// ---------------------------------------------------------------------------------------------\n\nlet carregando = null;\nasync function carregarDoc() {\n  if (carregando) return carregando;\n  carregando = (async () => {\n    try {\n      const d = await pegar(\"/api/quadro\");\n      // só pergunta quando chega uma versão nova (não quando ele navega entre versões)\n      const antes = est.doc && est.doc.nome === d.nome ? new Map(est.doc.nos.filter((n) => n.tipo === \"gerar\").map((n) => [n.id, n.versoes.length])) : null;\n      est.doc = d;\n      if (antes) for (const n of d.nos) if (n.tipo === \"gerar\" && n.atual && antes.has(n.id) && n.versoes.length > antes.get(n.id) && n.estado === \"pronto\") oferecerTroca(n);\n      est.proj = d.nome;\n      est.minis = new Set(d.miniaturas || []);\n      if (!est.cena || !d.cenas.some((c) => c.id === est.cena)) {\n        const salva = lerLocal(`cena:${d.nome}`);\n        est.cena = d.cenas.some((c) => c.id === salva) ? salva : d.cenas[0].id;\n        restaurarVista();\n      }\n      desenhar();\n      fazerMiniaturas();\n    } finally { carregando = null; }\n  })();\n  return carregando;\n}\n\nfunction lerLocal(k) { try { return localStorage.getItem(k); } catch { return null; } }\nfunction gravarLocal(k, v) { try { localStorage.setItem(k, v); } catch {} }\n\nconst nosDaCena = () => est.doc.nos.filter((n) => n.cena === est.cena);\nconst acharNo = (id) => est.doc.nos.find((n) => n.id === id);\nconst midiaDe = (no) => { const id = no.tipo === \"gerar\" ? no.atual : no.midia; return id ? est.doc.midias[id] : null; };\nconst urlMidia = (m) => `/midia/${m.id}?${qp()}`;\nconst urlMini = (m) => (est.minis.has(m.id) ? `/mini/${m.id}.jpg?${qp()}` : m.tipo === \"imagem\" ? urlMidia(m) : \"\");\nconst tipoFio = (no) => { if (no.tipo === \"nota\") return \"nota\"; const m = midiaDe(no); return (m && m.tipo === \"video\") || (no.tipo === \"gerar\" && no.saida === \"video\") ? \"video\" : \"\"; };\n\nfunction desenhar() {\n  desenharTopo();\n  desenharBiblioteca();\n  desenharNos();\n  desenharFios();\n  aplicarVista();\n  $(\"#vazio\").hidden = nosDaCena().length > 0;\n}\n\nfunction desenharTopo() {\n  const d = est.doc;\n  $(\"#cenas\").innerHTML = d.cenas.map((c) => `<button data-cena=\"${c.id}\" class=\"${c.id === est.cena ? \"ativa\" : \"\"}\" title=\"Clique duas vezes para renomear\">${esc(c.nome)}</button>`).join(\"\")\n    + `<button class=\"nova\" data-cena=\"+\" title=\"Nova cena\">＋ cena</button>`;\n  const sel = $(\"#projeto\");\n  const lista = est.projetos || [d.nome];\n  sel.innerHTML = [...new Set([...lista, d.nome])].map((p) => `<option ${p === d.nome ? \"selected\" : \"\"}>${esc(p)}</option>`).join(\"\") + `<option value=\"+\">＋ Novo projeto…</option>`;\n  if (est.cfg) {\n    const c = est.cfg;\n    const nomes = { artcraft: \"ArtCraft\", fal: \"fal.ai\", manual: \"Manual\" };\n    const tem = c.motor === \"manual\" || c[c.motor];\n    const s = $(\"#motor span\");\n    s.textContent = `${nomes[c.motor]}${c.motor === \"manual\" ? \"\" : tem ? \" ✓\" : \" · sem chave\"}`;\n    s.className = tem ? \"ok\" : \"falta\";\n  }\n}\n\nfunction desenharBiblioteca() {\n  const ms = Object.values(est.doc.midias).reverse();\n  $(\"#lista-midia\").innerHTML = ms.map((m) => {\n    const src = urlMini(m);\n    const conteudo = src ? `<img src=\"${src}\" loading=\"lazy\" alt=\"\">` : `<video src=\"${urlMidia(m)}#t=0.1\" muted preload=\"metadata\"></video>`;\n    return `<div class=\"item\" draggable=\"true\" data-midia=\"${m.id}\" title=\"${esc(m.arquivo)}\">${conteudo}${m.tipo === \"video\" ? '<span class=\"v\">▶</span>' : \"\"}</div>`;\n  }).join(\"\") || `<p class=\"dica\" style=\"grid-column: span 2\">Nada ainda. Arraste fotos e vídeos para o quadro.</p>`;\n}\n\nfunction htmlPrevia(m, no) {\n  const soltar = `<div class=\"soltar\">Soltar como nova versão</div>`;\n  if (!m) {\n    const msg = no.tipo === \"gerar\"\n      ? (no.estado === \"gerando\" ? \"Gerando…\" : \"Ligue referências, escreva no fio e clique em Gerar.<br>Ou arraste aqui um resultado feito por fora.\")\n      : \"Sem arquivo\";\n    return `<div class=\"previa\"><div class=\"vazia\">${msg}</div>${soltar}</div>`;\n  }\n  if (m.tipo === \"video\") {\n    const poster = est.minis.has(m.id) ? ` poster=\"/mini/${m.id}.jpg?${qp()}\"` : \"\";\n    return `<div class=\"previa\" data-ver=\"${m.id}\"><video src=\"${urlMidia(m)}\" muted loop playsinline preload=\"metadata\"${poster}></video>${soltar}</div>`;\n  }\n  return `<div class=\"previa\" data-ver=\"${m.id}\"><img src=\"${urlMini(m) || urlMidia(m)}\" alt=\"\" draggable=\"false\">${soltar}</div>`;\n}\n\nfunction opcoesModelo(no) {\n  const c = est.cfg;\n  const motor = c && c.motor !== \"manual\" ? c.motor : \"artcraft\";\n  const lista = (c && c.modelos[motor] && c.modelos[motor][no.saida === \"video\" ? \"video\" : \"imagem\"]) || [];\n  const todos = no.modelo && !lista.includes(no.modelo) ? [no.modelo, ...lista] : lista;\n  return `<option value=\"\">padrão (${esc(lista[0] || \"—\")})</option>` + todos.map((m) => `<option value=\"${esc(m)}\" ${m === no.modelo ? \"selected\" : \"\"}>${esc(m.replace(/^fal-ai\\//, \"\"))}</option>`).join(\"\");\n}\n\nfunction htmlNo(no) {\n  const m = midiaDe(no);\n  const tipoMidia = m ? m.tipo : \"\";\n  const enviado = (no.envios || []).filter((e) => m && e.midia === m.id).map((e) => (e.app === \"filmcraft\" ? \"FilmCraft\" : \"EffectCraft\")).join(\" + \");\n  if (no.tipo === \"nota\") {\n    return `<div class=\"porta saida\" title=\"Puxe até um nó Gerar\"></div>\n      <div class=\"cab\"><span class=\"tag nota\">NOTA</span><input class=\"titulo\" data-campo=\"titulo\" value=\"${esc(no.titulo)}\" placeholder=\"Título\"><button class=\"x\" data-acao=\"remover\" title=\"Apagar\">×</button></div>\n      <textarea data-campo=\"texto\" placeholder=\"Roteiro, direção, falas…\">${esc(no.texto)}</textarea>`;\n  }\n  if (no.tipo === \"midia\") {\n    return `<div class=\"porta saida\" title=\"Puxe até um nó Gerar (ou solte no vazio para criar um)\"></div>\n      <div class=\"cab\"><span class=\"tag ${tipoMidia === \"video\" ? \"video\" : \"\"}\">${tipoMidia === \"video\" ? \"VÍDEO\" : \"IMAGEM\"}</span><input class=\"titulo\" data-campo=\"titulo\" value=\"${esc(no.titulo)}\" placeholder=\"ex.: Ana (personagem)\"><button class=\"x\" data-acao=\"remover\" title=\"Apagar\">×</button></div>\n      ${htmlPrevia(m, no)}\n      <div class=\"rodape\"><span class=\"nome\" title=\"${esc(m ? m.arquivo : \"\")}\">${esc(m ? m.arquivo : \"\")}</span>\n        <button data-acao=\"timeline\" title=\"Colocar na timeline do FilmCraft, no playhead\">TL</button><button data-acao=\"enviar-filmcraft\" title=\"Importar no FilmCraft\">FC</button><button data-acao=\"enviar-effectcraft\" title=\"Importar no EffectCraft\">EC</button></div>`;\n  }\n  const video = no.saida === \"video\";\n  const n = no.versoes.length;\n  const iv = no.versoes.indexOf(no.atual);\n  const prop = ((est.cfg && est.cfg.proporcoes) || [\"16:9\"]).map((p) => `<option ${p === no.proporcao ? \"selected\" : \"\"}>${p}</option>`).join(\"\");\n  let estado = \"\";\n  if (no.estado === \"gerando\") estado = `<div class=\"barra ${no.progresso ? \"\" : \"indef\"}\"><i style=\"width:${no.progresso || 0}%\"></i></div><div class=\"estado\">Gerando${no.progresso ? ` · ${no.progresso}%` : \"…\"}</div>`;\n  else if (no.estado === \"erro\") estado = `<div class=\"estado erro\">${esc(no.erro)}</div>`;\n  else if (no.estado === \"aguardando\") estado = `<div class=\"barra indef\"><i></i></div><div class=\"estado\">Esperando o ${no.saida === \"video\" ? \"vídeo\" : \"arquivo\"} baixado do ArtCraft… <button data-acao=\"cancelar-espera\">Cancelar</button></div>`;\n  return `<div class=\"porta entrada\" title=\"Entradas: referências e notas\"></div><div class=\"porta saida\" title=\"Puxe para usar este resultado em outro nó (ex.: animar a foto)\"></div>\n    <div class=\"cab\"><span class=\"tag gerar\">${video ? \"GERAR VÍDEO\" : \"GERAR FOTO\"}</span><input class=\"titulo\" data-campo=\"titulo\" value=\"${esc(no.titulo)}\" placeholder=\"Nome do plano\"><button class=\"x\" data-acao=\"remover\" title=\"Apagar\">×</button></div>\n    ${htmlPrevia(m, no)}\n    <div class=\"controles\">\n      <div class=\"linha\">\n        <div class=\"seg\"><button data-acao=\"saida-imagem\" class=\"${video ? \"\" : \"on\"}\">Foto</button><button data-acao=\"saida-video\" class=\"${video ? \"on\" : \"\"}\">Vídeo</button></div>\n        <select class=\"modelo\" data-campo=\"modelo\" title=\"Modelo\">${opcoesModelo(no)}</select>\n      </div>\n      <div class=\"linha\">\n        <select data-campo=\"proporcao\" title=\"Proporção\">${prop}</select>\n        ${video ? `<input class=\"duracao\" data-campo=\"duracao\" type=\"number\" min=\"1\" max=\"20\" value=\"${no.duracao || 5}\" title=\"Duração (s)\"><span class=\"estado\">s</span>` : \"\"}\n        <span style=\"flex:1\"></span>\n        ${n ? `<span class=\"versoes\"><button data-acao=\"versao-ant\" ${iv <= 0 ? \"disabled\" : \"\"}>‹</button> v${iv + 1}/${n} <button data-acao=\"versao-prox\" ${iv >= n - 1 ? \"disabled\" : \"\"}>›</button></span>` : \"\"}\n      </div>\n      <textarea data-campo=\"prompt\" placeholder=\"Instrução extra (opcional). O principal vai escrito nos fios.\">${esc(no.prompt)}</textarea>\n      ${estado}\n      <div class=\"linha\">\n        <button class=\"gerar-btn\" data-acao=\"gerar\" ${no.estado === \"gerando\" ? \"disabled\" : \"\"}>${n ? \"↻ Gerar de novo\" : \"✦ Gerar\"}</button>\n        <button data-acao=\"copiar\" title=\"Copiar o prompt montado (para gerar por fora)\">Prompt</button>\n        ${origemTimeline(no).length ? `<button data-acao=\"substituir\" title=\"Trocar o clipe de origem na timeline por este resultado\" ${m ? \"\" : \"disabled\"}>⇄</button>` : \"\"}\n        <button data-acao=\"timeline\" title=\"Colocar na timeline do FilmCraft, no playhead\" ${m ? \"\" : \"disabled\"}>TL</button>\n        <button data-acao=\"enviar-filmcraft\" title=\"Importar no FilmCraft\" ${m ? \"\" : \"disabled\"}>FC</button>\n        <button data-acao=\"enviar-effectcraft\" title=\"Importar no EffectCraft\" ${m ? \"\" : \"disabled\"}>EC</button>\n      </div>\n      ${enviado ? `<div class=\"enviado\">✓ enviado para ${enviado}</div>` : \"\"}\n    </div>`;\n}\n\nfunction desenharNos() {\n  const camada = $(\"#camada-nos\");\n  const vivos = new Set();\n  const foco = document.activeElement;\n  for (const no of nosDaCena()) {\n    vivos.add(no.id);\n    let el = camada.querySelector(`.no[data-id=\"${no.id}\"]`);\n    const m = midiaDe(no);\n    const assinatura = JSON.stringify([no, m && m.arquivo, m && est.minis.has(m.id), est.cfg && est.cfg.motor]);\n    if (!el) {\n      el = document.createElement(\"div\");\n      el.dataset.id = no.id;\n      camada.appendChild(el);\n    }\n    el.className = `no ${no.tipo}${m && m.tipo === \"video\" ? \" video\" : \"\"}${no.tipo === \"gerar\" ? ` saida-${no.saida}` : \"\"}${no.estado === \"gerando\" ? \" gerando\" : \"\"}${est.sel.has(no.id) ? \" sel\" : \"\"}`;\n    el.style.left = `${no.x || 0}px`;\n    el.style.top = `${no.y || 0}px`;\n    if (el.dataset.sig !== assinatura && !(foco && el.contains(foco) && foco.matches(\"input, textarea\"))) {\n      el.dataset.sig = assinatura;\n      el.innerHTML = htmlNo(no);\n    }\n  }\n  for (const el of [...camada.children]) if (!vivos.has(el.dataset.id)) el.remove();\n}\n\nfunction pontaSaida(no) { return { x: (no.x || 0) + LARGURA[no.tipo] + 1, y: (no.y || 0) + PORTA_Y }; }\nfunction pontaEntrada(no) { return { x: (no.x || 0) - 1, y: (no.y || 0) + PORTA_Y }; }\nfunction curva(a, b) {\n  const dx = Math.max(60, Math.abs(b.x - a.x) * 0.5);\n  return `M${a.x},${a.y} C${a.x + dx},${a.y} ${b.x - dx},${b.y} ${b.x},${b.y}`;\n}\nfunction meio(a, b) {\n  const dx = Math.max(60, Math.abs(b.x - a.x) * 0.5);\n  const t = 0.5, u = 1 - t;\n  const p1 = { x: a.x + dx, y: a.y }, p2 = { x: b.x - dx, y: b.y };\n  return { x: u * u * u * a.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * b.x, y: u * u * u * a.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * b.y };\n}\n\nfunction desenharFios() {\n  const svg = $(\"#fios\");\n  const temp = $(\"#fio-temp\");\n  svg.querySelectorAll(\"path:not(#fio-temp)\").forEach((p) => p.remove());\n  const rotulos = $(\"#camada-rotulos\");\n  const vivos = new Set();\n  const ids = new Set(nosDaCena().map((n) => n.id));\n  for (const l of est.doc.ligacoes) {\n    if (!ids.has(l.de) || !ids.has(l.para)) continue;\n    const de = acharNo(l.de), para = acharNo(l.para);\n    const a = pontaSaida(de), b = pontaEntrada(para);\n    const tipo = tipoFio(de);\n    const d = curva(a, b);\n    const p = document.createElementNS(\"http://www.w3.org/2000/svg\", \"path\");\n    p.setAttribute(\"d\", d);\n    p.setAttribute(\"class\", `fio ${tipo}${est.sel.has(l.id) ? \" sel\" : \"\"}`);\n    const alvo = document.createElementNS(\"http://www.w3.org/2000/svg\", \"path\");\n    alvo.setAttribute(\"d\", d);\n    alvo.setAttribute(\"class\", \"alvo\");\n    alvo.dataset.fio = l.id;\n    svg.insertBefore(p, temp);\n    svg.insertBefore(alvo, temp);\n    vivos.add(l.id);\n    let r = rotulos.querySelector(`[data-fio=\"${l.id}\"]`);\n    if (!r) { r = document.createElement(\"div\"); r.dataset.fio = l.id; rotulos.appendChild(r); }\n    const pm = meio(a, b);\n    r.style.left = `${pm.x}px`;\n    r.style.top = `${pm.y}px`;\n    if (est.editandoRotulo === l.id) continue;\n    r.className = `rotulo ${tipo}${l.texto ? \"\" : \" vazio\"}${est.sel.has(l.id) ? \" sel\" : \"\"}`;\n    r.textContent = l.texto || \"＋ o que gerar?\";\n    r.title = \"Clique para escrever o que gerar com esta ligação\";\n  }\n  for (const r of [...rotulos.children]) if (!vivos.has(r.dataset.fio)) r.remove();\n}\n\n// ---------------------------------------------------------------------------------------------\n// Vista (pan e zoom)\n// ---------------------------------------------------------------------------------------------\n\nfunction aplicarVista() {\n  const v = est.vista;\n  $(\"#mundo\").style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.z})`;\n  const palco = $(\"#palco\");\n  const g = 22 * v.z;\n  palco.style.backgroundSize = `${g}px ${g}px`;\n  palco.style.backgroundPosition = `${v.x}px ${v.y}px`;\n  $(\"#zoom\").textContent = `${Math.round(v.z * 100)}%`;\n}\n\nlet timerVista;\nfunction guardarVista() {\n  clearTimeout(timerVista);\n  timerVista = setTimeout(() => gravarLocal(`vista:${est.proj}:${est.cena}`, JSON.stringify(est.vista)), 300);\n}\n\nfunction restaurarVista() {\n  try {\n    const v = JSON.parse(lerLocal(`vista:${est.proj}:${est.cena}`) || \"null\");\n    if (v && isFinite(v.z)) { est.vista = v; return; }\n  } catch {}\n  est.vista = { x: 60, y: 40, z: 1 };\n  requestAnimationFrame(enquadrar);\n}\n\nfunction enquadrar() {\n  const nos = nosDaCena();\n  const palco = $(\"#palco\").getBoundingClientRect();\n  if (!nos.length) { est.vista = { x: 60, y: 40, z: 1 }; aplicarVista(); return; }\n  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;\n  for (const n of nos) {\n    const el = $(`.no[data-id=\"${n.id}\"]`);\n    const h = el ? el.offsetHeight : 260;\n    x0 = Math.min(x0, n.x); y0 = Math.min(y0, n.y); x1 = Math.max(x1, n.x + LARGURA[n.tipo]); y1 = Math.max(y1, n.y + h);\n  }\n  const z = Math.min(1.2, Math.max(0.25, Math.min((palco.width - 120) / (x1 - x0), (palco.height - 140) / (y1 - y0))));\n  est.vista = { z, x: (palco.width - (x1 - x0) * z) / 2 - x0 * z, y: (palco.height - 60 - (y1 - y0) * z) / 2 - y0 * z };\n  aplicarVista();\n  guardarVista();\n}\n\nfunction paraMundo(cx, cy) {\n  const r = $(\"#palco\").getBoundingClientRect();\n  return { x: (cx - r.left - est.vista.x) / est.vista.z, y: (cy - r.top - est.vista.y) / est.vista.z };\n}\n\nfunction centroVista() {\n  const r = $(\"#palco\").getBoundingClientRect();\n  return paraMundo(r.left + r.width / 2, r.top + r.height / 2);\n}\n\n$(\"#palco\").addEventListener(\"wheel\", (e) => {\n  e.preventDefault();\n  const r = $(\"#palco\").getBoundingClientRect();\n  const v = est.vista;\n  if (!e.ctrlKey && Math.abs(e.deltaX) > Math.abs(e.deltaY) * 0.8 && e.deltaMode === 0) {\n    v.x -= e.deltaX; v.y -= e.deltaY; // trackpad: rolar de lado move\n  } else {\n    const z = Math.min(2.5, Math.max(0.2, v.z * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015))));\n    const px = e.clientX - r.left, py = e.clientY - r.top;\n    v.x = px - ((px - v.x) * z) / v.z;\n    v.y = py - ((py - v.y) * z) / v.z;\n    v.z = z;\n  }\n  aplicarVista();\n  guardarVista();\n}, { passive: false });\n\n// ---------------------------------------------------------------------------------------------\n// Ponteiro: mover fundo, arrastar nós, puxar fios\n// ---------------------------------------------------------------------------------------------\n\nlet gesto = null;\n\n$(\"#palco\").addEventListener(\"pointerdown\", (e) => {\n  fecharMenu();\n  if (e.button !== 0 && e.button !== 1) return;\n  const porta = e.target.closest(\".porta.saida\");\n  const no = e.target.closest(\".no\");\n  const fio = e.target.closest(\"[data-fio]\");\n  if (porta && no) {\n    e.preventDefault();\n    gesto = { tipo: \"fio\", de: no.dataset.id };\n    $(\"#palco\").setPointerCapture(e.pointerId);\n    return;\n  }\n  if (fio && !e.target.closest(\"textarea\")) {\n    selecionar(fio.dataset.fio, e.shiftKey);\n    if (fio.classList.contains(\"rotulo\")) editarRotulo(fio.dataset.fio);\n    return;\n  }\n  if (no) {\n    if (e.target.closest(\"input, textarea, select, button, video[controls]\")) return;\n    const id = no.dataset.id;\n    if (!est.sel.has(id) || e.shiftKey) selecionar(id, e.shiftKey);\n    const inicio = paraMundo(e.clientX, e.clientY);\n    gesto = { tipo: \"nos\", inicio, movido: false, nos: [...est.sel].map(acharNo).filter(Boolean).map((n) => ({ n, x: n.x, y: n.y })) };\n    $(\"#palco\").setPointerCapture(e.pointerId);\n    return;\n  }\n  if (e.shiftKey && e.button === 0) {\n    gesto = { tipo: \"caixa\", cx: e.clientX, cy: e.clientY, antes: new Set(est.sel) };\n    const c = document.createElement(\"div\");\n    c.id = \"caixa\";\n    document.body.appendChild(c);\n    $(\"#palco\").setPointerCapture(e.pointerId);\n    return;\n  }\n  gesto = { tipo: \"fundo\", cx: e.clientX, cy: e.clientY, vx: est.vista.x, vy: est.vista.y, movido: false };\n  $(\"#palco\").setPointerCapture(e.pointerId);\n});\n\n$(\"#palco\").addEventListener(\"pointermove\", (e) => {\n  if (!gesto) return;\n  if (gesto.tipo === \"fundo\") {\n    const dx = e.clientX - gesto.cx, dy = e.clientY - gesto.cy;\n    if (Math.abs(dx) + Math.abs(dy) > 3) { gesto.movido = true; $(\"#palco\").classList.add(\"movendo\"); }\n    est.vista.x = gesto.vx + dx; est.vista.y = gesto.vy + dy;\n    aplicarVista();\n  } else if (gesto.tipo === \"caixa\") {\n    const x1 = Math.min(gesto.cx, e.clientX), y1 = Math.min(gesto.cy, e.clientY), x2 = Math.max(gesto.cx, e.clientX), y2 = Math.max(gesto.cy, e.clientY);\n    Object.assign($(\"#caixa\").style, { left: `${x1}px`, top: `${y1}px`, width: `${x2 - x1}px`, height: `${y2 - y1}px` });\n    const sel = new Set(gesto.antes);\n    document.querySelectorAll(\"#camada-nos .no\").forEach((el) => {\n      const r = el.getBoundingClientRect();\n      if (r.left < x2 && r.right > x1 && r.top < y2 && r.bottom > y1) sel.add(el.dataset.id);\n    });\n    est.sel = sel;\n    desenharNos();\n  } else if (gesto.tipo === \"nos\") {\n    const p = paraMundo(e.clientX, e.clientY);\n    const dx = p.x - gesto.inicio.x, dy = p.y - gesto.inicio.y;\n    if (Math.abs(dx) + Math.abs(dy) > 2) gesto.movido = true;\n    for (const it of gesto.nos) {\n      it.n.x = Math.round(it.x + dx); it.n.y = Math.round(it.y + dy);\n      const el = $(`.no[data-id=\"${it.n.id}\"]`);\n      if (el) { el.style.left = `${it.n.x}px`; el.style.top = `${it.n.y}px`; }\n    }\n    desenharFios();\n    if (linha.aberta) mostrarAlvo(sobreLinha(e.clientX, e.clientY) ? e.clientX : null);\n  } else if (gesto.tipo === \"fio\") {\n    const de = acharNo(gesto.de);\n    const p = paraMundo(e.clientX, e.clientY);\n    $(\"#fio-temp\").setAttribute(\"d\", curva(pontaSaida(de), p));\n    document.querySelectorAll(\".no.alvo-fio\").forEach((x) => x.classList.remove(\"alvo-fio\"));\n    const alvo = document.elementFromPoint(e.clientX, e.clientY);\n    const noAlvo = alvo && alvo.closest(\".no.gerar\");\n    if (noAlvo && noAlvo.dataset.id !== gesto.de) noAlvo.classList.add(\"alvo-fio\");\n  }\n});\n\n$(\"#palco\").addEventListener(\"pointerup\", async (e) => {\n  const g = gesto;\n  gesto = null;\n  $(\"#palco\").classList.remove(\"movendo\");\n  if (!g) return;\n  if (g.tipo === \"caixa\") { const c = $(\"#caixa\"); if (c) c.remove(); desenharFios(); return; }\n  if (g.tipo === \"fundo\") {\n    guardarVista();\n    if (!g.movido) { est.sel.clear(); desenharNos(); desenharFios(); }\n  } else if (g.tipo === \"nos\" && g.movido && sobreLinha(e.clientX, e.clientY)) {\n    // soltou o nó em cima da timeline: volta para o lugar e vai para o FilmCraft naquele tempo\n    mostrarAlvo(null);\n    for (const it of g.nos) { it.n.x = it.x; it.n.y = it.y; }\n    desenharNos(); desenharFios();\n    const t = tempoNaLinha(e.clientX);\n    for (const it of g.nos) if (midiaDe(it.n)) await colocarNaLinha({ no: it.n.id }, t);\n  } else if (g.tipo === \"nos\" && g.movido) {\n    ops([{ op: \"mover\", nos: g.nos.map((it) => ({ id: it.n.id, x: it.n.x, y: it.n.y })) }], true).catch(() => {});\n  } else if (g.tipo === \"fio\") {\n    $(\"#fio-temp\").setAttribute(\"d\", \"\");\n    document.querySelectorAll(\".no.alvo-fio\").forEach((x) => x.classList.remove(\"alvo-fio\"));\n    const alvo = document.elementFromPoint(e.clientX, e.clientY);\n    const noEl = alvo && alvo.closest(\".no\");\n    const de = acharNo(g.de);\n    try {\n      if (noEl) {\n        if (noEl.dataset.id === g.de) return;\n        const para = acharNo(noEl.dataset.id);\n        if (para.tipo !== \"gerar\") return aviso(\"O fio precisa terminar num nó Gerar. Solte no vazio para criar um.\", true);\n        const r = await ops([{ op: \"ligar\", de: g.de, para: para.id, ref: \"f\" }]);\n        editarRotulo(r.refs.f);\n      } else if (alvo && alvo.closest(\"#palco\")) {\n        const p = paraMundo(e.clientX, e.clientY);\n        const saida = tipoFio(de) === \"video\" && de.tipo !== \"gerar\" ? \"video\" : de.tipo === \"gerar\" ? \"video\" : \"imagem\";\n        const r = await ops([\n          { op: \"no\", ref: \"g\", cena: est.cena, tipo: \"gerar\", saida, x: Math.round(p.x), y: Math.round(p.y - PORTA_Y) },\n          { op: \"ligar\", de: g.de, para: \"g\", ref: \"f\" },\n        ]);\n        selecionar(r.refs.g);\n        editarRotulo(r.refs.f);\n      }\n    } catch {}\n  }\n});\n\n$(\"#palco\").addEventListener(\"dblclick\", (e) => {\n  if (e.target.closest(\".no, .rotulo\")) return;\n  abrirMenu(e.clientX, e.clientY);\n});\n\nfunction selecionar(id, somar) {\n  if (!somar) est.sel.clear();\n  if (somar && est.sel.has(id)) est.sel.delete(id); else est.sel.add(id);\n  desenharNos();\n  desenharFios();\n}\n\n// ---------------------------------------------------------------------------------------------\n// Texto no fio\n// ---------------------------------------------------------------------------------------------\n\nfunction editarRotulo(id) {\n  const r = $(`#camada-rotulos [data-fio=\"${id}\"]`) || (desenharFios(), $(`#camada-rotulos [data-fio=\"${id}\"]`));\n  if (!r || r.querySelector(\"textarea\")) return;\n  const l = est.doc.ligacoes.find((x) => x.id === id);\n  est.editandoRotulo = id;\n  r.classList.remove(\"vazio\");\n  r.innerHTML = `<textarea placeholder=\"ex.: usar essa pessoa neste cenário, plano médio, luz de fim de tarde\">${esc(l ? l.texto : \"\")}</textarea>`;\n  const ta = r.querySelector(\"textarea\");\n  ta.focus();\n  ta.setSelectionRange(ta.value.length, ta.value.length);\n  let feito = false;\n  const fechar = async (salvar) => {\n    if (feito) return;\n    feito = true;\n    est.editandoRotulo = null;\n    if (salvar && l && ta.value !== l.texto) await ops([{ op: \"texto_ligacao\", id, texto: ta.value }]).catch(() => {});\n    else desenharFios();\n  };\n  ta.addEventListener(\"keydown\", (e) => {\n    e.stopPropagation();\n    if (e.key === \"Enter\" && !e.shiftKey) { e.preventDefault(); fechar(true); }\n    if (e.key === \"Escape\") fechar(false);\n  });\n  ta.addEventListener(\"blur\", () => fechar(true));\n}\n\n// ---------------------------------------------------------------------------------------------\n// Campos e botões dentro dos nós\n// ---------------------------------------------------------------------------------------------\n\nconst timersCampo = new Map();\nfunction campoMudou(el, imediato) {\n  const no = el.closest(\".no\");\n  if (!no) return;\n  const id = no.dataset.id, campo = el.dataset.campo;\n  let valor = el.value;\n  if (campo === \"duracao\") valor = Number(valor) || 5;\n  const k = `${id}:${campo}`;\n  clearTimeout(timersCampo.get(k));\n  const enviar = () => {\n    timersCampo.delete(k);\n    const n = acharNo(id);\n    if (n) n[campo] = valor;\n    postar(\"/api/ops\", { ops: [{ op: \"no\", id, [campo]: valor }] }).catch((e) => aviso(e.message, true));\n  };\n  if (imediato) enviar(); else timersCampo.set(k, setTimeout(enviar, 500));\n}\n\n$(\"#camada-nos\").addEventListener(\"input\", (e) => { if (e.target.dataset.campo && e.target.tagName !== \"SELECT\") campoMudou(e.target, false); });\n$(\"#camada-nos\").addEventListener(\"change\", (e) => { if (e.target.dataset.campo) campoMudou(e.target, true); });\n$(\"#camada-nos\").addEventListener(\"keydown\", (e) => { if (e.target.matches(\"input.titulo\") && e.key === \"Enter\") e.target.blur(); });\n\n$(\"#camada-nos\").addEventListener(\"click\", async (e) => {\n  const ver = e.target.closest(\"[data-ver]\");\n  const btn = e.target.closest(\"[data-acao]\");\n  const el = e.target.closest(\".no\");\n  if (!el) return;\n  const no = acharNo(el.dataset.id);\n  if (ver && !btn) return abrirVisor(est.doc.midias[ver.dataset.ver]);\n  if (!btn || !no) return;\n  const a = btn.dataset.acao;\n  try {\n    if (a === \"remover\") {\n      if (no.tipo === \"gerar\" && no.versoes.length && !confirm(\"Apagar este nó? Os arquivos gerados continuam na biblioteca.\")) return;\n      await ops([{ op: \"remover\", id: no.id }]);\n    } else if (a === \"saida-imagem\" || a === \"saida-video\") {\n      await ops([{ op: \"no\", id: no.id, saida: a === \"saida-video\" ? \"video\" : \"imagem\", modelo: \"\" }]);\n    } else if (a === \"versao-ant\" || a === \"versao-prox\") {\n      const i = no.versoes.indexOf(no.atual) + (a === \"versao-prox\" ? 1 : -1);\n      if (no.versoes[i]) await ops([{ op: \"versao\", no: no.id, midia: no.versoes[i] }]);\n    } else if (a === \"gerar\") {\n      for (const t of timersCampo.values()) clearTimeout(t);\n      document.activeElement && document.activeElement.blur();\n      await new Promise((r) => setTimeout(r, 50));\n      const campos = {};\n      el.querySelectorAll(\"[data-campo]\").forEach((c) => { campos[c.dataset.campo] = c.dataset.campo === \"duracao\" ? Number(c.value) || 5 : c.value; });\n      await postar(\"/api/ops\", { ops: [{ op: \"no\", id: no.id, ...campos }] });\n      if (est.cfg && est.cfg.motor === \"manual\") {\n        if (!(await copiarPrompt(no, true))) return;\n        await postar(\"/api/esperar\", { no: no.id });\n        return carregarDoc();\n      }\n      btn.disabled = true;\n      const r = await postar(\"/api/gerar\", { no: no.id });\n      const x = r.resultados && r.resultados[0];\n      if (x && x.erro) aviso(x.erro, true);\n      await carregarDoc();\n    } else if (a === \"copiar\") {\n      await copiarPrompt(no, false);\n    } else if (a === \"substituir\") {\n      await substituirClipe(no);\n    } else if (a === \"cancelar-espera\") {\n      await postar(\"/api/esperar\", { no: no.id, cancelar: true });\n      await carregarDoc();\n    } else if (a === \"timeline\") {\n      await colocarNaLinha({ no: no.id });\n    } else if (a === \"enviar-filmcraft\" || a === \"enviar-effectcraft\") {\n      const app = a.replace(\"enviar-\", \"\");\n      aviso(`Enviando para o ${app === \"filmcraft\" ? \"FilmCraft\" : \"EffectCraft\"}…`);\n      const r = await postar(\"/api/enviar\", { nos: [no.id], app });\n      aviso(r.texto);\n      await carregarDoc();\n    }\n  } catch (err) { aviso(err.message, true); btn.disabled = false; }\n});\n\nasync function copiarPrompt(no, manual) {\n  const r = await pegar(`/api/prompt?no=${no.id}`);\n  if (!r.prompt.trim()) { aviso(\"Escreva no fio (ou na instrução extra) o que gerar.\", true); return false; }\n  try { await navigator.clipboard.writeText(r.prompt); } catch { prompt(\"Copie o prompt:\", r.prompt); }\n  const refs = r.arquivos.length ? `\\nReferências (na ordem): ${r.arquivos.map((a) => a.split(/[\\\\/]/).pop()).join(\", \")}` : \"\";\n  aviso(`${manual ? \"Prompt copiado e pasta das referências aberta. No ArtCraft: cole o prompt, anexe as referências, gere e baixe o resultado. Eu puxo o arquivo novo de Downloads sozinho.\" : \"Prompt copiado.\"}${refs}`, false, 12000);\n  if (manual && r.imagens.length) postar(\"/api/mostrar\", { midia: r.imagens[0] }).catch(() => {});\n  return true;\n}\n\n// Clipes da timeline de onde um nó veio (seguindo os fios para trás).\nfunction origemTimeline(no) {\n  const vistos = new Set(), achados = [];\n  const fila = [no.id];\n  while (fila.length) {\n    const id = fila.shift();\n    if (vistos.has(id)) continue;\n    vistos.add(id);\n    const n = acharNo(id);\n    if (n && n.fc && n.id !== no.id) achados.push({ ...n.fc, nome: n.titulo });\n    for (const l of est.doc.ligacoes) if (l.para === id) fila.push(l.de);\n  }\n  return achados;\n}\n\n// Resultado novo num nó que veio da timeline: pergunta se troca o clipe original.\nfunction oferecerTroca(no) {\n  const o = origemTimeline(no)[0];\n  if (!o) return;\n  const d = document.createElement(\"div\");\n  d.className = \"aviso pergunta\";\n  d.innerHTML = `<div>Versão ${no.versoes.indexOf(no.atual) + 1} de <b>${esc(no.titulo || \"Gerar\")}</b> pronta. Substituir o clipe <b>${esc(o.nome || \"\")}</b> na timeline do FilmCraft?</div><div class=\"acoes\"><button class=\"btn primario\" data-sim>Substituir</button><button class=\"btn\" data-nao>Agora não</button></div>`;\n  $(\"#avisos\").appendChild(d);\n  d.querySelector(\"[data-nao]\").onclick = () => d.remove();\n  d.querySelector(\"[data-sim]\").onclick = async () => { d.remove(); await substituirClipe(no); };\n}\nasync function substituirClipe(no) {\n  aviso(\"Trocando o clipe na timeline…\");\n  try {\n    const r = await postar(\"/api/filmcraft/substituir\", { no: no.id });\n    aviso(r.texto, false, 9000);\n    await carregarDoc();\n    if (linha.aberta) { linha.assinatura = \"\"; buscarLinha(); }\n  } catch (err) { aviso(err.message, true); }\n}\n\n// ---------------------------------------------------------------------------------------------\n// Arquivos: arrastar, colar, escolher\n// ---------------------------------------------------------------------------------------------\n\nlet posNovo = null;\n\nasync function criarMidias(arquivos, ponto) {\n  const p = ponto || centroVista();\n  const lista = [...arquivos].filter((f) => /^(image|video)\\//.test(f.type) || /\\.(png|jpe?g|webp|gif|bmp|mp4|mov|webm|mkv|m4v)$/i.test(f.name));\n  if (!lista.length) return aviso(\"Só imagens e vídeos.\", true);\n  const acoes = [];\n  for (let i = 0; i < lista.length; i++) {\n    try {\n      aviso(`Enviando ${lista[i].name || \"imagem\"}…`, false, 1500);\n      const r = await subir(lista[i]);\n      const nome = (lista[i].name || \"\").replace(/\\.[^.]+$/, \"\");\n      acoes.push({ op: \"no\", cena: est.cena, tipo: \"midia\", midia: r.midia, titulo: nome === \"image\" ? \"\" : nome, x: Math.round(p.x - 120 + i * 270), y: Math.round(p.y - 120) });\n    } catch (e) { aviso(e.message, true); }\n  }\n  if (acoes.length) await ops(acoes);\n}\n\nconst palco = $(\"#palco\");\npalco.addEventListener(\"dragover\", (e) => {\n  e.preventDefault();\n  document.querySelectorAll(\".no.arrastando-arquivo\").forEach((x) => x.classList.remove(\"arrastando-arquivo\"));\n  const no = e.target.closest && e.target.closest(\".no.gerar\");\n  if (no && e.dataTransfer.types.includes(\"Files\")) no.classList.add(\"arrastando-arquivo\");\n});\npalco.addEventListener(\"dragleave\", (e) => { if (e.target === palco) document.querySelectorAll(\".no.arrastando-arquivo\").forEach((x) => x.classList.remove(\"arrastando-arquivo\")); });\npalco.addEventListener(\"drop\", async (e) => {\n  e.preventDefault();\n  document.querySelectorAll(\".no.arrastando-arquivo\").forEach((x) => x.classList.remove(\"arrastando-arquivo\"));\n  const p = paraMundo(e.clientX, e.clientY);\n  const midia = e.dataTransfer.getData(\"application/x-midia\");\n  const clipeFc = e.dataTransfer.getData(\"application/x-clipe-fc\");\n  if (clipeFc) return trazerClipe(Number(clipeFc), { x: p.x, y: p.y });\n  const noGerar = e.target.closest && e.target.closest(\".no.gerar\");\n  try {\n    if (midia) {\n      if (noGerar) return ops([{ op: \"no\", id: noGerar.dataset.id, midia }]);\n      const m = est.doc.midias[midia];\n      return ops([{ op: \"no\", cena: est.cena, tipo: \"midia\", midia, titulo: m ? m.arquivo.replace(/\\.[^.]+$/, \"\") : \"\", x: Math.round(p.x), y: Math.round(p.y) }]);\n    }\n    if (!e.dataTransfer.files.length) return;\n    if (noGerar) {\n      await subir(e.dataTransfer.files[0], `&no=${noGerar.dataset.id}`);\n      aviso(\"Nova versão adicionada.\");\n      return carregarDoc();\n    }\n    await criarMidias(e.dataTransfer.files, p);\n  } catch (err) { aviso(err.message, true); }\n});\n\n$(\"#lista-midia\").addEventListener(\"dragstart\", (e) => {\n  const it = e.target.closest(\"[data-midia]\");\n  if (it) e.dataTransfer.setData(\"application/x-midia\", it.dataset.midia);\n});\n$(\"#lista-midia\").addEventListener(\"dblclick\", (e) => {\n  const it = e.target.closest(\"[data-midia]\");\n  if (it) abrirVisor(est.doc.midias[it.dataset.midia]);\n});\n\ndocument.addEventListener(\"paste\", (e) => {\n  if (e.target.closest && e.target.closest(\"input, textarea, select, dialog\")) return;\n  const arquivos = [...(e.clipboardData ? e.clipboardData.files : [])];\n  if (arquivos.length) { e.preventDefault(); criarMidias(arquivos); return; }\n  const texto = e.clipboardData ? e.clipboardData.getData(\"text/plain\") : \"\";\n  // os nós copiados aqui mesmo: o texto no sistema é só uma marca\n  if (areaNos && (texto.startsWith(MARCA_NOS) || !texto)) { e.preventDefault(); colarNos(); return; }\n  if (texto.trim()) {\n    e.preventDefault();\n    const p = centroVista();\n    const caminho = texto.trim().replace(/^\"|\"$/g, \"\");\n    if (/^([a-zA-Z]:\\\\|\\/).+\\.(png|jpe?g|webp|gif|bmp|mp4|mov|webm|mkv|m4v)$/i.test(caminho)) {\n      ops([{ op: \"no\", cena: est.cena, tipo: \"midia\", arquivo: caminho, x: Math.round(p.x - 120), y: Math.round(p.y - 60) }]).catch(() => {});\n    } else {\n      ops([{ op: \"no\", cena: est.cena, tipo: \"nota\", texto: texto.slice(0, 5000), x: Math.round(p.x - 120), y: Math.round(p.y - 60) }]).catch(() => {});\n    }\n  }\n});\n\n$(\"#arquivo\").addEventListener(\"change\", async (e) => {\n  await criarMidias(e.target.files, posNovo);\n  posNovo = null;\n  e.target.value = \"\";\n});\n\n// ---------------------------------------------------------------------------------------------\n// Criar nós (barra e menu de duplo clique)\n// ---------------------------------------------------------------------------------------------\n\nasync function novo(tipo, ponto) {\n  const p = ponto || centroVista();\n  const base = { op: \"no\", ref: \"n\", cena: est.cena, x: Math.round(p.x - 120), y: Math.round(p.y - 60) };\n  if (tipo === \"imagem\") { posNovo = ponto || null; return $(\"#arquivo\").click(); }\n  const op = tipo === \"nota\" ? { ...base, tipo: \"nota\" } : { ...base, tipo: \"gerar\", saida: tipo === \"gerar-video\" ? \"video\" : \"imagem\" };\n  const r = await ops([op]);\n  selecionar(r.refs.n);\n  const el = $(`.no[data-id=\"${r.refs.n}\"] ${tipo === \"nota\" ? \"textarea\" : \".titulo\"}`);\n  if (el) el.focus();\n}\n\n$(\"#ferramentas\").addEventListener(\"click\", (e) => {\n  const b = e.target.closest(\"[data-novo]\");\n  if (b) novo(b.dataset.novo).catch(() => {});\n});\n$(\"#centralizar\").addEventListener(\"click\", enquadrar);\n\nfunction abrirMenu(cx, cy) {\n  const menu = $(\"#menu-rapido\");\n  const p = paraMundo(cx, cy);\n  menu.innerHTML = `<button data-n=\"imagem\">🖼 Mídia do computador</button><button data-n=\"nota\">✎ Nota</button><button data-n=\"gerar-imagem\">✦ Gerar foto</button><button data-n=\"gerar-video\">▶ Gerar vídeo</button>`;\n  menu.style.left = `${cx}px`;\n  menu.style.top = `${cy}px`;\n  menu.hidden = false;\n  menu.onclick = (e) => {\n    const b = e.target.closest(\"[data-n]\");\n    if (!b) return;\n    fecharMenu();\n    novo(b.dataset.n, { x: p.x + 120, y: p.y + 60 }).catch(() => {});\n  };\n}\nfunction fecharMenu() { $(\"#menu-rapido\").hidden = true; }\ndocument.addEventListener(\"pointerdown\", (e) => { if (!e.target.closest(\"#menu-rapido\")) fecharMenu(); }, true);\n\n// ---------------------------------------------------------------------------------------------\n// Teclado\n// ---------------------------------------------------------------------------------------------\n\ndocument.addEventListener(\"keydown\", async (e) => {\n  if (e.target.closest && e.target.closest(\"input, textarea, select, dialog\")) return;\n  const ctrl = e.ctrlKey || e.metaKey;\n  const k = e.key.toLowerCase();\n  if (e.key === \"Escape\") { $(\"#visor\").hidden = true; fecharMenu(); fecharProjetosFc(); est.sel.clear(); desenharNos(); desenharFios(); return; }\n  if ((e.key === \"Delete\" || e.key === \"Backspace\") && est.sel.size) {\n    e.preventDefault();\n    const ids = [...est.sel];\n    const temResultado = ids.some((id) => { const n = acharNo(id); return n && n.tipo === \"gerar\" && n.versoes.length; });\n    if (temResultado && !confirm(`Apagar ${ids.length} item(ns)? Os arquivos gerados continuam na biblioteca.`)) return;\n    est.sel.clear();\n    await ops(ids.map((id) => ({ op: \"remover\", id }))).catch(() => {});\n    return;\n  }\n  if (ctrl) {\n    if (k === \"z\" && !e.shiftKey) { e.preventDefault(); return voltar(false); }\n    if (k === \"y\" || (k === \"z\" && e.shiftKey)) { e.preventDefault(); return voltar(true); }\n    if (k === \"c\" && est.sel.size) { e.preventDefault(); return copiarNos(); }\n    if (k === \"d\" && est.sel.size) { e.preventDefault(); copiarNos(true); return colarNos(); }\n    if (k === \"a\") { e.preventDefault(); est.sel = new Set(est.doc.nos.filter((n) => n.cena === est.cena).map((n) => n.id)); desenharNos(); desenharFios(); return; }\n    if (k === \"i\") { e.preventDefault(); return novo(\"imagem\").catch(() => {}); }\n    if (e.key === \"Enter\") { e.preventDefault(); return gerarSelecionados(); }\n    return;\n  }\n  if (e.altKey) return;\n  if (linha.aberta && linha.dados && linha.dados.sequencia && [\"ArrowLeft\", \"ArrowRight\", \"Home\", \"End\"].includes(e.key)) {\n    e.preventDefault();\n    const s = linha.dados.sequencia;\n    const passo = e.shiftKey ? 1 : 1 / (s.fps || 24);\n    const t = e.key === \"Home\" ? 0 : e.key === \"End\" ? s.duracao : s.playhead + (e.key === \"ArrowLeft\" ? -passo : passo);\n    return irPara(Math.max(0, Math.min(s.duracao, t)));\n  }\n  if (e.key === \"?\") { e.preventDefault(); return alternarGuia(); }\n  if (k === \"f\") enquadrar();\n  if (k === \"n\") novo(\"nota\").catch(() => {});\n  if (k === \"g\") novo(\"gerar-imagem\").catch(() => {});\n  if (k === \"v\") novo(\"gerar-video\").catch(() => {});\n  if (k === \"i\") novo(\"imagem\").catch(() => {});\n  if (k === \"t\") alternarLinha(!linha.aberta);\n  if (k === \"p\") {\n    const nos = [...est.sel].map(acharNo).filter((n) => n && midiaDe(n));\n    if (!nos.length) return aviso(\"Selecione um nó com foto ou vídeo pronto.\", true);\n    for (const n of nos) await colocarNaLinha({ no: n.id });\n  }\n});\n\nasync function voltar(refazer) {\n  try {\n    const r = await postar(refazer ? \"/api/refazer\" : \"/api/desfazer\");\n    if (!r.ok) aviso(refazer ? \"Nada para refazer.\" : \"Nada para desfazer.\");\n    await carregarDoc();\n    if (!est.doc.cenas.some((c) => c.id === est.cena)) trocarCena(est.doc.cenas[0].id);\n  } catch (err) { aviso(err.message, true); }\n}\n\nasync function gerarSelecionados() {\n  const ids = [...est.sel].filter((id) => { const n = acharNo(id); return n && n.tipo === \"gerar\" && n.estado !== \"gerando\"; });\n  if (!ids.length) return aviso(\"Selecione um ou mais nós Gerar.\", true);\n  if (est.cfg && est.cfg.motor === \"manual\") return aviso(\"No modo Manual, use o botão Gerar de cada nó (ele copia o prompt).\", true);\n  try {\n    const r = await postar(\"/api/gerar\", { nos: ids });\n    for (const x of r.resultados || []) if (x.erro) aviso(`${x.no}: ${x.erro}`, true);\n    await carregarDoc();\n  } catch (err) { aviso(err.message, true); }\n}\n\n// Copiar / colar nós (com os fios entre eles). Vale entre cenas e entre projetos abertos no mesmo navegador.\nlet areaNos = null;\nconst MARCA_NOS = \"quadro-artcraft-nos:\";\nfunction copiarNos(semSistema) {\n  const ids = new Set([...est.sel].filter((id) => acharNo(id)));\n  const nos = est.doc.nos.filter((n) => ids.has(n.id)).map((n) => JSON.parse(JSON.stringify(n)));\n  const ligs = est.doc.ligacoes.filter((l) => ids.has(l.de) && ids.has(l.para)).map((l) => ({ ...l }));\n  areaNos = { proj: est.proj, nos, ligs, vezes: 0 };\n  if (!semSistema) {\n    try { navigator.clipboard.writeText(MARCA_NOS + nos.length).catch(() => {}); } catch {}\n    aviso(`${nos.length} nó(s) copiado(s).`);\n  }\n}\nasync function colarNos() {\n  if (!areaNos || !areaNos.nos.length) return;\n  areaNos.vezes++;\n  const d = 40 * areaNos.vezes;\n  const mesmoProj = areaNos.proj === est.proj;\n  const lista = [];\n  for (const n of areaNos.nos) {\n    const op = { op: \"no\", ref: `r_${n.id}`, cena: est.cena, tipo: n.tipo, titulo: n.titulo, x: n.x + d, y: n.y + d };\n    for (const c of [\"texto\", \"prompt\", \"saida\", \"modelo\", \"proporcao\", \"duracao\", \"w\", \"cor\"]) if (n[c] !== undefined && n[c] !== null) op[c] = n[c];\n    const m = n.tipo === \"gerar\" ? n.atual : n.midia;\n    if (m && mesmoProj && est.doc.midias[m]) op.midia = m;\n    lista.push(op);\n  }\n  for (const l of areaNos.ligs) lista.push({ op: \"ligar\", de: `r_${l.de}`, para: `r_${l.para}`, texto: l.texto || \"\" });\n  try {\n    const r = await ops(lista);\n    est.sel = new Set(areaNos.nos.map((n) => r.refs[`r_${n.id}`]).filter(Boolean));\n    desenharNos(); desenharFios();\n  } catch {}\n}\n\n// ---------------------------------------------------------------------------------------------\n// Cenas, projetos, envio da cena, configuração\n// ---------------------------------------------------------------------------------------------\n\n$(\"#cenas\").addEventListener(\"click\", async (e) => {\n  const b = e.target.closest(\"[data-cena]\");\n  if (!b) return;\n  if (b.dataset.cena === \"+\") {\n    const n = est.doc.cenas.length + 1;\n    const nome = prompt(\"Nome da cena:\", `Cena ${n}`);\n    if (!nome) return;\n    const r = await ops([{ op: \"cena\", nome, ref: \"c\" }]);\n    trocarCena(r.refs.c);\n    return;\n  }\n  trocarCena(b.dataset.cena);\n});\n$(\"#cenas\").addEventListener(\"dblclick\", async (e) => {\n  const b = e.target.closest(\"[data-cena]\");\n  if (!b || b.dataset.cena === \"+\") return;\n  const c = est.doc.cenas.find((x) => x.id === b.dataset.cena);\n  const nome = prompt(\"Renomear cena (deixe vazio para apagar a cena):\", c.nome);\n  if (nome === null) return;\n  if (nome.trim() === \"\") {\n    if (confirm(`Apagar \"${c.nome}\" e todos os nós dela? Os arquivos continuam na biblioteca.`)) await ops([{ op: \"remover_cena\", id: c.id }]);\n    return;\n  }\n  await ops([{ op: \"cena\", id: c.id, nome }]);\n});\n\nfunction trocarCena(id) {\n  est.cena = id;\n  est.sel.clear();\n  gravarLocal(`cena:${est.proj}`, id);\n  $(\"#camada-nos\").innerHTML = \"\";\n  $(\"#camada-rotulos\").innerHTML = \"\";\n  restaurarVista();\n  desenhar();\n}\n\n$(\"#projeto\").addEventListener(\"change\", async (e) => {\n  let nome = e.target.value;\n  if (nome === \"+\") {\n    nome = prompt(\"Nome do novo projeto (ex.: Clipe Badauê):\");\n    if (!nome) { desenharTopo(); return; }\n  }\n  const r = await postar(\"/api/projetos\", { nome });\n  location.search = `?p=${encodeURIComponent(r.ativo)}`;\n});\n\nasync function enviarCena(app) {\n  const nome = app === \"filmcraft\" ? \"FilmCraft\" : \"EffectCraft\";\n  const cena = est.doc.cenas.find((c) => c.id === est.cena);\n  aviso(`Enviando \"${cena.nome}\" para o ${nome}…`);\n  try {\n    const r = await postar(\"/api/enviar\", { cena: est.cena, app });\n    aviso(r.texto);\n    await carregarDoc();\n  } catch (e) { aviso(e.message, true); }\n}\n$(\"#enviar-film\").addEventListener(\"click\", () => enviarCena(\"filmcraft\"));\n$(\"#enviar-effect\").addEventListener(\"click\", () => enviarCena(\"effectcraft\"));\n\n$(\"#motor\").addEventListener(\"click\", () => {\n  const d = $(\"#dlg-config\");\n  const f = d.querySelector(\"form\");\n  f.motor.value = est.cfg.motor;\n  f.artcraftKey.value = \"\";\n  f.falKey.value = \"\";\n  f.artcraftKey.placeholder = est.cfg.artcraft ? \"•••••• (configurada)\" : \"artcraft_api_…\";\n  f.falKey.placeholder = est.cfg.fal ? \"•••••• (configurada)\" : \"…\";\n  $(\"#cfg-pasta\").textContent = est.cfg.pasta;\n  f.github.value = est.cfg.github || \"\";\n  f.github.disabled = est.cfg.github === null;\n  $(\"#cfg-versao\").textContent = `Versão atual: ${est.cfg.versao}.`;\n  d.showModal();\n});\n$(\"#dlg-config\").addEventListener(\"close\", async () => {\n  const d = $(\"#dlg-config\");\n  if (d.returnValue !== \"salvar\") return;\n  const f = d.querySelector(\"form\");\n  const corpo = { motor: f.motor.value };\n  if (f.artcraftKey.value.trim()) corpo.artcraftKey = f.artcraftKey.value.trim();\n  if (f.falKey.value.trim()) corpo.falKey = f.falKey.value.trim();\n  if (!f.github.disabled && f.github.value.trim() !== (est.cfg.github || \"\")) corpo.github = f.github.value.trim();\n  try { await postar(\"/api/config\", corpo); } catch (err) { return aviso(err.message, true); }\n  est.cfg = await pegar(\"/api/config\");\n  if (corpo.github) setTimeout(conferirAtualizacao, 8000);\n  aviso(\"Configuração salva.\");\n  desenhar();\n});\n\n$(\"#bib-fechar\").addEventListener(\"click\", () => alternarBiblioteca(false));\n$(\"#bib-abrir\").addEventListener(\"click\", () => alternarBiblioteca(true));\nfunction alternarBiblioteca(abrir) {\n  $(\"#biblioteca\").classList.toggle(\"fechada\", !abrir);\n  document.body.classList.toggle(\"sem-bib\", !abrir);\n  $(\"#bib-abrir\").hidden = abrir;\n  gravarLocal(\"biblioteca\", abrir ? \"1\" : \"0\");\n}\n\n// ---------------------------------------------------------------------------------------------\n// Visor (tela cheia)\n// ---------------------------------------------------------------------------------------------\n\nfunction abrirVisor(m) {\n  if (!m) return;\n  const v = $(\"#visor\");\n  const legenda = [m.arquivo, m.modelo && `${m.motor} · ${m.modelo}`, m.prompt].filter(Boolean).join(\"\\n\");\n  v.querySelector(\".visor-conteudo\").innerHTML = (m.tipo === \"video\"\n    ? `<video src=\"${urlMidia(m)}\" controls autoplay loop></video>`\n    : `<img src=\"${urlMidia(m)}\" alt=\"\">`) + `<div class=\"legenda\">${esc(legenda)}</div>`;\n  v.hidden = false;\n}\n$(\"#visor\").addEventListener(\"click\", (e) => { if (!e.target.closest(\"video\")) { $(\"#visor\").hidden = true; $(\"#visor .visor-conteudo\").innerHTML = \"\"; } });\n\n// vídeos dos nós tocam ao passar o mouse\n$(\"#camada-nos\").addEventListener(\"pointerover\", (e) => { const v = e.target.closest(\".previa video\"); if (v) v.play().catch(() => {}); });\n$(\"#camada-nos\").addEventListener(\"pointerout\", (e) => { const v = e.target.closest(\".previa video\"); if (v) v.pause(); });\n\n// ---------------------------------------------------------------------------------------------\n// Miniaturas (o navegador gera; o Claude usa para ver o quadro gastando pouco)\n// ---------------------------------------------------------------------------------------------\n\nconst fila = new Set();\nlet fazendo = false;\nasync function fazerMiniaturas() {\n  for (const m of Object.values(est.doc.midias)) if (!est.minis.has(m.id)) fila.add(m.id);\n  if (fazendo) return;\n  fazendo = true;\n  try {\n    for (const id of fila) {\n      fila.delete(id);\n      const m = est.doc.midias[id];\n      if (!m) continue;\n      try {\n        const blob = await miniatura(m);\n        if (!blob) continue;\n        await fetch(`/api/miniatura?${qp(`&m=${id}`)}`, { method: \"POST\", headers: { \"X-Quadro\": \"1\" }, body: blob });\n        est.minis.add(id);\n      } catch {}\n    }\n  } finally { fazendo = false; }\n}\n\nfunction miniatura(m) {\n  return new Promise((resolve) => {\n    const desenharEm = (fonte, w, h) => {\n      const k = Math.min(1, 512 / Math.max(w, h));\n      const c = document.createElement(\"canvas\");\n      c.width = Math.max(1, Math.round(w * k)); c.height = Math.max(1, Math.round(h * k));\n      c.getContext(\"2d\").drawImage(fonte, 0, 0, c.width, c.height);\n      c.toBlob((b) => resolve(b), \"image/jpeg\", 0.8);\n    };\n    const tempo = setTimeout(() => resolve(null), 20000);\n    if (m.tipo === \"video\") {\n      const v = document.createElement(\"video\");\n      v.muted = true; v.preload = \"auto\"; v.src = urlMidia(m);\n      v.addEventListener(\"loadeddata\", () => { v.currentTime = Math.min(0.5, (v.duration || 1) / 3); }, { once: true });\n      v.addEventListener(\"seeked\", () => { clearTimeout(tempo); desenharEm(v, v.videoWidth, v.videoHeight); }, { once: true });\n      v.addEventListener(\"error\", () => { clearTimeout(tempo); resolve(null); }, { once: true });\n    } else {\n      const i = new Image();\n      i.onload = () => { clearTimeout(tempo); desenharEm(i, i.naturalWidth, i.naturalHeight); };\n      i.onerror = () => { clearTimeout(tempo); resolve(null); };\n      i.src = urlMidia(m);\n    }\n  });\n}\n\n// ---------------------------------------------------------------------------------------------\n// Timeline do FilmCraft (painel de baixo): mostra a sequência aberta no FilmCraft, ao vivo\n// ---------------------------------------------------------------------------------------------\n\nconst linha = { aberta: false, dados: null, assinatura: \"\", pps: 1, monitor: true, timer: null, buscando: false, fotoEm: null, fotoBuscando: false, minis: new Map(), arrastando: null };\nconst tcLinha = (s, fps) => {\n  s = Math.max(0, s || 0);\n  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = Math.floor(s % 60), f = Math.floor((s % 1) * (fps || 24) + 1e-6);\n  return `${String(h).padStart(2, \"0\")}:${String(m).padStart(2, \"0\")}:${String(x).padStart(2, \"0\")}:${String(f).padStart(2, \"0\")}`;\n};\n\nfunction alternarLinha(abrir) {\n  linha.aberta = abrir;\n  $(\"#linha\").hidden = !abrir;\n  document.body.classList.toggle(\"com-linha\", abrir);\n  $(\"#linha-alternar\").classList.toggle(\"primario\", abrir);\n  gravarLocal(\"linha\", abrir ? \"1\" : \"0\");\n  clearInterval(linha.timer);\n  if (abrir) { buscarLinha(); linha.timer = setInterval(() => { if (!document.hidden) buscarLinha(); }, 1000); }\n}\n$(\"#linha-alternar\").addEventListener(\"click\", () => alternarLinha(!linha.aberta));\n$(\"#linha-fechar\").addEventListener(\"click\", () => alternarLinha(false));\n$(\"#linha-ver-monitor\").addEventListener(\"click\", () => {\n  linha.monitor = !linha.monitor;\n  $(\"#linha\").classList.toggle(\"sem-monitor\", !linha.monitor);\n  gravarLocal(\"linha-monitor\", linha.monitor ? \"1\" : \"0\");\n  linha.fotoEm = null;\n  desenharLinha(true);\n});\n$(\"#linha-abrir\").addEventListener(\"click\", (e) => { e.stopPropagation(); abrirProjetosFc(); });\n$(\"#fc-projeto\").addEventListener(\"click\", (e) => { e.stopPropagation(); if ($(\"#fc-projetos\").hidden) abrirProjetosFc(); else fecharProjetosFc(); });\n$(\"#linha-controle\").addEventListener(\"click\", async (e) => {\n  e.target.disabled = true;\n  try { const r = await postar(\"/api/filmcraft/controle\"); aviso(r.texto, false, 12000); } catch (err) { aviso(err.message, true); }\n  e.target.disabled = false;\n});\ndocument.addEventListener(\"pointerdown\", (e) => { if (!e.target.closest(\"#fc-projetos, #fc-projeto, #linha-abrir\")) fecharProjetosFc(); }, true);\n\n// Seletor de projeto: o que está aberto, os recentes do FilmCraft e os .fcproj achados no PC.\nfunction fecharProjetosFc() { $(\"#fc-projetos\").hidden = true; }\nasync function abrirProjetosFc() {\n  const caixa = $(\"#fc-projetos\");\n  caixa.hidden = false;\n  caixa.innerHTML = `<p class=\"dica\" style=\"padding:6px\">Procurando projetos…</p>`;\n  let r;\n  try { r = await pegar(\"/api/filmcraft/projetos\"); } catch (err) { caixa.innerHTML = `<p class=\"dica\" style=\"padding:6px\">${esc(err.message)}</p>`; return; }\n  const botao = (p, atual) => `<button class=\"proj${atual ? \" atual\" : \"\"}\" data-path=\"${esc(p.path)}\" ${p.existe === false ? \"disabled title=\\\"arquivo não encontrado\\\"\" : \"\"}>${esc(p.nome)}<small>${esc(p.pasta || \"\")}</small></button>`;\n  let h = \"\";\n  if (r.atual) {\n    h += `<h5>Aberto agora no FilmCraft</h5><button class=\"proj atual\" disabled>${esc(r.atual.nome)}${r.atual.alterado ? \" •\" : \"\"}<small>${esc(r.atual.path || \"ainda não salvo\")}</small></button>`;\n    if (r.sequencias.length) h += `<h5>Sequências deste projeto</h5>${r.sequencias.map((q) => `<button class=\"proj${q.item === r.ativa ? \" atual\" : \"\"}\" data-seq=\"${q.item}\">🎞 ${esc(q.nome)}</button>`).join(\"\")}`;\n  } else if (!r.conectado && r.rodando) {\n    h += `<p class=\"dica\" style=\"padding:6px\">O FilmCraft está aberto sem sincronização. Salve e feche o FilmCraft e escolha o projeto abaixo, ou use “Ligar sincronização permanente”.</p>`;\n  }\n  const atualPath = r.atual && r.atual.path;\n  const rec = r.recentes.filter((p) => p.path !== atualPath);\n  if (rec.length) h += `<h5>Recentes do FilmCraft</h5>${rec.map((p) => botao(p)).join(\"\")}`;\n  if (r.encontrados.length) h += `<h5>Encontrados no computador</h5>${r.encontrados.map((p) => botao(p)).join(\"\")}`;\n  if (!rec.length && !r.encontrados.length) h += `<p class=\"dica\" style=\"padding:6px\">Não achei projetos (.fcproj) nos recentes nem em Documentos, Vídeos, Área de Trabalho e Downloads.</p>`;\n  h += `<h5>Outro projeto</h5><div class=\"caminho\"><input placeholder=\"Cole o caminho do .fcproj (Shift + botão direito › Copiar como caminho)\"><button class=\"btn\" data-caminho>Abrir</button></div>`;\n  if (!r.conectado && !r.rodando) h += `<div class=\"caminho\"><button class=\"btn\" data-vazio>Abrir o FilmCraft sem projeto</button></div>`;\n  caixa.innerHTML = h;\n}\n$(\"#fc-projetos\").addEventListener(\"click\", async (e) => {\n  const b = e.target.closest(\"button\");\n  if (!b || b.disabled) return;\n  if (b.dataset.seq) {\n    try { await postar(\"/api/filmcraft/sequencia\", { item: Number(b.dataset.seq) }); fecharProjetosFc(); linha.assinatura = \"\"; buscarLinha(); } catch (err) { aviso(err.message, true); }\n    return;\n  }\n  let caminho = b.dataset.path;\n  if (b.hasAttribute(\"data-caminho\")) caminho = $(\"#fc-projetos input\").value.trim().replace(/^\"|\"$/g, \"\");\n  if (b.hasAttribute(\"data-caminho\") && !caminho) return;\n  fecharProjetosFc();\n  await abrirProjetoFc(caminho || \"\");\n});\nasync function abrirProjetoFc(caminho, salvar) {\n  aviso(caminho ? `Abrindo ${caminho.split(/[\\\\/]/).pop()} no FilmCraft…` : \"Abrindo o FilmCraft…\");\n  try {\n    const r = await postar(\"/api/filmcraft/abrir\", { path: caminho || undefined, salvar: !!salvar });\n    if (r.precisaSalvar) {\n      if (r.semCaminho) return aviso(`\"${r.nome}\" tem mudanças e nunca foi salvo. Salve no FilmCraft (Ctrl+S) e tente de novo.`, true);\n      if (confirm(`O projeto \"${r.nome}\" tem mudanças não salvas. Salvar e abrir o outro projeto?`)) return abrirProjetoFc(caminho, true);\n      return;\n    }\n    if (r.semControle) return aviso(\"O FilmCraft está aberto sem sincronização. Salve e feche o FilmCraft e tente de novo, ou ligue a sincronização permanente.\", true, 9000);\n    aviso(r.texto);\n    linha.assinatura = \"\";\n    buscarLinha();\n  } catch (err) { aviso(err.message, true); }\n}\n$(\"#fc-sequencia\").addEventListener(\"change\", async (e) => {\n  try { await postar(\"/api/filmcraft/sequencia\", { item: Number(e.target.value) }); linha.assinatura = \"\"; buscarLinha(); } catch (err) { aviso(err.message, true); }\n});\n// nome do projeto e lista de sequências no topo da timeline (só quando mudam)\nlet projetoFcVisto = \"\";\nasync function atualizarCabecalhoFc(s) {\n  const chave = `${s.id}|${linha.assinatura.length}`;\n  if (chave === projetoFcVisto) return;\n  projetoFcVisto = chave;\n  try {\n    const r = await pegar(\"/api/filmcraft/projetos\");\n    $(\"#fc-projeto span\").textContent = r.atual ? r.atual.nome : \"Projeto\";\n    const sel = $(\"#fc-sequencia\");\n    sel.innerHTML = r.sequencias.map((q) => `<option value=\"${q.item}\" ${q.item === r.ativa ? \"selected\" : \"\"}>${esc(q.nome)}</option>`).join(\"\");\n    sel.hidden = r.sequencias.length < 2;\n  } catch {}\n}\nfunction irPara(t) {\n  const s = linha.dados.sequencia;\n  s.playhead = t;\n  $(\"#linha-cabeca\").style.left = `${34 + t * linha.pps}px`;\n  $(\"#linha-tc\").textContent = tcLinha(t, s.fps);\n  postar(\"/api/filmcraft/playhead\", { seconds: t }).catch((err) => aviso(err.message, true));\n}\n\nasync function buscarLinha() {\n  if (linha.buscando) return;\n  linha.buscando = true;\n  try {\n    const d = await pegar(\"/api/filmcraft/linha\");\n    const s = d.sequencia;\n    const assinatura = JSON.stringify(s ? { ...s, playhead: 0 } : d);\n    const mudou = assinatura !== linha.assinatura;\n    linha.dados = d;\n    linha.assinatura = assinatura;\n    desenharLinha(mudou);\n  } catch {\n    linha.dados = { conectado: false, falha: true };\n    desenharLinha(true);\n  } finally { linha.buscando = false; }\n}\n\nfunction desenharLinha(tudo) {\n  const d = linha.dados || {};\n  const s = d.sequencia;\n  const off = $(\"#linha-off\");\n  off.hidden = !!s;\n  if (!s) {\n    $(\"#linha-nome\").textContent = \"\";\n    $(\"#linha-tc\").textContent = \"\";\n    const semControle = !d.conectado && d.rodando === true;\n    off.querySelector(\"p\").textContent = d.falha ? \"Não consegui falar com o quadro.\" : semControle\n      ? \"O FilmCraft está aberto, mas sem a sincronização ligada, então o quadro não enxerga a timeline. Ligue a sincronização permanente uma vez (depois feche e abra o FilmCraft) ou salve, feche o FilmCraft e escolha o projeto aqui.\"\n      : !d.conectado\n        ? \"O FilmCraft está fechado. Escolha o projeto e eu abro já sincronizado com o quadro.\"\n        : `O FilmCraft está conectado, mas sem sequência aberta. Escolha uma sequência em 📂 Projeto.${d.aviso ? ` (${d.aviso})` : \"\"}`;\n    $(\"#linha-abrir\").hidden = semControle;\n    $(\"#linha-abrir\").textContent = d.conectado ? \"📂 Escolher projeto ou sequência\" : \"📂 Escolher projeto e abrir\";\n    $(\"#linha-controle\").hidden = !semControle;\n    $(\"#fc-sequencia\").hidden = true;\n    $(\"#fc-projeto span\").textContent = d.conectado ? \"Projeto\" : \"Abrir projeto\";\n    return;\n  }\n  $(\"#linha-nome\").textContent = `${s.nome} · ${s.largura}×${s.altura} · ${Math.round(s.fps * 100) / 100} fps`;\n  atualizarCabecalhoFc(s);\n  $(\"#linha-tc\").textContent = tcLinha(s.playhead, s.fps);\n  const area = $(\"#linha-faixas\");\n  const largura = Math.max(100, area.clientWidth - 34 - 8);\n  const total = Math.max(s.duracao * 1.04, 5);\n  const pps = largura / total;\n  if (tudo || pps !== linha.pps) {\n    linha.pps = pps;\n    // régua: marcas a cada 1, 2, 5, 10, 30, 60… segundos, o que couber\n    const passo = [1, 2, 5, 10, 15, 30, 60, 120, 300, 600].find((p) => p * pps >= 70) || 1200;\n    let regua = \"\";\n    for (let t = 0; t <= total; t += passo) regua += `<i style=\"left:${t * pps}px\">${tcLinha(t, s.fps).replace(/^00:/, \"\").slice(0, -3)}</i>`;\n    for (const m of s.marcadores) regua += `<b class=\"marca-fc\" style=\"left:${m.ini * pps}px\" title=\"${esc(tcLinha(m.ini, s.fps))} ${esc(m.nome)}\"></b>`;\n    $(\"#linha-regua\").innerHTML = regua;\n    const noQuadro = new Set((est.doc ? est.doc.nos : []).filter((n) => n.fc).map((n) => n.fc.clip));\n    const trilha = (f, audio) => `<div class=\"trilha${audio ? \" audio\" : \"\"}\" data-trilha=\"${f.nome}\"><div class=\"nome-trilha\">${f.nome}</div>${f.clipes.map((c) => {\n      const tipo = s.tipos[c.item] || \"\";\n      const classes = [\"clipe\", s.selecao.includes(c.clip) && \"sel\", noQuadro.has(c.clip) && \"no-quadro\", !c.ativo && \"off\"].filter(Boolean).join(\" \");\n      return `<div class=\"${classes}\" ${audio ? \"\" : `draggable=\"true\" data-clip=\"${c.clip}\" data-item=\"${c.item}\" data-tipo=\"${tipo}\" data-meio=\"${c.inSrc + c.dur / 2}\"`} style=\"left:${c.ini * pps}px;width:${Math.max(2, c.dur * pps - 1)}px\" title=\"${esc(c.nome)} · ${tcLinha(c.ini, s.fps)} → ${tcLinha(c.ini + c.dur, s.fps)}${audio ? \"\" : \"\\nArraste para o quadro (ou clique duas vezes) para usar como referência\"}\"><span>${esc(c.nome)}</span></div>`;\n    }).join(\"\")}</div>`;\n    $(\"#linha-trilhas\").innerHTML = [...s.video].reverse().map((f) => trilha(f, false)).join(\"\") + s.audio.map((f) => trilha(f, true)).join(\"\");\n    document.querySelectorAll(\"#linha-trilhas .clipe[data-clip]\").forEach(pintarClipe);\n  }\n  $(\"#linha-cabeca\").style.left = `${34 + s.playhead * linha.pps}px`;\n  atualizarMonitor(s);\n}\n\n// Miniatura do clipe: o navegador tira um quadro do arquivo original (foto ou vídeo).\nfunction pintarClipe(el) {\n  const chave = `${el.dataset.item}:${(+el.dataset.meio).toFixed(2)}`;\n  const pronta = linha.minis.get(chave);\n  if (pronta) { if (pronta !== \"x\") el.style.backgroundImage = `url(\"${pronta}\")`; return; }\n  linha.minis.set(chave, \"x\");\n  const url = `/api/filmcraft/arquivo?${qp(`&item=${el.dataset.item}`)}`;\n  const usar = (u) => { linha.minis.set(chave, u); document.querySelectorAll(`#linha-trilhas .clipe[data-item=\"${el.dataset.item}\"]`).forEach((x) => { if (`${x.dataset.item}:${(+x.dataset.meio).toFixed(2)}` === chave) x.style.backgroundImage = `url(\"${u}\")`; }); };\n  const reduzir = (fonte, w, h) => {\n    const c = document.createElement(\"canvas\");\n    c.height = 60; c.width = Math.max(1, Math.round((w / h) * 60));\n    c.getContext(\"2d\").drawImage(fonte, 0, 0, c.width, c.height);\n    usar(c.toDataURL(\"image/jpeg\", 0.7));\n  };\n  if (el.dataset.tipo === \"imagem\") {\n    const i = new Image();\n    i.onload = () => reduzir(i, i.naturalWidth, i.naturalHeight);\n    i.src = url;\n  } else if (el.dataset.tipo === \"video\") {\n    const v = document.createElement(\"video\");\n    v.muted = true; v.preload = \"auto\"; v.src = url;\n    v.addEventListener(\"loadedmetadata\", () => { v.currentTime = Math.min(+el.dataset.meio, Math.max(0, (v.duration || 1) - 0.05)); }, { once: true });\n    v.addEventListener(\"seeked\", () => { reduzir(v, v.videoWidth, v.videoHeight); v.removeAttribute(\"src\"); v.load(); }, { once: true });\n  }\n}\n\nfunction atualizarMonitor(s) {\n  if (!linha.monitor || linha.fotoBuscando) return;\n  const chave = `${s.playhead.toFixed(3)}|${linha.assinatura.length}`;\n  if (chave === linha.fotoEm) return;\n  linha.fotoBuscando = true;\n  fetch(`/api/filmcraft/monitor?${qp(\"&lado=640\")}`).then(async (r) => {\n    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).erro || \"sem imagem\");\n    const u = URL.createObjectURL(await r.blob());\n    const img = $(\"#linha-monitor img\");\n    if (img.src.startsWith(\"blob:\")) URL.revokeObjectURL(img.src);\n    img.src = u;\n    $(\"#linha-monitor span\").textContent = \"\";\n    linha.fotoEm = chave;\n  }).catch((e) => { $(\"#linha-monitor span\").textContent = e.message; linha.fotoEm = chave; })\n    .finally(() => { linha.fotoBuscando = false; });\n}\n\nconst tempoNaLinha = (clientX) => {\n  const r = $(\"#linha-faixas\").getBoundingClientRect();\n  return Math.max(0, (clientX - r.left - 34) / linha.pps);\n};\n\n// clicar / arrastar na régua ou nas faixas = mover o playhead do FilmCraft\nlet raspando = null;\n$(\"#linha-faixas\").addEventListener(\"pointerdown\", (e) => {\n  const s = linha.dados && linha.dados.sequencia;\n  if (!s || e.button !== 0 || e.target.closest(\".clipe[draggable]\")) return;\n  raspando = { ultimo: 0 };\n  moverPlayhead(e.clientX, true);\n  $(\"#linha-faixas\").setPointerCapture(e.pointerId);\n});\n$(\"#linha-faixas\").addEventListener(\"pointermove\", (e) => { if (raspando) moverPlayhead(e.clientX, false); });\n$(\"#linha-faixas\").addEventListener(\"pointerup\", (e) => { if (raspando) { moverPlayhead(e.clientX, true); raspando = null; } });\n$(\"#linha-faixas\").addEventListener(\"click\", (e) => {\n  // clique simples num clipe de vídeo também move o playhead\n  const c = e.target.closest(\".clipe[draggable]\");\n  if (c && linha.dados && linha.dados.sequencia) moverPlayhead(e.clientX, true);\n});\nfunction moverPlayhead(clientX, ja) {\n  const s = linha.dados.sequencia;\n  const t = Math.min(tempoNaLinha(clientX), s.duracao);\n  s.playhead = t;\n  $(\"#linha-cabeca\").style.left = `${34 + t * linha.pps}px`;\n  $(\"#linha-tc\").textContent = tcLinha(t, s.fps);\n  const agora = Date.now();\n  if (!ja && raspando && agora - raspando.ultimo < 120) return;\n  if (raspando) raspando.ultimo = agora;\n  postar(\"/api/filmcraft/playhead\", { seconds: t }).catch((err) => aviso(err.message, true));\n}\n\n// clipe da timeline → quadro (arrastar ou duplo clique)\n$(\"#linha-trilhas\").addEventListener(\"dragstart\", (e) => {\n  const c = e.target.closest(\".clipe[data-clip]\");\n  if (c) e.dataTransfer.setData(\"application/x-clipe-fc\", c.dataset.clip);\n});\n$(\"#linha-trilhas\").addEventListener(\"dblclick\", (e) => {\n  const c = e.target.closest(\".clipe[data-clip]\");\n  if (c) trazerClipe(Number(c.dataset.clip));\n});\nasync function trazerClipe(clip, p) {\n  const cena = est.doc.cenas.find((c) => c.id === est.cena);\n  aviso(\"Trazendo o clipe para o quadro…\");\n  try {\n    const r = await postar(\"/api/filmcraft/importar\", { clips: [clip], cena: cena.id, ...(p ? { x: p.x, y: p.y } : {}) });\n    aviso(r.texto);\n    await carregarDoc();\n    linha.assinatura = \"\";\n  } catch (err) { aviso(err.message, true); }\n}\n\n$(\"#linha-importar\").addEventListener(\"click\", async (e) => {\n  e.target.disabled = true;\n  aviso(\"Trazendo a sequência para o quadro…\");\n  try {\n    const r = await postar(\"/api/filmcraft/importar\", {});\n    aviso(r.texto);\n    await carregarDoc();\n    trocarCena(r.cena);\n    linha.assinatura = \"\";\n  } catch (err) { aviso(err.message, true); }\n  e.target.disabled = false;\n});\n\n// biblioteca → timeline (soltar no tempo onde caiu)\nconst painelLinha = $(\"#linha\");\npainelLinha.addEventListener(\"dragover\", (e) => {\n  if (!e.dataTransfer.types.includes(\"application/x-midia\") || !(linha.dados && linha.dados.sequencia)) return;\n  e.preventDefault();\n  mostrarAlvo(e.clientX);\n});\npainelLinha.addEventListener(\"dragleave\", (e) => { if (!painelLinha.contains(e.relatedTarget)) mostrarAlvo(null); });\npainelLinha.addEventListener(\"drop\", (e) => {\n  const midia = e.dataTransfer.getData(\"application/x-midia\");\n  mostrarAlvo(null);\n  if (!midia) return;\n  e.preventDefault();\n  colocarNaLinha({ midia, cena: est.cena }, tempoNaLinha(e.clientX));\n});\nfunction mostrarAlvo(clientX) {\n  const alvo = $(\"#linha-alvo\");\n  painelLinha.classList.toggle(\"soltar\", clientX !== null);\n  if (clientX === null) { alvo.hidden = true; return; }\n  const t = tempoNaLinha(clientX);\n  alvo.hidden = false;\n  alvo.style.left = `${34 + t * linha.pps}px`;\n  alvo.dataset.tc = tcLinha(t, linha.dados.sequencia.fps);\n}\n// nó arrastado do quadro e solto em cima da timeline\nfunction sobreLinha(clientX, clientY) {\n  if (!linha.aberta || !(linha.dados && linha.dados.sequencia)) return false;\n  const r = $(\"#linha-faixas\").getBoundingClientRect();\n  return clientY >= r.top && clientY <= r.bottom && clientX >= r.left && clientX <= r.right;\n}\nasync function colocarNaLinha(corpo, seconds) {\n  aviso(\"Colocando na timeline do FilmCraft…\");\n  try {\n    const r = await postar(\"/api/filmcraft/colocar\", { ...corpo, ...(typeof seconds === \"number\" ? { seconds } : {}) });\n    aviso(r.texto);\n    await carregarDoc();\n    if (linha.aberta) buscarLinha();\n  } catch (err) { aviso(err.message, true); }\n}\nwindow.addEventListener(\"resize\", () => { if (linha.aberta) desenharLinha(true); });\n\n// ---------------------------------------------------------------------------------------------\n// Guia, aviso de atualização\n// ---------------------------------------------------------------------------------------------\n\nfunction alternarGuia(abrir) {\n  if (abrir === undefined) abrir = $(\"#guia\").hidden;\n  $(\"#guia\").hidden = !abrir;\n  document.body.classList.toggle(\"com-guia\", abrir);\n  $(\"#guia-alternar\").classList.toggle(\"primario\", abrir);\n  gravarLocal(\"guia\", abrir ? \"1\" : \"0\");\n  if (linha.aberta) desenharLinha(true);\n}\n$(\"#guia-alternar\").addEventListener(\"click\", () => alternarGuia());\n$(\"#guia-fechar\").addEventListener(\"click\", () => alternarGuia(false));\n\nlet atualizacaoVista = \"\";\nasync function conferirAtualizacao() {\n  try {\n    const r = await pegar(\"/api/atualizacao\");\n    if (!r.pronta || r.pronta.versao === atualizacaoVista) return;\n    const b = $(\"#atualizacao\");\n    b.querySelector(\"span\").textContent = `Versão ${r.pronta.versao} pronta${r.pronta.notas ? `: ${r.pronta.notas}` : \"\"}`;\n    const btn = b.querySelector(\".btn\");\n    btn.textContent = r.podeReiniciar ? \"Reiniciar e atualizar\" : \"Entra quando reiniciar o Claude\";\n    btn.disabled = !r.podeReiniciar;\n    b.hidden = false;\n  } catch {}\n}\n$(\"#atualizacao .mini\").addEventListener(\"click\", () => {\n  atualizacaoVista = $(\"#atualizacao span\").textContent.replace(/^Versão (\\S+).*/, \"$1\");\n  $(\"#atualizacao\").hidden = true;\n});\n$(\"#atualizacao .btn\").addEventListener(\"click\", async (e) => {\n  e.target.disabled = true;\n  e.target.textContent = \"Reiniciando…\";\n  try { await postar(\"/api/reiniciar\"); } catch (err) { aviso(err.message, true); return; }\n  // espera o programa voltar e recarrega a página\n  const t0 = Date.now();\n  await new Promise((r) => setTimeout(r, 2500));\n  while (Date.now() - t0 < 60000) {\n    try { const r = await fetch(\"/api/ping\", { cache: \"no-store\" }); if (r.ok) return location.reload(); } catch {}\n    await new Promise((r) => setTimeout(r, 1000));\n  }\n  aviso(\"O programa não voltou sozinho. Abra o Quadro ArtCraft.exe de novo.\", true);\n});\n\n// ---------------------------------------------------------------------------------------------\n// Início e atualização ao vivo\n// ---------------------------------------------------------------------------------------------\n\nfunction conectarEventos() {\n  const es = new EventSource(`/api/eventos?${qp()}`);\n  let t;\n  es.onmessage = (ev) => {\n    const d = JSON.parse(ev.data);\n    if (d.tipo === \"quadro\" && (!est.doc || d.rev !== est.doc.rev)) { clearTimeout(t); t = setTimeout(carregarDoc, 80); }\n    if (d.tipo === \"progresso\") {\n      const n = est.doc && acharNo(d.no);\n      if (n) { n.progresso = d.progresso; desenharNos(); }\n    }\n  };\n  es.onerror = () => { es.close(); setTimeout(conectarEventos, 3000); };\n}\n\n(async function iniciar() {\n  try {\n    const [cfg, projs] = await Promise.all([pegar(\"/api/config\"), pegar(\"/api/projetos\")]);\n    est.cfg = cfg;\n    est.projetos = projs.projetos;\n    if (!est.proj) est.proj = projs.ativo;\n    if (lerLocal(\"biblioteca\") === \"0\") alternarBiblioteca(false);\n    if (lerLocal(\"linha-monitor\") === \"0\") { linha.monitor = false; $(\"#linha\").classList.add(\"sem-monitor\"); }\n    if (lerLocal(\"linha\") === \"1\") alternarLinha(true);\n    if (lerLocal(\"guia\") !== \"0\") alternarGuia(true);\n    conferirAtualizacao();\n    setInterval(conferirAtualizacao, 10 * 60 * 1000);\n    await carregarDoc();\n    conectarEventos();\n    document.title = `${est.doc.nome} · Quadro de Cenas`;\n  } catch (e) {\n    document.body.innerHTML = `<p style=\"padding:40px\">Não consegui falar com o quadro: ${esc(e.message)}. Ele roda junto com o Claude Desktop: abra o Claude e recarregue esta página.</p>`;\n  }\n})();\n","style.css":":root {\n  --fundo: #0b0d14;\n  --ponto: #20263a;\n  --painel: #141826;\n  --painel2: #1a1f30;\n  --borda: #272e45;\n  --texto: #e7eaf3;\n  --suave: #8c94ae;\n  --azul: #7fb8ff;\n  --rosa: #ff8fd1;\n  --verde: #8ff0c0;\n  --ambar: #ffd479;\n  --vermelho: #ff7a8a;\n  --raio: 12px;\n  color-scheme: dark;\n}\n* { box-sizing: border-box; }\n[hidden] { display: none !important; }\nhtml, body { margin: 0; height: 100%; overflow: hidden; background: var(--fundo); color: var(--texto);\n  font: 13px/1.4 \"Segoe UI\", system-ui, -apple-system, Roboto, sans-serif; }\nbutton, input, select, textarea { font: inherit; color: inherit; }\n.dica { color: var(--suave); font-size: 12px; margin: 6px 0; }\ncode { background: var(--painel2); padding: 1px 5px; border-radius: 4px; font-size: 12px; }\n\n/* topo */\n#topo { position: fixed; inset: 0 0 auto 0; height: 48px; display: flex; align-items: center; gap: 10px; padding: 0 12px;\n  background: rgba(14, 17, 27, .92); border-bottom: 1px solid var(--borda); z-index: 20; backdrop-filter: blur(8px); }\n.marca { display: flex; align-items: center; gap: 8px; font-weight: 700; letter-spacing: .3px; }\n.marca img { width: 22px; height: 22px; }\n#projeto { background: var(--painel2); border: 1px solid var(--borda); border-radius: 8px; padding: 5px 8px; max-width: 200px; }\n#cenas { display: flex; gap: 4px; overflow-x: auto; min-width: 0; scrollbar-width: none; }\n#cenas button { white-space: nowrap; background: transparent; border: 1px solid transparent; border-radius: 8px; padding: 5px 11px; color: var(--suave); cursor: pointer; }\n#cenas button:hover { color: var(--texto); background: var(--painel2); }\n#cenas button.ativa { color: var(--texto); border-color: var(--rosa); background: rgba(255, 143, 209, .08); box-shadow: 0 0 12px rgba(255, 143, 209, .25); }\n#cenas button.nova { color: var(--verde); }\n.espaco { flex: 1; }\n.btn { background: var(--painel2); border: 1px solid var(--borda); border-radius: 8px; padding: 6px 11px; cursor: pointer; white-space: nowrap; }\n.btn:hover { border-color: var(--azul); }\n.btn.primario { background: linear-gradient(90deg, rgba(127,184,255,.25), rgba(255,143,209,.25)); border-color: var(--rosa); }\n.btn:disabled { opacity: .5; cursor: default; }\n#motor span.ok { color: var(--verde); }\n#motor span.falta { color: var(--ambar); }\n.mini { background: var(--painel2); border: 1px solid var(--borda); border-radius: 6px; cursor: pointer; padding: 0 7px; line-height: 20px; }\n\n/* biblioteca */\n#biblioteca { position: fixed; top: 48px; bottom: 0; left: 0; width: 168px; background: rgba(14, 17, 27, .92); border-right: 1px solid var(--borda);\n  z-index: 15; display: flex; flex-direction: column; padding: 8px; gap: 6px; }\n#biblioteca.fechada { display: none; }\n#bib-abrir { position: fixed; top: 58px; left: 8px; z-index: 15; }\n.bib-cab { display: flex; justify-content: space-between; align-items: center; font-weight: 600; color: var(--suave); text-transform: uppercase; font-size: 11px; letter-spacing: .6px; }\n#lista-midia { flex: 1; overflow-y: auto; display: grid; grid-template-columns: 1fr 1fr; gap: 6px; align-content: start; }\n#lista-midia .item { aspect-ratio: 1; border-radius: 8px; overflow: hidden; background: var(--painel2); border: 1px solid var(--borda); cursor: grab; position: relative; }\n#lista-midia .item img, #lista-midia .item video { width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none; }\n#lista-midia .item .v { position: absolute; right: 4px; bottom: 3px; font-size: 10px; background: rgba(0,0,0,.6); padding: 0 4px; border-radius: 4px; }\n\n/* palco */\n#palco { position: fixed; top: 48px; left: 168px; right: 0; bottom: 0; overflow: hidden; cursor: default;\n  background-color: var(--fundo); background-image: radial-gradient(var(--ponto) 1.2px, transparent 1.2px); }\nbody.sem-bib #palco { left: 0; }\n#palco.movendo { cursor: grabbing; }\n#mundo { position: absolute; left: 0; top: 0; transform-origin: 0 0; }\n#fios { position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none; }\n#fios path { fill: none; stroke-width: 2.5; stroke-linecap: round; }\n#fios path.fio { stroke: var(--rosa); filter: drop-shadow(0 0 4px rgba(255,143,209,.55)); }\n#fios path.fio.video { stroke: var(--azul); filter: drop-shadow(0 0 4px rgba(127,184,255,.55)); }\n#fios path.fio.nota { stroke: var(--verde); filter: drop-shadow(0 0 4px rgba(143,240,192,.5)); }\n#fios path.fio.sel { stroke-width: 4.5; }\n#fios path.alvo { stroke: transparent; stroke-width: 16; pointer-events: stroke; cursor: pointer; }\n#fio-temp { stroke: var(--texto); stroke-dasharray: 6 6; opacity: .8; }\n#vazio { position: absolute; left: 50%; top: 42%; transform: translate(-50%, -50%); max-width: 460px; text-align: center; color: var(--suave); pointer-events: none; }\n#vazio h2 { color: var(--texto); font-weight: 600; margin: 0 0 8px; }\n\n/* rótulos dos fios */\n#camada-rotulos { position: absolute; left: 0; top: 0; }\n.rotulo { position: absolute; transform: translate(-50%, -50%); width: max-content; max-width: 230px; padding: 4px 10px; border-radius: 14px; background: var(--painel);\n  border: 1px solid var(--rosa); font-size: 12px; cursor: text; white-space: pre-wrap; word-break: break-word; box-shadow: 0 0 10px rgba(255,143,209,.25); z-index: 3; }\n.rotulo.video { border-color: var(--azul); box-shadow: 0 0 10px rgba(127,184,255,.25); }\n.rotulo.nota { border-color: var(--verde); box-shadow: none; }\n.rotulo.vazio { color: var(--suave); border-style: dashed; opacity: .75; }\n.rotulo.sel { outline: 2px solid var(--texto); }\n.rotulo textarea { width: 230px; min-height: 60px; background: transparent; border: 0; outline: 0; resize: none; padding: 0; }\n\n/* nós */\n#camada-nos { position: absolute; left: 0; top: 0; }\n.no { position: absolute; width: 240px; background: var(--painel); border: 1px solid var(--borda); border-radius: var(--raio);\n  box-shadow: 0 8px 24px rgba(0,0,0,.35); z-index: 2; }\n.no.gerar { width: 300px; }\n.no.sel { border-color: var(--azul); box-shadow: 0 0 0 1px var(--azul), 0 0 22px rgba(127,184,255,.35); }\n.no.alvo-fio { border-color: var(--verde); box-shadow: 0 0 0 2px var(--verde), 0 0 24px rgba(143,240,192,.4); }\n.cab { display: flex; align-items: center; gap: 6px; height: 40px; padding: 0 10px; cursor: grab; border-bottom: 1px solid var(--borda); }\n.tag { font-size: 10px; font-weight: 700; letter-spacing: .6px; padding: 2px 6px; border-radius: 5px; background: rgba(255,143,209,.15); color: var(--rosa); flex: none; }\n.tag.video { background: rgba(127,184,255,.15); color: var(--azul); }\n.tag.nota { background: rgba(143,240,192,.13); color: var(--verde); }\n.tag.gerar { background: linear-gradient(90deg, rgba(127,184,255,.2), rgba(255,143,209,.2)); color: var(--texto); }\n.titulo { flex: 1; min-width: 0; background: transparent; border: 0; outline: 0; font-weight: 600; padding: 2px 0; text-overflow: ellipsis; }\n.titulo::placeholder { color: var(--suave); font-weight: 400; }\n.cab .x { background: transparent; border: 0; color: var(--suave); cursor: pointer; font-size: 15px; padding: 0 2px; }\n.cab .x:hover { color: var(--vermelho); }\n.porta { position: absolute; top: 13px; width: 14px; height: 14px; border-radius: 50%; background: var(--painel); border: 2px solid var(--rosa); z-index: 4; }\n.porta.saida { right: -8px; cursor: crosshair; }\n.porta.saida:hover { background: var(--rosa); box-shadow: 0 0 10px var(--rosa); }\n.porta.entrada { left: -8px; border-color: var(--verde); }\n.no.video .porta.saida, .no.gerar.saida-video .porta.saida { border-color: var(--azul); }\n.no.nota .porta.saida { border-color: var(--verde); }\n.previa { position: relative; background: #07080d; min-height: 60px; display: flex; align-items: center; justify-content: center; cursor: zoom-in; }\n.previa img, .previa video { display: block; width: 100%; max-height: 320px; object-fit: contain; }\n.previa .vazia { color: var(--suave); padding: 26px 12px; text-align: center; font-size: 12px; cursor: default; }\n.previa .soltar { position: absolute; inset: 0; display: none; align-items: center; justify-content: center; background: rgba(143,240,192,.15); border: 2px dashed var(--verde); color: var(--verde); font-weight: 600; }\n.no.arrastando-arquivo .previa .soltar { display: flex; }\n.rodape { display: flex; align-items: center; gap: 6px; padding: 6px 10px; color: var(--suave); font-size: 11px; }\n.rodape .nome { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.rodape button, .linha button { background: var(--painel2); border: 1px solid var(--borda); border-radius: 6px; padding: 2px 7px; cursor: pointer; color: var(--texto); font-size: 11px; }\n.rodape button:hover, .linha button:hover { border-color: var(--azul); }\n.nota textarea { width: 100%; min-height: 110px; background: transparent; border: 0; outline: 0; resize: vertical; padding: 10px; }\n.controles { padding: 8px 10px 10px; display: flex; flex-direction: column; gap: 7px; }\n.linha { display: flex; gap: 6px; align-items: center; }\n.linha select, .linha input { background: var(--painel2); border: 1px solid var(--borda); border-radius: 6px; padding: 3px 5px; min-width: 0; font-size: 12px; }\n.linha select.modelo { flex: 1; }\n.linha input.duracao { width: 52px; }\n.seg { display: flex; border: 1px solid var(--borda); border-radius: 7px; overflow: hidden; flex: none; }\n.seg button { border: 0; border-radius: 0; background: transparent; padding: 3px 8px; color: var(--suave); }\n.seg button.on { background: rgba(255,143,209,.18); color: var(--texto); }\n.controles textarea { width: 100%; min-height: 44px; background: var(--painel2); border: 1px solid var(--borda); border-radius: 8px; padding: 6px 8px; resize: vertical; outline: 0; font-size: 12px; }\n.controles textarea:focus { border-color: var(--azul); }\n.gerar-btn { flex: 1; background: linear-gradient(90deg, rgba(127,184,255,.28), rgba(255,143,209,.28)) !important; border-color: var(--rosa) !important; font-weight: 600; padding: 5px 8px !important; font-size: 12px !important; }\n.versoes { display: flex; align-items: center; gap: 2px; color: var(--suave); font-size: 11px; }\n.versoes button { padding: 0 5px !important; }\n.barra { height: 4px; border-radius: 3px; background: var(--painel2); overflow: hidden; }\n.barra i { display: block; height: 100%; width: 0; background: linear-gradient(90deg, var(--azul), var(--rosa), var(--verde)); transition: width .4s; }\n.barra.indef i { width: 35%; animation: vai 1.4s ease-in-out infinite; }\n@keyframes vai { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }\n.estado { font-size: 11px; color: var(--suave); }\n.estado.erro { color: var(--vermelho); }\n.enviado { color: var(--verde); font-size: 11px; }\n.no.gerando { border-color: var(--rosa); animation: pulsar 2s ease-in-out infinite; }\n@keyframes pulsar { 50% { box-shadow: 0 0 26px rgba(255,143,209,.45); } }\n\n/* ferramentas */\n#ferramentas { position: fixed; left: 50%; bottom: 14px; transform: translateX(-50%); display: flex; gap: 4px; align-items: center; padding: 5px;\n  background: rgba(20, 24, 38, .95); border: 1px solid var(--borda); border-radius: 12px; z-index: 18; box-shadow: 0 10px 30px rgba(0,0,0,.4); }\n#ferramentas button { background: transparent; border: 1px solid transparent; border-radius: 8px; padding: 6px 10px; cursor: pointer; white-space: nowrap; }\n#ferramentas button:hover { background: var(--painel2); border-color: var(--borda); }\n#ferramentas .sep { width: 1px; height: 22px; background: var(--borda); margin: 0 4px; }\n#zoom { color: var(--suave); font-size: 11px; min-width: 40px; text-align: center; }\n\n#menu-rapido { position: fixed; z-index: 30; background: var(--painel); border: 1px solid var(--borda); border-radius: 10px; padding: 4px; display: flex; flex-direction: column; min-width: 150px; box-shadow: 0 10px 30px rgba(0,0,0,.5); }\n#menu-rapido button { text-align: left; background: transparent; border: 0; padding: 6px 10px; border-radius: 6px; cursor: pointer; }\n#menu-rapido button:hover { background: var(--painel2); }\n\n#avisos { position: fixed; right: 14px; bottom: 14px; display: flex; flex-direction: column; gap: 6px; z-index: 40; max-width: 380px; }\n.aviso { background: var(--painel); border: 1px solid var(--borda); border-left: 3px solid var(--verde); border-radius: 8px; padding: 8px 12px; box-shadow: 0 8px 24px rgba(0,0,0,.4); white-space: pre-wrap; }\n.aviso.erro { border-left-color: var(--vermelho); }\n\n#visor { position: fixed; inset: 0; background: rgba(5,6,10,.88); z-index: 50; display: flex; align-items: center; justify-content: center; cursor: zoom-out; }\n#visor img, #visor video { max-width: 92vw; max-height: 88vh; border-radius: 8px; box-shadow: 0 0 40px rgba(127,184,255,.25); }\n#visor .legenda { color: var(--suave); text-align: center; margin-top: 8px; max-width: 80vw; white-space: pre-wrap; }\n\ndialog { background: var(--painel); color: var(--texto); border: 1px solid var(--borda); border-radius: 14px; width: min(460px, 92vw); padding: 18px 20px; }\ndialog::backdrop { background: rgba(0,0,0,.6); }\ndialog h3 { margin: 0 0 10px; }\ndialog label { display: flex; flex-direction: column; gap: 4px; margin-top: 10px; color: var(--suave); }\ndialog input, dialog select { background: var(--painel2); border: 1px solid var(--borda); border-radius: 8px; padding: 7px 9px; color: var(--texto); }\ndialog .acoes { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }\n\n/* timeline do FilmCraft */\n:root { --linha-h: 200px; }\nbody.com-linha #palco { bottom: var(--linha-h); }\nbody.com-linha #ferramentas { bottom: calc(var(--linha-h) + 14px); }\nbody.com-linha #avisos { bottom: calc(var(--linha-h) + 14px); }\nbody.com-linha #biblioteca { bottom: var(--linha-h); }\n#linha { position: fixed; left: 0; right: 0; bottom: 0; height: var(--linha-h); z-index: 18; background: #0e111b; border-top: 1px solid var(--borda);\n  display: flex; flex-direction: column; }\n.linha-cab { display: flex; align-items: center; gap: 10px; padding: 5px 10px; border-bottom: 1px solid var(--borda); min-height: 36px; }\n.linha-cab b { color: var(--azul); }\n.linha-cab .suave, .suave { color: var(--suave); }\n#linha-tc { font-variant-numeric: tabular-nums; color: var(--rosa); }\n#linha-dica { margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.linha-corpo { flex: 1; display: flex; min-height: 0; }\n#linha-faixas { position: relative; flex: 1; overflow-y: auto; overflow-x: hidden; cursor: text; user-select: none; }\n#linha-regua { position: sticky; top: 0; height: 18px; margin-left: 34px; border-bottom: 1px solid var(--borda); background: #0e111b; z-index: 3; }\n#linha-regua i { position: absolute; top: 0; bottom: 0; border-left: 1px solid var(--borda); font-style: normal; font-size: 10px; color: var(--suave); padding-left: 3px; }\n#linha-regua .marca-fc { position: absolute; top: 2px; width: 9px; height: 9px; margin-left: -4px; transform: rotate(45deg); background: var(--verde); border-radius: 2px; }\n.trilha { position: relative; height: 34px; border-bottom: 1px solid #181d2c; margin-left: 34px; }\n.trilha.audio { height: 20px; }\n.trilha .nome-trilha { position: absolute; left: -34px; width: 30px; top: 0; bottom: 0; display: flex; align-items: center; justify-content: center; font-size: 10px; color: var(--suave); background: var(--painel); }\n.clipe { position: absolute; top: 2px; bottom: 2px; border-radius: 4px; overflow: hidden; border: 1px solid rgba(127,184,255,.55); background-color: rgba(127,184,255,.18);\n  background-repeat: repeat-x; background-size: auto 100%; cursor: grab; }\n.trilha.audio .clipe { border-color: rgba(143,240,192,.5); background-color: rgba(143,240,192,.14); cursor: text; }\n.clipe span { position: absolute; left: 3px; bottom: 1px; right: 3px; font-size: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 1px 2px #000; }\n.clipe.sel { border-color: var(--rosa); box-shadow: inset 0 0 0 1px var(--rosa); }\n.clipe.no-quadro::after { content: \"●\"; position: absolute; right: 3px; top: 0; font-size: 9px; color: var(--rosa); }\n.clipe.off { opacity: .45; }\n#linha-cabeca { position: absolute; top: 0; bottom: 0; width: 0; border-left: 2px solid var(--rosa); pointer-events: none; z-index: 4; box-shadow: 0 0 8px var(--rosa); }\n#linha-alvo { position: absolute; top: 18px; bottom: 0; width: 0; border-left: 2px dashed var(--verde); pointer-events: none; z-index: 4; }\n#linha-alvo::after { content: attr(data-tc); position: absolute; top: 2px; left: 4px; font-size: 11px; color: var(--verde); white-space: nowrap; }\n#linha.soltar #linha-faixas { background: rgba(143,240,192,.05); }\n#linha-monitor { width: calc((var(--linha-h) - 46px) * 16 / 9); flex: none; display: flex; align-items: center; justify-content: center; background: #000; border-left: 1px solid var(--borda); position: relative; }\n#linha-monitor img { max-width: 100%; max-height: 100%; display: block; }\n#linha-monitor span { position: absolute; color: var(--suave); font-size: 11px; padding: 8px; text-align: center; }\n#linha.sem-monitor #linha-monitor { display: none; }\n#linha-off { position: absolute; inset: 36px 0 0 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; background: #0e111b; color: var(--suave); text-align: center; padding: 10px; }\n#linha-off p { margin: 0; max-width: 560px; }\n\n/* seletor de projeto do FilmCraft */\n#fc-projeto span { max-width: 180px; overflow: hidden; text-overflow: ellipsis; display: inline-block; vertical-align: bottom; }\n#fc-sequencia { background: var(--painel2); border: 1px solid var(--borda); border-radius: 8px; padding: 4px 6px; max-width: 200px; }\n#fc-projetos { position: absolute; left: 90px; bottom: calc(100% + 4px); width: min(520px, 90vw); max-height: 60vh; overflow-y: auto; background: var(--painel);\n  border: 1px solid var(--borda); border-radius: 10px; box-shadow: 0 -10px 30px rgba(0,0,0,.5); padding: 8px; z-index: 30; }\n#fc-projetos h5 { margin: 8px 6px 4px; color: var(--suave); font-size: 11px; text-transform: uppercase; letter-spacing: .5px; font-weight: 600; }\n#fc-projetos button.proj { display: block; width: 100%; text-align: left; background: transparent; border: 0; border-radius: 6px; padding: 6px 8px; cursor: pointer; }\n#fc-projetos button.proj:hover { background: var(--painel2); }\n#fc-projetos button.proj small { display: block; color: var(--suave); font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n#fc-projetos button.proj.atual { border-left: 2px solid var(--rosa); }\n#fc-projetos button.proj:disabled { opacity: .45; }\n#fc-projetos .caminho { display: flex; gap: 6px; padding: 6px; }\n#fc-projetos .caminho input { flex: 1; background: var(--painel2); border: 1px solid var(--borda); border-radius: 6px; padding: 5px 8px; }\n.acoes-off { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }\n\n/* guia */\n#guia { position: fixed; top: 48px; right: 0; bottom: 0; width: 280px; background: rgba(14, 17, 27, .96); border-left: 1px solid var(--borda); z-index: 17; display: flex; flex-direction: column; }\nbody.com-linha #guia { bottom: var(--linha-h); }\nbody.com-guia #palco { right: 280px; }\nbody.com-guia #avisos { right: 294px; }\n.guia-cab { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; border-bottom: 1px solid var(--borda); }\n.guia-corpo { overflow-y: auto; padding: 4px 12px 12px; font-size: 12px; }\n.guia-corpo h4 { margin: 14px 0 6px; color: var(--azul); font-size: 12px; text-transform: uppercase; letter-spacing: .6px; }\n.guia-corpo ol { margin: 0; padding-left: 18px; color: var(--texto); }\n.guia-corpo li { margin: 3px 0; }\n.guia-corpo dl { margin: 0; display: grid; grid-template-columns: auto 1fr; gap: 5px 10px; align-items: baseline; }\n.guia-corpo dt { white-space: nowrap; color: var(--texto); }\n.guia-corpo dd { margin: 0; color: var(--suave); }\nkbd { font: 11px/1 \"Segoe UI\", system-ui, sans-serif; background: var(--painel2); border: 1px solid var(--borda); border-bottom-width: 2px; border-radius: 4px; padding: 2px 5px; color: var(--texto); }\n#guia-alternar.primario { border-color: var(--rosa); }\n\n/* seleção em caixa */\n#caixa { position: fixed; border: 1px dashed var(--azul); background: rgba(127,184,255,.08); pointer-events: none; z-index: 19; }\n\n/* aviso de atualização */\n#atualizacao { position: fixed; top: 56px; left: 50%; transform: translateX(-50%); z-index: 45; display: flex; gap: 10px; align-items: center; background: var(--painel);\n  border: 1px solid var(--verde); border-radius: 10px; padding: 8px 10px 8px 14px; box-shadow: 0 0 18px rgba(143,240,192,.25); }\n\n.aviso.pergunta { border-color: var(--rosa); display: flex; flex-direction: column; gap: 8px; }\n.aviso.pergunta .acoes { display: flex; gap: 6px; justify-content: flex-end; }\n.estado button { background: var(--painel2); border: 1px solid var(--borda); border-radius: 6px; padding: 1px 7px; cursor: pointer; margin-left: 4px; }\n","icone.svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\"><defs><linearGradient id=\"g\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#7fb8ff\"/><stop offset=\".55\" stop-color=\"#ff8fd1\"/><stop offset=\"1\" stop-color=\"#8ff0c0\"/></linearGradient></defs><rect width=\"64\" height=\"64\" rx=\"14\" fill=\"#0d0f17\"/><circle cx=\"16\" cy=\"20\" r=\"6\" fill=\"#ff8fd1\"/><circle cx=\"16\" cy=\"44\" r=\"6\" fill=\"#7fb8ff\"/><rect x=\"38\" y=\"24\" width=\"18\" height=\"16\" rx=\"4\" fill=\"#8ff0c0\"/><path d=\"M22 20C32 20 30 32 38 32M22 44C32 44 30 32 38 32\" stroke=\"url(#g)\" stroke-width=\"3.5\" fill=\"none\" stroke-linecap=\"round\"/></svg>\n"};
function __quadroModulo() { return (function () { const module = { exports: {} }; (function (module, exports) {
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

  function lerJson(arq, padrao) {
    try { return JSON.parse(fs.readFileSync(arq, "utf8")); } catch { return padrao; }
  }

  function gravarJson(arq, obj) {
    fs.mkdirSync(path.dirname(arq), { recursive: true });
    const tmp = `${arq}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(obj, null, 1));
    fs.renameSync(tmp, arq);
  }

  function config() {
    const c = lerJson(ARQ_CONFIG, {});
    const artcraftKey = c.artcraftKey || lerConfig("ARTCRAFT_API_KEY");
    const falKey = c.falKey || lerConfig("FAL_KEY");
    const motor = c.motor || (artcraftKey ? "artcraft" : falKey ? "fal" : "manual");
    return { motor, artcraftKey, falKey, ativo: c.ativo || "" };
  }

  function salvarConfig(mudancas) {
    const c = lerJson(ARQ_CONFIG, {});
    for (const k of ["motor", "artcraftKey", "falKey", "ativo"]) if (mudancas[k] !== undefined) c[k] = mudancas[k];
    gravarJson(ARQ_CONFIG, c);
  }

  // -------------------------------------------------------------------------------------------
  // Projetos e documento do quadro
  // -------------------------------------------------------------------------------------------

  const limparNome = (s) => String(s || "").replace(/[<>:"/\\|?*\x00-\x1f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
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
      try { gravarJson(path.join(pastaProjeto(doc.nome), "quadro.json"), doc); } catch (e) { log(`quadro: falha ao salvar ${doc.nome}: ${e.message}`); }
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
    for (const n of v.nos) {
      const agora = vivos.get(n.id);
      if (agora) for (const k of ["versoes", "atual", "estado", "job", "progresso", "erro", "envios"]) n[k] = agora[k];
    }
    Object.assign(doc, v);
    salvar(doc);
    return true;
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
    const id = no.tipo === "gerar" ? no.atual : no.midia;
    return id ? doc.midias[id] || null : null;
  };

  // -------------------------------------------------------------------------------------------
  // Operações (as mesmas para o quadro no navegador e para o Claude)
  // -------------------------------------------------------------------------------------------

  const CAMPOS_NO = ["titulo", "texto", "prompt", "saida", "modelo", "proporcao", "duracao", "motor", "x", "y", "w", "cor"];

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
          for (const k of CAMPOS_NO) if (op[k] !== undefined) no[k] = op[k];
          if (no.saida && !["imagem", "video"].includes(no.saida)) no.saida = no.saida === "vídeo" ? "video" : "imagem";
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
            if (no) { no.x = Math.round(it.x); no.y = Math.round(it.y); }
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

  function montarPrompt(doc, no) {
    const imagens = [];
    const videos = [];
    const rotulos = [];
    const instrucoes = [];
    for (const { l, de } of entradas(doc, no)) {
      const m = midiaDoNo(doc, de);
      const nome = de.titulo || (m ? path.basename(m.arquivo, path.extname(m.arquivo)) : de.id);
      if (m && m.tipo === "imagem") { imagens.push(m.id); rotulos.push(`imagem ${imagens.length} = ${nome}`); }
      else if (m && m.tipo === "video") { videos.push(m.id); rotulos.push(`vídeo de referência ${videos.length} = ${nome}`); }
      if (de.tipo === "nota" && de.texto) instrucoes.push(de.texto.trim());
      if (l.texto && l.texto.trim()) instrucoes.push(l.texto.trim());
    }
    if (no.prompt && no.prompt.trim()) instrucoes.push(no.prompt.trim());
    const partes = [];
    if (rotulos.length > 1 || (rotulos.length === 1 && no.saida !== "video")) partes.push(`Referências: ${rotulos.join("; ")}.`);
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
      throw new Error(`${quem} recusou (HTTP ${r.status})${dica}: ${typeof msg === "string" ? msg : JSON.stringify(msg)}`);
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
          if (tokensImg.length) corpo.start_frame_image_media_token = tokensImg[0];
          if (tokensImg.length > 1) corpo.reference_image_media_tokens = tokensImg.slice(1);
          if (tokensVid.length) corpo.reference_video_media_tokens = tokensVid;
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
        const { prompt, imagens } = montarPrompt(doc, no);
        const video = no.saida === "video";
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
        const info = await motor.iniciar(doc, no, cfg);
        no.job = { ...no.job, ...info };
        salvar(doc);
        await acompanhar(doc, no);
      } catch (e) {
        no.estado = "erro"; no.erro = e.message; delete no.job;
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
        if (/recusou|falhou|inesperado|sem link/.test(e.message) || ++falhasRede > 5) throw e;
        continue;
      }
      if (r.fim) {
        const resp = await fetch(r.url);
        if (!resp.ok) throw new Error(`não consegui baixar o resultado (HTTP ${resp.status})`);
        const bytes = Buffer.from(await resp.arrayBuffer());
        const tipoHttp = resp.headers.get("content-type") || "";
        let ext = path.extname(new URL(r.url).pathname).toLowerCase();
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
        const p = acompanhar(doc, no).catch((e) => { no.estado = "erro"; no.erro = e.message; delete no.job; salvar(doc); }).finally(() => trabalhos.delete(k));
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

  async function atualizarArquivosFc(itens) {
    if (itens.every((i) => arquivosFc.has(i))) return;
    const lista = await comando("filmcraft", "media.status", {});
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
    let lista = video.flatMap((t, f) => t.clipes.map((c) => ({ ...c, faixa: f })));
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
    const novos = lista.filter((x) => !ja.has(x.clip));
    let x0 = Math.max(40, ...doc.nos.filter((n) => n.cena === c.id && n.fc).map((n) => n.x + 270));
    const criados = [];
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
      no.fc = { clip: cl.clip, item: cl.item, ini: cl.ini, dur: cl.dur, faixa: `V${cl.faixa + 1}` };
      criados.push(no.id);
      x0 += 270;
    }
    salvar(doc);
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
    const params = { item, track: `V${v + 1}`, seconds: t };
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
    const atual = todos.find((c) => c.clip === alvo.clip) || todos.find((c) => c.item === alvo.item && Math.abs(c.ini - alvo.ini) < 0.05);
    if (!atual) throw new Error("não achei mais esse clipe na sequência aberta (ele foi apagado ou a sequência é outra)");
    const c = doc.cenas.find((x) => x.id === no.cena);
    const item = await itemNoFilmcraft(c ? c.nome : "Quadro", caminhoMidia(doc, m));
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
      const doc = carregar(e.proj);
      const no = acharNo(doc, e.no);
      if (!no || no.estado !== "aguardando" || !no.aguardando) { esperas.delete(k); continue; }
      if (Date.now() - no.aguardando.desde > 3 * 3600000) { no.estado = "erro"; no.erro = "nenhum arquivo novo em 3 h. No ArtCraft, baixe o resultado (ou ligue Settings › Downloads › Auto Download) ou arraste o arquivo para o nó"; delete no.aguardando; esperas.delete(k); salvar(doc); continue; }
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
          if (!melhor || st.mtimeMs > melhor.t) melhor = { arq, t: st.mtimeMs, tam: st.size };
        }
      }
      if (!melhor) continue;
      if (tamanhos.get(melhor.arq) !== melhor.tam) { tamanhos.set(melhor.arq, melhor.tam); continue; }
      tamanhos.delete(melhor.arq);
      usados.add(melhor.arq);
      try {
        const c = doc.cenas.find((x) => x.id === no.cena);
        const nomeFinal = `${c ? c.nome : "Quadro"} - ${no.titulo || "resultado"} v${no.versoes.length + 1}${path.extname(melhor.arq).toLowerCase()}`;
        const m = guardarBytes(doc, nomeFinal, fs.readFileSync(melhor.arq), "gerado", { prompt: montarPrompt(doc, no).prompt, motor: "manual", arquivoOriginal: melhor.arq });
        adicionarVersao(no, m.id);
        delete no.aguardando;
        esperas.delete(k);
        salvar(doc);
        log(`quadro: ${path.basename(melhor.arq)} virou a versão nova de ${no.id}`);
      } catch (err) { no.estado = "erro"; no.erro = err.message; delete no.aguardando; esperas.delete(k); salvar(doc); }
    }
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
      return fs.createReadStream(arq, { start: ini, end: fim }).pipe(res);
    }
    res.writeHead(200, { "Content-Type": tipo, "Content-Length": st.size, "Accept-Ranges": "bytes", "Cache-Control": arq.startsWith(WEB) ? "no-cache" : "private, max-age=3600" });
    fs.createReadStream(arq).pipe(res);
  }

  function abrirNoSistema(alvo, selecionar) {
    let cmd, args;
    if (WINDOWS) {
      if (selecionar) { cmd = "explorer"; args = [`/select,${alvo}`]; } else { cmd = "rundll32"; args = ["url.dll,FileProtocolHandler", alvo]; }
    } else if (process.platform === "darwin") { cmd = "open"; args = selecionar ? ["-R", alvo] : [alvo]; }
    else { cmd = "xdg-open"; args = [selecionar ? path.dirname(alvo) : alvo]; }
    try { const p = spawn(cmd, args, { detached: true, stdio: "ignore", windowsHide: true }); p.on("error", () => {}); p.unref(); } catch {}
  }

  async function rotear(req, res) {
    const u = new URL(req.url, URL_QUADRO);
    const host = (req.headers.host || "").replace(/:\d+$/, "");
    if (!["localhost", "127.0.0.1", "[::1]"].includes(host)) { res.writeHead(403); return res.end(); }
    const rota = u.pathname;
    const proj = projetoAtivo(u.searchParams.get("p"));

    if (req.method === "GET") {
      const estatico = rota === "/" ? "index.html" : /^\/(index\.html|app\.js|style\.css|icone\.svg)$/.test(rota) ? rota.slice(1) : null;
      if (estatico && WEB_EMBUTIDO) {
        res.writeHead(200, { "Content-Type": MIME[path.extname(estatico)], "Cache-Control": "no-cache" });
        return res.end(WEB_EMBUTIDO[estatico]);
      }
      if (estatico) return servirArquivo(req, res, path.join(WEB, estatico));
      if (rota.startsWith("/midia/")) {
        const doc = carregar(proj);
        const m = doc.midias[decodeURIComponent(rota.slice(7))];
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
      if (rota === "/api/config") {
        const c = config();
        return json(res, 200, {
          motor: c.motor, artcraft: !!c.artcraftKey, fal: !!c.falKey, modelos: MODELOS, pasta: RAIZ, versao: VERSAO,
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
          docs.set(doc.nome, Object.assign(doc, JSON.parse(copia))); // desfaz o lote inteiro
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
        if (corpo.motor !== undefined) m.motor = ["artcraft", "fal", "manual"].includes(corpo.motor) ? corpo.motor : undefined;
        if (corpo.artcraftKey !== undefined) m.artcraftKey = String(corpo.artcraftKey).trim();
        if (corpo.falKey !== undefined) m.falKey = String(corpo.falKey).trim();
        if (corpo.github !== undefined && origemAtualizacao) origemAtualizacao.gravar(corpo.github);
        salvarConfig(m);
        return json(res, 200, { ok: true });
      }
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
    const j = await r.json();
    if (!r.ok) throw new Error(j.erro || `HTTP ${r.status}`);
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
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
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

})(module, module.exports); return module.exports; })(); }
const __atualizarModulo = (function () { const module = { exports: {} }; (function (module, exports) {
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
const URL_PADRAO = "";

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

function urlBase() {
  const v = (process.env.ARTCRAFT_ATUALIZACAO_URL || "").trim();
  const usuario = lerOrigem();
  const u = v && !v.startsWith("${") ? v : usuario ? `https://raw.githubusercontent.com/${usuario}/quadro-artcraft/main/` : URL_PADRAO;
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
  return v && maisNova(v.versao, versaoAtual) ? v.caminho : null;
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
  if (!maisNova(info.versao, versaoAtual)) return null;
  if (instalada && instalada.versao === info.versao) { ultima = { versao: info.versao, notas: info.notas || "" }; return ultima; }
  const nome = path.basename(info.arquivo || "quadro-bundle.js");
  const bytes = await pegar(nome);
  const hash = crypto.createHash("sha256").update(bytes).digest("hex");
  if (info.sha256 && hash !== info.sha256) throw new Error("o arquivo baixado não confere (sha256); tento de novo mais tarde");
  fs.mkdirSync(PASTA, { recursive: true });
  const tmp = path.join(PASTA, `${nome}.baixando`);
  fs.writeFileSync(tmp, bytes);
  fs.renameSync(tmp, path.join(PASTA, nome));
  fs.writeFileSync(path.join(PASTA, "versao.json"), JSON.stringify({ versao: info.versao, arquivo: nome, sha256: hash, notas: info.notas || "" }, null, 2));
  log(`atualização ${info.versao} baixada`);
  ultima = { versao: info.versao, notas: info.notas || "" };
  return ultima;
}

// Confere agora e a cada 6 horas, sem atrapalhar nada se a internet falhar.
function acompanhar(versaoAtual, log = () => {}) {
  const rodar = () => verificar(versaoAtual, log).catch((e) => log(`atualização: ${e.message}`));
  setTimeout(rodar, 5000).unref();
  setInterval(rodar, 6 * 3600 * 1000).unref();
}

module.exports = { PASTA, urlBase, lerOrigem, gravarOrigem, maisNova, pacoteMaisNovo, verificar, acompanhar, pronta: () => ultima };

})(module, module.exports); return module.exports; })();
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

const VERSAO = "2.3.1";
const WINDOWS = process.platform === "win32";
const atualizar = __atualizarModulo;

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
      proc.stdout.on("data", (d) => this.receber(d));
      proc.stderr.setEncoding("utf8");
      proc.stderr.on("data", (d) => { this.stderr = (this.stderr + d).slice(-4000); });
      proc.on("error", (e) => this.encerrou(`não foi possível iniciar: ${e.message}`));
      proc.on("exit", (code) => this.encerrou(`o servidor do app terminou (código ${code})`));
      const init = await this.pedir("initialize", {
        protocolVersion: "2025-06-18",
        capabilities: {},
        clientInfo: { name: "artcraft-claude", version: VERSAO },
      }, 30000);
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

const quadro = __quadroModulo()({
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
  log(`ArtCraft para Claude ${VERSAO} pronto`);
}

// `node index.js --quadro`: só o quadro, sem o Claude (útil para abrir o quadro direto).
if (ehEntrada) {
  let ehExe = false;
  try { ehExe = require("node:sea").isSea(); } catch {}
  if (ehExe || process.argv.includes("--quadro")) programaQuadro(ehExe);
  else principal();
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
  (reinicio ? esperar(1500) : Promise.resolve()).then(() => quadro.iniciar()).then((estado) => {
    if (estado === "outro") {
      process.stdout.write(`\n  O quadro já está rodando (aberto pelo Claude). Abrindo ${url}\n`);
      abrirNavegador();
      return setTimeout(() => process.exit(0), 4000);
    }
    process.stdout.write(`\n  Quadro de Cenas ArtCraft ${VERSAO}\n  Aberto em ${url}\n  Arquivos em ${quadro.RAIZ}\n\n  Deixe esta janela aberta enquanto usa o quadro. Para parar, feche a janela.\n\n`);
    if (!reinicio && (ehExe || process.argv.includes("--abrir"))) abrirNavegador();
  }, (e) => {
    process.stdout.write(`\n  Não consegui iniciar o quadro: ${e.message}\n`);
    if (ehExe) setTimeout(() => sair(1), 15000); else sair(1);
  });
  process.on("SIGINT", () => sair(0));
}

module.exports = { APPS, localizar, SessaoApp, quadro, tratar };

