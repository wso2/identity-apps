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

import classNames from "classnames";
import React, { FunctionComponent } from "react";
import { Tab, TabProps } from "semantic-ui-react";
import { ResourceTabPane } from "./resource-tab-pane";

/**
 * Interface for the resource tab sub components.
 */
interface ResourceTabSubComponentsInterface {
    Pane: typeof ResourceTabPane;
}

/**
 * Resource tab component.
 *
 * @param {TabProps} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const ResourceTab: FunctionComponent<TabProps> & ResourceTabSubComponentsInterface = (
    props: TabProps
): JSX.Element => {

    const {
        className,
        panes,
        rest
    } = props;

    const classes = classNames(
        "tabs resource-tabs"
        , className
    );

    return (
        <Tab
            className={ classes }
            menu={ { secondary: true, pointing: true } }
            panes={ panes }
            { ...rest }
        />
    );
};

ResourceTab.Pane = ResourceTabPane;
