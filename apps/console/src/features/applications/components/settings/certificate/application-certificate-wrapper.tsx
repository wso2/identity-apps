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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { URLUtils } from "@wso2is/core/utils";
import { Field, Forms, Validation } from "@wso2is/forms";
import { Code, ConfirmationModal, Heading, Hint, Message } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Divider, Grid } from "semantic-ui-react";
import { ApplicationCertificatesListComponent } from "./application-certificate-list";
import { commonConfig } from "../../../../../extensions";
import {
    ApplicationInterface,
    CertificateInterface,
    CertificateTypeInterface,
    SupportedAuthProtocolTypes
} from "../../../models";

/**
 * Proptypes for the application wrapper certificate component.
 */
interface ApplicationWrapperCertificatesPropsInterface extends TestableComponentInterface {
    /**
     * Application refresh call.
     * @param id - application id
     */
    onUpdate: (id: string) => void;
    application: ApplicationInterface;
    protocol?: SupportedAuthProtocolTypes;
    /**
     * Specifies whether JWKS or Certificates
     * remove/delete is allowed or not.
     */
    deleteAllowed?: boolean;
    /**
     * The message or the content of the pop up saying
     * why it's being disabled.
     */
    reasonInsideTooltipWhyDeleteIsNotAllowed?: ReactNode;
    /**
     * Callback to update final certificate value.
     */
    updateCertFinalValue: (value: string) => void;
    /**
     * Hide JWKS endpoint
     */
    hideJWKS?: boolean;
    /**
     * Callback to update final certificate type.
     */
    updateCertType: (value: CertificateTypeInterface) => void;
    /**
     * Current certificate configurations.
     */
    certificate: CertificateInterface;
    isRequired: boolean;
    hidden: boolean;
    readOnly: boolean;
    triggerSubmit?: boolean;
    canDiscardCertificate?: () => boolean;
}

/**
 * Application certificates wrapper component.
 *
 * @param props - Props injected to the component.
 *
 * @returns React.ReactElement
 */
export const ApplicationCertificateWrapper: FunctionComponent<ApplicationWrapperCertificatesPropsInterface> = (
    props: ApplicationWrapperCertificatesPropsInterface
): ReactElement => {

    const {
        protocol,
        deleteAllowed,
        reasonInsideTooltipWhyDeleteIsNotAllowed,
        onUpdate,
        application,
        certificate,
        triggerSubmit,
        hidden,
        hideJWKS,
        readOnly,
        updateCertFinalValue,
        updateCertType,
        canDiscardCertificate,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ certEmpty, setCertEmpty ] = useState(false);
    const [ selectedCertType, setSelectedCertType ] = useState<CertificateTypeInterface>(CertificateTypeInterface.NONE);
    const [ PEMValue, setPEMValue ] = useState<string>(undefined);
    const [ JWKSValue, setJWKSValue ] = useState<string>(undefined);
    const [ showInvalidOperationModal, setShowInvalidOperationModal ] = useState<boolean>(false);
    const [ showCertificateRemovalWarning, setShowCertificateRemovalWarning ] = useState<boolean>(false);

    /**
     * Set the certificate type
     */
    useEffect(()=> {

        if (certificate?.type){
            setSelectedCertType(certificate?.type);
        }

    }, [ certificate ]);

    /**
     * Set PEM value.
     */
    useEffect(() => {
        if (CertificateTypeInterface.PEM === selectedCertType) {
            updateCertFinalValue(PEMValue);
            if (!isEmpty(PEMValue)) {
                setCertEmpty(false);
            }
        } else if (CertificateTypeInterface.JWKS === selectedCertType) {
            updateCertFinalValue(JWKSValue);
        }
    }, [ PEMValue, JWKSValue ]);

    /**
     * Set initial PEM values.
     */
    useEffect(() => {
        if (CertificateTypeInterface.PEM === certificate?.type) {
            if (certificate?.value) {
                setPEMValue(certificate.value);
            }
        } else if (CertificateTypeInterface.JWKS === certificate?.type) {
            if (certificate?.value) {
                setJWKSValue(certificate.value);
            }
        }
    }, [ certificate ]);

    /**
     * Change related to cert type changne.
     */
    useEffect(() => {
        handleCertificateTypeChange(selectedCertType);
        if (CertificateTypeInterface.PEM === selectedCertType) {
            setJWKSValue("");
        } else if (CertificateTypeInterface.JWKS === selectedCertType) {
            setPEMValue("");
        }
    }, [ selectedCertType ]);

    /**
     * The following function handle the certificate type change.
     *
     * @param certType - Certificate type.
     */
    const handleCertificateTypeChange = (certType: CertificateTypeInterface): void => {
        if (certType === CertificateTypeInterface.PEM && !isEmpty(JWKSValue)) {
            dispatch(addAlert({
                description: t("console:develop.features.authenticationProvider.notifications." +
                    "changeCertType.pem.description"),
                level: AlertLevels.WARNING,
                message: t("console:develop.features.authenticationProvider.notifications." +
                    "changeCertType.pem.message")
            }));
        } else if (certType === CertificateTypeInterface.JWKS && !isEmpty(PEMValue)) {
            dispatch(addAlert({
                description: t("console:develop.features.authenticationProvider.notifications.changeCertType.jwks" +
                    ".description"),
                level: AlertLevels.WARNING,
                message: t("console:develop.features.authenticationProvider.notifications.changeCertType.jwks.message")
            }));
        }

        // Open up a warning message to inform the user that, by changing certificate type to NONE
        // will remove the current certificate from the system.
        if (selectedCertType === CertificateTypeInterface.NONE && certificate) {
            setShowCertificateRemovalWarning(true);
        } else {
            setShowCertificateRemovalWarning(false);
        }

        updateCertType(certType);
    };

    /**
     * Check the protocol type and render the correct hint for
     * the certificates field.
     *
     * @param protocol - Protocol type.
     */
    const resolveHintContent = (protocol: SupportedAuthProtocolTypes): ReactNode => {
        switch (protocol) {
            case SupportedAuthProtocolTypes.OAUTH2_OIDC:
            case SupportedAuthProtocolTypes.OIDC:
                return (
                    <Trans
                        i18nKey={ "console:develop.features.applications.forms." +
                        "advancedConfig.sections.certificate.hint.customOidc" }>
                        This certificate is used to encrypt the <Code>id_token</Code>
                        returned after the authentication.
                    </Trans>
                );
            case SupportedAuthProtocolTypes.SAML:
                return t("console:develop.features.applications.forms.advancedConfig" +
                    ".sections.certificate.hint.customSaml");
            default:
                return null;
        }
    };

    /**
     * Renders the certificate operation invalid modal.
     * @returns ReactElement
     */
    const renderInvalidOperationModal = (): ReactElement => (
        <ConfirmationModal
            onClose={ (): void => setShowInvalidOperationModal(false) }
            type="negative"
            open={ showInvalidOperationModal }
            primaryAction={ t("common:okay") }
            onPrimaryActionClick={ (): void => {
                setShowInvalidOperationModal(false);
            } }
            closeOnDimmerClick={ false }
        >
            <ConfirmationModal.Header
                data-testid={ `${ testId }-invalid-operation-modal-header` }
            >
                {
                    t("console:develop.features.applications.forms." +
            "advancedConfig.sections.certificate.invalidOperationModal.header") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Content
                data-testid={ `${ testId }-invalid-operation-modal-content` }
            >
                { t("console:develop.features.applications.forms." +
            "advancedConfig.sections.certificate.invalidOperationModal.message") }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );

    return (
        !hidden
            ? (
                <Forms
                    onSubmit={ () => {
                        handleCertificateTypeChange(selectedCertType);
                        if (selectedCertType === CertificateTypeInterface.PEM && isEmpty(PEMValue)) {
                            setCertEmpty(true);
                        }
                    } }
                    submitState={ triggerSubmit }
                >
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            <Divider/>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            <Heading as="h4">
                                {
                                    t("console:develop.features.applications.forms." +
                                "advancedConfig.sections.certificate.heading") }
                            </Heading>
                            <Field
                                label={
                                    t("console:develop.features.applications.forms." +
                                "advancedConfig.sections.certificate.fields.type.label")
                                }
                                name="certificateType"
                                default={ CertificateTypeInterface.NONE }
                                listen={
                                    (values) => {
                                        setSelectedCertType(
                                    values.get("certificateType") as CertificateTypeInterface
                                        );
                                        handleCertificateTypeChange(
                                            values.get("certificateType") as CertificateTypeInterface
                                        );
                                    }
                                }
                                onBefore={
                                    (event,value) => {
                                        const certType = value as CertificateTypeInterface;

                                        if(CertificateTypeInterface.NONE === certType && 
                                            (canDiscardCertificate && !canDiscardCertificate())){
                                            setShowInvalidOperationModal(true);

                                            return false;
                                        }

                                        return true;
                                    }
                                }
                                type="radio"
                                value={ certificate?.type }
                                children={ !hideJWKS ? [
                                    {
                                        label: "None",
                                        value: CertificateTypeInterface.NONE
                                    },
                                    {
                                        hint: {
                                            content: t("console:develop.features.applications.forms." +
                                            "advancedConfig.sections.certificate.fields.jwksValue.description"),
                                            header: t("console:develop.features.applications.forms." +
                                            "advancedConfig.sections.certificate.fields.type.children." +
                                            "jwks.label")
                                        },
                                        label: t("console:develop.features.applications.forms." +
                                        "advancedConfig.sections.certificate.fields.type.children.jwks.label"),
                                        value: CertificateTypeInterface.JWKS
                                    },
                                    {
                                        hint: {
                                            content: t("console:develop.features.applications.forms." +
                                            "advancedConfig.sections.certificate.fields.pemValue.description"),
                                            header: t("console:develop.features.applications.forms." +
                                            "advancedConfig.sections.certificate.fields.type.children." +
                                            "pem.label")
                                        },
                                        label: t("console:develop.features.applications.forms." +
                                        "advancedConfig.sections.certificate.fields.type.children.pem.label"),
                                        value: CertificateTypeInterface.PEM
                                    }
                                ]
                                    : [
                                        {
                                            label: "None",
                                            value: CertificateTypeInterface.NONE
                                        },
                                        {
                                            hint: {
                                                content: t("console:develop.features.applications.forms." +
                                            "advancedConfig.sections.certificate.fields.pemValue.description"),
                                                header: t("console:develop.features.applications.forms." +
                                            "advancedConfig.sections.certificate.fields.type.children." +
                                            "pem.label")
                                            },
                                            label: t("console:develop.features.applications.forms." +
                                        "advancedConfig.sections.certificate.fields.type.children.pem.label"),
                                            value: CertificateTypeInterface.PEM
                                        }
                                    ]
                                }
                                readOnly={ readOnly }
                                data-testid={ `${testId}-certificate-type-radio-group` }
                            />

                            {
                                showCertificateRemovalWarning && (
                                    <Message
                                        data-componentid="application-certificate-removal-warning-message"
                                        type="warning"
                                        // Semantic hides warning messages inside <form> by default
                                        // Overriding the behaviour here to make sure it renders properly.
                                        header="Warning"
                                        content={
                                            (
                                                <>
                                                    {
                                                        t("console:develop.features.applications.forms" +
                                                            ".inboundSAML.sections.certificates" +
                                                            ".certificateRemoveConfirmation.content")
                                                    }
                                                </>
                                            )
                                        }
                                    />
                                )
                            }
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            {
                                selectedCertType === CertificateTypeInterface.PEM && (
                                    <ApplicationCertificatesListComponent
                                        deleteAllowed={ deleteAllowed }
                                        reasonInsideTooltipWhyDeleteIsNotAllowed={
                                            reasonInsideTooltipWhyDeleteIsNotAllowed
                                        }
                                        onUpdate={ onUpdate }
                                        application={ application }
                                        updatePEMValue={ (val) => {
                                            setPEMValue(val);
                                        } }
                                        applicationCertificate={ PEMValue }
                                    />
                                )
                            }
                            {
                                selectedCertType === CertificateTypeInterface.JWKS && !hideJWKS && (
                                    <Field
                                        name="jwksValue"
                                        displayErrorOn="blur"
                                        label={
                                            t("console:develop.features.applications.forms.advancedConfig" +
                                                ".sections.certificate.fields.jwksValue.label")
                                        }
                                        required={ CertificateTypeInterface.JWKS === selectedCertType }
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
                                                        ".advancedConfig.sections.certificate.fields" +
                                                        ".jwksValue.validations.invalid"
                                                    )
                                                );
                                            }
                                            if (commonConfig?.blockLoopBackCalls && URLUtils.isLoopBackCall(value)) {
                                                validation.isValid = false;
                                                validation.errorMessages.push(
                                                    t("console:develop.features.idp.forms.common." +
                                                        "internetResolvableErrorMessage")
                                                );
                                            }
                                        } }
                                        listen={
                                            (values) => {
                                                setJWKSValue(values.get("jwksValue") as string);
                                            }
                                        }
                                        value={
                                            (CertificateTypeInterface.JWKS === certificate?.type)
                                            && (certificate?.value)
                                        }
                                        readOnly={ readOnly }
                                        data-testid={ `${ testId }-jwks-input` }
                                    />
                                )
                            }
                            {
                                certEmpty
                                && isEmpty(PEMValue)
                                && (CertificateTypeInterface.PEM === selectedCertType)
                                && (
                                    <Message
                                        type="error"
                                        data-testid={ `${ testId }-error-message` }
                                        content={ t("console:manage.features.certificates.keystore.errorEmpty") }
                                    />
                                )
                            }
                            { protocol && <Hint>{ resolveHintContent(protocol) }</Hint> }
                        </Grid.Column>
                    </Grid.Row>
                    { showInvalidOperationModal && renderInvalidOperationModal() }
                </Forms>
            )
            : null
    );
};

/**
 * Default proptypes for the application certificate wrapper component.
 */
ApplicationCertificateWrapper.defaultProps = {
    "data-testid": "application-certificate-wrapper",
    deleteAllowed: true,
    hidden: false,
    hideJWKS: false,
    isRequired: false,
    protocol: null,
    reasonInsideTooltipWhyDeleteIsNotAllowed: null
};
