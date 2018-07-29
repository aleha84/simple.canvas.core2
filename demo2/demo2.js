document.addEventListener("DOMContentLoaded", function() {

    SCG.globals.version = 0.1;

    SCG.src = {
	}

    debugger;
    
    let defaultViewpot = new V2(500,300);
    SCG.scenes.cacheScene(new ParallaxScene({
        name:'parallax',
        viewport: defaultViewpot
    }));

    SCG.scenes.cacheScene(new NightSkyScene({
        name:'nightsky',
        viewport: defaultViewpot
    }));

    SCG.scenes.selectScene('nightsky');
    
    SCG.main.start();
});