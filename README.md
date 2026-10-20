# SideBarTemplate

A reusable Electron desktop UI template with a black-on-black shell, tabs, a collapsible sidebar, and appearance settings. Start here when building a new desktop app and add your own content to the empty stage.

## Run locally

Install Node.js and npm, then clone this repository or download and extract its ZIP. Open a terminal in the project folder and run:

```sh
npm ci
npm start
```

No API keys or environment variables are required. The current desktop version has been launched on macOS; Windows and Linux builds have not been verified.

## Included

- Native desktop window with a draggable title bar and resize support
- New and close tab controls
- Collapsible sidebar with a search input ready for your app to wire up
- Settings tab with Minimal, Blackout, Graphite, Midnight, and Paper themes
- Accent color, font, type size, sidebar width, rail width, top bar height, and corner radius controls
- Locally persisted tabs, sidebar state, and appearance preferences
- Shared inline SVG icons

## Shortcuts

| Shortcut | Action |
| --- | --- |
| Cmd/Ctrl + T | New tab |
| Cmd/Ctrl + W | Close active tab |
| Cmd/Ctrl + B | Toggle sidebar |
| Cmd/Ctrl + , | Open settings |

## Project structure

```text
src/main/main.js       Electron window and IPC handlers
src/main/preload.js    Renderer bridge
src/renderer/          HTML, CSS, icons, and interface behavior
```

Add your app content inside `#stage` in `src/renderer/index.html`. Update the app name, app ID, and package metadata in `package.json` when reusing the template.

## Build an app

```sh
npm run package  # Create an unpacked app for the current platform
npm run dist     # Create distributable packages
```

Build output is written to `dist/`. Signing and notarization credentials are not configured in this template.

## Sharing

Download the source with **Code → Download ZIP**, or clone the repository. Dependencies and build output are excluded; `npm ci` restores dependencies from the lockfile.

Appearance and tab preferences are stored in Electron's local app profile and are not included in this repository. The Inter font is requested from Google Fonts; system fonts provide a fallback when offline.
