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
	img1.style.zIndex = 0;
	drawings.push(new Drawing(img1)); 
}

// todo: cambiare da controllo bordi a controllo mask
function checkMask(x, y){
	let pad = 10; // distance in pixels from the "out zone"
	if(x>(0+pad) && x<(sketchContext.width-pad) && y>(0+pad) && y<(sketchContext.height-pad))
		return true;
	else
		return false;
}


function getNearestDwg(xx, yy){
	mindwg = 0;
	mind2 = sketchContext.width ** 2 + sketchContext.height ** 2;

	for(var i=0; i<drawings.length; i++){ // for each drawing
		// compute squared distance wrt clicked point
		let d2 = (xx - drawings[i].meanx) ** 2 + (yy - drawings[i].meany) ** 2;

		if(d2 < mind2){ // save nearest one
			mind2 = d2;
			mindwg = drawings[i];
		}
	}

	return mindwg; // return nearest one
}


class Drawing{
	constructor(dwg){
		this.dwg = dwg; // element in the DOM

		this.dmaxx = maxx;
		this.dmaxy = maxy;
		
		this.dminx = minx;
		this.dminy = miny;
		
		this.width = maxx-minx;
		this.height = maxy-miny;
		
		this.meanx = Math.round(this.dminx + this.width/2);
		this.meany = Math.round(this.dminy + this.height/2);
	}

	updateCoord(dxx, dyy){
		this.dmaxx += dxx;
		this.dminx += dxx;

		this.dmaxy += dyy;
		this.dminy += dyy;

		this.meanx += dxx;
		this.meany += dyy;

		// DOM operations
		this.dwg.style.left = Number(this.dwg.style.left.substring(0, this.dwg.style.left.length-2))+dxx+"px";
		this.dwg.style.top = Number(this.dwg.style.top.substring(0, this.dwg.style.top.length-2))+dyy+"px";
	}
}