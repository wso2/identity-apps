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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, LoadableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    ContentLoader,
    EmptyPlaceholder,
    LinkButton,
    PrimaryButton,
    ResourceGrid
} from "@wso2is/react-components";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import React, {
    Fragment,
    FunctionComponent,
    MouseEvent,
    ReactElement,
    SyntheticEvent,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Icon, List } from "semantic-ui-react";
import { handleIDPDeleteError } from "./utils";
import { AuthenticatorExtensionsConfigInterface, identityProviderConfig } from "../../../extensions/configs";
import { getApplicationDetails } from "../../applications/api";
import { ApplicationBasicInterface } from "../../applications/models";
import {
    AppConstants,
    AppState,
    EventPublisher,
    FeatureConfigInterface,
    getEmptyPlaceholderIllustrations,
    history
} from "../../core";
import { deleteIdentityProvider, getIDPConnectedApps } from "../api";
import { IdentityProviderManagementConstants } from "../constants";
import { AuthenticatorMeta } from "../meta";
import {
    AuthenticatorInterface,
    ConnectedAppInterface,
    ConnectedAppsInterface,
    IdentityProviderInterface,
    StrictIdentityProviderInterface
} from "../models";
import { IdentityProviderManagementUtils } from "../utils";

/**
 * Proptypes for the Authenticators Grid component.
 */
interface AuthenticatorGridPropsInterface extends LoadableComponentInterface, TestableComponentInterface {

    /**
     * Is list filtering in progress.
     */
    isFiltering?: boolean;
    /**
     * Is Pagination in-progress.
     */
    isPaginating?: boolean;
    /**
     * Authenticators list.
     */
    authenticators: (IdentityProviderInterface | AuthenticatorInterface)[];
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
    /**
     * On authenticators list update callback.
     */
    onUpdate?: () => void;
}

/**
 * Authenticators Grid component.
 *
 * @param {AuthenticatorGridPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const AuthenticatorGrid: FunctionComponent<AuthenticatorGridPropsInterface> = (
    props: AuthenticatorGridPropsInterface
): ReactElement => {

    const {
        authenticators,
        isFiltering,
        isLoading,
        onEmptyListPlaceholderActionClick,
        onIdentityProviderDelete,
        onItemClick,
        onSearchQueryClear,
        searchQuery,
        onUpdate,
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
    const [ isAppsLoading, setIsAppsLoading ] = useState<boolean>(true);

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    /**
     * Redirects to the authenticator edit page when the edit button is clicked.
     *
     * @param {string} id - Authenticator ID.
     */
    const handleAuthenticatorEdit = (id: string): void => {

        history.push(AppConstants.getPaths().get("IDP_EDIT").replace(":id", id));
    };

    /**
     * Initiates the deletes of an authenticator. This will check for connected apps.
     *
     * @param {string} idpId - Identity provider id.
     */
    const handleAuthenticatorDeleteInitiation = (idpId: string): void => {

        setIsAppsLoading(true);

        getIDPConnectedApps(idpId)
            .then(async (response: ConnectedAppsInterface) => {
                if (response.count === 0) {
                    setDeletingIDP(authenticators.find(idp => idp.id === idpId));
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
     * Deletes an authenticator via the API.
     * @remarks ATM, IDP delete is only supported.
     *
     * @param {string} id - Authenticator ID.
     */
    const handleAuthenticatorDelete = (id: string): void => {

        deleteIdentityProvider(id)
            .then(() => {
                onUpdate();
                dispatch(addAlert({
                    description: t("console:develop.features.authenticationProvider." +
                        "notifications.deleteConnection.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.authenticationProvider.notifications." +
                        "deleteConnection.success.message")
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

        if (isLoading) {
            return null;
        }

        // When the search returns empty.
        if (searchQuery || isFiltering) {
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

        if (authenticators?.length === 0) {
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

    /**
     * Handles Grid Item click callback.
     *
     * @param {React.SyntheticEvent} e - Click event.
     * @param {IdentityProviderInterface | AuthenticatorInterface} authenticator - Clicked authenticator.
     */
    const handleGridItemOnClick = (e: SyntheticEvent, authenticator: IdentityProviderInterface
        | AuthenticatorInterface): void => {

        handleAuthenticatorEdit(authenticator.id);
        onItemClick && onItemClick(e, authenticator);
    };

    return (
        <Fragment>
            <ResourceGrid
                isLoading={ isLoading }
                isPaginating={ false }
                isEmpty={
                    (!authenticators
                    || !Array.isArray(authenticators)
                    || authenticators.length <= 0)
                }
                emptyPlaceholder={ showPlaceholders() }
            >
                {
                    authenticators?.map((authenticator: IdentityProviderInterface
                        | AuthenticatorInterface, index) => {

                        const authenticatorConfig: AuthenticatorExtensionsConfigInterface = get(identityProviderConfig
                            .authenticators, authenticator.id);

                        const isIdP: boolean = IdentityProviderManagementUtils
                            .isConnectorIdentityProvider(authenticator);

                        const isIdPDeletable: boolean = IdentityProviderManagementUtils
                            .isConnectorIdentityProvider(authenticator) ||
                            authenticator.type === "FEDERATED";

                        return (
                            <Fragment key={ index }>
                                <ResourceGrid.Card
                                    editButtonLabel={ t("common:setup") }
                                    onEdit={ (e: MouseEvent<HTMLButtonElement>) => {
                                        eventPublisher.compute(() => {
                                            eventPublisher.publish("connections-click-template-setup", { type:
                                                isIdP 
                                                    ? AuthenticatorMeta.getAuthenticatorTemplateName(
                                                        (authenticator as IdentityProviderInterface)
                                                            .federatedAuthenticators?.defaultAuthenticatorId)
                                                        ? AuthenticatorMeta.getAuthenticatorTemplateName(
                                                            (authenticator as IdentityProviderInterface)
                                                                .federatedAuthenticators?.defaultAuthenticatorId) 
                                                        : "other"
                                                    : AuthenticatorMeta.getAuthenticatorTemplateName(authenticator.id)
                                                        ? AuthenticatorMeta.
                                                            getAuthenticatorTemplateName(authenticator.id) 
                                                        : ""
                                            });
                                        });
                                        handleGridItemOnClick(e, authenticator);
                                    } }
                                    onDelete={ hasRequiredScopes(featureConfig?.identityProviders,
                                        featureConfig?.identityProviders?.scopes?.delete, allowedScopes)
                                        ? () => handleAuthenticatorDeleteInitiation(authenticator.id)
                                        : null
                                    }
                                    showActions={ true }
                                    showResourceEdit={ true }
                                    showResourceDelete={
                                        isIdPDeletable && !IdentityProviderManagementConstants.DELETING_FORBIDDEN_IDPS
                                            .includes(authenticator.name)
                                    }
                                    isResourceComingSoon={ authenticatorConfig?.isComingSoon }
                                    comingSoonRibbonLabel={ t("common:comingSoon") }
                                    resourceName={
                                        isIdP
                                            ? authenticator.name
                                            : (authenticator as AuthenticatorInterface).displayName
                                                    || (authenticator as AuthenticatorInterface).name
                                    }
                                    resourceCategory={
                                        AuthenticatorMeta.getAuthenticatorCategory(
                                            isIdP
                                                ? (authenticator as IdentityProviderInterface)
                                                    .federatedAuthenticators?.defaultAuthenticatorId
                                                : authenticator.id
                                        )
                                    }
                                    resourceDescription={
                                        !isEmpty(authenticator.description)
                                            ? authenticator.description
                                            : !isIdP
                                                ? AuthenticatorMeta.getAuthenticatorDescription(authenticator.id)
                                                : ""
                                    }
                                    resourceImage={
                                        authenticator.image ?? AuthenticatorMeta.getAuthenticatorIcon(authenticator.id)
                                    }
                                    tags={
                                        isIdP
                                            ? IdentityProviderManagementUtils.resolveIDPTags(
                                                (authenticator as IdentityProviderInterface).federatedAuthenticators)
                                            : (authenticator as AuthenticatorInterface).tags
                                    }
                                    data-testid={ `${ testId }-${ authenticator.name }` }
                                />
                            </Fragment>
                        );
                    })
                }
            </ResourceGrid>
            {
                deletingIDP && (
                    <ConfirmationModal
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="negative"
                        open={ showDeleteConfirmationModal }
                        assertion={ deletingIDP?.name }
                        assertionHint={ t("console:develop.features.authenticationProvider."+
                        "confirmations.deleteIDP.assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={
                            (): void => handleAuthenticatorDelete(deletingIDP.id)
                        }
                        data-testid={ `${ testId }-delete-confirmation-modal` }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header data-testid={ `${ testId }-delete-confirmation-modal-header` }>
                            { t("console:develop.features.authenticationProvider.confirmations.deleteIDP.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            negative
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
                        type="negative"
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
                        <ConfirmationModal.Message
                            attached
                            negative
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
 * Default proptypes for the component.
 */
AuthenticatorGrid.defaultProps = {
    "data-testid": "authenticator-grid"
};
