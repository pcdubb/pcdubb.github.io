var query = firebase.database().ref("playerTurns").orderByKey();
var queryTeams = firebase.database().ref("2018selections").orderByKey();

var turnArray = [];
turnArray.length = 0;
var emailArray = [];
emailArray.length = 0;
var childData='';


query.once("value")
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.val().name;
      var turnEmail = childSnapshot.val().playerEmail;
      turnArray.push(key);
      emailArray.push(turnEmail);
  })
  populateArray();
  makeHtmlListForPage();
});

// queryTeams.once("value")
//   .then(function(snapshot) {
//     snapshot.forEach(function(childSnapshot) {
//       var teamKey = childSnapshot.val().selTeam;
//       teamArray.push(teamKey);
//   });
// });


    // populateEmailDB();
    // turn on when creating new email Sequence

//  ++++++++++++++++++++++++ Populate Turns Sequence ++++++++++++++++++++++++++++++++++ 


var turns = [];
turns.length=0;
var emails = [];
emails.length = 0;

function populateArray(){
        var backward = [];
        backward.length=0;
        //First Pick
        turns = turnArray.concat(turnArray);
        backward=turnArray.reverse();
        //Second Pick
        turns = turns.concat(backward);
        //longshot
        turns = turns.concat(backward);

};

//  ++++++++++++++++++++++++ List the Order on the site ++++++++++++++++++++++++++++++++++ 


function makeHtmlListForPage(){
    var currentPick = 0;
    var ref = firebase.database().ref("2018selections");
        ref.once("value")
        .then(function(snapshot) {
            currentPick = snapshot.numChildren(); 
            makeHtmlListForPage2(currentPick);
        });
};


function makeHtmlListForPage2(currentTurn){
var htmlTurns = '';
var htmlWhoseTurn = '';
for (var i = 0; i < turns.length; i++) {
    if(i == currentTurn){
        htmlTurns = htmlTurns + "<li class='turns' style='background-color:yellow';>" + turns[i] + "</li>";
        htmlWhoseTurn = '<font color="red">' + '<u>' + turns[i] + '</u>' + '</font>' + ' is on the clock!';
        var ref = firebase.database().ref("2018selections");
        var pick;
        ref.once("value")
        .then(function(snapshot) {
            pick = snapshot.numChildren(); 
            console.log(pick);
            updateTable(pick);
        });
    }
    else{
        htmlTurns = htmlTurns + "<li class='turns';>" + turns[i] + "</li>";
    }
};
        document.getElementById('draft-order').innerHTML = htmlTurns;
        document.getElementById('whose-turn').innerHTML = htmlWhoseTurn;
};

//  ++++++++++++++++++++++++ Update Table function ++++++++++++++++++++++++++++++++++ 

function updateTable(pick) {
  var teamArray = [];
  teamArray.length = 0;

  queryTeams.once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var teamKey = childSnapshot.val().selTeam;
        teamArray.push(teamKey);
    });


  for (var i = 1; i < pick+1; i++) {
    if(pick > 0){
        var tableCell = 'pick'+ i;
        document.getElementById(tableCell).textContent = teamArray[i-1];
    }
    else{
    }
  };
  });
};


//  ++++++++++++++++++++++++ !!!! Populate Turns Sequence !!!! DO ONLY ONCE!!! ++++++++++++++++++++++++++++++++++ 
// +++ Probably need to configure this at some point with a create game function +++++



// var emails = [];
// emails.length = 0;

// function populateEmailDB(){
//         var backward = [];
//         backward.length=0;
//         //First Pick
//         emails = emailArray.concat(emailArray);
//         backward=emailArray.reverse();
//         //Second Pick
//         emails = emails.concat(backward);
//         //longshot
//         emails = emails.concat(backward);


//         for(var i in emails){
//             var postData = {
//                 email:emails[i],
//                 pickNumber:i
//             }
//             console.log(postData);

//             var newPostKey = firebase.database().ref().child('2017DraftOrder').push().key;
//             var updates = {};
//             updates['/2017DraftOrder/' + newPostKey] = postData;
//             firebase.database().ref().update(updates);
//             };
// };


