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
import { DangerZone } from "./danger-zone";
import { DangerZoneGroup } from "./danger-zone-group";
import { meta } from "./danger-zone.stories.meta";

export default {
    parameters: {
        component: DangerZone,
        componentSubtitle: meta.description
    },
    title: "Components API/Components/Danger Zone"
};

/**
 * Story to display a danger zone action.
 *
 * @returns the story for displaying the danger zone.
 */
export const DefaultDangerZone = (): ReactElement => (
    <DangerZoneGroup sectionHeader="Danger Zone">
        <DangerZone
            actionTitle="Revoke"
            header="Revoke Consent"
            subheader="You will have to provide consent for this application again."
            onActionClick={ action("Clicked on revoke consent button.") }
        />
    </DangerZoneGroup>
);

DefaultDangerZone.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description
        }
    }
};

/**
 * Story to display a single danger zone action.
 *
 * @returns the story for displaying a single danger zone action.
 */
export const SingleDangerZone = (): ReactElement => (
    <DangerZoneGroup sectionHeader="Danger Zone">
        <DangerZone
            actionTitle="Revoke"
            header="Revoke Consent"
            subheader="You will have to provide consent for this application again."
            onActionClick={ action("Clicked on revoke consent button.") }
        />
    </DangerZoneGroup>
);

SingleDangerZone.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 1 ].description
        }
    }
};

/**
 * Story to display group of danger zone actions.
 *
 * @returns DangerZoneGroup React component
 */
export const GroupOfDangerZones = (): ReactElement => (
    <DangerZoneGroup sectionHeader="Danger Zone">
        <DangerZone
            actionTitle="Revoke"
            header="Revoke Consent"
            subheader="You will have to provide consent for this application again."
            onActionClick={ action("Clicked on revoke consent button.") }
        />
        <DangerZone
            actionTitle="Delete"
            header="Delete Application"
            subheader="All apps using this service provider will stop working."
            onActionClick={ action("Clicked on delete application button.") }
        />
    </DangerZoneGroup>
);

GroupOfDangerZones.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 2 ].description
        }
    }
};

/**
 * Story to enable user to dynamically interact with the component.
 *
 * @returns DangerZoneGroup React component
 */
export const DangerZonePlayground = (): ReactElement => (
    <DangerZoneGroup sectionHeader="Danger Zone">
        <DangerZone
            actionTitle="Revoke"
            header="Revoke Consent"
            subheader="You will have to provide consent for this application again."
            onActionClick={ action("Clicked on revoke consent button.") }
        />
    </DangerZoneGroup>
);

DangerZonePlayground.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 3 ].description
        }
    }
};
