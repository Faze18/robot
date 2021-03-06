var express = require( "express" );
var bodyParser = require( "body-parser" );
var logger = require( "morgan" );
var mongoose = require( "mongoose" );

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require( "axios" );
var cheerio = require( "cheerio" );

// Require all models
var db = require( "./models" );

var PORT = 8080;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use( logger( "dev" ) );
// Use body-parser for handling form submissions
app.use( bodyParser.urlencoded( { extended: true } ) );
// Use express.static to serve the public folder as a static directory
app.use( express.static( "public" ) );

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/robot";
mongoose.Promise = Promise;
mongoose.connect( MONGODB_URI );

// Routes


// Route for getting all Articles from the db
app.get( "/articles", function ( req, res ) {
  // Grab every document in the Articles collection
  db.Article.find( {} )
    .then( function ( dbArticle ) {
      // If we were able to successfully find Articles, send them back to the client
      res.json( dbArticle );
    } )
    .catch( function ( err ) {
      // If an error occurred, send it to the client
      res.json( err );
    } );
} );
app.get( "/notes", function ( req, res ) {
  // Grab every document in the Articles collection
  db.Note.find( {} )
    .then( function ( dbArticle ) {
      // If we were able to successfully find Articles, send them back to the client
      res.json( dbArticle );
      $( "#comments" ).append( dbArticle );
    } )
    .catch( function ( err ) {
      // If an error occurred, send it to the client
      res.json( err );
    } );
} );
// Route for grabbing a specific Article by id, populate it with it's note
app.get( "/articles/:id", function ( req, res ) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne( { _id: req.params.id } )
    // ..and populate all of the notes associated with it
    .populate( "note" )
    .then( function ( dbArticle ) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json( dbArticle );
    } )
    .catch( function ( err ) {
      // If an error occurred, send it to the client
      res.json( err );
    } );
} );
//get a n0te by id
app.get( "/notes/:id", function ( req, res ) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Note.find( { note: req.params.id } )
    // ..and populate all of the notes associated with it
    .then( function ( dbArticle ) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json( dbArticle );
    } )
    .catch( function ( err ) {
      // If an error occurred, send it to the client
      res.json( err );
    } );
} );
app.get( "/remove/notes/:id", function ( req, res ) {

  db.Note.findOneAndRemove( { _id: req.params.id }, function ( error, data ) {
    if ( error ) {
      console.log( error );
    } else {
    }
    res.json( data );
  } );
} );
// Route for saving/updating an Article's associated Note
app.post( "/articles/:id", function ( req, res ) {
  // Create a new note and pass the req.body to the entry
  console.log( req.body );

  db.Note.create( req.body )
    .then( function ( dbNote ) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate( { _id: req.params.id }, { note: dbNote._id }, { new: true } );
    } );
  db.Note.find( { 'note': req.params.id } )
    .then( function ( dbArticle ) {
      console.log( req.params.id );
      $( "#comments" ).append( dbArticle );
      // If we were able to successfully update an Article, send it back to the client
      res.json( dbArticle );
    } )
    .catch( function ( err ) {
      // If an error occurred, send it to the client
      res.json( err );
    } );
} );

// Start the server
app.listen( process.env.PORT || PORT, function () {
  console.log( "App running on port " + PORT + "!" );
} );
