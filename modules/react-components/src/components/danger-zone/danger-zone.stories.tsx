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
import { text } from "@storybook/addon-knobs";
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
 * @return {React.ReactElement}
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
 * @return {React.ReactElement}
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
 * @return {React.ReactElement}
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
 * @return {React.ReactElement}
 */
export const DangerZonePlayground = (): ReactElement => (
    <DangerZoneGroup sectionHeader={ text("Section heading", "Danger Zone") }>
        <DangerZone
            actionTitle={ text("Action title", "Revoke") }
            header={ text("Heading", "Revoke Consent") }
            subheader={ text("Description", "You will have to provide consent for this application again.") }
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
