var autoDraw = false;
var resizeCanvasBool = true;
var drawingsCounter = 0;
var storyStates = {
  DRAW_AVATAR: 1,
  DRAW_ANGEL: 2,
  DRAW_PRESENT: 3,
  FINAL_ANIMATION: 4,
};
var angelPosition = 0;
var presentPosition = 0;
var avatarPosition = 0
var storyState = storyStates.DRAW_AVATAR;
var lastDrawPosition = 0;
var pig = new Audio("sound/pig.wav");
var cat = new Audio("sound/cat.wav");
var bike = new Audio("sound/bike.wav");
var angel = new Audio("sound/angel.wav");

//document.getElementById("modelsSelect").style.opacity = 0;

const sketch = function(p) {
  const BASE_URL = 'https://storage.googleapis.com/quickdraw-models/sketchRNN/models/';
  //const availableModels = ['bird', 'ant','ambulance','angel','alarm_clock','antyoga','backpack','barn','basket','bear','bee','beeflower','bicycle','book','brain','bridge','bulldozer','bus','butterfly','cactus','calendar','castle','cat','catbus','catpig','chair','couch','crab','crabchair','crabrabbitfacepig','cruise_ship','diving_board','dog','dogbunny','dolphin','duck','elephant','elephantpig','everything','eye','face','fan','fire_hydrant','firetruck','flamingo','flower','floweryoga','frog','frogsofa','garden','hand','hedgeberry','hedgehog','helicopter','kangaroo','key','lantern','lighthouse','lion','lionsheep','lobster','map','mermaid','monapassport','monkey','mosquito','octopus','owl','paintbrush','palm_tree','parrot','passport','peas','penguin','pig','pigsheep','pineapple','pool','postcard','power_outlet','rabbit','rabbitturtle','radio','radioface','rain','rhinoceros','rifle','roller_coaster','sandwich','scorpion','sea_turtle','sheep','skull','snail','snowflake','speedboat','spider','squirrel','steak','stove','strawberry','swan','swing_set','the_mona_lisa','tiger','toothbrush','toothpaste','tractor','trombone','truck','whale','windmill','yoga','yogabicycle'];
  const availableModels = ['cat', 'pig', 'bicycle', 'angel'];
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
  p.setup = function() {
    // Initialize the canvas.
    const containerSize = document.getElementById('sketch').getBoundingClientRect();
    const screenWidth = Math.floor(containerSize.width);
    const screenHeight = Math.floor(containerSize.height);
    p.createCanvas(screenWidth, screenHeight);
    p.frameRate(60);

    restart();
    initModel(3);  // Angel!

    //settings.style.display = 'none'; //Hide settings, buttons, list of models menu
    presentList = [...availableModels];
    presentList.pop(); // no show the angel into the presentList box
    console.log(presentList);
    selectModels.innerHTML = presentList.map(m => `<option>${m}</option>`).join('');
    //selectModels.selectedIndex = 3;
    selectModels.addEventListener('change', () => initModel(selectModels.selectedIndex));
    btnClear.addEventListener('click', restart);
    btnRetry.addEventListener('click', retryMagic);
    // btnHelp.addEventListener('click', () => {
    //   splash.classList.remove('hidden');
    //   splashIsOpen = true;
    // });
    // btnGo.addEventListener('click', () => {
    //   splashIsOpen = false;
    //   splash.classList.add('hidden');
    // });
    // btnSave.addEventListener('click', () => {
    //   p.saveCanvas('magic-sketchpad', 'png');
    // });

    btnDone.addEventListener('click', () => {
      if(storyState == storyStates.DRAW_AVATAR) moveAvatar();

      if(storyState == storyStates.DRAW_ANGEL){
        var angel = imageFromCanvas("defaultCanvas0", "angel");

        addImage("../images/boxCover.png","presentTop","sketch");
        document.getElementById("presentTop").style.position = "absolute";
        document.getElementById("presentTop").style.width = "200px";
        document.getElementById("presentTop").style.left = angelPosition[0]+150+"px";
        document.getElementById("presentTop").style.top = angelPosition[1]+"px";
        document.getElementById("presentTop").style.opacity = "0";
        document.getElementById("presentTop").style.transform = "rotate(-40deg)";
        document.getElementById("presentTop").style.transformOrigin = "bottom left";

        addImage("../images/boxDown.png","presentBox","sketch");
        document.getElementById("presentBox").style.position = "absolute";
        document.getElementById("presentBox").style.width = "200px";
        document.getElementById("presentBox").style.left = angelPosition[0]+150+"px";
        document.getElementById("presentBox").style.top = angelPosition[1]+(230-145)+"px";
        document.getElementById("presentBox").style.opacity = "0";

        // model initialization and box
        selectModels.selectedIndex = 0;
        initModel(0);

        $("#presentTop").animate({opacity:"1"},800);
        $("#presentBox").animate({opacity:"1"},800, function(){
          storyState = storyStates.DRAW_PRESENT;
          console.log("storyState: ", storyState);
          document.getElementById("textField").innerHTML = "Now select you present and draw a circle!";
          $("#modelsSelect").animate({opacity:"1"},700);
        });

      }

      if(storyState == storyStates.DRAW_PRESENT){
        var present = imageFromCanvas("defaultCanvas0", "present");
        autoDraw = false;
        //moveDraw(present.id, $("#presentBox").position().left, $("#presentBox").position().top, function(){})
        var closeBoxAnimationDuration = 800;
        $({rotation: -45}).animate({rotation: 0}, {
            duration: closeBoxAnimationDuration,
            easing: 'linear',
            step: function () {
                $("#presentTop").css({transform: 'rotate(' + this.rotation + 'deg)'});
                console.log(this.rotation);
            }
        });

        endAnimationDuration = 2000;
        setTimeout(function(){
          var duration = endAnimationDuration;
          avatarTop = $("#avatar").position().top;
          avatarLeft = $("#avatar").position().left;

          targetPositionAngel = [screenWidth*0.5, screenHeight*0.6];

          targetPositionPresentTop = [targetPositionAngel[0]+150, targetPositionAngel[1]];
          targetPositionPresentBox = [targetPositionAngel[0]+150, targetPositionAngel[1]+(230-145)];


          coordEndAngel = [$("#angel").position().left+(targetPositionAngel[0]-angelPosition[0]), $("#angel").position().top+(targetPositionAngel[1]-angelPosition[1])];
          //coordEndPresent = [avatarLeft-200, avatarTop+100];
          coordEndPresentTop = [targetPositionPresentTop[0], targetPositionPresentTop[1]];
          coordEndPresentBox = [targetPositionPresentBox[0], targetPositionPresentBox[1]];

          moveDraw(document.getElementById("angel").id, coordEndAngel[0], coordEndAngel[1], duration, function(){});
          //moveDraw(document.getElementById("present").id, coordEndPresent[0], coordEndPresent[1], duration, function(){});
          $("#present").animate({opacity:"0"},100);
          $("#presentTop").animate({left:""+coordEndPresentTop[0]+"px", top:""+coordEndPresentTop[1]+"px"},duration, function(){});
          $("#presentBox").animate({left:""+coordEndPresentBox[0]+"px", top:""+coordEndPresentBox[1]+"px"},duration, function(){});

          setTimeout(function(){
            $({rotation: 0}).animate({rotation: -45}, {
                duration: closeBoxAnimationDuration,
                easing: 'linear',
                step: function () {
                    $("#presentTop").css({transform: 'rotate(' + this.rotation + 'deg)'});
                }
            });
            setTimeout(function(){
              playSound(availableModels[selectModels.selectedIndex]);
              document.getElementById("textField").innerHTML = "Merry Christmas!!";
            },closeBoxAnimationDuration);
          },endAnimationDuration+400);

        },closeBoxAnimationDuration+400);
      }

      //Clear the transparent canvas that is above all the other elements
      if(storyState < 4){
        restart();
        resetCanvas();
        storyState = changeState(storyState);
        console.log("story state: ", storyState);
      }


    });

    document.getElementById("modelsSelect").style.position = "absolute";
    document.getElementById("modelsSelect").style.zIndex = "10";

    document.getElementById("modelsSelect").style.top = $("#hd").height()+"px";
    document.getElementById("hd").style.zIndex = 10;

    console.log("end setup");
  };

  p.windowResized = function () {
    console.log('resize canvas');
    const containerSize = document.getElementById('sketch').getBoundingClientRect();
    const screenWidth = Math.floor(containerSize.width);
    const screenHeight = Math.floor(containerSize.height);
    if(resizeCanvasBool){
      p.resizeCanvas(screenWidth, screenHeight);
    }
  };

  function resetCanvas() {
    const containerSize = document.getElementById('sketch').getBoundingClientRect();
    const screenWidth = Math.floor(containerSize.width);
    const screenHeight = Math.floor(containerSize.height);
    p.resizeCanvas(screenWidth, screenHeight);
  }

  /*
  * Human is drawing.
  */
  p.mousePressed = function () {
    if (!splashIsOpen && p.isInBounds()) {
      x = startX = p.mouseX;
      y = startY = p.mouseY;
      userPen = 1; // down!

      modelIsActive = false;
      currentRawLine = [];
      lastHumanDrawing = [];
      previousUserPen = userPen;
      p.stroke(currentColor);
    }
  }

  p.mouseReleased = function () {
    if (!splashIsOpen && p.isInBounds()) {
      userPen = 0;  // Up!
      const currentRawLineSimplified = model.simplifyLine(currentRawLine);

      // If it's an accident...ignore it.
      if (currentRawLineSimplified.length > 1 && autoDraw) {
        // Encode this line as a stroke, and feed it to the model.
        lastHumanStroke = model.lineToStroke(currentRawLineSimplified, [startX, startY]);
        encodeStrokes(lastHumanStroke);
      }

      if(storyState == storyStates.DRAW_AVATAR){
        avatarPosition = currentRawLine[currentRawLine.length-1];
      }

      if(storyState == storyStates.DRAW_ANGEL){
        angelPosition = currentRawLine[currentRawLine.length-1];
      }

      if(storyState == storyStates.DRAW_PRESENT){
        presentPosition = currentRawLine[currentRawLine.length-1];
      }

      currentRawLine = [];
      previousUserPen = userPen;
    }
  }

  p.mouseDragged = function () {
    if (!splashIsOpen && !modelIsActive && p.isInBounds()) {
      const dx0 = p.mouseX - x;
      const dy0 = p.mouseY - y;
      if (dx0*dx0+dy0*dy0 > epsilon*epsilon) { // Only if pen is not in same area.
        dx = dx0;
        dy = dy0;
        userPen = 1;
        if (previousUserPen == 1) {
          p.line(x, y, x+dx, y+dy); // draw line connecting prev point to current point.
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
  p.draw = function() {
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

      if(storyState==storyStates.DRAW_ANGEL){
        playSound("angel");
      }


      setTimeout(function(){
        // resetCanvas();
        // moveDraw("angel", 440, 340, 1000);
        // $("#present").animate({left:""+750+"px", top:""+340+"px"},1000);
      },500);

    } else {
      // Only draw on the paper if the pen is still touching the paper.
      if (previousPen[PEN.DOWN] === 1) {
        p.line(x, y, x+dx, y+dy);
        lastModelDrawing.push([x, y, x+dx, y+dy]);
      }
      // Update.
      x += dx;
      y += dy;
      previousPen = pen;
    }
  };

  p.isInBounds = function () {
    return p.mouseX >= 0 && p.mouseY >= 0 && p.mouseX < p.width && p.mouseY < p.height;
  }

  /*
  * Helpers.
  */
  function retryMagic() {
    if(autoDraw){
      p.stroke('white');
      p.strokeWeight(6);

      // Undo the previous line the model drew.
      for (let i = 0; i < lastModelDrawing.length; i++) {
        p.line(...lastModelDrawing[i]);
      }

      // Undo the previous human drawn.
      for (let i = 0; i < lastHumanDrawing.length; i++) {
        p.line(...lastHumanDrawing[i]);
      }



      p.strokeWeight(3.0);
      p.stroke(currentColor);

      resetCanvas();

      // Redraw the human drawing.
      for (let i = 0; i < lastHumanDrawing.length; i++) {
        p.line(...lastHumanDrawing[i]);
      }

      // Start again.
      encodeStrokes(lastHumanStroke);
    }
  }

  function restart() {
    p.background(255,255,255,255);

    p.strokeWeight(3.0);

    // Start drawing in the middle-ish of the screen
    startX = x = p.width / 2.0;
    startY = y = p.height / 3.0;

    // Reset the user drawing state.
    userPen = 1;
    previousUserPen = 0;
    currentRawLine = [];
    strokes = [];

    // Reset the model drawing state.
    modelIsActive = false;
    previousPen = [0, 1, 0];

    resetCanvas();

  };


  function initModel(index) {
    modelLoaded = false;
    //document.getElementById('sketch').classList.add('loading');

    if (model) {
      model.dispose();
    }

    model = new ms.SketchRNN(`${BASE_URL}${availableModels[index]}.gen.json`);
    model.initialize().then(() => {
      modelLoaded = true;
      //document.getElementById('sketch').classList.remove('loading');
      console.log(`🤖${availableModels[index]} loaded.`);
      model.setPixelFactor(5.0);  // Bigger -> large outputs

      resetCanvas();
      resizeCanvasBool = false;
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
  p.updateCurrentColor = function(index) {
    currentColor = COLORS[index].hex;
  }

};

const p5Sketch = new p5(sketch, 'sketch');
function changeColor(event){
  const btn = event.target;
  p5Sketch.updateCurrentColor(btn.dataset.index);
  document.querySelector('.active').classList.remove('active');
  btn.classList.add('active');
}
