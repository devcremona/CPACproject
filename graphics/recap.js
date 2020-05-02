//Alert the user that a recap is going to start
function introduceRecap() {

  //Set transitions for the container and the drawings
  sketchContainer.style.transition = '1s all ease';

  Object.keys(drawings).forEach(function(key) {
     drawings[key].dwg.style.transition = '1s all ease';
  });


  setTimeout(function(){

    //Hide all compoents inside popup
    choicesDiv.style.display = 'none';
    btnStartRecording.style.display = 'none';
    btnStopRecording.style.display = 'none';

    //Hide the container
    sketchContainer.style.opacity = 0;

    //Hide all drawings
    Object.keys(drawings).forEach(function(key) {
       drawings[key].dwg.style.opacity = 0;
    });

    //Get narration text from story.js and set text
    narrationText.innerHTML = infoMessage.innerHTML = "Let's have a recap!";
    speechMessage = speak(narrationText.innerHTML);

    //Show the popup
    popup.classList.remove('hidden');
    popupContent.classList.remove('hidden');
    popupIsOpen = true;

  },500);

}


function doRecap() {

    switch (getCurrentStatus_Recap()) {
      case STATUS_RECAP_ENUM.WHERE:
      case STATUS_RECAP_ENUM.WEATHER:

        //Remove transitions to set the background immediately
        sketchContainer.style.transition = 'none';

        //First time default weather
        if(getCurrentStatus_Recap()==STATUS_RECAP_ENUM.WHERE){
          //Set the background to sunny 'default' when it is not visible
          sketchContainer.style.backgroundImage = 'url(../background/'+getUserChoice(STATUS_STORY_ENUM.WHERE).toLowerCase()+'_'+'sunny'+'.png)';
        }

        setTimeout(function(){

          sketchContainer.style.transition = '1s all ease'; //Restore transitions to show the opacity ease in

          //Second time default weather
          if(getCurrentStatus_Recap()==STATUS_RECAP_ENUM.WEATHER){
            sketchContainer.style.backgroundImage = 'url(../background/'+getUserChoice(STATUS_STORY_ENUM.WHERE).toLowerCase()+'_'+getUserChoice(STATUS_STORY_ENUM.WEATHER).toLowerCase()+'.png)';
          }

          //Show the background
          sketchContainer.style.opacity = 1; //It take 1s to reach 1
          speak(getNarrationRecap());

        },1000);
        break;

      default:

        if(!isAutomaticStoryAhead(getCurrentStatus_Recap()-1) && getCurrentStatus_Recap()<STATUS_RECAP_ENUM.RECORDING){
          drawings[getCurrentStatus_Recap()-1].dwg.style.opacity = 1;

          setTimeout(function(){
            //Animations for drawings
            $(drawings[getCurrentStatus_Recap()-1].dwg).animate({left:'100px',top:'100px'},1000); //Just example
          },1000); //Equal to the css transition of opacity


        }

        speak(getNarrationRecap());

        break;
    }


}


function afterSpeech() {

  if (getCurrentStatus_Recap() == STATUS_RECAP_ENUM.INIT) {
    //Hide the popup
    popup.classList.add('hidden');
    popupContent.classList.add('hidden');
    popupIsOpen = false;
  }


  if(getCurrentStatus_Recap() < STATUS_RECAP_ENUM.RECORDING){
    //Go on with the recap status
    setNextStatus_Recap();
    //Start/continue with the recap
    doRecap();
  } else {
    //Start recording -> goto afterRecordingEnd
    playRecord();

    //Remove transition ease from images
    Object.keys(drawings).forEach(function(key) {
       drawings[key].dwg.style.transition = 'none';
    });

    //Clone the 2 characters images
    app.appendChild(drawings[STATUS_STORY_ENUM.CHARACTER].dwg);
    app.appendChild(drawings[STATUS_STORY_ENUM.SITUA2].dwg);

    $(drawings[STATUS_STORY_ENUM.CHARACTER].dwg).animate({left:'0px',top:'0px'},5000);
    $(drawings[STATUS_STORY_ENUM.SITUA2].dwg).animate({left:'20px',top:'30px'},5000);

    //Change the background: make the background dark and hide sketch container
    $('#sketchContainer').animate({opacity:0},3000);
  }

}


function afterRecordingEnd(){
  setNextStatus_Story();
  openPopup();
}
