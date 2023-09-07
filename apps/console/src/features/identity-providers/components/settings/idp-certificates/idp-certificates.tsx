/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import Grid from "@oxygen-ui/react/Grid";
import { AccessControlConstants, Show } from "@wso2is/access-control";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { URLUtils } from "@wso2is/core/utils";
import { Field, Form } from "@wso2is/form";
import {
    CertFileStrategy,
    Code,
    EmphasizedSegment,
    Hint,
    PrimaryButton,
    Switcher,
    SwitcherOptionProps
} from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Icon, Segment } from "semantic-ui-react";
import { AddIdpCertificateModal } from "./add-idp-certificate-modal";
import { EmptyCertificatesPlaceholder } from "./empty-certificates-placeholder";
import { IdpCertificatesList } from "./idp-cetificates-list";
import { commonConfig } from "../../../../../extensions/configs";
import { AppState, ConfigReducerStateInterface } from "../../../../core";
import { updateIDPCertificate } from "../../../api";
import { IdentityProviderConstants } from "../../../constants";
import { CertificatePatchRequestInterface, IdentityProviderInterface } from "../../../models";

/**
 * Props interface of {@link IdpCertificates}
 */
export interface IdpCertificatesV2Props extends IdentifiableComponentInterface {
    editingIDP: IdentityProviderInterface;
    onUpdate: (id: string) => void;
    isReadOnly: boolean;
    /**
     * Is JWKS URL configuring enabled?
     */
    isJWKSEnabled?: boolean;
    /**
     * Is Cert uploading enabled?
     */
    isPEMEnabled?: boolean;
    /**
     * Is the IDP a trusted token issuer
     */
    isTrustedTokenIssuer?: boolean;
}

export type CertificateConfigurationMode = "jwks" | "certificates";

const FORM_ID: string = "idp-certificate-jwks-input-form";

/**
 * This is the certificates component for IdPs.
 *
 * This component's UI looks like below. Wrapping and layout should be
 * handled by the parent component. This is just a example of this
 * component.
 *
 *  +======================================================================+
 *  |                                                                      |
 *  |   (?) Below is the {@link Switcher} component. When user clicks      |
 *  |       on one switch it will change the subcomponent input type.      |
 *  |                                                                      |
 *  |   +==============+====================+                              |
 *  |   |   JWKS URL   | Upload Certificate |                              |
 *  |   +==============+====================+                              |
 *  |                                                                      |
 *  |                                                                      |
 *  |   (?) Based on the switcher selection the sub component appearance   |
 *  |       will change. For example: if you select JWKS URL it will       |
 *  |       only render a input field to get the URL.                      |
 *  |                                                                      |
 *  |                                                                      |
 *  |   For JWKS this is the input option:                                 |
 *  |   +=====================================================+            |
 *  |   | https://google.com/oauth2/jwks                      |            |
 *  |   +=====================================================+            |
 *  |                                                                      |
 *  |                                                                      |
 *  |   For "Certificates" this is the upload option.                      |
 *  |                                                                      |
 *  |   (?) Upload option is a modal {@link AddIdpCertificateModal} where  |
 *  |       it will contain the upload logic and everything related to     |
 *  |       certificates. It uses the {@link FilePicker} with -            |
 *  |       {@link CertFileStrategy}. If there's no certificates           |
 *  |       configured it will render {@link EmptyCertificatesPlaceholder} |
 *  |       component.                                                     |
 *  |                                                                      |
 *  |       Tab     Tab                                                    |
 *  |   | Upload | Paste |                                                 |
 *  |   +==============================================================+   |
 *  |   |                                                              |   |
 *  |   |                         Some Icon                          |   |
 *  |   |                                                              |   |
 *  |   |             Drag and drop a certificate file here.           |   |
 *  |   |                                                              |   |
 *  |   |                           - or -                             |   |
 *  |   |                                                              |   |
 *  |   |                       +============+                         |   |
 *  |   |                       |   Upload   |                         |   |
 *  |   |                       +============+                         |   |
 *  |   |                                                              |   |
 *  |   +==============================================================+   |
 *  |                                                                      |
 *  +======================================================================+
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const IdpCertificates: FunctionComponent<IdpCertificatesV2Props> = (props: IdpCertificatesV2Props)
    : ReactElement => {

    const {
        [ "data-componentid" ]: testId,
        editingIDP,
        onUpdate,
        isReadOnly,
        isJWKSEnabled,
        isPEMEnabled,
        isTrustedTokenIssuer
    } = props;

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    const [ selectedConfigurationMode, setSelectedConfigurationMode ] = useState<CertificateConfigurationMode>();
    const [ addCertificateModalOpen, setAddCertificateModalOpen ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isJwksValueValid, setIsJwksValueValid ] = useState<boolean>(false);
    const [ jwksValue, setJwksValue ] = useState<string>();

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    useEffect(() => {
        setInitialModeOfConfiguration();
    }, []);

    useEffect(() => {
        setInitialModeOfConfiguration();
    }, [ editingIDP ]);

    const setInitialModeOfConfiguration = () => {
        if (isJWKSEnabled) {
            if (editingIDP?.certificate?.certificates?.length > 0) {
                setSelectedConfigurationMode("certificates");
            } else {
                // Even if editingIDP?.certificate?.jwksUri?.trim() empty or not
                // if above is not configured it's always JWKS.
                setJwksValue(editingIDP?.certificate?.jwksUri ?? "");
                setSelectedConfigurationMode("jwks");
            }
        } else {
            // If JWKS is disabled for this IdP, then no questions asked
            // the only thing we show is certificates.
            setSelectedConfigurationMode("certificates");
        }
    };

    const onSelectionChange = ({ value }: SwitcherOptionProps): void => {
        setSelectedConfigurationMode(value as CertificateConfigurationMode);
    };

    const openAddCertificatesWizard = (): void => {
        setAddCertificateModalOpen(true);
    };

    const closeAddCertificateWizard = (): void => {
        setAddCertificateModalOpen(false);
    };

    /**
     * The following function update the IDP JWKS endpoint.
     * @param values - Form values.
     */
    const onJWKSFormSubmit = (values: Record<string, any>) => {

        const operation: string = editingIDP?.certificate?.jwksUri ? "REPLACE" : "ADD";

        const PATCH_OBJECT: CertificatePatchRequestInterface[] = [ 
            {
                "operation": operation,
                "path": "/certificate/jwksUri",
                "value": values.jwks_endpoint
            } 
        ];

        setIsSubmitting(true);

        const doOnSuccess = () => {
            dispatch(addAlert({
                description: t("console:develop.features.authenticationProvider.notifications." +
                    "updateIDPCertificate.success" +
                    ".description"),
                level: AlertLevels.SUCCESS,
                message: t("console:develop.features.authenticationProvider.notifications." +
                    "updateIDPCertificate.success.message")
            }));
            onUpdate(editingIDP.id);
        };

        const ifTheresAnyError = (error: IdentityAppsApiException) => {
            if (error.response && error.response.data && error.response.data.description) {
                dispatch(addAlert({
                    description: error.response.data.description,
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.authenticationProvider.notifications." +
                        "updateIDPCertificate.error.message")
                }));

                return;
            }
            dispatch(addAlert({
                description: t("console:develop.features.authenticationProvider.notifications." +
                    "updateIDPCertificate.genericError" +
                    ".description"),
                level: AlertLevels.ERROR,
                message: t("console:develop.features.authenticationProvider.notifications." +
                    "updateIDPCertificate.genericError.message")
            }));
        };

        updateIDPCertificate(editingIDP.id, PATCH_OBJECT)
            .then(doOnSuccess)
            .catch(ifTheresAnyError)
            .finally(() => {
                setIsSubmitting(false);
            });

    };

    const jwksInputForm: ReactNode = (
        <Form
            id={ FORM_ID }
            uncontrolledForm={ true }
            initialValues={ { jwks_endpoint: editingIDP?.certificate?.jwksUri } }
            onSubmit={ onJWKSFormSubmit }
        > 
            <Field.Input
                required
                hint={ (
                    <React.Fragment>
                        A JSON Web Key (JWK) Set is a JSON object that represents a set of JWKs. The JSON
                        object MUST have a <Code>keys</Code> member, with its value being an array of
                        JWKs.
                    </React.Fragment>
                ) }
                label="JWKS Endpoint URL"
                ariaLabel="JWKS Endpoint URL"
                inputType="url"
                width={ 16 }
                validation={ (value: string) => {
                    if (!value || !FormValidation.url(value)) {
                        setIsJwksValueValid(false);

                        return t("console:develop.features.applications.forms.inboundSAML" +
                            ".fields.metaURL.validations.invalid");
                    }
                    if (commonConfig?.blockLoopBackCalls && URLUtils.isLoopBackCall(value)) {
                        setIsJwksValueValid(false);

                        return t("console:develop.features.idp.forms.common.internetResolvableErrorMessage");
                    }
                    setIsJwksValueValid(true);

                    return undefined;
                } }
                listen={ (value: string) => setJwksValue(value) }
                placeholder="https://{ oauth-provider-url }/oauth/jwks"
                maxLength={ IdentityProviderConstants.JWKS_URL_MAX_LENGTH }
                minLength={ IdentityProviderConstants.JWKS_URL_MIN_LENGTH }
                name="jwks_endpoint"
            />

            <Show when={ AccessControlConstants.IDP_EDIT }>
                <Field.Button
                    form={ FORM_ID }
                    data-testid={ `${ testId }-save-button` }
                    loading={ isSubmitting }
                    ariaLabel="JWKS Enpoint"
                    name="jwks_enpoint"
                    size="small"
                    buttonType="primary_btn"
                    label={ t("common:update") }
                    disabled={
                        (
                            !jwksValue ||
                            !isJwksValueValid ||
                            jwksValue === editingIDP?.certificate?.jwksUri
                        ) ||
                        isSubmitting
                    }
                />
            </Show>

        </Form>
    );

    const certificateForm: ReactNode = (
        <React.Fragment>
            { !editingIDP?.certificate?.certificates?.length
                ? (
                    <EmptyCertificatesPlaceholder
                        onAddCertificateClicked={ openAddCertificatesWizard }
                    />
                )
                : (
                    <Segment>
                        <Grid direction="column" container spacing={ 2 }>
                            <Grid xs={ 12 }>
                                <Show when={ AccessControlConstants.IDP_EDIT }>
                                    <PrimaryButton
                                        floated="right"
                                        onClick={ openAddCertificatesWizard }
                                        data-testid={ `${ testId }-add-certificate-button` }
                                    >
                                        <Icon name="add" />
                                        { t("console:develop.features.authenticationProvider" +
                                            ".buttons.addCertificate") }
                                    </PrimaryButton>
                                </Show>
                            </Grid>
                            <Grid xs={ 12 }>
                                <IdpCertificatesList
                                    isTrustedTokenIssuer={ isTrustedTokenIssuer }
                                    isReadOnly={ isReadOnly }
                                    currentlyEditingIdP={ editingIDP }
                                    refreshIdP={ onUpdate }
                                />
                            </Grid>
                        </Grid>
                    </Segment>
                )
            }
        </React.Fragment>
    );

    const supportedMimes = () => {
        return CertFileStrategy.DEFAULT_MIMES.map((m: string, i: number) => (
            <span key={ m }>
                <Code>{ m }</Code>
                { (i !== CertFileStrategy.DEFAULT_MIMES.length - 1) && (<>&nbsp;</>) }
            </span>
        ));
    };

    /**
     * Checks if the IDP is a trusted token issuer and has no certificates to display an alert.
     * 
     * @returns `true` if the IDP is a trusted token issuer and has no certificates, `false` otherwise.
     */
    const shouldShowNoCertificatesAlert = (): boolean => isTrustedTokenIssuer && !editingIDP?.certificate;

    if (!isJWKSEnabled && !isPEMEnabled) {
        return null;
    }

    return (
        <EmphasizedSegment padded="very">
            <Grid direction="column" container spacing={ 4 }>
                {
                    shouldShowNoCertificatesAlert() && (
                        <Grid xs={ 12 }>
                            <Alert severity="error">
                                { t("console:develop.features.authenticationProvider.forms.certificateSection." + 
                                    "noCertificateAlert", { productName: config.ui.productName } ) }
                            </Alert>
                        </Grid>
                    )
                }
                <Grid direction="column" container spacing={ 3 } xs={ 12 }>
                    { isJWKSEnabled && isPEMEnabled && (
                        <Grid md={ 12 } lg={ 6 }>
                            <Switcher
                                widths={ "two" }
                                compact
                                data-testid={ `${ testId }-switcher` }
                                selectedValue={ selectedConfigurationMode }
                                onChange={ onSelectionChange }
                                options={ [
                                    {
                                        label: t("console:develop.features.authenticationProvider.forms." + 
                                            "certificateSection.certificateEditSwitch.jwks"),
                                        value: ("jwks" as CertificateConfigurationMode)
                                    },
                                    {
                                        label: t("console:develop.features.authenticationProvider.forms." + 
                                            "certificateSection.certificateEditSwitch.pem"),
                                        value: ("certificates" as CertificateConfigurationMode)
                                    }
                                ] }
                            />
                        </Grid>
                    ) }
                    <Grid md={ 12 } lg={ 6 }>
                        { selectedConfigurationMode === "jwks"
                            ? jwksInputForm
                            : (
                                <React.Fragment>
                                    { certificateForm }
                                    <Hint>
                                        Upload certificate(s) for this Identity Provider. You can include
                                        multiple certificates in case if there&apos;s any certificate rotations.
                                        You can upload { supportedMimes() } types of certificates.
                                    </Hint>
                                </React.Fragment>
                            )
                        }
                    </Grid>
                </Grid>
            </Grid>
            { isPEMEnabled && (
                <AddIdpCertificateModal
                    currentlyEditingIdP={ editingIDP }
                    refreshIdP={ onUpdate }
                    isOpen={ addCertificateModalOpen }
                    onClose={ closeAddCertificateWizard }
                />
            ) }
        </EmphasizedSegment>
    );

};

/**
 * Default props of {@link IdpCertificates}
 */
IdpCertificates.defaultProps = {
    "data-componentid": "idp-certificates",
    isJWKSEnabled: true,
    isPEMEnabled: true
};
