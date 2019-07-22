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
    
    SCG.scenes.cacheScene(new RotationScene({
        name:'rotation',
        viewport: defaultViewpot
    })); 

    SCG.scenes.cacheScene(new EyeScene({
        name:'eye',
        viewport: defaultViewpot
    })); 

    SCG.scenes.cacheScene(new Exp1Scene({
        name:'exp1',
        viewport: defaultViewpot
    })); 

    SCG.scenes.cacheScene(new CraneScene({
        name:'crane',
        viewport: verticalDefaultViewport
    })); 

    SCG.scenes.cacheScene(new TrafficScene({
        name:'traffic',
        viewport: defaultViewpot
    })); 

    SCG.scenes.cacheScene(new BallScene({
        name:'ball',
        viewport: verticalDefaultViewport
    })); 

    SCG.scenes.cacheScene(new LoadingScene({
        name:'loading',
        viewport: verticalDefaultViewport
    })); 

    SCG.scenes.cacheScene(new GlassScene({
        name:'glass',
        viewport: verticalDefaultViewport
    })); 

    SCG.scenes.cacheScene(new Waterfall2Scene({
        name:'waterfall',
        viewport: defaultViewpot
    }));
    
    SCG.scenes.cacheScene(new SphereProgressScene({
        name:'sphere',
        viewport: verticalDefaultViewport
    }));

    sceneSelectByHashValue();
    
    SCG.main.start();

    window.addEventListener("hashchange", sceneSelectByHashValue, false);
});