document.addEventListener("DOMContentLoaded", function() {

    SCG.globals.version = 0.1;

    SCG.src = {
	}

    debugger;
    

    SCG.scenes.cacheScene(new ParallaxScene({
        name:'parallax',
        viewport: new V2(500,300)
    }));
    SCG.scenes.selectScene('parallax');
    
    SCG.main.start();
});