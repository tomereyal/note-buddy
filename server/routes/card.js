const express = require("express");
const router = express.Router();
const axios = require("axios");
const { Card, Tag } = require("../models/Card");
//=================================
//             Card
//=================================

router.get("/fetchCards", (req, res) => {
  Card.find().exec((err, cards) => {
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true, cards });
  });
});
router.get("/fetchCardTags", (req, res) => {
  Card.find().exec((err, cards) => {
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true, cards });
  });
});

router.post("/editNote", (req, res) => {
  //I had an issue that client was sending only an objectId of the card and the card was null..
  // i needed to populate after every post update by creating a custom static method on the blogSchema..
  const { cardId, editArr } = req.body;
  Card.findById(cardId, function (err, card) {
    if (err) return res.status(400).send(err);

    editArr.forEach(({ editType, editValue }) => {
      switch (editType) {
        default:
          card[editType] = editValue;
          break;
      }
    });

    card.save((err, cardInfo) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).json({ success: true, cardInfo });
    });
  });
});

router.post("/saveNoteTags", (req, res) => {
  const { cardId, tags } = req.body;

  Card.findById(cardId, function (err, card) {
    if (err) return res.json({ success: false, err });
    const tagsForCreation = [];
    const exisitingTags = card.tags.filter((tag) => {
      return tags.includes(tag.name);
    });
    const exisitingTagNames = card.tags.map(({ name }) => name);
    tags.forEach((tag) => {
      if (!exisitingTagNames.includes(tag)) {
        const icon = getFlatIcon("monster");
        console.log(`icon`, icon);
        tagsForCreation.push(new Tag({ name: tag }));
      }
    });
    console.log(
      `exisitingTagNames.concat(tagsForCreation)`,
      exisitingTags.concat(tagsForCreation)
    );
    card.tags = exisitingTags.concat(tagsForCreation);

    card.save(function (err, updatedCard) {
      if (err) return res.json({ success: false, err });
      return res.status(200).json({ success: true, updatedCard });
    });
  });
});
module.exports = router;
