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

import React, { PropsWithChildren, ReactElement } from "react";
import ApplicationTemplatesProvider from "../../admin.applications.v1/provider/application-templates-provider";

/**
 * Props interface for the `CommonFeatureProviders` component.
 */
export type CommonFeatureProvidersProps = PropsWithChildren;

/**
 * A common provider that aggregates all common feature providers,
 * enabling any feature to access them.
 *
 * @param props - Props for the `CommonFeatureProviders` component.
 * @returns `CommonFeatureProviders` component.
 */
const CommonFeatureProviders = (props: CommonFeatureProvidersProps): ReactElement => {
    const { children } = props;

    return (
        <ApplicationTemplatesProvider>
            { children }
        </ApplicationTemplatesProvider>
    );
};

export default CommonFeatureProviders;
