/************** Evaluate pose ****************/

// Evaluate nose to each ear distances to detect turning of face
function evaluateFaceToEars(noseX, leftEarX, rightEarX){
    NoseToLeftEar = Math.abs(noseX - leftEarX);
    NoseToRightEar = Math.abs(noseX - rightEarX);

    if (NoseToLeftEar > NoseToRightEar + 100) {
        console.log('left turn');
    } else if (NoseToRightEar > NoseToLeftEar + 100) {
        console.log('right turn');
    } else {
        console.log('do not move');
    }
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

        //console.log('nose', pose.keypoints[0].position)
        // console.log('left eye', pose.keypoints[1].position)
        // console.log('right eye', pose.keypoints[2].position)
        // console.log('left ear', pose.keypoints[3].position)
        // console.log('right ear', pose.keypoints[4].position)
        // console.log('left shoulder', pose.keypoints[5].position)
        // console.log('right shoulder', pose.keypoints[6].position)
        
        // Call function to evaluate snapshot for face turns
        // Turn if nose to left or right ear distances differ by more than 100 pixels
        noseX = pose.keypoints[0].position.x;
        leftEarX = pose.keypoints[3].position.x;
        rightEarX = pose.keypoints[4].position.x;
        evaluateFaceToEars(noseX, leftEarX, rightEarX);
    }, 1000);
}

async function setupVideo() {
    const videoElement = document.getElementById('video');
    videoElement.srcObject = await navigator.mediaDevices.getUserMedia({video: true});
    await videoElement.play()
    return videoElement;
}


/**************  MAP ****************/
function initialize_map() {
    var fenway = {lat: 51.5246866, lng: -0.1353883};
    // var map = new google.maps.Map(document.getElementById('map'), {
    //   center: fenway,
    //   zoom: 14,
    //   visible: false
    // });

    var panorama = initPano(fenway, 270);
    // map.setStreetView(panorama);
  }

function initPano(fenway, heading_value) {
    var panorama = new google.maps.StreetViewPanorama(
        document.getElementById('pano'), {
            position: fenway,
            pov: {
            heading: heading_value,
            pitch: 0
            },
            visible: true
    });

    panorama.addListener('pano_changed', function() {
        var panoCell = document.getElementById('pano-cell');
        panoCell.innerHTML = panorama.getPano();
    });

    panorama.addListener('links_changed', function() {
        var linksTable = document.getElementById('links_table');
        while (linksTable.hasChildNodes()) {
            linksTable.removeChild(linksTable.lastChild);
        }
        var links = panorama.getLinks();
        for (var i in links) {
            var row = document.createElement('tr');
            linksTable.appendChild(row);
            var labelCell = document.createElement('td');
            labelCell.innerHTML = '<b>Link: ' + i + '</b>';
            var valueCell = document.createElement('td');
            valueCell.innerHTML = links[i].description;
            linksTable.appendChild(labelCell);
            linksTable.appendChild(valueCell);
        }
    });

    panorama.addListener('position_changed', function() {
        var positionCell = document.getElementById('position-cell');
        positionCell.firstChild.nodeValue = panorama.getPosition() + '';
    });

    panorama.addListener('pov_changed', function() {
        var headingCell = document.getElementById('heading-cell');
        var pitchCell = document.getElementById('pitch-cell');
        headingCell.firstChild.nodeValue = panorama.getPov().heading + '';
        pitchCell.firstChild.nodeValue = panorama.getPov().pitch + '';
    });

    
    document.getElementById("moveRight").addEventListener("click", move_right);
    document.getElementById("moveLeft").addEventListener("click", move_left);
    document.getElementById("moveUp").addEventListener("click", move_up);
    document.getElementById("moveDown").addEventListener("click", move_down);
    document.getElementById("moveForward").addEventListener("click", move_forward);
    document.getElementById("moveBackward").addEventListener("click", move_backward);
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

}
