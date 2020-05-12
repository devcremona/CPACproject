function encodeStrokes(sequence) {
  if (sequence.length <= 5) {
    return;
  }

  // Encode the strokes in the model.
  let newState = model.zeroState();
  newState = model.update(model.zeroInput(), newState);
  newState = model.updateStrokes(sequence, newState, sequence.length-1);

  // Reset the actual model we're using to this one that has the encoded strokes.
  modelState = model.copyState(newState);

  const lastHumanLine = lastHumanDrawing[lastHumanDrawing.length-1];
  x = lastHumanLine[0];
  y = lastHumanLine[1];

  // Update the pen state.
  const s = sequence[sequence.length-1];
  dx = s[0];
  dy = s[1];
  previousPen = [s[2], s[3], s[4]];

  lastModelDrawing = [];
  modelIsActive = true;
}
