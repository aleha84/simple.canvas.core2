class RenderProperties {
    constructor(options = {}){
        Object.assign(this, {
            fill : false, 
            fillStyle : 'rgba(0, 255, 0, 0.5)',
            lineWidth : 1,
            strokeStyle : '#00FF00',
            contextName: 'main'
        } ,options);

        var ctx = SCG.contexts[this.contextName];
        
        if(!ctx)
            throw 'Context not exists for RenderProperties with name ' + this.contextName;

        this.context = SCG.contexts[this.contextName];
    }
}