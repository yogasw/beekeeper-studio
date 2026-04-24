/**
 * Generates the NSIS protocol handler registration script.
 *
 * Reads database protocols from electron-builder-config.js and emits a NSIS
 * installer section that registers the URL schemes in the Windows registry.
 *
 * Wired as the `beforePack` hook in electron-builder-config.js so the file is
 * always regenerated before the Windows installer is built.
 * Generated output: apps/studio/build/win/protocol-handler.nsi
 */

const fs = require('fs')
const path = require('path')

module.exports = async function (context) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const electronBuilderConfig = require('../../electron-builder-config.js')
  const schemes = electronBuilderConfig.protocols.flatMap(p => p.schemes)

  const header = `; Auto-generated NSIS protocol handler registration
; WARNING: DO NOT EDIT - Regenerated automatically by the electron-builder
; \`beforePack\` hook from apps/studio/build/win/generate-nsis-protocols.js.
;
; Source protocols from: apps/studio/electron-builder-config.js (protocols array)
;
; To add/remove database URL schemes, edit the 'protocols' array in
; apps/studio/electron-builder-config.js - this file regenerates on build.
;
; Registered protocols (${schemes.length} total): ${schemes.join(', ')}

`

  let installSection = `!macro customInstall\n`
  schemes.forEach(scheme => {
    const displayName = scheme.charAt(0).toUpperCase() + scheme.slice(1)
    installSection += `  WriteRegStr SHCTX "Software\\Classes\\${scheme}" "" "URL:${displayName} Connection"\n`
    installSection += `  WriteRegStr SHCTX "Software\\Classes\\${scheme}" "URL Protocol" ""\n`
    installSection += `  WriteRegStr SHCTX "Software\\Classes\\${scheme}\\shell\\open\\command" "" '"$INSTDIR\\Beekeeper Studio.exe" "%1"'\n`
    installSection += `\n`
  })
  installSection += `!macroend\n`

  let uninstallSection = `!macro customUnInstall\n`
  schemes.forEach(scheme => {
    uninstallSection += `  ReadRegStr $0 SHCTX "Software\\Classes\\${scheme}\\shell\\open\\command" ""\n`
    uninstallSection += `  \${If} $0 == '"$INSTDIR\\Beekeeper Studio.exe" "%1"'\n`
    uninstallSection += `    DeleteRegKey SHCTX "Software\\Classes\\${scheme}"\n`
    uninstallSection += `  \${EndIf}\n`
  })
  uninstallSection += `!macroend\n`

  const nsisCode = header + installSection + uninstallSection
  const outputPath = path.join(__dirname, 'protocol-handler.nsi')
  fs.writeFileSync(outputPath, nsisCode)
  console.log(`[generate-nsis-protocols] wrote ${outputPath} (${schemes.length} schemes)`)
}
