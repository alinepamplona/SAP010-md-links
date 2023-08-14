const { mdLinks } = require('../src/mdLinks.js');
const pathLib = require ('path')

const testFolderPath = './files/test'
const testFilePath = './files/test/test.md'
const failTestFilePath = './files/test/sub/failtest.md'
const invalidPath = './files/test/invalid/'
// pegar o caminho absoluto dos arquivos que vão ser testados, para usar no expected results
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

  // Testa a leitura de arquivo
  it('Quando receber um path de um arquivo deve retornar um array de objetos contendo links, texto inserido '
    + 'e caminho absoluto do arquivo', () => {

    const expected = [
      {"file": absFilePath, "href": "https://www.laboratoria.la/br", "text": "Laboratoria"},
      {"file": absFilePath, "href": "https://www.freecodecamp.org/", "text": "FreeCodeCamp"},
      {"file": absFilePath, "href": "https://github.com/", "text": "GitHub"}
    ]
    
    return mdLinks(testFilePath, optionsValidateFalse).then((arrLinks) => {
      expect(arrLinks).toEqual(expected)
    })
  });

  // Testa a validação de links
  it('Quando receber um path de um arquivo e um valor booleano que deve retornar um array de objetos contendo links, texto inserido '
    + 'caminho absoluto do arquivo, status e mensagem', () => {

    const expected = [
      {"file": absFilePath, "href": "https://www.laboratoria.la/br", "status": "OK", "code": 200, "text": "Laboratoria"},
      {"file": absFilePath, "href": "https://www.freecodecamp.org/", "status": "OK", "code": 200, "text": "FreeCodeCamp"},
      {"file": absFilePath, "href": "https://github.com/", "status": "OK", "code": 200, "text": "GitHub"}
    ]
    
    return mdLinks(testFilePath, optionsValidateTrue).then((arrLinks) => {
      expect(arrLinks).toEqual(expected)
    })
  });

  // Testa a recursão, arquivos com extensão diferente de md e testa link que retorna FAIL
  it('Quando receber um path de uma pasta deve retornar um array de objetos contendo links, texto inserido '
    + 'caminho absoluto dos arquivos que estão dentro do diretório', () => {

    const expected = [
      {"file": absFailTestPath, "href": "https://githubb.com/", "status": "FAIL", "code": "ENOTFOUND", "text": "GitHubb"},
      {"file": absFailTestPath, "href": "https://github.com/asdhjgvasdasdas/", "status": "FAIL", "code": 404, "text": "GitHub Fail"},
      {"file": absFilePath, "href": "https://www.laboratoria.la/br", "status": "OK", "code": 200, "text": "Laboratoria"},
      {"file": absFilePath, "href": "https://www.freecodecamp.org/", "status": "OK", "code": 200, "text": "FreeCodeCamp"},
      {"file": absFilePath, "href": "https://github.com/", "status": "OK", "code": 200, "text": "GitHub"}
    ]

    return mdLinks(testFolderPath, optionsValidateTrue).then((arrLinks) => {
      expect(arrLinks).toEqual(expected)
    })

  });

  // Tambem testa o options vazio
  it('Quando receber um path que não existe, deve retornar um array vazio '
    + 'e mostrar uma mensagem no console.log', () => {
    const expected = []

    return mdLinks(invalidPath).then((arrLinks) => {
      expect(arrLinks).toEqual(expected)
    })
  });

});



