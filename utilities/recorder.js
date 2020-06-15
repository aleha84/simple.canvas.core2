class Recorder {
    constructor(canvas, frameRate) {
        this.recordedBlobs = [];
        this.frameRate = frameRate;
        this.mimeType = 'video/webm'
        this.mediaRecorder = undefined;
        this.canvas = canvas;

        this.stopped = false;

        if(!MediaRecorder.isTypeSupported(this.mimeType)){
            throw 'No webm support';
        }
    }

    start() {
        let options = {
            mimeType: this.mimeType,
            videoBitsPerSecond: 2500000
        }

        this.recordedBlobs = [];

        this.stream = this.canvas.captureStream(0);
        if(this.stream == undefined){
            throw 'No stream for record';
        }

        try {
            this.mediaRecorder = new MediaRecorder(this.stream, options);
        }
        catch(e) {
            alert('MediaRecorder is not supports');
            console.error('Failed to create MediaRecorder instance', e);
            return;
        }

        this.mediaRecorder.onstop = this.handleStop;
        this.mediaRecorder.ondataavailable = this.handleDataAvailable.bind(this);
        this.mediaRecorder.start(100);
        console.log('recorder started');
    }

    handleDataAvailable(event) {
        if(event.data && event.data.size > 0){
            this.recordedBlobs.push(event.data);
        }

        if(this.stopped){
            this.download();
        }
    }

    handleStop(event) {
        console.log('recorder stopped', event);
    }

    stop() {
        this.mediaRecorder.stop();
        this.stopped = true;
        //this.download();
    }

    download() {
        let name = new Date().getTime() + '.webm';
        let blob = new Blob(this.recordedBlobs, { type: this.mimeType });
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100)
    }
}