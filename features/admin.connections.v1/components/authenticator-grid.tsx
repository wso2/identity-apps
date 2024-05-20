/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
import { getApplicationDetails } from "@wso2is/admin.applications.v1/api";
import { AppState, EventPublisher, FeatureConfigInterface, history } from "@wso2is/admin.core.v1";
import {
    getEmptyPlaceholderIllustrations
} from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
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
import { AxiosError } from "axios";
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
import { Dispatch } from "redux";
import { getAuthenticatorList } from "./common";
import {
    deleteConnection,
    getConnectedApps
} from "../api/connections";
import { getConnectionIcons } from "../configs/ui";
import { AuthenticatorManagementConstants } from "../constants/autheticator-constants";
import { AuthenticatorMeta } from "../meta/authenticator-meta";
import {
    AuthenticatorExtensionsConfigInterface,
    AuthenticatorInterface
} from "../models/authenticators";
import {
    ApplicationBasicInterface,
    ConnectedAppInterface,
    ConnectedAppsInterface,
    ConnectionInterface,
    StrictConnectionInterface
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

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingIDP, setDeletingIDP ] = useState<StrictConnectionInterface>(undefined);
    const [ isDeletionloading, setIsDeletionLoading ] = useState(false);
    const [ connectedApps, setConnectedApps ] = useState<string[]>(undefined);
    const [
        showDeleteErrorDueToConnectedAppsModal,
        setShowDeleteErrorDueToConnectedAppsModal
    ] = useState<boolean>(false);
    const [ isConnectedAppsLoading, setIsConnectedAppsLoading ] = useState<boolean>(true);

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const productName: string = useSelector((state: AppState) => state?.config?.ui?.productName);

    const connectionResourcesUrl: string = UIConfig?.connectionResourcesUrl;

    /**
     * Redirects to the authenticator edit page when the edit button is clicked.
     *
     * @param id - Authenticator ID.
     */
    const handleAuthenticatorEdit = (id: string): void => {
        history.push(AppConstants.getPaths().get("IDP_EDIT").replace(":id", id));
    };

    /**
     * Returns if the identityProviders is readonly or not based on the scopes.
     *
     * @returns If Read Only or not.
     */
    const resolveReadOnlyState = (): boolean => {
        return !hasRequiredScopes(featureConfig?.identityProviders, featureConfig?.identityProviders?.scopes?.update,
            allowedScopes);
    };

    /**
     * Initiates the deletes of an authenticator. This will check for connected apps.
     *
     * @param idpId - Identity provider id.
     */
    const handleAuthenticatorDeleteInitiation = async (idpId: string): Promise<void> => {

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

                    const appRequests: Promise<any>[] = response.connectedApps.map((app: ConnectedAppInterface) => {
                        return getApplicationDetails(app.appId);
                    });

                    const results: ApplicationBasicInterface[] = await Promise.all(
                        appRequests.map((response: Promise<any>) => response
                        //TODO: Refactor to access description & message from error?.response?.data.
                            .catch((error: AxiosError & { description: string; message: string }) => {
                                dispatch(addAlert({
                                    description: error?.description
                                        || "Error occurred while trying to retrieve connected applications.",
                                    level: AlertLevels.ERROR,
                                    message: error?.message || "Error Occurred."
                                }));
                            }))
                    );

                    const appNames: string[] = [];

                    results.forEach((app: ApplicationBasicInterface) => {
                        appNames.push(app.name);
                    });

                    setConnectedApps(appNames);
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
     * Deletes an authenticator via the API.
     * @remarks ATM, IDP delete is only supported.
     *
     * @param id - Authenticator ID.
     */
    const handleAuthenticatorDelete = (id: string): void => {

        setIsDeletionLoading(true);

        deleteConnection(id)
            .then(() => {
                onConnectionUpdate();
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
                    authenticators?.map((authenticator: ConnectionInterface
                        | AuthenticatorInterface, index: number) => {

                        const authenticatorConfig: AuthenticatorExtensionsConfigInterface = get(
                            getAuthenticatorList(), authenticator.id);

                        const isIdP: boolean = ConnectionsManagementUtils
                            .isConnectorIdentityProvider(authenticator);

                        const isIdPDeletable: boolean = ConnectionsManagementUtils
                            .isConnectorIdentityProvider(authenticator) ||
                            authenticator.type === "FEDERATED";

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
                                    onDelete={ () => handleAuthenticatorDeleteInitiation(authenticator.id) }
                                    showActions={ true }
                                    showResourceEdit={ true }
                                    showResourceDelete={
                                        hasRequiredScopes(featureConfig?.identityProviders,
                                            featureConfig?.identityProviders?.scopes?.delete, allowedScopes) &&
                                        isIdPDeletable && !AuthenticatorManagementConstants.DELETING_FORBIDDEN_IDPS
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
                                                ? (authenticator as ConnectionInterface)
                                                    .federatedAuthenticators?.defaultAuthenticatorId
                                                : authenticator.id
                                        )
                                    }
                                    resourceDescription={
                                        !isEmpty(authenticator.description)
                                            ? authenticator?.description?.replaceAll("{{productName}}", productName)
                                            : !isIdP
                                                ? AuthenticatorMeta.getAuthenticatorDescription(authenticator.id)
                                                : ""
                                    }
                                    resourceDocumentationLink = { null }
                                    resourceImage={
                                        (authenticator?.type === "FEDERATED" || isIdP) && !isOrganizationSSOIDP
                                            ? authenticator?.image
                                                ? ConnectionsManagementUtils.resolveConnectionResourcePath(
                                                    connectionResourcesUrl, authenticator?.image)
                                                : getConnectionIcons().default
                                            : isOrganizationSSOIDP
                                                ? AuthenticatorMeta.getAuthenticatorIcon(
                                                    (authenticator as ConnectionInterface)
                                                        .federatedAuthenticators?.defaultAuthenticatorId)
                                                : AuthenticatorMeta.getAuthenticatorIcon(authenticator?.id)
                                    }
                                    tags={
                                        isIdP
                                            ? ConnectionsManagementUtils.resolveConnectionTags(
                                                (authenticator as ConnectionInterface).federatedAuthenticators)
                                            : (authenticator as AuthenticatorInterface).tags
                                    }
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
                            (): void => handleAuthenticatorDelete(deletingIDP.id)
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
