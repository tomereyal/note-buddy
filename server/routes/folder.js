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
  const folder = new Folder({ name, writer });
  console.log(folder);
  folder.save((err, folderInfo) => {
    if (err) return res.json({ success: false, err });
    console.log(folderInfo);
    return res.status(200).json({ success: true, folderInfo });
  });
});

router.post("/createPostInFolder", (req, res) => {
  const { body } = req;
  const { writer, folderId, name } = body;
  const blog = new Blog({ content: null, writer: writer, name: name });
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
  const { post, folderId } = body;
  console.log(`post`, post);
  console.log(`folderId`, folderId);
  const blog = new Blog({
    _id: post._id,
    content: null,
    writer: post.writer,
    name: post.name,
    sections:post.sections,
    createdAt: post.createdAt,
  });
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

router.get("/fetchFolders", (req, res) => {
  Folder.find()
    .populate("writer")
    .exec((err, folders) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, folders });
    });
});

router.delete("/deleteFolder/:folderId", (req, res) => {
  console.log(req.params.folderId);
  Folder.findByIdAndRemove({ _id: req.params.folderId }).then(
    (result) => {
      console.log(`Delete folder result`, result);
    },
    (reason) => {
      console.log(reason);
    }
  );
});

router.post("/deletePostFromFolder", (req, res) => {
  const { body } = req;
  const { postId, folderId } = body;

  Folder.findByIdAndUpdate(
    { _id: folderId },
    {
      $pull: { blogs: { _id: postId } },
    },
    { new: true },
    (err, updatedFolder) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).json(updatedFolder);
    }
  );
});

module.exports = router;
