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
 * @param {React.PropsWithChildren<StepsPropsInterface>} props - Props injected to the component.
 *
 * @return {React.ReactElement}
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
            style={ style } data-testid={ testId }
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
