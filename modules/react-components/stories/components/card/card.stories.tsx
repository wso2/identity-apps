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
 *
 */

import { GravatarLogo, ReactLogo } from "@wso2is/theme";
import { LabeledCard, SelectionCard } from "../../../src";
import React, { ReactElement } from "react";
import { action } from "@storybook/addon-actions";
import { meta } from "./card.stories.meta";

export default {
    parameters: {
        component: SelectionCard,
        componentSubtitle: meta.description
    },
    title: "Components API/Components/Card"
};

/**
 * Story to display selection card
 *
 * @return {React.ReactElement}
 */
export const SelectionVariation = (): ReactElement => (
    <SelectionCard
        id="1"
        image={ GravatarLogo }
        header="Header"
        description="This is a description."
        onClick={ action("Clicked on the card.") }
    />
);

SelectionVariation.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 1 ].description
        }
    }
};

/**
 * Story to display labeled card
 *
 * @return {React.ReactElement}
 */
export const LabeledCardVariation = (): ReactElement => (
    <LabeledCard
        label="React"
        image={ ReactLogo }
    />
);

LabeledCardVariation.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 2 ].description
        }
    }
};
