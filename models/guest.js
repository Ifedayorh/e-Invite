const mongoose = require('mongoose')
const Schema = mongoose.Schema

const guestSchema = new Schema({
  guestName: { type: String },
  guestParty: { type: String },
  guestEmail: { type: String, required: true },
  emailHash: { type: String },
  eventId: { type: String },
  rsvp: { type: Boolean, default: false },
  emailed: { type: Boolean, default: false },
  comment: String
})


const Guest = mongoose.model('Guest', guestSchema)

module.exports = Guest
