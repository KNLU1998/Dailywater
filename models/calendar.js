'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

var calendarSchema = Schema( {
  userId: ObjectId,  //yyyy/mm/dd
  year: Number,
  month: Number,
  day:Number
} );

module.exports = mongoose.model( 'calendar', calendarSchema );
