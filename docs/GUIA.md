# ArtCraft para Claude 2.3 · Quadro de Cenas

Esta versão substitui as anteriores. **A partir da 2.2 o programa e a extensão se atualizam sozinhos**: quando sai versão nova, aparece no quadro o aviso "Versão X pronta · Reiniciar e atualizar". Tudo o que o conector já fazia continua igual (o Claude controla os 13 apps ArtCraft), e agora ele traz o **Quadro de Cenas**: um quadro de nós no navegador, no estilo Miro / nós do Blender e DaVinci.

- Você sobe as fotos (personagem, cenário), puxa um fio de uma para um nó **Gerar** e escreve no fio o que quer: "usar essa pessoa neste cenário, plano médio, luz de fim de tarde".
- O nó Gerar cria a foto ou o vídeo com os modelos da ArtCraft (Nano Banana, Seedream, GPT Image, Seedance, Kling, Veo…) e guarda as versões.
- Uma foto pronta pode ligar num nó **Gerar vídeo**: ela vira o quadro inicial e o texto do fio vira o movimento.
- Os botões **FC** e **EC** (ou "Cena → FilmCraft") importam o resultado no FilmCraft ou no EffectCraft, num bin/pasta com o nome da cena ("Cena 4").
- O Claude enxerga e edita o mesmo quadro. Dá para pedir "melhora os prompts da cena 4", "gera o plano 2" ou "manda a cena 4 pro FilmCraft".

## Novo na 2.6: gerar na sua placa de vídeo (ComfyUI, grátis)

1. Instale o **ComfyUI** (comfy.org/download, versão Desktop) e abra-o. Ele roda os modelos abertos na sua placa de vídeo; sem custo por geração.
2. No ComfyUI, abra **Templates** e escolha um modelo de vídeo que caiba na sua placa (por exemplo Wan 2.2 ou LTX, imagem para vídeo). Deixe ele baixar os modelos e teste uma geração.
3. Com o teste funcionando: **Workflow › Export (API)** e salve o arquivo. Faça o mesmo com um modelo de foto, se quiser.
4. No quadro: ⚙ › motor **Local: ComfyUI** › escolha o arquivo em "Receita de vídeo" (e "de foto"). O quadro mostra se o ComfyUI está ligado e qual é a sua placa.
5. Ligue vídeos e imagens num nó **Gerar** e aperte Gerar: o quadro troca o prompt e as referências na receita, manda rodar e traz o resultado de volta ao nó.

Limites: a receita decide quantas imagens/vídeos entram (um nó de carga por referência) e a qualidade depende do modelo e da placa. Vídeo "mesmo take + elemento novo" pede um modelo com referência de vídeo (família VACE) e placa grande.

## Novo na 2.5: vídeo base + PNGs, ícone próprio

- **Vídeo base + imagens → vídeo novo, sozinho.** Traga o clipe da timeline (Sequência → cena, ou arraste da timeline), ligue-o e os PNGs num nó **Gerar vídeo** e escreva o que quer. O botão 🎬 no clipe decide se vai o **vídeo do trecho** (padrão para clipes de vídeo: o FilmCraft exporta o trecho, até 15 s) ou só o quadro parado. Com a chave da ArtCraft, o resultado volta sozinho para o nó; use ⇄ para trocar o clipe na timeline.
- **Números nos fios**: cada ligação mostra "imagem 1", "imagem 2", "vídeo 1", a mesma ordem em que o prompt cita as referências.
- **Ícone**: o programa tem ícone próprio e cria o atalho "Quadro ArtCraft" na Área de Trabalho na primeira abertura.
- Vídeo base só funciona com o motor ArtCraft (a fal.ai não aceita vídeo de referência).

## Novo na 2.3

- **Modo Manual sem arrastar:** ao clicar em Gerar, o quadro copia o prompt, abre a pasta das referências e fica esperando. Gere no ArtCraft: com **Settings › Downloads › Auto Download** ligado no ArtCraft, o resultado já é salvo sozinho e entra no nó como versão nova. Sem isso, clique em baixar no ArtCraft. O quadro olha a pasta de download escolhida no ArtCraft, Downloads, Documentos, Área de Trabalho, Vídeos e Imagens (inclusive no OneDrive).
- **Trocar o clipe na timeline:** quando um nó que veio da timeline ganha versão nova, o quadro pergunta "Substituir o clipe na timeline?". Em Substituir, o clipe original vira o resultado, no mesmo lugar e com a mesma duração (Ctrl+Z no FilmCraft desfaz). O botão ⇄ no nó faz o mesmo quando você quiser.
- **Geração 100% automática** precisa de uma chave: a da API ArtCraft (liberada pela equipe deles) ou a da fal.ai (paga por vídeo), no ⚙.

## Novo na 2.2

- **Atualização automática.** O programa confere se há versão nova ao abrir e a cada 6 horas, baixa sozinho e mostra o aviso para reiniciar. A extensão do Claude Desktop usa a mesma versão baixada quando o Claude é reiniciado.
- **📂 Projeto** na timeline: escolhe o projeto do FilmCraft (recentes do FilmCraft e os .fcproj achados em Documentos, Vídeos, Área de Trabalho e Downloads) e a sequência. Se o projeto aberto tiver mudanças, o quadro pergunta antes de salvar e trocar.
- **Sincronização permanente**: se o FilmCraft já estiver aberto sem sincronizar, o botão "Ligar sincronização permanente" resolve de vez. Depois disso, feche e abra o FilmCraft uma vez; a partir daí qualquer projeto que você abrir (até pelo launcher) já aparece no quadro.
- **Atalhos** e um **guia** na lateral direita (botão **?** ou tecla ?): desfazer/refazer, copiar/colar nós, duplicar, seleção em caixa, setas no playhead e mais.

## Novo na 2.1: a timeline do FilmCraft dentro do quadro

O FilmCraft ainda não aceita plugins (a própria equipe lista isso como pendente), então o quadro conversa com ele pelo canal de controle. Clique em **🎞 Timeline** no topo do quadro e a sequência aberta no FilmCraft aparece embaixo, ao vivo, com as faixas, os clipes, os marcadores, o playhead e o monitor do programa.

| Ação | Como |
|---|---|
| Ver a timeline | botão **🎞 Timeline**; se o FilmCraft estiver fechado, **Abrir FilmCraft** abre com o controle ligado |
| Mover o playhead do FilmCraft | clique ou arraste na timeline do quadro |
| Trazer a sequência inteira | **Sequência → cena**: cria uma cena com o nome da sequência, um nó por clipe, na ordem do filme |
| Trazer um clipe só | arraste o clipe da timeline para o quadro (ou duplo clique nele) |
| Mandar um resultado para a timeline | botão **TL** no nó (vai para o playhead), ou arraste o nó / uma foto da Biblioteca para cima da timeline, no ponto exato |

O resultado entra na primeira faixa de vídeo livre naquele trecho. Se não houver faixa livre, o quadro cria uma nova (V2, V3…), então nunca cobre o que já está editado. Clipes que já estão no quadro aparecem com uma bolinha rosa.

## Jeito mais rápido: o programa (sem depender da extensão)

1. Baixe `quadro-artcraft-windows.zip`, extraia e dê dois cliques em **Quadro ArtCraft.exe** (pode deixar na Área de Trabalho).
2. Se o Windows mostrar "O Windows protegeu o computador", clique em **Mais informações › Executar assim mesmo** (o programa não tem assinatura digital paga; é o Node.js oficial com o quadro dentro).
3. Abre uma janela preta e o navegador já entra em http://localhost:7700. Deixe a janela preta aberta enquanto usa; para parar, feche-a.

O programa faz tudo do quadro (gerar, versões, FC/EC para FilmCraft e EffectCraft). A extensão do Claude Desktop é o que deixa o Claude ler e mexer no quadro por você; quando as duas estão abertas, elas usam o mesmo quadro.

## Instalar a extensão (para o Claude mexer no quadro)

1. Baixe `artcraft-claude.mcpb`.
2. No Claude Desktop: Configurações (Ctrl + vírgula) > Extensões > Configurações avançadas > Instalar extensão… e escolha o arquivo. Ele atualiza a versão 1.0 que já está instalada.
3. Na tela de configuração, cole a **chave da API ArtCraft** se já tiver (dá para colar depois no ⚙ do quadro).
4. Numa conversa nova, peça: "Claude, abre o quadro". Ou abra direto no navegador: **http://localhost:7700** (funciona enquanto o Claude Desktop estiver aberto).

## Usando o quadro

| Ação | Como |
|---|---|
| Subir foto ou vídeo | arraste do Windows para o quadro, cole com Ctrl+V, ou botão 🖼 Mídia |
| Criar nó Gerar | puxe um fio da bolinha da direita de uma foto e solte no vazio |
| Ligar mais referências | puxe o fio de outra foto até o nó Gerar |
| Escrever o que gerar | clique no rótulo do fio ("＋ o que gerar?"); Enter salva |
| Foto ou vídeo, modelo, proporção, duração | nos controles do nó Gerar |
| Versões | ‹ › no nó Gerar; gerar de novo cria v2, v3… |
| Resultado feito por fora | arraste o arquivo para cima do nó Gerar (vira nova versão) |
| Notas de roteiro | botão ✎ Nota; ligada num Gerar, o texto entra no prompt |
| Cenas | abas no topo; ＋ cena; duplo clique na aba renomeia (vazio apaga) |
| Reusar uma foto em outra cena | arraste da Biblioteca (coluna da esquerda) |
| Mover / zoom | arraste o fundo / roda do mouse; F enquadra a cena |
| Apagar | selecione e aperte Delete |

"Cena → FilmCraft" manda só o que ainda não foi enviado daquela cena, para não duplicar no projeto. Se o app estiver fechado, ele abre com o controle ligado.

## Geração: de onde vem

O FilmCraft e o EffectCraft não geram imagem nem vídeo; quem gera é o **ArtCraft** (o app de IA da mesma equipe). O quadro usa a **API oficial da ArtCraft** e gasta os seus créditos de lá.

- **Chave ArtCraft**: app.getartcraft.com › Account › Settings › API Keys. Pelo que a própria ArtCraft documenta, essa seção precisa ser liberada na conta pela equipe deles. Se não aparecer, peça no Discord da ArtCraft.
- **Sem chave ainda?** Escolha "Manual" no ⚙: o botão Gerar copia o prompt montado e mostra as referências; você gera no app ArtCraft e arrasta o resultado para o nó.
- **Alternativa paga por uso**: chave da fal.ai no ⚙ (mesmos modelos Nano Banana / Kling / Veo, cobrados no cartão).

## Onde ficam os arquivos

`Documentos\ArtCraft Quadro\<projeto>\` com `quadro.json` (o quadro), `midia\` (fotos, vídeos e todas as versões geradas, com nomes como "Cena 4 - Ana na sala v2.png") e `miniaturas\`. É isso que vai para o FilmCraft/EffectCraft, então não mova a pasta com os projetos abertos nos apps.

## Pedidos para o Claude

- "Abre o quadro no projeto Clipe Badauê."
- "Como está a cena 4?"
- "Na cena 4, coloca a foto `C:\Users\...\ana.png` como personagem e liga com o cenário para gerar uma foto dela na janela."
- "Melhora os textos dos fios da cena 4 para ficar mais cinematográfico." (não gera nada)
- "Gera o nó da Ana na sala." (gasta crédito)
- "Manda a cena 4 para o FilmCraft e o EffectCraft."
- "O que tem na minha timeline agora?" / "Traz a sequência do FilmCraft para o quadro."
- "Coloca a versão nova da Ana no playhead."

## Problemas comuns

- **A página não abre**: abra o **Quadro ArtCraft.exe** (ou o Claude Desktop com a extensão) e recarregue.
- **"porta 7700 ocupada"**: outro programa usa a porta. Feche-o ou mude `ARTCRAFT_QUADRO_PORTA`.
- **Erro 401 ao gerar**: chave errada ou API não liberada na conta. **402**: créditos acabaram.
- **FC/EC dá erro "aberto SEM canal de controle"**: salve e feche o app, e clique de novo (ou peça "liga o controle permanente" uma vez).

## O que foi testado

Na 2.1: a timeline (faixas, clipes, marcadores, playhead, monitor), Sequência → cena, arrastar clipe para o quadro e nó para a timeline foram testados contra o FilmCraft compilado do código oficial, sem janela. No seu Windows ele fala com o FilmCraft aberto pela porta de controle (9876); se a timeline do quadro não aparecer com o FilmCraft aberto, salve, feche o FilmCraft e clique em **Abrir FilmCraft** no quadro.

Testado em Linux: quadro no navegador (subir fotos, puxar fios, escrever no fio, gerar, versões, miniaturas), ferramentas do Claude, e o envio com FilmCraft e EffectCraft compilados do código oficial (bin/pasta por cena, sem duplicar). A geração foi testada contra uma simulação da API ArtCraft feita a partir da documentação oficial deles; ainda não rodou com uma chave de verdade nem no seu Windows. Se a primeira geração der erro, me mande a mensagem que aparece no nó.
