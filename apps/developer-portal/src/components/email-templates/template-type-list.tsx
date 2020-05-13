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

import { LoadableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import {
    ConfirmationModal,
    EmptyPlaceholder,
    PrimaryButton,
    ResourceList,
    ResourceListItem
} from "@wso2is/react-components";
import React, { FunctionComponent , ReactElement, useState } from "react";
import { Icon, Image } from "semantic-ui-react";
import { EmailTemplateIllustrations } from "../../configs";
import { EMAIL_TEMPLATE_VIEW_PATH, UIConstants } from "../../constants";
import { history } from "../../helpers";
import { EmailTemplateType } from "../../models";
import { AvatarBackground } from "../shared";

interface EmailTemplateListPropsInterface extends LoadableComponentInterface, TestableComponentInterface {
    onDelete: (templateId: string) => void;
    templateTypeList: EmailTemplateType[];
    /**
     * Callback to be fired when clicked on the empty list placeholder action.
     */
    onEmptyListPlaceholderActionClick: () => void;
}

/**
 * List component to render email template types.
 *
 * @param {EmailTemplateListPropsInterface} props - props required to render the email template list.
 *
 * @return {React.ReactElement}
 */
export const EmailTemplateTypeList: FunctionComponent<EmailTemplateListPropsInterface> = (
    props: EmailTemplateListPropsInterface
): ReactElement => {

    const {
        isLoading,
        templateTypeList: templateList,
        onDelete,
        onEmptyListPlaceholderActionClick,
        [ "data-testid" ]: testId
    } = props;

    const [ showTemplateTypeDeleteConfirmation, setShowTemplateTypeDeleteConfirmation ] = useState<boolean>(false);
    const [ currentDeletingTemplate, setCurrentDeletingTemplate ] = useState<EmailTemplateType>(undefined);

    const handleEditTemplate = (templateTypeId: string) => {
        history.push(EMAIL_TEMPLATE_VIEW_PATH + templateTypeId);
    };

    /**
     * Resolve the relevant placeholder.
     *
     * @return {React.ReactElement}
     */
    const showPlaceholders = (): ReactElement => {
        if (templateList?.length === 0) {
            return (
                <EmptyPlaceholder
                    action={
                        <PrimaryButton onClick={ onEmptyListPlaceholderActionClick }>
                            <Icon name="add"/>
                            New Template Type
                        </PrimaryButton>
                    }
                    title="Add new Template Type"
                    subtitle={ [
                        "Currently there are no templates types available.",
                        "You can add a new template type by clicking on the",
                        "button below."
                    ] }
                    image={ EmailTemplateIllustrations.emptyEmailListing }
                    imageSize="tiny"
                    data-testid={ `${ testId }-empty-placeholder` }
                />
            );
        }

        return null;
    };

    return (
        <>
            <ResourceList
                className="email-template-types-list"
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
                data-testid={ testId }
            >
                {
                    templateList && templateList instanceof Array && templateList.length > 0
                        ? templateList && templateList.map((template: EmailTemplateType, index: number) => (
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
                                        data-testid={ `${ testId }-item-image` }
                                    >
                                        <AvatarBackground />
                                        <span className="claims-letter">
                                            { template.displayName[0].toLocaleUpperCase() }
                                        </span>
                                    </Image>
                                ) }
                                itemHeader={ template.displayName }
                                data-testid={ `${ testId }-item` }
                            />
                        ))
                        : showPlaceholders()
                }
            </ResourceList>
            {
                showTemplateTypeDeleteConfirmation && (
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
                        data-testid={ `${ testId }-delete-confirmation-modal` }
                    >
                        <ConfirmationModal.Header
                            data-testid={ `${ testId }-delete-confirmation-modal-header` }
                        >
                            Are you sure?
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            warning
                            data-testid={ `${ testId }-delete-confirmation-modal-message` }
                        >
                            This action is irreversible and will permanently delete the selected email template type.
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content
                            data-testid={ `${ testId }-delete-confirmation-modal-content` }
                        >
                            If you delete this email template type, all associated work flows will no longer
                            have a valid email template to work with and this will delete all the locale templates 
                            associated with this template type. Please proceed cautiously.
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </>
    )
};

/**
 * Default props for the component.
 */
EmailTemplateTypeList.defaultProps = {
    "data-testid": "email-template-types-list"
};
