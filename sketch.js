var trex,trexImg,solo,soloImg,soloinvisivel,nuvemImg,trex2Img,gameOver,reiniciar,gameOverImg,reiniciarImg;
var obstaculo1,obstaculo2,obstaculo3,obstaculo4,obstaculo5,obstaculo6; 
var JOGAR = 1;
var ENCERRAR = 0;
var estadoJogo = JOGAR;
var pontos = 0;
var groupNuvens,groupObstaculos;
var soundDie,soundJump,soundCheckpoint;

function preload(){

  trexImg = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex2Img = loadAnimation("trex_collided.png");

  soloImg = loadImage("ground2.png");
  nuvemImg = loadImage("cloud.png");
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
  soundDie = loadSound("die.mp3");
  soundJump = loadSound("jump.mp3");
  soundCheckpoint = loadSound("checkpoint.mp3");
  gameOverImg = loadImage("gameOver.png");
  reiniciarImg = loadImage("restart.png");
}

function setup(){

  createCanvas(windowWidth,windowHeight);

  trex=createSprite(50,height-70,20,50);
  trex.addAnimation("run",trexImg);
  trex.addAnimation("collided",trex2Img);
  trex.scale = 0.5;

  solo=createSprite(width/2,height-20,width,20);
  solo.addImage(soloImg);

  soloinvisivel = createSprite (width/2,height-10,width,10);
  soloinvisivel.visible = false;
  var x = Math.round (random (1,5));
  console.log (x);

  groupNuvens = new Group ();

  groupObstaculos = new Group ();

  //trex.debug = true;
  trex.setCollider ("circle",0,0,40);


  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  gameOver.visible = false;
  gameOver.scale = 0.5;
  
  reiniciar = createSprite(width/2,height/2+50);
  reiniciar.addImage(reiniciarImg);
  reiniciar.scale = 0.5;
  reiniciar.visible = false;
}


function draw(){
  //definir a cor do plano de fundo 
  background("white");

  text ("score: " + pontos ,width/2-50,height-400);

  if (estadoJogo == JOGAR){
    pontos = pontos + Math.round (frameRate()/60);
    if(pontos < 0 && Math.round (pontos %100 == 0)){
      soundCheckpoint.play();
    }
    solo.velocityX = -(4 + pontos/100);
    if(solo.x<0){
      solo.x=solo.width/2;
    }
    if(keyDown("space")&& trex.y >= height-60 || touches.length > 0 && trex.y > height-60){
      trex.velocityY = -10;
      soundJump.play();
      touches=[];
    }
    trex.velocityY=trex.velocityY+0.5;
    gerarNuvens();
    gerarObstaculos();
    if (groupObstaculos.isTouching (trex)){
      soundDie.play();
    estadoJogo = ENCERRAR;
    }
  }
  else if (estadoJogo == ENCERRAR){
  gameOver.visible = true;
  reiniciar.visible = true;
  solo.velocityX = 0;
  trex.changeAnimation("collided");
  trex.velocityY = 0;

  groupObstaculos.setVelocityXEach (0);
  groupNuvens.setVelocityXEach (0);

  groupObstaculos.setLifetimeEach (-1);
  groupNuvens.setLifetimeEach (-1);

  if(mousePressedOver(reiniciar)|| touches.length > 0){
    reset();
    touches=[];
  }
  }
  //console.log(trex.y);
  trex.collide(soloinvisivel);
  drawSprites();

}

function gerarNuvens(){
  if (frameCount %60 == 0){
    var nuvem = createSprite (width,100,40,10);
    nuvem.velocityX = -(3 + pontos/100);
    nuvem.addImage(nuvemImg);
    nuvem.scale = 0.5;
    nuvem.y = Math.round(random(height-300,height-100));
    nuvem.depth = trex.depth;
    trex.depth = trex.depth +1;
    nuvem.lifetime = 500;

    groupNuvens.add (nuvem);
  }
  
}
function gerarObstaculos(){
  if (frameCount %60 == 0){  
    var obstaculo = createSprite(width/2,height-35,10,40);
    obstaculo.velocityX = -(8 + pontos/100);
    var numero = Math.round(random(1,6));
    switch (numero) {
      case 1: obstaculo.addImage(obstaculo1);
        
        break;
      case 2: obstaculo.addImage(obstaculo2);
        
        break;
      case 3: obstaculo.addImage(obstaculo3);
        
        break;
      case 4: obstaculo.addImage(obstaculo4);
        
        break;
      case 5: obstaculo.addImage(obstaculo5);
        
        break;
      case 6: obstaculo.addImage(obstaculo6);
        
        break;
      default:
        break;
    }
    obstaculo.scale = 0.5;
    obstaculo.lifetime = 200;

    groupObstaculos.add (obstaculo);
  }
}
function reset(){
estadoJogo = JOGAR;

groupObstaculos.destroyEach();
groupNuvens.destroyEach();

gameOver.visible = false;
reiniciar.visible = false;

trex.changeAnimation("run");
pontos = 0;
}