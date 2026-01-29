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

import { Typography } from "@mui/material";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { ReadOnlyRoleList } from "@wso2is/admin.roles.v2/components/readonly-role-list";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { EmphasizedSegment, Link, Message } from "@wso2is/react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import useGetAgent from "../../hooks/use-get-agent";
import "./agent-roles.scss";

interface AgentRolesViewProps extends IdentifiableComponentInterface {
    agentId: string;
}

export default function AgentRoles({ agentId }: AgentRolesViewProps) {

    const { t } = useTranslation();

    const {
        data: agentInfo
    } = useGetAgent(agentId);

    return (

        <EmphasizedSegment padded="very" style={ { border: "none", padding: "21px" } }>
            <Typography variant="h4">
                { t("agents:edit.roles.title") }
            </Typography>
            <Typography variant="body1" className="mb-5" style={ { color: "#9c9c9c" } }>
                { t("agents:edit.roles.subtitle") }
            </Typography>
            <Message info className="mt-5 mb-5">
                Assign or manage roles for this agent in <Link
                    external={ false }
                    onClick={ () => {
                        history.push(
                            AppConstants.getPaths().get("ROLES")
                        );
                    } }
                >Roles
                </Link>
            </Message>
            <ReadOnlyRoleList
                totalRoleList={ agentInfo?.roles }
                emptyRolesListPlaceholder={ null }
            />
        </EmphasizedSegment>
    );
}
