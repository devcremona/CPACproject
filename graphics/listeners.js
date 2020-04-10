function setListeners() {

  //POPUP
  //==============================================================================
  btnConfirmPopup.addEventListener('click', () => { // When the user clicks on x, close the popup
    choicesList.removeEventListener('change', changeBackground);

    if(getCurrentStatus()==STATUS_STORY_ENUM.PROTAGONISTA){
      loadModel(choicesList.selectedIndex);
    }

    popup.classList.add('hidden');
    popupContent.classList.add('hidden');
    popupIsOpen = false;
    infoMessage.innerHTML = 'popup closed!';
  });


  //NAVIGATION
  //==============================================================================
  btnClear.addEventListener('click', () => {
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
  btnMagic.addEventListener('click', () => {
    doMagic();
  });
  btnDone.addEventListener('click', ()=> {
    setNextStatus();
    openPopup();
  });


  //DRAWING
  //==============================================================================
  btnEraser.addEventListener('click', () => {
    eraserActive = true;

    btnPencil.classList.remove('active');
    btnEraser.classList.add('active');

    sketchContext.noFill();
    sketchContext.stroke('red');
    sketchContext.strokeWeight(eraserStrokeWeight);
  });

  btnPencil.addEventListener('click', () => {
    eraserActive = false;

    btnPencil.classList.add('active');
    btnEraser.classList.remove('active');

    sketchContext.fill(currentColor);
    sketchContext.stroke(currentColor);
    sketchContext.strokeWeight(currentStrokeWeight);
  });

  colorPalette.addEventListener('click', () => {
    infoMessage.innerHTML = 'Colors: work in progress...';
  });


  //SPLASH
  //==============================================================================
  btnHelp.addEventListener('click', () => { //Go to the spash screen
    splash.classList.remove('hidden');
    splashIsOpen = true;
  });

  btnGo.addEventListener('click', () => { //From splash to the sketch
    splashIsOpen = false;
    splash.classList.add('hidden');
  });
}
