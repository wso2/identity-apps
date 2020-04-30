/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Forms, Validation } from "@wso2is/forms";
import { Heading, Hint, LinkButton } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import _ from "lodash";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Divider, Grid, Modal } from "semantic-ui-react";
import { AdvancedConfigurationsInterface, CertificateTypeInterface, DisplayCertificate } from "../../../models";
import { CommonUtils } from "../../../utils/common-utils";
import { Certificate as CertificateDisplay } from "../../certificates";

/**
 *  Advanced Configurations for the Application.
 */
interface AdvancedConfigurationsFormPropsInterface {
    config: AdvancedConfigurationsInterface;
    onSubmit: (values: any) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
}

/**
 * Advanced configurations form component.
 *
 * @param {AdvancedConfigurationsFormPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const AdvancedConfigurationsForm: FunctionComponent<AdvancedConfigurationsFormPropsInterface> = (
    props: AdvancedConfigurationsFormPropsInterface
): ReactElement => {

    const {
        config,
        onSubmit,
        readOnly
    } = props;

    const [ isPEMSelected, setPEMSelected ] = useState<boolean>(false);
    const [ PEMValue, setPEMValue ] = useState<string>(undefined);
    const [ certificateDisplay, setCertificateDisplay ] = useState<DisplayCertificate>(null);
    const [ certificateModal, setCertificateModal ] = useState(false);

    const dispatch = useDispatch();

    /**
     * Set initial PEM values.
     */
    useEffect(() => {
        if (CertificateTypeInterface.PEM === config?.certificate?.type) {
            setPEMSelected(true);
            if (config?.certificate?.value) {
                setPEMValue(config?.certificate?.value)
            }
        }
    }, [ config ]);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @return {any} Sanitized form values.
     */
    const updateConfiguration = (values: any): any => {
        return {
            advancedConfigurations: {
                certificate: {
                    type: values.get("type"),
                    value: isPEMSelected ? values.get("certificateValue") : values.get("jwksValue")
                },
                enableAuthorization: !!values.get("enableAuthorization")?.includes("enableAuthorization"),
                returnAuthenticatedIdpList: !!values.get("returnAuthenticatedIdpList")?.includes("returnAuthenticatedIdpList"),
                saas: !!values.get("saas")?.includes("saas"),
                skipLoginConsent: !!values.get("skipConsentLogin")?.includes("skipLoginConsent"),
                skipLogoutConsent: !!values.get("skipConsentLogout")?.includes("skipLogoutConsent")
            }
        };
    };

    /**
     * Shows the certificate details in modal.
     */
    const renderCertificateModal = (): ReactElement => {
        return (
            <Modal
                dimmer="blurring"
                size="tiny"
                open={ certificateModal }
                onClose={ () => {
                    setCertificateModal(false)
                } }
            >
                <Modal.Header>
                    View certificate
                </Modal.Header>
                <Modal.Content className="certificate-content">
                    <CertificateDisplay certificate={ certificateDisplay }/>
                </Modal.Content>
            </Modal>
        )
    };

    /**
     * Construct the details from the pem value.
     */
    const viewCertificate = () => {
        if (isPEMSelected && PEMValue) {
            const displayCertificate: DisplayCertificate = CommonUtils.displayCertificate(PEMValue);
            if (displayCertificate) {
                setCertificateDisplay(displayCertificate);
                setCertificateModal(true)
            } else {
                dispatch(addAlert({
                    description: "Provided pem is malformed",
                    level: AlertLevels.ERROR,
                    message: "Decode Error"
                }));
            }
        }
    };

    /**
     * Handle view certificate.
     *
     * @param event Button click event.
     */
    const handleCertificateView = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        viewCertificate()
    };

    return (
        <Forms onSubmit={ (values) => onSubmit(updateConfiguration(values)) }>
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="saas"
                            label=""
                            required={ false }
                            requiredErrorMessage="this is needed"
                            value={ config?.saas ? [ "saas" ] : [] }
                            type="checkbox"
                            children={ [
                                {
                                    label: "SaaS application",
                                    value: "saas"
                                }
                            ] }
                            readOnly={ readOnly }
                        />
                        <Hint>
                            Applications are by default restricted for usage by users of the service provider&apos;s
                            tenant. If this application is SaaS enabled it is opened up for all the users of all the
                            tenants.
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="skipConsentLogin"
                            label=""
                            required={ false }
                            requiredErrorMessage="this is needed"
                            value={ config?.skipLoginConsent ? [ "skipLoginConsent" ] : [] }
                            type="checkbox"
                            children={ [
                                {
                                    label: "Skip login consent",
                                    value: "skipLoginConsent"
                                }
                            ] }
                            readOnly={ readOnly }
                        />
                        <Hint>
                            User consent will be skipped during login flows.
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="skipConsentLogout"
                            label=""
                            required={ false }
                            requiredErrorMessage="this is needed"
                            value={ config?.skipLogoutConsent ? [ "skipLogoutConsent" ] : [] }
                            type="checkbox"
                            children={ [
                                {
                                    label: "Skip logout consent",
                                    value: "skipLogoutConsent"
                                }
                            ] }
                            readOnly={ readOnly }
                        />
                        <Hint>
                            User consent will be skipped during logout flows.
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="returnAuthenticatedIdpList"
                            label=""
                            required={ false }
                            requiredErrorMessage="this is needed"
                            value={ config?.returnAuthenticatedIdpList ? [ "returnAuthenticatedIdpList" ] : [] }
                            type="checkbox"
                            children={ [
                                {
                                    label: "Return authenticated idP list",
                                    value: "returnAuthenticatedIdpList"
                                }
                            ] }
                            readOnly={ readOnly }
                        />
                        <Hint>
                            The list of authenticated Identity Providers will be returned in the authentication
                            response.
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="enableAuthorization"
                            label=""
                            required={ false }
                            requiredErrorMessage="this is needed"
                            value={ config?.enableAuthorization ? [ "enableAuthorization" ] : [] }
                            type="checkbox"
                            children={ [
                                {
                                    label: "Enable authorization",
                                    value: "enableAuthorization"
                                }
                            ] }
                            readOnly={ readOnly }
                        />
                        <Hint>
                            Decides whether authorization policies needs to be engaged during authentication
                            flows.
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Divider/>
                        <Heading as="h5">Certificate</Heading>
                        <Field
                            label="Type"
                            name="type"
                            default={ CertificateTypeInterface.JWKS }
                            listen={
                                (values) => {
                                    setPEMSelected(values.get("type") === "PEM" ? true : false);
                                }
                            }
                            type="radio"
                            value={ config?.certificate?.type }
                            children={ [
                                {
                                    label: "Use JWKS endpoint",
                                    value: CertificateTypeInterface.JWKS
                                },
                                {
                                    label: "Provide certificate",
                                    value: CertificateTypeInterface.PEM
                                }
                            ] }
                            readOnly={ readOnly }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        {
                            isPEMSelected
                                ?
                                (
                                    <>
                                        <Field
                                            name="certificateValue"
                                            label="Value"
                                            required={ false }
                                            requiredErrorMessage="Certificate value is required"
                                            placeholder={ "Certificate in PEM format." }
                                            type="textarea"
                                            value={
                                                (CertificateTypeInterface.PEM === config?.certificate?.type)
                                                && config?.certificate?.value
                                            }
                                            listen={
                                                (values) => {
                                                    setPEMValue(
                                                        values.get("certificateValue") as string
                                                    );
                                                }
                                            }
                                            readOnly={ readOnly }
                                        />
                                        < Hint>
                                            The certificate (in PEM format) of the application.
                                        </Hint>
                                        <LinkButton
                                            className="certificate-info-link-button"
                                            onClick={ handleCertificateView }
                                            disabled={ _.isEmpty(PEMValue) }
                                        >
                                            View certificate info
                                        </LinkButton>
                                    </>
                                )
                                : (
                                    <>
                                        <Field
                                            name="jwksValue"
                                            label="Value"
                                            required={ false }
                                            requiredErrorMessage="Certificate value is required"
                                            placeholder={ "Application JWKS endpoint URL." }
                                            type="text"
                                            validation={ (value: string, validation: Validation) => {
                                                if (!FormValidation.url(value)) {
                                                    validation.isValid = false;
                                                    validation.errorMessages.push("This is not a valid URL");
                                                }
                                            } }
                                            value={
                                                (CertificateTypeInterface.JWKS === config?.certificate?.type)
                                                && config?.certificate?.value
                                            }
                                            readOnly={ readOnly }
                                        />
                                    </>
                                )
                        }

                    </Grid.Column>
                </Grid.Row>
                { certificateModal && renderCertificateModal() }
                {
                    !readOnly && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Button primary type="submit" size="small" className="form-button">
                                    Update
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
            </Grid>
        </Forms>
    );
};
