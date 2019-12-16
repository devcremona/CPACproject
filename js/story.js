function story() {
  //Converts the drawing into an image: imageFromCanvas(idCanvas, id image to r)
  var img = imageFromCanvas("defaultCanvas0","avatar");

  //Animation example: moveObject(objectID, xTarget, yTarget, duration[ms])
  moveObject(img.id,400,$("#"+img.id).position().top,1000);
}
