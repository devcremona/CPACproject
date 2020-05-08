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
		sketchContainer.appendChild(buttonImages['arrows']);
		buttonImages['arrows'].style.position = "absolute";
		buttonImages['arrows'].style.zIndex = "0";
		buttonImages['arrows'].style.left = (this.meanx - 250)+"px";
		buttonImages['arrows'].style.top = (this.meany - 250)+"px";
		buttonImages['arrows'].style.animationTimingFunction = 'linear';
		buttonImages['arrows'].style.animationName = 'animOpacity';
		buttonImages['arrows'].classList.add('BlinkOpacity');
		Drawing.arrows = buttonImages['arrows'];
	}

	static arrowsOff(){
		Drawing.arrows.remove();
	}

/*
	loop(arr, callback, i){
		i = i || 0;
		if(i==arr.length-1){
			return callback(arr, i).then(function(){
				console.log("i=L "+animationIsFinished);
				animationIsFinished = true;
				animationIsStarted = false;
				console.log(animationIsFinished);
				//return drawings[getCurrentStatus_Recap()].loop(arr, callback, ++i);
			});
		}
		else if(i==0){
			return callback(arr, i).then(function(){
				console.log("i=0 "+animationIsFinished);
				//return drawings[getCurrentStatus_Recap()].loop(arr, callback, ++i);
			});
		}
		else if(i<arr.length-1 && i>0 && !animationIsFinished){
			return callback(arr, i).then(function(){
				return drawings[getCurrentStatus_Recap()].loop(arr, callback, ++i);
			})
		}
	}

	stepAnimation(arr, i){
		return new Promise(function(resolve,reject){
			let trans = arr.pop();
			let dxx = trans[0] - Math.round(drawings[getCurrentStatus_Recap()].width/2) - drawings[getCurrentStatus_Recap()].dminx;
			let dyy = trans[1] - Math.round(drawings[getCurrentStatus_Recap()].height/2) - drawings[getCurrentStatus_Recap()].dminy;
			if(i==arr.length-1) animationIsFinished = true;
			$(drawings[getCurrentStatus_Recap()].dwg).animate({
				left: dxx,
				top: dyy
			}, 10, resolve()); // (selector).animate({styles},speed,easing,callback)
		});
	}*/

	recapAnimation(){
		// reset in the original drawing position
		this.updateCoord(
			-this.dminx+this.nativeX,
			-this.dminy+this.nativeY,
			true
		);

		animationIsStarted = true;
		this.dwg.style.transition = 'none';
		this.stepAnimation(this.path, 0);

		//this.loop(this.path, this.stepAnimation);
	}

	// recursive callback: arr is the array of remaining steps
	stepAnimation(arr, i){
		if(i==arr.length-1){
			let trans = arr[i];
			let dxx = trans[0] - Math.round(this.width/2) - this.dminx;
			let dyy = trans[1] - Math.round(this.height/2) - this.dminy;

			$(this.dwg).animate({
				left: dxx,
				top: dyy
			}, 5,  'linear', function() {
									drawings[getCurrentStatus_Recap()].stepAnimation(arr, ++i);
									console.log('last step');
									animationIsFinished=true;	
								});
		}
		else if(i<arr.length-1){
			let trans = arr[i];
			let dxx = trans[0] - Math.round(this.width/2) - this.dminx;
			let dyy = trans[1] - Math.round(this.height/2) - this.dminy;

			$(this.dwg).animate({
				left: dxx,
				top: dyy
			}, 5,  'linear', function() {
									drawings[getCurrentStatus_Recap()].stepAnimation(arr, ++i);
								});
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
function animationInterval(){
	if(animationIsStarted && drawings[getCurrentStatus_Recap()].path.length==0){
		animationIsStarted = false;
		animationIsFinished = true;
		console.log("finished");
	}
}

setInterval(animationInterval, 10);
*/
/*
	Quando inizia il recap e lo sfondo sparisce in dissolvenza i disegni spariscono di colpo
	invece che in dissolvenza, stessa cosa quando finisce il recap e sparisce di nuovo lo sfondo
*/
