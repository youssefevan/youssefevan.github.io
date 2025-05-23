//////////////////////////////////////////////////////////////////////////////
//
//  Angel.js
//
//////////////////////////////////////////////////////////////////////////////

//----------------------------------------------------------------------------
//
//  Helper functions
//
//  Vector Matrix library functions
//

function _argumentsToArray( args ) {
    return [].concat.apply( [], Array.prototype.slice.apply(args) );
}

//----------------------------------------------------------------------------

function radians( degrees ) {
    return degrees * Math.PI / 180.0;
}

//----------------------------------------------------------------------------
//
//  Vector Constructors
//

function vec2() {
    var result = _argumentsToArray( arguments );

    switch ( result.length ) {
		case 0: result.push( 0.0 );
		case 1: result.push( 0.0 );
	}

    return result.splice( 0, 2 );
}

function vec3() {
    var result = _argumentsToArray( arguments );

    switch ( result.length ) {
		case 0: result.push( 0.0 );
		case 1: result.push( 0.0 );
		case 2: result.push( 0.0 );
	}

    return result.splice( 0, 3 );
}

function vec4() {
    var result = _argumentsToArray( arguments );

    switch ( result.length ) {
		case 0: result.push( 0.0 );
		case 1: result.push( 0.0 );
		case 2: result.push( 0.0 );
		case 3: result.push( 1.0 );
	}

    return result.splice( 0, 4 );
}

//----------------------------------------------------------------------------
//
//  Matrix Constructors
//

function mat2() {
    var v = _argumentsToArray( arguments );

    var m = [];
    switch ( v.length ) {
		case 0:
			v[0] = 1;

    	case 1:
			m = [
				vec2( v[0],  0.0 ),
				vec2(  0.0, v[0] )
			];
        	break;

    	default:
        	m.push( vec2(v) );  v.splice( 0, 2 );
        	m.push( vec2(v) );
        	break;
    	}

	m.matrix = true;

	return m;
}

//----------------------------------------------------------------------------

function mat3() {
    var v = _argumentsToArray( arguments );

	var m = [];
	switch ( v.length ) {
		case 0:
			v[0] = 1;
		case 1:
			m = [
				vec3( v[0],  0.0,  0.0 ),
				vec3(  0.0, v[0],  0.0 ),
				vec3(  0.0,  0.0, v[0] )
			];
			break;

		default:
			m.push( vec3(v) );  v.splice( 0, 3 );
			m.push( vec3(v) );  v.splice( 0, 3 );
			m.push( vec3(v) );
			break;
	}

	m.matrix = true;

	return m;
}

//----------------------------------------------------------------------------

function mat4() {
    var v = _argumentsToArray( arguments );

    var m = [];
    switch ( v.length ) {
		case 0:
			v[0] = 1;
		case 1:
			m = [
				vec4( v[0], 0.0,  0.0,   0.0 ),
				vec4( 0.0,  v[0], 0.0,   0.0 ),
				vec4( 0.0,  0.0,  v[0],  0.0 ),
				vec4( 0.0,  0.0,  0.0,  v[0] )
			];
			break;

		default:
			m.push( vec4(v) );  v.splice( 0, 4 );
			m.push( vec4(v) );  v.splice( 0, 4 );
			m.push( vec4(v) );  v.splice( 0, 4 );
			m.push( vec4(v) );
			break;
	}

	m.matrix = true;

	return m;
}

//----------------------------------------------------------------------------
//
//  Generic Mathematical Operations for Vectors and Matrices
//

function equal( u, v ) {
    if ( u.length != v.length ) { return false; }
   
    if ( u.matrix && v.matrix ) {
        for ( var i = 0; i < u.length; ++i ) {
            if ( u[i].length != v[i].length ) { return false; }
            for ( var j = 0; j < u[i].length; ++j ) {
                if ( u[i][j] !== v[i][j] ) { return false; }
            }
        }
    }
    else if ( u.matrix && !v.matrix || !u.matrix && v.matrix ) {
        return false;
    }
    else {
        for ( var i = 0; i < u.length; ++i ) {
            if ( u[i] !== v[i] ) { return false; }
        }
    }

    return true;
}

//----------------------------------------------------------------------------
function add( u, v ) {
    var result = [];

    if ( u.matrix && v.matrix ) {
        if ( u.length != v.length ) {
            throw "add(): trying to add matrices of different dimensions";
        }

        for ( var i = 0; i < u.length; ++i ) {
            if ( u[i].length != v[i].length ) {
                throw "add(): trying to add matrices of different dimensions";
            }
            result.push( [] );
            for ( var j = 0; j < u[i].length; ++j ) {
                result[i].push( u[i][j] + v[i][j] );
            }
        }

        result.matrix = true;

        return result;
    }
    else if ( u.matrix && !v.matrix || !u.matrix && v.matrix ) {
        throw "add(): trying to add matrix and non-matrix variables";
    }
    else {
        if ( u.length != v.length ) {
            throw "add(): vectors are not the same dimension";
        }

        for ( var i = 0; i < u.length; ++i ) {
            result.push( u[i] + v[i] );
        }

        return result;
    }
}

//----------------------------------------------------------------------------

function subtract( u, v ) {
    var result = [];

    if ( u.matrix && v.matrix ) {
        if ( u.length != v.length ) {
            throw "subtract(): trying to subtract matrices" +
                " of different dimensions";
        }

        for ( var i = 0; i < u.length; ++i ) {
            if ( u[i].length != v[i].length ) {
                throw "subtract(): trying to subtact matrices" +
                    " of different dimensions";
            }
            result.push( [] );
            for ( var j = 0; j < u[i].length; ++j ) {
                result[i].push( u[i][j] - v[i][j] );
            }
        }

        result.matrix = true;

        return result;
    }
    else if ( u.matrix && !v.matrix || !u.matrix && v.matrix ) {
        throw "subtact(): trying to subtact  matrix and non-matrix variables";
    }
    else {
        if ( u.length != v.length ) {
            throw "subtract(): vectors are not the same length";
        }

        for ( var i = 0; i < u.length; ++i ) {
            result.push( u[i] - v[i] );
        }

        return result;
    }
}

//----------------------------------------------------------------------------

function mult( u, v ) {
    var result = [];

    if ( u.matrix && v.matrix ) {
        if ( u.length != v.length ) {
            throw "mult(): trying to add matrices of different dimensions";
        }

        for ( var i = 0; i < u.length; ++i ) {
            if ( u[i].length != v[i].length ) {
                throw "mult(): trying to add matrices of different dimensions";
            }
        }

        for ( var i = 0; i < u.length; ++i ) {
            result.push( [] );

            for ( var j = 0; j < v.length; ++j ) {
                var sum = 0.0;
                for ( var k = 0; k < u.length; ++k ) {
                    sum += u[i][k] * v[k][j];
                }
                result[i].push( sum );
            }
        }

        result.matrix = true;

        return result;
    }
    else {
        if ( u.length != v.length ) {
            throw "mult(): vectors are not the same dimension";
        }

        for ( var i = 0; i < u.length; ++i ) {
            result.push( u[i] * v[i] );
        }

        return result;
    }
}
//----------------------------------------------------------------------------
//
//  Matrix Functions
//
function transpose( m ) {
    if ( !m.matrix ) {
        return "transpose(): trying to transpose a non-matrix";
    }

    var result = [];
    for ( var i = 0; i < m.length; ++i ) {
        result.push( [] );
        for ( var j = 0; j < m[i].length; ++j ) {
            result[i].push( m[j][i] );
        }
    }

    result.matrix = true;
    
    return result;
}

//----------------------------------------------------------------------------
//
//  Vector Functions
//

function dot( u, v ) {
    if ( u.length != v.length ) {
        throw "dot(): vectors are not the same dimension";
    }

    var sum = 0.0;
    for ( var i = 0; i < u.length; ++i ) {
        sum += u[i] * v[i];
    }

    return sum;
}

//----------------------------------------------------------------------------

function negate( u ) {
    result = [];
    for ( var i = 0; i < u.length; ++i ) {
        result.push( -u[i] );
    }

    return result;
}

//----------------------------------------------------------------------------
function cross( u, v ) {
    if ( !Array.isArray(u) || u.length < 3 ) {
        throw "cross(): first argument is not a vector of at least 3";
    }

    if ( !Array.isArray(v) || v.length < 3 ) {
        throw "cross(): second argument is not a vector of at least 3";
    }

    var result = [ 
        u[1]*v[2] - u[2]*v[1],
        u[2]*v[0] - u[0]*v[2],
        u[0]*v[1] - u[1]*v[0]
    ];

    return result;
}

//----------------------------------------------------------------------------
function length( u ) {
    return Math.sqrt( dot(u, u) );
}

//----------------------------------------------------------------------------

function normalize( u, excludeLastComponent ) { 
    if ( excludeLastComponent ) {
        var last = u.pop();
    }
    
    var len = length( u );

    if ( !isFinite(len) ) {
        throw "normalize: vector " + u + " has zero length";
    }
    
    for ( var i = 0; i < u.length; ++i ) {
        u[i] /= len;
    }

    if ( excludeLastComponent ) {
        u.push( last );
    }
            
    return u;
}

//----------------------------------------------------------------------------

function mix( u, v, s ) {
    if ( typeof s !== "number" ) {
        throw "mix: the last paramter " + s + " must be a number";
    }
    
    if ( u.length != v.length ) {
        throw "vector dimension mismatch";
    }

    var result = [];
    for ( var i = 0; i < u.length; ++i ) {
        result.push( s * u[i] + (1.0 - s) * v[i] );
    }

    return result;
}
//----------------------------------------------------------------------------
//
//

function flatten( v ) {

	// GL uses a column major order, so transpose the matrix
    if ( v.matrix === true ) {
        v = transpose( v );
    }

    var n = v.length;
    var elemsAreArrays = false;

    if ( Array.isArray(v[0]) ) {
        elemsAreArrays = true;
        n *= v[0].length;
    }

    var floats = new Float32Array( n );

    if ( elemsAreArrays ) {
        var idx = 0;
        for ( var i = 0; i < v.length; ++i ) {
            for ( var j = 0; j < v[i].length; ++j ) {
                floats[idx++] = v[i][j];
            }
        }
    }
    else {
        for ( var i = 0; i < v.length; ++i ) {
            floats[i] = v[i];
        }
    }

    return floats;
}
//----------------------------------------------------------------------------
//
