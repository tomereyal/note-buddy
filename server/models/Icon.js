const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const iconSchema = mongoose.Schema(
  {
    icons: { type: Array, default: [] },
  },
  { timestamps: true }
);
const Icon = mongoose.model("Icon", iconSchema);

module.exports = { Icon };
