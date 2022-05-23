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

import { action } from "@storybook/addon-actions";
import { CSharpLogo, GravatarLogo, JavaScriptLogo, ReactLogo } from "@wso2is/theme";
import * as React from "react";
import { meta } from "./card.stories.meta";
import { InfoCard, LabeledCard, SelectionCard } from "../../../src";

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
export const SelectionVariation = (): React.ReactElement => (
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
export const LabeledCardVariation = (): React.ReactElement => (
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

/**
 * Story to display info card
 *
 * @return {React.ReactElement}
 */
export const InfoCardVariation = (): React.ReactElement => (
    <InfoCard
        header="WSO2"
        subHeader="is-javascript-sdk"
        description="Official javascript wrapper form WSO2 Identity Server Auth APIs."
        image="https://avatars3.githubusercontent.com/u/533043?v=4"
        tags={ [ "wso2", "wso2is", "samples", "identityserver", "iam" ] }
        githubRepoCard={ true }
        githubRepoMetaInfo={ {
            forks: 6623,
            languageLogo: CSharpLogo,
            stars: 34240,
            watchers: 9985
        } }
    />
);

InfoCardVariation.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 3 ].description
        }
    }
};

/**
 * Story to display info card
 *
 * @return {React.ReactElement}
 */
export const InfoCardFluidVariation = (): React.ReactElement => (
    <InfoCard
        fluid
        header="WSO2"
        subHeader="is-javascript-sdk"
        description="Official javascript wrapper form WSO2 Identity Server Auth APIs."
        image="https://avatars3.githubusercontent.com/u/533043?v=4"
        tags={ [ "wso2", "wso2is", "samples", "identityserver", "iam" ] }
        githubRepoCard={ true }
        githubRepoMetaInfo={ {
            forks: 6623,
            languageLogo: JavaScriptLogo,
            stars: 34240,
            watchers: 9985
        } }
    />
);

InfoCardFluidVariation.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 4 ].description
        }
    }
};
