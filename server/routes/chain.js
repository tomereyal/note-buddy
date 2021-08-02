const express = require("express");
const router = express.Router();
const { Chain } = require("../models/Chain");

router.post("/createChain", (req, res) => {
  const { postId } = req.body;
  const newChain = new Chain({ heads: [postId] });

  Chain.create(newChain, (err, chain) => {
    console.log(`err`, err);
    if (err) return res.status(400).json({ success: false, err });

    return res.status(200).json({ success: true, chain });
  });
});

router.post("/fetchChainsByIds", (req, res) => {
  const { chains } = req.body;
  Chain.find({ _id: { $in: chains } })
    .populate({
      path: "heads",
      model: "Blog",
    })
    .populate({
      path: "outcome",
      model: "Blog",
    })
    .populate({
      path: "connector",
      model: "Card",
    })
    .exec((err, chains) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, chains });
    });
});

module.exports = router;
