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

import ActionEndpointConfigForm from "@wso2is/admin.actions.v1/components/action-endpoint-config-form";
import {
    AuthenticationType,
    EndpointConfigFormPropertyInterface
} from "@wso2is/admin.actions.v1/models/actions";
import { validateActionEndpointFields } from "@wso2is/admin.actions.v1/util/form-field-util";
import { ModalWithSidePanel } from "@wso2is/admin.core.v1/components/modals/modal-with-side-panel";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertLevels, HttpErrorResponseDataInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Wizard, WizardPage } from "@wso2is/forms";
import {
    GenericIcon,
    Heading,
    Hint,
    LinkButton,
    PrimaryButton,
    Steps,
    useWizardAlert
} from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import { AxiosError } from "axios";
import React, { FunctionComponent, MutableRefObject, ReactElement, SVGProps, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Icon, Grid as SemanticGrid } from "semantic-ui-react";
import createFlowExtension from "../../api/create-flow-extension";
import { getFlowExtensionIcon, getFlowExtensionWizardStepIcons } from "../../configs/ui";
import { FlowExtensionConstants } from "../../constants/flow-extension-constants";
import {
    FlowExtensionCreateRequestInterface,
    FlowExtensionResponseInterface
} from "../../models/flow-extension";

/**
 * Props for the Flow Extension create wizard.
 *
 * Typed locally to keep this feature decoupled from `admin.connections.v1`.
 */
interface FlowExtensionCreateWizardPropsInterface extends IdentifiableComponentInterface {
    title: string;
    subTitle?: string;
    onWizardClose: () => void;
}

/**
 * Names of the Flow Extension create wizard steps.
 */
const WizardStepName = {
    ENDPOINT_CONFIGURATION: "Endpoint Configuration",
    GENERAL_SETTINGS: "General Settings"
} as const;

type WizardStepName = typeof WizardStepName[keyof typeof WizardStepName];

/**
 * A single step in the Flow Extension create wizard.
 */
interface WizardStepInterface {
    icon: FunctionComponent<SVGProps<SVGSVGElement>>;
    title: string;
    name: WizardStepName;
}

/**
 * Form values collected across the Flow Extension create wizard pages.
 */
interface FlowExtensionWizardFormValues extends EndpointConfigFormPropertyInterface {
    name: string;
    description?: string;
    iconUrl?: string;
}

/**
 * Flow Extension connection create wizard.
 *
 * @param props - Props injected to the component.
 * @returns Flow Extension create wizard component.
 */
const FlowExtensionCreateWizard: FunctionComponent<FlowExtensionCreateWizardPropsInterface> = ({
    title,
    subTitle,
    onWizardClose,
    ["data-componentid"]: componentId = "flow-extension-create-wizard"
}: FlowExtensionCreateWizardPropsInterface): ReactElement => {

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();
    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const submitForm: MutableRefObject<() => void> = useRef<() => void>(null);
    const triggerPreviousForm: MutableRefObject<() => void> = useRef<() => void>(null);

    const [ wizardSteps, setWizardSteps ] = useState<WizardStepInterface[]>([]);
    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(0);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ endpointAuthType, setEndpointAuthType ] = useState<AuthenticationType>(AuthenticationType.NONE);
    const [ nextShouldBeDisabled, setNextShouldBeDisabled ] = useState<boolean>(true);

    useEffect(() => {
        setWizardSteps([
            {
                icon: getFlowExtensionWizardStepIcons().general,
                name: WizardStepName.GENERAL_SETTINGS,
                title: t("flowExtension:createWizard.steps.generalSettings.title")
            },
            {
                icon: getFlowExtensionWizardStepIcons().endpoint,
                name: WizardStepName.ENDPOINT_CONFIGURATION,
                title: t("flowExtension:createWizard.steps.endpointConfig.title")
            }
        ]);
    }, []);

    const hasValidationErrors = (errors: Record<string, string>): boolean =>
        Object.keys(errors).some((key: string) => Boolean(errors[key]));

    const validateGeneralSettings = (
        values: Pick<FlowExtensionWizardFormValues, "name" | "description" | "iconUrl">
    ): Partial<Record<"name" | "description" | "iconUrl", string>> => {
        const errors: Partial<Record<"name" | "description" | "iconUrl", string>> = {};

        if (!values?.name || !FlowExtensionConstants.FLOW_EXTENSION_NAME_REGEX.test(values.name)) {
            errors.name = t("flowExtension:createWizard.steps.generalSettings.name.validations.invalid");
        }

        if (values?.description && values.description.length > FlowExtensionConstants.FLOW_EXTENSION_MAX_DESCRIPTION_LENGTH) {
            errors.description = t(
                "flowExtension:createWizard.steps.generalSettings.description.validations.maxLength"
            );
        }

        if (values?.iconUrl && !FormValidation.url(values.iconUrl)) {
            errors.iconUrl = t("flowExtension:createWizard.steps.generalSettings.iconUrl.validations.invalid");
        }

        setNextShouldBeDisabled(hasValidationErrors(errors));

        return errors;
    };

    const validateEndpointConfigs = (
        values: EndpointConfigFormPropertyInterface
    ): Partial<EndpointConfigFormPropertyInterface> => {
        const errors: Partial<EndpointConfigFormPropertyInterface> = validateActionEndpointFields(values, {
            authenticationType: endpointAuthType,
            isAuthenticationUpdateFormState: true,
            isCreateFormState: true
        });

        setNextShouldBeDisabled(hasValidationErrors(errors as Record<string, string>));

        return errors;
    };

    const resolveAuthProperties = (values: FlowExtensionWizardFormValues): Record<string, string> => {
        switch (endpointAuthType) {
            case AuthenticationType.BASIC:
                return {
                    password: values.passwordAuthProperty ?? "",
                    username: values.usernameAuthProperty ?? ""
                };
            case AuthenticationType.BEARER:
                return { accessToken: values.accessTokenAuthProperty ?? "" };
            case AuthenticationType.API_KEY:
                return {
                    header: values.headerAuthProperty ?? "",
                    value: values.valueAuthProperty ?? ""
                };
            case AuthenticationType.CLIENT_CREDENTIAL:
                return {
                    clientId: values.clientIdAuthProperty ?? "",
                    clientSecret: values.clientSecretAuthProperty ?? "",
                    tokenEndpoint: values.tokenEndpointAuthProperty ?? "",
                    ...(values.scopesAuthProperty ? { scopes: values.scopesAuthProperty } : {})
                };
            default:
                return {};
        }
    };

    const handleCreateError = (error: AxiosError<HttpErrorResponseDataInterface>): void => {
        if (error?.response?.status === 403 && error?.response?.data?.code === "IDP-60035") {
            setAlert({
                description: t("idp:notifications.apiLimitReachedError.error.description"),
                level: AlertLevels.ERROR,
                message: t("idp:notifications.apiLimitReachedError.error.message")
            });
        } else {
            setAlert({
                description: t("flowExtension:notifications.createError.description"),
                level: AlertLevels.ERROR,
                message: t("flowExtension:notifications.createError.message")
            });
        }
    };

    const handleFormSubmit = (values: FlowExtensionWizardFormValues): void => {
        const requestBody: FlowExtensionCreateRequestInterface = {
            description: values.description?.trim()
                ? values.description
                : FlowExtensionConstants.FLOW_EXTENSION_DEFAULT_DESCRIPTION,
            ...(values.iconUrl ? { iconUrl: values.iconUrl } : {}),
            endpoint: {
                authentication: {
                    properties: resolveAuthProperties(values),
                    type: endpointAuthType
                },
                uri: values.endpointUri
            },
            name: values.name
        };

        setIsSubmitting(true);
        createFlowExtension(requestBody)
            .then((response: FlowExtensionResponseInterface): void => {
                dispatch(addAlert({
                    description: t("flowExtension:notifications.createSuccess.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("flowExtension:notifications.createSuccess.message")
                }));

                const editPath: string = AppConstants.getPaths()
                    .get("FLOW_EXTENSION_EDIT")
                    .replace(":id", response.id);

                history.push(editPath);
            })
            .catch((error: AxiosError<HttpErrorResponseDataInterface>): void => handleCreateError(error))
            .finally((): void => setIsSubmitting(false));
    };

    const generalSettingsPage = (): ReactElement => (
        <WizardPage validate={ validateGeneralSettings }>
            <Field.Input
                ariaLabel="name"
                inputType="text"
                name="name"
                label={ t("flowExtension:createWizard.steps.generalSettings.name.label") }
                placeholder={ t("flowExtension:createWizard.steps.generalSettings.name.placeholder") }
                required={ true }
                maxLength={ 255 }
                minLength={ 1 }
                data-componentid={ `${componentId}-create-wizard-name` }
                width={ 15 }
            />
            <Hint>{ t("flowExtension:createWizard.steps.generalSettings.name.hint") }</Hint>
            <Field.Input
                ariaLabel="description"
                inputType="text"
                name="description"
                label={ t("flowExtension:createWizard.steps.generalSettings.description.label") }
                placeholder={ t("flowExtension:createWizard.steps.generalSettings.description.placeholder") }
                required={ false }
                maxLength={ FlowExtensionConstants.FLOW_EXTENSION_MAX_DESCRIPTION_LENGTH }
                minLength={ 0 }
                data-componentid={ `${componentId}-create-wizard-description` }
                width={ 15 }
            />
            <Field.Input
                ariaLabel="iconUrl"
                inputType="url"
                name="iconUrl"
                label={ t("flowExtension:createWizard.steps.generalSettings.iconUrl.label") }
                placeholder={ t("flowExtension:createWizard.steps.generalSettings.iconUrl.placeholder") }
                required={ false }
                maxLength={ 2048 }
                minLength={ 0 }
                data-componentid={ `${componentId}-create-wizard-icon-url` }
                width={ 15 }
            />
            <Hint>{ t("flowExtension:createWizard.steps.generalSettings.iconUrl.hint") }</Hint>
        </WizardPage>
    );

    const endpointConfigPage = (): ReactElement => (
        <WizardPage validate={ validateEndpointConfigs }>
            <ActionEndpointConfigForm
                initialValues={ null }
                isCreateFormState={ true }
                isReadOnly={ false }
                showHeadersAndParams={ false }
                authenticationTypes={ FlowExtensionConstants.FLOW_EXTENSION_AUTH_TYPES }
                onAuthenticationTypeChange={ (type: AuthenticationType): void => setEndpointAuthType(type) }
                data-componentid={ `${componentId}-endpoint-config-form` }
            />
        </WizardPage>
    );

    const resolveWizardPages = (): ReactElement[] => [ generalSettingsPage(), endpointConfigPage() ];

    return (
        <ModalWithSidePanel
            open={ true }
            className="wizard identity-provider-create-wizard"
            dimmer="blurring"
            onClose={ onWizardClose }
            closeOnDimmerClick={ false }
            closeOnEscape
            data-componentid={ `${componentId}-modal` }
        >
            <ModalWithSidePanel.MainPanel>
                <ModalWithSidePanel.Header
                    className="wizard-header"
                    data-componentid={ `${componentId}-modal-header` }
                >
                    <div className="display-flex">
                        <GenericIcon
                            icon={ getFlowExtensionIcon() }
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
                <ModalWithSidePanel.Content
                    className="steps-container"
                    data-componentid={ `${componentId}-modal-steps` }
                >
                    <Steps.Group current={ currentWizardStep }>
                        { wizardSteps.map((step: WizardStepInterface, index: number) => (
                            <Steps.Step active key={ index } icon={ step.icon } title={ step.title } />
                        )) }
                    </Steps.Group>
                </ModalWithSidePanel.Content>
                <ModalWithSidePanel.Content
                    className="content-container"
                    data-componentid={ `${componentId}-modal-content` }
                >
                    { alert && alertComponent }
                    <Wizard
                        id={ `${componentId}-form` }
                        initialValues={ { description: "", endpointUri: "", iconUrl: "", name: "" } }
                        uncontrolledForm={ true }
                        onSubmit={ handleFormSubmit }
                        triggerSubmit={ (submitFunction: () => void): void => {
                            submitForm.current = submitFunction;
                        } }
                        triggerPrevious={ (previousFunction: () => void): void => {
                            triggerPreviousForm.current = previousFunction;
                        } }
                        changePage={ (index: number): void => setCurrentWizardStep(index) }
                        data-componentid={ componentId }
                    >
                        { resolveWizardPages() }
                    </Wizard>
                </ModalWithSidePanel.Content>
                <ModalWithSidePanel.Actions data-componentid={ `${componentId}-modal-actions` }>
                    <SemanticGrid>
                        <SemanticGrid.Row column={ 1 }>
                            <SemanticGrid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <LinkButton
                                    floated="left"
                                    onClick={ onWizardClose }
                                    data-componentid={ `${componentId}-cancel-button` }
                                >
                                    { t("common:cancel") }
                                </LinkButton>
                            </SemanticGrid.Column>
                            <SemanticGrid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                { currentWizardStep < wizardSteps.length - 1 && (
                                    <PrimaryButton
                                        disabled={ nextShouldBeDisabled }
                                        floated="right"
                                        onClick={ (): void => submitForm.current?.() }
                                        data-componentid={ `${componentId}-next-button` }
                                    >
                                        { t("authenticationProvider:wizards.buttons.next") }
                                        <Icon name="arrow right" />
                                    </PrimaryButton>
                                ) }
                                { currentWizardStep === wizardSteps.length - 1 && (
                                    <PrimaryButton
                                        disabled={ nextShouldBeDisabled || isSubmitting }
                                        floated="right"
                                        loading={ isSubmitting }
                                        onClick={ (): void => submitForm.current?.() }
                                        data-componentid={ `${componentId}-submit-button` }
                                    >
                                        { t("authenticationProvider:wizards.buttons.finish") }
                                    </PrimaryButton>
                                ) }
                                { currentWizardStep > 0 && (
                                    <LinkButton
                                        floated="right"
                                        onClick={ (): void => triggerPreviousForm.current?.() }
                                        data-componentid={ `${componentId}-previous-button` }
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

export default FlowExtensionCreateWizard;
