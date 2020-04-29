
//==============================================================================

// SpeechSynthesis

// Documentation: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
// Codepen example: https://codepen.io/matt-west/pen/wGzuJ

//==============================================================================

var voiceSelected = "Luca";

var volumeInput = 1;
var rateInput = 0.7;
var pitchInput = 1;

/*
 * Check for browser support
 */
function isNarrationSupported(){
  if ('speechSynthesis' in window) {
    message = 'Your browser <strong>supports</strong> speech synthesis.';
    return true
  } else {
    message = 'Sorry your browser <strong>does not support</strong> speech synthesis.<br>Try this in <a href="https://www.google.co.uk/intl/en/chrome/browser/canary.html">Chrome Canary</a>.';
    return false
  }
}



/**
* return the list of italian and english voices
* @return selectedVoices: list with the struct [voiceName, country]
*/
function getVoices(){
  // Fetch the available voices.
	var voices = speechSynthesis.getVoices();

  var selectedVoices = [];
  var numVoices = 0;

  // Loop through each of the voices.
	voices.forEach(function(voice, i) {
    if (voice.lang == "it-IT" || voice.lang == "en-US"){
      selectedVoices[numVoices] = [voice.name, voice.lang];
      numVoices = numVoices + 1;
    }

  });
  return selectedVoices
}


/**
* set the narration voice name (mandatory) and parameters (optional)
* @param name {string}: the name of the voice
* @param rate {float}: rate value [0.1 - 10] default = 1 (normal)
* @param pitch {float}: pitch value [0 - 2] default = 1
* @param volume {float}: volume value [0 - 1] default = 1
*/
function setVoice(name, rate=0.7, pitch=1, volume=1){
  voiceSelected = name;
  volumeInput = volume;
  rateInput = rate;
  pitchInput = pitch;
}



// Create a new utterance for the specified text and add it to
// the queue.

/**
* text-to-speach
* @param text {string}: the text to be listen
* @return speak: create a new utterance for the specified text and add it to the queue.
*/
function speak(text){
  // Create a new instance of SpeechSynthesisUtterance.
	var msg = new SpeechSynthesisUtterance();

  // Set the text.
	msg.text = text;

  // Set the attributes.
	msg.volume = parseFloat(volumeInput);
	msg.rate = parseFloat(rateInput);
	msg.pitch = parseFloat(pitchInput);

  // If a voice has been selected, find the voice and set the
  // utterance instance's voice attribute.
	if (voiceSelected != "") {
		msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == voiceSelected; })[0]; // [0] return the voiceURI
	}

  // Queue this utterance.
	window.speechSynthesis.speak(msg);

  // event handler when narration finishes to speak msg
  msg.onend = function(event) {

      if (getCurrentStatus_Story() == STATUS_STORY_ENUM.RECAP){
        console.log('Narration speech ended in ' + event.elapsedTime + ' milliseconds.');
        // call a method in graphics at the end of the current speech
        afterSpeech()
      }

  }
}

/**
* stop all active speach and Queue
*/
function speakStop(){
  // removes all utterances from the utterance queue.
  window.speechSynthesis.cancel();
}
