const sketch = function(sketch) {



  sketch.setup = function() {

    // Initialize the canvas
    const containerSize = sketchContainer.getBoundingClientRect();
    const screenWidth = Math.floor(containerSize.width);
    const screenHeight = Math.floor(containerSize.height);
    canvas = sketch.createCanvas(screenWidth, screenHeight);
    canvas.id('sketchCanvas'); //Rename the canvas id
    document.getElementById('sketchCanvas').style.position = 'fixed'; //Set the canvas position to fixed (in order to superpose other elements)
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

    //Load the model with a certain index
    initialModelIndex = 1  //Cat
    loadModel(initialModelIndex);

    sketch.stroke(currentColor);

    setListeners();
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
    }
  };



  sketch.mousePressed = function () { //Human drawing
    if (!splashIsOpen && !popupIsOpen && sketch.isInBounds()) {
      infoMessage.innerHTML = 'Drawing in progress...';

      x = startX = sketch.mouseX;
      y = startY = sketch.mouseY;
      userPen = 1; // down!

      modelIsActive = false; //Machine learning in pause while i'm drawing
      //currentRawLine = [];
      //lastHumanDrawing = [];
      previousUserPen = userPen;
    }
  }



  sketch.mouseDragged = function () {
    if (!splashIsOpen && !popupIsOpen && !modelIsActive && modelLoaded && sketch.isInBounds() && !eraserActive) {
      const dx0 = sketch.mouseX - x;
      const dy0 = sketch.mouseY - y;
      if (dx0*dx0+dy0*dy0 > epsilon*epsilon) { // Only if pen is not in same area (computing the radius^2).
        dx = dx0;
        dy = dy0;
        userPen = 1;
        if (previousUserPen == 1) {
          sketch.line(x, y, x+dx, y+dy); // draw line connecting prev point to current point.
          lastHumanDrawing.push([x, y, x+dx, y+dy]);
        }
        x += dx;
        y += dy;
        currentRawLine.push([x, y]);
      }
      previousUserPen = userPen;
    }
    else if(!splashIsOpen && !popupIsOpen && !modelIsActive && modelLoaded && eraserActive) {
      erase(); //Erase the pixels (set to transparent)
      sketch.ellipse(sketch.mouseX, sketch.mouseY, eraserRadius*2-eraserStrokeWeight-2, eraserRadius*2-eraserStrokeWeight-2); //Circle to identify the eraser area
    }

    return false;
  }



  sketch.mouseReleased = function () {
    updatePixelsState(); //Refresh the current pixels, actually save the last drawings
    if (!splashIsOpen && !popupIsOpen) {

      if(sketch.isInBounds()){ //Need to be moved to click of Done button
        userPen = 0;  // Up!
        const currentRawLineSimplified = model.simplifyLine(currentRawLine);

        // If it's an accident...ignore it.
        if (currentRawLineSimplified.length > 1) {
          // Encode this line as a stroke used to feed to the model
          lastHumanStroke = model.lineToStroke(currentRawLineSimplified, [startX, startY]);
        }
        currentRawLine = [];
        previousUserPen = userPen;
      }

      if(eraserActive){
        erase();
      }
    }
  }



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



  sketch.updateCurrentColor = function(index) {
    currentColor = COLORS[index].hex;
  }

};





const p5Sketch = new p5(sketch, 'sketchContainer');
