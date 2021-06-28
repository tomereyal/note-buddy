const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const { blogSchema } = require("../models/Blog");
require("./Blog");

const folderSchema = mongoose.Schema(
  {
    name: { type: String },
    // blogs: { type: [mongoose.model("Blog").schema], default: [] },
    blogs: [{ type: Schema.Types.ObjectId, ref: "Blog" }],
    writer: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
//a mistake i made:
// I imported the blogSchema wrongly and cause mongoose not to recognize the blogs array
//inside the folder schema I gave blogs the type value :
//blogs: { type: [mongoose.Schema.blogSchema], default: [] },
//Below is the correct way, after importing the Blog file with the blogSchema.
// blogs: { type: [mongoose.model("Blog").schema], default: [] },
//..You can access a Mongoose Model's schema via Model#schema, so you can do:
//https://mongoosejs.com/docs/api.html#model_Model-schema

folderSchema.pre("remove", async function (next) {
  // Remove all the docs that refers
  const blogsArr = this.blogs;
  mongoose.model("Blog").deleteMany({ _id: { $in: blogsArr } }, function (err) {
    if (err) {
      console.log(`err`, err);
    }
    mongoose.model("Card").deleteMany(
      {
        "location.post": {
          $in: blogsArr,
        },
      },
      function (err, res) {
        if (err) {
          console.log(`err`, err);
        }
        console.log(`card deletion result:`, res);
      }
    );
  });

  next();
});

const Folder = mongoose.model("Folder", folderSchema);
module.exports = { Folder };
