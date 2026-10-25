// Funções matemáticas do RSA (BigInt)

function mdc(a, b) {
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

function ehPrimo(n) {
  if (n < 2n) return false;
  for (let i = 2n; i * i <= n; i++) {
    if (n % i === 0n) return false;
  }
  return true;
}

// base^exp mod m
function potenciaModular(base, exp, m) {
  let r = 1n;
  base %= m;
  while (exp > 0n) {
    if (exp % 2n === 1n) r = (r * base) % m;
    base = (base * base) % m;
    exp /= 2n;
  }
  return r;
}

// inverso de e módulo phi (algoritmo de Euclides estendido)
function inversoModular(e, phi) {
  let [r0, r1] = [e, phi];
  let [s0, s1] = [1n, 0n];
  while (r1 !== 0n) {
    const q = r0 / r1;
    [r0, r1] = [r1, r0 - q * r1];
    [s0, s1] = [s1, s0 - q * s1];
  }
  return ((s0 % phi) + phi) % phi;
}

// Alfabeto: A=2 ... Z=27, espaço=28
const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ';

function validarChave(p, q, e) {
  if (!ehPrimo(p) || !ehPrimo(q)) throw new Error('p e q precisam ser primos.');
  if (p === q) throw new Error('p e q precisam ser diferentes.');
  const n = p * q;
  const phi = (p - 1n) * (q - 1n);
  if (n <= 28n) throw new Error('p × q precisa ser maior que 28.');
  if (e <= 1n || e >= phi) throw new Error('e precisa ser maior que 1 e menor que (p-1)(q-1).');
  if (mdc(e, phi) !== 1n) throw new Error('e precisa ser primo com (p-1)(q-1).');
  return { n, phi };
}

function criptografar(mensagem, e, n) {
  return [...mensagem.toUpperCase()].map((letra) => {
    const i = LETRAS.indexOf(letra);
    if (i === -1) throw new Error(`Caractere não permitido: "${letra}". Use só letras A-Z e espaço.`);
    return potenciaModular(BigInt(i + 2), e, n);
  }).join(' ');
}

function descriptografar(numeros, d, n) {
  return numeros.map((c) => {
    const i = Number(potenciaModular(c, d, n)) - 2;
    if (i < 0 || i > 26) throw new Error('Mensagem inválida ou chave incorreta.');
    return LETRAS[i];
  }).join('');
}

module.exports = { validarChave, inversoModular, criptografar, descriptografar };
