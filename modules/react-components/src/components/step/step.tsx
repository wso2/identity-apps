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
import React, { CSSProperties, FunctionComponent, ReactElement } from "react";
import { GenericIcon } from "../icon";

/**
 * Interface for the step component.
 */
export interface StepPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Determines if the step is active or not.
     */
    active?: boolean;
    /**
     * Additional classes.
     */
    className?: string;
    /**
     * Icon for the step.
     */
    icon: any;
    /**
     * Determines the status of the step.
     */
    status?: undefined | "active" | "completed";
    /**
     * Step number.
     */
    stepNumber?: number;
    /**
     * Custom styles object
     */
    style?: CSSProperties | undefined;
    /**
     * Title for the step.
     */
    title?: string;
}

/**
 * Step component.
 *
 * @param {StepPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const Step: FunctionComponent<StepPropsInterface> = (
    props: StepPropsInterface
): ReactElement => {

    const {
        className,
        icon,
        style,
        status,
        title,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const classes = classNames(
        "step",
        {
            [ status ]: status
        },
        className
    );

    return (
        <div className={ classes } style={ style } data-testid={ testId } data-componentid={ componentId }>
            <div className="step-icon-wrapper">
                <GenericIcon
                    className="step-icon"
                    icon={ icon }
                    size="micro"
                    data-testid={ `${ testId }-icon` }
                    data-componentid={ `${ componentId }-icon` }
                    inline
                    transparent
                />
                <div
                    className="step-checked"
                    data-componentid={ `${ componentId }-checked` }
                    data-testid={ `${ testId }-checked` }
                >
                </div>
            </div>
            { title && (
                <div
                    className="step-title"
                    data-componentid={ `${ componentId }-title` }
                    data-testid={ `${ testId }-title` }
                >
                    { title }
                </div>
            ) }
        </div>
    );
};

/**
 * Default props for the steps component.
 */
Step.defaultProps = {
    "data-componentid": "step",
    "data-testid": "step",
    status: undefined
};
