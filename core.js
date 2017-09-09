window.SCG = {
    src: {},
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
        parentId: undefined,
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    },
    logics: {
        isPaused: false,
        isPausedStep: false,
        gameOver: false,
        pausedFrom : undefined,
        pauseDelta : 0,
        doPauseWork(now){
            if(this.isPaused && this.pausedFrom == undefined){
                this.pausedFrom = now;
                this.pauseDelta = 0;
            }
            else if(this.pausedFrom != undefined && !this.isPaused){
                this.pauseDelta = now - this.pausedFrom;
                this.pausedFrom = undefined;
            }
            else if(this.pauseDelta != 0){
                this.pauseDelta = 0;
            }
        },
        pauseToggle(){
            this.isPaused = !this.isPaused;	
            if(SCG.UI)
                SCG.UI.invalidate();
            if(SCG.audio)
                SCG.audio.playPause(SCG.gameLogics.isPaused);	
        }
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