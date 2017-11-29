
function getMouseLocEnd(e) {
	try {
		relativeendX = (e.clientX);
		relativeendY = (e.clientY);
	} catch (err) {

	};
};

//mapCoord is called when double click on scaled map - travels to that location.
function mapCoord(e) {
	//var e=new MouseEvent(e);

	mapX = (e.clientX) - (mySize.width - 190);
	mapY = (e.clientY) - (mySize.height - 190);

	if (mapX < 0) { mapX = 0; };
	if (mapX > 190) { mapX = 190; };
	if (mapY > 190) { mapY = 190; };

	//goto variables to reflect changes in scale
	gotoX = mapX * 24000;
	gotoY = mapY * 24000;
	//go to this location
	goToLoc(gotoX, gotoY);
	return false;
};

