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
import { Field, Forms, FormValue, Validation } from "@wso2is/forms";
import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Button, Grid } from "semantic-ui-react";
import { MetadataPropertyInterface, SupportedAuthProtocolMetaTypes, WSTrustMetaDataInterface } from "../../../models";
import { getAuthProtocolMetadata } from "../../../api";
import { useDispatch } from "react-redux";
import { FormValidation } from "@wso2is/validation";

/**
 * Proptypes for the oauth protocol settings wizard form component.
 */
interface WSTrustSettingsWizardFormPropsInterface {
    initialValues: any;
    templateValues: any;
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
}

/**
 * SAML protocol settings wizard form component.
 *
 * @param {WSTrustSettingsWizardFormPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const WSTrustProtocolSettingsWizardForm: FunctionComponent<WSTrustSettingsWizardFormPropsInterface> = (
    props: WSTrustSettingsWizardFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        templateValues,
        triggerSubmit,
        onSubmit
    } = props;

    const dispatch = useDispatch();

    const [showWSTrustMetaData, setShowWSTrustMetaData] = useState<WSTrustMetaDataInterface>(undefined);

    const getMetaData = (() => {
        getAuthProtocolMetadata(SupportedAuthProtocolMetaTypes.WS_TRUST)
            .then((response) => {
                setShowWSTrustMetaData(response as WSTrustMetaDataInterface)
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
                allowedOptions.push({ text: ele, value: ele, key: metadataProp.options.indexOf(ele) });
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

    return (templateValues && showWSTrustMetaData ?
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
                                label="Audience"
                                required={ true }
                                requiredErrorMessage="Enter the audience."
                                placeholder="Enter audience"
                                type="text"
                                validation={ (value: string, validation: Validation) => {
                                    if (!FormValidation.url(value)) {
                                        validation.isValid = false;
                                        validation.errorMessages.push("This is not a valid URL");
                                    }
                                } }
                                value={ initialValues?.audience || templateValues?.audience }
                            />
                            {/* eslint-disable-next-line react/no-unescaped-entities */ }
                            <Hint>The trusted relying party's endpoint address.</Hint>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Field
                                label="Certificate alias"
                                name="certificateAlias"
                                type="dropdown"
                                required={ true }
                                requiredErrorMessage="Select the certificate alias"
                                default={ showWSTrustMetaData.certificateAlias.defaultValue }
                                value={
                                    initialValues?.certificateAlias || templateValues?.certificateAlias
                                }
                                children={ getCertificateOptions(showWSTrustMetaData?.certificateAlias) }
                            />
                            <Hint>Public certificate of the trusted relying party.</Hint>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Forms> : <div/>
    );
};
