function start() { // inicio start()
  $("#inicio").hide();
  $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
  $("#fundoGame").append("<div id='inimigo1' class='anima3'></div>");
  $("#fundoGame").append("<div id='inimigo2'></div>");
  $("#fundoGame").append("<div id='amigo' class='anima2'></div>");
  $("#fundoGame").append("<div id='placar'></div>");
  $("#fundoGame").append("<div id='energia'></div>");

//Principais variáveis do jogo
var jogo = {}
var velocidade = 5;
var posicaoY = parseInt(Math.random() * 334);
var podeAtirar = true;
var fimdejogo = false;
var pontos = 0;
var salvos = 0;
var perdidos = 0;
var energiaAtual = 3;
var trilhaFundo = document.getElementById("musica_fundo")
var trilhaDisparo = document.getElementById("tiro");
var trilhaExplosao = document.getElementById("Explosao");
var trilhagame_over = document.getElementById("game_over");
var TECLA = {
  W:87, 
  S:83, 
  D:68
}

//Verifica se o usuário pressionou alguma tecla
jogo.pressionou = []
$(document).keydown(function(e){
  jogo.pressionou[e.which] = true
})

$(document).keyup(function(e){
  jogo.pressionou[e.which] = false
})

//Música em loop
trilhaFundo.addEventListener("ended",function(){trilhaFundo.currentTime = 0;trilhaFundo.play();},false);
trilhaFundo.play();

//Game Loop
jogo.timer = setInterval(loop, 30)
function loop() {
  movefundo();
  movejogador();
  moveinimigo1();
  moveinimigo2();
  moveamigo();
  colisao();
  placar();
  energia();
} //Fim da função loop()

//Função que movimenta o fundo do jogo
function movefundo() {
  esquerda = parseInt($("#fundoGame").css("background-position"))
  $("#fundoGame").css("background-position", esquerda - 1)
} //Fim da função movefundo()

function movejogador() {
  if(jogo.pressionou[TECLA.W]){
    var topo = parseInt($("#jogador").css("top"));
    if (topo <= 30){}

    else{
      $("#jogador").css("top", topo - 10)
    }
  }

  if(jogo.pressionou[TECLA.S]){
    var topo = parseInt($("#jogador").css("top"));
    if (topo >= 380){}

    else{
      $("#jogador").css("top", topo + 10)
    }
   
  }

  if(jogo.pressionou[TECLA.D]){
    //Chama a função disparo //
    disparo();
  }

} //Fim da função movejogador()

function moveinimigo1(){
  let posicaoX = parseInt($("#inimigo1").css("left"));
  $("#inimigo1").css("left", posicaoX - velocidade);
  $("#inimigo1").css("top", posicaoY);

  if (posicaoX <= 0){

    posicaoY = parseInt(Math.random() * 334);
    $("#inimigo1").css("left", 694);
    $("#inimigo1").css("top", posicaoY);
  }
} //Fim da função moveinimigo1()

function moveinimigo2(){
  let posicaoX = parseInt($("#inimigo2").css("left"));
  $("#inimigo2").css("left", posicaoX - 3);
  
  if(posicaoX <= 0){
    $("#inimigo2").css("left", 775);
  }
}//Fim da função moveinimigo2()

function moveamigo(){
  posicaoX = parseInt($("#amigo").css("left"));
  $("#amigo").css("left", posicaoX + 1);

  if(posicaoX > 906){
    $("#amigo").css("left", 0);
  }
} //Fim da função moveamigo()

function disparo(){
  if(podeAtirar == true){
    podeAtirar = false;
    trilhaDisparo.play();
    
    topo = parseInt($("#jogador").css("top"))
    posicaoX = parseInt($("#jogador").css("left"))
    tiroX = posicaoX + 120;
    topoTiro = topo + 40;
    $("#fundoGame").append("<div id='disparo'></div>");
    $("#disparo").css("top", topoTiro);
    $("#disparo").css("left", tiroX);

    var tempoDisparo = window.setInterval(executaDisparo, 30);

  } //Fecha podeAtirar

  function executaDisparo(){
    posicaoX = parseInt($("#disparo").css("left"));
    $("#disparo").css("left", posicaoX + 15);

    if(posicaoX > 900){
      window.clearInterval(tempoDisparo);
      tempoDisparo = null;
      $("#disparo").remove();
      podeAtirar = true;
    }
  } //Fecha executaDisparo()
} //Fecha disparo()

function colisao(){
  var colisao1 = ($("#jogador").collision($("#inimigo1")));
  var colisao2 = ($("#jogador").collision($("#inimigo2")));
  var colisao3 = ($("#disparo").collision($("#inimigo1")));
  var colisao4 = ($("#disparo").collision($("#inimigo2")));
  var colisao5 = ($("#jogador").collision($("#amigo")));
  var colisao6 = ($("#inimigo2").collision($("#amigo")));
  
  //Jogador com o inimigo1
  if(colisao1.length > 0){
    energiaAtual--;
    inimigo1X = parseInt($("#inimigo1").css("left"));
    inimigo1Y = parseInt($("#inimigo1").css("top"));  
    explosao1(inimigo1X, inimigo1Y);

    posicaoY = parseInt(Math.random() * 334);  
    $("#inimigo1").css("left", 694);
    $("#inimigo1").css("top", posicaoY);
    reposicionaInimigo1();
  }

  //Jogador com inimigo2
  if(colisao2.length > 0){
    energiaAtual--;
    inimigo2X = parseInt($("#inimigo2").css("left"));
    inimigo2Y = parseInt($("#inimigo2").css("top"));

    explosao2(inimigo2X, inimigo2Y);
    $("#inimigo2").remove();
    reposicionaInimigo2();
  
  }
    //Disparo com inimigo1
    if(colisao3.length > 0){
      velocidade = velocidade + 0.3;
      pontos = pontos + 100;
      inimigo1X = parseInt($("#inimigo1").css("left"));
      inimigo1Y = parseInt($("#inimigo1").css("top"));
      explosao2(inimigo1X, inimigo1Y);
    
      posicaoY = parseInt(Math.random() * 334);  
      $("#inimigo1").css("left", 850);
      $("#inimigo1").css("top", posicaoY);
    }
    if(colisao4.length > 0){
      pontos = pontos + 50;
      inimigo2X = parseInt($("#inimigo2").css("left"));
      inimigo2Y = parseInt($("#inimigo2").css("top"));
      explosao2(inimigo2X, inimigo2Y);
     
      $("#inimigo2").css("left", 694);
    }
  
    //Jogador com amigo
  if(colisao5.length > 0){
    salvos++;
    reposicionaAmigo();
    $("#amigo").remove();
   
  }

   //Inimigo2 com Amigo
   if(colisao6.length > 0){
    perdidos++;
    amigoX = parseInt($("#amigo").css("left"));
    amigoY = parseInt($("#amigo").css("top"));
    explosao3(amigoX,amigoY);
    $("#amigo").remove();

    reposicionaAmigo();
   }

}//Fim da função colisao()

//Explosão 1

function explosao1(inimigo1X, inimigo1Y){

  trilhaExplosao.play();
  $("#fundoGame").append("<div id='explosao1'></div>");
  $("#explosao1").css("background-image","url(imgs/explosao.png)");

  var div = $("#explosao1");
  div.css("top", inimigo1Y);
  div.css("left", inimigo1X);
  div.animate({width:200, opacity:0}, "slow");

  var tempoExplosao = window.setInterval(removeExplosao, 1000);
    function removeExplosao(){
      div.remove();
      window.clearInterval(tempoExplosao);
      tempoExplosao = null;
  }
}//Fim da função explosao1()

//Explosão2

function explosao2(inimigo2X, inimigo2Y){
  trilhaExplosao.play();
  $("#fundoGame").append("<div id='explosao2'></div>");
  $("#explosao2").css("background-image","url(imgs/explosao.png)");

  var div2 = $("#explosao2");
  div2.css("top", inimigo2Y);
  div2.css("left", inimigo2X);
  div2.animate({width:200, opacity:0}, "slow");

  var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);
    function removeExplosao2(){
      div2.remove();
      window.clearInterval(tempoExplosao2);
      tempoExplosao2 = null;
  }
} //Fim da função explosão2()

//Reposiciona Inimigo1
function reposicionaInimigo1(){
  var tempoColisao3 = window.setInterval(reposiciona3, 5000);

  function reposiciona3(){
    window.clearInterval(tempoColisao3);
    tempoColisao3 = null;
    if(fimdejogo == false){
      $("#fundoGame").append("<div id=inimigo1></div>");
    }
  } //Fim da função reposicionaInimigo1()
}

//Reposiciona Inimigo2
function reposicionaInimigo2(){
  var tempoColisao4 = window.setInterval(reposiciona4, 5000);

  function reposiciona4(){
    window.clearInterval(tempoColisao4);
    tempoColisao4 = null;
    if(fimdejogo == false){
      $("#fundoGame").append("<div id=inimigo2></div>");
    }
  } //Fim da função reposicionaInimigo2()
}
  //Reposiciona Amigo

  function reposicionaAmigo(){
    var tempoAmigo = window.setInterval(reposiciona6, 6000);

    function reposiciona6(){
      window.clearInterval(tempoAmigo);
      tempoAmigo = null;
      if(fimdejogo == false){
        $("#fundoGame").append("<div id='amigo' class='anima4'></div>");
      }
    }
  } //Fim da função reposicionaAmigo()
  //Explosão3

  function explosao3(amigoX,amigoY){
    $("#fundoGame").append("<div id='explosao3' class='anima4'></div>" );
    $("#explosao3").css("top", amigoY);
    $("#explosao3").css("left", amigoX);

    var tempoExplosao3 = window.setInterval(resetaExplosao3, 1000);

    function resetaExplosao3(){
      $("#explosao3").remove();
      window.clearInterval(tempoExplosao3);
      tempoExplosao3 = null;
  } //Fim da função explosao3
  }
  //Função placar
  
  function placar(){
    $("#placar").html("<h2>Pontos:" + pontos + " Salvos:" + salvos + " Perdidos:" + perdidos + "</h2>");
  } //Fim da função placar()

  //Barra de energia

  function energia(){
    if(energiaAtual == 3){
      $("#energia").css("background-image","url(imgs/energia3.png");
    }
    if(energiaAtual == 2){
      $("#energia").css("background-image","url(imgs/energia2.png");
    }
    if(energiaAtual == 1){
      $("#energia").css("background-image","url(imgs/energia1.png");
    }
    if(energiaAtual == 0){
      $("#energia").css("background-image","url(imgs/energia0.png");
      //Game Over
      gameOver();
    }
  } //Fim da função energia()

  //Função GAME OVER

  function gameOver(){
    fimdejogo = true;
    trilhaFundo.pause();
    trilhaDisparo.pause();
    trilhaExplosao.pause();
    trilhagame_over.play();

    window.clearInterval(jogo.timer);
    jogo.timer = null;
    $("#jogador").remove();
    $("#inimigo1").remove();
    $("#inimigo2").remove();
    $("#amigo").remove();

    $("#fundoGame").append("<div id='fim'></div>");

    $("#fim").html("<h1>Game Over</h1><p>Sua Pontuação foi:" + pontos + " pontos</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");

  } //Fim da função gameOver()

} //Fim da função start()

//Reinicia Jogo

function reiniciaJogo(){
  game_over.pause();
  $("#fim").remove();
  start();
} //Fim da função reiniciaJogo()