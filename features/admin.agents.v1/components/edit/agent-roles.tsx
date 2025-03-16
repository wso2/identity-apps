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
import { ReadOnlyRoleList } from "@wso2is/admin.roles.v2/components/readonly-role-list";
import { EmphasizedSegment, Message } from "@wso2is/react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import "./agent-roles.scss";


export default function AgentRoles() {

    const { t } = useTranslation();

    return (

        <EmphasizedSegment padded="very" style={ { border: "none", padding: "21px" } }>
            <Typography variant="h4">
                Roles
            </Typography>
            <Typography variant="body1" className="mb-5" style={ { color: "#9c9c9c" } }>
                View roles assigned directly to this agent
            </Typography>
            <Message
                type="info"
                content={ t("user:updateUser.roles.editRoles.infoMessage") }
                className="agent-role-message"
            />
            <ReadOnlyRoleList
                totalRoleList={ [
                    {
                        display: "Customer Support",
                        audienceType: "application",
                        value: "0000aef5-01b6-4cca-af3f-efce472b9b38",
                        $ref: "https://localhost:9443/scim2/v2/Roles/0000aef5-01b6-4cca-af3f-efce472b9b38",
                        audienceDisplay: "Support Portal",
                        orgId: "",
                        orgName: ""
                    },
                    {
                        display: "everyone",
                        audienceType: "organization",
                        value: "5db9f4b9-54aa-4a3f-8a03-156744d73b14",
                        $ref: "https://localhost:9443/scim2/v2/Roles/5db9f4b9-54aa-4a3f-8a03-156744d73b14",
                        audienceDisplay: "Super",
                        orgId: "",
                        orgName: ""
                    }
                ] }
                emptyRolesListPlaceholder={ null }
            />
        </EmphasizedSegment>
    );
}
