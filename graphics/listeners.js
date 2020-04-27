function confirmPopupCallback() { // When the user clicks on x, close the popup

  //Stop synth speech
  speakStop();

  //Close popup
  popup.classList.add('hidden');
  popupContent.classList.add('hidden');
  popupIsOpen = false;

  switch (getCurrentStatus()) {
    case STATUS_STORY_ENUM.NAME:
      setUserChoice(getCurrentStatus(), characterNameField.value);

    default:
      if(isAutomaticStoryAhead(getCurrentStatus())){
        //Auto re-call popup after set next status
        setNextStatus();
        setTimeout(openPopup,500);
      } else {
        loadModel(currentChoices.indexOf(getUserChoice(getCurrentStatus())));

        //Deactivate eraser at the beginning
        btnEraser.classList.add('inactive');
        btnEraser.removeEventListener('click', btnEraserListener);
      }
      break;

    case STATUS_STORY_ENUM.RECORDING:
      infoMessage.innerHTML = '';
      break;

    case STATUS_STORY_ENUM.RECAP:
      infoMessage.innerHTML = 'The End!';
      break;
  }
}

function btnEraserListener() {

  //Opens slider
  eraserSliderContainer.classList.toggle('visible');

  //Block under-drawing
  if(eraserSliderContainer.classList.contains('visible')){
    graphicToolsOpen = true;
    sketchContext.mouseDragged = undefined;
  }
  else {
    graphicToolsOpen = false;
    sketchContext.mouseDragged = sketchMouseDraggedListener;
  }

  eraserActive = true;

  btnPencil.classList.remove('active');
  pencilSliderContainer.classList.remove('visible');
  colorsManager.classList.remove('active');
  colors.classList.remove('visible');
  btnEraser.classList.add('active');

  sketchContext.noFill();
  sketchContext.stroke(eraserStrokeColor);
  sketchContext.strokeWeight(eraserStrokeWeight);
}

function btnDoneCallback() {
  speakStop();

  //increase drawing status
  switch(drawingStatus){
    case DRAWING_STATUS.MAGIC:
      //Deactivate retry magic button
      btnRetryMagic.classList.add('inactive');
      btnRetryMagic.removeEventListener('click', doMagic);

      //Activate eraser
      btnEraser.classList.remove('inactive');
      btnEraser.addEventListener('click', btnEraserListener);

      //Increase drawing status
      drawingStatus = DRAWING_STATUS.FINISHING;

      //Inform the user
      infoMessage.innerHTML = 'Now finish your drawing as you like! Then click ✔';
      speak(infoMessage.innerHTML);
      break;
    case DRAWING_STATUS.FINISHING:
      drawingStatus = DRAWING_STATUS.DRAG;

      //Save canvas as image, activate dragging
      addDrawing();

      //Reset canvas
      restart();

      //Inform the user
      infoMessage.innerHTML = "Now you can drag your drawing wherever you want! Then click ✔";
      speak(infoMessage.innerHTML);

      break;
    case DRAWING_STATUS.DRAG:

      //Increase the story status
      if(getCurrentStatus()<STATUS_STORY_ENUM.RECAP){
        setNextStatus();
      }

      //Deactivate Done button
      btnDone.classList.add('inactive');
      btnDone.removeEventListener('click', btnDoneCallback);

      //Reset the drawing status
      drawingStatus = DRAWING_STATUS.INIT;
      openPopup();
      break;
    default:
      console.log("ERROR: Drawing status not handle...draw something!");
      break;
  }
}


function btnPencilListener() {
  //Activate the mouse listeners for the p5 sketch
  if(drawingStatus == DRAWING_STATUS.INIT){
    sketchContext.mousePressed = sketchMousePressedListener;
    sketchContext.mouseDragged = sketchMouseDraggedListener;
    sketchContext.mouseReleased = sketchMouseReleasedListener;
  }

  //Opens slider
  pencilSliderContainer.classList.toggle('visible');

  //Block under-drawing
  if(pencilSliderContainer.classList.contains('visible')){
    graphicToolsOpen = true;
    sketchContext.mouseDragged = undefined;
  }
  else {
    graphicToolsOpen = false;
    sketchContext.mouseDragged = sketchMouseDraggedListener;
  }

  eraserActive = false;

  colorsManager.classList.remove('active');
  colors.classList.remove('visible');
  btnEraser.classList.remove('active');
  eraserSliderContainer.classList.remove('visible');
  btnPencil.classList.add('active');

  sketchContext.fill(currentColor);
  sketchContext.stroke(currentColor);
  sketchContext.strokeWeight(currentStrokeWeight);

}


function setListeners() {

  //POPUP
  //==============================================================================
  btnConfirmPopup.addEventListener('click',confirmPopupCallback);


  //NAVIGATION
  //==============================================================================
  btnClear.addEventListener('click', function() {
    restart(1); //1: called after cleck event

    eraserActive = false;

    btnPencil.classList.add('active');
    btnEraser.classList.remove('active');

    sketchContext.fill(currentColor);
    sketchContext.stroke(currentColor);
    sketchContext.strokeWeight(currentStrokeWeight);

    //Update pixels state
    updatePixelsState();
  });

  btnDone.addEventListener('click', btnDoneCallback);


  //DRAWING
  //==============================================================================
  btnPencil.addEventListener('click', btnPencilListener);

  pencilSlider.addEventListener('input', function(event){
    currentStrokeWeight = event.target.value;
    sketchContext.strokeWeight(currentStrokeWeight);
  });


  btnEraser.addEventListener('click', btnEraserListener);

  eraserSlider.addEventListener('input', function(event){
    eraserRadius = parseInt(event.target.value);
  });


  btnColors.addEventListener('click', function() {
    btnPencil.classList.remove('active');
    pencilSliderContainer.classList.remove('visible');
    btnEraser.classList.remove('active');
    eraserSliderContainer.classList.remove('visible');

    colors.classList.toggle('visible');

    if(!colors.classList.contains('visible')){
      colorsManager.classList.remove('active');
      graphicToolsOpen = false;

      //Reactivate pencil
      btnPencilListener();
    } else {
      colorsManager.classList.add('active');
      graphicToolsOpen = true;
    }
  });

  btnCustomColor.addEventListener('click', function() {
    document.getElementById('customColor').click();
    colors.classList.remove('visible');
    graphicToolsOpen = false;
  });

  customColor.addEventListener('input', function(event) {
    sketchContext.updateCurrentColor(index=-1,hex=event.target.value.toUpperCase());

    //Reactivate pencil
    btnPencilListener();

    if(currentColor!='#000000'){
      btnColors.style.backgroundColor = currentColor;
    } else {
      btnColors.style.backgroundColor = 'rgba(0,0,0,0)';
    }
  });


  //SPLASH
  //==============================================================================
  btnHelp.addEventListener('click', function() { //Go to the spash screen
    if(splash.classList.contains('hidden')){
      splash.classList.remove('hidden');
      splashIsOpen = true;
    } else{
      splash.classList.add('hidden');
      splashIsOpen = false;
    }


  });

  btnGo.addEventListener('click', function() { //From splash to the sketch
    splashIsOpen = false;
    splash.classList.add('hidden');
    btnHelp.style.zIndex = 6;
    openPopup();
  });
}
