# ⏳ Ping Trader-Beack Render

Este projeto mantém o serviço **trader-beack.onrender.com** acordado durante o dia, enviando pings automáticos.

## ⚙️ Como funciona

- Pinga o endpoint `https://trader-beack.onrender.com/health` entre **09h00 e 23h00**.
- Pausa entre **23h01 e 08h30**, deixando o serviço dormir.

## 🚀 Como usar

1. Clone o repositório:

   ```bash
   git clone https://github.com/SEU-USUARIO/ping-trader-beack.git
   cd ping-trader-beack
