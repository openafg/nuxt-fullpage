const { resolve, join } = require('path')
const { readdirSync } = require('fs')

export default function(moduleOptions) {
  const options = {
    ...moduleOptions,
  }

  const pluginsToSync = [
    'plugin.js'
  ]
  
  for (const pathString of pluginsToSync) {
    this.addPlugin({
      src: resolve(__dirname, pathString),
      fileName: pathString,
      options
    })
  }

  const foldersToSync = ['components/lib']
  for (const pathString of foldersToSync) {
    const path = resolve(__dirname, pathString)
    for (const file of readdirSync(path)) {
      this.addTemplate({
        src: resolve(path, file),
        fileName: join(pathString, file),
        options
      })
    }
  }
}

module.exports.meta = require('../package.json')
