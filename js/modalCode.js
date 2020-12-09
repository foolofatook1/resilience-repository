// get the modal
var modal = document.getElementById("myModal");

// get the image and insert it inside the modal
var modalClick = document.getElementById("wigm");
var vid01 = document.getElementById("vid0");
modalClick.onclick = function() {
	modal.style.display = "block";
}


// get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// when the user clicks on <span> (x), close the modal
span.onclick = function() {
	modal.style.display = "none";
}
