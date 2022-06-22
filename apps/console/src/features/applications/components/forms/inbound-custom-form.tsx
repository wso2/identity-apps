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

import { CertificateManagementConstants } from "@wso2is/core/constants";
import { AlertInterface, AlertLevels, DisplayCertificate, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CertificateManagementUtils } from "@wso2is/core/utils";
import { Field, Forms, Validation } from "@wso2is/forms";
import { Heading, Hint, LinkButton } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button, Divider, Grid } from "semantic-ui-react";
import { ApplicationManagementConstants } from "../../constants";
import {
    CertificateInterface,
    CertificateTypeInterface,
    CustomInboundProtocolConfigurationInterface,
    CustomInboundProtocolMetaDataInterface,
    CustomInboundProtocolPropertyInterface,
    CustomTypeEnum,
    PropertyModelInterface,
    SubmitFormCustomPropertiesInterface
} from "../../models";
import { CertificateFormFieldModal } from "../modals";

/**
 * Proptypes for the inbound custom protocol form component.
 */
interface InboundCustomFormPropsInterface extends TestableComponentInterface {
    /**
     * Current certificate configurations.
     */
    certificate: CertificateInterface;
    metadata?: CustomInboundProtocolMetaDataInterface;
    initialValues?: CustomInboundProtocolConfigurationInterface;
    onSubmit: (values: any) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Specifies if API calls are pending.
     */
    isLoading?: boolean;

}

/**
 * Inbound Custom protocol configurations form.
 *
 * @param {InboundCustomFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const InboundCustomProtocolForm: FunctionComponent<InboundCustomFormPropsInterface> = (
    props: InboundCustomFormPropsInterface
): ReactElement => {

    const {
        certificate,
        metadata,
        initialValues,
        onSubmit,
        readOnly,
        isLoading,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [ isPEMSelected, setPEMSelected ] = useState<boolean>(false);
    const [ showCertificateModal, setShowCertificateModal ] = useState<boolean>(false);
    const [ PEMValue, setPEMValue ] = useState<string>(undefined);
    const [ certificateDisplay, setCertificateDisplay ] = useState<DisplayCertificate>(null);

    /**
     * Set initial PEM values.
     */
    useEffect(() => {
        if (CertificateTypeInterface.PEM === certificate?.type) {
            setPEMSelected(true);
            if (certificate?.value) {
                setPEMValue(certificate.value);
            }
        }
    }, [ certificate ]);

    const createInputComponent = (
        (config: CustomInboundProtocolPropertyInterface, initialValue?: PropertyModelInterface) => {
            if (config?.availableValues?.length > 0) {
                return (
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            <Field
                                label={ config?.displayName }
                                name={ config?.name }
                                type="dropdown"
                                value={ initialValue?.value }
                                required={ config?.required }
                                requiredErrorMessage={
                                    t("console:develop.features.applications.forms.inboundCustom.fields.dropdown" +
                                        ".validations.empty", { name: config?.displayName })
                                }
                                default={ config?.defaultValue }
                                children={ createDropDownOption(config?.availableValues) }
                                data-testid={ `${ testId }-${ config?.name }-dropdown` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                );
            } else if (config?.isConfidential) {
                return (
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            <Field
                                label={ config?.displayName }
                                name={ config?.name }
                                hidePassword={ t("common:hide") + " " + config?.displayName }
                                showPassword={ t("common:show") + " " + config?.displayName }
                                value={ initialValue?.value }
                                required={ config?.required }
                                requiredErrorMessage={
                                    t("console:develop.features.applications.forms.inboundCustom.fields.password" +
                                        ".validations.empty",
                                    { name: config?.displayName })
                                }
                                placeholder={
                                    t("console:develop.features.applications.forms.inboundCustom.fields.password" +
                                        ".placeholder",
                                    { name: config?.displayName })
                                }
                                type="password"
                                default={ config?.defaultValue }
                                data-testid={ `${ testId }-${ config?.name }-password-input` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                );
            } else if (config?.type === CustomTypeEnum.BOOLEAN) {
                return (
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            <Field
                                name={ config?.name }
                                label=""
                                required={ config?.required }
                                requiredErrorMessage={
                                    t("console:develop.features.applications.forms.inboundCustom.fields.checkbox" +
                                        ".validations.empty",
                                    { user: config?.displayName })
                                }
                                value={ initialValue?.value ? [ config.name ] : [] }
                                type="checkbox"
                                children={ [
                                    {
                                        label: config.displayName,
                                        value: config.name
                                    }
                                ] }
                                data-testid={ `${ testId }-${ config?.name }-checkbox` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                );
            } else {
                return (
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            <Field
                                label={ config?.displayName }
                                name={ config?.name }
                                required={ config?.required }
                                value={ initialValue?.value }
                                requiredErrorMessage={
                                    t("console:develop.features.applications.forms.inboundCustom.fields.generic" +
                                        ".validations.empty",
                                    { name: config?.displayName })
                                }
                                placeholder={
                                    t("console:develop.features.applications.forms.inboundCustom.fields.generic" +
                                        ".placeholder",
                                    { name: config?.displayName })
                                }
                                type={ (config?.type === CustomTypeEnum.INTEGER) ? "number" : "text" }
                                data-testid={ `${ testId }-${ config?.name }-input` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                );
            }
        });

    const generateFormElements = (() => {
        if (metadata) {
            const configs: CustomInboundProtocolPropertyInterface[] = metadata?.properties;

            if (configs.length > 0) {
                configs.sort(
                    (a, b) => (a.displayOrder > b.displayOrder) ? 1 : -1);
            }

            return configs.map((config) => {
                const initialValue: PropertyModelInterface = initialValues.properties.find(
                    (prop) => prop.key === config.name
                );

                return createInputComponent(config, initialValue);
            });
        }
    });

    /**
     * Create drop down options.
     * @param options property to create the option.
     */
    const createDropDownOption = (options: string[]) => {
        const allowedOptions = [];

        if (options) {
            options.map((ele) => {
                allowedOptions.push({ key: options.indexOf(ele), text: ele, value: ele });
            });
        }

        return allowedOptions;
    };

    /**
     * Prepares form values for submit.
     *
     * @param values - Form values.
     * @return {any} Sanitized form values.
     */
    const updateConfiguration = (values: Map<string, string | string[]>): any => {
        const valueProperties: SubmitFormCustomPropertiesInterface[] = [];

        //Iterate over map entries
        for (const [ key, value ] of values) {
            let property: SubmitFormCustomPropertiesInterface = undefined;

            if (value instanceof Array) {
                property = {
                    key: key,
                    value: value.length > 0
                };
            } else {
                property = {
                    key: key,
                    value: value
                };
            }
            valueProperties.push(property);
        }

        return {
            general: {
                advancedConfigurations: {
                    certificate: {
                        type: values.get("type"),
                        value: isPEMSelected ? values.get("certificateValue") : values.get("jwksValue")
                    }
                }
            },
            inbound: {
                configName: initialValues?.configName,
                name: initialValues?.name,
                properties: [
                    ...valueProperties
                ]
            }
        };
    };

    useEffect(() => {
        if (metadata) {
            generateFormElements();
        }
    }, [ metadata ]);

    /**
     * Construct the details from the pem value.
     */
    const viewCertificate = () => {
        if (isPEMSelected && PEMValue) {

            let displayCertificate: DisplayCertificate;

            if (CertificateManagementUtils.canSafelyParseCertificate(PEMValue)) {
                displayCertificate = CertificateManagementUtils.displayCertificate(null, PEMValue);
            } else {
                displayCertificate = CertificateManagementConstants.DUMMY_DISPLAY_CERTIFICATE;
            }

            if (displayCertificate) {
                setCertificateDisplay(displayCertificate);
                setShowCertificateModal(true);
            } else {
                dispatch(addAlert<AlertInterface>({
                    description: t("console:common.notifications.invalidPEMFile.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:common.notifications.invalidPEMFile.genericError.message")
                }));
            }
        }
    };

    return (
        <Forms
            onSubmit={ (values) => {
                onSubmit(updateConfiguration(values));
            } }
        >
            <Grid>
                { generateFormElements() }
                { /* Certificates */ }
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        <Divider/>
                    </Grid.Column>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        <Heading as="h5">
                            {
                                t("console:develop.features.applications.forms." +
                                    "advancedConfig.sections.certificate.heading") }
                        </Heading>
                        <Field
                            label={
                                t("console:develop.features.applications.forms." +
                                    "advancedConfig.sections.certificate.fields.type.label")
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
                                    label: t("console:develop.features.applications.forms." +
                                        "advancedConfig.sections.certificate.fields.type.children.jwks.label"),
                                    value: CertificateTypeInterface.JWKS
                                },
                                {
                                    label: t("console:develop.features.applications.forms." +
                                        "advancedConfig.sections.certificate.fields.type.children.pem.label"),
                                    value: CertificateTypeInterface.PEM
                                }
                            ] }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-certificate-type-radio-group` }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        {
                            isPEMSelected
                                ?
                                (
                                    <>
                                        <Field
                                            name="certificateValue"
                                            label={
                                                t("console:develop.features.applications.forms.advancedConfig" +
                                                    ".sections.certificate.fields.pemValue.label")
                                            }
                                            required={ false }
                                            requiredErrorMessage={
                                                t("console:develop.features.applications.forms.advancedConfig" +
                                                    ".sections.certificate.fields.pemValue.validations.empty")
                                            }
                                            placeholder={
                                                ApplicationManagementConstants.PEM_CERTIFICATE_PLACEHOLDER
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
                                            {
                                                t("console:develop.features.applications.forms." +
                                                    "advancedConfig.sections.certificate.fields.pemValue.hint")
                                            }
                                        </Hint>
                                        <LinkButton
                                            className="certificate-info-link-button"
                                            onClick={ (e: MouseEvent<HTMLButtonElement>) => {
                                                e.preventDefault();
                                                viewCertificate();
                                            } }
                                            disabled={ isEmpty(PEMValue) }
                                            data-testid={ `${ testId }-certificate-info-button` }
                                        >
                                            {
                                                t("console:develop.features.applications.forms." +
                                                    "advancedConfig.sections.certificate.fields.pemValue." +
                                                    "actions.view")
                                            }
                                        </LinkButton>
                                    </>
                                )
                                : (
                                    <>
                                        <Field
                                            name="jwksValue"
                                            label={
                                                t("console:develop.features.applications.forms.advancedConfig" +
                                                    ".sections.certificate.fields.jwksValue.label")
                                            }
                                            required={ false }
                                            requiredErrorMessage={
                                                t("console:develop.features.applications.forms.advancedConfig" +
                                                    ".sections.certificate.fields.jwksValue.validations.empty")
                                            }
                                            placeholder={
                                                t("console:develop.features.applications.forms.advancedConfig" +
                                                    ".sections.certificate.fields.jwksValue.placeholder") }
                                            type="text"
                                            validation={ (value: string, validation: Validation) => {
                                                if (!FormValidation.url(value)) {
                                                    validation.isValid = false;
                                                    validation.errorMessages.push(
                                                        t(
                                                            "console:develop.features.applications.forms" +
                                                            ".advancedConfig.sections.certificate.fields." +
                                                            "jwksValue.validations.invalid"
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
                {
                    showCertificateModal && (
                        <CertificateFormFieldModal
                            open={ showCertificateModal }
                            certificate={ certificateDisplay }
                            onClose={ () => {
                                setShowCertificateModal(false);
                            } }
                        />
                    )
                }
                {
                    !readOnly && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <Button
                                    primary
                                    type="submit"
                                    size="small"
                                    className="form-button"
                                    loading={ isLoading }
                                    disabled={ isLoading }
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
 * Default props for the inbound custom protocol form component.
 */
InboundCustomProtocolForm.defaultProps = {
    "data-testid": "inbound-custom-protocol-form"
};
