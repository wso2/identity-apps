/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import { Show } from "@wso2is/access-control";
import { AppState, FeatureConfigInterface } from "@wso2is/admin.core.v1";
import { Field, FormValue, Forms } from "@wso2is/forms";
import isEmpty from "lodash-es/isEmpty";
import isUndefined from "lodash-es/isUndefined";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button, Grid } from "semantic-ui-react";
import { ConnectionManagementConstants } from "../../../../constants/connection-constants";
import { AuthenticatorSettingsFormModes } from "../../../../models/authenticators";
import {
    CommonPluggableComponentFormPropsInterface,
    CommonPluggableComponentInterface,
    CommonPluggableComponentMetaPropertyInterface,
    CommonPluggableComponentPropertyInterface
} from "../../../../models/connection";
import { getPropertyMetadata } from "../../../../utils/common-pluggable-component-utils";
import { CommonConstants, FieldType, getFieldType, getPropertyField } from "../helpers";

/**
 * Common pluggable connector configurations form.
 *
 * @param props - CommonPluggableComponentFormPropsInterface
 * @returns ReactElement
 */
export const CommonPluggableComponentForm: FunctionComponent<CommonPluggableComponentFormPropsInterface> = (
    props: CommonPluggableComponentFormPropsInterface
): ReactElement => {

    const {
        metadata,
        mode,
        initialValues,
        onSubmit,
        triggerSubmit,
        enableSubmitButton,
        showCustomProperties,
        readOnly,
        isSubmitting,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const featureConfig : FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    // Used for field elements which needs to listen for any onChange events in the form.
    const [ dynamicValues, setDynamicValues ] = useState<CommonPluggableComponentInterface>(undefined);
    const [ customProperties, setCustomProperties ] = useState<string>(undefined);
    const [ privateKeyValue, setPrivateKeyValue ] = useState<string>(undefined);

    useEffect(() => {
        dynamicValues?.properties?.map(
            (prop: CommonPluggableComponentPropertyInterface) =>
            {
                if (prop?.key === ConnectionManagementConstants.GOOGLE_PRIVATE_KEY) {
                    setPrivateKeyValue(prop?.value);
                }
            }
        );
    },[ dynamicValues ]);

    const interpretValueByType = (value: FormValue, key: string, type: string) => {
        switch (type?.toUpperCase()) {
            case CommonConstants.BOOLEAN: {
                if (key === ConnectionManagementConstants.USER_ID_IN_CLAIMS) {
                    return value;
                } else {
                    return value?.includes(key);
                }
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
     * @returns Sanitized form values.
     */
    const getUpdatedConfigurations = (values: Map<string, FormValue>): any => {
        const properties: any[] = [];
        const resolvedCustomProperties: string | string[] = showCustomProperties
            ? values.get("customProperties")
            : customProperties;

        values?.forEach((value: FormValue, key: string) => {
            const propertyMetadata: CommonPluggableComponentMetaPropertyInterface = getPropertyMetadata(
                key, metadata?.properties);

            const processedValue: string = !isEmpty(key) && !isUndefined(value) &&
                interpretValueByType(value, key, propertyMetadata?.type).toString();

            if (!isEmpty(processedValue) && key !== "customProperties") {
                properties.push({
                    key: key,
                    value: processedValue
                });
            }

            if (
                (
                    // Check whether the values has the google private key.
                    !values.has(ConnectionManagementConstants.GOOGLE_PRIVATE_KEY)
                    // Check whether the property values list does not have the google private key-value pair.
                    && !properties?.find(
                        (item: CommonPluggableComponentPropertyInterface) =>
                            (item?.key === ConnectionManagementConstants.GOOGLE_PRIVATE_KEY))
                    // Check whether the properties key-value pair has the value undefined.
                    && properties?.find(
                        (item: CommonPluggableComponentPropertyInterface) => (
                            item?.key === ConnectionManagementConstants.GOOGLE_PRIVATE_KEY
                            && item?.value !== undefined
                        )
                    )
                ) || (
                    // // Check whether the properties key-value pair has an already added google private key.
                    !properties?.find(
                        (item: CommonPluggableComponentPropertyInterface) =>
                            (item?.key === ConnectionManagementConstants.GOOGLE_PRIVATE_KEY))
                        && privateKeyValue !== undefined
                )
            ){
                properties.push({
                    key: ConnectionManagementConstants.GOOGLE_PRIVATE_KEY,
                    value: privateKeyValue
                });
            }
        });

        const modifiedCustomProperties: any = !isEmpty(resolvedCustomProperties) ?
            resolvedCustomProperties?.toString()?.split(", ")?.map(
                (customProperty: string) => {
                    const keyValuePair: string[] = customProperty.split("=");

                    return {
                        key: keyValuePair[ 0 ],
                        value: keyValuePair[ 1 ]
                    };
                }) : [];

        modifiedCustomProperties?.length > 0 && properties.push(...modifiedCustomProperties);

        if (initialValues?.properties) {
            return {
                ...initialValues,
                properties: [ ...properties ]
            };
        } else {
            return {
                ...metadata,
                properties: [ ...properties ]
            };
        }
    };

    /**
     * Check whether provided property is a checkbox and contain sub-properties.
     *
     * @param propertyMetadata - Metadata of the property.
     */
    const isCheckboxWithSubProperties = (propertyMetadata: CommonPluggableComponentMetaPropertyInterface): boolean => {
        return propertyMetadata?.subProperties?.length > 0
            && getFieldType(propertyMetadata, mode) === FieldType.CHECKBOX;
    };

    /**
     * Check whether provided property is a radiobutton and contain sub-properties.
     *
     * @param propertyMetadata - Metadata of the property.
     */
    const isRadioButtonWithSubProperties = (propertyMetadata
        : CommonPluggableComponentMetaPropertyInterface): boolean => {
        return propertyMetadata?.subProperties?.length > 0 && getFieldType(propertyMetadata, mode) === FieldType.RADIO;
    };

    /**
     * Check whether additional query parameters has scopes defined.
     *
     */
    const isScopesDefined = (): boolean => {
        return !!(initialValues?.properties?.find(
            (queryParam: CommonPluggableComponentPropertyInterface) =>
                queryParam.key === CommonConstants.QUERY_PARAMETERS_KEY)?.
            value?.toLowerCase().includes("scope="));
    };

    /**
     * Check whether Scopes field is empty.
     *
     */
    const isScopesEmpty = (): boolean => {
        return isEmpty(initialValues?.properties?.find(
            (scopes: CommonPluggableComponentPropertyInterface) =>
                scopes.key === CommonConstants.FIELD_COMPONENT_SCOPES)?.value);
    };

    const getField = (property: CommonPluggableComponentPropertyInterface,
        eachPropertyMeta: CommonPluggableComponentMetaPropertyInterface,
        isSub?: boolean,
        testId?: string,
        listen?: (key: string, values: Map<string, FormValue>) => void,
        onCertificateChange?: ( newFile: string) => void):
        ReactElement => {

        if (isSub) {
            return (
                <Grid.Row columns={ 2 } key={ eachPropertyMeta?.displayOrder }>
                    <Grid.Column mobile={ 2 } tablet={ 2 } computer={ 1 }>
                    </Grid.Column>
                    <Grid.Column mobile={ 14 } tablet={ 14 } computer={ 7 }>
                        {
                            getPropertyField(
                                property,
                                {
                                    ...eachPropertyMeta,
                                    readOnly: mode === AuthenticatorSettingsFormModes.CREATE ? false : readOnly
                                },
                                mode,
                                listen,
                                testId
                            )
                        }
                    </Grid.Column>
                </Grid.Row>
            );
        } else if (eachPropertyMeta?.key === ConnectionManagementConstants.GOOGLE_PRIVATE_KEY) {
            return (
                (<Grid.Row key={ eachPropertyMeta?.displayOrder }>
                    <Grid.Column computer={ 16 }>
                        {
                            getPropertyField(
                                property,
                                {
                                    ...eachPropertyMeta,
                                    readOnly: mode === AuthenticatorSettingsFormModes.CREATE ? false : readOnly
                                },
                                mode,
                                listen,
                                testId,
                                onCertificateChange
                            )
                        }
                    </Grid.Column>
                </Grid.Row>
                )
            );
        } else {
            return (
                <Grid.Row columns={ 1 } key={ eachPropertyMeta?.displayOrder }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                        {
                            getPropertyField(
                                property,
                                {
                                    ...eachPropertyMeta,
                                    readOnly: mode === AuthenticatorSettingsFormModes.CREATE ? false : readOnly
                                },
                                mode,
                                listen,
                                testId
                            )
                        }
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
                    (property: CommonPluggableComponentPropertyInterface) => property.key === metaProperty.key);
                let field: ReactElement;

                if (!isCheckboxWithSubProperties(metaProperty)) {
                    if (metaProperty?.key === CommonConstants.FIELD_COMPONENT_SCOPES
                        && !isScopesDefined() && isScopesEmpty()) {
                        const updatedProperty: CommonPluggableComponentPropertyInterface = {
                            key: CommonConstants.FIELD_COMPONENT_SCOPES,
                            value: metaProperty.defaultValue
                        };

                        field = getField(updatedProperty, metaProperty, isSub,
                            `${ testId }-form`, handleParentPropertyChange);
                    } else {
                        field = getField(property, metaProperty, isSub, `${ testId }-form`,
                            handleParentPropertyChange, onCertificateChange);
                    }
                } else if (isRadioButtonWithSubProperties(metaProperty)) {
                    field =
                        (<React.Fragment key={ metaProperty?.key }>
                            {
                                // Render parent property.
                                getField(property, metaProperty, isSub, `${ testId }-form`,
                                    handleParentPropertyChange)
                            }
                        </React.Fragment>);
                } else {
                    field =
                        (<React.Fragment key={ metaProperty?.key }>
                            {
                                // Render parent property.
                                getField(property, metaProperty, isSub, `${ testId }-form`,
                                    handleParentPropertyChange)
                            }
                            {
                                getSortedPropertyFields(metaProperty?.subProperties, false)
                            }
                        </React.Fragment>);
                }

                bucket.push(field);
            }
        });

        return bucket.sort((field1: ReactElement, field2: ReactElement) => Number(field1.key) - Number(field2.key));
    };

    const triggerAlgorithmSelectionDropdowns = (key: string, values: Map<string, FormValue>) => {

        if (key === "IsLogoutReqSigned" || key === "ISAuthnReqSigned") {

            const enableField = (formKey: string): void => {
                const props: CommonPluggableComponentMetaPropertyInterface = metadata?.properties?.find(
                    ({ key }: { key: string }) => key === formKey);

                if (props) props.isDisabled = false;
            };

            const disableField = (formKey: string): void => {
                const props: CommonPluggableComponentMetaPropertyInterface = metadata?.properties?.find(
                    ({ key }: { key: string }) => key === formKey);

                if (props) props.isDisabled = true;
            };

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


    const handleParentPropertyChange = (key: string, values: Map<string, FormValue>) => {

        triggerAlgorithmSelectionDropdowns(key, values);

        if (!dynamicValues) {
            return;
        }

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

    const onCertificateChange = (certificateContent: string) => {
        setPrivateKeyValue(certificateContent);
    };

    const getSubmitButton = (content: string) => {
        return (
            <Grid.Row columns={ 1 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                    <Show when={ featureConfig?.identityProviders?.scopes?.update }>
                        <Button
                            primary
                            type="submit"
                            size="small"
                            className="form-button"
                            isSubmitting={ isSubmitting }
                            loading={ isSubmitting }
                            data-testid={ `${ testId }-submit-button` }
                        >
                            { content }
                        </Button>
                    </Show>
                </Grid.Column>
            </Grid.Row>
        );
    };

    useEffect(() => {

        setDynamicValues(initialValues);

        const initialFormValues: Map<string, FormValue> = initialValues?.properties?.reduce(
            (values: Map<string, FormValue>, { key, value }: { key: string; value: string }) => {
                return values.set(key, value);
            }, new Map<string, FormValue>()) || new Map<string, FormValue>();

        triggerAlgorithmSelectionDropdowns("IsLogoutReqSigned", initialFormValues);
        triggerAlgorithmSelectionDropdowns("ISAuthnReqSigned", initialFormValues);

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
                if (isEmpty(property.key) || isEmpty(property.value)) {
                    return;
                }

                // Check whether the property is not in the metadata.
                if (!metadata?.properties?.find(
                    (meta: CommonPluggableComponentMetaPropertyInterface) => meta.key === property.key)) {
                    values.push(property.key + "=" + property.value);
                }
            });
        setCustomProperties(values.join(", "));
    }, [ dynamicValues ]);

    return (
        <Forms
            onSubmit={ (values: Map<string, FormValue>) => {
                onSubmit(getUpdatedConfigurations(values));
            } }
            submitState={ triggerSubmit }
            data-testid={ `${ testId }-form` }
        >
            <Grid padded>
                { getSortedPropertyFields(metadata?.properties, false) }
                { showCustomProperties && customProperties && (
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Field
                                name="customProperties"
                                label={ t("authenticationProvider:forms.common." +
                                    "customProperties") }
                                required={ false }
                                requiredErrorMessage={ t("authenticationProvider:forms." +
                                    "common.requiredErrorMessage") }
                                type="queryParams"
                                value={ customProperties }
                                data-testid={ `${ testId }-${ "customProperties" }` }
                                readOnly={ readOnly }
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
