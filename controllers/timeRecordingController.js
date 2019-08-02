'use strict';
const TimeRecording = require( '../models/TimeRecording' );

exports.saveStartTime = ( req, res ) => {
  //console.log("in saveSkill!")
  //console.dir(req)
  let newTimeRecording = new TimeRecording(
   {
      userId: req.user._id,
      startAt:new Date()
   }
  )

  //console.log("skill = "+newSkill)

  .save()
    .then( () => {
      res.redirect( '/timeREnd' );
    } )
    .catch( error => {
      res.send( error );
    } );
};

exports.saveEndTime = ( req, res ) => {
  //console.log("in saveSkill!")
  //console.dir(req)
  TimeRecording.find({userId:req.user._id}).sort({startAt:-1})
    .exec()
    .then( ( timeResults ) => {
      let timeData = timeResults[0];
      if (timeData.endAt==null) {
      timeData.endAt = new Date();
      timeData.endDate = timeData.endAt.toDateString()
      timeData.sleepTime = (timeData.endAt - timeData.startAt)/1000.0/3600
      }
      timeData.save()

      .then((result) => {
        console.log("just saved time")
        console.dir(result)
        const timeInHours = (result.endAt.getTime()-result.startAt.getTime())/(1000*60*60);

        res.render('timeResult',{timeRecording:result,timeInHours:timeInHours})
      })
      .catch((error) => {
        console.log("error in saving the time:"+error.message)
      })

    })
    .catch( ( error ) => {
      console.log( "trying to update current timeResult:"+error.message );
      return [];
    } )
    .then( () => {
      //console.log( 'skill promise complete' );
    })
}

// this displays all of the skills
exports.getTimeRecording = ( req, res ) => {
  //gconsle.log('in getAllSkills')
  TimeRecording.find()
    .exec()
    .then( ( timeResult ) => {
      res.render( 'timeResult', {
        title:"timeResult",timeResult:timeResult
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      //console.log( 'skill promise complete' );
    } );
};

exports.addSleepHours = (req,res,next) => {
  TimeRecording.aggregate([
    {$group:{_id:'$endDate',sleep:{$sum:'$sleepTime'}}}
  ])
  .exec()
  .then((times) => {
    console.log("the times are ")
    console.dir(times)
    res.locals.times = times
    next()
  })
  .catch((error) => {
    console.log("Error in addSleepHours:"+error.message)
    res.send(error)
  })
}

exports.showAllHistory = ( req, res, next ) => {
  //console.log("in saveSkill!")
  //console.dir(re
  console.log("in showAllTime")
  TimeRecording.find({userId:req.user._id}).sort({startAt:-1})
    .exec()
    .then( ( historyData ) => {
        console.log("found history data: "); console.dir(historyData.length)
        res.locals.timeRecording = historyData
        next()
    })
    .catch( ( error ) => {
      console.log( "ERROR in showAllTime:"+error.message );
      return [];
    } )
    .then( () => {
      //console.log( 'skill promise complete' );
    })
}
