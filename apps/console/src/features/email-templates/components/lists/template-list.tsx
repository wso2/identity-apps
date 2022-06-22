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
    DataTable,
    EmptyPlaceholder,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import * as CountryLanguage from "country-language";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Flag, FlagNameValues, Icon, SemanticICONS } from "semantic-ui-react";
import { AppConstants, UIConstants, getEmptyPlaceholderIllustrations, history } from "../../../core";
import { EmailTemplate } from "../../models";
import { ViewLocaleTemplate } from "../wizards";

/**
 * Interface for email template list props.
 */
interface EmailTemplateListPropsInterface extends LoadableComponentInterface, TestableComponentInterface {
    /**
     * Advanced Search component.
     */
    advancedSearch?: ReactNode;
    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
    /**
     * ID of the template type.
     */
    templateTypeId: string;
    /**
     * Templates list.
     */
    templateList: EmailTemplate[];
    /**
     * On Delete callback.
     * @param {string} templateTypeId - Deleting template's type ID.
     * @param {string} templateId - Deleting template's ID.
     */
    onDelete: (templateTypeId: string, templateId: string,) => void;
    /**
     * Callback to be fired when clicked on the empty list placeholder action.
     */
    onEmptyListPlaceholderActionClick: () => void;
    /**
     * Enable selection styles.
     */
    selection?: boolean;
    /**
     * Show list item actions.
     */
    showListItemActions?: boolean;
}

/**
 * List component to render email template types.
 *
 * @param {EmailTemplateListPropsInterface} props - Props required to render the email template list.
 * @return {React.ReactElement}
 */
export const EmailTemplateList: FunctionComponent<EmailTemplateListPropsInterface> = (
    props: EmailTemplateListPropsInterface
): ReactElement => {

    const {
        advancedSearch,
        defaultListItemLimit,
        isLoading,
        onEmptyListPlaceholderActionClick,
        onDelete,
        templateList,
        templateTypeId,
        selection,
        showListItemActions,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ showViewLocaleWizArd, setShowViewLocaleWizard ] = useState<boolean>(false);
    const [ currentViewTemplate, setCurrentViewTemplate ] = useState<string>("");

    const [ showTemplateDeleteConfirmation, setShowTemplateDeleteConfirmation ] = useState<boolean>(false);
    const [ currentDeletingTemplate, setCurrentDeletingTemplate ] = useState<EmailTemplate>(undefined);

    const handleEditTemplate = (templateTypeId: string, templateId: string) => {
        history.push(AppConstants.getPaths().get("EMAIL_TEMPLATE")
            .replace(":templateTypeId", templateTypeId)
            .replace(":templateId",  templateId));
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
                    action={ (
                        <PrimaryButton onClick={ onEmptyListPlaceholderActionClick }>
                            <Icon name="add"/>
                            { t("console:manage.features.emailTemplates.placeholders.emptyList.action") }
                        </PrimaryButton>
                    ) }
                    title={ t("console:manage.features.emailTemplates.placeholders.emptyList.title") }
                    subtitle={ [
                        t("console:manage.features.emailTemplates.placeholders.emptyList.subtitles.0"),
                        t("console:manage.features.emailTemplates.placeholders.emptyList.subtitles.1"),
                        t("console:manage.features.emailTemplates.placeholders.emptyList.subtitles.2")
                    ] }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    data-testid={ `${ testId }-empty-placeholder` }
                />
            );
        }

        return null;
    };

    /**
     * Resolves data table columns.
     *
     * @return {TableColumnInterface[]}
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (template: EmailTemplate): ReactNode => {
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
                        <div data-testid={ `${ testId }-item-heading` }>
                            <Flag
                                className="email-template-flag"
                                name={ countryCode.toLowerCase() as FlagNameValues }
                                data-testid={ `${ testId }-flag-image` }
                            />
                            { country ? language + " (" + country + ")" : language }
                        </div>
                    );
                },
                title: t("console:manage.features.emailTemplates.list.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("console:manage.features.emailTemplates.list.actions")
            }
        ];
    };

    /**
     * Resolves data table actions.
     *
     * @return {TableActionsInterface[]}
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        if (!showListItemActions) {
            return [];
        }

        return [
            {
                "data-testid": `${ testId }-item-view-button`,
                icon: (): SemanticICONS => "eye",
                onClick: (e: SyntheticEvent, template: EmailTemplate) => {
                    setCurrentViewTemplate(template.id);
                    setShowViewLocaleWizard(true);
                },
                popupText: (): string => t("console:manage.features.emailTemplates.buttons.viewTemplate"),
                renderer: "semantic-icon"
            },
            {
                "data-testid": `${ testId }-item-edit-button`,
                icon: (): SemanticICONS => "pencil alternate",
                onClick: (e: SyntheticEvent, template: EmailTemplate) =>
                    handleEditTemplate(templateTypeId, template.id),
                popupText: (): string => t("console:manage.features.emailTemplates.buttons.editTemplate"),
                renderer: "semantic-icon"
            },
            {
                "data-testid": `${ testId }-item-delete-button`,
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, template: EmailTemplate) => {
                    setCurrentDeletingTemplate(template);
                    setShowTemplateDeleteConfirmation(true);
                },
                popupText: (): string => t("console:manage.features.emailTemplates.buttons.deleteTemplate"),
                renderer: "semantic-icon"
            }
        ];
    };

    return (
        <>
            <DataTable<EmailTemplate>
                className="email-templates-table"
                externalSearch={ advancedSearch }
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: defaultListItemLimit ?? UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
                actions={ resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ templateList }
                onRowClick={ (e: SyntheticEvent, template: EmailTemplate): void => {
                    handleEditTemplate(templateTypeId, template.id);
                } }
                placeholders={ showPlaceholders() }
                selectable={ selection }
                showHeader={ false }
                transparent={ !isLoading && (showPlaceholders() !== null) }
                data-testid={ testId }
            />
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
                        assertionHint={ (
                            <p>
                                <Trans
                                    i18nKey={ "console:manage.features.emailTemplates.confirmations.deleteTemplate" +
                                    ".assertionHint" }
                                    tOptions={ { id: currentDeletingTemplate.id } }
                                >
                                    Please type <strong>{ currentDeletingTemplate.id }</strong> to confirm.
                                </Trans>
                            </p>
                        ) }
                        assertionType="input"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setShowTemplateDeleteConfirmation(false) }
                        onPrimaryActionClick={ (): void => {
                            onDelete(templateTypeId, currentDeletingTemplate.id);
                            setShowTemplateDeleteConfirmation(false);
                        } }
                        data-testid={ `${ testId }-delete-confirmation-modal` }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header
                            data-testid={ `${ testId }-delete-confirmation-modal-header` }
                        >
                            { t("console:manage.features.emailTemplates.confirmations.deleteTemplate.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            warning
                            data-testid={ `${ testId }-delete-confirmation-modal-message` }
                        >
                            { t("console:manage.features.emailTemplates.confirmations.deleteTemplate.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content
                            data-testid={ `${ testId }-delete-confirmation-modal-content` }
                        >
                            { t("console:manage.features.emailTemplates.confirmations.deleteTemplate.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </>
    );
};

/**
 * Default props for the component.
 */
EmailTemplateList.defaultProps = {
    "data-testid": "email-template-list",
    selection: true,
    showListItemActions: true
};
