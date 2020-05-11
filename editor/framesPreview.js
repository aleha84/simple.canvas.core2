components.framesPreview = {
    create(context) {

        let { mainGo, image: { main, general: { size, originalSize, currentFrameIndex, animatedProps: { framesPreview } } }} = context;
        
        this.framesPreview = mainGo.parentScene.framesPreview;
        //nextFramesPreview
        this.currentFrameIndex = currentFrameIndex;

        let container = htmlUtils.createElement('div', {
            classNames: [ 'framesPreview' ]
        });

        this.frames = PP.createImage(context.prepareModel(context)).map(frame => createCanvas(originalSize, (ctx, size, hlp) => {
            ctx.globalAlpha = 0.25;
            ctx.drawImage(frame,0,0);
        }));

        let showNext = components.createCheckBox(framesPreview.showNext, 'Show next', (value) => {
            framesPreview.showNext = value;

            if(value){
                this.showNextFrame();
            }
            else {
                this.hideNextFrames();
            }
        })

        let showPrev = components.createCheckBox(framesPreview.showNext, 'Show prev', (value) => {
            framesPreview.showPrev = value;

            if(value){
                this.showPrevFrame();
            }
            else {
                this.hidePrevFrames();
            }
        })

        showNext.chk.disabled = currentFrameIndex == (this.frames.length-1);
        showPrev.chk.disabled = (currentFrameIndex == 0);

        if(!showNext.disabled && framesPreview.showNext){
            this.showNextFrame();
        }
        else {
            this.hideNextFrames();
        }

        if(!showPrev.disabled && framesPreview.showPrev){
            this.showPrevFrame();
        }
        else {
            this.hidePrevFrames();
        }

        htmlUtils.appendChild(container, [
            htmlUtils.createElement('p', { className: 'title', text: 'Frames preview'}),
            showNext,
            showPrev
        ])

        return container;
    },
    showNextFrame() { 
        this.framesPreview.next.img = this.frames[this.currentFrameIndex+1]
    },
    hideNextFrames() {
        this.framesPreview.next.img = undefined;
    },

    showPrevFrame() { 
        this.framesPreview.prev.img = this.frames[this.currentFrameIndex-1]
    },
    hidePrevFrames() {
        this.framesPreview.prev.img = undefined;
    }
}