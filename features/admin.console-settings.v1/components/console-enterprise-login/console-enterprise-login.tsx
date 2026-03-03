/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import Alert from "@oxygen-ui/react/Alert";
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Typography from "@oxygen-ui/react/Typography";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

/**
 * Props interface of {@link ConsoleEnterpriseLogin}
 */
type ConsoleEnterpriseLoginPropsInterface = IdentifiableComponentInterface;

/**
 * Console Enterprise Login tab component.
 *
 * @param props - Props injected to the component.
 * @returns Console enterprise login component.
 */
const ConsoleEnterpriseLogin: FunctionComponent<ConsoleEnterpriseLoginPropsInterface> = (
    props: ConsoleEnterpriseLoginPropsInterface
): ReactElement => {
    const {
        ["data-componentid"]: componentId = "console-enterprise-login"
    } = props;

    const { t } = useTranslation();

    const supportEmail: string = useSelector(
        (state: AppState) => state.config.deployment.extensions?.supportEmail as string
    );

    return (
        <Box data-componentid={ componentId } sx={ { mt: 2 } }>
            <Alert
                severity="info"
                action={ (
                    <Button
                        color="inherit"
                        size="small"
                        variant="outlined"
                        href={ `mailto:${supportEmail}` }
                    >
                        { t("consoleSettings:enterpriseLogin.banner.action") }
                    </Button>
                ) }
            >
                <AlertTitle>
                    { t("consoleSettings:enterpriseLogin.banner.title") }
                </AlertTitle>
                <Typography variant="body2">
                    { t("consoleSettings:enterpriseLogin.banner.description") }
                </Typography>
            </Alert>
        </Box>
    );
};

export default ConsoleEnterpriseLogin;
