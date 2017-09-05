SCG.start = function(){ 
    var parentElement = SCG.globals.parentId ? document.getElementById(SCG.globals.parentId) : document.body;
    
    if(!SCG.canvases.background){
        SCG.canvases.background = appendDomElement(
			document.body, 
			'canvas',
			{ 
				width : SCG.viewfield.width,
				height: SCG.viewfield.height,
				id: SCG.canvasBgId,
				css: {
					'z-index': 0,
					'position': 'absolute'
				}
			}
		);
    }
}