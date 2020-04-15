const COLORS = [
  { name: 'black', hex: '#000000'},
  { name: 'red', hex: '#f44336'},
  { name: 'pink', hex: '#E91E63'},
  { name: 'purple', hex: '#9C27B0'},
  { name: 'deeppurple', hex: '#673AB7'},
  { name: 'indigo', hex: '#3F51B5'},
  { name: 'blue', hex: '#2196F3'},
  { name: 'cyan', hex: '#00BCD4'},
  { name: 'teal', hex: '#009688'},
  { name: 'green', hex: '#4CAF50'},
  { name: 'lightgreen', hex: '#8BC34A'},
  { name: 'lime', hex: '#CDDC39'},
  { name: 'yellow', hex: '#FFEB3B'},
  { name: 'amber', hex: '#FFC107'},
  { name: 'orange', hex: '#FF9800'},
  { name: 'deeporange', hex: '#FF5722'},
  { name: 'brown', hex: '#795548'},
  { name: 'grey', hex: '#9E9E9E'}
];

//Listener for each button associated to the colors
function changeColor(event){
  const btn = event.target;
  sketchContext.updateCurrentColor(index=btn.dataset.index);
  document.querySelector('.active').classList.remove('active');
  btn.classList.add('active');
  colors.classList.remove('visible');
  graphicToolsOpen = false;

  //Reactivate pencil
  eraserActive = false;

  btnPencil.classList.add('active');
  btnEraser.classList.remove('active');
  colorPalette.classList.remove('active');

  sketchContext.fill(currentColor);
  sketchContext.stroke(currentColor);
  sketchContext.strokeWeight(currentStrokeWeight);
}
