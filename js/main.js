console.log('main');
const divValores = document.querySelector('div.valores');
const divMedia = document.querySelector('div.media');
const divMenor = document.querySelector('div.menor');
const divMaior = document.querySelector('div.maior');
const divAmplitude = document.querySelector('div.amplitude');
const divMediana = document.querySelector('div.mediana');
const divBarras = document.querySelector('div.barras');
const divQuartio1 = document.querySelector('div.quartio1');
const divQuartio3 = document.querySelector('div.quartio3');
const divLabels = document.querySelector('div.labels');
const divDesvio = document.querySelector('div.desvio');
const divMaximo = document.querySelector('div.maximo');
const divMinimo = document.querySelector('div.minimo');
const divIntervaloCima = document.querySelector('div.intervalocima');
const divIntervaloBaixo = document.querySelector('div.intervalobaixo');
const divBoxCima = document.querySelector('div.boxcima');
const divBoxBaixo = document.querySelector('div.boxbaixo');

const Valores = {
  valores: [],
  classes: [],
  get mediana() {
    return mediana(this.valores);
  },
  get primeiroQuartio() {
    return quartio(1, this.valores);
  },
  get terceiroQuartio() {
    return quartio(3, this.valores);
  },
  get amplitude() {
    return this.maior - this.menor;
  },
  get maior() {
    return this.valores[this.valores.length - 1];
  },
  get menor() {
    return min(this.valores);
  },
  get desvioPadrao() {
    let somatorio = 0;
    for (nota of this.valores) {
      somatorio += Math.pow((nota - this.media), 2);
    }
    return Math.sqrt(somatorio/this.valores.length);
  },
  get media() {
    let soma = 0;
    for (let nota of this.valores) soma += nota;
    return soma / this.valores.length;
  },
  atualizaView: function () {
    remover(divValores.querySelectorAll('p'));
    for (let nota of this.valores) {
        let p = document.createElement('p');
        p.innerText = nota;
        divValores.appendChild(p);
    }
    let labels = divLabels.querySelectorAll('label');
    divLabels.style.width = divBarras.style.width;
    let width = (100/this.classes.length) - 10 + '%';
    for (label of labels){
      label.style.width = width;
    }
    for (classe of this.classes) {
      classe.div.style.width = width;
    }
    divMedia.textContent = this.media;
    divMenor.textContent = this.menor;
    divMaior.textContent = this.maior;
    divAmplitude.textContent = this.amplitude;
    divMediana.textContent = this.mediana;
    divQuartio1.textContent = this.primeiroQuartio;
    divQuartio3.textContent = this.terceiroQuartio;
    divDesvio.textContent = this.desvioPadrao;

    let escala = 0;
    for (let c of this.classes) {
      c.zerar();
      for (let n of this.valores) c.conta(n);
      if (c.contagem > escala) escala = c.contagem;
    }
    for (let c of this.classes) c.desenha(escala);

    divMinimo.style.height = ((this.menor / this.maior) * 100) + '%';
    divIntervaloBaixo.style.height = (((this.primeiroQuartio - this.menor) / this.maior) * 100) + '%';
    divBoxBaixo.style.height = (((this.mediana - this.primeiroQuartio) / this.maior) * 100) + '%';
    divBoxCima.style.height = (((this.terceiroQuartio - this.mediana) / this.maior) * 100) + '%';
    divIntervaloCima.style.height = (((this.maior - this.terceiroQuartio) / this.maior) * 100) + '%';

    document.querySelector('#maximo').innerText = this.maior;
    document.querySelector('#minimo').innerText = this.menor;
    document.querySelector('#mediana').innerText = this.mediana;
    document.querySelector('#quartil1').innerText = this.primeiroQuartio;
    document.querySelector('#quartil3').innerText = this.terceiroQuartio;
  },
  adiciona: function (nota) {
    let n = parseFloat(nota);
    if (!isNaN(n)) {
      this.valores.push(n);
      this.valores.sort(function (a, b) {
        return a - b
      });
      this.atualizaView();
    }
  },
  adicionaClasse: function (nome, de, ate) {
    ate = parseFloat(ate);
    deFloat = parseFloat(de);
    if (isNaN(deFloat)) {
      de = encontraClasse(de);
    }
    let classe = new Classe(nome, de, ate);
    this.classes.push(classe);
  }
};
const formValores = document.querySelector('form.formvalores');
const formClasses = document.querySelector('form.formclasses');
formValores.addEventListener('submit', function (evento) {
  Valores.adiciona(this.valor.value);
  this.valor.value = '';
  evento.preventDefault();
});
formClasses.addEventListener('submit', function (evento) {
  let de = this.de.value;
  let ate = this.ate.value;
  let nome = this.nome.value;
  if(nome && ate) {
    Valores.adicionaClasse(nome, de, ate);
  }
  Valores.atualizaView();
  this.de.value = '';
  this.ate.value = '';
  this.nome.value = '';
  evento.preventDefault();
});

function encontraClasse(nome) {
  for (classe of Valores.classes) {
    if (classe.nome = nome) return classe;
  }
  return 0;
}

function min(vetor) {
  var m = vetor[0];
  for (let i = 1; i < vetor.length; i++) {
    if (vetor[i] < m) m = vetor[i];
  }
  return m;
}

function quartio(j, dados) {
  if (!dados) return undefined;
  if (dados.length < 4) return undefined;
  if (!j in [1, 2, 3]) return undefined;
  let n = dados.length;
  let k = parseInt(j*(n + 1)/4);
  return dados[k - 1] + (((j*(n + 1)/4) - k)*(dados[k] - dados[k - 1]));
}


function mediana(vetor) {
  if (vetor.length === 1) return vetor[0];
  if (vetor.length === 3) return vetor[2];
  if (vetor.length === 2) return (vetor[0] + vetor[1]) / 2;
  return quartio(2, vetor);
}

function Classe(nome, de, ate) {

  this.nome = nome;
  this.de = de;
  this.ate = ate;
  this.contagem = 0;

  var label = document.createElement('label');
  this.label = label;
  label.textContent = this.nome;
  divLabels.appendChild(label);

  this.div = document.createElement('div');
  this.div.classList.add('barra');
  this.div.textContent = '0';
  divBarras.appendChild(this.div);

  this.desenha = function (escala) {
    let tamanho = this.contagem / escala * 100;
    this.div.style.height = tamanho + '%';
    this.div.textContent = this.contagem;
  }

  this.zerar = function () {
    this.contagem = 0;
  }

  this.conta = function(n) {
    if (this.verifica(n)) this.contagem++;
  }

  this.verifica = function(n) {
    if (this.de instanceof Classe) {
      return n > this.de.ate && n <= this.ate;
    }
    return n >= this.de && n <= this.ate;
  }
}
function remover (elementos){
  if (!elementos) return undefined;
  for (let i = 0; i < elementos.length; i++) {
    let elemento = elementos[i];
    elementos[i] = -1;
    elemento.remove();
  }
}
