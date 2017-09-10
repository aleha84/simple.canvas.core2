class DemoScene extends Scene {
    backgroundRender(){
        SCG.contexts.background.beginPath();
        SCG.contexts.background.rect(0, 0, SCG.viewport.real.width, SCG.viewport.real.height);
        SCG.contexts.background.fillStyle ='lightgreen';
        SCG.contexts.background.fill()
    }
}

document.addEventListener("DOMContentLoaded", function() {
    debugger;
    SCG.scenes.selectScene(new DemoScene( { name: 'demo_s1' }));
    
    SCG.main.start();
});