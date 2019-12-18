function moveAvatar() {
  //Converts the drawing into an image: imageFromCanvas(idCanvas, id image to r)
  var img = imageFromCanvas("defaultCanvas0","avatar");

  //Animation example: moveObject(objectID, xTarget, yTarget, duration[ms])
  var duration = 1000;
  moveDraw(img.id,400,$("#"+img.id).position().top,duration, function() {
    autoDraw = true;
    document.getElementById("textField").innerHTML = "Now draw a circle and watch the magic!";
  });
}
