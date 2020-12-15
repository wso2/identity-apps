/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { getRawDocumentation } from "@wso2is/core/api";
import { TestableComponentInterface } from "@wso2is/core/models";
import {
    ContentLoader,
    EmptyPlaceholder,
    Heading,
    HelpPanelLayout,
    HelpPanelTabInterface,
    Hint,
    Markdown,
    PageHeader,
    PageLayout,
    SelectionCard,
    TemplateGrid
} from "@wso2is/react-components";
import _ from "lodash";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import {
    AppConstants,
    AppState,
    ConfigReducerStateInterface,
    DocPanelUICardInterface,
    HelpPanelUtils,
    PortalDocumentationStructureInterface,
    getEmptyPlaceholderIllustrations,
    getHelpPanelActionIcons,
    history
} from "../../core";
import {
    getIdentityProviderList,
    getIdentityProviderTemplate,
    getIdentityProviderTemplateList
} from "../api";
import {
    ExpertModeTemplate,
    IdentityProviderCreateWizard,
    handleGetIDPTemplateAPICallError,
    handleGetIDPTemplateListError
} from "../components";
import {
    getHelpPanelIcons,
    getIdPCapabilityIcons,
    getIdPIcons,
    getIdPTemplateDocsIcons
} from "../configs";
import { IdentityProviderManagementConstants } from "../constants";
import {
    IdentityProviderListResponseInterface,
    IdentityProviderTemplateListItemInterface,
    IdentityProviderTemplateListItemResponseInterface,
    IdentityProviderTemplateListResponseInterface,
    SupportedServices,
    SupportedServicesInterface
} from "../models";
import { setAvailableAuthenticatorsMeta } from "../store";
import { IdentityProviderManagementUtils } from "../utils";

/**
 * Proptypes for the IDP template selection page component.
 */
type IdentityProviderTemplateSelectPagePropsInterface = TestableComponentInterface

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
        [ "data-testid" ]: testId
    } = props;

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const availableAuthenticators = useSelector((state: AppState) => state.identityProvider.meta.authenticators);
    const helpPanelDocStructure: PortalDocumentationStructureInterface = useSelector(
        (state: AppState) => state.helpPanel.docStructure);

    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ selectedTemplate, setSelectedTemplate ] = useState<IdentityProviderTemplateListItemInterface>(undefined);
    const [ selectedTemplateWithUniqueName, setSelectedTemplateWithUniqueName ] =
        useState<IdentityProviderTemplateListItemInterface>(undefined);
    const [ availableTemplates, setAvailableTemplates ] = useState<IdentityProviderTemplateListItemInterface[]>([]);
    const [ possibleListOfDuplicateIdps, setPossibleListOfDuplicateIdps ] = useState<string[]>(undefined);
    const [
        isIDPTemplateRequestLoading,
        setIDPTemplateRequestLoadingStatus
    ] = useState<boolean>(false);
    const [ helpPanelDocContent, setHelpPanelDocContent ] = useState<string>(undefined);
    const [ helpPanelSelectedTemplateDoc, setHelpPanelSelectedTemplateDoc ] = useState<any>(undefined);
    const [ docsTabBackButtonEnabled, setDocsTabBackButtonEnabled ] = useState<boolean>(true);
    const [ templateDocs, setTemplateDocs ] = useState<DocPanelUICardInterface[]>(undefined);
    const [
        isHelpPanelDocContentRequestLoading,
        setHelpPanelDocContentRequestLoadingStatus
    ] = useState<boolean>(false);

    /**
     * Called when the template doc is changed in the template section.
     */
    useEffect(() => {
        if (!helpPanelSelectedTemplateDoc?.docs) {
            return;
        }

        setHelpPanelDocContentRequestLoadingStatus(true);

        getRawDocumentation<string>(
            config.endpoints.documentationContent,
            helpPanelSelectedTemplateDoc.docs,
            config.deployment.documentation.provider,
            config.deployment.documentation.githubOptions.branch)
            .then((response) => {
                setHelpPanelDocContent(response);
            })
            .finally(() => {
                setHelpPanelDocContentRequestLoadingStatus(false);
            });
    }, [
        helpPanelSelectedTemplateDoc,
        config.endpoints.documentationContent,
        config.deployment.documentation.provider,
        config.deployment.documentation.githubOptions.branch
    ]);

    /**
     * Filter documents based on the template type.
     */
    useEffect(() => {
        const templateDocs = _.get(helpPanelDocStructure,
            IdentityProviderManagementConstants.IDP_TEMPLATES_CREATE_DOCS_KEY);

        if (!templateDocs) {
            return;
        }

        const templates: DocPanelUICardInterface[] =
            IdentityProviderManagementUtils.generateIDPTemplateDocs(templateDocs)
                .filter((doc) => doc.name !== "overview");

        if (templates instanceof Array && templates.length === 1) {
            setHelpPanelSelectedTemplateDoc(templateDocs[ 0 ]);
            setDocsTabBackButtonEnabled(false);
        }

        setTemplateDocs(templates);
    }, [ helpPanelDocStructure ]);

    /**
     * Build supported services from the given service identifiers.
     *
     * @param serviceIdentifiers Set of service identifiers.
     */
    const buildSupportedServices = (serviceIdentifiers: string[]): SupportedServicesInterface[] => {
        return serviceIdentifiers?.map((serviceIdentifier: string): SupportedServicesInterface => {
            switch (serviceIdentifier) {
                case SupportedServices.AUTHENTICATION:
                    return {
                        displayName: t("console:develop.pages.idpTemplate.supportServices.authenticationDisplayName"),
                        logo: getIdPCapabilityIcons()[SupportedServices.AUTHENTICATION],
                        name: SupportedServices.AUTHENTICATION
                    };
                case SupportedServices.PROVISIONING:
                    return {
                        displayName: t("console:develop.pages.idpTemplate.supportServices.provisioningDisplayName"),
                        logo: getIdPCapabilityIcons()[SupportedServices.PROVISIONING],
                        name: SupportedServices.PROVISIONING
                    };
            }
        });
    };

    /**
     * Interpret available templates from the response templates.
     *
     * @param templates List of response templates.
     * @return List of templates.
     */
    const interpretAvailableTemplates = (templates: IdentityProviderTemplateListItemResponseInterface[]):
        IdentityProviderTemplateListItemInterface[] => {
        return templates?.map(eachTemplate => {
            if (eachTemplate?.services[0] === "") {
                return {
                    ...eachTemplate,
                    services: []
                };
            } else {
                return {
                    ...eachTemplate,
                    services: buildSupportedServices(eachTemplate?.services)
                };
            }
        });
    };

    /**
     * Retrieve Identity Provider template list.
     *
     */
    const getTemplateList = (): void => {

        setIDPTemplateRequestLoadingStatus(true);

        getIdentityProviderTemplateList()
            .then((response: IdentityProviderTemplateListResponseInterface) => {
                if (!response?.totalResults) {
                    return;
                }
                // sort templateList based on display Order
                response?.templates.sort((a, b) => (a.displayOrder > b.displayOrder) ? 1 : -1);
                const availableTemplates: IdentityProviderTemplateListItemInterface[] = interpretAvailableTemplates(
                    response?.templates);

                // Add expert mode template
                availableTemplates.unshift(ExpertModeTemplate);

                setAvailableTemplates(availableTemplates);
            })
            .catch((error) => {
                handleGetIDPTemplateListError(error);
            })
            .finally(() => {
                setIDPTemplateRequestLoadingStatus(false);
            });
    };

    /**
     * Retrieve Identity Provider template.
     */
    const getTemplate = (templateId: string): void => {

        getIdentityProviderTemplate(templateId)
            .then((response) => {
                setSelectedTemplate(response as IdentityProviderTemplateListItemInterface);
            })
            .catch((error) => {
                handleGetIDPTemplateAPICallError(error);
            });
    };

    /**
     *  Get Identity Provider templates.
     */
    useEffect(() => {
        getTemplateList();
    }, []);

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
    const handleTemplateSelection = (e: SyntheticEvent, { id }: { id: string }): void => {
        if (id === "expert-mode") {
            setSelectedTemplate(ExpertModeTemplate);
            setSelectedTemplateWithUniqueName({
                ...ExpertModeTemplate,
                idp: {
                    ...selectedTemplate?.idp,
                    name: ""
                }
            });

            setShowWizard(true);
        } else {
            getTemplate(id);
        }
    };

    const getPossibleListOfDuplicateIdps = (idpName: string) => {
        getIdentityProviderList(null, null, "name eq " + idpName).then(
            (response: IdentityProviderListResponseInterface) => {
            setPossibleListOfDuplicateIdps( response?.totalResults ? response?.identityProviders?.map(
                eachIdp => eachIdp.name) : []);
        });
    };

    /**
     * Called when template is selected.
     */
    useEffect(() => {
        if (!selectedTemplate || !selectedTemplate?.idp?.name) {
            return;
        }
        getPossibleListOfDuplicateIdps(selectedTemplate?.idp?.name);
    }, [selectedTemplate]);

    /**
     * Generate the next unique name by appending 1-based index number to the provided initial value.
     *
     * @param initialIdpName Initial value for the IdP name.
     * @param idpList The list of available IdPs names.
     * @return A unique name from the provided list of names.
     */
    const generateUniqueIdpName = (initialIdpName: string, idpList: string[]): string => {
        let idpName = initialIdpName;
        for (let i = 2; ; i++) {
            if (!idpList?.includes(idpName)) {
                break;
            }
            idpName = initialIdpName + i;
        }
        return idpName;
    };

    /**
     * Called when possibleListOfDuplicateIdps is changed.
     */
    useEffect(() => {
        if (!possibleListOfDuplicateIdps) {
            return;
        }

        setSelectedTemplateWithUniqueName({
            ...selectedTemplate,
            idp: {
                ...selectedTemplate?.idp,
                name: generateUniqueIdpName(selectedTemplate?.idp?.name, possibleListOfDuplicateIdps)
            }
        });

        setShowWizard(true);
    }, [possibleListOfDuplicateIdps]);

    /**
     * Handles help panel template doc change event.
     *
     * @param template - Selected template.
     */
    const handleHelpPanelSelectedTemplate = (template: any) => {
        setHelpPanelSelectedTemplateDoc(template);
    };

    const helpPanelTabs: HelpPanelTabInterface[] = [
        {
            content: (
                helpPanelSelectedTemplateDoc
                    ? (
                        <>
                            <PageHeader
                                title={ helpPanelSelectedTemplateDoc.displayName }
                                titleAs="h4"
                                backButton={ docsTabBackButtonEnabled && {
                                    onClick: () => setHelpPanelSelectedTemplateDoc(undefined),
                                    text: t("console:develop.features.idp.helpPanel.tabs.samples.content.docs.goBack")
                                } }
                                bottomMargin={ false }
                                data-testid={ `${ testId }-help-panel-docs-tab-page-header` }
                            />
                            <Divider hidden/>
                            {
                                helpPanelSelectedTemplateDoc.docs && (
                                    isHelpPanelDocContentRequestLoading
                                        ? <ContentLoader dimmer/>
                                        : (
                                            <Markdown
                                                source={ helpPanelDocContent }
                                                data-testid={ `${ testId }-help-panel-docs-tab-markdown-renderer` }
                                            />
                                        )
                                )
                            }
                        </>
                    )
                    : (
                        <>
                            <Heading as="h4">
                                { t("console:develop.features.idp.helpPanel.tabs.samples.content.docs.title") }
                            </Heading>
                            <Hint>
                                { t("console:develop.features.idp.helpPanel.tabs.samples.content.docs.hint") }
                            </Hint>
                            <Divider hidden/>

                            <Grid>
                                <Grid.Row columns={ 4 }>
                                    {
                                        templateDocs && templateDocs.map((sample, index) => (
                                            <Grid.Column key={ index }>
                                                <SelectionCard
                                                    size="auto"
                                                    header={ sample.displayName }
                                                    image={ getIdPTemplateDocsIcons()[ sample.image ] }
                                                    imageSize="mini"
                                                    spaced="bottom"
                                                    onClick={ () => handleHelpPanelSelectedTemplate(sample) }
                                                    data-testid={ `${ testId }-help-panel-docs-tab-selection-card` }
                                                />
                                            </Grid.Column>
                                        ))
                                    }
                                </Grid.Row>
                            </Grid>
                        </>
                    )
            ),
            heading: t("common:docs"),
            hidden: !templateDocs || (templateDocs instanceof Array && templateDocs.length < 1),
            icon: {
                icon: getHelpPanelIcons().tabs.docs
            }
        }
    ];

    return (
        <HelpPanelLayout
            sidebarDirection="right"
            sidebarMiniEnabled={ true }
            tabs={ helpPanelTabs }
            onHelpPanelPinToggle={ () => HelpPanelUtils.togglePanelPin() }
            isPinned={ HelpPanelUtils.isPanelPinned() }
            icons={ {
                close: getHelpPanelActionIcons().close,
                pin: getHelpPanelActionIcons().pin
            } }
            sidebarToggleTooltip={ t("console:develop.features.helpPanel.actions.open") }
            pinButtonTooltip={ t("console:develop.features.helpPanel.actions.pin") }
            unpinButtonTooltip={ t("console:develop.features.helpPanel.actions.unPin") }
        >
            <PageLayout
                title={ t("console:develop.pages.idpTemplate.title") }
                contentTopMargin={ true }
                description={ t("console:develop.pages.idpTemplate.subTitle") }
                backButton={ {
                    "data-testid": `${ testId }-page-back-button`,
                    onClick: handleBackButtonClick,
                    text: t("console:develop.pages.idpTemplate.backButton")
                } }
                titleTextAlign="left"
                bottomMargin={ false }
                data-testid={ `${ testId }-page-layout` }
                showBottomDivider
            >
                {
                    (availableTemplates && !isIDPTemplateRequestLoading)
                        ? (
                            <div className="quick-start-templates">
                                <TemplateGrid<IdentityProviderTemplateListItemInterface>
                                    type="idp"
                                    templates={ availableTemplates.filter((template) => template.id !== "expert-mode") }
                                    templateIcons={ getIdPIcons() }
                                    templateIconOptions={ {
                                        fill: "primary"
                                    } }
                                    templateIconSize="tiny"
                                    showTags={ true }
                                    tagsKey="services"
                                    tagsAs="label"
                                    heading={ t("console:develop.features.idp.templates.quickSetup.heading") }
                                    subHeading={ t("console:develop.features.idp.templates.quickSetup.subHeading") }
                                    onTemplateSelect={ handleTemplateSelection }
                                    paginate={ true }
                                    paginationLimit={ 5 }
                                    paginationOptions={ {
                                        showLessButtonLabel: t("common:showLess"),
                                        showMoreButtonLabel: t("common:showMore")
                                    } }
                                    emptyPlaceholder={ (
                                        <EmptyPlaceholder
                                            image={ getEmptyPlaceholderIllustrations().newList }
                                            imageSize="tiny"
                                            title={ t("console:develop.features.templates.emptyPlaceholder.title") }
                                            subtitle={
                                                [ t("console:develop.features.templates.emptyPlaceholder.subtitles") ]
                                            }
                                        />
                                    ) }
                                    tagsSectionTitle={ t("common:services") }
                                    data-testid={ `${ testId }-quick-start-template-grid` }
                                />
                            </div>
                        )
                        : <ContentLoader dimmer/>
                }
                <Divider hidden/>
                <div className="custom-templates">
                    <TemplateGrid<IdentityProviderTemplateListItemInterface>
                        type="idp"
                        templates={ [ ExpertModeTemplate ] }
                        templateIcons={ getIdPIcons() }
                        templateIconOptions={ {
                            fill: "primary"
                        } }
                        templateIconSize="tiny"
                        heading={ t("console:develop.features.idp.templates.manualSetup.heading") }
                        subHeading={ t("console:develop.features.idp.templates.manualSetup.subHeading") }
                        onTemplateSelect={ handleTemplateSelection }
                        paginate={ true }
                        paginationLimit={ 5 }
                        paginationOptions={ {
                            showLessButtonLabel: t("common:showLess"),
                            showMoreButtonLabel: t("common:showMore")
                        } }
                        emptyPlaceholder={ (
                            <EmptyPlaceholder
                                image={ getEmptyPlaceholderIllustrations().newList }
                                imageSize="tiny"
                                title={ t("console:develop.features.templates.emptyPlaceholder.title") }
                                subtitle={ [ t("console:develop.features.templates.emptyPlaceholder.subtitles") ] }
                            />
                        ) }
                        tagsSectionTitle={ t("common:services") }
                        data-testid={ `${ testId }-manual-setup-template-grid` }
                    />
                </div>
                { showWizard && (
                    <IdentityProviderCreateWizard
                        title={ selectedTemplateWithUniqueName?.name }
                        subTitle={ selectedTemplateWithUniqueName?.description }
                        closeWizard={ () => {
                            setSelectedTemplateWithUniqueName(undefined);
                            setSelectedTemplate(undefined);
                            setShowWizard(false);
                        } }
                        template={ selectedTemplateWithUniqueName?.idp }
                    />
                ) }
            </PageLayout>
        </HelpPanelLayout>
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
