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
 * @param {StatsInsightsWidgetPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
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
