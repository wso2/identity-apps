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

import { AppState } from "@wso2is/admin.core.v1/store";
import FeatureGateProvider from "@wso2is/admin.feature-gate.v1/providers/feature-gate-provider";
import UserPreferencesProvider from "@wso2is/common.ui.v1/providers/user-preferences-provider";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FC, PropsWithChildren, ReactElement } from "react";
import { useSelector } from "react-redux";
import { UserPreferencesInterface } from "./models/user-preferences";

/**
 * Props interface of {@link DecoratedApp}
 */
export type DecoratedAppProps = PropsWithChildren<Record<string, unknown>> & IdentifiableComponentInterface;

/**
 * `DecoratedApp` is a higher-order component that wraps children with `UserPreferencesProvider`.
 *
 * @param props - Component props.
 * @returns Wrapped component with user preferences context.
 */
const DecoratedApp: FC<DecoratedAppProps> = ({ children }: DecoratedAppProps): ReactElement => {
    const userId: string = useSelector((state: AppState) => {
        return state?.auth?.username;
    });

    return (
        <FeatureGateProvider>
            <UserPreferencesProvider<UserPreferencesInterface> userId={ userId }>{ children }</UserPreferencesProvider>
        </FeatureGateProvider>
    );
};

export default DecoratedApp;
