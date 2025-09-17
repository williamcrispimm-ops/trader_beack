// =============================
// 📌 Configuração do servidor
// =============================
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pkg from "pg";
// Para ambiente de desenvolvimento, você pode usar a biblioteca 'dotenv' para carregar variáveis do .env.
// import "dotenv/config";

const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// =============================
// 📌 Conexão com o PostgreSQL (Neon/Supabase)
// =============================
// Use process.env.DATABASE_URL para se conectar ao banco de dados.
// A configuração SSL com rejectUnauthorized: false é necessária para alguns provedores como o Neon.
// Em um ambiente de produção mais seguro, considere configurar corretamente o certificado SSL.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// =============================
// 📌 Rotas da API
// =============================

// Teste de status da API
app.get("/api", (req, res) => {
  res.json({ status: "API funcionando 🚀" });
});

// --- Rota para operações (inserir dados) ---
// Recomendação: Para maior segurança, valide os dados do req.body antes de inserir no banco.
app.post("/api/operacoes", async (req, res) => {
  try {
    const {
      data,
      ativo,
      horario,
      tempo_vela,
      compra_venda,
      payout,
      trader,
      entrada1,
      w_l1,
      entrada2,
      w_l2,
      entrada3,
      w_l3,
      periodo,
      corretora,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO operacoes
      (data, ativo, horario, tempo_vela, compra_venda, payout, trader,
        entrada1, w_l1, entrada2, w_l2, entrada3, w_l3, periodo, corretora)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING *`,
      [
        data,
        ativo,
        horario,
        tempo_vela,
        compra_venda,
        payout,
        trader,
        entrada1 || null,
        w_l1 || null,
        entrada2 || null,
        w_l2 || null,
        entrada3 || null,
        w_l3 || null,
        periodo || null,
        corretora,
      ]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("❌ Erro ao inserir operação:", err);
    res.status(500).json({ error: "Erro interno ao processar a requisição." });
  }
});

// --- Rota para caixa (inserir dados) ---
app.post("/api/caixa", async (req, res) => {
  try {
    const { data, valor, tipo, corretora } = req.body;

    const result = await pool.query(
      `INSERT INTO caixa (data, valor, tipo, corretora)
      VALUES ($1,$2,$3,$4) RETURNING *`,
      [data, valor, tipo, corretora]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("❌ Erro ao inserir caixa:", err);
    res.status(500).json({ error: "Erro interno ao processar a requisição." });
  }
});

// --- Metas ---
app.post("/api/metas", async (req, res) => {
  try {
    const { data, meta_valor } = req.body;

    const result = await pool.query(
      `INSERT INTO metas (data, meta_valor)
       VALUES ($1, $2) RETURNING *`,
      [data, meta_valor]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("❌ Erro ao inserir meta:", err);
    res.status(500).json({ error: "Erro ao inserir meta" });
  }
});

// --- Acompanhamento de metas (VIEW, só leitura) ---
app.get("/api/acompanhamento_meta", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM acompanhamento_meta ORDER BY data, periodo");
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error("❌ Erro ao consultar acompanhamento_meta:", err);
    res.status(500).json({ error: "Erro ao consultar acompanhamento_meta" });
  }
});
// =============================
// 📌 Inicialização do servidor
// =============================
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});

