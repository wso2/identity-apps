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
    getIdentityProviderTemplate
} from "../api";
import {
    ExpertModeTemplate,
    IdentityProviderCreateWizard,
    handleGetIDPTemplateAPICallError
} from "../components";
import {
    getHelpPanelIcons,
    getIdPIcons,
    getIdPTemplateDocsIcons
} from "../configs";
import { IdentityProviderManagementConstants } from "../constants";
import {
    IdentityProviderListResponseInterface,
    IdentityProviderTemplateCategoryInterface,
    IdentityProviderTemplateInterface,
    IdentityProviderTemplateItemInterface, IdentityProviderTemplateLoadingStrategies,
} from "../models";
import { setAvailableAuthenticatorsMeta } from "../store";
import { IdentityProviderManagementUtils } from "../utils";
import { IdentityProviderTemplateManagementUtils } from "../utils/identity-provider-template-management-utils";

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
    const [ selectedTemplate, setSelectedTemplate ] = useState<IdentityProviderTemplateInterface>(undefined);
    const [ selectedTemplateWithUniqueName, setSelectedTemplateWithUniqueName ] =
        useState<IdentityProviderTemplateInterface>(undefined);
    const [ categorizedTemplates, setCategorizedTemplates ] = useState<IdentityProviderTemplateCategoryInterface[]>([]);
    const identityProviderTemplates: IdentityProviderTemplateItemInterface[] = useSelector(
        (state: AppState) => state?.identityProvider?.templates);
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
     *  Get IDP templates.
     */
    useEffect(() => {
        if (identityProviderTemplates !== undefined) {
            return;
        }

        setIDPTemplateRequestLoadingStatus(true);

        const useAPI: boolean = config.ui.identityProviderTemplateLoadingStrategy ?
            config.ui.identityProviderTemplateLoadingStrategy === IdentityProviderTemplateLoadingStrategies.REMOTE :
            IdentityProviderManagementConstants.
                DEFAULT_IDP_TEMPLATE_LOADING_STRATEGY === IdentityProviderTemplateLoadingStrategies.REMOTE;
        IdentityProviderTemplateManagementUtils.getIdentityProviderTemplates(useAPI)
            .finally(() => {
                setIDPTemplateRequestLoadingStatus(false);
            });
    }, [ identityProviderTemplates ]);

    /**
     * Categorize the IDP templates.
     */
    useEffect(() => {
        if (!identityProviderTemplates || !Array.isArray(identityProviderTemplates) || !(identityProviderTemplates.length > 0)) {
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
     * Retrieve Identity Provider template.
     */
    const getTemplate = (templateId: string): void => {

        getIdentityProviderTemplate(templateId)
            .then((response) => {
                setSelectedTemplate(response as IdentityProviderTemplateInterface);
            })
            .catch((error) => {
                handleGetIDPTemplateAPICallError(error);
            });
    };

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

    /**
     * Generic function to render the template grid.
     *
     * @param {IdentityProviderTemplateInterface[]} templates - Set of templates to be displayed.
     * @param {object} additionalProps - Additional props for the `TemplateGrid` component.
     * @param {React.ReactElement} placeholder - Empty placeholder for the grid.
     * @param {IdentityProviderTemplateInterface[]} templatesOverrides - Template array which will get precedence.
     * @return {React.ReactElement}
     */
    const renderTemplateGrid = (templates: IdentityProviderTemplateInterface[],
                                additionalProps: object,
                                placeholder?: ReactElement,
                                templatesOverrides?: IdentityProviderTemplateInterface[]): ReactElement => {

        return (
            <TemplateGrid<IdentityProviderTemplateItemInterface>
                type="idp"
                templates={
                    templatesOverrides
                        ? templatesOverrides
                        : templates
                }
                templateIcons={ getIdPIcons() }
                templateIconOptions={ {
                    fill: "primary"
                } }
                templateIconSize="tiny"
                onTemplateSelect={ handleTemplateSelection }
                paginate={ true }
                paginationLimit={ 5 }
                paginationOptions={ {
                    showLessButtonLabel: t("common:showLess"),
                    showMoreButtonLabel: t("common:showMore")
                } }
                emptyPlaceholder={ placeholder }
                { ...additionalProps }
            />
        );
    };

    return (
        <HelpPanelLayout
            enabled={ false }
            visible={ false }
            sidebarDirection="right"
            sidebarMiniEnabled={ false }
            tabs={ helpPanelTabs }
            onHelpPanelPinToggle={ () => HelpPanelUtils.togglePanelPin() }
            isPinned={ HelpPanelUtils.isPanelPinned() }
            icons={ {
                close: getHelpPanelActionIcons().close,
                pin: getHelpPanelActionIcons().pin,
                unpin: getHelpPanelActionIcons().unpin
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
                    (categorizedTemplates && !isIDPTemplateRequestLoading)
                        ? (
                            categorizedTemplates.map((category: IdentityProviderTemplateCategoryInterface, index: number) => (
                                <div key={ index } className="templates quick-start-templates">
                                    {
                                        renderTemplateGrid(
                                            category.templates,
                                            {
                                                "data-testid": `${ category.id }-template-grid`,
                                                heading: category.displayName,
                                                showTagIcon: category.viewConfigs?.tags?.showTagIcon,
                                                showTags:  category.viewConfigs?.tags?.showTags,
                                                subHeading: category.description,
                                                tagsAs: category.viewConfigs?.tags?.as,
                                                tagsKey: category.viewConfigs?.tags?.tagsKey,
                                                tagsSectionTitle: category.viewConfigs?.tags?.sectionTitle
                                            },
                                            <EmptyPlaceholder
                                                image={ getEmptyPlaceholderIllustrations().newList }
                                                imageSize="tiny"
                                                title={ t("console:develop.features.templates.emptyPlaceholder.title") }
                                                subtitle={
                                                    [ t("console:develop.features.templates.emptyPlaceholder.subtitles") ]
                                                }
                                                data-testid={
                                                    `${ testId }-quick-start-template-grid-empty-placeholder`
                                                }
                                            />
                                        )
                                    }
                                    <Divider hidden />
                                </div>
                            ))
                        )
                        : <ContentLoader dimmer/>
                }
                <Divider hidden/>
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
