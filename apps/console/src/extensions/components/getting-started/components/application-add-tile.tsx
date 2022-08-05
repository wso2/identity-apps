/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import React, { FC, ReactElement } from "react";
import { Icon } from "semantic-ui-react";
import { DynamicTile, DynamicTilePropsInterface } from "./dynamic-tile";

export type ApplicationAddTilePropsInterface = DynamicTilePropsInterface;

export const ApplicationAddTile: FC<ApplicationAddTilePropsInterface> = (
    props: ApplicationAddTilePropsInterface
): ReactElement => (
    <DynamicTile
        { ...props }
        outlined
        body={ (
            <div className="stacked-content">
                <Icon
                    name="plus circle"
                    size="huge"
                    fitted
                    className="primary"
                />
                <p>Add Application</p>
            </div>
        ) }
    />
);
