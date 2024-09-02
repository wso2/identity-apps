/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { ResourceTab } from "@wso2is/react-components";
import React, { ElementType, FunctionComponent, ReactElement } from "react";
import { Grid } from "semantic-ui-react";

/**
 * Props interface for the QuickStartTab component.
 */
interface QuickStartTabPropsInterface extends TestableComponentInterface {
    /**
     * Content to be rendered.
     */
    content: ElementType;
    /**
     * Dynamic attributes for the component.
     */
    [key: string]: any;
}

/**
 * QuickStartTab component.
 *
 * @param props - Props injected to the component.
 * @returns The QuickStartTab component.
 */
const QuickStartTab: FunctionComponent<QuickStartTabPropsInterface> = ({
    content: Content,
    ["data-testid"]: testId,
    ...rest
}: QuickStartTabPropsInterface): ReactElement => {
    return (
        <ResourceTab.Pane controlledSegmentation>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={ 16 }>
                        <Content data-testid={ testId } { ...rest } />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </ResourceTab.Pane>
    );
};

export default QuickStartTab;
