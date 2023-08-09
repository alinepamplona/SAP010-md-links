const fs = require ('fs')
const pathLib = require ('path')
const axios = require ('axios')
const chalk = require('chalk');

function getFiles(path){
  try {
    const stat = fs.statSync(path)
    if (!stat.isDirectory()) {
      return [ path ]
    }

    const files = fs.readdirSync(path)

    const arrFiles = []
    for (const file of files) {
      const filePath = pathLib.join(path, file)

      // o array de arquivos é a concatenação dos arrays do subdiretorio
      arrFiles.push(...getFiles(filePath))
      // flat(): 1=[ 2=[1, 2], 3=[3, 4] ] => 1=[ 1, 2, 3, 4 ]
      // push(...): 1=[1, 2] 2=[3, 4] => 1=[ 1, 2, 3, 4 ] 2=[3, 4]
    }

    return arrFiles
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(chalk.red('Arquivo ou diretório não encontrado: '+path))
    } else {
      console.log(chalk.red(error.message));
    }
  }

  return []
}

function validateLinks(links){
  return Promise.all(links.map((link) =>
    axios.get(link.href)
      .then((response) => {
        link.code = response.status
        link.status = response.statusText
        return link
      })
      .catch((error) => {
        if (error.response) {
          link.code = error.response.status
        } else {
          link.code = error.code
        }
        link.status = 'FAIL'
        return link
      })
  ))
}

function getLinks(filePath, fileContent){
  const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm; // [text](href)
  const matches = fileContent.matchAll(regex) // => macthes=[ match=[ ..., text, href, ... ] , ... , match=[ .., text, href, ... ] ]

  const links = []

  for(const match of matches) {
    const link = {
      text: match[1],
      href: match[2],
      file: filePath
    }
    links.push(link)
  }

  return links
}

function readFile(filePath, options) {
  return new Promise((resolve, reject) => {
    const ext = pathLib.extname(filePath)
    if (ext !== '.md') {
      //console.log(table([[chalk.yellow(pathLib.basename(filePath)), chalk.yellow("Este arquivo não é .md")]]));
      resolve([])
    } else {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err)
        } else {
          const links = getLinks(filePath, data) // [] => { text, href, file }
          if (options && options.validate) {
            validateLinks(links)
              .then((validatedLinks) => { // [] => { text, href, file, code, status }
                resolve(validatedLinks)
              })
              .catch((error) => {
                reject(error)
              })
          } else {
            resolve(links)
          }
        }
      })
    }
  })
}

// mdLinks('./files', { validate: true })
function mdLinks (path, options){ // { validate: boolean }
  return new Promise((resolve, reject) => {
    const absPath = pathLib.resolve(path)
    const arrFiles = getFiles(absPath)

    const promises = arrFiles.map((file) =>
      readFile(file, options)
    )

    Promise.all(promises)
      .then((results) => {
        resolve(results.flat())
      })
      .catch((err)=>{
        reject(err)
      })
  })
}

module.exports = {
  mdLinks
};