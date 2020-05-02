function openPopup() {

  //Deactivate the mouse listeners for the p5 sketch
  sketchContext.mousePressed = undefined;
  sketchContext.mouseDragged = undefined;
  sketchContext.mouseReleased = undefined;

  //Deactivate drawing buttons
  btnPencil.classList.remove('active');
  colorsManager.classList.remove('active');
  btnEraser.classList.remove('active');
  btnColors.style.backgroundColor = 'rgba(0,0,0,0)';


  //Set confirm popup button inactive
  btnConfirmPopup.classList.add('inactive');
  btnConfirmPopup.removeEventListener('click',confirmPopupCallback);


  //Reset previous choices
  $( '#choicesDiv' ).children().remove();


  //Get narration text from story.js and set text
  infoMessage.innerHTML = getNarration()[0];
  if(getCurrentStatus_Story()<STATUS_STORY_ENUM.END){
    narrationText.innerHTML = getNarration()[0];
    speak(narrationText.innerHTML);
  } else {
    //Select a random ending text from the list of choices
    narrationText.innerHTML = getChoices()[Math.floor(Math.random() * (getChoices().length-1 - 0 + 1)) + 0];
    speak(narrationText.innerHTML);
  }

  //Get choices list from story.js and populate the list
  currentChoices = getChoices();

  /*choicesList.innerHTML = choices.map(listElement => `<option>${listElement}</option>`).join('');
  choicesList.selectedIndex = -1; //Set the dropdown menu to the initial wallpaper  */

  //Generate dynamically buttons for the choices
  if(getCurrentStatus_Story()<STATUS_STORY_ENUM.END){
    for (var i = 0; i < currentChoices.length; i++){
        if(!isAutomaticStoryAhead(getCurrentStatus_Story())){ //If I have to draw something, place images in the choice buttons
          img = '<img width="60vw" src="../buttonsImg/'+currentChoices[i].toLowerCase()+'.png" style="margin:auto">'
          $( '#choicesDiv' ).append( '<div class="choiceButton" id="choice'+i+'">'+img+currentChoices[i]+'</div>' );
        }
        else {
          $( '#choicesDiv' ).append( '<div class="choiceButton" id="choice'+i+'">'+currentChoices[i]+'</div>' );
        }
        speak(currentChoices[i]);
    }
  }


  //Show the popup
  popup.classList.remove('hidden');
  popupContent.classList.remove('hidden');
  popupIsOpen = true;

  //Get the divs of the choices in an array
  choicesDivs = $( '#choicesDiv' ).children().toArray();

  switch(getCurrentStatus_Story()){
    case STATUS_STORY_ENUM.WHERE:
    case STATUS_STORY_ENUM.WEATHER:
    case STATUS_STORY_ENUM.CHARACTER:
      choicesDivs.forEach(
        function(choiceDiv,index){
          choiceDiv.addEventListener('click', function() {
            //Set active just the clicked choice
            choicesDivs.forEach(function(element){ element.classList.remove('active') });
            choiceDiv.classList.add('active');

            //Reactivate confirm button
            btnConfirmPopup.classList.remove('inactive');
            btnConfirmPopup.addEventListener('click',confirmPopupCallback); //Reactivate the listener for the confirm button

            if(getCurrentStatus_Story()==STATUS_STORY_ENUM.WHERE)
              setUserChoice(STATUS_STORY_ENUM.WEATHER,choices[STATUS_STORY_ENUM.WEATHER][0]); //The first time is set to "sun", second time is overwritten by next

            //First time set WHERE, second time set weather, third time set main character
            if(!isAutomaticStoryAhead(getCurrentStatus_Story())){
              setUserChoice(getCurrentStatus_Story(),choiceDiv.innerHTML.split('>')[1]);
            } else {
              setUserChoice(getCurrentStatus_Story(),choiceDiv.innerHTML);
            }


            sketchContainer.style.backgroundImage = 'url(../background/'+getUserChoice(STATUS_STORY_ENUM.WHERE).toLowerCase()+'_'+getUserChoice(STATUS_STORY_ENUM.WEATHER).toLowerCase().replace(/\s/g, '_')+'.png)';
          });
        }
      );
      break;

    case STATUS_STORY_ENUM.NAME:
      choicesDiv.style.display = 'none';
      characterNameField.style.display = 'inline';
      characterNameField.addEventListener('input', function(){
        //Reactivate confirm button
        btnConfirmPopup.classList.remove('inactive');
        btnConfirmPopup.addEventListener('click',confirmPopupCallback); //Reactivate the listener for the confirm button
      });
      break;

    default:
      characterNameField.style.display = 'none';
      choicesDiv.style.display = 'inline-flex';

      choicesDivs.forEach(
        function(choiceDiv,index){
          choiceDiv.addEventListener('click', function() {

            //Set active just the clicked choice
            choicesDivs.forEach(function(element){ element.classList.remove('active') });
            choiceDiv.classList.add('active');

            //Reactivate confirm button
            btnConfirmPopup.classList.remove('inactive');
            btnConfirmPopup.addEventListener('click',confirmPopupCallback); //Reactivate the listener for the confirm button

            //Set the user choice
            if(!isAutomaticStoryAhead(getCurrentStatus_Story())){
              setUserChoice(getCurrentStatus_Story(),choiceDiv.innerHTML.split('>')[1]);
            } else {
              setUserChoice(getCurrentStatus_Story(),choiceDiv.innerHTML);
            }
          });
        }
      );
      break;

    case STATUS_STORY_ENUM.RECORDING:
      choicesDiv.innerHTML = 'Press the rec button below to start the audio recording...'
      btnStartRecordingContainer.style.display = 'inline';
      btnStopRecordingContainer.style.display = 'inline';
      btnConfirmPopup.style.display = 'none';
      btnStartRecording.addEventListener('click', function(){
        speakStop();
        startRecord();
        btnStartRecording.classList.add('Blink');
        btnStartRecording.style.pointerEvents = 'none';
      });
      btnStopRecording.addEventListener('click', function(){
        stopRecord();
        btnStartRecording.classList.remove('Blink');
        confirmPopupCallback();
      });
      break;

    case STATUS_STORY_ENUM.END:
      btnStartRecordingContainer.style.display = 'none';
      btnStopRecordingContainer.style.display = 'none';

      //Replace the checkmark with another icon for the RELOAD PAGE
      btnConfirmPopup.replaceChild($('<span data-width="100" data-height="100" class="iconify" id="reloadIcon" data-icon="subway:cloud-reload" data-inline="false"></span>')[0], btnConfirmPopup.firstChild);
      //Set the properties for this icon
      setTimeout(function(){ //Timeout needed because iconify need to have time to substitute the element
        reloadIcon.style.marginTop = '8vh';
        reloadIcon.classList.remove('iconify');
        reloadIcon.style.cursor = 'pointer';
        reloadIcon.addEventListener('click',function(){
          location.reload();
        });
      },10);
      //Show the button
      btnConfirmPopup.removeEventListener('click', confirmPopupCallback);
      btnConfirmPopup.classList.remove('inactive');
      btnConfirmPopup.style.display = 'block';

      break;
  }
}
