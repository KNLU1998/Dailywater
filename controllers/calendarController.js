'use strict';
const calendar = require( '../models/calendar' );

exports.saveDate = ( req, res ) => {
  //console.log("in saveSkill!")
  //console.dir(req)
  let newCalendar = new calendar(
   {
      userId: req.user._id,
      year:req.params.year,
      month:req.params.month,
      day:req.params.day
   }
  )

  //console.log("skill = "+newSkill)

  .save()
    .then( () => {
      //res.redirect( '/calendar' );
    } )
    .catch( error => {
      res.send( error );
    } );
};

exports.returnDate = ( req, res, next ) => {
  //gconsle.log('in getAllSkills')
  // this will already have the timeRecording array
  // storing all sleep data for the current user
  calendar.find({userId:req.user._id}).sort({startAt:-1})
    .exec()
    .then(
      function(data)
          {// filter out just those data for the specified eate
            const year = req.params.year
            const month = req.params.month
            const day = req.params.day
            console.log(`params = ${year}.${month}.${day}`)
            console.log('data.length = '+data.length)
            res.locals.caldata = data[0]
            res.render('daypage',{year:year,month:month,day:day})
          }
    )
    .catch( ( error ) => {
      console.log( error.message );
      res.send(error)
    } )
};
