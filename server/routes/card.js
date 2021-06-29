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
// router.get("/fetchCardTags", (req, res) => {
//   Card.find().exec((err, cards) => {
//     if (err) return res.status(400).send(err);
//     res.status(200).json({ success: true, cards });
//   });
// });
router.get("/fetchTaggedCards/:tagName", (req, res) => {
  const tagName = req.params.tagName;
  Card.find({ "tags.name": tagName }).exec((err, cards) => {
    if (err) return res.status(400).send(err);
    console.log(`cards`, cards);
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

router.post("/saveNewNoteTags", (req, res) => {
  const { cardId, tags, image } = req.body;

  Card.findById(cardId, function (err, card) {
    if (err) return res.json({ success: false, err });
    const tagsForCreation = [];
    const existingTagsInCard = card.tags.filter((tag) => {
      return tags.includes(tag.name);
    });
    const exisitingTagNames = card.tags.map(({ name }) => name);
    tags.forEach((tag) => {
      if (!exisitingTagNames.includes(tag)) {
        tagsForCreation.push(new Tag({ name: tag, image: image }));
      }
    });
    card.tags = existingTagsInCard.concat(tagsForCreation);

    card.save(function (err, updatedCard) {
      if (err) return res.json({ success: false, err });
      return res.status(200).json({ success: true, updatedCard });
    });
  });
});
router.post("/saveExistingNoteTags", (req, res) => {
  const { cardId, tags, image } = req.body;
  console.log(`1...`);
  Card.findById(cardId, function (err, card) {
    if (err) return res.json({ success: false, err });
    const tagsToCopy = [];
    const existingTagsInCard = card.tags.filter((tag) => {
      return tags.includes(tag.name);
    });
    console.log(`2...`);
    console.log(`card`, card);
    const existingTagNames = card.tags.map(({ name }) => name);
    console.log(`existingTagNames`, existingTagNames);

    Card.find({ "card.tags": { $in: existingTagNames } }).exec(
      err,
      (cardsWithTags) => {
        if (err) return res.status(400).json({ success: false, err });
        console.log(`cardsWithTags`, cardsWithTags);
      }
    );
    // tags.forEach((tag) => {
    //   if (!existingTagsInCard.includes(tag)) {
    //     tagsForCreation.push(new Tag({ name: tag, image: image }));
    //   }
    // });
    // card.tags = existingTagsInCard.concat(tagsForCreation);

    // card.save(function (err, updatedCard) {
    //   if (err) return res.json({ success: false, err });
    //   return res.status(200).json({ success: true, updatedCard });
    // });
  });
});
module.exports = router;
