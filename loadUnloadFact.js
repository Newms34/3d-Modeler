app.factory('loadUnloadFact', function($rootScope) {
    return {
        createCircle: function(x, y, r, h, d, p, rX, rY, rZ, color, idInfo) {
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
                var colCalc = Math.floor(Math.abs(i - 15) + parseInt(color.val));
                var col = 'hsl(' + color.hue + ',' + color.sat + '%,' + colCalc + '%)';
                el.style.backgroundColor = col;
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

                //and finally color. this bit 'shades' the cylinder so that it's easier to see that it's 3d.
                var colCalc = Math.floor(Math.abs(i - 15) + parseInt(color.val));
                var col = 'hsl(' + color.hue + ',' + color.sat + '%,' + colCalc + '%)';
                el.style.backgroundColor = col;
                $('#' + id).append(el);
            }
            //now rotate parent ele.
            $('#' + id).css('transform', 'rotateX(' + rX + 'deg) rotateY(' + rY + 'deg) rotateZ(' + rZ + 'deg)');
            return id;
        },
        createCone: function(x, y, r, h, d, p, rX, rY, rZ, color, idInfo) {
        
            //this function creates a cone at position x,y
            //with radius r, height h, and parent element with id p.
            //the cone has default color 'color'(an hsl object), and is rotated
            //along rX, rY, and rZ
            //idInfo is any additional info that is passed along as id

            //construct parent ele
            var coneCont = document.createElement('div');
            coneCont.className = 'coneContainer';
            console.log(idInfo)
            var id = 'coneParent' + (idInfo || '');
            coneCont.id = id;
            coneCont.style.left = x + 'px';
            coneCont.style.top = y + 'px';
            $(p).append(coneCont);
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
                //and finally color. this bit 'shades' the cylinder so that it's easier to see that it's 3d.
                var colCalc = Math.floor(Math.abs(i - 15) + parseInt(color.val));
                var col = 'hsl(' + color.hue + ',' + color.sat + '%,' + colCalc + '%)';
                var segHeight = Math.ceil(Math.sqrt(Math.pow(h, 2) + Math.pow(r, 2)));
                el.style.borderBottom = segHeight + 'px solid ' + col;
                el.style.borderLeft = width + 1 + 'px solid transparent';
                el.style.borderRight = width + 1 + 'px solid transparent';
                $('#' + coneCont.id).append(el);
            }
            //now rotate parent ele.
            $('#' + coneCont.id).css('transform', 'rotateX(' + rX + 'deg) rotateY(' + rY + 'deg) rotateZ(' + rZ + 'deg)');
            return id;
        }
    };
});
