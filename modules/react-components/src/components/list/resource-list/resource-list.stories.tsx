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
 * @return {React.ReactElement}
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
