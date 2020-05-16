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

    //debugger;
    
    let defaultViewpot = new V2(500,300);
    let verticalDefaultViewport = new V2(300,500);
    let squareDefaultViewport = new V2(300,300);
    let smallSquareDefaultViewport = new V2(200,200);
    let _200_250_viewport = new V2(200,250);
    let small200_300_Viewport = new V2(200, 300);
    let small300_200_Viewport = new V2(300, 200);
    
    

    SCG.scenes.cacheScene(new Demo10ParadeScene({
        name:'rain1',
        viewport: _200_250_viewport
    }));

    SCG.scenes.cacheScene(new Demo10EndScene({
        name:'end',
        viewport: smallSquareDefaultViewport
    }));

    SCG.scenes.cacheScene(new Demo10CityScene({
        name:'city',
        viewport: smallSquareDefaultViewport
    }));

    SCG.scenes.cacheScene(new Demo10Exp1Scene({
        name:'exp1',
        viewport: smallSquareDefaultViewport
    }));

    SCG.scenes.cacheScene(new Demo10WowScene({
        name:'wow',
        viewport: small300_200_Viewport
    }));
    
    SCG.scenes.cacheScene(new Demo10FlorianScene({
        name:'florian',
        viewport: smallSquareDefaultViewport
    }));

    SCG.scenes.cacheScene(new Demo10Loading1Scene({
        name:'loading1',
        viewport: small200_300_Viewport
    }));

    SCG.scenes.cacheScene(new Demo10MetroScene({
        name:'metro',
        viewport: smallSquareDefaultViewport.add(new V2(-2,-2))
    }));

    SCG.scenes.cacheScene(new Demo10DumplingScene({
        name:'dumplings',
        viewport: new V2(100,100)
    }));

    SCG.scenes.cacheScene(new Demo10KeyScene({
        name:'key',
        viewport: new V2(200,200)
    }));

    SCG.scenes.cacheScene(new Demo10PDailyScene({
        name:'pdaily',
        viewport: new V2(200,200)
    }));

    SCG.scenes.cacheScene(new Demo10GodScene({
        name:'god',
        viewport: new V2(200,200)
    }));

    SCG.scenes.cacheScene(new Demo10CarScene({
        name:'car',
        viewport: new V2(150,185)
    }));

    SCG.scenes.cacheScene(new Demo10BridgeScene({
        name:'bridge',
        viewport: new V2(150,150)
    }));

    SCG.scenes.cacheScene(new Demo10TeaScene({
        name:'tea',
        viewport: new V2(150,150)
    }));

    SCG.scenes.cacheScene(new Demo10TrainScene({
        name:'train',
        viewport: new V2(150,150)
    }));

    sceneSelectByHashValue();
    
    SCG.main.start();

    window.addEventListener("hashchange", sceneSelectByHashValue, false);
});