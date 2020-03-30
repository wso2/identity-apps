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
import {
    AuthenticatorFormPropsInterface,
    AuthenticatorProperty,
    FederatedAuthenticatorMetaPropertyInterface
} from "../../../../models";

/**
 * Constants for common authenticator.
 */
enum CommonAuthenticatorConstants {
    BOOLEAN = "BOOLEAN"
}

/**
 * Each field type.
 */
enum FieldType {
    CHECKBOX = "CheckBox",
    TEXT = "Text",
    CONFIDENTIAL = "Confidential",
}

/**
 * Google authenticator configurations form.
 *
 * @param {AuthenticatorFormPropsInterface} props
 * @return { ReactElement }
 * @constructor
 */
export const CommonAuthenticatorForm: FunctionComponent<AuthenticatorFormPropsInterface> = (
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
            case CommonAuthenticatorConstants.BOOLEAN: {
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
    const updateConfiguration = (values: any): any => {
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

    const getConfidentialField = (eachProp: AuthenticatorProperty,
                                  propertyMetadata: FederatedAuthenticatorMetaPropertyInterface) => {
        return (
            <Field
                showPassword="Show Secret"
                hidePassword="Hide Secret"
                label={ propertyMetadata?.displayName }
                name={ eachProp?.key }
                placeholder={ propertyMetadata?.description }
                required={ propertyMetadata?.isMandatory }
                requiredErrorMessage={ "This is required" }
                type="password"
            />
        );
    };

    const getCheckboxField = (eachProp: AuthenticatorProperty,
                              propertyMetadata: FederatedAuthenticatorMetaPropertyInterface) => {
        return (
            <Field
                name={ eachProp?.key }
                label={ propertyMetadata?.displayName }
                type="checkbox"
                required={ propertyMetadata?.isMandatory }
                value={ eachProp?.value ? [eachProp?.key] : [] }
                requiredErrorMessage="This is required"
                children={
                    [
                        {
                            label: propertyMetadata?.description,
                            value: eachProp?.key
                        }
                    ]
                }
            />
        );
    };

    const getTextField = (eachProp: AuthenticatorProperty,
                          propertyMetadata: FederatedAuthenticatorMetaPropertyInterface) => {
        return (
            <Field
                name={ eachProp?.key }
                label={ propertyMetadata?.displayName }
                required={ propertyMetadata?.isMandatory }
                requiredErrorMessage="This is required"
                placeholder={ propertyMetadata?.description }
                type="text"
                value={ eachProp?.value }
                key={ eachProp?.key }
            />
        );
    };

    const getFieldType = (propertyMetadata) => {
        if (propertyMetadata?.type?.toUpperCase() === CommonAuthenticatorConstants.BOOLEAN) {
            return FieldType.CHECKBOX;
        } else if (propertyMetadata?.isConfidential) {
            return FieldType.CONFIDENTIAL;
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
            default: {
                return getTextField(eachProp, propertyMetadata);
            }
        }
    };

    const getAuthenticatorPropertyFields = (): ReactElement[] => {
        return initialValues.properties?.map((eachProp: AuthenticatorProperty) => {
            const propertyMetadata = metadata.properties?.find(metaProperty => metaProperty.key === eachProp.key);
            return (
                <Grid.Row columns={ 1 } key={ propertyMetadata?.displayOrder }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        {getPropertyField(eachProp, propertyMetadata)}
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
                onSubmit(updateConfiguration(values));
            } }
            submitState={ triggerSubmit }
        >
            <Grid>
                {getAuthenticatorPropertyFields().sort((a, b) => {
                    return Number(a.key) - Number(b.key);
                })}
                {enableSubmitButton ? getSubmitButton() : null}
            </Grid>
        </Forms>
    );
};

CommonAuthenticatorForm.defaultProps = {
    enableSubmitButton: true
};
