# Vídeo grátis: GPU do Kaggle ligada pelo próprio quadro

O Kaggle empresta uma placa de vídeo de 16 GB, de graça, por cerca de 30 horas por semana. A partir da versão 2.8.0 o quadro liga e usa essa placa sozinho. Não precisa abrir caderno, copiar endereço nem deixar aba aberta.

## Uma vez só

1. Entre em **kaggle.com** com sua conta e verifique o telefone (Settings › Phone verification). O Kaggle exige isso para usar GPU com internet.
2. Ainda em **Settings**, na parte **API**, gere um token (começa com `KGAT_`) e copie.
3. No quadro: **⚙** › Gerar com: **Nuvem grátis: Kaggle** › cole seu usuário do Kaggle e o token › Salvar. (Se tiver um `kaggle.json`, pode escolher o arquivo no lugar.)

## Usar

Ligue fotos ou um vídeo a um nó **Gerar vídeo**, escreva no fio o que acontece e clique em **Gerar**.

- Se a GPU estiver desligada, o nó mostra "Ligando a GPU na nuvem (1/3, 2/3, 3/3)". Na primeira geração do dia isso leva uns 10 minutos (instala o gerador e baixa o modelo).
- Depois cada vídeo de 3 a 5 s leva alguns minutos e volta sozinho para o nó.
- Sem gerar nada por 25 minutos, a GPU se desliga sozinha para não gastar suas horas.

## Como funciona (e por que é seguro)

O quadro cria no seu Kaggle um código privado chamado **quadro-gpu** e o roda com GPU. Ele não abre nenhum endereço na internet: busca os pedidos num canal com nome secreto e aleatório (no serviço gratuito ntfy.sh), gera com o ComfyUI e devolve o vídeo pelo mesmo canal. Os arquivos ficam lá por poucas horas e só quem sabe o nome do canal acha.

## Limites

- O modelo é o Wan 2.2 5B (imagem → vídeo). Ele parte de **uma** imagem: o primeiro quadro do vídeo base, ou a primeira foto ligada. As outras fotos não entram, então descreva no fio o que deve aparecer.
- Cada arquivo enviado pode ter até 14 MB.
- Ainda não foi testado num Kaggle de verdade, só simulado. Se algo falhar, o nó mostra o motivo.
