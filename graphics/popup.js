function openPopup() {

  //Reset previous choices
  $( '#choicesDiv' ).children().remove();


  //Get narration text from story.js and set text
  narrationText.innerHTML = getNarration()[0];

  //Get choices list from story.js and populate the list
  choices = getChoices();

  /*choicesList.innerHTML = choices.map(listElement => `<option>${listElement}</option>`).join('');
  choicesList.selectedIndex = -1; //Set the dropdown menu to the initial wallpaper  */

  //Generate dynamically buttons for the choices
  for (var i = 0; i < choices.length; i++){
      $( '#choicesDiv' ).append( '<div class="choiceButton" id=choice'+i+'">'+choices[i]+'</div>' );
  }

  //Show the popup
  infoMessage.innerHTML = 'Done: popup opened!';
  popup.classList.remove('hidden');
  popupContent.classList.remove('hidden');
  popupIsOpen = true;

  //Get the divs of the choices in an array
  choicesDivs = $( '#choicesDiv' ).children().toArray();

  switch(getCurrentStatus()){
    case STATUS_STORY_ENUM.DOVE:
      choicesDivs.forEach(
        function(choiceDiv,index){
          choiceDiv.addEventListener('click', function callback() {
            //Set active just the clicked choice
            choicesDivs.forEach(function(element){ element.classList.remove('active') });
            choiceDiv.classList.add('active');

            changeBackground(choiceDiv);
          });
        }
      );
      break;
    case STATUS_STORY_ENUM.METEO:
      choicesDivs.forEach(
        function(choiceDiv,index){
          choiceDiv.addEventListener('click', function callback() {
            //Set active just the clicked choice
            choicesDivs.forEach(function(element){ element.classList.remove('active') });
            choiceDiv.classList.add('active');

            changeBackground(choiceDiv);
          });
        }
      );
      break;
    case STATUS_STORY_ENUM.PROTAGONISTA:
      choicesDivs.forEach(
        function(choiceDiv,index){
          choiceDiv.addEventListener('click', function callback() {
            //Set active just the clicked choice
            choicesDivs.forEach(function(element){ element.classList.remove('active') });
            choiceDiv.classList.add('active');

            setUserChoice(getCurrentStatus(),choiceDiv.innerHTML);
          });
        }
      );
      break;
    case STATUS_STORY_ENUM.NOME:
      choicesDiv.style.display = 'none';
      characterNameField.style.display = 'inline';
      break;
    default:
      characterNameField.style.display = 'none';
      choicesDiv.style.display = 'inline-flex';

      choicesDivs.forEach(
        function(choiceDiv,index){
          choiceDiv.addEventListener('click', function callback() {

            //Set active just the clicked choice
            choicesDivs.forEach(function(element){ element.classList.remove('active') });
            choiceDiv.classList.add('active');

            //Set the user choice
            setUserChoice(getCurrentStatus(),choices.indexOf(choiceDiv.innerHTML));
          });
        }
      );
      break;
    case STATUS_STORY_ENUM.FINALE:
      //
      break;
    case STATUS_STORY_ENUM.RECAP:
      break;
  }
}


function changeBackground(choiceDiv) {
    switch(choices.indexOf(choiceDiv.innerHTML)) {
      case 0:
        setUserChoice(getCurrentStatus(), choices[0]);
        sketchContainer.style.backgroundImage = 'url("https://steemitimages.com/0x0/https://res.cloudinary.com/hpiynhbhq/image/upload/v1518361364/uz0lt1d2yjdknpdenelq.jpg")';
        break;
      case 1:
        setUserChoice(getCurrentStatus(), choices[1]);
        sketchContainer.style.backgroundImage = 'url("https://static.tildacdn.com/tild6632-3862-4565-b231-343736656162/1bb1156e37fc3b86ae4d.jpg")';
        break;
      case 2:
        setUserChoice(getCurrentStatus(), choices[2]);
        sketchContainer.style.backgroundImage = 'url("https://cutewallpaper.org/21/landscape-drawing-wallpaper/Drawing-Wallpaper-Coloring-Size-Of-Axe-Cross-Room-Hd-2-.jpg")';
        break;
      case 3:
        setUserChoice(getCurrentStatus(), choices[3]);
        sketchContainer.style.backgroundImage = 'url("https://www.freegreatpicture.com/files/200/12254-fantasy-landscape.jpg")';
        break;
    }
}
