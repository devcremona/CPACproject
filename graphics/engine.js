const sketch = function(sketch) {



  sketch.setup = function() {

    // Initialize the canvas
    const containerSize = sketchContainer.getBoundingClientRect();
    const screenWidth = Math.floor(containerSize.width);
    const screenHeight = Math.floor(containerSize.height);
    canvas = sketch.createCanvas(screenWidth, screenHeight);
    canvas.id('sketchCanvas'); //Rename the canvas id
    document.getElementById('sketchCanvas').style.position = 'fixed'; //Set the canvas position to fixed (in order to superpose other elements)
    sketch.pixelDensity(1); //Set the pixel density to 1 (for zoomed resolutions)

    sketch.frameRate(60);

    sketchContext = sketch;

    //Loading gif: Set the style properties for the loading gif to be shown properly and on the center
    loadingGifStyle = loadingGif.style;
    loadingGifStyle.position = 'absolute';
    loadingGifStyle.zIndex = 10;
    loadingGifStyle.top = '50%';
    loadingGifStyle.left = '50%';
    loadingGifStyle.marginTop = "-"+loadingGif.height/2+"px";
    loadingGifStyle.marginLeft = "-"+loadingGif.width/2+"px";

    eraserTransparentColor = sketch.color(0,0,0,0);

    //Reset the canvas (the following function is called always on the press of clear button)
    restart(0); //0: called at startup
    drawingStatus = DRAWING_STATUS.INIT;

    sketch.stroke(currentColor);

    //Reset of the character name field
    characterNameField.value = '';


    //Speech language setting
    speechSynthesis.onvoiceschanged = function() { // wait on voices to be loaded before fetching list
      //Search the last available italian and english voice
      for(i=0; i<getVoices().length; i++){
          if(getVoices()[i][1]=='it-IT'){
              voiceNameITA=getVoices()[i][0];
          }
          if(getVoices()[i][1]=='en-US'){
              voiceNameENG=getVoices()[i][0];
          }
      }
      //Set the voice just found (currently overwritten inside openPopup() and confirm popup listener)
      setVoice(voiceNameENG);
    };

    setListeners();

    //loadModel(0);

    openPopup();
  };



  sketch.draw = function() { //Model drawing
    if (!modelLoaded || !modelIsActive) {
      return;
    }

    // New state.
    pen = previousPen;
    modelState = model.update([dx, dy, ...pen], modelState);
    const pdf = model.getPDF(modelState, temperature);
    [dx, dy, ...pen] = model.sample(pdf);

    // If we finished the previous drawing, start a new one.
    if (pen[PEN.END] === 1) {
      console.log('finished this one');
      modelIsActive = false;

      infoMessage.innerHTML = "If you don't like it, click the retry button! Otherwise click ✔";
      speak(infoMessage.innerHTML);

      //Activate done button
      btnDone.classList.remove('inactive');
      btnDone.addEventListener('click', btnDoneCallback);

      //Activate retry magic button
      btnRetryMagic.classList.remove('inactive');
      btnRetryMagic.addEventListener('click', doMagic);
      //addDrawing();
    } else {
      // Only draw on the paper if the pen is still touching the paper.
      if (previousPen[PEN.DOWN] === 1) {
        sketch.line(x, y, x+dx, y+dy);
        lastModelDrawing.push([x, y, x+dx, y+dy]);
      }
      // Update.
      x += dx;
      y += dy;
      previousPen = pen;

      maxx = Math.round(Math.max(x, maxx)); minx = Math.round(Math.min(x, minx));        // updating crop area
      maxy = Math.round(Math.max(y, maxy)); miny = Math.round(Math.min(y, miny));
    }
  }



  sketch.mousePressed = sketchMousePressedListener;



  sketch.mouseDragged = sketchMouseDraggedListener;



  sketch.mouseReleased = sketchMouseReleasedListener;




  sketch.windowResized = function () {
    //console.log('resize canvas');
    const containerSize = sketchContainer.getBoundingClientRect();
    const screenWidth = Math.floor(containerSize.width);
    const screenHeight = Math.floor(containerSize.height);
    sketch.resizeCanvas(screenWidth, screenHeight);
  };



  sketch.isInBounds = function () {
    return sketch.mouseX >= 0 && sketch.mouseY >= 0 && sketch.mouseX < sketch.width && sketch.mouseY < sketch.height-footer.clientHeight;
  }



  sketch.updateCurrentColor = function(index=-1, hex='#000000') {
    if(index>0){
      currentColor = COLORS[index].hex;
    } else {
      currentColor = hex;
    }
    sketch.stroke(currentColor);
  }

};


function sketchMousePressedListener(e) { //Human drawing
  if (!document.getElementById('pencilSlider').contains(e.target) && !document.getElementById('eraserSlider').contains(e.target) && !document.getElementById('colors').contains(e.target) && !document.getElementById('btnPencil').contains(e.target) && !document.getElementById('btnEraser').contains(e.target) && !document.getElementById('btnColors').contains(e.target)){
    pencilSliderContainer.classList.remove('visible');
    eraserSliderContainer.classList.remove('visible');

    if(colors.classList.contains('visible')){
      btnPencil.classList.add('active');
    }

    colors.classList.remove('visible');
    colorsManager.classList.remove('active');

    graphicToolsOpen = false;
    sketchContext.mouseDragged = sketchMouseDraggedListener;
  }

  if (!splashIsOpen && !popupIsOpen && sketchContext.isInBounds() && !graphicToolsOpen) {
    if(drawingStatus == DRAWING_STATUS.INIT){
      drawingStatus = DRAWING_STATUS.FIRST_STROKE;
    }

    console.log('Drawing in progress...');

    x = startX = sketchContext.mouseX;
    y = startY = sketchContext.mouseY;
    userPen = 1; // down!

    modelIsActive = false; //Machine learning in pause while i'm drawing
    //currentRawLine = [];
    //lastHumanDrawing = [];
    previousUserPen = userPen;
  }
}


function sketchMouseDraggedListener() {

  let flagDwg = (drawingStatus==DRAWING_STATUS.FIRST_STROKE || drawingStatus==DRAWING_STATUS.FINISHING);

  if (!splashIsOpen && !popupIsOpen && !modelIsActive && modelLoaded && !graphicToolsOpen && flagDwg){
    if (sketchContext.isInBounds() && !eraserActive ) {
      const dx0 = sketchContext.mouseX - x;
      const dy0 = sketchContext.mouseY - y;
      if (dx0*dx0+dy0*dy0 > epsilon*epsilon) { // Only if pen is not in same area (computing the radius^2).
        dx = dx0;
        dy = dy0;
        userPen = 1;
        if (previousUserPen == 1) {
          sketchContext.line(x, y, x+dx, y+dy); // draw line connecting prev point to current point.
          lastHumanDrawing.push([x, y, x+dx, y+dy]);
        }
        x += dx;
        y += dy;
        currentRawLine.push([x, y]);

        maxx = Math.round(Math.max(x, maxx)); minx = Math.round(Math.min(x, minx));        // updating crop area
        maxy = Math.round(Math.max(y, maxy)); miny = Math.round(Math.min(y, miny));

      }
      previousUserPen = userPen;
    }
    else if(eraserActive) {
      erase(); //Erase the pixels (set to transparent)
      sketchContext.ellipse(sketchContext.mouseX, sketchContext.mouseY, eraserRadius*2-eraserStrokeWeight-2, eraserRadius*2-eraserStrokeWeight-2); //Circle to identify the eraser area
    }
    flagDwg = false;
  }

  else if(drawingStatus == DRAWING_STATUS.DRAG){
      const dx0 = sketchContext.mouseX - x;
      const dy0 = sketchContext.mouseY - y;

      if ((dx0*dx0+dy0*dy0 > epsilon*epsilon) && checkMask(x, y))
        updatePosition(Math.round(dx0), Math.round(dy0));

      x += dx0;
      y += dy0;

      if(testing)
        console.log("dx "+dx0+"\ndy "+dy0);
  }

  return false;
}


function sketchMouseReleasedListener() {
  updatePixelsState(); //Refresh the current pixels, actually save the last drawings
  if (!splashIsOpen && !popupIsOpen && !graphicToolsOpen) {

    if(drawingStatus == DRAWING_STATUS.FIRST_STROKE && sketchContext.isInBounds()){
      //Start magic status
      drawingStatus = DRAWING_STATUS.MAGIC;

      userPen = 0;  // Up!
      const currentRawLineSimplified = model.simplifyLine(currentRawLine);

      // If it's an accident...ignore it.
      if (currentRawLineSimplified.length > 1) {
        // Encode this line as a stroke used to feed to the model
        lastHumanStroke = model.lineToStroke(currentRawLineSimplified, [startX, startY]);
      }
      currentRawLine = [];
      previousUserPen = userPen;

      doMagic();
    }

    if(eraserActive && !graphicToolsOpen){
      erase();
    }
  }
}





const p5Sketch = new p5(sketch, 'sketchContainer');
