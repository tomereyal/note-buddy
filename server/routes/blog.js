const express = require("express");
const router = express.Router();
const { Blog, Section, List } = require("../models/Blog");
const { Card, Tag } = require("../models/Card");
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const { ObjectId } = require("mongodb");

const { auth } = require("../middleware/auth");
const multer = require("multer");
const { Chain } = require("../models/Chain");

// STORAGE MULTER CONFIG
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".png" && ext !== ".mp4") {
      return cb(res.status(400).end("only jpg, png, mp4 is allowed"), false);
    }
    cb(null, true);
  },
});

const upload = multer({ storage: storage }).single("file");

//=================================
//             Blog
//=================================

router.post("/uploadfiles", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    const { filename, destination } = res.req.file;
    return res.json({
      success: true,
      url: `http://localhost:5000/${destination + filename}`,
      fileName: res.req.file.filename,
    });
  });
});

router.post("/createPost", (req, res) => {
  const { name, writer, image, components, conditions, title, roles } =
    req.body;
  let blog = new Blog(req.body);
  blog.saveAndPopulate((err, postInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true, postInfo });
  });
});

router.delete("/deletePost/:postId", (req, res) => {
  const postId = req.params.postId;
  Blog.findById(postId, function (err, post) {
    if (err) return res.json({ success: false, err });
    post.remove({}, function (err) {
      if (err) {
        console.log(`err`, err);
        return res.json({ success: false, err });
      }
    });
  });
});

//https://github.com/buunguyen/mongoose-deep-populate/issues/41
//solution plugin called "deep-populate"

//or maybe this : https://www.initialapps.com/mongoose-why-you-may-be-having-issues-populating-across-multiple-levels/

router.get("/fetchPosts", (req, res) => {
  Blog.find()
    .populate({
      path: "writer",
      model: "User",
    })
    .populate({
      path: "components",
      model: "Blog",
    })
    .populate({
      path: "sections",
      model: "Section",
      populate: {
        path: "lists",
        model: "List",
        populate: { path: "cards", model: "Card" },
      },
    })
    .populate({
      path: "examples",
      model: "Chain",
    })
    .exec((err, blogs) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, blogs });
    });
});

router.get("/fetchPost/:postId", (req, res) => {
  Blog.findOne({ _id: req.params.postId })
    .populate({
      path: "components",
      model: "Blog",
    })
    .populate({
      path: "sections",
      model: "Section",
      populate: {
        path: "lists",
        model: "List",
        populate: { path: "cards", model: "Card" },
      },
    })
    .populate({
      path: "examples",
      model: "Chain",
      populate: {
        path: "heads",
        model: "Blog",
      },
    })
    .populate({
      path: "examples",
      model: "Chain",
      populate: {
        path: "connector",
        model: "Card",
      },
    })
    .populate({
      path: "examples",
      model: "Chain",
      populate: {
        path: "nodes",
        model: "Card",
      },
    })
    .populate({
      path: "chains",
      model: "Chain",
      populate: {
        path: "outcomes",
        model: "Blog",
      },
    })
    .populate({
      path: "chains",
      model: "Chain",
      populate: {
        path: "heads",
        model: "Blog",
      },
    })
    .populate({
      path: "chains",
      model: "Chain",
      populate: {
        path: "connector",
        model: "Card",
      },
    })
    .populate({
      path: "examples",
      model: "Chain",
      populate: {
        path: "outcomes",
        model: "Blog",
      },
    })
    .exec((err, post) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, post });
    });
});

router.post("/editPost", async (req, res) => {
  const { postId, editArr } = req.body;
  try {
    const post = await Blog.findById(postId);
    editArr.forEach(({ editType, editValue }) => {
      post[editType] = editValue;
    });
    const result = await post.saveAndPopulate();
    return res.status(200).json(result);
  } catch (error) {
    return res.json({ success: false, error });
  }
});

router.post("/getList", async (req, res) => {
  const { postId, sectionId, listId } = req.body;
  try {
    const post = await Blog.findById(postId);
    let queriedList = post.sections.id(sectionId).lists.id(listId);
    res.status(200).json(queriedList);
  } catch (error) {
    return res.json({ success: false, err });
  }
});

router.post("/createSectionInPost", async (req, res) => {
  const { postId, name, order, backgroundPattern, backgroundColor } = req.body;
  const newSection = new Section({
    name,
    order,
    backgroundPattern,
    backgroundColor,
  });
  try {
    const updatedPost = await Blog.findOneAndUpdate(
      { _id: postId },
      {
        $push: {
          sections: { $each: [newSection], $position: order },
        },
      },
      { new: true }
    );

    const populatedPost = await updatedPost.saveAndPopulate();
    res.status(200).json(populatedPost);
  } catch (error) {
    return res.json({ success: false, error });
  }
});

router.post("/removeSectionFromPost", async (req, res) => {
  const { postId, sectionId } = req.body;

  try {
    const updatedPost = await Blog.findOneAndUpdate(
      { _id: postId },
      {
        $pull: {
          sections: { _id: sectionId },
        },
      },
      { new: true }
    );
    const populatedPost = await updatedPost.saveAndPopulate();
    res.status(200).json(populatedPost);
  } catch (error) {
    return res.json({ success: false, err });
  }
});

router.post("/editSection", (req, res) => {
  const { postId, sectionId, editArr } = req.body;
  Blog.findById(postId, function (err, post) {
    if (err) {
      console.log(err);
    }

    let section = post.sections.id(sectionId);
    editArr.forEach(({ editType, editValue }) => {
      section[editType] = editValue;
    });

    post.saveAndPopulate((err, result) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(result);
    });
  });
});

router.post("/createListInSection", async (req, res) => {
  const { postId, sectionId, order, type } = req.body;
  const defaultCard = new Card({});
  const newList = new List({
    name: "new list",
    type,
    order,
    cards: [defaultCard._id],
  });

  try {
    const card = await defaultCard.save();
    const post = await Blog.findById(postId);
    let lists = post.sections.id(sectionId).lists;
    lists.push(newList);
    const result = post.saveAndPopulate();
    res.status(200).json(result);
  } catch (error) {
    return res.json({ success: false, error });
  }
});

router.post("/removeListFromSection", async (req, res) => {
  const { postId, sectionId, listId } = req.body;
  try {
    const post = await Blog.findById(postId);
    let lists = post.sections.id(sectionId).lists;
    post.sections.id(sectionId).lists = lists.filter((list) => {
      return list._id != listId;
    });
    const result = await post.saveAndPopulate();
    res.status(200).json(result);
  } catch (error) {
    return res.json({ success: false, err });
  }
});

router.post("/editList", (req, res) => {
  const { postId, sectionId, listId, editArr } = req.body;
  Blog.findById(postId, function (err, post) {
    if (err) {
      console.log(err);
    }
    let list = post.sections.id(sectionId).lists.id(listId);
    editArr.forEach(({ editType, editValue }) => {
      switch (editType) {
        default:
          list[editType] = editValue;
          break;
      }
    });
    post.saveAndPopulate((err, result) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(result);
    });
  });
});

router.post("/createCardInList", async (req, res) => {
  const { postId, sectionId, listId, order, flowData } = req.body;
  const newCard = new Card({
    order,
    flowData,
  });
  try {
    const card = await newCard.save();
    const post = await Blog.findById(postId);
    post.sections.id(sectionId).lists.id(listId).cards.push(card._id);
    const updatedPost = await post.saveAndPopulate();
    res.status(200).json(updatedPost);
  } catch (error) {
    return res.json({ success: false, error });
  }
});

router.get("/getList/:listId", async (req, res) => {
  const listId = req.params.listId;
  try {
    const filter = {
      "sections.lists._id": new ObjectId("610d2b25a6a770111857ab13"),
    };
    const filter2 = {
      _id: new ObjectId("610d2b25a6a770111857ab16"),
    };
    const projection = {
      "sections.lists.cards": 1,
    };
    const [response] = await Blog.find(filter2).select(projection);
    const cards = response.sections[0].lists[0].cards;
    res.send(cards);
  } catch (error) {
    console.log(`error`, error);
  }
});

router.post("/getList", (req, res) => {
  const { postId, sectionId, listId } = req.body;

  const postID = new ObjectId(postId);
  const sectionID = new ObjectId(sectionId);
  const listID = new ObjectId(listId);

  Blog.findById(postID, function (err, post) {
    if (err) {
      console.log(err);
    }
    let cards = post.sections.id(sectionID).lists.id(listID).cards;
    res.send(cards);
  });
});

router.post("/addCardToList", (req, res) => {
  const { postId, sectionId, listId, cardId } = req.body;

  Blog.findById(postId, function (err, post) {
    if (err) {
      console.log(err);
    }
    post.sections.id(sectionId).lists.id(listId).cards.push(cardId);
    post.saveAndPopulate((err, updatedPost) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(updatedPost);
    });
  });
});
router.post("/removeCardFromList", (req, res) => {
  const { postId, sectionId, listId, cardId, cardIdArr } = req.body;
  const deleteArr = cardIdArr ? cardIdArr : [cardId];
  Card.deleteMany({ _id: deleteArr }, function (err, result) {
    if (err) return res.json({ success: false, err });
    Blog.findById(postId, function (err, post) {
      if (err) {
        console.log(err);
      }
      let cardsArr = post.sections
        .id(sectionId)
        .lists.id(listId)
        .cards.filter((card) => !deleteArr.includes(card));
      post.sections.id(sectionId).lists.id(listId).cards = cardsArr;
      post.saveAndPopulate((err, result) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json(result);
      });
    });
  });
});

module.exports = router;
