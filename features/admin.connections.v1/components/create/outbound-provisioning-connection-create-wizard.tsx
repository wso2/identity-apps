/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { ModalWithSidePanel } from "@wso2is/admin.core.v1/components/modals/modal-with-side-panel";
import { EventPublisher } from "@wso2is/admin.core.v1/utils/event-publisher";
import { IdentityAppsError } from "@wso2is/core/errors";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalFormField, TextFieldAdapter, Wizard2, WizardPage } from "@wso2is/form";
import { KeyValue } from "@wso2is/forms";
import {
    GenericIcon,
    Heading,
    LinkButton,
    PrimaryButton,
    SelectionCard,
    Steps,
    useWizardAlert
} from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import { AxiosError, AxiosResponse } from "axios";
import debounce, { DebouncedFunc } from "lodash-es/debounce";
import isEmpty from "lodash-es/isEmpty";
import kebabCase from "lodash-es/kebabCase";
import React, { FC, MutableRefObject, ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Icon, Grid as SemanticGrid } from "semantic-ui-react";
import { createConnection, getOutboundProvisioningConnectorMetadata } from "../../api/connections";
import useGetOutboundProvisioningConnectors from "../../api/use-get-outbound-provisioning-connectors";
import { getConnectionIcons, getConnectionWizardStepIcons } from "../../configs/ui";
import { CommonAuthenticatorConstants } from "../../constants/common-authenticator-constants";
import { ConnectionUIConstants } from "../../constants/connection-ui-constants";
import {
    CommonPluggableComponentMetaPropertyInterface,
    ConnectionInterface,
    ConnectionTemplateInterface,
    IdpNameValidationCache,
    OutboundProvisioningConnectorMetaDataInterface,
    OutboundProvisioningConnectorMetaInterface
} from "../../models/connection";
import {
    ConnectionsManagementUtils,
    handleGetOutboundProvisioningConnectorMetadataError
} from "../../utils/connection-utils";
import { getFilteredConnectorMetadataList } from "../../utils/provisioning-utils";
import { ConnectorConfigFormFields } from "../edit/forms/outbound-provisioning-connectors/connector-config-form-fields";

/**
 * Interface for the wizard props.
 */
interface OutboundProvisioningConnectionCreateWizardPropsInterface extends IdentifiableComponentInterface {
    title: string;
    subTitle?: string;
    template: ConnectionTemplateInterface;
    onWizardClose: () => void;
    onIDPCreate: (id: string) => void;
}

/**
 * Wizard steps enum. We have two wizard steps where the first step
 * includes general details and connector selection, and the second step
 * includes connector configuration.
 */
enum WizardSteps {
    GENERAL_DETAILS = "GeneralDetails",
    CONNECTOR_DETAILS = "ConnectorDetails"
}

/**
 * Interface for wizard step.
 */
interface WizardStepInterface {
    icon: any;
    title: string;
    name: WizardSteps;
}

/**
 * Form errors type.
 */
type FormErrors = { [key: string]: string };

/**
 * Min-Max type for validation.
 */
type MinMax = { min: number; max: number };

/**
 * IDP name validation constants.
 */
const IDP_NAME_LENGTH: MinMax = {
    max: 120,
    min: 3
};

/**
 * Empty string constant.
 */
const EMPTY_STRING: string = "";

/**
 * Outbound Provisioning Connection Create Wizard.
 * Reuses existing components: OutboundProvisioningConnectors, OutboundProvisioningSettings, WizardSummary.
 */
export const OutboundProvisioningConnectionCreateWizard: FC<
    OutboundProvisioningConnectionCreateWizardPropsInterface
> = (props: OutboundProvisioningConnectionCreateWizardPropsInterface): ReactElement => {
    const {
        title,
        subTitle,
        onWizardClose,
        onIDPCreate,
        ["data-componentid"]: componentId
    } = props;

    const wizardRef: MutableRefObject<any> = useRef(null);

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const [ initWizard, setInitWizard ] = useState<boolean>(false);
    const [ wizardSteps, setWizardSteps ] = useState<WizardStepInterface[]>([]);
    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(0);
    const [ alert, setAlert, alertComponent ] = useWizardAlert();
    const [ selectedConnectorId, setSelectedConnectorId ] = useState<string | null>(null);
    const [ connectorMetaData, setConnectorMetaData ] = useState<
        OutboundProvisioningConnectorMetaInterface | undefined
    >(undefined);
    const [ isConnectorMetadataRequestLoading, setIsConnectorMetadataRequestLoading ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isUserInputIdpNameAlreadyTaken, setIsUserInputIdpNameAlreadyTaken ] = useState<
        boolean | undefined
    >(undefined);
    const [ nextShouldBeDisabled, setNextShouldBeDisabled ] = useState<boolean>(true);

    const idpNameValidationCache: MutableRefObject<IdpNameValidationCache | null>
        = useRef<IdpNameValidationCache | null>(null);

    /**
     * Get the list of outbound provisioning connectors from API.
     */
    const {
        data: outboundProvisioningConnectorsList,
        isLoading: isLoadingOutboundProvisioningConnectorsList
    } = useGetOutboundProvisioningConnectors();

    /**
     * Transform the outbound provisioning connectors list by merging with UI metadata.
     */
    const outboundProvisioningConnectorsMetadataList: OutboundProvisioningConnectorMetaDataInterface[] = useMemo(
        () => getFilteredConnectorMetadataList(
            outboundProvisioningConnectorsList ?? [],
            isLoadingOutboundProvisioningConnectorsList as boolean
        ),
        [ outboundProvisioningConnectorsList, isLoadingOutboundProvisioningConnectorsList ]
    );

    /**
     * Initial form values.
     */
    const initialValues: { name: string; description: string } = useMemo(() => ({
        description: EMPTY_STRING,
        name: EMPTY_STRING
    }), []);

    /**
     * Handle step changes to properly manage next button state.
     */
    useEffect(() => {
        if (currentWizardStep === 0) {
            setNextShouldBeDisabled(true);
        }
    }, [ currentWizardStep ]);

    /**
     * Get wizard steps configuration.
     */
    const getWizardSteps: () => WizardStepInterface[] = () => {
        return [
            {
                icon: getConnectionWizardStepIcons().general,
                name: WizardSteps.GENERAL_DETAILS,
                title: t("authenticationProvider:wizards.addIDP.steps.generalSettings.title")
            },
            {
                icon: getConnectionWizardStepIcons().general,
                name: WizardSteps.CONNECTOR_DETAILS,
                title: t("authenticationProvider:wizards.addProvisioningConnector.steps.connectorConfiguration.title")
            }
        ] as WizardStepInterface[];
    };

    /**
     * Initialize wizard steps on mount.
     */
    useEffect(() => {
        if (!initWizard) {
            setWizardSteps(getWizardSteps());
            setInitWizard(true);
        }
    }, [ initWizard ]);

    /**
     * At the initial load, select the first item from the connector list.
     */
    useEffect(() => {
        if (
            !(
                outboundProvisioningConnectorsList &&
                Array.isArray(outboundProvisioningConnectorsList) &&
                outboundProvisioningConnectorsList.length > 0
            )
        ) {
            return;
        }

        if (outboundProvisioningConnectorsList[0]?.connectorId) {
            setSelectedConnectorId(outboundProvisioningConnectorsList[0].connectorId);
        }
    }, [ outboundProvisioningConnectorsList ]);

    /**
     * Check if the typed IDP name is already taken.
     *
     * @param value - User input for the IDP name.
     */
    const idpNameValidation: DebouncedFunc<(value: string) => void> = debounce(
        async (value: string) => {
            let idpExist: boolean;

            if (idpNameValidationCache?.current?.value === value) {
                idpExist = idpNameValidationCache?.current?.state;
            }

            if (idpExist === undefined) {
                try {
                    idpExist = await ConnectionsManagementUtils.searchIdentityProviderName(value);
                } catch (e) {
                    /**
                     * Ignore the error, as a failed identity provider search
                     * should not result in user blocking. However, if the
                     * identity provider name already exists, it will undergo
                     * validation from the backend, and any resulting errors
                     * will be displayed in the user interface.
                     */
                    idpExist = false;
                }

                idpNameValidationCache.current = {
                    state: idpExist,
                    value
                };
            }

            setIsUserInputIdpNameAlreadyTaken(!!idpExist);
        },
        500
    );

    /**
     * Fetch connector metadata when connector selection changes.
     */
    useEffect(() => {
        if (!selectedConnectorId) {
            return;
        }

        setIsConnectorMetadataRequestLoading(true);

        getOutboundProvisioningConnectorMetadata(selectedConnectorId)
            .then((response: OutboundProvisioningConnectorMetaInterface) => {
                setConnectorMetaData(response);
            })
            .catch((error: AxiosError) => {
                handleGetOutboundProvisioningConnectorMetadataError(error);
            })
            .finally(() => {
                setIsConnectorMetadataRequestLoading(false);
            });
    }, [ selectedConnectorId ]);


    /**
     * Handles the final wizard submission.
     * Follows the same pattern as EnterpriseConnectionCreateWizard.
     */
    const handleFormSubmit = (values: Record<string, string>): void => {

        if (selectedConnectorId === null) return;
        // Build provisioning properties from form values.
        const properties: KeyValue[] = [];

        /**
         * Process a property and its sub-properties recursively.
         */
        const processProperty = (property: CommonPluggableComponentMetaPropertyInterface): void => {
            if (!property.key) {
                return;
            }

            const fieldValue: string = values[property.key];

            if (fieldValue !== undefined && fieldValue !== null && fieldValue !== "") {
                properties.push({
                    key: property.key,
                    value: String(fieldValue)
                });
            } else if (property.defaultValue) {
                properties.push({
                    key: property.key,
                    value: property.defaultValue
                });
            }

            // Process sub-properties recursively.
            if (property.subProperties && property.subProperties.length > 0) {
                property.subProperties.forEach((subProperty: CommonPluggableComponentMetaPropertyInterface) => {
                    processProperty(subProperty);
                });
            }
        };

        if (connectorMetaData?.properties) {
            connectorMetaData.properties.forEach((property: CommonPluggableComponentMetaPropertyInterface) => {
                processProperty(property);
            });
        }

        // Build connection payload.
        const connection: ConnectionInterface = {
            alias: EMPTY_STRING,
            certificate: {
                certificates: []
            },
            claims: {
                provisioningClaims: [],
                roleClaim: {
                    uri: EMPTY_STRING
                },
                userIdClaim: {
                    uri: EMPTY_STRING
                }
            },
            description: values.description || EMPTY_STRING,
            federatedAuthenticators: {
                authenticators: [],
                defaultAuthenticatorId: EMPTY_STRING
            },
            homeRealmIdentifier: EMPTY_STRING,
            idpIssuerName: EMPTY_STRING,
            image: "assets/images/logos/outbound-provisioning.svg",
            isFederationHub: false,
            isPrimary: false,
            name: values.name,
            provisioning: {
                outboundConnectors: {
                    connectors: [
                        {
                            connectorId: selectedConnectorId,
                            isEnabled: true,
                            properties: properties
                        }
                    ],
                    defaultConnectorId: selectedConnectorId
                }
            },
            roles: {
                mappings: [],
                outboundProvisioningRoles: []
            },
            templateId: CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.OUTBOUND_PROVISIONING_CONNECTION
        };

        setIsSubmitting(true);

        createConnection(connection)
            .then((response: AxiosResponse<ConnectionInterface>) => {
                eventPublisher.publish("connections-finish-adding-connection", {
                    type: componentId + "-" + kebabCase("outbound-provisioning-connection")
                });

                dispatch(
                    addAlert({
                        description: t("authenticationProvider:notifications.addIDP.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("authenticationProvider:notifications.addIDP.success.message")
                    })
                );

                if (!isEmpty(response.headers.location)) {
                    const location: string = response.headers.location;
                    const createdIdpID: string = location.substring(location.lastIndexOf("/") + 1);

                    onIDPCreate(createdIdpID);

                    return;
                }

                onIDPCreate(EMPTY_STRING);
            })
            .catch((error: AxiosError) => {
                const identityAppsError: IdentityAppsError = ConnectionUIConstants.ERROR_CREATE_LIMIT_REACHED;

                if (error?.response?.status === 403
                    && error?.response?.data?.code === identityAppsError.getErrorCode()) {

                    setAlert({
                        code: identityAppsError.getErrorCode(),
                        description: t(
                            identityAppsError.getErrorDescription()
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            identityAppsError.getErrorMessage()
                        ),
                        traceId: identityAppsError.getErrorTraceId()
                    });
                    setTimeout(() => setAlert(undefined), 4000);

                    return;
                }

                if (error.response && error.response.data && error.response.data.description) {
                    setAlert({
                        description: t("authenticationProvider:notifications." +
                                        "addIDP.error.description",
                        { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: t("authenticationProvider:notifications." +
                                        "addIDP.error.message")
                    });
                    setTimeout(() => setAlert(undefined), 4000);

                    return;
                }
                setAlert({
                    description: t("authenticationProvider:notifications." +
                                    "addIDP.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("authenticationProvider:notifications." +
                                    "addIDP.genericError.message")
                });
                setTimeout(() => setAlert(undefined), 4000);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     * Step 1: General Details Page - now includes connector selection.
     */
    const generalDetailsPage = (): ReactElement => (
        <WizardPage
            validate={ (values: Record<string, string>) => {
                const errors: FormErrors = {};

                // Validate name field
                if (!values.name) {
                    errors.name = t("common:required");
                } else if (values.name.length < IDP_NAME_LENGTH.min) {
                    errors.name = t("common:minValidation", { min: IDP_NAME_LENGTH.min });
                } else if (values.name.length > IDP_NAME_LENGTH.max) {
                    errors.name = t("common:maxValidation", { max: IDP_NAME_LENGTH.max });
                } else if (values?.name && isUserInputIdpNameAlreadyTaken) {
                    errors.name = t("authenticationProvider:forms.generalDetails.name.validations.duplicate");
                } else if (!FormValidation.isValidResourceName(values.name)) {
                    errors.name = t("authenticationProvider:templates.enterprise.validation.name");
                }

                // Connector selection is mandatory
                if (!selectedConnectorId) {
                    errors["connectorId"] = t("common:required");
                }

                setNextShouldBeDisabled(ifFieldsHave(errors));

                return errors;
            } }
        >
            <Grid padded>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                        <FinalFormField
                            fullWidth
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            data-componentid={ `${componentId}-form-wizard-idp-name` }
                            aria-label="name"
                            name="name"
                            type="text"
                            label={ t("authenticationProvider:forms.generalDetails.name.label") }
                            placeholder={ t("authenticationProvider:forms.generalDetails.name.placeholder") }
                            component={ TextFieldAdapter }
                            initialValue={ initialValues.name }
                            maxLength={ IDP_NAME_LENGTH.max }
                            minLength={ IDP_NAME_LENGTH.min }
                            required={ true }
                            listen={ (value: string) => {
                                if (value) {
                                    idpNameValidation(value.toString().trimStart());
                                }
                            } }
                            validation={ (value: string) => {
                                if (!value) {
                                    return t("common:required");
                                }
                                if (value.length < IDP_NAME_LENGTH.min) {
                                    return t("common:minValidation", { min: IDP_NAME_LENGTH.min });
                                }
                                if (value.length > IDP_NAME_LENGTH.max) {
                                    return t("common:maxValidation", { max: IDP_NAME_LENGTH.max });
                                }
                                if (isUserInputIdpNameAlreadyTaken) {
                                    return t("authenticationProvider:forms.generalDetails.name.validations.duplicate");
                                }
                                if (!FormValidation.isValidResourceName(value)) {
                                    return t("authenticationProvider:templates.enterprise.validation.invalidName", {
                                        idpName: value
                                    });
                                }

                                return undefined;
                            } }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                        <FinalFormField
                            fullWidth
                            FormControlProps={ {
                                margin: "dense"
                            } }
                            data-componentid={ `${componentId}-form-wizard-idp-description` }
                            aria-label="description"
                            name="description"
                            type="text"
                            label={ t("authenticationProvider:forms.generalDetails.description.label") }
                            placeholder={ t("authenticationProvider:forms.generalDetails.description.placeholder") }
                            component={ TextFieldAdapter }
                            initialValue={ initialValues.description }
                            required={ false }
                            maxLength={ 300 }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        <Heading as="h5">
                            { t("authenticationProvider:wizards.addProvisioningConnector.steps." +
                                "connectorSelection.subTitle") }
                        </Heading>
                        {
                            outboundProvisioningConnectorsMetadataList.map(
                                (connector: OutboundProvisioningConnectorMetaDataInterface) => (
                                    <SelectionCard
                                        key={ connector.connectorId }
                                        inline
                                        image={ connector.icon }
                                        size="small"
                                        header={ connector.displayName || connector.name }
                                        description={ connector.description }
                                        selected={ selectedConnectorId === connector.connectorId }
                                        onClick={ () => setSelectedConnectorId(connector.connectorId) }
                                        imageSize="x30"
                                        imageOptions={ {
                                            relaxed: true,
                                            square: false,
                                            width: "auto"
                                        } }
                                        contentTopBorder={ false }
                                        showTooltips={ true }
                                        data-componentid={ `${componentId}-connector-${connector.name}-selection-card` }
                                    />
                                )
                            )
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </WizardPage>
    );

    /**
     * Step 2: Connector Configuration Page.
     * Uses the shared ConnectorConfigFormFields to render fields from metadata.
     */
    const connectorConfigurationPage = (): ReactElement => {
        if (isConnectorMetadataRequestLoading) {
            return (
                <WizardPage>
                    <div>{ t("common:loading") }</div>
                </WizardPage>
            );
        }

        if (!connectorMetaData) {
            return (
                <WizardPage>
                    <div>{ t("common:noDataAvailable") }</div>
                </WizardPage>
            );
        }

        return (
            <WizardPage>
                <Heading as="h5">
                    { t("authenticationProvider:wizards.addProvisioningConnector.steps.connectorConfiguration" +
                        ".configureTitle", {
                        connectorName: connectorMetaData.displayName || connectorMetaData.name
                    }) }
                </Heading>
                <ConnectorConfigFormFields
                    metadata={ connectorMetaData }
                    fieldNamePrefix=""
                    onValidationChange={ (hasErrors: boolean) => {
                        setNextShouldBeDisabled(hasErrors);
                    } }
                    data-componentid={ `${ componentId }-connector-config` }
                />
            </WizardPage>
        );
    };

    /**
     * Resolve wizard pages based on current state.
     */
    const resolveWizardPages = (): ReactElement[] => {
        return [
            generalDetailsPage(),
            connectorConfigurationPage()
        ];
    };

    return (
        <ModalWithSidePanel
            isLoading={ isLoadingOutboundProvisioningConnectorsList }
            open={ true }
            className="wizard identity-provider-create-wizard"
            dimmer="blurring"
            onClose={ onWizardClose }
            closeOnDimmerClick={ false }
            closeOnEscape
            data-componentid={ `${componentId}-modal` }
        >
            <ModalWithSidePanel.MainPanel>
                { /* Modal header. */ }
                <ModalWithSidePanel.Header
                    className="wizard-header"
                    data-componentid={ `${componentId}-modal-header` }
                >
                    <div className="display-flex">
                        <GenericIcon
                            icon={ getConnectionIcons().enterprise }
                            size="x30"
                            transparent
                            spaced="right"
                            data-componentid={ `${componentId}-image` }
                        />
                        <div>
                            { title }
                            { subTitle && <Heading as="h6">{ subTitle }</Heading> }
                        </div>
                    </div>
                </ModalWithSidePanel.Header>
                { /* Modal body content. */ }
                <React.Fragment>
                    <ModalWithSidePanel.Content
                        className="steps-container"
                        data-componentid={ `${componentId}-modal-content-1` }
                    >
                        <Steps.Group current={ currentWizardStep }>
                            { wizardSteps.map((step: WizardStepInterface, index: number) => (
                                <Steps.Step
                                    active
                                    key={ index }
                                    icon={ step.icon }
                                    title={ step.title }
                                />
                            )) }
                        </Steps.Group>
                    </ModalWithSidePanel.Content>
                    <ModalWithSidePanel.Content
                        className="content-container"
                        data-componentid={ `${componentId}-modal-content-2` }
                    >
                        { alert && alertComponent }
                        <Wizard2
                            ref={ wizardRef }
                            initialValues={ initialValues }
                            onSubmit={ handleFormSubmit }
                            uncontrolledForm={ true }
                            pageChanged={ (index: number) => setCurrentWizardStep(index) }
                            data-componentid={ componentId }
                        >
                            { resolveWizardPages() }
                        </Wizard2>
                    </ModalWithSidePanel.Content>
                </React.Fragment>
                { /* Modal actions. */ }
                <ModalWithSidePanel.Actions data-componentid={ `${componentId}-modal-actions` }>
                    <SemanticGrid>
                        <SemanticGrid.Row column={ 1 }>
                            <SemanticGrid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <LinkButton
                                    floated="left"
                                    onClick={ onWizardClose }
                                    data-componentid="add-connection-modal-cancel-button"
                                >
                                    { t("common:cancel") }
                                </LinkButton>
                            </SemanticGrid.Column>
                            <SemanticGrid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                { /* Check whether we have more steps. */ }
                                { currentWizardStep < wizardSteps.length - 1 && (
                                    <PrimaryButton
                                        disabled={ nextShouldBeDisabled }
                                        floated="right"
                                        onClick={ () => wizardRef.current.gotoNextPage() }
                                        data-componentid="add-connection-modal-next-button"
                                    >
                                        { t("authenticationProvider:wizards.buttons.next") }
                                        <Icon name="arrow right" />
                                    </PrimaryButton>
                                ) }
                                { /* Check whether its the last step. */ }
                                { currentWizardStep === wizardSteps.length - 1 && (
                                    <PrimaryButton
                                        disabled={ isSubmitting || nextShouldBeDisabled }
                                        type="submit"
                                        floated="right"
                                        onClick={ () => wizardRef.current.gotoNextPage() }
                                        data-componentid="add-connection-modal-finish-button"
                                        loading={ isSubmitting }
                                    >
                                        { t("authenticationProvider:wizards.buttons.finish") }
                                    </PrimaryButton>
                                ) }
                                { currentWizardStep > 0 && (
                                    <LinkButton
                                        type="submit"
                                        floated="right"
                                        onClick={ () => wizardRef.current.gotoPreviousPage() }
                                        data-componentid="add-connection-modal-previous-button"
                                    >
                                        <Icon name="arrow left" />
                                        { t("authenticationProvider:wizards.buttons.previous") }
                                    </LinkButton>
                                ) }
                            </SemanticGrid.Column>
                        </SemanticGrid.Row>
                    </SemanticGrid>
                </ModalWithSidePanel.Actions>
            </ModalWithSidePanel.MainPanel>
        </ModalWithSidePanel>
    );
};

/**
 * Given a {@link FormErrors} object, it will check whether
 * every key has a assigned truthy value. {@link Array.every}
 * will return true if one of the object member has
 * a truthy value. In other words, it will check a field has
 * a error message attached to it or not.
 */
const ifFieldsHave = (errors: FormErrors): boolean => {
    return !Object.keys(errors).every((k: any) => !errors[k]);
};

