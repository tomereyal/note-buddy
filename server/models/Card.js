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

const positionSchema = mongoose.Schema({
  x: { type: Number, default: 100 },
  y: { type: Number, default: 250 },
});

const subCardSchema = mongoose.Schema(
  {
    name: { type: String, default: "" },
    title: { type: [Schema.Types.Mixed], default: [] },
    content: { type: [Schema.Types.Mixed], default: [] },
    tags: { type: [tagSchema], default: [] },
    flowData: {
      type: { type: String, enum: ["NODE", "EDGE"], default: "NODE" },
      position: {
        type: positionSchema,
        default: {
          x: 100,
          y: 250,
        },
      },
      source: { type: String, default: "" },
      target: { type: String, default: "" },
      animated: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

const cardSchema = mongoose.Schema(
  {
    name: { type: String, default: "" },
    title: { type: [Schema.Types.Mixed], default: [] },
    order: { type: Number, default: 0 },
    conditions: { type: Schema.Types.Array, default: [] },
    content: { type: [Schema.Types.Mixed], default: [] },
    subCards: [{ type: Schema.Types.ObjectId, ref: "Card", default: [] }],
    tags: { type: [tagSchema], default: [] },
    flowData: {
      type: { type: String, enum: ["NODE", "EDGE"], default: "NODE" },
      position: {
        type: positionSchema,
        default: {
          x: 100,
          y: 250,
        },
      },
      source: { type: String, default: "" },
      target: { type: String, default: "" },
      animated: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);
const Card = mongoose.model("Card", cardSchema);
module.exports = { Tag, Card };
