var THREE = require('../lib/three');

var CustomMesh = {
  
    ////////////////////////////////////////////////////////////////////////////////////
    // RANDOM SHAPE
    ////////////////////////////////////////////////////////////////////////////////////
  
    matShininess : 0,
    matSpecular : 0x000000,
  
    flatshadeGeometry : function(geom){
      geom.computeFaceNormals();
      for ( var i = 0; i < geom.faces.length; i ++ ) {
        geom.faces[ i ].vertexNormals = [];
      }
      geom = new THREE.BufferGeometry().fromGeometry( geom );
    },
  
    RandomClosedMesh : function(pointsCount, minRay, maxRay, d, color){
      var shape = new THREE.Shape();
      var angleStep = (Math.PI*2/pointsCount);
      var startPoint={};
      for (var i=0;i<pointsCount;i++){
        var a =  (angleStep*i)+ Math.random()*.1
        var r = minRay + Math.random()*(maxRay-minRay);
            
        var tx = Math.cos(a)*r;
        var tz = Math.sin(a)*r;
        if (i==0){
          startPoint = {x:tx, z:tz};
          shape.moveTo(tx, tz);  
        }else{
          shape.lineTo(tx, tz);
        }
      }
      shape.lineTo(startPoint.x, startPoint.z); 
  
      var extrudeSettings = { amount: d, bevelEnabled: false };
      var shapeGeom = new THREE.ExtrudeGeometry( shape, extrudeSettings );
      CustomMesh.flatshadeGeometry(shapeGeom);
      mesh = new THREE.Mesh(shapeGeom, new THREE.MeshLambertMaterial({ 
        color: color
      }));
      return mesh;
  
    },
  
    ////////////////////////////////////////////////////////////////////////////////////
    //                                                                      ISO TRIANGLE
    ////////////////////////////////////////////////////////////////////////////////////
  
    TriMesh : function(w,h,d,color, direction){
      var shape = new THREE.Shape();
      shape.moveTo(-w/2,0);
      shape.lineTo(0,h);
      shape.lineTo(w/2,0);
      shape.lineTo(-w/2,0);
  
      var mat = new THREE.MeshLambertMaterial({ 
          color: color
        })
  
      var geom;
      
      if (d===0){
        geom = new THREE.ShapeGeometry(shape);
        mat.side = THREE.DoubleSide;
      }else{
        var extrudeSettings = { amount: d, bevelEnabled: false };
        geom = new THREE.ExtrudeGeometry( shape, extrudeSettings );
      } 
      if (direction == "down"){
        geom.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI));
        geom.applyMatrix(new THREE.Matrix4().makeTranslation(0,h,0));
      }
      CustomMesh.flatshadeGeometry(geom);
      var mesh = new THREE.Mesh(geom, mat);
      return mesh;
    },
  
    ////////////////////////////////////////////////////////////////////////////////////
    //                                                                             PLANE
    ////////////////////////////////////////////////////////////////////////////////////
  
    PlaneMesh : function(w,d,s,color){
       var mat = new THREE.MeshLambertMaterial({ 
          color: color
        });  
  
      var geom = new THREE.PlaneGeometry( w, d, s, s );
      CustomMesh.flatshadeGeometry(geom);
      var mesh = new THREE.Mesh(geom, mat);
      return mesh;
    },
  
    ////////////////////////////////////////////////////////////////////////////////////
    //                                                                           DIAMOND 
    ////////////////////////////////////////////////////////////////////////////////////
  
  
    DiamondMesh : function(w,h,pM,d,color){
      var shape = new THREE.Shape();
      var mh = h*pM; // middle height = height * percentageMiddle
      shape.moveTo(0,0);
      shape.lineTo(-w/2,mh);
      shape.lineTo(0,h);
      shape.lineTo(w/2,mh);
      shape.lineTo(0,0);
  
      var mat = new THREE.MeshLambertMaterial({ 
          color: color
        })
  
      var geom;
      
      if (d===0){
        geom = new THREE.ShapeGeometry(shape);
        mat.side = THREE.DoubleSide;
  
      }else{
        var extrudeSettings = { amount: d, bevelEnabled: false };
        geom = new THREE.ExtrudeGeometry( shape, extrudeSettings ); 
      } 
  
      CustomMesh.flatshadeGeometry(geom);
      
      var mesh = new THREE.Mesh(geom, mat);
      return mesh;
    },
  
    
  
    ////////////////////////////////////////////////////////////////////////////////////
    //                                                                    REGULAR PLYGON 
    ////////////////////////////////////////////////////////////////////////////////////
  
    RegPolyMesh : function(ray,seg,d,color, center){
  
      var shape = new THREE.Shape();
      var angleStep = (Math.PI*2/seg);
      var startPoint={};
  
      for (var i=0;i<seg;i++){
        var a =  (angleStep*i);
        var tx = Math.cos(a)*ray;
        var ty = Math.sin(a)*ray;
        if (i==0){
          startPoint = {x:tx, y:ty};
          shape.moveTo(tx, ty);  
        }else{
          shape.lineTo(tx, ty);
        }
      }
      shape.lineTo(startPoint.x, startPoint.y); 
  
      var mat = new THREE.MeshLambertMaterial({ 
        color: color,
      })
  
      var geom;
      
      if (d===0){
        geom = new THREE.ShapeGeometry(shape);
        mat.side = THREE.DoubleSide;
      }else{
        var extrudeSettings = { amount: d, bevelEnabled: false };
        geom = new THREE.ExtrudeGeometry( shape, extrudeSettings ); 
      } 
  
      geom.applyMatrix(new THREE.Matrix4().makeRotationZ(-Math.PI/2));
      
      if (!center){
        geom.applyMatrix(new THREE.Matrix4().makeTranslation(0,ray,0));
      }
      CustomMesh.flatshadeGeometry(geom);
      var mesh = new THREE.Mesh(geom, mat);
      return mesh;
    },
  
    //
  
    ////////////////////////////////////////////////////////////////////////////////////
    //                                                                         RECTANGLE 
    ////////////////////////////////////////////////////////////////////////////////////
  
    RectMesh : function(w,h,d,color){
      var shape = new THREE.Shape();
      shape.moveTo(-w/2,0);
      shape.lineTo(-w/2,h);
      shape.lineTo(w/2,h);
      shape.lineTo(w/2,0);
      shape.lineTo(-w/2,0);
  
      var mat = new THREE.MeshLambertMaterial({ 
          color: color
        })
  
      var geom;
      
      if (d===0){
        geom = new THREE.ShapeGeometry(shape);
        mat.side = THREE.DoubleSide;
  
      }else{
        var extrudeSettings = { amount: d, bevelEnabled: false };
        geom = new THREE.ExtrudeGeometry( shape, extrudeSettings ); 
      } 
      CustomMesh.flatshadeGeometry(geom);
      var mesh = new THREE.Mesh(geom, mat);
      return mesh;
    },
  
    ////////////////////////////////////////////////////////////////////////////////////
    //                                                                            SPHERE 
    ////////////////////////////////////////////////////////////////////////////////////
  
    SphereMesh : function(ray,sw,sh,color, center){
      var geom = new THREE.SphereGeometry( ray, sw, sh);
      var mat = new THREE.MeshLambertMaterial({ 
        color: color,
      });
      if (!center){
        geom.applyMatrix(new THREE.Matrix4().makeTranslation(0,ray,0));
      }
      CustomMesh.flatshadeGeometry(geom);
      var mesh = new THREE.Mesh(geom, mat);
      return mesh;
    },
  
    ////////////////////////////////////////////////////////////////////////////////////
    //                                                                              CUBE 
    ////////////////////////////////////////////////////////////////////////////////////
  
    CubeMesh : function(w,h,d,color, center, onTip){
      var geom = new THREE.CubeGeometry( w, h, d, 1, 1, 1);
      var mat = new THREE.MeshLambertMaterial({ 
        color: color
      });
      var d;
      if (onTip){
        var vertPos = new THREE.Vector3( w/2, 0, d/2 );
        d = vertPos.length();
        geom.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI/4));
        geom.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/4));
      }else{
        d = h/2;
      }
      if (!center){
        geom.applyMatrix(new THREE.Matrix4().makeTranslation(0,d,0));
      }
      CustomMesh.flatshadeGeometry(geom);
      var mesh = new THREE.Mesh(geom, mat);
      return mesh;
    },
  
    ////////////////////////////////////////////////////////////////////////////////////
    //                                                                          CYLINDER
    ////////////////////////////////////////////////////////////////////////////////////
  
    CylinderMesh : function(rayTop,rayBotton,h,segR, segH, color, center){
      var geom = new THREE.CylinderGeometry( rayTop, rayBotton, h, segR, segH);
      var mat = new THREE.MeshLambertMaterial({ 
        color: color,
      });
      if (!center) geom.applyMatrix(new THREE.Matrix4().makeTranslation(0,h/2,0));  
      CustomMesh.flatshadeGeometry(geom);
      var mesh = new THREE.Mesh(geom, mat);
      return mesh;
    },
  
    ////////////////////////////////////////////////////////////////////////////////////
    //                                                                            TORUS
    ////////////////////////////////////////////////////////////////////////////////////
  
    QuarterTorusMesh : function(radius,radiusTube,radialSegments,tubularSegments, arc, color){
      
      var points = [];
      var curves = [];
  
      var i, a;
      var angleStep = arc / radialSegments;
  
      
      //points.push(new THREE.Vector3( radius, -.1, 0 ));
  
      for (i = 0 ; i<radialSegments+1; i++){
        var vx = Math.cos((-Math.PI/2) - (i*angleStep)) * radius;
        var vy = Math.sin((-Math.PI/2) - (i*angleStep)) * radius;
        points.push(new THREE.Vector3( vx, vy, 0 ));
      }
  
      //points.push(new THREE.Vector3( -.1, radius, 0 ));
  
  
      var shape = new THREE.Shape();
      angleStep = (Math.PI*2/tubularSegments);
      var startPoint={};
  
      for (i=0;i<tubularSegments;i++){
        a =  (angleStep*i);
        var vertX = Math.cos(a)*radiusTube;
        var vertY = Math.sin(a)*radiusTube;
        if (i==0){
          startPoint = {x:vertX, y:vertY};
          shape.moveTo(vertX, vertY);  
        }else{
          shape.lineTo(vertX, vertY);
        }
      }
      shape.lineTo(startPoint.x, startPoint.y); 
  
      //var spline =  new THREE.CurvePath( points );
      var spline = new THREE.CatmullRomCurve3(points);
  
      var extrudeSettings = {
        steps     : radialSegments,
        bevelEnabled  : false,
        extrudePath   : spline
      };
  
      var geom = new THREE.ExtrudeGeometry( shape, extrudeSettings );
  
      geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, radius,0));
      
      var mat = new THREE.MeshLambertMaterial({ 
        color: color,
      });
      CustomMesh.flatshadeGeometry(geom);
      var mesh = new THREE.Mesh(geom, mat);
      return mesh;
    },
  
    ////////////////////////////////////////////////////////////////////////////////////
    //                                                                            LATHE
    ////////////////////////////////////////////////////////////////////////////////////
  
    Lathe : function(points,segments, color){
      // change the axis from z to y;
      var rotPoints = [];
      var i, tx,ty,tz;
      for (i=0; i<points.length; i++){
        tx = points[i].x;
        ty = points[i].z;
        tz = points[i].y;
        rotPoints.push( new THREE.Vector3( tx, ty, tz ) );
      }
      var geom = new THREE.LatheGeometry( rotPoints, segments );
      geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
  
      var mat = new THREE.MeshLambertMaterial({ 
        color: color
      });
      CustomMesh.flatshadeGeometry(geom);
      var mesh = new THREE.Mesh(geom, mat);
      return mesh;
    },
  
    ////////////////////////////////////////////////////////////////////////////////////
    //                                                                            LINE
    ////////////////////////////////////////////////////////////////////////////////////
  
  
    Line : function(points,thickness, color, curved){
      
      var curved = curved;
      var geom = new THREE.Geometry();
  
      if (curved){
        var curve = new THREE.SplineCurve3( points );
        geom.vertices = curve.getPoints( 20 );
      }else{
        for (var i=0; i<points.length; i++){
          var v = points[i];
          geom.vertices.push(v);
        }
      }
      
      var mat = new THREE.LineBasicMaterial({
          color: color,
          linewidth : thickness,
          //fog:true,
      });
  
      var line = new THREE.Line(geom, mat);
      return line;
    },
  
    ////////////////////////////////////////////////////////////////////////////////////
    //                                                                       CURVED PATH
    ////////////////////////////////////////////////////////////////////////////////////
  
  
    CurvedPath : function(points,thickness, color){
      
      var geom = new THREE.Geometry();
  
      var curve = new THREE.CatmullRomCurve3( points );
      
      var mat = new THREE.LineBasicMaterial({
          color: color,
          linewidth : thickness,
          //fog:true,
      });
  
      var i, a;
      var radialSegments = 5;
      var angleStep = Math.PI*2 / radialSegments;
      var shape = new THREE.Shape(); 
      var startPoint={};
  
      for (i=0;i<radialSegments;i++){
        a =  (angleStep*i);
        var vertX = Math.cos(a)*thickness;
        var vertY = Math.sin(a)*thickness;
        if (i==0){
          startPoint = {x:vertX, y:vertY};
          shape.moveTo(vertX, vertY);  
        }else{
          shape.lineTo(vertX, vertY);
        }
      }
      shape.lineTo(startPoint.x, startPoint.y); 
  
      var extrudeSettings = {
        steps     : 3,
        bevelEnabled  : false,
        extrudePath   : curve
      };
  
      var geom = new THREE.ExtrudeGeometry( shape, extrudeSettings );
  
      var mat = new THREE.MeshLambertMaterial({ 
        color: color,
      });
      CustomMesh.flatshadeGeometry(geom);
      var mesh = new THREE.Mesh(geom, mat);
      return mesh;
    },
  }
  
  var Math2 = {

    rangeRandom : function (v1, v2){
      var max = Math.max(v1,v2);
      var min = (max==v1)?v2 : v1;
      return min + Math.random()*(max-min);
    },
  
    rangeRandomInt : function (v1,v2){
      var max = Math.max(v1,v2);
      var min = (max==v1)?v2 : v1;
      var rnd = min + Math.random()*(max-min);
      return Math.round(rnd);
    },
  
  }  

  //COLORS
var Colors = {


  white_l:0xf3f3e7,
  white_m:0xe1d7df,
  white_d:0xb5b0b4,

  grey_l:0xa3a1ba,
  grey_m:0x646371,
  grey_d:0x47444d,

  blue_l:0xc0c1ff,
  blue_m:0x888aee,
  blue_d:0x5557ad,

  yellow_l:0xf6dc9c,
  yellow_m:0xe9be55,
  yellow_d:0xdfa745,

  pink_l:0xfbb496,
  pink_m:0xf47763,
  pink_d:0xc04c39,

  green_l:0xb5e5d9,
  green_m:0x7ebaab,
  green_d:0x3c7e6d,

  purple_l:0xca9ebf,
  purple_m:0x94748c,
  purple_d:0x584a5d,

};

Colors.whites = [
              Colors.white_l, Colors.white_m, Colors.white_d,            
              ];

Colors.greys = [
              Colors.grey_l, Colors.grey_m, Colors.grey_d,
              ];

Colors.pinks = [
              Colors.pink_l, Colors.pink_m, Colors.pink_d
              ];

Colors.blues = [
              Colors.blue_l, Colors.blue_m, Colors.blue_d,
              ];

Colors.yellows = [
              Colors.yellow_l, Colors.yellow_m, Colors.yellow_d,
              ];

Colors.greens = [
              Colors.green_l, Colors.green_m, Colors.green_d,
              ];
Colors.purples = [
              Colors.purple_l, Colors.purple_m, Colors.purple_d,
              ];

Colors.all = [
          Colors.white_l, Colors.white_m, Colors.white_d,
          Colors.grey_l, Colors.grey_m, Colors.grey_d,
          Colors.blue_l, Colors.blue_m, Colors.blue_d,
          Colors.yellow_l, Colors.yellow_m, Colors.yellow_d,
          Colors.pink_l, Colors.pink_m, Colors.pink_d,
          Colors.green_l, Colors.green_m, Colors.green_d,
          Colors.purple_l, Colors.purple_m, Colors.purple_d,
          
       ];

Colors.trunc = [
              Colors.white_l, Colors.white_m, Colors.white_d,
              Colors.grey_l, Colors.grey_m, Colors.grey_d,
              //Colors.green_l, Colors.green_m, Colors.green_d,
              ];

Colors.leaves = [
              Colors.green_l, Colors.green_m, Colors.green_d,
              Colors.yellow_l, Colors.yellow_m, Colors.yellow_d,
              Colors.pink_l, Colors.pink_m, Colors.pink_d,
              ];

Colors.floor = [
              Colors.yellow_l, Colors.yellow_m, Colors.yellow_d,
              Colors.pink_l, Colors.pink_m, Colors.pink_d,
              Colors.green_l, Colors.green_m, Colors.green_d,
              Colors.grey_l, Colors.grey_m, Colors.grey_d,
              ];

  

Colors.getRandom = function(){
  var indx = Math.floor(Math.random()*Colors.all.length);
  return Colors.all[indx];
};

Colors.getRandomFrom = function(arr){
  var indx = Math.floor(Math.random()*arr.length);
  return arr[indx];
};


var GeometryHelpers = {

  getCenterTriangle : function ( vectorA, vectorB, vectorC ) {
    var vec = new THREE.Vector3();
    vec = vectorA.clone().add(vectorB.clone().add(vectorC.clone()));
    vec.multiplyScalar(1/3);
    return vec;
  },

  getRandomPointInTriangle : function( vectorA, vectorB, vectorC ) {
    var vector = new THREE.Vector3();
    var point = new THREE.Vector3();

    var a = THREE.Math.random16();
    var b = THREE.Math.random16();

    if ( ( a + b ) > 1 ) {

      a = 1 - a;
      b = 1 - b;

    }

    var c = 1 - a - b;

    point.copy( vectorA );
    point.multiplyScalar( a );
    vector.copy( vectorB );
    vector.multiplyScalar( b );
    point.add( vector );
    vector.copy( vectorC );
    vector.multiplyScalar( c );
    point.add( vector );
    return point;
  },

  makeNoise : function(geom, val){
    var l = geom.vertices.length;
    for (var i=0; i<l; i++){
      var v = geom.vertices[i];
      v.x += Math2.rangeRandom(-val, val);
      v.y += Math2.rangeRandom(-val, val);
      v.z += Math2.rangeRandom(-val, val);
    }
    geom.computeVertexNormals();
    geom.verticesNeedUpdate = true;
  },

  compareHeight : function(a,b){
    if (a.y < b.y)
      return -1;
    if (a.y > b.y)
      return 1;
    return 0;
  },

  getVertsAtHeight : function(geom, minh, maxh){
    var arr = [];
    var l = geom.vertices.length;
    for (var i=0;i<l;i++){
      var v = geom.vertices[i];
      if (v.y >= minh && v.y <= maxh){
        arr.push({vertex:v, index:i});
      }
    }
    return arr; //[{vertex:v, index:i},{vertex:v, index:i}]
  },
  
  getAttachs : function(geom, defs){
    
    var allverts = [];
    var nontestedverts = [];
    var attachs = [];
    var l = geom.vertices.length;
    var i, j, v;

    for (i=0;i<l; i++){
      v = geom.vertices[i];
      allverts.push({vertex:v, index:i, type:""});
    }

    for (i=0; i<defs.length; i++){
      
      var def = defs[i];
      var minH = def.minH;
      var maxH = def.maxH;
      var maxAngle = def.maxAngle;
      var minAngle = def.minAngle;
      var type = def.type;
      var count = def.count;
      
      nontestedverts = allverts.slice();
      l = nontestedverts.length;

      for (j=0; j<count && l>0 && nontestedverts.length; j++){
        
        
        var indx = Math2.rangeRandomInt(0, l-1);
        
        var targetDef = nontestedverts.splice(indx,1)[0];
        var targetIndex = targetDef.index;
        var v = targetDef.vertex;
        var angle = Math.atan2(v.z, v.x).toFixed(2);
        

        var condHeight = (v.y >= minH && v.y<=maxH);
        var condAngle;
        if (minAngle==0 && maxAngle==0){
          condAngle = true;
        } else{
          condAngle = (angle<=def.maxAngle && angle>=def.minAngle);
        }

        l--;
        if (condHeight && condAngle){
          var allVertsIndex = GeometryHelpers.getElementBy(allverts, "index", targetIndex).order;
          var currentTestedDef = allverts.splice(allVertsIndex,1)[0];
          currentTestedDef.type=type;
          attachs.push(currentTestedDef);
        }else{
          j--;
        }

      }
    }
    return  attachs; //[{vertex:v, index:i, type:"leaf"}];
  },

  getElementBy : function(arr, prop, propValue){
    for (var i=0; i<arr.length; i++){
      if (arr[i][prop] == propValue){
        return {order : i, object : arr[i]};
      }
    }
  },

  getVerticesNormals : function(geom){
    var normals = [];
    var i;
    for (i=0, fl=geom.faces.length; i<fl; i++ ){
      var f = geom.faces[i];
      var vaIndx = f.a;
      var vbIndx = f.b;
      var vcIndx = f.c;
      
      var va = f.vertexNormals[0];
      var vb = f.vertexNormals[1];
      var vc = f.vertexNormals[2];

      if (normals[vaIndx] == undefined) normals[vaIndx] = f.vertexNormals[0];
      if (normals[vbIndx] == undefined) normals[vbIndx] = f.vertexNormals[1];
      if (normals[vcIndx] == undefined) normals[vcIndx] = f.vertexNormals[2];
    }
    return normals;
  },
};

module.exports = CustomMesh;