function doMagic() {

  //Deactivate done button
  btnDone.classList.add('inactive');
  btnDone.removeEventListener('click', btnDoneCallback);

  speakStop();

  infoMessage.innerHTML = 'Look at the magic! Cool!';
  speakStop();
  speak(infoMessage.innerHTML);

  sketchContext.clear();

  sketchContext.strokeWeight(currentStrokeWeight);
  sketchContext.stroke(currentColor);

  // Redraw the human drawing.
  for (let i = 0; i < lastHumanDrawing.length; i++) {
    sketchContext.line(...lastHumanDrawing[i]);
  }

  // Start again: call ML function to elaborate model from human stroke
  encodeStrokes(lastHumanStroke);
}



function restart() {

  if (drawingStatus==DRAWING_STATUS.MAGIC){
      drawingStatus = DRAWING_STATUS.INIT;
  }

  sketchContext.background(255, 255, 255, 0);
  sketchContext.strokeWeight(currentStrokeWeight);

  // Start drawing in the middle-ish of the screen
  startX = x = sketchContext.width / 2.0;
  startY = y = sketchContext.height / 3.0;

  // Reset the user drawing state.
  userPen = 1;
  previousUserPen = 0;
  currentRawLine = [];
  lastHumanDrawing = [];
  strokes = [];

  // Reset the model drawing state.
  modelIsActive = false;
  previousPen = [0, 1, 0];

  sketchContext.windowResized(); //Needed to clear completely the transparent canvas
};



function loadModel(index) {
  modelLoaded = false;
  app.classList.add('loading');
  loadingGif.style.display = 'block'; //Display loading gif


  if (model) {
    model.dispose(); //Clear the model object
  }

  // loads the TensorFlow.js version of sketch-rnn model, with the model's weights.

  //Use default trained models
  //model = new ms.SketchRNN(`${BASE_URL}${availableModels[index]}.gen.json`);

  //Use custom trained model of sheep
  model = new ms.SketchRNN(`../ML/models/`+getUserChoice(getCurrentStatus_Story()).toLowerCase()+`.gen.json`);

  //model = new ms.SketchRNN('https://storage.googleapis.com/quickdraw-models/sketchRNN/models/sheep.gen.json');

  //Actually initialize the model, and set a callback to run at the end of the initialization
  model.initialize().then(function() {
    modelLoaded = true;
    app.classList.remove('loading');
    loadingGif.style.display = 'none'; //Hide loading gif
    console.log(`🤖${getUserChoice(getCurrentStatus_Story())} loaded.`);
    model.setPixelFactor(5.0);  // Smaller -> larger outputs

    //Set the drawing status
    drawingStatus = DRAWING_STATUS.INIT;

    //Activate Pencil
    btnPencil.classList.remove('inactive');
    btnPencil.addEventListener('click', btnPencilListener);

    //Activate Colors
    btnColors.classList.remove('inactive');
    btnColors.addEventListener('click', btnColorsListener);

    //Inform the user on what to do now
    infoMessage.innerHTML = 'Start drawing a '+getUserChoice(getCurrentStatus_Story()).toLowerCase()+' by clicking on <span id="pencilText" class="iconify active" data-icon="bx:bxs-pencil">...';
    setTimeout(function(){
      pencilText.style.cursor = 'auto';
    },10);
    speak('Start drawing a '+getUserChoice(getCurrentStatus_Story()).toLowerCase()+' by clicking on the pencil...');
  });
};



function setSpeakerVoice(){
  if(navigator.userAgent.indexOf('Firefox') == -1){ //If we are not in Firefox
    speechSynthesis.onvoiceschanged = function() { // wait on voices to be loaded before fetching list
      //Search the last available italian and english voice
      for(i=0; i<getVoices().length; i++){
          if(getVoices()[i][1]=='it-IT'){
              voiceNameITA=getVoices()[i][0];
          }
          if(getVoices()[i][1]=='en-US'){
              voiceNameENG=getVoices()[i][0];
          }
      }
      setVoice(voiceNameENG);
      console.log('setted voice',voiceNameENG, getVoices());
    };
  } else { //If we are in firefox we need a delay to detect the voices
    getVoices();
    setTimeout(function(){
      for(i=0; i<getVoices().length; i++){
          if(getVoices()[i][1]=='it-IT'){
              voiceNameITA=getVoices()[i][0];
          }
          if(getVoices()[i][1]=='en-US'){
              voiceNameENG=getVoices()[i][0];
          }
      }
      setVoice(voiceNameENG);
      console.log('setted voice firefox',voiceNameENG, getVoices());
    },10);

  }
}
