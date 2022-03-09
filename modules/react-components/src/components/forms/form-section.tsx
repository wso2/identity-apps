/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import React, { FunctionComponent, PropsWithChildren, ReactElement, ReactNode } from "react";
import { Divider } from "semantic-ui-react";
import { Heading } from "../typography";

/**
 * Form Section component Prop types.
 */
export interface FormSectionPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Addition classes.
     */
    className?: string;
    /**
     * Section Heading.
     */
    heading: ReactNode;
    /**
     * Heading level.
     * @remarks Adding more options will result in consistency issues. Add with caution....
     */
    headingLevel?: "h5"
}

/**
 * Content to define a form section.
 *
 * @param {FormSectionPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const FormSection: FunctionComponent<PropsWithChildren<FormSectionPropsInterface>> = (
    props: PropsWithChildren<FormSectionPropsInterface>
): ReactElement => {

    const {
        children,
        className,
        heading,
        headingLevel,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const classes = classNames(
        "form-section"
        , className
    );

    return (
        <div className={ classes } data-testid={ testId } data-componentid={ componentId }>
            <Divider className="form-section-top-divider" />
            <Heading className="form-section-heading" as={ headingLevel }>
                { heading }
            </Heading>
            <Divider className="form-section-bottom-divider" hidden />
            { children }
        </div>
    );
};

/**
 * Default props for the component.
 */
FormSection.defaultProps = {
    "data-componentid": "form-section",
    "data-testid": "form-section",
    headingLevel: "h5"
};
