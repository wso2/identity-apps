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
import React, {
    CSSProperties,
    Children,
    FunctionComponent,
    PropsWithChildren,
    ReactElement,
    cloneElement,
    useEffect,
    useState
} from "react";
import { Divider } from "semantic-ui-react";
import { Step } from "./step";

/**
 * Steps component prop types.
 */
export interface StepsPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Currently active step.
     */
    current?: number;
    /**
     * Additional classes.
     */
    className?: string;
    /**
     * Header to display above the steps.
     */
    header?: string;
    /**
     * Initially active step.
     */
    initial?: number;
    /**
     * Custom styles object
     */
    style?:  CSSProperties | undefined;
}

/**
 * Steps component.
 *
 * @param props - Props injected to the component.
 *
 * @returns a React component
 */
export const Steps: FunctionComponent<PropsWithChildren<StepsPropsInterface>> & StepsSubComponentsInterface = (
    props: PropsWithChildren<StepsPropsInterface>
): ReactElement => {

    const {
        children,
        className,
        current,
        header,
        initial,
        style,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const [ filteredChildren, setFilteredChildren ] = useState<any>([]);

    const classes = classNames(
        "steps",
        className
    );

    useEffect(() => {
        setFilteredChildren(React.Children.toArray(children).filter((child) => !!child));
    }, [ children ]);

    return (
        <div
            className={ classes }
            style={ style }
            data-testid={ testId }
            data-componentid={ componentId }
        >
            { header && (
                <>
                    <div
                        className="header"
                        data-componentid={ `${ componentId }-header` }
                        data-testid={ `${ testId }-header` }
                    >
                        { header }
                    </div>
                    <Divider hidden/>
                </>
            ) }
            {
                Children.map(filteredChildren, (child, index) => {
                    if (!child) {
                        return null;
                    }

                    const stepNumber = initial + index;

                    const childProps = {
                        stepNumber: `${ stepNumber + 1 }`,
                        ...child.props
                    };

                    if (!child.props.status) {
                        if (stepNumber === current) {
                            childProps.status = "active";
                        } else if (stepNumber < current) {
                            childProps.status = "completed";
                        } else {
                            childProps.status = undefined;
                        }
                    }

                    childProps.active = stepNumber === current;

                    return cloneElement(child, childProps);
                })
            }
        </div>
    );
};

/**
 * Interface for the steps sub components.
 */
export interface StepsSubComponentsInterface {
    Group: typeof Steps;
    Step: typeof Step;
}

Steps.Group = Steps;
Steps.Step = Step;

/**
 * Wizard component default props.
 */
Steps.defaultProps = {
    current: 0,
    "data-componentid": "steps",
    "data-testid": "steps",
    initial: 0
};
