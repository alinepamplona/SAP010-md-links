const { mdLinks } = require('../mdLinks.js');
const fs = require ('fs')
const pathLib = require ('path')
const axios = require ('axios')

const testFolderPath = './files/test'
const testFilePath = './files/test/test.md'
const failTestFilePath = './files/test/failtest.md'
const invalidPath = './files/test/invalid/'
const absFailTestPath = pathLib.resolve(failTestFilePath)
const absFilePath = pathLib.resolve(testFilePath)
const optionsValidateFalse = {
  validate: false
}
const optionsValidateTrue = {
  validate: true
}

jest.setTimeout(10000)

describe('Testando a função mdLinks', () => {

  it('Quando receber um path de um arquivo deve retornar um array de objetos contendo links, texto inserido '
    + 'e caminho absoluto do arquivo', () => {

    const expected = [
      {"file": absFilePath, "href": "https://www.laboratoria.la/br", "text": "Laboratória"},
      {"file": absFilePath, "href": "https://www.freecodecamp.org/", "text": "Free Code Camp"},
      {"file": absFilePath, "href": "https://github.com/", "text": "GitHub"}
    ]
    
    return mdLinks(testFilePath, optionsValidateFalse).then((arrLinks) => {
      expect(arrLinks).toEqual(expected)
    })
  });

  it('Quando receber um path de um arquivo e um valor booleano que deve retornar um array de objetos contendo links, texto inserido '
    + 'caminho absoluto do arquivo, status e mensagem', () => {

    const expected = [
      {"file": absFilePath, "href": "https://www.laboratoria.la/br", "message": "OK", "status": 200, "text": "Laboratória"},
      {"file": absFilePath, "href": "https://www.freecodecamp.org/", "message": "OK", "status": 200, "text": "Free Code Camp"},
      {"file": absFilePath, "href": "https://github.com/", "message": "OK", "status": 200, "text": "GitHub"}
    ]
    
    return mdLinks(testFilePath, optionsValidateTrue).then((arrLinks) => {
      expect(arrLinks).toEqual(expected)
    })
  });

  it('Quando receber um path de uma pasta deve retornar um array de objetos contendo links, texto inserido '
    + 'caminho absoluto dos arquivos que estão dentro do diretório', () => {

    const expected = [
      {"file": absFailTestPath, "href": "https://githubb.com/", "message": "FAIL", "status": "ENOTFOUND", "text": "GitHubb"},
      {"file": absFailTestPath, "href": "https://github.com/asdhjgvasdasdas/", "message": "FAIL", "status": 404, "text": "GitHub Fail"},
      {"file": absFilePath, "href": "https://www.laboratoria.la/br", "message": "OK", "status": 200, "text": "Laboratória"},
      {"file": absFilePath, "href": "https://www.freecodecamp.org/", "message": "OK", "status": 200, "text": "Free Code Camp"},
      {"file": absFilePath, "href": "https://github.com/", "message": "OK", "status": 200, "text": "GitHub"}
    ]

    return mdLinks(testFolderPath, optionsValidateTrue).then((arrLinks) => {
      expect(arrLinks).toEqual(expected)
    })

  });

  it('Quando receber um path que não existe, deve retornar um array vazio'
    + 'e mostrar uma mensagem no console.log', () => {
    const expected = []

    return mdLinks(invalidPath).then((arrLinks) => {
      expect(arrLinks).toEqual(expected)
    })
  });

});



