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
import { CommonConstants, FieldType, getFieldType, getPropertyField } from "../helpers";
import {
    CommonPluggableComponentFormPropsInterface,
    CommonPluggableComponentMetaPropertyInterface,
    CommonPluggableComponentPropertyInterface
} from "../../../../models";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Forms } from "@wso2is/forms";
import { PropertyFieldFactory } from "../factories/property-field-factory";
import { ComplexField } from "./complex-field";

interface SubPropertyController {
    parentId: string;
    disable: boolean;
    setDisable: React.Dispatch<any>;
}


/**
 * Common pluggable connector configurations form.
 *
 * @param {CommonPluggableComponentFormPropsInterface} props
 * @return { ReactElement }
 */
export const CommonPluggableComponentForm: FunctionComponent<
    CommonPluggableComponentFormPropsInterface> = (props
): ReactElement => {

    const {
        metadata,
        initialValues,
        onSubmit,
        triggerSubmit,
        enableSubmitButton
    } = props;

    const [ subPropertyControllers, setSubPropertyControllers ] = useState<SubPropertyController[]>([]);
    const [ renderProps, setRenderProps ] = useState<boolean>(false);

    const interpretValueByType = (value: any, key: string, type: string) => {

        switch (type.toUpperCase()) {
            case CommonConstants.BOOLEAN: {
                return value?.includes(key);
            }
            default: {
                return value
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
                value: interpretValueByType(values.get(eachProp?.key), eachProp?.key, propertyMetadata?.type)
            };
        });
        return {
            ...initialValues,
            properties: [...properties]
        };
    };

    /**
     * Check whether provided property has supported sub properties. Sub properties are supported, only if the
     * provided property is a checkbox.
     *
     * @param propertyMetadata Metadata of the property.
     */
    const isSupportedSubProperty = (propertyMetadata: CommonPluggableComponentMetaPropertyInterface): boolean => {

        return propertyMetadata?.subProperties?.length > 0 && getFieldType(propertyMetadata) === FieldType.CHECKBOX;
    };

    const getField = (eachPropertyMeta: CommonPluggableComponentMetaPropertyInterface, 
                      property: CommonPluggableComponentPropertyInterface): ReactElement => {

        return (
            <Grid.Row columns={ 1 } key={ eachPropertyMeta?.displayOrder }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                    { getPropertyField(property, eachPropertyMeta) }
                </Grid.Column>
            </Grid.Row>
        );
    }

    const getSortedPropertyFields = (metaProperties: CommonPluggableComponentMetaPropertyInterface[],
                                     disabled: boolean): ReactElement[] => {
        const bucket: ReactElement[] = [];

        metaProperties?.forEach((eachPropertyMeta: CommonPluggableComponentMetaPropertyInterface) => {
            
            const property: CommonPluggableComponentPropertyInterface = initialValues?.properties?.find(property => 
                property.key === eachPropertyMeta.key);

            let field: ReactElement;
            if (!isSupportedSubProperty(eachPropertyMeta)) {
                field = getField(eachPropertyMeta, property);
            } else {
                // field = getFieldWithSubProperties(eachPropertyMeta, property, eachPropertyMeta?.subProperties);
                field = <ComplexField>
                    { getField(eachPropertyMeta, property) }
                </ComplexField>;
            }

            bucket.push(field);
        });

        return bucket.sort((a, b) => Number(a.key) - Number(b.key));
    };

    const getSubmitButton = (content: string) => {
        return (
            <Grid.Row columns={ 1 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                    <Button primary type="submit" size="small" className="form-button">
                        { content }
                    </Button>
                </Grid.Column>
            </Grid.Row>
        );
    };

    const getPropertyFields = () => {
        return getSortedPropertyFields(metadata?.properties, false)
    };

    return (
        <Forms
            onSubmit={ (values) => {
                onSubmit(getUpdatedConfigurations(values));
            } }
            submitState={ triggerSubmit }
            // onChange={ () => {} }
        >
            <Grid>
                {
                   getPropertyFields()
                }
                { enableSubmitButton && getSubmitButton("Update") }
            </Grid>
        </Forms>
    );
};

CommonPluggableComponentForm.defaultProps = {
    enableSubmitButton: true
};
