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
    
    SCG.scenes.cacheScene(new RavenScene({
        name:'raven',
        viewport: new V2(150,150)
    }));


    SCG.main.startV2('raven');

    window.addEventListener("hashchange", sceneSelectByHashValue, false);
});