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
import Button from "@oxygen-ui/react/Button";
import IconButton from "@oxygen-ui/react/IconButton";
import Link from "@oxygen-ui/react/Link";
import Typography from "@oxygen-ui/react/Typography";
import { ArrowLeftIcon } from "@oxygen-ui/react-icons";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { ServerConfigurationsConstants } from "../../constants/server-configurations-constants";
import useRegistrationFlowBuilder from "@wso2is/admin.registration-flow-builder.v1/hooks/use-registration-flow-builder";

/**
 * Props interface of {@link RegistrationFlowBuilderPageHeader}
 */
type RegistrationFlowBuilderPageHeaderProps = IdentifiableComponentInterface;

/**
 * Header for the Registration flow builder page.
 *
 * @param props - Props injected to the component.
 * @returns RegistrationFlowBuilderPageHeader component.
 */
const RegistrationFlowBuilderPageHeader: FunctionComponent<RegistrationFlowBuilderPageHeaderProps> = ({
    ["data-componentid"]: componentId = "registration-flow-builder-page-header"
}: RegistrationFlowBuilderPageHeaderProps): ReactElement => {
    const { onPublish } = useRegistrationFlowBuilder();

    return (
        <Box display="flex" className="page-header" justifyContent="space-between" alignItems="center" data-componentid={ componentId }>
            <Box display="flex" gap={ 3 } alignItems="center">
                <IconButton
                    onClick={ () =>
                        history.push(
                            AppConstants.getPaths()
                                .get("GOVERNANCE_CONNECTOR_EDIT")
                                .replace(
                                    ":categoryId",
                                    ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID
                                )
                                .replace(
                                    ":connectorId",
                                    ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID
                                )
                        )
                    }
                >
                    <ArrowLeftIcon />
                </IconButton>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link
                        underline="hover"
                        color="inherit"
                        onClick={ () => history.push(AppConstants.getPaths().get("LOGIN_AND_REGISTRATION")) }
                    >
                                    Login & Registration
                    </Link>
                    <Link
                        underline="hover"
                        color="inherit"
                        onClick={ () =>
                            history.push(
                                AppConstants.getPaths()
                                    .get("GOVERNANCE_CONNECTOR_EDIT")
                                    .replace(
                                        ":categoryId",
                                        ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID
                                    )
                                    .replace(
                                        ":connectorId",
                                        ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID
                                    )
                            )
                        }
                    >
                                    Self-registration
                    </Link>
                    <Typography sx={ { color: "text.primary" } }>Edit Registration Flow</Typography>
                </Breadcrumbs>
            </Box>
            <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
            >
                <Button variant="contained" onClick={ () => onPublish() }>
                    Publish
                </Button>
            </Box>
        </Box>
    );
};

export default RegistrationFlowBuilderPageHeader;
