



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