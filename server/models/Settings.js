const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//find a way to save this to the database regardless of the user.. 

const generalSettingsSchema = Schema({
  allowedLanguages: { type: [String], default: "English" },
});

const cardSettingsSchema = Schema({
  allowedColors: { type: String, default: "#fff" },
});

const settingsSchema = mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  generalSettings: { type: { generalSettingsSchema } },
  cardSettings: { type: { cardSettingsSchema } },
});

const Settings = mongoose.model("Settings", settingsSchema);
module.exports = { Settings };
