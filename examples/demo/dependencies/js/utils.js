///////////////////////////////////
///////////// Utils ////////////
///////////////////////////////////

function notEmpty(obj) {
    if (obj != null && obj != 'undefined' && obj != '') {
        return true;
    }
    return false;
}

//Trace
function trace(str) {
    console.log(str);
}

//Get field
function field(name) {
    var field = document.getElementById(name).value;
    return field;
}

//Set WCS URL
function setURL() {
    var proto;
    var url;
    var port;
    if (window.location.protocol == "http:") {
        proto = "ws://";
        port = "8080";
    } else {
        proto = "wss://";
        port = "8443";
    }

    url = proto + window.location.hostname + ":" + port;
    return url;
}

function getUrlParam(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getHLSUrl() {

    var proto;
    var port;

    if (window.location.protocol == "http:") {
        proto = "http://";
        port = "8082";
    } else {
        proto = "https://";
        port = "8445";
    }

    var url = proto + window.location.hostname + ":" + port;
    return url;
}

function getAdminUrl() {

    var proto;
    var port;
    if (window.location.protocol == "http:") {
        proto = "http://";
        port = "9091";
    } else {
        proto = "https://";
        port = "8888";
    }

    var url = proto + window.location.hostname + ":" + port;
    return url;
}

// Detect IE
function detectIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        return true;
    }
    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        return true;
    }
    return false;
}

// Detect Flash
function detectFlash() {
    var hasFlash = false;
    try {
        var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
        if (fo) {
            hasFlash = true;
        }
    } catch (e) {
        if (navigator.mimeTypes
            && navigator.mimeTypes['application/x-shockwave-flash'] != undefined
            && navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin) {
            hasFlash = true;
        }
    }
    if (!hasFlash) {
        $("#notifyFlash").text("Your browser doesn't support the Flash technology necessary for work of an example");
    }
}

$(function () {
    function reposition() {
        var modal = $(this),
            dialog = modal.find('.modal-dialog');
        modal.css('display', 'block');

        // Dividing by two centers the modal exactly, but dividing by three
        // or four works better for larger screens.
        dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
    }

    // Reposition when a modal is shown
    $('.modal').on('show.bs.modal', reposition);
    // Reposition when the window is resized
    $(window).on('resize', function () {
        $('.modal:visible').each(reposition);
    });
});

// Detect browser
var Browser = {
    isIE: function () {
        return /*@cc_on!@*/false || !!document.documentMode;
    },
    isFirefox: function () {
        return typeof InstallTrigger !== 'undefined';
    },
    isChrome: function () {
        return !!window.chrome && /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor) && !/OPR/.test(navigator.userAgent);
    },
    isEdge: function () {
        return !isIE && !!window.StyleMedia;
    },
    isOpera: function () {
        return (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    },
    isiOS: function () {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    },
    isSafari: function () {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    },
    isAndroid: function () {
        return navigator.userAgent.toLowerCase().indexOf("android") > -1;
    },
    isSafariWebRTC: function () {
        return navigator.mediaDevices && Browser.isSafari();
    }
};

/**
 * Generate simple uuid
 *
 * @param length UUID length
 * @returns {string}
 */
function createUUID(length) {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");

    return uuid.substring(0, length);
}

/**
 * Resize video object to fit parent div.
 * Div structure: div WxH -> div wrapper (display) -> video
 * @param video HTML element from resize event target
 */
function resizeVideo(video, width, height) {
    if (!video.parentNode) {
        return;
    }
    if (video instanceof HTMLCanvasElement) {
        video.videoWidth = video.width;
        video.videoHeight = video.height;
    }
    var display = video.parentNode;
    var parentSize = {
        w: display.parentNode.clientWidth,
        h: display.parentNode.clientHeight
    };
    var newSize;
    if (width && height) {
        newSize = downScaleToFitSize(width, height, parentSize.w, parentSize.h);
    } else {
        newSize = downScaleToFitSize(video.videoWidth, video.videoHeight, parentSize.w, parentSize.h);
    }
    display.style.width = newSize.w + "px";
    display.style.height = newSize.h + "px";

    //vertical align
    var margin = 0;
    if (parentSize.h - newSize.h > 1) {
        margin = Math.floor((parentSize.h - newSize.h) / 2);
    }
    display.style.margin = margin + "px auto";
    console.log("Resize from " + video.videoWidth + "x" + video.videoHeight + " to " + display.offsetWidth + "x" + display.offsetHeight);
}


function downScaleToFitSize(videoWidth, videoHeight, dstWidth, dstHeight) {
    var newWidth, newHeight;
    var videoRatio = videoWidth / videoHeight;
    var dstRatio = dstWidth / dstHeight;
    if (dstRatio > videoRatio) {
        newHeight = dstHeight;
        newWidth = Math.floor(videoRatio * dstHeight);
    } else {
        newWidth = dstWidth;
        newHeight = Math.floor(dstWidth / videoRatio);
    }
    return {
        w: newWidth,
        h: newHeight
    };
}

/**
 * Set Webkit fullscreen handler functions to video tag
 *
 * @param video
 */
function setWebkitFullscreenHandlers(video, startFullScreen = true) {
    if (video) {
        let needRestart = false;
        let wasFullscreen = false;
        // iOS hack when using standard controls to leave fullscreen mode
        video.addEventListener("pause", function () {
            if (needRestart) {
                console.log("Video paused after fullscreen, continue...");
                wasFullscreen = true;
                video.play();
                needRestart = false;
            }
        });
        video.addEventListener("webkitendfullscreen", function () {
            wasFullscreen = true;
            video.play();
            needRestart = true;
        });
        if (startFullScreen) {
            // Start playback in fullscreen if webkit-playsinline is set
            video.addEventListener("playing", function () {
                // Do not enter fullscreen again if we just left it #WCS-3860
                if (canWebkitFullScreen(video) && !wasFullscreen) {
                    // We should catch if fullscreen mode is not available
                    try {
                        video.webkitEnterFullscreen();
                    } catch (e) {
                        console.log("Fullscreen is not allowed: " + e);
                    }
                }
                wasFullscreen = false;
            });
        }
    } else {
        console.log("No video tag is passed, skip webkit fullscreen handlers setup");
    }
}

/**
 * Check if fullscreen mode is available in Webkit
 *
 * @param video
 * @returns {boolean}
 */
function canWebkitFullScreen(video) {
    let canFullscreen = false;
    if (video) {
        canFullscreen = video.webkitSupportsFullscreen && !video.webkitDisplayingFullscreen;
    }
    return canFullscreen;
}

/**
 * Helper function to set item text
 *
 * @param id
 * @param text
 */
const setText = function (id, text) {
    let item = document.getElementById(id);
    if (item) {
        item.innerHTML = text;
    }
}

/**
 * Helper function to set an item value
 *
 * @param id
 * @param value
 */
const setValue = function (id, value) {
    let item = document.getElementById(id);
    if (item) {
        item.value = value;
    }
}

/**
 * Helper function to get an item value
 *
 * @param id
 * @returns value
 */
const getValue = function (id) {
    let item = document.getElementById(id);
    if (item) {
        return item.value;
    }
    return null;
}

/**
 * Helper function to set/unset a checkbox
 *
 * @param id
 * @param value
 */
const setCheckbox = function (id, value) {
    let item = document.getElementById(id);
    if (item) {
        item.checked = value;
    }
}

/**
 * Helper function to get a checkbox state
 *
 * @param id
 * @returns value
 */
const getCheckbox = function (id) {
    let item = document.getElementById(id);
    if (item) {
        return item.checked;
    }
    return null;
}


/**
 * Helper function to display an item
 *
 * @param id
 */
const showItem = function(id) {
    let item = document.getElementById(id);
    if (item) {
        item.style.display = "block";
    }
}

/**
 * Helper function to hide an item
 *
 * @param id
 */
const hideItem = function(id) {
    let item = document.getElementById(id);
    if (item) {
        item.style.display = "none";
    }
}

/**
 * Helper function to disable an item
 *
 * @param id
 */
const disableItem = function(id) {
    let item = document.getElementById(id);
    if (item) {
        item.disabled = true;
    }
}

/**
 * Helper function to enable an item
 *
 * @param id
 */
const enableItem = function(id) {
    let item = document.getElementById(id);
    if (item) {
        item.disabled = false;
    }
}

/**
 * Set an event handler
 *
 * @param id
 * @param event
 * @param handler
 * @param previous
 */
const setHandler = function (id, event, handler, previous = null) {
    let item = document.getElementById(id);
    if (item) {
        if (previous) {
            item.removeEventListener(event, previous)
        }
        item.addEventListener(event, handler);
    }
}

/**
 * Find a closest item
 *
 * @param id
 * @param selector
 * @returns {null}
 */
const closest = function (id, selector) {
    let currentElement = document.getElementById(id);
    let returnElement = null;

    while (currentElement && currentElement.parentNode && !returnElement) {
        currentElement = currentElement.parentNode;
        returnElement = currentElement.querySelector(selector);
    }

    return returnElement;
}

/**
 * Display object properties fro debugging purposes
 *
 * @param object
 */
const showProps = function (object) {
    console.log("-------------------------------object begin");
    for (const property in object) {
        console.log(`${property}: ${object[property]}`);
    }
    console.log("-------------------------------object end");

}