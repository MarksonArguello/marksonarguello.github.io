/**
 * @file
 *
 * Summary.
 *
 * Rotaciona um quadrado de acordo com o vértice escolhido
 *
 * @author Markson Arguello
 * @since 02/09/2022
 */

'use strict';

const teclasValidas = ['r', 'g', 'b', 'w'];
const toRadians = (degrees) => (Math.PI / 180) * degrees;

let w;
let h;
let teclaAtual = 'r';

const cores = {
	r: 'red',
	g: 'green',
	b: 'blue',
	w: 'white',
};

const quadrado = {
	tamanhoLados: 50,
	sinalLados: [1, 1],
	grau: 0,
	taxaDeAumento: toRadians(-2),
	origem: [100, 100],
	incrementaGrau() {
		this.grau = (this.grau + this.taxaDeAumento) % 360;
	},
	desenha(ctx) {
		ctx.save();
		// Desenha o quadrado
		ctx.fillStyle = cores[teclaAtual];
		ctx.translate(...this.origem);
		ctx.rotate(this.grau);
		ctx.fillRect(
			0,
			0,
			this.sinalLados[0] * this.tamanhoLados,
			this.sinalLados[1] * this.tamanhoLados,
		);

		//Desenha os vértices
		drawVertices(ctx);

		ctx.restore();
		// Aumenta o grau de inclinação
		this.incrementaGrau();
	},
};

/**
 * Calcula o deslocamento do vértice vermelho para o vértice escolhido
 *
 * @param {String} letra letra correspondente ao novo ponto fixo
 * @returns Vetor contendo o deslocamento em x e y
 */
function calculaDeslocamentoDeRPara(letra) {
	let inclinacaoDeNovaOrigemEmRelacaoAoPontoR;
	let tamanhoDeslocamento = quadrado.tamanhoLados;

	if (letra === 'g') {
		quadrado.sinalLados = [-1, 1];
		inclinacaoDeNovaOrigemEmRelacaoAoPontoR = 0;
	}
	if (letra === 'w') {
		quadrado.sinalLados = [1, -1];
		inclinacaoDeNovaOrigemEmRelacaoAoPontoR = Math.PI / 2;
	}
	if (letra === 'b') {
		quadrado.sinalLados = [-1, -1];
		inclinacaoDeNovaOrigemEmRelacaoAoPontoR = Math.PI / 4;
		tamanhoDeslocamento = Math.hypot(
			quadrado.tamanhoLados,
			quadrado.tamanhoLados,
		);
	}

	const vetorDeDeslocamentoNormalizado = [
		Math.cos(quadrado.grau + inclinacaoDeNovaOrigemEmRelacaoAoPontoR),
		Math.sin(quadrado.grau + inclinacaoDeNovaOrigemEmRelacaoAoPontoR),
	];

	const vetorDeDeslocamentoComTamanhoCorrigido =
		vetorDeDeslocamentoNormalizado.map((e) => e * tamanhoDeslocamento);

	return vetorDeDeslocamentoComTamanhoCorrigido;
}

/**
 * Calcula o deslocamento do ponto fixo para o vértice vermelho
 *
 * @returns deslocamento do ponto fixo para o vértice vermelho
 */
function calculaDeslocamentoDaOrigemAtualParaR() {
	let deslocamento = calculaDeslocamentoDeRPara(teclaAtual).map((e) => e * -1);
	quadrado.sinalLados = [1, 1];
	return deslocamento;
}

/**
 * Dado um deslocamento em x e y muda a origem somando a origem atual à esse deslocamento.
 *
 * @param {Array} deslocamento deslocamento no eixo x e y para nova origem
 */
function moveOrigem(deslocamento) {
	quadrado.origem = quadrado.origem.map((e, i) => e + deslocamento[i]);
}

/**
 * Dado uma uma nova letra pressionada, ou seja, um novo ponto fixo, calcula o
 * deslocamento do ponto fixo anterior para o ponto fixo atual
 *
 * @param {String} novaLetra letra selecionada pelo ususário
 */
function trocaPontoFixo(novaLetra) {
	let deslocamentoDaOrigem;
	if (novaLetra === 'r') {
		deslocamentoDaOrigem = calculaDeslocamentoDaOrigemAtualParaR();
	} else if (teclaAtual === 'r') {
		deslocamentoDaOrigem = calculaDeslocamentoDeRPara(novaLetra);
	} else {
		deslocamentoDaOrigem = calculaDeslocamentoDaOrigemAtualParaR();
		moveOrigem(deslocamentoDaOrigem);

		deslocamentoDaOrigem = calculaDeslocamentoDeRPara(novaLetra);
	}
	moveOrigem(deslocamentoDaOrigem);
}

/**
 * Código responsável por guardar a última tecla pressionada
 */
document.addEventListener('keydown', (e) => {
	if (teclasValidas.includes(e.key) && e.key !== teclaAtual) {
		trocaPontoFixo(e.key);
		teclaAtual = e.key;
	}
});

/**
 * Recebe os dados necessários e desenha um vértice com base nos dados.
 *
 * @param {CanvasRenderingContext2D} ctx canvas context.
 * @param {Array} coordenada array contendo a coordenada do vértice a ser desenhado
 * @param {String} color String contendo a cor do vértice
 */
function drawVertice(ctx, coordenada, color) {
	let raio = 2;
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(coordenada[0], coordenada[1], raio, 0, 2 * Math.PI);
	ctx.fill();
}

/**
 * Desenha os pontos nos vértices do quadrado
 *
 * @param {CanvasRenderingContext2D} ctx canvas context.
 */
function drawVertices(ctx) {
	const colors = ['red', 'green', 'blue', 'white'];
	const coordenadasVertices = [
		[0, 0],
		[50, 0],
		[50, 50],
		[0, 50],
	];

	if (teclaAtual == 'w' || teclaAtual == 'g') {
		[coordenadasVertices[1], coordenadasVertices[3]] = [
			coordenadasVertices[3],
			coordenadasVertices[1],
		];
	}
	let i = 0;
	if (teclaAtual === 'g') i = 1;

	if (teclaAtual === 'b') i = 2;

	if (teclaAtual === 'w') i = 3;

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
 * Desenha o fundo do canvas.
 *
 * @param {CanvasRenderingContext2D} ctx canvas context.
 */
function drawBackgroud(ctx) {
	ctx.fillStyle = 'rgba(0, 204, 204, 1)';
	ctx.rect(0, 0, w, h);
	ctx.fill();
}

/**
 * Code to actually render our geometry.
 * @param {CanvasRenderingContext2D} ctx canvas context.
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
