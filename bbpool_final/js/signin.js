// ----------------------------------------------------------- //
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBbxTFPsHU_ShzMoUkbBuhtFTvU2v_gtXM",
    authDomain: "bbpool-66517.firebaseapp.com",
    databaseURL: "https://bbpool-66517.firebaseio.com",
    storageBucket: "bbpool-66517.appspot.com",
    messagingSenderId: "768155263555"
  };
  firebase.initializeApp(config);

// ----------------------------------------------------------- //

window.onload = function() {
    updateStatus();
    initApp();
};

// ----------------------------------------------------------- //

function signOut(){
    firebase.auth().signOut().then(function() {
        console.log("Logged out!")
    }, function(error) {
    console.log(error.code);
    console.log(error.message);
    });
    updateStatus();
}

// ----------------------------------------------------------- //

function signIn(email, password){


    firebase.auth().signOut().then(function() {
    console.log("Logged out!")
    }, function(error) {
        console.log(error.code);
        console.log(error.message);
    });

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        alert(error.message);
        console.log(error.code);
        console.log(error.message);
    });
    updateStatus();
}


// ----------------------------------------------------------- //

function updateStatus(){
    firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        name = user.displayName;
        email = user.email;
        emailVerified = user.emailVerified;
        uid = user.uid;
        // console.log(email);
        // document.getElementById('check-name').textContent = name;
        // document.getElementById('check-email').textContent = email;
        // document.getElementById('check-uid').textContent = uid;
        document.getElementById('welcomeUser').textContent = "- " + name + " you are signed in!";
        document.getElementById('navSignIn').textContent = "Sign Out";
        $('#navSignIn').attr('data-target','#logout-modal');
        document.getElementById('navUpName').textContent = "Update User Name";


    } else {
        // document.getElementById('check-name').textContent = 'nobody is signed in';
        // document.getElementById('check-name').textContent = 'nope';
        // document.getElementById('check-email').textContent = 'nope';
        // document.getElementById('check-uid').textContent = 'nope';
        document.getElementById('navSignIn').textContent = "Sign In or Register";
        $('#navSignIn').attr('data-target','#login-modal');
        document.getElementById('welcomeUser').textContent = '';
        document.getElementById('navUpName').textContent = '';
    }
    });

}

// ----------------------------------------------------------- //

function initApp() {
    // TODO
}

// ----------------------------------------------------------- //


$(document).on('hide.bs.modal','#login-modal', function () {
                var modal_password = $('#modal-password').val();
                var modal_email = $('#modal-email').val();
                signIn(modal_email, modal_password)
});

// ----------------------------------------------------------- //

$(document).on('hide.bs.modal','#logout-modal', function () {
    signOut();
});

// ----------------------------------------------------------- //

$(document).on('closed.bs.alert', function(){
    $('#navSignIn').modal('show');
});


// ---------------------Change Display Name Load----------------------------- //

$('#navUpName').click(function(){
    $('#displayNameModal').modal('show');
    updateDisplayName();
});

function updateDisplayName(team){
    var user = firebase.auth().currentUser;
    if (user) {
        console.log(user.displayName);
        $('#nameInputModal').val(user.displayName); 
    }
};

// ------------------Update Display Name on Close------------------------ //

$(document).on('hide.bs.modal','#displayNameModal', function () {
    var modal_newName = $('#nameInputModal').val();
    var user = firebase.auth().currentUser;

        user.updateProfile({
        displayName: modal_newName,
        }).then(function() {
            document.getElementById('welcomeUser').textContent = "- " + modal_newName + " you are signed in!";
        // Update successful.
        }, function(error) {
        console.log('did not update username');
        });
});

// ------------------Loads external HTML at tag----------------------- //


w3IncludeHTML();

// $(function(){
//   $("#includedContent").load("html/bball_img.html"); 
// });
