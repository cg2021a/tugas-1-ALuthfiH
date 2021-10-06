function main() {
    var canvas = document.getElementById('myCanvas');
    var gl = canvas.getContext('webgl');

    const object_left = {
        left_color: [0.6, 0.4, 0.2],
        left_color_2: [0.5, 0.3, 0.1],
        left_point_d: [-0.7, 0.39],
        left_point_c: [-0.8, 0.02],
        left_point_g: [-0.43, 0.4],
        left_point_h: [-0.39, 0.022],
        left_point_i: [-0.74, -0.18],
        left_point_j: [-0.42, -0.17],
    };


    const object_right = {
        right_color: [0.6, 0.4, 0.2], // head color
        right_color_2: [0.5, 0.3, 0.1], // body color
        point_c: [0.15, 0.02],
        point_d: [0.25, 0.2],
        point_e: [0.9, 0.02],
        point_f: [0.85, 0.21],
        point_g: [0.21, -0.2],
        point_h: [0.87, -0.2],
    };

    const vertices = [

        //Left Object
        ...object_left.left_point_d, ...object_left.left_color,
        ...object_left.left_point_c, ...object_left.left_color, 
        ...object_left.left_point_h, ...object_left.left_color, 
        ...object_left.left_point_h, ...object_left.left_color, 
        ...object_left.left_point_g, ...object_left.left_color,
        ...object_left.left_point_d, ...object_left.left_color,

        ...object_left.left_point_c, ...object_left.left_color_2,
        ...object_left.left_point_i, ...object_left.left_color_2, 
        ...object_left.left_point_j, ...object_left.left_color_2, 
        ...object_left.left_point_j, ...object_left.left_color_2, 
        ...object_left.left_point_h, ...object_left.left_color_2,
        ...object_left.left_point_c, ...object_left.left_color_2,

        //Right Object
        ...object_right.point_c, ...object_right.right_color,
        ...object_right.point_d, ...object_right.right_color,
        ...object_right.point_e, ...object_right.right_color,


        ...object_right.point_f, ...object_right.right_color,
        ...object_right.point_d, ...object_right.right_color,
        ...object_right.point_e, ...object_right.right_color,

        ...object_right.point_c, ...object_right.right_color_2,
        ...object_right.point_e, ...object_right.right_color_2,
        ...object_right.point_g, ...object_right.right_color_2,

        ...object_right.point_e, ...object_right.right_color_2,
        ...object_right.point_g, ...object_right.right_color_2,
        ...object_right.point_h, ...object_right.right_color_2,
        
    ];

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


    var vertexShaderSource = `
        attribute vec2 aPosition;
        attribute vec3 aColor;
        varying vec3 vColor;
        uniform float uChange;
        void main() {
            gl_Position = vec4(aPosition.x, aPosition.y, 1.0, 1.0);
            vColor = aColor;
        }
    `;

    var fragmentShaderSource = `
        precision mediump float;
        varying vec3 vColor;
        void main() {
            gl_FragColor = vec4(vColor, 1.0);
        }
    `;

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);


    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);


    var shaderProgram = gl.createProgram();


    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);


    gl.linkProgram(shaderProgram);


    gl.useProgram(shaderProgram);


    var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.vertexAttribPointer(
        aPosition,
        2,
        gl.FLOAT,
        false,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    gl.enableVertexAttribArray(aPosition);
    var aColor = gl.getAttribLocation(shaderProgram, "aColor");
    gl.vertexAttribPointer(
        aColor,
        3,
        gl.FLOAT,
        false,
        5 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT
    );
    gl.enableVertexAttribArray(aColor);

    var freeze = false;
    // Interactive graphics with mouse
    function onMouseClick(event) {
        freeze = !freeze;
    }
    document.addEventListener("click", onMouseClick);
    // Interactive graphics with keyboard
    function onKeydown(event) {
        if (event.keyCode == 32) freeze = true;
    }

    function onKeyup(event) {
        if (event.keyCode == 32) freeze = false;
    }
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("keyup", onKeyup);

    var speed = 0.0195;
    var change = 0;
    var uChange = gl.getUniformLocation(shaderProgram, "uChange");

    function moveVertices() {

        if (vertices[116] < -1.0 || vertices[76] > 1.0) {
            speed = speed * -1;
        }

        for (let i = 61; i < vertices.length; i += 5) {
            vertices[i] = vertices[i] + speed;
        }
    }


    function render() {
        moveVertices();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        change = change + speed;
        gl.uniform1f(uChange, change);

        gl.clearColor(0.760, 0.633, 0.380, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        var primitive = gl.TRIANGLES;
        var offset = 0;
        var nVertex = 30;
        gl.drawArrays(primitive, offset, nVertex);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}