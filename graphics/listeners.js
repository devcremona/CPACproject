function confirmPopupCallback() { // When the user clicks on x, close the popup

  //Stop synth speech
  speakStop();

  //Close popup
  popup.classList.add('hidden');
  popupContent.classList.add('hidden');
  popupIsOpen = false;

  switch (getCurrentStatus()) {
    case STATUS_STORY_ENUM.PROTAGONISTA:
      loadModel(currentChoices.indexOf(getUserChoice(getCurrentStatus())));
      break;

    case STATUS_STORY_ENUM.NOME:
      setUserChoice(getCurrentStatus(), characterNameField.value);

    default:
      if(isAutomaticStoryAhead(getCurrentStatus())){
        //Auto re-call popup after set next status
        setNextStatus();
        setTimeout(openPopup,500);
      } else {
        //loadModel(currentChoices.indexOf(getUserChoice(getCurrentStatus())));
        infoMessage.innerHTML = 'Start drawing '+getUserChoice(getCurrentStatus())+', then press the magic wand!';
        setVoice(voiceNameENG,rate=1.1);
        speak(infoMessage.innerHTML);
      }
      break;

    case STATUS_STORY_ENUM.FINALE:
      infoMessage.innerHTML = '';
      break;

    case STATUS_STORY_ENUM.RECAP:
      infoMessage.innerHTML = 'The End!';
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
  btnMagic.addEventListener('click', function() {
    speakStop();
    doMagic();
  });
  btnDone.addEventListener('click', function() {
    if(getCurrentStatus()<STATUS_STORY_ENUM.RECAP){
      setNextStatus();
    }
    speakStop();
    openPopup();
  });


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
