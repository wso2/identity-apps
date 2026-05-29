/**
 * Copyright (c) 2023-2026, WSO2 LLC. (https://www.wso2.com).
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

import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { useAPIResources } from "@wso2is/admin.api-resources.v2/api";
import { APIResourceCategories, APIResourcesConstants } from "@wso2is/admin.api-resources.v2/constants";
import { APIResourceInterface } from "@wso2is/admin.api-resources.v2/models";
import { APIResourceUtils } from "@wso2is/admin.api-resources.v2/utils/api-resource-utils";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { APIResourceBlockEntryInterface, FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertInterface,
    AlertLevels,
    IdentifiableComponentInterface,
    LinkInterface,
    SBACInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    DocumentationLink,
    EmphasizedSegment,
    Heading,
    PrimaryButton,
    useDocumentation
} from "@wso2is/react-components";
import React, {
    Fragment,
    FunctionComponent,
    ReactElement,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, DropdownItemProps, Grid, Icon } from "semantic-ui-react";
import { SubscribedAPIResources } from "./subscribed-api-resources";
import { AuthorizeAPIResource } from "./wizard/authorize-api-resource";
import {
    authorizeAPI,
    removeAuthorizedAPI
} from "../../api/api-authorization";
import useSubscribedAPIResources from "../../api/use-subscribed-api-resources";
import {
    ApplicationFeatureDictionaryKeys,
    ApplicationManagementConstants
} from "../../constants/application-management";
import {
    AuthorizedAPIListItemInterface,
    AuthorizedPermissionListItemInterface
} from "../../models/api-authorization";

/**
 * Prop types for the API resources list component.
 */
interface APIAuthorizationResourcesProps extends
    SBACInterface<FeatureConfigInterface>, IdentifiableComponentInterface {
    /**
     * Template ID.
     */
    templateId: string;
    /**
     * Original template ID.
     */
    originalTemplateId?: string;
    /**
     * Make the component read only.
     */
    readOnly?: boolean;
}

/**
 * API Authorization component.
 *
 * @param props - Props related to API authorization component.
 */
export const APIAuthorization: FunctionComponent<APIAuthorizationResourcesProps> = (
    props: APIAuthorizationResourcesProps
): ReactElement => {

    const {
        templateId,
        originalTemplateId,
        readOnly,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const { getLink } = useDocumentation();

    const isDigitalWallet: boolean = originalTemplateId === "digital-wallet-application";
    const isMCPClient: boolean = originalTemplateId === "mcp-client-application";

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const applicationFeatureConfig: FeatureAccessConfigInterface = featureConfig?.applications;
    const blockedAPIResourceEntries: APIResourceBlockEntryInterface[] = useSelector(
        (state: AppState) => state?.config?.ui?.apiResourceManagement?.blockedAPIResources
    );

    const blockedAPIResourceIds: Set<string> = useMemo(() => {
        const ids: Set<string> = new Set<string>();

        blockedAPIResourceEntries?.forEach((entry: APIResourceBlockEntryInterface) => {
            if (entry?.api_id) {
                ids.add(entry.api_id);
            }
        });

        return ids;
    }, [ blockedAPIResourceEntries ]);

    const isUnifiedMcpCapabilitiesEnabled: boolean = isFeatureEnabled(
        applicationFeatureConfig,
        ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_UNIFIED_MCP_CAPABILITIES")
    );

    // Determine resource text based on feature flag and application type
    const resourceText: string = isDigitalWallet
        ? t("extensions:develop.applications.edit.sections.apiAuthorization.resourceText.vcResource")
        : (isUnifiedMcpCapabilitiesEnabled || isMCPClient)
            ? t("extensions:develop.applications.edit.sections.apiAuthorization.resourceText.genericResource")
            : t("extensions:develop.applications.edit.sections.apiAuthorization.resourceText.apiResource");

    const [ isSubAPIResourcesSectionLoading, setSubAPIResourcesSectionLoading ] = useState<boolean>(false);
    const [ isShownError, setIsShownError ] = useState<boolean>(false);
    const [ removeSubscribedAPIResource, setRemoveSubscribedAPIResource ] =
        useState<AuthorizedAPIListItemInterface>(null);
    const [ isUnsubscribeAPIResourceLoading, setIsUnsubscribeAPIResourceLoading ] = useState<boolean>(false);
    const [ isAuthorizeAPIResourceWizardOpen, setIsAuthorizeAPIResourceWizardOpen ] = useState<boolean>(false);
    const [ isUpdateData, setIsUpdateData ] = useState<boolean>(false);
    const [ allAuthorizedScopes, setAllAuthorizedScopes ] = useState<AuthorizedPermissionListItemInterface[]>([]);
    const [ hideAuthorizeAPIResourceButton, setHideAuthorizeAPIResourceButton ] = useState<boolean>(true);
    const [ apiCallNextAfterValue, setAPICallNextAfterValue ] = useState<string>(null);
    const [ allAPIResources, setAllAPIResources ] = useState<APIResourceInterface[]>([]);
    const [ allAPIResourcesDropdownOptions, setAllAPIResourcesDropdownOptions ] = useState<DropdownItemProps[]>([]);
    const [ isAllAPIResourcesPreloadLoading, setIsAllAPIResourcesPreloadLoading ] = useState<boolean>(false);

    const path: string[] = history.location.pathname.split("/");
    const appId: string = path[path.length - 1].split("#")[0];

    const {
        data: currentAPIResourcesListData,
        isLoading: isAllAPIResourcesListLoading,
        error: allAPIResourcesFetchRequestError,
        mutate: mutateAllAPIResourcesList
    } = useAPIResources(apiCallNextAfterValue, null, null, !readOnly);

    const {
        data: subscribedAPIResourcesListData,
        isLoading: isSubscribedAPIResourcesListLoading,
        error: subscribedAPIResourcesFetchRequestError,
        mutate: mutateSubscribedAPIResourcesList
    } = useSubscribedAPIResources(appId);

    const hasApplicationUpdatePermissions: boolean = useRequiredScopes(featureConfig?.applications?.scopes?.update);
    const isApplicationEditEnforceAuthorizedAPIUpdatePermissionEnabled: boolean = isFeatureEnabled(
        applicationFeatureConfig,
        ApplicationManagementConstants.FEATURE_DICTIONARY.get(
            ApplicationFeatureDictionaryKeys.ApplicationEditEnforceAuthorizedAPIUpdatePermission)
    );
    const hasInternalAPIResourceAuthorizationPermission: boolean = useRequiredScopes(
        applicationFeatureConfig?.subFeatures?.applicationInternalAPIAuthorization?.scopes?.update);
    const hasBusinessAPIResourceAuthorizationPermission: boolean = useRequiredScopes(
        applicationFeatureConfig?.subFeatures?.applicationBusinessAPIAuthorization?.scopes?.update);

    /**
     * Handles the is shown placeholders
     */
    const isShownPlaceholder: boolean = !!subscribedAPIResourcesFetchRequestError
        || !!allAPIResourcesFetchRequestError
        || allAPIResources?.length === 0;

    /**
     * The following useEffect is used to handle if any error occurs while fetching API resources.
     */
    useEffect(() => {
        if (!readOnly && (allAPIResourcesFetchRequestError || subscribedAPIResourcesFetchRequestError)) {
            setHideAuthorizeAPIResourceButton(true);
            setIsAllAPIResourcesPreloadLoading(false);
            if (!isShownError) {
                setIsShownError(true);
                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:develop.apiResource.notifications.getAPIResources" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("extensions:develop.apiResource.notifications.getAPIResources" +
                        ".genericError.message")
                }));
            }
        }
    }, [ allAPIResourcesFetchRequestError, subscribedAPIResourcesFetchRequestError ]);

    /**
     * The following useEffect is used to handle loading state of when API resources are being fetched.
     */
    useEffect(() => {
        setSubAPIResourcesSectionLoading(
            !readOnly && (
                isUpdateData ||
                isAllAPIResourcesListLoading ||
                isAllAPIResourcesPreloadLoading ||
                isSubscribedAPIResourcesListLoading
            )
        );
    }, [
        isUpdateData,
        isAllAPIResourcesListLoading,
        isAllAPIResourcesPreloadLoading,
        isSubscribedAPIResourcesListLoading
    ]);

    /**
     * Fetch and aggregate all API resources when the Authorization tab is mounted.
     */
    useEffect(() => {
        if (readOnly) {
            return;
        }

        if (!isAllAPIResourcesPreloadLoading) {
            setIsAllAPIResourcesPreloadLoading(true);
        }

        if (currentAPIResourcesListData) {
            const currentAPIResources: APIResourceInterface[] = currentAPIResourcesListData.apiResources ?? [];
            const aggregatedAPIResources: APIResourceInterface[] = [
                ...allAPIResources,
                ...currentAPIResources.filter((apiResource: APIResourceInterface) =>
                    !allAPIResources.some((currentAPIResource: APIResourceInterface) =>
                        currentAPIResource.id === apiResource.id)
                )
            ];
            let nextAfterValue: string = null;

            currentAPIResourcesListData.links?.forEach((value: LinkInterface) => {
                if (value.rel === APIResourcesConstants.NEXT_REL) {
                    nextAfterValue = value.href.split(`${APIResourcesConstants.AFTER}=`)[1];
                }
            });

            setAllAPIResources(aggregatedAPIResources);

            if (nextAfterValue && nextAfterValue !== apiCallNextAfterValue) {
                setAPICallNextAfterValue(nextAfterValue);
            } else {
                setIsAllAPIResourcesPreloadLoading(false);
            }
        }
    }, [ currentAPIResourcesListData ]);

    /**
     * Prepare API resource dropdown options for the authorization wizard.
     */
    useEffect(() => {
        const filteredDropdownItemOptions: DropdownItemProps[] = allAPIResources.reduce((
            filtered: DropdownItemProps[],
            apiResource: APIResourceInterface
        ) => {
            // Hide the blocked API resources.
            if (blockedAPIResourceIds.has(apiResource?.id)) {
                return filtered;
            }

            const isCurrentAPIResourceSubscribed: boolean = subscribedAPIResourcesListData?.length === 0
                || !subscribedAPIResourcesListData?.some(
                    (subscribedAPIResource: AuthorizedAPIListItemInterface) =>
                        subscribedAPIResource.identifier === apiResource.identifier);

            if (isCurrentAPIResourceSubscribed) {
                let isOptionDisabled: boolean = false;

                // If the feature to enforce API resource update permission is enabled,
                // check if the user has the required permission to authorize the API resource.
                if (isApplicationEditEnforceAuthorizedAPIUpdatePermissionEnabled) {
                    if (apiResource.type === APIResourceCategories.BUSINESS ||
                        apiResource.type === APIResourceCategories.MCP) {
                        // Disable business and MCP API resources if the user does not have the required permission.
                        isOptionDisabled = !hasBusinessAPIResourceAuthorizationPermission;
                    } else {
                        // Disable internal API resources if the user does not have the required permission.
                        isOptionDisabled = !hasInternalAPIResourceAuthorizationPermission;
                    }
                }

                filtered.push({
                    disabled: isOptionDisabled,
                    identifier: apiResource?.identifier,
                    key: apiResource.id,
                    text: apiResource.name,
                    type: apiResource.type,
                    value: apiResource.id
                });
            }

            return filtered;
        }, []);

        const filteredAPIResourceDropdownOptions: DropdownItemProps[] = filteredDropdownItemOptions.filter(
            (item: DropdownItemProps) => {
                // For Digital Wallet apps, show ONLY VC type resources.
                if (isDigitalWallet) {
                    return item?.type === APIResourceCategories.VC;
                }

                // When unified MCP capabilities is enabled: all apps can access MCP servers.
                // When disabled: only MCP client apps can access MCP servers.
                if (isUnifiedMcpCapabilitiesEnabled || isMCPClient) {
                    return item?.type === APIResourceCategories.MCP ||
                        item?.type === APIResourceCategories.TENANT ||
                        item?.type === APIResourceCategories.ORGANIZATION ||
                        item?.type === APIResourceCategories.BUSINESS;
                }

                return item?.type === APIResourceCategories.TENANT ||
                    item?.type === APIResourceCategories.ORGANIZATION ||
                    item?.type === APIResourceCategories.BUSINESS;
            }
        );

        setAllAPIResourcesDropdownOptions(filteredAPIResourceDropdownOptions.sort(
            (a: DropdownItemProps, b: DropdownItemProps) => APIResourceUtils.sortApiResourceTypes(a, b)
        ));
    }, [
        allAPIResources,
        subscribedAPIResourcesListData,
        isApplicationEditEnforceAuthorizedAPIUpdatePermissionEnabled,
        hasBusinessAPIResourceAuthorizationPermission,
        hasInternalAPIResourceAuthorizationPermission,
        isDigitalWallet,
        isUnifiedMcpCapabilitiesEnabled,
        isMCPClient,
        blockedAPIResourceIds
    ]);

    /**
     * Initalize the all authorized scopes.
     */
    useEffect(() => {
        if (subscribedAPIResourcesListData?.length > 0) {
            let authorizedScopes: AuthorizedPermissionListItemInterface[] = [];

            subscribedAPIResourcesListData.forEach((subscribedAPIResource: AuthorizedAPIListItemInterface) => {
                authorizedScopes = authorizedScopes.concat(subscribedAPIResource.authorizedScopes);
            });

            setAllAuthorizedScopes(authorizedScopes);
        }
    }, [ subscribedAPIResourcesListData ]);

    /**
     * The following useEffect is used to update the API resources list once a mutate function is called.
     */
    useEffect(() => {
        if (isUpdateData) {
            setAllAPIResources([]);
            setAllAPIResourcesDropdownOptions([]);
            setAPICallNextAfterValue(null);
            mutateAllAPIResourcesList();
            mutateSubscribedAPIResourcesList();
            setIsUpdateData(false);
        }
    }, [ isUpdateData ]);

    /**
     * Set hide authorize API resource button.
     */
    useEffect(() => {
        const isScopesAvailable: boolean = hasApplicationUpdatePermissions;
        const hideAuthorizeAPIResourceButton: boolean = !isScopesAvailable
           || allAPIResources?.length === 0
           || subscribedAPIResourcesListData?.length === 0;

        setHideAuthorizeAPIResourceButton(hideAuthorizeAPIResourceButton);
    }, [ featureConfig, allAPIResources, subscribedAPIResourcesListData ]);

    /**
     * Handles unsubscribe API resource.
     *
     * @returns `void`
     */
    const handleAPIResourceUnsubscribe = (): void => {

        setIsUnsubscribeAPIResourceLoading(true);
        removeAuthorizedAPI(appId, removeSubscribedAPIResource?.id)
            .then(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:develop.applications.edit.sections." +
                        "apiAuthorization.sections.apiSubscriptions.notifications.unSubscribe.success.description", {
                        resourceText: resourceText
                    }),
                    level: AlertLevels.SUCCESS,
                    message: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.notifications.unSubscribe.success.message", {
                        resourceText: resourceText
                    })
                }));

                setIsUnsubscribeAPIResourceLoading(false);
                setIsUpdateData(true);
            })
            .catch(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.notifications.unSubscribe.genericError.description", {
                        resourceText: resourceText
                    }),
                    level: AlertLevels.ERROR,
                    message: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.notifications.unSubscribe.genericError.message", {
                        resourceText: resourceText
                    })
                }));
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

        authorizeAPI(appId, apiId, scopes, policyIdentifier)
            .then(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:develop.applications.edit.sections.apiAuthorization" +
                        ".sections.apiSubscriptions.notifications.createAuthorizedAPIResource.success.description", {
                        resourceText: resourceText
                    }),
                    level: AlertLevels.SUCCESS,
                    message: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.notifications.createAuthorizedAPIResource.success.message", {
                        resourceText: resourceText
                    })
                }));

                setIsUpdateData(true);
                setIsAuthorizeAPIResourceWizardOpen(false);
            })
            .catch(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.notifications.createAuthorizedAPIResource.genericError.description", {
                        resourceText: resourceText
                    }),
                    level: AlertLevels.ERROR,
                    message: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.notifications.createAuthorizedAPIResource.genericError.message", {
                        resourceText: resourceText
                    })
                }));
            })
            .finally(() => {
                setIsUnsubscribeAPIResourceLoading(false);
                if (callback) {
                    callback();
                }
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
                                    ".apiSubscriptions.heading", {
                                    resourceText: resourceText
                                }) }
                            </Heading>
                            <Heading subHeading ellipsis as="h6" >
                                { t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                                    ".apiSubscriptions.subHeading", {
                                    resourceText: resourceText
                                }) }
                                <DocumentationLink
                                    link={ getLink("develop.applications.apiAuthorization.learnMore") }
                                >
                                    { t("common:learnMore") }
                                </DocumentationLink>
                            </Heading>
                        </Grid.Column>
                        <Grid.Column computer={ 4 } mobile={ 6 }>
                            {
                                !hideAuthorizeAPIResourceButton
                                && (
                                    <PrimaryButton
                                        data-componentid={ "subscribed-api-resources-subcribe-api-resource-button" }
                                        size="medium"
                                        floated="right"
                                        onClick={ (): void => setIsAuthorizeAPIResourceWizardOpen(true) }
                                    >
                                        <Icon name="add" />
                                        { t("extensions:develop.applications.edit.sections.apiAuthorization." +
                                            "sections.apiSubscriptions.buttons.subAPIResource", {
                                            resourceText: resourceText
                                        }) }
                                    </PrimaryButton>
                                )
                            }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Divider hidden />
                <SubscribedAPIResources
                    appId={ appId }
                    templateId={ templateId }
                    originalTemplateId={ originalTemplateId }
                    allAPIResourcesListData={ allAPIResources }
                    allAPIResourcesFetchRequestError={ allAPIResourcesFetchRequestError }
                    allAuthorizedScopes={ allAuthorizedScopes }
                    subscribedAPIResourcesListData={ subscribedAPIResourcesListData }
                    subscribedAPIResourcesFetchRequestError=
                        { subscribedAPIResourcesFetchRequestError }
                    isScopesAvailableForUpdate={ hasApplicationUpdatePermissions }
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
                            ".apiSubscriptions.confirmations.unsubscribeAPIResource.assertionHint", {
                            resourceText: resourceText
                        }) }
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
                                ".apiSubscriptions.confirmations.unsubscribeAPIResource.header", {
                                resourceText: resourceText
                            }) }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            negative
                            data-componentid={ `${componentId}-delete-confirmation-modal-message` }
                        >
                            { t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                                ".apiSubscriptions.confirmations.unsubscribeAPIResource.message", {
                                resourceText: resourceText
                            }) }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content
                            data-componentid={ `${componentId}-delete-confirmation-modal-content` }
                        >
                            { t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                                ".apiSubscriptions.confirmations.unsubscribeAPIResource.content", {
                                resourceText: resourceText
                            }) }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
            {
                isAuthorizeAPIResourceWizardOpen && (
                    <AuthorizeAPIResource
                        templateId={ templateId }
                        originalTemplateId={ originalTemplateId }
                        allAPIResourcesListData={ allAPIResources }
                        allAPIResourcesDropdownOptions={ allAPIResourcesDropdownOptions }
                        isAPIResourcesListLoading={
                            isAllAPIResourcesListLoading || isAllAPIResourcesPreloadLoading
                        }
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
    "data-componentid": "api-authorization-tab",
    readOnly: false
};
