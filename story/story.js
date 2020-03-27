

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
var choicesUser = {
  [STATUS_STORY_ENUM.DOVE]: ["Lago", "Città", "Bosco", "Prato"],
  [STATUS_STORY_ENUM.METEO]: ["Di sole", "Nuvolosa", "Di pioggia", "Era notte"],
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
const GIOCO_LIST = ["Palla", "Acquilone", "Strumento musicale"];
const CIBO_LIST = ["Hamburger", "Torta", "Pizza", "Mela"];
const SETE_LIST = ["Bottiglia",  "Succo", "Ciotola", "Fontanella"];

//narrationPC; // sentences for the narration to visualize to the screen

// ============================================================================
// VARIABLES
// ============================================================================

var currentStatus = STATUS_STORY_ENUM.DOVE;
var nameCharacter = "X";
var objectStory = "Y"

// ============================================================================
// SET FUNCTIONS
// ============================================================================

/**
* set name of main character
* @param name {string}: the desired name
*/
function setNameCharacter(name){
  nameCharacter = name;

  // change the choices according the name
  situa1 = choicesUser[STATUS_STORY_ENUM.SITUA1]
  for (let i=0; i<situa1.length; i++) {
    situa1[i] = situa1[i].replace("X", name);
  }

  //update choicesUser
  choicesUser[STATUS_STORY_ENUM.SITUA1] = situa1;

  // change the choices according the name
  situa3 = choicesUser[STATUS_STORY_ENUM.SITUA3]
  for (let i=0; i<situa3.length; i++) {
    situa3[i] = situa3[i].replace("X", name);
  } // if the replace not found return the original sentence

  //update choicesUser
  choicesUser[STATUS_STORY_ENUM.SITUA3] = situa3;
};



/**
* set object chosen
* @param situa1 {int}: [0, 1, 2] correspond if the user selected ["X vuole giocare", "X ha fame", "X ha sete"]
*/
function setSitua1(situa1){
  switch(situa1){
    case 0: choicesUser[STATUS_STORY_ENUM.OGGETTO] = GIOCO_LIST; break;
    case 1: choicesUser[STATUS_STORY_ENUM.OGGETTO] = CIBO_LIST; break;
    case 2: choicesUser[STATUS_STORY_ENUM.OGGETTO] = SETE_LIST; break;
    default: status=""; break;
  }

  //update choicesUser
  choicesUser[STATUS_STORY_ENUM.OGGETTO] = situa3;
};



/**
* set object chosen
* @param object {string}: the selected object
*/
function setObject(obj){
  objectStory = obj;

  // change the choices according the name
  situa3 = choicesUser[STATUS_STORY_ENUM.SITUA3]
  for (let i=0; i<situa3.length; i++) {
    situa3[i] = situa3[i].replace("Y", obj);
  } // if the replace not found return the original sentence

  //update choicesUser
  choicesUser[STATUS_STORY_ENUM.SITUA3] = situa3;
};



/**
* set the next status to the story
* @param status {enum}: the current status
* @return {enum} the new current status (the next one)
*/
function setNextStatus(currentStatus){
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
  return status
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
* return the list for the user choices
* if array is empty means that at that point no choices must be provided
* @param status {enum}: the current status
* @return {array} array of choices
*/
function getChoices(status){
  return choicesUser[status]
};
