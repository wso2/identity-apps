/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import React, { FunctionComponent, ReactElement } from "react";
import { ResourceTab } from "@wso2is/react-components";
import { useTranslation } from "react-i18next";
import { InterfaceRemoteConfigDetails, InterfaceEditDetails } from "../../../models";
import { RemoteConfigDetail } from "./remote-repository-details";

interface RemoteRepoEditProps {
    configId?: string;
    configObject?: InterfaceRemoteConfigDetails;
    onConfigUpdate?: (id: string, values: InterfaceEditDetails) => void;
    handleConfigDelete: (repoConfig: InterfaceRemoteConfigDetails) => void;
}

export const RemoteRepoEdit: FunctionComponent<RemoteRepoEditProps> = (props: RemoteRepoEditProps): ReactElement => {

    const { t } = useTranslation();

    const {
        configObject,
        onConfigUpdate,
        handleConfigDelete
    } = props;

    const panes = () => ([
        {
            menuItem: "Config Details",
            render: () => (
                <ResourceTab.Pane attached={ false }>
                    <RemoteConfigDetail 
                        handleConfigDelete={ handleConfigDelete } 
                        configObject={ configObject } 
                        onConfigUpdate={ onConfigUpdate } 
                    />
                </ResourceTab.Pane>
            )
        }
    ]);

    return (
        <ResourceTab panes={ panes() } />
    );
}
