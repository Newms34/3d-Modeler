var app = angular.module("treeTest", []);

app.controller("MainController", function($scope, $window, $compile) {
    $scope.adding = false;
    $scope.moveEm = false;
    $scope.nameConf = false;
    $scope.loading = false; //loading window not shown
    $scope.saving
    $scope.rem = false;
    $scope.totals = {};
    $scope.saveTxt = '';
    $scope.toggleWind = function(which) {
        if (!which) {
            //show add form
            $('#mainTree').html('');
            $scope.rem = false;
            $scope.loading = false;
            $scope.saving = false;
            $scope.adding ? $scope.adding = false : $scope.adding = true;
        } else {
            //show tree/rem form
            $scope.adding = false;
            $scope.loading = false;
            $scope.saving = false;
            $scope.totals = {};
            $scope.scanForKids('main');
            $scope.rem ? $scope.rem = false : $scope.rem = true;
            console.log('whole tree', $scope.objs)
            if ($scope.rem) {
                $scope.drawTree('main');
            } else {
                $('#mainTree').html('');
            }
        }

    }
    $scope.objs = [];
    //uncomment the following for testing
    // $scope.objs = [{
    //     idInfo: "circParentderp1",
    //     par: '#main'
    // }, {
    //     idInfo: "circParentderp2",
    //     par: '#main'
    // }, {
    //     idInfo: "circParentbeans1",
    //     par: '#circParentderp1'
    // }, {
    //     idInfo: "circParentbeans2",
    //     par: '#circParentderp1'
    // }, {
    //     idInfo: "circParentmeh",
    //     par: '#circParentbeans2'
    // }]

    $scope.parentList = []; //list of parent objects
    $scope.parentList.push($('#main'));
    $scope.objForm = {};
    $scope.objForm.color = {
        "hue": 0.05,
        "sat": 0.05,
        "val": 0.05
    }
    $scope.objConst = function(x, y, radWid, h, d, par, rX, rY, rZ, color, idInfo, isCube) {
        //constructor for objects.
        this.x = x; //xpos
        this.y = y; //ypos
        this.radWid = radWid; //radius or width
        this.h = h; //height
        this.d = d; //depth (cube only)
        this.par = par; //parent element(jquery)
        this.rX = rX; //pitch
        this.rY = rY; //roll
        this.rZ = rZ; //yaw
        this.color = color; //color obj ({hue, sat, val})
        this.idInfo = idInfo; //obj's id
        this.isCube = isCube; //boolean
    }
    $scope.makeObj = function(frm) {
        frm.d = frm.d || 0;
        frm.idInfoObj = (frm.isCube ? 'boxParent' : 'circParent') + frm.idInfo;
        $scope.objs.push(new $scope.objConst(frm.x, frm.y, frm.radWid, frm.h, frm.d, frm.parent, frm.rX, frm.rY, frm.rZ, frm.color, frm.idInfoObj, frm.isCube));
        if (frm.isCube) {
            //x, y, w, h, d, p, rX, rY, rZ, color, idInfo
            $scope.createCube(frm.x, frm.y, frm.radWid, frm.h, frm.d, frm.parent, frm.rX, frm.rY, frm.rZ, frm.color, frm.idInfo);
        } else {
            $scope.createCircle(frm.x, frm.y, frm.radWid, frm.h, frm.parent, frm.rX, frm.rY, frm.rZ, frm.color, frm.idInfo);
        }
        console.log('objs:', $scope.objs)
    }
    $scope.createCircle = function(x, y, r, h, p, rX, rY, rZ, color, idInfo) {
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
            console.log('col obj', color)
            console.log('col for this', col, i, colCalc);
            el.style.backgroundColor = col;
            $('#' + circCont.id).append(el);
        }
        //now rotate parent ele.
        $('#' + circCont.id).css('transform', 'rotateX(' + rX + 'deg) rotateY(' + rY + 'deg) rotateZ(' + rZ + 'deg)');
        $scope.parentList.push($('#' + id));
        $scope.nameConf = false;
        $scope.objForm = {};
    }
    $scope.createCube = function(x, y, w, h, d, p, rX, rY, rZ, color, idInfo) {
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
        $scope.parentList.push($('#' + id));
        $scope.objForm = {};
    }
    window.onmousemove = function(e) {
        if ($scope.moveEm) {
            $('#main').css('transform', 'rotateX(' + e.y + 'deg) rotateY(' + e.x + 'deg)');
        }
    }
    $scope.scanForKids = function(par) {
        //function uses a given parent name to scan for 'kids' of that parent.
        //it then recursively scans each kid to get ITS number of descendents.
        par = '#' + par;
        var total = 0;
        var kidsToScan = []; //list of kids to recurse thru
        if (!$scope.totals[par]) {
            $scope.totals[par] = 0;
        }
        $scope.objs.forEach(function(elToCheck) {
            if (elToCheck.par == par) {
                //is a child
                $scope.totals[par]++;
                kidsToScan.push(elToCheck.idInfo);
            }
        });
        kidsToScan.forEach(function(el) {
            $scope.scanForKids(el);
        })
    }
    $scope.checkUnUsed = function(item) {
        //prevents two objects from having the same name 
        $scope.nameConf = false;
        $('#makeButt').removeAttr('disabled')
        for (var q = 0; q < $scope.objs.length; q++) {
            if ($scope.objs[q].idInfo == ('circParent' + item) || $scope.objs[q].idInfo == ('boxParent' + item)) {
                $scope.nameConf = true;
                $('#makeButt').attr('disabled', 'true');
            }
        }
        if (item == 'main') {
            $scope.nameConf = true;
            $('#makeButt').attr('disabled', 'true');
        }
    }
    $scope.drawTree = function(par) {
        //first one will be main+Tree, or #mainTree. If this is first one, clear it
        if (par == 'main') {
            $('#mainTree').html('');
        }
        //now deal with dem rowdy kidz
        var kidsToScan = []; //list of kids to recurse thru
        $scope.objs.forEach(function(elToCheck) {
            if (elToCheck.par == '#' + par) {
                //is a child
                kidsToScan.push(elToCheck.idInfo);
            }
        });
        kidsToScan.forEach(function(elToTree) {
            //tree the elements
            var parentTargId = par + 'Tree';
            var el = document.createElement('div');
            el.className = 'treeEl';
            el.id = elToTree + 'Tree';
            //make closeButton
            var closeBut = document.createElement('div');
            closeBut.className = 'btn btn-danger delEm';
            $(closeBut).attr('ng-click', "delEl('" + el.id + "');");
            closeBut.innerHTML = 'X';
            el.innerHTML = elToTree;
            el.appendChild(closeBut);
            document.getElementById(parentTargId).appendChild(el);
            $compile(el)($scope)
                //now recurse thru, and repeat this process for the kid
            $scope.drawTree(elToTree);
        })
    }
    $scope.delEl = function(item) {
        console.log('item is', item)
        for (var q = 0; q < $scope.objs.length; q++) {
            if ($scope.objs[i].idInfo == item) {
                $scope.objs.splice(i, 1);
                $('#' + idInfo).remove();
            }
        }
    }
    $scope.encodeSave = function() {
        $scope.adding = false;
        $scope.rem = false;
        $scope.saving = true;
        $scope.loading = false;
        var saveOut = JSON.stringify($scope.objs);
        saveOutEnc = window.btoa(saveOut);
        $scope.saveTxt = saveOutEnc;
    }
    $scope.showLoad = function() {
        $scope.loading ? $scope.loading = false : $scope.loading = true;
        $scope.adding = false;
        $scope.rem = false;
        $scope.saving = false;
    }
    $scope.loadDecode = function(dataToLoad) {
        console.log(dataToLoad);
        //NEED ERR CHECK TO MAKE SURE ARR!
        var parsedStuff = [];
        try {
            parsedStuff = JSON.parse(window.atob(dataToLoad));
            //replace this with a bootbox alert or something later.
            bootbox.confirm("Are you sure? Loading a scene will erase what you have!", function(confRez) {
                console.log('load confirm:', confRez);
                if (confRez) {
                    angular.copy(parsedStuff, $scope.objs);
                    $('#main').html('');
                    $('#mainTree').html('');
                    //we clear the tree element, but we don't have to redraw it, since that gets redrawn anyway 
                    // $scope.loadScene();
                    $scope.showLoad();
                    $scope.$apply();
                }
            });
        } catch (e) {
            bootbox.alert('Huh. This doesn\'t look like a valid scene to me!', function() {
                $('#loadBox').val('').focus();
            });
        }


    }
    $scope.enterLoad = function(e) {
        if (e.keyCode == 13) {
            $scope.loadDecode($('#loadBox').val());
        }
    }
    $scope.loadScene = function() {
        //function reloads a scene
        $scope.objs.forEach(function(loadObj) {
            var toMake = {
                x: loadObj.x,
                y: loadObj.y,
                radWid: loadObj.radWid,
                h: loadObj.h,
                d: loadObj.d,
                parent: loadObj.parent || loadObj.par,
                rX: loadObj.rX,
                rY: loadObj.rY,
                rZ: loadObj.rZ,
                color: loadObj.color,
                idInfo: loadObj.idInfo,
                isCube: loadObj.isCube
            }
            $scope.makeObj(toMake);
        });
    };

});
