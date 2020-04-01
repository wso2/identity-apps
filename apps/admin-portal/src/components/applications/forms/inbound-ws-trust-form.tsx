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

import { Field, Forms } from "@wso2is/forms";
import React, { FunctionComponent, ReactElement } from "react";
import { Button, Grid } from "semantic-ui-react";
import { MetadataPropertyInterface, WSTrustConfigurationInterface, WSTrustMetaDataInterface } from "../../../models";
import { Hint } from "@wso2is/react-components";

/**
 * Proptypes for the inbound WS Trust form component.
 */
interface InboundWSTrustFormPropsInterface {
    metadata: WSTrustMetaDataInterface;
    initialValues: WSTrustConfigurationInterface;
    onSubmit: (values: any) => void;
}

/**
 * Inbound WS Trust protocol configurations form.
 *
 * @param {InboundWSTrustFormPropsInterface} props
 * @return {ReactElement}
 */
export const InboundWSTrustForm: FunctionComponent<InboundWSTrustFormPropsInterface> = (
    props: InboundWSTrustFormPropsInterface
): ReactElement => {

    const {
        metadata,
        initialValues,
        onSubmit
    } = props;

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
     * Prepares form values for submit.
     *
     * @param values - Form values.
     * @return {any} Sanitized form values.
     */
    const updateConfiguration = (values: any): any => {

        return {
            audience: values.get("audience"),
            certificateAlias: values.get("certificateAlias")
        }
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
                                    label="Audience"
                                    required={ true }
                                    requiredErrorMessage="Enter the audience."
                                    placeholder="Enter audience"
                                    type="text"
                                    value={ initialValues?.audience }
                                    readOnly
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
                                    default={ metadata?.certificateAlias.defaultValue }
                                    value={
                                        initialValues?.certificateAlias
                                    }
                                    children={ getCertificateOptions(metadata?.certificateAlias) }
                                />
                                <Hint>Public certificate of the trusted relying party.</Hint>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Button primary type="submit" size="small" className="form-button">
                                    Update
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Forms>
            )
            : null
    );
};
