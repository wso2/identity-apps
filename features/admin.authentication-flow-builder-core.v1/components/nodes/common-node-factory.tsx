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

import Box from "@oxygen-ui/react/Box";
import Button, { ButtonProps } from "@oxygen-ui/react/Button";
import Checkbox from "@oxygen-ui/react/Checkbox";
import Divider, { DividerProps } from "@oxygen-ui/react/Divider";
import FormControl from "@oxygen-ui/react/FormControl";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import FormLabel from "@oxygen-ui/react/FormLabel";
import PhoneNumberInput from "@oxygen-ui/react/PhoneNumberInput";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Encode } from "@wso2is/core/utils";
import { Node } from "@xyflow/react";
import parse, { domToReact } from "html-react-parser";
import Mustache from "mustache";
import React, { FunctionComponent, ReactElement } from "react";
import { FieldOption } from "../../models/base";
import { ButtonVariants, Component, ComponentTypes, DividerVariants, InputVariants } from "../../models/component";

/**
 * Props interface of {@link CommonNodeFactory}
 */
export interface CommonNodeFactoryPropsInterface extends IdentifiableComponentInterface {
    /**
     * The flow id of the node.
     */
    nodeId: string;
    /**
     * The node properties.
     */
    node: Component;
}

/**
 * Node for representing an empty step in the authentication flow.
 *
 * @param props - Props injected to the component.
 * @returns Step Node component.
 */
export const CommonNodeFactory: FunctionComponent<CommonNodeFactoryPropsInterface> = ({
    node
}: CommonNodeFactoryPropsInterface & Node): ReactElement => {
    if (node.type === ComponentTypes.Input) {
        if (node.variant === InputVariants.Checkbox) {
            return (
                <FormControlLabel
                    control={ <Checkbox defaultChecked /> }
                    className={ node.config?.field?.className }
                    defaultValue={ node.config?.field?.defaultValue }
                    label={ node.config?.field?.label }
                    placeholder={ node.config?.field?.placeholder || "" }
                    required={ node.config?.field?.required }
                    style={ node.config?.styles }
                />
            );
        }

        if (node.variant === InputVariants.Telephone) {
            return (
                <PhoneNumberInput
                    className={ node.config?.field?.className }
                    label={ node.config?.field?.label }
                    placeholder={ node.config?.field?.placeholder || "" }
                />
            );
        }

        return (
            <TextField
                fullWidth
                className={ node.config?.field?.className }
                defaultValue={ node.config?.field?.defaultValue }
                helperText={ node.config?.field?.hint }
                inputProps={ {
                    maxLength: node.config?.field?.maxLength,
                    minLength: node.config?.field?.minLength
                } }
                label={ node.config?.field?.label }
                multiline={ node.config?.field?.multiline }
                placeholder={ node.config?.field?.placeholder || "" }
                required={ node.config?.field?.required }
                type={ node.config?.field?.type }
                style={ node.config?.styles }
            />
        );
    } else if (node.type === ComponentTypes.Choice) {
        return (
            <FormControl sx={ { my: 2 } }>
                <FormLabel id={ node.config?.field?.id }>{ node.config?.field?.label }</FormLabel>
                <RadioGroup defaultValue={ node.config?.field?.defaultValue }>
                    { node.config?.field?.options?.map((option: FieldOption) => (
                        <FormControlLabel
                            key={ option?.key }
                            value={ option?.value }
                            control={ <Radio /> }
                            label={ option?.label }
                        />
                    )) }
                </RadioGroup>
            </FormControl>
        );
    } else if (node.type === ComponentTypes.Button) {
        let config: ButtonProps = {};

        if (node.variant === ButtonVariants.Primary) {
            config = {
                ...config,
                color: "primary",
                variant: "contained"
            };
        } else if (node.variant === ButtonVariants.Secondary) {
            config = {
                ...config,
                color: "secondary",
                variant: "contained"
            };
        } else if (node.variant === ButtonVariants.Text) {
            config = {
                ...config,
                variant: "text"
            };
        }

        return (
            <Button sx={ node?.variants?.[0]?.config.styles } { ...config }>
                { node?.variants?.[0]?.config?.field?.text }
            </Button>
        );
    } else if (node.type === ComponentTypes.Typography) {
        return (
            <Typography
                variant={ node?.variant.toLowerCase() }
                style={ node?.config?.styles }
            >
                { node?.config?.field?.text }
            </Typography>
        );
    } else if (node.type === ComponentTypes.RichText) {
        return (
            <>
                { parse(node?.config?.field?.text, {
                    replace(domNode) {
                        if ((domNode as unknown as any).name === "h1") {
                            <Typography variant="h1">{ domToReact((domNode as unknown as any).children) }</Typography>;
                        }
                    }
                }) }
            </>
        );
    } else if (node.type === ComponentTypes.Divider) {
        let config: DividerProps = {};

        if (node?.variant === DividerVariants.Horizontal || node?.variant === DividerVariants.Vertical) {
            config = {
                ...config,
                orientation: node?.variant?.toLowerCase()
            };
        } else {
            config = {
                ...config,
                variant: node?.variant?.toLowerCase()
            };
        }

        return <Divider { ...config }>{ node?.config?.field?.text }</Divider>;
    } else if (node.type === ComponentTypes.Image) {
        return (
            <Box display="flex" alignItems="center" justifyContent="center">
                <img
                    src={ node?.config?.field?.src }
                    alt={ node?.config?.field?.alt }
                    style={ node?.config?.styles }
                />
            </Box>
        );
    }

    return null;
};

export default CommonNodeFactory;
