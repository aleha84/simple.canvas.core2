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

    debugger;
    
    let defaultViewpot = new V2(500,300);
    SCG.scenes.cacheScene(new EffectsScene({
        name:'effects',
        viewport: defaultViewpot
    }));

    SCG.scenes.cacheScene(new KaambezoneScene({
        name:'kaambezone',
        viewport: defaultViewpot
    }));

    

    sceneSelectByHashValue();
    
    SCG.main.start();

    window.addEventListener("hashchange", sceneSelectByHashValue, false);
});