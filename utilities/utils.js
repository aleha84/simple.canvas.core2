function getRandom(min, max){
  if(min > max)
  {
    var swap = max;
    max = min;
    min = swap;
  }
  
	return Math.random() * (max - min) + min;
}

function getRandomInt(min, max){
  if(isArray(min)){
    max = min[1];
    min = min[0]; 
  }
  
  return fastRoundWithPrecision(getRandom(min, max));
}

function getRandomBool(){
  return fastRoundWithPrecision(getRandom(0, 1)) === 1;
}

function getRandomGaussian(min, max, skew = 1) {
  var u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );

  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) num = getRandomGaussian(min, max, skew); // resample between 0 and 1 if out of range
  num = Math.pow(num, skew); // Skew
  num *= max - min; // Stretch to fill range
  num += min; // offset to min
  return num;
}

function radiansToDegree (radians) {
  if(radians === undefined)
  {
    return 0;
  }
  return radians * 180/Math.PI;
}

function degreeToRadians (degree) {
  if(degree === undefined)
  {
    return 0;
  }
  return degree * Math.PI / 180;
}

function isBoolean(variable)
{
  return variable.constructor === Boolean || typeof variable === 'boolean';
}

function isString(variable)
{
  return typeof variable == 'string' || variable instanceof String;
}

function isArray(obj)
{
  return Object.prototype.toString.call(obj) === '[object Array]';
}

function isFunction(f){
  return typeof f === 'function';
}

function isClass(v) {
  return typeof v === 'function' && /^\s*class\s+/.test(v.toString());
}

var pointerEventToXY = function(e){
  var out = {x:0, y:0};
  if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
    var touch = e.touches[0] || e.changedTouches[0];
    out.x = touch.pageX;
    out.y = touch.pageY;
  } else if (
    e.type == 'pointerdown' || e.type == 'pointerup' || e.type == 'pointermove' || e.type == 'pointerover' || e.type == 'pointerout' || 
    e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| 
  e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave' || e.type=='click') {
    out.x = e.pageX;
    out.y = e.pageY;
  }
  return out;
};

function absorbTouchEvent(event) {
  if(event.type == 'touchstart' || event.type == 'touchmove' || event.type == 'touchend' || event.type == 'touchcancel'){
    var e = event || window.event;
    e.preventDefault && e.preventDefault();
    e.stopPropagation && e.stopPropagation();
    e.cancelBubble = true;
    e.returnValue = false;
    return false;   
  }
  
}

function checkClamps(clamps, value)
{
  if(!isArray(clamps) || isEmpty(clamps)){
    return 1;
  }

  if(value > clamps[1]){
    value = clamps[1];
  }
  else if(value < clamps[0]){
    value = clamps[0];
  }

  if(value == clamps[0] || value == clamps[1]){
    return -1;
  }

  return 1;
}

function isBetween(x, begin, end)
{
  if(isArray(begin)){
    end = begin[1];
    begin = begin[0];
  }

  if(begin > end)
  {
    var swap = end;
    end = begin;
    begin = swap;
  }

  return x >= begin && x <= end;

}

function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

function sqr(x) { return x * x }

function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y) }

function distToSegmentSquared(p, v, w) {
  var l2 = dist2(v, w);
  if (l2 == 0) return dist2(p, v);
  var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  if (t < 0) return dist2(p, v);
  if (t > 1) return dist2(p, w);
  return dist2(p, { x: v.x + t * (w.x - v.x),
                    y: v.y + t * (w.y - v.y) });
}

function distToSegment(p, v, w) { return Math.sqrt(distToSegmentSquared(p, v, w)); }

function getDegreeToVectorUp(p1, p2){
  var up = Vector2.up();
  var v1 = p2.substract(p1,true);
  return  Math.acos((v1.mulVector(up))/(v1.module()*up.module()));
}

function doWorkByTimer(timer, now){
  if(SCG.logics.isPaused){
    timer.delta = 0;
    return;
  }

  timer.delta = now - timer.lastTimeWork;
  if(SCG.logics.pauseDelta != 0){
    timer.delta -= SCG.logics.pauseDelta;
  }

  timer.currentDelay -= timer.delta;
  if(timer.currentDelay <= 0){
    timer.currentDelay = timer.originDelay;
    timer.doWorkInternal.call(timer.context);  
  }
  
  timer.lastTimeWork = now;
}

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

function assignDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target) || target[key] === undefined)
          Object.assign(target, { [key]: source[key] });
        else
          target[key] = assignDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    });
  }
  return assignDeep(target, ...sources);
}

function extend() {
  var options, name, src, copy, copyIsArray, clone,
    target = arguments[ 0 ] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  if ( typeof target === "boolean" ) {
    deep = target;

    target = arguments[ i ] || {};
    i++;
  }

  if ( typeof target !== "object" && !isFunction( target ) ) {
    target = {};
  }

  if ( i === length ) {
    target = this;
    i--;
  }

  for ( ; i < length; i++ ) {
    if ( ( options = arguments[ i ] ) != null ) {
      for ( name in options ) {
        src = target[ name ];
        copy = options[ name ];

        if ( target === copy ) {
          continue;
        }

        if ( deep && copy && ( isPlainObject( copy ) ||
          ( copyIsArray = isArray( copy ) ) ) ) {

          if ( copyIsArray ) {
            copyIsArray = false;
            clone = src && isArray( src ) ? src : [];

          } else {
            clone = src && isPlainObject( src ) ? src : {};
          }

          target[ name ] = extend( deep, clone, copy );

        } else if ( copy !== undefined ) {
          target[ name ] = copy;
        }
      }
    }
  }

  return target;
};

function isPlainObject( obj ) {
    var proto, Ctor;
    var toString = Object.prototype.toString,
    hasOwn = Object.prototype.hasOwnProperty;
    var fnToString = hasOwn.toString;
    var ObjectFunctionString = fnToString.call( Object );

    if ( !obj || toString.call( obj ) !== "[object Object]" ) {
      return false;
    }

    proto = getProto( obj );
    if ( !proto ) {
      return true;
    }

    Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
    return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
  }

var getProto = Object.getPrototypeOf || function( obj ) {
      return obj.__proto__;
};

function getDOMByClassName(className){
  var result = undefined;
  var elements = document.getElementsByClassName(className);
  if(elements.length > 0){
    result = elements[0];
  }
  return result;
}

function appendDomElement(parent, type, properties)
{
  if(!(parent instanceof HTMLElement) && !(parent instanceof HTMLDocument) && !(parent instanceof HTMLBodyElement)){
    throw 'Cant append new element to non html Node'
  }

  if(type != undefined && typeof type != 'string' ){
   throw 'Type must be a string';
  }

  var element = document.createElement(type);

  setAttributes(element, properties);
  
  parent.appendChild(element);

  return element;
}

function setAttributes(element, properties) {
  for (var property in properties) {
    if (properties.hasOwnProperty(property)) {
      if(property == 'on'){
        var handlers = properties[property];
        for (var handler in handlers) {
          if (handlers.hasOwnProperty(handler)) {
            element.addEventListener(handler, handlers[handler], false);
          }
        }
      }
      else if(property == 'css')
      {
        var styles = properties[property];
        for (var style in styles) {
          if (styles.hasOwnProperty(style)) {
            element.style[style] = styles[style];
          }
        }
      }
      else{
        element.setAttribute(property, properties[property]);
      }
    }
  }
}

function addListenerMulti(el, s, fn) {
  s.split(' ').forEach(function(e) {el.addEventListener(e, fn, false)});
}

function draw(ctx, props) {
  props = assignDeep({}, {
    fillStyle: undefined,
    strokeStyle: undefined,
    points: [],
    isDeltas: false,
    closePath: true,
    lineWidth: 1,
    lineCap: undefined
  }, props);

  if(props.points.length < 2)
    return;

  let oldLineWidth = ctx.lineWidth;
  let oldStrokeStyle = ctx.strokeStyle;
  let oldFillStyle = ctx.fillStyle;
  let oldLineCap = ctx.lineCap;

  ctx.beginPath();

  ctx.moveTo(props.points[0].x, props.points[0].y);
  let current = undefined;
  if(props.isDeltas){
    current = props.points[0].clone();
  }

  for(let i = 1; i < props.points.length; i++){
    let next = props.points[i]
    if(props.isDeltas){
      current.add(props.points[i], true);
      next = current;
    }

    ctx.lineTo(next.x,next.y);
  }

  if(props.closePath){
    ctx.closePath();
  }

  if(props.fillStyle){
    if(isArray(props.fillStyle)){
      for(let i = 0; i < props.fillStyle.length;i++){
        ctx.fillStyle = props.fillStyle[i];
        ctx.fill();
      }
    }
    else {
      if(typeof props.fillStyle === 'boolean')
        ctx.fillStyle = 'white';
      else 
        ctx.fillStyle = props.fillStyle;

      ctx.fill();
    }
  }

  if(props.strokeStyle){
    ctx.lineWidth = props.lineWidth;
    ctx.lineCap = props.lineCap;
    if(isArray(props.strokeStyle)){
      for(let i = 0; i < props.strokeStyle.length;i++){
        ctx.strokeStyle = props.strokeStyle[i];
        ctx.stroke();
      }
    }
    else {
      ctx.strokeStyle = props.strokeStyle;
      ctx.stroke();
    }
    
  }
  

  ctx.lineWidth = oldLineWidth;
  ctx.strokeStyle = oldStrokeStyle;
  ctx.fillStyle = oldFillStyle;
  ctx.lineCap = oldLineCap;
}

function drawFigures(ctx, points, alpha){
  if(alpha == undefined){
    alpha = 1;
  }
  ctx.globalAlpha  = alpha;
  for(var i = 0;i<points.length;i++){
    var cp = points[i];
    if(cp.length < 3){
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(cp[0].x, cp[0].y);
    for(var j = 1;j<cp.length;j++){
      ctx.lineTo(cp[j].x,cp[j].y);
    }
    ctx.fill();
  }
}

String.format = function() {
  var s = arguments[0];
  for (var i = 0; i < arguments.length - 1; i++) {       
      var reg = new RegExp("\\{" + i + "\\}", "gm");             
      s = s.replace(reg, arguments[i + 1]);
  }
  return s;
}


// via prototype is extremely slow (chrome)
// if use precalculatedPrecisions in toFixedFast it will be little faster then fastRoundWithPrecision
Number.prototype.toFixedFast = function(size){
  if(!size)
    return ~~this;

  let decimalSize = 1;
  for(let i = 0;i < size; i++){
    decimalSize*=10;
  }

  return ~~(this*decimalSize)/decimalSize;
}

var precalculatedPrecisions = [1e0, 1e1, 1e2, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10];
function fastRoundWithPrecision(num, _prec = 0){
  _precision = precalculatedPrecisions[_prec]
  return Math.round(num * _precision + 1e-14) / _precision ;
}

function fastCeilWithPrecision(num, _prec = 0){
  _precision = precalculatedPrecisions[_prec]
  return Math.ceil(num * _precision + 1e-14) / _precision ;
}

function fastFloorWithPrecision(num, _prec = 0){
  _precision = precalculatedPrecisions[_prec]
  return Math.floor(num * _precision + 1e-14) / _precision ;
}

var fast = {
  r: fastRoundWithPrecision,
  c: fastCeilWithPrecision,
  f: fastFloorWithPrecision
};

function createTimer(delay, method, context, startNow = true) {
  return {
      lastTimeWork: new Date,
      delta : startNow ? 0 : delay,
      currentDelay: startNow ? 0 : delay,//delay,
      originDelay: delay,
      doWorkInternal : method,
      context: context
  }
}

function drawByPoints(ctx, startFrom, deltaPoints) {
  ctx.beginPath();
  ctx.moveTo(startFrom.x, startFrom.y);
  let current = startFrom.clone();
  for(let i =0;i<deltaPoints.length;i++){
      current.add(deltaPoints[i], true);
      ctx.lineTo(current.x, current.y);
  }
  
  ctx.stroke();
}

function fittingString(c, str, maxWidth) {
  var width = c.measureText(str).width;
  var ellipsis = '…';
  var ellipsisWidth = c.measureText(ellipsis).width;
  if (width<=maxWidth || width<=ellipsisWidth) {
      return str;
  } else {
      var len = str.length;
      while (width>=maxWidth-ellipsisWidth && len-->0) {
          str = str.substring(0, len);
          width = c.measureText(str).width;
      }
      return str+ellipsis;
  }
}

function createCanvas(size, contextProcesser) {
  if(!size)
      throw 'Utilities.createCanvas -> No size provided ';

  let canvas = document.createElement('canvas');
  canvas.width = size.x;
  canvas.height = size.y;

  let ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  if(contextProcesser && isFunction(contextProcesser))
      contextProcesser(ctx, size, createCanvasHelper({ctx}));

  return canvas;
}

function createCanvasHelper({ctx}){
  return {
    getFillColor() {
      return ctx.fillStyle;
    },
    setFillColor(color){
      // if(!color.startsWith('rgba') && !color.startsWith('#')){
      //   color = "#" + color
      // }

      ctx.fillStyle = color; return this;
    },
    setFillStyle(color) {
      return this.setFillColor(color);
    },
    rect(x,y,w,h) {
      ctx.fillRect(x,y,w,h);return this;
    },
    rectFromTo(from, to){
      return this.rect(from.x, from.y, to.x-from.x, to.y -from.y);
    },
    clear(x,y,w=1,h=1){
      ctx.clearRect(x,y,w,h);return this;
    },
    dot(x,y){
      let _x = x; 
      let _y = y;
      
      if(x instanceof V2){
        _x = x.x;
        _y = x.y;
      }
      else if(typeof(x) == 'object' && x.x != undefined && x.y != undefined){
        _x = x.x;
        _y = x.y;
      }

      this.rect(_x,_y,1,1);return this;
    },
    strokeRect(x,y,w,h,lineWidth = 1){
      this
        .rect(x,y,w,lineWidth)
        .rect(x,y,lineWidth,h)
        .rect(x+w-lineWidth,y,lineWidth,h)
        .rect(x,y+h-lineWidth,w,lineWidth);

      return this;
    },
    strokeRectV2(topLeft,size,lineWidth = 1){
      return this.strokeRect(topLeft.x, topLeft.y, size.x, size.y, lineWidth);
    },
    circle(center, radius, dots = undefined) {
      return this.сircle(center, radius, dots);
    },
    сircle(center, radius, dots = undefined){ 
      for(let y = center.y-radius-1;y < center.y+radius+1;y++){
          for(let x = center.x-radius-1;x < center.x+radius+1;x++){

              let _p = new V2(x,y);
              let distance = center.distance(_p);

              if(distance < radius){
                  ctx.fillRect(x,y,1,1);

                  if(dots)
                    dots.push({x,y})
              }
          }
      }

      return this;
    },
    strokeEllipsis(from = 0, to = 360, step = 0.1, origin, width, height, dots = undefined, distinct = false) {
      if(height == undefined)
        height = width/2;

      let _dots = []
      for(let angle = from; angle < to; angle+=step){
          let r = degreeToRadians(angle);
          let x = fast.r(origin.x + width * Math.cos(r));
          let y = fast.r(origin.y + height * Math.sin(r));

          if(distinct){
            if(_dots.filter(d => d.x == x && d.y == y).length > 0)
              continue;
          }

          this.dot(x,y);
          _dots.push({x,y})
          // if(dots)
          //   dots.push({x,y})
      }

      if(dots){
        _dots.forEach(d => dots.push(d));
      }

      return this;
    },
    elipsis(center, radius, dots = undefined) {
      let rxSq = radius.x*radius.x;
      let rySq = radius.y*radius.y;

      for(let y = center.y-radius.y-1;y < center.y+radius.y+1;y++){
        for(let x = center.x-radius.x-1;x < center.x+radius.x+1;x++){
          if((( (x-center.x)*(x-center.x) )/(rxSq)  + ( (y-center.y)*(y-center.y)  )/(rySq)) < 1){
            ctx.fillRect(x,y,1,1);

            if(dots)
                dots.push({x,y})
          }
        }
      }
      
      return this;
    },
    elipsisRotated(center, radius, angle, dots) {
      let rxSq = radius.x*radius.x;
      let rySq = radius.y*radius.y;

      let maxSize = radius.x > radius.y ? radius.x : radius.y;
      let _cos = Math.cos(angle);
      let _sin = Math.sin(angle);

      for(let y = center.y-maxSize-1;y < center.y+maxSize+1;y++){
        for(let x = center.x-maxSize-1;x < center.x+maxSize+1;x++){
          let _x = x-center.x;
          let _y = y-center.y;

          if(Math.pow(_x*_cos + _y*_sin,2)/rxSq + Math.pow(-_x*_sin + _y*_cos,2)/rySq < 1){
            this.dot(x,y);

            if(dots)
              dots.push({x,y})
          }
        }
      }
    } 
  }
}

function hexToRgb(hex, asArray = false, asObject = false) {
  if(hex.indexOf('#') != -1){
    hex = hex.replace('#', '');
  }

  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;

  if(asArray) 
      return [r,g,b];
  
  if(asObject)
    return {r,g,b};
  
  return r + "," + g + "," + b;
}

function rgbToHex(r, g, b) {
  if(isArray(r)){
    b = r[2];
    g = r[1];
    r = r[0];
  }
  if (r > 255 || g > 255 || b > 255)
      throw "Invalid color component";

  return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function rgbToHsv (r, g, b, asArray = false) {
  if (arguments.length === 1) {
    g = r.g, b = r.b, r = r.r;
  }
  var max = Math.max(r, g, b), min = Math.min(r, g, b),
      d = max - min,
      h,
      s = (max === 0 ? 0 : d / max),
      v = max / 255;

  switch (max) {
      case min: h = 0; break;
      case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
      case g: h = (b - r) + d * 2; h /= 6 * d; break;
      case b: h = (r - g) + d * 4; h /= 6 * d; break;
  }

  let result = {
      h, s, v
  };

  if(asArray)
    return [result.h, result.s, result.v];

  return result
}

function hsvToHex({hsv, hsvAsObject = false, hsvAsInt = true }) {
  let init = hsv;
  if(hsvAsObject) {
    init = [hsv.h, hsv.s, hsv.v];
  }

  return '#' + rgbToHex(hsvToRgb(init[0]/(hsvAsInt ? 360 : 1), init[1]/(hsvAsInt ? 100:1), init[2]/(hsvAsInt ? 100 :1), true));
}

function hsvToRgb(h, s, v, asArray = false, hsvAsInt = false) {
  if(hsvAsInt){
    h/=360;s/=100;v/=100;
  }
  
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
      s = h.s, v = h.v, h = h.h;
  }
  i = fastFloorWithPrecision(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
  }
  //paint.NET has FLOOR here
  let result = {
      r: fastRoundWithPrecision(r * 255),
      g: fastRoundWithPrecision(g * 255),
      b: fastRoundWithPrecision(b * 255)
  };

  if(asArray)
    return [result.r, result.g, result.b];

  return result
}

function flipX(p, xOrigin) {
  let relativeOrigin = p.x - xOrigin;
  let reverted = -relativeOrigin;

  return new V2(reverted+xOrigin, p.y)
}

function flipY(p, yOrigin) {
  let relativeOrigin = p.y - yOrigin;
  let reverted = -relativeOrigin;

  return new V2(p.x, reverted+yOrigin)
}

function distinct(array, keyCreator){
  var keys = new Set()
  return array.filter(p => {
    let key = keyCreator(p)//p.x+'_'+p.y;
    if(keys.has(key)){
      return false;
    }
    keys.add(key);
    return true;
  })
}

function createLine(begin, end) {
  return {
    begin, end
  };
}

function getPixels(img, size) {
  let ctx = img.getContext("2d");
  let  pixels = [];

  let imageData = ctx.getImageData(0,0,size.x, size.y).data;

  for(let i = 0; i < imageData.length;i+=4){
      if(imageData[i+3] == 0)            
          continue;

      let y = fastFloorWithPrecision((i/4)/size.x);
      let x = (i/4)%size.x;
      let color = [imageData[i], imageData[i+1], imageData[i+2], fastRoundWithPrecision(imageData[i+3]/255, 4)] 

      pixels[pixels.length] = { position: new V2(x,y), color };
  }
  return pixels;
}

function getPixelsAsMatrix(img, size) {
  let pixels = getPixels(img, size);
  let result = [];
  pixels.forEach(pixel => {
    let p = pixel.position;
    if(result[p.y] == undefined) {
      result[p.y] = [];
    }

    result[p.y][p.x] = pixel.color;
  })

  return result;
}

function getLineFunction(origin, direction){
  let ox = origin.x;
  let oy = origin.y;
  let dx = direction.x;
  let dy = direction.y;

  return function(x) {
    return (((x - ox)/dx)*dy) + oy;
  }
}



