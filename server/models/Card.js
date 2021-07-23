const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagSchema = mongoose.Schema(
  {
    name: { type: String, default: "", unique: true },
    style: {
      color: { type: String, default: "" },
      size: { type: String, default: "" },
    },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);
const Tag = mongoose.model("Tag", tagSchema);

const cardSchema = mongoose.Schema(
  {
    name: { type: String, default: "" },
    title: { type: [Schema.Types.Mixed], default: [] },
    order: { type: Number, default: 0 },
    conditions: { type: Schema.Types.Array, default: [] },
    content: { type: [Schema.Types.Mixed], default: [] },
    location: {
      post: { type: Schema.Types.ObjectId },
      section: { type: Schema.Types.ObjectId },
      list: { type: Schema.Types.ObjectId },
    },
    tags: { type: [tagSchema], default: [] },
  },
  { timestamps: true }
);
const Card = mongoose.model("Card", cardSchema);
module.exports = { Tag, Card };
