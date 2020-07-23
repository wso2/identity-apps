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

import {
    FeatureConfigInterface,
    LoadableComponentInterface,
    SBACInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import {
    AnimatedAvatar,
    AppAvatar,
    ConfirmationModal,
    ResourceList,
    ResourceListActionInterface
} from "@wso2is/react-components";
import React, {FunctionComponent, ReactElement, useState} from "react";
import {Trans, useTranslation} from "react-i18next";
import { Label, ListItemProps } from "semantic-ui-react";
import {
    ApplicationListItemInterface,
    ApplicationTemplateListItemInterface,
    ConfigReducerStateInterface,
    OIDCScopesListInterface
} from "../../models";
import { ApplicationManagementUtils } from "../../utils";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../store";
import {hasRequiredScopes, isFeatureEnabled} from "@wso2is/core/helpers";
import {AppConstants, ApplicationManagementConstants} from "../../constants";
import { history } from "../../helpers";
import {deleteApplication, deleteOIDCScope} from "../../api";
import {addAlert} from "@wso2is/core/dist/src/store";
import {AlertLevels} from "@wso2is/core/dist/src/models";

/**
 *
 * Proptypes for the OIDC scopes list component.
 */
interface OIDCScopesListPropsInterface extends SBACInterface<FeatureConfigInterface>, LoadableComponentInterface,
    TestableComponentInterface {

    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
    /**
     * Application list.
     */
    list: OIDCScopesListInterface;
    /**
     * On scope delete callback.
     */
    onScopeDelete?: () => void;
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
 * OIDC scope list component.
 *
 * @param {OIDCScopesListPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const OIDCScopeList: FunctionComponent<OIDCScopesListPropsInterface> = (
    props: OIDCScopesListPropsInterface
): ReactElement => {

    const {
        defaultListItemLimit,
        featureConfig,
        isLoading,
        list,
        onScopeDelete,
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

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingScope, setDeletingScope ] = useState<OIDCScopesListInterface>(undefined);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);

    /**
     * Redirects to the OIDC scope edit page when the edit button is clicked.
     *
     * @param {string} scopeName - scope name.
     */
    const handleOIDCScopesEdit = (scopeName: string): void => {
        history.push(AppConstants.PATHS.get("OIDC_SCOPES_EDIT").replace(":id", scopeName));
    };

    /**
     * Deletes a scope when the delete scope button is clicked.
     *
     * @param scopeName
     */
    const handleOIDCScopeDelete = (scopeName: string): void => {
        deleteOIDCScope(scopeName)
            .then(() => {
                dispatch(addAlert({
                    description: t("devPortal:components.oidcScopes.notifications.deleteOIDCScope.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("devPortal:components.oidcScopes.notifications.deleteOIDCScope.success.message")
                }));

                setShowDeleteConfirmationModal(false);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("devPortal:components.oidcScopes.notifications.deleteOIDCScope.error" +
                            ".message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("devPortal:components.oidcScopes.notifications.deleteOIDCScope" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("devPortal:components.oidcScopes.notifications.deleteOIDCScope.genericError" +
                        ".message")
                }));
            });
    };

    /**
     * Resolves list item actions based on the scope.
     *
     * @param {OIDCScopesListInterface} scope.
     *
     * @return {ResourceListActionInterface[]} Resolved list actions.
     */
    const resolveListActions = (scope: OIDCScopesListInterface): ResourceListActionInterface[] => {
        if (!showListItemActions) {
            return;
        }

        const actions: ResourceListActionInterface[] = [
            {
                hidden: !isFeatureEnabled(
                    featureConfig?.applications,
                    ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT")),
                icon: "pencil alternate",
                onClick: (): void => handleOIDCScopesEdit(scope.name),
                popupText: t("common:edit"),
                type: "button"
            }
        ];

        actions.push({
            hidden: !hasRequiredScopes(
                featureConfig?.applications,
                featureConfig?.applications?.scopes?.delete, allowedScopes),
            icon: "trash alternate",
            onClick: (): void => {
                setShowDeleteConfirmationModal(true);
                setDeletingScope(scope);
            },
            popupText: t("common:delete"),
            type: "button"
        });

        return actions;
    };


    return (
        <>
            <ResourceList
                className="applications-list"
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: defaultListItemLimit,
                    imageType: "square"
                } }
                selection={ selection }
                data-testid={ testId }
            >
                {
                    list && list instanceof Array && list.length > 0
                        ? list.map((scope, index: number) => {
                                return (
                                    <ResourceList.Item
                                        key={ index }
                                        id={ scope.name }
                                        actions={ resolveListActions(scope) }
                                        actionsFloated="right"
                                        avatar={
                                            <AnimatedAvatar
                                                name={ scope.name }
                                                size="mini"
                                                floated="left"
                                                data-testid={ `${ testId }-item-image` }
                                            />
                                        }
                                        itemHeader={ scope.name }
                                        onClick={
                                            (event: React.MouseEvent<HTMLAnchorElement>, data: ListItemProps) => {
                                                if (!selection) {
                                                    return;
                                                }

                                                handleOIDCScopesEdit(scope.name);
                                                onListItemClick(event, data);
                                            }
                                        }
                                        data-testid={ `${ testId }-item` }
                                    />
                                );
                        })
                        : null
                }
            </ResourceList>
            {
                deletingScope && (
                    <ConfirmationModal
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="warning"
                        open={ showDeleteConfirmationModal }
                        assertion={ deletingScope.name }
                        assertionHint={ (
                            <p>
                                <Trans
                                    i18nKey={
                                        "devPortal:components.oidcScopes.confirmationModals.deleteScope" +
                                        ".assertionHint"
                                    }
                                    tOptions={ { name: deletingScope.name } }
                                >
                                    Please type <strong>{ deletingScope.name }</strong> to confirm.
                                </Trans>
                            </p>
                        ) }
                        assertionType="input"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => handleOIDCScopeDelete(deletingScope.name) }
                        data-testid={ `${ testId }-delete-confirmation-modal` }
                    >
                        <ConfirmationModal.Header
                            data-testid={ `${ testId }-delete-confirmation-modal-header` }
                        >
                            { t("devPortal:components.oidcScopes.confirmationModals.deleteScope.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            warning
                            data-testid={ `${ testId }-delete-confirmation-modal-message` }
                        >
                            { t("devPortal:components.oidcScopes.confirmationModals.deleteScope.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content
                            data-testid={ `${ testId }-delete-confirmation-modal-content` }
                        >
                            { t("devPortal:components.oidcScopes.confirmationModals.deleteScope.content") }
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
OIDCScopeList.defaultProps = {
    "data-testid": "scope-list",
    selection: false,
    showListItemActions: true
};
