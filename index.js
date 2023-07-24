const fs = require ('fs')
const pathLib = require ('path')

function getFiles(path){
  const arrFiles = []
  try {
    const files = fs.readdirSync(path)

    for (const file of files) {
      const filePath = pathLib.join(path, file)
      const fileStat = fs.statSync(filePath)

      if (fileStat.isDirectory()) {
        arrFiles.push(...getFiles(filePath))
      } else {
        arrFiles.push(filePath)
      }
    }
  } catch (error) {
    console.log(error.message);
    return []
  }

  return arrFiles
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

function readFile (filePath){
  let arrLinks = []
  try {
    const ext = pathLib.extname(filePath)
    if (ext !== '.md') {
      console.log("Este arquivo não é .md - "+pathLib.basename(filePath));
    } else {
      const fileContent = fs.readFileSync(filePath,'utf8')
      arrLinks = getLinks(filePath, fileContent)
    }
  } catch(error) {
    console.log("catch "+error.message);
    return []
  }

  return arrLinks
}

function mdLinks (path, options){
  return new Promise((resolve, reject) => {
    const absPath = pathLib.resolve(path)
    const arrFiles = getFiles(absPath)

    const arrLinks = []
    for (const file of arrFiles) {
      arrLinks.push(...readFile(file))
    }
    resolve(arrLinks)
  })
}

mdLinks('./files', '')
  .then((arrLinks) => {
    console.log(arrLinks)
  })

module.exports = mdLinks;