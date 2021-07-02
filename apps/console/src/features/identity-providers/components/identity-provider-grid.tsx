/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { AlertLevels, LoadableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    ConfirmationModal,
    ContentLoader,
    DataTable,
    EmptyPlaceholder, GenericIcon,
    LinkButton,
    PrimaryButton, ResourceGrid,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { Fragment, FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useState, MouseEvent } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Divider, Header, Icon, List, SemanticICONS } from "semantic-ui-react";
import { handleIDPDeleteError } from "./utils";
import { identityProviderConfig } from "../../../extensions/configs";
import { getApplicationDetails } from "../../applications/api";
import { ApplicationBasicInterface } from "../../applications/models";
import {
    AppConstants,
    UIConstants,
    getEmptyPlaceholderIllustrations,
    history
} from "../../core";
import { deleteIdentityProvider, getIDPConnectedApps } from "../api";
import { IdentityProviderManagementConstants } from "../constants";
import {
    ConnectedAppInterface,
    ConnectedAppsInterface, GenericAuthenticatorInterface,
    IdentityProviderInterface,
    IdentityProviderListResponseInterface,
    StrictIdentityProviderInterface
} from "../models";
import isEmpty from "lodash-es/isEmpty";
import { AuthenticatorMeta } from "../meta";
import { IdentityProviderManagementUtils } from "../utils";
import { getIdPIcons } from "../configs";

/**
 * Proptypes for the identity provider list component.
 */
interface IdentityProviderGridPropsInterface extends LoadableComponentInterface, TestableComponentInterface {

    /**
     * Advanced Search component.
     */
    advancedSearch?: ReactNode;
    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
    /**
     * IdP list.
     */
    list: IdentityProviderListResponseInterface;
    /**
     * Callback to be fired when clicked on the empty list placeholder action.
     */
    onEmptyListPlaceholderActionClick?: () => void;
    /**
     * On IdP delete callback.
     */
    onIdentityProviderDelete?: () => void;
    /**
     * On item select callback.
     * @param {React.SyntheticEvent} event - Click event.
     * @param {IdentityProviderInterface} idp - Selected IDP
     */
    onItemClick?: (event: SyntheticEvent, idp: IdentityProviderInterface) => void;
    /**
     * Callback for the search query clear action.
     */
    onSearchQueryClear?: () => void;
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
 * Identity Provider Grid component.
 *
 * @param {IdentityProviderGridPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const IdentityProviderGrid: FunctionComponent<IdentityProviderGridPropsInterface> = (
    props: IdentityProviderGridPropsInterface
): ReactElement => {

    const {
        advancedSearch,
        defaultListItemLimit,
        isLoading,
        list,
        onEmptyListPlaceholderActionClick,
        onIdentityProviderDelete,
        onItemClick,
        onSearchQueryClear,
        searchQuery,
        selection,
        showListItemActions,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingIDP, setDeletingIDP ] = useState<StrictIdentityProviderInterface>(undefined);
    const [ connectedApps, setConnectedApps ] = useState<string[]>(undefined);
    const [
        showDeleteErrorDueToConnectedAppsModal,
        setShowDeleteErrorDueToConnectedAppsModal
    ] = useState<boolean>(false);
    const [ isAppsLoading, setIsAppsLoading ] = useState(true);

    /**
     * Redirects to the identity provider edit page when the edit button is clicked.
     *
     * @param {string} idpId Identity provider id.
     */
    const handleIdentityProviderEdit = (idpId: string): void => {

        history.push(AppConstants.getPaths().get("IDP_EDIT").replace(":id", idpId));
    };

    /**
     * Deletes an identity provider when the delete identity provider button is clicked.
     *
     * @param {string} idpId Identity provider id.
     */
    const handleIdentityProviderDeleteAction = (idpId: string): void => {

        setIsAppsLoading(true);

        getIDPConnectedApps(idpId)
            .then(async (response: ConnectedAppsInterface) => {
                if (response.count === 0) {
                    setDeletingIDP(list.identityProviders.find(idp => idp.id === idpId));
                    setShowDeleteConfirmationModal(true);
                } else {
                    setShowDeleteErrorDueToConnectedAppsModal(true);

                    const appRequests: Promise<any>[] = response.connectedApps.map((app: ConnectedAppInterface) => {
                        return getApplicationDetails(app.appId);
                    });

                    const results: ApplicationBasicInterface[] = await Promise.all(
                        appRequests.map(response => response.catch(error => {
                            dispatch(addAlert({
                                description: error?.description
                                    || "Error occurred while trying to retrieve connected applications.",
                                level: AlertLevels.ERROR,
                                message: error?.message || "Error Occurred."
                            }));
                        }))
                    );

                    const appNames: string[] = [];

                    results.forEach((app) => {
                        appNames.push(app.name);
                    });

                    setConnectedApps(appNames);
                }
            })
            .catch((error) => {
                dispatch(addAlert({
                    description: error?.description
                        || "Error occurred while trying to retrieve connected applications.",
                    level: AlertLevels.ERROR,
                    message: error?.message || "Error Occurred."
                }));
            })
            .finally(() => {
                setIsAppsLoading(false);
            });
    };

    /**
     * Deletes an identity provider when the delete identity provider button is clicked.
     *
     * @param {string} idpId Identity provider id.
     */
    const handleIdentityProviderDelete = (idpId: string): void => {

        deleteIdentityProvider(idpId)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.authenticationProvider." +
                        "notifications.deleteIDP.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.authenticationProvider.notifications." +
                        "deleteIDP.success.message")
                }));
            })
            .catch((error) => {
                handleIDPDeleteError(error);
            })
            .finally(() => {
                setShowDeleteConfirmationModal(false);
                setDeletingIDP(undefined);
                onIdentityProviderDelete();
            });
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
                        <LinkButton onClick={ onSearchQueryClear }>Clear search query</LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("console:develop.features.authenticationProvider.placeHolders." +
                        "emptyIDPSearchResults.title") }
                    subtitle={ [
                        t("console:develop.features.authenticationProvider.placeHolders." +
                            "emptyIDPSearchResults.subtitles.0",
                            { searchQuery: searchQuery }),
                        t("console:develop.features.authenticationProvider.placeHolders." +
                            "emptyIDPSearchResults.subtitles.1")
                    ] }
                    data-testid={ `${ testId }-empty-search-placeholder` }
                />
            );
        }

        if (list?.totalResults === 0) {
            return (
                <EmptyPlaceholder
                    className="list-placeholder"
                    action={ onEmptyListPlaceholderActionClick && (
                        <PrimaryButton
                            onClick={ onEmptyListPlaceholderActionClick }
                        >
                            <Icon name="add"/>
                            { t("console:develop.features.authenticationProvider.buttons.addIDP") }
                        </PrimaryButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    subtitle={ [
                        t("console:develop.features.authenticationProvider.placeHolders.emptyIDPList.subtitles.0")
                    ] }
                    data-testid={ `${ testId }-empty-placeholder` }
                />
            );
        }

        return null;
    };
    
    const handleGridItemOnClick = (e: SyntheticEvent, authenticator: IdentityProviderInterface
        | GenericAuthenticatorInterface) => {

        handleIdentityProviderEdit(authenticator.id);
        onItemClick && onItemClick(e, authenticator);
    };

    return (
        <Fragment>
            <ResourceGrid
                isLoading={ isLoading }
                isEmpty={
                    (!list?.identityProviders
                    || !Array.isArray(list.identityProviders)
                    || list.identityProviders.length <= 0)
                }
                emptyPlaceholder={ showPlaceholders() }
            >
                {
                    list?.identityProviders?.map((authenticator: IdentityProviderInterface
                        | GenericAuthenticatorInterface, index) => {

                        const isAuthenticatorConfigsNotAvailable: boolean = identityProviderConfig.utils
                                .isConfigurableAuthenticator(authenticator.id)
                            && !identityProviderConfig.utils
                                .isAuthenticatorConfigurationsAvailable(authenticator.id);

                        const isIdP: boolean = IdentityProviderManagementUtils
                            .isConnectorIdentityProvider(authenticator);

                        return (
                            <ResourceGrid.Card
                                key={ index }
                                editButtonLabel={ t("common:setup") }
                                onEdit={ (e: MouseEvent<HTMLButtonElement>) => {
                                    handleGridItemOnClick(e, authenticator);
                                } }
                                onDelete={ () => handleIdentityProviderDeleteAction(authenticator.id) }
                                showActions={
                                    authenticator.id !== IdentityProviderManagementConstants.TOTP_AUTHENTICATOR_ID
                                }
                                showResourceEdit={ true }
                                showResourceDelete={
                                    isIdP && !IdentityProviderManagementConstants.DELETING_FORBIDDEN_IDPS
                                        .includes(authenticator.name)
                                }
                                isResourceComingSoon={ isAuthenticatorConfigsNotAvailable }
                                comingSoonRibbonLabel={ t("common:comingSoon") }
                                resourceName={
                                    isIdP
                                        ? authenticator.name
                                        : (authenticator as GenericAuthenticatorInterface).displayName
                                            ?? authenticator.name
                                }
                                resourceCategory={
                                    AuthenticatorMeta.getAuthenticatorCategory(
                                        isIdP
                                            ? (authenticator as IdentityProviderInterface)
                                                .federatedAuthenticators.defaultAuthenticatorId
                                            : (authenticator as GenericAuthenticatorInterface)
                                                .defaultAuthenticator.authenticatorId
                                    )
                                }
                                resourceDescription={
                                    !isEmpty(authenticator.description)
                                        ? authenticator.description
                                        : AuthenticatorMeta.getAuthenticatorDescription(
                                        isIdP
                                            ? (authenticator as IdentityProviderInterface)
                                                .federatedAuthenticators.defaultAuthenticatorId
                                            : (authenticator as GenericAuthenticatorInterface)
                                                .defaultAuthenticator.authenticatorId
                                        )
                                }
                                resourceImage={
                                    authenticator.image ?? AuthenticatorMeta.getAuthenticatorIcon(authenticator.id)
                                }
                                tags={
                                    AuthenticatorMeta.getAuthenticatorLabels(
                                        isIdP
                                            ? (authenticator as IdentityProviderInterface)
                                                .federatedAuthenticators.defaultAuthenticatorId
                                            : (authenticator as GenericAuthenticatorInterface)
                                                .defaultAuthenticator.authenticatorId
                                    )
                                }
                                data-testid={ `${ testId }-${ authenticator.name }` }
                            />
                        );
                    })
                }
            </ResourceGrid>
            {
                deletingIDP && (
                    <ConfirmationModal
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="warning"
                        open={ showDeleteConfirmationModal }
                        assertion={ deletingIDP?.name }
                        assertionHint={ (
                            <p>
                                <Trans
                                    i18nKey={ "console:develop.features.authenticationProvider."+
                                    "confirmations.deleteIDP.assertionHint" }
                                    tOptions={ { name: deletingIDP?.name } }
                                >
                                    Please type <strong>{ deletingIDP?.name }</strong> to confirm.
                                </Trans>
                            </p>
                        ) }
                        assertionType="input"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={
                            (): void => handleIdentityProviderDelete(deletingIDP.id)
                        }
                        data-testid={ `${ testId }-delete-confirmation-modal` }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header data-testid={ `${ testId }-delete-confirmation-modal-header` }>
                            { t("console:develop.features.authenticationProvider.confirmations.deleteIDP.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            warning
                            data-testid={ `${ testId }-delete-confirmation-modal-message` }
                        >
                            { t("console:develop.features.authenticationProvider.confirmations.deleteIDP.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content data-testid={ `${ testId }-delete-confirmation-modal-content` }>
                            { t("console:develop.features.authenticationProvider.confirmations.deleteIDP.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
            {
                showDeleteErrorDueToConnectedAppsModal && (
                    <ConfirmationModal
                        onClose={ (): void => setShowDeleteErrorDueToConnectedAppsModal(false) }
                        type="warning"
                        open={ showDeleteErrorDueToConnectedAppsModal }
                        secondaryAction={ t("common:close") }
                        onSecondaryActionClick={ (): void => setShowDeleteErrorDueToConnectedAppsModal(false) }
                        data-testid={ `${ testId }-delete-idp-confirmation` }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header data-testid={ `${ testId }-delete-idp-confirmation` }>
                            { t("console:develop.features.authenticationProvider.confirmations." +
                                "deleteIDPWithConnectedApps.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message attached warning
                                                   data-testid={ `${ testId }-delete-idp-confirmation` }>
                            { t("console:develop.features.authenticationProvider." +
                            "confirmations.deleteIDPWithConnectedApps.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content data-testid={ `${ testId }-delete-idp-confirmation` }>
                            { t("console:develop.features.authenticationProvider.confirmations." +
                                "deleteIDPWithConnectedApps.content") }
                            <Divider hidden />
                            <List ordered className="ml-6">
                                {
                                    isAppsLoading ? (
                                            <ContentLoader/>
                                        ) :
                                        connectedApps?.map((app, index) => {
                                            return (
                                                <List.Item key={ index }>{ app }</List.Item>
                                            );
                                        })
                                }
                            </List>
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </Fragment>
    );
};

/**
 * Default proptypes for the IDP list.
 */
IdentityProviderGrid.defaultProps = {
    "data-testid": "idp-grid",
    selection: true,
    showListItemActions: true
};
