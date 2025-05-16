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

import AuthenticationFlowBuilderCoreProvider from "@wso2is/admin.flow-builder-core.v1/providers/authentication-flow-builder-core-provider";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useReactFlow } from "@xyflow/react";
import React, { FC, PropsWithChildren, ReactElement, useState } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import configureRegistrationFlow from "../api/configure-registration-flow";
import updateNewRegistrationPortalFeatureStatus from "../api/update-new-registration-portal-feature-status";
import useNewRegistrationPortalFeatureStatus from "../api/use-new-registration-portal-feature-status";
import ResourceProperties from "../components/resource-property-panel/resource-properties";
import ElementFactory from "../components/resources/elements/element-factory";
import RegistrationFlowBuilderContext from "../context/registration-flow-builder-context";
import { Attribute } from "../models/attributes";
import transformFlow from "../utils/transform-flow";

/**
 * Props interface of {@link RegistrationFlowBuilderProvider}
 */
export type RegistrationFlowBuilderProviderProps = PropsWithChildren<unknown>;

/**
 * This component provides registration flow builder related context to its children.
 *
 * @param props - Props injected to the component.
 * @returns The RegistrationFlowBuilderProvider component.
 */
const RegistrationFlowBuilderProvider: FC<RegistrationFlowBuilderProviderProps> = ({
    children
}: PropsWithChildren<RegistrationFlowBuilderProviderProps>): ReactElement => (
    <AuthenticationFlowBuilderCoreProvider ElementFactory={ ElementFactory } ResourceProperties={ ResourceProperties }>
        <FlowContextWrapper>{ children }</FlowContextWrapper>
    </AuthenticationFlowBuilderCoreProvider>
);

/**
 * This component wraps the flow context and provides necessary functions and state.
 *
 * @param props - Props injected to the component.
 * @returns The FlowContextWrapper component.
 */
const FlowContextWrapper: FC<RegistrationFlowBuilderProviderProps> = ({
    children
}: PropsWithChildren<RegistrationFlowBuilderProviderProps>): ReactElement => {
    const dispatch: Dispatch = useDispatch();

    const { toObject } = useReactFlow();
    const {
        data: isNewRegistrationPortalEnabled,
        mutate: mutateNewRegistrationPortalEnabledRequest
    } = useNewRegistrationPortalFeatureStatus();

    const [ selectedAttributes, setSelectedAttributes ] = useState<{ [key: string]: Attribute[] }>({});
    const [ isPublishing, setIsPublishing ] = useState<boolean>(false);

    const handlePublish = async (): Promise<void> => {
        setIsPublishing(true);

        const flow: any = toObject();

        if (!isNewRegistrationPortalEnabled) {
            try {
                await updateNewRegistrationPortalFeatureStatus(true);
            } catch(error) {
                dispatch(
                    addAlert({
                        description: "Failed to enable the new registration flow experience.",
                        level: AlertLevels.ERROR,
                        message: "Flow Update Failure"
                    })
                );
            }

            mutateNewRegistrationPortalEnabledRequest();
        }

        try {
            await configureRegistrationFlow(transformFlow(flow) as any);

            dispatch(
                addAlert({
                    description: "Registration flow updated successfully.",
                    level: AlertLevels.SUCCESS,
                    message: "Flow Updated Successfully"
                })
            );
        } catch (error) {
            dispatch(
                addAlert({
                    description: "Failed to update the registration flow.",
                    level: AlertLevels.ERROR,
                    message: "Flow Update Failure"
                })
            );
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <RegistrationFlowBuilderContext.Provider
            value={ {
                isNewRegistrationPortalEnabled,
                isPublishing,
                onPublish: handlePublish,
                selectedAttributes,
                setSelectedAttributes
            } }
        >
            { children }
        </RegistrationFlowBuilderContext.Provider>
    );
};

export default RegistrationFlowBuilderProvider;
