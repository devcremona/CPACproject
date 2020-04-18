function openPopup() {

  //Set confirm popup button inactive
  btnConfirmPopup.classList.add('inactive');
  btnConfirmPopup.removeEventListener('click',confirmPopupCallback);


  //Reset previous choices
  $( '#choicesDiv' ).children().remove();


  //Get narration text from story.js and set text
  narrationText.innerHTML = getNarration()[0];
  infoMessage.innerHTML = getNarration()[0];
  setVoice(voiceNameITA,rate=1.1);
  speak(narrationText.innerHTML);

  //Get choices list from story.js and populate the list
  currentChoices = getChoices();

  /*choicesList.innerHTML = choices.map(listElement => `<option>${listElement}</option>`).join('');
  choicesList.selectedIndex = -1; //Set the dropdown menu to the initial wallpaper  */

  //Generate dynamically buttons for the choices
  for (var i = 0; i < currentChoices.length; i++){
      $( '#choicesDiv' ).append( '<div class="choiceButton" id=choice'+i+'">'+currentChoices[i]+'</div>' );
      speak(currentChoices[i]);
  }

  //Show the popup
  popup.classList.remove('hidden');
  popupContent.classList.remove('hidden');
  popupIsOpen = true;

  //Get the divs of the choices in an array
  choicesDivs = $( '#choicesDiv' ).children().toArray();

  switch(getCurrentStatus()){
    case STATUS_STORY_ENUM.DOVE:
    case STATUS_STORY_ENUM.METEO:
    case STATUS_STORY_ENUM.PROTAGONISTA:
      choicesDivs.forEach(
        function(choiceDiv,index){
          choiceDiv.addEventListener('click', function() {
            //Set active just the clicked choice
            choicesDivs.forEach(function(element){ element.classList.remove('active') });
            choiceDiv.classList.add('active');

            //Reactivate confirm button
            btnConfirmPopup.classList.remove('inactive');
            btnConfirmPopup.addEventListener('click',confirmPopupCallback); //Reactivate the listener for the confirm button

            if(getCurrentStatus()==STATUS_STORY_ENUM.DOVE)
              setUserChoice(STATUS_STORY_ENUM.METEO,choices[STATUS_STORY_ENUM.METEO][0]); //The first time is set to "sun", second time is overwritten by next

            //First time set WHERE, second time set weather, third time set main character
            setUserChoice(getCurrentStatus(),choiceDiv.innerHTML);

            sketchContainer.style.backgroundImage = 'url(../background/'+getUserChoice(STATUS_STORY_ENUM.DOVE).toLowerCase()+'_'+getUserChoice(STATUS_STORY_ENUM.METEO).toLowerCase().replace(/\s/g, '_')+'.jpg)';
          });
        }
      );
      break;

    case STATUS_STORY_ENUM.NOME:
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
            setUserChoice(getCurrentStatus(),choiceDiv.innerHTML);
          });
        }
      );
      break;

    case STATUS_STORY_ENUM.FINALE:
      choicesDiv.innerHTML = 'Press the rec button below to start the audio recording...'
      btnStartRecording.style.display = 'inline';
      btnStopRecording.style.display = 'inline';
      btnConfirmPopup.style.display = 'none';
      btnStopRecording.addEventListener('click', confirmPopupCallback);
      break;

    case STATUS_STORY_ENUM.RECAP:
      btnStartRecording.style.display = 'none';
      btnStopRecording.style.display = 'none';
      btnConfirmPopup.style.display = 'inline';
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
            //setUserChoice(getCurrentStatus(),choiceDiv.innerHTML);
          });
        }
      );
      break;
  }
}