# Enigma 28 - Criptografia RSA

Projeto Final de Matemática Discreta - Universidade Federal de Alagoas, Instituto de Computação (prof. Lucas Amorim).

O **Enigma 28** é uma aplicação web em Node.js que implementa o algoritmo de criptografia RSA. Com ela é possível gerar uma chave pública, criptografar uma mensagem de texto e descriptografá-la, tudo a partir de uma interface com três opções. Os cálculos usam `BigInt`, então funcionam com números grandes sem perda de precisão.

## Como funciona

O texto é convertido em números usando o alfabeto do projeto: **A = 2, B = 3, ..., Z = 27 e espaço = 28**. Cada número é criptografado com a chave pública (e, n) e descriptografado com a chave privada d.

1. **Gerar chave pública:** o usuário informa dois primos `p` e `q` e um expoente `e` coprimo com (p − 1)(q − 1). O programa calcula `n = p · q` e salva a chave pública em `chave_publica.txt` (formato `e n`).
2. **Criptografar:** o usuário digita a mensagem (letras A–Z e espaços) e a chave pública recebida. Cada letra é criptografada como `c = m^e mod n`, e o resultado é salvo em `mensagem_criptografada.txt`.
3. **Descriptografar:** o usuário informa `p`, `q` e `e` e a mensagem criptografada. O programa calcula `d` (inverso de `e` módulo (p − 1)(q − 1)) e recupera cada letra com `m = c^d mod n`. O resultado é salvo em `mensagem_descriptografada.txt`.

Também é possível carregar os arquivos `.txt` recebidos de outra equipe direto na tela, sem precisar copiar e colar.

## Conceitos matemáticos usados

- Números primos e teste de primalidade
- Máximo divisor comum (MDC) e números coprimos
- Função totiente de Euler: φ(n) = (p − 1)(q − 1)
- Algoritmo de Euclides estendido (cálculo do inverso modular)
- Exponenciação modular rápida

## Como rodar

```
npm install
npm start
```

Depois, abra http://localhost:3000.

## Estrutura

- `rsa.js`: funções matemáticas do RSA (MDC, primalidade, potência modular, inverso modular, alfabeto)
- `app.js`: servidor e as três opções do programa
- `index.html` e `public/style.css`: interface (tema roxo)

## Equipe

- Ana Gabriely Oliveira dos Santos
