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

import { CodeEditor, SegmentedAccordion } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useState } from "react";
import { Label } from "semantic-ui-react";
import { InterfaceConfigDetails, InterfaceRemoteFetchStatus } from "../../models";

interface InterfaceDeployementStatusProps {
    statusObject: InterfaceConfigDetails;
}

export const DeploymentStatus: FunctionComponent<InterfaceDeployementStatusProps> = (
    props: InterfaceDeployementStatusProps
): ReactElement => {

    const {
        statusObject
    } = props;

    const [ accordionActiveIndexes, setAccordionActiveIndexes ] = useState<number[]>([]);

    /**
     * Handles accordion title click.
     *
     * @param {React.SyntheticEvent} e - Click event.
     * @param {number} index - Clicked on index.
     */
    const handleAccordionOnClick = (e: SyntheticEvent, { index }: { index: number }): void => {
        const newIndexes = [ ...accordionActiveIndexes ];

        if (newIndexes.includes(index)) {
            const removingIndex = newIndexes.indexOf(index);
            newIndexes.splice(removingIndex, 1);
        } else {
            newIndexes.push(index);
        }

        setAccordionActiveIndexes(newIndexes);
    };

    return (
        <SegmentedAccordion fluid >
            {
                statusObject && statusObject.remoteFetchRevisionStatuses.length > 0 &&
                statusObject.remoteFetchRevisionStatuses.map((value: InterfaceRemoteFetchStatus, index: number) => {
                    return (
                        <>
                            <SegmentedAccordion.Title
                                id={ value.itemName }
                                active={ accordionActiveIndexes.includes(index) }
                                index={ index }
                                onClick={ handleAccordionOnClick }
                                content={ (
                                    <>
                                        { value.itemName }
                                        <Label
                                            size="mini"
                                            horizontal
                                            className="deployment-status"
                                            basic
                                            color={ value.deployedStatus == "FAIL" ? "red" : "teal" } 
                                        >
                                            { value.deployedStatus == "FAIL" ? 
                                                "Deployement Failed" : value.deployedStatus }
                                        </Label>
                                    </>
                                ) }
                                hideChevron={ false }
                            />
                            <SegmentedAccordion.Content
                                active={ accordionActiveIndexes.includes(index) }
                            >
                                <CodeEditor
                                    lint
                                    language="htmlmixed"
                                    sourceCode={ value.deploymentErrorReport }
                                    options={ {
                                        lineWrapping: true
                                    } }
                                    readOnly={ true }
                                    theme={ "dark" }
                                />
                            </SegmentedAccordion.Content>
                        </>
                    )
                })
            }
        </SegmentedAccordion>
    )
}
