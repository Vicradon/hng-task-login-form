const $ = n => document.querySelector(n)
export function snack(msg) {
  $("#snackbar").textContent = msg;
  $("#snackbar").className = "show";
  setTimeout(() => { 
    $("#snackbar").className = $("#snackbar").className.replace("show", ""); 
  }, 3000)
}