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

router.post("/createCard", (req, res) => {
  const { postId, sectionId, listId, tags, order, flowData } = req.body;

  const newCard = postId
    ? new Card({
        order,
        tags,
        location: { post: postId, section: sectionId, list: listId },
        flowData,
      })
    : new Card({});
  Card.create(newCard, (err, card) => {
    if (err) return res.status(400).json({ success: false, err });

    return res.status(200).json({ success: true, card });
  });
});

router.get("/fetchTaggedCards/:tagName", (req, res) => {
  const tagName = req.params.tagName;
  Card.find({ "tags.name": tagName }).exec((err, cards) => {
    if (err) return res.status(400).send(err);
    console.log(`cards`, cards);
    res.status(200).json({ success: true, cards });
  });
});

router.delete("/:id", (req, res) => {
  const cardId = req.params.id;
  Card.findByIdAndDelete(cardId, (err, cards) => {
    if (err) return res.status(400).send(err);
    console.log(`cards`, cards);
    res.status(200).json({ success: true });
  });
});

router.put("/:id", (req, res) => {
  //I had an issue that client was sending only an objectId of the card and the card was null..
  // i needed to populate after every post update by creating a custom static method on the blogSchema..
  const cardId = req.params.id;
  Card.findByIdAndUpdate(
    cardId,
    { $set: req.body },
    { new: true },
    function (err, cardInfo) {
      if (err) return res.json({ success: false, err });
      return res.status(200).json({ success: true, cardInfo });
    }
  );
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
        tagsForCreation.push(new Tag({ name: tag, image }));
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
  const { cardId, tags } = req.body;
  console.log(`1...`);
  Card.findById(cardId, function (err, card) {
    if (err) return res.json({ success: false, err });

    card.tags = tags;

    card.save(function (err, updatedCard) {
      if (err) return res.json({ success: false, err });
      return res.status(200).json({ success: true, updatedCard });
    });
  });
});
module.exports = router;
