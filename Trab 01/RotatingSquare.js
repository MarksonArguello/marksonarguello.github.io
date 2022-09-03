/**
 * @file
 *
 * Summary.
 *
 * Vertices are scaled by an amount that varies by
 * frame, and this value is passed to the draw function.
 *
 * @author Markson Arguello
 * @since 02/09/2022
 */

'use strict';

let w;
let h;
let tecla = 'r';

const cores = {
	r: 'red',
	g: 'green',
	b: 'blue',
	w: 'white',
};

const toRadians = (degrees) => (Math.PI / 180) * degrees;

const quadrado = {
	tamanhoLados: 50,
	sinalLados: [1, 1],
	sinalOrigem: [1, 1],
	grau: 0,
	taxaDeAumento: toRadians(2),
	origem: [100, 100],
	incrementaGrau() {
		this.grau = (this.grau + this.taxaDeAumento) % 360;
	},
	desenha(ctx) {
		ctx.save();
		ctx.fillStyle = cores[tecla];
		ctx.translate(this.origem[0], this.origem[1]);
		ctx.rotate(this.grau);
		ctx.fillRect(
			0,
			0,
			this.sinalLados[0] * this.tamanhoLados,
			this.sinalLados[1] * this.tamanhoLados,
		);

		//Desenha origem
		drawVertices(ctx);
		ctx.fillStyle = 'blue';
		//ctx.fillRect(0, 0, this.sinalLados[0] * 4, this.sinalLados[1] * 4);

		ctx.restore();
		this.incrementaGrau();
	},
};

function converteOrigemDeRPara(letra) {
	if (letra === 'r') return;
	if (letra === 'g') {
		quadrado.sinalLados = [-1, 1];
		return [Math.cos(quadrado.grau), Math.sin(quadrado.grau)].map(
			(e) => e * quadrado.tamanhoLados,
		);
	}
	if (letra === 'w') {
		quadrado.sinalLados = [1, -1];
		return [
			Math.cos(quadrado.grau + Math.PI / 2),
			Math.sin(quadrado.grau + Math.PI / 2),
		].map((e) => e * quadrado.tamanhoLados);
	}
	if (letra === 'b') {
		quadrado.sinalLados = [-1, -1];
		return [
			Math.cos(quadrado.grau + Math.PI / 4),
			Math.sin(quadrado.grau + Math.PI / 4),
		].map((e) => e * Math.hypot(quadrado.tamanhoLados, quadrado.tamanhoLados));
	}
}

function conversor(novaLetra) {
	let deslocamento;
	if (novaLetra === 'r') {
		deslocamento = converteOrigemDeRPara(tecla).map((e) => e * -1);
		quadrado.sinalLados = quadrado.sinalLados.map((e) => Math.abs(e));
	} else if (tecla === 'r') {
		deslocamento = converteOrigemDeRPara(novaLetra);
	} else {
		console.log(tecla, novaLetra);
		deslocamento = converteOrigemDeRPara(tecla).map((e) => e * -1);
		quadrado.sinalLados = quadrado.sinalLados.map((e) => Math.abs(e));
		quadrado.origem = quadrado.origem.map((e, i) => e + deslocamento[i]);

		deslocamento = converteOrigemDeRPara(novaLetra);
	}
	quadrado.origem = quadrado.origem.map((e, i) => e + deslocamento[i]);
}

let teclasValidas = ['r', 'g', 'b', 'w'];
document.addEventListener('keydown', (e) => {
	if (teclasValidas.includes(e.key) && e.key !== tecla) {
		conversor(e.key);
		tecla = e.key;
	}
});

/*    r    g
 *
 *    w     b
 */

function drawBackgroud(ctx) {
	ctx.fillStyle = 'rgba(0, 204, 204, 1)';
	ctx.rect(0, 0, w, h);
	ctx.fill();
}

function drawVertice(ctx, coordenada, color) {
	let raio = 2;
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(coordenada[0], coordenada[1], raio, 0, 2 * Math.PI);
	ctx.fill();
}

const colors = ['red', 'green', 'blue', 'white'];
function drawVertices(ctx) {
	const coordenadasVertices = [
		[0, 0],
		[50, 0],
		[50, 50],
		[0, 50],
	];

	if (tecla == 'w' || tecla == 'g') {
		[coordenadasVertices[1], coordenadasVertices[3]] = [
			coordenadasVertices[3],
			coordenadasVertices[1],
		];
	}
	let i = 0;
	if (tecla === 'g') i = 1;

	if (tecla === 'b') i = 2;

	if (tecla === 'w') i = 3;

	for (let j = 0; j < 4; j++) {
		drawVertice(
			ctx,
			coordenadasVertices[j].map((e, i) => e * quadrado.sinalLados[i]),
			colors[i],
		);
		i = (i + 1) % 4;
	}
}

/**
 * Code to actually render our geometry.
 * @param {CanvasRenderingContext2D} ctx canvas context.
 * @param {Number} scale scale factor.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
 */
function draw(ctx) {
	drawBackgroud(ctx);
	quadrado.desenha(ctx);
}

/**
 * <p>Entry point when page is loaded.</p>
 *
 * Basically this function does setup that "should" only have to be done once,<br>
 * while draw() does things that have to be repeated each time the canvas is
 * redrawn.
 */
function mainEntrance() {
	// retrieve <canvas> element
	var canvasElement = document.querySelector('#theCanvas');
	var ctx = canvasElement.getContext('2d');

	w = canvasElement.width;
	h = canvasElement.height;

	/**
	 * A closure to set up an animation loop in which the
	 * scale grows by "increment" each frame.
	 * @global
	 * @function
	 */
	var runanimation = (() => {
		return () => {
			draw(ctx);
			// request that the browser calls runanimation() again "as soon as it can"
			requestAnimationFrame(runanimation);
		};
	})();

	// draw!
	runanimation();
}
