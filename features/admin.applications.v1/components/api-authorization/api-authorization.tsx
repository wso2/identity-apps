/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { useRequiredScopes } from "@wso2is/access-control";
import { useAPIResources } from "@wso2is/admin.api-resources.v2/api";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
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
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid, Icon } from "semantic-ui-react";
import { SubscribedAPIResources } from "./subscribed-api-resources";
import { AuthorizeAPIResource } from "./wizard/authorize-api-resource";
import {
    authorizeAPI,
    removeAuthorizedAPI
} from "../../api/api-authorization";
import useSubscribedAPIResources from "../../api/use-subscribed-api-resources";
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
        readOnly,
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
    const [ hideAuthorizeAPIResourceButton, setHideAuthorizeAPIResourceButton ] = useState<boolean>(true);

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const path: string[] = history.location.pathname.split("/");
    // const appId: string = path[path.length - 1].split("#")[0];
    const appId: string = "fdda4bbd-cfdb-4e3f-8d5a-2e22c785708a";

    const {
        data: allAPIResourcesListData,
        isLoading: isAllAPIResourcesListLoading,
        error: allAPIResourcesFetchRequestError,
        mutate: mutateAllAPIResourcesList
    } = useAPIResources(null, null, null, !readOnly);

    const {
        data: subscribedAPIResourcesListData,
        isLoading: isSubscribedAPIResourcesListLoading,
        error: subscribedAPIResourcesFetchRequestError,
        mutate: mutateSubscribedAPIResourcesList
    } = useSubscribedAPIResources(appId);

    /**
     * Handles the is shown placeholders
     */
    const isShownPlaceholder: boolean = !!subscribedAPIResourcesFetchRequestError
        || !!allAPIResourcesFetchRequestError
        || allAPIResourcesListData?.apiResources.length === 0;

    /**
     * The following useEffect is used to handle if any error occurs while fetching API resources.
     */
    useEffect(() => {
        if (!readOnly && (allAPIResourcesFetchRequestError || subscribedAPIResourcesFetchRequestError)) {
            setHideAuthorizeAPIResourceButton(true);
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
                isSubscribedAPIResourcesListLoading
            )
        );
    }, [ isUpdateData, isAllAPIResourcesListLoading, isSubscribedAPIResourcesListLoading ]);

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
            mutateAllAPIResourcesList();
            mutateSubscribedAPIResourcesList();
            setIsUpdateData(false);
        }
    }, [ isUpdateData ]);

    const hasApplicationUpdatePermissions: boolean = useRequiredScopes(featureConfig?.applications?.scopes?.update);

    /**
     * Set hide authorize API resource button.
     */
    useEffect(() => {
        const isScopesAvailable: boolean = hasApplicationUpdatePermissions;
        const hideAuthorizeAPIResourceButton: boolean = !isScopesAvailable
           || allAPIResourcesListData?.apiResources?.length === 0
           || subscribedAPIResourcesListData?.length === 0;

        setHideAuthorizeAPIResourceButton(hideAuthorizeAPIResourceButton);
    }, [ featureConfig, allAPIResourcesListData, subscribedAPIResourcesListData ]);

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
                        "apiAuthorization.sections.apiSubscriptions.notifications.unSubscribe.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.notifications.unSubscribe.success.message")
                }));

                setIsUnsubscribeAPIResourceLoading(false);
                setIsUpdateData(true);
            })
            .catch(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.notifications.unSubscribe.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.notifications.unSubscribe.genericError.message")
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
                        ".sections.apiSubscriptions.notifications.createAuthorizedAPIResource.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.notifications.createAuthorizedAPIResource.success.message")
                }));

                setIsUpdateData(true);
                setIsAuthorizeAPIResourceWizardOpen(false);
            })
            .catch(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.notifications.createAuthorizedAPIResource.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.notifications.createAuthorizedAPIResource.genericError.message")
                }));
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
                                            "sections.apiSubscriptions.buttons.subAPIResource") }
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
                    allAPIResourcesListData={ allAPIResourcesListData?.apiResources }
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
                            { t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                                ".apiSubscriptions.confirmations.unsubscribeAPIResource.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
            {
                isAuthorizeAPIResourceWizardOpen && (
                    <AuthorizeAPIResource
                        templateId={ templateId }
                        subscribedAPIResourcesListData={ subscribedAPIResourcesListData }
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
