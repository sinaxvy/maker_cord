var webgl_canvas = null;

LiteGraph.node_images_path = "../nodes_data/";
var editor = new LiteGraph.Editor("main",{miniwindow:false});
window.graphcanvas = editor.graphcanvas;
window.graph = editor.graph;
window.addEventListener("resize", function() { editor.graphcanvas.resize(); } );
//window.addEventListener("keydown", editor.graphcanvas.processKey.bind(editor.graphcanvas) );
window.onbeforeunload = function(){
	var data = JSON.stringify( graph.serialize() );
	localStorage.setItem("litegraphg demo backup", data );
}

//enable scripting
LiteGraph.allow_scripts = true;

//test
//editor.graphcanvas.viewport = [200,200,400,400];

//allows to use the WebGL nodes like textures
function enableWebGL()
{
	if( webgl_canvas )
	{
		webgl_canvas.style.display = (webgl_canvas.style.display == "none" ? "block" : "none");
		return;
	}

	var libs = [
		"js/libs/gl-matrix-min.js",
		"js/libs/litegl.js",
		"../src/nodes/gltextures.js",
		"../src/nodes/glfx.js",
		"../src/nodes/glshaders.js",
		"../src/nodes/geometry.js"
	];

	function fetchJS()
	{
		if(libs.length == 0)
			return on_ready();

		var script = null;
		script = document.createElement("script");
		script.onload = fetchJS;
		script.src = libs.shift();
		document.head.appendChild(script);
	}

	fetchJS();

	function on_ready()
	{
		console.log(this.src);
		if(!window.GL)
			return;
		webgl_canvas = document.createElement("canvas");
		webgl_canvas.width = 400;
		webgl_canvas.height = 300;
		webgl_canvas.style.position = "absolute";
		webgl_canvas.style.top = "0px";
		webgl_canvas.style.right = "0px";
		webgl_canvas.style.border = "1px solid #AAA";

		webgl_canvas.addEventListener("click", function(){
			var rect = webgl_canvas.parentNode.getBoundingClientRect();
			if( webgl_canvas.width != rect.width )
			{
				webgl_canvas.width = rect.width;
				webgl_canvas.height = rect.height;
			}
			else
			{
				webgl_canvas.width = 400;
				webgl_canvas.height = 300;
			}
		});

		var parent = document.querySelector(".editor-area");
		parent.appendChild( webgl_canvas );
		var gl = GL.create({ canvas: webgl_canvas });
		if(!gl)
			return;

		editor.graph.onBeforeStep = ondraw;

		console.log("webgl ready");
		function ondraw ()
		{
			gl.clearColor(0,0,0,0);
			gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
			gl.viewport(0,0,gl.canvas.width, gl.canvas.height );
		}
	}
}
