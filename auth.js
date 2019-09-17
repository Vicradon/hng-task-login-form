//sign up
const log = n => console.log(n);
$('#signup-button').onclick = () => {
  let email = $('#signup-email').value;
  let password = $('#signup-password').value;

  let username = $('#signup-username').value;
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    $('#signup-form').reset();
    $('#success').style.display = "block";
    setTimeout(() => $('#success').style.display = "none", 2000);
    } 
  ).catch(err => {
    $('#success').style.display = "block";
    $('#success').textContent = "Oh Oh, Sign Up Unsuccessful";
    $('#success').style.color = "red";
    setTimeout(() => $('#success').style.display = "none", 2000);
  })
}
$('#login-button').onclick = () => {
  let email = $('#login-email').value;
  let password  = $('#login-password').value;
  auth.signInWithEmailAndPassword(email, password)
  .then(cred => {
    log(cred.user);
    $('#signup-form').reset();
    $('#success').style.display = "block";
    $('#success').textContent = "Login Successful";
    setTimeout(() => $('#success').style.display = "none", 2000);
    } 
  ).catch(err => {
    $('#success').style.display = "block";
    $('#success').textContent = "Login Unsuccessful";
    $('#success').style.color = "red";
    setTimeout(() => $('#success').style.display = "none", 2000);
  })
}

//logout 
