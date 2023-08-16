/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
 * @param props - Props injected to the component.
 *
 * @returns the StatsQuickLinks Widget
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
