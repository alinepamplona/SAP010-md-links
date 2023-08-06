const fs = require ('fs')
const pathLib = require ('path')
const axios = require ('axios')
const { table } = require('table')

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

      arrFiles.push(...getFiles(filePath))
    }

    return arrFiles
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('Arquivo ou diretório não encontrado: '+path)
    } else {
      console.log(error.message);
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
  const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
  const matches = fileContent.matchAll(regex)

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
      console.log(table([[pathLib.basename(filePath), "Este arquivo não é .md"]]));
      resolve([])
    } else {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err)
        } else {
          const links = getLinks(filePath, data)
          if (options && options.validate) {
            validateLinks(links)
              .then((validatedLinks) => {
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

function mdLinks (path, options){
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