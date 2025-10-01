// =============================
// 📌 Configuração do servidor
// =============================
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// =============================
// 📌 Conexão com o PostgreSQL (Neon/Supabase)
// =============================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// =============================
// 📌 Rotas
// =============================

// Teste de status
app.get("/api", (req, res) => {
  res.json({ status: "API funcionando 🚀" });
});

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
      corretora
    } = req.body;

    const result = await pool.query(
      `INSERT INTO operacoes 
       (data, ativo, horario, tempo_vela, compra_venda, payout, trader,
        entrada1, w_l1, entrada2, w_l2, entrada3, w_l3, corretora)
       VALUES ($1,$2,$3,$4,$5,$6,$7,
               $8,$9,
               NULLIF($10,'')::numeric, $11,
               NULLIF($12,'')::numeric, $13,
               $14)
       RETURNING *`,
      [
        data,
        ativo,
        horario,
        tempo_vela,
        compra_venda,
        payout,
        trader,
        entrada1,
        w_l1 || null,
        entrada2 || null,
        w_l2 || null,
        entrada3 || null,
        w_l3 || null,
        corretora
      ]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("❌ Erro ao inserir operação:", err);
    res.status(500).json({ error: "Erro ao inserir operação" });
  }
});

// --- Caixa ---
app.post("/api/caixa", async (req, res) => {
  try {
    const { data, valor, tipo, corretora, bonus, valor_bonus } = req.body;

    // se for "sim", desconta o bônus; se não, valor_liquido = valor
    const valorLiquido = bonus === "sim" ? (valor - (valor_bonus || 0)) : valor;

    const result = await pool.query(
      `INSERT INTO caixa (data, valor, tipo, corretora, bonus, valor_bonus, valor_liquido)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [data, valor, tipo, corretora, bonus, valor_bonus || 0, valorLiquido]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("❌ Erro ao inserir caixa:", err);
    res.status(500).json({ error: "Erro ao inserir movimentação de caixa" });
  }
});


// --- Metas ---
app.post("/api/metas", async (req, res) => {
  try {
    const { data, meta_valor } = req.body;

    const result = await pool.query(
      `INSERT INTO metas (data, meta_valor)
       VALUES ($1,$2) RETURNING *`,
      [data, meta_valor]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("❌ Erro ao inserir meta:", err);
    res.status(500).json({ error: "Erro ao inserir meta" });
  }
});

// =============================
// 📌 Inicialização
// =============================
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});

