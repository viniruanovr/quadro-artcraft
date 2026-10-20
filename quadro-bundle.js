"use strict";
globalThis.__QUADRO_WEB = {"index.html":"<!doctype html>\n<html lang=\"pt-BR\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n<title>Quadro de Cenas</title>\n<link rel=\"icon\" href=\"icone.svg\">\n<link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n<header id=\"topo\">\n  <div class=\"marca\"><img src=\"icone.svg\" alt=\"\"> Quadro</div>\n  <nav id=\"menus\" aria-label=\"Menus\"></nav>\n  <select id=\"projeto\" title=\"Projeto\"></select>\n  <nav id=\"cenas\"></nav>\n  <div class=\"espaco\"></div>\n  <button id=\"linha-alternar\" class=\"btn\" title=\"Mostra a timeline da sequência aberta no FilmCraft embaixo do quadro\">🎞 Timeline</button>\n  <button id=\"enviar-film\" class=\"btn\" title=\"Importa os resultados prontos desta cena no FilmCraft, num bin com o nome da cena\">Cena → FilmCraft</button>\n  <button id=\"enviar-effect\" class=\"btn\" title=\"Importa os resultados prontos desta cena no EffectCraft, numa pasta com o nome da cena\">Cena → EffectCraft</button>\n  <button id=\"motor\" class=\"btn\" title=\"Motor de geração e chaves\">⚙ <span></span></button>\n  <button id=\"guia-alternar\" class=\"btn\" title=\"Guia: atalhos e funções (tecla ?)\">?</button>\n</header>\n\n<aside id=\"biblioteca\">\n  <div class=\"bib-cab\">Biblioteca <button id=\"bib-fechar\" class=\"mini\" title=\"Recolher\">‹</button></div>\n  <div id=\"lista-midia\"></div>\n  <p class=\"dica\">Arraste para o quadro para reusar em outra cena.</p>\n</aside>\n<button id=\"bib-abrir\" class=\"mini\" title=\"Biblioteca\" hidden>›</button>\n\n<main id=\"palco\">\n  <div id=\"mundo\">\n    <svg id=\"fios\" width=\"1\" height=\"1\"><path id=\"fio-temp\" d=\"\"/></svg>\n    <div id=\"camada-nos\"></div>\n    <div id=\"camada-rotulos\"></div>\n  </div>\n  <div id=\"vazio\" hidden>\n    <h2>Monte a cena</h2>\n    <p>Arraste fotos (personagem, cenário) para cá, puxe um fio da bolinha da direita e solte no vazio para criar um nó <b>Gerar</b>. Escreva no fio o que gerar.</p>\n    <p class=\"dica\">Clique duas vezes no fundo para adicionar · roda do mouse = zoom · arraste o fundo para mover</p>\n  </div>\n</main>\n\n<div id=\"ferramentas\">\n  <button data-novo=\"imagem\" title=\"Enviar imagem ou vídeo do computador\">🖼 Mídia</button>\n  <button data-novo=\"nota\" title=\"Nota de texto (roteiro, direção)\">✎ Nota</button>\n  <button data-novo=\"gerar-imagem\" title=\"Nó que gera uma foto\">✦ Gerar foto</button>\n  <button data-novo=\"gerar-video\" title=\"Nó que gera um vídeo\">▶ Gerar vídeo</button>\n  <span class=\"sep\"></span>\n  <button id=\"centralizar\" title=\"Enquadrar a cena\">⤢</button>\n  <span id=\"zoom\">100%</span>\n</div>\n\n<section id=\"linha\" hidden>\n  <div class=\"linha-cab\">\n    <b>FilmCraft</b>\n    <button id=\"fc-projeto\" class=\"btn\" title=\"Escolher o projeto do FilmCraft\">📂 <span>Projeto</span> ▾</button>\n    <select id=\"fc-sequencia\" title=\"Sequência aberta na timeline\" hidden></select>\n    <span id=\"linha-nome\" class=\"suave\"></span><span id=\"linha-tc\"></span>\n    <span class=\"espaco\"></span>\n    <span class=\"dica\" id=\"linha-dica\">clique = mover o playhead · arraste um clipe para o quadro · arraste um nó para cá</span>\n    <button id=\"linha-importar\" class=\"btn\" title=\"Traz os clipes de vídeo da sequência para uma cena com o nome dela, um nó por clipe\">Sequência → cena</button>\n    <button id=\"linha-ver-monitor\" class=\"mini\" title=\"Mostrar/ocultar o monitor do programa\">▣</button>\n    <button id=\"linha-fechar\" class=\"mini\" title=\"Fechar a timeline\">×</button>\n  </div>\n  <div class=\"linha-corpo\">\n    <div id=\"linha-faixas\"><div id=\"linha-regua\"></div><div id=\"linha-trilhas\"></div><div id=\"linha-cabeca\"></div><div id=\"linha-alvo\" hidden></div></div>\n    <div id=\"linha-monitor\"><img alt=\"\"><span></span></div>\n  </div>\n  <div id=\"linha-off\" hidden><p></p><div class=\"acoes-off\"><button id=\"linha-abrir\" class=\"btn primario\">📂 Escolher projeto e abrir</button><button id=\"linha-controle\" class=\"btn\" hidden>Ligar sincronização permanente</button></div></div>\n  <div id=\"fc-projetos\" hidden></div>\n</section>\n\n<aside id=\"guia\" hidden>\n  <div class=\"guia-cab\"><b>Guia</b><button id=\"guia-fechar\" class=\"mini\" title=\"Fechar (tecla ?)\">×</button></div>\n  <div class=\"guia-corpo\">\n    <h4>Começar</h4>\n    <ol>\n      <li>Arraste fotos para o quadro (ou <kbd>Ctrl</kbd>+<kbd>V</kbd>).</li>\n      <li>Puxe um fio da bolinha da direita e solte no vazio: nasce um nó <b>Gerar</b>.</li>\n      <li>Escreva no fio o que gerar e clique em <b>✦ Gerar</b>.</li>\n      <li><b>TL</b> manda o resultado para o playhead do FilmCraft.</li>\n    </ol>\n    <h4>Quadro</h4>\n    <dl>\n      <dt><kbd>Ctrl</kbd>+<kbd>Z</kbd></dt><dd>desfazer</dd>\n      <dt><kbd>Ctrl</kbd>+<kbd>Y</kbd></dt><dd>refazer (ou <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>)</dd>\n      <dt><kbd>Ctrl</kbd>+<kbd>C</kbd> / <kbd>V</kbd></dt><dd>copiar e colar nós (vale entre cenas); colar imagem ou texto cria nó</dd>\n      <dt><kbd>Ctrl</kbd>+<kbd>D</kbd></dt><dd>duplicar o selecionado</dd>\n      <dt><kbd>Ctrl</kbd>+<kbd>A</kbd></dt><dd>selecionar tudo da cena</dd>\n      <dt><kbd>Shift</kbd>+arrastar</dt><dd>selecionar com caixa (no fundo) · somar à seleção (no nó)</dd>\n      <dt><kbd>Del</kbd></dt><dd>apagar o selecionado</dd>\n      <dt><kbd>I</kbd> ou <kbd>Ctrl</kbd>+<kbd>I</kbd></dt><dd>importar foto ou vídeo do PC</dd>\n      <dt><kbd>N</kbd></dt><dd>nova nota (o <kbd>Ctrl</kbd>+<kbd>N</kbd> o navegador não libera)</dd>\n      <dt><kbd>G</kbd> / <kbd>V</kbd></dt><dd>novo Gerar foto / Gerar vídeo</dd>\n      <dt><kbd>Ctrl</kbd>+<kbd>Enter</kbd></dt><dd>gerar os nós selecionados</dd>\n      <dt><kbd>F</kbd></dt><dd>enquadrar a cena</dd>\n      <dt>roda do mouse</dt><dd>zoom · arrastar o fundo move</dd>\n      <dt>duplo clique</dt><dd>no fundo: menu rápido · na foto: tela cheia</dd>\n    </dl>\n    <h4>Timeline do FilmCraft</h4>\n    <dl>\n      <dt><kbd>T</kbd></dt><dd>mostrar/ocultar a timeline</dd>\n      <dt>📂 Projeto</dt><dd>escolher e abrir o projeto e a sequência</dd>\n      <dt>clique</dt><dd>mover o playhead do FilmCraft</dd>\n      <dt><kbd>←</kbd> <kbd>→</kbd></dt><dd>1 quadro · com <kbd>Shift</kbd>, 1 segundo</dd>\n      <dt><kbd>Home</kbd> / <kbd>End</kbd></dt><dd>início / fim da sequência</dd>\n      <dt><kbd>P</kbd></dt><dd>colocar o nó selecionado no playhead</dd>\n      <dt>arrastar clipe ↑</dt><dd>traz o clipe para o quadro</dd>\n      <dt>arrastar nó ↓</dt><dd>coloca na timeline no ponto solto, sem cobrir a edição</dd>\n      <dt>Sequência → cena</dt><dd>traz a sequência inteira, um nó por clipe</dd>\n    </dl>\n    <p class=\"dica\">Tudo salva sozinho em Documentos\\ArtCraft Quadro.</p>\n  </div>\n</aside>\n\n<div id=\"atualizacao\" hidden><span></span><button class=\"btn primario\">Reiniciar e atualizar</button><button class=\"mini\" title=\"Depois\">×</button></div>\n\n<div id=\"menu-rapido\" hidden></div>\n<div id=\"avisos\"></div>\n<input type=\"file\" id=\"arquivo\" multiple accept=\"image/*,video/*\" hidden>\n\n<div id=\"visor\" hidden><div class=\"visor-conteudo\"></div></div>\n\n<dialog id=\"dlg-nuvem\">\n  <form method=\"dialog\">\n    <h3>Ligar o vídeo grátis</h3>\n    <p class=\"dica\">O vídeo é feito numa placa de vídeo grátis da sua conta do Kaggle. Só falta colar duas coisas aqui, uma vez só.</p>\n    <label>Seu usuário do Kaggle <input name=\"usuario\" autocomplete=\"off\" placeholder=\"o nome que aparece em kaggle.com/seu-nome\"></label>\n    <p class=\"dica\">No Kaggle: clique na sua foto (canto de cima à direita) › Your Profile. O usuário é o que vem depois de kaggle.com/ no endereço. Pode colar o endereço inteiro.</p>\n    <label>Token do Kaggle <input name=\"token\" type=\"password\" autocomplete=\"off\" placeholder=\"KGAT_…\"></label>\n    <p class=\"dica\">É o código que começa com KGAT_ (Kaggle › Settings › API).</p>\n    <p class=\"dica\" id=\"nuvem-erro\"></p>\n    <div class=\"acoes\"><button type=\"button\" id=\"nuvem-cancelar\" class=\"btn\">Agora não</button><button value=\"ok\" class=\"btn primario\">Salvar e gerar</button></div>\n  </form>\n</dialog>\n\n<dialog id=\"dlg-config\">\n  <form method=\"dialog\">\n    <h3>Motor de geração</h3>\n    <label>Gerar com\n      <select name=\"motor\">\n        <option value=\"kaggle\">Nuvem grátis: Kaggle (recomendado, liga sozinho)</option>\n        <option value=\"manual\">Manual (copio o prompt e gero por fora)</option>\n        <option value=\"comfy\">ComfyUI no meu PC ou num endereço meu</option>\n        <option value=\"artcraft\">ArtCraft (seus créditos da ArtCraft)</option>\n        <option value=\"fal\">fal.ai (pago por geração)</option>\n      </select>\n    </label>\n    <div class=\"cfg-sec\" data-para=\"kaggle\">\n      <label>Seu usuário do Kaggle <input name=\"kaggleUser\" autocomplete=\"off\" placeholder=\"ex.: viniciusruano\"></label>\n      <label>Token do Kaggle <input name=\"kaggleToken\" type=\"password\" autocomplete=\"off\" placeholder=\"KGAT_…\"></label>\n      <label>ou o arquivo kaggle.json <input type=\"file\" id=\"kaggle-json\" accept=\".json,application/json\"></label>\n      <p class=\"dica\" id=\"cfg-kaggle-estado\">…</p>\n      <p class=\"dica\">Uma vez só: entre em <b>kaggle.com</b>, verifique o telefone da conta (Settings › Phone verification), depois em <b>Settings › API</b> gere um token. Cole aqui o token (começa com KGAT_) e o seu usuário (aparece no endereço do seu perfil: kaggle.com/<b>usuário</b>). Se baixou um arquivo <code>kaggle.json</code>, pode escolher ele em vez disso. Pronto: ao clicar em Gerar, o quadro liga uma GPU grátis no seu Kaggle (a primeira geração do dia leva uns 10 minutos para ligar) e desliga sozinho após 25 minutos sem uso.</p>\n    </div>\n    <div class=\"cfg-sec\" data-para=\"artcraft\">\n      <label>Chave da API ArtCraft <input name=\"artcraftKey\" type=\"password\" autocomplete=\"off\" placeholder=\"artcraft_api_…\"></label>\n      <p class=\"dica\">Em app.getartcraft.com › Account › Settings › API Keys. Se a seção não aparecer, a ArtCraft precisa liberar a API na sua conta (Discord da ArtCraft).</p>\n    </div>\n    <div class=\"cfg-sec\" data-para=\"fal\">\n      <label>Chave da fal.ai <input name=\"falKey\" type=\"password\" autocomplete=\"off\" placeholder=\"…\"></label>\n      <p class=\"dica\">fal.ai/dashboard/keys. Cobra direto no cartão, por geração.</p>\n    </div>\n    <div class=\"cfg-sec\" data-para=\"comfy\">\n      <label>Endereço do ComfyUI <input name=\"comfyUrl\" autocomplete=\"off\" placeholder=\"http://127.0.0.1:8188\"></label>\n      <p class=\"dica\" id=\"cfg-comfy-estado\">Verificando o ComfyUI…</p>\n      <label>Receita de foto <input type=\"file\" id=\"receita-imagem\" accept=\".json,application/json\"></label>\n      <label>Receita de vídeo <input type=\"file\" id=\"receita-video\" accept=\".json,application/json\"></label>\n      <p class=\"dica\"><button type=\"button\" id=\"receita-pronta\" class=\"btn\">Usar a receita pronta de vídeo (Wan 2.2 5B, imagem → vídeo)</button><br>Sem receita escolhida, o vídeo já usa essa. Pede placa de 16 GB ou mais.</p>\n      <p class=\"dica\">No ComfyUI, abra um modelo que funcione na sua placa, teste uma vez e use <b>Workflow › Export (API)</b>. Escolha aqui o arquivo salvo.</p>\n    </div>\n    <div class=\"cfg-sec\" data-para=\"manual\">\n      <p class=\"dica\">No modo Manual, o botão Gerar de cada nó copia o prompt e abre a pasta com as referências numeradas. Gere no app da ArtCraft e arraste o resultado para o nó.</p>\n    </div>\n    <label>Atualizações automáticas: seu usuário do GitHub <input name=\"github\" autocomplete=\"off\" placeholder=\"viniruanovr\"></label>\n    <p class=\"dica\">O quadro baixa as versões novas do repositório público github.com/<b>usuário</b>/quadro-artcraft. <span id=\"cfg-versao\"></span></p>\n    <p class=\"dica\">Deixe a chave em branco para manter a atual. Os arquivos do quadro ficam em <code id=\"cfg-pasta\"></code>.</p>\n    <div class=\"acoes\"><button type=\"button\" id=\"cfg-cancelar\" class=\"btn\">Cancelar</button><button value=\"salvar\" class=\"btn primario\">Salvar</button></div>\n  </form>\n</dialog>\n\n<script src=\"app.js\"></script>\n</body>\n</html>\n","app.js":"// Quadro de Cenas: interface no navegador. Sem bibliotecas: tudo em DOM + SVG.\n\"use strict\";\n\nconst $ = (s, el = document) => el.querySelector(s);\nconst esc = (s) => String(s == null ? \"\" : s).replace(/[&<>\"']/g, (c) => ({ \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" }[c]));\nconst PORTA_Y = 20;\nconst LARGURA = { midia: 240, nota: 240, gerar: 300 };\n\nconst est = {\n  proj: new URLSearchParams(location.search).get(\"p\") || \"\",\n  doc: null,\n  cfg: null,\n  cena: null,\n  vista: { x: 60, y: 40, z: 1 },\n  sel: new Set(),\n  minis: new Set(),\n  editandoRotulo: null,\n};\n\n// ---------------------------------------------------------------------------------------------\n// Servidor\n// ---------------------------------------------------------------------------------------------\n\nconst qp = (extra = \"\") => `p=${encodeURIComponent(est.proj)}${extra}`;\n\nasync function pegar(rota) {\n  const r = await fetch(`${rota}${rota.includes(\"?\") ? \"&\" : \"?\"}${qp()}`);\n  const j = await r.json();\n  if (!r.ok) throw new Error(j.erro || r.statusText);\n  return j;\n}\n\nasync function postar(rota, corpo) {\n  const r = await fetch(`${rota}${rota.includes(\"?\") ? \"&\" : \"?\"}${qp()}`, {\n    method: \"POST\", headers: { \"Content-Type\": \"application/json\", \"X-Quadro\": \"1\" }, body: JSON.stringify(corpo || {}),\n  });\n  const j = await r.json().catch(() => ({}));\n  if (!r.ok) throw new Error(j.erro || r.statusText);\n  return j;\n}\n\nasync function ops(lista, silencioso) {\n  try {\n    const r = await postar(\"/api/ops\", { ops: lista });\n    await carregarDoc();\n    return r;\n  } catch (e) {\n    if (!silencioso) aviso(e.message, true);\n    await carregarDoc();\n    throw e;\n  }\n}\n\nasync function subir(arquivo, extra = \"\") {\n  const r = await fetch(`/api/upload?${qp(`&nome=${encodeURIComponent(arquivo.name || \"colado.png\")}${extra}`)}`, {\n    method: \"POST\", headers: { \"X-Quadro\": \"1\", \"Content-Type\": \"application/octet-stream\" }, body: arquivo,\n  });\n  const j = await r.json().catch(() => ({}));\n  if (!r.ok) throw new Error(j.erro || r.statusText);\n  return j;\n}\n\nfunction aviso(texto, erro = false, ms = 4500) {\n  const d = document.createElement(\"div\");\n  d.className = `aviso${erro ? \" erro\" : \"\"}`;\n  d.textContent = texto;\n  $(\"#avisos\").appendChild(d);\n  setTimeout(() => d.remove(), erro ? ms * 2 : ms);\n}\n\n// ---------------------------------------------------------------------------------------------\n// Carregar e desenhar\n// ---------------------------------------------------------------------------------------------\n\nlet carregando = null;\nasync function carregarDoc() {\n  if (carregando) return carregando;\n  carregando = (async () => {\n    try {\n      const d = await pegar(\"/api/quadro\");\n      // só pergunta quando chega uma versão nova (não quando ele navega entre versões)\n      const antes = est.doc && est.doc.nome === d.nome ? new Map(est.doc.nos.filter((n) => n.tipo === \"gerar\").map((n) => [n.id, n.versoes.length])) : null;\n      est.doc = d;\n      for (const id of [...est.sel]) if (!acharNo(id) && !d.ligacoes.some((l) => l.id === id)) est.sel.delete(id);\n      if (antes) for (const n of d.nos) if (n.tipo === \"gerar\" && n.atual && antes.has(n.id) && n.versoes.length > antes.get(n.id) && n.estado === \"pronto\") oferecerTroca(n);\n      est.proj = d.nome;\n      est.minis = new Set(d.miniaturas || []);\n      if (!est.cena || !d.cenas.some((c) => c.id === est.cena)) {\n        const salva = lerLocal(`cena:${d.nome}`);\n        est.cena = d.cenas.some((c) => c.id === salva) ? salva : d.cenas[0].id;\n        restaurarVista();\n      }\n      desenhar();\n      fazerMiniaturas();\n    } finally { carregando = null; }\n  })();\n  return carregando;\n}\n\nfunction lerLocal(k) { try { return localStorage.getItem(k); } catch { return null; } }\nfunction gravarLocal(k, v) { try { localStorage.setItem(k, v); } catch {} }\n\nconst nosDaCena = () => est.doc.nos.filter((n) => n.cena === est.cena);\nconst acharNo = (id) => est.doc.nos.find((n) => n.id === id);\nconst midiaDe = (no) => { const id = no.tipo === \"gerar\" ? no.atual : no.midia; return id ? est.doc.midias[id] : null; };\nconst urlMidia = (m) => `/midia/${m.id}?${qp()}`;\nconst urlMini = (m) => (est.minis.has(m.id) ? `/mini/${m.id}.jpg?${qp()}` : m.tipo === \"imagem\" ? urlMidia(m) : \"\");\nconst tipoFio = (no) => { if (no.tipo === \"nota\") return \"nota\"; const m = midiaDe(no); return (m && m.tipo === \"video\") || (no.tipo === \"gerar\" && no.saida === \"video\") ? \"video\" : \"\"; };\n\nfunction desenhar() {\n  desenharTopo();\n  desenharBiblioteca();\n  desenharNos();\n  desenharFios();\n  aplicarVista();\n  $(\"#vazio\").hidden = nosDaCena().length > 0;\n}\n\nfunction desenharTopo() {\n  const d = est.doc;\n  $(\"#cenas\").innerHTML = d.cenas.map((c) => `<button data-cena=\"${c.id}\" class=\"${c.id === est.cena ? \"ativa\" : \"\"}\" title=\"Clique duas vezes para renomear\">${esc(c.nome)}</button>`).join(\"\")\n    + `<button class=\"nova\" data-cena=\"+\" title=\"Nova cena\">＋ cena</button>`;\n  const sel = $(\"#projeto\");\n  const lista = est.projetos || [d.nome];\n  sel.innerHTML = [...new Set([...lista, d.nome])].map((p) => `<option ${p === d.nome ? \"selected\" : \"\"}>${esc(p)}</option>`).join(\"\") + `<option value=\"+\">＋ Novo projeto…</option>`;\n  if (est.cfg) {\n    const c = est.cfg;\n    const nomes = { artcraft: \"ArtCraft\", fal: \"fal.ai\", comfy: \"ComfyUI\", kaggle: \"Nuvem grátis\", manual: \"Manual\" };\n    const tem = c.motor === \"manual\" || c.motor === \"comfy\" || c[c.motor];\n    const s = $(\"#motor span\");\n    s.textContent = `${nomes[c.motor] || c.motor}${c.motor === \"manual\" ? \"\" : tem ? \" ✓\" : c.motor === \"kaggle\" ? \" · falta a conta\" : \" · sem chave\"}`;\n    s.className = tem ? \"ok\" : \"falta\";\n  }\n}\n\nfunction desenharBiblioteca() {\n  const ms = Object.values(est.doc.midias).reverse();\n  $(\"#lista-midia\").innerHTML = ms.map((m) => {\n    const src = urlMini(m);\n    const conteudo = src ? `<img src=\"${src}\" loading=\"lazy\" alt=\"\">` : `<video src=\"${urlMidia(m)}#t=0.1\" muted preload=\"metadata\"></video>`;\n    return `<div class=\"item\" draggable=\"true\" data-midia=\"${m.id}\" title=\"${esc(m.arquivo)}\">${conteudo}${m.tipo === \"video\" ? '<span class=\"v\">▶</span>' : \"\"}</div>`;\n  }).join(\"\") || `<p class=\"dica\" style=\"grid-column: span 2\">Nada ainda. Arraste fotos e vídeos para o quadro.</p>`;\n}\n\nfunction htmlPrevia(m, no) {\n  const soltar = `<div class=\"soltar\">Soltar como nova versão</div>`;\n  if (!m) {\n    const msg = no.tipo === \"gerar\"\n      ? (no.estado === \"gerando\" ? \"Gerando…\" : \"Ligue referências, escreva no fio e clique em Gerar.<br>Ou arraste aqui um resultado feito por fora.\")\n      : \"Sem arquivo\";\n    return `<div class=\"previa\"><div class=\"vazia\">${msg}</div>${soltar}</div>`;\n  }\n  if (no.tipo === \"midia\" && no.fc && no.trecho && no.fc.src !== undefined) {\n    // clipe da timeline: toca o vídeo de verdade (o trecho do clipe), não um print\n    const poster = ` poster=\"${urlMini(m) || urlMidia(m)}\"`;\n    return `<div class=\"previa\"><video src=\"/api/filmcraft/arquivo?item=${no.fc.item}#t=${no.fc.src},${(no.fc.src + no.fc.dur).toFixed(2)}\" controls muted loop playsinline preload=\"metadata\"${poster}></video>${soltar}</div>`;\n  }\n  if (m.tipo === \"video\") {\n    const poster = est.minis.has(m.id) ? ` poster=\"/mini/${m.id}.jpg?${qp()}\"` : \"\";\n    return `<div class=\"previa\" data-ver=\"${m.id}\"><video src=\"${urlMidia(m)}\" muted loop playsinline preload=\"metadata\"${poster}></video>${soltar}</div>`;\n  }\n  return `<div class=\"previa\" data-ver=\"${m.id}\"><img src=\"${urlMini(m) || urlMidia(m)}\" alt=\"\" draggable=\"false\">${soltar}</div>`;\n}\n\nfunction opcoesModelo(no) {\n  const c = est.cfg;\n  if (c && c.motor === \"comfy\") return `<option value=\"\">receita do ComfyUI</option>`;\n  if (c && c.motor === \"kaggle\") return `<option value=\"\">Wan 2.2 (nuvem grátis)</option>`;\n  const motor = c && c.motor !== \"manual\" ? c.motor : \"artcraft\";\n  const lista = (c && c.modelos[motor] && c.modelos[motor][no.saida === \"video\" ? \"video\" : \"imagem\"]) || [];\n  const todos = no.modelo && !lista.includes(no.modelo) ? [no.modelo, ...lista] : lista;\n  return `<option value=\"\">padrão (${esc(lista[0] || \"—\")})</option>` + todos.map((m) => `<option value=\"${esc(m)}\" ${m === no.modelo ? \"selected\" : \"\"}>${esc(m.replace(/^fal-ai\\//, \"\"))}</option>`).join(\"\");\n}\n\nfunction htmlNo(no) {\n  const m = midiaDe(no);\n  const tipoMidia = m ? m.tipo : \"\";\n  const enviado = (no.envios || []).filter((e) => m && e.midia === m.id).map((e) => (e.app === \"filmcraft\" ? \"FilmCraft\" : \"EffectCraft\")).join(\" + \");\n  if (no.tipo === \"nota\") {\n    return `<div class=\"porta saida\" title=\"Puxe até um nó Gerar\"></div>\n      <div class=\"cab\"><span class=\"tag nota\">NOTA</span><input class=\"titulo\" data-campo=\"titulo\" value=\"${esc(no.titulo)}\" placeholder=\"Título\"><button class=\"x\" data-acao=\"remover\" title=\"Apagar\">×</button></div>\n      <textarea data-campo=\"texto\" placeholder=\"Roteiro, direção, falas…\">${esc(no.texto)}</textarea>`;\n  }\n  if (no.tipo === \"midia\") {\n    return `<div class=\"porta saida\" title=\"Puxe até um nó Gerar (ou solte no vazio para criar um)\"></div>\n      <div class=\"cab\"><span class=\"tag ${tipoMidia === \"video\" || no.trecho ? \"video\" : \"\"}\">${tipoMidia === \"video\" || no.trecho ? \"VÍDEO BASE\" : \"IMAGEM\"}</span><input class=\"titulo\" data-campo=\"titulo\" value=\"${esc(no.titulo)}\" placeholder=\"ex.: Ana (personagem)\"><button class=\"x\" data-acao=\"remover\" title=\"Apagar\">×</button></div>\n      ${htmlPrevia(m, no)}\n      <div class=\"rodape\"><span class=\"nome\" title=\"${esc(m ? m.arquivo : \"\")}\">${esc(m ? m.arquivo : \"\")}</span>\n        ${no.fc ? `<button data-acao=\"trecho\" class=\"${no.trecho ? \"on\" : \"\"}\" title=\"${no.trecho ? \"Vai como VÍDEO base na geração (clique para mandar só o quadro parado)\" : \"Vai só como imagem. Clique para mandar o vídeo do clipe como base\"}\">🎬</button>` : \"\"}<button data-acao=\"timeline\" title=\"Colocar na timeline do FilmCraft, no playhead\">TL</button><button data-acao=\"enviar-filmcraft\" title=\"Importar no FilmCraft\">FC</button><button data-acao=\"enviar-effectcraft\" title=\"Importar no EffectCraft\">EC</button></div>`;\n  }\n  const video = no.saida === \"video\";\n  const n = no.versoes.length;\n  const iv = no.versoes.indexOf(no.atual);\n  const prop = ((est.cfg && est.cfg.proporcoes) || [\"16:9\"]).map((p) => `<option ${p === no.proporcao ? \"selected\" : \"\"}>${p}</option>`).join(\"\");\n  let estado = \"\";\n  if (no.estado === \"gerando\") estado = `<div class=\"barra ${no.progresso ? \"\" : \"indef\"}\"><i style=\"width:${no.progresso || 0}%\"></i></div><div class=\"estado\">${esc(no.fase || \"Gerando\")}${no.progresso ? ` · ${no.progresso}%` : \"…\"}</div>`;\n  else if (no.estado === \"erro\") estado = `<div class=\"estado erro\">${esc(no.erro)}</div>`;\n  else if (no.estado === \"aguardando\") estado = `<div class=\"barra indef\"><i></i></div><div class=\"estado\">Esperando o ${no.saida === \"video\" ? \"vídeo\" : \"arquivo\"} baixado do ArtCraft… <button data-acao=\"cancelar-espera\">Cancelar</button></div>`;\n  return `<div class=\"porta entrada\" title=\"Entradas: referências e notas\"></div><div class=\"porta saida\" title=\"Puxe para usar este resultado em outro nó (ex.: animar a foto)\"></div>\n    <div class=\"cab\"><span class=\"tag gerar\">${video ? \"GERAR VÍDEO\" : \"GERAR FOTO\"}</span><input class=\"titulo\" data-campo=\"titulo\" value=\"${esc(no.titulo)}\" placeholder=\"Nome do plano\"><button class=\"x\" data-acao=\"remover\" title=\"Apagar\">×</button></div>\n    ${htmlPrevia(m, no)}\n    <div class=\"controles\">\n      <div class=\"linha\">\n        <div class=\"seg\"><button data-acao=\"saida-imagem\" class=\"${video ? \"\" : \"on\"}\">Foto</button><button data-acao=\"saida-video\" class=\"${video ? \"on\" : \"\"}\">Vídeo</button></div>\n        <select class=\"modelo\" data-campo=\"modelo\" title=\"Modelo\">${opcoesModelo(no)}</select>\n      </div>\n      <div class=\"linha\">\n        <select data-campo=\"proporcao\" title=\"Proporção\">${prop}</select>\n        ${video ? `<input class=\"duracao\" data-campo=\"duracao\" type=\"number\" min=\"1\" max=\"20\" value=\"${no.duracao || 5}\" title=\"Duração (s)\"><span class=\"estado\">s</span>` : \"\"}\n        <span style=\"flex:1\"></span>\n        ${n ? `<span class=\"versoes\"><button data-acao=\"versao-ant\" ${iv <= 0 ? \"disabled\" : \"\"}>‹</button> v${iv + 1}/${n} <button data-acao=\"versao-prox\" ${iv >= n - 1 ? \"disabled\" : \"\"}>›</button></span>` : \"\"}\n      </div>\n      <textarea data-campo=\"prompt\" placeholder=\"Instrução extra (opcional). O principal vai escrito nos fios.\">${esc(no.prompt)}</textarea>\n      ${estado}\n      <div class=\"linha\">\n        <button class=\"gerar-btn\" data-acao=\"gerar\" ${no.estado === \"gerando\" ? \"disabled\" : \"\"}>${n ? \"↻ Gerar de novo\" : \"✦ Gerar\"}</button>\n        <button data-acao=\"copiar\" title=\"Copiar o prompt montado (para gerar por fora)\">Prompt</button>\n        ${origemTimeline(no).length ? `<button data-acao=\"substituir\" title=\"Trocar o clipe de origem na timeline por este resultado\" ${m ? \"\" : \"disabled\"}>⇄</button>` : \"\"}\n        <button data-acao=\"timeline\" title=\"Colocar na timeline do FilmCraft, no playhead\" ${m ? \"\" : \"disabled\"}>TL</button>\n        <button data-acao=\"enviar-filmcraft\" title=\"Importar no FilmCraft\" ${m ? \"\" : \"disabled\"}>FC</button>\n        <button data-acao=\"enviar-effectcraft\" title=\"Importar no EffectCraft\" ${m ? \"\" : \"disabled\"}>EC</button>\n      </div>\n      ${enviado ? `<div class=\"enviado\">✓ enviado para ${enviado}</div>` : \"\"}\n    </div>`;\n}\n\nfunction desenharNos() {\n  const camada = $(\"#camada-nos\");\n  const vivos = new Set();\n  const foco = document.activeElement;\n  for (const no of nosDaCena()) {\n    vivos.add(no.id);\n    let el = camada.querySelector(`.no[data-id=\"${no.id}\"]`);\n    const m = midiaDe(no);\n    const assinatura = JSON.stringify([no, m && m.arquivo, m && est.minis.has(m.id), est.cfg && est.cfg.motor]);\n    if (!el) {\n      el = document.createElement(\"div\");\n      el.dataset.id = no.id;\n      camada.appendChild(el);\n    }\n    el.className = `no ${no.tipo}${m && m.tipo === \"video\" ? \" video\" : \"\"}${no.tipo === \"gerar\" ? ` saida-${no.saida}` : \"\"}${no.estado === \"gerando\" ? \" gerando\" : \"\"}${est.sel.has(no.id) ? \" sel\" : \"\"}`;\n    el.style.left = `${no.x || 0}px`;\n    el.style.top = `${no.y || 0}px`;\n    if (el.dataset.sig !== assinatura && !(foco && el.contains(foco) && foco.matches(\"input, textarea\"))) {\n      el.dataset.sig = assinatura;\n      el.innerHTML = htmlNo(no);\n    }\n  }\n  for (const el of [...camada.children]) if (!vivos.has(el.dataset.id)) el.remove();\n}\n\nfunction pontaSaida(no) { return { x: (no.x || 0) + LARGURA[no.tipo] + 1, y: (no.y || 0) + PORTA_Y }; }\nfunction pontaEntrada(no) { return { x: (no.x || 0) - 1, y: (no.y || 0) + PORTA_Y }; }\nfunction curva(a, b) {\n  const dx = Math.max(60, Math.abs(b.x - a.x) * 0.5);\n  return `M${a.x},${a.y} C${a.x + dx},${a.y} ${b.x - dx},${b.y} ${b.x},${b.y}`;\n}\nfunction meio(a, b) {\n  const dx = Math.max(60, Math.abs(b.x - a.x) * 0.5);\n  const t = 0.5, u = 1 - t;\n  const p1 = { x: a.x + dx, y: a.y }, p2 = { x: b.x - dx, y: b.y };\n  return { x: u * u * u * a.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * b.x, y: u * u * u * a.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * b.y };\n}\n\nfunction desenharFios() {\n  const svg = $(\"#fios\");\n  const temp = $(\"#fio-temp\");\n  svg.querySelectorAll(\"path:not(#fio-temp)\").forEach((p) => p.remove());\n  const rotulos = $(\"#camada-rotulos\");\n  const vivos = new Set();\n  const ids = new Set(nosDaCena().map((n) => n.id));\n  // Número de cada referência, na mesma ordem em que o prompt as cita (\"imagem 2\", \"vídeo 1\").\n  const numeros = {};\n  const contagem = {};\n  for (const l of est.doc.ligacoes) {\n    const de = acharNo(l.de);\n    if (!de) continue;\n    const m = midiaDe(de);\n    const tipo = de.trecho && de.fc ? \"video\" : m && m.tipo;\n    if (tipo !== \"imagem\" && tipo !== \"video\") continue;\n    const c = contagem[l.para] || (contagem[l.para] = { imagem: 0, video: 0 });\n    numeros[l.id] = `${tipo === \"video\" ? \"🎬 vídeo\" : \"🖼 imagem\"} ${++c[tipo]}`;\n  }\n  for (const l of est.doc.ligacoes) {\n    if (!ids.has(l.de) || !ids.has(l.para)) continue;\n    const de = acharNo(l.de), para = acharNo(l.para);\n    const a = pontaSaida(de), b = pontaEntrada(para);\n    const tipo = tipoFio(de);\n    const d = curva(a, b);\n    const p = document.createElementNS(\"http://www.w3.org/2000/svg\", \"path\");\n    p.setAttribute(\"d\", d);\n    p.setAttribute(\"class\", `fio ${tipo}${est.sel.has(l.id) ? \" sel\" : \"\"}`);\n    const alvo = document.createElementNS(\"http://www.w3.org/2000/svg\", \"path\");\n    alvo.setAttribute(\"d\", d);\n    alvo.setAttribute(\"class\", \"alvo\");\n    alvo.dataset.fio = l.id;\n    svg.insertBefore(p, temp);\n    svg.insertBefore(alvo, temp);\n    vivos.add(l.id);\n    let r = rotulos.querySelector(`[data-fio=\"${l.id}\"]`);\n    if (!r) { r = document.createElement(\"div\"); r.dataset.fio = l.id; rotulos.appendChild(r); }\n    const pm = meio(a, b);\n    r.style.left = `${pm.x}px`;\n    r.style.top = `${pm.y}px`;\n    if (est.editandoRotulo === l.id) continue;\n    r.className = `rotulo ${tipo}${l.texto ? \"\" : \" vazio\"}${est.sel.has(l.id) ? \" sel\" : \"\"}`;\n    const num = numeros[l.id];\n    r.textContent = (num ? `${num} · ` : \"\") + (l.texto || (num ? \"＋ instrução\" : \"＋ o que gerar?\"));\n    r.title = \"Clique para escrever o que gerar com esta ligação\";\n  }\n  for (const r of [...rotulos.children]) if (!vivos.has(r.dataset.fio)) r.remove();\n}\n\n// ---------------------------------------------------------------------------------------------\n// Vista (pan e zoom)\n// ---------------------------------------------------------------------------------------------\n\nfunction aplicarVista() {\n  const v = est.vista;\n  $(\"#mundo\").style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.z})`;\n  const palco = $(\"#palco\");\n  const g = 22 * v.z;\n  palco.style.backgroundSize = `${g}px ${g}px`;\n  palco.style.backgroundPosition = `${v.x}px ${v.y}px`;\n  $(\"#zoom\").textContent = `${Math.round(v.z * 100)}%`;\n}\n\nlet timerVista;\nfunction guardarVista() {\n  clearTimeout(timerVista);\n  timerVista = setTimeout(() => gravarLocal(`vista:${est.proj}:${est.cena}`, JSON.stringify(est.vista)), 300);\n}\n\nfunction restaurarVista() {\n  try {\n    const v = JSON.parse(lerLocal(`vista:${est.proj}:${est.cena}`) || \"null\");\n    if (v && isFinite(v.z)) { est.vista = v; return; }\n  } catch {}\n  est.vista = { x: 60, y: 40, z: 1 };\n  requestAnimationFrame(enquadrar);\n}\n\nfunction enquadrar() {\n  const nos = nosDaCena();\n  const palco = $(\"#palco\").getBoundingClientRect();\n  if (!nos.length) { est.vista = { x: 60, y: 40, z: 1 }; aplicarVista(); return; }\n  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;\n  for (const n of nos) {\n    const el = $(`.no[data-id=\"${n.id}\"]`);\n    const h = el ? el.offsetHeight : 260;\n    x0 = Math.min(x0, n.x); y0 = Math.min(y0, n.y); x1 = Math.max(x1, n.x + LARGURA[n.tipo]); y1 = Math.max(y1, n.y + h);\n  }\n  const z = Math.min(1.2, Math.max(0.25, Math.min((palco.width - 120) / (x1 - x0), (palco.height - 140) / (y1 - y0))));\n  est.vista = { z, x: (palco.width - (x1 - x0) * z) / 2 - x0 * z, y: (palco.height - 60 - (y1 - y0) * z) / 2 - y0 * z };\n  aplicarVista();\n  guardarVista();\n}\n\nfunction paraMundo(cx, cy) {\n  const r = $(\"#palco\").getBoundingClientRect();\n  return { x: (cx - r.left - est.vista.x) / est.vista.z, y: (cy - r.top - est.vista.y) / est.vista.z };\n}\n\nfunction centroVista() {\n  const r = $(\"#palco\").getBoundingClientRect();\n  return paraMundo(r.left + r.width / 2, r.top + r.height / 2);\n}\n\n$(\"#palco\").addEventListener(\"wheel\", (e) => {\n  const ta = e.target.closest && e.target.closest(\"textarea\");\n  if (ta && !e.ctrlKey && ta.scrollHeight > ta.clientHeight) return; // rolar o texto do nó, sem zoom\n  e.preventDefault();\n  if (e.deltaMode === 1) { e = { ctrlKey: e.ctrlKey, deltaX: e.deltaX * 16, deltaY: e.deltaY * 16, deltaMode: 0, clientX: e.clientX, clientY: e.clientY }; }\n  const r = $(\"#palco\").getBoundingClientRect();\n  const v = est.vista;\n  if (!e.ctrlKey && Math.abs(e.deltaX) > Math.abs(e.deltaY) * 0.8 && e.deltaMode === 0) {\n    v.x -= e.deltaX; v.y -= e.deltaY; // trackpad: rolar de lado move\n  } else {\n    const z = Math.min(2.5, Math.max(0.2, v.z * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015))));\n    const px = e.clientX - r.left, py = e.clientY - r.top;\n    v.x = px - ((px - v.x) * z) / v.z;\n    v.y = py - ((py - v.y) * z) / v.z;\n    v.z = z;\n  }\n  aplicarVista();\n  guardarVista();\n}, { passive: false });\n\n// ---------------------------------------------------------------------------------------------\n// Ponteiro: mover fundo, arrastar nós, puxar fios\n// ---------------------------------------------------------------------------------------------\n\nlet gesto = null;\n\n$(\"#palco\").addEventListener(\"pointerdown\", (e) => {\n  fecharMenu();\n  if (e.button !== 0 && e.button !== 1) return;\n  const porta = e.target.closest(\".porta.saida\");\n  const no = e.target.closest(\".no\");\n  const fio = e.target.closest(\"[data-fio]\");\n  if (porta && no) {\n    e.preventDefault();\n    gesto = { tipo: \"fio\", de: no.dataset.id };\n    $(\"#palco\").setPointerCapture(e.pointerId);\n    return;\n  }\n  if (fio && !e.target.closest(\"textarea\")) {\n    selecionar(fio.dataset.fio, e.shiftKey);\n    if (fio.classList.contains(\"rotulo\")) editarRotulo(fio.dataset.fio);\n    return;\n  }\n  if (no) {\n    if (e.target.closest(\"input, textarea, select, button, video[controls]\")) return;\n    const id = no.dataset.id;\n    if (!est.sel.has(id) || e.shiftKey) selecionar(id, e.shiftKey);\n    const inicio = paraMundo(e.clientX, e.clientY);\n    gesto = { tipo: \"nos\", inicio, movido: false, nos: [...est.sel].map(acharNo).filter(Boolean).map((n) => ({ n, x: n.x, y: n.y })) };\n    $(\"#palco\").setPointerCapture(e.pointerId);\n    return;\n  }\n  if (e.shiftKey && e.button === 0) {\n    gesto = { tipo: \"caixa\", cx: e.clientX, cy: e.clientY, antes: new Set(est.sel) };\n    const c = document.createElement(\"div\");\n    c.id = \"caixa\";\n    document.body.appendChild(c);\n    $(\"#palco\").setPointerCapture(e.pointerId);\n    return;\n  }\n  gesto = { tipo: \"fundo\", cx: e.clientX, cy: e.clientY, vx: est.vista.x, vy: est.vista.y, movido: false };\n  $(\"#palco\").setPointerCapture(e.pointerId);\n});\n\n$(\"#palco\").addEventListener(\"pointermove\", (e) => {\n  if (!gesto) return;\n  if (gesto.tipo === \"fundo\") {\n    const dx = e.clientX - gesto.cx, dy = e.clientY - gesto.cy;\n    if (Math.abs(dx) + Math.abs(dy) > 3) { gesto.movido = true; $(\"#palco\").classList.add(\"movendo\"); }\n    est.vista.x = gesto.vx + dx; est.vista.y = gesto.vy + dy;\n    aplicarVista();\n  } else if (gesto.tipo === \"caixa\") {\n    const x1 = Math.min(gesto.cx, e.clientX), y1 = Math.min(gesto.cy, e.clientY), x2 = Math.max(gesto.cx, e.clientX), y2 = Math.max(gesto.cy, e.clientY);\n    Object.assign($(\"#caixa\").style, { left: `${x1}px`, top: `${y1}px`, width: `${x2 - x1}px`, height: `${y2 - y1}px` });\n    const sel = new Set(gesto.antes);\n    document.querySelectorAll(\"#camada-nos .no\").forEach((el) => {\n      const r = el.getBoundingClientRect();\n      if (r.left < x2 && r.right > x1 && r.top < y2 && r.bottom > y1) sel.add(el.dataset.id);\n    });\n    est.sel = sel;\n    desenharNos();\n  } else if (gesto.tipo === \"nos\") {\n    const p = paraMundo(e.clientX, e.clientY);\n    const dx = p.x - gesto.inicio.x, dy = p.y - gesto.inicio.y;\n    if (Math.abs(dx) + Math.abs(dy) > 2) gesto.movido = true;\n    for (const it of gesto.nos) {\n      it.n.x = Math.round(it.x + dx); it.n.y = Math.round(it.y + dy);\n      const el = $(`.no[data-id=\"${it.n.id}\"]`);\n      if (el) { el.style.left = `${it.n.x}px`; el.style.top = `${it.n.y}px`; }\n    }\n    desenharFios();\n    if (linha.aberta) mostrarAlvo(sobreLinha(e.clientX, e.clientY) ? e.clientX : null);\n  } else if (gesto.tipo === \"fio\") {\n    const de = acharNo(gesto.de);\n    const p = paraMundo(e.clientX, e.clientY);\n    $(\"#fio-temp\").setAttribute(\"d\", curva(pontaSaida(de), p));\n    document.querySelectorAll(\".no.alvo-fio\").forEach((x) => x.classList.remove(\"alvo-fio\"));\n    const alvo = document.elementFromPoint(e.clientX, e.clientY);\n    const noAlvo = alvo && alvo.closest(\".no.gerar\");\n    if (noAlvo && noAlvo.dataset.id !== gesto.de) noAlvo.classList.add(\"alvo-fio\");\n  }\n});\n\n$(\"#palco\").addEventListener(\"pointerup\", async (e) => {\n  const g = gesto;\n  gesto = null;\n  $(\"#palco\").classList.remove(\"movendo\");\n  if (!g) return;\n  if (g.tipo === \"caixa\") { const c = $(\"#caixa\"); if (c) c.remove(); desenharFios(); return; }\n  if (g.tipo === \"fundo\") {\n    guardarVista();\n    if (!g.movido) { est.sel.clear(); desenharNos(); desenharFios(); }\n  } else if (g.tipo === \"nos\" && g.movido && sobreLinha(e.clientX, e.clientY)) {\n    // soltou o nó em cima da timeline: volta para o lugar e vai para o FilmCraft naquele tempo\n    mostrarAlvo(null);\n    for (const it of g.nos) { it.n.x = it.x; it.n.y = it.y; }\n    desenharNos(); desenharFios();\n    const t = tempoNaLinha(e.clientX);\n    for (const it of g.nos) if (midiaDe(it.n)) await colocarNaLinha({ no: it.n.id }, t);\n  } else if (g.tipo === \"nos\" && g.movido) {\n    ops([{ op: \"mover\", nos: g.nos.map((it) => ({ id: it.n.id, x: it.n.x, y: it.n.y })) }], true).catch(() => {});\n  } else if (g.tipo === \"fio\") {\n    $(\"#fio-temp\").setAttribute(\"d\", \"\");\n    document.querySelectorAll(\".no.alvo-fio\").forEach((x) => x.classList.remove(\"alvo-fio\"));\n    const alvo = document.elementFromPoint(e.clientX, e.clientY);\n    const noEl = alvo && alvo.closest(\".no\");\n    const de = acharNo(g.de);\n    try {\n      if (noEl) {\n        if (noEl.dataset.id === g.de) return;\n        const para = acharNo(noEl.dataset.id);\n        if (para.tipo !== \"gerar\") return aviso(\"O fio precisa terminar num nó Gerar. Solte no vazio para criar um.\", true);\n        const r = await ops([{ op: \"ligar\", de: g.de, para: para.id, ref: \"f\" }]);\n        editarRotulo(r.refs.f);\n      } else if (alvo && alvo.closest(\"#palco\")) {\n        const p = paraMundo(e.clientX, e.clientY);\n        const saida = tipoFio(de) === \"video\" && de.tipo !== \"gerar\" ? \"video\" : de.tipo === \"gerar\" ? \"video\" : \"imagem\";\n        const r = await ops([\n          { op: \"no\", ref: \"g\", cena: est.cena, tipo: \"gerar\", saida, x: Math.round(p.x), y: Math.round(p.y - PORTA_Y) },\n          { op: \"ligar\", de: g.de, para: \"g\", ref: \"f\" },\n        ]);\n        selecionar(r.refs.g);\n        editarRotulo(r.refs.f);\n      }\n    } catch {}\n  }\n});\n\n$(\"#palco\").addEventListener(\"dblclick\", (e) => {\n  if (e.target.closest(\".no, .rotulo\")) return;\n  abrirMenu(e.clientX, e.clientY);\n});\n\nfunction selecionar(id, somar) {\n  if (!somar) est.sel.clear();\n  if (somar && est.sel.has(id)) est.sel.delete(id); else est.sel.add(id);\n  desenharNos();\n  desenharFios();\n}\n\n// ---------------------------------------------------------------------------------------------\n// Texto no fio\n// ---------------------------------------------------------------------------------------------\n\nfunction editarRotulo(id) {\n  const r = $(`#camada-rotulos [data-fio=\"${id}\"]`) || (desenharFios(), $(`#camada-rotulos [data-fio=\"${id}\"]`));\n  if (!r || r.querySelector(\"textarea\")) return;\n  const l = est.doc.ligacoes.find((x) => x.id === id);\n  est.editandoRotulo = id;\n  r.classList.remove(\"vazio\");\n  r.innerHTML = `<textarea placeholder=\"ex.: usar essa pessoa neste cenário, plano médio, luz de fim de tarde\">${esc(l ? l.texto : \"\")}</textarea>`;\n  const ta = r.querySelector(\"textarea\");\n  ta.focus();\n  ta.setSelectionRange(ta.value.length, ta.value.length);\n  let feito = false;\n  const fechar = async (salvar) => {\n    if (feito) return;\n    feito = true;\n    est.editandoRotulo = null;\n    if (salvar && l && ta.value !== l.texto) await ops([{ op: \"texto_ligacao\", id, texto: ta.value }]).catch(() => {});\n    else desenharFios();\n  };\n  ta.addEventListener(\"keydown\", (e) => {\n    e.stopPropagation();\n    if (e.key === \"Enter\" && !e.shiftKey) { e.preventDefault(); fechar(true); }\n    if (e.key === \"Escape\") fechar(false);\n  });\n  ta.addEventListener(\"blur\", () => fechar(true));\n}\n\n// ---------------------------------------------------------------------------------------------\n// Campos e botões dentro dos nós\n// ---------------------------------------------------------------------------------------------\n\nconst timersCampo = new Map();\nfunction campoMudou(el, imediato) {\n  const no = el.closest(\".no\");\n  if (!no) return;\n  const id = no.dataset.id, campo = el.dataset.campo;\n  let valor = el.value;\n  if (campo === \"duracao\") valor = Number(valor) || 5;\n  const k = `${id}:${campo}`;\n  clearTimeout(timersCampo.get(k));\n  const enviar = () => {\n    timersCampo.delete(k);\n    const n = acharNo(id);\n    if (n) n[campo] = valor;\n    postar(\"/api/ops\", { ops: [{ op: \"no\", id, [campo]: valor }] }).catch((e) => aviso(e.message, true));\n  };\n  enviarPendentes.set(k, enviar);\n  if (imediato) enviar(); else timersCampo.set(k, setTimeout(enviar, 500));\n}\nconst enviarPendentes = new Map();\nfunction enviarTudoPendente() {\n  for (const [k, t] of timersCampo) { clearTimeout(t); const f = enviarPendentes.get(k); if (f) f(); }\n}\n\n$(\"#camada-nos\").addEventListener(\"input\", (e) => { if (e.target.dataset.campo && e.target.tagName !== \"SELECT\") campoMudou(e.target, false); });\n$(\"#camada-nos\").addEventListener(\"change\", (e) => { if (e.target.dataset.campo) campoMudou(e.target, true); });\n$(\"#camada-nos\").addEventListener(\"keydown\", (e) => { if (e.target.matches(\"input.titulo\") && e.key === \"Enter\") e.target.blur(); });\n\n$(\"#camada-nos\").addEventListener(\"click\", async (e) => {\n  const ver = e.target.closest(\"[data-ver]\");\n  const btn = e.target.closest(\"[data-acao]\");\n  const el = e.target.closest(\".no\");\n  if (!el) return;\n  const no = acharNo(el.dataset.id);\n  if (ver && !btn) return abrirVisor(est.doc.midias[ver.dataset.ver]);\n  if (!btn || !no) return;\n  const a = btn.dataset.acao;\n  try {\n    if (a === \"remover\") {\n      if (no.tipo === \"gerar\" && no.versoes.length && !confirm(\"Apagar este nó? Os arquivos gerados continuam na biblioteca.\")) return;\n      await ops([{ op: \"remover\", id: no.id }]);\n    } else if (a === \"saida-imagem\" || a === \"saida-video\") {\n      await ops([{ op: \"no\", id: no.id, saida: a === \"saida-video\" ? \"video\" : \"imagem\", modelo: \"\" }]);\n    } else if (a === \"versao-ant\" || a === \"versao-prox\") {\n      const i = no.versoes.indexOf(no.atual) + (a === \"versao-prox\" ? 1 : -1);\n      if (no.versoes[i]) await ops([{ op: \"versao\", no: no.id, midia: no.versoes[i] }]);\n    } else if (a === \"gerar\") {\n      enviarTudoPendente();\n      document.activeElement && document.activeElement.blur();\n      await new Promise((r) => setTimeout(r, 50));\n      const campos = {};\n      el.querySelectorAll(\"[data-campo]\").forEach((c) => { campos[c.dataset.campo] = c.dataset.campo === \"duracao\" ? Number(c.value) || 5 : c.value; });\n      await postar(\"/api/ops\", { ops: [{ op: \"no\", id: no.id, ...campos }] });\n      if (est.cfg && est.cfg.motor === \"manual\") {\n        if (!(await copiarPrompt(no, true))) return;\n        await postar(\"/api/esperar\", { no: no.id });\n        return carregarDoc();\n      }\n      if (!(await nuvemPronta(no))) return;\n      btn.disabled = true;\n      const r = await postar(\"/api/gerar\", { no: no.id });\n      const x = r.resultados && r.resultados[0];\n      if (x && x.erro) aviso(x.erro, true);\n      await carregarDoc();\n    } else if (a === \"trecho\") {\n      await ops([{ op: \"no\", id: no.id, trecho: !no.trecho }]);\n    } else if (a === \"copiar\") {\n      await copiarPrompt(no, false);\n    } else if (a === \"substituir\") {\n      await substituirClipe(no);\n    } else if (a === \"cancelar-espera\") {\n      await postar(\"/api/esperar\", { no: no.id, cancelar: true });\n      await carregarDoc();\n    } else if (a === \"timeline\") {\n      await colocarNaLinha({ no: no.id });\n    } else if (a === \"enviar-filmcraft\" || a === \"enviar-effectcraft\") {\n      const app = a.replace(\"enviar-\", \"\");\n      aviso(`Enviando para o ${app === \"filmcraft\" ? \"FilmCraft\" : \"EffectCraft\"}…`);\n      const r = await postar(\"/api/enviar\", { nos: [no.id], app });\n      aviso(r.texto);\n      await carregarDoc();\n    }\n  } catch (err) { aviso(err.message, true); btn.disabled = false; }\n});\n\nasync function copiarPrompt(no, manual) {\n  // modo manual: monta a pasta primeiro (o vídeo base só vira \"vídeo 1\" depois de exportado)\n  let pacote = null;\n  if (manual) {\n    aviso(\"Preparando o vídeo e as imagens numerados…\", false, 6000);\n    try { pacote = await postar(\"/api/pacote\", { no: no.id }); } catch (e) { aviso(`Não consegui montar a pasta: ${e.message}`, true, 12000); }\n  }\n  const r = pacote ? { prompt: pacote.prompt, arquivos: pacote.arquivos } : await pegar(`/api/prompt?no=${no.id}`);\n  if (!r.prompt.trim()) { aviso(\"Escreva no fio (ou na instrução extra) o que gerar.\", true); return false; }\n  try { await navigator.clipboard.writeText(r.prompt); } catch { prompt(\"Copie o prompt:\", r.prompt); }\n  const refs = r.arquivos.length ? `\\nReferências (na ordem): ${r.arquivos.map((a) => a.split(/[\\\\/]/).pop()).join(\", \")}` : \"\";\n  aviso(pacote\n    ? `Prompt copiado e pasta aberta (${pacote.arquivos.join(\", \")}). No ArtCraft: cole o prompt, arraste esses arquivos, gere e baixe o resultado. Eu puxo o arquivo novo sozinho.`\n    : `${manual ? \"Prompt copiado. No ArtCraft: cole, anexe as referências, gere e baixe o resultado. Eu puxo o arquivo novo sozinho.\" : \"Prompt copiado.\"}${refs}`, false, 14000);\n  return true;\n}\n\n// Clipes da timeline de onde um nó veio (seguindo os fios para trás).\nfunction origemTimeline(no) {\n  const vistos = new Set(), achados = [];\n  const fila = [no.id];\n  while (fila.length) {\n    const id = fila.shift();\n    if (vistos.has(id)) continue;\n    vistos.add(id);\n    const n = acharNo(id);\n    if (n && n.fc && n.id !== no.id) achados.push({ ...n.fc, nome: n.titulo });\n    for (const l of est.doc.ligacoes) if (l.para === id) fila.push(l.de);\n  }\n  return achados;\n}\n\n// Resultado novo num nó que veio da timeline: pergunta se troca o clipe original.\nfunction oferecerTroca(no) {\n  const o = origemTimeline(no)[0];\n  if (!o) return;\n  const d = document.createElement(\"div\");\n  d.className = \"aviso pergunta\";\n  d.innerHTML = `<div>Versão ${no.versoes.indexOf(no.atual) + 1} de <b>${esc(no.titulo || \"Gerar\")}</b> pronta. Substituir o clipe <b>${esc(o.nome || \"\")}</b> na timeline do FilmCraft?</div><div class=\"acoes\"><button class=\"btn primario\" data-sim>Substituir</button><button class=\"btn\" data-nao>Agora não</button></div>`;\n  $(\"#avisos\").appendChild(d);\n  d.querySelector(\"[data-nao]\").onclick = () => d.remove();\n  d.querySelector(\"[data-sim]\").onclick = async () => { d.remove(); await substituirClipe(no); };\n}\nasync function substituirClipe(no) {\n  aviso(\"Trocando o clipe na timeline…\");\n  try {\n    const r = await postar(\"/api/filmcraft/substituir\", { no: no.id });\n    aviso(r.texto, false, 9000);\n    await carregarDoc();\n    if (linha.aberta) { linha.assinatura = \"\"; buscarLinha(); }\n  } catch (err) { aviso(err.message, true); }\n}\n\n// ---------------------------------------------------------------------------------------------\n// Arquivos: arrastar, colar, escolher\n// ---------------------------------------------------------------------------------------------\n\nlet posNovo = null;\n\nasync function criarMidias(arquivos, ponto) {\n  const p = ponto || centroVista();\n  const lista = [...arquivos].filter((f) => /^(image|video)\\//.test(f.type) || /\\.(png|jpe?g|webp|gif|bmp|mp4|mov|webm|mkv|m4v)$/i.test(f.name));\n  if (!lista.length) return aviso(\"Só imagens e vídeos.\", true);\n  const acoes = [];\n  for (let i = 0; i < lista.length; i++) {\n    try {\n      aviso(`Enviando ${lista[i].name || \"imagem\"}…`, false, 1500);\n      const r = await subir(lista[i]);\n      const nome = (lista[i].name || \"\").replace(/\\.[^.]+$/, \"\");\n      acoes.push({ op: \"no\", cena: est.cena, tipo: \"midia\", midia: r.midia, titulo: nome === \"image\" ? \"\" : nome, x: Math.round(p.x - 120 + i * 270), y: Math.round(p.y - 120) });\n    } catch (e) { aviso(e.message, true); }\n  }\n  if (acoes.length) await ops(acoes);\n}\n\nconst palco = $(\"#palco\");\npalco.addEventListener(\"dragover\", (e) => {\n  e.preventDefault();\n  document.querySelectorAll(\".no.arrastando-arquivo\").forEach((x) => x.classList.remove(\"arrastando-arquivo\"));\n  const no = e.target.closest && e.target.closest(\".no.gerar\");\n  if (no && e.dataTransfer.types.includes(\"Files\")) no.classList.add(\"arrastando-arquivo\");\n});\npalco.addEventListener(\"dragleave\", (e) => { if (e.target === palco) document.querySelectorAll(\".no.arrastando-arquivo\").forEach((x) => x.classList.remove(\"arrastando-arquivo\")); });\npalco.addEventListener(\"drop\", async (e) => {\n  e.preventDefault();\n  document.querySelectorAll(\".no.arrastando-arquivo\").forEach((x) => x.classList.remove(\"arrastando-arquivo\"));\n  const p = paraMundo(e.clientX, e.clientY);\n  const midia = e.dataTransfer.getData(\"application/x-midia\");\n  const clipeFc = e.dataTransfer.getData(\"application/x-clipe-fc\");\n  if (clipeFc) return trazerClipe(Number(clipeFc), { x: p.x, y: p.y });\n  const noGerar = e.target.closest && e.target.closest(\".no.gerar\");\n  try {\n    if (midia) {\n      if (noGerar) return ops([{ op: \"no\", id: noGerar.dataset.id, midia }]);\n      const m = est.doc.midias[midia];\n      return ops([{ op: \"no\", cena: est.cena, tipo: \"midia\", midia, titulo: m ? m.arquivo.replace(/\\.[^.]+$/, \"\") : \"\", x: Math.round(p.x), y: Math.round(p.y) }]);\n    }\n    if (!e.dataTransfer.files.length) return;\n    if (noGerar) {\n      await subir(e.dataTransfer.files[0], `&no=${noGerar.dataset.id}`);\n      aviso(\"Nova versão adicionada.\");\n      return carregarDoc();\n    }\n    await criarMidias(e.dataTransfer.files, p);\n  } catch (err) { aviso(err.message, true); }\n});\n\n$(\"#lista-midia\").addEventListener(\"dragstart\", (e) => {\n  const it = e.target.closest(\"[data-midia]\");\n  if (it) e.dataTransfer.setData(\"application/x-midia\", it.dataset.midia);\n});\n$(\"#lista-midia\").addEventListener(\"dblclick\", (e) => {\n  const it = e.target.closest(\"[data-midia]\");\n  if (it) abrirVisor(est.doc.midias[it.dataset.midia]);\n});\n\ndocument.addEventListener(\"paste\", (e) => {\n  if (e.target.closest && e.target.closest(\"input, textarea, select, dialog\")) return;\n  const arquivos = [...(e.clipboardData ? e.clipboardData.files : [])];\n  if (arquivos.length) { e.preventDefault(); criarMidias(arquivos); return; }\n  const texto = e.clipboardData ? e.clipboardData.getData(\"text/plain\") : \"\";\n  // os nós copiados aqui mesmo: o texto no sistema é só uma marca\n  if (areaNos && (texto.startsWith(MARCA_NOS) || !texto)) { e.preventDefault(); colarNos(); return; }\n  if (texto.trim()) {\n    e.preventDefault();\n    const p = centroVista();\n    const caminho = texto.trim().replace(/^\"|\"$/g, \"\");\n    if (/^([a-zA-Z]:\\\\|\\/).+\\.(png|jpe?g|webp|gif|bmp|mp4|mov|webm|mkv|m4v)$/i.test(caminho)) {\n      ops([{ op: \"no\", cena: est.cena, tipo: \"midia\", arquivo: caminho, x: Math.round(p.x - 120), y: Math.round(p.y - 60) }]).catch(() => {});\n    } else {\n      ops([{ op: \"no\", cena: est.cena, tipo: \"nota\", texto: texto.slice(0, 5000), x: Math.round(p.x - 120), y: Math.round(p.y - 60) }]).catch(() => {});\n    }\n  }\n});\n\n$(\"#arquivo\").addEventListener(\"change\", async (e) => {\n  await criarMidias(e.target.files, posNovo);\n  posNovo = null;\n  e.target.value = \"\";\n});\n\n// ---------------------------------------------------------------------------------------------\n// Criar nós (barra e menu de duplo clique)\n// ---------------------------------------------------------------------------------------------\n\nasync function novo(tipo, ponto) {\n  const p = ponto || centroVista();\n  const base = { op: \"no\", ref: \"n\", cena: est.cena, x: Math.round(p.x - 120), y: Math.round(p.y - 60) };\n  if (tipo === \"imagem\") { posNovo = ponto || null; return $(\"#arquivo\").click(); }\n  const op = tipo === \"nota\" ? { ...base, tipo: \"nota\" } : { ...base, tipo: \"gerar\", saida: tipo === \"gerar-video\" ? \"video\" : \"imagem\" };\n  const r = await ops([op]);\n  selecionar(r.refs.n);\n  const el = $(`.no[data-id=\"${r.refs.n}\"] ${tipo === \"nota\" ? \"textarea\" : \".titulo\"}`);\n  if (el) el.focus();\n}\n\n$(\"#ferramentas\").addEventListener(\"click\", (e) => {\n  const b = e.target.closest(\"[data-novo]\");\n  if (b) novo(b.dataset.novo).catch(() => {});\n});\n$(\"#centralizar\").addEventListener(\"click\", enquadrar);\n\nfunction abrirMenu(cx, cy) {\n  const menu = $(\"#menu-rapido\");\n  const p = paraMundo(cx, cy);\n  menu.innerHTML = `<button data-n=\"imagem\">🖼 Mídia do computador</button><button data-n=\"nota\">✎ Nota</button><button data-n=\"gerar-imagem\">✦ Gerar foto</button><button data-n=\"gerar-video\">▶ Gerar vídeo</button>`;\n  menu.style.left = `${cx}px`;\n  menu.style.top = `${cy}px`;\n  menu.hidden = false;\n  menu.onclick = (e) => {\n    const b = e.target.closest(\"[data-n]\");\n    if (!b) return;\n    fecharMenu();\n    novo(b.dataset.n, { x: p.x + 120, y: p.y + 60 }).catch(() => {});\n  };\n}\nfunction fecharMenu() { $(\"#menu-rapido\").hidden = true; }\ndocument.addEventListener(\"pointerdown\", (e) => { if (!e.target.closest(\"#menu-rapido\")) fecharMenu(); }, true);\n\n// ---------------------------------------------------------------------------------------------\n// Teclado\n// ---------------------------------------------------------------------------------------------\n\ndocument.addEventListener(\"keydown\", async (e) => {\n  if (e.target.closest && e.target.closest(\"input, textarea, select, dialog\")) return;\n  if (!$(\"#visor\").hidden && e.key !== \"Escape\") return; // visor aberto: os atalhos não valem atrás dele\n  if (e.repeat && ![\"ArrowLeft\", \"ArrowRight\"].includes(e.key)) return; // segurar a tecla não cria dezenas de nós\n  const ctrl = e.ctrlKey || e.metaKey;\n  const k = e.key.toLowerCase();\n  if (e.key === \"Escape\") { fecharVisor(); fecharMenu(); fecharProjetosFc(); est.sel.clear(); desenharNos(); desenharFios(); return; }\n  if ((e.key === \"Delete\" || e.key === \"Backspace\") && est.sel.size) {\n    e.preventDefault();\n    const ids = [...est.sel];\n    const temResultado = ids.some((id) => { const n = acharNo(id); return n && n.tipo === \"gerar\" && n.versoes.length; });\n    if (temResultado && !confirm(`Apagar ${ids.length} item(ns)? Os arquivos gerados continuam na biblioteca.`)) return;\n    est.sel.clear();\n    await ops(ids.map((id) => ({ op: \"remover\", id }))).catch(() => {});\n    return;\n  }\n  if (ctrl) {\n    if (k === \"z\" && !e.shiftKey) { e.preventDefault(); return voltar(false); }\n    if (k === \"y\" || (k === \"z\" && e.shiftKey)) { e.preventDefault(); return voltar(true); }\n    if (k === \"c\" && est.sel.size) { e.preventDefault(); return copiarNos(); }\n    if (k === \"d\" && est.sel.size) { e.preventDefault(); copiarNos(true); return colarNos(); }\n    if (k === \"a\") { e.preventDefault(); est.sel = new Set(est.doc.nos.filter((n) => n.cena === est.cena).map((n) => n.id)); desenharNos(); desenharFios(); return; }\n    if (k === \"i\") { e.preventDefault(); return novo(\"imagem\").catch(() => {}); }\n    if (e.key === \"Enter\") { e.preventDefault(); return gerarSelecionados(); }\n    return;\n  }\n  if (e.altKey) return;\n  if (linha.aberta && linha.dados && linha.dados.sequencia && [\"ArrowLeft\", \"ArrowRight\", \"Home\", \"End\"].includes(e.key)) {\n    e.preventDefault();\n    const s = linha.dados.sequencia;\n    const passo = e.shiftKey ? 1 : 1 / (s.fps || 24);\n    const t = e.key === \"Home\" ? 0 : e.key === \"End\" ? s.duracao : s.playhead + (e.key === \"ArrowLeft\" ? -passo : passo);\n    return irPara(Math.max(0, Math.min(s.duracao, t)));\n  }\n  if (e.key === \"?\") { e.preventDefault(); return alternarGuia(); }\n  if (k === \"f\") enquadrar();\n  if (k === \"n\") novo(\"nota\").catch(() => {});\n  if (k === \"g\") novo(\"gerar-imagem\").catch(() => {});\n  if (k === \"v\") novo(\"gerar-video\").catch(() => {});\n  if (k === \"i\") novo(\"imagem\").catch(() => {});\n  if (k === \"t\") alternarLinha(!linha.aberta);\n  if (k === \"p\") {\n    const nos = [...est.sel].map(acharNo).filter((n) => n && midiaDe(n));\n    if (!nos.length) return aviso(\"Selecione um nó com foto ou vídeo pronto.\", true);\n    for (const n of nos) await colocarNaLinha({ no: n.id });\n  }\n});\n\n// Antes de gerar vídeo: se não há onde gerar (sem conta do Kaggle, ou ComfyUI desligado), pede só\n// o usuário e o token do Kaggle numa janelinha e já liga a nuvem grátis.\nasync function nuvemPronta(no) {\n  const c = est.cfg || {};\n  if (no.saida !== \"video\") return true;\n  if (c.motor === \"kaggle\" && c.kaggle) return true;\n  if (![\"kaggle\", \"comfy\"].includes(c.motor)) return true;\n  if (c.motor === \"comfy\") { try { if ((await pegar(\"/api/comfy\")).ligado) return true; } catch {} }\n  const d = $(\"#dlg-nuvem\"), f = d.querySelector(\"form\");\n  f.usuario.value = c.kaggle || \"\"; f.token.value = \"\"; $(\"#nuvem-erro\").textContent = \"\";\n  for (;;) {\n    d.returnValue = \"\";\n    d.showModal();\n    await new Promise((ok) => d.addEventListener(\"close\", ok, { once: true }));\n    if (d.returnValue !== \"ok\") return false;\n    const usuario = f.usuario.value.trim().replace(/^@/, \"\").replace(/^.*kaggle\\.com\\//i, \"\").replace(/[/?#].*$/, \"\");\n    const token = f.token.value.trim();\n    if (!usuario || !token) { $(\"#nuvem-erro\").textContent = \"Preencha os dois campos.\"; continue; }\n    try {\n      await postar(\"/api/config\", { motor: \"kaggle\", kaggle: { username: usuario, key: token } });\n      est.cfg = await pegar(\"/api/config\");\n      desenhar();\n      aviso(\"Nuvem grátis ligada. Gerando…\");\n      return true;\n    } catch (err) { $(\"#nuvem-erro\").textContent = err.message; }\n  }\n}\n$(\"#nuvem-cancelar\").addEventListener(\"click\", () => $(\"#dlg-nuvem\").close(\"\"));\n\nasync function voltar(refazer) {\n  try {\n    const r = await postar(refazer ? \"/api/refazer\" : \"/api/desfazer\");\n    if (!r.ok) aviso(refazer ? \"Nada para refazer.\" : \"Nada para desfazer.\");\n    await carregarDoc();\n    if (!est.doc.cenas.some((c) => c.id === est.cena)) trocarCena(est.doc.cenas[0].id);\n  } catch (err) { aviso(err.message, true); }\n}\n\nasync function gerarSelecionados() {\n  const ids = [...est.sel].filter((id) => { const n = acharNo(id); return n && n.tipo === \"gerar\" && n.estado !== \"gerando\"; });\n  if (!ids.length) return aviso(\"Selecione um ou mais nós Gerar.\", true);\n  if (est.cfg && est.cfg.motor === \"manual\") return aviso(\"No modo Manual, use o botão Gerar de cada nó (ele copia o prompt).\", true);\n  try {\n    const r = await postar(\"/api/gerar\", { nos: ids });\n    for (const x of r.resultados || []) if (x.erro) aviso(`${x.no}: ${x.erro}`, true);\n    await carregarDoc();\n  } catch (err) { aviso(err.message, true); }\n}\n\n// Copiar / colar nós (com os fios entre eles). Vale entre cenas e entre projetos abertos no mesmo navegador.\nlet areaNos = null;\nconst MARCA_NOS = \"quadro-artcraft-nos:\";\nfunction copiarNos(semSistema) {\n  const ids = new Set([...est.sel].filter((id) => acharNo(id)));\n  const nos = est.doc.nos.filter((n) => ids.has(n.id)).map((n) => JSON.parse(JSON.stringify(n)));\n  const ligs = est.doc.ligacoes.filter((l) => ids.has(l.de) && ids.has(l.para)).map((l) => ({ ...l }));\n  areaNos = { proj: est.proj, nos, ligs, vezes: 0 };\n  if (!semSistema) {\n    try { navigator.clipboard.writeText(MARCA_NOS + nos.length).catch(() => {}); } catch {}\n    aviso(`${nos.length} nó(s) copiado(s).`);\n  }\n}\nasync function colarNos() {\n  if (!areaNos || !areaNos.nos.length) return;\n  areaNos.vezes++;\n  const d = 40 * areaNos.vezes;\n  const mesmoProj = areaNos.proj === est.proj;\n  const lista = [];\n  for (const n of areaNos.nos) {\n    const op = { op: \"no\", ref: `r_${n.id}`, cena: est.cena, tipo: n.tipo, titulo: n.titulo, x: n.x + d, y: n.y + d };\n    for (const c of [\"texto\", \"prompt\", \"saida\", \"modelo\", \"proporcao\", \"duracao\", \"w\", \"cor\"]) if (n[c] !== undefined && n[c] !== null) op[c] = n[c];\n    const m = n.tipo === \"gerar\" ? n.atual : n.midia;\n    if (m && mesmoProj && est.doc.midias[m]) op.midia = m;\n    lista.push(op);\n  }\n  for (const l of areaNos.ligs) lista.push({ op: \"ligar\", de: `r_${l.de}`, para: `r_${l.para}`, texto: l.texto || \"\" });\n  try {\n    const r = await ops(lista);\n    est.sel = new Set(areaNos.nos.map((n) => r.refs[`r_${n.id}`]).filter(Boolean));\n    desenharNos(); desenharFios();\n  } catch {}\n}\n\n// ---------------------------------------------------------------------------------------------\n// Cenas, projetos, envio da cena, configuração\n// ---------------------------------------------------------------------------------------------\n\n$(\"#cenas\").addEventListener(\"click\", async (e) => {\n  const b = e.target.closest(\"[data-cena]\");\n  if (!b) return;\n  if (b.dataset.cena === \"+\") {\n    const n = est.doc.cenas.length + 1;\n    const nome = prompt(\"Nome da cena:\", `Cena ${n}`);\n    if (!nome) return;\n    const r = await ops([{ op: \"cena\", nome, ref: \"c\" }]);\n    trocarCena(r.refs.c);\n    return;\n  }\n  trocarCena(b.dataset.cena);\n});\n$(\"#cenas\").addEventListener(\"dblclick\", async (e) => {\n  const b = e.target.closest(\"[data-cena]\");\n  if (!b || b.dataset.cena === \"+\") return;\n  const c = est.doc.cenas.find((x) => x.id === b.dataset.cena);\n  const nome = prompt(\"Renomear cena (deixe vazio para apagar a cena):\", c.nome);\n  if (nome === null) return;\n  if (nome.trim() === \"\") {\n    if (confirm(`Apagar \"${c.nome}\" e todos os nós dela? Os arquivos continuam na biblioteca.`)) await ops([{ op: \"remover_cena\", id: c.id }]);\n    return;\n  }\n  await ops([{ op: \"cena\", id: c.id, nome }]);\n});\n\nfunction trocarCena(id) {\n  est.cena = id;\n  est.sel.clear();\n  gravarLocal(`cena:${est.proj}`, id);\n  $(\"#camada-nos\").innerHTML = \"\";\n  $(\"#camada-rotulos\").innerHTML = \"\";\n  restaurarVista();\n  desenhar();\n}\n\n$(\"#projeto\").addEventListener(\"change\", async (e) => {\n  let nome = e.target.value;\n  if (nome === \"+\") {\n    nome = prompt(\"Nome do novo projeto (ex.: Clipe Badauê):\");\n    if (!nome) { desenharTopo(); return; }\n  }\n  const r = await postar(\"/api/projetos\", { nome });\n  location.search = `?p=${encodeURIComponent(r.ativo)}`;\n});\n\nasync function enviarCena(app) {\n  const nome = app === \"filmcraft\" ? \"FilmCraft\" : \"EffectCraft\";\n  const cena = est.doc.cenas.find((c) => c.id === est.cena);\n  aviso(`Enviando \"${cena.nome}\" para o ${nome}…`);\n  try {\n    const r = await postar(\"/api/enviar\", { cena: est.cena, app });\n    aviso(r.texto);\n    await carregarDoc();\n  } catch (e) { aviso(e.message, true); }\n}\n$(\"#enviar-film\").addEventListener(\"click\", () => enviarCena(\"filmcraft\"));\n$(\"#enviar-effect\").addEventListener(\"click\", () => enviarCena(\"effectcraft\"));\n\n$(\"#motor\").addEventListener(\"click\", () => {\n  const d = $(\"#dlg-config\");\n  const f = d.querySelector(\"form\");\n  f.motor.value = est.cfg.motor;\n  f.artcraftKey.value = \"\";\n  f.falKey.value = \"\";\n  f.comfyUrl.value = est.cfg.comfyUrl || \"\";\n  f.kaggleUser.value = est.cfg.kaggle || \"\";\n  f.kaggleToken.value = \"\";\n  f.kaggleToken.placeholder = est.cfg.kaggle ? \"•••••• (configurado)\" : \"KGAT_…\";\n  mostrarSecoes();\n  verificarComfy();\n  verificarKaggle();\n  f.artcraftKey.placeholder = est.cfg.artcraft ? \"•••••• (configurada)\" : \"artcraft_api_…\";\n  f.falKey.placeholder = est.cfg.fal ? \"•••••• (configurada)\" : \"…\";\n  $(\"#cfg-pasta\").textContent = est.cfg.pasta;\n  f.github.value = est.cfg.github || \"\";\n  f.github.disabled = est.cfg.github === null;\n  $(\"#cfg-versao\").textContent = `Versão atual: ${est.cfg.versao}.`;\n  d.returnValue = \"\";\n  d.showModal();\n});\nfunction mostrarSecoes() {\n  const m = $(\"#dlg-config form\").motor.value;\n  for (const sec of document.querySelectorAll(\"#dlg-config .cfg-sec\")) sec.hidden = sec.dataset.para !== m;\n}\n$(\"#dlg-config form\").motor.addEventListener(\"change\", mostrarSecoes);\nasync function verificarKaggle() {\n  const e = $(\"#cfg-kaggle-estado\");\n  e.textContent = \"Verificando o Kaggle…\";\n  try {\n    const k = await pegar(\"/api/kaggle\");\n    e.textContent = !k.conta ? \"Conta do Kaggle ainda não ligada: cole o usuário e o token acima e clique em Salvar.\" : `Conta ligada: ${k.usuario}. GPU na nuvem ${k.ligada ? \"ligada agora\" : k.ligando ? \"ligando…\" : \"desligada (liga sozinha ao gerar)\"}.`;\n  } catch (err) { e.textContent = err.message; }\n}\n$(\"#kaggle-json\").addEventListener(\"change\", async (ev) => {\n  const arq = ev.target.files[0];\n  if (!arq) return;\n  try {\n    await postar(\"/api/config\", { kaggle: await arq.text() });\n    est.cfg = await pegar(\"/api/config\");\n    $(\"#dlg-config form\").motor.value = \"kaggle\";\n    mostrarSecoes();\n    aviso(\"Conta do Kaggle ligada. Agora é só clicar em Gerar num nó de vídeo.\");\n  } catch (err) { aviso(err.message, true, 10000); }\n  ev.target.value = \"\";\n  verificarKaggle();\n});\nasync function verificarComfy() {\n  const e = $(\"#cfg-comfy-estado\");\n  e.textContent = \"Verificando o ComfyUI…\";\n  try {\n    const c = await pegar(\"/api/comfy\");\n    const rec = `receita de foto ${c.receitas.imagem ? \"✓\" : \"—\"} · de vídeo ${c.receitas.video ? \"✓\" : \"—\"}`;\n    e.textContent = c.ligado ? `ComfyUI ligado${c.placa ? ` · ${c.placa}` : \"\"}${c.vramGB ? ` · ${c.vramGB} GB de memória de vídeo` : \"\"} · ${rec}` : `ComfyUI desligado (${c.url}). Abra o ComfyUI para gerar localmente · ${rec}`;\n  } catch (err) { e.textContent = err.message; }\n}\nfor (const tipo of [\"imagem\", \"video\"]) {\n  $(`#receita-${tipo}`).addEventListener(\"change\", async (ev) => {\n    const arq = ev.target.files[0];\n    if (!arq) return;\n    try {\n      const r = await postar(\"/api/comfy/receita\", { tipo, json: await arq.text() });\n      aviso(`Receita de ${tipo === \"video\" ? \"vídeo\" : \"foto\"} salva (${r.nos} nós).`);\n      est.cfg = await pegar(\"/api/config\");\n    } catch (err) { aviso(err.message, true, 10000); }\n    ev.target.value = \"\";\n    verificarComfy();\n  });\n}\n$(\"#receita-pronta\").addEventListener(\"click\", async () => {\n  try {\n    await postar(\"/api/comfy/receita\", { tipo: \"video\", padrao: \"wan22-5b\" });\n    aviso(\"Receita pronta de vídeo salva (Wan 2.2 5B). Ligue uma imagem ao nó Gerar vídeo.\");\n    est.cfg = await pegar(\"/api/config\");\n  } catch (err) { aviso(err.message, true, 10000); }\n  verificarComfy();\n});\n$(\"#cfg-cancelar\").addEventListener(\"click\", () => $(\"#dlg-config\").close(\"cancelar\"));\n$(\"#dlg-config\").addEventListener(\"close\", async () => {\n  const d = $(\"#dlg-config\");\n  if (d.returnValue !== \"salvar\") return;\n  const f = d.querySelector(\"form\");\n  const corpo = { motor: f.motor.value };\n  if (f.artcraftKey.value.trim()) corpo.artcraftKey = f.artcraftKey.value.trim();\n  if (f.falKey.value.trim()) corpo.falKey = f.falKey.value.trim();\n  if (f.comfyUrl.value.trim() !== (est.cfg.comfyUrl || \"\")) corpo.comfyUrl = f.comfyUrl.value.trim();\n  if (!f.github.disabled && f.github.value.trim() !== (est.cfg.github || \"\")) corpo.github = f.github.value.trim();\n  const kTok = f.kaggleToken.value.trim(), kUser = f.kaggleUser.value.trim().replace(/^@/, \"\").replace(/^.*kaggle\\.com\\//i, \"\").replace(/\\/.*$/, \"\");\n  if (kTok || (kUser && kUser !== est.cfg.kaggle)) {\n    if (!kTok || !kUser) return aviso(\"Para ligar o Kaggle preencha o usuário e o token.\", true, 8000);\n    corpo.kaggle = { username: kUser, key: kTok };\n  }\n  try { await postar(\"/api/config\", corpo); } catch (err) { return aviso(err.message, true); }\n  est.cfg = await pegar(\"/api/config\");\n  if (corpo.github) setTimeout(conferirAtualizacao, 8000);\n  aviso(\"Configuração salva.\");\n  desenhar();\n});\n\n$(\"#bib-fechar\").addEventListener(\"click\", () => alternarBiblioteca(false));\n$(\"#bib-abrir\").addEventListener(\"click\", () => alternarBiblioteca(true));\nfunction alternarBiblioteca(abrir) {\n  $(\"#biblioteca\").classList.toggle(\"fechada\", !abrir);\n  document.body.classList.toggle(\"sem-bib\", !abrir);\n  $(\"#bib-abrir\").hidden = abrir;\n  gravarLocal(\"biblioteca\", abrir ? \"1\" : \"0\");\n}\n\n// ---------------------------------------------------------------------------------------------\n// Visor (tela cheia)\n// ---------------------------------------------------------------------------------------------\n\nfunction abrirVisor(m) {\n  if (!m) return;\n  const v = $(\"#visor\");\n  const legenda = [m.arquivo, m.modelo && `${m.motor} · ${m.modelo}`, m.prompt].filter(Boolean).join(\"\\n\");\n  v.querySelector(\".visor-conteudo\").innerHTML = (m.tipo === \"video\"\n    ? `<video src=\"${urlMidia(m)}\" controls autoplay loop></video>`\n    : `<img src=\"${urlMidia(m)}\" alt=\"\">`) + `<div class=\"legenda\">${esc(legenda)}</div>`;\n  v.hidden = false;\n}\nfunction fecharVisor() { $(\"#visor\").hidden = true; $(\"#visor .visor-conteudo\").innerHTML = \"\"; }\n$(\"#visor\").addEventListener(\"click\", (e) => { if (!e.target.closest(\"video\")) fecharVisor(); });\n\n// vídeos dos nós tocam ao passar o mouse\n$(\"#camada-nos\").addEventListener(\"pointerover\", (e) => { const v = e.target.closest(\".previa video\"); if (v) v.play().catch(() => {}); });\n$(\"#camada-nos\").addEventListener(\"pointerout\", (e) => { const v = e.target.closest(\".previa video\"); if (v) v.pause(); });\n\n// ---------------------------------------------------------------------------------------------\n// Miniaturas (o navegador gera; o Claude usa para ver o quadro gastando pouco)\n// ---------------------------------------------------------------------------------------------\n\nconst fila = new Set();\nlet fazendo = false;\nasync function fazerMiniaturas() {\n  for (const m of Object.values(est.doc.midias)) if (!est.minis.has(m.id)) fila.add(m.id);\n  if (fazendo) return;\n  fazendo = true;\n  try {\n    for (const id of fila) {\n      fila.delete(id);\n      const m = est.doc.midias[id];\n      if (!m) continue;\n      try {\n        const blob = await miniatura(m);\n        if (!blob) continue;\n        await fetch(`/api/miniatura?${qp(`&m=${id}`)}`, { method: \"POST\", headers: { \"X-Quadro\": \"1\" }, body: blob });\n        est.minis.add(id);\n      } catch {}\n    }\n  } finally { fazendo = false; }\n}\n\nfunction miniatura(m) {\n  return new Promise((resolve) => {\n    const desenharEm = (fonte, w, h) => {\n      const k = Math.min(1, 512 / Math.max(w, h));\n      const c = document.createElement(\"canvas\");\n      c.width = Math.max(1, Math.round(w * k)); c.height = Math.max(1, Math.round(h * k));\n      c.getContext(\"2d\").drawImage(fonte, 0, 0, c.width, c.height);\n      c.toBlob((b) => resolve(b), \"image/jpeg\", 0.8);\n    };\n    const tempo = setTimeout(() => resolve(null), 20000);\n    if (m.tipo === \"video\") {\n      const v = document.createElement(\"video\");\n      v.muted = true; v.preload = \"auto\"; v.src = urlMidia(m);\n      v.addEventListener(\"loadeddata\", () => { v.currentTime = Math.min(0.5, (v.duration || 1) / 3); }, { once: true });\n      v.addEventListener(\"seeked\", () => { clearTimeout(tempo); desenharEm(v, v.videoWidth, v.videoHeight); }, { once: true });\n      v.addEventListener(\"error\", () => { clearTimeout(tempo); resolve(null); }, { once: true });\n    } else {\n      const i = new Image();\n      i.onload = () => { clearTimeout(tempo); desenharEm(i, i.naturalWidth, i.naturalHeight); };\n      i.onerror = () => { clearTimeout(tempo); resolve(null); };\n      i.src = urlMidia(m);\n    }\n  });\n}\n\n// ---------------------------------------------------------------------------------------------\n// Timeline do FilmCraft (painel de baixo): mostra a sequência aberta no FilmCraft, ao vivo\n// ---------------------------------------------------------------------------------------------\n\nconst linha = { aberta: false, dados: null, assinatura: \"\", pps: 1, monitor: true, timer: null, buscando: false, fotoEm: null, fotoBuscando: false, minis: new Map(), arrastando: null };\nconst tcLinha = (s, fps) => {\n  s = Math.max(0, s || 0);\n  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = Math.floor(s % 60), f = Math.floor((s % 1) * (fps || 24) + 1e-6);\n  return `${String(h).padStart(2, \"0\")}:${String(m).padStart(2, \"0\")}:${String(x).padStart(2, \"0\")}:${String(f).padStart(2, \"0\")}`;\n};\n\nfunction alternarLinha(abrir) {\n  linha.aberta = abrir;\n  $(\"#linha\").hidden = !abrir;\n  document.body.classList.toggle(\"com-linha\", abrir);\n  $(\"#linha-alternar\").classList.toggle(\"primario\", abrir);\n  gravarLocal(\"linha\", abrir ? \"1\" : \"0\");\n  clearInterval(linha.timer);\n  if (abrir) { buscarLinha(); linha.timer = setInterval(() => { if (!document.hidden) buscarLinha(); }, 1000); }\n}\n$(\"#linha-alternar\").addEventListener(\"click\", () => alternarLinha(!linha.aberta));\n$(\"#linha-fechar\").addEventListener(\"click\", () => alternarLinha(false));\n$(\"#linha-ver-monitor\").addEventListener(\"click\", () => {\n  linha.monitor = !linha.monitor;\n  $(\"#linha\").classList.toggle(\"sem-monitor\", !linha.monitor);\n  gravarLocal(\"linha-monitor\", linha.monitor ? \"1\" : \"0\");\n  linha.fotoEm = null;\n  desenharLinha(true);\n});\n$(\"#linha-abrir\").addEventListener(\"click\", (e) => { e.stopPropagation(); abrirProjetosFc(); });\n$(\"#fc-projeto\").addEventListener(\"click\", (e) => { e.stopPropagation(); if ($(\"#fc-projetos\").hidden) abrirProjetosFc(); else fecharProjetosFc(); });\n$(\"#linha-controle\").addEventListener(\"click\", async (e) => {\n  e.target.disabled = true;\n  try { const r = await postar(\"/api/filmcraft/controle\"); aviso(r.texto, false, 12000); } catch (err) { aviso(err.message, true); }\n  e.target.disabled = false;\n});\ndocument.addEventListener(\"pointerdown\", (e) => { if (!e.target.closest(\"#fc-projetos, #fc-projeto, #linha-abrir\")) fecharProjetosFc(); }, true);\n\n// Seletor de projeto: o que está aberto, os recentes do FilmCraft e os .fcproj achados no PC.\nfunction fecharProjetosFc() { $(\"#fc-projetos\").hidden = true; }\nasync function abrirProjetosFc() {\n  const caixa = $(\"#fc-projetos\");\n  caixa.hidden = false;\n  caixa.innerHTML = `<p class=\"dica\" style=\"padding:6px\">Procurando projetos…</p>`;\n  let r;\n  try { r = await pegar(\"/api/filmcraft/projetos\"); } catch (err) { caixa.innerHTML = `<p class=\"dica\" style=\"padding:6px\">${esc(err.message)}</p>`; return; }\n  const botao = (p, atual) => `<button class=\"proj${atual ? \" atual\" : \"\"}\" data-path=\"${esc(p.path)}\" ${p.existe === false ? \"disabled title=\\\"arquivo não encontrado\\\"\" : \"\"}>${esc(p.nome)}<small>${esc(p.pasta || \"\")}</small></button>`;\n  let h = \"\";\n  if (r.atual) {\n    h += `<h5>Aberto agora no FilmCraft</h5><button class=\"proj atual\" disabled>${esc(r.atual.nome)}${r.atual.alterado ? \" •\" : \"\"}<small>${esc(r.atual.path || \"ainda não salvo\")}</small></button>`;\n    if (r.sequencias.length) h += `<h5>Sequências deste projeto</h5>${r.sequencias.map((q) => `<button class=\"proj${q.item === r.ativa ? \" atual\" : \"\"}\" data-seq=\"${q.item}\">🎞 ${esc(q.nome)}</button>`).join(\"\")}`;\n  } else if (!r.conectado && r.rodando) {\n    h += `<p class=\"dica\" style=\"padding:6px\">O FilmCraft está aberto sem sincronização. Salve e feche o FilmCraft e escolha o projeto abaixo, ou use “Ligar sincronização permanente”.</p>`;\n  }\n  const atualPath = r.atual && r.atual.path;\n  const rec = r.recentes.filter((p) => p.path !== atualPath);\n  if (rec.length) h += `<h5>Recentes do FilmCraft</h5>${rec.map((p) => botao(p)).join(\"\")}`;\n  if (r.encontrados.length) h += `<h5>Encontrados no computador</h5>${r.encontrados.map((p) => botao(p)).join(\"\")}`;\n  if (!rec.length && !r.encontrados.length) h += `<p class=\"dica\" style=\"padding:6px\">Não achei projetos (.fcproj) nos recentes nem em Documentos, Vídeos, Área de Trabalho e Downloads.</p>`;\n  h += `<h5>Outro projeto</h5><div class=\"caminho\"><input placeholder=\"Cole o caminho do .fcproj (Shift + botão direito › Copiar como caminho)\"><button class=\"btn\" data-caminho>Abrir</button></div>`;\n  if (!r.conectado && !r.rodando) h += `<div class=\"caminho\"><button class=\"btn\" data-vazio>Abrir o FilmCraft sem projeto</button></div>`;\n  caixa.innerHTML = h;\n}\n$(\"#fc-projetos\").addEventListener(\"click\", async (e) => {\n  const b = e.target.closest(\"button\");\n  if (!b || b.disabled) return;\n  if (b.dataset.seq) {\n    try { await postar(\"/api/filmcraft/sequencia\", { item: Number(b.dataset.seq) }); fecharProjetosFc(); linha.assinatura = \"\"; buscarLinha(); } catch (err) { aviso(err.message, true); }\n    return;\n  }\n  let caminho = b.dataset.path;\n  if (b.hasAttribute(\"data-caminho\")) caminho = $(\"#fc-projetos input\").value.trim().replace(/^\"|\"$/g, \"\");\n  if (b.hasAttribute(\"data-caminho\") && !caminho) return;\n  fecharProjetosFc();\n  await abrirProjetoFc(caminho || \"\");\n});\nasync function abrirProjetoFc(caminho, salvar) {\n  aviso(caminho ? `Abrindo ${caminho.split(/[\\\\/]/).pop()} no FilmCraft…` : \"Abrindo o FilmCraft…\");\n  try {\n    const r = await postar(\"/api/filmcraft/abrir\", { path: caminho || undefined, salvar: !!salvar });\n    if (r.precisaSalvar) {\n      if (r.semCaminho) return aviso(`\"${r.nome}\" tem mudanças e nunca foi salvo. Salve no FilmCraft (Ctrl+S) e tente de novo.`, true);\n      if (confirm(`O projeto \"${r.nome}\" tem mudanças não salvas. Salvar e abrir o outro projeto?`)) return abrirProjetoFc(caminho, true);\n      return;\n    }\n    if (r.semControle) return aviso(\"O FilmCraft está aberto sem sincronização. Salve e feche o FilmCraft e tente de novo, ou ligue a sincronização permanente.\", true, 9000);\n    aviso(r.texto);\n    linha.assinatura = \"\";\n    buscarLinha();\n  } catch (err) { aviso(err.message, true); }\n}\n$(\"#fc-sequencia\").addEventListener(\"change\", async (e) => {\n  try { await postar(\"/api/filmcraft/sequencia\", { item: Number(e.target.value) }); linha.assinatura = \"\"; buscarLinha(); } catch (err) { aviso(err.message, true); }\n});\n// nome do projeto e lista de sequências no topo da timeline (só quando mudam)\nlet projetoFcVisto = \"\";\nasync function atualizarCabecalhoFc(s) {\n  const chave = `${s.id}|${linha.assinatura.length}`;\n  if (chave === projetoFcVisto) return;\n  projetoFcVisto = chave;\n  try {\n    const r = await pegar(\"/api/filmcraft/projetos\");\n    $(\"#fc-projeto span\").textContent = r.atual ? r.atual.nome : \"Projeto\";\n    const sel = $(\"#fc-sequencia\");\n    sel.innerHTML = r.sequencias.map((q) => `<option value=\"${q.item}\" ${q.item === r.ativa ? \"selected\" : \"\"}>${esc(q.nome)}</option>`).join(\"\");\n    sel.hidden = r.sequencias.length < 2;\n  } catch {}\n}\nfunction irPara(t) {\n  const s = linha.dados.sequencia;\n  s.playhead = t;\n  $(\"#linha-cabeca\").style.left = `${34 + t * linha.pps}px`;\n  $(\"#linha-tc\").textContent = tcLinha(t, s.fps);\n  postar(\"/api/filmcraft/playhead\", { seconds: t }).catch((err) => aviso(err.message, true));\n}\n\nasync function buscarLinha() {\n  if (linha.buscando) return;\n  linha.buscando = true;\n  try {\n    const d = await pegar(\"/api/filmcraft/linha\");\n    const s = d.sequencia;\n    const assinatura = JSON.stringify(s ? { ...s, playhead: 0 } : d);\n    const mudou = assinatura !== linha.assinatura;\n    linha.dados = d;\n    linha.assinatura = assinatura;\n    desenharLinha(mudou);\n  } catch {\n    linha.dados = { conectado: false, falha: true };\n    desenharLinha(true);\n  } finally { linha.buscando = false; }\n}\n\nfunction desenharLinha(tudo) {\n  const d = linha.dados || {};\n  const s = d.sequencia;\n  const off = $(\"#linha-off\");\n  off.hidden = !!s;\n  if (!s) {\n    $(\"#linha-nome\").textContent = \"\";\n    $(\"#linha-tc\").textContent = \"\";\n    const semControle = !d.conectado && d.rodando === true;\n    off.querySelector(\"p\").textContent = d.falha ? \"Não consegui falar com o quadro.\" : semControle\n      ? \"O FilmCraft está aberto, mas sem a sincronização ligada, então o quadro não enxerga a timeline. Ligue a sincronização permanente uma vez (depois feche e abra o FilmCraft) ou salve, feche o FilmCraft e escolha o projeto aqui.\"\n      : !d.conectado\n        ? \"O FilmCraft está fechado. Escolha o projeto e eu abro já sincronizado com o quadro.\"\n        : `O FilmCraft está conectado, mas sem sequência aberta. Escolha uma sequência em 📂 Projeto.${d.aviso ? ` (${d.aviso})` : \"\"}`;\n    $(\"#linha-abrir\").hidden = semControle;\n    $(\"#linha-abrir\").textContent = d.conectado ? \"📂 Escolher projeto ou sequência\" : \"📂 Escolher projeto e abrir\";\n    $(\"#linha-controle\").hidden = !semControle;\n    $(\"#fc-sequencia\").hidden = true;\n    $(\"#fc-projeto span\").textContent = d.conectado ? \"Projeto\" : \"Abrir projeto\";\n    return;\n  }\n  $(\"#linha-nome\").textContent = `${s.nome} · ${s.largura}×${s.altura} · ${Math.round(s.fps * 100) / 100} fps`;\n  atualizarCabecalhoFc(s);\n  $(\"#linha-tc\").textContent = tcLinha(s.playhead, s.fps);\n  const area = $(\"#linha-faixas\");\n  const largura = Math.max(100, area.clientWidth - 34 - 8);\n  const total = Math.max(s.duracao * 1.04, 5);\n  const pps = largura / total;\n  if (tudo || pps !== linha.pps) {\n    linha.pps = pps;\n    // régua: marcas a cada 1, 2, 5, 10, 30, 60… segundos, o que couber\n    const passo = [1, 2, 5, 10, 15, 30, 60, 120, 300, 600].find((p) => p * pps >= 70) || 1200;\n    let regua = \"\";\n    for (let t = 0; t <= total; t += passo) regua += `<i style=\"left:${t * pps}px\">${tcLinha(t, s.fps).replace(/^00:/, \"\").slice(0, -3)}</i>`;\n    for (const m of s.marcadores) regua += `<b class=\"marca-fc\" style=\"left:${m.ini * pps}px\" title=\"${esc(tcLinha(m.ini, s.fps))} ${esc(m.nome)}\"></b>`;\n    $(\"#linha-regua\").innerHTML = regua;\n    const noQuadro = new Set((est.doc ? est.doc.nos : []).filter((n) => n.fc).map((n) => n.fc.clip));\n    const trilha = (f, audio) => `<div class=\"trilha${audio ? \" audio\" : \"\"}\" data-trilha=\"${f.nome}\"><div class=\"nome-trilha\">${f.nome}</div>${f.clipes.map((c) => {\n      const tipo = s.tipos[c.item] || \"\";\n      const classes = [\"clipe\", s.selecao.includes(c.clip) && \"sel\", noQuadro.has(c.clip) && \"no-quadro\", !c.ativo && \"off\"].filter(Boolean).join(\" \");\n      return `<div class=\"${classes}\" ${audio ? \"\" : `draggable=\"true\" data-clip=\"${c.clip}\" data-item=\"${c.item}\" data-tipo=\"${tipo}\" data-meio=\"${c.inSrc + c.dur / 2}\"`} style=\"left:${c.ini * pps}px;width:${Math.max(2, c.dur * pps - 1)}px\" title=\"${esc(c.nome)} · ${tcLinha(c.ini, s.fps)} → ${tcLinha(c.ini + c.dur, s.fps)}${audio ? \"\" : \"\\nArraste para o quadro (ou clique duas vezes) para usar como referência\"}\"><span>${esc(c.nome)}</span></div>`;\n    }).join(\"\")}</div>`;\n    $(\"#linha-trilhas\").innerHTML = [...s.video].reverse().map((f) => trilha(f, false)).join(\"\") + s.audio.map((f) => trilha(f, true)).join(\"\");\n    document.querySelectorAll(\"#linha-trilhas .clipe[data-clip]\").forEach(pintarClipe);\n  }\n  $(\"#linha-cabeca\").style.left = `${34 + s.playhead * linha.pps}px`;\n  atualizarMonitor(s);\n}\n\n// Miniatura do clipe: o navegador tira um quadro do arquivo original (foto ou vídeo).\nfunction pintarClipe(el) {\n  const chave = `${el.dataset.item}:${(+el.dataset.meio).toFixed(2)}`;\n  const pronta = linha.minis.get(chave);\n  if (pronta) { if (pronta !== \"x\") el.style.backgroundImage = `url(\"${pronta}\")`; return; }\n  linha.minis.set(chave, \"x\");\n  const url = `/api/filmcraft/arquivo?${qp(`&item=${el.dataset.item}`)}`;\n  const usar = (u) => { linha.minis.set(chave, u); document.querySelectorAll(`#linha-trilhas .clipe[data-item=\"${el.dataset.item}\"]`).forEach((x) => { if (`${x.dataset.item}:${(+x.dataset.meio).toFixed(2)}` === chave) x.style.backgroundImage = `url(\"${u}\")`; }); };\n  const reduzir = (fonte, w, h) => {\n    const c = document.createElement(\"canvas\");\n    c.height = 60; c.width = Math.max(1, Math.round((w / h) * 60));\n    c.getContext(\"2d\").drawImage(fonte, 0, 0, c.width, c.height);\n    usar(c.toDataURL(\"image/jpeg\", 0.7));\n  };\n  if (el.dataset.tipo === \"imagem\") {\n    const i = new Image();\n    i.onload = () => reduzir(i, i.naturalWidth, i.naturalHeight);\n    i.src = url;\n  } else if (el.dataset.tipo === \"video\") {\n    const v = document.createElement(\"video\");\n    v.muted = true; v.preload = \"auto\"; v.src = url;\n    v.addEventListener(\"loadedmetadata\", () => { v.currentTime = Math.min(+el.dataset.meio, Math.max(0, (v.duration || 1) - 0.05)); }, { once: true });\n    v.addEventListener(\"seeked\", () => { reduzir(v, v.videoWidth, v.videoHeight); v.removeAttribute(\"src\"); v.load(); }, { once: true });\n  }\n}\n\nfunction atualizarMonitor(s) {\n  if (!linha.monitor || linha.fotoBuscando) return;\n  const chave = `${s.playhead.toFixed(3)}|${linha.assinatura.length}`;\n  if (chave === linha.fotoEm) return;\n  linha.fotoBuscando = true;\n  fetch(`/api/filmcraft/monitor?${qp(\"&lado=640\")}`).then(async (r) => {\n    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).erro || \"sem imagem\");\n    const u = URL.createObjectURL(await r.blob());\n    const img = $(\"#linha-monitor img\");\n    if (img.src.startsWith(\"blob:\")) URL.revokeObjectURL(img.src);\n    img.src = u;\n    $(\"#linha-monitor span\").textContent = \"\";\n    linha.fotoEm = chave;\n  }).catch((e) => { $(\"#linha-monitor span\").textContent = e.message; linha.fotoEm = chave; })\n    .finally(() => { linha.fotoBuscando = false; });\n}\n\nconst tempoNaLinha = (clientX) => {\n  const r = $(\"#linha-faixas\").getBoundingClientRect();\n  return Math.max(0, (clientX - r.left - 34) / linha.pps);\n};\n\n// clicar / arrastar na régua ou nas faixas = mover o playhead do FilmCraft\nlet raspando = null;\n$(\"#linha-faixas\").addEventListener(\"pointerdown\", (e) => {\n  const s = linha.dados && linha.dados.sequencia;\n  if (!s || e.button !== 0 || e.target.closest(\".clipe[draggable]\")) return;\n  raspando = { ultimo: 0 };\n  moverPlayhead(e.clientX, true);\n  $(\"#linha-faixas\").setPointerCapture(e.pointerId);\n});\n$(\"#linha-faixas\").addEventListener(\"pointermove\", (e) => { if (raspando) moverPlayhead(e.clientX, false); });\n$(\"#linha-faixas\").addEventListener(\"pointerup\", (e) => { if (raspando) { moverPlayhead(e.clientX, true); raspando = null; } });\n$(\"#linha-faixas\").addEventListener(\"click\", (e) => {\n  // clique simples num clipe de vídeo também move o playhead\n  const c = e.target.closest(\".clipe[draggable]\");\n  if (c && linha.dados && linha.dados.sequencia) moverPlayhead(e.clientX, true);\n});\nfunction moverPlayhead(clientX, ja) {\n  const s = linha.dados.sequencia;\n  const t = Math.min(tempoNaLinha(clientX), s.duracao);\n  s.playhead = t;\n  $(\"#linha-cabeca\").style.left = `${34 + t * linha.pps}px`;\n  $(\"#linha-tc\").textContent = tcLinha(t, s.fps);\n  const agora = Date.now();\n  if (!ja && raspando && agora - raspando.ultimo < 120) return;\n  if (raspando) raspando.ultimo = agora;\n  postar(\"/api/filmcraft/playhead\", { seconds: t }).catch((err) => aviso(err.message, true));\n}\n\n// clipe da timeline → quadro (arrastar ou duplo clique)\n$(\"#linha-trilhas\").addEventListener(\"dragstart\", (e) => {\n  const c = e.target.closest(\".clipe[data-clip]\");\n  if (c) e.dataTransfer.setData(\"application/x-clipe-fc\", c.dataset.clip);\n});\n$(\"#linha-trilhas\").addEventListener(\"dblclick\", (e) => {\n  const c = e.target.closest(\".clipe[data-clip]\");\n  if (c) trazerClipe(Number(c.dataset.clip));\n});\nasync function trazerClipe(clip, p) {\n  const cena = est.doc.cenas.find((c) => c.id === est.cena);\n  aviso(\"Trazendo o clipe para o quadro…\");\n  try {\n    const r = await postar(\"/api/filmcraft/importar\", { clips: [clip], cena: cena.id, ...(p ? { x: p.x, y: p.y } : {}) });\n    aviso(r.texto);\n    await carregarDoc();\n    linha.assinatura = \"\";\n  } catch (err) { aviso(err.message, true); }\n}\n\n$(\"#linha-importar\").addEventListener(\"click\", async (e) => {\n  e.target.disabled = true;\n  aviso(\"Trazendo a sequência para o quadro…\");\n  try {\n    const r = await postar(\"/api/filmcraft/importar\", {});\n    aviso(r.texto);\n    await carregarDoc();\n    trocarCena(r.cena);\n    linha.assinatura = \"\";\n  } catch (err) { aviso(err.message, true); }\n  e.target.disabled = false;\n});\n\n// biblioteca → timeline (soltar no tempo onde caiu)\nconst painelLinha = $(\"#linha\");\npainelLinha.addEventListener(\"dragover\", (e) => {\n  if (!e.dataTransfer.types.includes(\"application/x-midia\") || !(linha.dados && linha.dados.sequencia)) return;\n  e.preventDefault();\n  mostrarAlvo(e.clientX);\n});\npainelLinha.addEventListener(\"dragleave\", (e) => { if (!painelLinha.contains(e.relatedTarget)) mostrarAlvo(null); });\npainelLinha.addEventListener(\"drop\", (e) => {\n  const midia = e.dataTransfer.getData(\"application/x-midia\");\n  mostrarAlvo(null);\n  if (!midia) return;\n  e.preventDefault();\n  colocarNaLinha({ midia, cena: est.cena }, tempoNaLinha(e.clientX));\n});\nfunction mostrarAlvo(clientX) {\n  const alvo = $(\"#linha-alvo\");\n  painelLinha.classList.toggle(\"soltar\", clientX !== null);\n  if (clientX === null) { alvo.hidden = true; return; }\n  const t = tempoNaLinha(clientX);\n  alvo.hidden = false;\n  alvo.style.left = `${34 + t * linha.pps}px`;\n  alvo.dataset.tc = tcLinha(t, linha.dados.sequencia.fps);\n}\n// nó arrastado do quadro e solto em cima da timeline\nfunction sobreLinha(clientX, clientY) {\n  if (!linha.aberta || !(linha.dados && linha.dados.sequencia)) return false;\n  const r = $(\"#linha-faixas\").getBoundingClientRect();\n  return clientY >= r.top && clientY <= r.bottom && clientX >= r.left && clientX <= r.right;\n}\nasync function colocarNaLinha(corpo, seconds) {\n  aviso(\"Colocando na timeline do FilmCraft…\");\n  try {\n    const r = await postar(\"/api/filmcraft/colocar\", { ...corpo, ...(typeof seconds === \"number\" ? { seconds } : {}) });\n    aviso(r.texto);\n    await carregarDoc();\n    if (linha.aberta) buscarLinha();\n  } catch (err) { aviso(err.message, true); }\n}\nwindow.addEventListener(\"resize\", () => { if (linha.aberta) desenharLinha(true); });\n\n// ---------------------------------------------------------------------------------------------\n// Guia, aviso de atualização\n// ---------------------------------------------------------------------------------------------\n\nfunction alternarGuia(abrir) {\n  if (abrir === undefined) abrir = $(\"#guia\").hidden;\n  $(\"#guia\").hidden = !abrir;\n  document.body.classList.toggle(\"com-guia\", abrir);\n  $(\"#guia-alternar\").classList.toggle(\"primario\", abrir);\n  gravarLocal(\"guia\", abrir ? \"1\" : \"0\");\n  if (linha.aberta) desenharLinha(true);\n}\n$(\"#guia-alternar\").addEventListener(\"click\", () => alternarGuia());\n$(\"#guia-fechar\").addEventListener(\"click\", () => alternarGuia(false));\n\nlet atualizacaoVista = \"\";\nasync function conferirAtualizacao() {\n  try {\n    const r = await pegar(\"/api/atualizacao\");\n    if (!r.pronta || r.pronta.versao === atualizacaoVista) return;\n    const b = $(\"#atualizacao\");\n    b.querySelector(\"span\").textContent = `Versão ${r.pronta.versao} pronta${r.pronta.notas ? `: ${r.pronta.notas}` : \"\"}`;\n    const btn = b.querySelector(\".btn\");\n    btn.textContent = r.podeReiniciar ? \"Reiniciar e atualizar\" : \"Entra quando reiniciar o Claude\";\n    btn.disabled = !r.podeReiniciar;\n    b.hidden = false;\n    if (r.podeReiniciar) agendarAtualizacao();\n  } catch {}\n}\n$(\"#atualizacao .mini\").addEventListener(\"click\", () => {\n  atualizacaoVista = $(\"#atualizacao span\").textContent.replace(/^Versão (\\S+).*/, \"$1\");\n  $(\"#atualizacao\").hidden = true;\n  clearInterval(autoAtualizar); autoAtualizar = null;\n});\n// Atualiza sozinho: quando há versão pronta e nada está gerando, conta 20 s e reinicia (o × cancela).\nlet autoAtualizar = null;\nfunction agendarAtualizacao() {\n  if (autoAtualizar) return;\n  let resta = 20;\n  const btn = $(\"#atualizacao .btn\");\n  autoAtualizar = setInterval(() => {\n    if (btn.disabled || $(\"#atualizacao\").hidden) { clearInterval(autoAtualizar); autoAtualizar = null; return; }\n    if (est.doc && est.doc.nos.some((n) => n.estado === \"gerando\")) { resta = 20; btn.textContent = \"Reiniciar e atualizar\"; return; }\n    if (--resta <= 0) { clearInterval(autoAtualizar); btn.click(); return; }\n    btn.textContent = `Atualizando em ${resta} s (clique para já)`;\n  }, 1000);\n}\n$(\"#atualizacao .btn\").addEventListener(\"click\", async (e) => {\n  e.target.disabled = true;\n  e.target.textContent = \"Reiniciando…\";\n  try { await postar(\"/api/reiniciar\"); } catch (err) { aviso(err.message, true); return; }\n  // espera o programa voltar e recarrega a página\n  const t0 = Date.now();\n  await new Promise((r) => setTimeout(r, 2500));\n  while (Date.now() - t0 < 60000) {\n    try { const r = await fetch(\"/api/ping\", { cache: \"no-store\" }); if (r.ok) return location.reload(); } catch {}\n    await new Promise((r) => setTimeout(r, 1000));\n  }\n  aviso(\"O programa não voltou sozinho. Abra o Quadro ArtCraft.exe de novo.\", true);\n});\n\n// ---------------------------------------------------------------------------------------------\n// Início e atualização ao vivo\n// ---------------------------------------------------------------------------------------------\n\nfunction conectarEventos() {\n  const es = new EventSource(`/api/eventos?${qp()}`);\n  let t;\n  es.onmessage = (ev) => {\n    const d = JSON.parse(ev.data);\n    if (d.tipo === \"quadro\" && (!est.doc || d.rev !== est.doc.rev)) { clearTimeout(t); t = setTimeout(carregarDoc, 80); }\n    if (d.tipo === \"progresso\") {\n      const n = est.doc && acharNo(d.no);\n      if (n) { n.progresso = d.progresso; if (d.fase) n.fase = d.fase; desenharNos(); }\n    }\n  };\n  es.onerror = () => { es.close(); setTimeout(() => { conectarEventos(); carregarDoc(); }, 3000); }; // pega o que mudou durante a queda\n}\n\n(async function iniciar() {\n  try {\n    const [cfg, projs] = await Promise.all([pegar(\"/api/config\"), pegar(\"/api/projetos\")]);\n    est.cfg = cfg;\n    est.projetos = projs.projetos;\n    if (!est.proj) est.proj = projs.ativo;\n    if (lerLocal(\"biblioteca\") === \"0\") alternarBiblioteca(false);\n    if (lerLocal(\"linha-monitor\") === \"0\") { linha.monitor = false; $(\"#linha\").classList.add(\"sem-monitor\"); }\n    if (lerLocal(\"linha\") === \"1\") alternarLinha(true);\n    if (lerLocal(\"guia\") !== \"0\") alternarGuia(true);\n    conferirAtualizacao();\n    setInterval(conferirAtualizacao, 2 * 60 * 1000);\n    await carregarDoc();\n    conectarEventos();\n    document.title = `${est.doc.nome} · Quadro de Cenas`;\n  } catch (e) {\n    document.body.innerHTML = `<p style=\"padding:40px\">Não consegui falar com o quadro: ${esc(e.message)}. Ele roda junto com o Claude Desktop: abra o Claude e recarregue esta página.</p>`;\n  }\n})();\n\n// Barra de menus (Arquivo, Editar, Exibir, Janela, Atalhos, Configurações): reaproveita as ações que já existem.\nconst tecla = (k, o = {}) => document.dispatchEvent(new KeyboardEvent(\"keydown\", { key: k, bubbles: true, ...o }));\nconst MENUS = {\n  \"Arquivo\": [\n    [\"Importar foto ou vídeo…\", \"I\", () => novo(\"imagem\")],\n    [\"Nova nota\", \"N\", () => novo(\"nota\")],\n    [\"Novo Gerar foto\", \"G\", () => novo(\"gerar-imagem\")],\n    [\"Novo Gerar vídeo\", \"V\", () => novo(\"gerar-video\")],\n    null,\n    [\"Cena → FilmCraft\", \"\", () => enviarCena(\"filmcraft\")],\n    [\"Cena → EffectCraft\", \"\", () => enviarCena(\"effectcraft\")],\n  ],\n  \"Editar\": [\n    [\"Desfazer\", \"Ctrl+Z\", () => voltar(false)],\n    [\"Refazer\", \"Ctrl+Y\", () => voltar(true)],\n    null,\n    [\"Copiar\", \"Ctrl+C\", () => tecla(\"c\", { ctrlKey: true })],\n    [\"Colar\", \"Ctrl+V\", () => colarNos()],\n    [\"Duplicar\", \"Ctrl+D\", () => tecla(\"d\", { ctrlKey: true })],\n    [\"Selecionar tudo\", \"Ctrl+A\", () => tecla(\"a\", { ctrlKey: true })],\n    [\"Apagar\", \"Del\", () => tecla(\"Delete\")],\n    null,\n    [\"Gerar os selecionados\", \"Ctrl+Enter\", () => gerarSelecionados()],\n  ],\n  \"Exibir\": [\n    [\"Enquadrar a cena\", \"F\", () => enquadrar()],\n    [\"Timeline do FilmCraft\", \"T\", () => alternarLinha(!linha.aberta)],\n    [\"Biblioteca\", \"\", () => alternarBiblioteca($(\"#biblioteca\").classList.contains(\"fechada\"))],\n  ],\n  \"Janela\": [\n    [\"Tela cheia\", \"F11\", () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {})],\n    [\"Recarregar o quadro\", \"\", () => location.reload()],\n    [\"Procurar atualização\", \"\", async () => { aviso(\"Procurando atualização…\"); let erro = \"\"; try { erro = (await postar(\"/api/atualizacao/verificar\")).erro || \"\"; } catch (e) { erro = e.message; } atualizacaoVista = \"\"; await conferirAtualizacao(); if (!$(\"#atualizacao\").hidden) return; aviso(erro ? `Não consegui procurar atualização: ${erro}` : `Você já está na versão mais recente (${est.cfg.versao}).`, !!erro); }],\n  ],\n  \"Atalhos\": [\n    [\"Ver todos os atalhos\", \"?\", () => alternarGuia()],\n  ],\n  \"Configurações\": [\n    [\"Motor de geração e chaves…\", \"\", () => $(\"#motor\").click()],\n    [\"Atualizações automáticas…\", \"\", () => $(\"#motor\").click()],\n  ],\n};\nfunction fecharAba() {\n  const a = $(\"#menu-aba\");\n  if (a) a.hidden = true;\n  for (const b of $(\"#menus\").children) b.classList.remove(\"aberto\");\n}\nfunction abrirAba(btn, nome) {\n  let a = $(\"#menu-aba\");\n  if (!a) { a = document.createElement(\"div\"); a.id = \"menu-aba\"; document.body.append(a); }\n  const aberto = btn.classList.contains(\"aberto\");\n  fecharAba();\n  if (aberto) return;\n  a.replaceChildren();\n  for (const it of MENUS[nome]) {\n    if (!it) { a.append(document.createElement(\"hr\")); continue; }\n    const b = document.createElement(\"button\");\n    b.type = \"button\";\n    const t = document.createElement(\"span\"); t.textContent = it[0];\n    const k = document.createElement(\"kbd\"); k.textContent = it[1];\n    b.append(t, k);\n    b.addEventListener(\"click\", () => { fecharAba(); Promise.resolve().then(it[2]).catch((e) => aviso(e.message, true)); });\n    a.append(b);\n  }\n  btn.classList.add(\"aberto\");\n  const r = btn.getBoundingClientRect();\n  a.style.left = Math.min(r.left, innerWidth - 270) + \"px\";\n  a.style.top = r.bottom + 4 + \"px\";\n  a.hidden = false;\n}\nfor (const nome of Object.keys(MENUS)) {\n  const b = document.createElement(\"button\");\n  b.type = \"button\";\n  b.textContent = nome;\n  b.addEventListener(\"click\", (e) => { e.stopPropagation(); abrirAba(b, nome); });\n  b.addEventListener(\"mouseenter\", () => { if ($(\"#menus .aberto\") && !b.classList.contains(\"aberto\")) abrirAba(b, nome); });\n  $(\"#menus\").append(b);\n}\ndocument.addEventListener(\"click\", fecharAba);\ndocument.addEventListener(\"keydown\", (e) => { if (e.key === \"Escape\") fecharAba(); });\n\n// Soltar um arquivo fora do quadro não pode abrir o arquivo no navegador e perder a sessão.\nfor (const nome of [\"dragover\", \"drop\"]) window.addEventListener(nome, (e) => { if (e.dataTransfer && [...(e.dataTransfer.types || [])].includes(\"Files\")) e.preventDefault(); });\n","style.css":":root {\n  --fundo: #0b0d14;\n  --ponto: #20263a;\n  --painel: #141826;\n  --painel2: #1a1f30;\n  --borda: #272e45;\n  --texto: #e7eaf3;\n  --suave: #8c94ae;\n  --azul: #7fb8ff;\n  --rosa: #ff8fd1;\n  --verde: #8ff0c0;\n  --ambar: #ffd479;\n  --vermelho: #ff7a8a;\n  --raio: 12px;\n  color-scheme: dark;\n}\n* { box-sizing: border-box; }\n[hidden] { display: none !important; }\nhtml, body { margin: 0; height: 100%; overflow: hidden; background: var(--fundo); color: var(--texto);\n  font: 13px/1.4 \"Segoe UI\", system-ui, -apple-system, Roboto, sans-serif; }\nbutton, input, select, textarea { font: inherit; color: inherit; }\n.dica { color: var(--suave); font-size: 12px; margin: 6px 0; }\ncode { background: var(--painel2); padding: 1px 5px; border-radius: 4px; font-size: 12px; }\n\n/* topo */\n#topo { position: fixed; inset: 0 0 auto 0; height: 48px; display: flex; align-items: center; gap: 10px; padding: 0 12px;\n  background: rgba(14, 17, 27, .92); border-bottom: 1px solid var(--borda); z-index: 20; backdrop-filter: blur(8px); }\n.marca { display: flex; align-items: center; gap: 8px; font-weight: 700; letter-spacing: .3px; }\n.marca img { width: 22px; height: 22px; }\n#projeto { background: var(--painel2); border: 1px solid var(--borda); border-radius: 8px; padding: 5px 8px; max-width: 200px; }\n#cenas { display: flex; gap: 4px; overflow-x: auto; min-width: 0; scrollbar-width: none; }\n#cenas button { white-space: nowrap; background: transparent; border: 1px solid transparent; border-radius: 8px; padding: 5px 11px; color: var(--suave); cursor: pointer; }\n#cenas button:hover { color: var(--texto); background: var(--painel2); }\n#cenas button.ativa { color: var(--texto); border-color: var(--rosa); background: rgba(255, 143, 209, .08); box-shadow: 0 0 12px rgba(255, 143, 209, .25); }\n#cenas button.nova { color: var(--verde); }\n.espaco { flex: 1; }\n.btn { background: var(--painel2); border: 1px solid var(--borda); border-radius: 8px; padding: 6px 11px; cursor: pointer; white-space: nowrap; }\n.btn:hover { border-color: var(--azul); }\n.btn.primario { background: linear-gradient(90deg, rgba(127,184,255,.25), rgba(255,143,209,.25)); border-color: var(--rosa); }\n.btn:disabled { opacity: .5; cursor: default; }\n#motor span.ok { color: var(--verde); }\n#motor span.falta { color: var(--ambar); }\n.mini { background: var(--painel2); border: 1px solid var(--borda); border-radius: 6px; cursor: pointer; padding: 0 7px; line-height: 20px; }\n\n/* biblioteca */\n#biblioteca { position: fixed; top: 48px; bottom: 0; left: 0; width: 168px; background: rgba(14, 17, 27, .92); border-right: 1px solid var(--borda);\n  z-index: 15; display: flex; flex-direction: column; padding: 8px; gap: 6px; }\n#biblioteca.fechada { display: none; }\n#bib-abrir { position: fixed; top: 58px; left: 8px; z-index: 15; }\n.bib-cab { display: flex; justify-content: space-between; align-items: center; font-weight: 600; color: var(--suave); text-transform: uppercase; font-size: 11px; letter-spacing: .6px; }\n#lista-midia { flex: 1; overflow-y: auto; display: grid; grid-template-columns: 1fr 1fr; gap: 6px; align-content: start; }\n#lista-midia .item { aspect-ratio: 1; border-radius: 8px; overflow: hidden; background: var(--painel2); border: 1px solid var(--borda); cursor: grab; position: relative; }\n#lista-midia .item img, #lista-midia .item video { width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none; }\n#lista-midia .item .v { position: absolute; right: 4px; bottom: 3px; font-size: 10px; background: rgba(0,0,0,.6); padding: 0 4px; border-radius: 4px; }\n\n/* palco */\n#palco { position: fixed; top: 48px; left: 168px; right: 0; bottom: 0; overflow: hidden; cursor: default;\n  background-color: var(--fundo); background-image: radial-gradient(var(--ponto) 1.2px, transparent 1.2px); }\nbody.sem-bib #palco { left: 0; }\n#palco.movendo { cursor: grabbing; }\n#mundo { position: absolute; left: 0; top: 0; transform-origin: 0 0; }\n#fios { position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none; }\n#fios path { fill: none; stroke-width: 2.5; stroke-linecap: round; }\n#fios path.fio { stroke: var(--rosa); filter: drop-shadow(0 0 4px rgba(255,143,209,.55)); }\n#fios path.fio.video { stroke: var(--azul); filter: drop-shadow(0 0 4px rgba(127,184,255,.55)); }\n#fios path.fio.nota { stroke: var(--verde); filter: drop-shadow(0 0 4px rgba(143,240,192,.5)); }\n#fios path.fio.sel { stroke-width: 4.5; }\n#fios path.alvo { stroke: transparent; stroke-width: 16; pointer-events: stroke; cursor: pointer; }\n#fio-temp { stroke: var(--texto); stroke-dasharray: 6 6; opacity: .8; }\n#vazio { position: absolute; left: 50%; top: 42%; transform: translate(-50%, -50%); max-width: 460px; text-align: center; color: var(--suave); pointer-events: none; }\n#vazio h2 { color: var(--texto); font-weight: 600; margin: 0 0 8px; }\n\n/* rótulos dos fios */\n#camada-rotulos { position: absolute; left: 0; top: 0; }\n.rotulo { position: absolute; transform: translate(-50%, -50%); width: max-content; max-width: 230px; padding: 4px 10px; border-radius: 14px; background: var(--painel);\n  border: 1px solid var(--rosa); font-size: 12px; cursor: text; white-space: pre-wrap; word-break: break-word; box-shadow: 0 0 10px rgba(255,143,209,.25); z-index: 3; }\n.rotulo.video { border-color: var(--azul); box-shadow: 0 0 10px rgba(127,184,255,.25); }\n.rotulo.nota { border-color: var(--verde); box-shadow: none; }\n.rotulo.vazio { color: var(--suave); border-style: dashed; opacity: .75; }\n.rotulo.sel { outline: 2px solid var(--texto); }\n.rotulo textarea { width: 230px; min-height: 60px; background: transparent; border: 0; outline: 0; resize: none; padding: 0; }\n\n/* nós */\n#camada-nos { position: absolute; left: 0; top: 0; }\n.no { position: absolute; width: 240px; background: var(--painel); border: 1px solid var(--borda); border-radius: var(--raio);\n  box-shadow: 0 8px 24px rgba(0,0,0,.35); z-index: 2; }\n.no.gerar { width: 300px; }\n.no.sel { border-color: var(--azul); box-shadow: 0 0 0 1px var(--azul), 0 0 22px rgba(127,184,255,.35); }\n.no.alvo-fio { border-color: var(--verde); box-shadow: 0 0 0 2px var(--verde), 0 0 24px rgba(143,240,192,.4); }\n.cab { display: flex; align-items: center; gap: 6px; height: 40px; padding: 0 10px; cursor: grab; border-bottom: 1px solid var(--borda); }\n.tag { font-size: 10px; font-weight: 700; letter-spacing: .6px; padding: 2px 6px; border-radius: 5px; background: rgba(255,143,209,.15); color: var(--rosa); flex: none; }\n.tag.video { background: rgba(127,184,255,.15); color: var(--azul); }\n.tag.nota { background: rgba(143,240,192,.13); color: var(--verde); }\n.tag.gerar { background: linear-gradient(90deg, rgba(127,184,255,.2), rgba(255,143,209,.2)); color: var(--texto); }\n.titulo { flex: 1; min-width: 0; background: transparent; border: 0; outline: 0; font-weight: 600; padding: 2px 0; text-overflow: ellipsis; }\n.titulo::placeholder { color: var(--suave); font-weight: 400; }\n.cab .x { background: transparent; border: 0; color: var(--suave); cursor: pointer; font-size: 15px; padding: 0 2px; }\n.cab .x:hover { color: var(--vermelho); }\n.porta { position: absolute; top: 13px; width: 14px; height: 14px; border-radius: 50%; background: var(--painel); border: 2px solid var(--rosa); z-index: 4; }\n.porta.saida { right: -8px; cursor: crosshair; }\n.porta.saida:hover { background: var(--rosa); box-shadow: 0 0 10px var(--rosa); }\n.porta.entrada { left: -8px; border-color: var(--verde); }\n.no.video .porta.saida, .no.gerar.saida-video .porta.saida { border-color: var(--azul); }\n.no.nota .porta.saida { border-color: var(--verde); }\n.previa { position: relative; background: #07080d; min-height: 60px; display: flex; align-items: center; justify-content: center; cursor: zoom-in; }\n.previa img, .previa video { display: block; width: 100%; max-height: 320px; object-fit: contain; }\n.previa .vazia { color: var(--suave); padding: 26px 12px; text-align: center; font-size: 12px; cursor: default; }\n.previa .soltar { position: absolute; inset: 0; display: none; align-items: center; justify-content: center; background: rgba(143,240,192,.15); border: 2px dashed var(--verde); color: var(--verde); font-weight: 600; }\n.no.arrastando-arquivo .previa .soltar { display: flex; }\n.rodape { display: flex; align-items: center; gap: 6px; padding: 6px 10px; color: var(--suave); font-size: 11px; }\n.rodape .nome { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.rodape button, .linha button { background: var(--painel2); border: 1px solid var(--borda); border-radius: 6px; padding: 2px 7px; cursor: pointer; color: var(--texto); font-size: 11px; }\n.rodape button:hover, .linha button:hover { border-color: var(--azul); }\n.nota textarea { width: 100%; min-height: 110px; background: transparent; border: 0; outline: 0; resize: vertical; padding: 10px; }\n.controles { padding: 8px 10px 10px; display: flex; flex-direction: column; gap: 7px; }\n.linha { display: flex; gap: 6px; align-items: center; }\n.linha select, .linha input { background: var(--painel2); border: 1px solid var(--borda); border-radius: 6px; padding: 3px 5px; min-width: 0; font-size: 12px; }\n.linha select.modelo { flex: 1; }\n.linha input.duracao { width: 52px; }\n.seg { display: flex; border: 1px solid var(--borda); border-radius: 7px; overflow: hidden; flex: none; }\n.seg button { border: 0; border-radius: 0; background: transparent; padding: 3px 8px; color: var(--suave); }\n.seg button.on { background: rgba(255,143,209,.18); color: var(--texto); }\n.controles textarea { width: 100%; min-height: 44px; background: var(--painel2); border: 1px solid var(--borda); border-radius: 8px; padding: 6px 8px; resize: vertical; outline: 0; font-size: 12px; }\n.controles textarea:focus { border-color: var(--azul); }\n.gerar-btn { flex: 1; background: linear-gradient(90deg, rgba(127,184,255,.28), rgba(255,143,209,.28)) !important; border-color: var(--rosa) !important; font-weight: 600; padding: 5px 8px !important; font-size: 12px !important; }\n.versoes { display: flex; align-items: center; gap: 2px; color: var(--suave); font-size: 11px; }\n.versoes button { padding: 0 5px !important; }\n.barra { height: 4px; border-radius: 3px; background: var(--painel2); overflow: hidden; }\n.barra i { display: block; height: 100%; width: 0; background: linear-gradient(90deg, var(--azul), var(--rosa), var(--verde)); transition: width .4s; }\n.barra.indef i { width: 35%; animation: vai 1.4s ease-in-out infinite; }\n@keyframes vai { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }\n.estado { font-size: 11px; color: var(--suave); }\n.estado.erro { color: var(--vermelho); }\n.enviado { color: var(--verde); font-size: 11px; }\n.no.gerando { border-color: var(--rosa); animation: pulsar 2s ease-in-out infinite; }\n@keyframes pulsar { 50% { box-shadow: 0 0 26px rgba(255,143,209,.45); } }\n\n/* ferramentas */\n#ferramentas { position: fixed; left: 50%; bottom: 14px; transform: translateX(-50%); display: flex; gap: 4px; align-items: center; padding: 5px;\n  background: rgba(20, 24, 38, .95); border: 1px solid var(--borda); border-radius: 12px; z-index: 18; box-shadow: 0 10px 30px rgba(0,0,0,.4); }\n#ferramentas button { background: transparent; border: 1px solid transparent; border-radius: 8px; padding: 6px 10px; cursor: pointer; white-space: nowrap; }\n#ferramentas button:hover { background: var(--painel2); border-color: var(--borda); }\n#ferramentas .sep { width: 1px; height: 22px; background: var(--borda); margin: 0 4px; }\n#zoom { color: var(--suave); font-size: 11px; min-width: 40px; text-align: center; }\n\n#menu-rapido { position: fixed; z-index: 30; background: var(--painel); border: 1px solid var(--borda); border-radius: 10px; padding: 4px; display: flex; flex-direction: column; min-width: 150px; box-shadow: 0 10px 30px rgba(0,0,0,.5); }\n#menu-rapido button { text-align: left; background: transparent; border: 0; padding: 6px 10px; border-radius: 6px; cursor: pointer; }\n#menu-rapido button:hover { background: var(--painel2); }\n\n#avisos { position: fixed; right: 14px; bottom: 14px; display: flex; flex-direction: column; gap: 6px; z-index: 40; max-width: 380px; }\n.aviso { background: var(--painel); border: 1px solid var(--borda); border-left: 3px solid var(--verde); border-radius: 8px; padding: 8px 12px; box-shadow: 0 8px 24px rgba(0,0,0,.4); white-space: pre-wrap; }\n.aviso.erro { border-left-color: var(--vermelho); }\n\n#visor { position: fixed; inset: 0; background: rgba(5,6,10,.88); z-index: 50; display: flex; align-items: center; justify-content: center; cursor: zoom-out; }\n#visor img, #visor video { max-width: 92vw; max-height: 88vh; border-radius: 8px; box-shadow: 0 0 40px rgba(127,184,255,.25); }\n#visor .legenda { color: var(--suave); text-align: center; margin-top: 8px; max-width: 80vw; white-space: pre-wrap; }\n\ndialog { background: var(--painel); color: var(--texto); border: 1px solid var(--borda); border-radius: 14px; width: min(460px, 92vw); padding: 18px 20px; }\ndialog::backdrop { background: rgba(0,0,0,.6); }\ndialog h3 { margin: 0 0 10px; }\ndialog label { display: flex; flex-direction: column; gap: 4px; margin-top: 10px; color: var(--suave); }\ndialog input, dialog select { background: var(--painel2); border: 1px solid var(--borda); border-radius: 8px; padding: 7px 9px; color: var(--texto); }\ndialog .acoes { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }\n\n/* timeline do FilmCraft */\n:root { --linha-h: 200px; }\nbody.com-linha #palco { bottom: var(--linha-h); }\nbody.com-linha #ferramentas { bottom: calc(var(--linha-h) + 14px); }\nbody.com-linha #avisos { bottom: calc(var(--linha-h) + 14px); }\nbody.com-linha #biblioteca { bottom: var(--linha-h); }\n#linha { position: fixed; left: 0; right: 0; bottom: 0; height: var(--linha-h); z-index: 18; background: #0e111b; border-top: 1px solid var(--borda);\n  display: flex; flex-direction: column; }\n.linha-cab { display: flex; align-items: center; gap: 10px; padding: 5px 10px; border-bottom: 1px solid var(--borda); min-height: 36px; }\n.linha-cab b { color: var(--azul); }\n.linha-cab .suave, .suave { color: var(--suave); }\n#linha-tc { font-variant-numeric: tabular-nums; color: var(--rosa); }\n#linha-dica { margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.linha-corpo { flex: 1; display: flex; min-height: 0; }\n#linha-faixas { position: relative; flex: 1; overflow-y: auto; overflow-x: hidden; cursor: text; user-select: none; }\n#linha-regua { position: sticky; top: 0; height: 18px; margin-left: 34px; border-bottom: 1px solid var(--borda); background: #0e111b; z-index: 3; }\n#linha-regua i { position: absolute; top: 0; bottom: 0; border-left: 1px solid var(--borda); font-style: normal; font-size: 10px; color: var(--suave); padding-left: 3px; }\n#linha-regua .marca-fc { position: absolute; top: 2px; width: 9px; height: 9px; margin-left: -4px; transform: rotate(45deg); background: var(--verde); border-radius: 2px; }\n.trilha { position: relative; height: 34px; border-bottom: 1px solid #181d2c; margin-left: 34px; }\n.trilha.audio { height: 20px; }\n.trilha .nome-trilha { position: absolute; left: -34px; width: 30px; top: 0; bottom: 0; display: flex; align-items: center; justify-content: center; font-size: 10px; color: var(--suave); background: var(--painel); }\n.clipe { position: absolute; top: 2px; bottom: 2px; border-radius: 4px; overflow: hidden; border: 1px solid rgba(127,184,255,.55); background-color: rgba(127,184,255,.18);\n  background-repeat: repeat-x; background-size: auto 100%; cursor: grab; }\n.trilha.audio .clipe { border-color: rgba(143,240,192,.5); background-color: rgba(143,240,192,.14); cursor: text; }\n.clipe span { position: absolute; left: 3px; bottom: 1px; right: 3px; font-size: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 1px 2px #000; }\n.clipe.sel { border-color: var(--rosa); box-shadow: inset 0 0 0 1px var(--rosa); }\n.clipe.no-quadro::after { content: \"●\"; position: absolute; right: 3px; top: 0; font-size: 9px; color: var(--rosa); }\n.clipe.off { opacity: .45; }\n#linha-cabeca { position: absolute; top: 0; bottom: 0; width: 0; border-left: 2px solid var(--rosa); pointer-events: none; z-index: 4; box-shadow: 0 0 8px var(--rosa); }\n#linha-alvo { position: absolute; top: 18px; bottom: 0; width: 0; border-left: 2px dashed var(--verde); pointer-events: none; z-index: 4; }\n#linha-alvo::after { content: attr(data-tc); position: absolute; top: 2px; left: 4px; font-size: 11px; color: var(--verde); white-space: nowrap; }\n#linha.soltar #linha-faixas { background: rgba(143,240,192,.05); }\n#linha-monitor { width: calc((var(--linha-h) - 46px) * 16 / 9); flex: none; display: flex; align-items: center; justify-content: center; background: #000; border-left: 1px solid var(--borda); position: relative; }\n#linha-monitor img { max-width: 100%; max-height: 100%; display: block; }\n#linha-monitor span { position: absolute; color: var(--suave); font-size: 11px; padding: 8px; text-align: center; }\n#linha.sem-monitor #linha-monitor { display: none; }\n#linha-off { position: absolute; inset: 36px 0 0 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; background: #0e111b; color: var(--suave); text-align: center; padding: 10px; }\n#linha-off p { margin: 0; max-width: 560px; }\n\n/* seletor de projeto do FilmCraft */\n#fc-projeto span { max-width: 180px; overflow: hidden; text-overflow: ellipsis; display: inline-block; vertical-align: bottom; }\n#fc-sequencia { background: var(--painel2); border: 1px solid var(--borda); border-radius: 8px; padding: 4px 6px; max-width: 200px; }\n#fc-projetos { position: absolute; left: 90px; bottom: calc(100% + 4px); width: min(520px, 90vw); max-height: 60vh; overflow-y: auto; background: var(--painel);\n  border: 1px solid var(--borda); border-radius: 10px; box-shadow: 0 -10px 30px rgba(0,0,0,.5); padding: 8px; z-index: 30; }\n#fc-projetos h5 { margin: 8px 6px 4px; color: var(--suave); font-size: 11px; text-transform: uppercase; letter-spacing: .5px; font-weight: 600; }\n#fc-projetos button.proj { display: block; width: 100%; text-align: left; background: transparent; border: 0; border-radius: 6px; padding: 6px 8px; cursor: pointer; }\n#fc-projetos button.proj:hover { background: var(--painel2); }\n#fc-projetos button.proj small { display: block; color: var(--suave); font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n#fc-projetos button.proj.atual { border-left: 2px solid var(--rosa); }\n#fc-projetos button.proj:disabled { opacity: .45; }\n#fc-projetos .caminho { display: flex; gap: 6px; padding: 6px; }\n#fc-projetos .caminho input { flex: 1; background: var(--painel2); border: 1px solid var(--borda); border-radius: 6px; padding: 5px 8px; }\n.acoes-off { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }\n\n/* guia */\n#guia { position: fixed; top: 48px; right: 0; bottom: 0; width: 280px; background: rgba(14, 17, 27, .96); border-left: 1px solid var(--borda); z-index: 17; display: flex; flex-direction: column; }\nbody.com-linha #guia { bottom: var(--linha-h); }\nbody.com-guia #palco { right: 280px; }\nbody.com-guia #avisos { right: 294px; }\n.guia-cab { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; border-bottom: 1px solid var(--borda); }\n.guia-corpo { overflow-y: auto; padding: 4px 12px 12px; font-size: 12px; }\n.guia-corpo h4 { margin: 14px 0 6px; color: var(--azul); font-size: 12px; text-transform: uppercase; letter-spacing: .6px; }\n.guia-corpo ol { margin: 0; padding-left: 18px; color: var(--texto); }\n.guia-corpo li { margin: 3px 0; }\n.guia-corpo dl { margin: 0; display: grid; grid-template-columns: auto 1fr; gap: 5px 10px; align-items: baseline; }\n.guia-corpo dt { white-space: nowrap; color: var(--texto); }\n.guia-corpo dd { margin: 0; color: var(--suave); }\nkbd { font: 11px/1 \"Segoe UI\", system-ui, sans-serif; background: var(--painel2); border: 1px solid var(--borda); border-bottom-width: 2px; border-radius: 4px; padding: 2px 5px; color: var(--texto); }\n#guia-alternar.primario { border-color: var(--rosa); }\n\n/* seleção em caixa */\n#caixa { position: fixed; border: 1px dashed var(--azul); background: rgba(127,184,255,.08); pointer-events: none; z-index: 19; }\n\n/* aviso de atualização */\n#atualizacao { position: fixed; top: 56px; left: 50%; transform: translateX(-50%); z-index: 45; display: flex; gap: 10px; align-items: center; background: var(--painel);\n  border: 1px solid var(--verde); border-radius: 10px; padding: 8px 10px 8px 14px; box-shadow: 0 0 18px rgba(143,240,192,.25); }\n\n.aviso.pergunta { border-color: var(--rosa); display: flex; flex-direction: column; gap: 8px; }\n.aviso.pergunta .acoes { display: flex; gap: 6px; justify-content: flex-end; }\n.estado button { background: var(--painel2); border: 1px solid var(--borda); border-radius: 6px; padding: 1px 7px; cursor: pointer; margin-left: 4px; }\n.rodape button.on { background: rgba(110,231,183,.2); border-color: #6ee7b7; }\n\n#menus { display: flex; gap: 2px; flex: none; }\n#menus > button { background: transparent; border: 0; border-radius: 6px; padding: 5px 9px; color: var(--suave); cursor: pointer; }\n#menus > button:hover, #menus > button.aberto { color: var(--texto); background: var(--painel2); }\n#menu-aba { position: fixed; z-index: 40; background: var(--painel); border: 1px solid var(--borda); border-radius: 10px; padding: 4px; min-width: 250px; box-shadow: 0 10px 30px rgba(0,0,0,.5); }\n#menu-aba[hidden] { display: none; }\n#menu-aba button { display: flex; justify-content: space-between; gap: 24px; width: 100%; text-align: left; background: transparent; border: 0; padding: 6px 10px; border-radius: 6px; cursor: pointer; color: var(--texto); }\n#menu-aba button:hover { background: var(--painel2); }\n#menu-aba kbd { color: var(--suave); font-size: 11px; }\n#menu-aba hr { border: 0; border-top: 1px solid var(--borda); margin: 4px 2px; }\n@media (max-width: 1100px) { #menus > button { padding: 5px 6px; } }\n.cfg-sec[hidden] { display: none; }\n","icone.svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\"><defs><linearGradient id=\"g\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#7fb8ff\"/><stop offset=\".55\" stop-color=\"#ff8fd1\"/><stop offset=\"1\" stop-color=\"#8ff0c0\"/></linearGradient></defs><rect width=\"64\" height=\"64\" rx=\"14\" fill=\"#0d0f17\"/><circle cx=\"16\" cy=\"20\" r=\"6\" fill=\"#ff8fd1\"/><circle cx=\"16\" cy=\"44\" r=\"6\" fill=\"#7fb8ff\"/><rect x=\"38\" y=\"24\" width=\"18\" height=\"16\" rx=\"4\" fill=\"#8ff0c0\"/><path d=\"M22 20C32 20 30 32 38 32M22 44C32 44 30 32 38 32\" stroke=\"url(#g)\" stroke-width=\"3.5\" fill=\"none\" stroke-linecap=\"round\"/></svg>\n"};
globalThis.__QUADRO_ICO = "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";
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
  atualizacao = () => null, verificarAgora = null, controlePermanente = null, origemAtualizacao = null, abrirApp = null, pastaDoApp = () => null,
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
    return { motor, artcraftKey, falKey, ativo: c.ativo || "", comfyUrl: String(c.comfyUrl || "http://127.0.0.1:8188").replace(/\/+$/, ""), kaggleUser: c.kaggleUser || "", kaggleKey: c.kaggleKey || "" };
  }

  function salvarConfig(mudancas) {
    const c = lerJson(ARQ_CONFIG, {});
    for (const k of ["motor", "artcraftKey", "falKey", "ativo", "comfyUrl", "kaggleUser", "kaggleKey"]) if (mudancas[k] !== undefined) c[k] = mudancas[k];
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
    const GER = ["versoes", "atual", "estado", "job", "progresso", "erro", "envios", "aguardando", "fase"];
    v.nos = v.nos.map((n) => {
      const agora = vivos.get(n.id);
      if (!agora) { if (n.estado === "gerando" && !trabalhos.has(`${doc.nome}:${n.id}`)) { n.estado = n.versoes && n.versoes.length ? "pronto" : "vazio"; delete n.job; delete n.progresso; } return n; }
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
        if (m && m.arquivo === path.basename(saida)) { delete m.artcraft; fs.rmSync(caminhoMini(doc, m.id), { force: true }); } // arquivo regravado: o envio e a miniatura antigos não valem mais
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
      throw new Error(`não consegui falar com o ComfyUI em ${cfg.comfyUrl} (${e.cause && e.cause.code ? e.cause.code : e.message}). Abra o ComfyUI e deixe-o rodando, ou em ⚙ escolha "Nuvem grátis: Kaggle"`);
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

  function receitaTemVideo(saida) {
    try { return Object.values(JSON.parse(fs.readFileSync(arqReceita(saida === "video" ? "video" : "imagem"), "utf8"))).some((n) => /LoadVideo/.test(n.class_type)); } catch (e) { return e.code !== "ENOENT"; }
  }

  // Monta a receita do nó: escolhe a receita, sobe as referências com `subir(nome, bytes, tipo)` (que
  // devolve o nome a usar na receita) e ajusta tamanho e duração. Serve ao ComfyUI local e à nuvem.
  async function montarComfy(doc, no, subir) {
    const video = no.saida === "video";
    let wf;
    try { wf = validarReceita(JSON.parse(fs.readFileSync(arqReceita(video ? "video" : "imagem"), "utf8"))); } catch (e) {
      if (e.code === "ENOENT" && video) wf = RECEITA_WAN22_5B; // sem receita escolhida: usa a pronta, sem pedir nada
      else if (e.code === "ENOENT") throw new Error("para gerar foto por aqui falta a receita de foto do ComfyUI. Em ⚙ escolha o arquivo exportado do ComfyUI (Workflow › Export (API)), ou use o modo Manual");
      else throw e;
    }
    const { prompt, imagens, videos } = montarPrompt(doc, no, { simples: true }); // modelos locais não entendem "imagem 1 = …"
    const sobe = async (ids) => {
      const r = [];
      for (const id of ids) { const m = doc.midias[id]; const ext = path.extname(m.arquivo); r.push(await subir(`quadro_${m.id}${ext}`, fs.readFileSync(caminhoMidia(doc, m)), MIME[ext.toLowerCase()] || "application/octet-stream")); }
      return r;
    };
    const temCargaVideo = Object.values(wf).some((n) => /LoadVideo/.test(n.class_type));
    // Receita que parte de uma imagem: o quadro do vídeo base vira a imagem inicial (a cena continua dele)
    // e as fotos ligadas entram depois, se a receita tiver lugar; o texto do fio diz o que acontece.
    const arqImg = [];
    if (videos.length && !temCargaVideo) {
      // clipe da timeline: o quadro parado em resolução cheia; arquivo de vídeo: a miniatura do início
      const daTimeline = entradas(doc, no).map(({ de }) => de).find((de) => de.fc && de.midia && doc.midias[de.midia] && doc.midias[de.midia].tipo === "imagem");
      const mini = caminhoMini(doc, videos[0]);
      if (daTimeline) { const m = doc.midias[daTimeline.midia]; const ext = path.extname(m.arquivo); arqImg.push(await subir(`quadro_${m.id}${ext}`, fs.readFileSync(caminhoMidia(doc, m)), MIME[ext.toLowerCase()] || "image/png")); }
      else if (fs.existsSync(mini)) arqImg.push(await subir(`quadro_${videos[0]}_inicio.jpg`, fs.readFileSync(mini), "image/jpeg"));
      else if (!imagens.length) throw new Error("não consegui ler o primeiro quadro desse vídeo. Ligue também uma foto do primeiro quadro (ou um clipe da timeline) e gere de novo");
    }
    const vagas = Object.values(wf).filter((n) => n.class_type === "LoadImage").length;
    arqImg.push(...(await sobe(imagens.slice(0, Math.max(0, vagas - arqImg.length))))); // só sobe o que a receita usa
    const arqVid = temCargaVideo ? await sobe(videos) : [];
    const { wf: pronta, deixouDeLado } = injetarReceita(wf, { prompt, imagens: arqImg, videos: arqVid });
    deixouDeLado.imagens += Math.max(0, imagens.length + (arqImg.length > imagens.length ? 1 : 0) - arqImg.length);
    // receita Wan: tamanho e duração vêm do nó (24 quadros/s, múltiplo de 4 + 1, até 5 s)
    const TAM = { "16:9": [832, 480], "9:16": [480, 832], "1:1": [640, 640], "4:3": [736, 544], "3:4": [544, 736], "21:9": [960, 416] };
    for (const n of Object.values(pronta)) {
      if (n.class_type !== "Wan22ImageToVideoLatent") continue;
      const t = TAM[no.proporcao];
      if (t) [n.inputs.width, n.inputs.height] = t;
      const seg = Math.min(5, Math.max(1, Number(no.duracao) || 3));
      n.inputs.length = Math.round((seg * 24) / 4) * 4 + 1;
    }
    const aviso = deixouDeLado.imagens || deixouDeLado.videos ? `a receita só tem lugar para parte das referências: ${deixouDeLado.imagens} imagem(ns) e ${deixouDeLado.videos} vídeo(s) ficaram de fora` : "";
    if (aviso) log(`comfy: ${aviso}`);
    return { pronta, prompt, aviso };
  }

  MOTORES.comfy = {
    nome: "Local (ComfyUI)",
    async iniciar(doc, no, cfg) {
      const { pronta, prompt, aviso } = await montarComfy(doc, no, async (nome, bytes, tipo) => {
        const fd = new FormData();
        fd.append("image", new Blob([bytes], { type: tipo }), nome);
        fd.append("overwrite", "true");
        const r = await comfyPedir(cfg, "/upload/image", { method: "POST", body: fd, timeout: 120000 });
        if (!r.ok) throw new Error(`ComfyUI recusou o envio de ${nome} (HTTP ${r.status})`);
        const j = await r.json();
        return j.subfolder ? `${j.subfolder}/${j.name}` : j.name;
      });
      const r = await comfyPedir(cfg, "/prompt", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: pronta, client_id: "quadro-artcraft" }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        const det = j.node_errors ? Object.values(j.node_errors).map((n) => (n.errors || []).map((e) => e.message).join("; ")).filter(Boolean).join(" | ") : "";
        throw new Error(`ComfyUI recusou a receita: ${(j.error && (j.error.message || j.error)) || `HTTP ${r.status}`}${det ? ` (${det})` : ""}`);
      }
      return { token: j.prompt_id, modelo: "ComfyUI local", prompt, avisoReceita: aviso };
    },
    async consultar(job, cfg) {
      const r = await comfyPedir(cfg, `/history/${encodeURIComponent(job.token)}`, { timeout: 15000 });
      const h = (await r.json().catch(() => ({})))[job.token];
      if (!h) {
        const q = await (await comfyPedir(cfg, "/queue", { timeout: 15000 })).json().catch(() => null);
        const naFila = !q || [...(q.queue_running || []), ...(q.queue_pending || [])].some((x) => Array.isArray(x) && x[1] === job.token);
        if (naFila) { job.sumido = 0; return { fim: false, progresso: 0, fase: "na fila" }; }
        if ((job.sumido = (job.sumido || 0) + 1) < 3) return { fim: false, progresso: 0 };
        const e = new Error("o ComfyUI perdeu este pedido (foi reiniciado?); clique em Gerar de novo");
        e.fatal = true;
        throw e;
      }
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

  // -------------------------------------------------------------------------------------------
  // Nuvem grátis (Kaggle): o quadro liga sozinho uma sessão com GPU no Kaggle do usuário. Lá roda o
  // ComfyUI fechado (sem endereço aberto na internet): ele busca os pedidos num canal secreto do
  // ntfy.sh, gera e devolve o arquivo pelo mesmo canal. Desliga sozinho após um tempo sem pedidos.
  // -------------------------------------------------------------------------------------------
  const KAGGLE_API = process.env.QUADRO_KAGGLE_API || "https://api.kaggle.com/v1/kernels.KernelsApiService/";
  const SLUG_KAGGLE = "quadro-gpu";
  const OCIOSO_MIN = 25;
  const NTFY = process.env.QUADRO_NTFY || "https://ntfy.sh/";

  function scriptKaggle(topico) {
    return `# Quadro ArtCraft: ComfyUI com GPU grátis, ligado e desligado pelo próprio quadro.
# Não abre nenhum endereço: busca os pedidos no canal secreto do quadro e devolve o resultado por lá.
import os, subprocess, sys, time, json, re, glob, urllib.request
T = ${JSON.stringify(topico)}
NTFY = "https://ntfy.sh/"
OCIOSO_S = ${OCIOSO_MIN} * 60
LIMITE_S = 11.5 * 3600
inicio = time.time()

def http(url, dados=None, metodo=None, cab=None, t=60):
    req = urllib.request.Request(url, data=dados, method=metodo, headers=cab or {})
    return urllib.request.urlopen(req, timeout=t).read()

def avisar(canal, msg):
    for _ in range(3):
        try: http(NTFY + T + "-" + canal, msg.encode(), "POST"); return
        except Exception as e: print("aviso falhou:", e); time.sleep(5)

avisar("estado", "instalando")
BASE = "/kaggle/working/ComfyUI" if os.path.isdir("/kaggle/working") else "/tmp/ComfyUI"
if not os.path.exists(BASE):
    subprocess.run(["git", "clone", "--depth", "1", "https://github.com/comfyanonymous/ComfyUI", BASE], check=True)
reqs = [l for l in open(BASE + "/requirements.txt").read().splitlines() if not re.match(r"^(torch|torchvision|torchaudio)\\b", l.strip())]
open("/tmp/req.txt", "w").write("\\n".join(reqs))
subprocess.run([sys.executable, "-m", "pip", "install", "-q", "-r", "/tmp/req.txt"], check=True)

avisar("estado", "baixando")
HF = "https://huggingface.co/Comfy-Org/Wan_2.2_ComfyUI_Repackaged/resolve/main/split_files"
for sub, nome in [("diffusion_models", "wan2.2_ti2v_5B_fp16.safetensors"), ("text_encoders", "umt5_xxl_fp8_e4m3fn_scaled.safetensors"), ("vae", "wan2.2_vae.safetensors")]:
    destino = BASE + "/models/" + sub + "/" + nome
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    if not (os.path.exists(destino) and os.path.getsize(destino) > 10_000_000):
        subprocess.run(["wget", "-q", "-c", "-O", destino, HF + "/" + sub + "/" + nome], check=True)

avisar("estado", "ligando")
comfy = subprocess.Popen([sys.executable, "main.py", "--listen", "127.0.0.1", "--port", "8188"], cwd=BASE, stdout=open("/tmp/comfy.log", "w"), stderr=subprocess.STDOUT)
def local(rota, dados=None, t=10):
    return json.loads(http("http://127.0.0.1:8188" + rota, dados, "POST" if dados else None, {"Content-Type": "application/json"} if dados else None, t))
for _ in range(180):
    try: local("/system_stats", t=2); break
    except Exception: time.sleep(2)
else:
    print(open("/tmp/comfy.log").read()[-4000:]); avisar("estado", "erro:o ComfyUI não subiu na nuvem"); raise SystemExit(1)
print("ComfyUI ligado:", [d.get("name") for d in local("/system_stats").get("devices", [])])

def fazer(pedido):
    pid = pedido["id"]
    for a in pedido.get("anexos", []):
        nome = os.path.basename(a["nome"])
        open(os.path.join(BASE, "input", nome), "wb").write(http(a["url"], t=300))
    pr = local("/prompt", json.dumps({"prompt": pedido["receita"], "client_id": "quadro-nuvem"}).encode())["prompt_id"]
    t0 = time.time()
    while time.time() - t0 < 40 * 60:
        time.sleep(5)
        if comfy.poll() is not None: raise RuntimeError("o ComfyUI parou na nuvem")
        h = local("/history/" + pr).get(pr)
        if not h: continue
        st = h.get("status", {})
        if st.get("status_str") == "error":
            msg = [m[1] for m in st.get("messages", []) if m[0] == "execution_error"]
            raise RuntimeError("a geração falhou: " + (msg[0].get("exception_message", "") if msg else "erro no ComfyUI"))
        if not st.get("completed"): continue
        arqs = [f for o in h.get("outputs", {}).values() for k in ("videos", "gifs", "images") for f in o.get(k, []) if f.get("type") != "temp"]
        if not arqs: raise RuntimeError("a receita não salvou nenhum arquivo")
        f = sorted(arqs, key=lambda f: 0 if re.search(r"\\.(mp4|webm|mov)$", f["filename"]) else 1)[0]
        caminho = os.path.join(BASE, "output", f.get("subfolder", ""), f["filename"])
        http(NTFY + T + "-feito", open(caminho, "rb").read(), "PUT", {"Filename": pid + os.path.splitext(caminho)[1], "Message": "ok:" + pid}, 300)
        return
    raise RuntimeError("passou de 40 minutos sem terminar")

feitos = set()
ultimo = time.time(); batida = 0
while time.time() - inicio < LIMITE_S and time.time() - ultimo < OCIOSO_S:
    if time.time() - batida > 120:
        avisar("estado", "pronta"); batida = time.time()
    try:
        linhas = http(NTFY + T + "-pedido/json?poll=1&since=40m", t=30).decode().splitlines()
    except Exception as e:
        print("busca falhou:", e); time.sleep(15); continue
    for l in linhas:
        m = json.loads(l)
        if m.get("event") != "message" or m["id"] in feitos or not m.get("attachment"): continue
        feitos.add(m["id"])
        pid = m.get("message", "")
        try:
            fazer(json.loads(http(m["attachment"]["url"])))
        except Exception as e:
            print("pedido", pid, "falhou:", e)
            avisar("feito", "erro:" + pid + ":" + str(e)[:300])
        ultimo = time.time()
    time.sleep(8)
avisar("estado", "desligada")
print("desligando por falta de uso")
`;
  }

  function topicoKaggle() {
    const c = lerJson(ARQ_CONFIG, {});
    if (c.kaggleTopico && /^[a-z0-9]{24,}$/.test(c.kaggleTopico)) return c.kaggleTopico;
    c.kaggleTopico = `quadro${crypto.randomBytes(16).toString("hex")}`;
    gravarJson(ARQ_CONFIG, c);
    return c.kaggleTopico;
  }

  async function kagglePedir(cfg, metodo, corpo) {
    if (!cfg.kaggleUser || !cfg.kaggleKey) throw new Error("falta ligar sua conta do Kaggle: em ⚙ › Nuvem grátis, cole seu usuário e o token do Kaggle (kaggle.com › Settings › API)");
    const auth = /^KGAT_/.test(cfg.kaggleKey) ? `Bearer ${cfg.kaggleKey}` : `Basic ${Buffer.from(`${cfg.kaggleUser}:${cfg.kaggleKey}`).toString("base64")}`;
    const r = await fetch(KAGGLE_API + metodo, {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: auth, "User-Agent": "kaggle-api/v1.7.0" },
      body: JSON.stringify(corpo), signal: AbortSignal.timeout(60000),
    }).catch((e) => { throw new Error(`não consegui falar com o Kaggle (${e.cause && e.cause.code ? e.cause.code : e.message})`); });
    const j = await r.json().catch(() => ({}));
    if (r.status === 401 || r.status === 403) throw new Error("o Kaggle recusou o token: confira em ⚙ o usuário e o token (ou gere um token novo em kaggle.com › Settings › API)");
    if (!r.ok || (j.code && j.code >= 400)) { const e = new Error(`Kaggle: ${j.message || j.error || `HTTP ${r.status}`}`); e.status = r.status || j.code; throw e; }
    if (j.error) throw new Error(`Kaggle: ${j.error}`);
    return j;
  }

  async function kaggleSituacao(cfg) {
    try {
      const j = await kagglePedir(cfg, "GetKernelSessionStatus", { userName: cfg.kaggleUser, kernelSlug: SLUG_KAGGLE });
      return { status: String(j.status || "QUEUED"), falha: j.failureMessage || "" };
    } catch (e) {
      if (e.status === 404) return { status: "NENHUMA", falha: "" };
      throw e;
    }
  }

  async function kaggleLigar(cfg) {
    const corpo = {
      slug: `${cfg.kaggleUser}/${SLUG_KAGGLE}`, newTitle: SLUG_KAGGLE, text: scriptKaggle(topicoKaggle()), language: "python", kernelType: "script",
      isPrivate: true, enableGpu: true, enableInternet: true, datasetDataSources: [], kernelDataSources: [], competitionDataSources: [], modelDataSources: [], categoryIds: [],
      machineShape: "NvidiaTeslaT4",
    };
    try { return await kagglePedir(cfg, "SaveKernel", corpo); } catch (e) {
      if (!/machine|shape|accelerator/i.test(e.message)) throw e;
      delete corpo.machineShape; // conta sem T4: fica com a GPU padrão do Kaggle
      return kagglePedir(cfg, "SaveKernel", corpo);
    }
  }

  // Mensagens de um canal do quadro no ntfy.sh (as mais novas por último).
  async function canal(nome, desde = "1h") {
    const r = await fetch(`${NTFY}${topicoKaggle()}-${nome}/json?poll=1&since=${desde}`, { signal: AbortSignal.timeout(20000) }).catch(() => null);
    if (!r || !r.ok) return null;
    return (await r.text()).split("\n").map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter((m) => m && m.event === "message");
  }
  async function publicarArquivo(nomeCanal, nome, bytes, mensagem) {
    if (bytes.length > 14 * 1024 * 1024) throw new Error(`${nome} passa de 14 MB, o limite para mandar à nuvem. Use uma versão menor da imagem`);
    const r = await fetch(`${NTFY}${topicoKaggle()}-${nomeCanal}`, { method: "PUT", body: bytes, headers: { Filename: nome, ...(mensagem ? { Message: mensagem } : {}) }, signal: AbortSignal.timeout(300000) })
      .catch((e) => { throw new Error(`não consegui mandar ${nome} para a nuvem (${e.message})`); });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.attachment) throw new Error(`não consegui mandar ${nome} para a nuvem (HTTP ${r.status})`);
    return j.attachment.url;
  }

  // Estado da GPU pela última batida: "pronta" vale por 5 minutos.
  async function gpuEstado() {
    const ms = await canal("estado", "12h");
    const m = ms && ms[ms.length - 1];
    if (!m) return { estado: "desligada", quando: 0 };
    const quando = m.time * 1000;
    if (m.message === "pronta" && Date.now() - quando > 5 * 60 * 1000) return { estado: "desligada", quando };
    return { estado: m.message, quando };
  }

  const FASES_KAGGLE = { instalando: "Ligando a GPU na nuvem (1/3)", baixando: "Baixando o modelo na nuvem (2/3)", ligando: "Abrindo o gerador na nuvem (3/3)" };
  let gpuLigando = null;

  async function garantirGpu(cfg, fase) {
    if (gpuLigando) return gpuLigando;
    gpuLigando = (async () => {
      const agora = await gpuEstado();
      if (agora.estado === "pronta") return;
      fase("Ligando a GPU na nuvem");
      const desde = Date.now();
      const sit = await kaggleSituacao(cfg);
      if (!/RUNNING|QUEUED|NEW_SCRIPT/.test(sit.status)) await kaggleLigar(cfg);
      const limite = Date.now() + 30 * 60 * 1000;
      let conferido = Date.now();
      while (Date.now() < limite) {
        await new Promise((ok) => setTimeout(ok, 15000));
        const g = await gpuEstado();
        if (g.quando >= desde - 60000) {
          if (g.estado === "pronta") return;
          if (g.estado.startsWith("erro:")) throw new Error(`a nuvem do Kaggle falhou: ${g.estado.slice(5)}`);
          if (FASES_KAGGLE[g.estado]) fase(FASES_KAGGLE[g.estado]);
        }
        if (Date.now() - conferido > 90000) {
          conferido = Date.now();
          const s = await kaggleSituacao(cfg).catch(() => null);
          if (s && /ERROR|COMPLETE|CANCEL/.test(s.status)) {
            throw new Error(`a sessão do Kaggle parou${s.falha ? `: ${s.falha}` : ""}. Confira em kaggle.com se o telefone da conta está verificado (é exigido para usar GPU com internet)`);
          }
        }
      }
      throw new Error("a GPU do Kaggle não ligou em 30 minutos. Veja em kaggle.com › Code › quadro-gpu o que aconteceu");
    })();
    try { return await gpuLigando; } finally { gpuLigando = null; }
  }

  MOTORES.kaggle = {
    nome: "Nuvem grátis (Kaggle)",
    async iniciar(doc, no, cfg) {
      const fase = (texto) => { no.fase = texto; avisar(doc.nome, { tipo: "progresso", no: no.id, progresso: 0, fase: texto }); };
      await garantirGpu(cfg, fase);
      fase("Mandando para a nuvem");
      const anexos = [];
      const { pronta, prompt, aviso } = await montarComfy(doc, no, async (nome, bytes) => {
        anexos.push({ nome, url: await publicarArquivo("arq", nome, bytes) });
        return nome;
      });
      const id = `p${crypto.randomBytes(8).toString("hex")}`;
      await publicarArquivo("pedido", `${id}.json`, Buffer.from(JSON.stringify({ id, receita: pronta, anexos })), id);
      fase("Gerando na nuvem");
      return { token: id, inicio: Date.now(), modelo: "Wan 2.2 5B (nuvem Kaggle)", prompt, avisoReceita: aviso };
    },
    async consultar(job) {
      // o ntfy.sh limita as consultas: olha o canal a cada 15 s
      if (job.olhado && Date.now() - job.olhado < 15000) return { fim: false, progresso: 0 };
      job.olhado = Date.now();
      const ms = await canal("feito", "1h");
      if (!ms) return { fim: false, progresso: 0 };
      for (const m of ms) {
        if (m.message === `ok:${job.token}` && m.attachment) return { fim: true, url: m.attachment.url, ext: path.extname(m.attachment.name || ".mp4").toLowerCase() };
        if (typeof m.message === "string" && m.message.startsWith(`erro:${job.token}:`)) { const e = new Error(`a nuvem respondeu: ${m.message.slice(job.token.length + 6)}`); e.fatal = true; throw e; }
      }
      if (Date.now() - job.inicio > 3 * 60 * 1000 && Date.now() - (job.batida || 0) > 60000) {
        job.batida = Date.now();
        const g = await gpuEstado();
        if (g.estado !== "pronta") { const e = new Error("a GPU na nuvem se desligou antes de terminar; clique em Gerar de novo"); e.fatal = true; throw e; }
      }
      return { fim: false, progresso: 0 };
    },
  };

  async function kaggleEstado() {
    const cfg = config();
    if (!cfg.kaggleUser || !cfg.kaggleKey) return { conta: false };
    const g = await gpuEstado().catch(() => ({ estado: "desligada" }));
    return { conta: true, usuario: cfg.kaggleUser, ligada: g.estado === "pronta", ligando: !!gpuLigando || !!FASES_KAGGLE[g.estado] };
  }

  const semChaves = (msg, cfg = config()) => [cfg.artcraftKey, cfg.falKey, cfg.kaggleKey].filter((k) => k && k.length > 6).reduce((t, k) => t.split(k).join("***"), String(msg));

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
        if (!["comfy", "kaggle"].includes(motorId) || receitaTemVideo(no.saida)) await prepararTrechos(doc, no); // receita só de imagem não usa o vídeo base
        const info = await motor.iniciar(doc, no, cfg);
        no.job = { ...no.job, ...info };
        salvar(doc);
        await acompanhar(doc, no);
      } catch (e) {
        no.estado = "erro"; no.erro = semChaves(e.message, cfg); delete no.job; delete no.fase;
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
    let limite = no.job.inicio + 45 * 60 * 1000;
    let falhasRede = 0;
    while (Date.now() < limite) {
      await new Promise((r) => setTimeout(r, 4000));
      const atual = acharNo(doc, no.id);
      if (!atual) return; // nó apagado
      if (atual !== no) { Object.assign(atual, { estado: "gerando", job: no.job }); no = atual; } // voltou com Ctrl+Z

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
        delete no.job; delete no.progresso; delete no.fase;
        salvar(doc);
        return;
      }
      if (r.fase === "na fila") limite = Date.now() + 45 * 60 * 1000; // o tempo só conta depois que sai da fila
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
    if (!(await appAberto("filmcraft"))) throw new Error("o FilmCraft não está aberto com o controle ligado (abra a timeline com T e clique em 📂 Escolher projeto e abrir)");
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
      if (rota === "/api/kaggle") return json(res, 200, await kaggleEstado());
      if (rota === "/api/config") {
        const c = config();
        return json(res, 200, {
          motor: c.motor, comfyUrl: c.comfyUrl, comfy: fs.existsSync(arqReceita("imagem")) || fs.existsSync(arqReceita("video")), artcraft: !!c.artcraftKey, fal: !!c.falKey, kaggle: c.kaggleUser || "", modelos: MODELOS, pasta: RAIZ, versao: VERSAO,
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
      if (rota === "/api/atualizacao/verificar") {
        let erro = "";
        if (verificarAgora) await verificarAgora().catch((e) => { erro = e.message; });
        return json(res, 200, { versao: VERSAO, pronta: atualizacao(), podeReiniciar: !!reiniciar, erro });
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
        if (corpo.motor !== undefined) m.motor = ["artcraft", "fal", "comfy", "kaggle", "manual"].includes(corpo.motor) ? corpo.motor : undefined;
        if (corpo.artcraftKey !== undefined) m.artcraftKey = String(corpo.artcraftKey).trim();
        if (corpo.falKey !== undefined) m.falKey = String(corpo.falKey).trim();
        if (corpo.comfyUrl !== undefined) { const u = String(corpo.comfyUrl).trim(); if (u && !/^http:\/\/(127\.0\.0\.1|localhost|\[::1\])(:\d+)?\/?$/i.test(u) && !/^https?:\/\/[\w.-]+(:\d+)?\/?$/i.test(u)) throw new Error("endereço do ComfyUI inválido (ex.: http://127.0.0.1:8188)"); m.comfyUrl = u || "http://127.0.0.1:8188"; }
        if (corpo.kaggle !== undefined) { // conteúdo do kaggle.json, ou { username, key }
          let k = corpo.kaggle;
          if (typeof k === "string") { try { k = JSON.parse(k); } catch { throw new Error("esse arquivo não é o kaggle.json"); } }
          const user = String((k && k.username) || "").trim(), key = String((k && k.key) || "").trim();
          if (!/^[\w-]{2,}$/.test(user) || key.length < 10) throw new Error("usuário ou token do Kaggle inválido");
          m.kaggleUser = user; m.kaggleKey = key;
          if (corpo.motor === undefined) m.motor = "kaggle";
        }
        salvarConfig(m);
        if (corpo.github !== undefined && origemAtualizacao) origemAtualizacao.gravar(corpo.github); // por último: se for inválido, o resto já ficou salvo
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

const VERSAO = "2.8.3";
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

const quadro = __quadroModulo()({
  DADOS, log, VERSAO, prepararApp, sessao, appAberto: (id) => portaAberta(APPS[id].porta),
  atualizacao: () => atualizar.pronta(), verificarAgora: () => atualizar.verificar(VERSAO, log), controlePermanente,
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

