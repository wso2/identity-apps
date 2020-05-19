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

import { ContentLoader, EmptyPlaceholder, TemplateGrid } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Divider } from "semantic-ui-react";
import {
    getIdentityProviderList,
    getIdentityProviderTemplate,
    getIdentityProviderTemplateList
} from "../../api";
import { ExpertModeTemplate } from "../../components/identity-providers/meta";
import {
    handleGetIDPTemplateAPICallError,
    handleGetIDPTemplateListError
} from "../../components/identity-providers/utils";
import { IdentityProviderCreateWizard } from "../../components/identity-providers/wizards";
import { EmptyPlaceholderIllustrations, IdPCapabilityIcons, IdPIcons } from "../../configs";
import { history } from "../../helpers";
import { PageLayout } from "../../layouts";
import {
    IdentityProviderListResponseInterface,
    IdentityProviderTemplateListItemInterface,
    IdentityProviderTemplateListItemResponseInterface,
    IdentityProviderTemplateListResponseInterface,
    SupportedServices,
    SupportedServicesInterface
} from "../../models";
import { AppState } from "../../store";
import { setAvailableAuthenticatorsMeta } from "../../store/actions/identity-provider";

/**
 * Choose the application template from this page.
 *
 * @return {JSX.Element}
 */
export const IdentityProviderTemplateSelectPage: FunctionComponent<{}> = (): ReactElement => {

    const { t } = useTranslation();

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

    const dispatch = useDispatch();

    const availableAuthenticators = useSelector((state: AppState) => state.identityProvider.meta.authenticators);

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
                        displayName: t("devPortal:pages.idpTemplate.supportServices.authenticationDisplayName"),
                        logo: IdPCapabilityIcons[SupportedServices.AUTHENTICATION],
                        name: SupportedServices.AUTHENTICATION
                    };
                case SupportedServices.PROVISIONING:
                    return {
                        displayName: t("devPortal:pages.idpTemplate.supportServices.provisioningDisplayName"),
                        logo: IdPCapabilityIcons[SupportedServices.PROVISIONING],
                        name: SupportedServices.PROVISIONING
                    }
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
            })
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
        history.push("/identity-providers");
    };

    /**
     * Handles template selection.
     *
     * @param {React.SyntheticEvent} e - Click event.
     * @param {string} id - Id of the template.
     */
    const handleTemplateSelection = (e: SyntheticEvent, { id }: { id: string }): void => {
        if (id === "expert-mode") {
            setSelectedTemplate(ExpertModeTemplate)
        } else {
            getTemplate(id);
        }
    };

    const getPossibleListOfDuplicateIdps = (idpName: string) => {
        getIdentityProviderList(null, null, "name sw " + idpName).then(
            (response: IdentityProviderListResponseInterface) => {
            setPossibleListOfDuplicateIdps( response?.totalResults ? response?.identityProviders?.map(
                eachIdp => eachIdp.name) : []);
        })
    };

    /**
     * Called when template is selected.
     */
    useEffect(() => {
        if (!selectedTemplate) {
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

    return (
        <PageLayout
            title={ t("devPortal:pages.idpTemplate.title") }
            contentTopMargin={ true }
            description={ t("devPortal:pages.idpTemplate.subTitle") }
            backButton={ {
                onClick: handleBackButtonClick,
                text: t("devPortal:pages.idpTemplate.backButton")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            showBottomDivider
        >
            {
                (availableTemplates && !isIDPTemplateRequestLoading)
                    ? (
                        <div className="quick-start-templates">
                            <TemplateGrid<IdentityProviderTemplateListItemInterface>
                                type="idp"
                                templates={ availableTemplates.filter((template) => template.id !== "expert-mode") }
                                templateIcons={ IdPIcons }
                                heading={ t("devPortal:components.idp.templates.quickSetup.heading") }
                                subHeading={ t("devPortal:components.idp.templates.quickSetup.subHeading") }
                                onTemplateSelect={ handleTemplateSelection }
                                paginate={ true }
                                paginationLimit={ 5 }
                                paginationOptions={ {
                                    showLessButtonLabel: t("common:showLess"),
                                    showMoreButtonLabel: t("common:showMore")
                                } }
                                emptyPlaceholder={ (
                                    <EmptyPlaceholder
                                        image={ EmptyPlaceholderIllustrations.newList }
                                        imageSize="tiny"
                                        title={ t("devPortal:components.templates.emptyPlaceholder.title") }
                                        subtitle={ [ t("devPortal:components.templates.emptyPlaceholder.subtitles") ] }
                                    />
                                ) }
                                tagsSectionTitle={ t("common:services") }
                            />
                        </div>
                    )
                    : <ContentLoader dimmer />
            }
            <Divider hidden />
            <div className="custom-templates">
                <TemplateGrid<IdentityProviderTemplateListItemInterface>
                    type="idp"
                    templates={ [ ExpertModeTemplate ] }
                    templateIcons={ IdPIcons }
                    heading={ t("devPortal:components.idp.templates.manualSetup.heading") }
                    subHeading={ t("devPortal:components.idp.templates.manualSetup.subHeading") }
                    onTemplateSelect={ handleTemplateSelection }
                    paginate={ true }
                    paginationLimit={ 5 }
                    paginationOptions={ {
                        showLessButtonLabel: t("common:showLess"),
                        showMoreButtonLabel: t("common:showMore")
                    } }
                    emptyPlaceholder={ (
                        <EmptyPlaceholder
                            image={ EmptyPlaceholderIllustrations.newList }
                            imageSize="tiny"
                            title={ t("devPortal:components.templates.emptyPlaceholder.title") }
                            subtitle={ [ t("devPortal:components.templates.emptyPlaceholder.subtitles") ] }
                        />
                    ) }
                    tagsSectionTitle={ t("common:services") }
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
    );
};
