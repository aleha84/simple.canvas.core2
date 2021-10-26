document.addEventListener("DOMContentLoaded", function() {
    function sceneSelectByHashValue(){
        console.log(location.hash)
        let sceneName = location.hash.replace('#','');
        if(sceneName == ''){
            return;
        }
        
        if(sceneName == 'rain') {
            SCG.scenes.activeScene.setRain();
        }
        else if(sceneName == 'snow'){
            SCG.scenes.activeScene.setSnow();
        }

        // if(SCG.scenes.cachedScenes[sceneName] != undefined)
        //     SCG.scenes.selectScene(sceneName);
        // else 
        //     return;
    }

    SCG.globals.version = 0.1;

    SCG.src = {
        
    }

    
    SCG.scenes.cacheScene(new ItsAcrylicSucksKingsScene({
        name:'kings',
        viewport: new V2(150,268)
    }));

    SCG.main.startV2('kings');

    window.addEventListener("hashchange", sceneSelectByHashValue, false);
});