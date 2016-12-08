var dataFolder = "./data/"
var listFile = "images.txt"
var imageExt = ".jpg"
var level = 1
var divisor = 3
var strCookieList = [];
var strCurrentTopic = "";
var isClearCookie = 0;

/*
function getCookie(c_name) {
    if (typeof localStorage != "undefined") {
        return localStorage.getItem(c_name);
    }
    else {
        var c_start = document.cookie.indexOf(c_name + "=");
        if (document.cookie.length > 0) {
            if (c_start !== -1) {
                return getCookieSubstring(c_start, c_name);
            }
        }
        return "";
    }
}

function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    if (typeof localStorage != "undefined") {
        //alert("This place has local storage!");
        localStorage.setItem(c_name, value);
    }
    else {
        alert("No local storage here");
        document.cookie = c_name + "=" + escape(value) +
        ((expiredays === null) ? "" : ";expires=" + exdate.toUTCString());
    }
}

function clearCookie(cookieName) {
    setCookie(cookieName, "", -7);
}
*/

//建立Cookie
//name : Key
//value:保存值
//days:預設為天數，如有需求請自行修改
function setCookie(name, value, days) {
    //需要呼叫編碼，為瞭解決中文問題
    value = escape(value);
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

//讀取Cookie
//name : Key
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return unescape(c.substring(nameEQ.length, c.length));
        //unscape是重點，為了完美解決中文問題
    }
    return null;
}

//刪除cookie
//name: Key
function ClearCookie(name) {
    setCookie(name, "", -1);
}

function clearAllCookies() {
    ClearCookie("topicList");
    ClearCookie("ansCount");
    ClearCookie("totalTopicCount");
    ClearCookie("srcTopicList");
}

// Read a page's GET URL variables and return them as an associative array.
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

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

//function setSpanContent(name, value) {
//    var mySpan = document.getElementById(name);
//    if (mySpan == null) {
//        return;
//    }

//    if (mySpan.innerText) {
//        mySpan.innerText = value;
//    }
//    else
//        if (mySpan.textContent) {
//            mySpan.textContent = value;
//        }
//}

function getUniqueItem(srcList) {
    if ((srcList == null) || (srcList.length == 0)) {
        return "";
    }

    //var strCookieList = [];
    var strTopicList = getCookie("topicList");
    if ((strTopicList != null) && (strTopicList.toString().length > 0)) {
        strCookieList = JSON.parse(strTopicList);
    }

    var isFound = false;
    var i = 0;
    var image = "";
    do {
        i = Math.floor(Math.random() * (srcList.length));
        image = srcList[i];

        if (strCookieList.length > 0) {
            if (strCookieList.indexOf(image) < 0) {
                strCurrentTopic = image;
                //strCookieList.push(image);
                //setCookie("topicList", JSON.stringify(strCookieList), 7);
                isFound = true;
            }
        }
        else {
            strCurrentTopic = image;
            //strCookieList.push(image);
            //setCookie("topicList", JSON.stringify(strCookieList), 7);
            isFound = true;
        }
    } while ((isFound == false) && (strCookieList.length < (srcList.length)));

    return image;
}

// Display a random image from specific directory
function getRandomImage(imgObj) {
    //var listFiles;
    //var files;
    //listFiles = readTextFile(dataFolder + listFile);
    //files = listFiles.split("\r\n");
    //document.getElementById("totalCount").innerHTML = files.length;
    //setCookie("totalTopicCount", files.length, 7);

    var totalTopicCount = getCookie("totalTopicCount");
    if (totalTopicCount == null) {
        totalTopicCount = 0;
    }
    document.getElementById("totalCount").innerHTML = totalTopicCount;

    var files;
    var strSrcTopicList = getCookie("srcTopicList");
    if ((strSrcTopicList != null) && (strSrcTopicList.toString().length > 0)) {
        files = JSON.parse(strSrcTopicList);
    }
    else {
        alert("No topic file ready!");
        return;
    }

    //image = getUniqueItem(files);
    var i = Math.floor(Math.random() * (files.length));
    image = files[i];
    var tempFiles = files.splice(i, 1);
    setCookie("srcTopicList", JSON.stringify(files), 7);

    imgObj.varFile = dataFolder + image + imageExt;

    var rate = level / divisor;
    if (level == 4) {
        rate = 3 / divisor;
    }
    
    var textList = image.split("_");
    if (textList.length >= 2) {
        imgObj.varEng = textList[0];
        imgObj.varCht = textList[1];
        imgObj.varTopic = imgObj.varEng;

        var num = Math.ceil(imgObj.varEng.length * rate);
        var total = 0;
        var strList = imgObj.varTopic.split('');
        var indexList = [];
        do{
            i = Math.floor(Math.random() * imgObj.varEng.length);
            if (indexList.indexOf(i) < 0) {
                indexList.push(i);
                strList[i] = '@';
                total++;
            }                        
        } while (total < num);

        imgObj.varTopic = strList.join('');
        imgObj.varTopic = imgObj.varTopic.replace(/@/g, "<label class='labelWord'>?</label>");
    }
}

function displayRandomImage() {
    var htmlImage = document.getElementById("randomImage");
    if (level == 4) {
        if (htmlImage != null) {
            htmlImage.style.visibility = "hidden";
        }
    }

    var imageObject = {
        varFile: "",
        varCht: "",
        varEng: "",
        varTopic: ""
    };

    var ansCount = getCookie("ansCount");
    if ((ansCount == null) || (ansCount.toString().length == 0)) {
        ansCount = 0;
    }
    ansCount++;
    document.getElementById("answerCount").innerHTML = ansCount;

    getRandomImage(imageObject);
    if ((htmlImage != null) && (level != 4)) {
        htmlImage.src = imageObject.varFile;
    }
    document.getElementById("imageText").innerHTML = imageObject.varCht;
    document.getElementById("AnswerText").innerHTML = imageObject.varEng;
    document.getElementById("TopicText").innerHTML = imageObject.varTopic;
}

function checkAnswer() {
    if (document.getElementById("inputAnswer").value.length == 0) {
        alert("請打字回答!");
        return false;
    }

    var strInput = document.getElementById("inputAnswer").value;
    var strAnswer = document.getElementById("AnswerText").innerHTML;
    //var strAnswer = $("#AnswerText").text();
    var areEqual = strInput.toLowerCase() === strAnswer.toLowerCase();
    if (!areEqual) {
        alert("不是喔! 再試試");
        return false;
    }

    strCookieList.push(strCurrentTopic);
    setCookie("topicList", JSON.stringify(strCookieList), 7);

    var num = getCookie("ansCount");
    num++;
    setCookie("ansCount", num, 1);

    window.location.href = "EngWords.html?src=0&lv=" + level;

    return true;
}

function InitExercise() {
    isClearCookie = getUrlVars()["src"];
    level = getUrlVars()["lv"];

    if (isClearCookie == 1) {
        clearAllCookies();
        isClearCookie = 0;

        var listFiles;
        var files;
        listFiles = readTextFile(dataFolder + listFile);
        files = listFiles.split("\r\n");
        setCookie("totalTopicCount", files.length, 7);
        setCookie("srcTopicList", JSON.stringify(files), 7);
    }

    if (isExerciseFinished()) {
        return;
    }
}

function isExerciseFinished() {
    var ansCount = getCookie("ansCount");
    if ((ansCount == null) || (ansCount.toString().length == 0)) {
        ansCount = 0;
    }

    var totalCount = getCookie("totalTopicCount");
    if ((totalCount == null) || (totalCount.toString().length == 0)) {
        totalCount = 1;
    }

    if ((ansCount - totalCount ) >= 0) {
        clearAllCookies();
        alert("恭禧你!題目都做完了, 可以到下一階段了!");
        window.location.href = "../index.html";
        return true;
    }

    //ansCount++;
    //document.getElementById("answerCount").innerHTML = ansCount;

    return false;
}