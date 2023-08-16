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
 * @param props - Props injected to the component.
 *
 * @returns a React component
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
