#!/usr/bin/env node
const { argv } = require('process')
const { mdLinks } = require('./mdLinks.js')
const { table } = require('table');

const path = argv[2];

function printStatsTable(total, unique, broken) {
  const data = [['Total', total], ['Unique', unique]]
  if (broken) {
    data.push(['Broken', broken])
  }
  const tableConfig = {
    header: {
      alignment: 'center',
      content: 'LINKS'
    }
  }
  console.log(table(data, tableConfig))
}

function printLinksTable(links, validate) {
  const data = []
  const tableConfig = {
    header: {
      alignment: 'center',
      content: 'LINKS'
    }
  }
  if (validate) {
    data.push([ 'TEXT', 'HREF', 'FILE', 'CODE', 'STATUS'])
    data.push(...links.map((link) => {
      return [ link.text, href, link.file, link.code, link.status ]
    }))
  } else {
    data.push([ 'TEXT', 'HREF', 'FILE'])
    //Faz a mesma coisa que o de cima, mas sem o return, pq é uma função só de uma linha
    data.push(...links.map((link) => [link.text, link.href, link.file]))
  }
  console.log(table(data, tableConfig))
}

if (!path || argv.includes('help') || argv.includes('-h')) {
  console.log("Usage: md-links <path-to-file> [--stats] [--validate]")
} else {
  const validate = argv.includes('--validate')
  const stats = argv.includes('--stats')

  const options = {
    validate,
    stats
  };

  mdLinks(path, options)
    .then((arrLinks) => {
      if (arrLinks.length > 0 && options.stats) {
        const uniqueLinks = new Set(arrLinks.map((link) => link.href))
        if (options.validate) {
          const brokenLinks = arrLinks.filter((link) => link.status !== 'OK')
          printStatsTable(arrLinks.length, uniqueLinks.size, brokenLinks.length)
        } else {
          printStatsTable(arrLinks.length, uniqueLinks.size)
        }
      } else if (arrLinks.length > 0) {
        printLinksTable(arrLinks, options.validate)
      } else {
        console.log('Nenhum link encontrado')
      }
    })
    .catch((error) => {
      console.log(error)
    })
}