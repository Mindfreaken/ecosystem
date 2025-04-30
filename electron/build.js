#!/usr/bin/env node

const { execSync } = require('child_process')
const { join } = require('path')
const fs = require('fs')

// Ensure output directory exists
const distElectronDir = join(__dirname, '../dist/electron')
if (!fs.existsSync(distElectronDir)) {
  fs.mkdirSync(distElectronDir, { recursive: true })
}

// Compile TypeScript files
console.log('🔄 Compiling Electron TypeScript files...')
try {
  execSync('tsc -p electron/tsconfig.json', { stdio: 'inherit' })
  console.log('✅ TypeScript compilation completed')
} catch (error) {
  console.error('❌ TypeScript compilation failed:', error.message)
  process.exit(1)
}

// Copy package.json
console.log('📝 Copying package.json to dist...')
const packageJson = require('../package.json')

// Ensure we're setting the correct entry point and type
packageJson.type = 'commonjs'
packageJson.main = 'electron/main/index.js'

// Remove development dependencies
delete packageJson.devDependencies

// Save the modified package.json to the dist directory
fs.writeFileSync(
  join(distElectronDir, '../package.json'),
  JSON.stringify(packageJson, null, 2)
)
console.log('✅ package.json copied and modified')

console.log('🚀 Electron build completed!') 