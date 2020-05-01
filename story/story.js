

// ============================================================================
// CONSTANTS
// ============================================================================

// current status of the Story
const STATUS_STORY_ENUM = {
  INIT: 0,
  WHERE: 1,
  WEATHER: 2,
  CHARACTER: 3,
  NAME: 4,
  SITUA1: 5,
  OBJECT: 6,
  SITUA2: 7,
  LAST_SITUA: 8,
  RECORDING: 9,
  RECAP: 10,
  END: 11
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
  [STATUS_STORY_ENUM.LAST_SITUA]: ["Steal the Y", "Share the Y", "Enjoy it with X"],
  [STATUS_STORY_ENUM.RECORDING]: [],
  [STATUS_STORY_ENUM.END]: ["The end", "Very good", "What a beautiful story", "Thank you"]
};

// list of possibilities
const PLAY_LIST = ["Ball", "Boomerang", "Guitar"];
const FOOD_LIST = ["Hamburger", "Cake", "Pizza", "Apple"];
const THIRST_LIST = ["Bottle", "Cup"];

// sentences for the narration to visualize to the screen
// narrationPC
var narrationPC = {
  [STATUS_STORY_ENUM.WHERE]: ["Once upon a time... but where?"],
  [STATUS_STORY_ENUM.WEATHER]: ["and it was a day..."],
  [STATUS_STORY_ENUM.CHARACTER]: ["But who is the main character of the story?"],
  [STATUS_STORY_ENUM.NAME]: ["What's its name?"],
  [STATUS_STORY_ENUM.SITUA1]: ["Now what happens?"],
  [STATUS_STORY_ENUM.OBJECT]: ["initialize list"], // inizializzare in base alla scelta di cosa fare
  [STATUS_STORY_ENUM.SITUA2]: ["But at some point ... There comes a"],
  [STATUS_STORY_ENUM.LAST_SITUA]: ["But character2 would like..."],
  [STATUS_STORY_ENUM.RECORDING]: ["Now tell me how this story ends!"],
  [STATUS_STORY_ENUM.END]: ["The end", "Very good", "What a beautiful story", "Thank you"]
};

var userChoice = [];

// status for the recap phase
const STATUS_RECAP_ENUM = {
  INIT: 0,
  WHERE: 1,
  WEATHER: 2,
  CHARACTER: 3,
  NAME: 4,
  SITUA1: 5,
  OBJECT: 6,
  SITUA2: 7,
  LAST_SITUA: 8,
  RECORDING: 9,
  END: 10,
};


// sentences for the narration to reproduce
var narrationVoice = {
  [STATUS_RECAP_ENUM.WHERE]: "Once upon a time, in a beautilul ...",
  [STATUS_RECAP_ENUM.WEATHER]: "on a ... day",
  [STATUS_RECAP_ENUM.CHARACTER]: "there was a very nice ...",
  [STATUS_RECAP_ENUM.NAME]: "Its name was ...",
  [STATUS_RECAP_ENUM.SITUA1]: "X ...",
  [STATUS_RECAP_ENUM.OBJECT]: "with ...",
  [STATUS_RECAP_ENUM.SITUA2]: "At some point a small ... arrives",
  [STATUS_RECAP_ENUM.LAST_SITUA]: "but the character2 would like so much to ...",
  [STATUS_RECAP_ENUM.RECORDING]: "Suddenly ...",
  [STATUS_RECAP_ENUM.END]: "" // bravissimo
};

// ============================================================================
// VARIABLES
// ============================================================================

var current_story_status = STATUS_STORY_ENUM.WHERE;
var current_recap_status = STATUS_RECAP_ENUM.INIT;
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
    case STATUS_STORY_ENUM.LAST_SITUA: setLastSitua(object); break;
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
  //narrationVoice[STATUS_RECAP_ENUM.WHERE] = narrationVoice[STATUS_RECAP_ENUM.WHERE].replace("...", place.toLowerCase());
  //if (place[place.length-1] != "o"){
  //  narrationVoice[STATUS_RECAP_ENUM.WHERE] = narrationVoice[STATUS_RECAP_ENUM.WHERE].replace("un bellissimo", "una bellissima");
  //}
  //narrationVoice[STATUS_RECAP_ENUM.WHERE] += ",";
}


/**
* set meteo of the story
* @param meteo {string}: the desired meteo
*/
function setMeteo(meteo){
  //update choices
  userChoice[STATUS_STORY_ENUM.WEATHER] = meteo;

  // add to the narrations
  //narrationVoice[STATUS_STORY_ENUM.WEATHER] = narrationVoice[STATUS_STORY_ENUM.WEATHER].replace("...", meteo.toLowerCase());
  //narrationVoice[STATUS_STORY_ENUM.WEATHER] += ",";
}

/**
* set main character of the story
* @param character {string}: the desired main character
*/
function setMainCharacter(character){
  //update choices
  userChoice[STATUS_STORY_ENUM.CHARACTER] = character;

  // add to the narrations
  //narrationVoice[STATUS_RECAP_ENUM.CHARACTER] = narrationVoice[STATUS_RECAP_ENUM.CHARACTER].replace("...", character.toLowerCase());
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
  //narrationVoice[STATUS_RECAP_ENUM.NAME] = narrationVoice[STATUS_RECAP_ENUM.NAME].replace("...", nameCharacter.toLowerCase());
  //narrationVoice[STATUS_RECAP_ENUM.NAME] += ".";
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
        //narrationVoice[STATUS_RECAP_ENUM.SITUA1] = userChoice[STATUS_STORY_ENUM.NAME] + " has a great desire to play with a beautiful "

        choices[STATUS_STORY_ENUM.OBJECT] = PLAY_LIST;
        narrationPC[STATUS_STORY_ENUM.OBJECT] = ["What does it want to play with?"];
      }
      break;
    case situa[1]: {
      // add to the narrations
      //narrationVoice[STATUS_RECAP_ENUM.SITUA1] = userChoice[STATUS_STORY_ENUM.NAME] + " is starving and it would like to eat a big "

      choices[STATUS_STORY_ENUM.OBJECT] = FOOD_LIST;
      narrationPC[STATUS_STORY_ENUM.OBJECT] = ["What does it want to eat?"];
      }
      break;
    case situa[2]: {
      // add to the narrations
      //narrationVoice[STATUS_RECAP_ENUM.SITUA1] = userChoice[STATUS_STORY_ENUM.NAME] + " has an incredible thirst! And it would like to drink from a very fresh "

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
  //narrationVoice[STATUS_RECAP_ENUM.OBJECT] = objectStory.toLowerCase();
  //narrationVoice[STATUS_RECAP_ENUM.OBJECT] += ".";

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
  //narrationVoice[STATUS_RECAP_ENUM.SITUA2] = narrationVoice[STATUS_STORY_ENUM.SITUA2].replace("...", character.toLowerCase());
  //narrationVoice[STATUS_RECAP_ENUM.SITUA2] = narrationVoice[STATUS_STORY_ENUM.SITUA2] += ",";

  // change the narrations according the name
  narr_LAST_SITUA = narrationPC[STATUS_STORY_ENUM.LAST_SITUA]
  for (let i=0; i<narr_LAST_SITUA.length; i++) {
    narr_LAST_SITUA[i] = narr_LAST_SITUA[i].replace("character2", character);
  } // if the replace not found return the original sentence
  //narrationVoice[STATUS_RECAP_ENUM.LAST_SITUA] = narrationVoice[STATUS_RECAP_ENUM.LAST_SITUA].replace("character2", character.toLowerCase());

  //update narrations
  narrationPC[STATUS_STORY_ENUM.LAST_SITUA] = narr_LAST_SITUA;

};


/**
* set situa2 chosen
* @param situa {string}: correspond if the user selected ["Steal the Y", "Share the Y", "Enjoy with X"]
*/
function setLastSitua(situa){
  //update choices
  userChoice[STATUS_STORY_ENUM.LAST_SITUA] = situa;

  // add to the narrations
  //narrationVoice[STATUS_RECAP_ENUM.LAST_SITUA] = narrationVoice[STATUS_RECAP_ENUM.LAST_SITUA].replace("...", situa.toLowerCase());
  //narrationVoice[STATUS_RECAP_ENUM.LAST_SITUA] += ".";
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
function setNextStatus_Story(){
  switch(current_story_status){
    case STATUS_STORY_ENUM.WHERE: current_story_status=STATUS_STORY_ENUM.WEATHER; break;
    case STATUS_STORY_ENUM.WEATHER: current_story_status=STATUS_STORY_ENUM.CHARACTER; break;
    case STATUS_STORY_ENUM.CHARACTER: current_story_status=STATUS_STORY_ENUM.NAME; break;
    case STATUS_STORY_ENUM.NAME: current_story_status=STATUS_STORY_ENUM.SITUA1; break;
    case STATUS_STORY_ENUM.SITUA1: current_story_status=STATUS_STORY_ENUM.OBJECT; break;
    case STATUS_STORY_ENUM.OBJECT: current_story_status=STATUS_STORY_ENUM.SITUA2; break;
    case STATUS_STORY_ENUM.SITUA2: current_story_status=STATUS_STORY_ENUM.LAST_SITUA; break;
    case STATUS_STORY_ENUM.LAST_SITUA: {current_story_status=STATUS_STORY_ENUM.RECORDING; setNarrationVoice();} break;
    case STATUS_STORY_ENUM.RECORDING: current_story_status=STATUS_STORY_ENUM.RECAP; break;
    case STATUS_STORY_ENUM.RECAP: current_story_status=STATUS_STORY_ENUM.END; break;
    default: current_story_status=""; break;
  }
  return  current_story_status
};

/**
* set the next status to the recap
* @param status {enum}: the current status of recap
* @return return the new current status recap
*/
function setNextStatus_Recap(){
  switch(current_recap_status){
    case STATUS_RECAP_ENUM.INIT: current_recap_status=STATUS_RECAP_ENUM.WHERE; break;
    case STATUS_RECAP_ENUM.WHERE: current_recap_status=STATUS_RECAP_ENUM.WEATHER; break;
    case STATUS_RECAP_ENUM.WEATHER: current_recap_status=STATUS_RECAP_ENUM.CHARACTER; break;
    case STATUS_RECAP_ENUM.CHARACTER: current_recap_status=STATUS_RECAP_ENUM.NAME; break;
    case STATUS_RECAP_ENUM.NAME: current_recap_status=STATUS_RECAP_ENUM.SITUA1; break;
    case STATUS_RECAP_ENUM.SITUA1: current_recap_status=STATUS_RECAP_ENUM.OBJECT; break;
    case STATUS_RECAP_ENUM.OBJECT: current_recap_status=STATUS_RECAP_ENUM.SITUA2; break;
    case STATUS_RECAP_ENUM.SITUA2: current_recap_status=STATUS_RECAP_ENUM.LAST_SITUA; break;
    case STATUS_RECAP_ENUM.LAST_SITUA: current_recap_status=STATUS_RECAP_ENUM.RECORDING; break;
    case STATUS_RECAP_ENUM.RECORDING: current_recap_status=STATUS_RECAP_ENUM.END; break;
    default: current_recap_status=""; break;
  }
  return  current_recap_status
};

/**
* set the narrationVoice with all the user choices made
*/
function setNarrationVoice(){
  console.log("setNarrationVoice");
  // where to narration
  narrationVoice[STATUS_RECAP_ENUM.WHERE] = narrationVoice[STATUS_RECAP_ENUM.WHERE].replace("...", userChoice[STATUS_STORY_ENUM.WHERE].toLowerCase());

  // weather to the narrations
  narrationVoice[STATUS_STORY_ENUM.WEATHER] = narrationVoice[STATUS_STORY_ENUM.WEATHER].replace("...", userChoice[STATUS_STORY_ENUM.WEATHER].toLowerCase());
  narrationVoice[STATUS_STORY_ENUM.WEATHER] += ",";

  // character to the narrations
  narrationVoice[STATUS_RECAP_ENUM.CHARACTER] = narrationVoice[STATUS_RECAP_ENUM.CHARACTER].replace("...", userChoice[STATUS_STORY_ENUM.CHARACTER].toLowerCase());

  // name to the narrations
  narrationVoice[STATUS_RECAP_ENUM.NAME] = narrationVoice[STATUS_RECAP_ENUM.NAME].replace("...", userChoice[STATUS_STORY_ENUM.NAME].toLowerCase());
  narrationVoice[STATUS_RECAP_ENUM.NAME] += ".";

  // add to the narrations situa1 (play/eat/drink)
  switch(userChoice[STATUS_STORY_ENUM.SITUA1]){
    case choices[STATUS_STORY_ENUM.SITUA1][0]:
      narrationVoice[STATUS_RECAP_ENUM.SITUA1] = userChoice[STATUS_STORY_ENUM.NAME] + " has a great desire to play with a beautiful ";
      break;
    case choices[STATUS_STORY_ENUM.SITUA1][1]:
      narrationVoice[STATUS_RECAP_ENUM.SITUA1] = userChoice[STATUS_STORY_ENUM.NAME] + " is starving and it would like to eat a big ";
      break;
    case choices[STATUS_STORY_ENUM.SITUA1][2]:
      narrationVoice[STATUS_RECAP_ENUM.SITUA1] = userChoice[STATUS_STORY_ENUM.NAME] + " has an incredible thirst! And it would like to drink from a very fresh ";
      break;
    default: break;
  }

  // object to the narrations
  narrationVoice[STATUS_RECAP_ENUM.OBJECT] = userChoice[STATUS_STORY_ENUM.OBJECT].toLowerCase();
  narrationVoice[STATUS_RECAP_ENUM.OBJECT] += ".";

  // situa2 to the narrations (Bird/Bee/Crab/Duck)
  narrationVoice[STATUS_RECAP_ENUM.SITUA2] = narrationVoice[STATUS_STORY_ENUM.SITUA2].replace("...", userChoice[STATUS_STORY_ENUM.SITUA2].toLowerCase());
  narrationVoice[STATUS_RECAP_ENUM.SITUA2] = narrationVoice[STATUS_STORY_ENUM.SITUA2] += ",";

  // change character2 in narration
  narrationVoice[STATUS_RECAP_ENUM.LAST_SITUA] = narrationVoice[STATUS_RECAP_ENUM.LAST_SITUA].replace("character2", userChoice[STATUS_STORY_ENUM.SITUA2].toLowerCase());

  // last_situa to the narrations (steel/shear/enjoy)
  narrationVoice[STATUS_RECAP_ENUM.LAST_SITUA] = narrationVoice[STATUS_RECAP_ENUM.LAST_SITUA].replace("...", userChoice[STATUS_STORY_ENUM.LAST_SITUA].toLowerCase());
  narrationVoice[STATUS_RECAP_ENUM.LAST_SITUA] += ".";
}

// ============================================================================
// GET FUNCTIONS
// ============================================================================

/**
* return the current status of the story
* @return {enum} status
*/
function getCurrentStatus_Story(){
  return current_story_status
};

/**
* return the current status of the recap
* @return {enum} status
*/
function getCurrentStatus_Recap(){
  return current_recap_status
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
    case STATUS_STORY_ENUM.LAST_SITUA: goAhead = true; break;
    case STATUS_STORY_ENUM.RECORDING: goAhead = false; break;
    case STATUS_STORY_ENUM.RECAP: goAhead = false; break;
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
  return narrationPC[current_story_status]
};

/**
* return the list for the user choices at the current status
* if array is empty means that at that point no choices must be provided
* @return {array} array of choices
*/
function getChoices(){
  return choices[current_story_status]
};

/**
* return the string chosen by the user at the specific status of the story
* @return {string} the user choice related to the specified status
*/
function getUserChoice(status){
  return userChoice[status]
};


/**
* return the string of the narration voice for the recap
* @return {string} string of narration
*/
function getNarrationRecap(){
  return narrationVoice[current_recap_status]
};



// first usage to test the narration... (based on status ??)
/**
for (i = 0; i < Object.keys(narrationVoice).length; i++) {
  speak(narrationVoice[i])
}
*/
