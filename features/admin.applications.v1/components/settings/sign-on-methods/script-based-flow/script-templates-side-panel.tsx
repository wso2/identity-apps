/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com).
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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ContentLoader,
    Heading,
    LinkButton,
    Popup,
    PrimaryButton,
    Tooltip
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import sortBy from "lodash-es/sortBy";
import React, {
    FunctionComponent,
    MutableRefObject,
    PropsWithChildren,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    forwardRef,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Accordion,  Grid, Icon, Menu, Modal, Segment, Sidebar } from "semantic-ui-react";
import { serverConfigurationConfig } from "../../../../../admin.extensions.v1/configs/server-configuration";
// eslint-disable-next-line max-len
import AdaptiveAuthTemplateInfoModal from "../../../../../admin.authentication-flow-builder.v1/components/predefined-flows-side-panel/adaptive-auth-template-info-modal";
import {
    ELK_RISK_BASED_TEMPLATE_NAME
} from "../../../../../admin.authentication-flow-builder.v1/constants/template-constants";
import {
    getConnectorDetails,
    updateGovernanceConnector
} from "../../../../../admin-server-configurations-v1/api/governance-connectors";
import {
    ServerConfigurationsConstants
} from "../../../../../admin-server-configurations-v1/constants/server-configurations-constants";
import { AnalyticsConfigurationForm } from "../../../../../admin-server-configurations-v1/forms/analytics-form";
import {
    GovernanceConnectorInterface,
    UpdateGovernanceConnectorConfigInterface
} from "../../../../../admin-server-configurations-v1/models/governance-connectors";
import {
    GovernanceConnectorUtils
} from "../../../../../admin-server-configurations-v1/utils/governance-connector-utils";
import { AdaptiveAuthTemplateCategoryInterface, AdaptiveAuthTemplateInterface } from "../../../../models";

/**
 * Component ref interface.
 */
export interface ScriptTemplatesSidePanelRefInterface {
    ref: MutableRefObject<HTMLElement>;
}

/**
 * Proptypes for the adaptive scripts component.
 */
interface ScriptTemplatesSidePanelInterface extends IdentifiableComponentInterface {
    /**
     * Fired on template selection.
     *
     * @param template - Auth template.
     */
    onTemplateSelect: (template: AdaptiveAuthTemplateInterface) => void;
    /**
     * Adaptive script templates.
     */
    templates: AdaptiveAuthTemplateCategoryInterface[];
    /**
     * Side panel title.
     */
    title?: ReactNode;
    /**
     * Initial activeIndexes value.
     */
    defaultActiveIndexes?: number[];
    /**
     * Should the side panel be visible.
     */
    visible?: boolean;
    /**
     * Ref for the component.
     */
    ref?: React.Ref<ScriptTemplatesSidePanelRefInterface>;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Is the ELK configure clicked.
     */
    isELKConfigureClicked?: boolean;
    /**
     * Callback to be fired on ELK configure modal is close.
     */
    onELKModalClose?: () => void;
}

/**
 * Adaptive script templates side panel.
 *
 * @param props - Props injected to the component.
 *
 * @returns
 */
export const ScriptTemplatesSidePanel: FunctionComponent<ScriptTemplatesSidePanelInterface> =
    forwardRef<ScriptTemplatesSidePanelRefInterface, ScriptTemplatesSidePanelInterface>((
        props: PropsWithChildren<ScriptTemplatesSidePanelInterface>,
        ref: MutableRefObject<ScriptTemplatesSidePanelRefInterface>
    ): ReactElement => {

        const {
            defaultActiveIndexes,
            onTemplateSelect,
            templates,
            title,
            visible,
            isELKConfigureClicked,
            onELKModalClose,
            readOnly,
            [ "data-componentid" ]: componentId
        } = props;

        const { t } = useTranslation();

        const [ accordionActiveIndexes, setAccordionActiveIndexes ] = useState<number[]>(defaultActiveIndexes);
        const [
            selectedTemplate,
            setSelectedTemplate
        ] = useState<AdaptiveAuthTemplateInterface>(null);
        const [ openELKAnalyticsModal, setELKAnalyticsModalOpen ] = useState(false);
        const [ isConnectorRequestLoading, setConnectorRequestLoading ] = useState<boolean>(false);
        const [ connector, setConnector ] = useState<GovernanceConnectorInterface>(undefined);
        const [ categoryId, setCategoryId ] = useState<string>(undefined);
        const [ connectorId, setConnectorId ] = useState<string>(undefined);
        const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

        const dispatch: Dispatch = useDispatch();

        /**
         * Handles accordion title click.
         *
         * @param e - Click event.
         * @param index - Clicked on index.
         */
        const handleAccordionOnClick = (e: SyntheticEvent, { index }: { index: number }): void => {
            const newIndexes: number[] = [ ...accordionActiveIndexes ];

            if (newIndexes.includes(index)) {
                const removingIndex: number = newIndexes.indexOf(index);

                newIndexes.splice(removingIndex, 1);
            } else {
                newIndexes.push(index);
            }

            setAccordionActiveIndexes(newIndexes);
        };

        /**
         * Closes the template description modal
         */
        const closeTemplateDescriptionModal = (): void => {
            setSelectedTemplate(null);
        };

        /**
        * Load ELK analytics connector details.
        */
        const loadConnectorDetails = () => {
            const categoryId: string =  ServerConfigurationsConstants.OTHER_SETTINGS_CONNECTOR_CATEGORY_ID;
            const connectorId: string = ServerConfigurationsConstants.ANALYTICS_ENGINE_CONNECTOR_ID;

            setCategoryId(categoryId);
            setConnectorId(connectorId);
            setConnectorRequestLoading(true);

            getConnectorDetails(categoryId, connectorId)
                .then((response: GovernanceConnectorInterface) => {
                    setConnector(response);
                })
                .catch((error: AxiosError) => {
                    if (error?.response && error?.response?.data && error?.response?.data?.detail) {
                        dispatch(
                            addAlert({
                                description: t(
                                    "governanceConnectors:notifications." +
                                    "getConnector.error.description",
                                    { description: error?.response?.data?.description }
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "governanceConnectors:notifications." +
                                    "getConnector.error.message"
                                )
                            })
                        );
                    } else {
                        // Generic error message
                        dispatch(
                            addAlert({
                                description: t(
                                    "governanceConnectors:notifications." +
                                    "getConnector.genericError.description"
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "governanceConnectors:notifications." +
                                    "getConnector.genericError.message"
                                )
                            })
                        );
                    }
                })
                .finally(() => {
                    setConnectorRequestLoading(false);
                });
        };

        /**
         * Handles ELK analytics configuration form submit.
         */
        const handleSubmit = (values: Record<string, unknown>) => {

            const data: UpdateGovernanceConnectorConfigInterface = {
                operation: "UPDATE",
                properties: []
            };

            for (const key in values) {
                data.properties.push({
                    name: GovernanceConnectorUtils.decodeConnectorPropertyName(key),
                    value: values[ key ]
                });
            }

            if (
                serverConfigurationConfig.connectorToggleName[ connector?.name ] &&
                serverConfigurationConfig.autoEnableConnectorToggleProperty
            ) {
                data.properties.push({
                    name: GovernanceConnectorUtils.decodeConnectorPropertyName(
                        serverConfigurationConfig.connectorToggleName[ connector?.name ]
                    ),
                    value: "true"
                });
            }

            setIsSubmitting(true);

            updateGovernanceConnector(data, categoryId, connectorId)
                .then(() => {
                    dispatch(
                        addAlert({
                            description: t("extensions:manage.serverConfigurations.analytics.form." +
                                "notification.success.description"
                            ),
                            level: AlertLevels.SUCCESS,
                            message: t(
                                "governanceConnectors:notifications." +
                                "updateConnector.success.message"
                            )
                        })
                    );
                })
                .catch((error: AxiosError) => {
                    if (error?.response && error?.response?.data && error?.response?.data?.detail) {
                        dispatch(
                            addAlert({
                                description: t(
                                    "extensions:manage.serverConfigurations.analytics.form." +
                                    "notification.error.description"
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "governanceConnectors:notifications." +
                                    "updateConnector.error.message"
                                )
                            })
                        );
                    } else {
                        // Generic error message
                        dispatch(
                            addAlert({
                                description: t(
                                    "governanceConnectors:notifications." +
                                    "updateConnector.genericError.description"
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "governanceConnectors:notifications." +
                                    "updateConnector.genericError.message"
                                )
                            })
                        );
                    }
                })
                .finally(() => {
                    setIsSubmitting(false);
                    handleELKAnalyticsModalClose();
                });
        };

        const handleELKAnalyticsModalClose = (): void => {
            setELKAnalyticsModalOpen(false);
            onELKModalClose();
        };

        useEffect(() => {
            if (isELKConfigureClicked) {
                handleELKAnalyticsModalOpen();
            }
        }, [ isELKConfigureClicked ]);

        const handleELKAnalyticsModalOpen = (): void => {
            loadConnectorDetails();
            setELKAnalyticsModalOpen(true);
        };

        let submitAuthorization: () => void;

        const elkAnalyticsConfigurationsModal = (): ReactElement => {
            return (
                <Modal
                    open={ openELKAnalyticsModal }
                    onClose={ handleELKAnalyticsModalClose }
                    size="small"
                    dimmer="blurring"
                >
                    <Modal.Header>
                        { connector?.friendlyName }
                        <Heading subHeading ellipsis as="h6">
                            { t("governanceConnectors:connectorSubHeading", {
                                name: connector?.friendlyName })
                            }
                        </Heading>
                    </Modal.Header>
                    <Modal.Content className="elk-analytics-modal" scrolling>
                        {
                            isConnectorRequestLoading
                                ? <ContentLoader inline="centered" active />
                                : (
                                    <AnalyticsConfigurationForm
                                        onSubmit={ handleSubmit }
                                        triggerSubmission={ (submitFunctionCb: () => void) => {
                                            submitAuthorization = submitFunctionCb;
                                        } }
                                        initialValues={ connector }
                                        isConnectorEnabled={ true }
                                        isSubmitting={ isSubmitting }
                                        hideUpdateButton
                                        isModalForm
                                    />
                                )
                        }
                    </Modal.Content>
                    <Modal.Actions>
                        <Grid>
                            <Grid.Row column={ 1 }>
                                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                    <LinkButton
                                        data-testid={ `${componentId}-cancel-button` }
                                        floated="left"
                                        onClick={ () => handleELKAnalyticsModalClose() }
                                    >
                                        { t("apiResources:tabs.scopes.form.cancelButton") }
                                    </LinkButton>
                                </Grid.Column>
                                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                    <PrimaryButton
                                        data-testid={ `${componentId}-finish-button` }
                                        floated="right"
                                        onClick={ () => submitAuthorization() }
                                        loading={ isSubmitting }
                                    >
                                        { t("common:update") }
                                    </PrimaryButton>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal.Actions>
                </Modal>
            );
        };

        /**
         * Renders adaptive authentication template category onto the accordion.
         * @param category - Adaptive authentication template category
         * @param index - Index of the category
         */
        const renderAdaptiveAuthTemplateCategory = (category: AdaptiveAuthTemplateCategoryInterface, index: number) => {
            return category?.templates && category.templates instanceof Array && (
                <Menu.Item key={ index }>
                    <Accordion.Title
                        active={ accordionActiveIndexes.includes(index) }
                        className="category-name"
                        content={ category.displayName }
                        index={ index }
                        icon={ <Icon className="angle right caret-icon"/> }
                        onClick={ handleAccordionOnClick }
                        data-componentid={ `${ componentId }-accordion-title-${ index }` }
                    />
                    <Accordion.Content
                        className="template-list"
                        active={ accordionActiveIndexes.includes(index) }
                        data-componentid={ `${ componentId }-accordion-content-${ index }` }
                    >
                        {
                            category.templates.map((template: AdaptiveAuthTemplateInterface , index: number) => (
                                <Menu.Item
                                    key={ index }
                                    className="template-list-item"
                                    data-componentid={ template.name }
                                >
                                    <Popup
                                        trigger={ (
                                            <div className="template-name">
                                                { template.name }
                                            </div>
                                        ) }
                                        content={ template.title || template.name }
                                    />
                                    <div className="actions">
                                        {
                                            template.name === ELK_RISK_BASED_TEMPLATE_NAME && (
                                                <Tooltip
                                                    compact
                                                    trigger={ (
                                                        <Icon
                                                            className="add-button"
                                                            name="cog"
                                                            onClick={ () => {
                                                                handleELKAnalyticsModalOpen();
                                                            } }
                                                        />
                                                    ) }
                                                    content={ t("common:configure") }
                                                />
                                            )
                                        }
                                        <Tooltip
                                            compact
                                            trigger={ (
                                                <Icon
                                                    className="add-button"
                                                    name="info circle"
                                                    onClick={ () => {
                                                        setSelectedTemplate(template);
                                                    } }
                                                    data-componentid={ `${template.name}-info` }
                                                />
                                            ) }
                                            content={
                                                t("applications:edit.sections.signOnMethod." +
                                                    "sections.templateDescription.popupContent")
                                            }
                                        />
                                        {
                                            !readOnly && (
                                                <Tooltip
                                                    compact
                                                    trigger={ (
                                                        <Icon
                                                            className="add-button"
                                                            name="add"
                                                            onClick={ () => onTemplateSelect(template) }
                                                            data-componentid={ `${template.name}-add` }
                                                        />
                                                    ) }
                                                    content={ t("common:add") }
                                                />
                                            )
                                        }
                                    </div>
                                </Menu.Item>
                            ))
                        }
                    </Accordion.Content>
                </Menu.Item>
            );
        };

        return (
            <>
                {
                    selectedTemplate && (
                        <AdaptiveAuthTemplateInfoModal
                            template={ selectedTemplate }
                            open={ !!selectedTemplate }
                            onClose={ closeTemplateDescriptionModal }
                        />
                    )
                }
                <Sidebar
                    as={ Segment }
                    ref={ ref as any }
                    className="script-templates-panel"
                    animation="overlay"
                    icon="labeled"
                    direction="right"
                    vertical
                    secondary
                    visible={ visible }
                    data-componentid={ componentId }
                >
                    { title && typeof title === "string" ? <Heading as="h6" bold>{ title }</Heading> : title }
                    {
                        (templates && templates instanceof Array && templates.length > 0)
                            ? (
                                <Accordion
                                    as={ Menu }
                                    className="template-category-menu"
                                    data-componentid={ `${ componentId }-accordion` }
                                    fluid
                                    secondary
                                    vertical
                                >
                                    { sortBy(templates, "order").map(renderAdaptiveAuthTemplateCategory) }
                                </Accordion>
                            )
                            : null
                    }
                </Sidebar>
                { elkAnalyticsConfigurationsModal() }
            </>
        );
    });

/**
 * Default props for the script templates side panel component.
 */
ScriptTemplatesSidePanel.defaultProps = {
    "data-componentid": "script-templates-side-panel",
    defaultActiveIndexes: [ -1 ],
    visible: false
};
