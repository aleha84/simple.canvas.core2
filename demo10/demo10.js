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
    

    sceneSelectByHashValue();
    
    SCG.main.start();

    window.addEventListener("hashchange", sceneSelectByHashValue, false);
});