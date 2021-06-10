const express = require("express");
const router = express.Router();
const { Folder } = require("../models/Folder");

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

// router.get("/getFolders", (req, res) => {
//   Folder.find()
//     .populate("writer")
//     .exec((err, folders) => {
//       if (err) return res.status(400).send(err);
//       res.status(200).json({ success: true, folders });
//     });
// });
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

module.exports = router;
