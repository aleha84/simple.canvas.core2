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
        vampire: SpiritsScene.models.vampire
    }
    
    SCG.scenes.cacheScene(new SpiritsScene({
        name:'spirits',
        viewport: new V2(200,134)
    }));

    SCG.main.startV2('spirits');

    window.addEventListener("hashchange", sceneSelectByHashValue, false);
});