const path = require('path')
const fs = require('fs')

/**
 * Auto-generates NSIS protocol handler registration script before build
 * 
 * Ensures Windows installer has up-to-date database URL scheme handlers
 * by reading from the 'protocols' array defined below.
 * 
 * Generated file: apps/studio/build/win/protocol-handler.nsi
 */
const generateNsisProtocols = () => {
  try {
    const generateScript = path.join(__dirname, 'build/win/generate-nsis-protocols.js')
    if (fs.existsSync(generateScript)) {
      require(generateScript)
    }
  } catch (e) {
    console.warn('⚠️ Failed to generate NSIS protocols:', e.message)
  }
}

// Run generator before exporting config
generateNsisProtocols()


// Existing content

// Update regarding nsis section
module.exports = {
  // other configurations
  nsis: {
    include: ['./build/win/msvc-redist.nsh', './build/win/protocol-handler.nsi'],
    // other nsis settings
  },
  // more configurations
};