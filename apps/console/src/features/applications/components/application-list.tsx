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
    EmptyPlaceholder,
    LinkButton,
    PrimaryButton,
    ResourceList,
    ResourceListActionInterface
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Icon, Label, ListItemProps } from "semantic-ui-react";
import {
    AppConstants,
    AppState,
    ConfigReducerStateInterface,
    EmptyPlaceholderIllustrations,
    FeatureConfigInterface,
    UIConstants,
    history
} from "../../core";
import { deleteApplication } from "../api";
import { ApplicationManagementConstants } from "../constants";
import {
    ApplicationListInterface,
    ApplicationListItemInterface,
    ApplicationTemplateListItemInterface
} from "../models";
import { ApplicationManagementUtils } from "../utils";

/**
 *
 * Proptypes for the applications list component.
 */
interface ApplicationListPropsInterface extends SBACInterface<FeatureConfigInterface>, LoadableComponentInterface,
    TestableComponentInterface {

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
    onListItemClick?: (event: React.MouseEvent<HTMLAnchorElement>, data: ListItemProps) => void;
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

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const applicationTemplates: ApplicationTemplateListItemInterface[] = useSelector(
        (state: AppState) => state.application.templates);

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingApplication, setDeletingApplication ] = useState<ApplicationListItemInterface>(undefined);
    const [
        isApplicationTemplateRequestLoading,
        setApplicationTemplateRequestLoadingStatus
    ] = useState<boolean>(false);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);

    /**
     * Fetch the application templates if list is not available in redux.
     */
    useEffect(() => {
        if (applicationTemplates !== undefined) {
            return;
        }

        setApplicationTemplateRequestLoadingStatus(true);

        ApplicationManagementUtils.getApplicationTemplates()
            .finally(() => {
                setApplicationTemplateRequestLoadingStatus(false);
            });
    }, [ applicationTemplates ]);

    /**
     * Redirects to the applications edit page when the edit button is clicked.
     *
     * @param {string} appId - Application id.
     */
    const handleApplicationEdit = (appId: string): void => {
        history.push(AppConstants.PATHS.get("APPLICATION_EDIT").replace(":id", appId));
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
                    description: t("devPortal:components.applications.notifications.deleteApplication.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("devPortal:components.applications.notifications.deleteApplication.success.message")
                }));

                setShowDeleteConfirmationModal(false);
                onApplicationDelete();
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("devPortal:components.applications.notifications.deleteApplication.error" +
                            ".message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("devPortal:components.applications.notifications.deleteApplication" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("devPortal:components.applications.notifications.deleteApplication.genericError" +
                        ".message")
                }));
            });
    };

    /**
     * Resolves list item actions based on the app config.
     *
     * @param {ApplicationListItemInterface} app - Application derails.
     *
     * @return {ResourceListActionInterface[]} Resolved list actions.
     */
    const resolveListActions = (app: ApplicationListItemInterface): ResourceListActionInterface[] => {
        if (!showListItemActions) {
            return;
        }

        const actions: ResourceListActionInterface[] = [
            {
                hidden: !isFeatureEnabled(
                    featureConfig?.applications,
                    ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT")),
                icon: "pencil alternate",
                onClick: (): void => handleApplicationEdit(app.id),
                popupText: t("common:edit"),
                type: "button"
            }
        ];

        actions.push({
            hidden: !hasRequiredScopes(
                featureConfig?.applications,
                featureConfig?.applications?.scopes?.delete, allowedScopes)
                || ApplicationManagementConstants.DELETING_FORBIDDEN_APPLICATIONS.includes(app.name),
            icon: "trash alternate",
            onClick: (): void => {
                setShowDeleteConfirmationModal(true);
                setDeletingApplication(app);
            },
            popupText: t("common:delete"),
            type: "button"
        });

        return actions;
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
                            { t("devPortal:placeholders.emptySearchResult.action") }
                        </LinkButton>
                    ) }
                    image={ EmptyPlaceholderIllustrations.emptySearch }
                    imageSize="tiny"
                    title={ t("devPortal:placeholders.emptySearchResult.title") }
                    subtitle={ [
                        t("devPortal:placeholders.emptySearchResult.subtitles.0", { query: searchQuery }),
                        t("devPortal:placeholders.emptySearchResult.subtitles.1")
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
                            { t("devPortal:components.applications.placeholders.emptyList.action") }
                        </PrimaryButton>
                    ) }
                    image={ EmptyPlaceholderIllustrations.newList }
                    imageSize="tiny"
                    title={ t("devPortal:components.applications.placeholders.emptyList.title") }
                    subtitle={ [
                        t("devPortal:components.applications.placeholders.emptyList.subtitles.0"),
                        t("devPortal:components.applications.placeholders.emptyList.subtitles.1"),
                        t("devPortal:components.applications.placeholders.emptyList.subtitles.2")
                    ] }
                    data-testid={ `${ testId }-empty-placeholder` }
                />
            );
        }

        return null;
    };

    return (
        <>
            <ResourceList
                className="applications-list"
                isLoading={ isLoading || isApplicationTemplateRequestLoading }
                loadingStateOptions={ {
                    count: defaultListItemLimit ?? UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
                selection={ selection }
                fill={ !showPlaceholders() }
                celled={ false }
                divided={ true }
                data-testid={ testId }
            >
                {
                    list?.applications && list.applications instanceof Array && list.applications.length > 0
                        ? list.applications.map((app: ApplicationListItemInterface, index: number) => {

                            const template = applicationTemplates
                                && applicationTemplates instanceof Array
                                && applicationTemplates.length > 0
                                && applicationTemplates.find((template) => template.id === app.templateId);

                            // TODO Remove this check and move the logic to backend.
                            if ("wso2carbon-local-sp" !== app.name) {
                                return (
                                    <ResourceList.Item
                                        key={ index }
                                        id={ app.id }
                                        actions={ resolveListActions(app) }
                                        actionsFloated="right"
                                        avatar={
                                            app.image
                                                ? (
                                                    <AppAvatar
                                                        name={ app.name }
                                                        image={ app.image }
                                                        size="mini"
                                                        floated="left"
                                                        data-testid={ `${ testId }-item-image` }
                                                    />
                                                )
                                                : (
                                                    <AnimatedAvatar
                                                        name={ app.name }
                                                        size="mini"
                                                        floated="left"
                                                        data-testid={ `${ testId }-item-image` }
                                                    />
                                                )
                                        }
                                        itemHeader={ app.name }
                                        itemDescription={ (
                                            <>
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
                                            </>
                                        ) }
                                        onClick={
                                            (event: React.MouseEvent<HTMLAnchorElement>, data: ListItemProps) => {
                                                if (!selection) {
                                                    return;
                                                }

                                                handleApplicationEdit(app.id);
                                                onListItemClick(event, data);
                                            }
                                        }
                                        data-testid={ `${ testId }-item` }
                                    />
                                );
                            }
                        })
                        : showPlaceholders()
                }
            </ResourceList>
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
                                        "devPortal:components.applications.confirmations.deleteApplication" +
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
                    >
                        <ConfirmationModal.Header
                            data-testid={ `${ testId }-delete-confirmation-modal-header` }
                        >
                            { t("devPortal:components.applications.confirmations.deleteApplication.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            warning
                            data-testid={ `${ testId }-delete-confirmation-modal-message` }
                        >
                            { t("devPortal:components.applications.confirmations.deleteApplication.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content
                            data-testid={ `${ testId }-delete-confirmation-modal-content` }
                        >
                            { t("devPortal:components.applications.confirmations.deleteApplication.content") }
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
    selection: false,
    showListItemActions: true
};
