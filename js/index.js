



async function start() {
    const videoElement = document.getElementById('video');
    videoElement.srcObject = await navigator.mediaDevices.getUserMedia({ video: true });
    await videoElement.play();

    // takeSnapshot(videoElement)

    const imageScaleFactor = 0.5;
    const outputStride = 16;
    const flipHorizontal = false;
    
    const model = await posenet.load();
    const pose = await model.estimateSinglePose(videoElement, imageScaleFactor, flipHorizontal, outputStride);

    console.log(pose)
    // console.log('nose', pose.keypoints[0].position)
}


// function takeSnapshot(video) {
//     let context = canvas.getContext("2d"),
//         width = video.videoWidth,
//         height = video.videoHeight;
//
//     if (width && height) {
//         // Setup a canvas with the same dimensions as the video.
//         canvas.width = width;
//         canvas.height = height;
//
//         // Make a copy of the current frame in the video on the canvas.
//         context.drawImage(video, 0, 0, width, height);
//
//         classifyImage();
//     }
// }
//
//
// async function startCamera() {
//     video.srcObject = stream;
//     await video.play();
//
//     setInterval(() => takeSnapshot(), 1000);
// }


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
}