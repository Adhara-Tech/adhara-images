# Changelog

## 0.2.0-rc4 - 2022-04-12

### Fixed
- Fixed double slash URLs when PROVIDER_URL ends with a trailing slash

## 0.2.0-rc3 - 2022-04-12

### Added
- Added a new environment variable called `USERS_WILDCARD_PASSWORD` to accept any login email as long as the password is correct. If `USERS_CONFIG_FILE` environment variable is present the file-based users credentials take precedence over the wildcard password method.

## 0.2.0-rc2

### Fixed
- Regression bug caused by unbound context calling class function

## 0.2.0-rc1

### Enhancements
- minor refactor for code organisation

### Fixed
- Fixed issues with login screen: use absolute URLs in forms


## 0.1.4, 0.1.4-rc1

### Fixed

- Fixed bugs introduced in 0.1.2->0.1.3: broken login page (`contextPath is not defined` error)

## 0.1.3

### Fixed

- Fix missing path from **PROVIDER_URL** in login form action

## 0.1.2

### Added

- Allow URLs with paths in **PROVIDER_URL** environment variable (example: `PROVIDER_URL=https://example.com/oidc`)

## 0.1.1

### Fixed

- fix issue with http redirections

## 0.1.0

### Added

- Use template values in clients and users configuration files

