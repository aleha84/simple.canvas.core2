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

    
    SCG.scenes.cacheScene(new GirlWithARifleScene({
        name:'girl',
        viewport: new V2(150,200)
    }));

    SCG.scenes.selectScene('girl');
    
    SCG.main.start();
});