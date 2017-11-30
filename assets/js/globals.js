"use strict";

//screen information
global.mySize = {
    height: 0, //height of screen
    width: 0, //width of screen
    cpanelx: -10, //x loc of left side of cpanel
    cpanely: -5, // y loc of top of cpanel
    numCols: 0, // number of columns to draw at once
    numRows: 0, // number of rows to draw at once
    myX: 2280960, //x loc of screen // 2280960
    myY: 2280960, //y loc of screen
    offsetLeft: 0,
    oneFoot: 864, //pixel width of one foot
    totalWidth: 0, //pixel width of all feet drawn
    totalHeight: 0, //pixel height of all feet drawn
    travelling: 0, //value represtenting automatic travel status, 0 = not moving. 1 - moving automatic (goToLoc). 2 - dragging square mile
    hash: "", // the hash (#) keeps track of location
    hashtrack: 1, //0 for safari 2
    intervaltime: 300, //amount of milliseconds to check the hash
    scale: 36, //ppi
    mag: 1 //to show multiple feet inside 1 div
};

//variables for pic we are adding to the mile
global.addPic = {
    width: 0, //width in inches 
    height: 0, //height in inches 
    source: "",
    inchX: 0, //inches from top left, (0,0)
    inchY: 0, //
    typeId: "",
    animate: "", // holds a motionpack object,
    move: {
        x: 0,
        y: 0,
        id: 0
    } //the element if we are moving an image already on the mile
};

//keeps track of which element is selected
global.selectedElement = {
    toSelect: null, //to select once traveling is done , by id
    isSelected: null //currently selected
};