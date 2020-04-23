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

import React, { FunctionComponent , ReactElement, useState } from "react";
import { ResourceList, ResourceListItem, ConfirmationModal } from "@wso2is/react-components";
import { Image } from "semantic-ui-react";
import { EmailTemplateType } from "../../models";
import { history } from "../../helpers";
import { EMAIL_TEMPLATE_VIEW_PATH } from "../../constants";
import { ClaimsAvatarBackground } from "../claims";

interface EmailTemplateListPropsInterface {
    onDelete: (templateId: string) => void;
    templateTypeList: EmailTemplateType[];
}

/**
 * List component to render email template types.
 * 
 * @param props props required to render the email template list
 */
export const EmailTemplateTypeList: FunctionComponent<EmailTemplateListPropsInterface> = (
    props: EmailTemplateListPropsInterface
): ReactElement => {

    const {
        templateTypeList: templateList,
        onDelete
    } = props;

    const [ showTemplateTypeDeleteConfirmation, setShowTemplateTypeDeleteConfirmation ] = useState<boolean>(false);
    const [ currentDeletingTemplate, setCurrentDeletingTemplate ] = useState<EmailTemplateType>(undefined);

    const handleEditTemplate = (templateTypeId: string) => {
        history.push(EMAIL_TEMPLATE_VIEW_PATH + templateTypeId);
    };

    return (
        <>
            <ResourceList className="roles-list">
                {
                    templateList && templateList.map((template: EmailTemplateType, index: number) => (
                        <ResourceListItem
                            key={ index }
                            actionsFloated="right"
                            actions={ [{
                                icon: "pencil alternate",
                                onClick: () => handleEditTemplate(template.id),
                                popupText: "Edit Template",
                                type: "button"
                            },{
                                icon: "trash alternate",
                                onClick: () => {
                                    setCurrentDeletingTemplate(template);
                                    setShowTemplateTypeDeleteConfirmation(true)
                                    
                                },
                                popupText: "Delete Template",
                                type: "button"
                            }] }
                            avatar={ (
                                <Image
                                    floated="left"
                                    verticalAlign="middle"
                                    rounded
                                    centered
                                    size="mini"
                                >
                                    <ClaimsAvatarBackground />
                                    <span className="claims-letter">
                                        { template.displayName[0].toLocaleUpperCase() }
                                    </span>
                                </Image>
                            ) }
                            itemHeader={ template.displayName }
                        />
                    ))
                }
            </ResourceList>
            {
                showTemplateTypeDeleteConfirmation && 
                    <ConfirmationModal
                        onClose={ (): void => setShowTemplateTypeDeleteConfirmation(false) }
                        type="warning"
                        open={ showTemplateTypeDeleteConfirmation }
                        assertion={ currentDeletingTemplate.displayName }
                        assertionHint={ 
                            <p>Please type <strong>{ currentDeletingTemplate.displayName }</strong> to confirm. </p> 
                        }
                        assertionType="input"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => setShowTemplateTypeDeleteConfirmation(false) }
                        onPrimaryActionClick={ (): void => {
                            onDelete(currentDeletingTemplate.id);
                            setShowTemplateTypeDeleteConfirmation(false);
                        } }
                    >
                        <ConfirmationModal.Header>Are you sure?</ConfirmationModal.Header>
                        <ConfirmationModal.Message attached warning>
                            This action is irreversible and will permanently delete the selected email template type.
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            If you delete this email template type, all associated work flows will no longer
                            have a valid email template to work with and this will delete all the locale templates 
                            associated with this template type. Please proceed cautiously.
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
            }
        </>
    )
}
