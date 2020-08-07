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
import * as CountryLanguage from "country-language";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Flag, FlagNameValues, Icon } from "semantic-ui-react";
import { ViewLocaleTemplate } from "./view-template";
import { AppConstants, UIConstants, history } from "../../core";
import { EmailTemplateIllustrations } from "../configs";
import { EmailTemplate } from "../models";

interface EmailTemplateListPropsInterface extends LoadableComponentInterface, TestableComponentInterface {
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
 * @param {EmailTemplateListPropsInterface} props - Props required to render the email template list.
 *
 * @return {React.ReactElement}
 */
export const EmailTemplateList: FunctionComponent<EmailTemplateListPropsInterface> = (
    props: EmailTemplateListPropsInterface
): ReactElement => {

    const {
        isLoading,
        onEmptyListPlaceholderActionClick,
        onDelete,
        templateList,
        templateTypeId,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ showViewLocaleWizArd, setShowViewLocaleWizard ] = useState<boolean>(false);
    const [ currentViewTemplate, setCurrentViewTemplate ] = useState<string>("");

    const [ showTemplateDeleteConfirmation, setShowTemplateDeleteConfirmation ] = useState<boolean>(false);
    const [ currentDeletingTemplate, setCurrentDeletingTemplate ] = useState<EmailTemplate>(undefined);

    const handleEditTemplate = (templateTypeId: string, templateId: string) => {
        history.push(AppConstants.PATHS.get("EMAIL_TEMPLATE_LOCALE_ADD")
            .replace(":type", templateTypeId)
            .replace(":id",  templateId));
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
                            { t("adminPortal:components.emailTemplates.placeholders.emptyList.action") }
                        </PrimaryButton>
                    }
                    title={ t("adminPortal:components.emailTemplates.placeholders.emptyList.title") }
                    subtitle={ [
                        t("adminPortal:components.emailTemplates.placeholders.emptyList.subtitles.0"),
                        t("adminPortal:components.emailTemplates.placeholders.emptyList.subtitles.1"),
                        t("adminPortal:components.emailTemplates.placeholders.emptyList.subtitles.2")
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
                className="email-template-list"
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
                fill={ !showPlaceholders() }
                celled={ false }
                divided={ true }
                data-testid={ testId }
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
                                        popupText: t("adminPortal:components.emailTemplates.buttons.viewTemplate"),
                                        type: "button"
                                    }, {
                                        icon: "pencil alternate",
                                        onClick: () => handleEditTemplate(templateTypeId, template.id),
                                        popupText: t("adminPortal:components.emailTemplates.buttons.editTemplate"),
                                        type: "button"
                                    }, {
                                        icon: "trash alternate",
                                        onClick: () => {
                                            setCurrentDeletingTemplate(template);
                                            setShowTemplateDeleteConfirmation(true);
                                        },
                                        popupText: t("adminPortal:components.emailTemplates.buttons.deleteTemplate"),
                                        type: "button"
                                    } ] }
                                    itemHeader={
                                        <>
                                            <Flag
                                                className="email-template-flag "
                                                name={ countryCode.toLowerCase() as FlagNameValues }
                                                data-testid={ `${ testId }-flag-image` }
                                            />
                                            { country ? language + " (" + country + ")" : language }
                                        </>
                                    }
                                    data-testid={ `${ testId }-item` }
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
                        data-testid={ `${ testId }-view-locale-template` }
                    />
                )
            }
            {
                showTemplateDeleteConfirmation && (
                    <ConfirmationModal
                        onClose={ (): void => setShowTemplateDeleteConfirmation(false) }
                        type="warning"
                        open={ showTemplateDeleteConfirmation }
                        assertion={ currentDeletingTemplate.id }
                        assertionHint={
                            <p>
                                <Trans
                                    i18nKey={ "adminPortal:components.emailTemplates.confirmations.deleteTemplate" +
                                    ".assertionHint" }
                                    tOptions={ { id: currentDeletingTemplate.id } }
                                >
                                    Please type <strong>{ currentDeletingTemplate.id }</strong> to confirm.
                                </Trans>
                            </p>
                        }
                        assertionType="input"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setShowTemplateDeleteConfirmation(false) }
                        onPrimaryActionClick={ (): void => {
                            onDelete(templateTypeId, currentDeletingTemplate.id);
                            setShowTemplateDeleteConfirmation(false);
                        } }
                        data-testid={ `${ testId }-delete-confirmation-modal` }
                    >
                        <ConfirmationModal.Header
                            data-testid={ `${ testId }-delete-confirmation-modal-header` }
                        >
                            { t("adminPortal:components.emailTemplates.confirmations.deleteTemplate.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            warning
                            data-testid={ `${ testId }-delete-confirmation-modal-message` }
                        >
                            { t("adminPortal:components.emailTemplates.confirmations.deleteTemplate.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content
                            data-testid={ `${ testId }-delete-confirmation-modal-content` }
                        >
                            { t("adminPortal:components.emailTemplates.confirmations.deleteTemplate.content") }
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
EmailTemplateList.defaultProps = {
    "data-testid": "email-template-list"
};
