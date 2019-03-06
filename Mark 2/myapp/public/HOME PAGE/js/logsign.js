

//document.getElementById("logsign").style.display = "none"; //hides the frame
//document.getElementById("logsign").style.display = "block"; //shows the frame
function hideToggle(button, elem) {
  $(button).toggle( function () {
    $(elem).show();
  }
}

hideToggle(".button1", ".iframe1");
hideToggle(".button2", ".iframe2");
