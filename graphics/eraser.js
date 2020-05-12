//Function used by the eraser
function erase(){
  for (var xE=sketchContext.mouseX-eraserRadius; xE<sketchContext.mouseX+eraserRadius; xE++) {
    for (var yE=sketchContext.mouseY-eraserRadius; yE<sketchContext.mouseY+eraserRadius; yE++) {
      if ((sketchContext.dist(xE,yE, sketchContext.mouseX, sketchContext.mouseY) < eraserRadius) && xE > 0 && xE <= sketchContext.width) {
        sketchContext.set(xE,yE,eraserTransparentColor);
      }
    }
  }
  sketchContext.updatePixels(); //Refresh the canvas pixels after modification to actually show them
}



//Function needed to make the eraser work properly (avoid unupdated pixels)
function updatePixelsState(){ //Is sufficient to update 1 pixel to save all the canvas state correctly

  //Get the first pixel of the canvas
  pixelColor = sketchContext.get(0,0);
  //Set it as identical to what it get
  sketchContext.set(0,0,pixelColor);

  //Refresh the canvas
  sketchContext.updatePixels();
}
