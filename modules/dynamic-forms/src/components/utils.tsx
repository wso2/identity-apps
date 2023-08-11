/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import React, { ReactElement } from "react";

import { FieldMetaState, FieldProps, useField } from "react-final-form";
import { FormHelperText, FormHelperTextProps } from "@oxygen-ui/react";
import DynamicFormField from "./dynamic-form-field";

export interface ErrorMessageProps {
	showError: boolean;
	meta: FieldMetaState<any>;
	formHelperTextProps?: Partial<FormHelperTextProps>;
	helperText?: React.ReactNode;
}

export function ErrorMessage({ showError, meta, formHelperTextProps, helperText }: ErrorMessageProps) {
	if (showError) {
		return <FormHelperText {...formHelperTextProps}>{meta.error || meta.submitError}</FormHelperText>;
	} else if (helperText) {
		return <FormHelperText {...formHelperTextProps}>{helperText}</FormHelperText>;
	} else {
		return <></>;
	}
}

export type ShowErrorFunc = (props: ShowErrorProps) => boolean;

export interface ShowErrorProps {
	meta: FieldMetaState<any>;
}

const config = {
	subscription: {
		error: true,
		submitError: true,
		dirtySinceLastSubmit: true,
		touched: true,
		modified: true,
	},
};

export const useFieldForErrors = (name: string) => useField(name, config);

export const showErrorOnChange: ShowErrorFunc = ({
	meta: { submitError, dirtySinceLastSubmit, error, touched, modified },
}: ShowErrorProps) => !!(((submitError && !dirtySinceLastSubmit) || error) && (touched || modified));

export const showErrorOnBlur: ShowErrorFunc = ({
	meta: { submitError, dirtySinceLastSubmit, error, touched },
}: ShowErrorProps) => !!(((submitError && !dirtySinceLastSubmit) || error) && touched);

export const renderFormFields = (fields: Record<string, any>): ReactElement => {

    return fields?.map((fieldProps) => (
        <DynamicFormField
            name={ fieldProps.name }
            label={ fieldProps.label }
            type={ fieldProps.type }
            { ...fieldProps }
        />
    ));
};
