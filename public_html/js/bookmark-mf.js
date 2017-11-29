function milefm_run(v) {

	if (v.childNodes && v.childNodes.length > 0) {

		//console.log('parent', v, v.nodeType);
		getImg(v);

		for (i in v.childNodes) {
			milefm_run(v.childNodes[i]);
		};

	} else if (v.nodeType && v.nodeType == 1) {
		//last element, no child nodes
		//console.log(v, v.nodeType);
		getImg(v);
	};
};

function getImg(obj) {
	tag = (obj.tagName);

	switch (tag) {
		case 'IMG':
			src = obj.src;
			//console.log('img src=', obj.src);
			//console.log(obj.width, obj.height);
			addTo(obj);
			break;
		default:
			src = document.defaultView.getComputedStyle(obj, "")['backgroundImage'];
			if (src != 'none') {

				src = src.substr(4, src.length - 5); //remove url( )
				i = new Image();

				//console.log('backgroundImage', src); 

				i.src = src;

				//console.log('loaded: ',i.width, i.height);

				addTo(i);

			};
			break;
	};
};

function addTo(obj) {
	if (obj.width > 71 && obj.height > 71) {
		candidates[obj.src] = (obj.width * obj.height);
	};
};

function $(id) {
	return document.getElementById(id);
};

var e = document.createElement('link');
e.setAttribute('type', 'text/css');
e.setAttribute('href', 'http://mile.fm/js/bookmark-milefm.css');
e.setAttribute('rel', 'stylesheet');

document.body.appendChild(e);

var candidates = Array();
x = document.body;
milefm_run(x);

r = candidates.sort();
//console.dir(r);	

i = document.createElement('img');
i.src = 'http://mile.fm/static/milefm-bk-shadow.png';
i.setAttribute('id', 'milefm-container-bk');
document.body.appendChild(i);

d = document.createElement('div');
d.setAttribute('id', 'milefm-container');

h = '<div style="padding:0;margin:0;color:#fff;background-color:#D16A38;font-family:Helvetica, sans-serif;">Add to your Waiting List</div>';
for (i in r) {
	l = 'http://mile.fm/api/addExternalPicture/for/1/apicode/1234/return/image?src=' + encodeURIComponent(i);
	h += '<img src="' + i + '" class="sendto-milefm" onclick="this.src=\'' + l + '\'"/>';
};

//console.log(h);

d.innerHTML = h;
document.body.appendChild(d);

h = window.innerHeight + window.scrollMaxY;
w = window.innerWidth + window.scrollMaxX;

console.log(h, w);

$('milefm-container-bk').setAttribute('width', w);
$('milefm-container-bk').setAttribute('height', h + 50);

$('milefm-container-bk').onmousedown = function () {
	return false;
}