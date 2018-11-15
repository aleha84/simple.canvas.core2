document.addEventListener("DOMContentLoaded", function() {

    SCG.globals.version = 0.1;

    SCG.src = {
	}

    debugger;
    
    let defaultViewpot = new V2(500,300);
    SCG.scenes.cacheScene(new ControlsDemoScene({
        name:'controlsDemo',
        viewport: defaultViewpot
    }));

    SCG.scenes.selectScene('controlsDemo');
    
    SCG.main.start();
});