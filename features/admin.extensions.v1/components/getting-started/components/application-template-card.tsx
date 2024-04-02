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
import { ContentLoader, Heading, Text } from "@wso2is/react-components";
import classNames from "classnames";
import cloneDeep from "lodash-es/cloneDeep";
import React, { FC, JSXElementConstructor, MouseEvent, ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Divider, Grid } from "semantic-ui-react";
import { CategoryItem } from "./app-category-item";
import { ApplicationAddTile } from "./application-add-tile";
import { ApplicationTile } from "./application-tile";
import { getApplicationTemplateIllustrations } from "../../../../admin.applications.v1/configs/ui";
import CustomApplicationTemplate from
    "../../../../admin.applications.v1/data/application-templates/templates/custom-application/custom-application.json";
import {
    ApplicationListItemInterface,
    ApplicationTemplateListItemInterface
} from "../../../../admin.applications.v1/models";
import {
    ApplicationTemplateManagementUtils
} from "../../../../admin.applications.v1/utils/application-template-management-utils";
import { AppState, EventPublisher } from "../../../../admin.core.v1";

export type DynamicApplicationContextCardPropsInterface = {
    applications: ApplicationListItemInterface[];
    isApplicationsFetchRequestLoading?: boolean;
    isApplicationsAvailable?: boolean;
    onTemplateSelected: (group: ApplicationTemplateListItemInterface) => void;
} & IdentifiableComponentInterface;

export type Context = "TEMPLATES" | "RECENT_APPS";

export const ApplicationTemplateCard: FC<DynamicApplicationContextCardPropsInterface> = (
    props: DynamicApplicationContextCardPropsInterface
) => {

    const {
        applications,
        isApplicationsAvailable,
        isApplicationsFetchRequestLoading,
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
        if (isApplicationsAvailable && applications.length > 0) {
            setContext("RECENT_APPS");
        } else {
            setContext("TEMPLATES");
        }
    }, [ isApplicationsAvailable, applications ]);

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
            applicationTemplates
                .find(({ templateId: matcher }: ApplicationTemplateListItemInterface) => matcher === templateId);

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

    const tile1: ReactElement = (
        context === "RECENT_APPS"
            ? (
                <ApplicationAddTile
                    data-componentid={ `${ testId }-app-add-action-tile` }
                    onClick={ (e: MouseEvent) => {
                        e?.preventDefault();
                        eventPublisher.publish("console-getting-started-add-application-path");
                        setContext(
                            context === "RECENT_APPS"
                                ? "TEMPLATES"
                                : "RECENT_APPS"
                        );
                    } }
                />
            )
            : (
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
                    categoryName="Single-Page Application"/>
            )
    );

    const tile2: ReactElement = (
        context === "RECENT_APPS"
            ? (
                <div
                    className={
                        classNames("ui scale transition visible", {
                            "animating in visible flex-layout": context === "RECENT_APPS",
                            "hidden animating out": context !== "RECENT_APPS"
                        })
                    }
                >
                    <ApplicationTile
                        data-componentid={ `${ testId }-app-list-item-1` }
                        application={ applications[0] }
                    />
                </div>
            )
            : (
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
                    categoryName="Traditional Web Application"/>
            )
    );

    const tile3: ReactElement = (
        context === "RECENT_APPS"
            ? (
                <div
                    className={
                        classNames("ui scale transition", {
                            "animating in visible flex-layout": context === "RECENT_APPS",
                            "hidden animating out": context !== "RECENT_APPS"
                        })
                    }
                >
                    <ApplicationTile
                        data-componentid={ `${ testId }-app-list-item-2` }
                        application={ applications[1] }
                    />
                </div>
            )
            : (
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
            )
    );

    const tile4: ReactElement = (
        context === "RECENT_APPS"
            ? (
                <div
                    style={ { animationDuration: "350ms" } }
                    className={
                        classNames("ui scale transition", {
                            "animating in visible flex-layout": context === "RECENT_APPS",
                            "hidden animating out": context !== "RECENT_APPS"
                        })
                    }>
                    <ApplicationTile
                        data-componentid={ `${ testId }-app-list-item-3` }
                        application={ applications[2] }
                    />
                </div>
            )
            : (
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
                    categoryName="Standard-Based Application"/>
            )
    );

    return (
        <Card
            fluid
            data-componentid="application-integration-card"
            data-testid="application-integration-card"
            className="basic-card no-hover context-card application-template-card"
        >
            { /*Card Heading*/ }
            <Card.Content extra className="no-borders mb-0 pb-0 pt-4" textAlign="center">
                <div className="card-heading">
                    <Heading bold="500" as="h2">
                        Onboard your application
                    </Heading>
                </div>
            </Card.Content>
            <Divider className="0.5x" hidden/>
            { /*Card Body*/ }
            <Card.Content className="pt-0 px-2 no-borders">
                <Grid>
                    <Grid.Row columns={ 2 } style={ { rowGap: "20px" } }>
                        {
                            [ tile1, tile2, tile3, tile4 ]
                                .map((tile: ReactElement<any, string | JSXElementConstructor<any>>, index: number) => (
                                    <Grid.Column width={ 8 } key={ `tile-${ index }` }>
                                        <Text>{ tile }</Text>
                                    </Grid.Column>
                                ))
                        }
                    </Grid.Row>
                </Grid>
            </Card.Content>
            { isApplicationsFetchRequestLoading && <ContentLoader /> }
        </Card>
    );

};

/**
 * Default props of {@link DynamicApplicationContextCard}
 */
ApplicationTemplateCard.defaultProps = {
    "data-componentid": "dynamic-application-context-card"
};
