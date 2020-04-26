function addDrawing(){
	/*
	dwg = sketchContext.canvas.getContext('2d').getImageData(minx,miny,maxx-minx,maxy-miny);
	drawings[dwgCount] = dwg;
	dwgCount++;
	*/

	sketchContainer = document.getElementById('sketchContainer');
	

	var img1 = new Image();						// paint on canv2
	img1.src = sketchContext.canvas.toDataURL('image/png');

	sketchContainer.appendChild(img1);


	img1.style.position = "absolute";
	img1.style.zIndex = "+1";
	img1.style.left = 0+"px";
	img1.style.top = 0+"px";
	lastDwg = img1;
}

// "apx" -> "bpx" being a and b respectively old and new positions
function updatePosition(dx, dy){
	lastDwg.style.left = Number(lastDwg.style.left.substring(0, lastDwg.style.left.length-2))+dx+"px";
	lastDwg.style.top = Number(lastDwg.style.top.substring(0, lastDwg.style.top.length-2))+dy+"px";
}

// todo: cambiare da controllo bordi a controllo mask
function checkMask(x, y){
	let pad = 10; // distance in pixels from the "out zone"
	if(x>(0+pad) && x<(sketchContext.width-pad) && y>(0+pad) && y<(sketchContext.height-pad))
		return true;
	else
		return false;
}