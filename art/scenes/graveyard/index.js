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

    
    SCG.scenes.cacheScene(new GraveyardMorningScene({
        name:'graveyard',
        viewport: new V2(200, 150)
    }));

    SCG.scenes.cacheScene(new GraveyardEveningScene({
        name:'graveyard_evening',
        viewport: new V2(200, 150)
    }));

    SCG.scenes.cacheScene(new GraveyardNightScene({
        name:'graveyard_night',
        viewport: new V2(200, 150)
    }));

    SCG.main.startV2('graveyard_night');
});