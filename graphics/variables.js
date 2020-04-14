let sketchContext;

//Model variables
const BASE_URL = 'https://storage.googleapis.com/quickdraw-models/sketchRNN/models/';
const availableModels = ['cat','sheep'];
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
let userPen = 0; // above = 0 or below = 1 the paper. (0= pen not drawing, 1=pen is drawing)
let previousUserPen = 0;
let currentColor = 'black';
let currentStrokeWeight = 3.0;

// Keep track of everyone's last attempts to that we can reverse them.
let lastHumanStroke = [];  // encode the human's drawing as a sequence of [dx, dy, penState] strokes
let lastHumanDrawing = []; // the actual sequence of lines that the human drew, so we can replay them.
let lastModelDrawing = []; // the actual sequence of lines that the model drew, so that we can erase them.

// Don't record mouse events when the splash is open.
let splashIsOpen = false;

//Eraser variables
let eraserTransparentColor; //Black (0,0,0,..), transparent (..,..,..,0)
let eraserRadius = 20;
let eraserStrokeWeight = 1;
let eraserActive = false;
let eraserStrokeColor = 'black';

//Popup variables
popupIsOpen = false;
