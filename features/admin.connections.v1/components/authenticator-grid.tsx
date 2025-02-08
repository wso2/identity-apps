/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import Divider from "@oxygen-ui/react/Divider";
import List from "@oxygen-ui/react/List";
import ListItem from "@oxygen-ui/react/ListItem";
import { useRequiredScopes } from "@wso2is/access-control";
import { getApplicationDetails } from "@wso2is/admin.applications.v1/api/application";
import {
    getEmptyPlaceholderIllustrations
} from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { EventPublisher } from "@wso2is/admin.core.v1/utils/event-publisher";
import { FeatureStatusLabel } from "@wso2is/admin.feature-gate.v1/models/feature-status";
import {
    deleteIdentityVerificationProvider
} from "@wso2is/admin.identity-verification-providers.v1/api/identity-verification-provider";
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
import { AxiosError, AxiosResponse } from "axios";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import React, {
    Fragment,
    FunctionComponent,
    MouseEvent,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import {
    deleteConnection,
    deleteCustomAuthentication,
    getConnectedApps
} from "../api/connections";
import { useGetAuthenticatorConnectedApps } from "../api/use-get-authenticator-connected-apps";
import { getConnectionIcons } from "../configs/ui";
import { AuthenticatorMeta } from "../meta/authenticator-meta";
import {
    AuthenticatorCategories,
    AuthenticatorExtensionsConfigInterface,
    AuthenticatorInterface,
    AuthenticatorTypes
} from "../models/authenticators";
import {
    ApplicationBasicInterface,
    ConnectedAppInterface,
    ConnectedAppsInterface,
    ConnectionInterface,
    ConnectionTypes
} from "../models/connection";
import { ConnectionsManagementUtils, handleConnectionDeleteError } from "../utils/connection-utils";

/**
 * Proptypes for the Authenticators Grid component.
 */
interface AuthenticatorGridPropsInterface extends
    LoadableComponentInterface, TestableComponentInterface {

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
    authenticators: (ConnectionInterface | AuthenticatorInterface)[];
    /**
     * Callback to be fired when clicked on the empty list placeholder action.
     */
    onEmptyListPlaceholderActionClick?: () => void;
    /**
     * On connection delete callback.
     */
    onConnetionDelete?: () => void;
    /**
     * On item select callback.
     * @param event - Click event.
     * @param idp - Selected IDP.
     */
    onItemClick?: (event: SyntheticEvent, idp: ConnectionInterface) => void;
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
    onConnectionUpdate?: () => void;
}

/**
 * Authenticators Grid component.
 *
 * @param props - Props injected to the component.
 *
 * @returns React element.
 */
export const AuthenticatorGrid: FunctionComponent<AuthenticatorGridPropsInterface> = (
    props: AuthenticatorGridPropsInterface
): ReactElement => {

    const {
        authenticators,
        isFiltering,
        isLoading,
        onEmptyListPlaceholderActionClick,
        onItemClick,
        onSearchQueryClear,
        searchQuery,
        onConnectionUpdate,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();
    const eventPublisher: EventPublisher = EventPublisher.getInstance();
    const { UIConfig } = useUIConfig();
    const hiddenAuthenticators: string[] = [ ...(UIConfig?.hiddenAuthenticators ?? []) ];

    const [ displayingAuthenticators, setDisplayingAuthenticators ] = useState<
        (ConnectionInterface | AuthenticatorInterface)[]>([]);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingIDP, setDeletingIDP ] = useState<ConnectionInterface>(undefined);
    const [ deletingAuthenticatorId, setDeletingAuthenticatorId ] = useState<string>(undefined);
    const [ isDeletionloading, setIsDeletionLoading ] = useState(false);
    const [ connectedApps, setConnectedApps ] = useState<string[]>(undefined);
    const [
        showDeleteErrorDueToConnectedAppsModal,
        setShowDeleteErrorDueToConnectedAppsModal
    ] = useState<boolean>(false);
    const [ isConnectedAppsLoading, setIsConnectedAppsLoading ] = useState<boolean>(true);
    const [ shouldFetchLocalAuthenticatorConnectedApps, setShouldFetchLocalAuthenticatorConnectedApps ] =
        useState<boolean>(false);

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const productName: string = useSelector((state: AppState) => state?.config?.ui?.productName);

    const hasConnectionUpdatePermission: boolean = useRequiredScopes(featureConfig?.identityProviders?.scopes?.update);
    const hasConnectionDeletePermission: boolean = useRequiredScopes(featureConfig?.identityProviders?.scopes?.delete);
    const hasIdVPDeletePermission: boolean = useRequiredScopes(
        featureConfig?.identityVerificationProviders?.scopes?.delete
    );

    const connectionResourcesUrl: string = UIConfig?.connectionResourcesUrl;

    const {
        data: connectedAppsOfLocalAuthenticator,
        isLoading: isLoadingConnectedAppsOfLocalAuthenticator
    } = useGetAuthenticatorConnectedApps(deletingAuthenticatorId, shouldFetchLocalAuthenticatorConnectedApps);

    useEffect(() => {
        const shownAuthenticatorList: (ConnectionInterface | AuthenticatorInterface)[] =
            authenticators.filter((authenticator:ConnectionInterface | AuthenticatorInterface)  => {
                return !hiddenAuthenticators.includes(authenticator.name);
            });

        setDisplayingAuthenticators(shownAuthenticatorList);
    }, [ authenticators ]);

    /**
     * This use effect initiates custom local authenticator delete action.
     *
     * This ensures that the deletion is initiated only after the connected apps are fetched.
     * Initializing the delete process before the connected apps are fetched will result in unintended behavior.
     */
    useEffect(() => {
        connectedAppsOfLocalAuthenticator &&
            handleLocalAuthenticatorDeleteInitiation(deletingAuthenticatorId);
    }, [ connectedAppsOfLocalAuthenticator, deletingAuthenticatorId ]);

    const checkCustomLocalAuthenticator = (authenticator: ConnectionInterface): boolean => {
        return (
            ConnectionsManagementUtils.IsCustomAuthenticator(authenticator) &&
            authenticator?.type === AuthenticatorTypes.LOCAL
        );
    };

    /**
     * Redirects to the authenticator edit page when the edit button is clicked.
     *
     * @param id - Authenticator ID.
     */
    const handleAuthenticatorEdit = (id: string, connectionType: string, isCustom?: boolean): void => {
        switch (connectionType) {
            case ConnectionTypes.IDVP:
                history.push(AppConstants.getPaths().get("IDVP_EDIT").replace(":id", id));

                break;

            case AuthenticatorCategories.LOCAL:
                if (isCustom) {
                    history.push(AppConstants.getPaths().get("AUTH_EDIT").replace(":id", id));
                } else {
                    history.push(AppConstants.getPaths().get("IDP_EDIT").replace(":id", id));

                }

                break;

            default:
                history.push(AppConstants.getPaths().get("IDP_EDIT").replace(":id", id));

                break;
        }
    };

    /**
     * Returns if the identityProviders is readonly or not based on the scopes.
     *
     * @returns If Read Only or not.
     */
    const resolveReadOnlyState = (): boolean => {
        return !hasConnectionUpdatePermission;
    };

    /**
     * Initiates the deletes of an authenticator. This will check for connected apps.
     *
     * @param idpId - Identity provider id.
     * @param connectionType - Connection type.
     */
    const handleAuthenticatorDeleteInitiation = async (idpId: string, connectionType: string,
        isCustomLocalAuthenticator?: boolean): Promise<void> => {

        // If the connection is an Identity Verification Provider, then skip checking for connected apps.
        if (connectionType === ConnectionTypes.IDVP) {
            setDeletingIDP(authenticators.find(
                (idp: ConnectionInterface | AuthenticatorInterface) => idp.id === idpId)
            );
            setShowDeleteConfirmationModal(true);

            return;
        }

        // If the connection is a custom local authenticator, then check for connected apps through a custom hook.
        if (isCustomLocalAuthenticator) {
            setDeletingAuthenticatorId(idpId);
            setShouldFetchLocalAuthenticatorConnectedApps(true);

            return;
        }

        handleFederatedAuthenticatorDeleteInitiation(idpId);
    };

    /**
     * This method fetches connected app details of the authenticator to be deleted and
     * displays the modal with the connected app details.
     */
    const loadConnectedAppDetails = async (response: ConnectedAppsInterface): Promise<void> => {
        const appRequests: Promise<any>[] = response.connectedApps.map((app: ConnectedAppInterface) => {
            return getApplicationDetails(app.appId);
        });

        const results: ApplicationBasicInterface[] = await Promise.all(
            appRequests.map((response: Promise<any>) =>
                response.catch((error: AxiosError & { description: string; message: string }) => {
                    dispatch(
                        addAlert({
                            description: error?.description || t("idp:connectedApps.genericError.description"),
                            level: AlertLevels.ERROR,
                            message: error?.message || t("idp:connectedApps.genericError.message")
                        })
                    );
                })
            )
        );

        const appNames: string[] = [];

        results.forEach((app: ApplicationBasicInterface) => {
            appNames.push(app.name);
        });

        setConnectedApps(appNames);
    };

    /**
     * This method handles the initiation of the delete action for federated authenticators.
     *
     * @param idpId - Identity provider id.
     */
    const handleFederatedAuthenticatorDeleteInitiation = async (idpId: string): Promise<void> => {
        setIsConnectedAppsLoading(true);

        getConnectedApps(idpId)
            .then(async (response: ConnectedAppsInterface) => {
                if (response.count === 0) {
                    setDeletingIDP(authenticators.find(
                        (idp: ConnectionInterface | AuthenticatorInterface) => idp.id === idpId)
                    );
                    setShowDeleteConfirmationModal(true);
                } else {
                    setShowDeleteErrorDueToConnectedAppsModal(true);
                    loadConnectedAppDetails(response);
                }
            })
            .catch((error: AxiosError & { description: string; message: string }) => {
                dispatch(addAlert({
                    description: error?.description
                        || t("idp:connectedApps.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message || t("idp:connectedApps.genericError.message")
                }));
            })
            .finally(() => {
                setIsConnectedAppsLoading(false);
            });
    };

    /**
     * This method handles the initiation of the delete action for local authenticators.
     *
     * Currently only custom local authenticator deletion is supported.
     * System defined authenticators cannot be deleted.
     */
    const handleLocalAuthenticatorDeleteInitiation = async (authenticatorId: string): Promise<void> => {
        connectedAppsOfLocalAuthenticator ? setIsConnectedAppsLoading(false) : setIsConnectedAppsLoading(true);

        if (isLoadingConnectedAppsOfLocalAuthenticator || !connectedAppsOfLocalAuthenticator) {
            return;
        }

        if (connectedAppsOfLocalAuthenticator?.count === 0) {
            setDeletingIDP(
                authenticators.find((idp: ConnectionInterface | AuthenticatorInterface) => idp.id === authenticatorId)
            );
            setShowDeleteConfirmationModal(true);
        } else {
            setIsConnectedAppsLoading(true);

            setShowDeleteErrorDueToConnectedAppsModal(true);
            loadConnectedAppDetails(connectedAppsOfLocalAuthenticator);

            setIsConnectedAppsLoading(false);
            setShouldFetchLocalAuthenticatorConnectedApps(false);
        };
    };

    /**
     * Deletes an authenticator via the API.
     * @remarks ATM, IDP and custom local authenticator delete is only supported.
     *
     * @param id - Authenticator ID.
     */
    const handleAuthenticatorDelete = (id: string, connectionType: ConnectionTypes): void => {

        setIsDeletionLoading(true);

        let deleteAuthenticator: (id: string) => Promise<AxiosResponse>;

        if(connectionType === ConnectionTypes.IDVP) {
            deleteAuthenticator = deleteIdentityVerificationProvider;
        } else if (checkCustomLocalAuthenticator(deletingIDP)) {
            deleteAuthenticator = deleteCustomAuthentication;
        } else {
            deleteAuthenticator = deleteConnection;
        }

        deleteAuthenticator(id)
            .then(() => {
                dispatch(addAlert({
                    description: t("authenticationProvider:" +
                        "notifications.deleteConnection.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("authenticationProvider:notifications." +
                        "deleteConnection.success.message")
                }));
            })
            .catch((error: AxiosError) => {
                handleConnectionDeleteError(error);
            })
            .finally(() => {
                setIsDeletionLoading(false);
                setShowDeleteConfirmationModal(false);
                setDeletingIDP(undefined);
                onConnectionUpdate();
            });
    };

    /**
     * Resolve the relevant placeholder.
     *
     * @returns React element.
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
                    title={ t("authenticationProvider:placeHolders." +
                        "emptyIDPSearchResults.title") }
                    subtitle={ [
                        t("authenticationProvider:placeHolders." +
                            "emptyIDPSearchResults.subtitles.0",
                        { searchQuery: searchQuery }),
                        t("authenticationProvider:placeHolders." +
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
                            { t("authenticationProvider:buttons.addIDP") }
                        </PrimaryButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    subtitle={ [
                        t("authenticationProvider:placeHolders.emptyIDPList.subtitles.0")
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
     * @param e - Click event.
     * @param authenticator - Clicked authenticator.
     */
    const handleGridItemOnClick = (e: SyntheticEvent, authenticator: ConnectionInterface
        | AuthenticatorInterface): void => {

        handleAuthenticatorEdit(authenticator.id, authenticator.type,
            ConnectionsManagementUtils.IsCustomAuthenticator(authenticator));
        onItemClick && onItemClick(e, authenticator);
    };

    /**
     * Checks if the delete button should be enabled.
     *
     * @param authenticator - Authenticator.
     * @returns - True if the delete button is enabled, false otherwise.
     */
    const isDeleteEnabled = (authenticator: ConnectionInterface): boolean => {
        if (authenticator.type === ConnectionTypes.IDVP) {
            return hasIdVPDeletePermission;
        }

        if (!hasConnectionDeletePermission) {
            return false;
        }

        return ConnectionsManagementUtils.isConnectorIdentityProvider(authenticator) ||
        (authenticator as ConnectionInterface).type === AuthenticatorTypes.FEDERATED ||
        ConnectionsManagementUtils.IsCustomAuthenticator(authenticator) ;
    };

    /**
     * Resolves the image path for the given connection.
     *
     * @param connection - Connection.
     * @param isIdP - Whether the connection is an IDP.
     * @param isOrganizationSSOIDP - Whether the connection is an organization SSO IDP.
     * @returns - Resolved image element.
     */
    const resolveResourceImage = (
        connection: ConnectionInterface,
        isIdP: boolean,
        isOrganizationSSOIDP: boolean
    ): string => {
        if (connection.type === ConnectionTypes.IDVP) {
            return connection?.image ? ConnectionsManagementUtils
                .resolveConnectionResourcePath(connectionResourcesUrl, connection.image)
                : getConnectionIcons().default;
        }

        if ((connection?.type === AuthenticatorTypes.FEDERATED || isIdP) && !isOrganizationSSOIDP) {
            return connection?.image
                ? ConnectionsManagementUtils.resolveConnectionResourcePath(connectionResourcesUrl, connection.image)
                : getConnectionIcons().default;
        }

        if (isOrganizationSSOIDP) {
            return AuthenticatorMeta.getAuthenticatorIcon(
                (connection as ConnectionInterface)?.federatedAuthenticators?.defaultAuthenticatorId
            );
        }

        if (ConnectionsManagementUtils.IsCustomAuthenticator(connection)) {
            return connection?.image || AuthenticatorMeta.getCustomAuthenticatorIcon();
        }

        return AuthenticatorMeta.getAuthenticatorIcon(connection?.id);
    };

    const resolveAuthenticatorDescription = (authenticator: ConnectionInterface, isIdP: boolean): string => {
        if (checkCustomLocalAuthenticator(authenticator)) {
            return authenticator.description;
        }

        return !isEmpty(authenticator.description)
            ? authenticator?.description?.replaceAll("{{productName}}", productName)
            : !isIdP
                ? AuthenticatorMeta.getAuthenticatorDescription(authenticator.id)
                : "";
    };

    return (
        <Fragment>
            <ResourceGrid
                isLoading={ isLoading }
                isPaginating={ false }
                isEmpty={
                    (!displayingAuthenticators
                    || !Array.isArray(displayingAuthenticators)
                    || displayingAuthenticators.length <= 0)
                }
                emptyPlaceholder={ showPlaceholders() }
            >
                {
                    displayingAuthenticators?.map((authenticator: ConnectionInterface
                        | AuthenticatorInterface, index: number) => {

                        const authenticatorConfig: AuthenticatorExtensionsConfigInterface = get(
                            AuthenticatorMeta.getAuthenticators(), authenticator.id);

                        const isIdP: boolean = ConnectionsManagementUtils
                            .isConnectorIdentityProvider(authenticator);

                        const isOrganizationSSOIDP: boolean = ConnectionsManagementUtils
                            .isOrganizationSSOConnection((authenticator as ConnectionInterface)
                                .federatedAuthenticators?.defaultAuthenticatorId);

                        return (
                            <Fragment key={ index }>
                                <ResourceGrid.Card
                                    editButtonLabel={ resolveReadOnlyState() ? t("common:view") : t("common:setup") }
                                    onEdit={ (e: MouseEvent<HTMLButtonElement>) => {
                                        eventPublisher.compute(() => {
                                            eventPublisher.publish("connections-click-template-setup", { type:
                                                isIdP
                                                    ? AuthenticatorMeta.getAuthenticatorTemplateName(
                                                        (authenticator as ConnectionInterface)
                                                            .federatedAuthenticators?.defaultAuthenticatorId)
                                                        ? AuthenticatorMeta?.getAuthenticatorTemplateName(
                                                            (authenticator as ConnectionInterface)
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
                                    onDelete={ () => handleAuthenticatorDeleteInitiation(
                                        authenticator.id,
                                        authenticator.type,
                                        checkCustomLocalAuthenticator(authenticator)
                                    ) }
                                    showActions={ true }
                                    showResourceEdit={ true }
                                    showResourceDelete={ isDeleteEnabled(authenticator) }
                                    isResourceComingSoon={ authenticatorConfig?.isComingSoon }
                                    comingSoonRibbonLabel={ t(FeatureStatusLabel.COMING_SOON) }
                                    resourceName={
                                        isIdP
                                            ? authenticator.name
                                            : (authenticator as AuthenticatorInterface).displayName
                                                    || (authenticator as AuthenticatorInterface).name
                                    }
                                    resourceCategory={
                                        AuthenticatorMeta.getAuthenticatorCategory(
                                            isIdP
                                                ? (authenticator as ConnectionInterface)
                                                    .federatedAuthenticators?.defaultAuthenticatorId
                                                : authenticator.id
                                        )
                                    }
                                    resourceDescription={ resolveAuthenticatorDescription(authenticator, isIdP) }
                                    resourceDocumentationLink = { null }
                                    resourceImage={ resolveResourceImage(authenticator, isIdP, isOrganizationSSOIDP) }
                                    tags={ (authenticator as AuthenticatorInterface).tags }
                                    data-testid={ `${ testId }-${ authenticator.name }` }
                                    showResourceAction={ false }
                                    showSetupGuideButton={ false }
                                />
                            </Fragment>
                        );
                    })
                }
            </ResourceGrid>
            {
                deletingIDP && (
                    <ConfirmationModal
                        primaryActionLoading ={ isDeletionloading }
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="negative"
                        open={ showDeleteConfirmationModal }
                        assertion={ deletingIDP?.name }
                        assertionHint={ t("authenticationProvider:"+
                        "confirmations.deleteIDP.assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={
                            (): void => handleAuthenticatorDelete(deletingIDP.id, deletingIDP.type as ConnectionTypes)
                        }
                        data-testid={ `${ testId }-delete-confirmation-modal` }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header data-testid={ `${ testId }-delete-confirmation-modal-header` }>
                            { t("authenticationProvider:confirmations.deleteIDP.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            negative
                            data-testid={ `${ testId }-delete-confirmation-modal-message` }
                        >
                            { t("authenticationProvider:confirmations.deleteIDP.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content data-testid={ `${ testId }-delete-confirmation-modal-content` }>
                            { t("authenticationProvider:confirmations.deleteIDP.content") }
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
                            { t("authenticationProvider:confirmations." +
                                "deleteIDPWithConnectedApps.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            negative
                            data-testid={ `${ testId }-delete-idp-confirmation` }>
                            { t("authenticationProvider:" +
                            "confirmations.deleteIDPWithConnectedApps.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content data-testid={ `${ testId }-delete-idp-confirmation` }>
                            { t("authenticationProvider:confirmations." +
                                "deleteIDPWithConnectedApps.content") }
                            <Divider hidden />
                            <List className="ml-6">
                                {
                                    isConnectedAppsLoading ? (
                                        <ContentLoader/>
                                    ) :
                                        connectedApps?.map((app: string, index: number) => {
                                            return (
                                                <ListItem key={ index }>{ app }</ListItem>
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
