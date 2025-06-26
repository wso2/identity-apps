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

import { Collapse } from "@mui/material";
import Alert from "@oxygen-ui/react/Alert";
import IconButton from "@oxygen-ui/react/IconButton";
import Link from "@oxygen-ui/react/Link";
import { XMarkIcon } from "@oxygen-ui/react-icons";
import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import useGetRegistrationFlowBuilderEnabledStatus from
    "@wso2is/admin.server-configurations.v1/api/use-get-self-registration-enabled-status";
import React, { ReactElement, useState } from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import "./registration-flow-banner.scss";

/**
 * Registration flow banner component.
 */
const RegistrationFlowBanner = (): ReactElement => {

    const [ open, setOpen ] = useState<boolean>(true);

    const {
        data: isRegistrationFlowBuilderEnabled
    } = useGetRegistrationFlowBuilderEnabledStatus();
    const registrationFlowBuilderFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features.registrationFlowBuilder
    );
    const hasRegistrationFlowBuilderViewPermissions: boolean = useRequiredScopes(
        registrationFlowBuilderFeatureConfig?.scopes?.read
    );

    const handleConfigure = (): void => {

        history.push(AppConstants.getPaths().get("REGISTRATION_FLOW_BUILDER"), {
            from: {
                pathname: history.location.pathname + history.location.hash
            }
        });
    };

    if (
        !isRegistrationFlowBuilderEnabled ||
        !registrationFlowBuilderFeatureConfig?.enabled ||
        !hasRegistrationFlowBuilderViewPermissions
    ) {
        return null;
    }

    return (
        <Collapse in={ open }>
            <Alert
                className="registration-flow-banner"
                severity="info"
                action={ (
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={ () => setOpen(false) }
                    >
                        <XMarkIcon />
                    </IconButton>
                ) }
            >
                <Trans
                    i18nKey="applications.edit.sections.signOnMethod.sections.landing.banners.registrationConfiguration"
                >
                    Want to customize your organization&apos;s user <b>self-registration</b> flow?
                    Click <Link className="registration-flow-banner-link" onClick={ handleConfigure }>configure</Link>
                    { " " } to get started.
                </Trans>
            </Alert>
        </Collapse>
    );
};

export default RegistrationFlowBanner;
