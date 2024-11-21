document.addEventListener("DOMContentLoaded", function() {
    function sceneSelectByHashValue(){
        console.log(location.hash)
        let sceneName = location.hash.replace('#','');
        if(sceneName == ''){
            return;
        }
        

        // if(SCG.scenes.cachedScenes[sceneName] != undefined)
        //     SCG.scenes.selectScene(sceneName);
        // else 
        //     return;
    }

    SCG.globals.version = 0.1;

    SCG.src = {
        
    }

    
    // SCG.scenes.cacheScene(new DraftsScene({
    //     name:'draft',
    //     viewport: new V2(150,150)
    // }));

    // SCG.scenes.cacheScene(new EffectsScene({
    //     name:'effects1',
    //     viewport: new V2(150,150)
    // }));

    // SCG.scenes.cacheScene(new Effects2Scene({
    //     name:'effects2',
    //     viewport: new V2(150,150)
    // }));

    // SCG.scenes.cacheScene(new Effects3Scene({
    //     name:'effects3',
    //     viewport: new V2(150,150)
    // }));

    // SCG.scenes.cacheScene(new Effects4Scene({
    //     name:'effects4',
    //     viewport: new V2(200,200)
    // }));

    // SCG.scenes.cacheScene(new Effects5Scene({
    //     name:'effects5',
    //     viewport: new V2(200,200)
    // }));

    // SCG.scenes.cacheScene(new Effects6Scene({
    //     name:'effects6',
    //     viewport: new V2(200,200)
    // }));

    // SCG.scenes.cacheScene(new LampScene({
    //     name:'lamp',
    //     viewport: new V2(150,150)
    // }));

    // SCG.scenes.cacheScene(new Lamp2Scene({
    //     name:'lamp2',
    //     viewport: new V2(150,150)
    // }));

    // SCG.scenes.cacheScene(new Lamp3Scene({
    //     name:'lamp3',
    //     viewport: new V2(150,150)
    // }));

    // SCG.scenes.cacheScene(new EarthScene({
    //     name:'earth',
    //     viewport: new V2(150,150)
    // }));

    // SCG.scenes.cacheScene(new FishScene({
    //     name:'fish',
    //     viewport: new V2(100,100)
    // }));

    // SCG.scenes.cacheScene(new DitheringScene({
    //     name:'dithering',
    //     viewport: new V2(150,200)
    // }));

    // SCG.scenes.cacheScene(new Draft1Scene({
    //     name:'draft1',
    //     viewport: new V2(200,200)
    // }));

    // SCG.scenes.cacheScene(new Article1Scene({
    //     name:'article1',
    //     viewport: new V2(200,200)
    // }));

    // SCG.scenes.cacheScene(new CharacterScene({
    //     name:'character',
    //     viewport: new V2(100,100)
    // }));

    // SCG.scenes.cacheScene(new FlowArtScene({
    //     name:'flowart',
    //     viewport: new V2(200,200)
    // }));

    // SCG.scenes.cacheScene(new SnowIsolatedScene({
    //     name:'snowisolated',
    //     viewport: new V2(128,72).mul(2)
    // }));

    // SCG.scenes.cacheScene(new PerlinFogScene({
    //     name:'perlinfog',
    //     viewport: new V2(150,150)
    // }));

    // SCG.scenes.cacheScene(new ReflectionsScene({
    //     name:'reflections',
    //     viewport: new V2(108,192)
    // }));

    // SCG.scenes.cacheScene(new EasingsScene({
    //     name:'easings',
    //     viewport: new V2(150,270)
    // }));

    // SCG.scenes.cacheScene(new Effects8Scene({
    //     name:'easings',
    //     viewport: new V2(160,200)
    // }));

    SCG.scenes.cacheScene(new Effects9Scene({
        name:'effects9',
        viewport: new V2(160,200)
    }));

    SCG.main.startV2('effects9');

    window.addEventListener("hashchange", sceneSelectByHashValue, false);
});