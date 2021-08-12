const express = require("express");
const router = express.Router();
const { Folder } = require("../models/Folder");
const { Blog } = require("../models/Blog");

//=================================
//             Folder
//=================================

router.post("/createFolder", (req, res) => {
  const { body } = req;
  const { name, writer } = body;
  const folder = new Folder({ name, writer, blogs: [] });
  console.log(folder);
  folder.save((err, folderInfo) => {
    if (err) return res.json({ success: false, err });
    console.log(folderInfo);
    return res.status(200).json({ success: true, folderInfo });
  });
});

router.put("/:id", (req, res) => {
  const folderId = req.params.id;
  console.log(`req.body`, req.body);
  Folder.findByIdAndUpdate(
    folderId,
    { $set: req.body },
    { new: true },
    function (err, folder) {
      if (err) return res.json({ success: false, err });

      Folder.find({ _id: folder._id })
        .populate("writer") // populate the writer
        .populate("blogs") //  populate the blogs
        .populate("cards") //  populate the blogs
        .exec((err, folder) => {
          if (err) return res.status(400).send(err);
          res.status(200).send({ success: true, folder });
        });
    }
  );
});

router.post("/createPostInFolder", (req, res) => {
  const { body } = req;
  const { writer, folderId, name } = body;
  const blog = new Blog({ content: null, writer: writer, name: name });
  //THIS METHOD IS WRONG
  //post will not show up in blogs collection
  Folder.findByIdAndUpdate(
    { _id: folderId },
    { $push: { blogs: blog } },
    { new: true },
    (err, updatedFolder) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).json(updatedFolder);
    }
  );
});
router.post("/addPostToFolder", (req, res) => {
  const { body } = req;
  const { newPostId, folderId } = body;
  Folder.findByIdAndUpdate(
    folderId,
    { $push: { blogs: newPostId } },
    { new: true }
  )
    .populate("blogs")
    .exec((err, folder) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, folder });
    });
});

router.get("/fetchFolders", (req, res) => {
  // req.session.cats = ["bluecat"];

  Folder.find()
    .populate("writer") // populate the writer
    .populate("blogs") //  populate the blogs
    .populate("cards") //  populate the blogs
    .exec((err, folders) => {
      if (err) return res.status(400).send(err);
      res.status(200).send({ success: true, folders: folders });
    });
});

// router.delete("/deleteFolder/:folderId", (req, res) => {
//   console.log(req.params.folderId);

//   //delete all folder.posts... Blog.
//   // Blog.deleteMany({_id:{$in: folderPostIds}}, function (err, result) {

//   // })
//   Folder.findOneAndDelete({ _id: req.params.folderId }).then(
//     (result) => {
//       console.log(`Delete folder result`, result);
//     },
//     (reason) => {
//       console.log(reason);
//     }
//   );
// });

router.delete("/deleteFolder/:folderId", (req, res) => {
  console.log(req.params.folderId);
  Folder.findById(req.params.folderId, function (err, folder) {
    if (err) return res.json({ success: false, err });
    folder.remove({}, function (err) {
      if (err) {
        console.log(`err`, err);
        return res.json({ success: false, err });
      }
    });
  });
});

router.post("/deletePostFromFolder", (req, res) => {
  const { body } = req;
  const { postId, folderId } = body;
  // Folder.findOne({ _id: folderId }, function (err, folder) {
  //   folder.blogs.remove({ _id: postId });
  //   folder.save((err, result) => {
  //     if (err) return res.json({ success: false, err });
  //     res.status(200).json(result);
  //   });
  // });
  Folder.findByIdAndUpdate(
    folderId,
    { $pull: { blogs: postId } },
    { new: true }
  )
    .populate("blogs")
    .exec((err, folder) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, folder });
    });
});

module.exports = router;
