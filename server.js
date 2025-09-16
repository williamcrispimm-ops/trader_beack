import express from "express";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.use(express.json());

// Rota de teste
app.get("/api/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Exemplo rota operações
app.post("/api/operacoes", async (req, res) => {
  try {
    const {
      data, ativo, horario, tempo_vela, compra_venda,
      payout, trader, entrada1, w_l1,
      entrada2, w_l2, entrada3, w_l3,
      periodo, corretora
    } = req.body;

    await pool.query(
      `INSERT INTO operacoes 
       (data, ativo, horario, tempo_vela, compra_venda, payout, trader, 
        entrada1, w_l1, entrada2, w_l2, entrada3, w_l3, periodo, corretora)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [data, ativo, horario, tempo_vela, compra_venda, payout, trader,
        entrada1, w_l1, entrada2, w_l2, entrada3, w_l3, periodo, corretora]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API rodando na porta ${PORT}`));
