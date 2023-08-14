#!/usr/bin/env node
const { argv } = require('process')
const { mdLinks } = require('./mdLinks.js')
const { table } = require('table');
const chalk = require('chalk');

const path = argv[2];
// md-links './files' --stats --validate bla => argv = [ 'node', 'CLI.js', './files', '--stats', '--validate', 'bla' ]

function printStatsTable(total, unique, broken) {
  const data = [[chalk.green('Total'), chalk.green(total)], [chalk.blue('Unique'), chalk.blue(unique)]]
  if (broken) {
    data.push([chalk.red('Broken'), chalk.red(broken)])
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
      const text = chalk.magenta(link.text)
      const href = chalk.blue(link.href)
      const file = chalk.yellow(link.file)
      let status
      let code
      if (link.status === 'OK') {
        status = chalk.green(link.status)
        code = chalk.green(link.code)
      } else {
        status = chalk.red(link.status)
        code = chalk.red(link.code)
      }
      return [ text, href, file, code, status ]
    }))
  } else {
    data.push([ 'TEXT', 'HREF', 'FILE'])
    //Faz a mesma coisa que o de cima, mas sem o return, pq é uma função só de uma linha
    data.push(...links.map((link) => [chalk.magenta(link.text), chalk.blue(link.href), chalk.yellow(link.file)]))
  }
  console.log(table(data, tableConfig))
}

if (!path || argv.includes('help') || argv.includes('-h')) {
  console.log(chalk.yellow("Como usar: md-links <path-to-file> [--stats] [--validate]"))
} else {
  const validate = argv.includes('--validate')
  const stats = argv.includes('--stats')

  const options = {
    validate
  };

  mdLinks(path, options)
    .then((arrLinks) => {
      if (arrLinks.length === 0) {
        console.log(chalk.yellow('Nenhum link encontrado, verifique se existe um arquivo MarkDown no path solicitado'))
      } else if (stats) {
        const uniqueLinks = new Set(arrLinks.map((link) => link.href)) // [ 1, 2, 2 ] => [ 1, 2 ]
        if (options.validate) {
          const brokenLinks = arrLinks.filter((link) => link.status !== 'OK')
          printStatsTable(arrLinks.length, uniqueLinks.size, brokenLinks.length)
        } else {
          printStatsTable(arrLinks.length, uniqueLinks.size)
        }
      } else {
        printLinksTable(arrLinks, options.validate)
      }
    })
    .catch((error) => {
      console.log(chalk.red(error))
    })
}