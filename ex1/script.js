

window.addEventListener('load', function(event) {
    console.log('A página terminou de carregar!');
});

window.addEventListener('load', function(event) {
    console.log('A página terminou de carregar2!');
});


function processar() {
    console.log('vamos começar a processar!');

    let valorA = parseFloat(document.querySelector('#inputA').value);
   

    let delta = valorB*valorB-(4*valorA*valorC);
    let raiz1 = (valorB*(-1)+Math.sqrt(delta))/(2*valorA);
    let raiz2 = (valorB*(-1)-Math.sqrt(delta))/(2*valorA);

    document.querySelector('#resultado1').innerHTML = raiz1;
    console.log('A raíz 1 é: ', raiz1);
 

}












