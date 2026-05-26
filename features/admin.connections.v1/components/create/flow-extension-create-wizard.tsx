/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import Alert from "@oxygen-ui/react/Alert";
import Box from "@oxygen-ui/react/Box";
import Divider from "@oxygen-ui/react/Divider";
import Typography from "@oxygen-ui/react/Typography";
import ActionEndpointConfigForm from "@wso2is/admin.actions.v1/components/action-endpoint-config-form";
import checkFlowExtensionName from "@wso2is/admin.flow-builder-core.v1/api/check-flow-extension-name";
import createFlowExtension from "@wso2is/admin.flow-builder-core.v1/api/create-flow-extension";
import {
    FlowExtensionCreateRequestInterface,
    FlowExtensionResponseInterface
} from "@wso2is/admin.flow-builder-core.v1/models/flow-extension";
import {
    AuthenticationType,
    EndpointConfigFormPropertyInterface
} from "@wso2is/admin.actions.v1/models/actions";
import { validateActionEndpointFields } from "@wso2is/admin.actions.v1/util/form-field-util";
import { AddCertificateFormComponent } from "@wso2is/admin.core.v1/components/add-certificate-form";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { ModalWithSidePanel } from "@wso2is/admin.core.v1/components/modals/modal-with-side-panel";
import { IdentityAppsError } from "@wso2is/core/errors";
import { AlertLevels, HttpErrorResponseDataInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Wizard2, WizardPage } from "@wso2is/forms";
import { useTrigger } from "@wso2is/forms/legacy";
import {
    GenericIcon,
    Heading,
    Hint,
    LinkButton,
    PrimaryButton,
    Steps,
    useWizardAlert
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Icon, Grid as SemanticGrid } from "semantic-ui-react";
import { getConnectionWizardStepIcons } from "../../configs/ui";
import { ConnectionUIConstants } from "../../constants/connection-ui-constants";
import { AuthenticatorMeta } from "../../meta/authenticator-meta";
import {
    ConnectionTemplateInterface,
    GenericConnectionCreateWizardPropsInterface,
    WizardStepInterface,
    WizardStepsFlowExtension
} from "../../models/connection";

interface FlowExtensionCreateWizardPropsInterface
    extends GenericConnectionCreateWizardPropsInterface,
    IdentifiableComponentInterface {
    "data-componentid"?: string;
    template: ConnectionTemplateInterface;
    title: string;
    subTitle: string;
    onWizardClose: () => void;
}

const ACTION_NAME_REGEX: RegExp = /^[a-zA-Z0-9][a-zA-Z0-9 _-]{0,254}$/;

interface FlowExtensionWizardFormValues extends EndpointConfigFormPropertyInterface {
    name: string;
    description?: string;
}

/**
 * Flow Extension create wizard component.
 */
const FlowExtensionCreateWizard: FunctionComponent<FlowExtensionCreateWizardPropsInterface> = ({
    title,
    subTitle,
    onWizardClose,
    "data-componentid": componentId = "flow-extension"
}: FlowExtensionCreateWizardPropsInterface): ReactElement => {

    const wizardRef: MutableRefObject<any> = useRef(null);
    const [alert, setAlert, alertComponent] = useWizardAlert();

    const [initWizard, setInitWizard] = useState<boolean>(false);
    const [wizardSteps, setWizardSteps] = useState<WizardStepInterface[]>([]);
    const [currentWizardStep, setCurrentWizardStep] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isNameTaken, setIsNameTaken] = useState<boolean>(false);
    const [isCheckingName, setIsCheckingName] = useState<boolean>(false);
    const nameCheckTimer: MutableRefObject<ReturnType<typeof setTimeout> | null> =
        useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastCheckedName = useRef<string>("");
    const [endpointAuthType, setEndpointAuthType] = useState<AuthenticationType>(null);
    const [nextShouldBeDisabled, setNextShouldBeDisabled] = useState<boolean>(true);

    // Certificate state — managed in the endpoint config step.
    const [certificatePEM, setCertificatePEM] = useState<string>("");
    const [triggerCertUpload, setTriggerCertUpload] = useTrigger();
    const [triggerCertSubmit, setTriggerCertSubmit] = useTrigger();

    // Ref for deferred submission — waits for cert extraction before submitting.
    const pendingSubmit: MutableRefObject<boolean> = useRef<boolean>(false);
    const submitTimeout: MutableRefObject<ReturnType<typeof setTimeout> | null> =
        useRef<ReturnType<typeof setTimeout> | null>(null);
    // Ref mirrors certificatePEM state so handleFormSubmit always reads the
    // up-to-date value even when called synchronously from within the cert callback.
    const certPEMRef: MutableRefObject<string> = useRef<string>("");

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        if (!initWizard) {
            setWizardSteps(getWizardSteps());
            setInitWizard(true);
        }
    }, [initWizard]);

    /**
     * Debounced action name availability check.
     */
    const debouncedCheckName = useCallback((name: string) => {
        if (lastCheckedName.current === name) {
            return;
        }
        if (nameCheckTimer.current) {
            clearTimeout(nameCheckTimer.current);
        }
        lastCheckedName.current = name;
        if (!name || !ACTION_NAME_REGEX.test(name)) {
            setIsNameTaken(false);
            setIsCheckingName(false);
            return;
        }
        setIsCheckingName(true);
        nameCheckTimer.current = setTimeout(() => {
            checkFlowExtensionName(name)
                .then((response) => {
                    setIsNameTaken(!response.available);
                    setNextShouldBeDisabled(!response.available);
                })
                .catch(() => {
                    setIsNameTaken(false);
                })
                .finally(() => {
                    setIsCheckingName(false);
                });
        }, 500);
    }, []);

    const getWizardSteps = (): WizardStepInterface[] => {
        return [
            {
                icon: getConnectionWizardStepIcons().general,
                name: WizardStepsFlowExtension.GENERAL_SETTINGS,
                submitCallback: null,
                title: t("flowExtension:createWizard.steps.generalSettings.title")
            },
            {
                icon: getConnectionWizardStepIcons().authenticatorSettings,
                name: WizardStepsFlowExtension.ENDPOINT_CONFIG,
                submitCallback: null,
                title: t("flowExtension:createWizard.steps.endpointConfig.title")
            }
        ] as WizardStepInterface[];
    };

    const hasValidationErrors = (errors: Record<string, unknown>): boolean => {
        return !Object.keys(errors).every((k: string) => !errors[k]);
    };

    const validateGeneralSettings = (
        values: { name: string; description?: string }
    ): Partial<{ name: string; description: string }> => {
        const errors: Partial<{ name: string; description: string }> = {};

        if (!values?.name || !ACTION_NAME_REGEX.test(values.name)) {
            errors.name = t("flowExtension:createWizard.steps.generalSettings.name.validations.invalid");
        } else if (isNameTaken) {
            errors.name = t("flowExtension:createWizard.steps.generalSettings.name.validations.duplicate");
        }

        if (values?.description && values.description.length > 255) {
            errors.description = t("flowExtension:createWizard.steps.generalSettings.description.validations.maxLength");
        }

        if (!hasValidationErrors(errors) && !isCheckingName) {
            setNextShouldBeDisabled(false);
        } else {
            setNextShouldBeDisabled(true);
        }

        debouncedCheckName(values?.name);

        return errors;
    };

    const validateEndpointConfigs = (
        values: EndpointConfigFormPropertyInterface
    ): Partial<EndpointConfigFormPropertyInterface> => {
        const errors: Partial<EndpointConfigFormPropertyInterface> = validateActionEndpointFields(values, {
            authenticationType: endpointAuthType,
            isAuthenticationUpdateFormState: true
        });

        setNextShouldBeDisabled(hasValidationErrors(errors as Record<string, unknown>));

        return errors;
    };

    const handleCreateErrors = (error: AxiosError<HttpErrorResponseDataInterface>): void => {
        const identityAppsError: IdentityAppsError = ConnectionUIConstants.ERROR_CREATE_LIMIT_REACHED;

        if (error?.response?.status === 403 && error?.response?.data?.code === identityAppsError.getErrorCode()) {
            setAlert({
                code: identityAppsError.getErrorCode(),
                description: t(identityAppsError.getErrorDescription()),
                level: AlertLevels.ERROR,
                message: t(identityAppsError.getErrorMessage()),
                traceId: identityAppsError.getErrorTraceId()
            });
            setTimeout(() => setAlert(undefined), ConnectionUIConstants.WIZARD_ERROR_CLEAR_TIMEOUT);

            return;
        }

        if (error?.response?.data?.description) {
            setAlert({
                description: error.response.data.description,
                level: AlertLevels.ERROR,
                message: t("flowExtension:notifications.createError.message")
            });
        } else {
            setAlert({
                description: t("flowExtension:notifications.createGenericError.description"),
                level: AlertLevels.ERROR,
                message: t("flowExtension:notifications.createGenericError.message")
            });
        }
        setTimeout(() => setAlert(undefined), ConnectionUIConstants.WIZARD_ERROR_CLEAR_TIMEOUT);
    };

    const handleFormSubmit = (values: FlowExtensionWizardFormValues): void => {
        const authProperties: Record<string, string> = {};

        switch (endpointAuthType) {
            case AuthenticationType.BASIC:
                authProperties["username"] = values.usernameAuthProperty ?? "";
                authProperties["password"] = values.passwordAuthProperty ?? "";
                break;
            case AuthenticationType.BEARER:
                authProperties["accessToken"] = values.accessTokenAuthProperty ?? "";
                break;
            case AuthenticationType.API_KEY:
                authProperties["header"] = values.headerAuthProperty ?? "";
                authProperties["value"] = values.valueAuthProperty ?? "";
                break;
            case AuthenticationType.CLIENT_CREDENTIAL:
                authProperties["clientId"] = values.clientIdAuthProperty ?? "";
                authProperties["clientSecret"] = values.clientSecretAuthProperty ?? "";
                authProperties["tokenEndpoint"] = values.tokenEndpointAuthProperty ?? "";
                if (values.scopesAuthProperty) {
                    authProperties["scopes"] = values.scopesAuthProperty;
                }
                break;
            case AuthenticationType.NONE:
            default:
                break;
        }

        // Build encryption object from the certificate in step 2.
        // Read from the ref (not state) so we always get the value that was
        // captured synchronously by handleCertificateSubmit before gotoNextPage().
        const resolvedEncryption: { certificate: string } | undefined =
            certPEMRef.current ? { certificate: certPEMRef.current } : undefined;

        const actionBody: FlowExtensionCreateRequestInterface = {
            description: values.description?.toString() || "",
            encryption: resolvedEncryption,
            endpoint: {
                authentication: {
                    properties: authProperties,
                    type: endpointAuthType as unknown as AuthenticationType
                },
                uri: values.endpointUri?.toString()
            },
            name: values.name?.toString()
        };

        setIsSubmitting(true);
        createFlowExtension(actionBody)
            .then((response: FlowExtensionResponseInterface) => {
                dispatch(
                    addAlert({
                        description: t("flowExtension:notifications.createSuccess.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("flowExtension:notifications.createSuccess.message")
                    })
                );

                // Navigate to the edit page so the user can configure access config.
                const editPath: string = AppConstants.getPaths()
                    .get("FLOW_EXTENSION_EDIT")
                    .replace(":id", response.id);

                history.push(editPath + "#tab=access-configuration");
            })
            .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
                handleCreateErrors(error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const handleCertificateSubmit = (value: string): void => {
        // Sync both state (for UI) and ref (for handleFormSubmit closure).
        setCertificatePEM(value);
        certPEMRef.current = value;

        if (pendingSubmit.current) {
            pendingSubmit.current = false;
            if (submitTimeout.current) {
                clearTimeout(submitTimeout.current);
                submitTimeout.current = null;
            }
            wizardRef.current?.gotoNextPage();
        }
    };

    const generalSettingsPage = (): ReactElement => (
        <WizardPage validate={validateGeneralSettings}>
            <Field.Input
                ariaLabel="name"
                inputType="text"
                name="name"
                label={t("flowExtension:createWizard.steps.generalSettings.name.label")}
                placeholder={t("flowExtension:createWizard.steps.generalSettings.name.placeholder")}
                required={true}
                maxLength={255}
                minLength={1}
                data-componentid={`${componentId}-create-wizard-name`}
                width={15}
            />
            <Hint>{t("flowExtension:createWizard.steps.generalSettings.name.hint")}</Hint>
            <Field.Input
                ariaLabel="description"
                inputType="text"
                name="description"
                label={t("flowExtension:createWizard.steps.generalSettings.description.label")}
                placeholder={t("flowExtension:createWizard.steps.generalSettings.description.placeholder")}
                required={false}
                maxLength={255}
                minLength={0}
                data-componentid={`${componentId}-create-wizard-description`}
                width={15}
            />
        </WizardPage>
    );

    const endpointConfigPage = (): ReactElement => (
        <WizardPage validate={validateEndpointConfigs}>
            <ActionEndpointConfigForm
                initialValues={null}
                isCreateFormState={true}
                isReadOnly={false}
                showHeadersAndParams={false}
                showAllowedParameters={false}
                authenticationTypes={ConnectionUIConstants.FLOW_EXTENSION_AUTH_TYPES}
                onAuthenticationTypeChange={(type: AuthenticationType) => {
                    setEndpointAuthType(type);
                }}
                data-componentid={`${componentId}-endpoint-config-form`}
            />
            <Divider className="divider-container" sx={{ mb: "20px", mt: "20px" }} />
            <Heading className="heading-container" as="h5">
                {t("flowExtension:createWizard.steps.endpointConfig.certificate.title")}
            </Heading>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t("flowExtension:createWizard.steps.endpointConfig.certificate.hint")}
            </Typography>
            { certificatePEM && (
                <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                    action={
                        <LinkButton
                            onClick={ () => { setCertificatePEM(""); certPEMRef.current = ""; } }
                            data-componentid={ `${componentId}-clear-certificate` }
                        >
                            Clear
                        </LinkButton>
                    }
                    data-componentid={`${componentId}-certificate-status`}
                >
                    <Trans i18nKey="flowExtension:createWizard.steps.endpointConfig.certificate.uploaded">
                        Certificate uploaded successfully. You can re‑upload to replace it or clear it.
                    </Trans>
                </Alert>
            ) }
            <AddCertificateFormComponent
                triggerCertificateUpload={triggerCertUpload}
                triggerSubmit={triggerCertSubmit}
                onSubmit={handleCertificateSubmit}
                data-componentid={`${componentId}-certificate-upload`}
            />
        </WizardPage>
    );

    const resolveWizardPages = (): ReactElement[] => {
        return [generalSettingsPage(), endpointConfigPage()];
    };

    return (
        <ModalWithSidePanel
            open={true}
            className="wizard identity-provider-create-wizard"
            dimmer="blurring"
            onClose={onWizardClose}
            closeOnDimmerClick={false}
            closeOnEscape
            data-componentid={`${componentId}-modal`}
        >
            <ModalWithSidePanel.MainPanel>
                <ModalWithSidePanel.Header
                    className="wizard-header"
                    data-componentid={`${componentId}-modal-header`}
                >
                    <div className="display-flex">
                        <GenericIcon
                            icon={AuthenticatorMeta.getFlowExtensionIcon()}
                            size="x30"
                            transparent
                            spaced="right"
                            data-componentid={`${componentId}-image`}
                        />
                        <div>
                            {title}
                            {subTitle && <Heading as="h6">{subTitle}</Heading>}
                        </div>
                    </div>
                </ModalWithSidePanel.Header>
                <React.Fragment>
                    <ModalWithSidePanel.Content
                        className="steps-container"
                        data-componentid={`${componentId}-modal-steps`}
                    >
                        <Steps.Group current={currentWizardStep}>
                            {wizardSteps.map((step: WizardStepInterface, index: number) => (
                                <Steps.Step active key={index} icon={step.icon} title={step.title} />
                            ))}
                        </Steps.Group>
                    </ModalWithSidePanel.Content>
                    <ModalWithSidePanel.Content
                        className="content-container"
                        data-componentid={`${componentId}-modal-content`}
                    >
                        {alert && alertComponent}
                        <Wizard2
                            ref={wizardRef}
                            initialValues={{ description: "", endpointUri: "", name: "" }}
                            uncontrolledForm={true}
                            onSubmit={handleFormSubmit}
                            pageChanged={(index: number) => {
                                setCurrentWizardStep(index);
                            }}
                            data-componentid={componentId}
                        >
                            {resolveWizardPages()}
                        </Wizard2>
                    </ModalWithSidePanel.Content>
                </React.Fragment>
                <ModalWithSidePanel.Actions data-componentid={`${componentId}-modal-actions`}>
                    <SemanticGrid>
                        <SemanticGrid.Row column={1}>
                            <SemanticGrid.Column mobile={8} tablet={8} computer={8}>
                                <LinkButton
                                    floated="left"
                                    onClick={onWizardClose}
                                    data-componentid={`${componentId}-cancel-button`}
                                >
                                    {t("common:cancel")}
                                </LinkButton>
                            </SemanticGrid.Column>
                            <SemanticGrid.Column mobile={8} tablet={8} computer={8}>
                                {currentWizardStep < wizardSteps.length - 1 && (
                                    <PrimaryButton
                                        disabled={nextShouldBeDisabled}
                                        floated="right"
                                        onClick={() => {
                                            wizardRef.current.gotoNextPage();
                                        }}
                                        data-componentid={`${componentId}-next-button`}
                                    >
                                        {t("authenticationProvider:wizards.buttons.next")}
                                        <Icon name="arrow right" />
                                    </PrimaryButton>
                                )}
                                {currentWizardStep === wizardSteps.length - 1 && (
                                    <PrimaryButton
                                        disabled={nextShouldBeDisabled || isSubmitting}
                                        type="submit"
                                        floated="right"
                                        onClick={() => {
                                            // Trigger cert extraction: AddCertificateFormComponent
                                            // passes triggerCertificateUpload to UploadCertificate
                                            // as its triggerSubmit — firing setTriggerCertUpload()
                                            // causes UploadCertificate to flush its value via onSubmit,
                                            // which eventually calls our handleCertificateSubmit.
                                            // The 300ms timeout is a fallback for the no-cert case
                                            // (UploadCertificate returns early without calling back).
                                            setTriggerCertUpload();
                                            pendingSubmit.current = true;
                                            submitTimeout.current = setTimeout(() => {
                                                if (pendingSubmit.current) {
                                                    pendingSubmit.current = false;
                                                    wizardRef.current?.gotoNextPage();
                                                }
                                            }, 300);
                                        }}
                                        data-componentid={`${componentId}-submit-button`}
                                        loading={isSubmitting}
                                    >
                                        {t("authenticationProvider:wizards.buttons.finish")}
                                    </PrimaryButton>
                                )}
                                {currentWizardStep > 0 && (
                                    <LinkButton
                                        type="submit"
                                        floated="right"
                                        onClick={() => wizardRef.current.gotoPreviousPage()}
                                        data-componentid={`${componentId}-previous-button`}
                                    >
                                        <Icon name="arrow left" />
                                        {t("authenticationProvider:wizards.buttons.previous")}
                                    </LinkButton>
                                )}
                            </SemanticGrid.Column>
                        </SemanticGrid.Row>
                    </SemanticGrid>
                </ModalWithSidePanel.Actions>
            </ModalWithSidePanel.MainPanel>
        </ModalWithSidePanel>
    );
};

export default FlowExtensionCreateWizard;
