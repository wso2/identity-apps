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
import { meta } from "./data-table.stories.meta";
import { AppAvatar, DataTable } from "../../../src";
import { Header, Label } from "semantic-ui-react";

export default {
    parameters: {
        component: DataTable,
        componentSubtitle: meta.description
    },
    title: "Components API/Components/Data Table"
};

/**
 * Story to display a default resource list.
 *
 * @return {React.ReactElement}
 */
export const Default = (): ReactElement => (
    <DataTable
        padded
        basic="very"
        actions={ [
            {
                icon: "pencil alternate",
                onClick: action("Clicked on edit."),
                popupText: "edit",
                renderer: "semantic-icon"
            },
            {
                icon: "trash alternate",
                onClick: action("Clicked on delete."),
                popupText: "delete",
                renderer: "dropdown"
            }
        ] }
        data={ [
            {
                clientId: <Label>jvwEqjYtRSeMtb4nGWXUKdMBN2UXpl3t</Label>,
                name: (
                    <Header as="h6" image>
                        <AppAvatar
                            name="Facebook"
                            image="http://pngimg.com/uploads/facebook_logos/facebook_logos_PNG19750.png"
                            size="mini"
                        />
                        <Header.Content>
                            Facebook
                            <Header.Subheader>Facebook federated login example app.</Header.Subheader>
                        </Header.Content>
                    </Header>
                )
            },
            {
                clientId: <Label>jvasdjYtdfdfRSeMtbasdUKdMBN2UXpl34</Label>,
                name: (
                    <Header as="h6" image>
                        <AppAvatar
                            name="Facebook"
                            image="https://miro.medium.com/max/1300/1*pk4gPFD0OLeKbwKlN1v9YA.png"
                            size="mini"
                        />
                        <Header.Content>
                            GO SDK Demo
                            <Header.Subheader>Demo of the GO lang SDK implementing the auth code
                                flow.</Header.Subheader>
                        </Header.Content>
                    </Header>
                )
            }
        ] }
        columns={ [
            {
                dataIndex: "name",
                key: 0,
                title: "Name"
            },
            {
                dataIndex: "clientId",
                key: 1,
                title: "Client ID"
            },
            {
                dataIndex: "action",
                key: 2,
                title: "Actions"
            }
        ] }
    />
);

Default.story = {
    parameters: {
        docs: {
            storyDescription: meta.stories[ 0 ].description
        }
    }
};
