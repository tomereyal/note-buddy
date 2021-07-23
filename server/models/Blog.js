const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("./Card");

const listSchema = mongoose.Schema(
  {
    // inPost: { type: Schema.Types.ObjectId, ref: "Blog" },
    // inSection: { type: Schema.Types.ObjectId, ref: "Section" },
    name: { type: String, default: "New list" },
    title: { type: [Schema.Types.Mixed], default: [] },
    order: { type: Number, default: 0 },
    cards: [{ type: Schema.Types.ObjectId, ref: "Card" }],
  },
  { timestamps: true }
);

const sectionSchema = mongoose.Schema(
  {
    // inPost: { type: Schema.Types.ObjectId, ref: "Blog" },
    name: { type: String, default: "" },
    title: { type: [Schema.Types.Mixed], default: [] },
    // titleFont: { type: String, default: "" },
    // titleBgc: { type: String, default: "" },
    // titleColor: { type: String, default: "" },
    backgroundColor: { type: String, default: "#fff" },
    backgroundPattern: { type: String, default: "" },
    order: { type: Number, default: 0 },
    lists: { type: [listSchema], default: [] },
  },
  { timestamps: true }
);

const roleSchema = mongoose.Schema({
  inPostName: { type: String, default: "" },
  inPostId: { type: Schema.Types.ObjectId, default: "" },
  description: { type: String, default: "" },
});

const blogSchema = mongoose.Schema(
  {
    //By default, Mongoose adds an _id property to your schemas.
    // folder: { type: Schema.Types.ObjectId, ref: "Folder" },
    name: String,
    nickNames: { type: Schema.Types.Array, default: [] },
    image: { type: String, default: "" },
    audio: { type: String, default: "" },
    title: { type: [Schema.Types.Mixed], default: [] },
    // titleFont: { type: String, default: "" },
    // titleBgc: { type: String, default: "" },
    // titleColor: { type: String, default: "" },
    content: { type: String },
    writer: { type: Schema.Types.ObjectId, ref: "User" },
    sections: { type: [sectionSchema], default: [] },
    description: { type: [Schema.Types.Mixed], default: [] },
    components: [{ type: Schema.Types.ObjectId, ref: "Blog", default: [] }],
    roles: { type: [roleSchema], default: [] }, // the roles of this object in other objects
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
      .populate({
        path: "components",
        model: "Blog",
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
const Role = mongoose.model("Role", roleSchema);
module.exports = { Blog, Section, List, Role };
