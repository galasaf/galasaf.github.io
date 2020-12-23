
var recording = false;
var recording_interval;

const SNAPSHOT_TIMING = 1000 // Time between snapshots

// Check if have camera access
function checkIsApproved(){
  return navigator.mediaDevices.enumerateDevices()
    .then(infos =>
      // if any of the MediaDeviceInfo has a label, we're good to go
      [...infos].some(info=>info.label!=="")
    );
}

function handleRecordButton(cb) {

  // Do when recording is started
  function startRecording() {
    // Configure a few settings and attach camera
    // 320 W x 240 H
    Webcam.set({
      width: 320,
      height: 240,
      image_format: 'jpeg',
      jpeg_quality: 90
    });
    Webcam.attach( '#my_camera' );
    recording = true;
    recording_interval = setInterval(take_snapshot, SNAPSHOT_TIMING); // The first image after clicking "Record" starts quickly
    recording_status.innerHTML = "<p style='color:red;'>Recording...</p>";
  }

  // Do when recording failed (this code not seem to work)
  function failedRecording() {
    recording = false;
    recording_status.innerHTML = "<p style='color:red;'>Recording failed; check camera permissions.</p>";
  }

  // Do when recording is stopped
  function stopRecording() {
    Webcam.reset();
    recording = false;
    clearInterval(recording_interval);
    recording_status.innerHTML = "<p>Not Recording.</p>";
  }

  // Output that Recording has started for the relevant Slouching status, and start taking snapshots
  if (cb.checked) {
    // When access to camera given, start recording
    var successCallback = function(error) {
      // user allowed access to camera
      startRecording();
    };
    var errorCallback = function(error) {
      if (error.name == 'NotAllowedError') {
        // user denied access to camera
      }
    };
    navigator.mediaDevices.getUserMedia({video:true})
      .then(successCallback, errorCallback);

  } else {
    stopRecording();
  }
  
}



// Code to handle taking the snapshot and displaying it locally
function take_snapshot() {
    // take snapshot and get image data
    Webcam.snap( function(data_uri) {
      
      const IMAGE_SIZE = 192

      let img = document.createElement('img');
      img.src = data_uri;
      img.width = IMAGE_SIZE;
      img.height = IMAGE_SIZE;    
      img.onload = () => predict(img);      


    } );
}



