const express = require('express');
const fs = require('fs');
const path = require('path');
const rsa = require('./rsa');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const pagina = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

function mostrar(res, texto, erro = false) {
  const html = texto ? `<div class="aviso ${erro ? 'erro' : 'ok'}">${texto.replace(/</g, '&lt;')}</div>` : '';
  res.status(erro ? 400 : 200).send(pagina.replace('<!--MSG-->', html));
}

function salvar(arquivo, conteudo) {
  fs.writeFileSync(path.join(process.cwd(), arquivo), conteudo + '\n');
}

// converte o texto digitado em BigInt, só aceita inteiros positivos
function inteiro(texto) {
  if (!/^\d+$/.test(String(texto).trim())) throw new Error('Digite apenas números inteiros positivos.');
  return BigInt(texto.trim());
}

app.get('/', (req, res) => mostrar(res, ''));

// 1 - Gerar chave pública
app.post('/chave', (req, res) => {
  try {
    const p = inteiro(req.body.p), q = inteiro(req.body.q), e = inteiro(req.body.e);
    const { n } = rsa.validarChave(p, q, e);
    salvar('chave_publica.txt', `${e} ${n}`);
    mostrar(res, `Chave pública: ${e} ${n} (salva em chave_publica.txt)`);
  } catch (err) {
    mostrar(res, err.message, true);
  }
});

// 2 - Criptografar
app.post('/criptografar', (req, res) => {
  try {
    const nums = (req.body.chave.match(/\d+/g) || []).map(BigInt);
    if (nums.length !== 2) throw new Error('A chave pública deve ter dois números, ex.: 7 77');
    const [e, n] = nums[0] < nums[1] ? nums : [nums[1], nums[0]]; // e é sempre menor que n
    if (!req.body.mensagem) throw new Error('Digite uma mensagem.');
    salvar('mensagem_criptografada.txt', rsa.criptografar(req.body.mensagem, e, n));
    mostrar(res, 'Mensagem salva em mensagem_criptografada.txt');
  } catch (err) {
    mostrar(res, err.message, true);
  }
});

// 3 - Descriptografar
app.post('/descriptografar', (req, res) => {
  try {
    const p = inteiro(req.body.p), q = inteiro(req.body.q), e = inteiro(req.body.e);
    const { n, phi } = rsa.validarChave(p, q, e);
    const numeros = (req.body.mensagem.match(/\d+/g) || []).map(BigInt);
    if (numeros.length === 0) throw new Error('Digite a mensagem criptografada.');
    const texto = rsa.descriptografar(numeros, rsa.inversoModular(e, phi), n);
    salvar('mensagem_descriptografada.txt', texto);
    mostrar(res, `Mensagem: ${texto} (salva em mensagem_descriptografada.txt)`);
  } catch (err) {
    mostrar(res, err.message, true);
  }
});

app.listen(3000, () => console.log('http://localhost:3000'));
