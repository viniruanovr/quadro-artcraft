# Como funciona

```
Claude (Desktop / Code) ──MCP stdio──▶ server/index.js ──▶ <app>-cli mcp (um por app ArtCraft)
                                           │                    └─ --bridge 127.0.0.1:<porta> → app aberto
                                           └─ server/quadro.js ── HTTP 127.0.0.1:7700 ◀── navegador (server/web)
                                                  ├─ geração: Omni API ArtCraft / fal.ai / manual (vigia downloads)
                                                  └─ FilmCraft: sequence.inspect, timeline.place, clip.replaceFromBin…
server/atualizar.js: baixa versao.json + quadro-bundle.js deste repositório e passa a usar no próximo início
```

- **Sem dependências**: só Node.js. O `.exe` é o Node oficial com `quadro-bundle.js` injetado (Node SEA).
- **Dados**: `Documentos/ArtCraft Quadro/<projeto>/` com `quadro.json`, `midia/` e `miniaturas/`.
- **Portas de controle** dos apps: FilmCraft 9876, EffectCraft 9877, PhotoCraft 7878 (lista completa em `server/index.js`).
- **FilmCraft não aceita plugins**: a integração é pelo canal de controle oficial; nada é injetado no app.
- **Segurança**: o quadro só escuta em 127.0.0.1, confere o Host e exige o cabeçalho `X-Quadro: 1` em tudo que muda algo.
