let model;
const chooseFiles = document.getElementById('chooseFiles');
const modelNameSelect = document.getElementById("modelNameSelect");
const legendsDiv = document.getElementById("legends");
const image = document.getElementById('image');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

chooseFiles.onchange = () => {
    const [file] = chooseFiles.files
    if (file) {
        image.src = URL.createObjectURL(file);
    }
};

document.getElementById("segmentImage").onclick = predict;

document.getElementById("loadModel").onclick = async () => {
    segmentImageButton.disabled = true;
    updateModelLoadStatus("Model Loading...");

    const modelName = modelNameSelect.options[modelNameSelect.selectedIndex].value;
    await loadModel(modelName);
    updateModelLoadStatus(modelName + " model loaded!");

    segmentImageButton.disabled = false;
};

function updateModelLoadStatus(status) {
    document.getElementById("modelLoadedStatus").innerHTML = status;
}

async function loadModel(modelName) {
    model = await deeplab.load({ "base": modelName, "quantizationBytes": 2 });
}

async function predict() {
    let prediction = await model.segment(image);
    renderPrediction(prediction);
}

function renderPrediction(prediction) {
    const { legend, height, width, segmentationMap } = prediction;
    console.log(`prediction: ${JSON.stringify(prediction.legend)}`);

    const segmentationMapData = new ImageData(segmentationMap, width, height);
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.putImageData(segmentationMapData, 0, 0);

    displayLegends(legend);
}

function displayLegends(legendObj) {
    legendsDiv.innerHTML = "";

    Object.keys(legendObj).forEach((legend) => {
        const [red, green, blue] = legendObj[legend];

        const span = document.createElement('span');
        span.innerHTML = legend;
        span.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
        span.style.padding = '10px';
        span.style.marginRight = '10px';
        span.style.color = '#ffffff';

        legendsDiv.appendChild(span);
    });
}
