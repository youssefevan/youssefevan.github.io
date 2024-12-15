var canvas;
var gl;

var program;
var vertexShader, fragmentShader;

var delay = 100;

var teapot;
var teapot_vertices;
var teapot_normals;

var vBuffer, nBuffer;
var vNormal, vPosition;
var ambientProduct_loc, diffuseProduct_loc, specularProduct_loc, lightPos_loc;
var shininess_loc;

var M_comp_loc;
var M_model_loc;
var M_camera_loc;
var M_projection_loc;
var theta = 0., phi = 0.;

var M_comp = mat4();
var view;
var camMat;

var intensityDiffuse;
var intensitySpecular;
var reflectivityDiffuse;
var reflectivitySpecular;
var shininess_input;
var color_picker;

// all initializations
window.onload = function init() {
	// get canvas handle
	canvas = document.getElementById( "gl-canvas" );

	// WebGL Initialization
	gl = initWebGL(canvas);
	if (!gl ) {
		alert( "WebGL isn't available" );
	}

	// set up viewport
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 0.3, 0.3, 0.3, 1.0 );
	gl.clear( gl.COLOR_BUFFER_BIT );

	// create shaders, compile and link program
	program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

    // buffers to hold cube vertices, colors and indices
	vBuffer = gl.createBuffer();
	nBuffer = gl.createBuffer();

	// create teapot
	teapot = createTeapotGeometry(6);
	teapot_vertices = teapot[0];
	teapot_normals = teapot[1];

	// allocate and send vertices to buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(teapot_vertices), gl.STATIC_DRAW);

    // variables through which shader receives vertex and other attributes
	vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	// similarly for color buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(teapot_normals), gl.STATIC_DRAW);

	vNormal = gl.getAttribLocation(program, "vNormal");
	gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray(vNormal);

	console.log("vertices: ", teapot_vertices);
	console.log("normals: ", teapot_normals);

	M_comp_loc = gl.getUniformLocation(program, "M_comp");
	M_model_loc = gl.getUniformLocation(program, "M_model");
	M_camera_loc = gl.getUniformLocation(program, "M_camera");
	M_projection_loc = gl.getUniformLocation(program, "M_projection");

	// pass in lighting vars
	ambientProduct_loc = gl.getUniformLocation(program, "ambientProduct");
	diffuseProduct_loc = gl.getUniformLocation(program, "diffuseProduct");
	specularProduct_loc = gl.getUniformLocation(program, "specularProduct");
	lightPos_loc = gl.getUniformLocation(program, "lightPos");
	
	shininess_loc = gl.getUniformLocation(program, "shininess");

	// must enable Depth test for 3D viewing in GL
	gl.enable(gl.DEPTH_TEST);

	view = [[1, 0, 0], [0, 0, 0], [1, 1, 0]];
	camMat = getCameraTransformMatrix();

    render();
}

// all drawing is performed here
function render() {
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// get inputs
	intensityDiffuse = document.getElementById("diffuse").value/100;
	intensitySpecular = document.getElementById("specular").value/100;
	shininess_input = document.getElementById("shine").value;

	reflectivityDiffuse = document.getElementById("diffRef").value;
	reflectivityDiffuse = hexToRgbA(reflectivityDiffuse);

	reflectivitySpecular = document.getElementById("specRef").value;
	reflectivitySpecular = hexToRgbA(reflectivitySpecular);

	// light values
	lightPos = [-58, -60, 100.0, 1.0];
	gl.uniform4fv(lightPos_loc, lightPos);

	let lightDiffuse = [intensityDiffuse, intensityDiffuse, intensityDiffuse, 1.0];
	let materialDiffuse = [reflectivityDiffuse[0], reflectivityDiffuse[1], reflectivityDiffuse[2], 1.0];
	let diffuseProduct = vecMult(lightDiffuse, materialDiffuse);
	gl.uniform4fv(diffuseProduct_loc, diffuseProduct);

	let lightSpecular = [1/intensitySpecular, 1/intensitySpecular, 1/intensitySpecular, 1.0];
	let materialSpecular = [0.8, 0.77, 0.77, 1.0];
	let specularProduct = vecMult(lightSpecular, materialSpecular);
	gl.uniform4fv(specularProduct_loc, specularProduct);

	let lightAmbient = [reflectivitySpecular[0], reflectivitySpecular[1], reflectivitySpecular[2], 1.0];
	let materialAmbient = [1, 1, 1, 1];
	let ambientProduct = vecMult(lightAmbient, materialAmbient);
	gl.uniform4fv(ambientProduct_loc, ambientProduct);

	let shininess = shininess_input;
	gl.uniform1f(shininess_loc, shininess);

	// M_comp
	M_comp = mat4();
	gl.uniformMatrix4fv(M_comp_loc, false, flatten(M_comp));

	// M_model
	let modelMatrix = translate4x4(0, .5, 0);
	modelMatrix = matMult(modelMatrix, scale4x4(.45, .45, .45));
	gl.uniformMatrix4fv(M_model_loc, false, flatten(modelMatrix));

	// M_camera
	let cameraMatrix = camMat;
	gl.uniformMatrix4fv(M_camera_loc, false, flatten(cameraMatrix));

	// M_perspective
	let perspectiveMat = getPerspectiveProjMatrix();

	//console.log("proj", perspectiveMat);
	gl.uniformMatrix4fv(M_projection_loc, false, flatten(perspectiveMat));

	// draw triangles
	gl.drawArrays(gl.TRIANGLES, 0, teapot_vertices.length);

	setTimeout(
      function (){requestAnimFrame(render);}, delay
 	);
}

// SOURCE: https://stackoverflow.com/questions/21646738/convert-hex-to-rgba
function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return [((c>>16)&255)/255, ((c>>8)&255)/255, (c&255)/255];
    }
    throw new Error('Bad Hex');
}

function getCameraTransformMatrix() {
	// look at point
	let lookat = [0, 1.5, 0];
	let eye = [-1, 6, -5];

	// eye point, look at point, up point
	view = [eye, lookat, [-1, 9, -5]];

	// up vector
	let up = [
		view[2][0] - view[0][0],
		view[2][1] - view[0][1],
		view[2][2] - view[0][2],
	];

	up = [0, 1, 0];

	// look at vector
	let lat = [
		view[1][0] - view[0][0],
		view[1][1] - view[0][1],
		view[1][2] - view[0][2],
	];

	let u = cross_product(lat, up);
	let v = cross_product(u, lat);
	let n = [-lat[0], -lat[1], -lat[2]];

	u = normalize(u);
	v = normalize(v);
	n = normalize(n);

	// create in mat4
	//then do mcomp.matrix = false

	let cameraTransformMatrix = mat4();

	cameraTransformMatrix[0][0] = u[0];
	cameraTransformMatrix[0][1] = u[1];
	cameraTransformMatrix[0][2] = u[2];
	cameraTransformMatrix[1][0] = v[0];
	cameraTransformMatrix[1][1] = v[1];
	cameraTransformMatrix[1][2] = v[2];
	cameraTransformMatrix[2][0] = n[0];
	cameraTransformMatrix[2][1] = n[1];
	cameraTransformMatrix[2][2] = n[2];

	/*cameraTransformMatrix = [
		[u[0], u[1], u[2], 0],
		[v[0], v[1], v[2], 0],
		[n[0], n[1], n[2], 0],
		[   0,    0,    0, 1],
	];*/

	cameraTransformMatrix = matMult(cameraTransformMatrix, translate4x4(-eye[0], -eye[1], -eye[2]));

	//console.log("cam", cameraTransformMatrix);

	return cameraTransformMatrix;
}

function getPerspectiveProjMatrix() {
	let right = 0.5;
	let left = -right;
	let top = 0.5;
	let bottom = -top;
	let far = 50;
	let near = 1;

	// symmetric perspective projection
	let perspectiveProjMatrix = mat4();

	/*perspectiveProjMatrix[0][0] = near/right;
	perspectiveProjMatrix[1][1] = near/top;
	perspectiveProjMatrix[2][2] = -(far+near)/(far-near);
	perspectiveProjMatrix[2][3] = -(2*far*near)/(far-near);
	perspectiveProjMatrix[3][2] = -1;
	perspectiveProjMatrix[3][3] = 0;*/

	perspectiveProjMatrix[0][0] = (2 * near) / (right - left);
	perspectiveProjMatrix[0][2] = (right + left) / (right - left);
	perspectiveProjMatrix[1][1] = (2 * near) / (top - bottom);
	perspectiveProjMatrix[1][2] = (top + bottom) / (top - bottom);
	perspectiveProjMatrix[2][2] = -((far + near) / (far - near));
	perspectiveProjMatrix[2][3] = -((2 * far * near) / (far - near));
	perspectiveProjMatrix[3][2] = -1;
	perspectiveProjMatrix[3][3] = 0;
	
	/*perspectiveProjMatrix = [
		[near/right, 0, 0, 0],
		[0, near/top, 0, 0],
		[0, 0, -(far+near)/(far-near), -(2*far*near)/(far-near)],
		[0, 0, -1, 0]
	];*/

	//console.log("perspective", perspectiveProjMatrix);
	
	return perspectiveProjMatrix;
}