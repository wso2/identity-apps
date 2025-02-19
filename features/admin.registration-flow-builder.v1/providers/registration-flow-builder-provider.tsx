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

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { PropsWithChildren, ReactElement, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import useGetRegistrationFlow from "../api/use-get-registration-flow";
import RegistrationFlowBuilderContext from "../context/registration-flow-builder-context";
import { Attribute } from "../models/attributes";

/**
 * Props interface of {@link RegistrationFlowBuilderProvider}
 */
export type RegistrationFlowBuilderProviderProps = unknown;

/**
 * This component provides registration flow builder related context to its children.
 *
 * @param props - Props injected to the component.
 * @returns The RegistrationFlowBuilderProvider component.
 */
const RegistrationFlowBuilderProvider = ({
    children
}: PropsWithChildren<RegistrationFlowBuilderProviderProps>): ReactElement => {
    const dispatch: Dispatch = useDispatch();

    const { data: flow, error: flowFetchError } = useGetRegistrationFlow();

    const [ selectedAttributes, setSelectedAttributes ] = useState<{ [key: string]: Attribute[] }>({});

    /**
     * Dispatches an error alert if the flow fetch fails.
     */
    useEffect(() => {
        if (flowFetchError) {
            dispatch(addAlert({
                description: "An error occurred while fetching the registration flow.",
                level: AlertLevels.ERROR,
                message: "Couldn't retrieve the registration flow."
            }));
        }
    }, [ flowFetchError ]);

    return (
        <RegistrationFlowBuilderContext.Provider
            value={ {
                flow,
                selectedAttributes,
                setSelectedAttributes
            } }
        >
            { children }
        </RegistrationFlowBuilderContext.Provider>
    );
};

export default RegistrationFlowBuilderProvider;
