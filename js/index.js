async function start() {
    const videoElement = await setupVideo();

    const imageScaleFactor = 0.5;
    const outputStride = 16;
    const flipHorizontal = true;

    const model = await posenet.load();

    setInterval(async() => {
        const pose = await model.estimateSinglePose(videoElement, imageScaleFactor, flipHorizontal, outputStride);

        console.log('nose', pose.keypoints[0].position)
        // console.log('left eye', pose.keypoints[1].position)
        // console.log('right eye', pose.keypoints[2].position)
        // console.log('left ear', pose.keypoints[3].position)
        // console.log('right ear', pose.keypoints[4].position)
        // console.log('left shoulder', pose.keypoints[5].position)
        // console.log('right shoulder', pose.keypoints[6].position)

    }, 1000);
}

async function setupVideo() {
    const videoElement = document.getElementById('video');
    videoElement.srcObject = await navigator.mediaDevices.getUserMedia({ video: true });
    await videoElement.play()
    return videoElement;
}