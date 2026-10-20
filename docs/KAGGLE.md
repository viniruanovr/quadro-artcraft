# Vídeo grátis: ComfyUI no Kaggle (passo a passo)

O Kaggle empresta uma placa de vídeo de 16 GB, de graça, por cerca de 30 horas por semana. O caderno deste repositório instala o ComfyUI lá, baixa o modelo de vídeo Wan 2.2 5B e abre um endereço que o quadro usa. **Não foi testado no Kaggle de verdade pelo autor**: se algo falhar, mande o texto do erro.

## Uma vez só

1. Entre em **kaggle.com** com sua conta e verifique o telefone (Configurações da conta › Phone verification).
2. Baixe o caderno: [quadro-comfyui-kaggle.ipynb](../kaggle/quadro-comfyui-kaggle.ipynb) (botão "Download raw file" no GitHub).
3. No Kaggle: **Create › New Notebook › File › Import Notebook** e escolha o arquivo baixado.
4. No painel da direita, em **Session options**: ligue **Internet** e em **Accelerator** escolha **GPU T4 x2** (ou P100).

## Cada vez que for usar

1. Abra o caderno e clique em **Run All**. Na primeira vez leva 10 a 15 minutos (baixa uns 18 GB). Deixe a aba aberta.
2. No fim aparece um endereço `https://….trycloudflare.com`. Copie.
3. No quadro: **⚙ › Gerar com: Local (ComfyUI)**, cole o endereço em **ComfyUI (geração local)**, clique em **Usar a receita pronta de vídeo** e Salvar. A linha acima mostra "ComfyUI ligado · Tesla T4 · 15 GB".
4. Ligue **uma imagem** a um nó **Gerar vídeo**, escreva o movimento no fio e clique em Gerar. Um clipe de 3 s leva alguns minutos.
5. Terminou? Pare a sessão do Kaggle (botão de parar) para não gastar suas horas. O endereço muda a cada sessão.

## Limites que você deve saber

- A receita pronta usa **a imagem como primeiro quadro** do vídeo (imagem → vídeo). Ela **não usa um vídeo como base**. Para "mesmo take do drone", ligue o clipe da timeline com o 🎬 **desligado**: vai o quadro parado como imagem inicial, e o modelo inventa o movimento a partir do texto.
- Quem tiver o endereço usa a sua GPU enquanto a sessão estiver aberta. Não compartilhe.
- Vídeo base + imagens de verdade (VACE) pede outro modelo e outra receita; fica para uma próxima versão.
