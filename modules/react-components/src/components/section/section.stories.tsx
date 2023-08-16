/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { action } from "@storybook/addon-actions";
import React, { ReactElement } from "react";
import { meta } from "./section.stories.meta";
import {
    ReactComponent as ProfileExportIllustration
} from "../../storybook-helpers/assets/images/illustrations/profile-export.svg";
import { UserAvatar } from "../avatar";
import { Section } from "../section";

export default {
    parameters: {
        component: Section,
        componentSubtitle: meta.description
    },
    title: "Components API/Components/Section"
};

/**
 * Story to display a default section.
 *
 * @returns default section.
 */
export const DefaultSection = (): ReactElement => (
    <Section
        description="Manage and update your personal details like name, email, mobile number, organization, etc."
        header="Profile"
        icon={ (
            <UserAvatar
                spaced="right"
                size="tiny"
                image="https://avatars3.githubusercontent.com/u/25959096?s=460&v=4"
            />
        ) }
    />
);

DefaultSection.story = {
    parameters: {
        docs: {
            storyDescription: meta.description
        }
    }
};

/**
 * Story to display a section with an action.
 *
 * @returns section with an action.
 */
export const SectionWithAction = (): ReactElement => (
    <Section
        description="Download all your profile data including personal data, and linked accounts."
        header="Export profile"
        contentPadding={ false }
        icon={ ProfileExportIllustration }
        onPrimaryActionClick={ action("Downloading profile in JSON format") }
        primaryAction="Download as JSON"
        primaryActionIcon="cloud download"
    />
);

SectionWithAction.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description
        }
    }
};
