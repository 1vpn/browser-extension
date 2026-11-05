# 1VPN Browser Extension

The 1VPN browser extension changes your IP address by routing your browser's internet traffic through one of our secure servers. 1VPN can be used to bypass internet censorship, access region-restricted content, prevent ISPs and network administrators from knowing which websites you visit, and protect against IP address-based tracking.

## Downloads

Chrome Download: https://chromewebstore.google.com/detail/akcocjjpkmlniicdeemdceeajlmoabhg

Edge Download: https://microsoftedge.microsoft.com/addons/detail/dalhgafbhpdolibignjckpmiejgfddjp

Firefox Download: https://addons.mozilla.org/en-US/firefox/addon/1vpn

## Manual Installation (ZIP)

### Chrome / Edge

1. Download the zip for your browser from the [releases page](https://github.com/1vpn/browser_extension/releases).
2. Unzip it.
3. Go to `chrome://extensions` (or `edge://extensions`).
4. Enable **Developer mode** (toggle in the top right).
5. Click **Load unpacked** and select the unzipped folder.

### Firefox

1. Download the Firefox zip from the [releases page](https://github.com/1vpn/browser_extension/releases).
2. Unzip it.
3. Go to `about:debugging#/runtime/this-firefox`.
4. Click **Load Temporary Add-on**.
5. Select any file inside the unzipped folder.

## Local Build

Build extension:

```bash
yarn build-chrome    # Build Chrome extension
yarn build-edge     # Build Edge extension
yarn build-firefox   # Build Firefox extension
```

Start development server:

```bash
yarn start-chrome   # Start Chrome development server
yarn start-edge    # Start Edge development server
yarn start-firefox  # Start Firefox development server
```

Other commands:

```bash
yarn prettier      # Format code with Prettier
yarn test         # Run Playwright tests
```
