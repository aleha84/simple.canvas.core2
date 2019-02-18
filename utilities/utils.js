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
  return Math.round(getRandom(min, max));
}

function getRandomBool(){
  return Math.round(getRandom(0, 1)) === 1;
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
  } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave' || e.type=='click') {
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
      contextProcesser(ctx, size);

  return canvas;
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
  if (r > 255 || g > 255 || b > 255)
      throw "Invalid color component";
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function flipX(p, xOrigin) {
  let relativeOrigin = p.x - xOrigin;
  let reverted = -relativeOrigin;

  return new V2(reverted+xOrigin, p.y)
}

function distinct(array){
  var keys = new Set()
  return arr.filter(p => {
    let key = p.x+'_'+p.y;
    if(keys.has(key)){
      return false;
    }
    keys.add(key);
    return true;
  })
}
