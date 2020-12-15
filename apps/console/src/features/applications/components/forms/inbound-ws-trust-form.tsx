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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, Forms } from "@wso2is/forms";
import { Hint } from "@wso2is/react-components";
import _ from "lodash";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Button, Grid } from "semantic-ui-react";
import { MetadataPropertyInterface, WSTrustConfigurationInterface, WSTrustMetaDataInterface } from "../../models";

/**
 * Proptypes for the inbound WS Trust form component.
 */
interface InboundWSTrustFormPropsInterface extends TestableComponentInterface {
    metadata: WSTrustMetaDataInterface;
    initialValues: WSTrustConfigurationInterface;
    onSubmit: (values: any) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
}

/**
 * Inbound WS Trust protocol configurations form.
 *
 * @param {InboundWSTrustFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const InboundWSTrustForm: FunctionComponent<InboundWSTrustFormPropsInterface> = (
    props: InboundWSTrustFormPropsInterface
): ReactElement => {

    const {
        metadata,
        initialValues,
        onSubmit,
        readOnly,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

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
     * Prepares form values for submit.
     *
     * @param values - Form values.
     * @return {any} Sanitized form values.
     */
    const updateConfiguration = (values: any): any => {

        return {
            audience: values.get("audience"),
            certificateAlias: values.get("certificateAlias")
        };
    };

    return (
        metadata ?
            (
                <Forms
                    onSubmit={ (values) => {
                        onSubmit(updateConfiguration(values));
                    } }
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
                                    value={ initialValues?.audience }
                                    readOnly={ readOnly || !(_.isEmpty(initialValues?.audience)) }
                                    data-testid={ `${ testId }-audience-input` }
                                />

                                <Hint disabled={ !(_.isEmpty(initialValues?.audience)) }>
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
                                    default={ metadata?.certificateAlias.defaultValue }
                                    value={
                                        initialValues?.certificateAlias
                                    }
                                    children={ getCertificateOptions(metadata?.certificateAlias) }
                                    readOnly={ readOnly }
                                    data-testid={ `${ testId }-certificate-alias-dropdown` }
                                />
                                <Hint>
                                    { t("console:develop.features.applications.forms.inboundWSTrust.fields" +
                                        ".certificateAlias.hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
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
            )
            : null
    );
};

/**
 * Default props for the inbound ws-trust form component.
 */
InboundWSTrustForm.defaultProps = {
    "data-testid": "inbound-ws-trust-form"
};
