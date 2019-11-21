

window.addEventListener('load', function(event) {
    console.log('A página terminou de carregar!');
});

window.addEventListener('load', function(event) {
    console.log('A página terminou de carregar2!');
});


function processar() {
    console.log('vamos começar a processar!');

    let valorA = (document.querySelector('#inputA').value);
    let d = 0;
    for (let i = 0; i<valorA.length; i++){
        if (valorA[i] == '.'){
            valorA = valorA.slice(0,i) + valorA.slice(i+1);
        i--;
        }
    }
    for (let b = 0; b<valorA.length; b++){
        if (valorA[b] == '<' && valorA[b+1] == '>'){
            valorA = valorA.slice(0,b) + valorA.slice(b+2);
            b = b-2;
            d++;
        }
    }

    document.querySelector('#resultado1').innerHTML = d;
    console.log('A quantidade de diamantes é: ', d);
    

}











