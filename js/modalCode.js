// get the modal
var modal = document.getElementById("myModal");

// get the image and insert it inside the modal
// wigm, inv_sp, env_imp, psae;
var wigm  = document.getElementById("wigm");
var env_imp = document.getElementById("env_imp");
var inv_sp = document.getElementById("inv_sp");
var psae = document.getElementById("psae");

var vid0 = document.getElementById("vid0");
var vid1 = document.getElementById("vid1");
var vid2 = document.getElementById("vid2");
var vid3 = document.getElementById("vid3");

var seeable_media;


wigm.onclick = function() {
	modal.style.display = "block";
	seeable_media = vid0;
	vid0.style.display="block";
}

env_imp.onclick = function() {
	modal.style.display = "block";
	seeable_media = vid1;
	vid1.style.display="block";
}

inv_sp.onclick = function() {
	modal.style.display = "block";
	seeable_media = vid2;
	vid2.style.display="block";
}

psae.onclick = function() { 
	modal.style.display = "block";
	seeable_media = vid3;
	vid3.style.display = "block";
}


// get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// when the user clicks on <span> (x), close the modal
span.onclick = function() {
	modal.style.display = "none";
	seeable_media.style.display = "none";
}
