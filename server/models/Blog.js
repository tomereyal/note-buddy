const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("./Card");
// const tagSchema = mongoose.Schema(
//   {
//     name: String,
//     style: {
//       color: { type: String, default: "" },
//       size: { type: String, default: "" },
//     },
//   },
//   { timestamps: true }
// );
// const Tag = mongoose.model("Tag", tagSchema);

// const cardSchema = mongoose.Schema(
//   {
//     order: { type: Number, default: 0 },
//     content: { type: [Schema.Types.Mixed], default: [] },
//     location: {
//       post: { type: Schema.Types.ObjectId },
//       section: { type: Schema.Types.ObjectId },
//       list: { type: Schema.Types.ObjectId },
//     },
//     tags: { type: [tagSchema], default: [] },
//   },
//   { timestamps: true }
// );
// const Card = mongoose.model("Card", cardSchema);
const listSchema = mongoose.Schema(
  {
    // inPost: { type: Schema.Types.ObjectId, ref: "Blog" },
    // inSection: { type: Schema.Types.ObjectId, ref: "Section" },
    title: { type: String, default: "New list" },
    titleFont: { type: String, default: "" },
    titleBgc: { type: String, default: "" },
    titleColor: { type: String, default: "" },
    order: { type: Number, default: 0 },
    cards: [{ type: Schema.Types.ObjectId, ref: "Card" }],
  },
  { timestamps: true }
);

const sectionSchema = mongoose.Schema(
  {
    // inPost: { type: Schema.Types.ObjectId, ref: "Blog" },
    title: { type: String, default: "" },
    titleFont: { type: String, default: "" },
    titleBgc: { type: String, default: "" },
    titleColor: { type: String, default: "" },
    backgroundColor: { type: String, default: "#fff" },
    backgroundPattern: { type: String, default: "" },
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
    titleFont: { type: String, default: "" },
    titleBgc: { type: String, default: "" },
    titleColor: { type: String, default: "" },
    content: { type: String },
    writer: { type: Schema.Types.ObjectId, ref: "User" },
    sections: { type: [sectionSchema], default: [] },
  },
  { timestamps: true }
);

blogSchema.pre("remove", function (next) {
  const postId = this._id;
  mongoose.model("Card").deleteMany(
    {
      "location.post": postId,
    },
    function (err, res) {
      if (err) console.log(`err`, err);
    }
  );
  next();
});

// blogSchema.methods.saveAndPopulate = function (doc) {
//   return doc.save().then((doc) => doc.populate("foo").execPopulate());
// };
blogSchema.methods.saveAndPopulate = function (cb) {
  return this.save((err, updatedPost) => {
    if (err) {
      console.log(`err`, err);
    }
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
      .execPopulate(cb);
  });
};
// animalSchema.methods.findSimilarTypes = function (cb) {
//   return mongoose.model("Animal").find({ type: this.type }, cb);
// };
const Blog = mongoose.model("Blog", blogSchema);
const Section = mongoose.model("Section", sectionSchema);
const List = mongoose.model("List", listSchema);
module.exports = { Blog, Section, List };
