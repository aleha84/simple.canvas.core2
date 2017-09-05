window.SCG = {
    images: {},
    canvases: {
        main: undefined,
        background: undefined,
        ui: undefined,
        others: {}
    },
    contexts: {
        main: undefined,
        background: undefined,
        ui: undefined,
        others: {}
    },
    globals: {
        parentId: undefined
    }
};

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function(/* function */ callback, /* DOMElement */ element){
              window.setTimeout(callback, 1000 / 60);
            };
})();