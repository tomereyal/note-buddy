const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

const cardSchema = mongoose.Schema(
  {
    // inPost: { type: Schema.Types.ObjectId, ref: "Blog" },
    // inSection: { type: Schema.Types.ObjectId, ref: "Section" },
    // inList: { type: Schema.Types.ObjectId, ref: "List" },
    order: { type: Number, default: 0 },
    content: { type: [Schema.Types.Mixed] },
    tags: { type: [Schema.Types.Mixed], default: [] },
  },
  { timestamps: true }
);

const listSchema = mongoose.Schema(
  {
    // inPost: { type: Schema.Types.ObjectId, ref: "Blog" },
    // inSection: { type: Schema.Types.ObjectId, ref: "Section" },
    order: { type: Number, default: 0 },
    cards: { type: [cardSchema], default: [] },
  },
  { timestamps: true }
);

const sectionSchema = mongoose.Schema(
  {
    // inPost: { type: Schema.Types.ObjectId, ref: "Blog" },
    title: { type: String, default: "" },
    order: { type: Number, default: 0 },
    lists: { type: [listSchema], default: [] },
  },
  { timestamps: true }
);

const blogSchema = mongoose.Schema(
  {
    //By default, Mongoose adds an _id property to your schemas.
    // folder: { type: Schema.Types.ObjectId, ref: "Folder" },
    name: String,
    content: { type: String },
    writer: { type: Schema.Types.ObjectId, ref: "User" },
    sections: { type: [sectionSchema], default: [] },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
const Section = mongoose.model("Section", sectionSchema);
const List = mongoose.model("List", listSchema);
const Card = mongoose.model("Card", cardSchema);

module.exports = { Blog, Section, List, Card };
