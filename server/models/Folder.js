const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const { blogSchema } = require("../models/Blog");
const folderSchema = mongoose.Schema(
  {
    name: { type: String },
    blogs: { type: [mongoose.Schema.blogSchema], default: [] },
    writer: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Folder = mongoose.model("Folder", folderSchema);
module.exports = { Folder };
