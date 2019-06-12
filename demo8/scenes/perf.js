class PerfScene extends Scene {
    constructor(options = {}) {
        options = assignDeep({}, {
            debug: {
                enabled: true,
                showFrameTimeLeft: true,
                additional: [],
            },
            imgCache: {}
        }, options)

        super(options);

    }

    backgroundRender() {
        this.backgroundRenderDefault();
    }
}