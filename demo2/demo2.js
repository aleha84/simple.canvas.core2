document.addEventListener("DOMContentLoaded", function() {
    let scenesNames = ['parallax', 'nightsky'];

    function sceneSelectByHashValue(){
        let sceneIndex = location.hash !== '' ? scenesNames.indexOf(location.hash.replace('#','')) : 0;
        if(sceneIndex === -1)
            sceneIndex = 0;

        SCG.scenes.selectScene(scenesNames[sceneIndex]);
    }


    SCG.globals.version = 0.2;

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

    sceneSelectByHashValue();
    
    SCG.main.start();

    window.addEventListener("hashchange", sceneSelectByHashValue, false);
});