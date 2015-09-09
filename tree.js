var app = angular.module("modeler", []);
var tempWAdj = 20;

app.controller("MainController", function($scope, $window, $compile, loadUnloadFact) {
    $scope.adding = false;
    $scope.moveEm = false;
    $scope.custMoveMode = false;
    $scope.nameConf = false;
    $scope.loading = false; //loading window not shown
    $scope.saving = false;
    $scope.rem = false;
    $scope.bgShow = false;
    $scope.totals = {};
    $scope.saveTxt = '';
    $scope.prevMode = false;
    $scope.theTitle = 'Untitled';
    $scope.loadData = []; //holds the data to be loaded temporarily
    $scope.bgForm = {
        hue: 0,
        sat: 0,
        val: 100,
        img: '',
        rgb: 'hsv',
        red: 255,
        green: 255,
        blue: 255,
        filter: 'none',
        filtAmt: 0,
        is3d: 'false'
    };
    $scope.ackIe = false;
    $scope.toggleWind = function(which) {
        if (!which) {
            //show add form
            $('#mainTree').html('');
            $scope.rem = false;
            $scope.loading = false;
            $scope.bgShow = false;
            $scope.saving = false;
            $scope.adding ? $scope.adding = false : $scope.adding = true;
        } else {
            //show tree/rem form
            $scope.adding = false;
            $scope.loading = false;
            $scope.bgShow = false;
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
            val: 0,
            red: 0,
            green: 0,
            blue: 0,
            gloPow: 0,
            trans: 0,
            img: '',
            rgb: 'hsv',
            spec: 1
        },
        cap: {
            isCapped: true,
            pos: 100
        },
        custMove: {
            active: false,
            xCont: 'y',
            yCont: 'x',
            xMag: 1,
            yMag: 1
        },
        coneType: {
            type: 'cone',
            numSegs: 5
        }
    };

    $scope.objConst = function(x, y, radWid, h, d, par, rX, rY, rZ, color, idInfo, objType, cap, custMove,coneType) {
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
        this.color = color; //color obj ({hue, sat, val,red,green,blue,glow,img})
        this.idInfo = idInfo; //obj's id
        this.objType = objType; //boolean
        this.cap = cap;
        this.custMove = custMove;
        this.coneType = coneType;
    }
    $scope.announceDone = function(frm) {
        if (frm.objType == 0) {
            var type = 'cube '
        } else if (frm.objType == 1) {
            var type = 'cylinder '
        } else {
            var type = 'cone '
        }
        bootbox.dialog({
            message: 'Made ' + type + frm.idInfo + '!',
            title: 'Made ' + frm.idInfo + '!',
            buttons: {
                success: {
                    label: "Make another!",
                    className: "btn-success",
                    callback: function() {

                    }
                },
                info: {
                    label: "Done for now!",
                    className: "btn-info",
                    callback: function() {
                        $scope.adding = false;
                        $scope.$digest();
                    }
                }
            }
        });
    };
    $scope.maker = function(frm) {
        //by the maker!
        if (!$scope.prevMode) {
            //normal creation mode. Preview not active
            $scope.makeObj(frm);
        } else {
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
                    val: 0,
                    red: 0,
                    green: 0,
                    blue: 0,
                    gloPow: 0,
                    trans: 0,
                    img: '',
                    rgb: 'hsv',
                    spec: 1
                },
                cap: {
                    isCapped: true,
                    pos: 100
                },
                custMove: {
                    active: false,
                    xCont: 'y',
                    yCont: 'x',
                    xMag: 1,
                    yMag: 1
                },
                coneType: {
                    type: 'cone',
                    numSegs: 5
                }
            };
            $scope.prevMode = false; //just went from prev mode to create mode, so set this to false for the next obj
            $scope.announceDone(frm);
        }
    }
    $scope.makeObj = function(frm, prev) {
        if (frm.parent) {
            frm.d = frm.d || 0;
            console.log('FORM:',frm)
            if (parseInt(frm.objType) == 2 && frm.coneType.type == 'pyramid') {
                console.log('pyramid!------')
                frm.radWidFull = [parseInt(frm.radWid), frm.coneType.numSegs];
                frm.cap.isCapped = false;
            } else {
                frm.radWidFull = frm.radWid;
            }
            $scope.objs.push(new $scope.objConst(frm.x, frm.y, frm.radWidFull, frm.h, frm.d, frm.parent, frm.rX, frm.rY, frm.rZ, frm.color, frm.idInfo, frm.objType, frm.cap, frm.custMove,frm.coneType));
            //note that frm.custMove, the custom movement thing, does not need to be fed into the constructors.
            if (frm.objType == 0) {
                //x, y, w, h, d, p, rX, rY, rZ, color, idInfo
                console.log('makin a cube')
                var id = loadUnloadFact.createCube(frm.x, frm.y, frm.radWidFull, frm.h, frm.d, frm.parent, frm.rX, frm.rY, frm.rZ, frm.color, frm.idInfo);
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
                        val: 0,
                        red: 0,
                        green: 0,
                        blue: 0,
                        gloPow: 0,
                        trans: 0,
                        img: '',
                        rgb: 'hsv',
                        spec: 1
                    },
                    cap: {
                        isCapped: true,
                        pos: 100
                    },
                    custMove: {
                        active: false,
                        xCont: 'y',
                        yCont: 'x',
                        xMag: 1,
                        yMag: 1
                    },
                    coneType: {
                        type: 'cone',
                        numSegs: 5
                    }
                };
            } else if (frm.objType == 1) {
                console.log('makin a cyl')
                var id = loadUnloadFact.createCircle(frm.x, frm.y, frm.radWidFull, frm.h, frm.d, frm.parent, frm.rX, frm.rY, frm.rZ, frm.color, frm.idInfo, frm.cap);
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
                        val: 0,
                        red: 0,
                        green: 0,
                        blue: 0,
                        gloPow: 0,
                        trans: 0,
                        img: '',
                        rgb: 'hsv',
                        spec: 1
                    },
                    cap: {
                        isCapped: true,
                        pos: 100
                    },
                    custMove: {
                        active: false,
                        xCont: 'y',
                        yCont: 'x',
                        xMag: 1,
                        yMag: 1
                    },
                    coneType: {
                        type: 'cone',
                        numSegs: 5
                    }
                };
            } else {
                console.log('makin a cone or pyramid');
                var id = loadUnloadFact.createCone(frm.x, frm.y, frm.radWidFull, frm.h, frm.d, frm.parent, frm.rX, frm.rY, frm.rZ, frm.color, frm.idInfo, frm.cap);
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
                        val: 0,
                        red: 0,
                        green: 0,
                        blue: 0,
                        gloPow: 0,
                        trans: 0,
                        img: '',
                        rgb: 'hsv',
                        spec: 1
                    },
                    cap: {
                        isCapped: true,
                        pos: 100
                    },
                    custMove: {
                        active: false,
                        xCont: 'y',
                        yCont: 'x',
                        xMag: 1,
                        yMag: 1
                    },
                    coneType: {
                        type: 'cone',
                        numSegs: 5
                    }
                };
            }
            if (!prev) {
                $scope.announceDone(frm);
            }
        } else {
            bootbox.alert('Objects cannot be orphans! Please choose a parent!')
        }
        return frm;
    }
    window.onmousemove = function(e) {
        //shimmy shim shims
        e.x = e.x || e.clientX;
        e.y = e.y || e.clientY;

        if ($scope.moveEm) {
            $('#main').css('transform', 'rotateX(' + e.y + 'deg) rotateZ(' + e.x + 'deg)');
            //translateX(20px) rotateY(20deg)
            $('#main3DR').css('transform', 'translateZ(5px) translateX(5px) rotateY(-5deg) rotateX(' + e.y + 'deg) rotateZ(' + e.x + 'deg)');
            $('#main3DL').css('transform', 'translateZ(5px) translateX(-5px) rotateY(5deg) rotateX(' + e.y + 'deg) rotateZ(' + e.x + 'deg)');
        } else if ($scope.custMoveMode) {
            if ($scope.is3d) {

            } else {
                loadUnloadFact.custMoveDo($scope.objs, e.x, e.y);
            }
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
        var fullParent = par;
        if (par == 'main') {
            fullParent = '#main';
            $('#mainTree').html('');
        } else {
            for (var q = 0; q < $scope.objs.length; q++) {
                if ($scope.objs[q].idInfo == par && $scope.objs[q].objType == 0) {
                    //boxParent
                    fullParent = '#boxParent' + fullParent;
                } else if ($scope.objs[q].idInfo == par && $scope.objs[q].objType == 1) {
                    //circ
                    fullParent = '#circParent' + fullParent;
                } else if ($scope.objs[q].idInfo == par && $scope.objs[q].objType == 2) {
                    //cone
                    fullParent = '#coneParent' + fullParent;
                }
            }
            console.log(fullParent, 'is the parent')
        }
        //now deal with dem rowdy kidz
        var kidsToScan = []; //list of kids to recurse thru
        //find the parent's full name
        $scope.objs.forEach(function(elToCheck) {
            if (elToCheck.par == fullParent) {
                //is a child
                kidsToScan.push(elToCheck.idInfo);
            }
        });
        console.log('kids', kidsToScan, 'for parent', par)
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
            $compile(el)($scope);
            //now recurse thru, and repeat this process for the kid
            $scope.drawTree(elToTree);
        });
    };
    $scope.delEl = function(item) {
        item = item.substr(0, item.length - 4)
        for (var q = 0; q < $scope.objs.length; q++) {
            //loop thru all items to find the correct item.
            if ($scope.objs[q].idInfo == item) {
                //found it!
                var remObj = $scope.objs.splice(q, 1)[0];
                $scope.parentList.splice(q, 1);
                var delObj = '';
                if (parseInt(remObj.objType) == 0) {
                    delObj = '#boxParent' + remObj.idInfo;
                } else if (parseInt(remObj.objType) == 1) {
                    delObj = '#circParent' + remObj.idInfo;
                } else {
                    delObj = '#coneParent' + remObj.idInfo;
                }
                $(delObj).remove();
                //now loop thru all items again to see if any children exist
                for (var n = 0; n < $scope.objs.length; n++) {
                    if ($scope.objs[n].par == delObj) {
                        //if this is a child of the previously deleted obj, delete it
                        $scope.delEl($scope.objs[n].idInfo);
                    }
                }
            }
        }
        $scope.drawTree('main');

    }
    $scope.saveObj = []
    $scope.encodeSave = function() {
        $scope.adding = false;
        $scope.rem = false;
        $scope.loading = false;
        $scope.bgShow = false;
        if (!$scope.saving) {
            $scope.saving = true;
            angular.copy($scope.objs, $scope.saveObj);
            $scope.saveObj.unshift($scope.theTitle || 'Untitled');
            $scope.saveObj.unshift($scope.bgForm);
            var saveOut = JSON.stringify($scope.saveObj);
            //now encode the whole thing!
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
        $scope.bgShow = false;
    };
    $scope.loadDecode = function(dataToLoad) {
        //NEED ERR CHECK TO MAKE SURE ARR!
        console.log('data', dataToLoad)
        var parsedStuff = [];
        try {
            parsedStuff = JSON.parse(window.atob(dataToLoad));
            //replace this with a bootbox alert or something later.
            bootbox.confirm("Are you sure? Loading a scene will erase what you have!", function(confRez) {
                console.log('load confirm:', confRez);
                if (confRez) {
                    $scope.bgForm = parsedStuff.shift(); //take off the first item, which is the bgForm;
                    console.log('after bg stuff removed:', parsedStuff);
                    $scope.theTitle = parsedStuff.shift(); //take off the second item, which is the title;
                    //at this point, we have a copy of the info of the original $scope.objs. 
                    console.log('title', $scope.theTitle);
                    $scope.updateCol(0, 1);
                    $scope.chTitle();
                    $scope.$digest();
                    $scope.loadData = parsedStuff;
                    $('#main').html('');
                    $('#mainTree').html('');
                    //we clear the tree element, but we don't have to redraw it, since that gets redrawn anyway 
                    $scope.loadScene();
                    $scope.showLoad();
                    $scope.$apply();
                    $scope.loadData = [];
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
            console.log('loaddecode')
            $scope.loadDecode($('#loadBox').val());
        }
    }
    $scope.loadScene = function() {
        //function reloads a scene
        $scope.loadData.forEach(function(loadObj) {
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
                objType: loadObj.objType,
                custMove: loadObj.custMove,
                cap: loadObj.cap,
                coneType: loadObj.coneType
            };
            $scope.makeObj(toMake, 1);
        });
        $('#loadBox').val('');
    };
    $scope.$watch("objForm", function(frmEd) {
        $scope.editObj(frmEd);
    }, true);
    $scope.editObj = function(frmEd) {
        if ($scope.prevMode && $scope.adding) {
            //preview mode on, valid, and we're adding
            var delMe = $scope.objs.pop(); //remove item
            $scope.parentList.pop();
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
    };
    $scope.togglePreviewMode = function(frm) {
        if (frm.idInfo && frm.idInfo !== '' && !$scope.prevMode) {
            $scope.prevMode = true;
            $scope.objForm = $scope.makeObj(frm, true);
        } else if ($scope.prevMode) {
            var delMe = $scope.objs.pop(); //remove item
            $scope.parentList.pop();
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
    };
    //Thanks to http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion for this!

    $scope.updateCol = function(isRgb, isBg) {
        //first we make sure we're dealin with numbahs here, not lettahs

        for (var key in $scope.objForm.color) {
            if ($scope.objForm.color.hasOwnProperty(key) && key != 'img' && key != 'rgb') {
                //convert all vals to number primitives, except for img/rgb
                $scope.objForm.color[key] = parseFloat($scope.objForm.color[key]);
            }
        }

        if (isRgb == 1) {
            if (!isBg) {
                var cols = loadUnloadFact.rgbToHsl($scope.objForm.color.red, $scope.objForm.color.green, $scope.objForm.color.blue)
                $scope.objForm.color.hue = cols[0];
                $scope.objForm.color.sat = cols[1];
                $scope.objForm.color.val = cols[2];
            } else {
                var cols = loadUnloadFact.rgbToHsl($scope.bgForm.red, $scope.bgForm.green, $scope.bgForm.blue)
                $scope.bgForm.hue = cols[0];
                $scope.bgForm.sat = cols[1];
                $scope.bgForm.val = cols[2];
            }
        } else {
            if (!isBg) {
                var cols = loadUnloadFact.hslToRgb($scope.objForm.color.hue, $scope.objForm.color.sat, $scope.objForm.color.val)
                $scope.objForm.color.red = cols[0];
                $scope.objForm.color.green = cols[1];
                $scope.objForm.color.blue = cols[2];
            } else {
                var cols = loadUnloadFact.hslToRgb($scope.bgForm.hue, $scope.bgForm.sat, $scope.bgForm.val)
                $scope.bgForm.red = cols[0];
                $scope.bgForm.green = cols[1];
                $scope.bgForm.blue = cols[2];
            }
        }
        if (!isBg) {
            $('#colLab').css('background-image', 'none');
        } else {
            //text col is opposite of bg col
            var theFilt = '';
            switch ($scope.bgForm.filter) {
                case 'blur':
                    theFilt = 'blur(' + $scope.bgForm.filtAmt * 20 + 'px)';
                    break;
                case 'sepia':
                    theFilt = 'sepia(' + $scope.bgForm.filtAmt * 1 + ')';
                    break;
                case 'grayscale':
                    theFilt = 'grayscale(' + $scope.bgForm.filtAmt * 1 + ')';
                    break;
                case 'saturate':
                    theFilt = 'saturate(' + $scope.bgForm.filtAmt * 10 + ')';
                    break;
                case 'brightness':
                    theFilt = 'brightness(' + $scope.bgForm.filtAmt * 10 + ')';
                    break;
                case 'contrast':
                    theFilt = 'contrast(' + $scope.bgForm.filtAmt * 10 + ')';
                    break;
                case 'hue-rotate':
                    theFilt = 'hue-rotate(' + $scope.bgForm.filtAmt * 360 + 'deg)';
                    break;
                default:
                    theFilt = '';
            }
            console.log(theFilt);
            $('#allStuff').css({
                'color': 'hsl(' + (360 - $scope.bgForm.hue) + ',' + $scope.bgForm.sat + '%,' + (100 - $scope.bgForm.val) + '%)',
                '-webkit-filter': theFilt,
                'filter': theFilt,
            });
            if ($scope.bgForm.rgb != 'tex') {
                $('#bg').css({
                    'background': 'hsl(' + $scope.bgForm.hue + ',' + $scope.bgForm.sat + '%,' + $scope.bgForm.val + '%)'
                });

            } else {
                $('#bg').css({
                    'background': 'url(' + $scope.bgForm.img + ')'
                });
            }
        }
        console.log($scope.bgForm);
    };
    $scope.coneSafe = function() {
        //cones cannot accept textures! Q_Q
        if ($scope.objForm.objType == 2) {
            $scope.objForm.color.rgb = 'hsv';
        }
    };
    $scope.updateImg = function(isBg) {
        var t = setTimeout(function() {
            if (isBg) {
                $('#all').css('background-image', 'url(' + $scope.bgForm.img + ')');
            } else {
                $('#colLab').css('background-image', 'url(' + $scope.objForm.color.img + ')');
            }
        }, 1000);
    };
    $scope.showBg = function() {
        $scope.loading = false;
        $scope.bgShow ? $scope.bgShow = false : $scope.bgShow = true;
        $scope.adding = false;
        $scope.rem = false;
        $scope.saving = false;

        //show the following warning if user tries to access non-IE-compliant stuff
        if ($scope.bgShow && !$scope.ackIe && window.navigator.userAgent.indexOf("MSIE ") > 0) {
            bootbox.alert('It looks like you\'re using Internet Explorer! Some features aren\'t available in IE!')
            $scope.ackIe = true;
        }
    }
    window.onkeyup = function(e) {
        if (e.which == 27) {
            //user pressed escape, so get rid of windows
            e.preventDefault();
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
                    val: 0,
                    red: 0,
                    green: 0,
                    blue: 0,
                    gloPow: 0,
                    trans: 0,
                    img: '',
                    rgb: 'hsv',
                    spec: 1
                },
                cap: {
                    isCapped: true,
                    pos: 100
                },
                coneType: {
                    type: 'cone',
                    numSegs: 5
                }
            };
            $scope.loading = false;
            $scope.adding = false;
            $scope.rem = false;
            $scope.saving = false;
            $scope.bgShow = false;
            $scope.$digest();
        } else if (e.which == 13 && $scope.adding) {
            //adding, user pressed enter, so submit!
            console.log('triggering form!')
            $('#addObjForm').submit();
        } else if (e.which == 82) {
            $scope.moveEm ? $scope.moveEm = false : $scope.moveEm = true;
            $scope.custMoveMode = false;
            $scope.$digest();
        } else if (document.activeElement.type != 'text' && document.activeElement.tagName.toLowerCase() != 'textarea') {
            console.log(e.which)
            if (e.which == 77) {
                $scope.custMoveMode ? $scope.custMoveMode = false : $scope.custMoveMode = true;
                $scope.moveEm = false;
                $scope.$digest();
            } else if (e.which == 65) {
                $scope.toggleWind(0);
            } else if (e.which == 84) {
                $scope.toggleWind(1);
            } else if (e.which == 76) {
                $scope.showLoad();
            } else if (e.which == 83) {
                $scope.encodeSave();
            } else if (e.which == 79) {
                $scope.showBg();
            }
            $scope.$digest();
        }
    }
    $scope.trashScene = function() {
        if ($scope.objs.length) {

            bootbox.confirm("Are you absolutely sure you wanna wipe your scene?", function(result) {
                if (result) {
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
                            val: 0,
                            red: 0,
                            green: 0,
                            blue: 0,
                            gloPow: 0,
                            trans: 0,
                            img: '',
                            rgb: 'hsv',
                            spec: 1
                        },
                        cap: {
                            isCapped: true,
                            pos: 100
                        },
                        coneType: {
                            type: 'cone',
                            numSegs: 5
                        }
                    };
                    $('#mainTree').html('');
                    $('#main').html('');
                    $scope.theTitle = 'untitled';
                }
            });
        }
    }
    $scope.chTitle = function() {
        console.log(document.title)
        loadUnloadFact.changeTit($scope.theTitle);
    }
    $(function() {
        $('.panel').draggable({
            containment: [0, 0, $(window).width() / 2, $(window).height() / 2]
        });
    });
    $scope.data = function() {
        console.log($scope.objs);
    }
    $scope.update3d = function(status){
        if (status){
            //wipe 3d window, replace contents with those of main window
            var copy3d = $('#main').html();
            copy3dL = copy3d.replace(/id="/ig,'id="3DL');
            copy3dR = copy3d.replace(/id="/ig,'id="3DR');
            $('#main3DL').html(copy3dL);
            $('#main3DR').html(copy3dR);
            //recolor all divs R:
            var toColorR = $('#main3DR div');
            for (var i=0;i<toColorR.length;i++){
                var colArray = $(toColorR[i]).css('background-color');
                colArray = colArray.replace('rgb(','');
                colArray = colArray.replace(')','');
                colArray = colArray.split(', ');
                var HSLR = loadUnloadFact.rgbToHsl(parseInt(colArray[0]),parseInt(colArray[1]),parseInt(colArray[2]));
                $(toColorR[i]).css('background-color','hsl(0,100%,'+HSLR[2]+'%)');
            }
            var toColorL = $('#main3DR div');
            for (var i=0;i<toColorL.length;i++){
                var colArray = $(toColorL[i]).css('background-color');
                colArray = colArray.replace('rgb(','');
                colArray = colArray.replace(')','');
                colArray = colArray.split(', ');
                var HSLL = loadUnloadFact.rgbToHsl(parseInt(colArray[0]),parseInt(colArray[1]),parseInt(colArray[2]));
                $(toColorL[i]).css('background-color','hsl(180,100%,'+HSLL[2]+'%)');
            }
        }else{
            $('#main3DR').html('');
            $('#main3DL').html('');
        }
    }
});
