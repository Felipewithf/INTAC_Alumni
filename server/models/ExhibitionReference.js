const { Schema, model } = require("mongoose");

const exhibitionReferenceSchema = new Schema({
  exhibition: { type: Schema.Types.ObjectId, ref: 'Exhibition', required: true },
  alumProfile: { type: Schema.Types.ObjectId, ref: 'AlumProfile', required: true },
  referenceLink: { type: String }
});
const ExhibitionReference = model("ExhibitionReference", exhibitionReferenceSchema);
module.exports = ExhibitionReference;
