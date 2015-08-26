var app = angular.module("treeTest", []);

app.controller("MainController", function($scope, $window, $compile, loadUnloadFact) {
    $scope.adding = false;
    $scope.moveEm = false;
    $scope.nameConf = false;
    $scope.loading = false; //loading window not shown
    $scope.saving = false;
    $scope.rgb = 'hsv';
    $scope.rem = false;
    $scope.totals = {};
    $scope.saveTxt = '';
    $scope.prevMode = false;
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
            if ($scope.rem) {
                $scope.drawTree('main');
            } else {
                $('#mainTree').html('');
            }
        }

    }
    $scope.objs = [];
    $scope.parentList = []; //list of parent objects
    $scope.parentList.push($('#main'));
    $scope.objForm = {
        parent: '#main',
        objType: 0,
        x: 0,
        y: 0,
        radWid: 0,
        h: 0,
        d: 0,
        rX: 0,
        rY: 0,
        rZ: 0,
        color: {
            hue: 0,
            sat: 0,
            val: 0
        }
    };

    $scope.objConst = function(x, y, radWid, h, d, par, rX, rY, rZ, color, idInfo, objType) {
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
        this.objType = objType; //boolean
    }
    $scope.makeObj = function(frm, prev) {
        if (frm.parent) {
            frm.d = frm.d || 0;
            $scope.objs.push(new $scope.objConst(frm.x, frm.y, frm.radWid, frm.h, frm.d, frm.parent, frm.rX, frm.rY, frm.rZ, frm.color, frm.idInfo, frm.objType));
            if (frm.objType == 0) {
                //x, y, w, h, d, p, rX, rY, rZ, color, idInfo
                console.log('makin a cube')
                var id = loadUnloadFact.createCube(frm.x, frm.y, frm.radWid, frm.h, frm.d, frm.parent, frm.rX, frm.rY, frm.rZ, frm.color, frm.idInfo);
                $scope.parentList.push($('#' + id));
                $scope.nameConf = false;
                $scope.objForm = {
                    parent: '#main',
                    objType: 0,
                    x: 0,
                    y: 0,
                    radWid: 0,
                    h: 0,
                    d: 0,
                    rX: 0,
                    rY: 0,
                    rZ: 0,
                    color: {
                        hue: 0,
                        sat: 0,
                        val: 0
                    }
                };
            } else if (frm.objType == 1) {
                console.log('makin a cyl')
                var id = loadUnloadFact.createCircle(frm.x, frm.y, frm.radWid, frm.h, frm.d, frm.parent, frm.rX, frm.rY, frm.rZ, frm.color, frm.idInfo);
                $scope.parentList.push($('#' + id));
                $scope.nameConf = false;
                $scope.objForm = {
                    parent: '#main',
                    objType: 0,
                    x: 0,
                    y: 0,
                    radWid: 0,
                    h: 0,
                    d: 0,
                    rX: 0,
                    rY: 0,
                    rZ: 0,
                    color: {
                        hue: 0,
                        sat: 0,
                        val: 0
                    }
                };
            } else {
                console.log('makin a cone')
                var id = loadUnloadFact.createCone(frm.x, frm.y, frm.radWid, frm.h, frm.d, frm.parent, frm.rX, frm.rY, frm.rZ, frm.color, frm.idInfo);
                $scope.parentList.push($('#' + id));
                $scope.nameConf = false;
                $scope.objForm = {
                    parent: '#main',
                    objType: 0,
                    x: 0,
                    y: 0,
                    radWid: 0,
                    h: 0,
                    d: 0,
                    rX: 0,
                    rY: 0,
                    rZ: 0,
                    color: {
                        hue: 0,
                        sat: 0,
                        val: 0
                    }
                };
            }
            if (!prev) {
                bootbox.alert('Made ' + frm.idInfo + ' object!');
            }
        } else {
            bootbox.alert('Objects cannot be orphans! Please choose a parent!')
        }
        return frm;
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
        $('#makeButt').removeAttr('disabled');
        $('#prevButt').removeAttr('disabled')
        for (var q = 0; q < $scope.objs.length; q++) {
            if ($scope.objs[q].idInfo == ('circParent' + item) || $scope.objs[q].idInfo == ('boxParent' + item) || $scope.objs[q].idInfo == ('coneParent' + item)) {
                $scope.nameConf = true;
                $('#makeButt').attr('disabled', 'true');
                $('#prevButt').attr('disabled', 'true');
            }
        }
        if (item == 'main') {
            $scope.nameConf = true;
            $('#makeButt').attr('disabled', 'true');
            $('#prevButt').attr('disabled', 'true');
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
                var remObj = $scope.objs.splice(i, 1);
                var delObj = '';
                if (remObj.objType == 0) {
                    delObj = '#boxParent' + remObj.idInfo;
                } else if (remObj.objType == 1) {
                    delObj = '#circParent' + remObj.idInfo;
                } else {
                    delObj = '#coneParent' + remObj.idInfo;
                }
                $(delObj).remove();
            }
        }
    }
    $scope.encodeSave = function() {
        $scope.adding = false;
        $scope.rem = false;
        $scope.loading = false;
        if (!$scope.saving) {
            $scope.saving = true;
            var saveOut = JSON.stringify($scope.objs);
            saveOutEnc = window.btoa(saveOut);
            $scope.saveTxt = saveOutEnc;
        } else {
            $scope.saving = false;
        }
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
                    $scope.loadScene();
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
    $scope.$watch("objForm", function(frmEd) {
        $scope.editObj(frmEd)
    }, true);
    $scope.editObj = function(frmEd) {
        if ($scope.prevMode && $scope.adding) {
            //preview mode on, valid, and we're adding
            console.log('form changed, and prev mode active! redrawing!', frmEd);
            console.log($scope.objs[$scope.objs.length])
            var delMe = $scope.objs.pop(); //remove item
            var delObj = '';
            if (delMe.objType == 0) {
                delObj = '#boxParent' + delMe.idInfo;
            } else if (delMe.objType == 1) {
                delObj = '#circParent' + delMe.idInfo;
            } else {
                delObj = '#coneParent' + delMe.idInfo;
            }
            $(delObj).remove();
            $scope.objForm = $scope.makeObj(frmEd, true);
        }
    }
    $scope.togglePreviewMode = function(frm) {
        if (frm.idInfo && frm.idInfo !== '' && !$scope.prevMode) {
            $scope.prevMode = true;
            $scope.objForm = $scope.makeObj(frm, true);
        } else if ($scope.prevMode) {
            var delMe = $scope.objs.pop(); //remove item
            var delObj = '';
            if (delMe.objType == 0) {
                delObj = '#boxParent' + delMe.idInfo;
            } else if (delMe.objType == 1) {
                delObj = '#circParent' + delMe.idInfo;
            } else {
                delObj = '#coneParent' + delMe.idInfo;
            }
            $(delObj).remove();
            $scope.prevMode = false;
        } else {
            bootbox.alert('You gotta name your object first before you can see it!')
        }
    }
});
