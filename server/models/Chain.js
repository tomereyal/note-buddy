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
  connectors: [{ type: Schema.Types.ObjectId, ref: "Card", default: [] }],
  outcomes: [{ type: Schema.Types.ObjectId, ref: "Blog", default: [] }],
});

const Chain = mongoose.model("Chain", chainSchema);
module.exports = { Chain };
