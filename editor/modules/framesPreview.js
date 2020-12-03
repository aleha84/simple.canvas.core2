components.framesPreview = {
    framesImagesCache: [],
    setCurrentFrameImage(img) {
        this.framesImagesCache[this.currentFrameIndex] = img;
    },
    create(context) {

        let { mainGo, image: { main, general: { size, originalSize, currentFrameIndex, animatedProps: { framesPreview } } }} = context;
        
        this.originalSize = originalSize;
        this.framesPreview = mainGo.parentScene.framesPreview;

        this.currentFrameIndex = currentFrameIndex;

        let container = htmlUtils.createElement('div', {
            classNames: [ 'framesPreview' ]
        });

        let showNext = components.createCheckBox(framesPreview.showNext, 'Show next', (value) => {
            framesPreview.showNext = value;

            if(value){
                this.showNextFrame();
            }
            else {
                this.hideNextFrames();
            }
        })

        let showPrev = components.createCheckBox(framesPreview.showPrev, 'Show prev', (value) => {
            framesPreview.showPrev = value;

            if(value){
                this.showPrevFrame();
            }
            else {
                this.hidePrevFrames();
            }
        })

        showNext.chk.disabled = currentFrameIndex == (main.length-1);
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
        let nextFrame = this.framesImagesCache[this.currentFrameIndex+1];
        if(nextFrame){
            this.framesPreview.next.img = createCanvas(this.originalSize, (ctx, size, hlp) => {
                ctx.globalAlpha = 0.25;
                ctx.drawImage(nextFrame, 0,0);
            })
        }
        else {
            this.framesPreview.next.img = undefined;
        }
        
         //this.frames[this.currentFrameIndex+1]
    },
    hideNextFrames() {
        this.framesPreview.next.img = undefined;
    },

    showPrevFrame() { 
        let prevFrame = this.framesImagesCache[this.currentFrameIndex-1];
        if(prevFrame){
            this.framesPreview.prev.img = createCanvas(this.originalSize, (ctx, size, hlp) => {
                ctx.globalAlpha = 0.25;
                ctx.drawImage(prevFrame,0,0);
            })
        }
        else {
            this.framesPreview.prev.img = undefined;
        }
        //this.frames[this.currentFrameIndex-1]
    },
    hidePrevFrames() {
        this.framesPreview.prev.img = undefined;
    }
}