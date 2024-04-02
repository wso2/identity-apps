/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import React, {
    FunctionComponent,
    PropsWithChildren,
    ReactElement,
    useState
} from "react";
import OrganizationsContext from "../context/organizations-context";

/**
 * Props interface for the Organizations Provider component.
 */
export type OrganizationsProviderProps = PropsWithChildren;

/**
 * Provider for the Organization related operations.
 *
 * @param props - Props for the client.
 * @returns Organizations provider component.
 */
const OrganizationsProvider: FunctionComponent<OrganizationsProviderProps> = (
    props: OrganizationsProviderProps
): ReactElement => {
    const { children } = props;

    const [ isOrganizationSwitchRequestLoading, setIsOrganizationSwitchRequestLoading ] = useState<boolean>(false);

    return (
        <OrganizationsContext.Provider
            value={ {
                isOrganizationSwitchRequestLoading,
                updateOrganizationSwitchRequestLoadingState: setIsOrganizationSwitchRequestLoading
            } }
        >
            { children }
        </OrganizationsContext.Provider>
    );
};

export default OrganizationsProvider;
