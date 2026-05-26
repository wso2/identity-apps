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
import Button from "@oxygen-ui/react/Button";
import Divider from "@oxygen-ui/react/Divider";
import Typography from "@oxygen-ui/react/Typography";
import ActionEndpointConfigForm from "@wso2is/admin.actions.v1/components/action-endpoint-config-form";
import updateFlowExtension from "@wso2is/admin.flow-builder-core.v1/api/update-flow-extension";
import {
    FlowExtensionResponseInterface,
    FlowExtensionUpdateRequestInterface
} from "@wso2is/admin.flow-builder-core.v1/models/flow-extension";
import {
    AuthenticationType,
    EndpointConfigFormPropertyInterface
} from "@wso2is/admin.actions.v1/models/actions";
import { validateActionEndpointFields } from "@wso2is/admin.actions.v1/util/form-field-util";
import { AddCertificateFormComponent } from "@wso2is/admin.core.v1/components/add-certificate-form";
import { AlertLevels, HttpErrorResponseDataInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FormRenderProps } from "@wso2is/forms";
import { useTrigger } from "@wso2is/forms/legacy";
import { EmphasizedSegment, Heading, LinkButton } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import {
    AuthenticationPropertiesInterface,
    EndpointAuthenticationType
} from "../../../models/connection";
import { ConnectionUIConstants } from "../../../constants/connection-ui-constants";

const areStringSetsEqual = (a: string[] | undefined, b: string[] | undefined): boolean => {
    const setA: Set<string> = new Set(a ?? []);
    const setB: Set<string> = new Set(b ?? []);

    if (setA.size !== setB.size) {
        return false;
    }
    for (const value of setA) {
        if (!setB.has(value)) {
            return false;
        }
    }

    return true;
};

interface FlowExtensionEndpointSettingsPropsInterface extends IdentifiableComponentInterface {
    "data-componentid"?: string;
    action: FlowExtensionResponseInterface;
    isLoading: boolean;
    isReadOnly: boolean;
    onUpdate: () => void;
    loader: () => ReactElement;
}

export const FlowExtensionEndpointSettings: FunctionComponent<FlowExtensionEndpointSettingsPropsInterface> = ({
    action,
    isLoading,
    isReadOnly,
    onUpdate,
    loader: Loader,
    ["data-componentid"]: componentId = "flow-extension-endpoint-settings"
}: FlowExtensionEndpointSettingsPropsInterface): ReactElement => {

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const [ initialValues, setInitialValues ] = useState<EndpointConfigFormPropertyInterface>(null);
    const [ endpointAuthenticationType, setEndpointAuthenticationType ] = useState<AuthenticationType>(null);
    const [ isEndpointAuthenticationUpdated, setIsEndpointAuthenticationUpdated ] = useState<boolean>(false);

    // Certificate state
    const [ certificatePEM, setCertificatePEM ] = useState<string>("");
    const [ hasCertificate, setHasCertificate ] = useState<boolean>(false);
    const [ isCertificateModified, setIsCertificateModified ] = useState<boolean>(false);
    const [ userHasStagedCert, setUserHasStagedCert ] = useState<boolean>(false);
    const [ triggerCertUpload, setTriggerCertUpload ] = useTrigger();
    const [ triggerCertSubmit, setTriggerCertSubmit ] = useTrigger();

    // Refs that mirror cert state so handleSubmit never reads a stale closure.
    const isCertificateModifiedRef: MutableRefObject<boolean> = useRef<boolean>(false);
    const certificatePEMRef: MutableRefObject<string> = useRef<string>("");
    // Stores the FinalForm handleSubmit so the async cert callback can invoke it.
    const formHandleSubmitRef: MutableRefObject<(() => void) | null> = useRef<(() => void) | null>(null);

    useEffect(() => {
        if (action) {
            setInitialValues({
                allowedHeaders: action.endpoint?.allowedHeaders ?? [],
                authenticationType: action.endpoint?.authentication?.type,
                endpointUri: action.endpoint?.uri
            });
            // Backend does not return the certificate value (security); presence of the
            // `encryption` object indicates a certificate is configured.
            setHasCertificate(!!action.encryption);
        }
    }, [ action ]);

    const validateForm = (
        values: EndpointConfigFormPropertyInterface
    ): Partial<EndpointConfigFormPropertyInterface> => {

        return validateActionEndpointFields(values, {
            authenticationType: endpointAuthenticationType,
            isAuthenticationUpdateFormState: isEndpointAuthenticationUpdated
        });
    };

    const handleSubmit = (values: EndpointConfigFormPropertyInterface): void => {
        const updateBody: FlowExtensionUpdateRequestInterface = {};

        const isUriChanged: boolean = values.endpointUri !== action.endpoint?.uri;
        const isHeadersChanged: boolean = !areStringSetsEqual(
            values.allowedHeaders, action.endpoint?.allowedHeaders);

        // Only include endpoint in update when URI, auth, or headers changed.
        if (isUriChanged || isEndpointAuthenticationUpdated || isHeadersChanged) {
            const endpointPatch: Partial<FlowExtensionUpdateRequestInterface["endpoint"]> = {};

            if (isUriChanged || isEndpointAuthenticationUpdated) {
                const authProperties: Partial<AuthenticationPropertiesInterface> = {};

                switch (values.authenticationType) {
                    case AuthenticationType.BASIC:
                        authProperties.username = values.usernameAuthProperty;
                        authProperties.password = values.passwordAuthProperty;

                        break;
                    case AuthenticationType.BEARER:
                        authProperties.accessToken = values.accessTokenAuthProperty;

                        break;
                    case AuthenticationType.API_KEY:
                        authProperties.header = values.headerAuthProperty;
                        authProperties.value = values.valueAuthProperty;

                        break;
                    case AuthenticationType.CLIENT_CREDENTIAL:
                        authProperties.clientId = values.clientIdAuthProperty;
                        authProperties.clientSecret = values.clientSecretAuthProperty;
                        authProperties.tokenEndpoint = values.tokenEndpointAuthProperty;
                        if (values.scopesAuthProperty) {
                            authProperties.scopes = values.scopesAuthProperty;
                        }

                        break;
                    case AuthenticationType.NONE:
                        break;
                    default:
                        break;
                }

                endpointPatch.authentication = {
                    properties: authProperties,
                    type: values.authenticationType as unknown as AuthenticationType
                };
                endpointPatch.uri = values.endpointUri;
            }

            if (isHeadersChanged) {
                endpointPatch.allowedHeaders = values.allowedHeaders ?? [];
            }

            updateBody.endpoint = endpointPatch;
        }

        // Include encryption update if certificate was explicitly changed (including clearing).
        // Read from refs to avoid stale closure when called from deferred setTimeout.
        if (isCertificateModifiedRef.current) {
            updateBody.encryption = { certificate: certificatePEMRef.current || "" };
        }

        // Nothing changed – skip the API call.
        if (!updateBody.endpoint && !updateBody.encryption) {
            return;
        }

        updateFlowExtension(action.id, updateBody)
            .then(() => {
                dispatch(addAlert({
                    description: t("authenticationProvider:notifications.updateIDP.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("authenticationProvider:notifications.updateIDP.success.message")
                }));
                onUpdate();
            })
            .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
                dispatch(addAlert({
                    description: error?.response?.data?.description
                        ?? t("authenticationProvider:notifications.updateIDP.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("authenticationProvider:notifications.updateIDP.genericError.message")
                }));
            });
    };

    const handleCertificateSubmit = (value: string): void => {
        if (value) {
            setCertificatePEM(value);
            setHasCertificate(true);
            setIsCertificateModified(true);
            certificatePEMRef.current = value;
            isCertificateModifiedRef.current = true;
        }
        // Proceed with the form submission now that cert data is extracted.
        formHandleSubmitRef.current?.();
    };

    if (isLoading || !action) {
        return <Loader />;
    }

    return (
        <Box className="flow-extension-endpoint-settings-tab">
            <FinalForm
                onSubmit={ handleSubmit }
                initialValues={ initialValues }
                validate={ validateForm }
                render={ ({ handleSubmit: formHandleSubmit }: FormRenderProps) => {

                    return (
                    <EmphasizedSegment
                        className="endpoint-settings-container"
                        padded="very"
                        data-componentid={ `${componentId}-section` }
                    >
                        <div className="form-container with-max-width">
                            <ActionEndpointConfigForm
                                initialValues={ initialValues }
                                isCreateFormState={ false }
                                isReadOnly={ isReadOnly }
                                showHeadersAndParams={ true }
                                showAllowedParameters={ false }
                                authenticationTypes={ ConnectionUIConstants.FLOW_EXTENSION_AUTH_TYPES }
                                onAuthenticationTypeChange={ (
                                    authenticationType: AuthenticationType,
                                    isAuthenticationUpdated: boolean
                                ) => {
                                    setEndpointAuthenticationType(authenticationType);
                                    setIsEndpointAuthenticationUpdated(isAuthenticationUpdated);
                                } }
                            />
                            <Divider sx={ { my: 3 } } />
                            <Heading as="h5">
                                { t("flowExtension:createWizard.steps.endpointConfig.certificate.title") }
                            </Heading>
                            <Typography variant="body2" color="text.secondary" sx={ { mb: 2 } }>
                                { t("flowExtension:createWizard.steps.endpointConfig.certificate.hint") }
                            </Typography>
                            { (hasCertificate || certificatePEM) && (
                                <Alert
                                    severity="success"
                                    sx={ { alignItems: "center", mb: 2 } }
                                    action={
                                        <LinkButton
                                            onClick={ () => {
                                                setCertificatePEM("");
                                                setHasCertificate(false);
                                                setIsCertificateModified(true);
                                                certificatePEMRef.current = "";
                                                isCertificateModifiedRef.current = true;
                                            } }
                                            data-componentid={ `${componentId}-clear-certificate` }
                                        >
                                            Clear
                                        </LinkButton>
                                    }
                                    data-componentid={ `${componentId}-certificate-status` }
                                >
                                    <Trans
                                        i18nKey={ "flowExtension:createWizard.steps.endpointConfig" +
                                            ".certificate.uploaded" }
                                    >
                                        Certificate configured. You can re-upload to replace it or clear it.
                                    </Trans>
                                </Alert>
                            ) }
                            <AddCertificateFormComponent
                                triggerCertificateUpload={ triggerCertUpload }
                                triggerSubmit={ triggerCertSubmit }
                                onSubmit={ handleCertificateSubmit }
                                setShowFinishButton={ setUserHasStagedCert }
                                data-componentid={ `${componentId}-certificate-upload` }
                            />
                            { !isReadOnly && (
                                <Button
                                    size="medium"
                                    variant="contained"
                                    onClick={ () => {
                                        formHandleSubmitRef.current = formHandleSubmit;
                                        if (userHasStagedCert) {
                                            // Two-phase: extract cert first, then submit.
                                            setTriggerCertUpload();
                                        } else {
                                            formHandleSubmit();
                                        }
                                    } }
                                    sx={ { mt: 4, display: "block" } }
                                    data-componentid={ `${componentId}-update-button` }
                                >
                                    { t("actions:buttons.update") }
                                </Button>
                            ) }
                        </div>
                    </EmphasizedSegment>
                    );
                } }
            />
        </Box>
    );
};
