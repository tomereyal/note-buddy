const express = require("express");
const router = express.Router();
const { Blog, Section, List, Card } = require("../models/Blog");

const { auth } = require("../middleware/auth");
const multer = require("multer");

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
    return res.json({
      success: true,
      url: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post("/createPost", (req, res) => {
  let blog = new Blog({
    content: req.body.content,
    writer: req.body.writer,
    sections: [],
  });
  blog.save((err, postInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true, postInfo });
  });

  //search Folder collection for "folder-name" (req.body.folderName) and add it there.
  //ALWAYS search Folder collection for "recent" folder and add it there.
  //ALWAYS search Folder collection for "all blogs" folder and add it there.
});

router.delete("/deletePost/:postId", (req, res) => {
  console.log(req.params.postId);
  Blog.findByIdAndRemove({ _id: req.params.postId }).then(
    (result) => {
      console.log(result);
    },
    (reason) => {
      console.log(reason);
    }
  );
});

router.get("/fetchPosts", (req, res) => {
  Blog.find()
    .populate("writer")
    .exec((err, blogs) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, blogs });
    });
});

router.get("/getBlogs", (req, res) => {
  Blog.find()
    .populate("writer")
    .exec((err, blogs) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, blogs });
    });
});

router.post("/getPost", (req, res) => {
  Blog.findOne({ _id: req.body.postId })
    .populate("writer")
    .exec((err, post) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, post });
    });
});

router.post("/getSection", (req, res) => {
  const postId = req.body.postId;
  const sectionId = req.body.sectionId;
  Blog.findById(postId, function (err, post) {
    if (err) {
      console.log(err);
    }
    let queriedSection = post.sections.id(sectionId);

    if (err) return res.json({ success: false, err });
    res.status(200).json(queriedSection);
  });
});

router.post("/getList", (req, res) => {
  const postId = req.body.postId;
  const sectionId = req.body.sectionId;
  const listId = req.body.listId;
  Blog.findById(postId, function (err, post) {
    if (err) {
      console.log(err);
    }
    let queriedList = post.sections.id(sectionId).lists.id(listId);

    post.save((err, result) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(queriedList);
    });
  });
});

router.post("/createSection", (req, res) => {
  const postId = req.body.inPost;
  Blog.findOneAndUpdate(
    { _id: postId },
    {
      $push: {
        sections: {
          inPost: postId,
          title: req.body.title,
          order: req.body.order,
        },
      },
    },
    { new: true },
    (err, updatedPost) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(updatedPost);
    }
  );
});

router.post("/removeSection", (req, res) => {
  Blog.findOneAndUpdate(
    { _id: req.body.postId },
    {
      $pull: { sections: { _id: req.body.sectionId } },
    },
    { new: true },
    (err, blogInfo) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(blogInfo);
    }
  );
});

router.post("/createList", (req, res) => {
  Blog.findById(req.body.postId, function (err, post) {
    if (err) {
      console.log(err);
    }
    let listsArr = post.sections.id(req.body.sectionId).lists;
    listsArr.push({
      inPost: req.body.postId,
      inSection: req.body.sectionId,
      order: req.body.order,
      cards: req.body.cards,
    });
    post.save((err, result) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(result);
    });
  });
});

router.post("/createCard", (req, res) => {
  const postId = req.body.postId;
  const sectionId = req.body.sectionId;
  const listId = req.body.listId;
  Blog.findById(postId, function (err, post) {
    if (err) {
      console.log(err);
    }
    let cardsArr = post.sections.id(sectionId).lists.id(listId).cards;
    cardsArr.push({
      inPost: postId,
      inSection: sectionId,
      inList: listId,
      order: req.body.order,
      content: req.body.content,
      tags: req.body.tags,
    });
    post.save((err, result) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(result);
    });
  });
});

router.post("/removeList", (req, res) => {
  const listId = req.body.listId;
  const postId = req.body.postId;
  const sectionId = req.body.sectionId;
  Blog.findById(postId, function (err, post) {
    if (err) {
      console.log(err);
    }

    let listsArr = post.sections.id(sectionId).lists;
    post.sections.id(sectionId).lists = listsArr.filter(
      (list) => list._id != listId
    );
    post.save((err, result) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(result);
    });
  });
});

router.post("/removeCard", (req, res) => {
  const cardId = req.body.cardId;
  const listId = req.body.listId;
  const postId = req.body.postId;
  const sectionId = req.body.sectionId;
  Blog.findById(postId, function (err, post) {
    if (err) {
      console.log(err);
    }
    let cardsArr = post.sections.id(sectionId).lists.id(listId).cards;
    post.sections.id(sectionId).lists.id(listId).cards = cardsArr.filter(
      (card) => !(card._id == cardId)
    );
    console.log(`The current cardsArr`, cardsArr);
    console.log(`we want to remove card number:`, cardId);

    console.log(cardsArr.filter((card) => card._id != cardId));
    post.save((err, result) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(result);
    });
  });
});

router.post("/editNote", (req, res) => {
  const cardId = req.body.cardId;
  const listId = req.body.listId;
  const postId = req.body.postId;
  const sectionId = req.body.sectionId;
  const content = req.body.content;
  const tags = req.body.tags;
  Blog.findById(postId, function (err, post) {
    if (err) {
      console.log(err);
    }
    let card = post.sections.id(sectionId).lists.id(listId).cards.id(cardId);
    console.log(`card`, card);
    post.sections.id(sectionId).lists.id(listId).cards.id(cardId).content =
      content;
    post.sections.id(sectionId).lists.id(listId).cards.id(cardId).tags = tags;
    post.save((err, result) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(result);
    });
  });
});
module.exports = router;
