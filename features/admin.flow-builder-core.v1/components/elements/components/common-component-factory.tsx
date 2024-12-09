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
import { Node } from "@xyflow/react";
import React, { FunctionComponent, ReactElement } from "react";
import ButtonAdapter from "./adapters/button-adapter";
import ChoiceAdapter from "./adapters/choice-adapter";
import DividerAdapter from "./adapters/divider-adapter";
import ImageAdapter from "./adapters/image-adapter";
import CheckboxAdapter from "./adapters/input/checkbox-adapter";
import DefaultInputAdapter from "./adapters/input/default-input-adapter";
import PhoneNumberInputAdapter from "./adapters/input/phone-number-input-adapter";
import RichTextAdapter from "./adapters/rich-text-adapter";
import TypographyAdapter from "./adapters/typography-adapter";
import { Component, ComponentTypes, InputVariants } from "../../../models/component";

/**
 * Props interface of {@link CommonComponentFactory}
 */
export interface CommonComponentFactoryPropsInterface extends IdentifiableComponentInterface {
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
 * Factory for creating common components.
 *
 * @param props - Props injected to the component.
 * @returns The CommonComponentFactory component.
 */
export const CommonComponentFactory: FunctionComponent<CommonComponentFactoryPropsInterface> = ({
    nodeId,
    node
}: CommonComponentFactoryPropsInterface & Node): ReactElement => {
    if (node.type === ComponentTypes.Input) {
        if (node.variant === InputVariants.Checkbox) {
            return <CheckboxAdapter nodeId={ nodeId } node={ node } />;
        }

        if (node.variant === InputVariants.Telephone) {
            return <PhoneNumberInputAdapter nodeId={ nodeId } node={ node } />;
        }

        return <DefaultInputAdapter nodeId={ nodeId } node={ node } />;
    } else if (node.type === ComponentTypes.Choice) {
        return <ChoiceAdapter nodeId={ nodeId } node={ node } />;
    } else if (node.type === ComponentTypes.Button) {
        return <ButtonAdapter nodeId={ nodeId } node={ node } />;
    } else if (node.type === ComponentTypes.Typography) {
        return <TypographyAdapter nodeId={ nodeId } node={ node } />;
    } else if (node.type === ComponentTypes.RichText) {
        return <RichTextAdapter nodeId={ nodeId } node={ node } />;
    } else if (node.type === ComponentTypes.Divider) {
        return <DividerAdapter nodeId={ nodeId } node={ node } />;
    } else if (node.type === ComponentTypes.Image) {
        return <ImageAdapter nodeId={ nodeId } node={ node } />;
    }

    return null;
};

export default CommonComponentFactory;
