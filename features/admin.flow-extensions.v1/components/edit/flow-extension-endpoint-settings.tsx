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

import Alert from "@oxygen-ui/react/Alert";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Divider from "@oxygen-ui/react/Divider";
import Typography from "@oxygen-ui/react/Typography";
import ActionEndpointConfigForm from "@wso2is/admin.actions.v1/components/action-endpoint-config-form";
import {
    AuthenticationType,
    EndpointConfigFormPropertyInterface
} from "@wso2is/admin.actions.v1/models/actions";
import { validateActionEndpointFields } from "@wso2is/admin.actions.v1/util/form-field-util";
import { AddCertificateFormComponent } from "@wso2is/admin.core.v1/components/add-certificate-form";
import {
    AlertLevels,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FormRenderProps } from "@wso2is/forms";
import { useTrigger } from "@wso2is/forms/legacy";
import { ContentLoader, EmphasizedSegment, Heading, LinkButton } from "@wso2is/react-components";
import { FormApi } from "final-form";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import updateFlowExtension from "../../api/update-flow-extension";
import { FlowExtensionConstants } from "../../constants/flow-extension-constants";
import {
    FlowExtensionEndpointInterface,
    FlowExtensionResponseInterface,
    FlowExtensionUpdateRequestInterface
} from "../../models/flow-extension";

/**
 * Props for the Flow Extension endpoint settings tab.
 */
interface FlowExtensionEndpointSettingsPropsInterface extends IdentifiableComponentInterface {
    /**
     * The Flow Extension being edited.
     */
    flowExtension: FlowExtensionResponseInterface;
    /**
     * Whether the parent resource is still loading.
     */
    isLoading?: boolean;
    /**
     * Whether the form is read-only.
     */
    isReadOnly: boolean;
    /**
     * Callback to refresh the Flow Extension after an update.
     */
    mutateFlowExtension: () => void;
}

/**
 * Endpoint form values, extended with the certificate fields that are carried in form state rather
 * than rendered as visible inputs. Keeping them in the form (instead of component state) lets a submit
 * resumed synchronously from the certificate-extraction callback read fresh values without stale closures.
 */
interface FlowExtensionEndpointFormValues extends EndpointConfigFormPropertyInterface {
    /**
     * Base64-encoded PEM certificate staged for encryption. `undefined` means untouched, `""` means cleared.
     */
    encodedCertificate?: string;
    /**
     * Whether the certificate was staged or cleared since the last successful save.
     */
    certificateModified?: boolean;
}

/**
 * Build the endpoint form's initial values from the Flow Extension response. The API returns the
 * raw endpoint shape (`uri`, `authentication.type`, `authentication.properties`); this maps it into
 * the form shape (`endpointUri`, `authenticationType`, per-property fields) the config form expects.
 *
 * @param endpoint - Endpoint section of the Flow Extension response.
 * @returns Initial values for the endpoint configuration form.
 */
const buildEndpointInitialValues = (
    endpoint: FlowExtensionEndpointInterface
): EndpointConfigFormPropertyInterface => {
    const authProperties: Record<string, string> = endpoint?.authentication?.properties ?? {};
    const authenticationType: AuthenticationType =
        (endpoint?.authentication?.type as AuthenticationType) ?? AuthenticationType.NONE;

    const values: EndpointConfigFormPropertyInterface = {
        allowedHeaders: endpoint?.allowedHeaders ?? [],
        authenticationType,
        endpointUri: endpoint?.uri ?? ""
    };

    // Pre-populate the non-secret auth fields so they round-trip on edit. Secrets (password, access
    // token, client secret, API key value) are never returned by the backend and must be re-entered
    // when changing authentication.
    switch (authenticationType) {
        case AuthenticationType.BASIC:
            values.usernameAuthProperty = authProperties?.username;

            break;
        case AuthenticationType.API_KEY:
            values.headerAuthProperty = authProperties?.header;

            break;
        case AuthenticationType.CLIENT_CREDENTIAL:
            values.clientIdAuthProperty = authProperties?.clientId;
            values.tokenEndpointAuthProperty = authProperties?.tokenEndpoint;
            values.scopesAuthProperty = authProperties?.scopes;

            break;
        default:
            break;
    }

    return values;
};

/**
 * Endpoint configuration tab of the Flow Extension edit page.
 *
 * @param props - Props injected to the component.
 * @returns Flow Extension endpoint settings component.
 */
const FlowExtensionEndpointSettings: FunctionComponent<FlowExtensionEndpointSettingsPropsInterface> = ({
    flowExtension,
    isLoading,
    isReadOnly,
    mutateFlowExtension,
    ["data-componentid"]: componentId = "flow-extension-endpoint-settings"
}: FlowExtensionEndpointSettingsPropsInterface): ReactElement => {

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ endpointAuthType, setEndpointAuthType ] = useState<AuthenticationType>(
        (flowExtension?.endpoint?.authentication?.type as AuthenticationType) ?? AuthenticationType.NONE
    );
    const [ isAuthenticationUpdateFormState, setIsAuthenticationUpdateFormState ] = useState<boolean>(false);

    // The user staged a certificate in the add-certificate form (entered but not yet extracted). Gates
    // the two-phase submit: extract the staged cert first, then submit. The staged value itself and the
    // "modified" gate live in form state (see FlowExtensionEndpointFormValues).
    const [ userHasStagedCert, setUserHasStagedCert ] = useState<boolean>(false);
    const [ triggerCertUpload, setTriggerCertUpload ] = useTrigger();

    // Memoized so the reference is stable across renders. ActionEndpointConfigForm resets its
    // authentication state in a useEffect keyed on initialValues — a fresh object each render would
    // continually revert the auth-type selection.
    const initialValues: EndpointConfigFormPropertyInterface = useMemo(
        (): EndpointConfigFormPropertyInterface => buildEndpointInitialValues(flowExtension?.endpoint),
        [ flowExtension ]
    );

    const resolveAuthProperties = (values: EndpointConfigFormPropertyInterface): Record<string, string> => {
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

    const validateForm = (
        values: EndpointConfigFormPropertyInterface
    ): Partial<EndpointConfigFormPropertyInterface> =>
        validateActionEndpointFields(values, {
            authenticationType: endpointAuthType,
            isAuthenticationUpdateFormState
        });

    const handleSubmit = (
        values: FlowExtensionEndpointFormValues,
        form: FormApi
    ): void => {
        const changedFields: Record<string, boolean> = form.getState().dirtyFields;
        const isEndpointChanged: boolean = isAuthenticationUpdateFormState
            || Boolean(changedFields?.endpointUri)
            || Boolean(changedFields?.allowedHeaders);

        const body: FlowExtensionUpdateRequestInterface = {};

        if (isEndpointChanged) {
            body.endpoint = {
                ...(changedFields?.allowedHeaders && { allowedHeaders: values.allowedHeaders }),
                ...(isAuthenticationUpdateFormState && {
                    authentication: {
                        properties: resolveAuthProperties(values),
                        type: endpointAuthType
                    }
                }),
                ...(changedFields?.endpointUri && { uri: values.endpointUri })
            };
        }

        // Include the encryption update only when the certificate was explicitly changed (staged or
        // cleared). `certificateModified` is carried in form state, so this reads a fresh value even when
        // the submit is resumed synchronously from the certificate-extraction callback.
        if (values.certificateModified) {
            body.encryption = { certificate: values.encodedCertificate || "" };
        }

        // Nothing changed — skip the API call.
        if (!body.endpoint && !body.encryption) {
            return;
        }

        setIsSubmitting(true);
        updateFlowExtension(flowExtension.id, body)
            .then((): void => {
                dispatch(addAlert({
                    description: t("flowExtension:notifications.updateSuccess.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("flowExtension:notifications.updateSuccess.message")
                }));
                setIsAuthenticationUpdateFormState(false);
                // Reset the modified gate so a subsequent unrelated update doesn't re-send `encryption`.
                // The staged certificate value is intentionally kept so the "configured" alert persists.
                form.change("certificateModified", false);
                setUserHasStagedCert(false);
                mutateFlowExtension();
            })
            .catch((): void => {
                dispatch(addAlert({
                    description: t("flowExtension:notifications.updateError.description"),
                    level: AlertLevels.ERROR,
                    message: t("flowExtension:notifications.updateError.message")
                }));
            })
            .finally((): void => setIsSubmitting(false));
    };

    if (isLoading) {
        return <ContentLoader />;
    }

    return (
        <EmphasizedSegment padded="very">
            <FinalForm
                initialValues={ initialValues }
                validate={ validateForm }
                onSubmit={ (
                    values: FlowExtensionEndpointFormValues,
                    form: FormApi
                ): void => handleSubmit(values, form) }
                render={ ({ handleSubmit, form, values }: FormRenderProps): ReactElement => {
                    const stagedCertificate: string | undefined = values.encodedCertificate;
                    const hasCertificate: boolean = stagedCertificate === undefined
                        ? Boolean(flowExtension?.encryption)
                        : stagedCertificate !== "";

                    const handleCertificateSubmit = (value: string): void => {
                        if (value) {
                            form.change("encodedCertificate", value);
                            form.change("certificateModified", true);
                        }
                        handleSubmit();
                    };

                    const handleClearCertificate = (): void => {
                        form.change("encodedCertificate", "");
                        form.change("certificateModified", true);
                    };

                    return (
                        <form onSubmit={ handleSubmit } className="form-container with-max-width">
                            <Box sx={ { "& .secondary-button": { mt: 2 } } }>
                                <ActionEndpointConfigForm
                                    initialValues={ initialValues }
                                    isCreateFormState={ false }
                                    isReadOnly={ isReadOnly }
                                    showHeadersAndParams={ false }
                                    authenticationTypes={ FlowExtensionConstants.FLOW_EXTENSION_AUTH_TYPES }
                                    onAuthenticationTypeChange={
                                        (updatedValue: AuthenticationType, change: boolean): void => {
                                            setEndpointAuthType(updatedValue);
                                            setIsAuthenticationUpdateFormState(change);
                                        }
                                    }
                                    data-componentid={ `${componentId}-endpoint-config-form` }
                                />
                            </Box>
                            <Divider sx={ { my: 3 } } />
                            <Heading as="h5">
                                { t("flowExtension:createWizard.steps.endpointConfig.certificate.title") }
                            </Heading>
                            <Typography variant="body2" color="text.secondary" sx={ { mb: 2 } }>
                                { t("flowExtension:createWizard.steps.endpointConfig.certificate.hint") }
                            </Typography>
                            { hasCertificate && (
                                <Alert
                                    severity="success"
                                    sx={ { alignItems: "center", mb: 2 } }
                                    action={ (
                                        <LinkButton
                                            onClick={ handleClearCertificate }
                                            data-componentid={ `${componentId}-clear-certificate` }
                                        >
                                            { t("common:clear") }
                                        </LinkButton>
                                    ) }
                                    data-componentid={ `${componentId}-certificate-status` }
                                >
                                    <Trans
                                        i18nKey={ "flowExtension:createWizard.steps.endpointConfig" +
                                        ".certificate.uploaded" }
                                    >
                                    Certificate configured. Clear it to upload a different certificate.
                                    </Trans>
                                </Alert>
                            ) }
                            { !hasCertificate && (
                                <AddCertificateFormComponent
                                    triggerCertificateUpload={ triggerCertUpload }
                                    onSubmit={ handleCertificateSubmit }
                                    setShowFinishButton={ setUserHasStagedCert }
                                    data-componentid={ `${componentId}-certificate-upload` }
                                />
                            ) }
                            <Button
                                size="medium"
                                variant="contained"
                                onClick={ (): void => {
                                    if (userHasStagedCert) {
                                    // Two-phase: extract the staged cert first, then submit.
                                        setTriggerCertUpload();
                                    } else {
                                        handleSubmit();
                                    }
                                } }
                                sx={ { marginTop: 3.75 } }
                                data-componentid={ `${componentId}-update-button` }
                                loading={ isSubmitting }
                                disabled={ isReadOnly || isSubmitting }
                            >
                                { t("common:update") }
                            </Button>
                        </form>
                    );
                } }
            />
        </EmphasizedSegment>
    );
};

export default FlowExtensionEndpointSettings;
