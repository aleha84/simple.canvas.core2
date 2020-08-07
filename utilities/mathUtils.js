var mathUtils = {
    getCurvePoints ({ start, end, midPoints, startMethod = 'out', endMethod = 'in', midPointsDefaultMethod = 'inOut', type = 'quad' }) {
        let direction = start.direction(end);
        let angle =  direction.angleTo(V2.right);

        let endRotated = end.substract(start).rotate(angle).add(start)

        let distance = start.distance(endRotated);
        let dv = start.direction(endRotated).mul(distance);

        let dots = [];
        for(let i = 0; i <= midPoints.length;i++){
            let length = 0
            let startValue = 0;
            let endValue = 0;
            //let type = 'quad';
            let method = '';
            let startX = 0;

            if(i == 0){
                startX = start.x;
                length = fast.r(distance*midPoints[0].distance);
                startValue = start.y;
                endValue = startValue+midPoints[0].yChange;
                method = startMethod
            }
            else if(i == midPoints.length){
                length = fast.r(distance - distance*midPoints[midPoints.length-1].distance);
                startX = endRotated.x - length;
                startValue = start.y+midPoints[midPoints.length-1].yChange;
                endValue = start.y;
                method = endMethod
            }
            else {
                startX = fast.r(start.x + distance*midPoints[i-1].distance);
                length = fast.r(distance*midPoints[i].distance - distance*midPoints[i-1].distance);
                startValue = start.y+midPoints[i-1].yChange;
                endValue = start.y+midPoints[i].yChange;
                method = midPointsDefaultMethod
            }

            let yChange = easing.createProps(length, startValue, endValue, type, method);

            for(let i = 0; i < length; i++){
                yChange.time = i;
                let y = easing.process(yChange);
                let x = startX + i;
                let dot = new V2(x,y).substract(start).rotate(-angle).add(start);
                dots.push(dot);
            }
        }

        return dots;
    },
    //https://rosettacode.org/wiki/Reduced_row_echelon_form#JavaScript
    reducedRowEchelonForm: function(mat) {
      let lead = 0;
      for (let r = 0; r < mat.length; r++) {
          if (mat[0].length <= lead) {
              return;
          }
          let i = r;
          while (mat[i][lead] == 0) {
              i++;
              if (mat.length == i) {
                  i = r;
                  lead++;
                  if (mat[0].length == lead) {
                      return;
                  }
              }
          }
   
          let tmp = mat[i];
          mat[i] = mat[r];
          mat[r] = tmp;
   
          let val = mat[r][lead];
          for (let j = 0; j < mat[0].length; j++) {
              mat[r][j] /= val;
          }
   
          for (let i = 0; i < mat.length; i++) {
              if (i == r) continue;
              val = mat[i][lead]
              for (let j = 0; j < mat[0].length; j++) {
                  mat[i][j] -=  val*mat[r][j]
              }
          }
          lead++;
      }
      return mat;
    },
    //https://github.com/Simsso/Online-Tools/blob/master/src/page/logic/cubic-spline-interpolation.js
    cubicSplineInterpolation(p, boundary = '') {
      let row = 0;
      let solutionIndex = (p.length - 1) * 4;
  
      // initialize matrix
      let m = []; // rows
      for (let i = 0; i < (p.length - 1) * 4; i++) {
          // columns (rows + 1)
          m.push([]);
          for (let j = 0; j <= (p.length - 1) * 4; j++) {
              m[i].push(0); // fill with zeros
          }
      }
  
      // splines through p equations
      for (let functionNr = 0; functionNr < p.length-1; functionNr++, row++) {
          let p0 = p[functionNr], p1 = p[functionNr+1];
          m[row][functionNr*4+0] = Math.pow(p0.x, 3);
          m[row][functionNr*4+1] = Math.pow(p0.x, 2); 
          m[row][functionNr*4+2] = p0.x;
          m[row][functionNr*4+3] = 1; 
          m[row][solutionIndex] = p0.y;
  
          m[++row][functionNr*4+0] = Math.pow(p1.x, 3);
          m[row][functionNr*4+1] = Math.pow(p1.x, 2); 
          m[row][functionNr*4+2] = p1.x;
          m[row][functionNr*4+3] = 1; 
          m[row][solutionIndex] = p1.y;
      }
  
      // first derivative
      for (let functionNr = 0; functionNr < p.length - 2; functionNr++, row++) {
          let p1 = p[functionNr+1];
          m[row][functionNr*4+0] = 3*Math.pow(p1.x, 2);
          m[row][functionNr*4+1] = 2*p1.x;
          m[row][functionNr*4+2] = 1;
          m[row][functionNr*4+4] = -3*Math.pow(p1.x, 2);
          m[row][functionNr*4+5] = -2*p1.x;
          m[row][functionNr*4+6] = -1;
      }
  
      // second derivative
      for (let functionNr = 0; functionNr < p.length - 2; functionNr++, row++) {
          let p1 = p[functionNr+1];
          m[row][functionNr*4+0] = 6* p1.x;
          m[row][functionNr*4+1] = 2;
          m[row][functionNr*4+4] = -6*p1.x;
          m[row][functionNr*4+5] = -2;
      }
  
      // boundary conditions
      switch (boundary) {
          case "quadratic": // first and last spline quadratic
              m[row++][0] = 1;
              m[row++][solutionIndex-4+0] = 1;
              break;
  
          case "notaknot": // Not-a-knot spline
              m[row][0+0] = 1;
              m[row++][0+4] = -1;
              m[row][solutionIndex-8+0] = 1;
              m[row][solutionIndex-4+0] = -1;
              break;
  
          case "periodic": // periodic function
              // first derivative of first and last point equal
              m[row][0] = 3* Math.pow(p[0].x, 2);
              m[row][1] = 2* p[0].x;
              m[row][2] = 1;
              m[row][solutionIndex-4+0] = -3* Math.pow(p[p.length-1].x, 2);
              m[row][solutionIndex-4+1] = -2* p[p.length-1].x;
              m[row++][solutionIndex-4+2] = -1;
  
              // second derivative of first and last point equal
              m[row][0] = 6* p[0].x;
              m[row][1] = 2;
              m[row][solutionIndex-4+0] = -6* p[p.length-1].x;
              m[row][solutionIndex-4+1] = -2;
              break;
  
          default: // natural spline
              m[row][0+0] = 6* p[0].x;
              m[row++][0+1] = 2;
              m[row][solutionIndex-4+0] = 6* p[p.length-1].x;
              m[row][solutionIndex-4+1] = 2;
              break;
      }
  
  
      let reducedRowEchelonForm = this.reducedRowEchelonForm(m);
      let coefficients = [];
      for (let i = 0; i < reducedRowEchelonForm.length; i++) {
          coefficients.push(reducedRowEchelonForm[i][reducedRowEchelonForm[i].length - 1]);
      }
  
      let functions = [];
      for (let i = 0; i < coefficients.length; i += 4) {
          functions.push({
              a: parseFloat(coefficients[i]),
              b: parseFloat(coefficients[i+1]),
              c: parseFloat(coefficients[i+2]),
              d: parseFloat(coefficients[i+3]),
              range: { xmin: parseFloat(p[i/4].x), xmax: parseFloat(p[i/4+1].x) }
          })
      }
      return functions;
    },
    //https://github.com/Simsso/Online-Tools/blob/master/src/page/logic/polynomial-interpolation.js
    polynomialInterpolation(p) {
      let m = []; // matrix
      let numPoints = p.length; // number of points
  
      // fill matrix
      for (let row = 0; row < numPoints; row++) {
          m.push([]);
  
          // "<="" because of the solution column
          for (let col = 0; col <= numPoints; col++) {
              if (col < numPoints) { // coefficients
                  m[row][col] = Math.pow(p[row].x, numPoints - col - 1);
              }
              else { // solution
                  m[row][col] = p[row].y;
              }
          }
      }
  
      let reducedRowEchelonForm = this.reducedRowEchelonForm(m);
      let coefficients = [];
      for (let i = 0; i < reducedRowEchelonForm.length; i++) {
          coefficients.push(reducedRowEchelonForm[i][reducedRowEchelonForm[i].length - 1]);
      }
      return coefficients;
    },
    getPolinomFormula(dots) {
        let coefficients = this.polynomialInterpolation(dots);
        return (x)  => {
            let y = 0; 
            for (let i = 0; i < coefficients.length; i++) {
                let c = coefficients[i];
                y += c * Math.pow(x, coefficients.length - i - 1);
            }
            return y;
        }
    },
    getCubicSplineFormula(dots) {
        let functions = this.cubicSplineInterpolation(dots);
        return (x) => {
            for (var i = 0; i < functions.length; i++) {
                if (functions[i].range.xmin <= x && functions[i].range.xmax >= x) {
                    return functions[i].a * x * x * x + functions[i].b * x * x + functions[i].c * x + functions[i].d;
                }
            }
            return undefined;
        }
    },
    Perlin: function(seed) {
    
        // Alea random number generator.
        //----------------------------------------------------------------------------//
        
            // From http://baagoe.com/en/RandomMusings/javascript/
            function Alea() {
              return (function(args) {
                // Johannes BaagÃ¸e <baagoe@baagoe.com>, 2010
                var s0 = 0;
                var s1 = 0;
                var s2 = 0;
                var c = 1;
        
                if (args.length == 0) {
                  args = [+new Date];
                }
                var mash = Mash();
                s0 = mash(' ');
                s1 = mash(' ');
                s2 = mash(' ');
        
                for (var i = 0; i < args.length; i++) {
                  s0 -= mash(args[i]);
                  if (s0 < 0) {
                    s0 += 1;
                  }
                  s1 -= mash(args[i]);
                  if (s1 < 0) {
                    s1 += 1;
                  }
                  s2 -= mash(args[i]);
                  if (s2 < 0) {
                    s2 += 1;
                  }
                }
                mash = null;
        
                var random = function() {
                  var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
                  s0 = s1;
                  s1 = s2;
                  return s2 = t - (c = t | 0);
                };
                random.uint32 = function() {
                  return random() * 0x100000000; // 2^32
                };
                random.fract53 = function() {
                  return random() + 
                    (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
                };
                random.version = 'Alea 0.9';
                random.args = args;
                return random;
        
              } (Array.prototype.slice.call(arguments)));
            };
        
            // From http://baagoe.com/en/RandomMusings/javascript/
            // Johannes BaagÃ¸e <baagoe@baagoe.com>, 2010
            function Mash() {
              var n = 0xefc8249d;
        
              var mash = function(data) {
                data = data.toString();
                for (var i = 0; i < data.length; i++) {
                  n += data.charCodeAt(i);
                  var h = 0.02519603282416938 * n;
                  n = h >>> 0;
                  h -= n;
                  h *= n;
                  n = h >>> 0;
                  h -= n;
                  n += h * 0x100000000; // 2^32
                }
                return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
              };
        
              mash.version = 'Mash 0.9';
              return mash;
            }
        
        // Classic Perlin noise, 3D version 
        //----------------------------------------------------------------------------//
        
            var ClassicalNoise = function(r) { // Classic Perlin noise in 3D, for comparison 
                if (r == undefined) r = Math;
              this.grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0], 
                                             [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1], 
                                             [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]]; 
              this.p = [];
              for (var i=0; i<256; i++) {
                  this.p[i] = Math.floor(r.random()*256);
              }
              // To remove the need for index wrapping, double the permutation table length 
              this.perm = []; 
              for(var i=0; i<512; i++) {
                    this.perm[i]=this.p[i & 255];
              }
            };
        
            ClassicalNoise.prototype.dot = function(g, x, y, z) { 
                return g[0]*x + g[1]*y + g[2]*z; 
            };
        
            ClassicalNoise.prototype.mix = function(a, b, t) { 
                return (1.0-t)*a + t*b; 
            };
        
            ClassicalNoise.prototype.fade = function(t) { 
                return t*t*t*(t*(t*6.0-15.0)+10.0); 
            };
        
            ClassicalNoise.prototype.noise = function(x, y, z) { 
              // Find unit grid cell containing point 
              var X = Math.floor(x); 
              var Y = Math.floor(y); 
              var Z = Math.floor(z); 
              
              // Get relative xyz coordinates of point within that cell 
              x = x - X; 
              y = y - Y; 
              z = z - Z; 
              
              // Wrap the integer cells at 255 (smaller integer period can be introduced here) 
              X = X & 255; 
              Y = Y & 255; 
              Z = Z & 255;
              
              // Calculate a set of eight hashed gradient indices 
              var gi000 = this.perm[X+this.perm[Y+this.perm[Z]]] % 12; 
              var gi001 = this.perm[X+this.perm[Y+this.perm[Z+1]]] % 12; 
              var gi010 = this.perm[X+this.perm[Y+1+this.perm[Z]]] % 12; 
              var gi011 = this.perm[X+this.perm[Y+1+this.perm[Z+1]]] % 12; 
              var gi100 = this.perm[X+1+this.perm[Y+this.perm[Z]]] % 12; 
              var gi101 = this.perm[X+1+this.perm[Y+this.perm[Z+1]]] % 12; 
              var gi110 = this.perm[X+1+this.perm[Y+1+this.perm[Z]]] % 12; 
              var gi111 = this.perm[X+1+this.perm[Y+1+this.perm[Z+1]]] % 12; 
              
              // The gradients of each corner are now: 
              // g000 = grad3[gi000]; 
              // g001 = grad3[gi001]; 
              // g010 = grad3[gi010]; 
              // g011 = grad3[gi011]; 
              // g100 = grad3[gi100]; 
              // g101 = grad3[gi101]; 
              // g110 = grad3[gi110]; 
              // g111 = grad3[gi111]; 
              // Calculate noise contributions from each of the eight corners 
              var n000= this.dot(this.grad3[gi000], x, y, z); 
              var n100= this.dot(this.grad3[gi100], x-1, y, z); 
              var n010= this.dot(this.grad3[gi010], x, y-1, z); 
              var n110= this.dot(this.grad3[gi110], x-1, y-1, z); 
              var n001= this.dot(this.grad3[gi001], x, y, z-1); 
              var n101= this.dot(this.grad3[gi101], x-1, y, z-1); 
              var n011= this.dot(this.grad3[gi011], x, y-1, z-1); 
              var n111= this.dot(this.grad3[gi111], x-1, y-1, z-1); 
              // Compute the fade curve value for each of x, y, z 
              var u = this.fade(x); 
              var v = this.fade(y); 
              var w = this.fade(z); 
               // Interpolate along x the contributions from each of the corners 
              var nx00 = this.mix(n000, n100, u); 
              var nx01 = this.mix(n001, n101, u); 
              var nx10 = this.mix(n010, n110, u); 
              var nx11 = this.mix(n011, n111, u); 
              // Interpolate the four results along y 
              var nxy0 = this.mix(nx00, nx10, v); 
              var nxy1 = this.mix(nx01, nx11, v); 
              // Interpolate the two last results along z 
              var nxyz = this.mix(nxy0, nxy1, w); 
        
              return nxyz; 
            };
        
        
        //----------------------------------------------------------------------------//
        
        
            var rand = {};
            rand.random = new Alea(seed);
            var noise = new ClassicalNoise(rand);
            
            this.noise = function (x, y, z) {
                return 0.5 * noise.noise(x, y, z) + 0.5;
            }
            
        }
  }