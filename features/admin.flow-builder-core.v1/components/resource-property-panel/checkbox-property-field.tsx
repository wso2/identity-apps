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

import Box from "@oxygen-ui/react/Box";
import Checkbox from "@oxygen-ui/react/Checkbox";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import startCase from "lodash-es/startCase";
import React, { ChangeEvent, FunctionComponent, ReactElement, useMemo } from "react";
import useValidationStatus from "../../hooks/use-validation-status";
import { Resource } from "../../models/resources";

/**
 * Props interface of {@link CheckboxPropertyField}
 */
export interface CheckboxPropertyFieldPropsInterface extends IdentifiableComponentInterface {
    /**
     * The resource associated with the property.
     */
    resource: Resource;
    /**
     * The key of the property.
     */
    propertyKey: string;
    /**
     * The value of the property.
     */
    propertyValue: boolean;
    /**
     * The event handler for the property change.
     * @param propertyKey - The key of the property.
     * @param newValue - The new value of the property.
     * @param resource - The resource associated with the property.
     */
    onChange: (propertyKey: string, newValue: any, resource: Resource) => void;
}

/**
 * Checkbox property field component for rendering checkbox input fields.
 *
 * @param props - Props injected to the component.
 * @returns The CheckboxPropertyField component.
 */
const CheckboxPropertyField: FunctionComponent<CheckboxPropertyFieldPropsInterface> = ({
    "data-componentid": componentId = "checkbox-property-field",
    resource,
    propertyKey,
    propertyValue,
    onChange,
    ...rest
}: CheckboxPropertyFieldPropsInterface): ReactElement => {
    const { selectedNotification } = useValidationStatus();

    /**
     * Get the error message for the checkbox property field.
     */
    const errorMessage: string = useMemo(() => {
        const key: string = `${resource?.id}_${propertyKey}`;

        if (selectedNotification?.hasResourceFieldNotification(key)) {
            return selectedNotification?.getResourceFieldNotification(key);
        }

        return "";
    }, [ resource, selectedNotification ]);

    return (
        <Box>
            <FormControlLabel
                control={ (
                    <Checkbox
                        checked={ propertyValue }
                        color={ errorMessage ? "error" : "primary" }
                    />
                ) }
                label={ startCase(propertyKey) }
                onChange={ (e: ChangeEvent<HTMLInputElement>) =>
                    onChange(`config.${propertyKey}`, e.target.checked, resource)
                }
                data-componentid={ `${componentId}-${propertyKey}` }
                { ...rest }
            />
            {
                errorMessage && (
                    <FormHelperText error>
                        { errorMessage }
                    </FormHelperText>
                )
            }
        </Box>
    );
};

export default CheckboxPropertyField;
