const fs = require ('fs')
const pathLib = require ('path')

function getFiles(path){
  try {
    const files = fs.readdirSync(path)

    const arrFiles = []
    for (const file of files) {
      const filePath = pathLib.join(path, file)
      const fileStat = fs.statSync(filePath)

      if (fileStat.isDirectory()) {
        arrFiles.push(...getFiles(filePath))
      } else {
        arrFiles.push(filePath)
      }
    }

    return arrFiles
  } catch (error) {
    console.log(error.message);
  }

  return []
}

function getLinks(filePath, fileContent){
  const regex = /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
  const matches = fileContent.matchAll(regex)

  const links = []

  for(const match of matches) {
    const link = {
      href: match[2],
      text: match[1],
      file: filePath
    }

    links.push(link)
  }

  return links
}

function readFile(filePath) {
  return new Promise((resolve, reject) => {
    const ext = pathLib.extname(filePath)

    let links = []

    if (ext != '.md') {
      console.log("Este arquivo não é .md - "+pathLib.basename(filePath))
      resolve(links)
    } else {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err)
        } else {
          links = getLinks(filePath, data);
          resolve(links);
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
      readFile(file)
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

mdLinks('./files', '')
  .then((arrLinks) => {
    arrLinks.forEach(element => {
      console.table(element)
    });
  })
  .catch((error) => {
    console.log(error)
  })

module.exports = mdLinks;