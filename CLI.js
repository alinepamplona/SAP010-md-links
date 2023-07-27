#!/usr/bin/env node
const { argv } = require('process')
const { mdLinks } = require('./mdLinks');

const path = argv[2];

if (!path || argv.includes('help') || argv.includes('-h')) {
  console.log("Usage: md-links <path-to-file> [--stats] [--validate]")
  return
}

const validate = argv.includes('--validate')
const stats = argv.includes('--stats')

const options = {
  validate,
  stats
};

mdLinks(path, options)
  .then((arrLinks) => {
    if (options.stats) {
      console.log("Links total: "+arrLinks.length)
      const uniqueLinks = new Set(arrLinks.map((link) => link.href))
      console.log("Links unique: "+uniqueLinks.size)
      if (options.validate) {
        const brokenLinks = arrLinks.filter((link) => link.message != 'OK')
        console.log("Links broken: "+brokenLinks.length)
      }
    } else {
      console.table(arrLinks)
    }
  })
  .catch((error) => {
    console.log(error)
  })