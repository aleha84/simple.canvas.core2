var easing = {
    calcCache: {},
    get(type, method, time, startValue, change, duration, action) {
        if(!this.calcCache[type])
            this.calcCache[type] = {};

        let t = this.calcCache[type];

        if(!t[method])
            t[method] = {};

        let m = t[method];

        let key = time + '_' + startValue + '_' + change + '_' + duration;

        if(m[key] === undefined){
            m[key] = action(time, startValue, change, duration);
        }

        return m[key];
    },
    process(props){
        let group = this[props.type];
        if(!group) {
            console.trace();
            throw 'wrong easing type: ' + props.type;
        }

        let action = group[props.method];

        if(!action){
            console.trace();
            throw `wrong easing "${props.type}" method: ${props.method}`;
        }

        if(props.useCache){
            return this.get(props.type, props.method, props.time, props.startValue, props.change, props.duration, action);
        }

        return action(props.time, props.startValue, props.change, props.duration);
    },
    linear: {
        base(time, startValue, change, duration) {
            return change*time/duration + startValue;
        }
    },
    quad: {
        out(time, startValue, change, duration) {
            time /= duration;
            return -change * time*(time-2) + startValue;
        },
        in(time, startValue, change, duration) {
            time /= duration;
            return change*time*time + startValue;
        },
        inOut(time, startValue, change, duration) {
            time /= duration/2;
            if (time < 1) return change/2*time*time + startValue;
            time--;
            return -change/2 * (time*(time-2) - 1) + startValue;
        }
    },
    cubic: {
        out(time, startValue, change, duration) {
            time /= duration;
            time--;
            return change*(time*time*time + 1) + startValue;
        },
        in(time, startValue, change, duration) {
            time /= duration;
	        return change*time*time*time + startValue;
        },
        inOut(time, startValue, change, duration) {
            time /= duration/2;
            if (time < 1) return change/2*time*time*time + startValue;
            time -= 2;
            return change/2*(time*time*time + 2) + startValue;
        }
    },
    expo: {
        out(time, startValue, change, duration){
            return change * ( -Math.pow( 2, -10 * time/duration ) + 1 ) + startValue;
        },
        in(time, startValue, change, duration){
            return change * Math.pow( 2, 10 * (time/duration - 1) ) + startValue;
        },
        inOut(time, startValue, change, duration){
            time /= duration/2;
            if (time < 1) return change/2 * Math.pow( 2, 10 * (time - 1) ) + startValue;
            time--;
            return change/2 * ( -Math.pow( 2, -10 * time) + 2 ) + startValue;
        }
    },
    sin: {
        out(time, startValue, change, duration){
            return change * Math.sin(time/duration * (Math.PI/2)) + startValue;
        },
        in(time, startValue, change, duration){
            return -change * Math.cos(time/duration * (Math.PI/2)) + change + startValue;;
        },
        inOut(time, startValue, change, duration) {
            return -change/2 * (Math.cos(Math.PI*time/duration) - 1) + startValue;
        }
    }

}