const express = require("express");
const router = express.Router();
const { Blog, Section, List } = require("../models/Blog");
const { Card, Tag } = require("../models/Card");

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
    console.log(`res.req.file.path`, res.req.file.path);
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
    cards: [defaultCard._id],
  });
  let defaultSection = new Section({
    lists: [defaultList],
    title: "Section 1",
  });
  let blog = new Blog({
    name: req.body.name,
    writer: req.body.writer,
    image: req.body.image,
    components: req.body.components,
    roles: req.body.roles,
    sections: [defaultSection],
  });
  defaultCard.location = {
    post: blog._id,
    section: defaultSection._id,
    list: defaultList._id,
  };
  defaultCard.save((err, card) => {
    if (err) return res.json({ success: false, err });
    blog.saveAndPopulate((err, postInfo) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).json({ success: true, postInfo });
    });
  });

  //search Folder collection for "folder-name" (req.body.folderName) and add it there.
  //ALWAYS search Folder collection for "recent" folder and add it there.
  //ALWAYS search Folder collection for "all blogs" folder and add it there.
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

router.post("/editPost", (req, res) => {
  const { postId, editArr } = req.body;
  Blog.findById(postId, function (err, post) {
    if (err) {
      console.log(err);
    }

    editArr.forEach(({ editType, editValue }) => {
      post[editType] = editValue;
    });
    post.saveAndPopulate((err, result) => {
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
    cards: [defaultCard._id],
  });
  const newSection = new Section({
    title,
    order,
    lists: [defaultList],
    backgroundPattern,
    backgroundColor,
  });
  defaultCard.location = {
    post: postId,
    section: newSection._id,
    list: defaultList._id,
  };
  defaultCard.save((err, card) => {
    if (err) return res.json({ success: false, err });
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
        updatedPost
          .populate({
            path: "sections",
            model: "Section",
            populate: {
              path: "lists",
              model: "List",
              populate: { path: "cards", model: "Card" },
            },
          })
          .execPopulate((err, updatedPost) => {
            if (err) return res.json({ success: false, err });
            res.status(200).json(updatedPost);
          });
      }
    );
  });
});

router.post("/removeSectionFromPost", (req, res) => {
  const sectionId = req.body.sectionId;
  Card.deleteMany({ "location.section": sectionId }, function (err, result) {
    if (err) console.log(`card remove from section err`, err);
    // if (err) return res.json({ success: false, err });
    Blog.findById(req.body.postId, (err, post) => {
      if (err) return res.json({ success: false, err });

      post.sections = post.sections.filter((section) => {
        return section._id != sectionId;
      });
      post.saveAndPopulate((err, blogInfo) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json(blogInfo);
      });
    });
  });
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
    post.saveAndPopulate((err, result) => {
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

router.post("/editSection", (req, res) => {
  const { postId, sectionId, newTitle, editArr } = req.body;
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

router.post("/createListInSection", (req, res) => {
  const { postId, sectionId, title, order } = req.body;
  const defaultCard = new Card({});
  const newList = new List({
    title: "new list",
    order,
    cards: [defaultCard._id],
  });
  defaultCard.location = {
    post: postId,
    section: sectionId,
    list: newList._id,
  };
  defaultCard.save((err, card) => {
    if (err) return res.json({ success: false, err });
    Blog.findById(postId, function (err, post) {
      if (err) {
        console.log(err);
      }

      let lists = post.sections.id(sectionId).lists;
      lists.push(newList);
      post.saveAndPopulate((err, result) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json(result);
      });
    });
  });
});
router.post("/removeListFromSection", (req, res) => {
  const { postId, sectionId, listId } = req.body;
  Card.deleteMany({ "location.list": listId }, function (err, result) {
    if (err) console.log(`card remove from list err`, err);
    // if (err) return res.json({ success: false, err });
    Blog.findById(postId, function (err, post) {
      if (err) {
        console.log(err);
      }
      let lists = post.sections.id(sectionId).lists;
      post.sections.id(sectionId).lists = lists.filter((list) => {
        return list._id != listId;
      });
      post.saveAndPopulate((err, result) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json(result);
      });
    });
  });
});

router.post("/editList", (req, res) => {
  const { postId, sectionId, listId, newTitle, editArr } = req.body;
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

router.post("/createCardInList", (req, res) => {
  const { postId, sectionId, listId, order } = req.body;
  const newCard = new Card({
    order,
    location: { post: postId, section: sectionId, list: listId },
  });
  newCard.save((err, card) => {
    if (err) return res.json({ success: false, err });
    Blog.findById(postId, function (err, post) {
      if (err) {
        console.log(err);
      }
      post.sections.id(sectionId).lists.id(listId).cards.push(newCard._id);
      post.saveAndPopulate((err, updatedPost) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json(updatedPost);
      });
      // post.save((err, updatedPost) => {
      //   if (err) return res.json({ success: false, err });
      //   // updatedPost
      //   //   .populate({
      //   //     path: "sections",
      //   //     model: "Section",
      //   //     populate: {
      //   //       path: "lists",
      //   //       model: "List",
      //   //       populate: { path: "cards", model: "Card" },
      //   //     },
      //   //   })
      //   //   .execPopulate((err, updatedPost) => {
      //   //     if (err) return res.json({ success: false, err });
      //   //     res.status(200).json(updatedPost);
      //   //   });

      //   // res.status(200).json(updatedPost);
      // });
    });
  });
});
router.post("/removeCardFromList", (req, res) => {
  const { postId, sectionId, listId, cardId } = req.body;
  Card.findByIdAndDelete(cardId, function (err, result) {
    if (err) return res.json({ success: false, err });
    Blog.findById(postId, function (err, post) {
      if (err) {
        console.log(err);
      }
      let cardsArr = post.sections
        .id(sectionId)
        .lists.id(listId)
        .cards.filter((card) => card != cardId);
      post.sections.id(sectionId).lists.id(listId).cards = cardsArr;
      post.saveAndPopulate((err, result) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json(result);
      });
    });
  });
});

router.post("/editNote", (req, res) => {
  const { postId, sectionId, listId, cardId, editArr } = req.body;
  Card.findById(cardId, function (err, card) {
    if (err) {
      console.log(err);
    }
    editArr.forEach(({ editType, editValue }) => {
      switch (editType) {
        case "tags":
          card[editType] = editValue.map((tag) => {
            return new Tag({ name: tag.character });
          });
          break;
        default:
          card[editType] = editValue;
      }
    });
    card.save((err, cardInfo) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).json({ success: true, cardInfo });
    });
  });
});

module.exports = router;
