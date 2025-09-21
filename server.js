// --- Operações ---
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
      corretora,
      ia, // 👈 novo campo
    } = req.body;

    const result = await pool.query(
      `INSERT INTO operacoes 
       (data, ativo, horario, tempo_vela, compra_venda, payout, trader,
        entrada1, w_l1, entrada2, w_l2, entrada3, w_l3, corretora, ia)
       VALUES ($1,$2,$3,$4,$5,$6,$7,
               $8, NULLIF($9, ''), 
               NULLIF($10, ''), NULLIF($11, ''), 
               NULLIF($12, ''), NULLIF($13, ''), 
               $14, $15)
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
        corretora,
        ia || null, // 👈 incluído no array
      ]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("❌ Erro ao inserir operação:", err);
    res.status(500).json({ error: "Erro ao inserir operação" });
  }
});


