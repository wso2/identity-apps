/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import { Theme } from "./theme";
import { MediaContextProvider } from "../src/components";

export const parameters = {
    docs: {
        theme: Theme
    }
};

/**
 * Wrapper for all the required providers.
 *
 * @param Story - Story component.
 * @param context - Story context.
 * @returns Stroy wrapped in providers.
 */
const withProviders = (Story, context) => {
    return (
        <MediaContextProvider>
            <Story { ...context } />
        </MediaContextProvider>
    );
};

export const decorators = [ withProviders ];
