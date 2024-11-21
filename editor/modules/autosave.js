components.autosave = {
    enabled: false,
    defaultCounterValue: 10,
    currentCounter: 0,
    startFrameIndex: 0,
    multiplier: 5,
    frames: [],
    updateParams({enabled= false, defaultCounterValue = 10, startFrameIndex = 0, multiplier = 5}) {
        this.defaultCounterValue = defaultCounterValue;
        this.startFrameIndex = startFrameIndex;
        this.enabled = enabled;
        this.multiplier = multiplier;
    },
    addFrame(frame) {
        if(!this.enabled)
            return;

        if(this.currentCounter == 0) {
            this.currentCounter = this.defaultCounterValue;

            this.frames.push(createCanvas({x: frame.width, y: frame.height}, (ctx, size, hlp) => {
                ctx.drawImage(frame, 0,0)
            }))

            //notifications.done("Autosave:" + this.frames.length, 1000)

            if(this.frames.length % 100 == 0){
                notifications.done("Autosave frames: " + this.frames.length, false)
            }
        }
        else {
            this.currentCounter--;
        }
    },
    save() {
        if(this.frames.length == 0) 
        {
            notifications.error('No frames collected!', 5000);
            return;
        }

        let zip = new JSZip();
        this.frames.forEach((frame, i) => {
            zip.file("frame_" + zeroPad(this.startFrameIndex + i, 4) + '.png', 
            createCanvas({x: frame.width*this.multiplier, y: frame.height*this.multiplier}, (ctx, size, hlp) => {
                ctx.drawImage(frame, 0,0, size.x, size.y)
            }).toDataURL().split(',')[1], {base64: true});
        })

        zip.generateAsync({type: 'base64'}).then(function(content) {
            let link = document.createElement("a");
            link.download = 'autosave_frames.zip';
            link.href = "data:application/zip;base64,"+content
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        this.frames = [];
    }
}