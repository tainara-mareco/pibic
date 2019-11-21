
var PlayerEnum = {
    NONE: 0,
    X: 1,
    O: 2,
};

var Sizes = {
    RAIO: 100,
    DESLOCAMENTO: 333
};

var GameState = {
    X: 1,
    O: 2,
    END: 3,
    ENDX: 4,
    ENDO: 5
};

class Peca {
    constructor(ctx, i, j) {
        this.player = PlayerEnum.NONE;
        this.ctx = ctx;

        // centro da Peca
        this.x = Sizes.DESLOCAMENTO*(i+0.5);
        this.y = Sizes.DESLOCAMENTO*(j+0.5);
    }

    draw() {
        this.ctx.fillStyle = "#000000";
        this.ctx.strokeStyle = "#000000";
      //  Exempo: Desenha um retangulo no lugar de todas as Pecas
      //  this.ctx.fillRect(this.x-Sizes.RAIO, this.y-Sizes.RAIO, Sizes.RAIO*2, Sizes.RAIO*2);

        if(this.player===PlayerEnum.O) {
            this.ctx.beginPath();                                       // preparar para desenhar
            this.ctx.arc(this.x, this.y, Sizes.RAIO, 0, 2 * Math.PI);   // definir um circulo
            this.ctx.stroke();                                          // desenhar linha
          //  this.ctx.fill();                                          // preencher 
        }
        if(this.player===PlayerEnum.X) {
            this.ctx.beginPath();                      // preparar para desenhar
            this.ctx.moveTo(this.x-100, this.y-100);    // posicionar o cursor
            this.ctx.lineTo(this.x+100, this.y+100);  // definir uma linha ate a posicao atual
            this.ctx.stroke();                         // desenha efetivamente as linhas
            
            this.ctx.beginPath();                      // preparar para desenhar
            this.ctx.moveTo(this.x+100, this.y-100);    // posicionar o cursor
            this.ctx.lineTo(this.x-100, this.y+100);  // definir uma linha ate a posicao atual
            this.ctx.stroke();                         // desenha efetivamente as linhas
        }
    }

    isClick(x, y) {
        if(x>this.x-Sizes.DESLOCAMENTO/2 && x<this.x+Sizes.DESLOCAMENTO/2 && y>this.y-Sizes.DESLOCAMENTO/2 && y<this.y+Sizes.DESLOCAMENTO/2)
        {
            return true;
        }
        return false;
    }
}



class GameMain {
    constructor() {
        window.addEventListener('load', () => {
            this.init();
        });
    }

    init() {
        console.log('init');
        this.canvas = document.querySelector('#myCanvas');
        this.canvasRect = this.canvas.getBoundingClientRect();
        this.ctx = this.canvas.getContext('2d');
        this.lastTimestamp = null;
        this.gameState = GameState.X;
        

        this.pecas = [];
        for(let i=0;i<3;i++) {
            this.pecas[i] = [];
            for(let j=0;j<3;j++) {
                this.pecas[i][j] = new Peca(this.ctx, i, j);
            }
        }

    

        this.canvas.addEventListener('click', (event)=>{
            this.click(event);
        });

        requestAnimationFrame((timestamp)=>{
            this.loopDraw(timestamp);
        });
    }

    getPosition(event) {
        let x = event.pageX - this.canvasRect.x;
        let y = event.pageY - this.canvasRect.y;
        x = parseInt(x*this.canvas.width/this.canvasRect.width);
        y = parseInt(y*this.canvas.height/this.canvasRect.height);
        return {x,y};
    }

    click(event) {
        let {x, y} = this.getPosition(event);
        console.log('click', x, y);
        console.log('this.pecas', this.pecas);

        for(let i=0;i<3;i++) {
            for(let j=0;j<3;j++) {
                if(this.pecas[i][j].isClick(x, y)) {
                    if (this.pecas[i][j].player == PlayerEnum.NONE) {
                        this.pecas[i][j].player = this.gameState;
                        if (this.gameState == GameState.X){
                            this.gameState = GameState.O;
                        }
                        else if (this.gameState == GameState.O) {
                            this.gameState = GameState.X;
                        }

                        this.gameIsEnd();
                        this.playeria();
                    }
                    console.log(i,j);

                }
            }
        }
        this.gameIsEnd();
    }

    playeria(){
        let casasvazias;
        casasvazias = [];
        this.profundidadeMax = 0;
        this.scoreCount = 0;
        for(let i=0;i<3;i++){
            for(let j=0;j<3;j++){
                if(this.pecas[i][j].player==PlayerEnum.NONE){
                    let m = _.cloneDeep(this.pecas);
                    m[i][j].player = PlayerEnum.O;
                    casasvazias.push({peca: this.pecas[i][j], score: this.scoreR(m, PlayerEnum.O, 1)});
                }
            }
        }
        console.log('this.profundidadeMax: ' +this.profundidadeMax + ' this.scoreCount: ' +this.scoreCount);
        if(casasvazias.length>0){
            casasvazias.sort(function (a, b) {
                if (a.score > b.score) {
                  return -1;
                }
                if (a.score < b.score) {
                  return 1;
                }
                // a must be equal to b
                return 0;
              });
            let maxPosicao = 0;
            let maxScore = casasvazias[0].score;
            for(let i=0;i<casasvazias.length;i++) {
                if(casasvazias[i].score==maxScore) {
                    maxPosicao++;
                }
            }

            let posicao = Math.floor((Math.random() * maxPosicao));
            casasvazias[posicao].peca.player = GameState.O;
            this.gameState = GameState.X;
        }
        console.log (casasvazias);
    }

    gameIsEnd() {
        if ((this.pecas[0][0].player == PlayerEnum.X && this.pecas[1][0].player == PlayerEnum.X && this.pecas[2][0].player == PlayerEnum.X)
        || (this.pecas[0][1].player == PlayerEnum.X && this.pecas[1][1].player == PlayerEnum.X && this.pecas[2][1].player == PlayerEnum.X)
        || (this.pecas[0][2].player == PlayerEnum.X && this.pecas[1][2].player == PlayerEnum.X && this.pecas[2][2].player == PlayerEnum.X)
        || (this.pecas[0][0].player == PlayerEnum.X && this.pecas[0][1].player == PlayerEnum.X && this.pecas[0][2].player == PlayerEnum.X)
        || (this.pecas[1][0].player == PlayerEnum.X && this.pecas[1][1].player == PlayerEnum.X && this.pecas[1][2].player == PlayerEnum.X)
        || (this.pecas[2][0].player == PlayerEnum.X && this.pecas[2][1].player == PlayerEnum.X && this.pecas[2][2].player == PlayerEnum.X)
        || (this.pecas[0][0].player == PlayerEnum.X && this.pecas[1][1].player == PlayerEnum.X && this.pecas[2][2].player == PlayerEnum.X)
        || (this.pecas[0][2].player == PlayerEnum.X && this.pecas[1][1].player == PlayerEnum.X && this.pecas[2][0].player == PlayerEnum.X)) {
            this.gameState = GameState.ENDX;
        }

        if( (this.pecas[0][0].player == PlayerEnum.O && this.pecas[1][0].player == PlayerEnum.O && this.pecas[2][0].player == PlayerEnum.O)
        || (this.pecas[0][1].player == PlayerEnum.O && this.pecas[1][1].player == PlayerEnum.O && this.pecas[2][1].player == PlayerEnum.O)
        || (this.pecas[0][2].player == PlayerEnum.O && this.pecas[1][2].player == PlayerEnum.O && this.pecas[2][2].player == PlayerEnum.O)
        || (this.pecas[0][0].player == PlayerEnum.O && this.pecas[0][1].player == PlayerEnum.O && this.pecas[0][2].player == PlayerEnum.O)
        || (this.pecas[1][0].player == PlayerEnum.O && this.pecas[1][1].player == PlayerEnum.O && this.pecas[1][2].player == PlayerEnum.O)
        || (this.pecas[2][0].player == PlayerEnum.O && this.pecas[2][1].player == PlayerEnum.O && this.pecas[2][2].player == PlayerEnum.O)
        || (this.pecas[0][0].player == PlayerEnum.O && this.pecas[1][1].player == PlayerEnum.O && this.pecas[2][2].player == PlayerEnum.O)
        || (this.pecas[0][2].player == PlayerEnum.O && this.pecas[1][1].player == PlayerEnum.O && this.pecas[2][0].player == PlayerEnum.O)) {
            this.gameState = GameState.ENDO;
        }

    }

    scoreR(M, player, profundidade) {
        if(this.profundidadeMax<profundidade) {
            this.profundidadeMax = profundidade;
        }
        if(profundidade>4) {
            return 0;
        }
        let score = this.score(M);
        if(score==PlayerEnum.X) {
            return -1;
        }
        else if(score==PlayerEnum.O) {
            return 1;
        }
        else {
            if(player==PlayerEnum.O) {
                player=PlayerEnum.X;
            }
            else {
                player=PlayerEnum.O;
            }
            let scoreRet= 0;
            let scoreCount = 0;
            for(let i=0;i<3;i++){
                for(let j=0;j<3;j++){
                    if(M[i][j].player==PlayerEnum.NONE){
                        let m = _.cloneDeep(M);
                        m[i][j].player = player;
                        scoreRet = scoreRet + this.scoreR(m, player, profundidade+1);
                        scoreCount++;
                    }
                }
            }
            let scoreTmp = (scoreRet/(scoreCount || 1))*(1/profundidade);
            return parseFloat(scoreTmp.toFixed(3));
        }


    }

    score(M){
        this.scoreCount++;
        if ((M[0][0].player == PlayerEnum.X && M[1][0].player == PlayerEnum.X && M[2][0].player == PlayerEnum.X)
        || (M[0][1].player == PlayerEnum.X && M[1][1].player == PlayerEnum.X && M[2][1].player == PlayerEnum.X)
        || (M[0][2].player == PlayerEnum.X && M[1][2].player == PlayerEnum.X && M[2][2].player == PlayerEnum.X)
        || (M[0][0].player == PlayerEnum.X && M[0][1].player == PlayerEnum.X && M[0][2].player == PlayerEnum.X)
        || (M[1][0].player == PlayerEnum.X && M[1][1].player == PlayerEnum.X && M[1][2].player == PlayerEnum.X)
        || (M[2][0].player == PlayerEnum.X && M[2][1].player == PlayerEnum.X && M[2][2].player == PlayerEnum.X)
        || (M[0][0].player == PlayerEnum.X && M[1][1].player == PlayerEnum.X && M[2][2].player == PlayerEnum.X)
        || (M[0][2].player == PlayerEnum.X && M[1][1].player == PlayerEnum.X && M[2][0].player == PlayerEnum.X)) {
        return PlayerEnum.X;
        }

        if( (M[0][0].player == PlayerEnum.O && M[1][0].player == PlayerEnum.O && M[2][0].player == PlayerEnum.O)
        || (M[0][1].player == PlayerEnum.O && M[1][1].player == PlayerEnum.O && M[2][1].player == PlayerEnum.O)
        || (M[0][2].player == PlayerEnum.O && M[1][2].player == PlayerEnum.O && M[2][2].player == PlayerEnum.O)
        || (M[0][0].player == PlayerEnum.O && M[0][1].player == PlayerEnum.O && M[0][2].player == PlayerEnum.O)
        || (M[1][0].player == PlayerEnum.O && M[1][1].player == PlayerEnum.O && M[1][2].player == PlayerEnum.O)
        || (M[2][0].player == PlayerEnum.O && M[2][1].player == PlayerEnum.O && M[2][2].player == PlayerEnum.O)
        || (M[0][0].player == PlayerEnum.O && M[1][1].player == PlayerEnum.O && M[2][2].player == PlayerEnum.O)
        || (M[0][2].player == PlayerEnum.O && M[1][1].player == PlayerEnum.O && M[2][0].player == PlayerEnum.O)) {
        return PlayerEnum.O;
        }
    }

    loopDraw (timestamp) {
        this.clearCanvas();

        this.ctx.lineWidth = 5;                   // largura da linha
        this.ctx.fillStyle = "#FFFFFF";           // cor de preenchimento
        this.ctx.strokeStyle = "#000000";         // cor da linha

        this.ctx.beginPath();                      // preparar para desenhar
        this.ctx.moveTo(Sizes.DESLOCAMENTO, 0);    // posicionar o cursor
        this.ctx.lineTo(Sizes.DESLOCAMENTO,1000);  // definir uma linha ate a posicao atual
        this.ctx.stroke();                         // desenha efetivamente as linhas

        this.ctx.beginPath();                      // preparar para desenhar
        this.ctx.moveTo(Sizes.DESLOCAMENTO*2, 0);    // posicionar o cursor
        this.ctx.lineTo(Sizes.DESLOCAMENTO*2,1000);  // definir uma linha ate a posicao atual
        this.ctx.stroke();                         // desenha efetivamente as linhas

        this.ctx.beginPath();                      // preparar para desenhar
        this.ctx.moveTo(0, Sizes.DESLOCAMENTO);    // posicionar o cursor
        this.ctx.lineTo(1000, Sizes.DESLOCAMENTO);  // definir uma linha ate a posicao atual
        this.ctx.stroke();                         // desenha efetivamente as linhas

        this.ctx.beginPath();                      // preparar para desenhar
        this.ctx.moveTo(0, Sizes.DESLOCAMENTO*2);    // posicionar o cursor
        this.ctx.lineTo(1000, Sizes.DESLOCAMENTO*2);  // definir uma linha ate a posicao atual
        this.ctx.stroke();                         // desenha efetivamente as linhas

        for(let i=0;i<3;i++) {
            for(let j=0;j<3;j++) {
                this.pecas[i][j].draw();
            }
        }

    
        this.drawHud();

        this.lastTimestamp = timestamp;
        requestAnimationFrame((timestamp)=>{
            this.loopDraw(timestamp);
        });
    }
    clearCanvas() {
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    drawHud() {
        this.ctx.font = "30px Arial";
        let txt = "Jogador Atual ";
        if(this.gameState === GameState.X) {
            txt = txt + 'X';
        }
        else if(this.gameState === GameState.O) {
            txt = txt + 'O';
        }
        else if(this.gameState === GameState.ENDX) {
            txt = "Ganhou X";
        }
        else if(this.gameState === GameState.ENDO) {
            txt = "Ganhou O";
        }
        
        this.ctx.fillText(txt, Sizes.DESLOCAMENTO+90, 40);
    }

    reset() {
        for(let i=0;i<3;i++) {
            for(let j=0;j<3;j++) {
                


                this.pecas[i][j].player = PlayerEnum.NONE;
            }    
        }
        this.gameState = GameState.X;
    }
    

}

var gameMain = new GameMain();