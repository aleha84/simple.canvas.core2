SCG.main = {
	performance: {
		currentSecond: 0,
		fps: 0,
		currentSecondFps: 0,
		frameLengthInMilliseconds: 0,
		threshold: [], 
		thresholdMaxCount: 10
	},
	cycle: {
		process(){ //main work cycle, never stops
			SCG.main.cycle.draw();

			if(SCG.scenes.activeScene.capturing && SCG.scenes.activeScene.capturing.enabled){
				let c = SCG.scenes.activeScene.capturing;
				if(
					(!c.stopByCode && c.currentFrame < c.totalFramesToRecord) ||
					(c.stopByCode && !c.stop)
					 ){
					let frame = createCanvas(c.size, (ctx, size, hlp) => {
						ctx.drawImage(c.canvas, 0,0, size.x, size.y)
					});

					c.videoWriter.addFrame(frame);
					if(!c.stopByCode)
						console.log(`${c.currentFrame} from ${c.totalFramesToRecord} added`);
					else 
						console.log(`${c.currentFrame} frame added`);

					c.currentFrame++;
				}
				else {
					if(c.addRedFrame){
						let frame = createCanvas(c.size, (ctx, size, hlp) => {
							hlp.setFillColor('red').rect(0,0, size.x, size.y)
						});
						c.videoWriter.addFrame(frame);
					}
					
					console.log('recording is completed');

					c.videoWriter.complete().then(function(blob){
						let name = c.fileNamePrefix + '_' + new Date().getTime() + '.webm';
						// let blob = new Blob(this.recordedBlobs, { type: this.mimeType });
						let url = window.URL.createObjectURL(blob);
						let a = document.createElement('a');
						a.style.display = 'none';
						a.href = url;
						a.download = name;
						document.body.appendChild(a);
						a.click();
						setTimeout(() => {
							document.body.removeChild(a);
							window.URL.revokeObjectURL(url);
						}, 100)
					})

					return;
				}
			}

			requestAnimationFrame(SCG.main.cycle.process);
		},
		draw(){ // drawing on canvas based on current selected scene
			var _as = SCG.scenes.activeScene;
			if(_as === undefined || _as.goLayers == undefined)
				throw 'Active scene corrupted!';
	
			var now = new Date;

			let p = SCG.main.performance;
			// if(_as.debug.enabled){
				
			// }

			let second = now.getSeconds();
			if(p.currentSecond != second){
				p.fps = p.currentSecondFps;
				p.currentSecondFps = 0;
				p.currentSecond = second;
			}
	
			SCG.logics.doPauseWork(now);
	
			//SCG.viewport.camera.update(now);
		
			let tStart;
			if(_as.debug.enabled && _as.debug.showFrameTimeLeft){
				tStart = performance.now();
			}

			_as.cycleWork(now);	

			if(SCG.logics.isPausedStep)
				SCG.logics.isPausedStep =false;
	
			// if(SCG.frameCounter)
			// 	SCG.frameCounter.doWork(now);
		
			if(SCG.audio)
				SCG.audio.update(now);

			p.currentSecondFps++;

			if(_as.debug.enabled && _as.debug.showFrameTimeLeft){
				if(p.threshold.length < p.thresholdMaxCount){
					p.threshold[p.threshold.length] = performance.now() - tStart;
				}
				else {
					p.frameLengthInMilliseconds = p.threshold.reduce( ( p, c ) => p + c, 0 ) / p.threshold.length

					p.threshold = [];					
				}
				
			}
		}
	},
	loader: {
		loaderProgress(loadedImages, numImages) {
			//todo draw progress bar
		},
		loadImages(loaderProgressCallback){ //async loading images
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
							loaderProgressCallback(loadedImages, numImages);
							
							if(loadedImages >= numImages) {
								resolve();
							}
						}
						SCG.images[src].src = SCG.src[src];
					}
				
					if(numImages == 0)
					{
						loaderProgressCallback(loadedImages, numImages);
						resolve();
					}
				}
				catch(err){
					reject(err);
				}
			});
		},
		loadImagesSuccess(){
			SCG.viewport.graphInit();
			SCG.events.register();
			SCG.controls.initialize();

			if(SCG.audio)
				SCG.audio.init();	
	
			SCG.scenes.activeScene.beforeProcessInner();
			SCG.main.cycle.process();
		}
	},
	start(){
		if(SCG.scenes.activeScene === undefined || SCG.scenes.activeScene.goLayers == undefined)
			throw 'Active scene corrupted!';
	
		SCG.globals.parentElement = SCG.globals.parentId ? document.getElementById(SCG.globals.parentId) : document.body;
		
		let canvases = [{name:'background', z:0}, {name:'main', z: 100}, {name:'ui', z:1000}];
	
		for(let canvas of canvases){ //creating canvas and contexts
			SCG.canvases[canvas.name] = appendDomElement(
				SCG.globals.parentElement, 
				'canvas',
				{ 
					width : SCG.globals.parentElement.clientWidth,
					height: SCG.globals.parentElement.clientHeight,
					id: canvas.name + 'Canvas',
					css: {
						'z-index': canvas.z,
						'position': 'absolute'
					}
				}
			);
	
			SCG.contexts[canvas.name] = SCG.canvases[canvas.name].getContext('2d');
			SCG.contexts[canvas.name].imageSmoothingEnabled = false;
		}
	
		this.loader.loadImages(this.loader.loaderProgress).then(
			this.loader.loadImagesSuccess,
			function(err){
				throw err;
			}
		);
	}
}

