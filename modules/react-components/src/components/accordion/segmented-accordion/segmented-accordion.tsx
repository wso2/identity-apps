/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
import { Accordion, AccordionProps } from "semantic-ui-react";
import { SegmentedAccordionContent } from "./segmented-accordion-content";
import { SegmentedAccordionTitle } from "./segmented-accordion-title";

/**
 * Interface for the segmented accordion sub components.
 */
export interface SegmentedAccordionSubComponentsInterface {
    Content: typeof SegmentedAccordionContent;
    Title: typeof SegmentedAccordionTitle;
}

/**
 * Proptypes for the segmented accordion component.
 */
export interface SegmentedAccordionPropsInterface extends AccordionProps, IdentifiableComponentInterface,
    TestableComponentInterface { 
    /**
     * Type of final view of the list of accordion components.
     */
    viewType?: "list-view" | "table-view";
}

/**
 * Segmented accordion component.
 *
 * @param props - Props injected to the component.
 *
 * @returns
 */
export const SegmentedAccordion: FunctionComponent<SegmentedAccordionPropsInterface>
    & SegmentedAccordionSubComponentsInterface = (
        props: SegmentedAccordionPropsInterface
    ): ReactElement => {

        const {
            className,
            children,
            [ "data-componentid" ]: componentId,
            [ "data-testid" ]: testId,
            viewType,
            ...rest
        } = props;

        let classes;

        switch (viewType) {
            case "list-view": {
                classes = classNames(
                    "segmented-accordion",
                    className
                );

                break;
            }
            case "table-view": {
                classes = classNames(
                    "segmented-accordion-table-view",
                    className
                );

                break;
            }
            default: {
                classes = classNames(
                    "segmented-accordion",
                    className
                );
            }
        }

        return (
            <Accordion
                className={ classes }
                data-componentid={ componentId }
                data-testid={ testId }
                { ...rest }
            >
                { children }
            </Accordion>
        );
    };

/**
 * Default proptypes for the segmented accordion component.
 */
SegmentedAccordion.defaultProps = {
    "data-componentid": "segmented-accordion",
    "data-testid": "segmented-accordion",
    viewType: "list-view"
};

SegmentedAccordion.Title = SegmentedAccordionTitle;
SegmentedAccordion.Content = SegmentedAccordionContent;
