# Sirigannada for Android (Trusted Web Activity)

The Play Store app is a Trusted Web Activity (TWA): a thin Android shell that opens
`https://www.sirigannada.in` full-screen in the user's Chrome. There is no second codebase. Web
changes reach the app as soon as they deploy; a new app release is needed only when this folder
changes (name, icon, colours, target SDK, version).

Generated with [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) 1.25.0
(Apache-2.0). `twa-manifest.json` is the source of truth; everything else here is regenerated
from it. Roadmap A-02, GH issue #47.

| | |
|---|---|
| Package | `in.sirigannada.app` (permanent, never change it) |
| Host | `www.sirigannada.in` (canonical host; the apex does not validate) |
| Target / min SDK | 36 / 21 |
| Permissions | none; notification delegation is off |

## One-time setup

```bash
npm i -g @bubblewrap/cli
bubblewrap doctor   # lets Bubblewrap install JDK 17 and the Android SDK on first run
```

The **upload key** already exists (created 2026-09-23, `CN=Devaraj K`). `bubblewrap build` does not
create one; it expects `apps/android/android.keystore`. On a new machine, copy the backed-up
keystore there. Never commit it (`.gitignore` blocks it) and keep the password in a password manager.

If the key is ever lost, generate a new one with the JDK Bubblewrap installed, then ask Play
support to reset the upload key:

```bash
KT=~/.bubblewrap/jdk/jdk-17.0.11+9/Contents/Home/bin/keytool
$KT -genkeypair -v -keystore android.keystore -alias sirigannada -keyalg RSA -keysize 2048 -validity 10000
$KT -list -v -keystore android.keystore -alias sirigannada | grep SHA256
```

## Build

```bash
cd apps/android
bubblewrap build          # asks for the keystore passwords
```

Outputs `app-release-bundle.aab` (upload to Play) and `app-release-signed.apk` (sideload to test).

## Release an update

```bash
bubblewrap update         # re-reads twa-manifest.json, bumps appVersionCode
bubblewrap build
```

Commit the changed `twa-manifest.json` and generated files with the new version.

## Digital Asset Links

`public/.well-known/assetlinks.json` must list the SHA-256 of **both** the upload key (listed) and
the Play App Signing key (add it from Play Console → Test and release → App integrity). If a fingerprint is
missing, the installed app shows a browser URL bar. Check a live deploy with:

```bash
bubblewrap fingerprint list
curl -s https://www.sirigannada.in/.well-known/assetlinks.json
```

## Privacy

The site runs no analytics script and sets no cookies, so the Play Data safety form declares
**no data collected**, and `/privacy` says the same. If tracking is ever proposed, the form and
`/privacy` must change first.
