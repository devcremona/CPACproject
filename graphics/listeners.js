function confirmPopupCallback() { // When the user clicks on x, close the popup

  //Stop synth speech
  speakStop();

  //Close popup
  popup.classList.add('hidden');
  popupContent.classList.add('hidden');
  popupIsOpen = false;



  switch (getCurrentStatus_Story()) {
    case STATUS_STORY_ENUM.NAME:
      setUserChoice(getCurrentStatus_Story(), characterNameField.value);

    default:
      if(isAutomaticStoryAhead(getCurrentStatus_Story())){
        //Auto re-call popup after set next status
        setNextStatus_Story();
        setTimeout(openPopup,500);
      } else {
        loadModel(currentChoices.indexOf(getUserChoice(getCurrentStatus_Story())));

        //Activate clear button
        btnClear.classList.remove('inactive');
        btnClear.addEventListener('click', btnClearListener);

        //Deactivate eraser at the beginning
        btnEraser.classList.add('inactive');
        btnEraser.removeEventListener('click', btnEraserListener);
      }
      break;

    case STATUS_STORY_ENUM.RECORDING:
      setNextStatus_Story();
      introduceRecap();
      break;

    case STATUS_STORY_ENUM.END:
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

      //Activate pencil
      btnPencil.classList.remove('inactive');
      btnPencil.classList.add('active');
      btnPencil.addEventListener('click', btnPencilListener);
      btnPencil.style.removeProperty('filter');

      //Increase drawing status
      drawingStatus = DRAWING_STATUS.FINISHING;

      //Inform the user
      infoMessage.innerHTML = 'Now finish your drawing as you like! Then click ✔';
      speak(infoMessage.innerHTML);
      break;
    case DRAWING_STATUS.FINISHING:
      drawingStatus = DRAWING_STATUS.DRAG;

      //Deactivate all buttons exept for done
      btnClear.classList.add('inactive');
      btnClear.removeEventListener('click', btnClearListener);

      btnRetryMagic.classList.add('inactive');
      btnRetryMagic.removeEventListener('click', doMagic);

      btnPencil.classList.add('inactive');
      btnPencil.classList.remove('active');
      btnPencil.removeEventListener('click', btnPencilListener);

      btnColors.classList.add('inactive');
      btnColors.classList.remove('active');
      btnColors.removeEventListener('click', btnColorsListener);
      btnColors.style.backgroundColor = 'rgba(0,0,0,0)';

      btnEraser.classList.add('inactive');
      btnEraser.classList.remove('active');
      btnEraser.removeEventListener('click', btnEraserListener);



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
      if(getCurrentStatus_Story()<STATUS_STORY_ENUM.END){
        setNextStatus_Story();
      }

      Drawing.arrowsOff();

      //Deactivate Done button
      btnDone.classList.add('inactive');
      btnDone.removeEventListener('click', btnDoneCallback);

      //Deactivate eraser
      btnEraser.classList.add('inactive');
      btnEraser.removeEventListener('click', btnEraserListener);

      //Deactivate clear
      btnClear.classList.add('inactive');
      btnClear.removeEventListener('click', btnClearListener);

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


function btnClearListener() {

  //Stop speak
  speakStop();

  //Deactivate done button
  btnDone.classList.add('inactive');
  btnDone.removeEventListener('click', btnDoneCallback);

  //Pseudo-reactivate pencil
  btnPencil.style.removeProperty('filter');

  restart(1); //1: called after cleck event

  eraserActive = false;

  btnEraser.classList.remove('active');

  //Deactivate retry
  btnRetryMagic.classList.add('inactive');
  btnRetryMagic.removeEventListener('click', doMagic);

  //Activate pencil
  btnPencil.classList.remove('inactive');
  btnPencil.classList.add('active');
  btnPencil.addEventListener('click', btnPencilListener);

  //Activate listeners on pencil
  sketchContext.mousePressed = sketchMousePressedListener;
  sketchContext.mouseDragged = sketchMouseDraggedListener;
  sketchContext.mouseReleased = sketchMouseReleasedListener;

  // //Deactivate clear
  // btnClear.classList.add('inactive');
  // btnClear.removeEventListener('click', btnClearListener);


  sketchContext.fill(currentColor);
  sketchContext.stroke(currentColor);
  sketchContext.strokeWeight(currentStrokeWeight);

  //Update pixels state
  updatePixelsState();
}


function btnColorsListener() {
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
}


function setListeners() {

  //POPUP
  //==============================================================================
  btnConfirmPopup.addEventListener('click',confirmPopupCallback);


  //NAVIGATION
  //==============================================================================

  btnDone.addEventListener('click', btnDoneCallback);


  //DRAWING
  //==============================================================================
  btnPencil.addEventListener('click', btnPencilListener);

  pencilSlider.addEventListener('input', function(event){
    currentStrokeWeight = event.target.value;
    sketchContext.strokeWeight(currentStrokeWeight);
  });

  eraserSlider.addEventListener('input', function(event){
    eraserRadius = parseInt(event.target.value);
  });


  btnColors.addEventListener('click', btnColorsListener);

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
      splash.style.zIndex = 10;
      splash.classList.remove('hidden');
      splashIsOpen = true;
    } else{
      splash.classList.add('hidden');
      $('#splash').one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
          function(event) {
            splash.style.zIndex = 0;
            splashIsOpen = false;
          });
    }


  });

  btnGo.addEventListener('click', function() { //From splash to the sketch

    //Start moving curtain
    splashCurtain.classList.add('wrapped');

    //Move the splash on the back and dissolve
    splash.classList.add('hidden');
    $('#splash').one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
        function(event) {
          splash.style.zIndex = 0;
        });

    splashIsOpen = false;
    btnHelp.style.zIndex = 3;
    setTimeout(openPopup,500);
  });
}
