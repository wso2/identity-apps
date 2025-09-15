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

import FormControl from "@oxygen-ui/react/FormControl";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import FormLabel from "@oxygen-ui/react/FormLabel";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { FieldOption } from "../../../../models/base";
import { CommonElementFactoryPropsInterface } from "../common-element-factory";
import Hint from "../hint";

/**
 * Props interface of {@link ChoiceAdapter}
 */
export type ChoiceAdapterPropsInterface = IdentifiableComponentInterface & CommonElementFactoryPropsInterface;

/**
 * Adapter for the Choice component that renders a radio group.
 *
 * @param props - Props injected to the component.
 * @returns The ChoiceAdapter component.
 */
const ChoiceAdapter: FunctionComponent<ChoiceAdapterPropsInterface> = ({
    resource
}: ChoiceAdapterPropsInterface): ReactElement => (
    <FormControl sx={ { my: 2 } }>
        <FormLabel id={ resource.config?.id }>{ resource.config?.label }</FormLabel>
        <RadioGroup defaultValue={ resource.config?.defaultValue }>
            { resource.config?.options?.map((option: FieldOption) => (
                <FormControlLabel
                    key={ option?.key }
                    value={ option?.value }
                    control={ <Radio /> }
                    label={ option?.label }
                />
            )) }
        </RadioGroup>
        {
            resource.config?.hint && (
                <FormHelperText>
                    <Hint hint={ resource.config?.hint } />
                </FormHelperText>
            )
        }
    </FormControl>
);

export default ChoiceAdapter;
