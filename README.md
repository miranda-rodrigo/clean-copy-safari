# Clean Copy — Safari prototype 0.1

A small, local-only extension. No server, AI API, subscription, analytics or link-shortening service.

## What you get
- Toolbar click copies a cleaned Markdown link by default.
- Selected text becomes a quotation with the source link, preserving its wording.
- Right-click actions: copy link, copy quotation, edit before copying, settings.
- Optional editor: title, destination, quotation and Markdown / rich text / plain text.
- Bible Online title cleanup: `Salmos 40 | ARA | Bíblia Online` → `Salmos 40 · ARA`.
- Conservative tracking removal. Meaningful parameters and fragments remain; recognized signed URLs are left untouched.
- Keyboard commands for copy and edit ship without default shortcuts; assign them under Safari → Settings → Extensions → Clean Copy.

## Install on your Mac
1. Unzip this folder. Install **full Xcode** from Apple, open it, and finish its initial setup. Command Line Tools alone are not sufficient.
2. In Terminal type `cd `, drag this extracted folder into the window, and press Return.
3. Run `bash build-safari.command`. This generates and opens Apple's Xcode companion app/extension project. Read any converter warnings before continuing.
4. In Xcode choose the macOS app scheme and **My Mac**, then Run (Command-R). If Xcode requests signing, configure your team under Signing & Capabilities for both targets. For unsigned local testing, Apple's running guide describes enabling **Allow Unsigned Extensions** in Safari's Develop menu; this testing setting may need re-enabling after restarting Safari.
5. Enable Clean Copy under Safari → Settings → Extensions. Allow the test site if Safari requests access. Pin/show the toolbar button if needed.
6. Open a regular HTTPS page and click Clean Copy; paste into a text editor. If Safari blocks the direct clipboard operation, the editor opens with a Copy button as a fallback.

This archive is source code, **not a signed, ready-to-install Mac app**. Xcode creates the tiny containing app Safari needs. Normal signed distribution is a separate Apple Developer packaging step; App Store publication is not part of this project.

## Test on Safari before relying on it
- Bible Online page → `Salmos 40 · ARA` title and correct destination.
- Select two paragraphs → quotation preserves wording and paragraph breaks.
- URL with `utm_source` plus `t=42#section` → only tracking removed.
- Right-click a link → copies that destination; if Safari supplies no link text, its URL is the title (editable).
- Try all three formats in Notes, a plain text editor and ChatGPT. Destination apps control how rich-text paste appears.
- Verify keyboard shortcuts, focus/selection restoration and clipboard success.
- Try denied site permission and a restricted Safari page: expect the editor/error, never a false success message.

## Verification and limits
Core automated tests cover title cleanup, URL preservation, signed URL handling, unsafe schemes, HTML escaping and quotation formatting. Run `node --test tests/core.test.cjs` with Node 18+.

Safari runtime, clipboard permissions, menus, keyboard shortcuts and Xcode compilation could not be tested in the Linux build environment. The UI is implemented but has not been visually tested in Safari. Treat this as a first working-source prototype pending the Mac smoke test above.

The extension requests active-tab access only, plus storage, context menus and clipboard write; it does not read the clipboard or request browsing history. Drafts are stored locally to transfer to the editor and deleted when the editor loads. An interrupted draft transfer can leave a local draft until extension data is removed. Settings remain local. No network requests are made by extension code. Protected pages and cross-origin iframe selections may not be accessible.

Title cleanup is deliberately limited to Bible Online; it does not guess which parts of arbitrary titles to delete. Actual shortened redirect URLs are not implemented.

## Files
`extension/`: browser extension source. `build-safari.command`: Apple project generator. `tests/`: Node core tests. Generated Xcode output goes in `build/`.

## Apple documentation
- https://developer.apple.com/documentation/safariservices/packaging-a-web-extension-for-safari
- https://developer.apple.com/documentation/safariservices/running-your-safari-web-extension
- https://developer.apple.com/documentation/safariservices/distributing-your-safari-web-extension
