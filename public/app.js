// Grab the articles as a json

var modalShow = false;
$.getJSON( "/articles", function ( data ) {
    // For each one
    for ( var i = 0; i < data.length; i++ ) {
        // Display the apropos information on the page
        var article = "articles" + i;
        var link = "link" + i;
        var href = "https://www.gamespot.com" + data[i].link;

        //create a holder
        var row = $( '<div/>', { class: 'w3-quarter zoom' } );
        row.attr( 'style', 'height:240px' );
        row.append( $( '<img>' ) );
        row.append( $( '<h7  id =' + article + '></h7>' ) );
        row.append( $( '<br>)' ) );
        row.append( $( '<a id ="link' + i + '"href=' + href + '></a><br>' ) );
        row.append( $( '<input type="button" data-id = ' + data[i]._id + ' class="comment-button" value="comment" style:"display:none"/>' ) );
        $( '#content' ).append( row );
        article = "#" + article;

        $( "#articles" + i ).append( data[i].title );
        $( "#articles" + i ).attr( "data-id", data[i]._id );
        $( "#link" + i ).append( data[i].link );

        //   $("#articles"+i).append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
} );

$( document ).on( "click", "#close", function () {
    event.preventDefault();
    $( "#commentCard" ).hide();
} );


$( document ).on( "click", "#scrape", function () {
    $.ajax( {
        method: "GET",
        url: "/scrape"
    } ).then(function(err)
    {if (err)
    {throw err};
    });
    setTimeout(function(){window.location.reload()},1000)
});

// Whenever someone clicks a p tag
$( document ).on( "click", ".comment-button", function () {
    var data = $( this ).attr( "data-id" );
    $( "#savecomment" ).attr( "data-id", data );
    $( "#commentCard" ).show();
    modalShow = true;
    // Empty the notes from the note section
    $( "#comments" ).empty();
    // Save the id from the p tag
    var thisId = $( this ).attr( "data-id" );
    console.log( "thisID:" + thisId );

    // Now make an ajax call for the Article
    $.ajax( {
        method: "GET",
        url: "/articles/" + thisId
    } )
        // With that done, add the note information to the page
        .then( function ( data ) {
            console.log( data );
            // The title of the article
            $( "#comments" ).prepend( "<h2>" + data.title + "</h2>" );
            // An input to enter a new title
            // $("#comments").append("<input id='titleinput' name='title' >");
            // A textarea to add a new note body
            // $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            // $("#comments").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

            // If there's a note in the article
            if ( data.note ) {
                // Place the body of the note in the body textarea
                $( "#comments" ).append( data.note );
            }
        } );

$.ajax( {
    method: "GET",
    url: "/notes/" + thisId
} )
    // With that done, add the note information to the page
    .then( function ( data ) {
        console.log( data );
        // The title of the article
        for (var i=0;i<data.length;i++){
        $( "#comments" ).append( "<h7 id="+data[i]._id+">" + data[i].body+ "</h7>" );
        $( "#comments" ).append( "<button class = delete delete-id="+data[i]._id+" data-id="+data[i]._id+ ' style =position:relative;right:-100px; id='+data[i]._id+">delete</button><br>");
        }
        // An input to enter a new title
        // $("#comments").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        // $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        // $("#comments").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

        // If there's a note in the article
        if ( data.note ) {
            // Place the body of the note in the body textarea
            $( "#comments" ).append( data.body );
        }
    } );
} );
//delete button
$(document).on("click", ".delete", function(event) {
    var dId=$(this).attr('data-id');
  $("#"+dId).remove();
  $(this).remove();

  var noteID = $(this).attr("delete-id");

    $.ajax("/remove/notes/" + noteID, {
      type: "GET"
    }).then(
      function(data) {
      })


//   db.Note.remove({note:dId}, function(err, obj){})
  });
// When you click the savenote button
$( document ).on( "click", "#savecomment", function () {
    event.preventDefault();

    // Grab the id associated with the article from the submit button
    var thisId = $( this ).attr( "data-id" );
    console.log(thisId);
    $("#comments").append($( "#commentText" ).val()+"<br>");
    
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax( {
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // Value taken from title input
            body: $( "#commentText" ).val(),
            // Value taken from note textarea
            note: thisId
        }
    } )
        // With that done
        .then( function ( data ) {
            // Log the response
            console.log( data );
            // Empty the notes section
            $( "#commentText" ).empty();
        } );
        $.ajax( {
            method: "POST",
            url: "/notes/" + thisId,
            data: {
                // Value taken from title input
                body: $( "#commentText" ).val(),
                // Value taken from note textarea
                note: thisId
            }
        } )
            // With that done
            .then( function ( data ) {
                // Log the response
                console.log( data );
                // Empty the notes section
                $( "#commentText" ).empty();
            } );


    // Also, remove the values entered in the input and textarea for note entry
    $( "#titleinput" ).val( "" );
    $( "#bodyinput" ).val( "" );
} );
