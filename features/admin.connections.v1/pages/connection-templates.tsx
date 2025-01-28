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

import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import {
    getEmptyPlaceholderIllustrations
} from "@wso2is/admin.core.v1/configs/ui";
import {
    AppConstants
} from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import useDeploymentConfig from "@wso2is/admin.core.v1/hooks/use-app-configs";
import { RequestErrorInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import { AppState } from "@wso2is/admin.core.v1/store";
import { EventPublisher } from "@wso2is/admin.core.v1/utils/event-publisher";
import { FeatureStatusLabel } from "@wso2is/admin.feature-gate.v1/models/feature-status";
import {
    useGetIdVPTemplateList
} from "@wso2is/admin.identity-verification-providers.v1/api/use-get-idvp-template-list";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    DocumentationLink,
    EmptyPlaceholder,
    GridLayout,
    PageLayout,
    ResourceGrid,
    SearchWithFilterLabels,
    useDocumentation
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import union from "lodash-es/union";
import React, { FC, ReactElement, ReactNode, SyntheticEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { useGetConnectionTemplates } from "../api/use-get-connection-templates";
import { ConnectionCreateWizardFactory } from "../components/create/connection-create-wizard-factory";
import { CommonAuthenticatorConstants } from "../constants/common-authenticator-constants";
import { ConnectionUIConstants } from "../constants/connection-ui-constants";
import {
    ConnectionTemplateInterface,
    ConnectionTemplateItemInterface
} from "../models/connection";
import {
    ConnectionsManagementUtils,
    handleGetConnectionTemplateListError,
    resolveConnectionName
} from "../utils/connection-utils";

/**
 * Proptypes for the Connection template page component.
 */
type ConnectionTemplatePagePropsInterface = IdentifiableComponentInterface & RouteComponentProps

/**
 * Connection template page component page.
 *
 * @param props - Props injected to the component.
 *
 * @returns React.Element
 */
const ConnectionTemplatesPage: FC<ConnectionTemplatePagePropsInterface> = (
    props: ConnectionTemplatePagePropsInterface
): ReactElement => {

    const {
        location,
        [ "data-componentid" ]: componentId
    } = props;

    const urlSearchParams: URLSearchParams = new URLSearchParams(location.search);

    const { t } = useTranslation();
    const { getLink } = useDocumentation();
    const { deploymentConfig } = useDeploymentConfig();
    const { UIConfig } = useUIConfig();

    const productName: string = useSelector((state: AppState) => state?.config?.ui?.productName);
    const idVPFeatureConfig: FeatureAccessConfigInterface = UIConfig?.features?.identityVerificationProviders;
    const isIdVPFeatureEnabled: boolean = idVPFeatureConfig?.enabled;
    const hasIdVPCreatePermissions: boolean = useRequiredScopes(idVPFeatureConfig?.scopes?.create);

    // External connection resources URL from the UI config.
    const connectionResourcesUrl: string = UIConfig?.connectionResourcesUrl;

    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ templateType, setTemplateType ] = useState<string>(undefined);
    const [ selectedTemplate, setSelectedTemplate ] = useState<any>(undefined);
    const [ filterTags, setFilterTags ] = useState<string[]>([]);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ filteredConnectionTemplates, setFilteredConnectionTemplates ] = useState<ConnectionTemplateInterface[]>([]);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const {
        data: fetchedConnectionTemplates,
        isLoading: isConnectionTemplatesFetchRequestLoading,
        error: connectionTemplatesFetchRequestError,
        isValidating: isConnectionTemplatesRequestValidating
    } = useGetConnectionTemplates(null, null, null);

    const {
        data: fetchedIdVPTemplates,
        isLoading: isIdVPTemplatesFetchRequestLoading,
        error: idVPTemplatesFetchRequestError,
        isValidating: isIdVPTemplatesRequestValidating
    } = useGetIdVPTemplateList(isIdVPFeatureEnabled && hasIdVPCreatePermissions);

    const isTemplatesLoading: boolean = isConnectionTemplatesFetchRequestLoading || isIdVPTemplatesFetchRequestLoading;
    const isTemplatesValidating: boolean = isConnectionTemplatesRequestValidating || isIdVPTemplatesRequestValidating;
    const templatesFetchError: AxiosError<RequestErrorInterface> = connectionTemplatesFetchRequestError
        || idVPTemplatesFetchRequestError;

    const combinedConnectionTemplates: ConnectionTemplateInterface[] = useMemo(() => {
        if (isTemplatesLoading || templatesFetchError) {
            return [];
        }

        return [ ...fetchedConnectionTemplates, ...(fetchedIdVPTemplates ?? []) ];
    }, [ isTemplatesLoading, isTemplatesValidating, templatesFetchError ]);

    /**
     * Set the filtered connection templates to the component state
     * and set the filter tags lit based on the fetched templates.
     */
    useEffect(() => {
        if (isTemplatesLoading) {
            return;
        }

        setFilteredConnectionTemplates(combinedConnectionTemplates);

        let _filterTagsList: string[] = [];

        for (const template of combinedConnectionTemplates) {
            if (template.tags?.length > 0) {
                _filterTagsList = union(_filterTagsList, template.tags);
            }
        }
        setFilterTags(_filterTagsList);

    }, [ isConnectionTemplatesFetchRequestLoading, isIdVPTemplatesFetchRequestLoading ]);

    /**
     * Handles the connection template fetch request errors.
     */
    useEffect(() => {
        if (!connectionTemplatesFetchRequestError) {
            return;
        }

        handleGetConnectionTemplateListError(connectionTemplatesFetchRequestError);
        setFilteredConnectionTemplates([]);
    }, [ connectionTemplatesFetchRequestError ]);

    /**
     * Subscribe to the URS search params to check for IDP create wizard triggers.
     * ex: If the URL contains a search param `?open=8ea23303-49c0-4253-b81f-82c0fe6fb4a0`,
     * it'll open up the IDP create template with ID `8ea23303-49c0-4253-b81f-82c0fe6fb4a0`.
     */
    useEffect(() => {

        if (!urlSearchParams.get(ConnectionUIConstants.IDP_CREATE_WIZARD_TRIGGER_URL_SEARCH_PARAM_KEY)) {
            return;
        }

        if (urlSearchParams.get(ConnectionUIConstants.IDP_CREATE_WIZARD_TRIGGER_URL_SEARCH_PARAM_KEY)
            === CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.GOOGLE) {

            handleTemplateSelection(null, CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.GOOGLE);

            return;
        }
    }, [ urlSearchParams.get(ConnectionUIConstants.IDP_CREATE_WIZARD_TRIGGER_URL_SEARCH_PARAM_KEY) ]);

    /**
     * Handles back button click.
     */
    const handleBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("IDP"));
    };

    /**
     * Handles template selection.
     *
     * @param e - Click event of type React.SyntheticEvent.
     * @param id - Id of the template.
     */
    const handleTemplateSelection = (e: SyntheticEvent, id: string): void => {

        /**
         * Find the matching template for the selected card.
         * if found then set the template to state.
         */
        const selectedTemplate: ConnectionTemplateItemInterface = filteredConnectionTemplates?.find(
            ({ id: templateId }: { id: string }) => (templateId === id));

        if (selectedTemplate) {
            setSelectedTemplate(selectedTemplate);
            eventPublisher.publish("connections-select-template", {
                type: selectedTemplate.templateId
            });
        }

        setTemplateType(id);
    };

    /**
     * On successful IDP creation, navigates to the IDP views.
     *
     * @param id - ID of the created IDP.
     */
    const handleSuccessfulIDPCreation = (id: string): void => {

        // If ID is present, navigate to the edit page of the created IDP.
        if (id) {
            history.push({
                pathname: AppConstants.getPaths().get("IDP_EDIT").replace(":id", id),
                search: ConnectionUIConstants.NEW_IDP_URL_SEARCH_PARAM
            });

            return;
        }

        // Fallback to identity providers page, if id is not present.
        history.push(AppConstants.getPaths().get("IDP"));
    };

    /**
     * Get search results.
     *
     * @param query - Search query.
     * @param filterLabels - Array of filter labels.
     *
     * @returns A filtered list of connection templates.
     */
    const getSearchResults = (query: string, filterLabels: string[]): ConnectionTemplateInterface[] => {
        let _filteredCategorizedTemplates: ConnectionTemplateInterface[] = [];

        if (filterLabels.length > 0) {
            // Filter out the templates based on the selected filter labels.
            for (const connectionTemplate of combinedConnectionTemplates) {
                if (connectionTemplate.tags.some((tag: string) => filterLabels.includes(tag))) {
                    _filteredCategorizedTemplates.push(connectionTemplate);
                }
            }
        } else {
            _filteredCategorizedTemplates = [ ...combinedConnectionTemplates ];
        }

        if (query) {
            // Filter out the templates based on the search query.
            _filteredCategorizedTemplates = _filteredCategorizedTemplates
                .filter((template: ConnectionTemplateInterface) => {
                    const name: string = template.name.toLocaleLowerCase();

                    return name.includes(query.toLocaleLowerCase());
                });
        }

        return _filteredCategorizedTemplates;
    };

    /**
     * Handles the Connection Type Search input onchange.
     *
     * @param query - Search query.
     * @param selectedFilters - Array of selected filters.
     */
    const handleConnectionTypeSearch = (query: string, selectedFilters: string[]): void => {

        // Update the internal state to manage placeholders etc.
        setSearchQuery(query);
        // Filter out the templates.
        setFilteredConnectionTemplates(getSearchResults(query, selectedFilters));
    };

    /**
     * Handles Connection Type filter.
     *
     * @param query - Search query.
     * @param selectedFilters - Array of the selected filters.
     */
    const handleConnectionTypeFilter = (query: string, selectedFilters: string[]): void => {

        // Update the internal state to manage placeholders etc.
        setSearchQuery(query);
        // Filter out the templates.
        setFilteredConnectionTemplates(getSearchResults(query, selectedFilters));
    };

    /**
     * Resolve the relevant placeholder.
     *
     * @returns React.ReactElement
     */
    const showPlaceholders = (list: any[]): ReactElement => {

        // When the search returns empty.
        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("console:develop.placeholders.emptySearchResult.title") }
                    subtitle={ [
                        t("console:develop.placeholders.emptySearchResult.subtitles.0", { query: searchQuery }),
                        t("console:develop.placeholders.emptySearchResult.subtitles.1")
                    ] }
                    data-componentid={ `${ componentId }-empty-search-placeholder` }
                />
            );
        }

        // Edge case, templates will never be empty.
        if (list?.length === 0) {
            return (
                <EmptyPlaceholder
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={
                        t("authenticationProvider:placeHolders.emptyConnectionTypeList.title")
                    }
                    subtitle={ [
                        t("authenticationProvider:placeHolders.emptyConnectionTypeList" +
                            ".subtitles.0"),
                        t("authenticationProvider:placeHolders.emptyConnectionTypeList" +
                            ".subtitles.1")
                    ] }
                    data-componentid={ `${ componentId }-empty-placeholder` }
                />
            );
        }

        return null;
    };

    return (
        <PageLayout
            pageTitle={ "Create New Connection" }
            title={ t("console:develop.pages.authenticationProviderTemplate.title") }
            contentTopMargin={ true }
            description={ (
                <>
                    { t("console:develop.pages.authenticationProviderTemplate.subTitle") }
                    <DocumentationLink
                        link={ getLink("develop.connections.newConnection.learnMore") }
                    >
                        { t("common:learnMore") }
                    </DocumentationLink>
                </>
            ) }
            backButton={ {
                "data-componentid": `${ componentId }-page-back-button`,
                onClick: handleBackButtonClick,
                text: t("console:develop.pages.authenticationProviderTemplate.backButton")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            data-componentid={ `${ componentId }-page-layout` }
            showBottomDivider
        >
            <GridLayout
                search={ (
                    <SearchWithFilterLabels
                        placeholder={ t("console:develop.pages.authenticationProviderTemplate.search.placeholder") }
                        onSearch={ handleConnectionTypeSearch }
                        onFilter={ handleConnectionTypeFilter }
                        filterLabels={ filterTags }
                        isLoading={ isTemplatesLoading }
                    />
                ) }
            >
                <ResourceGrid
                    isEmpty={ filteredConnectionTemplates?.length === 0 }
                    emptyPlaceholder={ showPlaceholders(filteredConnectionTemplates) }
                    isLoading={ isTemplatesLoading }
                >
                    {
                        filteredConnectionTemplates?.map((
                            template: ConnectionTemplateInterface,
                            templateIndex: number
                        ) => {
                            // if the template is "organization-enterprise-idp",
                            // then prevent rendering it.
                            if (template.id === CommonAuthenticatorConstants
                                .CONNECTION_TEMPLATE_IDS.ORGANIZATION_ENTERPRISE_IDP) {

                                return null;
                            }

                            let isTemplateDisabled: boolean = template.disabled;
                            let disabledHint: ReactNode = undefined;

                            // Disable the Apple template in localhost as it's not supported.
                            if (template.id === CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.APPLE &&
                                                    new URL(deploymentConfig?.serverOrigin)?.
                                                        hostname === CommonAuthenticatorConstants
                                                        .LOCAL_SERVER_URL) {
                                isTemplateDisabled = true;
                                disabledHint = t("console:develop.pages." +
                                    "authenticationProviderTemplate.disabledHint.apple");
                            }

                            return (
                                <ResourceGrid.Card
                                    key={ templateIndex }
                                    resourceName={
                                        resolveConnectionName(template?.name)
                                    }
                                    isResourceComingSoon={ template.comingSoon }
                                    disabled={ isTemplateDisabled }
                                    disabledHint={ disabledHint }
                                    comingSoonRibbonLabel={ t(FeatureStatusLabel.COMING_SOON) }
                                    resourceDescription={
                                        template?.description
                                            ?.replaceAll("{{productName}}", productName)
                                    }
                                    showSetupGuideButton={ getLink(template.docLink) !== undefined }
                                    resourceDocumentationLink={
                                        getLink(ConnectionsManagementUtils
                                            .resolveConnectionDocLink(template.id))
                                    }
                                    resourceImage={
                                        ConnectionsManagementUtils
                                            .resolveConnectionResourcePath(
                                                connectionResourcesUrl, template.image)
                                    }
                                    tags={ template.tags }
                                    showActions={ true }
                                    onClick={ (e: SyntheticEvent) => {
                                        handleTemplateSelection(e, template.id);
                                        setShowWizard(true);
                                    } }
                                    showTooltips={
                                        {
                                            description: true,
                                            header: false
                                        }
                                    }
                                    data-testid={ `${ componentId }-${ template.name }` }
                                />
                            );
                        })
                    }
                </ResourceGrid>
            </GridLayout>
            {
                showWizard && (
                    <ConnectionCreateWizardFactory
                        isModalOpen={ showWizard }
                        handleModalVisibility={ (isOpen: boolean) => setShowWizard(isOpen) }
                        connectionType={ selectedTemplate?.type }
                        type={ templateType }
                        selectedTemplate={ selectedTemplate }
                        onIDPCreate={ handleSuccessfulIDPCreation }
                        onWizardClose={ () => {
                            setTemplateType(undefined);
                            setShowWizard(false);
                        } }
                    />
                )
            }
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
ConnectionTemplatesPage.defaultProps = {
    "data-componentid": "connection-templates"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ConnectionTemplatesPage;
