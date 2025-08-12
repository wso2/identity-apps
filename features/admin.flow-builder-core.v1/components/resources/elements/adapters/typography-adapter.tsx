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

import Typography, { TypographyProps } from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import PlaceholderComponent from "./placeholder-component";
import { TypographyVariants } from "../../../../models/elements";
import { CommonElementFactoryPropsInterface } from "../common-element-factory";

/**
 * Props interface of {@link TypographyAdapter}
 */
export type TypographyAdapterPropsInterface = IdentifiableComponentInterface & CommonElementFactoryPropsInterface;

/**
 * Adapter for the Typography component.
 *
 * @param props - Props injected to the component.
 * @returns The TypographyAdapter component.
 */
const TypographyAdapter: FunctionComponent<TypographyAdapterPropsInterface> = ({
    resource
}: TypographyAdapterPropsInterface): ReactElement => {
    let config: TypographyProps = {};

    if (
        resource?.variant === TypographyVariants.H1 ||
        resource?.variant === TypographyVariants.H2 ||
        resource?.variant === TypographyVariants.H3 ||
        resource?.variant === TypographyVariants.H4 ||
        resource?.variant === TypographyVariants.H5 ||
        resource?.variant === TypographyVariants.H6
    ) {
        config = {
            ...config,
            textAlign: "center"
        };
    }

    return (
        <Typography variant={ resource?.variant.toLowerCase() } style={ resource?.config?.styles } { ...config }>
            <PlaceholderComponent value={ resource?.config?.text } />
        </Typography>
    );
};

export default TypographyAdapter;
