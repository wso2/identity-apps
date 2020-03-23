# WSO2 Identity Server - Internationalization (i18n) module for Identity apps.

This module contains the configs, helpers and translations required to make an identity app available in multiple languages.

## Install
Add following dependency in your package.json file.
`"@wso2is/i18n": "<VERSION>"`

## Usage

### Initialize the module.

```jsx
import { I18n } from "@wso2is/i18n";

I18n.init(options, override, true, true)
    .then(() => {
        // On successful init.
    })
    .catch((error) => {
        // On error.
    });

```

### Get the instance.

```jsx
import { I18n } from "@wso2is/i18n";

I18n.instance
```

## License

Licenses this source under the Apache License, Version 2.0 ([LICENSE](../../LICENSE)), You may not use this file except in compliance with the License.
