function boxIntersectsBox(a,b)
{
  return (Math.abs(a.center.x - b.center.x) * 2 < (a.size.x + b.size.x)) &&
         (Math.abs(a.center.y - b.center.y) * 2 < (a.size.y + b.size.y));
}

function boxCircleIntersects(circle, rect)
{ 
	let circleDistance = new Vector2(Math.abs(circle.center.x - rect.center.x),Math.abs(circle.center.y - rect.center.y));
	if(circleDistance.x > (rect.size.x/2 + circle.radius))
	{
		return false;
	}
	if(circleDistance.y > (rect.size.y/2 + circle.radius))
	{
		return false;
	}

	if(circleDistance.x <= (rect.size.x/2)) 
	{
		return true; 
	}
	if(circleDistance.y <= (rect.size.y/2))
	{
		return true;
	}
	let cornerDistance_sq = Math.pow(circleDistance.x - rect.size.x/2,2) + Math.pow(circleDistance.y - rect.size.y/2,2);
	return (cornerDistance_sq <= Math.pow(circle.radius,2))
}

function segmentIntersectBox(segment,box)
  {
    let minX = segment.begin.x;
    let maxX = segment.end.x;
    if(segment.begin.x > segment.end.x)
    {
      minX = segment.end.x;
      maxX = segment.begin.x;
    }
   if(maxX > box.bottomRight.x)
    {
      maxX = box.bottomRight.x;
    }
    if(minX < box.topLeft.x)
    {
      minX = box.topLeft.x;
    }
    if(minX > maxX) 
    {
      return false;
    }
    let minY = segment.begin.y;
    let maxY = segment.end.y;
    let dx = segment.end.x - segment.begin.x;
    if(Math.abs(dx) > 0.0000001)
    {
      let a = (segment.end.y - segment.begin.y) / dx;
      let b = segment.begin.y - a * segment.begin.x;
      minY = a * minX + b;
      maxY = a * maxX + b;
    }
    if(minY > maxY)
    {
      let tmp = maxY;
      maxY = minY;
      minY = tmp;
    }
    if(maxY > box.bottomRight.y)
    {
      maxY = box.bottomRight.y;
    }
    if(minY < box.topLeft.y)
    {
      minY = box.topLeft.y;
    }
    if(minY > maxY) // If Y-projections do not intersect return false
    {
      return false;
    }
    return true;
  }

  function segmentIntersectCircle(segment,circle)
{
    let d = segment.end.substract(segment.begin,true);
    let f = segment.begin.substract(circle.center,true);

    let a = d.dot(d);
    let b = 2*f.dot(d);
    let c = f.dot(f) - Math.pow(circle.radius,2);
    let discriminant = b*b-4*a*c;
    if(discriminant<0)
    {
      return false;
    }

    discriminant = Math.sqrt(discriminant);
    let t1 = (-b - discriminant)/(2*a);
    let t2 = (-b + discriminant)/(2*a);

    if(t1 >= 0 && t1 <=1)
    {
      return true;
    }
    if(t2>=0 && t2 <=1)
    {
      return true;
    }
    return false;
}

function segmentIntersectCircle2(segment,circle)
{
  var d1 = circle.center.distance(segment.begin);
  var d2 = circle.center.distance(segment.end);
  return d1 <= circle.radius || d2 <= circle.radius;
}

// slowest if segmentsIntersectionVector2 used without fastRoundWithPrecision
// medium  if segmentsIntersectionVector2 used with    fastRoundWithPrecision
function segmentsIntersectionVector2_1(line1, line2){ 
  let result = undefined;
  let b = line1.end.substract(line1.begin);
  let d = line2.end.substract(line2.begin);
  let bDotPerp = b.x*d.y - b.y*d.x;
  if(bDotPerp === 0)
    return undefined;
  
  let c = line2.begin.substract(line1.begin);
  let t = (c.x*d.y - c.y*d.x)/bDotPerp;
  if(t <0 || t > 1)
    return undefined;
  
  let u = (c.x*b.y - c.y*b.x)/bDotPerp;
  if(u < 0 || u > 1)
    return undefined;
  
  return line1.begin.add(b.mul(t));
}

// fastest becouse no V2 used. 
function segmentsIntersectionVector2_1_noV2(line1, line2){ 
  let result = undefined;
  //let b = line1.end.substract(line1.begin);
  let bx = line1.end.x-line1.begin.x;
  let by = line1.end.y-line1.begin.y;

  //  let d = line2.end.substract(line2.begin);
  let dx = line2.end.x-line2.begin.x;
  let dy = line2.end.y-line2.begin.y;

  let bDotPerp = bx*dy - by*dx;
  if(bDotPerp === 0)
    return undefined;
  
  //  let c = line2.begin.substract(line1.begin);
  let cx = line2.begin.x - line1.begin.x;
  let cy = line2.begin.y - line1.begin.y;

  let t = (cx*dy - cy*dx)/bDotPerp;
  if(t <0 || t > 1)
    return undefined;
  
  let u = (cx*by - cy*bx)/bDotPerp;
  if(u < 0 || u > 1)
    return undefined;
  
  //return line1.begin.add(b.mul(t));
  return new V2(
    line1.begin.x+bx*t,
    line1.begin.y+by*t
  )
}

// medium faster without fastRoundWithPrecision
// slowest with fastRoundWithPrecision
// without fastRoundWithPrecision missing some intersections due to xi < Math.min(x1,x2) and others if values deltas is 0.0000.... DO NOT USE!
function segmentsIntersectionVector2(line1, line2) 
{
  let x1 = fastRoundWithPrecision(line1.begin.x,5);//.toFixed(2);
  let x2 = fastRoundWithPrecision(line1.end.x,5);//.toFixed(2);
  let y1 = fastRoundWithPrecision(line1.begin.y,5);//.toFixed(2);
  let y2 = fastRoundWithPrecision(line1.end.y,5);//.toFixed(2);
  let x3 = fastRoundWithPrecision(line2.begin.x,5);//.toFixed(2);
  let x4 = fastRoundWithPrecision(line2.end.x,5);//.toFixed(2);
  let y3 = fastRoundWithPrecision(line2.begin.y,5);//.toFixed(2);
  let y4 = fastRoundWithPrecision(line2.end.y,5);//.toFixed(2);

  let d = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);
  if(d == 0)
  {
    return undefined;
  }

  let xi = fastRoundWithPrecision((((x3-x4)*(x1*y2-y1*x2)-(x1-x2)*(x3*y4-y3*x4))/d),5);//.toFixed(2);
  let yi = fastRoundWithPrecision((((y3-y4)*(x1*y2-y1*x2)-(y1-y2)*(x3*y4-y3*x4))/d),5);//.toFixed(2);

  let p = new Vector2(xi,yi);
  if (xi < Math.min(x1,x2) || xi > Math.max(x1,x2)) return undefined;
  if (xi < Math.min(x3,x4) || xi > Math.max(x3,x4)) return undefined;
  if (yi < Math.min(y1,y2) || yi > Math.max(y1,y2)) return undefined; 
  if (yi < Math.min(y3,y4) || yi > Math.max(y3,y4)) return undefined;
  return p;
}

function segmentsIntersection(line1, line2)
{
  let CmP = line1.begin.directionNonNormal(line2.begin);
  let r = line1.begin.directionNonNormal(line1.end);
  let s = line2.begin.directionNonNormal(line2.end);

  let CmPxr = CmP.x * r.y - CmP.y*r.x;
  let CmPxs = CmP.x * s.y - CmP.y * s.x;
  let rxs = r.x * s.y - r.y*s.x;

  if(CmPxr == 0)
  {
    return ((line2.begin.x - line1.begin.x < 0) != (line2.begin.x - line1.end.x < 0)) || ((line2.begin.y - line1.begin.y < 0) != (line2.begin.y - line1.end.y < 0));
  }

  if(rxs == 0)
  {
    return false;
  }

  let rxsr = 1.0/rxs;
  let t = CmPxs * rxsr;
  let u = CmPxr * rxsr;

  return (t >= 0) && (t <= 1) && (u >= 0) && (u <= 1);
}

function raySegmentIntersection(rayOrigin, direction, line){
    let v1 = rayOrigin.substract(line.begin);
    let v2 = line.end.substract(line.begin);
    let v3 = new V2(-direction.y, direction.x);

    let dot = v2.dot(v3);
    if(Math.abs(dot) < 0.000001)
        return undefined;

    let t1 = v2.cross(v1) / dot;
    let t2 = (v1.mulVector(v3))/dot;

    if(t1 >= 0 && (t2 >= 0 && t2 <= 1))
        return t1;

    return undefined;
}

function raySegmentIntersectionVector2(rayOrigin, direction, line){
    if(direction.y/direction.x != (line.end.y - line.begin.y)/(line.end.x - line.begin.x)){
        let d = ((direction.x*(line.end.y - line.begin.y))- direction.y*(line.end.x-line.begin.x));
        if(d!= 0){
            let r = (((rayOrigin.y - line.begin.y) * (line.end.x-line.begin.x)) - (rayOrigin.x - line.begin.x) * (line.end.y - line.begin.y)) / d;
            let s = (((rayOrigin.y - line.begin.y) * direction.x) - (rayOrigin.x - line.begin.x) * direction.y) / d;
            if (r >= 0 && s >= 0 && s <= 1)
            {
                return new V2(rayOrigin.x + r * direction.x, rayOrigin.y + r * direction.y);
            }
        }
    }

    return undefined;
}

function rayBoxIntersection(rayOrigin, direction, box){
    return [
        raySegmentIntersectionVector2(rayOrigin, direction, new Line(box.topLeft, box.topRight)),
        raySegmentIntersectionVector2(rayOrigin, direction, new Line(box.topRight, box.bottomRight)),
        raySegmentIntersectionVector2(rayOrigin, direction, new Line(box.bottomLeft, box.bottomRight)),
        raySegmentIntersectionVector2(rayOrigin, direction, new Line(box.topLeft, box.bottomLeft))
    ].filter((item) => item !== undefined);
}