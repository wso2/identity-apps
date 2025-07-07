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
import useRegistrationFlowBuilder from "@wso2is/admin.registration-flow-builder.v1/hooks/use-registration-flow-builder";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";

/**
 * Props interface of {@link RegistrationFlowBuilderPageHeader}
 */
export type RegistrationFlowBuilderPageHeaderProps = IdentifiableComponentInterface;

/**
 * Interface for the path state.
 */
interface PathStateInterface {
    from?: {
        /**
         * Path to navigate back to.
         */
        pathname?: string;
    }
}

/**
 * Header for the Registration flow builder page.
 *
 * @param props - Props injected to the component.
 * @returns RegistrationFlowBuilderPageHeader component.
 */
const RegistrationFlowBuilderPageHeader: FunctionComponent<RegistrationFlowBuilderPageHeaderProps> = ({
    ["data-componentid"]: componentId = "registration-flow-builder-page-header"
}: RegistrationFlowBuilderPageHeaderProps): ReactElement => {
    const { isPublishing, onPublish } = useRegistrationFlowBuilder();

    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {

        let backPath: string = AppConstants.getPaths().get("FLOWS");

        if (history?.location?.state) {
            const state: PathStateInterface = history.location.state as PathStateInterface;

            if (state?.from?.pathname) {
                backPath = state.from.pathname;
            }
        }

        history.push(backPath);
    };

    return (
        <Box
            display="flex"
            className="page-header"
            justifyContent="space-between"
            alignItems="center"
            data-componentid={ componentId }
        >
            <Box display="flex" gap={ 3 } alignItems="center">
                <IconButton onClick={ handleBackButtonClick }>
                    <ArrowLeftIcon />
                </IconButton>
                <Breadcrumbs aria-label="breadcrumb" className="registration-flow-builder-page-header-breadcrumbs">
                    <Link
                        underline="hover"
                        color="inherit"
                        onClick={ () => history.push(AppConstants.getPaths().get("FLOWS")) }
                    >
                        Flows
                    </Link>
                    <Typography sx={ { color: "text.primary" } }>Edit Registration Flow</Typography>
                </Breadcrumbs>
            </Box>
            <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
            >
                <Button variant="contained" onClick={ () => onPublish() } loading={ isPublishing }>
                    Publish
                </Button>
            </Box>
        </Box>
    );
};

export default RegistrationFlowBuilderPageHeader;
