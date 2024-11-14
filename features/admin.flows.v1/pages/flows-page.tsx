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
import Typography from "@oxygen-ui/react/Typography";
import Builder from "@wso2is/admin.authentication-flow-builder-core.v1/components/builder";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import "./flows-page.scss";
import Button from "@oxygen-ui/react/Button";

/**
 * Props interface of {@link Flows}
 */
type FlowsProps = IdentifiableComponentInterface;

/**
 * Landing page for the Flows feature.
 *
 * @param props - Props injected to the component.
 * @returns Flows page component.
 */
const Flows: FunctionComponent<FlowsProps> = ({
    ["data-componentid"]: componentId = "flows-page"
}: FlowsProps): ReactElement => {
    return (
        <div className="flows" data-componentid={ componentId }>
            <div className="page-layout">
                <Box display="flex" className="page-header" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5">Flows</Typography>
                    <Button variant="contained">Publish</Button>
                </Box>
            </div>
            <Builder />
        </div>
    );
};

export default Flows;
