

$(document).ready(function() {
  $('#select-btn').click(function() {
    var team = $('#tags').val();
    pickTurn(team);
  });
});



//  ++++++++++++++++++++++++ who is next ++++++++++++++++++++++++++++++++++
// This is done with 3 functions to avoid latency errors. The first function 
// pickTurn() - looks at the selections database and determines how many selections have been made - 
// 'whoIsNext() - gets the email of who is next
// Finally, the draft order and the number of selections are passed to the 3rd function getPicker()
// and this function reveals whose turn it is.
// Need to call pick because of asynchronicity...
// who = pickNum() ---> returns next person...
// why 3 functions? Workaround - because of asynchronicity/database latency (will return empty arrays otherwise)

function pickTurn(team){
    var currentPick = 0;
    var user = firebase.auth().currentUser;
    if (user) {
        name = user.displayName;
        email = user.email;
        var ref = firebase.database().ref("2018selections");
        ref.once("value")
        .then(function(snapshot) {
            currentPick = snapshot.numChildren(); 
            whoIsNext(currentPick,email,team);
        });
    }
    else{
        alert("You're not signed in")
        }
};

function whoIsNext(pickInt,email,team){
    var emailTurnArray= [];
    var eachEmail;
    var who = '';
    var databaseRef = firebase.database().ref("2017DraftOrder").orderByKey();
        databaseRef.once("value")
        .then(function(snapshot) {
            snapshot.forEach(function(somet) {
                eachEmail = somet.val().email;
                emailTurnArray.push(eachEmail);
            })
        getPicker(emailTurnArray,pickInt,email);
        })
};

function getPicker(array,num,email){
    console.log(array[num]+' OK!');

    // var team = $('#tags').val();
    // firebase.database().ref("2018selections").orderByChild("selTeam").equalTo(team).once("value",snapshot => {
    //     const userData = snapshot.val();
    //     if (userData){
    //       console.log("exists!");
    //       alert('Sorry, ' + team + ' has already been selected!');
    //     }
    //     else{
    //         saveTeamToDb(email,team,num);
    //         alert('Congrats, you have selected' + team);
    //     }
    // });

    var team = $('#tags').val();
    firebase.database().ref("teams").orderByChild("School").equalTo(team).once("value",snapshot1 => {
        const teamData = snapshot1.val();
    firebase.database().ref("2018selections").orderByChild("selTeam").equalTo(team).once("value",snapshot2 => {
        const userData = snapshot2.val();
    firebase.database().ref("2018selections").orderByChild("selTeam").once("value",snapshot3 => {
        const teamList = snapshot3.numChildren();

        if (teamData){
          console.log("Team is on list!");

                if (array[num] == email){
                    console.log (array[num] + ' and ' + email + ' are the same. The correct person is selecting a team');

                    console.log(teamList);

                    if(teamList < 10){
                        saveTeamToDb(email,team,num); 
                        window.location.reload();
                        alert('Congrats, you have selected ' + team); 
                    }

                    else{
                        if (userData){
                            console.log("exists!");
                            alert('Sorry, ' + team + ' has already been selected!');
                            }
                            else{
                                saveTeamToDb(email,team,num); 
                                window.location.reload();
                                alert('Congrats, you have selected ' + team); 
                            }
                    }
                }
                else{
                    alert('Sorry, it is not your turn!')
                }
            
                // if (userData){
                // console.log("exists!");
                // alert('Sorry, ' + team + ' has already been selected!');
                // }
                // else{
                //     saveTeamToDb(email,team,num);
                //     alert('Congrats, you have selected ' + team);
                    
                // }
            }
        else{
            alert(team + ' is not on the NCAA list. Please check the selection and pick again');
        }
    });
    });   
    });


    // if (array[num] == email){
    //     console.log (array[num] + ' and ' + email + ' are the same. The correct person is selecting a team');
    // }
    // else{
    //     alert('Sorry, it is not your turn!')
    // };
};



//  ++++++++++++++++++++++++ Check if Team is on List ++++++++++++++++++++++++++++++++++ 

function testTeamOnList(testArray, team){
    var onlist;
    var isSelected = 0;
    // console.log (isSelected + ' value of isSelected');
    // console.log ('printing the test array ');
    // console.log (onlist);
    for (let onlist of testArray) {
        console.log(onlist.selTeam + ' somehow its getting here first!'); // 1, "string", false
        if(onlist.selTeam === String(team)) {  
            alert('Sorry, ' + team + ' has been selected');
            isSelected = 1;
            console.log (isSelected + ' value of isSelected changed to 1');
         }
    }
    if(isSelected == 1) {
        console.log('returning 1');
        return(1);
    } 
    else {
        console.log('returning 0');
        return(0);
    }
    // if(test >= 0){
    //     alert('found it in the array');
    //     return(true);
    // }
    // else{
    //     alert("Please Check your entry - the team you selected isn't on the list.");
    //     return(false); 
    // }
};    

//  ++++++++++++++++++++++++ put selected team in database ++++++++++++++++++++++++++++++++++ 

function saveTeamToDb(email,selTeam,pick) {

  // A post entry.
  var postData = {
    turnNumber: pick,
    email: email,
    selTeam: selTeam
  };
//   var pickSpot = pick +1;
//   var tableCell = 'pick'+pickSpot;
//   document.getElementById(tableCell).textContent = selTeam;

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('2018selections').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/2018selections/' + newPostKey] = postData;
  return firebase.database().ref().update(updates);
};





// //  ++++++++++++++++++++++++ Select team function ++++++++++++++++++++++++++++++++++ 

// // First Part determines how many picks have been made - passing the team and current pick number to step 2

// function selectTeam(team){
//     var currentPick = 0;
//     var ref = firebase.database().ref("selections");
//         ref.once("value")
//         .then(function(snapshot) {
//             currentPick = snapshot.numChildren(); 
//             selectTeam2(team,currentPick);
//         });
// };

// // Step 2 makes sure the user is signed in and retrieves email

// function selectTeam2(team,pick){
//     var user = firebase.auth().currentUser;
//     if (user) {
//         name = user.displayName;
//         email = user.email;
//         document.getElementById('show-user').textContent = email;
//         document.getElementById('show-team').textContent = team;
//         selectTeam2(email,team,pick);
//         } else {
//         alert("You're not signed in");
//     }
//     };

// // Step 3 compares the username to the person's whose turn it should be - if that's true, it saves it to the database
// // otherwise it tells you to wait...

// function selectTeam2(email,team,pick){




// // saveTeamToDb(email,team,pick);
// }