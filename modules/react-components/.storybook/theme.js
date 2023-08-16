/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { create } from "@storybook/theming";
import Manifest from "../package.json";
import DeploymentConfig from "../public/deployment.config.json";

/**
 * Get the moderated Theme from `deployment.config.json`.
 * @returns Theme.
 */
const getTheme = () => {
    const _theme = DeploymentConfig.theme;

    delete _theme.name;
    _theme.brandTitle = _theme.brandTitle.replace("${version}", Manifest.version);

    return _theme;
};

export const Theme = create(getTheme());
