function imageFromCanvas(idCanvas, idImg) {
  //Increase the counter for the number of drawings Done
  drawingsCounter++;

  //Create an univocal base64 code for the image drawn in the canvas
  var imageSrc = document.getElementById(idCanvas).toDataURL("image/png");

  //Create a new image with the source equal to the previously computed code
  //Insert the image inside the "sketch div" together with the canvas
  canvasImg = addImage(imageSrc, idImg, "sketch");

  //Set the properties to properly see the image below the canvas
  document.getElementById(idImg).style.zIndex = "+1";
  document.getElementById(idImg).style.position = "absolute";

  document.getElementById(idCanvas).style.zIndex = "1";
  document.getElementById(idCanvas).style.position = "absolute";

  document.getElementById(idImg).style.width = document.getElementById(idCanvas).style.width;
  document.getElementById(idImg).style.height = document.getElementById(idCanvas).style.height;



  return canvasImg;
}


function moveDraw(objID, xEnd, yEnd, duration){
  //Initialize object position as canvas position
  document.getElementById(objID).style.left=$("#defaultCanvas0").position().left+"px";
  document.getElementById(objID).style.top=$("#defaultCanvas0").position().top+"px";
  //Move the object
  $("#"+objID).animate({left:""+xEnd+"px", top:""+yEnd+"px"},duration);
}


function addImage(src,id,containerID, style=""){
  var img = document.createElement("img");
  img.src = src;
  img.id = id;

  var container = document.getElementById(containerID);
  container.append(img);

  return img;
}
