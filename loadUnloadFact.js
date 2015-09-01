app.factory('loadUnloadFact', function($rootScope) {
    var colCalc = function(item, colInfo) {
        if (colInfo.rgb == 'rgb' || colInfo.rgb == 'hsv') {
            theShade = Math.floor(Math.abs(colInfo.spec * (item - 15)) + parseInt(colInfo.val - (colInfo.spec / 2)));
            theTrans = 1 - (colInfo.trans / 100);
            return 'hsla(' + colInfo.hue + ',' + colInfo.sat + '%,' + theShade + '%,' + theTrans + ')';
        } else {
            return 'url(' + colInfo.img + ')';
        }
    };
    var capSegs = function(type, color, p, r, pos, h) {
        pos = parseInt(pos);
        r = parseInt(r);
        h = parseInt(h);
        //type = 1 for cone, 2 for cyl
        for (var q = 0; q < type; q++) {
            var capEl = document.createElement('div');
            capEl.className = 'cap';
            capEl.style.height = 2 * r + 'px';
            capEl.style.width = 2 * r + 'px';
            var zTrans = 0;
            if (q) {
                zTrans = pos - h;
            } else {
                zTrans = pos;
            }
            capEl.style.transform = 'rotateX(90deg) translateX(-45%) translateZ(' + zTrans + 'px)';
            var col = colCalc(q, color);
            capEl.style.background = col;
            color.gloPow ? capEl.style.boxShadow = '0 0 ' + color.gloPow + 'px ' + col : capEl.style.boxShadow = 'none';
            $('#' + p).append(capEl);
        }
    };
    return {
        createCircle: function(x, y, r, h, d, p, rX, rY, rZ, color, idInfo, cap) {
            //this function creates a cylinder at position x,y
            //with radius r, height h, and parent element with id p.
            //the circle has default color 'color'(an hsl object), and is rotated
            //along rX, rY, and rZ
            //idInfo is any additional info that is passed along as id

            //construct parent ele
            var circCont = document.createElement('div');
            circCont.className = 'circleContainer';
            var id = 'circParent' + (idInfo || '');
            circCont.id = id;
            circCont.style.left = x + 'px';
            circCont.style.top = y + 'px';
            $(p).append(circCont);

            if (cap.isCapped) {
                capSegs(2, color, circCont.id, r, cap.pos, h);
            }
            //construct cylinder segs
            for (var i = 0; i < 30; i++) {
                var el = document.createElement('div');
                el.className = 'circlePiece';
                el.style.height = h + 'px';
                //calculate width of each segment 
                var width = Math.ceil((2 / 30) * Math.PI * r);
                el.style.width = width + 1 + 'px';
                //position
                el.style.transform = 'rotateY(' + i * 12 + 'deg) translateZ(' + r + 'px)';
                //and finally color. this bit 'shades' the cylinder so that it's easier to see that it's 3d.
                var col = colCalc(i, color);
                el.style.background = col;
                color.gloPow ? el.style.boxShadow = '0 0 ' + color.gloPow + 'px ' + col : el.style.boxShadow = 'none';
                $('#' + circCont.id).append(el);
            }

            //now rotate parent ele.
            $('#' + circCont.id).css('transform', 'rotateX(' + rX + 'deg) rotateY(' + rY + 'deg) rotateZ(' + rZ + 'deg)');
            return id;
        },
        createCube: function(x, y, w, h, d, p, rX, rY, rZ, color, idInfo) {
            //creates a rectangular prism at position x,y
            //width w, height h, depth d, rotation along all three axes rX, rY, rZ,  
            //construct parent ele
            var boxCont = document.createElement('div');
            boxCont.className = 'boxContainer';
            var id = 'boxParent' + (idInfo || '');
            boxCont.id = id;
            boxCont.style.left = x + 'px';
            boxCont.style.top = y + 'px';
            $(p).append(boxCont);
            //construct cylinder segs
            for (var i = 0; i < 6; i++) {
                var el = document.createElement('figure');
                el.className = 'boxPiece';
                //each face gets its own special position and size data. How special.
                if (i == 0) {
                    //top
                    el.style.top = ((h - d) / 2) + 'px';
                    el.style.width = w + 'px';
                    el.style.height = d + 'px';
                    el.style.transform = 'rotateX(90deg) translateZ(' + (h / 2) + 'px)';
                } else if (i == 1) {
                    //bottom
                    el.style.top = ((h - d) / 2) + 'px';
                    el.style.width = w + 'px';
                    el.style.height = d + 'px';
                    el.style.transform = 'rotateX(-90deg) translateZ(' + (h / 2) + 'px)';
                } else if (i == 2) {
                    //left
                    el.style.left = ((w - d) / 2) + 'px';
                    el.style.width = d + 'px';
                    el.style.height = h + 'px';
                    el.style.transform = 'rotateY(-90deg) translateZ(' + (w / 2) + 'px)';
                } else if (i == 3) {
                    //right
                    el.style.left = ((w - d) / 2) + 'px';
                    el.style.width = d + 'px';
                    el.style.height = h + 'px';
                    el.style.transform = 'rotateY(90deg) translateZ(' + (w / 2) + 'px)';
                } else if (i == 4) {
                    //front
                    el.style.width = w + 'px';
                    el.style.height = h + 'px';
                    el.style.transform = 'rotateX(0deg) translateZ(' + (d / 2) + 'px)';
                } else {
                    //back
                    el.style.width = w + 'px';
                    el.style.height = h + 'px';
                    el.style.transform = 'rotateX(180deg) translateZ(' + (d / 2) + 'px)';
                }

                //and finally color. this bit 'shades' the box so that it's easier to see that it's 3d.
                var col = colCalc(i, color);
                el.style.background = col;
                color.gloPow ? el.style.boxShadow = '0 0 ' + color.gloPow + 'px ' + col : el.style.boxShadow = 'none';
                $('#' + id).append(el);
            }
            //now rotate parent ele.
            $('#' + id).css('transform', 'rotateX(' + rX + 'deg) rotateY(' + rY + 'deg) rotateZ(' + rZ + 'deg)');
            return id;
        },
        createCone: function(x, y, r, h, d, p, rX, rY, rZ, color, idInfo, cap) {

            //this function creates a cone at position x,y
            //with radius r, height h, and parent element with id p.
            //the cone has default color 'color'(an hsl object), and is rotated
            //along rX, rY, and rZ
            //idInfo is any additional info that is passed along as id

            //construct parent ele
            var coneCont = document.createElement('div');
            coneCont.className = 'coneContainer';
            var id = 'coneParent' + (idInfo || '');
            coneCont.id = id;
            coneCont.style.left = x + 'px';
            coneCont.style.top = y + 'px';
            $(p).append(coneCont);
            if (cap.isCapped) {
                capSegs(1, color, coneCont.id, r, cap.pos, h);
            }
            //construct cone segs
            for (var i = 0; i < 30; i++) {
                var el = document.createElement('div');
                el.className = 'conePiece';
                el.style.borderBottom = h + 'px solid black';
                //calculate width of each segment 
                var width = Math.ceil((2 / 30) * Math.PI * r) / 2;
                //position, tilt
                var segRot = Math.ceil(180 * Math.atan(r / h) / Math.PI);
                el.style.transform = 'rotateY(' + i * 12 + 'deg) translateZ(' + r + 'px) rotateX(' + segRot + 'deg)';
                //and finally color. this bit 'shades' the cone so that it's easier to see that it's 3d.
                var col = colCalc(i, color);
                var segHeight = Math.ceil(Math.sqrt(Math.pow(h, 2) + Math.pow(r, 2)));
                el.style.borderBottom = segHeight + 'px solid ' + col;
                el.style.borderLeft = width + 1 + 'px solid transparent';
                el.style.borderRight = width + 1 + 'px solid transparent';
                el.style.boxShadow = 'none';
                $('#' + coneCont.id).append(el);
            }
            //now rotate parent ele.
            $('#' + coneCont.id).css('transform', 'rotateX(' + rX + 'deg) rotateY(' + rY + 'deg) rotateZ(' + rZ + 'deg)');
            return id;
        },
        hslToRgb: function(h, s, l) {
            var r, g, b;
            h = h / 360;
            s = s / 100;
            l = l / 100;

            if (s == 0) {
                r = g = b = l; // achromatic
            } else {
                var hue2rgb = function hue2rgb(p, q, t) {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                }

                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }
            r = Math.round(r * 255);
            g = Math.round(g * 255);
            b = Math.round(b * 255);
            return [r, g, b];
        },
        rgbToHsl: function(r, g, b) {
            r /= 255, g /= 255, b /= 255;
            var max = Math.max(r, g, b),
                min = Math.min(r, g, b);
            var h, s, l = (max + min) / 2;

            if (max == min) {
                h = s = 0; // achromatic
            } else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    case b:
                        h = (r - g) / d + 4;
                        break;
                }
                h /= 6;
            }
            h *= 360;
            s *= 100;
            l *= 100;
            return [h, s, l];
        },
        changeTit: function(tit) {
            //change the page title.
            var t = setTimeout(function() {
                document.title = tit;
            }, 1000);
        },
        custMoveDo: function(arr, x, y) {
                //normalize X and Y;
            x = (100 * x / $(window).width()) - 50;
            y = (100 * y / $(window).height()) - 50;
            for (var n = 0; n < arr.length; n++) {
                console.log(arr[n].custMove.active)
                if (arr[n].custMove.active) {
                    //ignore all the following if this isn't active;
                    //construct obj's id
                    var theId = '#';
                    if (arr[n].objType == 0) {
                        theId += 'boxParent' + arr[n].idInfo;
                    } else if (arr[n].objType == 1) {
                        theId += 'circParent' + arr[n].idInfo;
                    } else {
                        theId += 'coneParent' + arr[n].idInfo;
                    }
                    //calc total X, Y, Z rotation
                    //start by setting all 3 to their stored vals
                    var totalRots = {
                        x: arr[n].rX,
                        y: arr[n].rY,
                        z: arr[n].rZ
                    }
                    var adjX = x * arr[n].custMove.xMag;
                    var adjY = y * arr[n].custMove.yMag;
                    //x takes precedence 
                    if (arr[n].custMove.xCont != 'none') {
                        totalRots[arr[n].custMove.xCont] += adjX;
                    }
                    //xControl takes precendence, so if both X and Y are set to control the same thing, X moves, while y is effectively set to 'none'
                    if (arr[n].custMove.yCont != 'none' && arr[n].custMove.xCont != arr[n].custMove.yCont) {
                        totalRots[arr[n].custMove.yCont] += adjY;
                    }
                    //adjust as per the x,y mouse vals
                    console.log(totalRots);
                    $(theId).css('transform', 'rotateX(' + totalRots.x + 'deg) rotateY(' + totalRots.y + 'deg) rotateZ(' + totalRots.z + 'deg)');
                }
            }
        }
    };
});
