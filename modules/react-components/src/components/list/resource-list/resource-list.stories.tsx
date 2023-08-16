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
import { Label } from "semantic-ui-react";
import { ResourceList } from "./resource-list";
import { APPLICATIONS_LIST, meta } from "./resource-list.stories.meta";
import { AppAvatar } from "../../avatar";

export default {
    parameters: {
        component: ResourceList,
        componentSubtitle: meta.description
    },
    title: "Components API/Components/Resource List"
};

/**
 * Story to display a default resource list.
 *
 * @returns the story for displaying a default resource list.
 */
export const Default = (): ReactElement => (
    <ResourceList className="applications-list">
        <ResourceList.Header>
            <ResourceList.HeaderCell width={ 8 }>Name</ResourceList.HeaderCell>
            <ResourceList.HeaderCell width={ 6 }>Client ID</ResourceList.HeaderCell>
            <ResourceList.HeaderCell width={ 2 }>Actions</ResourceList.HeaderCell>
        </ResourceList.Header>
        {
            APPLICATIONS_LIST.map((app, index) => (
                <ResourceList.Item
                    key={ index }
                    actions={ [
                        {
                            icon: "pencil alternate",
                            onClick: action("Clicked on edit."),
                            popupText: "edit",
                            type: "button"
                        },
                        {
                            icon: "trash alternate",
                            onClick: action("Clicked on delete."),
                            popupText: "delete",
                            type: "dropdown"
                        }
                    ] }
                    actionsFloated="left"
                    avatar={ (
                        <AppAvatar
                            name={ app.name }
                            image={ app.imageUrl }
                            size="mini"
                            floated="left"
                        />
                    ) }
                    actionsColumnWidth={ 2 }
                    descriptionColumnWidth={ 8 }
                    metaColumnWidth={ 6 }
                    metaContent={ <Label>{ app.clientId }</Label> }
                    itemHeader={ app.name }
                    itemDescription={ app.description }
                />
            ))
        }
    </ResourceList>
);

Default.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description
        }
    }
};
