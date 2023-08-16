/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { Header, Segment } from "semantic-ui-react";

/**
 * Danger zone group component Prop types.
 */
export interface DangerZoneGroupProps extends TestableComponentInterface, IdentifiableComponentInterface {
    /**
     * Danger zone section heading.
     */
    sectionHeader: string;
}

/**
 * Danger zone group component.
 *
 * @param props - Props injected to the danger zone group component.
 *
 * @returns the Danger zone group component
 */
export const DangerZoneGroup: FunctionComponent<PropsWithChildren<DangerZoneGroupProps>> = (
    props: PropsWithChildren<DangerZoneGroupProps>
): ReactElement => {

    const {
        sectionHeader,
        children,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    return (
        <div className="danger-zone-group-wrapper">
            <Header
                as="h5"
                className="bold-text"
                data-componentid={ `${ componentId }-header` }
                data-testid={ `${ testId }-header` }
            >
                { sectionHeader }
            </Header>
            <Segment.Group
                className="danger-zone-group"
                data-componentid={ `${ componentId }` }
                data-testid={ `${ testId }` }
            >
                { children }
            </Segment.Group>
        </div>
    );
};

/**
 * Default props for the danger zone group component.
 */
DangerZoneGroup.defaultProps = {
    "data-componentid": "danger-zone-group",
    "data-testid": "danger-zone-group"
};
