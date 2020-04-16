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
      setVoice("Google US English",rate=1.1);
      speak(infoMessage.innerHTML);
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
  btnPencil.addEventListener('click', function() {

    //Opens slider
    if(btnPencil.classList.contains('active')){
      pencilRadiusSlider.classList.toggle('visible');
      graphicToolsOpen = !graphicToolsOpen;
    }

    eraserActive = false;

    colorPalette.classList.remove('active');
    colors.classList.remove('visible');
    btnEraser.classList.remove('active');
    eraserRadiusSlider.classList.remove('visible');
    btnPencil.classList.add('active');

    sketchContext.fill(currentColor);
    sketchContext.stroke(currentColor);
    sketchContext.strokeWeight(currentStrokeWeight);

  });

  pencilRadiusSlider.addEventListener('input', function(event){
    currentStrokeWeight = event.target.value;
    sketchContext.strokeWeight(currentStrokeWeight);
  });


  btnEraser.addEventListener('click', function() {

    //Opens slider
    if(btnEraser.classList.contains('active')){
      eraserRadiusSlider.classList.toggle('visible');
      graphicToolsOpen = !graphicToolsOpen;
    }

    eraserActive = true;

    btnPencil.classList.remove('active');
    pencilRadiusSlider.classList.remove('visible');
    colorPalette.classList.remove('active');
    colors.classList.remove('visible');
    btnEraser.classList.add('active');

    sketchContext.noFill();
    sketchContext.stroke(eraserStrokeColor);
    sketchContext.strokeWeight(eraserStrokeWeight);
  });

  eraserRadiusSlider.addEventListener('input', function(event){
    eraserRadius = parseInt(event.target.value);
  });


  colorPalette.addEventListener('click', function() {
    btnPencil.classList.remove('active');
    pencilRadiusSlider.classList.remove('visible');
    btnEraser.classList.remove('active');
    eraserRadiusSlider.classList.remove('visible');
    colorPalette.classList.add('active');

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
    colorPalette.classList.remove('active');

    sketchContext.fill(currentColor);
    sketchContext.stroke(currentColor);
    sketchContext.strokeWeight(currentStrokeWeight);
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
