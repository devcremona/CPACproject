

// variables

// current status of the Story
const STATUS_STORY = {
  first: 0,
  second: 1
};
var currentStatus = STATUS_STORY.first;

//narrationPC; // sentences for the narration to visualize to the screen

// choices for the users

var choicesUser = {
  [STATUS_STORY.first]: [1,2,3,4],
  [STATUS_STORY.second]: [6,7,8]
};



/**
* return the current status
* @return {enum} status
*/
function getCurrentStatus(){
  return currentStatus
};
