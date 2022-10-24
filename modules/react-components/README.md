# WSO2 Identity Server - React Component Library

A React component library for WSO2 Identity Server frontend apps implementing Semantic UI Framework.

![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg)

## Install

Add following dependency in your package.json file.
`"@wso2is/react-components": "<VERSION>"`

## Run Storybook

Execute the following command from the project root directory to run the Storybook dev server.

```bash

pnpm nx run react-components:storybook

```

Once the dev server is fired up, it'll automatically open up a new tab. If not, navigate to [http://localhost:6006](http://localhost:6006) manually in your browser.

## Usage

Import the relevant component.

```jsx
import { UserAvatar } from "@wso2is/react-components";
```

Use the component along with your other react components.

```jsx
<UserAvatar
    spaced="right"
    size="tiny"
    image="https://avatars3.githubusercontent.com/u/25959096?s=460&v=4"
/>
```

## License

Licenses this source under the Apache License, Version 2.0 ([LICENSE](../../LICENSE)), You may not use this file except in compliance with the License.
