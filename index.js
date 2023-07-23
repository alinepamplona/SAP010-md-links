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

function readFile (filePath){
  return new Promise((resolve, reject) => {
    const ext = pathLib.extname(filePath)

    if (ext !== '.md') {
      reject('Este arquivo não é md.')
    } else {
      fs.readFile(filePath,'utf8', function(err, data){
        if(err) {
          reject(err.message)
        } else {
          resolve(data)
        }
      });
    }
  })
}

function mdLinks (path, options){
  const absPath = pathLib.resolve(path)
  const arrFiles = getFiles(absPath)
  arrFiles.map((file)=>{
    readFile(file)
      .then((content)=>{
        console.log(file+' - '+content)
      })
      .catch((err)=>{
        console.log(file+' - '+err)
      })
  })
}

mdLinks('./files', '')

module.exports = mdLinks;