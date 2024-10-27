# Lectorium


## Development

### Certificate

1. Add the following line into `/ets/hosts/` file: ```127.0.0.1       lectorium.dev```
2. Add `modules/services/gateway/keys/cert.crt` to the keychain and set it to `Always Trust`:

#### macOS:

1. Double-click the .crt file to open it in Keychain Access.
2. Under the "System" keychain, locate your certificate, right-click, and select Get Info.
3. Expand the Trust section, set "When using this certificate" to Always Trust.

#### Windows:

1. Right-click on the .crt file and choose "Install Certificate."
2. Choose "Place all certificates in the following store" and select Trusted Root Certification Authorities.
