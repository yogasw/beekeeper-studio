; Single entry point for electron-builder's `nsis.include` option.
; electron-builder only allows one include, so this file aggregates all
; Beekeeper Studio NSIS customizations.

!include "${__FILEDIR__}\msvc-redist.nsh"
!include "${__FILEDIR__}\protocol-handler.nsi"
