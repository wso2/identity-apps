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
import { ContentLoader, Hint } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid } from "semantic-ui-react";
import { getAuthProtocolMetadata } from "../../api";
import { MetadataPropertyInterface, SupportedAuthProtocolMetaTypes, WSTrustMetaDataInterface } from "../../models";

/**
 * Proptypes for the oauth protocol settings wizard form component.
 */
interface WSTrustSettingsWizardFormPropsInterface extends TestableComponentInterface {
    initialValues: any;
    templateValues: any;
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
}

/**
 * SAML protocol settings wizard form component.
 *
 * @param {WSTrustSettingsWizardFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const WSTrustProtocolSettingsWizardForm: FunctionComponent<WSTrustSettingsWizardFormPropsInterface> = (
    props: WSTrustSettingsWizardFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        templateValues,
        triggerSubmit,
        onSubmit,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [ showWSTrustMetaData, setShowWSTrustMetaData ] = useState<WSTrustMetaDataInterface>(undefined);

    const getMetaData = (() => {
        getAuthProtocolMetadata(SupportedAuthProtocolMetaTypes.WS_TRUST)
            .then((response) => {
                setShowWSTrustMetaData(response as WSTrustMetaDataInterface);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Retrieval error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred retrieving the protocol metadata.",
                    level: AlertLevels.ERROR,
                    message: "Retrieval error"
                }));
            });
    });


    /**
     * Create drop down options.
     * @param metadataProp metadata property to create the option.
     */
    const getCertificateOptions = (metadataProp: MetadataPropertyInterface) => {
        const allowedOptions = [];

        if (metadataProp) {
            metadataProp.options.map((ele) => {
                allowedOptions.push({ key: metadataProp.options.indexOf(ele), text: ele, value: ele });
            });
        }

        return allowedOptions;
    };

    /**
     * Sanitizes and prepares the form values for submission.
     *
     * @param values - Form values.
     * @return {object} Prepared values.
     */
    const getFormValues = (values: Map<string, FormValue>): any => {
        return {
            inboundProtocolConfiguration: {
                wsTrust: {
                    audience: values.get("audience"),
                    certificateAlias: values.get("certificateAlias")
                }
            }
        };
    };

    useEffect(() => {
        getMetaData();
    }, []);

    return (
        templateValues && showWSTrustMetaData
            ? (
                <Forms
                    onSubmit={ (values: Map<string, FormValue>): void => {
                        onSubmit(getFormValues(values));
                    } }
                    submitState={ triggerSubmit }
                >
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    name="audience"
                                    label={
                                        t("console:develop.features.applications.forms.inboundWSTrust.fields" +
                                        ".audience.label")
                                    }
                                    required={ true }
                                    requiredErrorMessage={
                                        t("console:develop.features.applications.forms.inboundWSTrust" +
                                        ".fields.audience.validations.empty")
                                    }
                                    placeholder={
                                        t("console:develop.features.applications.forms.inboundWSTrust.fields" +
                                        ".audience.placeholder")
                                    }
                                    type="text"
                                    validation={ (value: string, validation: Validation) => {
                                        if (!FormValidation.url(value)) {
                                            validation.isValid = false;
                                            validation.errorMessages.push(
                                                t("console:develop.features.applications.forms.inboundWSTrust.fields" +
                                                ".audience.validations.invalid")
                                            );
                                        }
                                    } }
                                    value={ initialValues ? initialValues?.audience : templateValues?.audience }
                                    data-testid={ `${ testId }-audience-input` }
                                />
                                <Hint>
                                    { t("console:develop.features.applications.forms.inboundWSTrust.fields" +
                                    ".audience.hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Field
                                    label={
                                        t("console:develop.features.applications.forms.inboundWSTrust.fields" +
                                        ".certificateAlias.label")
                                    }
                                    name="certificateAlias"
                                    type="dropdown"
                                    required={ true }
                                    requiredErrorMessage={
                                        t("console:develop.features.applications.forms.inboundWSTrust.fields" +
                                        ".certificateAlias.validations.empty")
                                    }
                                    default={ showWSTrustMetaData.certificateAlias.defaultValue }
                                    value={
                                        initialValues ?
                                            initialValues?.certificateAlias : templateValues?.certificateAlias
                                    }
                                    children={ getCertificateOptions(showWSTrustMetaData?.certificateAlias) }
                                    data-testid={ `${ testId }-certificate-alias-dropdown` }
                                />
                                <Hint>
                                    { t("console:develop.features.applications.forms.inboundWSTrust.fields" +
                                    ".certificateAlias.hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Forms>
            ) 
            : <ContentLoader/>
    );
};

/**
 * Default props for the ws-trust protocol settings wizard form component.
 */
WSTrustProtocolSettingsWizardForm.defaultProps = {
    "data-testid": "ws-trust-protocol-settings-wizard-form"
};
