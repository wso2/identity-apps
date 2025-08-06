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

import Checkbox from "@oxygen-ui/react/Checkbox";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import TextField from "@oxygen-ui/react/TextField";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import startCase from "lodash-es/startCase";
import React, { ChangeEvent, FunctionComponent, ReactElement } from "react";
import RichText from "./rich-text/rich-text";
import FlowBuilderElementConstants from "../../constants/flow-builder-element-constants";
import { ElementTypes } from "../../models/elements";
import { Resource } from "../../models/resources";

/**
 * Props interface of {@link CommonElementPropertyFactory}
 */
export interface CommonElementPropertyFactoryPropsInterface extends IdentifiableComponentInterface {
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
    propertyValue: any;
    /**
     * The event handler for the property change.
     * @param propertyKey - The key of the property.
     * @param newValue - The new value of the property.
     * @param resource - The resource associated with the property.
     */
    onChange: (propertyKey: string, newValue: any, resource: Resource) => void;
    /**
     * Additional props.
     */
    [ key: string ]: any;
}

/**
 * Factory to generate the common property configurator for the given element.
 *
 * @param props - Props injected to the component.
 * @returns The CommonElementPropertyFactory component.
 */
const CommonElementPropertyFactory: FunctionComponent<CommonElementPropertyFactoryPropsInterface> = ({
    "data-componentid": componentId = "common-element-property-factory",
    resource,
    propertyKey,
    propertyValue,
    onChange,
    ...rest
}: CommonElementPropertyFactoryPropsInterface): ReactElement | null => {
    if (propertyKey === "text") {
        if (resource.type === ElementTypes.RichText) {
            return (
                <RichText
                    onChange={ (html: string) => onChange(`config.${propertyKey}`, html, resource) }
                    resource={ resource }
                    { ...rest }
                />
            );
        }
    }

    if (typeof propertyValue === "boolean") {
        return (
            <FormControlLabel
                control={ <Checkbox checked={ propertyValue } /> }
                label={ startCase(propertyKey) }
                onChange={ (e: ChangeEvent<HTMLInputElement>) =>
                    onChange(`config.${propertyKey}`, e.target.checked, resource)
                }
                data-componentid={ `${componentId}-${propertyKey}` }
                { ...rest }
            />
        );
    }

    if (typeof propertyValue === "string") {
        return (
            <TextField
                fullWidth
                label={ startCase(propertyKey) }
                defaultValue={ propertyValue }
                onChange={ (e: ChangeEvent<HTMLInputElement>) =>
                    onChange(`config.${propertyKey}`, e.target.value, resource)
                }
                placeholder={ `Enter ${startCase(propertyKey)}` }
                data-componentid={ `${componentId}-${propertyKey}` }
                { ...rest }
            />
        );
    }

    if (resource.type == ElementTypes.Captcha) {
        return (
            <TextField
                fullWidth
                label="Provider"
                defaultValue={ FlowBuilderElementConstants.DEFAULT_CAPTCHA_PROVIDER }
                data-componentid={ `${ componentId }-${ propertyKey }` }
                inputProps={ {
                    disabled: true,
                    readOnly: true
                } }
                { ...rest }
            />
        );
    }

    return null;
};

export default CommonElementPropertyFactory;
