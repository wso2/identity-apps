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

import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertLevels,
    LoadableComponentInterface,
    SBACInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Header, Icon, Label, SemanticICONS } from "semantic-ui-react";
import {
    AppConstants,
    AppState,
    FeatureConfigInterface,
    UIConfigInterface,
    UIConstants,
    getEmptyPlaceholderIllustrations,
    history
} from "../../core";
import { deleteApplication } from "../api";
import { ApplicationManagementConstants } from "../constants";
import {
    ApplicationAccessTypes,
    ApplicationListInterface,
    ApplicationListItemInterface,
    ApplicationTemplateListItemInterface
} from "../models";
import { ApplicationTemplateManagementUtils } from "../utils";

/**
 *
 * Proptypes for the applications list component.
 */
interface ApplicationListPropsInterface extends SBACInterface<FeatureConfigInterface>, LoadableComponentInterface,
    TestableComponentInterface {

    /**
     * Advanced Search component.
     */
    advancedSearch?: ReactNode;
    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
    /**
     * Application list.
     */
    list: ApplicationListInterface;
    /**
     * On application delete callback.
     */
    onApplicationDelete?: () => void;
    /**
     * On list item select callback.
     */
    onListItemClick?: (event: SyntheticEvent, app: ApplicationListItemInterface) => void;
    /**
     * Callback for the search query clear action.
     */
    onSearchQueryClear?: () => void;
    /**
     * Callback to be fired when clicked on the empty list placeholder action.
     */
    onEmptyListPlaceholderActionClick?: () => void;
    /**
     * Search query for the list.
     */
    searchQuery?: string;
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
 * Application list component.
 *
 * @param {ApplicationListPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const ApplicationList: FunctionComponent<ApplicationListPropsInterface> = (
    props: ApplicationListPropsInterface
): ReactElement => {

    const {
        advancedSearch,
        defaultListItemLimit,
        featureConfig,
        isLoading,
        list,
        onApplicationDelete,
        onListItemClick,
        onEmptyListPlaceholderActionClick,
        onSearchQueryClear,
        searchQuery,
        selection,
        showListItemActions,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const applicationTemplates: ApplicationTemplateListItemInterface[] = useSelector(
        (state: AppState) => state.application.templates);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);
    const UIConfig: UIConfigInterface = useSelector((state: AppState) => state?.config?.ui);

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingApplication, setDeletingApplication ] = useState<ApplicationListItemInterface>(undefined);
    const [
        isApplicationTemplateRequestLoading,
        setApplicationTemplateRequestLoadingStatus
    ] = useState<boolean>(false);

    /**
     * Fetch the application templates if list is not available in redux.
     */
    useEffect(() => {
        if (applicationTemplates !== undefined) {
            return;
        }

        setApplicationTemplateRequestLoadingStatus(true);

        ApplicationTemplateManagementUtils.getApplicationTemplates()
            .finally(() => {
                setApplicationTemplateRequestLoadingStatus(false);
            });
    }, [ applicationTemplates ]);

    /**
     * Redirects to the applications edit page when the edit button is clicked.
     *
     * @param {string} appId - Application id.
     * @param {ApplicationAccessTypes} access - Access level of the application.
     */
    const handleApplicationEdit = (appId: string, access: ApplicationAccessTypes): void => {
        history.push({
            pathname: AppConstants.getPaths().get("APPLICATION_EDIT").replace(":id", appId),
            search: access === ApplicationAccessTypes.READ
                ? `?${ ApplicationManagementConstants.APP_READ_ONLY_STATE_URL_SEARCH_PARAM_KEY }=true`
                : ""
        });
    };

    /**
     * Deletes an application when the delete application button is clicked.
     *
     * @param {string} appId - Application id.
     */
    const handleApplicationDelete = (appId: string): void => {
        deleteApplication(appId)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.deleteApplication.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.applications.notifications.deleteApplication.success.message")
                }));

                setShowDeleteConfirmationModal(false);
                onApplicationDelete();
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications.deleteApplication.error" +
                            ".message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.deleteApplication" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.notifications.deleteApplication.genericError" +
                        ".message")
                }));
            });
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
                render: (app: ApplicationListItemInterface): ReactNode => {
                    const template = applicationTemplates
                        && applicationTemplates instanceof Array
                        && applicationTemplates.length > 0
                        && applicationTemplates.find((template) => template.id === app.templateId);

                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-testid={ `${ testId }-item-heading` }
                        >
                            {
                                app.image
                                    ? (
                                        <AppAvatar
                                            size="mini"
                                            name={ app.name }
                                            image={ app.image }
                                            spaced="right"
                                            data-testid={ `${ testId }-item-image` }
                                        />
                                    )
                                    : (
                                        <AppAvatar
                                            image={ (
                                                <AnimatedAvatar
                                                    name={ app.name }
                                                    size="mini"
                                                    data-testid={ `${ testId }-item-image-inner` }
                                                />
                                            ) }
                                            size="mini"
                                            spaced="right"
                                            data-testid={ `${ testId }-item-image` }
                                        />
                                    )
                            }
                            <Header.Content>
                                { app.name }
                                <Header.Subheader data-testid={ `${ testId }-item-sub-heading` }>
                                    {
                                        template && (
                                            <Label
                                                size="mini"
                                                className="compact spaced-right"
                                                data-testid={ `${ testId }-template-type` }
                                            >
                                                { template.name }
                                            </Label>
                                        )
                                    }
                                    { app.description }
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    );
                },
                title: t("console:develop.features.applications.list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("console:develop.features.applications.list.columns.actions")
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
            return;
        }

        return [
            {
                "data-testid": `${ testId }-item-edit-button`,
                hidden: (): boolean => !isFeatureEnabled(featureConfig?.applications,
                    ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT")),
                icon: (app: ApplicationListItemInterface): SemanticICONS => {
                    return app?.access === ApplicationAccessTypes.READ && "eye" || "pencil alternate";
                },
                onClick: (e: SyntheticEvent, app: ApplicationListItemInterface): void =>
                    handleApplicationEdit(app.id, app.access),
                popupText: (app: ApplicationListItemInterface): string => {
                    return app?.access === ApplicationAccessTypes.READ && t("common:view") || t("common:edit");
                },
                renderer: "semantic-icon"
            },
            {
                "data-testid": `${ testId }-item-delete-button`,
                hidden: (app: ApplicationListItemInterface) => {
                    const hasScopes: boolean = !hasRequiredScopes(featureConfig?.applications,
                        featureConfig?.applications?.scopes?.delete, allowedScopes);

                    return hasScopes ||
                            UIConfig.systemAppsIdentifiers.includes(app?.name) ||
                            (app?.access === ApplicationAccessTypes.READ);
                },
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, app: ApplicationListItemInterface): void => {
                    setShowDeleteConfirmationModal(true);
                    setDeletingApplication(app);
                },
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            }
        ];
    };

    /**
     * Resolve the relevant placeholder.
     *
     * @return {React.ReactElement}
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ onSearchQueryClear }>
                            { t("console:develop.placeholders.emptySearchResult.action") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("console:develop.placeholders.emptySearchResult.title") }
                    subtitle={ [
                        t("console:develop.placeholders.emptySearchResult.subtitles.0", { query: searchQuery }),
                        t("console:develop.placeholders.emptySearchResult.subtitles.1")
                    ] }
                    data-testid={ `${ testId }-empty-search-placeholder` }
                />
            );
        }

        if (list?.totalResults === 0) {
            return (
                <EmptyPlaceholder
                    action={ onEmptyListPlaceholderActionClick && (
                        <PrimaryButton onClick={ onEmptyListPlaceholderActionClick }>
                            <Icon name="add"/>
                            { t("console:develop.features.applications.placeholders.emptyList.action") }
                        </PrimaryButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={ t("console:develop.features.applications.placeholders.emptyList.title") }
                    subtitle={ [
                        t("console:develop.features.applications.placeholders.emptyList.subtitles.0"),
                        t("console:develop.features.applications.placeholders.emptyList.subtitles.1"),
                        t("console:develop.features.applications.placeholders.emptyList.subtitles.2")
                    ] }
                    data-testid={ `${ testId }-empty-placeholder` }
                />
            );
        }

        return null;
    };

    return (
        <>
            <DataTable<ApplicationListItemInterface>
                className="applications-table"
                externalSearch={ advancedSearch }
                isLoading={ isLoading || isApplicationTemplateRequestLoading }
                loadingStateOptions={ {
                    count: defaultListItemLimit ?? UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
                actions={ resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ list?.applications }
                onRowClick={ (e: SyntheticEvent, app: ApplicationListItemInterface): void => {
                    handleApplicationEdit(app.id, app.access);
                    onListItemClick && onListItemClick(e, app);
                } }
                placeholders={ showPlaceholders() }
                selectable={ selection }
                showHeader={ false }
                transparent={ !(isLoading || isApplicationTemplateRequestLoading) && (showPlaceholders() !== null) }
                data-testid={ testId }
            />
            {
                deletingApplication && (
                    <ConfirmationModal
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="warning"
                        open={ showDeleteConfirmationModal }
                        assertion={ deletingApplication.name }
                        assertionHint={ (
                            <p>
                                <Trans
                                    i18nKey={
                                        "console:develop.features.applications.confirmations.deleteApplication" +
                                        ".assertionHint"
                                    }
                                    tOptions={ { name: deletingApplication.name } }
                                >
                                    Please type <strong>{ deletingApplication.name }</strong> to confirm.
                                </Trans>
                            </p>
                        ) }
                        assertionType="input"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => handleApplicationDelete(deletingApplication.id) }
                        data-testid={ `${ testId }-delete-confirmation-modal` }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header
                            data-testid={ `${ testId }-delete-confirmation-modal-header` }
                        >
                            { t("console:develop.features.applications.confirmations.deleteApplication.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            warning
                            data-testid={ `${ testId }-delete-confirmation-modal-message` }
                        >
                            { t("console:develop.features.applications.confirmations.deleteApplication.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content
                            data-testid={ `${ testId }-delete-confirmation-modal-content` }
                        >
                            { t("console:develop.features.applications.confirmations.deleteApplication.content") }
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
ApplicationList.defaultProps = {
    "data-testid": "application-list",
    selection: true,
    showListItemActions: true
};
