import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

// conexão com o Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// rota de teste
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ conectado: true, hora: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao conectar no Neon" });
  }
});

// rota para operações
app.post("/api/operacoes", async (req, res) => {
  try {
    const {
      data, ativo, horario, tempo_vela, compra_venda,
      payout, trader, entrada1, w_l1, entrada2, w_l2,
      entrada3, w_l3, periodo, corretora
    } = req.body;

    const result = await pool.query(
      `INSERT INTO operacoes 
       (data, ativo, horario, tempo_vela, compra_venda, payout, trader,
        entrada1, w_l1, entrada2, w_l2, entrada3, w_l3, periodo, corretora)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING *`,
      [data, ativo, horario, tempo_vela, compra_venda, payout, trader,
       entrada1, w_l1, entrada2, w_l2, entrada3, w_l3, periodo, corretora]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao inserir operação" });
  }
});

// rota para caixa
app.post
