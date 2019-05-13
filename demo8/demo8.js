document.addEventListener("DOMContentLoaded", function() {
    function sceneSelectByHashValue(){
        let sceneName = location.hash.replace('#','');
        if(sceneName == ''){
            return;
        }
        
        if(SCG.scenes.cachedScenes[sceneName] != undefined)
            SCG.scenes.selectScene(sceneName);
        else 
            return;
    }

    SCG.globals.version = 0.1;

    SCG.src = {
        
	}

    debugger;
    
    let defaultViewpot = new V2(500,300);
    let verticalDefaultViewport = new V2(300,500);
    SCG.scenes.cacheScene(new InfoScreenScene({
        name:'info',
        viewport: defaultViewpot
    }));  

    SCG.scenes.cacheScene(new SpaceportScene({
        name:'spaceport',
        viewport: defaultViewpot
    })); 
    
    SCG.scenes.cacheScene(new MiningColonyScene({
        name:'miningcolony',
        viewport: defaultViewpot
    })); 

    SCG.scenes.cacheScene(new PixelWavesScene({
        name:'pixelwaves',
        viewport: verticalDefaultViewport
    })); 

    SCG.scenes.cacheScene(new CityScene({
        name:'city',
        viewport: verticalDefaultViewport
    })); 

    SCG.scenes.cacheScene(new MapScene({
        name:'map',
        viewport: defaultViewpot
    })); 

    SCG.scenes.cacheScene(new PixelForestScene({
        name:'forest',
        viewport: verticalDefaultViewport.mul(0.5)
    })); 

    sceneSelectByHashValue();
    
    SCG.main.start();

    window.addEventListener("hashchange", sceneSelectByHashValue, false);
});