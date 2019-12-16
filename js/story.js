function story() {
  //Converts the drawing into an image
  imageFromCanvas();

  //Animation example: moveObject(objectID, xTarget, yTarget, duration[ms])
  moveObject(draw.id,400,$("#draw1").position().top,1000);
}
