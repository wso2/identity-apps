/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import FormControl, { FormControlProps } from "@oxygen-ui/react/FormControl";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import Switch, { SwitchProps } from "@oxygen-ui/react/Switch";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { FieldRenderProps } from "react-final-form";

/**
 * Props for the CheckboxAdapter component.
 */
export interface SwitchFieldAdapterPropsInterface
    extends FieldRenderProps<boolean, HTMLElement, boolean>,
        SwitchProps,
        IdentifiableComponentInterface {
    /**
     * Form control props.
     */
    FormControlProps?: FormControlProps;
}

/**
 * A custom Checkbox adapter for use with React Final Form.
 * This adapter wraps a Material-UI Checkbox component and integrates it with React Final Form.
 *
 * @param props - The component props.
 * @returns The rendered Checkbox component.
 */
const SwitchFieldAdapter: FunctionComponent<SwitchFieldAdapterPropsInterface> = (
    props: SwitchFieldAdapterPropsInterface
): ReactElement => {
    const {
        input,
        meta,
        label,
        hint,
        FormControlProps = {},
        ...rest
    } = props;

    const isError: boolean = (meta.error || meta.submitError) && meta.touched;

    return (
        <FormControl required error={ isError } component="fieldset" variant="standard" { ...FormControlProps }>
            <FormControlLabel
                control={ (
                    <Switch
                        color="primary"
                        { ...input }
                        { ...rest }
                        checked={ (input.value as unknown) as boolean }
                    />
                ) }
                label={ label }
            />
            <FormHelperText id={ `${input.name}-helper-text` }>{ hint }</FormHelperText>
        </FormControl>
    );
};

export default SwitchFieldAdapter;
