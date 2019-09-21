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
    let squareDefaultViewport = new V2(300,300);
    
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

    SCG.scenes.cacheScene(new MountainsParallaxScene({
        name:'mountains',
        viewport: defaultViewpot
    }));

    SCG.scenes.cacheScene(new BookScene({
        name:'book',
        viewport: verticalDefaultViewport
    }));

    SCG.scenes.cacheScene(new Waterfall3Scene({
        name:'waterfall3',
        viewport: defaultViewpot
    }));

    SCG.scenes.cacheScene(new NightRainScene({
        name:'nightrain',
        viewport: defaultViewpot
    }));

    SCG.scenes.cacheScene(new CurvesScene({
        name:'curves',
        viewport: defaultViewpot
    }));

    SCG.scenes.cacheScene(new ToyProgressScene({
        name:'toy',
        viewport: defaultViewpot
    }));

    SCG.scenes.cacheScene(new LaserScene({
        name:'laser',
        viewport: verticalDefaultViewport
    }));

    SCG.scenes.cacheScene(new SmokeScene({
        name:'smoke',
        viewport: defaultViewpot
    }));

    SCG.scenes.cacheScene(new CarCommissionScene({
        name:'car',
        viewport: defaultViewpot
    }));

    SCG.scenes.cacheScene(new DollarScene({
        name:'dollar',
        viewport: defaultViewpot
    }));

    SCG.scenes.cacheScene(new Demo9Exp2Scene({
        name:'exp2',
        viewport: verticalDefaultViewport
    }));

    SCG.scenes.cacheScene(new Demo9MetroScene({
        name:'rocket',
        viewport: verticalDefaultViewport
    }));

    SCG.scenes.cacheScene(new Demo9BMoveScene({
        name:'bmove',
        viewport: verticalDefaultViewport
    }));

    SCG.scenes.cacheScene(new Demo9WindowScene({
        name:'window',
        viewport: new V2(300, 400)
    }));

    SCG.scenes.cacheScene(new Demo9DotsScene({
        name:'dots',
        viewport: new V2(300, 300)
    }));

    SCG.scenes.cacheScene(new Demo9LabelScene({
        name:'label',
        viewport: new V2(300, 300)
    }));

    SCG.scenes.cacheScene(new Demo9TeamScene({
        name:'team',
        viewport: new V2(250, 175)
    }));

    sceneSelectByHashValue();
    
    SCG.main.start();

    window.addEventListener("hashchange", sceneSelectByHashValue, false);
});