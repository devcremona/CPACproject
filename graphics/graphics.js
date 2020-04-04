
const sketch = function(sketch) {
  const BASE_URL = 'https://storage.googleapis.com/quickdraw-models/sketchRNN/models/';
  const availableModels = ['bird', 'ant','ambulance','angel','alarm_clock','antyoga','backpack','barn','basket','bear','bee','beeflower','bicycle','book','brain','bridge','bulldozer','bus','butterfly','cactus','calendar','castle','cat','catbus','catpig','chair','couch','crab','crabchair','crabrabbitfacepig','cruise_ship','diving_board','dog','dogbunny','dolphin','duck','elephant','elephantpig','everything','eye','face','fan','fire_hydrant','firetruck','flamingo','flower','floweryoga','frog','frogsofa','garden','hand','hedgeberry','hedgehog','helicopter','kangaroo','key','lantern','lighthouse','lion','lionsheep','lobster','map','mermaid','monapassport','monkey','mosquito','octopus','owl','paintbrush','palm_tree','parrot','passport','peas','penguin','pig','pigsheep','pineapple','pool','postcard','power_outlet','rabbit','rabbitturtle','radio','radioface','rain','rhinoceros','rifle','roller_coaster','sandwich','scorpion','sea_turtle','sheep','skull','snail','snowflake','speedboat','spider','squirrel','steak','stove','strawberry','swan','swing_set','the_mona_lisa','tiger','toothbrush','toothpaste','tractor','trombone','truck','whale','windmill','yoga','yogabicycle'];
  let model;

  // Model
  let modelState;
  const temperature = 0.1; // Very low so that we draw very well.
  let modelLoaded = false;
  let modelIsActive = false;

  // Model pen state.
  let dx, dy;
  let x, y;
  let startX, startY;  // Keep track of the first point of the last raw line.
  let pen = [0,0,0]; // Model pen state, [pen_down, pen_up, pen_end].
  let previousPen = [1, 0, 0]; // Previous model pen state.
  const PEN = {DOWN: 0, UP: 1, END: 2};
  const epsilon = 2.0; // to ignore data from user's pen staying in one spot.

  // Human drawing.
  let currentRawLine = [];
  let userPen = 0; // above = 0 or below = 1 the paper.
  let previousUserPen = 0;
  let currentColor = 'black';

  // Keep track of everyone's last attempts to that we can reverse them.
  let lastHumanStroke;  // encode the human's drawing as a sequence of [dx, dy, penState] strokes
  let lastHumanDrawing; // the actual sequence of lines that the human drew, so we can replay them.
  let lastModelDrawing = []; // the actual sequence of lines that the model drew, so that we can erase them.

  // Don't record mouse events when the splash is open.
  let splashIsOpen = false;


  /*
   * Main p5 code
   */
  sketch.setup = function() {

    // Initialize the canvas.
    const containerSize = document.getElementById('sketchContainer').getBoundingClientRect();
    const screenWidth = Math.floor(containerSize.width);
    const screenHeight = Math.floor(containerSize.height);
    canvas = sketch.createCanvas(screenWidth, screenHeight);
    canvas.id('sketchCanvas'); //Rename the canvas id
    document.getElementById('sketchCanvas').style.position = 'fixed'; //Set the canvas position to fixed (in order to superpose other elements)
    sketch.frameRate(60);

    //Set the properties for the loading gif to be shown properly
    loadingGifStyle = document.getElementById('loadingGif').style;
    loadingGifStyle.position = 'absolute';
    loadingGifStyle.zIndex = 10;
    loadingGifStyle.top = '50%';
    loadingGifStyle.left = '50%';
    loadingGifStyle.marginTop = "-"+document.getElementById('loadingGif').height/2+"px";
    loadingGifStyle.marginLeft = "-"+document.getElementById('loadingGif').width/2+"px";

    //Reset the canvas
    restart();
    loadModel(22);  // Cat!

    selectModels.innerHTML = availableModels.map(m => `<option>${m}</option>`).join('');
    selectModels.selectedIndex = 22;
    selectModels.addEventListener('change', () => loadModel(selectModels.selectedIndex));
    btnClear.addEventListener('click', restart);
    btnRetry.addEventListener('click', retryMagic);
    btnHelp.addEventListener('click', () => {
      splash.classList.remove('hidden');
      splashIsOpen = true;
    });
    btnGo.addEventListener('click', () => {
      splashIsOpen = false;
      splash.classList.add('hidden');
    });
    btnSave.addEventListener('click', () => {
      sketch.saveCanvas('magic-sketchpad', 'jpg');
    });
  };

  sketch.windowResized = function () {
    //console.log('resize canvas');
    const containerSize = document.getElementById('sketchContainer').getBoundingClientRect();
    const screenWidth = Math.floor(containerSize.width);
    const screenHeight = Math.floor(containerSize.height);
    sketch.resizeCanvas(screenWidth, screenHeight);
  };

  /*
  * Human is drawing.
  */
  sketch.mousePressed = function () {
    if (!splashIsOpen && sketch.isInBounds()) {
      x = startX = sketch.mouseX;
      y = startY = sketch.mouseY;
      userPen = 1; // down!

      modelIsActive = false;
      currentRawLine = [];
      lastHumanDrawing = [];
      previousUserPen = userPen;
      sketch.stroke(currentColor);
    }
  }

  sketch.mouseReleased = function () {
    if (!splashIsOpen && sketch.isInBounds()) {
      userPen = 0;  // Up!
      const currentRawLineSimplified = model.simplifyLine(currentRawLine);

      // If it's an accident...ignore it.
      if (currentRawLineSimplified.length > 1) {
        // Encode this line as a stroke, and feed it to the model.
        lastHumanStroke = model.lineToStroke(currentRawLineSimplified, [startX, startY]);
        encodeStrokes(lastHumanStroke);
      }
      currentRawLine = [];
      previousUserPen = userPen;
    }
  }

  sketch.mouseDragged = function () {
    if (!splashIsOpen && !modelIsActive && modelLoaded && sketch.isInBounds()) {
      const dx0 = sketch.mouseX - x;
      const dy0 = sketch.mouseY - y;
      if (dx0*dx0+dy0*dy0 > epsilon*epsilon) { // Only if pen is not in same area.
        dx = dx0;
        dy = dy0;
        userPen = 1;
        if (previousUserPen == 1) {
          sketch.line(x, y, x+dx, y+dy); // draw line connecting prev point to current point.
          lastHumanDrawing.push([x, y, x+dx, y+dy]);
        }
        x += dx;
        y += dy;
        currentRawLine.push([x, y]);
      }
      previousUserPen = userPen;
    }
    return false;
  }

 /*
  * Model is drawing.
  */
  sketch.draw = function() {
    if (!modelLoaded || !modelIsActive) {
      return;
    }

    // New state.
    pen = previousPen;
    modelState = model.update([dx, dy, ...pen], modelState);
    const pdf = model.getPDF(modelState, temperature);
    [dx, dy, ...pen] = model.sample(pdf);

    // If we finished the previous drawing, start a new one.
    if (pen[PEN.END] === 1) {
      console.log('finished this one');
      modelIsActive = false;
    } else {
      // Only draw on the paper if the pen is still touching the paper.
      if (previousPen[PEN.DOWN] === 1) {
        sketch.line(x, y, x+dx, y+dy);
        lastModelDrawing.push([x, y, x+dx, y+dy]);
      }
      // Update.
      x += dx;
      y += dy;
      previousPen = pen;
    }
  };

  sketch.isInBounds = function () {
    return sketch.mouseX >= 0 && sketch.mouseY >= 0 && sketch.mouseX < sketch.width && sketch.mouseY < sketch.height;
  }

  /*
  * Helpers.
  */
  function retryMagic() {
    sketch.stroke('white');
    sketch.strokeWeight(6);

    // Undo the previous line the model drew.
    for (let i = 0; i < lastModelDrawing.length; i++) {
      sketch.line(...lastModelDrawing[i]);
    }

    // Undo the previous human drawn.
    for (let i = 0; i < lastHumanDrawing.length; i++) {
      sketch.line(...lastHumanDrawing[i]);
    }

    sketch.strokeWeight(3.0);
    sketch.stroke(currentColor);

    // Redraw the human drawing.
    for (let i = 0; i < lastHumanDrawing.length; i++) {
      sketch.line(...lastHumanDrawing[i]);
    }

    // Start again.
    encodeStrokes(lastHumanStroke);
  }

  function restart() {
    sketch.background(255, 255, 255, 255);
    sketch.strokeWeight(3.0);

    // Start drawing in the middle-ish of the screen
    startX = x = sketch.width / 2.0;
    startY = y = sketch.height / 3.0;

    // Reset the user drawing state.
    userPen = 1;
    previousUserPen = 0;
    currentRawLine = [];
    strokes = [];

    // Reset the model drawing state.
    modelIsActive = false;
    previousPen = [0, 1, 0];

    sketch.windowResized(); //Needed to clear completely the canvas
  };

  function loadModel(index) {
    modelLoaded = false;
    document.getElementById('sketchContainer').classList.add('loading');
    document.getElementById('loadingGif').style.display = 'block'; //Display loading gif


    if (model) {
      model.dispose(); //Clear the model object
    }

    // loads the TensorFlow.js version of sketch-rnn model, with the model's weights.
    model = new ms.SketchRNN(`${BASE_URL}${availableModels[index]}.gen.json`);

    //Actually initialize the model, and set a callback to run at the end of the initialization
    model.initialize().then(() => {
      modelLoaded = true;
      document.getElementById('sketchContainer').classList.remove('loading');
      document.getElementById('loadingGif').style.display = 'none'; //Hide loading gif
      console.log(`🤖${availableModels[index]} loaded.`);
      model.setPixelFactor(5.0);  // Smaller -> larger outputs
    });
  };

  function encodeStrokes(sequence) {
    if (sequence.length <= 5) {
      return;
    }

    // Encode the strokes in the model.
    let newState = model.zeroState();
    newState = model.update(model.zeroInput(), newState);
    newState = model.updateStrokes(sequence, newState, sequence.length-1);

    // Reset the actual model we're using to this one that has the encoded strokes.
    modelState = model.copyState(newState);

    const lastHumanLine = lastHumanDrawing[lastHumanDrawing.length-1];
    x = lastHumanLine[0];
    y = lastHumanLine[1];

    // Update the pen state.
    const s = sequence[sequence.length-1];
    dx = s[0];
    dy = s[1];
    previousPen = [s[2], s[3], s[4]];

    lastModelDrawing = [];
    modelIsActive = true;
  }

  /*
  * Colours.
  */
  const COLORS = [
    { name: 'black', hex: '#000000'},
    { name: 'red', hex: '#f44336'},
    { name: 'pink', hex: '#E91E63'},
    { name: 'purple', hex: '#9C27B0'},
    { name: 'deeppurple', hex: '#673AB7'},
    { name: 'indigo', hex: '#3F51B5'},
    { name: 'blue', hex: '#2196F3'},
    { name: 'cyan', hex: '#00BCD4'},
    { name: 'teal', hex: '#009688'},
    { name: 'green', hex: '#4CAF50'},
    { name: 'lightgreen', hex: '#8BC34A'},
    { name: 'lime', hex: '#CDDC39'},
    { name: 'yellow', hex: '#FFEB3B'},
    { name: 'amber', hex: '#FFC107'},
    { name: 'orange', hex: '#FF9800'},
    { name: 'deeporange', hex: '#FF5722'},
    { name: 'brown', hex: '#795548'},
    { name: 'grey', hex: '#9E9E9E'}
  ];

  function randomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)].hex
  }
  function randomColorIndex() {
    return Math.floor(Math.random() * COLORS.length);
  }
  sketch.updateCurrentColor = function(index) {
    currentColor = COLORS[index].hex;
  }

};

const p5Sketch = new p5(sketch, 'sketchContainer');
function changeColor(event){
  const btn = event.target;
  p5Sketch.updateCurrentColor(btn.dataset.index);
  document.querySelector('.active').classList.remove('active');
  btn.classList.add('active');
}
