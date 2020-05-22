/*
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

import { select, text, withKnobs } from "@storybook/addon-knobs";
import { Logo as LogoImage } from "@wso2is/theme";
import * as React from "react";
import { meta } from "./brand.stories.meta";
import { Logo, ProductBrand } from "../../../src";

export default {
    decorators: [ withKnobs ],
    parameters: {
        component: ProductBrand,
        componentSubtitle: meta.description
    },
    title: "Components API/Components/Product Brand"
};

/**
 * Story to display the default product brand.
 *
 * @return {React.ReactElement}
 */
export const DefaultProductBrand = (): React.ReactElement => (
    <ProductBrand
        name={ text("Product title", "Developer Portal") }
        logo={
            <Logo image={ text("Logo URL", null) ? text("Logo URL", null) : LogoImage }/>
        }
        version={ {
            labelColor: select(
                "Version label color",
                {
                    BLACK: "black",
                    BLUE: "blue",
                    BROWN: "brown",
                    GREEN: "green",
                    GREY: "grey",
                    OLIVE: "olive",
                    ORANGE: "orange",
                    PINK: "pink",
                    PURPLE: "purple",
                    RED: "red",
                    TEAL: "teal",
                    VIOLET: "violet",
                    YELLOW: "yellow"
                },
                null
            ),
            milestoneNumber: text("Milestone number", undefined),
            releaseType: select(
                "Release type",
                {
                    ALPHA: "alpha",
                    BETA: "beta",
                    MILESTONE: "milestone",
                    RC: "rc"
                },
                "alpha"
            ),
            textCase: select(
                "Version Text Case",
                {
                    Lowercase: "lowercase",
                    Uppercase: "uppercase"
                },
                null
            ),
            versionNumber: text("Version number", "5.11.0")
        } }
    />
);

DefaultProductBrand.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description
        }
    }
};
