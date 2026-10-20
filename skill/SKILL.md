---
name: artcraft-edicao
description: Use quando o Vinícius ditar ordens de edição para os apps ArtCraft (PhotoCraft, FilmCraft, EffectCraft e os outros), pedir para mexer num arquivo aberto neles, ou falar de cenas, do quadro, de gerar fotos/vídeos ("cena 4", "melhora essa cena", "gera o plano").
---

# Edição por comando nos apps ArtCraft

O conector "ArtCraft para Claude" dá acesso aos apps da suíte ArtCraft instalados no computador do Vinícius. Ele dita ordens em português, às vezes curtas ou vagas ("corta aqui", "deixa mais quente", "tira esse fundo"). Seu trabalho é transformar a ordem em comandos reais do app, executar e mostrar o resultado.

## Qual app usar

| Pedido fala de... | App |
|---|---|
| vídeo, timeline, corte, clipe, trilha, cor do vídeo, legenda | filmcraft |
| motion, animação, composição, keyframe, VFX, render | effectcraft |
| foto, camada, máscara, retoque, recorte de imagem | photocraft |
| RAW, revelação, catálogo de fotos, exposição em lote | lightcraft |
| vetor, logo, ilustração, SVG | vectorcraft |
| áudio, voz, mixagem, ruído | soundcraft |
| PDF | pdfcraft (só modo arquivo) |
| diagramação, revista, layout de página | designcraft |
| interface, protótipo, tela de app | figcraft |
| documento de texto | wordcraft · slides: deckcraft · planilha: gridcraft · CAD: cadcraft |

Se a ordem não diz o app e só um está aberto, use esse.

## Fluxo

1. `artcraft_status` para ver o que está instalado e aberto.
2. Se o app está fechado, `artcraft_abrir`. Se está "aberto SEM canal de controle", peça para ele salvar e fechar, e reabra com `artcraft_abrir`. Se isso acontecer sempre, sugira `artcraft_controle_permanente` uma vez.
3. `artcraft_ferramentas` do app (uma vez por conversa) para conhecer as ferramentas e ler as instruções do próprio app. Muitos seguem o padrão `command_list`, `command_run`, `command_batch`, `doc_inspect`, `render_preview`, e na janela `ui_inspect` e `ui_screenshot`. Outros usam nomes próprios (o GridCraft usa `set_cell`, `execute_command`...); siga a lista.
4. Entenda o estado antes de editar: `doc_inspect` (no FilmCraft também `sequence_inspect`) para pegar ids de clipes, camadas, faixas e o que está selecionado.
5. Ache o comando: `command_list` (ou `list_commands`) com filtro em inglês (ex.: "razor", "fade", "blur", "crop", "levels"). Os ids são em inglês, como `timeline.razor` ou `effects.apply`. Confira os `params` e se está `enabled`.
6. Execute com `command_run` (um passo) ou `command_batch` (vários passos em ordem).
7. Confira: `render_preview` ou `ui_screenshot`, e diga em uma frase o que mudou.
8. Ficou errado? `edit.undo` (ou a ferramenta `undo` do app), uma vez por passo desfeito.

## Como interpretar ordens faladas

- "aqui", "nesse ponto": posição atual do playhead ou a seleção atual (veja em `doc_inspect`).
- Tempo: aceite "aos 12 segundos", "no 1:05", "frame 300". No FilmCraft os comandos aceitam `seconds`, `frame` ou `timecode`; internamente o tempo é em ticks (254016000000 por segundo).
- Faixas pelo nome: "V1", "A2".
- Ajustes vagos ("mais quente", "mais contraste", "suave"): aplique um valor moderado, mostre a prévia e pergunte se quer mais ou menos.
- Se a ordem for ambígua e errar custar caro (apagar, sobrescrever), pergunte em uma linha antes. Se for barato desfazer, faça e mostre.

## Regras

- Nunca salve por cima do arquivo original, exporte sobrescrevendo, apague arquivos ou feche documentos sem ele pedir. Para salvar, prefira "salvar como" com um nome novo.
- Mudança grande ou experimental: duplique o documento ou a sequência antes.
- Exportações longas: avise que começou; no FilmCraft `file.exportMedia` com `wait: true` espera terminar.
- No modo arquivo, os apps só leem e gravam nas pastas configuradas no conector; se um caminho for recusado, diga qual pasta precisa ser liberada.
- Responda curto, em português, dizendo o que foi feito e mostrando a prévia quando houver.

## Quadro de Cenas (ferramentas quadro_*)

O quadro roda em http://localhost:7700 enquanto o Claude Desktop está aberto. Cada cena tem nós de **mídia** (fotos de personagem, cenário), **notas** (roteiro, direção) e nós **Gerar** (foto ou vídeo). Os fios ligam referências ao nó Gerar, e **o texto escrito no fio é a instrução** ("usar essa pessoa neste cenário"). Um Gerar pronto pode ligar em outro Gerar de vídeo (a foto vira o quadro inicial).

Fluxo econômico:

1. "Cena 4": `quadro_ver` com `cena: "4"`. O resumo já traz ids, arquivos, estado e o texto dos fios. Só peça `miniaturas` dos nós que precisa enxergar.
2. Melhorar: reescreva os textos dos fios / `prompt` do nó com `quadro_editar` (vários itens num lote). Prompts objetivos: sujeito, ação, enquadramento, luz, lente, clima. Não repita o que a referência já mostra.
3. Gerar gasta créditos: só `quadro_gerar` quando ele pedir. Foto com `aguardar: true`; vídeo demora, confira depois com `quadro_ver`.
4. Levar para a edição: `quadro_enviar` (`app: filmcraft` para montagem, `effectcraft` para VFX/motion, `ambos`). Entra num bin/pasta com o nome da cena.
5. Edição em andamento: `quadro_timeline` com `acao: "ver"` mostra a sequência aberta no FilmCraft em texto (faixas, clipes com tempos, marcadores, playhead); `quadro: true` só quando precisar enxergar o frame. `importar` traz os clipes de vídeo como nós de uma cena (frame limpo de cada clipe); `colocar` põe o resultado de um nó no playhead (ou em `segundos`) numa faixa livre, sem cobrir a edição.
6. Arquivo do PC dele: `quadro_editar` com `{op: "no", tipo: "midia", arquivo: "C:\Users\...\foto.png"}`.

Responda em uma ou duas frases: o que mudou e o que falta (ex.: "Fios da cena 4 reescritos; quer que eu gere?").
