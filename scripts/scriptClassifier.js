let classifier;
let video;
let canvas;
let ctx;
let imgElement;

function setup() {
    video = document.getElementById('video');
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        });

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    classifier = ml5.imageClassifier('MobileNet', modelReady);
    const captureButton = document.getElementById('captureButton');
    captureButton.addEventListener('click', captureImage);
    imgElement = document.getElementById('capturedImage');
}

function modelReady() {
    console.log('Model Loaded!');
}

function captureImage() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    imgElement.src = canvas.toDataURL('image/png');
    imgElement.style.display = 'block';
    classifier.classify(canvas, gotResult);
}

function gotResult(error, results) {
    if (error) {
        console.error(error);
        return;
    }

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <p>Label: ${results[0].label}</p>
        <p>Confidence: ${(results[0].confidence * 100).toFixed(2)}%</p>
    `;
}

window.addEventListener('load', setup);
