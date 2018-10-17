var panorama;
var google_hq = {lat: 51.5331936, lng: -0.1254369};
var times_sq = {lat: 40.7592172, lng: -73.9846581};

function initPano() {
    panorama = new google.maps.StreetViewPanorama(
        document.getElementById('pano'), {
            position: google_hq,
            // position: times_sq,
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
    pov.pitch += 5;
    panorama.setPov(pov);
}

function move_down() {
    var pov = panorama.getPov();
    pov.pitch -= 5;
    panorama.setPov(pov);
}

function move_forward() {
    panorama.setPano(panorama.getLinks()[0].pano);
}

function move_backward() {
    panorama.setPano(panorama.getLinks()[1].pano);
}


/************** Evaluate pose ****************/

// Doesn't appear to be very reliable for control
// Evaluate nose to each ear distances to detect turning of face
function evaluateFaceToEars(noseX, leftEarX, rightEarX){
    NoseToLeftEar = Math.abs(noseX - leftEarX);
    NoseToRightEar = Math.abs(noseX - rightEarX);

    if (NoseToLeftEar + 100 > NoseToRightEar) {
        console.log('left turn');
        move_left();
    } else if (NoseToRightEar +100 > NoseToLeftEar) {
        console.log('right turn');
        move_right();
    } else {
        console.log('do not move');
    }
}

var prev_nose_x = null;
var prev_nose_y = null;
function eval_nose (prev_pos_x, curr_pos_x, prev_pos_y, curr_pos_y){
    if (prev_pos_x < curr_pos_x - 10) {
        console.log("Right");
        move_right();
    }
    else if (prev_pos_x > curr_pos_x + 10) {
        console.log("Left");
        move_left();
    }
    else if (prev_pos_y > curr_pos_y + 10) {
        console.log("Up");
        move_up();
    }
    else if (prev_pos_y < curr_pos_y - 10) {
        console.log("Down");
        move_down();
    }
    else if ( prev_pos_x === null | prev_pos_y === null ) {
        console.log("No move");
        curr_state = "NO_MOVE";
    }
    //prev_state = curr_state;

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
        current_nose_x = pose.keypoints[0].position.x;
        current_nose_y = pose.keypoints[0].position.y;
        noseX = pose.keypoints[0].position.x;
        leftEarX = pose.keypoints[3].position.x;
        rightEarX = pose.keypoints[4].position.x;
        //evaluateFaceToEars(noseX, leftEarX, rightEarX);
        eval_nose(prev_nose_x, current_nose_x, prev_nose_y, current_nose_y);
        prev_nose_x = current_nose_x;
        prev_nose_y = current_nose_y;
    }, 10);
}

async function setupVideo() {
    const videoElement = document.getElementById('video');
    videoElement.srcObject = await navigator.mediaDevices.getUserMedia({video: true});
    await videoElement.play()
    return videoElement;
}


/**************  MAP ****************/
