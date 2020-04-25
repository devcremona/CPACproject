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

function btnDoneCallback() {
  speakStop();

  //increase drawing status
  switch(drawingStatus){
    case DRAWING_STATUS.MAGIC:
      //Activate retry magic button
      btnRetryMagic.classList.add('inactive');
      btnRetryMagic.removeEventListener('click', doMagic);

      //Increase drawing status
      drawingStatus = DRAWING_STATUS.FINISHING;

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
  btnPencil.addEventListener('click', function() {

    //Opens slider
    if(btnPencil.classList.contains('active')){
      pencilSliderContainer.classList.toggle('visible');
      graphicToolsOpen = !graphicToolsOpen;
      if(sketchContext.mouseDragged == undefined){
        sketchContext.mouseDragged = sketchMouseDraggedListener;
      } else {
        sketchContext.mouseDragged = undefined;
      }
    }

    eraserActive = false;

    btnColors.classList.remove('active');
    colors.classList.remove('visible');
    btnEraser.classList.remove('active');
    eraserSliderContainer.classList.remove('visible');
    btnPencil.classList.add('active');

    sketchContext.fill(currentColor);
    sketchContext.stroke(currentColor);
    sketchContext.strokeWeight(currentStrokeWeight);

  });

  pencilSlider.addEventListener('input', function(event){
    currentStrokeWeight = event.target.value;
    sketchContext.strokeWeight(currentStrokeWeight);
  });


  btnEraser.addEventListener('click', function() {

    //Opens slider
    if(btnEraser.classList.contains('active')){
      eraserSliderContainer.classList.toggle('visible');
      graphicToolsOpen = !graphicToolsOpen;
      if(sketchContext.mouseDragged == undefined){
        sketchContext.mouseDragged = sketchMouseDraggedListener;
      } else {
        sketchContext.mouseDragged = undefined;
      }
    }

    eraserActive = true;

    btnPencil.classList.remove('active');
    pencilSliderContainer.classList.remove('visible');
    btnColors.classList.remove('active');
    colors.classList.remove('visible');
    btnEraser.classList.add('active');

    sketchContext.noFill();
    sketchContext.stroke(eraserStrokeColor);
    sketchContext.strokeWeight(eraserStrokeWeight);
  });

  eraserSlider.addEventListener('input', function(event){
    eraserRadius = parseInt(event.target.value);
  });


  btnColors.addEventListener('click', function() {
    btnPencil.classList.remove('active');
    pencilSliderContainer.classList.remove('visible');
    btnEraser.classList.remove('active');
    eraserSliderContainer.classList.remove('visible');

    if(btnColors.classList.contains('active')){
      btnColors.classList.remove('active');
      btnPencil.classList.add('active');
    } else {
      btnColors.classList.add('active');
    }

    colors.classList.toggle('visible');
    graphicToolsOpen = !graphicToolsOpen;
  });

  btnCustomColor.addEventListener('click', function() {
    document.getElementById('customColor').click();
    colors.classList.remove('visible');
    graphicToolsOpen = false;
  });

  customColor.addEventListener('input', function(event) {
    sketchContext.updateCurrentColor(index=-1,hex=event.target.value.toUpperCase());

    //Reactivate pencil
    eraserActive = false;

    btnPencil.classList.add('active');
    btnEraser.classList.remove('active');
    btnColors.classList.remove('active');

    sketchContext.fill(currentColor);
    sketchContext.stroke(currentColor);
    sketchContext.strokeWeight(currentStrokeWeight);

    if(currentColor!='#000000'){
      btnColors.style.backgroundColor = currentColor;
    } else {
      btnColors.style.backgroundColor = 'rgba(0,0,0,0)';
    }
  });


  //SPLASH
  //==============================================================================
  btnHelp.addEventListener('click', function() { //Go to the spash screen
    splash.classList.remove('hidden');
    splashIsOpen = true;
  });

  btnGo.addEventListener('click', function() { //From splash to the sketch
    splashIsOpen = false;
    splash.classList.add('hidden');
    openPopup();
  });
}
