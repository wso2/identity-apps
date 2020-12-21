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

import { Field, FormValue, Forms } from "@wso2is/forms";
import _ from "lodash";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Grid } from "semantic-ui-react";
import {
    CommonPluggableComponentFormPropsInterface,
    CommonPluggableComponentInterface,
    CommonPluggableComponentMetaPropertyInterface,
    CommonPluggableComponentPropertyInterface
} from "../../../models";
import { getPropertyMetadata } from "../../utils";
import { CommonConstants, FieldType, getFieldType, getPropertyField } from "../helpers";

/**
 * Common pluggable connector configurations form.
 *
 * @param {CommonPluggableComponentFormPropsInterface} props
 * @return { ReactElement }
 */
export const CommonPluggableComponentForm: FunctionComponent<CommonPluggableComponentFormPropsInterface> = (props
): ReactElement => {

    const {
        metadata,
        initialValues,
        onSubmit,
        triggerSubmit,
        enableSubmitButton,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    // Used for field elements which needs to listen for any onChange events in the form.
    const [dynamicValues, setDynamicValues] = useState<CommonPluggableComponentInterface>(undefined);

    const interpretValueByType = (value: FormValue, key: string, type: string) => {

        switch (type?.toUpperCase()) {
            case CommonConstants.BOOLEAN: {
                return value?.includes(key);
            }
            default: {
                return value;
            }
        }
    };

    /**
     * Prepares form values for submit.
     *
     * @param values - Form values.
     * @return {any} Sanitized form values.
     */
    const getUpdatedConfigurations = (values: Map<string, FormValue>): any => {

        const properties = [];

        values?.forEach((value, key) => {
            const propertyMetadata = getPropertyMetadata(key, metadata?.properties);

            if (key !== undefined && !_.isEmpty(value) && key !== "customProperties") {
                properties.push({
                    key: key,
                    value: interpretValueByType(value, key, propertyMetadata?.type)
                });
            }

        });

        const customProperties = values.get("customProperties")?.toString()?.split(",")
            ?.map((customProperty: string) => {
                const keyValuePair = customProperty.split("=");
                return {
                    key: keyValuePair[ 0 ],
                    value: keyValuePair[ 1 ]
                };
            });

        customProperties?.length > 0 && properties.push(...customProperties);

        if (initialValues?.properties) {
            return {
                ...initialValues,
                properties: [...properties]
            };
        } else {
            return {
                ...metadata,
                properties: [...properties]
            };
        }
    };

    /**
     * Check whether provided property is a checkbox and contain sub-properties.
     *
     * @param propertyMetadata Metadata of the property.
     */
    const isCheckboxWithSubProperties = (propertyMetadata: CommonPluggableComponentMetaPropertyInterface): boolean => {

        return propertyMetadata?.subProperties?.length > 0 && getFieldType(propertyMetadata) === FieldType.CHECKBOX;
    };

    const getField = (property: CommonPluggableComponentPropertyInterface,
                      eachPropertyMeta: CommonPluggableComponentMetaPropertyInterface,
                      disable: boolean,
                      isSub?: boolean,
                      testId?: string,
                      listen?: (key: string, values: Map<string, FormValue>) => void):
        ReactElement => {

        if (isSub) {
            return (
                <Grid.Row columns={ 2 } key={ eachPropertyMeta?.displayOrder }>
                    <Grid.Column mobile={ 2 } tablet={ 2 } computer={ 1 }>
                    </Grid.Column>
                    <Grid.Column mobile={ 14 } tablet={ 14 } computer={ 7 }>
                        { getPropertyField(property, eachPropertyMeta, disable, listen, testId) }
                    </Grid.Column>
                </Grid.Row>
            );
        } else {
            return (
                <Grid.Row columns={ 1 } key={ eachPropertyMeta?.displayOrder }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        { getPropertyField(property, eachPropertyMeta, disable, listen, testId) }
                    </Grid.Column>
                </Grid.Row>
            );
        }
    };

    const getSortedPropertyFields = (metaProperties: CommonPluggableComponentMetaPropertyInterface[],
                                     disable: boolean, isSub: boolean):
        ReactElement[] => {

        const bucket: ReactElement[] = [];

        metaProperties?.forEach((metaProperty: CommonPluggableComponentMetaPropertyInterface) => {

            // Ignoring elements with empty display name.
            // Note: This will remove the element from all API requests as well. If an element that is required
            // by the API is removed, that will break the app. In that case, metadata API needs to updated to
            // send a displayName for such required elements.
            if (!_.isEmpty(metaProperty?.displayName)) {
                const property: CommonPluggableComponentPropertyInterface = dynamicValues?.properties?.find(
                    property => property.key === metaProperty.key);

                let field: ReactElement;
                if (!isCheckboxWithSubProperties(metaProperty)) {
                    field = getField(property, metaProperty, disable, isSub, `${ testId }-form`);
                } else {
                    field =
                        <React.Fragment key={ metaProperty?.displayOrder }>
                            {
                                // Render parent property.
                                getField(property, metaProperty, disable, isSub, `${ testId }-form`,
                                    handleParentPropertyChange)
                            }
                            {
                                getSortedPropertyFields(metaProperty?.subProperties,
                                    !(property?.value?.toString()?.toLowerCase() === "true"), true)
                            }
                        </React.Fragment>;
                }

                bucket.push(field);
            }
        });

        return bucket.sort((a, b) => Number(a.key) - Number(b.key));
    };

    /**
     * This returns all the custom properties.
     *
     * @return {CommonPluggableComponentPropertyInterface} Custom Properties - Returns all the custom properties.
     */
    const getCustomProperties = (): string => {
        const values: string[] = [];
        dynamicValues?.properties?.forEach(
            (property: CommonPluggableComponentPropertyInterface) => {
            if (!metadata?.properties?.find(meta => meta.key === property.key)) {
                values.push(property.key+"="+property.value);
            }
        });

        return values.join(", ");
    };

    const handleParentPropertyChange = (key: string, values: Map<string, FormValue>) => {
        setDynamicValues({
            ...dynamicValues,
            properties: dynamicValues?.properties ? dynamicValues?.properties?.map(
                (prop: CommonPluggableComponentPropertyInterface):
                    CommonPluggableComponentPropertyInterface => {
                        return prop.key === key ? {
                            key: key,
                            value: values?.get(key)?.includes(key)?.toString()
                        } : prop;
                }) : [ {
                    key: key,
                    value: values?.get(key)?.includes(key)?.toString()
                } ]
        });
    };

    const getSubmitButton = (content: string) => {
        return (
            <Grid.Row columns={ 1 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                    <Button primary type="submit" size="small" className="form-button"
                            data-testid={ `${ testId }-submit-button` }>
                        { content }
                    </Button>
                </Grid.Column>
            </Grid.Row>
        );
    };

    useEffect(() => {
        setDynamicValues(initialValues);
    }, []);

    return (
        <Forms
            onSubmit={ (values) => {
                onSubmit(getUpdatedConfigurations(values));
            } }
            submitState={ triggerSubmit }
            data-testid={ `${ testId }-form` }
        >
            <Grid>
                { dynamicValues && getSortedPropertyFields(metadata?.properties, false, false) }
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        <Field
                            name="customProperties"
                            label={ t("console:develop.features.idp.forms.common.customProperties") }
                            required={ false }
                            requiredErrorMessage={ t("console:develop.features.idp.forms.common.requiredErrorMessage") }
                            type="queryParams"
                            value={ getCustomProperties() }
                            data-testid={ `${ testId }-${ "customProperties" }` }
                        />
                    </Grid.Column>
                </Grid.Row>
                { enableSubmitButton && getSubmitButton("Update") }
            </Grid>
        </Forms>
    );
};

CommonPluggableComponentForm.defaultProps = {
    enableSubmitButton: true
};
