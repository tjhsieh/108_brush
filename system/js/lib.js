
function saveSVG($svg){
    var $newSVG = $svg.clone(true).appendTo("body");
    $newSVG.find("#sample_group").remove();
    $newSVG.css("display", "none");
    $newSVG = loopSVG($newSVG);
    // console.log($newSVG.html());
    // $("#output").append($newSVG.prop("outerHTML"));
    $newSVG.css("display", "initial");
    download($newSVG.prop("outerHTML"), "output.svg", "image/svg");
    $newSVG.remove();
}


function loopSVG($svg){

    var css = getCSS($svg);
    var value = "";
    if (typeof css!="undefined" && css!="undefined"){
        for (var key in css){
            value += key + ": " + css[key] + ";";
        }
    }
    var inline = $svg.attr('style');
    if (typeof inline!="undefined" && inline!="undefined" && inline!=""){
        value += inline;
        if (inline[inline.length -1]!=";"){
            value += ";";
        }
    }
    $svg.attr('style', value);

    if ($svg.children().length > 0){
        var children = $svg.children();

        for (var i=0; i < children.length; i++){
            var child = children[i];
            // console.log(child);
            value = loopSVG($(child)).attr('style');
            $(child).attr('style', value);
        }
    }

    return $svg;
}


function getCSS(a) {
    var sheets = document.styleSheets, o = {};
    for (var i in sheets) {
            var rules = sheets[i].rules || sheets[i].cssRules;
            for (var r in rules) {
                if (a.is(rules[r].selectorText)) {
                    o = $.extend(o, css2json(rules[r].style), css2json(a.attr('style')));
                }
            }
    }
    return o;
}

function css2json(css) {
    var s = {};
    if (!css) return s;
    if (css instanceof CSSStyleDeclaration) {
        for (var i in css) {
            if ((css[i]).toLowerCase) {
                s[(css[i]).toLowerCase()] = (css[css[i]]);
            }
        }
    } else if (typeof css == "string") {
        css = css.split("; ");
        for (var i in css) {
            var l = css[i].split(": ");
            s[l[0].toLowerCase()] = (l[1]);
        }
    }
    return s;
}

Math.degrees = function(radians) {
    return radians*(180/Math.PI);
}

function getDistance(x1, y1, x2, y2){
    return Math.pow( (Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2)), 0.5 );
}

// function rotate(x,y){
//     newX = centerX + (point2x-centerX)*Math.cos(x) - (point2y-centerY)*Math.sin(x);
//     newY = centerY + (point2x-centerX)*Math.sin(x) + (point2y-centerY)*Math.cos(x);

// }

// function rotatedBBox (iX, iY, iAngle) {
//     var x, y, bx, by, t;

//     //# Allow for negetive iAngle's that rotate counter clockwise while always ensuring iAngle's < 360
//     t = ((iAngle < 0 ? 360 - iAngle : iAngle) % 360);

//     //# Calculate the width (bx) and height (by) of the .boundingBox
//     //#     NOTE: See https://stackoverflow.com/questions/3231176/how-to-get-size-of-a-rotated-rectangle
//     bx = (iX * Math.sin(iAngle) + iY * Math.cos(iAngle));
//     by = (iX * Math.cos(iAngle) + iY * Math.sin(iAngle));

//     //# This part is wrong, as it's re-calculating the iX/iY of the rotated element (blue)
//     //# we want the x/y of the bounding box (red)
//     //#     NOTE: See https://stackoverflow.com/questions/9971230/calculate-rotated-rectangle-size-from-known-bounding-box-coordinates
//     x = (1 / (Math.pow(Math.cos(t), 2) - Math.pow(Math.sin(t), 2))) * (bx * Math.cos(t) - by * Math.sin(t));
//     y = (1 / (Math.pow(Math.cos(t), 2) - Math.pow(Math.sin(t), 2))) * (-bx * Math.sin(t) + by * Math.cos(t));

//     //# Return an object to the caller representing the x/y and width/height of the calculated .boundingBox
//     return {
//         x: parseInt(x), width: bx,
//         y: parseInt(y), height: by
//     }
// };
