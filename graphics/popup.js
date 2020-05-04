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
      choicesDiv.innerHTML = 'Press  <span id="btnStartRecordingText" class="iconify"  data-icon="mdi:record-circle-outline"></span>  to start the audio recording... and then <span id="btnStopRecordingText" class="iconify"  data-icon="mdi:stop-circle-outline"></span> to stop it';
      setTimeout(function(){
        btnStartRecordingText.style.cursor = 'auto';
        btnStartRecordingText.style.marginLeft = '0.5vw';
        btnStartRecordingText.style.marginRight = '0.5vw';

        btnStopRecordingText.style.cursor = 'auto';
        btnStopRecordingText.style.marginLeft = '0.5vw';
        btnStopRecordingText.style.marginRight = '0.5vw';
      },300);
      speak('Press the rec button to start the audio recording, and then the stop button to stop it');

      // Prepare and check if requirements are filled
      Initialize();

      btnStartRecordingContainer.style.display = 'inline';
      btnStopRecordingContainer.style.display = 'inline';
      btnConfirmPopup.style.display = 'none';
      btnStartRecording.classList.remove('inactive'); //Activate start recording button, but not stop button
      btnStartRecording.addEventListener('click', function(){
        speakStop();
        startRecord();

        btnStartRecording.classList.add('Blink'); //Blink recording button
        btnStartRecording.style.pointerEvents = 'none';
        setTimeout(function(){ //Timeout needed for firefox
          btnStartRecording.style.animationName = 'anim';
        },10);

        btnStopRecording.classList.remove('inactive'); //Activate stop recording button,
        btnStopRecording.style.pointerEvents = 'all';
      });
      btnStopRecording.addEventListener('click', function(){
        stopRecord();

        btnStartRecording.classList.add('inactive'); //deactivate start rec button
        btnStartRecording.classList.remove('Blink');
        confirmPopupCallback();
      });
      break;

    case STATUS_STORY_ENUM.END:

      //Hide all popup buttons
      btnStartRecordingContainer.style.display = 'none';
      btnStopRecordingContainer.style.display = 'none';
      btnConfirmPopup.style.display = 'none';

      //Show the reload page button
      btnReload.style.display = 'block';
      reloadIcon.style.height = '13vh';
      reloadIcon.style.width = '7vw';
      reloadIcon.style.marginTop = '5vh';
      btnReload.addEventListener('click',function(){
        location.reload();
      });
      /*divText = document.createElement('div');
      divText.innerText = 'Restart!';
      divText.style.fontSize = '1.8vw';
      divText.style.marginTop = '-2.5vw';
      btnReload.appendChild(divText);*/

      break;
  }
}
