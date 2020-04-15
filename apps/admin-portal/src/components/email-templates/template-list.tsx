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

import React, { ReactElement } from "react";
import { ResourceList, ResourceListItem, Avatar } from "@wso2is/react-components";
import { Icon } from "semantic-ui-react";
import { EmailTemplateType } from "../../models";

interface EmailTemplateListProps {
    templateList: EmailTemplateType[];
}

/**
 * List component to render email template types.
 * 
 * @param props props required to render the email template list
 */
export const EmailTemplateList: React.FunctionComponent<EmailTemplateListProps> = (
    props: EmailTemplateListProps
): ReactElement => {

    const {
        templateList
    } = props;

    return (
        <ResourceList className="roles-list">
            {
                templateList && templateList.map((template, index) => (
                    <ResourceListItem
                        key={ index }
                        actionsFloated="right"
                        actions={ [{
                            icon: "pencil alternate",
                            onClick: () => { console.log() },
                            popupText: "Edit Role",
                            type: "button"
                        },
                        {
                            icon: "trash alternate",
                            onClick: () => {
                                console.log()
                            },
                            popupText: "Delete Role",
                            type: "button"
                        }] }
                        avatar={ (
                            <Avatar
                                name={ template.displayName }
                                size="small"
                                image={
                                    <Icon size="large" name='mail' />
                                }
                            />
                        ) }
                        itemHeader={ template.displayName }
                    />
                ))
            }
        </ResourceList>
    )
}
