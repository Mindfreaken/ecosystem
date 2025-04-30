/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  appId: 'com.your-company.your-app',
  productName: 'New Eco Project',
  copyright: 'Copyright © 2023',
  directories: {
    output: 'dist-electron',
    buildResources: 'build-resources',
  },
  files: [
    'dist/**/*',
    '!dist/**/*.map',
    '!**/*.{ts,map,ts.map}'
  ],
  extraMetadata: {
    main: "electron-main.cjs" 
  },
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64'],
      },
    ],
    icon: 'build-resources/icon.ico',
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
  },
};

module.exports = config; 