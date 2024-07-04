/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { CheckboxFieldAdapter, FinalFormField, FormApi, TextFieldAdapter } from "@wso2is/form";
import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import ApplicationCertificateAdapter from "./custom-fields/application-certificate-adapter";
import { ApplicationInterface } from "../../models";
import { DynamicFieldInterface, DynamicInputFieldTypes } from "../../models/dynamic-fields";

/**
 * Prop types for the dynamic input fields of the application form.
 */
export interface ApplicationFormDynamicFieldPropsInterface extends IdentifiableComponentInterface {
    /**
     * Field configs.
     */
    field: DynamicFieldInterface;
    /**
     * Form state from the form library.
     */
    form: FormApi<Record<string, any>>;
    /**
     * Whether the form field is read only or not.
     */
    readOnly?: boolean;
    /**
     * Data of the current application.
     */
    application?: ApplicationInterface;
    /**
     * Callback to trigger when the application update occurs.
     */
    onApplicationUpdate?: (id: string) => void;
}

/**
 * Component responsible for generating the field based on the provided field configs.
 *
 * @param props - Props injected to the `ApplicationFormDynamicField` component.
 */
export const ApplicationFormDynamicField: FunctionComponent<PropsWithChildren<
    ApplicationFormDynamicFieldPropsInterface
>> = (props: PropsWithChildren<ApplicationFormDynamicFieldPropsInterface>): ReactElement => {
    const {
        field,
        form: _form,
        readOnly,
        application,
        onApplicationUpdate,
        ["data-componentid"]: componentId, ...rest
    } = props;

    const getDynamicFieldAdapter = (type: DynamicInputFieldTypes): ReactElement => {
        switch (type) {
            case DynamicInputFieldTypes.CHECKBOX:
                return (
                    <FinalFormField
                        fullWidth
                        FormControlProps={ {
                            margin: "dense"
                        } }
                        aria-label={ field?.["aria-label"] }
                        data-componentid={ field?.dataComponentId }
                        name={ field?.name }
                        label={ field?.label }
                        placeholder={ field?.placeholder }
                        component={ CheckboxFieldAdapter }
                        disabled={ readOnly || field?.readOnly }
                        required={ field?.required }
                        hint={
                            field?.helperText ? (
                                <Hint compact>
                                    { field?.helperText }
                                </Hint>
                            ) : null
                        }
                    />
                );
            case DynamicInputFieldTypes.TEXT:
                return (
                    <FinalFormField
                        fullWidth
                        FormControlProps={ {
                            margin: "dense"
                        } }
                        aria-label={ field?.["aria-label"] }
                        data-componentid={ field?.dataComponentId }
                        name={ field?.name }
                        type={ field?.type }
                        label={ field?.label }
                        placeholder={ field?.placeholder }
                        component={ TextFieldAdapter }
                        readOnly={ readOnly || field?.readOnly }
                        required={ field?.required }
                        helperText={
                            field?.helperText ? (
                                <Hint compact>
                                    { field?.helperText }
                                </Hint>
                            ) : null
                        }
                    />
                );
            case DynamicInputFieldTypes.TEXTAREA:
                return (
                    <FinalFormField
                        fullWidth
                        FormControlProps={ {
                            margin: "dense"
                        } }
                        aria-label={ field?.["aria-label"] }
                        data-componentid={ field?.dataComponentId }
                        name={ field?.name }
                        type={ field?.type }
                        label={ field?.label }
                        placeholder={ field?.placeholder }
                        component={ TextFieldAdapter }
                        readOnly={ readOnly || field?.readOnly }
                        rows={ 3 }
                        multiline={ true }
                        required={ field?.required }
                        helperText={
                            field?.helperText ? (
                                <Hint compact>
                                    { field?.helperText }
                                </Hint>
                            ) : null
                        }
                    />
                );
            case DynamicInputFieldTypes.APPLICATION_CERTIFICATE:
                if (!application || !onApplicationUpdate) {
                    return null;
                }

                return (
                    <FinalFormField
                        name={ field?.name }
                        component={ ApplicationCertificateAdapter }
                        protocol={ field?.meta?.customFieldProps?.protocol }
                        application={ application }
                        onApplicationUpdate={ onApplicationUpdate }
                        hideJWKS={ field?.meta?.customFieldProps?.hideJWKS }
                        required={ field?.required }
                        readOnly={ readOnly || field?.readOnly }
                    />
                );
            default:
                return (
                    <FinalFormField
                        fullWidth
                        FormControlProps={ {
                            margin: "dense"
                        } }
                        aria-label={ field?.["aria-label"] }
                        data-componentid={ field?.dataComponentId }
                        name={ field?.name }
                        type={ field?.type }
                        label={ field?.label }
                        placeholder={ field?.placeholder }
                        component={ TextFieldAdapter }
                        readOnly={ readOnly || field?.readOnly }
                        required={ field?.required }
                        helperText={
                            field?.helperText ? (
                                <Hint compact>
                                    { field?.helperText }
                                </Hint>
                            ) : null
                        }
                    />
                );
        }
    };

    return (
        <div data-componentid={ componentId } { ...rest }>
            { getDynamicFieldAdapter(field?.type) }
        </div>
    );
};

/**
 * Default props injected to the `ApplicationFormDynamicField` component.
 */
ApplicationFormDynamicField.defaultProps = {
    "data-componentid": "application-form-dynamic-field"
};
