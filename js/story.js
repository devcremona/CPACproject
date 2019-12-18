function moveAvatar() {
  //Converts the drawing into an image: imageFromCanvas(idCanvas, id image to r)
  var img = imageFromCanvas("defaultCanvas0","avatar");

  //Animation example: moveObject(objectID, xTarget, yTarget, duration[ms])
  var duration = 1000;
  screenWidth = $("#defaultCanvas0").width();
  screenHeight = $("#defaultCanvas0").height();
  targetPositionAvatar = [screenWidth*0.8, screenHeight*0.5];
  console.log("screen width: ", screenWidth, "\nscreen height", screenHeight, "\ntarget position avatar: ", targetPositionAvatar);
  moveDraw(img.id,$("#"+img.id).position().left+(targetPositionAvatar[0]-avatarPosition[0]),$("#"+img.id).position().top+(targetPositionAvatar[1]-avatarPosition[1]),duration, function() {
    autoDraw = true;
    document.getElementById("textField").innerHTML = "Now draw a circle and watch the magic!";
  });
}
