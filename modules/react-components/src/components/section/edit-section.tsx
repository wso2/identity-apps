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
 * @param {React.PropsWithChildren<any>} props
 *
 * @return {React.ReactElement}
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
