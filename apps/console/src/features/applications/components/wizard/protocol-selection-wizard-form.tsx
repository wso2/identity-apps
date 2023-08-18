/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { TestableComponentInterface } from "@wso2is/core/models";
import { EmptyPlaceholder, TemplateGrid } from "@wso2is/react-components";
import React, { 
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { AppState, getEmptyPlaceholderIllustrations, getTechnologyLogos } from "../../../core";
import { getApplicationTemplateIllustrations, getInboundProtocolLogos } from "../../configs/ui";
import {
    ApplicationTemplateCategories,
    ApplicationTemplateListItemInterface,
    AuthProtocolMetaListItemInterface
} from "../../models";
import { ApplicationManagementUtils } from "../../utils/application-management-utils";
import { ApplicationTemplateManagementUtils } from "../../utils/application-template-management-utils";
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
 * @param props - Props injected to the component.
 * @returns Protocol selection wizard form component.
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

    const availableCustomInboundProtocols: AuthProtocolMetaListItemInterface[] = useSelector((state: AppState) =>
        state.application.meta.customInboundProtocols);

    const checkedCustomInboundProtocols: boolean = useSelector((state: AppState) =>
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

    const init: MutableRefObject<boolean> = useRef(true);

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
     * @param e - Click event.
     * @param id - Id of the template.
     */
    const handleTemplateSelection = (e: SyntheticEvent, { id }: { id: string }): void => {

        let selected: ApplicationTemplateListItemInterface = defaultTemplates?.find(
            (template: ApplicationTemplateListItemInterface) => template.id === id);

        if (!selected) {
            selected = applicationTemplates?.find(
                (template: ApplicationTemplateListItemInterface) => template.id === id);
        }

        if (!selected) {
            return;
        }
        setSelectedTemplate(selected);
    };

    /**
     * Handles template selection for custom protocols.
     *
     * @param e - Click event.
     * @param id - Id of the template.
     */
    const handleTemplateCustomProtocolSelection = (e: SyntheticEvent, { id }: { id: string }): void => {

        const selected: ApplicationTemplateListItemInterface = availableCustomInboundTemplates?.find(
            (template: ApplicationTemplateListItemInterface) => template.id === id);

        if (!selected) {
            return;
        }
        setSelectedCustomInboundProtocol(true);
        setSelectedTemplate(selected);
    };

    /**
     * Filter already existing protocol from the template.
     *
     * @param templates - Templates array to be filtered.
     */
    const filterProtocol = (
        templates: ApplicationTemplateListItemInterface[]
    ): ApplicationTemplateListItemInterface[] => {
        if (templates) {
            return templates.filter(
                (temp: ApplicationTemplateListItemInterface) => 
                    !selectedProtocols.includes(temp.authenticationProtocol));
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
            availableCustomInboundProtocols.map((protocol: AuthProtocolMetaListItemInterface) => {
                const customTemplate: ApplicationTemplateListItemInterface = {
                    authenticationProtocol: protocol.name,
                    id: protocol.name,
                    image: protocol.displayName,
                    name: protocol.displayName
                };

                customTemplates.push(customTemplate);
            });

            return customTemplates.filter(
                (temp: ApplicationTemplateListItemInterface) => 
                    !selectedProtocols.includes(temp.authenticationProtocol));
        }
    };

    /**
     * Available default templates after filtering.
     */
    const availableDefaultTemplates: ApplicationTemplateListItemInterface[] = filterProtocol(defaultTemplates);

    /**
     * Available templates from api after filtering.
     */
    const availableTemplates: ApplicationTemplateListItemInterface[] = filterProtocol(applicationTemplates);

    /**
     * Available custom protocol templates after filtering.
     */
    const availableCustomInboundTemplates: ApplicationTemplateListItemInterface[] = filterCustomProtocol();

    return (
        <>
            { !isApplicationTemplateRequestLoading && (
                <TemplateGrid<ApplicationTemplateListItemInterface>
                    type="application"
                    templates={
                        applicationTemplates
                        && applicationTemplates instanceof Array
                        && applicationTemplates.length > 0
                            ? availableTemplates.filter((template: ApplicationTemplateListItemInterface) =>
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
