const $ = n => document.querySelector(n);
const log = console.log;

import { db } from '../../js/firebase-stuff'
import { snack } from './utils'
const uid = localStorage.getItem('uid');

$('#current-user-display-name').textContent = localStorage.getItem('current user');
$('#current-user-display-name').style.color = "#fff";

const nodes = {
  enterTitle: $('.enter-title'),
  enterContent: $('.enter-content'),
  submitPost: $('.submit-post'),
  normalPostFlow: $('.normal-post-flow'),
}

const { enterTitle,
  enterContent,
  submitPost,
  normalPostFlow
} = nodes;

const postsDoc = db.collection('users').doc(uid);
displayPosts();

function deletePost(id) {
  const newPosts = posts.filter(x => x.id !== +id);
  displayPosts(newPosts);
}

function editPost(id) {
  const post = posts.filter(post => post.id === +id)[0];
  const newPosts = posts.filter(x => x.id !== +id);

  enterTitle.value = post.title;
  enterContent.value = post.content;
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
}

submitPost.onclick = () => {
  if (enterTitle.value.trim().length !== 0 && enterContent.value.trim().length !== 0) {
    disableSubmit();
    postsDoc.get()
      .then(res => {
        if (res.data()) {
          let id = 1;
          const prevPosts = res.data().posts;
          if (prevPosts.length > 0) {
            id = Math.max(...prevPosts.map(x => x.id)) + 1;
          }
          const newPost = {
            title: enterTitle.value.trim(),
            content: enterContent.value.trim(),
            id
          }
          postsDoc.set({ posts: [...prevPosts, newPost] })
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
            posts: [{
              title: enterTitle.value.trim(),
              content: enterContent.value.trim(),
              id:1
            }]
          }).then(() => {
            snack("Posted successfully");
            enableSubmit()
            displayPosts()
          }).catch(err => {
            console.log(err);
            snack("Sorry, an error occured");
            enableSubmit()
          })
        }
      })
  }
}

function displayPosts() {
  postsDoc.get()
    .then(res => {
      let a = '';
      if (res.data()) {
        res.data().posts.forEach(x => a += postComp(x.title, x.content, x.id))
      }
      normalPostFlow.innerHTML = a;
    })
}
