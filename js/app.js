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
  eventos: {
    ultimaTeclaPressionada: undefined,
  }
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
  loop: undefined,
  velocidade: 100, //ms
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

function finalizarGame(message) {
  console.log("finalizarGame() :: Finalizando jogo")
  limparLoop();
  limparCanvas();
  alert(message)
}

/**
 * Atualiza o estado do jogo.
 * Esta função é chamada periodicamente para atualizar o estado do jogo.
 *
 * @returns {void}
 */
function atualizarGame() {
  console.log("atualizarGame() :: Atualizando jogo")

  configurarLoop();
  atualizarCoordenadasDaCobra();
  desenharEstadoDoGame();

  if (verificarColisaoComComida()) {
    console.log("atualizarGame() :: Colisão com comida ")
    aumentarCaudaDaCobra()

    if (gameTemEspacoParaGerarComida()) {
      console.log("atualizarGame() :: Gerando nova comida ")
      gerarComida()
    }
  }

  if (verificarColisaoComParede()) {
    console.log("atualizarGame() :: Colisão com parede ")
    finalizarGame("Cobra colidiu com parede! Você perdeu!")
  }

  if (verificarColisaoComCauda()) {
    console.log("atualizarGame() :: Colisão com cauda ")
    finalizarGame("Cobra colidiu com cauda! Você perdeu!")
  }
}

function limparLoop() {
  clearTimeout(configuracoes.loop)
}

function configurarLoop() {
  configuracoes.loop = setTimeout(atualizarGame, configuracoes.velocidade)
}

/**
 * Configura os eventos de teclado para controlar o movimento da cobra.
 *
 * @function configurarEventosDeTeclado
 * @returns {void}
 */
function configurarEventosDeTeclado() {
  window.addEventListener('keydown', function (event) {
    const {eventos} = gameEstado;

    switch (event.key) {
      case 'ArrowDown':
        console.log("configurarEventosDeTeclado() :: Usuário pressionou a tecla arrow-down")

        if (cobraEstaViradaParaCima()) {
          break;
        }

        eventos.ultimaTeclaPressionada = event.key

        break
      case 'ArrowUp':
        console.log("configurarEventosDeTeclado() :: Usuário pressionou a tecla arrow-up")

        if (cobraEstaViradaParaBaixo()) {
          break;
        }

        eventos.ultimaTeclaPressionada = event.key
        break
      case 'ArrowLeft':
        console.log("configurarEventosDeTeclado() ::  Usuário pressionou a tecla arrow-left")

        if (cobraEstaViradaParaDireita()) {
          break;
        }

        eventos.ultimaTeclaPressionada = event.key
        break
      case 'ArrowRight':
        console.log("configurarEventosDeTeclado() ::  Usuário pressionou a tecla arrow-right")

        if (cobraEstaViradaParaEsquerda()) {
          break;
        }

        eventos.ultimaTeclaPressionada = event.key
        break
    }
  })
}

function atualizarCoordenadasDaCobra() {
  const {cobra, eventos} = gameEstado

  const novaPosicao = {
    x: cobra.corpo[0].x,
    y: cobra.corpo[0].y
  }

  // Atualiza as coordenadas da cabeça da cobra
  switch (eventos.ultimaTeclaPressionada) {
    case 'ArrowDown':
      novaPosicao.y++
      break
    case 'ArrowUp':
      novaPosicao.y--
      break
    case 'ArrowLeft':
      novaPosicao.x--
      break
    case 'ArrowRight':
      novaPosicao.x++
      break
    default:
      return;
  }

  cobra.corpo.unshift(novaPosicao) // Adiciona a nova cabeça da cobra no começo do corpo
  cobra.corpo.pop() // Remove a última posição do corpo da cobra
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
  limparCanvas();
  desenharComida();
  desenharCobra();
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

function verificarColisaoComComida() {
  const {cobra, comida} = gameEstado;
  return cobra.corpo[0].x === comida.x && cobra.corpo[0].y === comida.y
}

function gameTemEspacoParaGerarComida() {
  const {cobra} = gameEstado;
  const {dimensoesCanva} = configuracoes;
  return cobra.corpo.length < dimensoesCanva.largura * dimensoesCanva.altura
}

function aumentarCaudaDaCobra() {
  console.log("atualizarGame() :: Aumentando cauda da cobra ")

  const {cobra} = gameEstado;

  // Faz com que a ponta da cauda fique na sua última posição ("parada") por mais um loop,
  // após a cabeça andar, estendendo a cauda da cobra
  cobra.corpo.push({
    x: cobra.corpo[cobra.corpo.length - 1].x,
    y: cobra.corpo[cobra.corpo.length - 1].y
  })
}

function verificarColisaoComParede() {
  const {cobra} = gameEstado;
  const {dimensoesCanva} = configuracoes;
  return cobra.corpo[0].x < 0 || cobra.corpo[0].x >= dimensoesCanva.largura || cobra.corpo[0].y < 0 || cobra.corpo[0].y >= dimensoesCanva.altura
}

function verificarColisaoComCauda() {
  const {cobra} = gameEstado;

  if (cobra.corpo.length < 5) // Não é possível a cobra bater nela mesma com o tamanho < 5
    return false

  for (let i = 1; i < cobra.corpo.length; i++)
    if (cobra.corpo[0].x === cobra.corpo[i].x && cobra.corpo[0].y === cobra.corpo[i].y)
      return true

  return false
}

function cobraEstaViradaParaCima() {
  const {cobra} = gameEstado;
  return cobra.corpo.length > 1 && cobra.corpo[0].y === cobra.corpo[1].y - 1;
}

function cobraEstaViradaParaBaixo() {
  const {cobra} = gameEstado;
  return cobra.corpo.length > 1 && cobra.corpo[0].y === cobra.corpo[1].y + 1
}

function cobraEstaViradaParaEsquerda() {
  const {cobra} = gameEstado;
  return cobra.corpo.length > 1 && cobra.corpo[0].x === cobra.corpo[1].x - 1
}

function cobraEstaViradaParaDireita() {
  const {cobra} = gameEstado;
  return cobra.corpo.length > 1 && cobra.corpo[0].x === cobra.corpo[1].x + 1
}

/**
 * Função principal (Ponto de entrada da aplicação)
 */
function principal() {
  iniciarGame();
  configurarEventosDeTeclado();
}

principal();
