/**
 * Estados Globais
 */

/**
 * Define o estado inicial do game.
 */
const gameEstado = {
}

/**
 * Define as configurações do game.
 * @type {{dimensoesCanva: {largura: number, altura: number, tamanhoPosicao: number}, canvas: {elemento: HTMLElement, contexto: undefined}, velocidade: number, loop: undefined, imortal: boolean}}
 */
const configuracoes = {
}

/**
 * Funções de controle
 */
function iniciarGame() {}

function configurarEventosDeTeclado() {}

/**
 * Função principal (Ponto de entrada da aplicação)
 */
function principal() {
  iniciarGame();
  configurarEventosDeTeclado();
}

principal();
