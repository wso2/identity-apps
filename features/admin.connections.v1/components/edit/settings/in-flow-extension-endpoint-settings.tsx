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
import updateAction from "@wso2is/admin.actions.v1/api/update-action";
import {
    AuthenticationType,
    EndpointConfigFormPropertyInterface,
    InFlowExtensionActionResponseInterface,
    InFlowExtensionActionUpdateInterface
} from "@wso2is/admin.actions.v1/models/actions";
import { validateActionEndpointFields } from "@wso2is/admin.actions.v1/util/form-field-util";
import { AddCertificateFormComponent } from "@wso2is/admin.core.v1/components/add-certificate-form";
import { AlertLevels, HttpErrorResponseDataInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { FinalForm, FormRenderProps } from "@wso2is/form";
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

const ACTION_TYPE: string = "inFlowExtension";

export interface InFlowExtensionEndpointSettingsPropsInterface extends IdentifiableComponentInterface {
    "data-componentid"?: string;
    action: InFlowExtensionActionResponseInterface;
    isLoading: boolean;
    isReadOnly: boolean;
    onUpdate: () => void;
    loader: () => ReactElement;
}

export const InFlowExtensionEndpointSettings: FunctionComponent<InFlowExtensionEndpointSettingsPropsInterface> = ({
    action,
    isLoading,
    isReadOnly,
    onUpdate,
    loader: Loader,
    ["data-componentid"]: componentId = "in-flow-extension-endpoint-settings"
}: InFlowExtensionEndpointSettingsPropsInterface): ReactElement => {

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const [ initialValues, setInitialValues ] = useState<EndpointConfigFormPropertyInterface>(null);
    const [ endpointAuthenticationType, setEndpointAuthenticationType ] = useState<AuthenticationType>(null);
    const [ isEndpointAuthenticationUpdated, setIsEndpointAuthenticationUpdated ] = useState<boolean>(false);

    // Certificate state
    const [ certificatePEM, setCertificatePEM ] = useState<string>("");
    const [ hasCertificate, setHasCertificate ] = useState<boolean>(false);
    const [ isCertificateModified, setIsCertificateModified ] = useState<boolean>(false);
    const [ triggerCertUpload, setTriggerCertUpload ] = useTrigger();
    const [ triggerCertSubmit, setTriggerCertSubmit ] = useTrigger();

    // Deferred submit — waits for cert extraction before submitting.
    const pendingSubmit: MutableRefObject<boolean> = useRef<boolean>(false);
    const formHandleSubmitRef: MutableRefObject<(() => void) | null> = useRef<(() => void) | null>(null);

    // Refs that mirror cert state so handleSubmit never reads a stale closure.
    const isCertificateModifiedRef: MutableRefObject<boolean> = useRef<boolean>(false);
    const certificatePEMRef: MutableRefObject<string> = useRef<string>("");

    useEffect(() => {
        if (action) {
            setInitialValues({
                authenticationType: action.endpoint?.authentication?.type,
                endpointUri: action.endpoint?.uri
            });
            setHasCertificate(!!action.encryption?.certificate);
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
        const updateBody: InFlowExtensionActionUpdateInterface = {};

        const isUriChanged: boolean = values.endpointUri !== action.endpoint?.uri;

        // Only include endpoint in update when URI changed or auth was explicitly updated.
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
                case AuthenticationType.NONE:
                    break;
                default:
                    break;
            }

            updateBody.endpoint = {
                authentication: {
                    properties: authProperties,
                    type: values.authenticationType as unknown as AuthenticationType
                },
                uri: values.endpointUri
            };
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

        updateAction<InFlowExtensionActionUpdateInterface>(ACTION_TYPE, action.id, updateBody)
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
        setCertificatePEM(value);
        setHasCertificate(!!value);
        setIsCertificateModified(true);
        // Keep refs in sync so handleSubmit never reads a stale closure value.
        certificatePEMRef.current = value;
        isCertificateModifiedRef.current = true;

        // If a form submission was deferred waiting for cert extraction, trigger it now.
        if (pendingSubmit.current) {
            pendingSubmit.current = false;
            // Refs are already updated above, so formHandleSubmit will see the new values.
            setTimeout(() => formHandleSubmitRef.current?.(), 0);
        }
    };

    if (isLoading || !action) {
        return <Loader />;
    }

    return (
        <Box className="in-flow-extension-endpoint-settings-tab">
            <FinalForm
                onSubmit={ handleSubmit }
                initialValues={ initialValues }
                validate={ validateForm }
                render={ ({ handleSubmit: formHandleSubmit }: FormRenderProps) => {
                    // Store reference for deferred cert-upload submissions.
                    formHandleSubmitRef.current = formHandleSubmit;

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
                                { t("inFlowExtension:createWizard.steps.endpointConfig.certificate.title") }
                            </Heading>
                            <Typography variant="body2" color="text.secondary" sx={ { mb: 2 } }>
                                { t("inFlowExtension:createWizard.steps.endpointConfig.certificate.hint") }
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
                                        i18nKey={ "inFlowExtension:createWizard.steps.endpointConfig" +
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
                                data-componentid={ `${componentId}-certificate-upload` }
                            />
                            { !isReadOnly && (
                                <Button
                                    size="medium"
                                    variant="contained"
                                    onClick={ () => {
                                        if (isCertificateModified) {
                                            // Certificate was already extracted; submit directly.
                                            formHandleSubmit();
                                        } else {
                                            // Trigger cert extraction; defer form submission
                                            // until handleCertificateSubmit fires.
                                            setTriggerCertUpload();
                                            pendingSubmit.current = true;
                                            // Fallback timeout in case no cert is staged.
                                            setTimeout(() => {
                                                if (pendingSubmit.current) {
                                                    pendingSubmit.current = false;
                                                    formHandleSubmit();
                                                }
                                            }, 300);
                                        }
                                    } }
                                    sx={ { mt: 4 } }
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
