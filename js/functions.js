function imageFromCanvas() {
  //Increase the counter for the number of drawings Done
  drawingsCounter++;

  //Create an univocal base64 code for the image drawn in the canvas
  var imageTestSrc = document.getElementById("defaultCanvas0").toDataURL("image/png");

  //Create a new image with the source equal to the previously computed code
  var draw = document.createElement("img");
  draw.src = imageTestSrc;
  draw.id = "draw"+drawingsCounter; //<----- needs to be changed in order to create images with different id each time the button is pressed

  //Insert the image inside the sketch div together with the canvas
  var src = document.getElementById("sketch");
  src.append(draw);

  //Set the properties to properly see all the images
  document.getElementById("draw"+drawingsCounter).style.zIndex = "+1";
  document.getElementById("draw"+drawingsCounter).style.position = "absolute";

  document.getElementById("defaultCanvas0").style.zIndex = "1";
  document.getElementById("defaultCanvas0").style.position = "absolute";
}


function moveObject(objID, xEnd, yEnd, duration){
  //Initialize object position as canvas position
  document.getElementById(objID).style.left=$("#defaultCanvas0").position().left+"px";
  document.getElementById(objID).style.top=$("#defaultCanvas0").position().top+"px";
  //Move the object
  $("#"+objID).animate({left:""+xEnd+"px", top:""+yEnd+"px"},duration);
}
