

// ============================================================================
// CONSTANTS
// ============================================================================

// current status of the Story
const STATUS_STORY_ENUM = {
  WHERE: 0,
  WEATHER: 1,
  CHARACTER: 2,
  NAME: 3,
  SITUA1: 4,
  OBJECT: 5,
  SITUA2: 6,
  LAST_SITUA: 7,
  RECORDING: 8,
  RECAP: 9,
};

// choices for the users
var choices = {
  [STATUS_STORY_ENUM.WHERE]: ["Lake", "City", "Forest", "Hill", "Farm"],
  [STATUS_STORY_ENUM.WEATHER]: ["Sunny", "Rainy", "Foggy", "Dark"],
  [STATUS_STORY_ENUM.CHARACTER]: ["Dog", "Cat"],
  [STATUS_STORY_ENUM.NAME]: [],
  [STATUS_STORY_ENUM.SITUA1]: ["X wants to play", "X is hungry", "X is thirsty"],
  [STATUS_STORY_ENUM.OBJECT]: ["initialize list"], // inizializzare in base alla scelta di cosa fare
  [STATUS_STORY_ENUM.SITUA2]: ["Bird", "Bee", "Crab", "Duck"],
  [STATUS_STORY_ENUM.LAST_SITUA]: ["Steal the Y", "Share the Y", "Enjoy with X"],
  [STATUS_STORY_ENUM.RECORDING]: [],
  [STATUS_STORY_ENUM.RECAP]: ["The end", "Very good", "What a beautiful story", "Thank you"]
};

// list of possibilities
const PLAY_LIST = ["Ball", "Boomerang", "Guitar"];
const FOOD_LIST = ["Hamburger", "Cake", "Pizza", "Apple"];
const THIRST_LIST = ["Bottle", "Bowl"];

// sentences for the narration to visualize to the screen
// narrationPC
var narrationPC = {
  [STATUS_STORY_ENUM.WHERE]: ["Once upon a time... but where?"],
  [STATUS_STORY_ENUM.WEATHER]: ["and it was a day..."],
  [STATUS_STORY_ENUM.CHARACTER]: ["But who is the protagonist of the story?"],
  [STATUS_STORY_ENUM.NAME]: ["What's its name?"],
  [STATUS_STORY_ENUM.SITUA1]: ["Now what happens?"],
  [STATUS_STORY_ENUM.OBJECT]: ["initialize list"], // inizializzare in base alla scelta di cosa fare
  [STATUS_STORY_ENUM.SITUA2]: ["But at some point ... There comes a"],
  [STATUS_STORY_ENUM.LAST_SITUA]: ["But character2 would like..."],
  [STATUS_STORY_ENUM.RECORDING]: ["Now tell me how this story ends!"],
  [STATUS_STORY_ENUM.RECAP]: ["The end", "Very good", "What a beautiful story", "Thank you"]
};

var userChoice = [];

// sentences for the narration to reproduce
var narrationVoice = {
  [STATUS_STORY_ENUM.WHERE]: "Once upon a time, in a beautilul ...",
  [STATUS_STORY_ENUM.WEATHER]: "on a ... day",
  [STATUS_STORY_ENUM.CHARACTER]: "there was a very nice ...",
  [STATUS_STORY_ENUM.NAME]: "named ...",
  [STATUS_STORY_ENUM.SITUA1]: "X ...",
  [STATUS_STORY_ENUM.OBJECT]: "with ...",
  [STATUS_STORY_ENUM.SITUA2]: "At some point a small ... arrives",
  [STATUS_STORY_ENUM.LAST_SITUA]: "but the character2 would like so much to ...",
  [STATUS_STORY_ENUM.RECORDING]: "Suddenly ...",
  [STATUS_STORY_ENUM.RECAP]: ""
};

// ============================================================================
// VARIABLES
// ============================================================================

var currentStatus = STATUS_STORY_ENUM.WHERE;
var nameCharacter = "X";
var objectStory = "Y";

// ============================================================================
// SET FUNCTIONS
// ============================================================================


/**
* set the current story choice of the user
* @param status {STATUS_STORY_ENUM}: the current status of the story
* @param object {object}: specific set for that status (string/int)
* @return {Boolean}: if the set is correct
*/
function setUserChoice(status, object){
  ret = true
  switch(status){
    case STATUS_STORY_ENUM.WHERE: setPlace(object); break;
    case STATUS_STORY_ENUM.WEATHER: setMeteo(object); break;
    case STATUS_STORY_ENUM.CHARACTER: setMainCharacter(object); break;
    case STATUS_STORY_ENUM.NAME: setNameCharacter(object); break;
    case STATUS_STORY_ENUM.SITUA1: setSitua1(object); break;
    case STATUS_STORY_ENUM.OBJECT: setObject(object); break;
    case STATUS_STORY_ENUM.SITUA2: setSitua2(object); break;
    case STATUS_STORY_ENUM.LAST_SITUA: setLAST_SITUA(object); break;
    case STATUS_STORY_ENUM.RECORDING: setFinale(object); break;
    default: ret = false; break;
  }
  return ret
}

//----------------------------
// private set

/**
* set place of the story
* @param place {string}: the desired place
*/
function setPlace(place){
  //update choices
  userChoice[STATUS_STORY_ENUM.WHERE] = place;

  // add to the narrations
  narrationVoice[STATUS_STORY_ENUM.WHERE] = narrationVoice[STATUS_STORY_ENUM.WHERE].replace("...", place.toLowerCase());
  //if (place[place.length-1] != "o"){
  //  narrationVoice[STATUS_STORY_ENUM.WHERE] = narrationVoice[STATUS_STORY_ENUM.WHERE].replace("un bellissimo", "una bellissima");
  //}
  //narrationVoice[STATUS_STORY_ENUM.WHERE] += ",";
}


/**
* set meteo of the story
* @param meteo {string}: the desired meteo
*/
function setMeteo(meteo){
  //update choices
  userChoice[STATUS_STORY_ENUM.WEATHER] = meteo;

  // add to the narrations
  narrationVoice[STATUS_STORY_ENUM.WEATHER] = narrationVoice[STATUS_STORY_ENUM.WEATHER].replace("...", meteo.toLowerCase());
  narrationVoice[STATUS_STORY_ENUM.WEATHER] += ",";
}

/**
* set main character of the story
* @param character {string}: the desired main character
*/
function setMainCharacter(character){
  //update choices
  userChoice[STATUS_STORY_ENUM.CHARACTER] = character;

  // add to the narrations
  narrationVoice[STATUS_STORY_ENUM.CHARACTER] = narrationVoice[STATUS_STORY_ENUM.CHARACTER].replace("...", character.toLowerCase());
}


/**
* set name of main character
* @param name {string}: the desired name
*/
function setNameCharacter(name){

  nameCharacter = name;
  userChoice[STATUS_STORY_ENUM.NAME] = nameCharacter;

  // change the choices according the name
  situa1 = choices[STATUS_STORY_ENUM.SITUA1]
  for (let i=0; i<situa1.length; i++) {
    situa1[i] = situa1[i].replace("X", name);
  }

  //update choices
  choices[STATUS_STORY_ENUM.SITUA1] = situa1;

  // change the choices according the name
  LAST_SITUA = choices[STATUS_STORY_ENUM.LAST_SITUA]
  for (let i=0; i<LAST_SITUA.length; i++) {
    LAST_SITUA[i] = LAST_SITUA[i].replace("X", name);
  } // if the replace not found return the original sentence

  //update choices
  choices[STATUS_STORY_ENUM.LAST_SITUA] = LAST_SITUA;

  // add to the narrations
  narrationVoice[STATUS_STORY_ENUM.NAME] = narrationVoice[STATUS_STORY_ENUM.NAME].replace("...", nameCharacter.toLowerCase());
  narrationVoice[STATUS_STORY_ENUM.NAME] += ".";
};



/**
* set situa1 chosen
* @param situa1 {string}: correspond if the user selected ["X wants to play", "X is hungry", "X is thirsty"]
*/
function setSitua1(situa1){
  situa = choices[STATUS_STORY_ENUM.SITUA1]
  userChoice[STATUS_STORY_ENUM.SITUA1] = situa1
  switch(situa1){
    case situa[0]: {
        // add to the narrations
        narrationVoice[STATUS_STORY_ENUM.SITUA1] = userChoice[STATUS_STORY_ENUM.NAME] + " has a great desire to play with a beautiful "

        choices[STATUS_STORY_ENUM.OBJECT] = PLAY_LIST;
        narrationPC[STATUS_STORY_ENUM.OBJECT] = ["What does it want to play with?"];
      }
      break;
    case situa[1]: {
      // add to the narrations
      narrationVoice[STATUS_STORY_ENUM.SITUA1] = userChoice[STATUS_STORY_ENUM.NAME] + " is starving and it would like to eat a big "

      choices[STATUS_STORY_ENUM.OBJECT] = FOOD_LIST;
      narrationPC[STATUS_STORY_ENUM.OBJECT] = ["What does it want to eat?"];
      }
      break;
    case situa[2]: {
      // add to the narrations
      narrationVoice[STATUS_STORY_ENUM.SITUA1] = userChoice[STATUS_STORY_ENUM.NAME] + " has an incredible thirst! And it would like to drink from a very fresh "

      choices[STATUS_STORY_ENUM.OBJECT] = THIRST_LIST;
      narrationPC[STATUS_STORY_ENUM.OBJECT] = ["What does it want to drink from?"];
      }
      break;
    default: break;
  }
};

/**
* set object chosen
* @param object {string}: the selected object
*/
function setObject(obj){
  objectStory = obj;
  userChoice[STATUS_STORY_ENUM.OBJECT] = objectStory;

  // add to the narrations
  narrationVoice[STATUS_STORY_ENUM.OBJECT] = objectStory.toLowerCase();
  narrationVoice[STATUS_STORY_ENUM.OBJECT] += ".";

  // change the choices according the name
  LAST_SITUA = choices[STATUS_STORY_ENUM.LAST_SITUA]
  for (let i=0; i<LAST_SITUA.length; i++) {
    LAST_SITUA[i] = LAST_SITUA[i].replace("Y", obj);
  } // if the replace not found return the original sentence

  //update choices
  choices[STATUS_STORY_ENUM.LAST_SITUA] = LAST_SITUA;
};


/**
* set situa2 chosen
* @param situa2 {string}: correspond if the user selected ["Bird", "Bee", "Crab", "Duck"]
*/
function setSitua2(character){
  // character = choices[STATUS_STORY_ENUM.SITUA2][situa2]
  character = character.toLowerCase();
  userChoice[STATUS_STORY_ENUM.SITUA2] = character;

  // add to the narrations
  narrationVoice[STATUS_STORY_ENUM.SITUA2] = narrationVoice[STATUS_STORY_ENUM.SITUA2].replace("...", character.toLowerCase());
  if (character[character.length-1] != "o"){
    narrationVoice[STATUS_STORY_ENUM.SITUA2] = narrationVoice[STATUS_STORY_ENUM.SITUA2].replace("un piccolo", "una piccola");
  }
  narrationVoice[STATUS_STORY_ENUM.SITUA2] = narrationVoice[STATUS_STORY_ENUM.SITUA2] += ",";

  // change the narrations according the name
  narr_LAST_SITUA = narrationPC[STATUS_STORY_ENUM.LAST_SITUA]
  for (let i=0; i<narr_LAST_SITUA.length; i++) {
    narr_LAST_SITUA[i] = narr_LAST_SITUA[i].replace("character2", character);
  } // if the replace not found return the original sentence
  narrationVoice[STATUS_STORY_ENUM.LAST_SITUA] = narrationVoice[STATUS_STORY_ENUM.LAST_SITUA].replace("character2", character.toLowerCase());

  //update narrations
  narrationPC[STATUS_STORY_ENUM.LAST_SITUA] = narr_LAST_SITUA;

};


/**
* set situa2 chosen
* @param LAST_SITUA {string}: correspond if the user selected ["Steal the Y", "Share the Y", "Enjoy with X"]
*/
function setLAST_SITUA(LAST_SITUA){
  //update choices
  userChoice[STATUS_STORY_ENUM.LAST_SITUA] = LAST_SITUA;

  // add to the narrations
  narrationVoice[STATUS_STORY_ENUM.LAST_SITUA] = narrationVoice[STATUS_STORY_ENUM.LAST_SITUA].replace("...", LAST_SITUA.toLowerCase());
  narrationVoice[STATUS_STORY_ENUM.LAST_SITUA] += ".";
}


/**
* set the end of the story
* @param final {audio object}: children registration of the story end
*/
function setFinale(final){
  //update choices
  choices[STATUS_STORY_ENUM.RECORDING] = final;
}


/**
* set the next status to the story
* @param status {enum}: the current status
* @return return the new current status
*/
function setNextStatus(){
  switch(currentStatus){
    case STATUS_STORY_ENUM.WHERE: currentStatus=STATUS_STORY_ENUM.WEATHER; break;
    case STATUS_STORY_ENUM.WEATHER: currentStatus=STATUS_STORY_ENUM.CHARACTER; break;
    case STATUS_STORY_ENUM.CHARACTER: currentStatus=STATUS_STORY_ENUM.NAME; break;
    case STATUS_STORY_ENUM.NAME: currentStatus=STATUS_STORY_ENUM.SITUA1; break;
    case STATUS_STORY_ENUM.SITUA1: currentStatus=STATUS_STORY_ENUM.OBJECT; break;
    case STATUS_STORY_ENUM.OBJECT: currentStatus=STATUS_STORY_ENUM.SITUA2; break;
    case STATUS_STORY_ENUM.SITUA2: currentStatus=STATUS_STORY_ENUM.LAST_SITUA; break;
    case STATUS_STORY_ENUM.LAST_SITUA: currentStatus=STATUS_STORY_ENUM.RECORDING; break;
    case STATUS_STORY_ENUM.RECORDING: currentStatus=STATUS_STORY_ENUM.RECAP; break;
    default: currentStatus=""; break;
  }
  return  currentStatus
};

// ============================================================================
// GET FUNCTIONS
// ============================================================================

/**
* return the current status
* @return {enum} status
*/
function getCurrentStatus(){
  return currentStatus
};


/**
* get if the status after the param one has to be automatic
* @param status {enum}: the status
* @return {bool} return True if the story has to go automatic ahead from the specified status
*/
function isAutomaticStoryAhead(status){
  var goAhead = false
  switch(status){
    case STATUS_STORY_ENUM.WHERE: goAhead = true; break;
    case STATUS_STORY_ENUM.WEATHER: goAhead = true; break;
    case STATUS_STORY_ENUM.CHARACTER: goAhead = false; break;
    case STATUS_STORY_ENUM.NAME: goAhead = true; break;
    case STATUS_STORY_ENUM.SITUA1: goAhead = true; break;
    case STATUS_STORY_ENUM.OBJECT: goAhead = false; break;
    case STATUS_STORY_ENUM.SITUA2: goAhead = false; break;
    case STATUS_STORY_ENUM.LAST_SITUA: goAhead = false; break;
    case STATUS_STORY_ENUM.RECORDING: goAhead = false; break;
    default: goAhead = false; break;
  }
  return  goAhead
}

/**
* return the list for the narrations at the current status
* if array is empty means that at that point no choices must be provided
* @return {array} array of choices
*/
function getNarration(){
  return narrationPC[currentStatus]
};

/**
* return the list for the user choices at the current status
* if array is empty means that at that point no choices must be provided
* @return {array} array of choices
*/
function getChoices(){
  return choices[currentStatus]
};

/**
* return the string chosen by the user at the specific status of the story
* @return {string} the user choice related to the specified status
*/
function getUserChoice(status){
  return userChoice[status]
};



// first usage to test the narration... (based on status ??)
/**
for (i = 0; i < Object.keys(narrationVoice).length; i++) {
  speak(narrationVoice[i])
}
*/
