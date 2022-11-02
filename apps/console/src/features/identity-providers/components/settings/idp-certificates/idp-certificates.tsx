/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AccessControlConstants, Show } from "@wso2is/access-control";
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
import { useDispatch } from "react-redux";
import { Divider, Grid, Icon, Segment } from "semantic-ui-react";
import { AddIdpCertificateModal } from "./add-idp-certificate-modal";
import { EmptyCertificatesPlaceholder } from "./empty-certificates-placeholder";
import { IdpCertificatesList } from "./idp-cetificates-list";
import { commonConfig } from "../../../../../extensions/configs";
import { updateIDPCertificate } from "../../../api";
import { IdentityProviderInterface } from "../../../models";

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
export const IdpCertificates: FunctionComponent<IdpCertificatesV2Props> = (props): ReactElement => {

    const {
        [ "data-componentid" ]: testId,
        editingIDP,
        onUpdate,
        isReadOnly,
        isJWKSEnabled,
        isPEMEnabled
    } = props;

    const [ selectedConfigurationMode, setSelectedConfigurationMode ] = useState<CertificateConfigurationMode>();
    const [ addCertificateModalOpen, setAddCertificateModalOpen ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isJwksValueValid, setIsJwksValueValid ] = useState<boolean>(false);
    const [ jwksValue, setJwksValue ] = useState<string>();

    const { t } = useTranslation();
    const dispatch = useDispatch();

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
                setJwksValue(editingIDP?.certificate?.jwksUri ?? EMPTY_STRING);
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

        const operation = editingIDP?.certificate?.jwksUri ? "REPLACE" : "ADD";
        const PATCH_OBJECT = [ {
            "operation": operation,
            "path": "/certificate/jwksUri",
            "value": values.jwks_endpoint
        } ];

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

        const ifTheresAnyError = (error) => {
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
            onSubmit={ onJWKSFormSubmit }>

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
                maxLength={ JWKS_MAX_LENGTH }
                minLength={ JWKS_MIN_LENGTH }
                name="jwks_endpoint"
            />

            <Show when={ AccessControlConstants.IDP_EDIT }>
                <PrimaryButton
                    type="submit"
                    data-testid={ `${ testId }-save-button` }
                    loading={ isSubmitting }
                    disabled={
                        (
                            !jwksValue ||
                            !isJwksValueValid ||
                            jwksValue === editingIDP?.certificate?.jwksUri
                        ) ||
                        isSubmitting
                    }>
                    { t("common:update") }
                </PrimaryButton>
            </Show>

        </Form>
    );

    const certificateForm: ReactNode = (
        <React.Fragment>
            { !editingIDP?.certificate?.certificates?.length
                ? (
                    <EmptyCertificatesPlaceholder
                        onAddCertificateClicked={ openAddCertificatesWizard }/>
                )
                : (
                    <Segment>
                        <Grid>
                            <Grid.Row columns={ 1 }>
                                <Grid.Column width={ 16 }>
                                    <Show when={ AccessControlConstants.IDP_EDIT }>
                                        <PrimaryButton
                                            floated="right"
                                            onClick={ openAddCertificatesWizard }
                                            data-testid={ `${ testId }-add-certificate-button` }>
                                            <Icon name="add"/>
                                            { t("console:develop.features.authenticationProvider" +
                                                ".buttons.addCertificate") }
                                        </PrimaryButton>
                                    </Show>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 1 }>
                                <Grid.Column width={ 16 }>
                                    <IdpCertificatesList
                                        isReadOnly={ isReadOnly }
                                        currentlyEditingIdP={ editingIDP }
                                        refreshIdP={ onUpdate }/>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                )
            }
        </React.Fragment>
    );

    const supportedMimes = () => {
        return CertFileStrategy.DEFAULT_MIMES.map((m, i) => (
            <span key={ m }>
                <Code>{ m }</Code>
                { (i !== CertFileStrategy.DEFAULT_MIMES.length - 1) && (<>&nbsp;</>) }
            </span>
        ));
    };

    if (!isJWKSEnabled && !isPEMEnabled) {
        return null;
    }

    return (
        <EmphasizedSegment padded="very">
            <Grid>
                { isJWKSEnabled && isPEMEnabled && (
                    <Grid.Row columns={ 1 }>
                        <Grid.Column computer={ 8 } mobile={ 16 } widescreen={ 8 } tablet={ 16 }>
                            <React.Fragment>
                                <Switcher
                                    widths={ "two" }
                                    compact
                                    data-testid={ `${ testId }-switcher` }
                                    selectedValue={ selectedConfigurationMode }
                                    onChange={ onSelectionChange }
                                    options={ [
                                        {
                                            label: "Use JWKS Endpoint",
                                            value: ("jwks" as CertificateConfigurationMode)
                                        },
                                        {
                                            label: "Provide Certificates",
                                            value: ("certificates" as CertificateConfigurationMode)
                                        }
                                    ] }
                                />
                                <Divider hidden/>
                            </React.Fragment>
                        </Grid.Column>
                    </Grid.Row>
                ) }
                <Grid.Row columns={ 1 }>
                    <Grid.Column computer={ 8 } mobile={ 16 } widescreen={ 8 } tablet={ 16 }>
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
                    </Grid.Column>
                </Grid.Row>
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

// Component constants.

const JWKS_MAX_LENGTH = 2048;
const JWKS_MIN_LENGTH = 10;
const EMPTY_STRING = "";
