const express = require("express");
const { Card } = require("../models/Card");
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
router.post("/createExampleChain", (req, res) => {
  const { postId } = req.body;
  const newChain = new Chain({ outcomes: [postId] });

  Chain.create(newChain, (err, chain) => {
    console.log(`err`, err);
    if (err) return res.status(400).json({ success: false, err });

    return res.status(200).json({ success: true, chain });
  });
});

router.post("/createCardInChain", (req, res) => {
  const { chainId } = req.body;
  const newCard = new Card({});

  Card.create(newCard, (err, card) => {
    console.log(`err`, err);
    if (err) return res.status(400).json({ success: false, err });

    Chain.findByIdAndUpdate(
      chainId,
      { $push: { connectors: card } },
      { new: true },
      (err, chain) => {
        if (err) return res.status(400).json({ success: false, err });

        return res.status(200).json({ success: true, card });
      }
    );
  });
});

router.delete("/deleteChain/:chainId", (req, res) => {
  const { chainId } = req.params;

  Chain.deleteOne({ _id: chainId }, (err, chain) => {
    console.log(`err`, err);
    if (err) return res.status(400).json({ success: false, err });

    return res.status(200).json({ success: true, chain });
  });
});

router.put("/:id", (req, res) => {
  //I had an issue that client was sending only an objectId of the card and the card was null..
  // i needed to populate after every post update by creating a custom static method on the blogSchema..
  const chainId = req.params.id;
  Chain.findByIdAndUpdate(
    chainId,
    { $set: req.body },
    { new: true },
    function (err, chain) {
      if (err) return res.json({ success: false, err });
      return res.status(200).json({ success: true, chain });
    }
  );
});

router.post("/fetchChainsByIds", (req, res) => {
  const { chains } = req.body;
  Chain.find({ _id: { $in: chains } })
    .populate({
      path: "heads",
      model: "Blog",
    })
    .populate({
      path: "outcomes",
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
