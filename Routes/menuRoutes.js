const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    let menu = {
      chicken_chilli: "Rs 2000",
      paneer_chilli: "Rs 600",
      Dal_Rice: "Rs 60",
      paneer_Rice: "Rs 85",
      kadhi_Rice: "Rs 65",
      chole_bhuture: "Rs 50",
    };
    res.send(menu);
  });

  module.exports = router;