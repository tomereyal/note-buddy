const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("./Card");
require("./Blog");

const chainSchema = Schema({
  heads: [{ type: Schema.Types.ObjectId, ref: "Blog", default: [] }],
  type: {
    type: Schema.Types.String,
    enum: ["uniDirectional", "biDirectional"],
    default: "uniDirectional",
  },
  connector: { type: Schema.Types.ObjectId, ref: "Card", default: null },
  nodes: [{ type: Schema.Types.ObjectId, ref: "Card", default: [] }],
  outcomes: [{ type: Schema.Types.ObjectId, ref: "Blog", default: [] }],
  //add examples field.. an array of examples of the chain
  // ..you could make the head of the chain a chain head from the examples tab
});

const Chain = mongoose.model("Chain", chainSchema);
module.exports = { Chain };
