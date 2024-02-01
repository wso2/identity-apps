/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import FormHelperText, { FormHelperTextProps } from "@oxygen-ui/react/FormHelperText";
import React, { ReactElement } from "react";
import { FieldMetaState } from "react-final-form";
import { DynamicField } from "./dynamic-form-field";

export interface ErrorMessageProps {

	/**
	 * Flag to show/hide the error.
	 */
	showError: boolean;
	/**
	 * Meta data object of the field.
	 */
	meta: FieldMetaState<any>;
	/**
	 * Props to be passed down to the `FormHelperText` component 
	 * from `oxygen-ui-react`.
	 */
	formHelperTextProps?: Partial<FormHelperTextProps>;
	/**
	 * Helper text to be shown when there are errors.
	 */
	helperText?: React.ReactNode;
}

export function ErrorMessage({ showError, meta, formHelperTextProps, helperText }: ErrorMessageProps): ReactElement {
    if (showError) {
        return <FormHelperText { ...formHelperTextProps }>{ meta.error || meta.submitError }</FormHelperText>;
    } else if (helperText) {
        return <FormHelperText { ...formHelperTextProps }>{ helperText }</FormHelperText>;
    } else {
        return <></>;
    }
}

export type ShowErrorFunc = (props: ShowErrorProps) => boolean;

export interface ShowErrorProps {
	meta: FieldMetaState<any>;
}

export const showErrorOnChange: ShowErrorFunc = ({
    meta: { submitError, dirtySinceLastSubmit, error, touched, modified }
}: ShowErrorProps) => !!(((submitError && !dirtySinceLastSubmit) || error) && (touched || modified));

export const showErrorOnBlur: ShowErrorFunc = ({
    meta: { submitError, dirtySinceLastSubmit, error, touched }
}: ShowErrorProps) => !!(((submitError && !dirtySinceLastSubmit) || error) && touched);

export const renderFormFields = (fields: Record<string, any>): ReactElement => {

    return fields?.map((fieldProps, index) => (
        <DynamicField.Input
            key={ index }
            name={ fieldProps.name }
            label={ fieldProps.label }
            inputType={ fieldProps.type }
            { ...fieldProps }
        />
    ));
};

export const resolveFieldInitailValue = (meta: FieldMetaState<any>, name: string, values: Partial<any>): any => {
    if (meta?.initial) {
        return meta?.initial;
    } else if (values && values[ name ]) {
        return values[name];
    } else {
        return "";
    }
};
