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

import { LoadableComponentInterface } from "@wso2is/core/models";
import {
    ConfirmationModal,
    EmptyPlaceholder,
    PrimaryButton,
    ResourceList,
    ResourceListItem
} from "@wso2is/react-components";
import * as CountryLanguage from "country-language";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Flag, FlagNameValues, Icon } from "semantic-ui-react";
import { ViewLocaleTemplate } from "./view-template";
import { EmailTemplateIllustrations } from "../../configs";
import { EMAIL_TEMPLATE_VIEW_PATH, UIConstants } from "../../constants";
import { history } from "../../helpers";
import { EmailTemplate } from "../../models";

interface EmailTemplateListPropsInterface extends LoadableComponentInterface {
    templateTypeId: string;
    templateList: EmailTemplate[];
    onDelete: (templateTypeId: string, templateId: string,) => void;
    /**
     * Callback to be fired when clicked on the empty list placeholder action.
     */
    onEmptyListPlaceholderActionClick: () => void;
}

/**
 * List component to render email template types.
 *
 * @param props props required to render the email template list
 */
export const EmailTemplateList: FunctionComponent<EmailTemplateListPropsInterface> = (
    props: EmailTemplateListPropsInterface
): ReactElement => {

    const {
        isLoading,
        onEmptyListPlaceholderActionClick,
        onDelete,
        templateList,
        templateTypeId
    } = props;

    const [ showViewLocaleWizArd, setShowViewLocaleWizard ] = useState<boolean>(false);
    const [ currentViewTemplate, setCurrentViewTemplate ] = useState<string>("");

    const [ showTemplateDeleteConfirmation, setShowTemplateDeleteConfirmation ] = useState<boolean>(false);
    const [ currentDeletingTemplate, setCurrentDeletingTemplate ] = useState<EmailTemplate>(undefined);

    const handleEditTemplate = (templateTypeId: string, templateId: string) => {
        history.push(EMAIL_TEMPLATE_VIEW_PATH + templateTypeId + "/add-template/" + templateId);
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
                            New Template
                        </PrimaryButton>
                    }
                    title="Add Template"
                    subtitle={ [
                        "Currently there are no templates available for the selected",
                        "email template type. You can add a new template clicking on the",
                        "button below."
                    ] }
                    image={ EmailTemplateIllustrations.emptyEmailListing }
                    imageSize="tiny"
                />
            );
        }

        return null;
    };

    return (
        <>
            <ResourceList
                className="email-template-list"
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
            >
                {
                    templateList && templateList instanceof Array && templateList.length > 0
                        ? templateList && templateList.map((template: EmailTemplate, index: number): ReactElement => {
                            let countryCode = "";
                            let languageCode = "";

                            if (template.id.indexOf("_") !== -1) {
                                countryCode = template.id.split("_")[ 1 ];
                                languageCode = template.id.split("_")[ 0 ];
                            } else {
                                countryCode = template.id.split("-")[ 1 ];
                                languageCode = template.id.split("-")[ 0 ];
                            }

                            const language: string = CountryLanguage.getLanguage(languageCode).name;
                            const country: string = CountryLanguage.getCountry(countryCode).name;

                            return (
                                <ResourceListItem
                                    key={ index }
                                    actionsFloated="right"
                                    actions={ [ {
                                        icon: "eye",
                                        onClick: () => {
                                            setCurrentViewTemplate(template.id);
                                            setShowViewLocaleWizard(true);
                                        },
                                        popupText: "View Template",
                                        type: "button"
                                    }, {
                                        icon: "pencil alternate",
                                        onClick: () => handleEditTemplate(templateTypeId, template.id),
                                        popupText: "Edit Template",
                                        type: "button"
                                    }, {
                                        icon: "trash alternate",
                                        onClick: () => {
                                            setCurrentDeletingTemplate(template);
                                            setShowTemplateDeleteConfirmation(true);
                                        },
                                        popupText: "Delete Template",
                                        type: "button"
                                    } ] }
                                    itemHeader={
                                        <>
                                            <Flag
                                                className="email-template-flag "
                                                name={ countryCode.toLowerCase() as FlagNameValues }
                                            />
                                            { country ? language + " (" + country + ")" : language }
                                        </>
                                    }
                                />
                            );
                        })
                        : showPlaceholders()
                }
            </ResourceList>
            {
                showViewLocaleWizArd && (
                    <ViewLocaleTemplate
                        templateTypeId={ templateTypeId }
                        templateId={ currentViewTemplate }
                        onCloseHandler={ () => setShowViewLocaleWizard(false) }
                        onEditHandler={ () => handleEditTemplate(templateTypeId, currentViewTemplate) }
                    />
                )
            }
            {
                showTemplateDeleteConfirmation &&
                <ConfirmationModal
                    onClose={ (): void => setShowTemplateDeleteConfirmation(false) }
                    type="warning"
                    open={ showTemplateDeleteConfirmation }
                    assertion={ currentDeletingTemplate.id }
                    assertionHint={
                        <p>Please type <strong>{ currentDeletingTemplate.id }</strong> to confirm. </p>
                    }
                    assertionType="input"
                    primaryAction="Confirm"
                    secondaryAction="Cancel"
                    onSecondaryActionClick={ (): void => setShowTemplateDeleteConfirmation(false) }
                    onPrimaryActionClick={ (): void => {
                        onDelete(templateTypeId, currentDeletingTemplate.id);
                        setShowTemplateDeleteConfirmation(false);
                    } }
                >
                    <ConfirmationModal.Header>Are you sure?</ConfirmationModal.Header>
                    <ConfirmationModal.Message attached warning>
                        This action is irreversible and will permanently delete the selected email template.
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        If you delete this email template, all associated work flows will no longer
                        have a valid email template to work with. Please proceed cautiously.
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            }
        </>
    )
};
