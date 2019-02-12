class EditorGO extends GO {
    constructor(options = {}){
        options = assignDeep({}, {
            size: new V2(1,1),
            renderValuesRound: true,
            img: undefined
        }, options);

        super(options)
    }

    internalRender() {
        let { context: ctx, renderSize: rs, renderPosition:rp } = this;
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.strokeRect(rp.x - rs.x/2, rp.y - rs.y/2, rs.x, rs.y);
    }
}