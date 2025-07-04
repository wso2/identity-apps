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

import { APIResourcesConstants } from "@wso2is/admin.api-resources.v2/constants";
import { APIResourceInterface } from "@wso2is/admin.api-resources.v2/models";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { RequestErrorInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import {
    Code,
    CopyInputField,
    EmphasizedSegment,
    EmptyPlaceholder,
    Hint,
    Link,
    LinkButton,
    ListLayout,
    PrimaryButton,
    SegmentedAccordion,
    SegmentedAccordionTitleActionInterface
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { Fragment, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Form, Grid, Header, Icon, Input } from "semantic-ui-react";
import { ScopeForm } from "./scope-form";
import useScopesOfAPIResources from "../../api/use-scopes-of-api-resources";
import { Policy } from "../../constants/api-authorization";
import {
    AuthorizedAPIListItemInterface,
    AuthorizedPermissionListItemInterface
} from "../../models/api-authorization";
import { ApplicationTemplateIdTypes } from "../../models/application";

/**
 * Prop types for the API resources list component.
 */
interface SubscribedAPIResourcesProps extends
    SBACInterface<FeatureConfigInterface>, IdentifiableComponentInterface {
    /**
     * Application ID.
     */
    appId: string;
    /**
     * Template ID.
     */
    templateId: string;
    /**
     * Original Template ID.
     */
    originalTemplateId?: string;
    /**
     * List of all API Resources
     */
    allAPIResourcesListData: APIResourceInterface[];
    /**
     * Error when fetching all API Resources
     */
    allAPIResourcesFetchRequestError: AxiosError<RequestErrorInterface>;
    /**
     * All authorized scopes.
     */
    allAuthorizedScopes: AuthorizedPermissionListItemInterface[];
    /**
     * List of subscribed API Resources
     */
    subscribedAPIResourcesListData: AuthorizedAPIListItemInterface[],
    /**
     * Error when fetching subscribed API Resources
     */
    subscribedAPIResourcesFetchRequestError: AxiosError<RequestErrorInterface>;
    /**
     * is shown placeholder
     */
    isShownPlaceholder: boolean;
    /**
     * Is scopes available for update.
     */
    isScopesAvailableForUpdate: boolean;
    /**
     * Set remove subscribed API Resource.
     */
    setRemoveSubscribedAPIResource: (subscribedAPIResource: AuthorizedAPIListItemInterface) => void;
    /**
     * Bulk change all authorized scopes.
     */
    bulkChangeAllAuthorizedScopes: (scopes: AuthorizedPermissionListItemInterface[], removed: boolean) => void;
    /**
     * Set API Resource wizard open.
     */
    setIsAuthorizeAPIResourceWizardOpen: (isOpen: boolean) => void;
}

/**
 * API Resources listing page.
 *
 * @param props - Props injected to the component.
 * @returns API Resources Page component
 */
export const SubscribedAPIResources: FunctionComponent<SubscribedAPIResourcesProps> = (
    props: SubscribedAPIResourcesProps
): ReactElement => {

    const {
        appId,
        templateId,
        originalTemplateId,
        allAPIResourcesListData,
        allAPIResourcesFetchRequestError,
        allAuthorizedScopes,
        subscribedAPIResourcesListData,
        subscribedAPIResourcesFetchRequestError,
        isScopesAvailableForUpdate,
        setRemoveSubscribedAPIResource,
        bulkChangeAllAuthorizedScopes,
        setIsAuthorizeAPIResourceWizardOpen,
        ["data-componentid"]: componentId
    } = props;

    /**
     * Check if the place holders should be shown.
     */
    const showPlaceHolders: boolean = allAPIResourcesListData?.length === 0 ||
        subscribedAPIResourcesListData?.length === 0 ||
        allAPIResourcesFetchRequestError != null ||
        subscribedAPIResourcesFetchRequestError !=  null ;

    const { t } = useTranslation();

    const resourceText: string = originalTemplateId === "mcp-client-application"
        ? t("extensions:develop.applications.edit.sections.apiAuthorization.resourceText.genericResource")
        : t("extensions:develop.applications.edit.sections.apiAuthorization.resourceText.apiResource");

    const [ activeSubscribedAPIResource, setActiveSubscribedAPIResource ] = useState<string>(null);
    const [ searchQuery, setSearchQuery ] = useState<string>(null);
    const [ searchedSubscribedAPIResources, setSearchedSubscribedAPIResources ] =
        useState<AuthorizedAPIListItemInterface[]>(null);
    const [ copyScopesValue, setCopyScopesValue ] = useState<string>(null);
    const [ m2mApplication, setM2MApplication ] = useState<boolean>(false);
    const dispatch: Dispatch = useDispatch();

    const {
        data: currentAPIResourceScopeListData,
        isLoading: isCurrentAPIResourceScopeListDataLoading,
        error: currentAPIResourceScopeListFetchError
    } = useScopesOfAPIResources(activeSubscribedAPIResource);

    /**
     * Initialize the subscribed API Resources list to the searched list.
     */
    useEffect(() => {
        if (subscribedAPIResourcesListData) {
            setSearchedSubscribedAPIResources(subscribedAPIResourcesListData);
        }
    }, [ subscribedAPIResourcesListData ]);

    /**
     * Initalize the copy scopes value.
     */
    useEffect(() => {
        if (allAuthorizedScopes) {
            setCopyScopesValue(allAuthorizedScopes.map(
                (scope: AuthorizedPermissionListItemInterface) => scope.name).join(" ")
            );
        }
    }, [ allAuthorizedScopes ]);

    /**
     * Check whether the application is an M2M application.
     */
    useEffect(() => {
        if (templateId === ApplicationTemplateIdTypes.M2M_APPLICATION) {
            setM2MApplication(true);
        }
    }, [ templateId ]);

    /**
     * Handle if any error occurs while fetching API resource scopes.
     */
    useEffect(() => {
        if (currentAPIResourceScopeListFetchError) {
            dispatch(addAlert<AlertInterface>({
                description: t("extensions:develop.apiResource.notifications.getAPIResources" +
                    ".genericError.description", {
                    resourceText: resourceText
                }),
                level: AlertLevels.ERROR,
                message: t("extensions:develop.apiResource.notifications.getAPIResources" +
                    ".genericError.message", {
                    resourceText: resourceText
                })
            }));
        }
    }, [ currentAPIResourceScopeListFetchError ]);

    /**
     * Navigate to the API Resources page.
     */
    const navigateToAPIResources = () => history.push(APIResourcesConstants.getPaths().get("API_RESOURCES"));

    /**
     * Placeholder for the subscribed API Resources list.
     */
    const getPlaceholders = (): ReactElement => {
        if (allAPIResourcesFetchRequestError || subscribedAPIResourcesFetchRequestError) {
            return (
                <EmptyPlaceholder
                    image={ getEmptyPlaceholderIllustrations().genericError }
                    imageSize="tiny"
                    title={ t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.placeHolderTexts.errorText.title", {
                        resourceText: resourceText
                    }) }
                    subtitle={ [ t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.placeHolderTexts.errorText.subtitles.1", {
                        resourceText: resourceText
                    }),
                    t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.placeHolderTexts.errorText.subtitles.0", {
                        resourceText: resourceText
                    }) ] }
                    data-componentid={ `${componentId}-all-empty-placeholder-icon` }
                />
            );
        } else if (allAPIResourcesListData && allAPIResourcesListData.length === 0) {
            return (
                <EmptyPlaceholder
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    action={ (
                        isScopesAvailableForUpdate &&
                            ( <Link
                                data-componentid={ `${componentId}-link-api-resource-page` }
                                onClick={ navigateToAPIResources }
                                external={ false }
                            >
                                { t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                                    ".apiSubscriptions.buttons.noAPIResourcesLink", {
                                    resourceText: resourceText
                                }) }
                            </Link> )
                    ) }
                    imageSize="tiny"
                    subtitle={ [ t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.placeHolderTexts.noAPIResources", {
                        resourceText: resourceText
                    }) ] }
                    data-componentid={ `${componentId}-sub-empty-placeholder-icon` }
                />
            );
        } else if (subscribedAPIResourcesListData && subscribedAPIResourcesListData.length === 0) {
            return (
                <EmptyPlaceholder
                    image={ getEmptyPlaceholderIllustrations().emptyList }
                    action={ (
                        isScopesAvailableForUpdate &&
                            ( <PrimaryButton
                                data-componentid={ `${componentId}-empty-placeholder-sub-api-resource-button` }
                                onClick={ (): void => setIsAuthorizeAPIResourceWizardOpen(true) }
                            >
                                <Icon name="add" />
                                { t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                                    ".apiSubscriptions.buttons.subAPIResource", {
                                    resourceText: resourceText
                                }) }
                            </PrimaryButton> )
                    ) }
                    imageSize="tiny"
                    subtitle={ [ t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.placeHolderTexts.emptyText", {
                        resourceText: resourceText
                    }) ] }
                    data-componentid={ `${componentId}-sub-empty-placeholder-icon` }
                />
            );
        } else if (searchedSubscribedAPIResources?.length === 0) {
            return (
                <EmptyPlaceholder
                    title={ t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.placeHolderTexts.emptySearch.title", {
                        resourceText: resourceText
                    }) }
                    subtitle={ [ t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.placeHolderTexts.emptySearch.subTitle.0", {
                        resourceText: resourceText
                    }),
                    t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.placeHolderTexts.emptySearch.subTitle.1", {
                        resourceText: resourceText
                    }) ] }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    action={
                        (<LinkButton onClick={ clearSearchQuery }>
                            { t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                                ".apiSubscriptions.buttons.emptySearchButton", {
                                resourceText: resourceText
                            }) }
                        </LinkButton>)
                    }
                    imageSize="tiny"
                />
            );
        } else {
            return null;
        }
    };

    const renderPolicyForAPIResource = (policyIdentifier: string): string => {
        switch(policyIdentifier) {
            case Policy.ROLE:
                return I18n.instance.t("extensions:develop.applications.edit.sections.apiAuthorization" +
                    ".sections.policySection.form.fields.rbac.name");

            case Policy.NO:
                return I18n.instance.t("extensions:develop.applications.edit.sections.apiAuthorization" +
                    ".sections.policySection.form.fields.noPolicy.name");

            default:
                return I18n.instance.t("extensions:develop.applications.edit.sections.apiAuthorization" +
                    ".sections.policySection.form.fields.noPolicy.name");
        }
    };

    /**
     * Resolves the header of the subscribed API Resources list.
     */
    const resolveSubscribedAPIResourcesListHeader = (subscribedAPIResource: AuthorizedAPIListItemInterface):
        ReactElement => (
        <Header
            as="h6"
            className="header-with-icon"
            data-componentId={ `${componentId}-heading` }
        >
            <Grid verticalAlign="middle">
                <Grid.Row>
                    <Grid.Column width={ 8 }>
                        <Header.Content>
                            <Grid verticalAlign="middle">
                                <Grid.Row>
                                    <Grid.Column width={ 16 }>
                                        { subscribedAPIResource.displayName }
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Header.Subheader className="mt-1">
                                {
                                    subscribedAPIResource.identifier
                                        ? <Code withBackground>{ subscribedAPIResource.identifier }</Code>
                                        : null
                                }
                            </Header.Subheader>
                        </Header.Content>
                    </Grid.Column>
                    {
                        !m2mApplication && (
                            <Grid.Column width={ 8 }>
                                {
                                    subscribedAPIResource.identifier
                                        ? (
                                            <Header.Subheader>
                                                { renderPolicyForAPIResource(subscribedAPIResource.policyId) }
                                            </Header.Subheader>
                                        )
                                        : null
                                }
                            </Grid.Column>
                        )
                    }
                </Grid.Row>
            </Grid>
        </Header>
    );

    /**
     * Creates the actions of the subscribed API Resources list item.
     */
    const createAccordionAction = (subscribedAPIResource: AuthorizedAPIListItemInterface):
        SegmentedAccordionTitleActionInterface[] => {

        return [
            {
                disabled: !isScopesAvailableForUpdate,
                icon: "trash alternate",
                onClick: () => setRemoveSubscribedAPIResource(subscribedAPIResource),
                popoverText: t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                    ".apiSubscriptions.unsubscribeAPIResourcePopOver", {
                    resourceText: resourceText
                }),
                type: "icon"
            }
        ];
    };

    /**
     * Resolves the content of the subscribed API Resources list item.
     */
    const resolveSubscribedAPIResourcesListContent = (subscribedAPIResource: AuthorizedAPIListItemInterface):
        ReactElement => (
        <ScopeForm
            appId={ appId }
            subscribedAPIResource={ subscribedAPIResource }
            isScopesAvailableForUpdate={ isScopesAvailableForUpdate }
            bulkChangeAllAuthorizedScopes={ bulkChangeAllAuthorizedScopes }
            currentAPIResourceScopeListData={ currentAPIResourceScopeListData }
            isCurrentAPIResourceScopeListDataLoading={ isCurrentAPIResourceScopeListDataLoading }
        />
    );

    /**
     * Handle the click event of the subscribed API Resources list item.
     */
    const handleSubscribedAPIResourcesListItemClick = (subscribedAPIResource: AuthorizedAPIListItemInterface): void => {
        activeSubscribedAPIResource === subscribedAPIResource.id
            ? setActiveSubscribedAPIResource(null)
            : setActiveSubscribedAPIResource(subscribedAPIResource.id);
    };

    /**
     * Clear the search query.
     */
    const clearSearchQuery = (): void => {
        setSearchQuery("");
        setSearchedSubscribedAPIResources(subscribedAPIResourcesListData);
    };

    /**
     * Search the subscribed API Resources.
     */
    const searchSubscribedAPIResources = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const query: string = event.target.value;

        setSearchQuery(query);

        if (query.length > 0) {
            // Filter the subscribed API Resources using `apiDisplayName`.
            setSearchedSubscribedAPIResources(
                subscribedAPIResourcesListData?.filter((subscribedAPIResource: AuthorizedAPIListItemInterface) => {
                    return subscribedAPIResource.displayName.toLowerCase().includes(query.toLowerCase());
                })
            );
        } else {
            setSearchedSubscribedAPIResources(subscribedAPIResourcesListData);
        }
    };

    return (
        showPlaceHolders
            ? (
                <EmphasizedSegment>
                    { getPlaceholders() }
                </EmphasizedSegment>
            )
            : (
                <Grid className="mt-3">
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                            <ListLayout
                                showTopActionPanel={ true }
                                showPagination={ false }
                                onPageChange={ () => null }
                                totalPages={ 100 }
                                data-componentid={ `${componentId}-list-layout` }
                                totalListSize={ subscribedAPIResourcesListData?.length }
                                leftActionPanel={
                                    (<div className="advanced-search-wrapper aligned-left fill-default">
                                        <Input
                                            className="advanced-search with-add-on"
                                            data-componentid={ `${componentId}-list-search-input` }
                                            icon="search"
                                            iconPosition="left"
                                            onChange={ searchSubscribedAPIResources }
                                            placeholder={ t("extensions:develop.applications.edit.sections." +
                                                "apiAuthorization.sections.apiSubscriptions.search", {
                                                resourceText:  originalTemplateId ===
                                                    ApplicationTemplateIdTypes.MCP_CLIENT_APPLICATION
                                                    ? t("extensions:develop.applications.edit.sections.apiAuthorization"
                                                        + ".resourceText.genericResource")
                                                    : t("extensions:develop.applications.edit.sections.apiAuthorization"
                                                        + ".resourceText.apiResource")

                                            }) }
                                            floated="right"
                                            size="small"
                                            value={ searchQuery }
                                        />
                                    </div>)
                                }
                            >
                                {
                                    searchedSubscribedAPIResources?.length !== 0
                                        ? (
                                            <SegmentedAccordion
                                                data-componentid={ `${componentId}-subscribed-api-resources` }
                                                viewType="table-view"
                                            >
                                                {
                                                    searchedSubscribedAPIResources?.map(
                                                        (subscribedAPIResource: AuthorizedAPIListItemInterface) => (
                                                            <Fragment key={ subscribedAPIResource.id }>
                                                                <SegmentedAccordion.Title
                                                                    id={ subscribedAPIResource.id }
                                                                    data-componentid={
                                                                        `${componentId}-title`
                                                                    }
                                                                    active={ activeSubscribedAPIResource
                                                                        === subscribedAPIResource.id }
                                                                    accordionIndex={ subscribedAPIResource.id }
                                                                    onClick={ () =>
                                                                        handleSubscribedAPIResourcesListItemClick(
                                                                            subscribedAPIResource) }
                                                                    content={ (
                                                                        resolveSubscribedAPIResourcesListHeader(
                                                                            subscribedAPIResource)
                                                                    ) }
                                                                    hideChevron={ false }
                                                                    actions={
                                                                        createAccordionAction(subscribedAPIResource)
                                                                    }
                                                                />
                                                                <SegmentedAccordion.Content
                                                                    active={ activeSubscribedAPIResource
                                                                        === subscribedAPIResource.id }
                                                                    data-componentid={
                                                                        `${componentId}-${subscribedAPIResource.id}
                                                                                    -content`
                                                                    }
                                                                    children={
                                                                        resolveSubscribedAPIResourcesListContent(
                                                                            subscribedAPIResource) }
                                                                />
                                                            </Fragment>
                                                        )
                                                    )
                                                }
                                            </SegmentedAccordion>
                                        )
                                        : getPlaceholders()
                                }
                            </ListLayout>
                        </Grid.Column>
                    </Grid.Row>
                    {
                        copyScopesValue && (
                            <Grid.Row className="mt-2">
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                                    <Grid.Row>
                                        <Form>
                                            <Form.Field>
                                                <CopyInputField
                                                    className="copy-input spaced"
                                                    value={ copyScopesValue }
                                                    data-componentid={ `${ componentId }-selected-scope-area` }
                                                />
                                                <Hint>
                                                    { t("extensions:develop.applications.edit.sections." +
                                                    "apiAuthorization.sections.apiSubscriptions.scopesSection." +
                                                    "copyScopesHint") }
                                                </Hint>
                                            </Form.Field>
                                        </Form>
                                    </Grid.Row>
                                </Grid.Column>
                            </Grid.Row>
                        )
                    }
                </Grid>
            )
    );

};

/**
 * Default props for the component.
 */
SubscribedAPIResources.defaultProps = {
    "data-componentid": "subscribed-api-resources"
};
