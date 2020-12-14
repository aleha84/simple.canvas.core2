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

    SCG.globals.version = 1.0;

    SCG.src = {
    }

    
    SCG.scenes.cacheScene(new ZershushCabinScene({
        name:'cozy',
        viewport: new V2(200,113)
    }));

    
    SCG.main.startV2('cozy');
});