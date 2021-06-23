const express = require("express");
const router = express.Router();
const { Blog, Section, List, Card } = require("../models/Blog");
const { Tag } = require("../models/Tag");
const axios = require("axios");

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
  let defaultCard = new Card({});
  let defaultList = new List({
    title: "new list",
    cards: [defaultCard],
  });
  let defaultSection = new Section({
    lists: [defaultList],
    title: "Section 1",
  });
  let blog = new Blog({
    name: req.body.name,
    writer: req.body.writer,
    sections: [defaultSection],
  });
  console.log(blog);
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
  const postId = req.params.postId;

  Blog.findOneAndDelete({ _id: postId }, function (err) {
    if (err) console.log(err);
    console.log("Successful deletion");
  });
  // .then(
  //   (result) => {
  //     console.log(`database response:`, result);
  //   },
  //   (reason) => {
  //     console.log(reason);
  //   }
  // );
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

router.post("/setPostTitle", (req, res) => {
  const { postId, newTitle } = req.body;
  Blog.findById(postId, function (err, post) {
    if (err) {
      console.log(err);
    }
    post.name = newTitle;
    post.save((err, result) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(result);
    });
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

router.post("/createSectionInPost", (req, res) => {
  const variables = req.body;
  const { postId, title, order, backgroundPattern, backgroundColor } =
    variables;
  const defaultCard = new Card({});
  const defaultList = new List({
    title: "new list",
    order,
    cards: [defaultCard],
  });
  const newSection = new Section({
    title,
    order,
    lists: [defaultList],
    backgroundPattern,
    backgroundColor,
  });

  Blog.findOneAndUpdate(
    { _id: postId },
    {
      $push: {
        sections: { $each: [newSection], $position: order },
      },
    },
    { new: true },
    (err, updatedPost) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(updatedPost);
    }
  );
});

router.post("/removeSectionFromPost", (req, res) => {
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

router.post("/setSectionBgc", (req, res) => {
  const { postId, sectionId, backgroundColor } = req.body;
  Blog.findById(postId, function (err, post) {
    if (err) {
      console.log(err);
    }
    let section = post.sections.id(sectionId);
    post.sections.id(sectionId).backgroundColor = backgroundColor;
    // section.backgroundColor = backgroundColor;
    post.save((err, result) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(result);
    });
  });
});
router.post("/setSectionPattern", (req, res) => {
  const { postId, sectionId, backgroundPattern } = req.body;
  Blog.findById(postId, function (err, post) {
    if (err) {
      console.log(err);
    }
    let section = post.sections.id(sectionId);
    post.sections.id(sectionId).backgroundPattern = backgroundPattern;
    // section.backgroundPattern = backgroundPattern;
    post.save((err, result) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(result);
    });
  });
});

router.post("/setSectionTitle", (req, res) => {
  const { postId, sectionId, newTitle } = req.body;
  Blog.findById(postId, function (err, post) {
    if (err) {
      console.log(err);
    }
    console.log(`postId`, postId);
    console.log(`sectionId`, sectionId);
    console.log(`newTitle`, newTitle);
    let section = post.sections.id(sectionId);
    post.sections.id(sectionId).title = newTitle;
    // section.backgroundColor = backgroundColor;
    console.log(`section`, section);
    post.save((err, result) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(result);
    });
  });
});

router.post("/createListInSection", (req, res) => {
  const { postId, sectionId, title, order } = req.body;
  Blog.findById(postId, function (err, post) {
    if (err) {
      console.log(err);
    }
    const defaultCard = new Card({});
    const newList = new List({
      title: "new list",
      order,
      cards: [defaultCard],
    });
    let lists = post.sections.id(sectionId).lists;
    lists.push(newList);
    post.save((err, result) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(result);
    });
  });
});
router.post("/removeListFromSection", (req, res) => {
  const { postId, sectionId, listId } = req.body;
  Blog.findById(postId, function (err, post) {
    if (err) {
      console.log(err);
    }
    let lists = post.sections.id(sectionId).lists;
    post.sections.id(sectionId).lists = lists.filter((list) => {
      return list._id != listId;
    });
    post.save((err, result) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(result);
    });
  });
});
router.post("/setListTitle", (req, res) => {
  const { postId, sectionId, listId, newTitle } = req.body;
  Blog.findById(postId, function (err, post) {
    if (err) {
      console.log(err);
    }
    post.sections.id(sectionId).lists.id(listId).title = newTitle;
    post.save((err, result) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(result);
    });
  });
});

router.post("/createCardInList", (req, res) => {
  const { postId, sectionId, listId, order } = req.body;
  let newCard = new Card({ order });
  Blog.findById(postId, function (err, post) {
    if (err) {
      console.log(err);
    }
    post.sections.id(sectionId).lists.id(listId).cards.push(newCard);
    post.save((err, result) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(result);
    });
  });
});
router.post("/removeCardFromList", (req, res) => {
  const { postId, sectionId, listId, cardId } = req.body;

  Blog.findById(postId, function (err, post) {
    if (err) {
      console.log(err);
    }
    let cardsArr = post.sections
      .id(sectionId)
      .lists.id(listId)
      .cards.filter((card) => card._id != cardId);
    post.sections.id(sectionId).lists.id(listId).cards = cardsArr;
    post.save((err, result) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(result);
    });
  });
});

router.post("/editNote", (req, res) => {
  const { postId, sectionId, listId, cardId, editArr } = req.body;
  Blog.findById(postId, function (err, post) {
    if (err) {
      console.log(err);
    }
    editArr.forEach(({ editType, editValue }) => {
      // switch (editType) {
      //   case "tags":
      //     //editValue is a tag array
      //find if tag array

      //editValue.forEach(tag=>{
      //Tag.

      //})
      //     break;

      //   default:
      //     break;
      // }
      post.sections.id(sectionId).lists.id(listId).cards.id(cardId)[editType] =
        editValue;
    });
    // const contentTest = "content";
    // post.sections.id(sectionId).lists.id(listId).cards.id(cardId)[contentTest] =
    //   content;
    // post.sections.id(sectionId).lists.id(listId).cards.id(cardId).tags = tags;
    post.save((err, result) => {
      if (err) return res.json({ success: false, err });
      res.status(200).json(result);
    });
  });
});

module.exports = router;
