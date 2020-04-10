function openPopup() {

  //Get narration text from story.js and set text
  narrationText.innerHTML = getNarration()[0];

  //Get choices list from story.js and populate the list
  choices = getChoices();
  choicesList.innerHTML = choices.map(listElement => `<option>${listElement}</option>`).join('');
  choicesList.selectedIndex = -1; //Set the dropdown menu to the initial wallpaper

  //Show the popup
  infoMessage.innerHTML = 'Done: popup opened!';
  popup.classList.remove('hidden');
  popupContent.classList.remove('hidden');
  popupIsOpen = true;

  switch(getCurrentStatus()){
    case STATUS_STORY_ENUM.DOVE:
      choicesList.addEventListener('change', changeBackground);
      break;
    case STATUS_STORY_ENUM.METEO:
      choicesList.addEventListener('change', changeBackground);
      break;
    case STATUS_STORY_ENUM.PROTAGONISTA:

      break;
    case STATUS_STORY_ENUM.NOME:
      choicesList.style.display = 'none';
      textField.style.display = 'inline';
      break;
    default:
      textField.style.display = 'none';
      choicesList.style.display = 'inline';
      //Draw something
      break;
    case STATUS_STORY_ENUM.FINALE:
      //
      break;
    case STATUS_STORY_ENUM.RECAP:
      break;
  }
}


function changeBackground() {
    switch(choicesList.selectedIndex) {
      case 0:
        sketchContainer.style.backgroundImage = 'url("https://www.pixelstalk.net/wp-content/uploads/2015/01/Landscape-color-drawing-wallpaper.jpg")';
        break;
      case 1:
        sketchContainer.style.backgroundImage = 'url("https://static.tildacdn.com/tild6632-3862-4565-b231-343736656162/1bb1156e37fc3b86ae4d.jpg")';
        break;
      case 2:
        sketchContainer.style.backgroundImage = 'url("https://www.wallpaperup.com/uploads/wallpapers/2014/01/07/219034/81aa9088c07cece411d3140467bc8ce2-700.jpg")';
        break;
      case 3:
        sketchContainer.style.backgroundImage = 'url("https://paintingvalley.com/drawings/small-village-drawing-27.jpg")';
        break;
    }
}
