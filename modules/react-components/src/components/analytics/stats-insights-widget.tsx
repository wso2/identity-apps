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
import React, { FunctionComponent, PropsWithChildren, ReactElement, ReactNode } from "react";
import { Card, Divider, HeaderProps } from "semantic-ui-react";
import { LinkButton } from "../button";
import { Heading } from "../typography";

/**
 *
 * Proptypes for the stats insights widget.
 */
interface StatsInsightsWidgetPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Heading for the widget
     */
    heading?: string;
    /**
     * Element to render heading.
     */
    headingAs?: HeaderProps["as"];
    /**
     * Set of stats for the widget.
     */
    onPrimaryActionClick: () => void;
    /**
     * Primary action.
     */
    primaryAction: ReactNode;
    /**
     * Show card extra content.
     */
    showExtraContent?: boolean;
    /**
     * Sub heading for the widget.
     */
    subHeading?: string;
    /**
     * Element to render sub heading.
     */
    subHeadingAs?: HeaderProps["as"];
}

/**
 * Statistics insights preview widget.
 *
 * @param props - Props injected to the component.
 *
 * @returns Statistics insights preview widget.
 */
export const StatsInsightsWidget: FunctionComponent<PropsWithChildren<StatsInsightsWidgetPropsInterface>> = (
    props: PropsWithChildren<StatsInsightsWidgetPropsInterface>
): ReactElement => {

    const {
        children,
        heading,
        headingAs,
        onPrimaryActionClick,
        primaryAction,
        showExtraContent,
        subHeading,
        subHeadingAs,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    return (
        <div className="stats-insights-widget">
            { heading && (
                <Heading
                    className="stats-insights-widget-heading inline ellipsis"
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
                    className="stats-insights-widget-sub-heading"
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
            <Card
                fluid
                className="stats-insights-widget-card basic-card"
                data-componentid={ `${ componentId }-${ kebabCase(heading) }-card` }
                data-testid={ `${ testId }-${ kebabCase(heading) }-card` }
            >
                <Card.Content className={ `main-content compact ${ !showExtraContent ? "hide-extra" : "" } ` }>
                    { children }
                </Card.Content>
                { showExtraContent && (
                    <Card.Content
                        extra
                        className="selection"
                        data-componentid={ `${ componentId }-${ kebabCase(heading) }-card-action` }
                        data-testid={ `${ testId }-${ kebabCase(heading) }-card-action` }
                        onClick={ onPrimaryActionClick }
                    >
                        <LinkButton
                            compact
                            data-componentid={ `${ componentId }-${ kebabCase(heading) }-card-action-button` }
                            data-testid={ `${ testId }-${ kebabCase(heading) }-card-action-button` }
                        >
                            { primaryAction }
                        </LinkButton>
                    </Card.Content>
                ) }
            </Card>
        </div>
    );
};

/**
 * Default props for the component.
 */
StatsInsightsWidget.defaultProps = {
    "data-componentid": "stats-insights-widget",
    "data-testid": "stats-insights-widget",
    headingAs: "h3",
    showExtraContent: true,
    subHeadingAs: "h5"
};
