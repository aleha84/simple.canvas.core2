document.addEventListener("DOMContentLoaded", function() {
    function sceneSelectByHashValue(){
        console.log(location.hash)
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

    
    SCG.scenes.cacheScene(new DedMorozScene({
        name:'dedmoroz',
        viewport: new V2(138,200)
    }));

    SCG.scenes.cacheScene(new TextSwitchScene({
        name:'text',
        viewport: new V2(138,200)
    }));

    SCG.main.startV2('text');

    window.addEventListener("hashchange", sceneSelectByHashValue, false);
});