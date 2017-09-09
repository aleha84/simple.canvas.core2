SCG.start = function(){ 
	function loaderProgress() {
		//todo draw progress bar
	}

	function loadImages(){
		return new Promise((resolve, reject) => {
			var loadedImages = 0;
			var numImages = 0;
			// get num of sources
			for(let src in SCG.src) {
			  numImages++;
			}
			
			try {
				for(let src in SCG.src) {
					SCG.images[src] = new Image();
					SCG.images[src].onload = function() {
						loadedImages++;
						this.loaderProgress(loadedImages, numImages);
						
						if(loadedImages >= numImages) {
							resolve();
						}
					}
					SCG.images[src].src = SCG.src[src];
				}
			
				if(numImages == 0)
				{
					this.loaderProgress(loadedImages, numImages);
					resolve();
				}
			}
			catch(err){
				reject(err);
			}
		});
	}

	function cycle(){
		this.draw();
		requestAnimationFrame( this.cycle );   
	}

	function draw(){
		if(SCG.scenes.activeScene === undefined || SCG.scenes.activeScene.go == undefined)
			throw 'Active scene corrupted!';

		var now = new Date;

		SCG.logics.doPauseWork(now);

		var as = SCG.scenes.activeScene;

		as.preMainWork();

		SCG.viewport.camera.update(now);

		var i = as.go.length;
		while (i--) {
			as.go[i].update(now);
			as.go[i].render();
	
			if(SCG.frameCounter && as.go[i].renderPosition!=undefined){
				SCG.frameCounter.visibleCount++;
			}
	
			if(!as.go[i].alive){
				var deleted = as.go.splice(i,1);
			}
		}

		as.afterMainWork();	

		if(SCG.logics.isPausedStep)
			SCG.logics.isPausedStep =false;

		if(SCG.frameCounter)
			SCG.frameCounter.doWork(now);
	
		if(SCG.audio)
			SCG.audio.update(now);	
	}

	if(SCG.scenes.activeScene === undefined || SCG.scenes.activeScene.go == undefined)
		throw 'Active scene corrupted!';

	SCG.globals.parentElement = SCG.globals.parentId ? document.getElementById(SCG.globals.parentId) : document.body;
	
	let canvases = [{name:'background', z:0}, {name:'main', z: 100}, {name:'ui', z:1000}];

	for(let canvas of canvases){
		SCG.canvases[canvas.name] = appendDomElement(
			SCG.globals.parentElement, 
			'canvas',
			{ 
				width : SCG.globals.parentElement.clientWidth,
				height: SCG.globals.parentElement.clientHeight,
				id: canvas.name + 'Canvas',
				css: {
					'z-index': canvas.z,
					//'position': 'absolute'
				}
			}
		);

		SCG.contexts[canvas.name] = SCG.canvases[canvas.name].getContext('2d');
	}

	SCG.viewport.graphInit();

	loadImages().then(
		function(){
			SCG.events.register();

			if(SCG.audio)
				SCG.audio.init();	

			this.cycle();
		},
		function(err){
			throw err;
		}
	);
}

