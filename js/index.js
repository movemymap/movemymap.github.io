var panorama;

function initPano() {
    panorama = new google.maps.StreetViewPanorama(
        document.getElementById('pano'), {
            position: {lat: 51.5246866, lng: -0.1353883},
            pov: {
            heading: 270,
            pitch: 0
            },
            visible: true
    });
}

function move_right() {
    var pov = panorama.getPov();
    pov.heading += 10;
    panorama.setPov(pov);
}

function move_left() {
    var pov = panorama.getPov();
    pov.heading -= 10;
    panorama.setPov(pov);
}

function move_up() {
    var pov = panorama.getPov();
    pov.pitch += 10;
    panorama.setPov(pov);
}

function move_down() {
    var pov = panorama.getPov();
    pov.pitch -= 10;
    panorama.setPov(pov);
}

function move_forward() {
    panorama.setPano(panorama.getLinks()[0].pano);
}

function move_backward() {
    panorama.setPano(panorama.getLinks()[1].pano);
}


/************** Evaluate pose ****************/

var prev_nose = null;
// Evaluate nose to each ear distances to detect turning of face
function evaluateFaceToEars(noseX, leftEarX, rightEarX){
    NoseToLeftEar = Math.abs(noseX - leftEarX);
    NoseToRightEar = Math.abs(noseX - rightEarX);

    if (NoseToLeftEar > NoseToRightEar + 100) {
        console.log('left turn');
        move_left();
    } else if (NoseToRightEar > NoseToLeftEar + 100) {
        console.log('right turn');
        move_right();
    } else {
        console.log('do not move');
    }
}

function eval_nose (prev_pos, curr_pos){
    if (Math.abs (curr_pos - prev_pos) < 10 | prev_pos === null) {
        console.log("No move");
        curr_state = "NO_MOVE";
    }
    else if (prev_pos < curr_pos) {
        console.log("Right");
        move_right();
    }
    else {
        console.log("Left");
        move_left();
    }
    prev_state = curr_state;

}

/************** Web browser webcam pose capture ****************/

async function start() {
    const videoElement = await setupVideo();

    const imageScaleFactor = 0.5;
    const outputStride = 16;
    const flipHorizontal = true;

    const model = await posenet.load();

    setInterval(async() => {
        const pose = await model.estimateSinglePose(videoElement, imageScaleFactor, flipHorizontal, outputStride);

        // console.log('right wrist', pose.keypoints)
        // console.log('right wrist', pose.keypoints[10].position)
        // // console.log('left eye', pose.keypoints[1].position)
        // console.log('right eye', pose.keypoints[2].position)
        // console.log('left ear', pose.keypoints[3].position)
        // console.log('right ear', pose.keypoints[4].position)
        // console.log('left shoulder', pose.keypoints[5].position)
        // console.log('right shoulder', pose.keypoints[6].position)
        
        // Call function to evaluate snapshot for face turns
        // Turn if nose to left or right ear distances differ by more than 100 pixels
        current_nose = pose.keypoints[0].position.x;
        noseX = pose.keypoints[0].position.x;
        leftEarX = pose.keypoints[3].position.x;
        rightEarX = pose.keypoints[4].position.x;
        // evaluateFaceToEars(noseX, leftEarX, rightEarX);
        eval_nose(prev_nose, current_nose);
        prev_nose = current_nose;
    }, 10);
}

async function setupVideo() {
    const videoElement = document.getElementById('video');
    videoElement.srcObject = await navigator.mediaDevices.getUserMedia({video: true});
    await videoElement.play()
    return videoElement;
}


/**************  MAP ****************/
