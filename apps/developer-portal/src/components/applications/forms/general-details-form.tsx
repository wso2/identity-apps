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
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { Heading, Hint, LinkButton } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import _ from "lodash";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button, Divider, Grid, Modal } from "semantic-ui-react";
import { CertificateIllustrations } from "../../../configs";
import {
    CertificateInterface,
    CertificateTypeInterface,
    DisplayCertificate
} from "../../../models";
import { CertificateManagementUtils, CommonUtils } from "../../../utils";
import { Certificate as CertificateDisplay } from "../../certificates";

/**
 * Proptypes for the applications general details form component.
 */
interface GeneralDetailsFormPopsInterface extends TestableComponentInterface {
    /**
     * Application access URL.
     */
    accessUrl?: string;
    /**
     * Currently editing application id.
     */
    appId?: string;
    /**
     * Application description.
     */
    description?: string;
    /**
     * Is the application discoverable.
     */
    discoverability?: boolean;
    /**
     * Application logo URL.
     */
    imageUrl?: string;
    /**
     * Name of the application.
     */
    name: string;
    /**
     * On submit callback.
     */
    onSubmit: (values: any) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Current certificate configurations.
     */
    certificate: CertificateInterface;
}

/**
 * Form to edit general details of the application.
 *
 * @param {GeneralDetailsFormPopsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const GeneralDetailsForm: FunctionComponent<GeneralDetailsFormPopsInterface> = (
    props: GeneralDetailsFormPopsInterface
): ReactElement => {

    const {
        appId,
        name,
        description,
        discoverability,
        imageUrl,
        accessUrl,
        onSubmit,
        readOnly,
        certificate,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ isDiscoverable, setDiscoverability ] = useState<boolean>(discoverability);
    const [ isPEMSelected, setPEMSelected ] = useState<boolean>(false);
    const [ certificateModal, setCertificateModal ] = useState(false);
    const [ PEMValue, setPEMValue ] = useState<string>(undefined);
    const [ certificateDisplay, setCertificateDisplay ] = useState<DisplayCertificate>(null);

    const dispatch = useDispatch();

    /**
     * Set initial PEM values.
     */
    useEffect(() => {
        if (CertificateTypeInterface.PEM === certificate?.type) {
            setPEMSelected(true);
            if (certificate?.value) {
                setPEMValue(certificate.value)
            }
        }
    }, [ certificate ]);

    /**
     * Prepare form values for submitting.
     *
     * @param values - Form values.
     * @return {any} Sanitized form values.
     */
    const updateConfigurations = (values: Map<string, FormValue>): any => {
        return  {
            accessUrl: values.get("accessUrl").toString(),
            advancedConfigurations: {
                certificate: {
                    type: values.get("type"),
                    value: isPEMSelected ? values.get("certificateValue") : values.get("jwksValue")
                },
                discoverableByEndUsers: !!values.get("discoverableByEndUsers").includes("discoverable")
            },
            description: values.get("description").toString(),
            id: appId,
            imageUrl: values.get("imageUrl").toString(),
            name: values.get("name").toString()
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
    const handleCertificateView = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        viewCertificate()
    };

    /**
     * Handles form value change.
     *
     * @param {boolean} isPure - Is the form pure.
     * @param {Map<string, FormValue>} values - Form values
     */
    const handleFormValuesOnChange = (isPure: boolean, values: Map<string, FormValue>) => {
        // Set the discoverability based on the checkbox toggle.
        if (values.get("discoverableByEndUsers").includes("discoverable") !== isDiscoverable) {
            setDiscoverability(!!values.get("discoverableByEndUsers").includes("discoverable"));
        }
    };

    return (
        <Forms
            onSubmit={ (values): void => {
                onSubmit(updateConfigurations(values))
            } }
            onChange={ handleFormValuesOnChange }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="name"
                            label={ t("devPortal:components.applications.forms.generalDetails.fields.name.label") }
                            required={ true }
                            requiredErrorMessage={
                                t("devPortal:components.applications.forms.generalDetails.fields.name" +
                                    ".validations.empty")
                            }
                            placeholder={
                                t("devPortal:components.applications.forms.generalDetails.fields.name.placeholder")
                            }
                            type="text"
                            value={ name }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-application-name-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="description"
                            label={
                                t("devPortal:components.applications.forms.generalDetails.fields.description" +
                                    ".label")
                            }
                            required={ false }
                            requiredErrorMessage=""
                            placeholder={
                                t("devPortal:components.applications.forms.generalDetails.fields.description" +
                                    ".placeholder")
                            }
                            type="textarea"
                            value={ description }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-application-description-textarea` }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="imageUrl"
                            label={
                                t("devPortal:components.applications.forms.generalDetails.fields.imageUrl.label")
                            }
                            required={ false }
                            requiredErrorMessage=""
                            placeholder={
                                t("devPortal:components.applications.forms.generalDetails.fields.imageUrl" +
                                    ".placeholder")
                            }
                            type="text"
                            validation={ (value: string, validation: Validation) => {
                                if (!FormValidation.url(value)) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(
                                        t("devPortal:components.applications.forms.generalDetails.fields" +
                                            ".imageUrl.validations.invalid")
                                    );
                                }
                            } }
                            value={ imageUrl }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-application-image-url-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="discoverableByEndUsers"
                            required={ false }
                            requiredErrorMessage=""
                            type="checkbox"
                            children={ [
                                {
                                    label: t("devPortal:components.applications.forms.generalDetails.fields" +
                                        ".discoverable.label"),
                                    value: "discoverable"
                                }
                            ] }
                            value={ isDiscoverable ? [ "discoverable" ] : [] }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-application-discoverable-checkbox` }
                        />
                        <Field
                            name="accessUrl"
                            label={
                                t("devPortal:components.applications.forms.generalDetails.fields.accessUrl.label")
                            }
                            required={ isDiscoverable }
                            requiredErrorMessage={
                                t("devPortal:components.applications.forms.generalDetails.fields.accessUrl" +
                                    ".validations.empty")
                            }
                            placeholder={
                                t("devPortal:components.applications.forms.generalDetails.fields.accessUrl" +
                                    ".placeholder")
                            }
                            type="text"
                            validation={ (value: string, validation: Validation) => {
                                if (!FormValidation.url(value)) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(
                                        t("devPortal:components.applications.forms.generalDetails.fields" +
                                            ".accessUrl.validations.invalid")
                                    );
                                }
                            } }
                            value={ accessUrl }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-application-access-url-input` }
                        />
                        <Hint>
                            { t("devPortal:components.applications.forms.generalDetails.fields.accessUrl.hint") }
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
                            value={ certificate?.type }
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
                                                (CertificateTypeInterface.PEM === certificate?.type)
                                                && certificate?.value
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
                                                (CertificateTypeInterface.JWKS === certificate?.type)
                                                && certificate?.value
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
 * Default props for the applications general settings form.
 */
GeneralDetailsForm.defaultProps = {
    "data-testid": "application-general-settings-form"
};
