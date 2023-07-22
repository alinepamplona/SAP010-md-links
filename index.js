const fs = require ('fs')
const path = require ('path')

function getFiles(path){
  const arrFiles = ['./files/test.txt', './files/test.md']
  return arrFiles
}

function readFile (filePath){
  return new Promise((resolve, reject) => {
    const ext = path.extname(filePath)

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
  const arrFiles = getFiles(path)
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

mdLinks('', '')

module.exports = mdLinks;