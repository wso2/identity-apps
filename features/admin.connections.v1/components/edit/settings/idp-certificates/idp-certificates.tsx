/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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
import FormControl from "@oxygen-ui/react/FormControl";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Grid from "@oxygen-ui/react/Grid";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import { Show } from "@wso2is/access-control";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { ConfigReducerStateInterface } from "@wso2is/admin.core.v1/models/reducer-state";
import { AppState } from "@wso2is/admin.core.v1/store";
import { commonConfig } from "@wso2is/admin.extensions.v1/configs";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { URLUtils } from "@wso2is/core/utils";
import { Field, Form } from "@wso2is/form";
import {
    CertFileStrategy,
    Code,
    EmphasizedSegment,
    Heading,
    Hint,
    Message,
    PrimaryButton
} from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { ChangeEvent, FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Icon, Segment } from "semantic-ui-react";
import { AddIdpCertificateModal } from "./add-idp-certificate-modal";
import { EmptyCertificatesPlaceholder } from "./empty-certificates-placeholder";
import { IdpCertificatesList } from "./idp-cetificates-list";
import { updateIDPCertificate } from "../../../../api/connections";
import { CommonAuthenticatorConstants } from "../../../../constants/common-authenticator-constants";
import { ConnectionUIConstants } from "../../../../constants/connection-ui-constants";
import { CertificatePatchRequestInterface, ConnectionInterface } from "../../../../models/connection";

/**
 * Props interface of {@link IdpCertificates}
 */
export interface IdpCertificatesV2Props extends IdentifiableComponentInterface {
    editingIDP: ConnectionInterface;
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
     * Type of the template.
     */
    templateType?: string;
}

export type CertificateConfigurationMode = "jwks" | "certificates";

const FORM_ID: string = "idp-certificate-jwks-input-form";
const JWKS: string = "jwks";

/**
 * This is the certificates component for IdPs.
 *
 * This component's UI looks like below. Wrapping and layout should be
 * handled by the parent component. This is just a example of this
 * component.
 *
 *  +======================================================================+
 *  |                                                                      |
 *  |   (?) Below is the {@link RadioGroup} component. When user clicks      |
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
        [ "data-componentid" ]: testId = "idp-certificates",
        editingIDP,
        onUpdate,
        isReadOnly,
        isJWKSEnabled = true,
        isPEMEnabled = true,
        templateType
    } = props;

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const featureConfig : FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

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

    const onSelectionChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedConfigurationMode((event.target as HTMLInputElement).value as CertificateConfigurationMode);
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

        const operation: string = editingIDP?.certificate?.jwksUri
            ? jwksValue ? "REPLACE" : "REMOVE"
            : "ADD";

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
                description: t("authenticationProvider:notifications." +
                    "updateIDPCertificate.success" +
                    ".description"),
                level: AlertLevels.SUCCESS,
                message: t("authenticationProvider:notifications." +
                    "updateIDPCertificate.success.message")
            }));
            onUpdate(editingIDP.id);
        };

        const ifTheresAnyError = (error: IdentityAppsApiException) => {
            if (error.response && error.response.data && error.response.data.description) {
                dispatch(addAlert({
                    description: error.response.data.description,
                    level: AlertLevels.ERROR,
                    message: t("authenticationProvider:notifications." +
                        "updateIDPCertificate.error.message")
                }));

                return;
            }
            dispatch(addAlert({
                description: t("authenticationProvider:notifications." +
                    "updateIDPCertificate.genericError" +
                    ".description"),
                level: AlertLevels.ERROR,
                message: t("authenticationProvider:notifications." +
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
                hint={ (
                    <>
                        The JWKS (JSON Web Key Set) endpoint must return a JSON object that represents a set of JWKs.
                        The JSON object MUST have a <Code>keys</Code> member, with its value being an array of
                        JWKs.
                    </>
                ) }
                label="JWKS Endpoint URL"
                ariaLabel="JWKS Endpoint URL"
                inputType="url"
                width={ 16 }
                validation={ (value: string) => {
                    if (value && !FormValidation.url(value)) {
                        setIsJwksValueValid(false);

                        return t("applications:forms.inboundSAML" +
                            ".fields.metaURL.validations.invalid");
                    }
                    if (commonConfig?.blockLoopBackCalls && URLUtils.isLoopBackCall(value)) {
                        setIsJwksValueValid(false);

                        return t("idp:forms.common.internetResolvableErrorMessage");
                    }
                    setIsJwksValueValid(true);

                    return undefined;
                } }
                listen={ (value: string) => setJwksValue(value) }
                placeholder="https://{ oauth-provider-url }/oauth/jwks"
                maxLength={ ConnectionUIConstants.JWKS_URL_LENGTH.max }
                minLength={ ConnectionUIConstants.JWKS_URL_LENGTH.min }
                name="jwks_endpoint"
                disabled={ isReadOnly }
            />

            <Show when={ featureConfig?.identityProviders?.scopes?.update }>
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
        <>
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
                                <Show when={ featureConfig?.identityProviders?.scopes?.update }>
                                    <PrimaryButton
                                        floated="right"
                                        onClick={ openAddCertificatesWizard }
                                        data-testid={ `${ testId }-add-certificate-button` }
                                    >
                                        <Icon name="add" />
                                        { t("authenticationProvider:" +
                                            "buttons.addCertificate") }
                                    </PrimaryButton>
                                </Show>
                            </Grid>
                            <Grid xs={ 12 }>
                                <IdpCertificatesList
                                    templateType={ templateType }
                                    isReadOnly={ isReadOnly }
                                    currentlyEditingIdP={ editingIDP }
                                    refreshIdP={ onUpdate }
                                />
                            </Grid>
                        </Grid>
                    </Segment>
                )
            }
        </>
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
    const shouldShowNoCertificatesAlert = (): boolean => templateType ===
        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.TRUSTED_TOKEN_ISSUER && !editingIDP?.certificate;

    /**
     * Checks if the info box in the certificates section should be shown.
     *
     * @returns `true` if the IDP is not a trusted token issuer, `false` otherwise.
     */
    const shouldShowCertificatesInfo = (): boolean => templateType !==
        CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.TRUSTED_TOKEN_ISSUER;

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
                                { t("authenticationProvider:forms.certificateSection." +
                                    "noCertificateAlert", { productName: config.ui.productName } ) }
                            </Alert>
                        </Grid>
                    )
                }
                <Grid md={ 12 } lg={ 6 }>
                    <Heading as="h4">
                        { t("console:develop.features.authenticationProvider.forms.certificateSection.heading") }
                    </Heading>
                    <Heading subHeading as="h6" color="grey">
                        { t("console:develop.features.authenticationProvider.forms.certificateSection.description") }
                    </Heading>
                </Grid>
                { shouldShowCertificatesInfo() && (
                    <Grid md={ 12 } lg={ 6 }>
                        <Message
                            data-componentid={ `${ testId }-info-messege` }
                            type="info"
                            content={ t("console:develop.features.authenticationProvider.forms." +
                                "certificateSection.info") }
                        />
                    </Grid>
                ) }
                { isJWKSEnabled && isPEMEnabled && (
                    <Grid md={ 12 } lg={ 6 }>
                        <FormControl>
                            <RadioGroup
                                row
                                name="certificate-type"
                                onChange={ onSelectionChange }
                                data-testid={ `${ testId }-radio-group` }
                                value={ selectedConfigurationMode }
                            >
                                <FormControlLabel
                                    control={ <Radio checked={ selectedConfigurationMode === "jwks" } /> }
                                    label={
                                        t("console:develop.features.authenticationProvider.forms." +
                                        "certificateSection.certificateEditSwitch.jwks")
                                    }
                                    value="jwks"
                                />
                                <FormControlLabel
                                    control={ <Radio checked={ selectedConfigurationMode === "certificates" } /> }
                                    label={
                                        t("console:develop.features.authenticationProvider.forms." +
                                        "certificateSection.certificateEditSwitch.pem")
                                    }
                                    value="certificates"
                                />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                ) }
                <Grid md={ 12 } lg={ 6 }>
                    { selectedConfigurationMode === JWKS
                        ? jwksInputForm
                        : (
                            <>
                                { certificateForm }
                                <Hint>
                                    Upload certificate(s) for this Identity Provider. You can include
                                    multiple certificates in case if there&apos;s any certificate rotations.
                                    You can upload { supportedMimes() } types of certificates.
                                </Hint>
                            </>
                        )
                    }
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
