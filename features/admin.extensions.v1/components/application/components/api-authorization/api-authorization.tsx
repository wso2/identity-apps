/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    DocumentationLink,
    EmphasizedSegment,
    Heading,
    Popup,
    PrimaryButton,
    useDocumentation
} from "@wso2is/react-components";
import { RequestErrorInterface } from "../../../../../admin.core.v1/hooks/use-request";
import { AxiosError } from "axios";
import React, {
    Fragment,
    FunctionComponent,
    ReactElement,
    useEffect,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid, Icon } from "semantic-ui-react";
import { SubscribedAPIResources } from ".";
import { AuthorizeAPIResource } from "./wizard";
import { AppState, history } from "../../../../../admin.core.v1";
import { ExtendedFeatureConfigInterface } from "../../../../configs/models";
import { useAPIResources } from "../../../api-resources/api";
import { APIResourcesConstants } from "../../../api-resources/constants";
import { APIResourceUtils } from "../../../api-resources/utils/api-resource-utils";
import {
    createAuthorizedAPIResource,
    searchAPIResources,
    unsubscribeAPIResources,
    useSubscribedAPIResources
} from "../../api";
import { 
    AuthorizedAPIListItemInterface, 
    AuthorizedPermissionListItemInterface, 
    SearchedAPIListItemInterface 
} from "../../models";

/**
 * Prop types for the API resources list component.
 */
interface APIAuthorizationProps extends
    SBACInterface<ExtendedFeatureConfigInterface>, IdentifiableComponentInterface {
    /**
     * Is the application a choreo application.
     */
    isChoreoApp: boolean;
}

/**
 * Application roles component.
 * 
 * @param props - Props related to application roles component.
 */
export const APIAuthorization: FunctionComponent<APIAuthorizationProps> = (
    props: APIAuthorizationProps
): ReactElement => {

    const {
        isChoreoApp,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const { getLink } = useDocumentation();

    const [ isSubAPIResourcesSectionLoading, setSubAPIResourcesSectionLoading ] = useState<boolean>(false);
    const [ isShownError, setIsShownError ] = useState<boolean>(false);
    const [ removeSubscribedAPIResource, setRemoveSubscribedAPIResource ] = 
        useState<AuthorizedAPIListItemInterface>(null);
    const [ isUnsubscribeAPIResourceLoading, setIsUnsubscribeAPIResourceLoading ] = useState<boolean>(false);
    const [ isAuthorizeAPIResourceWizardOpen, setIsAuthorizeAPIResourceWizardOpen ] = useState<boolean>(false);
    const [ isUpdateData, setIsUpdateData ] = useState<boolean>(false);
    const [ allAuthorizedScopes, setAllAuthorizedScopes ] = useState<AuthorizedPermissionListItemInterface[]>([]);
    const [ isAllAPIsSubscribed, setIsAllAPIsSubscribed ] = useState<boolean>(false);
    const [ hideAuthorizeAPIResourceButton, setHideAuthorizeAPIResourceButton ] = useState<boolean>(true);
    const [ isSearchAPIResourcesLoading, setIsSearchAPIResourcesLoading ] = useState<boolean>(false);
    const [ updatedSubscribedAPIResourcesList, setUpdatedSubscribedAPIResourcesList ] =
        useState<AuthorizedAPIListItemInterface[]>([]);

    const featureConfig: ExtendedFeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const path: string[] = history.location.pathname.split("/");
    const appId: string = path[path.length - 1].split("#")[0];
    const apiResourcesSearchAttributes: string[] = [ "gwName", "permissions" ];

    const {
        data: allAPIResourcesListData,
        isLoading: isAllAPIResourcesListLoading,
        error: allAPIResourcesFetchRequestError,
        mutate: mutateAllAPIResourcesList
    } = useAPIResources();

    const {
        data: subscribedAPIResourcesListData,
        isLoading: isSubscribedAPIResourcesListLoading,
        isValidating: isSubscribedAPIResourcesListValidating,
        error: subscribedAPIResourcesFetchRequestError,
        mutate: mutateSubscribedAPIResourcesList
    } = useSubscribedAPIResources(appId);

    /**
     * Handles the is shown placeholders
     */
    const isShownPlaceholder: boolean = !!subscribedAPIResourcesFetchRequestError
        || !!allAPIResourcesFetchRequestError
        || allAPIResourcesListData?.apiResources.length === 0 
        || updatedSubscribedAPIResourcesList?.length === 0;

    /**
     * Handles the search API resources.
     */
    const handleSearchAPIResources = (): void => {
        
        setIsSearchAPIResourcesLoading(true);

        const subscribedAPIResourcesIdsList: string[] = subscribedAPIResourcesListData.map(
            (apiResource: AuthorizedAPIListItemInterface) => apiResource.apiId);

        searchAPIResources(subscribedAPIResourcesIdsList, apiResourcesSearchAttributes)
            .then((data: SearchedAPIListItemInterface[]) => {
                const subscribedAPIResourcesList: AuthorizedAPIListItemInterface[] =
                        subscribedAPIResourcesListData.map((apiResource: AuthorizedAPIListItemInterface) => {
                            const searchedAPIResource: SearchedAPIListItemInterface = data.find(
                                (searchedAPIResource: SearchedAPIListItemInterface) => 
                                    searchedAPIResource.id === apiResource.apiId);

                            apiResource.isChoreoAPI = 
                                APIResourceUtils.checkIfAPIResourceManagedByChoreo(searchedAPIResource?.gwName);    

                            apiResource.allPermissions = searchedAPIResource?.permissions;
                            
                            return apiResource;
                        } );

                setUpdatedSubscribedAPIResourcesList(subscribedAPIResourcesList);
            })
            .catch(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:develop.applications.edit.sections.apiAuthorization." +
                            "sections.apiSubscriptions.notifications.createAuthorizedAPIResource." + 
                            "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                            ".apiSubscriptions.notifications.createAuthorizedAPIResource.genericError.message")
                }));
            })
            .finally(() => {
                setIsSearchAPIResourcesLoading(false);
            });
    };

    /**
     * Handles the search API resources.
     */
    useEffect(() => {
        if(!isSubscribedAPIResourcesListValidating && subscribedAPIResourcesListData?.length > 0) {
            handleSearchAPIResources();
        } else {
            subscribedAPIResourcesListData
                ? setUpdatedSubscribedAPIResourcesList(subscribedAPIResourcesListData)
                : setUpdatedSubscribedAPIResourcesList([]);
        }
    }, [ subscribedAPIResourcesListData ]);

    /**
     * The following useEffect is used to handle if any error occurs while fetching API resources.
     */
    useEffect(() => {
        if (allAPIResourcesFetchRequestError || subscribedAPIResourcesFetchRequestError) {
            setHideAuthorizeAPIResourceButton(true);
            if (!isShownError) {
                setIsShownError(true);

                const error: AxiosError<RequestErrorInterface> = 
                    allAPIResourcesFetchRequestError 
                        ? allAPIResourcesFetchRequestError 
                        : subscribedAPIResourcesFetchRequestError;

                switch (error.response?.data?.code) {
                    case APIResourcesConstants.UNAUTHORIZED_ACCESS:
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.apiResource.notifications.getAPIResources" +
                                ".unauthorizedError.description"),
                            level: AlertLevels.ERROR,
                            message: t("extensions:develop.apiResource.notifications.getAPIResources" +
                                ".unauthorizedError.message")
                        }));

                        break;

                    default:
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.apiResource.notifications.getAPIResources" +
                                ".genericError.description"),
                            level: AlertLevels.ERROR,
                            message: t("extensions:develop.apiResource.notifications.getAPIResources" +
                                ".genericError.message")
                        }));
                }
            }
        }
    }, [ allAPIResourcesFetchRequestError, subscribedAPIResourcesFetchRequestError ]);

    /**
     * The following useEffect is used to handle loading state of when API resources are being fetched.
     */
    useEffect(() => {
        setSubAPIResourcesSectionLoading(
            isUpdateData || 
            isAllAPIResourcesListLoading || 
            isSubscribedAPIResourcesListLoading ||
            isSearchAPIResourcesLoading
        );
    }, [ isUpdateData, isAllAPIResourcesListLoading, isSubscribedAPIResourcesListLoading, 
        isSearchAPIResourcesLoading ]);

    /**
     * Initalize the all authorized scopes.
     */
    useEffect(() => {
        if (updatedSubscribedAPIResourcesList?.length > 0) {
            let authorizedScopes: AuthorizedPermissionListItemInterface[] = [];
            
            updatedSubscribedAPIResourcesList.forEach((subscribedAPIResource: AuthorizedAPIListItemInterface) => {
                authorizedScopes = authorizedScopes.concat(subscribedAPIResource.permissions);
            });
            
            setAllAuthorizedScopes(authorizedScopes);
        }
    }, [ updatedSubscribedAPIResourcesList ]);

    /**
     * The following useEffect is used to update the API resources list once a mutate function is called.
     */
    useEffect(() => {
        if (isUpdateData) {
            mutateAllAPIResourcesList();
            mutateSubscribedAPIResourcesList();
            setIsUpdateData(false);
        }
    }, [ isUpdateData ]);

    /**
     * Set is all APIs subscribed.
     */
    useEffect(() => {
        if (allAPIResourcesListData && updatedSubscribedAPIResourcesList) {
            setIsAllAPIsSubscribed(allAPIResourcesListData.apiResources?.length 
                === updatedSubscribedAPIResourcesList.length);
        }
    }, [ allAPIResourcesListData, updatedSubscribedAPIResourcesList ]);

    /**
     * Check scopes available for update API resources or when the application is choreo app.
     * 
     * @returns `true` if scopes are available for update API resources or when the application is not choreo app
     *         else `false`.
     */
    const isScopesAvailableForUpdate = (): boolean => {
        return hasRequiredScopes(featureConfig?.applications,
            featureConfig?.applications?.scopes?.update, allowedScopes);
    };

    /**
     * Set hide authorize API resource button.
     */
    useEffect(() => {
        const isScopesAvailable: boolean = isScopesAvailableForUpdate();
        const hideAuthorizeAPIResourceButton: boolean = !isScopesAvailable
           || allAPIResourcesListData?.apiResources?.length === 0 
           || updatedSubscribedAPIResourcesList?.length === 0;

        setHideAuthorizeAPIResourceButton(hideAuthorizeAPIResourceButton);
    }, [ featureConfig, allAPIResourcesListData, updatedSubscribedAPIResourcesList ]);

    /**
     * Handles unsubscribe API resource.
     *
     * @returns `void`
     */
    const handleAPIResourceUnsubscribe = (): void => {

        setIsUnsubscribeAPIResourceLoading(true);
        unsubscribeAPIResources(appId, removeSubscribedAPIResource?.apiId)
            .then(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:develop.applications.edit.sections." +
                        "apiAuthorization.sections.apiSubscriptions.notifications.unSubscribe.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.notifications.unSubscribe.success.message")
                }));

                setIsUnsubscribeAPIResourceLoading(false);
                setIsUpdateData(true);
            })
            .catch((error: IdentityAppsApiException) => {
                switch(error?.code) {
                    case APIResourcesConstants.UNAUTHORIZED_ACCESS:
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                                ".apiSubscriptions.notifications.unSubscribe.unauthorizedError.description"),
                            level: AlertLevels.ERROR,
                            message: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                                ".apiSubscriptions.notifications.unSubscribe.unauthorizedError.message")
                        }));

                        break;
                        
                    case APIResourcesConstants.NO_VALID_API_RESOURCE_ID_FOUND:
                    case APIResourcesConstants.API_RESOURCE_NOT_FOUND:
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                                ".apiSubscriptions.notifications.unSubscribe.notFoundError.description"),
                            level: AlertLevels.ERROR,
                            message: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                                ".apiSubscriptions.notifications.unSubscribe.notFoundError.message")
                        }));

                        break;

                    default:
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                                ".apiSubscriptions.notifications.unSubscribe.genericError.description"),
                            level: AlertLevels.ERROR,
                            message: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                                ".apiSubscriptions.notifications.unSubscribe.genericError.message")
                        }));
                }
            })
            .finally(() => {
                setIsUnsubscribeAPIResourceLoading(false);
                setRemoveSubscribedAPIResource(null);
            });
    };

    /**
     * Handles creation of authorized API resource.
     *
     * @param apiId - API resource ID.
     * @param scopes - Scopes.
     * @returns `void`
     */
    const handleCreateAPIResource = (
        apiId: string, 
        scopes: string[], 
        policyIdentifier: string, 
        callback: () => void
    ): void => {

        createAuthorizedAPIResource(appId, apiId, scopes, policyIdentifier)
            .then(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:develop.applications.edit.sections.apiAuthorization" +
                        ".sections.apiSubscriptions.notifications.createAuthorizedAPIResource.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.notifications.createAuthorizedAPIResource.success.message")
                }));

                setIsUpdateData(true);
                setIsAuthorizeAPIResourceWizardOpen(false);
            })
            .catch((error: IdentityAppsApiException) => {
                switch(error?.code) {
                    case APIResourcesConstants.UNAUTHORIZED_ACCESS:
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                                ".apiSubscriptions.notifications.createAuthorizedAPIResource.unauthorizedError" + 
                                ".description"),
                            level: AlertLevels.ERROR,
                            message: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                                ".apiSubscriptions.notifications.createAuthorizedAPIResource.unauthorizedError.message")
                        }));

                        break;
                        
                    case APIResourcesConstants.NO_VALID_API_RESOURCE_ID_FOUND:
                    case APIResourcesConstants.API_RESOURCE_NOT_FOUND:
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                                ".apiSubscriptions.notifications.createAuthorizedAPIResource.notFoundError" + 
                                ".description"),
                            level: AlertLevels.ERROR,
                            message: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                                ".apiSubscriptions.notifications.createAuthorizedAPIResource.notFoundError.message")
                        }));

                        break;

                    default:
                        dispatch(addAlert<AlertInterface>({
                            description: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                                ".apiSubscriptions.notifications.createAuthorizedAPIResource.genericError.description"),
                            level: AlertLevels.ERROR,
                            message: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                                ".apiSubscriptions.notifications.createAuthorizedAPIResource.genericError.message")
                        }));
                }
            })
            .finally(() => {
                setIsUnsubscribeAPIResourceLoading(false);
                callback && callback();
            });
    };

    /**
     * Bulk change the all authorized scopes.
     * 
     * @param updatedScopes - Updated scopes.
     * @param removed - `true` if scope removed.
     * 
     * @returns `void`
     */
    const bulkChangeAllAuthorizedScopes = (updatedScopes: AuthorizedPermissionListItemInterface[], 
        removed: boolean): void => {

        if (removed) {
            setAllAuthorizedScopes(allAuthorizedScopes.filter(
                (scope: AuthorizedPermissionListItemInterface) => !updatedScopes.some(
                    (updatedScope: AuthorizedPermissionListItemInterface) => updatedScope.name === scope.name)));
        } else {
            const changedScopes: AuthorizedPermissionListItemInterface[]= updatedScopes.filter(
                (updatedScope: AuthorizedPermissionListItemInterface) => !allAuthorizedScopes.some(
                    (scope: AuthorizedPermissionListItemInterface) => updatedScope.name === scope.name));

            setAllAuthorizedScopes([ ...allAuthorizedScopes, ...changedScopes ]);
        }
    };

    return (
        <Fragment>
            <EmphasizedSegment 
                padded="very"
                loading={ isSubAPIResourcesSectionLoading }
                data-componentid={ `${componentId}-sub-api-resources-section` }>
                <Grid>
                    <Grid.Row>
                        <Grid.Column className="heading-wrapper" computer={ 8 } mobile={ 10 }>
                            <Heading as="h4">
                                { t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                                    ".apiSubscriptions.heading") }
                            </Heading>
                            <Heading subHeading ellipsis as="h6" >
                                { t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                                    ".apiSubscriptions.subHeading") }
                                <DocumentationLink
                                    link={ getLink("develop.applications.apiAuthorization.learnMore") }
                                >
                                    { t("extensions:common.learnMore") }
                                </DocumentationLink>
                            </Heading>
                        </Grid.Column>
                        <Grid.Column computer={ 4 } mobile={ 6 }>
                            {
                                !hideAuthorizeAPIResourceButton 
                                && (
                                    <Popup 
                                        content= {
                                            isAllAPIsSubscribed
                                                ? t("extensions:develop.applications.edit.sections." +
                                                            "apiAuthorization.sections.apiSubscriptions." + 
                                                            "allAPIAuthorizedPopOver")
                                                : null
                                        }
                                        position="top center"
                                        disabled={ !isAllAPIsSubscribed }
                                        trigger={ (
                                            <span>
                                                <PrimaryButton
                                                    data-componentid={ "subscribed-api-resources" + 
                                                        "-subcribe-api-resource-button" }
                                                    size="medium"
                                                    floated="right"
                                                    onClick={ (): void => 
                                                        setIsAuthorizeAPIResourceWizardOpen(true) }
                                                    disabled={ isAllAPIsSubscribed }
                                                >
                                                    <Icon name="add" />
                                                    { t("extensions:develop.applications.edit.sections." +
                                                            "apiAuthorization.sections.apiSubscriptions.buttons." + 
                                                            "subAPIResource") }
                                                </PrimaryButton>
                                            </span>
                                        ) }
                                    />
                                )
                            }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Divider hidden />
                <SubscribedAPIResources
                    appId={ appId }
                    allAPIResourcesListData={ allAPIResourcesListData?.apiResources }
                    allAPIResourcesFetchRequestError={ allAPIResourcesFetchRequestError }
                    allAuthorizedScopes={ allAuthorizedScopes }
                    subscribedAPIResourcesListData={ updatedSubscribedAPIResourcesList }
                    subscribedAPIResourcesFetchRequestError=
                        { subscribedAPIResourcesFetchRequestError }
                    isChoreoApp={ isChoreoApp }
                    isScopesAvailableForUpdate={ isScopesAvailableForUpdate() }
                    isShownPlaceholder={ isShownPlaceholder }
                    setRemoveSubscribedAPIResource={ setRemoveSubscribedAPIResource }
                    bulkChangeAllAuthorizedScopes={ bulkChangeAllAuthorizedScopes }
                    setIsAuthorizeAPIResourceWizardOpen={ setIsAuthorizeAPIResourceWizardOpen }
                />
            </EmphasizedSegment>
            {
                removeSubscribedAPIResource && (
                    <ConfirmationModal
                        primaryActionLoading={ isUnsubscribeAPIResourceLoading }
                        open={ removeSubscribedAPIResource !== null }
                        onClose={ (): void => setRemoveSubscribedAPIResource(null) }
                        type="negative"
                        assertionHint={ t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                            ".apiSubscriptions.confirmations.unsubscribeAPIResource.assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setRemoveSubscribedAPIResource(null) }
                        onPrimaryActionClick={ (): void => handleAPIResourceUnsubscribe() }
                        data-componentid={ `${componentId}-delete-confirmation-modal` }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header
                            data-componentid={ `${componentId}-delete-confirmation-modal-header` }
                        >
                            { t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                                ".apiSubscriptions.confirmations.unsubscribeAPIResource.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            negative
                            data-componentid={ `${componentId}-delete-confirmation-modal-message` }
                        >
                            { t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                                ".apiSubscriptions.confirmations.unsubscribeAPIResource.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content
                            data-componentid={ `${componentId}-delete-confirmation-modal-content` }
                        >
                            {
                                isChoreoApp && removeSubscribedAPIResource.isChoreoAPI
                                    ? (
                                        <Trans 
                                            i18nKey={ "extensions:develop.applications.edit.sections." +
                                                "apiAuthorization.sections.apiSubscriptions.confirmations." + 
                                                "unsubscribeChoreoAPIResource.content" }
                                        >
                                            Unsubscribing this API resource will not be reflected on the
                                            Choreo end, but will impact/affect the user authorization as the
                                            authorized scopes will no longer be accessible. <b>Proceed with caution.</b>
                                        </Trans>
                                    )
                                    : t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                                        ".apiSubscriptions.confirmations.unsubscribeAPIResource.content")
                            }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
            {
                isAuthorizeAPIResourceWizardOpen && (
                    <AuthorizeAPIResource 
                        subscribedAPIResourcesListData={ updatedSubscribedAPIResourcesList }
                        closeWizard={ (): void => setIsAuthorizeAPIResourceWizardOpen(false) }
                        handleCreateAPIResource= { handleCreateAPIResource } />
                )
            }
        </Fragment>

    );
};

/**
 * Default props for application roles tab component.
 */
APIAuthorization.defaultProps = {
    "data-componentid": "api-authorization-tab"
};
