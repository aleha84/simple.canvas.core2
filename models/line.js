class Line {
    constructor(options = {}){
        if(options instanceof Vector2){
            if(arguments.length == 2){
                this.begin = arguments[0];
                this.end = arguments[1];
            }
            else {
                throw 'Wrong arguments for Line ctor';
            }
        }
        else if(isObject(options)) {
            if(!options.begin || !options.end)
                throw 'Begin or End of line is Required';
            
            if(options.begin.equal(options.end))
                throw 'Begin and End must not be equal';

            assignDeep(this, {}, options);
        }
        else {
            throw 'Wrong arguments for Line ctor';
        }

        this.length = this.begin.distance(this.end);
    }
}