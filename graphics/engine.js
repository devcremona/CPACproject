const sketch = function(sketch) {

  sketch.setup = function() {
    //Needed for Less to load the css for the curtain
    less.pageLoadFinished.then(
        function() {
          console.clear();

          //Load alla images as soon as possible
          preloadImages();

          //Get all the available models as a list and set the variable
          availableModels = getAvailableModels();

          //Show the splash screen with opacity animation
          splash.classList.remove('hidden');

          // Initialize the canvas
          const containerSize = sketchContainer.getBoundingClientRect();
          //console.log("ENGINE CONTAINER SIZE: ",containerSize);
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

          //Set splash open
          splashIsOpen = true;

          //Set curtain height
          //splashCurtain.style.height = screenHeight+'px';

          eraserTransparentColor = sketch.color(0,0,0,0);

          //Reset the canvas (the following function is called always on the press of clear button)
          restart(0); //0: called at startup
          drawingStatus = DRAWING_STATUS.INIT;

          sketch.stroke(currentColor);

          setSpeakerVoice();

          //Reset of the character name field
          characterNameField.value = '';

          setListeners();

        }
    );
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
      //console.log('finished this one');
      modelIsActive = false;

      infoMessage.innerHTML = "If you don't like it, click <span id='retryText' class='iconify' data-icon='ic:baseline-update'></span> Otherwise click <span id='doneText' class='iconify' data-icon='ic:baseline-done-outline'>";
      setTimeout(function(){
        retryText.style.cursor = 'auto';
        doneText.style.cursor = 'auto';
      },10);
      speak("If you don't like it, click the retry button! Otherwise click Done!");

      //Activate done button
      btnDone.classList.remove('inactive');
      btnDone.addEventListener('click', btnDoneCallback);

      //Activate retry magic button
      btnRetryMagic.classList.remove('inactive');
      btnRetryMagic.addEventListener('click', doMagic);

      //Activate clear button
      btnClear.classList.remove('inactive');
      btnClear.addEventListener('click', btnClearListener);

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


function sketchMouseReleasedListener() {
  updatePixelsState(); //Refresh the current pixels, actually save the last drawings
  if (!splashIsOpen && !popupIsOpen && !graphicToolsOpen) {

    if(drawingStatus == DRAWING_STATUS.FIRST_STROKE && sketchContext.isInBounds()){
      //Start magic status
      drawingStatus = DRAWING_STATUS.MAGIC;

      //Remove listeners while ML is drawing
      sketchContext.mousePressed = undefined;
      sketchContext.mouseDragged = undefined;
      sketchContext.mouseReleased = undefined;

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

function sketchMouseDraggedListener() {

  if(sketchContext.isInBounds() && drawingStatus==DRAWING_STATUS.FINISHING){
    //Reactivate done button
    btnDone.classList.remove('inactive');
    btnDone.addEventListener('click', btnDoneCallback);
  }

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

  else if(drawingStatus == DRAWING_STATUS.DRAG && sketchContext.isInBounds()){
      const dx0 = sketchContext.mouseX - x;
      const dy0 = sketchContext.mouseY - y;

      if ((dx0*dx0+dy0*dy0 > 1) && checkMask(x, y))
        nearDwg.updateCoord(dx0, dy0, false);

      x += dx0;
      y += dy0;
  }

  return false;
}



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

    x = startX = sketchContext.mouseX;
    y = startY = sketchContext.mouseY;
    userPen = 1; // down!

    if(drawingStatus == DRAWING_STATUS.INIT){
      drawingStatus = DRAWING_STATUS.FIRST_STROKE;
      //console.log('Drawing in progress...');
      maxx = x; minx = x;
      maxy = y; miny = y;
    }else if(drawingStatus == DRAWING_STATUS.DRAG){
      nearDwg = getNearestDwg(x, y);
      Drawing.arrowsOff();
      //console.log("Drag clicked");
    }

    modelIsActive = false; //Machine learning in pause while i'm drawing
    //currentRawLine = [];
    //lastHumanDrawing = [];
    previousUserPen = userPen;
  }

  //Draw dots when you click the mouse
  let flagDwg = (drawingStatus==DRAWING_STATUS.FIRST_STROKE || drawingStatus==DRAWING_STATUS.FINISHING);
  if (!eraserActive && sketchContext.isInBounds() && !splashIsOpen && !popupIsOpen && !modelIsActive && modelLoaded && !graphicToolsOpen && flagDwg){
      const dx0 = sketchContext.mouseX - x;
      const dy0 = sketchContext.mouseY - y;
      dx = dx0;
      dy = dy0;
      userPen = 1;
      if (previousUserPen == 1) {
        sketchContext.line(x, y, x, y); // draw line connecting prev point to current point.
        lastHumanDrawing.push([x, y, x, y]);
      }
      x += dx;
      y += dy;
      currentRawLine.push([x, y]);

      maxx = Math.round(Math.max(x, maxx)); minx = Math.round(Math.min(x, minx));        // updating crop area
      maxy = Math.round(Math.max(y, maxy)); miny = Math.round(Math.min(y, miny));
      previousUserPen = userPen;
      flagDwg = false;

      if(sketchContext.isInBounds() && drawingStatus==DRAWING_STATUS.FINISHING){
        //Reactivate done button
        btnDone.classList.remove('inactive');
        btnDone.addEventListener('click', btnDoneCallback);
      }
  }
}





const p5Sketch = new p5(sketch, 'sketchContainer');
