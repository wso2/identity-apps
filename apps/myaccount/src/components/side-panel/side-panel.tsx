/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { TestableComponentInterface } from "@wso2is/core/models";
import * as React from "react";
import { SidePanelItems } from "./side-panel-items";

/**
 * Side panel base component Prop types.
 */
export interface SidePanelProps extends TestableComponentInterface {
    headerHeight: number;
    onSidePanelItemClick: () => void;
}

/**
 * Side panel base component.
 *
 * @return {JSX.Element}
 */
export const SidePanel: React.FunctionComponent<SidePanelProps> = (props: SidePanelProps): JSX.Element => {

    const {
        headerHeight,
        onSidePanelItemClick,
        ["data-testid"]: testId
    } = props;

    return (
        <SidePanelItems
            data-testid={ testId }
            type="desktop"
            onSidePanelItemClick={ onSidePanelItemClick }
            headerHeight={ headerHeight }
        />
    );

};

/**
 * Default props of {@link SidePanel}
 * See type definitions in {@link SidePanelProps}
 */
SidePanel.defaultProps = {
    "data-testid": "side-panel"
};
