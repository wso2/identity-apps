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

import { Button, Grid } from "semantic-ui-react";
import {
    CommonConstants,
    FieldType,
    getCheckboxField,
    getConfidentialField,
    getQueryParamsField,
    getTextField,
    getURLField
} from "../helpers";
import {
    OutboundProvisioningConnectorFormPropsInterface,
    OutboundProvisioningConnectorMetaPropertyInterface,
    OutboundProvisioningConnectorProperty
} from "../../../../models";
import React, { FunctionComponent, ReactElement } from "react";
import { Forms } from "@wso2is/forms";

/**
 * Common outbound provisioning connector configurations form.
 *
 * @param {OutboundProvisioningConnectorFormPropsInterface} props
 * @return { ReactElement }
 * @constructor
 */
export const CommonOutboundProvisioningConnectorForm: FunctionComponent<
    OutboundProvisioningConnectorFormPropsInterface> = (props
): ReactElement => {

    const {
        metadata,
        initialValues,
        onSubmit,
        triggerSubmit,
        enableSubmitButton
    } = props;

    const getInterpretedFormValue = (propertyMetadata: OutboundProvisioningConnectorMetaPropertyInterface, values: any,
                                     eachProp: OutboundProvisioningConnectorProperty) => {
        switch (propertyMetadata?.type.toUpperCase()) {
            case CommonConstants.BOOLEAN: {
                return values.get(eachProp?.key)?.includes(eachProp?.key);
            }
            default: {
                return values.get(eachProp?.key)
            }
        }
    };

    /**
     * Prepares form values for submit.
     *
     * @param values - Form values.
     * @return {any} Sanitized form values.
     */
    const getUpdatedConfigurations = (values: any): any => {
        const properties = initialValues?.properties.map((eachProp) => {
            const propertyMetadata = metadata.properties?.find(metaProperty => metaProperty.key === eachProp.key);
            return {
                key: eachProp?.key,
                value: getInterpretedFormValue(propertyMetadata, values, eachProp)
            };
        });
        return {
            ...initialValues,
            properties: [...properties]
        };
    };

    const getFieldType = (propertyMetadata: OutboundProvisioningConnectorMetaPropertyInterface): FieldType => {
        if (propertyMetadata?.type?.toUpperCase() === CommonConstants.BOOLEAN) {
            return FieldType.CHECKBOX;
        } else if (propertyMetadata?.isConfidential) {
            return FieldType.CONFIDENTIAL;
        } else if (propertyMetadata?.key.toUpperCase().includes(CommonConstants.FIELD_COMPONENT_KEYWORD_URL)) {
            // todo Need proper backend support to identity URL fields.
            return FieldType.URL;
        } else if (propertyMetadata?.key.toUpperCase().includes(
            CommonConstants.FIELD_COMPONENT_KEYWORD_QUERY_PARAMETER)) {
            // todo Need proper backend support to identity Query parameter fields.
            return FieldType.QUERY_PARAMS;
        }
        return FieldType.TEXT;
    };

    const getPropertyField = (eachProp, propertyMetadata) => {
        switch (getFieldType(propertyMetadata)) {
            // TODO Identify URLs, and generate a Field which supports URL validation.
            case FieldType.CHECKBOX : {
                return getCheckboxField(eachProp, propertyMetadata);
            }
            case FieldType.CONFIDENTIAL : {
                return getConfidentialField(eachProp, propertyMetadata);
            }
            case FieldType.URL : {
                return getURLField(eachProp, propertyMetadata);
            }
            case FieldType.QUERY_PARAMS : {
                return getQueryParamsField(eachProp, propertyMetadata);
            }
            default: {
                return getTextField(eachProp, propertyMetadata);
            }
        }
    };

    const getOutboundProvisioningConnectorPropertyFields = (): ReactElement[] => {
        return initialValues?.properties?.map((eachProp: OutboundProvisioningConnectorProperty) => {
            const propertyMetadata = metadata?.properties?.find(metaProperty => metaProperty.key === eachProp.key);
            return (
                <Grid.Row columns={ 1 } key={ propertyMetadata?.displayOrder }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        { getPropertyField(eachProp, propertyMetadata) }
                    </Grid.Column>
                </Grid.Row>

            )
        });
    };

    const getSubmitButton = () => {
        return (
            <Grid.Row columns={ 1 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                    <Button primary type="submit" size="small" className="form-button">
                        Update
                    </Button>
                </Grid.Column>
            </Grid.Row>
        );
    };

    return (
        <Forms
            onSubmit={ (values) => {
                onSubmit(getUpdatedConfigurations(values));
            } }
            submitState={ triggerSubmit }
        >
            <Grid>
                {getOutboundProvisioningConnectorPropertyFields().sort((a, b) => {
                    return Number(a.key) - Number(b.key);
                })}
                {enableSubmitButton ? getSubmitButton() : null}
            </Grid>
        </Forms>
    );
};

CommonOutboundProvisioningConnectorForm.defaultProps = {
    enableSubmitButton: true
};
