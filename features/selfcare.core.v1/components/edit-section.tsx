/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import classNames from "classnames";
import React, { PropsWithChildren } from "react";
import { Segment } from "semantic-ui-react";

/**
 * Prop-types for the edit section component.
 */
interface EditSectionProps extends TestableComponentInterface {
    /**
     * External CSS classes.
     */
    className?: string;
    /**
     * Should shoe a top margin.
     */
    marginTop?: boolean;
}

/**
 * Edit section component.
 *
 * @param props - Props injected to the component.
 * @returns Edit section component.
 */
export const EditSection: React.FunctionComponent<PropsWithChildren<EditSectionProps>> = (
    props: PropsWithChildren<EditSectionProps>
): JSX.Element => {

    const {
        className,
        marginTop,
        ["data-testid"]: testId
    } = props;

    const classes = classNames("edit-segment",{
        "top-margin": marginTop
    }, className);

    return (
        <Segment padded className={ classes } data-testid={ testId }>
            { props.children }
        </Segment>
    );
};

/**
 * Default props of {@link EditSection} Also see
 * {@link EditSectionProps}
 */
EditSection.defaultProps = {
    "data-testid": "edit-section"
};
