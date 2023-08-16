/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
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
