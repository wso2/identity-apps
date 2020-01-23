/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { addParameters, addDecorator } from "@storybook/react";
import "../stories/styles.css";
import { DocsContainer, DocsPage } from "@storybook/addon-docs/blocks";
import centered from "@storybook/addon-centered/react";

// Custom center decorator that supports docs extensions
addDecorator((...args) => {
    const params = (new URL(document.location)).searchParams;
    const isInDockView = params.get("viewMode") === "docs";

    if (isInDockView) {
        return args[0]();
    }

    return centered(...args);
});

// Params
addParameters({
    options: {
        showRoots: true
    },
    docs: {
        container: DocsContainer,
        page: DocsPage,
    }
});
