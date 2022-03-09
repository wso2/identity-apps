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
import kebabCase from "lodash-es/kebabCase";
import React, { FunctionComponent, ReactElement } from "react";
import { Card, Divider, HeaderProps } from "semantic-ui-react";
import { SelectionCard, SelectionCardPropsInterface } from "../card";
import { Heading } from "../typography";

/**
 * Proptypes for the statistics quick links widget.
 */
interface StatsQuickLinksWidgetPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Heading for the widget
     */
    heading?: string;
    /**
     * Element to render heading.
     */
    headingAs?: HeaderProps["as"];
    /**
     * Sub heading for the widget.
     */
    subHeading?: string;
    /**
     * Element to render sub heading.
     */
    subHeadingAs?: HeaderProps["as"];
    /**
     * Set of quick links.
     */
    links: SelectionCardPropsInterface[];
}

/**
 * Statistics quick links widget.
 *
 * @param {StatsQuickLinksWidgetPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const StatsQuickLinksWidget: FunctionComponent<StatsQuickLinksWidgetPropsInterface> = (
    props: StatsQuickLinksWidgetPropsInterface
): ReactElement => {

    const {
        heading,
        headingAs,
        subHeading,
        subHeadingAs,
        links,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    return (
        <div className="stats-quick-links-widget">
            { heading && (
                <Heading
                    className="stats-quick-links-widget-heading inline ellipsis"
                    as={ headingAs }
                    data-componentid={ `${ componentId }-heading` }
                    data-testid={ `${ testId }-heading` }
                    compact
                >
                    { heading }
                </Heading>
            ) }
            { subHeading && (
                <Heading
                    className="stats-quick-links-widget-sub-heading"
                    data-componentid={ `${ componentId }-sub-heading` }
                    data-testid={ `${ testId }-sub-heading` }
                    as={ subHeadingAs }
                    subHeading
                    ellipsis
                >
                    { subHeading }
                </Heading>
            ) }
            { (heading || subHeading) && <Divider hidden/> }
            {
                (links && links instanceof Array && links.length > 0)
                    ? (
                        <Card.Group itemsPerRow={ 3 } stackable doubling className="stats-quick-links-widget-cards">
                            {
                                links.map((link, index) => {

                                    const {
                                        image,
                                        header,
                                        description,
                                        ...linksRest
                                    } = link;

                                    return (
                                        <SelectionCard
                                            key={ index }
                                            image={ image }
                                            imageOptions={ {
                                                fill: "default"  
                                            } }
                                            size="auto"
                                            header={ header }
                                            imageSize="mini"
                                            contentTopBorder={ false }
                                            description={ description }
                                            data-componentid={ `${ componentId }-${ kebabCase(header) }-card` }
                                            data-testid={ `${ testId }-${ kebabCase(header) }-card` }
                                            multilineDescription
                                            showTooltips
                                            { ...linksRest }
                                        />
                                    );
                                })
                            }
                        </Card.Group>
                    )
                    : null
            }
        </div>
    );
};

/**
 * Default props for the component.
 */
StatsQuickLinksWidget.defaultProps = {
    "data-componentid": "stats-quick-links-widget",
    "data-testid": "stats-quick-links-widget",
    headingAs: "h3",
    subHeadingAs: "h5"
};
