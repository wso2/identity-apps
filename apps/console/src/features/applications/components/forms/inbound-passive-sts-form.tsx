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

import { DisplayCertificate, TestableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms, Validation, useTrigger } from "@wso2is/forms";
import { Code, Hint } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import isEmpty from "lodash-es/isEmpty";
import React, { Fragment, FunctionComponent, ReactElement, useEffect, useState  } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Button, Grid } from "semantic-ui-react";
import { 
    ApplicationInterface, 
    CertificateInterface, 
    CertificateTypeInterface, 
    PassiveStsConfigurationInterface, 
    SupportedAuthProtocolTypes 
} from "../../models";
import { CertificateFormFieldModal } from "../modals";
import { ApplicationCertificateWrapper } from "../settings/certificate";

/**
 * Proptypes for the inbound Passive Sts form component.
 */
interface InboundPassiveStsFormPropsInterface extends TestableComponentInterface {
    /**
     * Current certificate configurations.
     */
    certificate: CertificateInterface;
    initialValues: PassiveStsConfigurationInterface;
    onSubmit: (values: any) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Specifies if API calls are pending.
     */
    isLoading?: boolean;
    application: ApplicationInterface;
    onUpdate: (id: string) => void;
}

/**
 * Inbound Passive Sts protocol configurations form.
 *
 * @param {InboundPassiveStsFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const InboundPassiveStsForm: FunctionComponent<InboundPassiveStsFormPropsInterface> = (
    props: InboundPassiveStsFormPropsInterface
): ReactElement => {

    const {
        onUpdate,
        application,
        certificate,
        initialValues,
        onSubmit,
        readOnly,
        isLoading,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ isPEMSelected, setPEMSelected ] = useState<boolean>(false);
    const [ showCertificateModal, setShowCertificateModal ] = useState<boolean>(false);
    const [ PEMValue, setPEMValue ] = useState<string>(undefined);
    const [ certificateDisplay, setCertificateDisplay ] = useState<DisplayCertificate>(null);
    const [ finalCertValue, setFinalCertValue ] = useState<string>(undefined);
    const [ selectedCertType, setSelectedCertType ] = useState<CertificateTypeInterface>(CertificateTypeInterface.NONE);
    const [ triggerCertSubmit, setTriggerCertSubmit ] = useTrigger();

    /**
     * Set the certificate type.
     */
    useEffect(() => {
        if (certificate?.type){
            setSelectedCertType(certificate?.type);
        }

    },[ certificate ]);

    /**
     * Prepares form values for submit.
     *
     * @param values - Form values.
     * @return {any} Sanitized form values.
     */
    const updateConfiguration = (values: any): any => {

        return {
            general: {
                advancedConfigurations: {
                    certificate: {
                        type: (selectedCertType !== CertificateTypeInterface.NONE)
                            ? selectedCertType
                            : certificate?.type,
                        value: (selectedCertType !== CertificateTypeInterface.NONE) ? finalCertValue: ""
                    }
                }
            },
            inbound: {
                realm: values.get("realm"),
                replyTo: values.get("replyTo")
            }
        };
    };

    /**
     * Handle form submit.
     * @param {Map<string, >} values - Form values.
     */
    const handleFormSubmit = (values: Map<string, FormValue>): void => {
        setTriggerCertSubmit();
        onSubmit(updateConfiguration(values));           
    };        

    return (
        <Forms
            onSubmit={ handleFormSubmit }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        <Field
                            name="realm"
                            label={
                                t("console:develop.features.applications.forms.inboundSTS.fields.realm.label")
                            }
                            required={ true }
                            requiredErrorMessage={
                                t("console:develop.features.applications.forms.inboundSTS.fields.realm.validations" +
                                    ".empty")
                            }
                            placeholder={
                                t("console:develop.features.applications.forms.inboundSTS.fields.realm.placeholder")
                            }
                            type="text"
                            value={ initialValues?.realm }
                            readOnly={ readOnly || !(isEmpty(initialValues?.realm)) }
                            data-testid={ `${ testId }-realm-input` }
                        />
                        <Hint disabled={ !(isEmpty(initialValues?.realm)) }>
                            { t("console:develop.features.applications.forms.inboundSTS.fields.realm.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        <Field
                            name="replyTo"
                            label={ t("console:develop.features.applications.forms.inboundSTS.fields.replyTo.label") }
                            required={ true }
                            requiredErrorMessage={
                                t("console:develop.features.applications.forms.inboundSTS.fields.replyTo.validations" +
                                    ".empty")
                            }
                            placeholder={
                                t("console:develop.features.applications.forms.inboundSTS.fields.replyTo.placeholder")
                            }
                            validation={ (value: string, validation: Validation) => {
                                if (!FormValidation.url(value)) {
                                    validation.isValid = false;
                                    validation.errorMessages.push(
                                        t("console:develop.features.applications.forms.inboundSTS.fields.replyTo" +
                                            ".validations.invalid")
                                    );
                                }
                            } }
                            type="text"
                            value={ initialValues?.replyTo }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-reply-to-url-input` }
                        />
                        <Hint>
                            { t("console:develop.features.applications.forms.inboundSTS.fields.replyTo.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                { /* Certificates */ }
                <Grid.Row columns={ 1 }>
                    
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        <ApplicationCertificateWrapper
                            protocol={ SupportedAuthProtocolTypes.WS_FEDERATION }
                            deleteAllowed={ !(initialValues?.idToken?.encryption?.enabled) }
                            reasonInsideTooltipWhyDeleteIsNotAllowed={ (
                                <Fragment>
                                    <Trans
                                        i18nKey={ "console:develop.features.applications.forms" +
                                        ".inboundOIDC.sections.certificates.disabledPopup" }
                                    >
                                        This certificate is used to encrypt the <Code>id_token</Code>. First, you need
                                        to disable <Code>id_token</Code> encryption to proceed.
                                    </Trans>
                                </Fragment>
                            ) }
                            onUpdate={ onUpdate }
                            application={ application }
                            updateCertFinalValue={ setFinalCertValue }
                            updateCertType={ setSelectedCertType }
                            certificate={ certificate }
                            readOnly={ readOnly }
                            hidden={ false }
                            isRequired={ true }
                            triggerSubmit={ triggerCertSubmit }
                        />
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
                                    loading={ isLoading }
                                    disabled={ isLoading }
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
 * Default props for the inbound passive-sts form component.
 */
InboundPassiveStsForm.defaultProps = {
    "data-testid": "inbound-passive-sts-form"
};
