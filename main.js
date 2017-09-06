SCG.start = function(){ 

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
						if(++loadedImages >= numImages) {
							resolve();
						}
					}
					SCG.images[src].src = SCG.src[src];
				}
			
				if(numImages == 0)
				{
					resolve();
				}
			}
			catch(err){
				reject(err);
			}
		});
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

	loadImages().then(
		function(){
			
		},
		function(err){
			throw err;
		}
	);
}

