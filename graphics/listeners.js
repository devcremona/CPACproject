function setListeners() {

  //POPUP
  //==============================================================================
  btnConfirmPopup.addEventListener('click', function() { // When the user clicks on x, close the popup
    switch (getCurrentStatus()) {
      case STATUS_STORY_ENUM.DOVE:
        choicesDivs.forEach(function(element) { element.removeEventListener('click', changeBackground) });
        break;
      case STATUS_STORY_ENUM.METEO:
          choicesDivs.forEach(function (element) { element.removeEventListener('click', changeBackground) });
        break;
      case STATUS_STORY_ENUM.PROTAGONISTA:
        loadModel(choices.indexOf(getChoices()));
        break;
      case STATUS_STORY_ENUM.NOME:
        setUserChoice(getCurrentStatus(), characterNameField.value);
        break;
      default:
        break;
    }

    popup.classList.add('hidden');
    popupContent.classList.add('hidden');
    popupIsOpen = false;
    infoMessage.innerHTML = 'popup closed!';
  });


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
    setNextStatus();
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
    infoMessage.innerHTML = 'Colors: work in progress...';
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
