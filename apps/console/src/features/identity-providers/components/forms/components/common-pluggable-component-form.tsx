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
import isEmpty from "lodash-es/isEmpty";
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
export const CommonPluggableComponentForm: FunctionComponent<CommonPluggableComponentFormPropsInterface> = (
    props: CommonPluggableComponentFormPropsInterface
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
    const [ dynamicValues, setDynamicValues ] = useState<CommonPluggableComponentInterface>(undefined);
    const [ customProperties, setCustomProperties ] = useState<string>(undefined);

    const interpretValueByType = (value: FormValue, key: string, type: string) => {
        switch (type?.toUpperCase()) {
            case CommonConstants.BOOLEAN: {
                return value?.includes(key);
            }
            case CommonConstants.RADIO: {
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

            if (key !== undefined && !isEmpty(value) && key !== "customProperties") {
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

    /**
     * Check whether provided property is a radiobutton and contain sub-properties.
     *
     * @param propertyMetadata Metadata of the property.
     */
    const isRadioButtonWithSubProperties = (propertyMetadata: CommonPluggableComponentMetaPropertyInterface): boolean => {
        return propertyMetadata?.subProperties?.length > 0 && getFieldType(propertyMetadata) === FieldType.RADIO;
    };

    const getField = (property: CommonPluggableComponentPropertyInterface,
                      eachPropertyMeta: CommonPluggableComponentMetaPropertyInterface,
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
                        { getPropertyField(property, eachPropertyMeta, listen, testId) }
                    </Grid.Column>
                </Grid.Row>
            );
        } else {
            return (
                <Grid.Row columns={ 1 } key={ eachPropertyMeta?.displayOrder }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        { getPropertyField(property, eachPropertyMeta, listen, testId) }
                    </Grid.Column>
                </Grid.Row>
            );
        }
    };

    const getSortedPropertyFields = (metaProperties: CommonPluggableComponentMetaPropertyInterface[], isSub: boolean):
        ReactElement[] => {

        const bucket: ReactElement[] = [];

        metaProperties?.forEach((metaProperty: CommonPluggableComponentMetaPropertyInterface) => {

            // Ignoring elements with empty display name.
            // Note: This will remove the element from all API requests as well. If an element that is required
            // by the API is removed, that will break the app. In that case, metadata API needs to updated to
            // send a displayName for such required elements.
            if (!isEmpty(metaProperty?.displayName)) {
                const property: CommonPluggableComponentPropertyInterface = dynamicValues?.properties?.find(
                    property => property.key === metaProperty.key);
                let field: ReactElement;
                if (!isCheckboxWithSubProperties(metaProperty)) {
                    field = getField(property, metaProperty, isSub, `${testId}-form`, handleParentPropertyChange);
                } else if (isRadioButtonWithSubProperties(metaProperty)) {
                    field =
                        <React.Fragment key={ metaProperty?.key }>
                            {
                                // Render parent property.
                                getField(property, metaProperty, isSub, `${ testId }-form`,
                                    handleParentPropertyChange)
                            }
                        </React.Fragment>;
                } else {
                    field =
                        <React.Fragment key={ metaProperty?.key }>
                            {
                                // Render parent property.
                                getField(property, metaProperty, isSub, `${ testId }-form`,
                                    handleParentPropertyChange)
                            }
                            {
                                getSortedPropertyFields(metaProperty?.subProperties, true)
                            }
                        </React.Fragment>;
                }

                bucket.push(field);
            }
        });

        return bucket.sort((a, b) => Number(a.key) - Number(b.key));
    };

    const triggerAlgorithmSelectionDropdowns = (key: string, values: Map<string, FormValue>) => {

        /**
         * Hold on! before you ask why? Just READ this!
         * --
         *
         * let X be two checkboxes. Form keys:  "IsLogoutReqSigned", "ISAuthnReqSigned"
         * let Y be a dropdown.     Form Key:   "SignatureAlgorithm"
         * let Z be a dropdown.     Form Key:   "DigestAlgorithm"
         *
         * Say Y & Z depends on X's state:-
         *
         *    Requirement is that Y and Z should be enabled only when one of X is enabled.
         *    In the initial form render we need to disable the fields based on the above
         *    condition. The fun part is based on X's state how can we trigger Y, Z
         *    state? Ha! you've come to the wrong place but you are in the right place NOW?!
         *
         * So, do we have a solution?
         * --
         *
         * We can listen the change and check whether X has been changed and its current
         * value. If X's is enabled then we need to dynamically enable the dropdown fields.
         * {@link handleParentPropertyChange} calls when a field has been changed but not
         * in the initial run. In order to get it working we need to do some unorthodox
         * wizardry that is even unacceptable by dear god.
         *
         * Why include this logic here instead of above component?
         * --
         *
         * Good question! I also keep asking this from others and myself. Good luck out
         * there mate! But you may ask, why can't you take the state and events up
         * to the component tree? Ha! funny enough all IdPs depends on this component
         * to render it's authenticator settings. Taking state and events upwards
         * will make this more complicated. So, feel free to explore...
         *
         * Currently, these fields are being auto generated and programmed to handle state
         * only one-way. The only proper solution to this is to, separate the concerns
         * and make an individual idp do only one thing correctly. Instead of depending
         * on common components. These components didn't chose the bug life but the bug
         * life chose them xD.
         *
         * List of unknown things?!
         * --
         *      - Can user update the form it self only by enabling the checkbox?
         *      - What happens when there's no default value to the field?
         *      - But can we assign a default value to the meta prop object?
         *      - Can we ensure the state will refresh and re-render after a metadata update?
         *      - Why form state represents API's structure?
         *
         * This is what happens when you abstract things to the point where you can't
         * implement a basic logical condition that was invented in 1918. Below this point
         * you will see a specific logic tied to SAML protocol fields. But this is the
         * only way we can ensure that values have the proper state in the form based on
         * the current state.
         *
         * PS: np thank me later! append(:joy)
         */

        if (key === "IsLogoutReqSigned" || key === "ISAuthnReqSigned") {

            // I'm easing your life to navigate this append(:poop)
            const enableField = (formKey: string): void => {
                const props = metadata
                    .properties
                    .find(({ key }) => key === formKey);
                if (props) props.isDisabled = false;
            };

            const disableField = (formKey: string): void => {
                const props = metadata
                    .properties
                    .find(({ key }) => key === formKey);
                if (props) props.isDisabled = true;
            };

            // See? how simple! even torvalds would love this! xD
            const isChecked = (value: FormValue): boolean =>
                value &&
                (Array.isArray(value) && value.length > 0) ||
                (typeof value === "string" && value == "true");

            const logoutRequestSigned: FormValue = values.get("IsLogoutReqSigned");
            const authenticationRequestSigned: FormValue = values.get("ISAuthnReqSigned");

            if (isChecked(logoutRequestSigned) || isChecked(authenticationRequestSigned)) {
                enableField("SignatureAlgorithm");
                enableField("DigestAlgorithm");
            } else {
                disableField("SignatureAlgorithm");
                disableField("DigestAlgorithm");
            }

        }

    };

    const changeUserIdInClaimCheckboxLabelBasedOnValue = (key: string, values: Map<string, FormValue>) => {

        const TARGET_FORM_KEY = "IsUserIdInClaims";

        if (key === TARGET_FORM_KEY) {

            const changeLabel = (to: string): void => {
                const props = metadata
                    .properties
                    .find(({ key }) => key === TARGET_FORM_KEY);
                if (props) props.displayName = to;
            };

            const isChecked = (value: FormValue): boolean =>
                value &&
                (Array.isArray(value) && value.length > 0) ||
                (typeof value === "string" && value == "true");

            if (isChecked(values.get(TARGET_FORM_KEY))) {
                changeLabel("Use NameID as the User Identifier");
            } else {
                changeLabel("User Identifier found among claims");
            }

        }

    };

    const handleParentPropertyChange = (key: string, values: Map<string, FormValue>) => {

        triggerAlgorithmSelectionDropdowns(key, values);
        changeUserIdInClaimCheckboxLabelBasedOnValue(key, values);

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

        const initialFormValues = initialValues.properties.reduce((values, {  key, value }) => {
            return values.set(key, value);
        }, new Map<string, FormValue>())

        triggerAlgorithmSelectionDropdowns("IsLogoutReqSigned", initialFormValues);
        triggerAlgorithmSelectionDropdowns("ISAuthnReqSigned", initialFormValues);
        changeUserIdInClaimCheckboxLabelBasedOnValue("IsUserIdInClaims", initialFormValues);

    }, []);

    /**
 * This set all the custom properties.
 */
    useEffect(() => {
        if (!dynamicValues) {
            return;
        }
        const values: string[] = [];
        dynamicValues?.properties?.forEach(
            (property: CommonPluggableComponentPropertyInterface) => {
                if (!metadata?.properties?.find(meta => meta.key === property.key)) {
                    values.push(property.key + "=" + property.value);
                }
            });

        setCustomProperties(values.join(", "));
    }, [ dynamicValues ]);

    return (
        <Forms
            onSubmit={ (values) => {
                onSubmit(getUpdatedConfigurations(values));
            } }
            submitState={ triggerSubmit }
            data-testid={ `${ testId }-form` }
        >
            <Grid>
                { dynamicValues && getSortedPropertyFields(metadata?.properties, false) }
                { customProperties && (
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Field
                                name="customProperties"
                                label={ t("console:develop.features.authenticationProvider.forms.common." +
                                    "customProperties") }
                                required={ false }
                                requiredErrorMessage={ t("console:develop.features.authenticationProvider.forms." +
                                    "common.requiredErrorMessage") }
                                type="queryParams"
                                value={ customProperties }
                                data-testid={ `${ testId }-${ "customProperties" }` }
                            />
                        </Grid.Column>
                    </Grid.Row>
                ) }
                { enableSubmitButton && getSubmitButton("Update") }
            </Grid>
        </Forms>
    );
};

CommonPluggableComponentForm.defaultProps = {
    enableSubmitButton: true
};
