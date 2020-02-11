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

import React, { FunctionComponent, PropsWithChildren } from "react";
import { Tab, TabPaneProps } from "semantic-ui-react";

/**
 * Resource tab pane component.
 *
 * @param {TabPaneProps} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const ResourceTabPane: FunctionComponent<PropsWithChildren<TabPaneProps>> = (
    props: PropsWithChildren<TabPaneProps>
): JSX.Element => {

    const {
        children,
        rest
    } = props;

    return (
        <Tab.Pane attached={ false } { ...rest }>{ children }</Tab.Pane>
    );
};
