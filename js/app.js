/**
 * Estados Globais
 */

/**
 * Define o estado inicial do game.
 */
const gameEstado = {
  dimensoes: {
    largura: 40,
    altura: 20,
    tamanho: 10
  },
}

/**
 * Define as configurações do game.
 * @type {{dimensoesCanva: {largura: number, altura: number, tamanhoPosicao: number}, canvas: {elemento: HTMLElement, contexto: undefined}, velocidade: number, loop: undefined, imortal: boolean}}
 */
const configuracoes = {
  canvas: {
    elemento: document.getElementById('game-board'),
    contexto: undefined,
  },
  dimensoesCanva: {
    largura: 20,
    altura: 15,
    tamanhoPosicao: 40
  },
}

/**
 * Funções de controle
 */
function iniciarGame() {
  desenharCanvas();
}

function configurarEventosDeTeclado() {
}

/**
 * Funções de desenho
 */
function desenharCanvas() {
  const {dimensoesCanva, canvas} = configuracoes;
  canvas.elemento.height = dimensoesCanva.altura * dimensoesCanva.tamanhoPosicao
  canvas.elemento.width = dimensoesCanva.largura * dimensoesCanva.tamanhoPosicao
  canvas.elemento.style.height = `${dimensoesCanva.altura * dimensoesCanva.tamanhoPosicao}px`
  canvas.elemento.style.width = `${dimensoesCanva.largura * dimensoesCanva.tamanhoPosicao}px`
  canvas.contexto = canvas.elemento.getContext('2d')

  canvas.contexto.fillStyle = 'black'
  canvas.contexto.fillRect(0, 0, canvas.elemento.width, canvas.elemento.height)
}

/**
 * Função principal (Ponto de entrada da aplicação)
 */
function principal() {
  iniciarGame();
  configurarEventosDeTeclado();
}

principal();
