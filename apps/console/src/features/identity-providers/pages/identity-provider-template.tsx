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

import { TestableComponentInterface } from "@wso2is/core/models";
import {
    ContentLoader,
    GridLayout,
    PageLayout,
    ResourceGrid
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import {
    AppConstants,
    AppState,
    ConfigReducerStateInterface,
    history
} from "../../core";
import { AuthenticatorCreateWizardFactory } from "../components/wizards";
import { getIdPIcons } from "../configs";
import { IdentityProviderManagementConstants } from "../constants";
import {
    IdentityProviderTemplateCategoryInterface,
    IdentityProviderTemplateInterface,
    IdentityProviderTemplateItemInterface,
    IdentityProviderTemplateLoadingStrategies
} from "../models";
import { setAvailableAuthenticatorsMeta } from "../store";
import { IdentityProviderManagementUtils, IdentityProviderTemplateManagementUtils } from "../utils";

/**
 * Proptypes for the IDP template selection page component.
 */
type IdentityProviderTemplateSelectPagePropsInterface = TestableComponentInterface & RouteComponentProps;

/**
 * Choose the application template from this page.
 *
 * @param {IdentityProviderTemplateSelectPagePropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const IdentityProviderTemplateSelectPage: FunctionComponent<IdentityProviderTemplateSelectPagePropsInterface> = (
    props: IdentityProviderTemplateSelectPagePropsInterface
): ReactElement => {

    const {
        location,
        [ "data-testid" ]: testId
    } = props;

    const urlSearchParams: URLSearchParams = new URLSearchParams(location.search);

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const availableAuthenticators = useSelector((state: AppState) => state.identityProvider.meta.authenticators);
    const identityProviderTemplates: IdentityProviderTemplateItemInterface[] = useSelector(
        (state: AppState) => state.identityProvider?.groupedTemplates);

    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ templateType, setTemplateType ] = useState<string>(undefined);
    const [ categorizedTemplates, setCategorizedTemplates ] = useState<IdentityProviderTemplateCategoryInterface[]>([]);
    const [
        isIDPTemplateRequestLoading,
        setIDPTemplateRequestLoadingStatus
    ] = useState<boolean>(false);
    const [ selectedTemplate, setSelectedTemplate ] = useState<IdentityProviderTemplateInterface>(undefined);

    /**
     *  Get IDP templates.
     */
    useEffect(() => {

        if (identityProviderTemplates !== undefined) {
            return;
        }

        setIDPTemplateRequestLoadingStatus(true);

        const useAPI: boolean = config.ui.identityProviderTemplateLoadingStrategy ?
            config.ui.identityProviderTemplateLoadingStrategy === IdentityProviderTemplateLoadingStrategies.REMOTE :
            IdentityProviderManagementConstants.DEFAULT_IDP_TEMPLATE_LOADING_STRATEGY ===
            IdentityProviderTemplateLoadingStrategies.REMOTE;

        /**
         * With {@link skipGrouping} being {@code false} we say
         * we need to group the existing templates based on their
         * template-group.
         */
        const skipGrouping = false, sortTemplates = true;

        IdentityProviderTemplateManagementUtils
            .getIdentityProviderTemplates(useAPI, skipGrouping, sortTemplates)
            .finally(() => setIDPTemplateRequestLoadingStatus(false));

    }, [ identityProviderTemplates ]);

    /**
     * Categorize the IDP templates.
     */
    useEffect(() => {

        if (!identityProviderTemplates || !Array.isArray(identityProviderTemplates)
            || !(identityProviderTemplates.length > 0)) {
            return;
        }

        IdentityProviderTemplateManagementUtils.categorizeTemplates(identityProviderTemplates)
            .then((response: IdentityProviderTemplateCategoryInterface[]) => {
                setCategorizedTemplates(response);
            })
            .catch(() => {
                setCategorizedTemplates([]);
            });
    }, [ identityProviderTemplates ]);

    /**
     * Subscribe to the URS search params to check for IDP create wizard triggers.
     * ex: If the URL contains a search param `?open=8ea23303-49c0-4253-b81f-82c0fe6fb4a0`,
     * it'll open up the IDP create template with ID `8ea23303-49c0-4253-b81f-82c0fe6fb4a0`.
     */
    useEffect(() => {

        if (!urlSearchParams.get(IdentityProviderManagementConstants.IDP_CREATE_WIZARD_TRIGGER_URL_SEARCH_PARAM_KEY)) {
            return;
        }

        if (urlSearchParams.get(IdentityProviderManagementConstants.IDP_CREATE_WIZARD_TRIGGER_URL_SEARCH_PARAM_KEY)
            === IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.GOOGLE) {

            handleTemplateSelection(null, IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.GOOGLE);
            return;
        }
    }, [ urlSearchParams.get(IdentityProviderManagementConstants.IDP_CREATE_WIZARD_TRIGGER_URL_SEARCH_PARAM_KEY) ]);

    /**
     * Handles back button click.
     */
    const handleBackButtonClick = (): void => {

        if (availableAuthenticators) {
            dispatch(setAvailableAuthenticatorsMeta(undefined));
        }

        history.push(AppConstants.getPaths().get("IDP"));
    };

    /**
     * Handles template selection.
     *
     * @param {React.SyntheticEvent} e - Click event.
     * @param {string} id - Id of the template.
     */
    const handleTemplateSelection = (e: SyntheticEvent, id: string): void => {

        /**
         * Find the matching template for the selected card.
         * if found then set the template to state.
         */
        const selectedTemplate = identityProviderTemplates.find(({ id: templateId }) => (templateId === id));

        if (selectedTemplate) {
            setSelectedTemplate(selectedTemplate);
        }

        setTemplateType(id);
    };

    /**
     * On successful IDP creation, navigates to the IDP views.
     *
     * @param {string} id - ID of the created IDP.
     */
    const handleSuccessfulIDPCreation = (id: string): void => {

        // If ID is present, navigate to the edit page of the created IDP.
        if (id) {
            history.push({
                pathname: AppConstants.getPaths().get("IDP_EDIT").replace(":id", id),
                search: IdentityProviderManagementConstants.NEW_IDP_URL_SEARCH_PARAM
            });

            return;
        }

        // Fallback to identity providers page, if id is not present.
        history.push(AppConstants.getPaths().get("IDP"));
    };

    return (
        <PageLayout
            title={ t("console:develop.pages.authenticationProviderTemplate.title") }
            contentTopMargin={ true }
            description={ t("console:develop.pages.authenticationProviderTemplate.subTitle") }
            backButton={ {
                "data-testid": `${ testId }-page-back-button`,
                onClick: handleBackButtonClick,
                text: t("console:develop.pages.authenticationProviderTemplate.backButton")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            data-testid={ `${ testId }-page-layout` }
            showBottomDivider
        >
            <GridLayout>
                {
                    (categorizedTemplates && !isIDPTemplateRequestLoading)
                        ? (
                            categorizedTemplates
                                .map((category: IdentityProviderTemplateCategoryInterface, index: number) => (
                                    <ResourceGrid key={ index }>
                                        {
                                            category.templates.map((
                                                template: IdentityProviderTemplateInterface,
                                                templateIndex: number
                                            ) => (
                                                <ResourceGrid.Card
                                                    key={ templateIndex }
                                                    resourceName={ template.name }
                                                    isResourceComingSoon={ template.disabled }
                                                    comingSoonRibbonLabel={ t("common:comingSoon") }
                                                    resourceDescription={ template.description }
                                                    resourceImage={
                                                        IdentityProviderManagementUtils
                                                            .resolveTemplateImage(template.image, getIdPIcons())
                                                    }
                                                    tags={ template.tags }
                                                    onClick={ (e: SyntheticEvent) => {
                                                        handleTemplateSelection(e, template.id);
                                                    } }
                                                    data-testid={ `${ testId }-${ template.name }` }
                                                />
                                            ))
                                        }
                                    </ResourceGrid>
                                ))
                        )
                        : <ContentLoader dimmer/>
                }
            </GridLayout>
            <AuthenticatorCreateWizardFactory
                open={ showWizard }
                type={ templateType }
                selectedTemplate={ selectedTemplate }
                onIDPCreate={ handleSuccessfulIDPCreation }
                onWizardClose={ () => {
                    setTemplateType(undefined);
                    setShowWizard(false);
                } }
            />
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
IdentityProviderTemplateSelectPage.defaultProps = {
    "data-testid": "idp-templates"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default IdentityProviderTemplateSelectPage;
