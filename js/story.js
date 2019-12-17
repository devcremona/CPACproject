function story() {
  //Converts the drawing into an image: imageFromCanvas(idCanvas, id image to r)
  var img = imageFromCanvas("defaultCanvas0","avatar");

  //Animation example: moveObject(objectID, xTarget, yTarget, duration[ms])
  var duration = 1000;
  moveDraw(img.id,400,$("#"+img.id).position().top,duration);

  //Wait until the animation is finished, then continue
  setTimeout(phase1, duration);
}

function phase1() {
  autoDraw = true;
  document.getElementById("textField").innerHTML = "Now draw a circle and watch the magic!";
  setTimeout(function(){

  },3000);
}

function phase2() {

}

function phase3() {

}

function phase4() {

}
