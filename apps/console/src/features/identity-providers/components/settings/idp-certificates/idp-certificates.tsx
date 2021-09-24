/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
import { Field, Form } from "@wso2is/form";
import { CertFileStrategy, Code, EmphasizedSegment, Hint, PrimaryButton, Switcher } from "@wso2is/react-components";
import { SwitcherOptionProps } from "@wso2is/react-components/";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Divider, Grid, Icon, Segment } from "semantic-ui-react";
import { AddIdpCertificateModal } from "./add-idp-certificate-modal";
import { EmptyCertificatesPlaceholder } from "./empty-certificates-placeholder";
import { IdpCertificatesList } from "./idp-cetificates-list";
import { updateIDPCertificate } from "../../../api";
import { IdentityProviderInterface } from "../../../models";

/**
 * Props interface of {@link IdpCertificates}
 */
export interface IdpCertificatesV2Props extends IdentifiableComponentInterface {
    editingIDP: IdentityProviderInterface;
    onUpdate: (id: string) => void;
    isReadOnly: boolean;
    enableJWKS?: boolean;
}

export type CertificateConfigurationMode = "jwks" | "certificates";

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
 *  |   |                         <Some Icon>                          |   |
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
 * @constructor
 */
export const IdpCertificates: FunctionComponent<IdpCertificatesV2Props> = (props): ReactElement => {

    const {
        ["data-componentid"]: testId,
        editingIDP,
        onUpdate,
        isReadOnly,
        enableJWKS
    } = props;

    const [ selectedConfigurationMode, setSelectedConfigurationMode ] = useState<CertificateConfigurationMode>();
    const [ addCertificateModalOpen, setAddCertificateModalOpen ] = useState<boolean>(false);

    const { t } = useTranslation();
    const dispatch = useDispatch();

    useEffect(() => {
        setInitialModeOfConfiguration();
    }, []);

    useEffect(() => {
        setInitialModeOfConfiguration();
    }, [ editingIDP ]);

    const setInitialModeOfConfiguration = () => {
        if (enableJWKS) {
            if (editingIDP?.certificate?.certificates?.length > 0) {
                setSelectedConfigurationMode("certificates");
            } else {
                // Even if editingIDP?.certificate?.jwksUri?.trim() empty or not
                // if above is not configured it's always JWKS.
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
     * @param values {Record<string, any>}
     */
    const onJWKSFormSubmit = (values: Record<string, any>) => {

        const operation = editingIDP?.certificate?.jwksUri ? "REPLACE" : "ADD";
        const PATCH_OBJECT = [ {
            "operation": operation,
            "path": "/certificate/jwksUri",
            "value": values.jwks_endpoint
        } ];

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
            .catch(ifTheresAnyError);

    };

    const jwksInputForm: ReactNode = (
        <Form
            uncontrolledForm={ true }
            initialValues={ { jwks_endpoint: editingIDP?.certificate?.jwksUri } }
            onSubmit={ onJWKSFormSubmit }>

            <Field.Input
                required
                hint={
                    <React.Fragment>
                        A JSON Web Key (JWK) Set is a JSON object that represents a set of JWKs. The JSON
                        object MUST have a <Code>keys</Code> member, with its value being an array of
                        JWKs.
                    </React.Fragment>
                }
                label="JWKS Endpoint URL"
                ariaLabel="JWKS Endpoint URL"
                inputType="url"
                width={ 16 }
                placeholder="https://{ oauth-provider-url }/oauth/jwks"
                maxLength={ JWKS_MAX_LENGTH }
                minLength={ JWKS_MIN_LENGTH }
                name="jwks_endpoint"/>

            <Show when={ AccessControlConstants.IDP_EDIT }>
                <PrimaryButton
                    type="submit"
                    data-testid={ `${ testId }-save-button` }>
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
                    <Segment compact>
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

    return (
        <EmphasizedSegment padded="very">
            { enableJWKS && (
                <React.Fragment>
                    <Switcher
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
            ) }
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column computer={ 8 } mobile={ 16 } tablet={ 16 }>
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
            <AddIdpCertificateModal
                currentlyEditingIdP={ editingIDP }
                refreshIdP={ onUpdate }
                isOpen={ addCertificateModalOpen }
                onClose={ closeAddCertificateWizard }/>
        </EmphasizedSegment>
    );

};

/**
 * Default props of {@link IdpCertificates}
 */
IdpCertificates.defaultProps = {
    "data-componentid": "idp-certificates",
    enableJWKS: true
};

// Component constants.

const JWKS_MAX_LENGTH = 2048;
const JWKS_MIN_LENGTH = 10;
