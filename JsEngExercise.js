var dataFolder = "data/"
var listFile = "images.txt"

function readTextFile(file) {
    var allText = "";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
    return allText;
}

// Display a random image from specific directory
function getRandomImage() {
    var listFiles = readTextFile(dataFolder + listFile);
    var files = listFiles.split("\r\n");
    var i = Math.floor(Math.random() * (files.length - 1));
    var image = files[ i ];
    
    return dataFolder + image;
}

function displayRandomImage() {
    var htmlImage = document.getElementById("randomImage");
    htmlImage.src = getRandomImage();
}

displayRandomImage();