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

import { UserGroupsList } from "@wso2is/admin.users.v1/components/user-groups-edit";
import { AlertInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import useGetAgent from "../../hooks/use-get-agent";

interface AgentGroupViewProps {
    agentId: string;
}

export default function AgentGroups({ agentId }: AgentGroupViewProps) {
    const dispatch: Dispatch = useDispatch();

    const {
        data: agentInfo
    } = useGetAgent(agentId);

    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert<AlertInterface>(alert));
    };

    return (
        <UserGroupsList
            onAlertFired={ handleAlerts }
            user={ agentInfo }
            handleUserUpdate={ () => {} }
            isReadOnly={ false }
        />
    );
}
