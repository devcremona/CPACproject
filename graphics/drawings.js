function addDrawing(){
	/*
	dwg = sketchContext.canvas.getContext('2d').getImageData(minx,miny,maxx-minx,maxy-miny);
	drawings[dwgCount] = dwg;
	dwgCount++;
	*/

	sketchContainer = document.getElementById('sketchContainer');


	var img1 = new Image();
	img1.src = sketchContext.canvas.toDataURL('image/png');

	sketchContainer.appendChild(img1);


	img1.style.position = "absolute";
	img1.style.zIndex = "+1";
	img1.style.left = 0+"px";
	img1.style.top = 0+"px";
	img1.style.zIndex = "0";
	drawings[getCurrentStatus_Story()] = new Drawing(img1);

	drawings[getCurrentStatus_Story()].setArrows();
}

// upgrade: cambiare da controllo bordi a controllo mask
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

	//Generate array of keys
	drawingsKeys = Object.keys(drawings).map(function(item) {return parseInt(item, 10);});

	for(var i=0; i<drawingsKeys.length; i++){ // for each drawing
		// compute squared distance wrt clicked point
		let d2 = (xx - drawings[drawingsKeys[i]].meanx) ** 2 + (yy - drawings[drawingsKeys[i]].meany) ** 2;

		if(d2 < mind2){ // save nearest one
			mind2 = d2;
			mindwg = drawings[drawingsKeys[i]];
		}
	}

	return mindwg; // return nearest one
}

class Drawing{

	static arrows = undefined;

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

		this.nativeX = this.dminx;
		this.nativeY = this.dminy;

		this.path = [];
		this.path.push([this.meanx, this.meany]);
	}

	updateCoord(dxx, dyy, recap){
		this.dmaxx += dxx;
		this.dminx += dxx;

		this.dmaxy += dyy;
		this.dminy += dyy;

		this.meanx += dxx;
		this.meany += dyy;

		// DOM operations
		this.dwg.style.left = Number(this.dwg.style.left.substring(0, this.dwg.style.left.length-2))+dxx+"px";
		this.dwg.style.top = Number(this.dwg.style.top.substring(0, this.dwg.style.top.length-2))+dyy+"px";

		// the final recap doesn't need to track the movements
		if(!recap)
			this.path.push([this.meanx, this.meany]);
	}

	setArrows(){
		let arrowsImg = new Image();
		arrowsImg.src = "../arrows.png";;
		sketchContainer.appendChild(arrowsImg);
		arrowsImg.style.position = "absolute";
		arrowsImg.style.zIndex = "0";
		arrowsImg.style.left = (this.meanx - 250)+"px";
		arrowsImg.style.top = (this.meany - 250)+"px";
		Drawing.arrows = arrowsImg;
	}

	static arrowsOff(){
		Drawing.arrows.remove();
	}

	recapAnimation(){
		// reset in the original drawing position
		this.updateCoord(
			-this.dminx+this.nativeX,
			-this.dminy+this.nativeY,
			true
		);

		 this.stepAnimation(this.path);
	}

	// recursive callback: arr is the array of remaining steps
	stepAnimation(arr){
		if(arr.length!=0){
			let trans = arr.pop();
			let dxx = trans[0] - Math.round(this.width/2) - this.dminx;
			let dyy = trans[1] - Math.round(this.height/2) - this.dminy;

			$(this.dwg).animate({
				left: dxx,
				top: dyy
			}, 20, 'linear', this.stepAnimation(arr) ); // (selector).animate({styles},speed,easing,callback)
		}
	}

	finalAnimation(recDuration, i){

		let deltaX = this.nativeX + this.width/2;
		let deltaY = this.nativeY + this.height/2;
		this.dwg.style.zIndex = 4;

		if(i==1) // left half screen
			$(this.dwg).animate({
				left: Math.round(sketchContext.width/4 - deltaX),
				top: Math.round(sketchContext.height/2 - deltaY),
			}, recDuration );

		if(i==2) // right half screen
			$(this.dwg).animate({
				left: Math.round(sketchContext.width/4*3 - deltaX),
				top: Math.round(sketchContext.height/2 - deltaY),
			}, recDuration );

	}


}

/*
	Se cancello qualcosa non viene considerato nel movimento e nel centramento delle frecce

	Se muovo per tanto tempo un disegno poi nel recap non finisce l’animazione e
	la parte finale di movimento verso il centro non viene effettuata
	
	Quando inizia il recap e lo sfondo sparisce in dissolvenza i disegni spariscono di colpo
	invece che in dissolvenza, stessa cosa quando finisce il recap e sparisce di nuovo lo sfondo
	
	Diminuirei un po’ il tempo di fade-in dei disegni durante il recap
	
	La posizione finale dei due personaggi la mettere più verso il centro
	
	Le animazioni del secondo animale (bird,bee,etc.) appaiono prima che terminino tutte
	le animazioni dell’oggetto (pizza,cup,guitar,etc.)
*/