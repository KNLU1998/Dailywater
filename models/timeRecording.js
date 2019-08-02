'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var timeRecordingSchema = Schema( {
  userId: ObjectId,
  startAt: Date,
  endAt: Date,
  status:Boolean,
  endDate: String,  //yyyy/mm/dd
  sleepTime: Number
} );

module.exports = mongoose.model( 'TimeRecording', timeRecordingSchema );
