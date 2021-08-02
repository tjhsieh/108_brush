    //DELETED CODE IN 0719 VER

    //NEXT: SCALE BAR + BEZIER CURVE + MORE GRADIENT

    var svg, flag, board, drawOutput, 
        timeFunc, pos_diff,
        transform, angle, style, fill, cx, cy, defaultAngle = 180,  
        totalDist, totalPathDist, prevDist, currDist, distToFill = 15, 
        currT, t_increment, t_increment_ratio = 0.2,
        baseScale = 1, scaleIncRate = 0.02, scaleDecRate = 0.02, scaleDecCond = 6,
        mainFill = "url(#gradient_light_grey)", lastFill = "url(#gradient_dark_grey)",
        p0, p1, p2, ctrlPt, ptToFill, prevFill,
        dropletBox, circleBox, spikeBox,
        currBox, currBrush, brushBBox = {first:"", mid:"", last:""}, selectedBrush = {first:"", mid:"", last:""}, 
        prevDots = [],
        timeDots = [],
        prevX = 0,
        currX = 0,
        prevY = 0,
        currY = 0,
        scaleRatio = baseScale,
        use_id=1;
        dot_flag = false;

    var custom_brush_id = "custom_brush";

    // var brushes = {circle:"circle", droplet1:"droplet_1", droplet2:"droplet_spike", brush1:"brush_1"};

    var x = "black",
        y = 2;

    function refreshBrushBoundingBox(){
        $.each(selectedBrush, function(index, value){
            brushBBox[index] = $("#"+selectedBrush[index]).get(0).getBBox();
        });
        // console.log(selectedBrush);
        // console.log(brushBBox);
    }

    function init() {
        console.log("init");
        svg = document.getElementById('mainSVG');
        board = document.getElementById('mainboard');
        w = svg.width;
        h = svg.height;
        $.each(selectedBrush, function(index, value) {
            selectedBrush[index] = "brush_1";
        }); 
        refreshBrushBoundingBox();
        // $(".sample").hide();

        svg.addEventListener("mousemove", function (e) {
            findxy('move', e)
        }, false);
        svg.addEventListener("mousedown", function (e) {
            findxy('down', e)
        }, false);
        svg.addEventListener("mouseup", function (e) {
            findxy('up', e)
        }, false);
        svg.addEventListener("mouseout", function (e) {
            findxy('out', e)
        }, false);
    }

    function brushSelect(brush_type, value){
        selectedBrush[brush_type] = value;
        refreshBrushBoundingBox();
    }

    function findxy(res, e) {
        if (res == 'down') {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - board.offsetLeft;
            currY = e.clientY - board.offsetTop;

            timeFunc = setInterval(function(){
                timeDots.push({x: currX, y: currY});
                if (timeDots.length>10){
                    timeDots.shift();
                }

                if (timeDots.length>=2){
                    pos_diff = getDistance(timeDots[timeDots.length-1].x, timeDots[timeDots.length-1].y, timeDots[timeDots.length-2].x, timeDots[timeDots.length-2].y);
                    pos_diff = Math.pow(pos_diff, 0.5);
                    if (pos_diff==0){
                        scaleRatio += scaleIncRate;
                        draw("curr", false, "timeFunc");
                        // console.log("scaleRatio: " +scaleRatio);
                    }else if (pos_diff > scaleDecCond){
                        // console.log(Math.pow(pos_diff,0.5));
                        scaleRatio -= pos_diff * scaleDecRate;
                        if (scaleRatio < baseScale){
                            scaleRatio = baseScale;
                        }
                    }
                }
                pos_diff = 0;
            }, 20);
            // console.log(timeFunc);

            flag = true;
            dot_flag = true;
            if (dot_flag) {
                draw("first", true, res);
            }
        }
        // if (res == 'up' || res == "out") {
        if (res == 'up') {
            flag = false;
            // console.log(res);
            // draw("droplet_circle_spike", false);
            draw("last", false, res);
            clearInterval(timeFunc);
            prevDots = [];
            timeDots = [];
            scaleRatio = baseScale;
        }
        if (res == 'move') {
            if (flag) {
                prevX = currX;
                prevY = currY;
                currX = e.clientX - board.offsetLeft;
                currY = e.clientY - board.offsetTop;
                draw("mid", true, res);
            }
        }
    }

    function findBezierControlPt(p0x, p0y, p1x, p1y, p2x, p2y, t){
        var cpx = ( p1x - p0x*Math.pow(1-t, 2) - p2x*Math.pow(t, 2) ) / (2*(1-t)*t) ;
        var cpy = ( p1y - p0y*Math.pow(1-t, 2) - p2y*Math.pow(t, 2) ) / (2*(1-t)*t) ;
        return {x: cpx, y: cpy};
    }

    function getPtInBezier(p0x, p0y, p2x, p2y, cpx, cpy, t){
        var p1x = p0x*Math.pow(1-t, 2) + 2*cpx*(1-t)*t + p2x*Math.pow(t, 2);
        var p1y = p0y*Math.pow(1-t, 2) + 2*cpy*(1-t)*t + p2y*Math.pow(t, 2);
        return {x: p1x, y: p1y};
    }

    function draw(pos, moveFlag, callBy) {
        transform = "";
        style = "";
        test = "";
        fill = mainFill;

        if (pos!="curr" && callBy!="fill"){
            currBrush = selectedBrush[pos];
            currBox = brushBBox[pos];
        }

        if (pos=="fill_demo"){
            currBox = $("#circle_red").get(0).getBBox();
            currBrush = "circle_red";
        }

        if (callBy=="fill"){
            cx= ptToFill.x + (currBox.width/2);
            cy= ptToFill.y + (currBox.height/2);   // finding center of element
            angle = getAngle(prevFill.x, prevFill.y, ptToFill.x, ptToFill.y);
        }else{
            cx= currX + (currBox.width/2);
            cy= currY + (currBox.height/2);   // finding center of element
            prevDots.length>=3 ? angle = getAngle(prevDots[0].x, prevDots[0].y, currX, currY) : angle = defaultAngle;
        }

        transform = 'translate('+ -currBox.width/2 +', '+ -currBox.height/2 +') ';
        transform += 'rotate('+ angle +','+ cx +', '+ cy +') ';
        if (pos=="last" && prevDots.length >= 5){
            transform += 'translate(0,-8) ';
            fill = lastFill;
            $("#drawboard #"+use_id-1).remove();
        }

        // console.log(scaleRatio);
        transform += 'translate('+ -cx*(scaleRatio-1) +', '+ -cy*(scaleRatio-1) +') ';
        transform += 'scale('+ scaleRatio +') ';
        if (callBy=="fill"){
            drawOutput = '<use id="d_' +use_id+ '" class="d1_2 test" fill="'+ fill +'" xlink:href="#'+ currBrush +'" x="'+ ptToFill.x +'" y="'+ ptToFill.y +'" transform="'+ transform +'" style="'+ style +'"/>';
        }else{
            drawOutput = '<use id="d_' +use_id+ '" class="d1_2 test" fill="'+ fill +'" xlink:href="#'+ currBrush +'" x="'+ currX +'" y="'+ currY +'" transform="'+ transform +'" style="'+ style +'"/>';
        }
        use_id += 1;
        // console.log(drawOutput);
        if (callBy=="fill"){
            prevDots.push({x: ptToFill.x, y: ptToFill.y});
            if (prevDots.length>10){
                prevDots.shift();
            }
        }

        if (prevDots.length>=1 && moveFlag==1){
            currDist = getDistance(prevDots[prevDots.length-1].x, prevDots[prevDots.length-1].y, currX, currY);
        }else{
            cirrDist = 0;
        }
        if (moveFlag){
            if (currDist>=distToFill && prevDots.length>=6){
                p0 = prevDots[prevDots.length-6];
                p1 = prevDots[prevDots.length-1];
                p2 = {x:currX, y:currY};
                prevDist = getDistance(p0.x, p0.y, p1.x, p1.y);
                totalDist = getDistance(p2.x, p2.y, p0.x, p0.y);
                totalPathDist = prevDist + getDistance(p1.x, p1.y, p2.x, p2.y);
                currT = prevDist / totalPathDist;

                ctrlPt = findBezierControlPt(p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, currT);
                t_increment = (distToFill/currDist) * (1-currT)*t_increment_ratio;
                // console.log(t_increment);
                prevFill = p1;

                while (currT<1){
                    currT += t_increment;
                    ptToFill = getPtInBezier(p0.x, p0.y, p2.x, p2.y, ctrlPt.x, ctrlPt.y, currT);
                    draw("fill", false, "fill");
                    // draw("fill_demo", false, "fill");
                    prevFill = ptToFill;
                }
                // $("#circle").attr("fill")=="red" ? $("#circle").attr("fill", "blue") : $("#circle").attr("fill", "red");
            }
            prevDots.push({x: currX, y: currY});
            if (prevDots.length>10){
                prevDots.shift();
            }
        }
        if (pos=="last" && prevDots.length < 5){
            drawOutput = "";
        }
        $("#drawboard").append(drawOutput);
        $("#drawboard").html($("#drawboard").html());
    }

    function getAngle (x1, y1, x2, y2) {
        // console.log({x1,y1,x2,y2});
        res = Math.degrees(Math.atan2(y2 - y1, x2 - x1));
        res = (res + 360) % 360;
        res<270 ? res+=90 : res-=270;
        return res; //return angle in degrees
    }

    function erase(elem) {
        elem.empty();
        use_id = 1;
    }