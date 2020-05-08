//Alert the user that a recap is going to start
function introduceRecap() {
  /*//Disable question mark button
  btnHelp.firstChild.classList.add('inactive');
  btnHelp.removeEventListener('click',btnHelpCallback);*/

  //Set transitions for the container and the drawings
  sketchContainer.style.transition = '1s all ease';

  Object.keys(drawings).forEach(function(key) {
     drawings[key].dwg.style.transition = '0.1s all ease';
  });


  setTimeout(function(){

    //Hide all compoents inside popup
    choicesDiv.style.display = 'none';
    btnStartRecording.style.display = 'none';
    btnStopRecording.style.display = 'none';

    //Hide the container
    sketchContainer.style.opacity = 0;

    //Hide tools
    drawingTools.style.opacity = 0;
    navigationTools.style.opacity = 0;

    //Hide all drawings
    Object.keys(drawings).forEach(function(key) {
       drawings[key].dwg.style.opacity = 0;
    });

    Object.keys(drawings).forEach(function(key) {
      drawings[key].dwg.style.transition = 'none';
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
          sketchContainer.style.backgroundImage = 'url('+backgroundImages[getUserChoice(STATUS_STORY_ENUM.WHERE).toLowerCase()+'_'+'sunny'].src+')';

          //Show pause button
          btnPause.style.opacity = 1;
        }

        setTimeout(function(){

          sketchContainer.style.transition = '1s all ease'; //Restore transitions to show the opacity ease in

          //Second time default weather
          if(getCurrentStatus_Recap()==STATUS_RECAP_ENUM.WEATHER){
            sketchContainer.style.backgroundImage = 'url('+backgroundImages[getUserChoice(STATUS_STORY_ENUM.WHERE).toLowerCase()+'_'+getUserChoice(STATUS_STORY_ENUM.WEATHER).toLowerCase().replace(/\s/g, '_')].src+')';
          }

          //Show the background
          sketchContainer.style.opacity = 1; //It take 1s to reach 1

          infoMessage.innerHTML = getNarrationRecap();
          speak(getNarrationRecap());

        },1000);
        break;

      default:

        if(!isAutomaticStoryAhead(getCurrentStatus_Recap()) && getCurrentStatus_Recap()<STATUS_RECAP_ENUM.RECORDING){
          $(drawings[getCurrentStatus_Recap()].dwg).animate({opacity: 1}, 1000);
          drawings[getCurrentStatus_Recap()].recapAnimation();
        }

        infoMessage.innerHTML = getNarrationRecap();
        speak(getNarrationRecap());

        break;
    }
}

function afterAnimation() {
  animationIsFinished = false;

  //Go on with the recap status
  setNextStatus_Recap();
  //Start/continue with the recap
  doRecap();
}

function afterSpeech() {

  if (getCurrentStatus_Recap() == STATUS_RECAP_ENUM.INIT) {
    //Hide the popup
    popup.classList.add('hidden');
    popupContent.classList.add('hidden');
    popupIsOpen = false;

    //Go on with the recap status
    setNextStatus_Recap();
    //Start/continue with the recap
    doRecap();
  } else if(getCurrentStatus_Recap() < STATUS_RECAP_ENUM.RECORDING){
    if(!isAutomaticStoryAhead(getCurrentStatus_Recap())){ //If we have to manage a drawing, we wait for the end of the animation
      waitingInterval = setInterval(function(){ //Wait for the callback of the end of the animation
                          if(animationIsFinished){
                            afterAnimation();
                            clearInterval(waitingInterval);
                          }
                        },50);
      //setTimeout(function(){animationIsFinished = true;},5000);
    } else {
      //Go on with the recap status
      setNextStatus_Recap();
      //Start/continue with the recap
      doRecap();
    }
  } else {
    //Start recording -> goto afterRecordingEnd
    recDuration = playRecord();

    //Remove transition ease from images
    Object.keys(drawings).forEach(function(key) {
       drawings[key].dwg.style.transition = 'none';
    });

    //Clone the 2 characters images and spawn them
    drawings[STATUS_STORY_ENUM.CHARACTER].dwg.style.opacity = 0;
    drawings[STATUS_STORY_ENUM.SECOND_CHARACTER].dwg.style.opacity = 0;
    app.appendChild(drawings[STATUS_STORY_ENUM.CHARACTER].dwg);
    app.appendChild(drawings[STATUS_STORY_ENUM.SECOND_CHARACTER].dwg);
    $(drawings[STATUS_STORY_ENUM.CHARACTER].dwg).animate({opacity: 1}, 1000);
    $(drawings[STATUS_STORY_ENUM.SECOND_CHARACTER].dwg).animate({opacity: 1}, 1000);

    // move the characters in the two half centers
    drawings[STATUS_STORY_ENUM.CHARACTER].finalAnimation(recDuration*1000, 1);
    drawings[STATUS_STORY_ENUM.SECOND_CHARACTER].finalAnimation(recDuration*1000, 2);

    //Change the background: make the background dark and hide sketch container
    $('#sketchContainer').animate({opacity:0},recDuration);

    //Close the curtain with a duration equal to the recording duration
    splashCurtain.style.transition = recDuration+'s transform';
    splashCurtain.style.transform = 'scaleX(1)';

    //Hide the help button
    btnPause.style.zIndex = 0;

    //Increase the z-index for the popup to show it above the curtain
    popup.style.zIndex = 5;
  }
}


function afterRecordingEnd(){ //End of the recap goto the end of the story
  setNextStatus_Story();
  setTimeout(openPopup, 2000);
}
