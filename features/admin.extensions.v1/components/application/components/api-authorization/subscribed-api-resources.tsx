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

import Alert from "@oxygen-ui/react/Alert";
import { IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
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
import { getEmptyPlaceholderIllustrations, history } from "@wso2is/admin.core.v1";
import { RequestErrorInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { AxiosError } from "axios";
import React, { Fragment, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Form, Grid, Header, Icon, Input, Label } from "semantic-ui-react";
import { ScopeForm } from ".";
import { ExtendedFeatureConfigInterface } from "../../../../configs/models";
import { APIResourcesConstants } from "@wso2is/admin.api-resources.v1/constants";
import { APIResourceInterface } from "@wso2is/admin.api-resources.v1/models";
import { Policy } from "../../constants";
import { AuthorizedAPIListItemInterface, AuthorizedPermissionListItemInterface } from "../../models";

/**
 * Prop types for the API resources list component.
 */
interface SubscribedAPIResourcesProps extends
    SBACInterface<ExtendedFeatureConfigInterface>, IdentifiableComponentInterface {
    /**
     * Application ID.
     */
    appId: string;
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
     * Is the application a choreo app.
     */
    isChoreoApp: boolean;
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
        allAPIResourcesListData,
        allAPIResourcesFetchRequestError,
        allAuthorizedScopes,
        subscribedAPIResourcesListData,
        subscribedAPIResourcesFetchRequestError,
        isScopesAvailableForUpdate,
        isChoreoApp,
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

    const [ activeSubscribedAPIResource, setActiveSubscribedAPIResource ] = useState<string>(null);
    const [ searchQuery, setSearchQuery ] = useState<string>(null);
    const [ searchedSubscribedAPIResources, setSearchedSubscribedAPIResources ] =
        useState<AuthorizedAPIListItemInterface[]>(null);
    const [ copyScopesValue, setCopyScopesValue ] = useState<string>(null);

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
                        ".apiSubscriptions.placeHolderTexts.errorText.title") }
                    subtitle={ [ t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.placeHolderTexts.errorText.subtitles.1"),
                    t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.placeHolderTexts.errorText.subtitles.0") ] }
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
                                    ".apiSubscriptions.buttons.noAPIResourcesLink") }
                            </Link> )
                    ) }
                    imageSize="tiny"
                    subtitle={ [ t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.placeHolderTexts.noAPIResources") ] }
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
                                    ".apiSubscriptions.buttons.subAPIResource") }
                            </PrimaryButton> )
                    ) }
                    imageSize="tiny"
                    subtitle={ [ t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.placeHolderTexts.emptyText") ] }
                    data-componentid={ `${componentId}-sub-empty-placeholder-icon` }
                />
            );
        } else if (searchedSubscribedAPIResources?.length === 0) {
            return (
                <EmptyPlaceholder
                    title={ t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.placeHolderTexts.emptySearch.title") }
                    subtitle={ [ t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.placeHolderTexts.emptySearch.subTitle.0"),
                    t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                        ".apiSubscriptions.placeHolderTexts.emptySearch.subTitle.1") ] }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    action={
                        (<LinkButton onClick={ clearSearchQuery }>
                            { t("extensions:develop.applications.edit.sections.apiAuthorization.sections" +
                                ".apiSubscriptions.buttons.emptySearchButton") }
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
                                        { subscribedAPIResource.apiDisplayName }
                                        {
                                            subscribedAPIResource.isChoreoAPI && (
                                                <Label
                                                    size="mini"
                                                    className="choreo-label"
                                                >
                                                    { t("extensions:develop.apiResource.managedByChoreoText") }
                                                </Label>
                                            )
                                        }
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Header.Subheader className="mt-1">
                                {
                                    subscribedAPIResource.apiIdentifier
                                        ? <Code withBackground>{ subscribedAPIResource.apiIdentifier }</Code>
                                        : null
                                }
                            </Header.Subheader>
                        </Header.Content>
                    </Grid.Column>
                    <Grid.Column width={ 8 }>
                        {
                            subscribedAPIResource.apiIdentifier
                                ? (
                                    <Header.Subheader>
                                        { renderPolicyForAPIResource(subscribedAPIResource.policyIdentifier) }
                                    </Header.Subheader>
                                )
                                : null
                        }
                    </Grid.Column>
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
                    ".apiSubscriptions.unsubscribeAPIResourcePopOver"),
                type: "icon"
            }
        ];
    };

    /**
     * Resolves the content of the subscribed API Resources list item.
     */
    const resolveSubscribedAPIResourcesListContent = (subscribedAPIResource: AuthorizedAPIListItemInterface):
        ReactElement => (

        <>
            {
                isChoreoApp && subscribedAPIResource.isChoreoAPI && (
                    <Alert severity="warning">
                        <Trans
                            i18nKey={ "extensions:develop.applications.edit.sections.apiAuthorization.sections." +
                                "apiSubscriptions.choreoApiEditWarning" }
                        >
                            Updating the authorized scopes will create unforeseen errors as this is an API resource
                            managed by Choreo. <b>Proceed with caution.</b>
                        </Trans>
                    </Alert>
                )
            }
            <ScopeForm
                appId={ appId }
                subscribedAPIResource={ subscribedAPIResource }
                isScopesAvailableForUpdate={ isScopesAvailableForUpdate }
                bulkChangeAllAuthorizedScopes={ bulkChangeAllAuthorizedScopes }
            />
        </>
    );

    /**
     * Handle the click event of the subscribed API Resources list item.
     */
    const handleSubscribedAPIResourcesListItemClick = (subscribedAPIResource: AuthorizedAPIListItemInterface): void => {
        activeSubscribedAPIResource === subscribedAPIResource.apiId
            ? setActiveSubscribedAPIResource(null)
            : setActiveSubscribedAPIResource(subscribedAPIResource.apiId);
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
                    return subscribedAPIResource.apiDisplayName.toLowerCase().includes(query.toLowerCase());
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
                                                "apiAuthorization.sections.apiSubscriptions.search") }
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
                                                            <Fragment key={ subscribedAPIResource.apiId }>
                                                                <SegmentedAccordion.Title
                                                                    id={ subscribedAPIResource.apiId }
                                                                    data-componentid={
                                                                        `${componentId}-title`
                                                                    }
                                                                    active={ activeSubscribedAPIResource
                                                                        === subscribedAPIResource.apiId }
                                                                    accordionIndex={ subscribedAPIResource.apiId }
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
                                                                        === subscribedAPIResource.apiId }
                                                                    data-componentid={
                                                                        `${componentId}-${subscribedAPIResource.apiId}
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
