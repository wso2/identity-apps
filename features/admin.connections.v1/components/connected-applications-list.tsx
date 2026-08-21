/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ContentLoader } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { List } from "semantic-ui-react";

interface ConnectedApplicationsListPropsInterface extends IdentifiableComponentInterface {
    applications?: string[];
    isLoading: boolean;
}

/**
 * Renders the applications connected to a connector deletion target.
 *
 * @param props - Props injected to the component.
 * @returns Connected applications list.
 */
const ConnectedApplicationsList: FunctionComponent<ConnectedApplicationsListPropsInterface> = (
    props: ConnectedApplicationsListPropsInterface
): ReactElement => {

    const {
        applications,
        isLoading,
        [ "data-componentid" ]: componentId = "connected-applications-list"
    } = props;

    return (
        <List ordered className="ml-6" data-componentid={ componentId }>
            {
                isLoading ? (
                    <ContentLoader data-componentid={ `${ componentId }-loader` } />
                ) : applications?.map((application: string, index: number) => (
                    <List.Item key={ index }>{ application }</List.Item>
                ))
            }
        </List>
    );
};

export default ConnectedApplicationsList;
