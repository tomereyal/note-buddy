const express = require("express");
const router = express.Router();
const { Tag } = require("../models/Tag");
//=================================
//             Tag
//=================================
router.get("/getTags", (req, res) => {
  Tag.find()
    .populate("writer") // populate the writer
    .populate("cards") //  populate the cards
    .exec((err, tags) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, tags });
    });
});

router.post("/createTag", (req, res) => {
  const { body } = req;
  const { name, writer, card } = body;
  const tag = new Tag({ name, writer, cards: [card] });
  console.log(tag);
  tag.save((err, tagInfo) => {
    if (err) return res.json({ success: false, err });
    console.log(tagInfo);
    return res.status(200).json({ success: true, tagInfo });
  });
});

router.delete("/deleteTag/:tagId", (req, res) => {
  console.log(req.params.tagId);
  Tag.findByIdAndRemove({ _id: req.params.tagId }).then(
    (result) => {
      console.log(`Delete tag result`, result);
    },
    (reason) => {
      console.log(reason);
    }
  );
});

router.post("/updateTag", (req, res) => {
    const { body } = req;
    const { name, writer, card } = body;

  
    tag.save((err, tagInfo) => {
      if (err) return res.json({ success: false, err });
      console.log(tagInfo);
      return res.status(200).json({ success: true, tagInfo });
    });
  });
  

  router.post("/updateTag", (req, res) => {
    const { tagId, editArr } = req.body;
    Blog.findById(tagId, function (err, tag) {
      if (err) {
        console.log(err);
      }
      editArr.forEach(({ editType, editValue }) => {
        tag[editType] =
          editValue;
      });
      // const contentTest = "content";
      // post.sections.id(sectionId).lists.id(listId).cards.id(cardId)[contentTest] =
      //   content;
      // post.sections.id(sectionId).lists.id(listId).cards.id(cardId).tags = tags;
      tag.save((err, result) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json(result);
      });
    });
  });

  router.post(("/removeCardFromTag"))






module.exports = router;
