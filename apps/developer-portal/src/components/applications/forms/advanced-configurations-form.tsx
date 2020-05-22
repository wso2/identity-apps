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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Forms, Validation } from "@wso2is/forms";
import { Heading, Hint, LinkButton } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import _ from "lodash";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button, Divider, Grid, Modal } from "semantic-ui-react";
import { AdvancedConfigurationsInterface, CertificateTypeInterface, DisplayCertificate } from "../../../models";
import {CertificateManagementUtils, CommonUtils} from "../../../utils";
import { Certificate as CertificateDisplay } from "../../certificates";
import {CertificateIllustrations} from "../../../configs";

/**
 *  Advanced Configurations for the Application.
 */
interface AdvancedConfigurationsFormPropsInterface extends TestableComponentInterface {
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
 *
 * @return {React.ReactElement}
 */
export const AdvancedConfigurationsForm: FunctionComponent<AdvancedConfigurationsFormPropsInterface> = (
    props: AdvancedConfigurationsFormPropsInterface
): ReactElement => {

    const {
        config,
        onSubmit,
        readOnly,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

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
                returnAuthenticatedIdpList:
                    !!values.get("returnAuthenticatedIdpList")?.includes("returnAuthenticatedIdpList"),
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
                className="certificate-display"
                dimmer="blurring"
                size="tiny"
                open={ certificateModal }
                onClose={ () => {
                    setCertificateModal(false)
                } }
                data-testid={ `${ testId }-view-certificate-modal` }
            >
                <Modal.Header>
                    <div className="certificate-ribbon">
                        <CertificateIllustrations.ribbon.ReactComponent />
                        <div className="certificate-alias">
                            View Certificate - {
                            certificateDisplay?.alias
                                ? certificateDisplay?.alias
                                : certificateDisplay?.issuerDN && (
                                    CertificateManagementUtils.searchIssuerDNAlias(certificateDisplay?.issuerDN)
                            )
                        }
                        </div><br/>
                        <div className="certificate-serial">Serial Number: { certificateDisplay?.serialNumber }</div>
                    </div>
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
                            requiredErrorMessage={
                                t("devPortal:components.applications.forms.advancedConfig.fields.saas" +
                                    ".validations.empty")
                            }
                            value={ config?.saas ? [ "saas" ] : [] }
                            type="checkbox"
                            children={ [
                                {
                                    label: t("devPortal:components.applications.forms.advancedConfig.fields" +
                                        ".saas.label"),
                                    value: "saas"
                                }
                            ] }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-sass-checkbox` }
                        />
                        <Hint>
                            { t("devPortal:components.applications.forms.advancedConfig.fields.saas.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="skipConsentLogin"
                            label=""
                            required={ false }
                            requiredErrorMessage={
                                t("devPortal:components.applications.forms.advancedConfig.fields" +
                                    ".skipConsentLogin.validations.empty")
                            }
                            value={ config?.skipLoginConsent ? [ "skipLoginConsent" ] : [] }
                            type="checkbox"
                            children={ [
                                {
                                    label: t("devPortal:components.applications.forms.advancedConfig.fields" +
                                        ".skipConsentLogin.label"),
                                    value: "skipLoginConsent"
                                }
                            ] }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-skip-login-consent-checkbox` }
                        />
                        <Hint>
                            { t("devPortal:components.applications.forms.advancedConfig.fields.skipConsentLogin" +
                                ".hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="skipConsentLogout"
                            label=""
                            required={ false }
                            requiredErrorMessage={
                                t("devPortal:components.applications.forms.advancedConfig.fields" +
                                    ".skipConsentLogout.validations.empty")
                            }
                            value={ config?.skipLogoutConsent ? [ "skipLogoutConsent" ] : [] }
                            type="checkbox"
                            children={ [
                                {
                                    label: t("devPortal:components.applications.forms.advancedConfig.fields" +
                                        ".skipConsentLogout.label"),
                                    value: "skipLogoutConsent"
                                }
                            ] }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-skip-logout-consent-checkbox` }
                        />
                        <Hint>
                            { t("devPortal:components.applications.forms.advancedConfig.fields.skipConsentLogout" +
                                ".hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="returnAuthenticatedIdpList"
                            label=""
                            required={ false }
                            requiredErrorMessage={
                                t("devPortal:components.applications.forms.advancedConfig.fields" +
                                    ".returnAuthenticatedIdpList.validations.empty")
                            }
                            value={ config?.returnAuthenticatedIdpList ? [ "returnAuthenticatedIdpList" ] : [] }
                            type="checkbox"
                            children={ [
                                {
                                    label: t("devPortal:components.applications.forms.advancedConfig.fields" +
                                        ".returnAuthenticatedIdpList.label"),
                                    value: "returnAuthenticatedIdpList"
                                }
                            ] }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-return-authenticated-idp-list-checkbox` }
                        />
                        <Hint>
                            { t("devPortal:components.applications.forms.advancedConfig.fields" +
                                ".returnAuthenticatedIdpList.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="enableAuthorization"
                            label=""
                            required={ false }
                            requiredErrorMessage={
                                t("devPortal:components.applications.forms.advancedConfig.fields" +
                                    ".enableAuthorization.validations.empty")
                            }
                            value={ config?.enableAuthorization ? [ "enableAuthorization" ] : [] }
                            type="checkbox"
                            children={ [
                                {
                                    label: t("devPortal:components.applications.forms.advancedConfig.fields" +
                                        ".enableAuthorization.label"),
                                    value: "enableAuthorization"
                                }
                            ] }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-enable-authorization-checkbox` }
                        />
                        <Hint>
                            { t("devPortal:components.applications.forms.advancedConfig.fields" +
                                ".enableAuthorization.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Divider/>
                        <Heading as="h5">
                            { t("devPortal:components.applications.forms.advancedConfig.sections.certificate" +
                                ".heading") }
                        </Heading>
                        <Field
                            label={
                                t("devPortal:components.applications.forms.advancedConfig.sections.certificate" +
                                    ".fields.type.label")
                            }
                            name="type"
                            default={ CertificateTypeInterface.JWKS }
                            listen={
                                (values) => {
                                    setPEMSelected(values.get("type") === "PEM");
                                }
                            }
                            type="radio"
                            value={ config?.certificate?.type }
                            children={ [
                                {
                                    label: t("devPortal:components.applications.forms.advancedConfig.sections" +
                                        ".certificate.fields.type.children.jwks.label"),
                                    value: CertificateTypeInterface.JWKS
                                },
                                {
                                    label: t("devPortal:components.applications.forms.advancedConfig.sections" +
                                        ".certificate.fields.type.children.pem.label"),
                                    value: CertificateTypeInterface.PEM
                                }
                            ] }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-certificate-type-radio-group` }
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
                                            label={
                                                t("devPortal:components.applications.forms.advancedConfig" +
                                                    ".sections.certificate.fields.pemValue.label")
                                            }
                                            required={ false }
                                            requiredErrorMessage={
                                                t("devPortal:components.applications.forms.advancedConfig" +
                                                    ".sections.certificate.fields.pemValue.validations.empty")
                                            }
                                            placeholder={
                                                t("devPortal:components.applications.forms.advancedConfig" +
                                                    ".sections.certificate.fields.pemValue.placeholder")
                                            }
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
                                            data-testid={ `${ testId }-certificate-textarea` }
                                        />
                                        < Hint>
                                            { t("devPortal:components.applications.forms.advancedConfig.sections" +
                                                ".certificate.fields.pemValue.hint") }
                                        </Hint>
                                        <LinkButton
                                            className="certificate-info-link-button"
                                            onClick={ handleCertificateView }
                                            disabled={ _.isEmpty(PEMValue) }
                                            data-testid={ `${ testId }-certificate-info-button` }
                                        >
                                            { t("devPortal:components.applications.forms.advancedConfig.sections" +
                                                ".certificate.fields.pemValue.actions.view") }
                                        </LinkButton>
                                    </>
                                )
                                : (
                                    <>
                                        <Field
                                            name="jwksValue"
                                            label={
                                                t("devPortal:components.applications.forms.advancedConfig" +
                                                    ".sections.certificate.fields.jwksValue.label")
                                            }
                                            required={ false }
                                            requiredErrorMessage={
                                                t("devPortal:components.applications.forms.advancedConfig" +
                                                    ".sections.certificate.fields.jwksValue.validations.empty")
                                            }
                                            placeholder={
                                                t("devPortal:components.applications.forms.advancedConfig" +
                                                    ".sections.certificate.fields.jwksValue.placeholder") }
                                            type="text"
                                            validation={ (value: string, validation: Validation) => {
                                                if (!FormValidation.url(value)) {
                                                    validation.isValid = false;
                                                    validation.errorMessages.push(
                                                        t(
                                                            "devPortal:components.applications.forms" +
                                                            ".advancedConfig.sections.certificate.fields.jwksValue" +
                                                            ".validations.invalid"
                                                        )
                                                    );
                                                }
                                            } }
                                            value={
                                                (CertificateTypeInterface.JWKS === config?.certificate?.type)
                                                && config?.certificate?.value
                                            }
                                            readOnly={ readOnly }
                                            data-testid={ `${ testId }-jwks-input` }
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
                                <Button
                                    primary
                                    type="submit"
                                    size="small"
                                    className="form-button"
                                    data-testid={ `${ testId }-submit-button` }
                                >
                                    { t("common:update") }
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
            </Grid>
        </Forms>
    );
};

/**
 * Default props for the application advanced configurations form component.
 */
AdvancedConfigurationsForm.defaultProps = {
    "data-testid": "application-advanced-configurations-form"
};
