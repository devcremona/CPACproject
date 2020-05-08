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


function preloadImages(){

    //Load background images
    for(i=0; i<choices[STATUS_STORY_ENUM.WHERE].length; i++){
      for(j=0; j<choices[STATUS_STORY_ENUM.WEATHER].length; j++){
        backgroundImages[choices[STATUS_STORY_ENUM.WHERE][i].toLowerCase()+'_'+choices[STATUS_STORY_ENUM.WEATHER][j].toLowerCase()] = new Image();
        backgroundImages[choices[STATUS_STORY_ENUM.WHERE][i].toLowerCase()+'_'+choices[STATUS_STORY_ENUM.WEATHER][j].toLowerCase()].src = '../background/'+choices[STATUS_STORY_ENUM.WHERE][i].toLowerCase()+'_'+choices[STATUS_STORY_ENUM.WEATHER][j].toLowerCase()+'.png';
      }
    }

    //Load character images
    for(i=0; i<choices[STATUS_STORY_ENUM.CHARACTER].length; i++){
      buttonImages[choices[STATUS_STORY_ENUM.CHARACTER][i].toLowerCase()] = new Image();
      buttonImages[choices[STATUS_STORY_ENUM.CHARACTER][i].toLowerCase()].src = '../buttonsImg/'+choices[STATUS_STORY_ENUM.CHARACTER][i].toLowerCase()+'.png';
    }

    //Load second character images
    for(i=0; i<choices[STATUS_STORY_ENUM.SECOND_CHARACTER].length; i++){
      buttonImages[choices[STATUS_STORY_ENUM.SECOND_CHARACTER][i].toLowerCase()] = new Image();
      buttonImages[choices[STATUS_STORY_ENUM.SECOND_CHARACTER][i].toLowerCase()].src = '../buttonsImg/'+choices[STATUS_STORY_ENUM.SECOND_CHARACTER][i].toLowerCase()+'.png';
    }

    //Load play list images
    for(i=0; i<PLAY_LIST.length; i++){
      buttonImages[PLAY_LIST[i].toLowerCase()] = new Image();
      buttonImages[PLAY_LIST[i].toLowerCase()].src = '../buttonsImg/'+PLAY_LIST[i].toLowerCase()+'.png';
    }

    //Load food list images
    for(i=0; i<FOOD_LIST.length; i++){
      buttonImages[FOOD_LIST[i].toLowerCase()] = new Image();
      buttonImages[FOOD_LIST[i].toLowerCase()].src = '../buttonsImg/'+FOOD_LIST[i].toLowerCase()+'.png';
    }

    //Load thirst list images
    for(i=0; i<THIRST_LIST.length; i++){
      buttonImages[THIRST_LIST[i].toLowerCase()] = new Image();
      buttonImages[THIRST_LIST[i].toLowerCase()].src = '../buttonsImg/'+THIRST_LIST[i].toLowerCase()+'.png';
    }

    //Load arrow image
    buttonImages['arrows'] = new Image();
    buttonImages['arrows'].src = "../arrows.png";
}


function preloadJSONs(){
  for (var i = 0; i < availableModels.length; i++) {
    $.getJSON('../ML/models/'+availableModels[i]+'.gen.json');
  }
}

function getAvailableModels(){
  //Concat all the possible choices
  availableModels = choices[STATUS_STORY_ENUM.CHARACTER].concat(choices[STATUS_STORY_ENUM.SECOND_CHARACTER].concat(PLAY_LIST.concat(FOOD_LIST.concat(THIRST_LIST))));
  //Set all the models to lower case
  for (var i = 0; i < availableModels.length; i++) {
    availableModels[i] = availableModels[i].toLowerCase();
  }
  return availableModels;
}


function setSpeakerVoice(){
  if(navigator.userAgent.indexOf('Firefox') == -1){ //If we are not in firfox
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
    };
  } else { //If we are in firefox
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
    },10);
  }
}

function toPixels(xxx, yyy, d){ // x, y, pixelDensity
	return 4 * d * (xxx + yyy*sketchContext.width);
}

function toCoord(pix, d){ // pix must be multiple of (4 * pixelDensity)
	return ( [ (pix/4/d)%sketchContext.width, pix/4/d/sketchContext.width ] );
}

function scanCanvas(){
  let d = sketchContext.pixelDensity();
  maxx = 0; maxy = 0;
  minx = sketchContext.width; miny = sketchContext.height;
  step = 4 * 8 * d; // 4 (r,g,b,a) x s (check every s pixel) x d

  for (i=0; i < sketchContext.height*step; i += step){
    for (j=0; j < sketchContext.width*step; j += step){
      let ij = sketchContext.height * i + j;
      //console.log(ij);
      if(/*(sketchContext.pixels[ij] || sketchContext.pixels[ij+1] || sketchContext.pixels[ij+2]) && */sketchContext.pixels[ij+3]){ // if pixel != (0,0,0,0)
        let idx = toCoord(ij, d);
        //console.log(idx);
        if(idx[0] > maxx) maxx = idx[0];
        if(idx[0] < minx) minx = idx[0];
        if(idx[1] > maxy) maxy = idx[1];
        if(idx[1] < miny) miny = idx[1];
      }
    }
  }
  console.log("\nmaxx: "+maxx+"\nmaxy: "+maxy+"\nminx: "+minx+"\nminy: "+miny);
}
