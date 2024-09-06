/**
 * Estados Globais
 */

/**
 * Define o estado inicial do game.
 */
const gameEstado = {
  cobra: {
    tamanhoInicial: 4,
    corpo: [],
  },
  comida: undefined,
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
  console.log("iniciarGame() :: Iniciando jogo")

  desenharCanvas();
  gerarCobra()
  gerarComida()
  atualizarGame()
}

/**
 * Atualiza o estado do jogo.
 * Esta função é chamada periodicamente para atualizar o estado do jogo.
 *
 * @returns {void}
 */
function atualizarGame() {
  desenharEstadoDoGame();
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

function desenharEstadoDoGame() {
  limparCanvas()
  desenharCobra()
  desenharComida();
}

function limparCanvas() {
  const {canvas} = configuracoes;
  canvas.contexto.fillStyle = 'black'
  canvas.contexto.fillRect(0, 0, canvas.elemento.width, canvas.elemento.height)
}

function desenharCobra() {
  const {dimensoesCanva, canvas} = configuracoes;
  const {cobra} = gameEstado;

  for (let i = cobra.corpo.length - 1; i > -1; i--) {
    canvas.contexto.fillStyle = `rgb(0, 100, 0)`
    canvas.contexto.fillRect(cobra.corpo[i].x * dimensoesCanva.tamanhoPosicao, cobra.corpo[i].y * dimensoesCanva.tamanhoPosicao, dimensoesCanva.tamanhoPosicao, dimensoesCanva.tamanhoPosicao)
  }
}

function desenharComida() {
  const {dimensoesCanva, canvas} = configuracoes;
  const {comida} = gameEstado;

  if (!comida)
    throw new Error('Comida não definida')

  canvas.contexto.shadowBlur = dimensoesCanva.tamanhoPosicao.toString()
  canvas.contexto.fillStyle = 'red'
  canvas.contexto.fillRect(comida.x * dimensoesCanva.tamanhoPosicao, comida.y * dimensoesCanva.tamanhoPosicao, dimensoesCanva.tamanhoPosicao, dimensoesCanva.tamanhoPosicao)
}

/**
 * Funções auxiliares
 */

function gerarCobra() {
  const {cobra} = gameEstado;
  cobra.corpo.push(gerarPosicaoAleatoriaNoCanva())
}

function gerarComida() {
  console.log('gerarComida() :: Gerando nova comida')
  const {dimensoesCanva} = configuracoes;
  const {cobra} = gameEstado;

  let novaComida = gerarPosicaoAleatoriaNoCanva();

  while (foiGeradoComidaDentroDaCobra(cobra, novaComida)) {
    novaComida = gerarPosicaoAleatoriaNoCanva();
  }

  gameEstado.comida = novaComida

  console.log(`gerarComida() :: Nova comida em (x${gameEstado.comida.x}, y${gameEstado.comida.y})`)
}

function gerarPosicaoAleatoriaNoCanva() {
  const {dimensoesCanva} = configuracoes;

  return {
    x: Math.floor(Math.random() * dimensoesCanva.largura),
    y: Math.floor(Math.random() * dimensoesCanva.altura)
  }
}

function foiGeradoComidaDentroDaCobra(cobra, novaComida) {
  return cobra.corpo.some(parteDaCobra => (parteDaCobra.x === novaComida.x && parteDaCobra.y === novaComida.y))
}

/**
 * Função principal (Ponto de entrada da aplicação)
 */
function principal() {
  iniciarGame();
  configurarEventosDeTeclado();
}

principal();
