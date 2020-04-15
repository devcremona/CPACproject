

// ============================================================================
// CONSTANTS
// ============================================================================

// current status of the Story
const STATUS_STORY_ENUM = {
  DOVE: 0,
  METEO: 1,
  PROTAGONISTA: 2,
  NOME: 3,
  SITUA1: 4,
  OGGETTO: 5,
  SITUA2: 6,
  SITUA3: 7,
  FINALE: 8,
  RECAP: 9,
};

// choices for the users
var choices = {
  [STATUS_STORY_ENUM.DOVE]: ["Lago", "Città", "Bosco", "Collina", "Fattoria"],
  [STATUS_STORY_ENUM.METEO]: ["Di sole", "Nuvolosa", "Di pioggia", "Buia"],
  [STATUS_STORY_ENUM.PROTAGONISTA]: ["Cane", "Gatto"],
  [STATUS_STORY_ENUM.NOME]: [],
  [STATUS_STORY_ENUM.SITUA1]: ["X vuole giocare", "X ha fame", "X ha sete"],
  [STATUS_STORY_ENUM.OGGETTO]: ["initialize list"], // inizializzare in base alla scelta di cosa fare
  [STATUS_STORY_ENUM.SITUA2]: ["Uccellino", "Apetta", "Granchietto", "Anatroccolo"],
  [STATUS_STORY_ENUM.SITUA3]: ["Rubare Y", "Condividere Y", "Fare amicizia con X"],
  [STATUS_STORY_ENUM.FINALE]: [],
  [STATUS_STORY_ENUM.RECAP]: ["Bravissimo", "Fine", "Che bella storia", "Grazie"]
};

// list of possibilities
const GIOCO_LIST = ["Pallone", "Acquilone", "Strumento musicale"];
const CIBO_LIST = ["Bistecca", "Torta", "Pizza", "Mela"];
const SETE_LIST = ["Bottiglia", "Ciotola", "Fontanella"];

// sentences for the narration to visualize to the screen
// narrationPC
var narrationPC = {
  [STATUS_STORY_ENUM.DOVE]: ["C'era una volta... ma dove?"],
  [STATUS_STORY_ENUM.METEO]: ["Ed era una giornata..."],
  [STATUS_STORY_ENUM.PROTAGONISTA]: ["Ma chi è il protagonista della storia?"],
  [STATUS_STORY_ENUM.NOME]: ["Come si chiama?"],
  [STATUS_STORY_ENUM.SITUA1]: ["Adesso cosa succede?"],
  [STATUS_STORY_ENUM.OGGETTO]: ["initialize list"], // inizializzare in base alla scelta di cosa fare
  [STATUS_STORY_ENUM.SITUA2]: ["Ma ad un certo punto… Arriva un"],
  [STATUS_STORY_ENUM.SITUA3]: ["Ma personaggio2 vorrebbe..."],
  [STATUS_STORY_ENUM.FINALE]: ["Ora raccontami tu come finisce questa storia!"],
  [STATUS_STORY_ENUM.RECAP]: ["Bravissimo", "Fine", "Che bella storia", "Grazie"]
};

var userChoice = [];

// sentences for the narration to reproduce
var narrationVoice = {
  [STATUS_STORY_ENUM.DOVE]: "C'era una volta, in un bellissimo ...",
  [STATUS_STORY_ENUM.METEO]: "durante una giornata ...",
  [STATUS_STORY_ENUM.PROTAGONISTA]: "un simpatico ...",
  [STATUS_STORY_ENUM.NOME]: "di nome ...",
  [STATUS_STORY_ENUM.SITUA1]: "X ...",
  [STATUS_STORY_ENUM.OGGETTO]: "con ...",
  [STATUS_STORY_ENUM.SITUA2]: "Ad un certo punto arriva un piccolo ...",
  [STATUS_STORY_ENUM.SITUA3]: "ma personaggio2 vorrebbe tanto ...",
  [STATUS_STORY_ENUM.FINALE]: "All'improvviso però ...",
  [STATUS_STORY_ENUM.RECAP]: ""
};

// ============================================================================
// VARIABLES
// ============================================================================

var currentStatus = STATUS_STORY_ENUM.DOVE;
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
    case STATUS_STORY_ENUM.DOVE: setPlace(object); break;
    case STATUS_STORY_ENUM.METEO: setMeteo(object); break;
    case STATUS_STORY_ENUM.PROTAGONISTA: setMainCharacter(object); break;
    case STATUS_STORY_ENUM.NOME: setNameCharacter(object); break;
    case STATUS_STORY_ENUM.SITUA1: setSitua1(object); break;
    case STATUS_STORY_ENUM.OGGETTO: setObject(object); break;
    case STATUS_STORY_ENUM.SITUA2: setSitua2(object); break;
    case STATUS_STORY_ENUM.SITUA3: setSitua3(object); break;
    case STATUS_STORY_ENUM.FINALE: setFinale(object); break;
    default: ret = False; break;
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
  userChoice[STATUS_STORY_ENUM.DOVE] = place;

  // add to the narrations
  narrationVoice[STATUS_STORY_ENUM.DOVE] = narrationVoice[STATUS_STORY_ENUM.DOVE].replace("...", place.toLowerCase());
  if (place[place.length-1] != "o"){
    narrationVoice[STATUS_STORY_ENUM.DOVE] = narrationVoice[STATUS_STORY_ENUM.DOVE].replace("un bellissimo", "una bellissima");
  }
  narrationVoice[STATUS_STORY_ENUM.DOVE] += ",";
}


/**
* set meteo of the story
* @param meteo {string}: the desired meteo
*/
function setMeteo(meteo){
  //update choices
  userChoice[STATUS_STORY_ENUM.METEO] = meteo;

  // add to the narrations
  narrationVoice[STATUS_STORY_ENUM.METEO] = narrationVoice[STATUS_STORY_ENUM.METEO].replace("...", meteo.toLowerCase());
  narrationVoice[STATUS_STORY_ENUM.METEO] += ",";
}

/**
* set main character of the story
* @param character {string}: the desired main character
*/
function setMainCharacter(character){
  //update choices
  userChoice[STATUS_STORY_ENUM.PROTAGONISTA] = character;

  // add to the narrations
  narrationVoice[STATUS_STORY_ENUM.PROTAGONISTA] = narrationVoice[STATUS_STORY_ENUM.PROTAGONISTA].replace("...", character.toLowerCase());
}


/**
* set name of main character
* @param name {string}: the desired name
*/
function setNameCharacter(name){

  nameCharacter = name;
  userChoice[STATUS_STORY_ENUM.NOME] = nameCharacter;

  // change the choices according the name
  situa1 = choices[STATUS_STORY_ENUM.SITUA1]
  for (let i=0; i<situa1.length; i++) {
    situa1[i] = situa1[i].replace("X", name);
  }

  //update choices
  choices[STATUS_STORY_ENUM.SITUA1] = situa1;

  // change the choices according the name
  situa3 = choices[STATUS_STORY_ENUM.SITUA3]
  for (let i=0; i<situa3.length; i++) {
    situa3[i] = situa3[i].replace("X", name);
  } // if the replace not found return the original sentence

  //update choices
  choices[STATUS_STORY_ENUM.SITUA3] = situa3;

  // add to the narrations
  narrationVoice[STATUS_STORY_ENUM.NOME] = narrationVoice[STATUS_STORY_ENUM.NOME].replace("...", nameCharacter.toLowerCase());
  narrationVoice[STATUS_STORY_ENUM.NOME] += ".";
};



//@param situa1 {int}: [0, 1, 2] correspond if the user selected ["X vuole giocare", "X ha fame", "X ha sete"]

/**
* set situa1 chosen
* @param situa1 {string}: correspond if the user selected ["X vuole giocare", "X ha fame", "X ha sete"]
*/
function setSitua1(situa1){
  situa = choices[STATUS_STORY_ENUM.SITUA1]
  userChoice[STATUS_STORY_ENUM.SITUA1] = situa1
  switch(situa1){
    case situa[0]: {
        // add to the narrations
        narrationVoice[STATUS_STORY_ENUM.SITUA1] = userChoice[STATUS_STORY_ENUM.NOME] + " ha tanta voglia di giocare con un bellissimo "

        choices[STATUS_STORY_ENUM.OGGETTO] = GIOCO_LIST;
        narrationPC[STATUS_STORY_ENUM.OGGETTO] = ["Con che cosa vuole giocare?"];
      }
      break;
    case situa[1]: {
      // add to the narrations
      narrationVoice[STATUS_STORY_ENUM.SITUA1] = userChoice[STATUS_STORY_ENUM.NOME] + " non ci vede più dalla fame e vorrebbe mangiare una grandissima "

      choices[STATUS_STORY_ENUM.OGGETTO] = CIBO_LIST;
      narrationPC[STATUS_STORY_ENUM.OGGETTO] = ["Cosa vuole mangiare?"];
      }
      break;
    case situa[2]: {
      // add to the narrations
      narrationVoice[STATUS_STORY_ENUM.SITUA1] = userChoice[STATUS_STORY_ENUM.NOME] + " ha una sete incredibile! E vorrebbe bere da una freschissima "

      choices[STATUS_STORY_ENUM.OGGETTO] = SETE_LIST;
      narrationPC[STATUS_STORY_ENUM.OGGETTO] = ["Cosa vuole bere?"];
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
  userChoice[STATUS_STORY_ENUM.OGGETTO] = objectStory;

  // add to the narrations
  narrationVoice[STATUS_STORY_ENUM.OGGETTO] = objectStory.toLowerCase();
  narrationVoice[STATUS_STORY_ENUM.OGGETTO] += ".";

  // change the choices according the name
  situa3 = choices[STATUS_STORY_ENUM.SITUA3]
  for (let i=0; i<situa3.length; i++) {
    situa3[i] = situa3[i].replace("Y", obj);
  } // if the replace not found return the original sentence

  //update choices
  choices[STATUS_STORY_ENUM.SITUA3] = situa3;
};


/**
* set situa2 chosen
* @param situa2 {string}: correspond if the user selected ["Uccellino", "Apetta", "Granchietto", "Anatroccolo"]
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
  narr_situa3 = narrationPC[STATUS_STORY_ENUM.SITUA3]
  for (let i=0; i<narr_situa3.length; i++) {
    narr_situa3[i] = narr_situa3[i].replace("personaggio2", character);
  } // if the replace not found return the original sentence
  narrationVoice[STATUS_STORY_ENUM.SITUA3] = narrationVoice[STATUS_STORY_ENUM.SITUA3].replace("personaggio2", character.toLowerCase());

  //update narrations
  narrationPC[STATUS_STORY_ENUM.SITUA3] = narr_situa3;

};


/**
* set situa2 chosen
* @param situa3 {string}: correspond if the user selected ["Rubare", "Condividere", "Fare amicizia"]
*/
function setSitua3(situa3){
  //update choices
  userChoice[STATUS_STORY_ENUM.SITUA3] = situa3;

  // add to the narrations
  narrationVoice[STATUS_STORY_ENUM.SITUA3] = narrationVoice[STATUS_STORY_ENUM.SITUA3].replace("...", situa3.toLowerCase());
  narrationVoice[STATUS_STORY_ENUM.SITUA3] += ".";
}


/**
* set the end of the story
* @param finale {audio object}: children registration of the story end
*/
function setFinale(finale){
  //update choices
  choices[STATUS_STORY_ENUM.FINALE] = finale;
}




/**
* set the next status to the story
* @param status {enum}: the current status
* @return {enum} the new current status (the next one)
*/
function setNextStatus(){
  var status
  switch(currentStatus){
    case STATUS_STORY_ENUM.DOVE: status=STATUS_STORY_ENUM.METEO; break;
    case STATUS_STORY_ENUM.METEO: status=STATUS_STORY_ENUM.PROTAGONISTA; break;
    case STATUS_STORY_ENUM.PROTAGONISTA: status=STATUS_STORY_ENUM.NOME; break;
    case STATUS_STORY_ENUM.NOME: status=STATUS_STORY_ENUM.SITUA1; break;
    case STATUS_STORY_ENUM.SITUA1: status=STATUS_STORY_ENUM.OGGETTO; break;
    case STATUS_STORY_ENUM.OGGETTO: status=STATUS_STORY_ENUM.SITUA2; break;
    case STATUS_STORY_ENUM.SITUA2: status=STATUS_STORY_ENUM.SITUA3; break;
    case STATUS_STORY_ENUM.SITUA3: status=STATUS_STORY_ENUM.FINALE; break;
    case STATUS_STORY_ENUM.FINALE: status=STATUS_STORY_ENUM.RECAP; break;
    default: status=""; break;
  }
  currentStatus = status
  return currentStatus
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
