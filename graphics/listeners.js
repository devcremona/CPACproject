function confirmPopupCallback() { // When the user clicks on x, close the popup
  switch (getCurrentStatus()) {
    case STATUS_STORY_ENUM.DOVE:
    case STATUS_STORY_ENUM.METEO:
    case STATUS_STORY_ENUM.SITUA1:
      //Auto re-call popup
      setNextStatus();
      setTimeout(openPopup,500);
      break;

    case STATUS_STORY_ENUM.PROTAGONISTA:
      loadModel(currentChoices.indexOf(getUserChoice(getCurrentStatus())));
      break;

    case STATUS_STORY_ENUM.NOME:
      setUserChoice(getCurrentStatus(), characterNameField.value);
    default:
      infoMessage.innerHTML = 'Start drawing '+getUserChoice(getCurrentStatus())+', then press the magic wand!';
      break;

    case STATUS_STORY_ENUM.SITUA3: //Handler of the last situation "animation"
      //Handle animation
      //Call the popup at the end of the animation
      infoMessage.innerHTML = 'animation: work in progress...';
      break;

    case STATUS_STORY_ENUM.FINALE:
      choicesDiv.innerHTML = '';
      //Auto re-call popup
      setNextStatus();
      setTimeout(openPopup,500);
      break;

    case STATUS_STORY_ENUM.RECAP:
      infoMessage.innerHTML = getUserChoice(getCurrentStatus())+'!';
  }

  //Close popup
  popup.classList.add('hidden');
  popupContent.classList.add('hidden');
  popupIsOpen = false;

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
    doMagic();
  });
  btnDone.addEventListener('click', function() {
    if(getCurrentStatus()<STATUS_STORY_ENUM.RECAP){
      setNextStatus();
    }
    openPopup();
  });


  //DRAWING
  //==============================================================================
  btnEraser.addEventListener('click', function() {
    eraserActive = true;

    btnPencil.classList.remove('active');
    btnEraser.classList.add('active');

    sketchContext.noFill();
    sketchContext.stroke(eraserStrokeColor);
    sketchContext.strokeWeight(eraserStrokeWeight);
  });

  btnPencil.addEventListener('click', function() {
    eraserActive = false;

    btnPencil.classList.add('active');
    btnEraser.classList.remove('active');

    sketchContext.fill(currentColor);
    sketchContext.stroke(currentColor);
    sketchContext.strokeWeight(currentStrokeWeight);
  });

  colorPalette.addEventListener('click', function() {
    console.log('Colors: work in progress...');
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
  });
}
