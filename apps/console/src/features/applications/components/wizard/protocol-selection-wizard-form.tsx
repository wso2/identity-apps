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

import { TestableComponentInterface } from "@wso2is/core/models";
import { EmptyPlaceholder, TemplateGrid } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { AppState, getEmptyPlaceholderIllustrations, getTechnologyLogos } from "../../../core";
import { getApplicationTemplateIllustrations, getInboundProtocolLogos } from "../../configs";
import { ApplicationTemplateCategories, ApplicationTemplateListItemInterface } from "../../models";
import { ApplicationManagementUtils, ApplicationTemplateManagementUtils } from "../../utils";
import { InboundProtocolsMeta } from "../meta";

/**
 * Proptypes for the protocol selection wizard form component.
 */
interface ProtocolSelectionWizardFormPropsInterface extends TestableComponentInterface {
    initialSelectedTemplate?: ApplicationTemplateListItemInterface;
    defaultTemplates: ApplicationTemplateListItemInterface[];
    onSubmit: (values: ApplicationTemplateListItemInterface) => void;
    triggerSubmit: boolean;
    selectedProtocols: string[];
    setSelectedCustomInboundProtocol: (selected: boolean) => void;
}

/**
 * Protocol selection wizard form component.
 *
 * @param {ProtocolSelectionWizardFormPropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const ProtocolSelectionWizardForm: FunctionComponent<ProtocolSelectionWizardFormPropsInterface> = (
    props: ProtocolSelectionWizardFormPropsInterface
): ReactElement => {

    const {
        initialSelectedTemplate,
        selectedProtocols,
        onSubmit,
        defaultTemplates,
        setSelectedCustomInboundProtocol,
        triggerSubmit,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const applicationTemplates: ApplicationTemplateListItemInterface[] = useSelector(
        (state: AppState) => state.application.templates);

    const availableCustomInboundProtocols = useSelector((state: AppState) =>
        state.application.meta.customInboundProtocols);

    const checkedCustomInboundProtocols = useSelector((state: AppState) =>
        state.application.meta.customInboundProtocolChecked);

    const [
        selectedTemplate,
        setSelectedTemplate
    ] = useState<ApplicationTemplateListItemInterface>(undefined);
    const [
        isApplicationTemplateRequestLoading,
        setApplicationTemplateRequestLoadingStatus
    ] = useState<boolean>(false);

    const [ isInboundProtocolsRequestLoading, setInboundProtocolsRequestLoading ] = useState<boolean>(false);

    const init = useRef(true);

    /**
     * Called on `checkedCustomInboundProtocols` prop update.
     */
    useEffect(() => {
        if (checkedCustomInboundProtocols) {
            return;
        }

        setInboundProtocolsRequestLoading(true);

        ApplicationManagementUtils.getCustomInboundProtocols(InboundProtocolsMeta, true)
            .finally(() => {
                setInboundProtocolsRequestLoading(false);
            });
    }, [ checkedCustomInboundProtocols ]);

    /**
     * Called when submit is triggered.
     */
    useEffect(() => {
        if (init.current) {
            init.current = false;
        } else {
            onSubmit(selectedTemplate);
        }
    }, [ triggerSubmit ]);

    /**
     *  Get Application templates.
     */
    useEffect(() => {
        if (applicationTemplates !== undefined) {
            return;
        }

        setApplicationTemplateRequestLoadingStatus(true);

        ApplicationTemplateManagementUtils.getApplicationTemplates()
            .finally(() => {
                setApplicationTemplateRequestLoadingStatus(false);
            });
    }, [ applicationTemplates ]);

    useEffect(() => {
        if (initialSelectedTemplate) {
            setSelectedTemplate(initialSelectedTemplate);
        }
    }, [ initialSelectedTemplate ]);

    /**
     * Handles template selection.
     *
     * @param {React.SyntheticEvent} e - Click event.
     * @param {string} id - Id of the template.
     */
    const handleTemplateSelection = (e: SyntheticEvent, { id }: { id: string }): void => {

        let selected = defaultTemplates?.find((template) => template.id === id);

        if (!selected) {
            selected = applicationTemplates?.find((template) => template.id === id);
        }

        if (!selected) {
            return;
        }
        setSelectedTemplate(selected);
    };

    /**
     * Handles template selection for custom protocols.
     *
     * @param {React.SyntheticEvent} e - Click event.
     * @param {string} id - Id of the template.
     */
    const handleTemplateCustomProtocolSelection = (e: SyntheticEvent, { id }: { id: string }): void => {

        const selected = availableCustomInboundTemplates?.find((template) => template.id === id);

        if (!selected) {
            return;
        }
        setSelectedCustomInboundProtocol(true);
        setSelectedTemplate(selected);
    };

    /**
     * Filter already existing protocol from the template.
     *
     * @param templates Templates array to be filtered.
     */
    const filterProtocol = (
        templates: ApplicationTemplateListItemInterface[]
    ): ApplicationTemplateListItemInterface[] => {
        if (templates) {
            return templates.filter(
                (temp) => !selectedProtocols.includes(temp.authenticationProtocol));
        } else {
            return null;
        }
    };

    /**
     * Filter already existing protocol from the custom inbound template.
     */
    const filterCustomProtocol = (): ApplicationTemplateListItemInterface[] => {
        const customTemplates: ApplicationTemplateListItemInterface[] = [];

        if (availableCustomInboundProtocols.length > 0) {
            availableCustomInboundProtocols.map((protocol) => {
                const customTemplate: ApplicationTemplateListItemInterface = {
                    authenticationProtocol: protocol.name,
                    id: protocol.name,
                    image: protocol.displayName,
                    name: protocol.displayName
                };

                customTemplates.push(customTemplate);
            });

            return customTemplates.filter(
                (temp) => !selectedProtocols.includes(temp.authenticationProtocol));
        }
    };

    /**
     * Available default templates after filtering.
     */
    const availableDefaultTemplates = filterProtocol(defaultTemplates);

    /**
     * Available templates from api after filtering.
     */
    const availableTemplates = filterProtocol(applicationTemplates);

    /**
     * Available custom protocol templates after filtering.
     */
    const availableCustomInboundTemplates = filterCustomProtocol();

    return (
        <>
            { !isApplicationTemplateRequestLoading && (
                <TemplateGrid<ApplicationTemplateListItemInterface>
                    type="application"
                    templates={
                        applicationTemplates
                        && applicationTemplates instanceof Array
                        && applicationTemplates.length > 0
                            ? availableTemplates.filter((template) =>
                                template.category === ApplicationTemplateCategories.DEFAULT)
                            : []
                    }
                    templateIcons={ {
                        ...getApplicationTemplateIllustrations(),
                        ...getTechnologyLogos(),
                        ...getInboundProtocolLogos()
                    } as any }
                    templateIconOptions={ {
                        fill: "primary"
                    } }
                    templateIconSize="tiny"
                    heading={
                        t("console:develop.features.applications.edit.sections.access.addProtocolWizard.steps" +
                            ".protocolSelection.quickSetup.heading")
                    }
                    subHeading={
                        t("console:develop.features.applications.edit.sections.access.addProtocolWizard.steps" +
                            ".protocolSelection.quickSetup.subHeading")
                    }
                    onTemplateSelect={ handleTemplateSelection }
                    paginate={ true }
                    paginationLimit={ 4 }
                    paginationOptions={ {
                        showLessButtonLabel: t("common:showLess"),
                        showMoreButtonLabel: t("common:showMore")
                    } }
                    selectedTemplate={ selectedTemplate }
                    useSelectionCard={ true }
                    emptyPlaceholder={ (
                        <EmptyPlaceholder
                            image={ getEmptyPlaceholderIllustrations().newList }
                            imageSize="tiny"
                            title={
                                t("console:develop.features.applications.edit.sections.access.addProtocolWizard" +
                                    ".steps.protocolSelection.quickSetup.emptyPlaceholder.title")
                            }
                            subtitle={
                                t("console:develop.features.applications.edit.sections.access.addProtocolWizard" +
                                    ".steps.protocolSelection.quickSetup.emptyPlaceholder.subtitles")
                            }
                        />
                    ) }
                    data-testid={ `${ testId }-default-template-grid` }
                />
            ) }
            { !isInboundProtocolsRequestLoading && (
                <TemplateGrid<ApplicationTemplateListItemInterface>
                    type="application"
                    templates={ availableDefaultTemplates }
                    secondaryTemplates={ availableCustomInboundTemplates }
                    templateIcons={ getInboundProtocolLogos() as any }
                    templateIconOptions={ {
                        fill: "primary"
                    } }
                    templateIconSize="tiny"
                    heading={
                        t("console:develop.features.applications.edit.sections.access.addProtocolWizard.steps" +
                            ".protocolSelection.manualSetup.heading")
                    }
                    subHeading={
                        t("console:develop.features.applications.edit.sections.access.addProtocolWizard.steps" +
                            ".protocolSelection.manualSetup.subHeading")
                    }
                    onTemplateSelect={ handleTemplateSelection }
                    onSecondaryTemplateSelect={ handleTemplateCustomProtocolSelection }
                    useNameInitialAsImage={ true }
                    paginate={ true }
                    paginationLimit={ 4 }
                    paginationOptions={ {
                        showLessButtonLabel: t("common:showLess"),
                        showMoreButtonLabel: t("common:showMore")
                    } }
                    selectedTemplate={ selectedTemplate }
                    useSelectionCard={ true }
                    emptyPlaceholder={ (
                        <EmptyPlaceholder
                            image={ getEmptyPlaceholderIllustrations().newList }
                            imageSize="tiny"
                            title={
                                t("console:develop.features.applications.edit.sections.access.addProtocolWizard" +
                                    ".steps.protocolSelection.quickSetup.emptyPlaceholder.title")
                            }
                            subtitle={
                                t("console:develop.features.applications.edit.sections.access.addProtocolWizard" +
                                    ".steps.protocolSelection.quickSetup.emptyPlaceholder.subtitles")
                            }
                        />
                    ) }
                    data-testid={ `${ testId }-custom-template-grid` }
                />
            ) }
        </>
    );
};

/**
 * Default props for the application protocol selection wizard form component.
 */
ProtocolSelectionWizardForm.defaultProps = {
    "data-testid": "application-protocol-selection-wizard-form"
};
