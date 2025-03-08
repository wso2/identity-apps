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
import Link from "@oxygen-ui/react/Link";
import Typography from "@oxygen-ui/react/Typography";
import { ArrowLeftIcon } from "@oxygen-ui/react-icons";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import RegistrationFlowBuilder from "@wso2is/admin.registration-flow-builder.v1/components/registration-flow-builder";
import RegistrationFlowBuilderProvider from "@wso2is/admin.registration-flow-builder.v1/providers/registration-flow-builder-provider";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { ServerConfigurationsConstants } from "../../constants/server-configurations-constants";
import "./registration-flow-builder-page.scss";
import RegistrationFlowBuilderPageHeader from "./registration-flow-builder-page-header";

/**
 * Props interface of {@link RegistrationFlowBuilderPage}
 */
type RegistrationFlowBuilderPageProps = IdentifiableComponentInterface;

/**
 * Landing page for the Registration Flow Builder.
 *
 * @param props - Props injected to the component.
 * @returns RegistrationFlowBuilderPage component.
 */
const RegistrationFlowBuilderPage: FunctionComponent<RegistrationFlowBuilderPageProps> = ({
    ["data-componentid"]: componentId = "registration-flow-builder-page"
}: RegistrationFlowBuilderPageProps): ReactElement => {
    return (
        <RegistrationFlowBuilderProvider>
            <div className="registration-flow-builder-page" data-componentid={ componentId }>
                <div className="page-layout">
                    <RegistrationFlowBuilderPageHeader />
                </div>
                <RegistrationFlowBuilder />
            </div>
        </RegistrationFlowBuilderProvider>
    );
};

export default RegistrationFlowBuilderPage;
