/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Heading, Text } from "@wso2is/react-components";
import classNames from "classnames";
import cloneDeep from "lodash-es/cloneDeep";
import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Grid } from "semantic-ui-react";
import { CategoryItem } from "./app-category-item";
import { CardExpandedNavigationButton } from "./card-expanded-navigation-button";
import { getApplicationTemplateIllustrations } from "../../../../admin-applications-v1/configs/ui";
import CustomApplicationTemplate from
    "../../../../admin-applications-v1/data/application-templates/templates/custom-application/custom-application.json";
import {
    ApplicationTemplateListItemInterface
} from "../../../../admin-applications-v1/models";
import {
    ApplicationTemplateManagementUtils
} from "../../../../admin-applications-v1/utils/application-template-management-utils";
import { AppConstants, AppState, EventPublisher, history } from "../../../../features/core";

export type DynamicApplicationContextCardPropsInterface = {
    onTemplateSelected: (group: ApplicationTemplateListItemInterface) => void;
} & IdentifiableComponentInterface;

export type Context = "TEMPLATES" | "RECENT_APPS";

export const DynamicApplicationContextCard: FC<DynamicApplicationContextCardPropsInterface> = (
    props: DynamicApplicationContextCardPropsInterface
) => {

    const {
        onTemplateSelected,
        ["data-componentid"]: testId
    } = props;

    const eventPublisher: EventPublisher = EventPublisher.getInstance();
    const applicationTemplates: ApplicationTemplateListItemInterface[] = useSelector(
        (state: AppState) => state?.application?.groupedTemplates
    );
    const [ context, setContext ] = useState<Context | undefined>(undefined);

    /**
     * Figure out which context should be shown initially.
     * If there's one or more applications is available then
     * we show the recent apps view.
     */
    useEffect(() => {
        setContext("TEMPLATES");
    }, []);

    /**
     * Fetch the application templates if
     * {@link applicationTemplates} is unavailable.
     */
    useEffect(() => {
        if (applicationTemplates === undefined) {
            ApplicationTemplateManagementUtils.getApplicationTemplates().finally();
        }
    }, [ applicationTemplates ]);

    const handleTemplateSelection = (templateId: string): void => {

        if (!applicationTemplates) return;

        let selected: ApplicationTemplateListItemInterface =
            applicationTemplates.find(
                ({ templateId: matcher }: ApplicationTemplateListItemInterface) => matcher === templateId);

        if (!selected) return;

        if (templateId === CustomApplicationTemplate.id) {
            selected = cloneDeep(CustomApplicationTemplate);
        }

        eventPublisher.publish("application-click-create-new", {
            source: "getting-started-page",
            type: selected.templateId
        });

        onTemplateSelected(selected);
    };

    /**
     * Handler for view all applications button.
     */
    const onViewAllApplicationsClick = (e: React.SyntheticEvent): void => {
        e?.preventDefault();
        eventPublisher.publish("console-getting-started-view-all-applications-path");
        history.push({
            pathname: AppConstants.getPaths().get("APPLICATIONS")
        });
    };

    const tile1: JSX.Element = (
        <CategoryItem
            data-componentid={ `${ testId }-single-page-application-creation-tile` }
            className={
                classNames("ui scale transition", {
                    "animating in visible": context === "TEMPLATES",
                    "hidden animating out": context !== "TEMPLATES"
                })
            }
            onClick={ () => {
                handleTemplateSelection(
                    "single-page-application"
                );
            } }
            iconSize="tiny"
            techStackIcons={ [
                getApplicationTemplateIllustrations().spa
            ] }
            categoryName="Single-Page Application"
        />
    );

    const tile2: JSX.Element = (
        <CategoryItem
            data-componentid={ `${ testId }-traditional-web-application-creation-tile` }
            className={
                classNames("ui scale transition", {
                    "animating in visible": context === "TEMPLATES",
                    "hidden animating out": context !== "TEMPLATES"
                })
            }
            onClick={ () => {
                handleTemplateSelection(
                    "traditional-web-application"
                );
            } }
            iconSize="tiny"
            techStackIcons={ [
                getApplicationTemplateIllustrations().oidcWebApp
            ] }
            categoryName="Traditional Web Application"
        />
    );

    const tile3: JSX.Element = (
        <CategoryItem
            data-componentid={ `${ testId }-mobile-application-creation-tile` }
            onClick={ () => {
                handleTemplateSelection(
                    "mobile-application"
                );
            } }
            iconSize="tiny"
            className={
                classNames("ui scale transition", {
                    "animating in visible": context === "TEMPLATES",
                    "hidden animating out": context !== "TEMPLATES"
                })
            }
            techStackIcons={ [
                getApplicationTemplateIllustrations().oidcMobile
            ] }
            categoryName="Mobile Application"
        />
    );

    const tile4: JSX.Element = (
        <CategoryItem
            data-componentid={ `${ testId }-custom-application-creation-tile` }
            onClick={ () => {
                handleTemplateSelection(
                    "custom-application"
                );
            } }
            iconSize="tiny"
            className={
                classNames("ui scale transition", {
                    "animating in visible": context === "TEMPLATES",
                    "hidden animating out": context !== "TEMPLATES"
                })
            }
            techStackIcons={ [
                getApplicationTemplateIllustrations().customApp
            ] }
            categoryName="Standard-Based Application"
        />
    );

    return (
        <Card
            fluid
            data-componentid="application-integration-card"
            data-testid="application-integration-card"
            className="basic-card no-hover getting-started-card social-connections-card"
        >
            <Card.Content extra className="description-container">
                <div className="card-heading mb-1">
                    <Heading as="h2">
                    Onboard and manage apps
                    </Heading>
                </div>
                <Text muted>
                    Choose the type of application
                </Text>
            </Card.Content>
            <Card.Content style={ { borderTop: "none" } } className="illustration-container">
                <Grid>
                    <Grid.Row columns={ 2 } style={ { rowGap: "13px" } }>
                        {
                            [ tile1, tile2, tile3, tile4 ].map((tile: JSX.Element, index: number) => (
                                <Grid.Column width={ 8 } key={ `tile-${ index }` }>
                                    <Text>{ tile }</Text>
                                </Grid.Column>
                            ))
                        }
                    </Grid.Row>
                </Grid>

            </Card.Content>
            <Card.Content extra className="action-container">
                <CardExpandedNavigationButton
                    data-componentid={ `${
                        testId
                    }-navigate-to-application-list-button` }
                    onClick={ onViewAllApplicationsClick }
                    text="View all applications"
                    icon="angle right"
                    iconPlacement="right"
                    className="primary-action-button"
                />
            </Card.Content>
        </Card>
    );

};

/**
 * Default props of {@link DynamicApplicationContextCard}
 */
DynamicApplicationContextCard.defaultProps = {
    "data-componentid": "dynamic-application-context-card"
};
