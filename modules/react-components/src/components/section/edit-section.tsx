/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { Segment } from "semantic-ui-react";

/**
 * Proptypes for the edit section component.
 */
export interface EditSectionPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Shw/ Hide top margin.
     */
    marginTop?: boolean;
}

/**
 * Edit section component.
 *
 * @param props - props for the EditSection component
 *
 * @returns EditSection React Component
 */
export const EditSection: FunctionComponent<PropsWithChildren<EditSectionPropsInterface>> = (
    props: PropsWithChildren<EditSectionPropsInterface>
): ReactElement => {

    const {
        marginTop,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const classes = classNames({
        "top-margin": marginTop
    });

    return (
        <Segment
            padded
            className={ `edit-segment ${classes}` }
            data-componentid={ componentId }
            data-testid={ testId }
        >
            { props.children }
        </Segment>
    );
};

/**
 * Default proptypes for the markdown component.
 */
EditSection.defaultProps = {
    "data-componentid": "edit-section"
};
