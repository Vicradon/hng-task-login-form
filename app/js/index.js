const $ = n => document.querySelector(n);
const log = console.log;

import { db, auth } from '../../js/firebase-stuff'
import { snack } from './utils'

db.enablePersistence()
  .catch(err => {
    if (err.code === 'failed-precondition') {
      snack('Close all tabs where this app is open');
      log('Multiple tabs preventing offline behavior', err)
    }
    else if (err.code === 'unimplemented') {
      snack("Your browser doesn't support offline mode.");
      log("Browser doesn't support offline mode.", err)
    }
  })

const uid = localStorage.getItem('uid');
const postsDoc = db.collection('users').doc(uid);


postsDoc.get().then(res => {
  if (res.data().profile) {
    $('#current-user-display-name').textContent = res.data().profile.username;
  }
})

$('#current-user-display-name').style.color = "#fff";

const nodes = {
  enterTitle: $('.enter-title'),
  enterContent: $('.enter-content'),
  submitPost: $('.submit-post'),
  normalPostFlow: $('.normal-post-flow'),
  updatePost: $('.update-post'),
  enterPost: document.querySelectorAll('.enter-post'),
  logout: $('#logout')
}

const { enterTitle,
  enterContent,
  submitPost,
  normalPostFlow,
  updatePost,
  enterPost,
  logout
} = nodes;

logout.onclick = () => {
  auth.signOut()
    .then(window.location.replace("../"))
}

displayPosts()


function updateMode() {
  submitPost.style.display = 'none'
  updatePost.style.display = 'block'
  enterPost.forEach(x => x.textContent = "Update Post")
}
function submitMode() {
  submitPost.style.display = 'block'
  updatePost.style.display = 'none'
  enterPost.forEach(x => x.textContent = "Enter Post")
}

function deletePost(id) {
  postsDoc.get()
    .then(res => {
      const newPosts = res.data().posts.filter(x => x.id !== +id);
      if (navigator.onLine) {
        postsDoc.set({ ...res.data(), posts: newPosts })
          .then(() => {
            snack("Delete Successful!")
            displayPosts();
          })
          .catch(err => {
            snack("Delete unsuccessful!")
            log(err)
          })
      }
      else {
        postsDoc.set({ ...res.data(), posts: newPosts })
        snack("Delete Successful!")
        displayPosts();
      }
    })
}

function editPost(id) {
  postsDoc.get()
    .then(res => {
      const prevPosts = res.data().posts;
      const post = prevPosts.filter(post => post.id === +id)[0];
      updateMode();
      enterTitle.value = post.title;
      enterContent.value = post.content;
      updatePost.onclick = () => {
        handleSubmit(post.id);
        submitMode();
      }
    })
}

normalPostFlow.onclick = ({ target }) => {
  if (target.classList.contains('edit-post')) {
    const post = target.parentNode.parentNode;
    post.classList.add('edit-true')
    document.querySelectorAll('.edit-post').forEach(post => {
      post.setAttribute("disabled", true)
    })
    document.querySelectorAll('.delete-post').forEach(post => {
      post.setAttribute("disabled", true)
    })
    editPost(post.dataset.id)
  }
  else if (target.classList.contains('delete-post')) {
    const post = target.parentNode.parentNode;
    document.querySelectorAll('.delete-post').forEach(post => {
      post.setAttribute("disabled", true)
    })
    post.classList.add('scale-down-center')
    post.addEventListener('animationend', () => {
      deletePost(post.dataset.id)
    })
  }
}

function postComp(title, content, id) {
  let stuff = '';
  if (content.split(' ').length > 5) {
    stuff = content.split(' ').slice(0, 5).join(' ');
    let temparr = stuff.split(' ')[4].split('');
    let other = stuff.split(' ').slice(0, 4).join(' ');
    if (temparr[temparr.length - 1] === ',') {
      const index = temparr.findIndex(x => x === ',');
      temparr.splice(index, 1)
      stuff = `${other} ${temparr.join('')}`;
    }
    stuff = `${stuff}...`
  }
  else { stuff = content }

  return `
    <div data-id = ${id} class = 'post'>
      <h3>${title}</h3>
      <p>${stuff}</p>

      <div class = 'post-actions'>
        <button type = "button" class = 'edit-post'>Edit</button>
        <button type = "button" class = 'delete-post'>Delete</button>
      </div>
    </div>
  `
}

function disableSubmit() {
  submitPost.disabled = true;
  submitPost.style.cursor = 'not-allowed';
}
function enableSubmit() {
  submitPost.disabled = false;
  submitPost.style.cursor = 'pointer';
  enterTitle.value = '';
  enterContent.value = '';
}

function handleSubmit(id) {
  if (enterTitle.value.trim().length !== 0 && enterContent.value.trim().length !== 0) {
    disableSubmit();
    postsDoc.get()
      .then(res => {
        if (res.data().posts) {
          let prevPosts = res.data().posts;
          if (id) {
            prevPosts = res.data().posts.filter(x => x.id !== id);
          }
          if (prevPosts.length > 0) {
            id = Math.max(...prevPosts.map(x => x.id)) + 1;
          }
          const newPost = {
            title: enterTitle.value.trim(),
            content: enterContent.value.trim(),
            id
          }

          if (navigator.onLine) {
            if (res.data().posts.length > 0) {
              postsDoc.set({ ...res.data(), posts: [...prevPosts, newPost] })
                .then(() => {
                  snack("Posted successfully");
                  enableSubmit()
                  displayPosts()
                }).catch(err => {
                  console.log(err);
                  snack("Sorry, an error occured");
                  enableSubmit()
                })
            }
            else {
              postsDoc.set({
                ...res.data(),
                posts: [{
                  id: 1,
                  title: enterTitle.value.trim(),
                  content: enterContent.value.trim()
                }]
              })
                .then(() => {
                  snack("Posted successfully");
                  enableSubmit()
                  displayPosts()
                }).catch(err => {
                  console.log(err);
                  snack("Sorry, an error occured");
                  enableSubmit()
                })
            }

          }
          else {
            if (res.data().posts.length > 0) {
              postsDoc.set({ ...res.data(), posts: [...prevPosts, newPost] })
              snack("Posted successfully");
              displayPosts()
              enableSubmit()
            }
            else {
              postsDoc.set({
                ...res.data(),
                posts: [{
                  id: 1,
                  title: enterTitle.value.trim(),
                  content: enterContent.value.trim()
                }]
              })
              snack("Posted successfully");
              displayPosts()
              enableSubmit()
            }
          }
        }
        else {
          postsDoc.get().then(res => {
            postsDoc.set({
              ...res.data(),
              posts: [{
                id: 1,
                title: enterTitle.value.trim(),
                content: enterContent.value.trim()
              }]
            })
              .then(() => {
                snack("Posted successfully");
                enableSubmit()
                displayPosts()
              }).catch(err => {
                console.log(err);
                snack("Sorry, an error occured");
                enableSubmit()
              })
          })
        }
      })
      .catch(err => log("Error occured while submitting the post", err))
  }
}

submitPost.onclick = handleSubmit;

function displayPosts() {
  postsDoc.get()
    .then(res => {
      let a = '';
      if (res.data().posts) {
        const posts = res.data().posts.sort((a, b) => b.id - a.id);
        posts.forEach(x => a += postComp(x.title, x.content, x.id))
      }
      normalPostFlow.innerHTML = a;
      $('#loader').style.display = 'none'
      if (!normalPostFlow.hasChildNodes()) {
        $('.no-post-yet').style.display = 'block'
      }
      else {
        $('.no-post-yet').style.display = 'none'
      }
    })
    .catch(err => log(err))
}
