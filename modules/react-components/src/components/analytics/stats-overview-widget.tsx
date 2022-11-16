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
import kebabCase from "lodash-es/kebabCase";
import React, { FunctionComponent, ReactElement } from "react";
import { Divider, Grid, GridColumn, HeaderProps, SemanticWIDTHS } from "semantic-ui-react";
import { StatCountCard, StatCountCardPropsInterface } from "../card";
import { Media } from "../media";
import { Heading } from "../typography";

/**
 *
 * Prop-types for the statistics overview widget.
 */
interface StatsOverviewWidgetPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Heading for the widget
     */
    heading?: string;
    /**
     * Element to render heading.
     */
    headingAs?: HeaderProps["as"];
    /**
     * Maximum card count in a row.
     */
    maxRowCount?: number;
    /**
     * Sub heading for the widget.
     */
    subHeading?: string;
    /**
     * Element to render sub heading.
     */
    subHeadingAs?: HeaderProps["as"];
    /**
     * Set of stats for the widget.
     */
    stats: StatCountCardPropsInterface[];
}

/**
 * Statistics overview widget.
 *
 * @param props - Props injected to the component.
 *
 * @returns Stats Overview Widget.
 */
export const StatsOverviewWidget: FunctionComponent<StatsOverviewWidgetPropsInterface> = (
    props: StatsOverviewWidgetPropsInterface
): ReactElement => {

    const {
        heading,
        headingAs,
        maxRowCount,
        subHeading,
        subHeadingAs,
        stats,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const resolveStatCountCard = (stat: StatCountCardPropsInterface) => {

        const {
            icon,
            label,
            value,
            iconOptions,
            statOptions,
            ...statRest
        } = stat;

        return (
            <StatCountCard
                fluid
                icon={ icon }
                label={ label }
                value={ value }
                textAlign="right"
                statOptions={ {
                    size: "small",
                    textAlign: "right",
                    ...statOptions
                } }
                iconOptions={ {
                    background: "default",
                    fill: "default",
                    shape: "circular",
                    ...iconOptions
                } }
                { ...statRest }
                data-componentid={ `${ componentId }-${ kebabCase(label) }-card` }
                data-testid={ `${ testId }-${ kebabCase(label) }-card` }
            />
        );
    };

    return (
        <>
            { heading && (
                <Heading
                    className="stats-overview-widget-heading inline ellipsis"
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
                    className="stats-overview-widget-sub-heading"
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
                (stats && stats instanceof Array && stats.length > 0)
                    ? (
                        <Grid>
                            <Grid.Row
                                columns={
                                    ((stats.length > maxRowCount) ? maxRowCount : stats.length) as SemanticWIDTHS
                                }
                                className={
                                    ((stats.length > maxRowCount) ? "column-count-exceeded" : "")
                                }
                            >
                                {
                                    stats.map((stat, index) => (
                                        <>
                                            <GridColumn
                                                key={ index }
                                                as={ Media }
                                                width={ 16 }
                                                className="with-bottom-gutters"
                                                lessThan="tablet"
                                            >
                                                { resolveStatCountCard(stat) }
                                            </GridColumn>

                                            <GridColumn
                                                key={ index }
                                                as={ Media }
                                                greaterThan="tablet"
                                            >
                                                { resolveStatCountCard(stat) }
                                            </GridColumn>
                                        </>
                                    ))
                                }
                            </Grid.Row>
                        </Grid>
                    )
                    : null
            }
        </>
    );
};

/**
 * Default props for the component.
 */
StatsOverviewWidget.defaultProps = {
    "data-componentid": "stats-overview-widget",
    "data-testid": "stats-overview-widget",
    headingAs: "h3",
    maxRowCount: 4,
    subHeadingAs: "h5"
};
