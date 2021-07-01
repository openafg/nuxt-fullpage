const { resolve, join } = require('path')
const { readdirSync } = require('fs')

export default function(moduleOptions) {
  // get all options for the module
  const options = {
    ...moduleOptions,
  }

  // add all of the initial plugins
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

  // sync all of the files and folders to revelant places in the nuxt build dir (.nuxt/)
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
