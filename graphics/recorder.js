// Expose globally your audio_context, the recorder instance and audio_stream
var audio_context;
var recorder;
var audio_stream;
/*var startRecord = document.getElementById("startRecord");
var stopRecord = document.getElementById("stopRecord");
var pauseRecord = document.getElementById("pauseRecord");*/
var input;
var rec = false;

/**
 * Patch the APIs for every browser that supports them and check
 * if getUserMedia is supported on the browser.
 *
 */
function Initialize() {
    try {
        // Monkeypatch for AudioContext, getUserMedia and URL
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
        window.URL = window.URL || window.webkitURL;

        // Store the instance of AudioContext globally
        audio_context = new AudioContext;
        console.log('Audio context is ready !');
        console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
        navigator.getUserMedia({ audio: true }, function (stream) {
            // Expose the stream to be accessible globally
            audio_stream = stream;
            // Create the MediaStreamSource for the Recorder library
            input = audio_context.createMediaStreamSource(stream);
            console.log('Media stream succesfully created');

            // Initialize the Recorder Library
            recorder = new Recorder(input);
            console.log('Recorder initialised');

        }, function (e) {
            console.error('No live audio input: ' + e);
        });
    } catch (e) {
        alert('No web audio support in this browser!');
    }
}

/**
 * Starts the recording process by requesting the access to the microphone.
 * Then, if granted proceed to initialize the library and store the stream.
 *
 * It only stops when the method stopRecording is triggered.
 */

function startRecording() {
    recorder && recorder.record();
    console.log('Recording...');

    // Disable Record button and Play button and enable Stop button and Sause button!
    /*document.getElementById("startRecord").disabled = true;
    document.getElementById("stopRecord").disabled = false;
    document.getElementById("pauseRecord").disabled = false;
    document.getElementById("playRecord").disabled = true;*/
}

function pauseRecording() {
    console.log("pauseButton clicked rec.recording=", recorder.recording);
    if (recorder.recording) {
        //pause
        recorder.stop();
        /*document.getElementById("pauseRecord").innerHTML = "Resume";*/
    } else {
        //resume
        recorder.record()
        /*document.getElementById("pauseRecord").innerHTML = "Pause";*/
    }
    // Disable Record button and Play button and enable Stop button
    /*document.getElementById("stopRecord").disabled = false;
    document.getElementById("playRecord").disabled = true;*/
}
/**
 * Stops the recording process. The method expects a callback as first
 * argument (function) executed once the AudioBlob is generated and it
 * receives the same Blob as first argument. The second argument is
 * optional and specifies the format to export the blob either wav or mp3
 */
function stopRecording(callback) {
    // Stop the recorder instance
    recorder && recorder.stop();
    console.log('Stopped recording.');

    // Stop the getUserMedia Audio Stream !
    audio_stream.getAudioTracks()[0].stop();

    // Disable Stop button and enable Record button and Play button!
    /*document.getElementById("startRecord").disabled = false;
    document.getElementById("stopRecord").disabled = true;
    document.getElementById("pauseRecord").disabled = true;
    document.getElementById("playRecord").disabled = false;*/
    // Use the Recorder Library to export the recorder Audio as a .wav file
    // The callback providen in the stop recording method receives the blob

    this.recorder.getBuffer(function (buffers) {callback(buffers)});

    if(typeof(callback) == "function"){
                recorder && recorder.getBuffer(function (buffers) {
                    callback(buffers);
                    recorder.clear();
                });
            }
}

function playback(buffers) {
    // create audio node and play buffer
    var source = audio_context.createBufferSource();
    var gainNode = audio_context.createGain();
    var newBuffer = audio_context.createBuffer( 2, buffers[0].length, audio_context.sampleRate );
    newBuffer.getChannelData(0).set(buffers[0]);
  	newBuffer.getChannelData(1).set(buffers[1]);
  	source.buffer = newBuffer;
    source.connect(gainNode);
    gainNode.connect(audio_context.destination);
    source.startTime = audio_context.currentTime; // important for later!
    source.start(0);
    timer = buffers[0].length/audio_context.sampleRate ;
    setTimeout(afterRecordingEnd,timer*1000);
    return timer;
}

/*function callbackFunction() {
  console.log("End of recording");
  afterRecordingEnd()
}*/

function createBuffer(buffers, channelTotal) {
    var channel = 0,
        buffer = audio_context.createBuffer(channelTotal, buffers[0].length, audio_context.sampleRate);
    for (channel = 0; channel < channelTotal; channel += 1) {
        buffer.getChannelData(channel).set(buffers[channel]);
    }
    return buffer;
}

var vocalsBuffers = null,
    vocalsRecording = null;

// Initialize everything once the window loads
/*window.onload = function(){
    // Prepare and check if requirements are filled
    Initialize();

    // Handle on start recording button
    document.getElementById("startRecord").addEventListener("click", function(){
        startRecording();
    }, false);

    document.getElementById("pauseRecord").addEventListener("click", function(){
        pauseRecording();
    }, false);

    document.getElementById('playRecord').addEventListener('click', function () {
        vocalsInstance = playback(vocalsBuffer);
    });

    // Handle on stop recording button
    document.getElementById("stopRecord").addEventListener("click", function(){
        stopRecording(function(buffers){
          vocalsBuffer = buffers;
          vocalsRecording = createBuffer(vocalsBuffer, 2);
        });
    }, false);
};*/





/* Exposed Functions */
/*----------------------------------------------------*/

function startRecord(){
  startRecording();
}

function stopRecord(){
  stopRecording(function(buffers){
    vocalsBuffer = buffers;
    vocalsRecording = createBuffer(vocalsBuffer, 2);
  });
}

function playRecord(){
  durationRec = playback(vocalsBuffer);
  return durationRec;
}
