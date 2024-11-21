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
import Button from "@oxygen-ui/react/Button";
import Checkbox from "@oxygen-ui/react/Checkbox";
import Divider from "@oxygen-ui/react/Divider";
import FormControl from "@oxygen-ui/react/FormControl";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import FormLabel from "@oxygen-ui/react/FormLabel";
import PhoneNumberInput from "@oxygen-ui/react/PhoneNumberInput";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { Claim, IdentifiableComponentInterface } from "@wso2is/core/models";
import { Node } from "@xyflow/react";
import React, { FunctionComponent, ReactElement } from "react";
import AttributeCollectorNode from "./attribute-collector-node";
import { FieldOption } from "../../models/base";
import { Component, ComponentTypes } from "../../models/component";
import { ElementCategories } from "../../models/elements";
import "./step-node.scss";
import { WidgetTypes } from "../../models/widget";

/**
 * Props interface of {@link AttributeFactory}
 */
export interface AttributeFactoryPropsInterface extends IdentifiableComponentInterface {
    /**
     * The node properties.
     */
    attribute: Claim;
}

/**
 * Node for representing an empty step in the authentication flow.
 *
 * @param props - Props injected to the component.
 * @returns Step Node component.
 */
export const AttributeFactory: FunctionComponent<AttributeFactoryPropsInterface> = ({
    attribute
}: AttributeFactoryPropsInterface & Node): ReactElement => {

    return (
        <TextField
            fullWidth
            helperText={ attribute.displayName !== attribute.description ? attribute.description : "" }
            label={ attribute.displayName ?? attribute.claimURI }
            placeholder={ `Enter your ${ attribute.displayName ?? attribute.claimURI }` }
            required={ attribute.required }
            type="text"
        />
    );
};

export default AttributeFactory;
