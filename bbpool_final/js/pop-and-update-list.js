
// This populates the selection box for teams with NCAA BB Teams for selection

var query = firebase.database().ref("teams").orderByKey();
var teamArray = [];
query.once("value")
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      // key will be "ada" the first time and "alan" the second time
      var key = childSnapshot.key;
      // childData will be the actual contents of the child
      var childData = childSnapshot.val();
    //   console.log(childData.School);
      teamArray.push(childData.School);
  });
//   console.log(teamArray);

});


// ----------------------------------------------------------- //


$(document).ready(function() {
    var aTags = teamArray;

    $( "#tags" ).autocomplete({
        source: aTags
    });
    
});
