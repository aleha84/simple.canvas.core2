document.addEventListener("DOMContentLoaded", function() {
    SCG.globals.version = 0.1;

    SCG.src = {
        
    }

    
    SCG.scenes.cacheScene(new SpaceshipScene({
        name:'spaceship',
        viewport: new V2(200, 200)
    }));

    
    SCG.main.startV2('spaceship');
});