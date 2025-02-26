/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import DecoratedVisualFlow from "@wso2is/admin.flow-builder-core.v1/components/visual-flow/decorated-visual-flow";
import { Payload } from "@wso2is/admin.flow-builder-core.v1/models/api";
import { StaticStepTypes, Step, StepTypes } from "@wso2is/admin.flow-builder-core.v1/models/steps";
import AuthenticationFlowBuilderCoreProvider from
    "@wso2is/admin.flow-builder-core.v1/providers/authentication-flow-builder-core-provider";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Edge, Node, NodeTypes } from "@xyflow/react";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import ResourceProperties from "./resource-property-panel/resource-properties";
import ElementFactory from "./resources/elements/element-factory";
import StaticNodeFactory from "./resources/steps/static-step-factory";
import StepFactory from "./resources/steps/step-factory";
import configureRegistrationFlow from "../api/configure-registration-flow";
import useGetRegistrationFlowBuilderResources from "../api/use-get-registration-flow-builder-resources";
import RegistrationFlowBuilderProvider from "../providers/registration-flow-builder-provider";

/**
 * Props interface of {@link RegistrationFlowBuilder}
 */
export type RegistrationFlowBuilderPropsInterface = IdentifiableComponentInterface;

/**
 * Entry point for the registration flow builder.
 *
 * @param props - Props injected to the component.
 * @returns Entry point component for the registration flow builder.
 */
const RegistrationFlowBuilder: FunctionComponent<RegistrationFlowBuilderPropsInterface> = ({
    "data-componentid": componentId = "registration-flow-builder",
    ...rest
}: RegistrationFlowBuilderPropsInterface): ReactElement => {
    const { data: resources } = useGetRegistrationFlowBuilderResources();

    const dispatch: Dispatch = useDispatch();

    const handleFlowSubmit = (payload: Payload) => {
        configureRegistrationFlow(payload)
            .then(() => {
                dispatch(addAlert({
                    description: "Registration flow updated successfully.",
                    level: AlertLevels.SUCCESS,
                    message: "Flow Updated Successfully"
                }));
            })
            .catch(() => {
                dispatch(addAlert({
                    description: "Failed to update the registration flow.",
                    level: AlertLevels.ERROR,
                    message: "Flow Updated Failure"
                }));
            });
    };

    const initialNodes: Node[] = useMemo<Node[]>(
        () => [
            {
                data: {
                    displayOnly: true
                },
                id: "start",
                position: { x: 100, y: 100 },
                type: StaticStepTypes.Start
            },
            {
                data: { label: "Box" },
                id: "box",
                position: { x: 300, y: 200 },
                type: StepTypes.View
            },
            {
                data: {
                    displayOnly: true
                },
                id: "COMPLETE",
                position: { x: 850, y: 100 },
                type: StaticStepTypes.Done
            }
        ],
        []
    );

    const initialEdges: Edge[] = useMemo<Edge[]>(
        () => [
            { animated: false, id: "start-box", source: "start", target: "box" },
            { animated: false, id: "box-done", source: "box", target: "done" }
        ],
        []
    );

    const generateNodeTypes = (): NodeTypes => {
        if (!resources?.steps) {
            return {};
        }

        const stepNodes: NodeTypes = resources.steps.reduce(
            (acc: NodeTypes, resource: Step) => {
                acc[resource.type] = (props: any) => <StepFactory resource={ resource } { ...props } />;

                return acc;
            },
            {}
        );

        const staticStepNodes: NodeTypes = Object.values(StaticStepTypes).reduce(
            (acc: NodeTypes, type: StaticStepTypes) => {
                acc[type] = (props: any) => <StaticNodeFactory type={ type } { ...props } />;

                return acc;
            },
            {}
        );

        return {
            ...staticStepNodes,
            ...stepNodes
        };
    };

    return (
        <AuthenticationFlowBuilderCoreProvider
            ElementFactory={ ElementFactory }
            ResourceProperties={ ResourceProperties }
        >
            <RegistrationFlowBuilderProvider>
                <DecoratedVisualFlow
                    resources={ resources }
                    data-componentid={ componentId }
                    onFlowSubmit={ handleFlowSubmit }
                    initialNodes={ initialNodes }
                    initialEdges={ initialEdges }
                    nodeTypes={ generateNodeTypes() }
                    { ...rest }
                />
            </RegistrationFlowBuilderProvider>
        </AuthenticationFlowBuilderCoreProvider>
    );
};

export default RegistrationFlowBuilder;
