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
        code: CodeCatScene.models.code
    }

    
    SCG.scenes.cacheScene(new CodeCatScene({
        name:'cat',
        viewport: new V2(721-150,573)
    }));

    SCG.scenes.selectScene('cat');
    
    SCG.main.start();
});