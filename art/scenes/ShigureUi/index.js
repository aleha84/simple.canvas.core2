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
    
    SCG.scenes.cacheScene(new ShigureUIScene({
        name:'shigureui',
        viewport: new V2(144,256)
    }));

    SCG.main.startV2('shigureui');

    window.addEventListener("hashchange", sceneSelectByHashValue, false);
});