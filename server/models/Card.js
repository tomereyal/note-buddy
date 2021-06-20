const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cardSchema = mongoose.Schema(
    {
      content: { type: [Schema.Types.Mixed], default: [] },
      tags: { type: [Schema.Types.Mixed], default: [] }, //consider referencing 
    },
    { timestamps: true }
  );
  

const Card = mongoose.model("Card", cardSchema);
module.exports = { Card };
