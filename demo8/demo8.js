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

    SCG.scenes.cacheScene(new MapScene2({
        name:'map2',
        viewport: defaultViewpot
    })); 

    SCG.scenes.cacheScene(new PixelForestScene({
        name:'forest',
        viewport: verticalDefaultViewport.mul(0.5)
    })); 

    SCG.scenes.cacheScene(new PeopleScene({
        name:'people',
        viewport: verticalDefaultViewport
    })); 

    SCG.scenes.cacheScene(new ExperimentsScene({
        name:'experiments',
        viewport: verticalDefaultViewport
    })); 

    SCG.scenes.cacheScene(new Experiments2Scene({
        name:'experiments2',
        viewport: verticalDefaultViewport
    })); 

    SCG.scenes.cacheScene(new Experiments3Scene({
        name:'experiments3',
        viewport: defaultViewpot
    })); 

    SCG.scenes.cacheScene(new Experiments4Scene({
        name:'experiments4',
        viewport: verticalDefaultViewport
    })); 

    SCG.scenes.cacheScene(new DestrScene({
        name:'destr',
        viewport: verticalDefaultViewport
    })); 

    SCG.scenes.cacheScene(new FlyScene({
        name:'fly',
        viewport: defaultViewpot
    })); 

    SCG.scenes.cacheScene(new OceanScene({
        name:'ocean',
        viewport: defaultViewpot
    }));

    SCG.scenes.cacheScene(new SpiderScene({
        name:'spider',
        viewport: defaultViewpot
    })); 
    SCG.scenes.cacheScene(new WhirlpoolScene({
        name:'whirl',
        viewport: defaultViewpot
    }));

    SCG.scenes.cacheScene(new WaterfallScene({
        name:'waterfall',
        viewport: verticalDefaultViewport
    })); 

    SCG.scenes.cacheScene(new PerfScene({
        name:'perf',
        viewport: verticalDefaultViewport
    })); 

    SCG.scenes.cacheScene(new CloudScene({
        name:'cloud',
        viewport: defaultViewpot
    })); 

    sceneSelectByHashValue();
    
    SCG.main.start();

    window.addEventListener("hashchange", sceneSelectByHashValue, false);
});