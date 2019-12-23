const log = console.log;
const $ = n => document.querySelector(n);
import { auth, db } from './firebase-stuff'

auth.onAuthStateChanged(user => {
  if (user) {
    // const dbUser = db.collection('users').doc(user.uid);
    localStorage.setItem('uid', `${user.uid}`);
  }
  else {
    console.log("User logged out");
    localStorage.setItem('uid', 'null');
  }
})



$('#click-to-signup a').onclick = () => {
  $('#login').style.display = "none";
  $('#reset-password-page').style.display = "none";
  $('#signup').style.display = "block";
  $('#click-to-login').style.display = "block";
  $('#click-to-signup').style.display = "none";
  $('#forgot-password').style.display = "none";
}
$('#click-to-login a').onclick = () => {
  $('#login').style.display = "block";
  $('#signup').style.display = "none";
  $('#reset-password-page').style.display = "none";
  $('#click-to-login').style.display = "none";
  $('#click-to-signup').style.display = "block";
  $('#forgot-password').style.display = "block";
}
$('#forgot-password a').onclick = () => {
  $('#login').style.display = "none";
  $('#reset-password-page').style.display = "block";
  $('#forgot-password').style.display = "none";
  $('#click-to-login').style.display = "block";
}

function turnOffSuccess() {
  return setTimeout(() => $('#success').style.display = "none", 2000);
}

$('#signup-button').onclick = () => {
  let email = $('#signup-email').value.trim();
  let password = $('#signup-password').value.trim();
  let username = $('#signup-username').value.trim();
  let rePassword = $('#signup-re-password').value.trim();


  if (
    email.length !== 0 &&
    password.length !== 0 &&
    username.length !== 0 &&
    rePassword.length !== 0 &&
    rePassword === password
  ) {
    auth.createUserWithEmailAndPassword(email, password)
      .then(cred => {
        const user = auth.currentUser;
        return db.collection('users').doc(user.uid).set({
          profile: {
            username: username
          }
        }).catch(err => console.log("Error occured while saving user data", err))
      })
      .then(() => {
        const user = auth.currentUser;
        $('#signup-form').reset();
        $('#success').style.display = "block";
        user.sendEmailVerification()
          .then(() => {
            $('#success').style.color = "#0ca3d2";
            $('#success').textContent = "Sign up successful. Check your mail to verify";
          })
          .catch(err => {
            console.log(err)
          });
        turnOffSuccess()
        window.location.replace("./app/index.html")
      })
      .catch(err => {
        console.log(err)
        $('#success').style.display = "block";
        $('#success').textContent = err.message;
        $('#success').style.color = "red";
        setTimeout(() => $('#success').style.display = "none", 2000);
      })
  }
}
$('#login-button').onclick = () => {
  let email = $('#login-email').value.trim();
  let password = $('#login-password').value.trim();
  auth.signInWithEmailAndPassword(email, password)
    .then(cred => {
      $('#signup-form').reset();
      $('#success').style.display = "block";
      $('#success').style.color = "#0ca3d2";
      $('#success').textContent = "Login Successful";
      turnOffSuccess()
      window.location.replace("./app/index.html")
    }
    ).catch(err => {
      $('#success').style.display = "block";
      $('#success').textContent = err.message;
      $('#success').style.color = "red";
      setTimeout(() => $('#success').style.display = "none", 2000);
    })
}

$('#reset-password-button').onclick = () => {
  const emailAddress = $('#reset-email').value.trim();
  if (emailAddress.length !== 0) {
    auth.sendPasswordResetEmail(emailAddress).then(() => {
      $('#success').textContent = "Email sent successfully";
    }).catch(error => {
      console.log(error)
    });
  }
}




//logout 
