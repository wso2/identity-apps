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
    AnimatedAvatar,
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Header, Icon, SemanticICONS } from "semantic-ui-react";
import { AppConstants, UIConstants, history } from "../../../core";
import { EmailTemplateIllustrations } from "../../configs";
import { EmailTemplateType } from "../../models";

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
     * On Delete callback.
     * @param {string} templateId - Deleting template's ID.
     */
    onDelete: (templateId: string) => void;
    /**
     * Template type list.
     */
    templateTypeList: EmailTemplateType[];
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
 * @param {EmailTemplateListPropsInterface} props - props required to render the email template list.
 *
 * @return {React.ReactElement}
 */
export const EmailTemplateTypeList: FunctionComponent<EmailTemplateListPropsInterface> = (
    props: EmailTemplateListPropsInterface
): ReactElement => {

    const {
        advancedSearch,
        defaultListItemLimit,
        isLoading,
        templateTypeList: templateList,
        onDelete,
        onEmptyListPlaceholderActionClick,
        selection,
        showListItemActions,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ showTemplateTypeDeleteConfirmation, setShowTemplateTypeDeleteConfirmation ] = useState<boolean>(false);
    const [ currentDeletingTemplate, setCurrentDeletingTemplate ] = useState<EmailTemplateType>(undefined);

    const handleEditTemplate = (templateTypeId: string) => {
        history.push(AppConstants.getPaths().get("EMAIL_TEMPLATES").replace(":templateTypeId", templateTypeId));
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
                            { t("adminPortal:components.emailTemplateTypes.placeholders.emptyList.action") }
                        </PrimaryButton>
                    }
                    title={ t("adminPortal:components.emailTemplateTypes.placeholders.emptyList.title") }
                    subtitle={ [
                        t("adminPortal:components.emailTemplateTypes.placeholders.emptyList.subtitles.0"),
                        t("adminPortal:components.emailTemplateTypes.placeholders.emptyList.subtitles.1"),
                        t("adminPortal:components.emailTemplateTypes.placeholders.emptyList.subtitles.2")
                    ] }
                    image={ EmailTemplateIllustrations.emptyEmailListing }
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
                render: (templateType: EmailTemplateType): ReactNode => (
                    <Header as="h6" image>
                        <AnimatedAvatar
                            name={ templateType.displayName }
                            size="mini"
                            data-testid={ `${ testId }-item-image` }
                        />
                        <Header.Content>
                            { templateType.displayName }
                        </Header.Content>
                    </Header>
                ),
                title: t("adminPortal:components.emailTemplateTypes.list.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("adminPortal:components.emailTemplateTypes.list.actions")
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
                icon: (): SemanticICONS => "pencil alternate",
                onClick: (e: SyntheticEvent, templateType: EmailTemplateType): void =>
                    handleEditTemplate(templateType.id),
                popupText: (): string => t("adminPortal:components.emailTemplateTypes.buttons.editTemplate"),
                renderer: "semantic-icon"
            },
            {
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, templateType: EmailTemplateType): void => {
                    setCurrentDeletingTemplate(templateType);
                    setShowTemplateTypeDeleteConfirmation(true);
                },
                popupText: (): string => t("adminPortal:components.emailTemplateTypes.buttons.deleteTemplate"),
                renderer: "semantic-icon"
            }
        ];
    };

    return (
        <>
            <DataTable<EmailTemplateType>
                className="email-template-types-table"
                externalSearch={ advancedSearch }
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: defaultListItemLimit ?? UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
                actions={ resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ templateList }
                onRowClick={ (e: SyntheticEvent, templateType: EmailTemplateType): void => {
                    handleEditTemplate(templateType?.id);
                } }
                placeholders={ showPlaceholders() }
                selectable={ selection }
                showHeader={ false }
                transparent={ !isLoading && (showPlaceholders() !== null) }
                data-testid={ testId }
            />
            {
                showTemplateTypeDeleteConfirmation && (
                    <ConfirmationModal
                        onClose={ (): void => setShowTemplateTypeDeleteConfirmation(false) }
                        type="warning"
                        open={ showTemplateTypeDeleteConfirmation }
                        assertion={ currentDeletingTemplate.displayName }
                        assertionHint={
                            <p>
                                <Trans
                                    i18nKey={ "adminPortal:components.emailTemplateTypes.confirmations" +
                                    ".deleteTemplateType.assertionHint" }
                                    tOptions={ { id: currentDeletingTemplate.displayName } }
                                >
                                    Please type <strong>{ currentDeletingTemplate.displayName }</strong> to confirm.
                                </Trans>
                            </p>
                        }
                        assertionType="input"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
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
                            { t("adminPortal:components.emailTemplateTypes.confirmations.deleteTemplateType" +
                                ".header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            warning
                            data-testid={ `${ testId }-delete-confirmation-modal-message` }
                        >
                            { t("adminPortal:components.emailTemplateTypes.confirmations.deleteTemplateType" +
                                ".message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content
                            data-testid={ `${ testId }-delete-confirmation-modal-content` }
                        >
                            { t("adminPortal:components.emailTemplateTypes.confirmations.deleteTemplateType" +
                                ".content") }
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
    "data-testid": "email-template-types-list",
    selection: true,
    showListItemActions: true
};
