# Markdown Links

## Índice

* [1. Prefácio](#1-prefácio)
* [2. Sobre o projeto](#2-sobre-o-projeto)
* [3. Documentação e Guia de uso da API](#3-documentacao-e-guia-de-uso-da-API)
* [4. Documentação e Guia de uso da CLI](#4-documentacao-e-guia-de-uso-da-CLI)
* [5. Considerações técnicas](#5-consideracoes-tecnicas)
* [6. Fluxograma](#6-fluxograma)
* [7. Desenvolvedora](#7-desenvolvedora)

***

## 1. Prefácio

O md-links foi o 4º projeto proposto pelo Bootcamp Laboratória que nos desafiou a usar [Node.js](https://nodejs.org/) para desenvolver
uma ferramenta de linha de comando (CLI) assim como uma biblioteca própria  em Javascript.


## 2. Sobre o projeto

O projeto md-links foi desenvolvido em formato [Markdown](https://pt.wikipedia.org/wiki/Markdown) que é uma linguagem de marcação
muito popular entre os programadores. É usada em muitas plataformas que manipulam texto e é muito comum encontrar arquivos com este formato em qualquer repositório.

Os arquivos Markdown normalmente contém links que podem estar quebrados, ou que já não são válidos, prejudicando muito o valor da informação que está ali.
Neste projeto, através da CLI os links são encontrados, indicando a rota do arquivo onde foi encontrado o link, a URL encontrada e o texto que aparece
dentro de um link. Também pode validar os links e fornecer estatísticas sobre os mesmos.

### Funcionalidades

As funcionalidades atualmente disponíveis são:

* **Listagem de links:** exibe os links encontrados nos arquivos Markdown, mostrando a rota do arquivo onde foi encontrado o link, a URL encontrada e o texto que aparece dentro do link.

* **Validação de links:** verifica se os links encontrados nos arquivos Markdown estão funcionando corretamente, retornando o código de status HTTP da URL correspondente. Também são exibidas mensagens sobre a validação, fail em caso de falha ou ok em caso de sucesso.

* **Estatísticas de links:** exibe o número total de links encontrados, total de links únicos e o número de links que estão funcionando corretamente.


## 3. Documentação e Guia de uso da API

### Visão geral

A API mdLinks é uma biblioteca para ler e analisar arquivos Markdown (.md) em um diretório especificado, extrair os links contidos nesses arquivos e, opcionalmente, validar a disponibilidade de cada link. Essa biblioteca utiliza algumas dependências, como fs, path, axios, chalk e table, para fornecer esses recursos.

### Instalação

Para utilizar a API mdLinks em seu projeto, é necessário instalar o pacote através do npm. Abra o terminal e execute o seguinte comando:

	```npm install alinepamplona/SAP010-md-links```

A API mdLinks fornece a função mdLinks(path, options), que pode ser utilizada para analisar os arquivos Markdown e obter os links contidos neles. Veja como utilizar a função:

	```js
import { mdLinks } from "alinepamplona-md-links"
	
// Exemplo de uso
mdLinks('caminho/do/diretorio', { validate : true } /*opcional*/)
  .then((links) => {
    console.log(links);
  })
  .catch((error) => {
    console.error(error);
  });
	```
A função mdLinks recebe dois argumentos:

* **path** (string, obrigatório): Caminho absoluto ou relativo do diretório ou arquivo Markdown a ser analisado.

* **options** (object, opcional): Opções adicionais para a função. Atualmente, a única opção disponível é validate, que é um valor booleano indicando se os links devem ser validados ou não. Por padrão, essa opção é false. Se definida como true, a API tentará validar cada link verificando se está acessível.

### Retorno da Função

A função mdLinks retorna uma Promise que, quando resolvida, fornece uma lista de objetos representando os links encontrados nos arquivos Markdown. Cada objeto contém as seguintes propriedades:

* **text** (string): O texto âncora do link.
* **href** (string): A URL do link.
* **file** (string): O caminho absoluto do arquivo onde o link foi encontrado.
* **code** (number ou string, opcional): O código de status HTTP da resposta ao tentar acessar o link. Disponível apenas se a opção validate for definida como true. Se o link foi validado, essa propriedade conterá o código numérico (ex.: 200 para sucesso, 404 para não encontrado, etc.). Caso ocorra algum erro na validação, essa propriedade conterá uma string descrevendo o erro.
* **status** (string, opcional): O status da resposta ao tentar acessar o link. Disponível apenas se a opção validate for definida como true. Pode ser 'OK' ou 'FAIL'.

## 4. Documentação e Guia de uso da CLI

O CLI (Command Line Interface) da API mdLinks é uma interface de linha de comando que permite utilizar a funcionalidade de extração e validação de links presentes em arquivos Markdown. Através do CLI, é possível exibir os links encontrados, obter estatísticas sobre eles e validar a disponibilidade dos links online.

Instalação:

O CLI faz parte da biblioteca alinepamplona-md-links, portanto, para utilizá-lo, é necessário ter a biblioteca instalada globalmente. Caso ainda não tenha instalado a biblioteca, abra o terminal e execute o seguinte comando:

```npm install -g alinepamplona/SAP010-md-links```

Comandos disponíveis:

O CLI aceita os seguintes comandos e opções:

```md-links <path-to-file> [--stats] [--validate]```

**<path-to-file>** (obrigatório): Caminho absoluto ou relativo para o diretório ou arquivo Markdown que você deseja analisar.

**--stats** (opcional): Ao incluir essa opção, o CLI exibirá estatísticas sobre os links encontrados, mostrando o número total de links e o número de links únicos. Se a opção --validate também for incluída, será exibido o número de links quebrados (com respostas de status diferentes de 'OK').

**--validate** (opcional): Ao incluir essa opção, o CLI fará uma validação dos links encontrados, verificando se estão acessíveis online. Esta opção pode aumentar o tempo de execução, pois envolve realizar requisições HTTP para cada link encontrado.

Exemplo de uso:

```md-links caminho/do/diretorio --validate --stats```

### Interface do usuário

[IMAGENS DA UTILIZAÇÃO DO CLI]

### Mensagem de erro

* ENOENT (Erro de não encontrado): O arquivo ou diretório especificado não foi encontrado.
* Erros de leitura de arquivos.
* Erros de validação de links.

[IMAGENS DOS ERROS NO CLI]

## 5. Considerações técnicas

A implementação do md-links utiliza diversas bibliotecas e segue boas práticas de desenvolvimento para garantir eficiência, legibilidade e consistência no código.

A biblioteca segue a modularização em CommonJs Modules, utilizando módulos require/module.exports. Além disso, foram realizadas as configurações necessárias no arquivo package.json para gerenciamento de dependências, bem como nos arquivos .eslintrc e .editorconfig para garantir a consistência do código.

### Bibliotecas Utilizadas

* **[path](https://www.npmjs.com/package/path):**: Manipula caminhos de diretórios e arquivos.
* **[fs](https://www.npmjs.com/package/file-system#fs):** Manipula a leitura e escrita de arquivos.
* **[axios](https://www.npmjs.com/package/axios):** Realiza requisições HTTP para validar a disponibilidade dos links.
* **[chalk](https://www.npmjs.com/package/chalk):** Adiciona cores e estilos ao texto exibido no terminal.
* **[table](https://www.npmjs.com/package/table?activeTab=readme):** Formata um array de dados para criar tabelas de texto organizadas.

## 6. Fluxograma


## 7. Desenvolvedora

### Aline Pamplona

[![Linkedin Badge](https://img.shields.io/badge/-LinkedIn-blue?style=flat-square&logo=Linkedin&logoColor=white&link)](https://www.linkedin.com/in/alinebpamplona/)