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
         me_red: ToonMeScene.models.meRed //'me_red.png'
    }

    
    SCG.scenes.cacheScene(new ToonMeScene({
        name:'toonme',
        viewport: new V2(768,1024)
    }));

    SCG.scenes.selectScene('toonme');

    //sceneSelectByHashValue();
    
    SCG.main.start();

    //window.addEventListener("hashchange", sceneSelectByHashValue, false);
});