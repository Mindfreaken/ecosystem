#!/usr/bin/env node

const { execSync } = require('child_process')
const { join } = require('path')
const fs = require('fs')

// Ensure output directory exists
const distElectronDir = join(__dirname, '../dist/electron')
if (!fs.existsSync(distElectronDir)) {
  fs.mkdirSync(distElectronDir, { recursive: true })
}

// Copy the main and preload files directly
console.log('📝 Copying Electron files to dist...')
const electronMainDir = join(distElectronDir, 'main')
const electronPreloadDir = join(distElectronDir, 'preload')

if (!fs.existsSync(electronMainDir)) {
  fs.mkdirSync(electronMainDir, { recursive: true })
}

if (!fs.existsSync(electronPreloadDir)) {
  fs.mkdirSync(electronPreloadDir, { recursive: true })
}

// Copy main process file
fs.copyFileSync(
  join(__dirname, 'main/index.cjs'),
  join(electronMainDir, 'index.js')
)

// Copy preload script
fs.copyFileSync(
  join(__dirname, 'preload/index.cjs'),
  join(electronPreloadDir, 'index.js')
)

console.log('✅ Electron files copied to dist')

// Copy package.json for electron builder
console.log('📝 Preparing package.json for distribution...')
const packageJson = require('../package.json')

// For the built app, we need to adjust the package.json
const distPackageJson = {
  ...packageJson,
  main: 'electron/main/index.js',
  type: 'commonjs' // This is the key change - built app uses CommonJS
}

// Remove dev dependencies for distribution
delete distPackageJson.devDependencies

// Save the modified package.json to the dist directory
fs.writeFileSync(
  join(__dirname, '../dist/package.json'),
  JSON.stringify(distPackageJson, null, 2)
)
console.log('✅ package.json prepared for distribution')

// Copy the electron entry point
console.log('📝 Copying Electron entry point...')
fs.copyFileSync(
  join(__dirname, '../electron-main.cjs'),
  join(__dirname, '../dist/electron-main.cjs')
)
console.log('✅ Electron entry point copied')

console.log('🚀 Electron build completed!') 