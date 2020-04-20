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

import { CommonPluggableComponentForm } from "../components";
import { CommonPluggableComponentFormPropsInterface } from "../../../../models";
import {
    AuthenticatorFormPropsInterface,
    AuthenticatorProperty,
    FederatedAuthenticatorMetaPropertyInterface
} from "../../../../models";
import { Button, Grid } from "semantic-ui-react";
import React, { FunctionComponent, ReactElement } from "react";
import { CommonConstants } from "../helpers";
import { getPropertyField } from "../../utils";

/**
 * Common authenticator configurations form.
 *
 * @param {CommonPluggableComponentFormPropsInterface} props
 * @return { ReactElement }
 * @constructor
 */
export const CommonAuthenticatorForm: FunctionComponent<CommonPluggableComponentFormPropsInterface> = (
    props
): ReactElement => {

    const {
        metadata,
        initialValues,
        onSubmit,
        triggerSubmit,
        enableSubmitButton
    } = props;

    const getInterpretedFormValue = (propertyMetadata: FederatedAuthenticatorMetaPropertyInterface, values: any,
                                     eachProp: AuthenticatorProperty) => {
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
            let propertyMetadata = metadata.properties?.find(metaProperty => metaProperty.key === eachProp.key);
            if (!propertyMetadata) {
                // Trying to find metadata from sub properties.
                metadata.properties?.map((prop) => {
                    if (prop.subProperties.length > 0 &&
                        prop.subProperties.find(metaSubProp => metaSubProp.key === eachProp.key)) {
                        propertyMetadata = prop.subProperties.find(
                            metaSubProp => metaSubProp.key === eachProp.key);
                    }
                });
            }
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

    const getAuthenticatorPropertyFields = (): ReactElement[] => {
        return initialValues.properties?.map((eachProp: AuthenticatorProperty) => {
            let propertyMetadata = metadata.properties?.find(metaProperty => metaProperty.key === eachProp.key);
            if (!propertyMetadata) {
                // Try to find the metadata in sub properties.
                metadata.properties?.map((meta) => {
                    if (meta.subProperties.length > 0 &&
                        meta.subProperties.find(metaSubProp => metaSubProp.key === eachProp.key)) {
                        propertyMetadata = meta.subProperties.find(
                            metaSubProp => metaSubProp.key === eachProp.key);
                    }
                });
                if (propertyMetadata) {
                    return (
                        <Grid.Row columns={ 2 } key={ propertyMetadata?.displayOrder }>
                            <Grid.Column mobile={ 2 } tablet={ 2 } computer={ 1 }>
                            </Grid.Column>
                            <Grid.Column mobile={ 14 } tablet={ 14 } computer={ 7 }>
                                { getPropertyField(eachProp, propertyMetadata) }
                            </Grid.Column>
                        </Grid.Row>
                    )
                } else {
                    // Todo handle error
                    console.log("Metadata could not be found for the property: " + eachProp.key)
                    return;
                }
            } else {
                return (
                    <Grid.Row columns={ 1 } key={ propertyMetadata?.displayOrder }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            { getPropertyField(eachProp, propertyMetadata) }
                        </Grid.Column>
                    </Grid.Row>
                )
            }
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
        <CommonPluggableComponentForm 
            onSubmit={ onSubmit } 
            initialValues={ initialValues } 
            enableSubmitButton={ enableSubmitButton }
            triggerSubmit={ triggerSubmit }
            metadata={ metadata }
        />
    );
};

CommonAuthenticatorForm.defaultProps = {
    enableSubmitButton: true
};
