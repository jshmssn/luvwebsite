document.oncontextmenu = () => {
	alert("Don't right click")
	return false
}

window.onload = function () {
	var audio = document.getElementById("sound");
	audio.play().catch(function (error) {
		// console.error("Error attempting to play audio: ", error);
	});
};
