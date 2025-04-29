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

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Box from "@oxygen-ui/react/Box";
import IconButton from "@oxygen-ui/react/IconButton";
import Link, { LinkProps } from "@oxygen-ui/react/Link";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { ArrowLeftIcon } from "@oxygen-ui/react-icons";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, PropsWithChildren, ReactElement, ReactNode } from "react";
import "./flow-builder-header.scss";

/**
 * Props interface of {@link FlowBuilderHeader}
 */
export interface FlowBuilderHeaderProps extends IdentifiableComponentInterface {
    /**
     * The actions to be displayed on the right side of the header.
     */
    actions: ReactNode;
    /**
     * The breadcrumbs to be displayed.
     */
    breadcrumbs?: LinkProps[];
    /**
     * The configuration of the back button.
     */
    goBackButton?: {
        tooltip: ReactNode;
        path: string;
    };
}

/**
 * Header component for the flow builder page.
 *
 * @param props - Props injected to the component.
 * @returns FlowBuilderHeader component.
 */
const FlowBuilderHeader: FunctionComponent<PropsWithChildren<FlowBuilderHeaderProps>> = ({
    actions,
    breadcrumbs,
    goBackButton,
    children,
    ["data-componentid"]: componentId = "flow-builder-header"
}: PropsWithChildren<FlowBuilderHeaderProps>): ReactElement => {
    return (
        <Box
            display="flex"
            className="flow-builder-header"
            justifyContent="space-between"
            alignItems="center"
            data-componentid={ componentId }
        >
            <Box display="flex" gap={ 3 } alignItems="center">
                { goBackButton && (
                    <Tooltip title={ goBackButton.tooltip } placement="top">
                        <IconButton onClick={ () => history.push(goBackButton.path) }>
                            <ArrowLeftIcon />
                        </IconButton>
                    </Tooltip>
                ) }
                { breadcrumbs && (
                    <Breadcrumbs aria-label="breadcrumb" className="registration-flow-builder-page-header-breadcrumbs">
                        { breadcrumbs.map(({ onClick, ...rest }: LinkProps, index: number) =>
                            onClick ? (
                                <Link key={ index } underline="hover" color="inherit" onClick={ onClick } { ...rest } />
                            ) : (
                                <Typography color="text.primary" key={ index } { ...rest } />
                            )
                        ) }
                    </Breadcrumbs>
                ) }
            </Box>
            { children && <Box>{ children }</Box> }
            { actions && (
                <Box display="flex" justifyContent="flex-end" alignItems="center">
                    { actions }
                </Box>
            ) }
        </Box>
    );
};

export default FlowBuilderHeader;
