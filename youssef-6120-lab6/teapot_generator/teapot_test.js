window.onload = function init() {

	// generate hte teapot model
	teapot_geom = createTeapotGeometry(6);
	
	console.log('Num teapot vertices, normals:' +
		teapot_geom[0].length + ', ' + teapot_geom[1].length);

	console.log("Length of each vertex:"  + teapot_geom[0][0].length + "components \n"
			+ "Normal length: "  +  teapot_geom[1][0].length + "componentsi (last component is 0!)");
}

