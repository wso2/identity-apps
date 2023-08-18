/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

interface QuickStartTabPropsInterface extends TestableComponentInterface {
    content: ElementType;
}

/**
 * A function returning a ReactElement to render tab panes.
 */
const QuickStartTab: FunctionComponent<QuickStartTabPropsInterface> = (
    props: QuickStartTabPropsInterface
): ReactElement => {

    const {
        content: Content,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    return (
        <ResourceTab.Pane controlledSegmentation>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={ 16 } >
                        <Content data-testid={ testId } { ...rest } />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </ResourceTab.Pane>
    );
};

export default QuickStartTab;
