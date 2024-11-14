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

import Button from "@oxygen-ui/react/Button";
import Checkbox from "@oxygen-ui/react/Checkbox";
import FormControl from "@oxygen-ui/react/FormControl";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import FormLabel from "@oxygen-ui/react/FormLabel";
import PhoneNumberInput from "@oxygen-ui/react/PhoneNumberInput";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import TextField from "@oxygen-ui/react/TextField";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Node } from "@xyflow/react";
import React, { FunctionComponent, ReactElement } from "react";
import { Component, ComponentTypes } from "../../models/component";
import { ElementCategories } from "../../models/elements";
import "./step-node.scss";

/**
 * Props interface of {@link NodeFactory}
 */
export interface NodeFactoryPropsInterface extends IdentifiableComponentInterface {
    node: Component;
}

/**
 * Node for representing an empty step in the authentication flow.
 *
 * @param props - Props injected to the component.
 * @returns Step Node component.
 */
export const NodeFactory: FunctionComponent<NodeFactoryPropsInterface> = ({
    node
}: NodeFactoryPropsInterface & Node): ReactElement => {
    if (node.category === ElementCategories.Component) {
        if (
            node.type === ComponentTypes.Text ||
            node.type === ComponentTypes.Password ||
            node.type === ComponentTypes.Number ||
            node.type === ComponentTypes.Email
        ) {
            return (
                <TextField
                    fullWidth
                    className={ node.config?.field?.className }
                    defaultValue={
                        node.config?.field?.defaultValue?.i18nKey || node.config?.field?.defaultValue?.fallback
                    }
                    helperText={ node.config?.field?.hint?.i18nKey || node.config?.field?.hint?.fallback }
                    inputProps={ {
                        maxLength: node.config?.field?.maxLength,
                        minLength: node.config?.field?.minLength
                    } }
                    label={ node.config?.field?.label?.i18nKey || node.config?.field?.label?.fallback }
                    multiline={ node.config?.field?.multiline }
                    placeholder={
                        node.config?.field?.placeholder?.i18nKey || node.config?.field?.placeholder?.fallback || ""
                    }
                    required={ node.config?.field?.required }
                    type={ node.config?.field?.type }
                    style={ node.config?.styles }
                />
            );
        } else if (node.type === ComponentTypes.Telephone) {
            return (
                <PhoneNumberInput
                    className={ node.config?.field?.className }
                    label={ node.config?.field?.label?.i18nKey || node.config?.field?.label?.fallback }
                    placeholder={
                        node.config?.field?.placeholder?.i18nKey || node.config?.field?.placeholder?.fallback || ""
                    }
                />
            );
        } else if (node.type === ComponentTypes.Checkbox) {
            return (
                <FormControlLabel
                    control={ <Checkbox defaultChecked /> }
                    className={ node.config?.field?.className }
                    defaultValue={
                        node.config?.field?.defaultValue?.i18nKey || node.config?.field?.defaultValue?.fallback
                    }
                    label={ node.config?.field?.label?.i18nKey || node.config?.field?.label?.fallback }
                    placeholder={
                        node.config?.field?.placeholder?.i18nKey || node.config?.field?.placeholder?.fallback || ""
                    }
                    required={ node.config?.field?.required }
                    style={ node.config?.styles }
                />
            );
        } else if (node.type === ComponentTypes.Choice) {
            return (
                <FormControl sx={ { my: 2 } }>
                    <FormLabel id={ node.config?.field?.id }>
                        { node.config?.field?.label?.i18nKey || node.config?.field?.label?.fallback }
                    </FormLabel>
                    <RadioGroup
                        defaultValue={
                            node.config?.field?.defaultValue?.i18nKey || node.config?.field?.defaultValue?.fallback
                        }
                    >
                        { node.config?.field?.options?.map((option, index) => (
                            <FormControlLabel
                                key={ option?.id }
                                value={ option.value }
                                control={ <Radio /> }
                                label={ option.label?.i18nKey || option.label?.fallback }
                            />
                        )) }
                    </RadioGroup>
                </FormControl>
            );
        } else if (node.type === ComponentTypes.Button) {
            return (
                <Button variant="contained" sx={ { my: 2 } }>
                    { node.config?.field?.label?.i18nKey || node.config?.field?.label?.fallback }
                </Button>
            );
        }
    }

    return null;
};

export default NodeFactory;
