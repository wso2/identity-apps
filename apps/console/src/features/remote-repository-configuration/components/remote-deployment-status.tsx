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

import { CodeEditor } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Label, Segment } from "semantic-ui-react";
import { InterfaceConfigDetails, InterfaceRemoteFetchStatus } from "../models";

interface InterfaceDeployementStatusProps {
    statusObject: InterfaceConfigDetails;
}

export const DeploymentStatus: FunctionComponent<InterfaceDeployementStatusProps> = (
    props: InterfaceDeployementStatusProps
): ReactElement => {

    const {
        statusObject
    } = props;

    return (
        <>
            {
                statusObject && statusObject.remoteFetchRevisionStatuses.length > 0 &&
                statusObject.remoteFetchRevisionStatuses.map((value: InterfaceRemoteFetchStatus, index: number) => {
                    return (
                        <Segment key={ index } className="deploymentStatus">
                            <Label 
                                color={ value.deployedStatus == "FAIL" ? "red" : "teal" } 
                                attached='top'>{ value.deployedStatus == "FAIL" ? 
                                    "Deployement Failed" : value.deployedStatus }</Label>
                            <h3>{ value.itemName }</h3>
                            <CodeEditor
                                lint
                                language="htmlmixed"
                                sourceCode={ value.deploymentErrorReport }
                                options={ {
                                    lineWrapping: true
                                } }
                                readOnly={ true }
                                theme={  "dark" }
                            />
                        </Segment>
                    )
                })
            }
        </>
    )
}
