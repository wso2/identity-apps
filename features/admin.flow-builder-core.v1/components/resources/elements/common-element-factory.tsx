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
import OTPInputAdapter from "./adapters/input/otp-input-adapter";
import PhoneNumberInputAdapter from "./adapters/input/phone-number-input-adapter";
import RichTextAdapter from "./adapters/rich-text-adapter";
import TypographyAdapter from "./adapters/typography-adapter";
import { Element, ElementTypes, InputVariants } from "../../../models/elements";

/**
 * Props interface of {@link CommonElementFactory}
 */
export interface CommonElementFactoryPropsInterface extends IdentifiableComponentInterface {
    /**
     * The flow id of the resource.
     */
    resourceId: string;
    /**
     * The element properties.
     */
    resource: Element;
}

/**
 * Factory for creating common components.
 *
 * @param props - Props injected to the component.
 * @returns The CommonComponentFactory component.
 */
export const CommonElementFactory: FunctionComponent<CommonElementFactoryPropsInterface> = ({
    resourceId,
    resource
}: CommonElementFactoryPropsInterface & Node): ReactElement => {
    if (resource.type === ElementTypes.Input) {
        if (resource.variant === InputVariants.Checkbox) {
            return <CheckboxAdapter resourceId={ resourceId } resource={ resource } />;
        }

        if (resource.variant === InputVariants.Telephone) {
            return <PhoneNumberInputAdapter resourceId={ resourceId } resource={ resource } />;
        }

        if (resource.variant === InputVariants.OTP) {
            return <OTPInputAdapter resourceId={ resourceId } resource={ resource } />;
        }

        return <DefaultInputAdapter resourceId={ resourceId } resource={ resource } />;
    } else if (resource.type === ElementTypes.Choice) {
        return <ChoiceAdapter resourceId={ resourceId } resource={ resource } />;
    } else if (resource.type === ElementTypes.Button) {
        return <ButtonAdapter resourceId={ resourceId } resource={ resource } />;
    } else if (resource.type === ElementTypes.Typography) {
        return <TypographyAdapter resourceId={ resourceId } resource={ resource } />;
    } else if (resource.type === ElementTypes.RichText) {
        return <RichTextAdapter resourceId={ resourceId } resource={ resource } />;
    } else if (resource.type === ElementTypes.Divider) {
        return <DividerAdapter resourceId={ resourceId } resource={ resource } />;
    } else if (resource.type === ElementTypes.Image) {
        return <ImageAdapter resourceId={ resourceId } resource={ resource } />;
    }

    return null;
};

export default CommonElementFactory;
