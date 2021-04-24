document.addEventListener("DOMContentLoaded", function() {
    function sceneSelectByHashValue(){
        let sceneName = location.hash.replace('#','');
        if(sceneName == ''){
            console.log('No scene provided in URL')
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

    
    SCG.scenes.cacheScene(new Procgen1Scene({
        name:'procgen1',
        viewport: new V2(200, 200)
    }));

    SCG.scenes.cacheScene(new Procgen2Scene({
        name:'procgen2',
        viewport: new V2(200, 200)
    }));

    SCG.scenes.cacheScene(new Procgen3Scene({
        name:'procgen3',
        viewport: new V2(200, 200)
    }));

    SCG.scenes.cacheScene(new Procge5Scene({
        name:'procgen5',
        viewport: new V2(200, 200)
    }));

    sceneSelectByHashValue();
    
    SCG.main.start();

    window.addEventListener("hashchange", sceneSelectByHashValue, false);
});