'use strict';
const Comment = require( '../models/comment' );
//console.log("loading the skills Controller")


exports.saveComments = ( req, res ) => {
  //console.log("in saveSkill!")
  //console.dir(req)
  let newComment = new Comment(
    {
    name: req.body.name,
    data1: req.body.data1,
    data2: req.body.data2,
    data3: req.body.data3,
    data4: req.body.data4,
    }
  )

  console.log("newComment = "+newComment)

  newComment.save()
    .then( () => {
      console.log("saved the data")
      res.redirect( '/showComments' );
    } )
    .catch( error => {
      res.send( error );
    } );
};
exports.getAllComments = ( req, res ) => {
  //gconsle.log('in getAllSkills')
  Comment.find( )
    .exec()
    .then( ( comments ) => {
      res.render( 'comments', {
        comments: comments
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

exports.getOneComments = ( req, res ) => {
  //gconsle.log('in getAllSkills')
  const id = req.params.id
  console.log('the id is'+id)
  Comment.findOne({_id:id} )
    .exec()
    .then( ( comment ) => {
      res.render( 'comment', {
        comment: comment
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
