/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import React, { Fragment, FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { Button, Grid } from "semantic-ui-react";
import { ApplicationListItem } from "./application-list-item";
import { EmptyPlaceholderIllustrations } from "../../configs";
import { Application } from "../../models";
import { EmptyPlaceholder } from "../shared";

/**
 * Proptypes for the application list component.
 */
interface ApplicationListProps {
    apps: Application[];
    loading: boolean;
    onAppNavigate: (id: string, url: string) => void;
    onListRefresh: () => void;
    onSearchQueryClear: () => void;
    searchQuery: string;
    showFavourites?: boolean;
}

/**
 * Application list component.
 *
 * @return {JSX.Element}
 */
export const ApplicationList: FunctionComponent<ApplicationListProps> = (
    props: ApplicationListProps
): JSX.Element => {
    const { apps, onAppNavigate, onListRefresh, onSearchQueryClear, loading, searchQuery, showFavourites } = props;
    const { t } = useTranslation();

    /**
     * Shows list placeholders.
     * @return {JSX.Element}
     */
    const showPlaceholders = (): JSX.Element => {
        // When the search returns empty.
        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <Button
                            className="link-button"
                            onClick={ onSearchQueryClear }
                        >
                            { t("userPortal:placeholders.emptySearchResult.action") }
                        </Button>
                    ) }
                    image={ EmptyPlaceholderIllustrations.search }
                    title={ t("userPortal:placeholders.emptySearchResult.title") }
                    subtitle={ [
                        t("userPortal:placeholders.emptySearchResult.subtitles.0",
                            { query: searchQuery }),
                        t("userPortal:placeholders.emptySearchResult.subtitles.1")
                    ] }
                />
            );
        }

        return (
            <EmptyPlaceholder
                action={ (
                    <Button
                        className="link-button"
                        onClick={ onListRefresh }
                    >
                        { t("userPortal:components.applications.placeholders.emptyList.action") }
                    </Button>
                ) }
                image={ EmptyPlaceholderIllustrations.emptyList }
                imageSize="tiny"
                title={ t("userPortal:components.applications.placeholders.emptyList.title") }
                subtitle={ [
                    t("userPortal:components.applications.placeholders.emptyList.subtitles.0"),
                    t("userPortal:components.applications.placeholders.emptyList.subtitles.1"),
                    t("userPortal:components.applications.placeholders.emptyList.subtitles.2")
                ] }
            />
        );
    };

    return (
        <Grid>
            <Grid.Row>
                {
                    (apps && apps.length && apps.length > 0)
                        ? apps.map((app) => (
                            <Fragment key={ app.id }>
                                <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 5 }>
                                    <ApplicationListItem
                                        app={ app }
                                        showFavouriteIcon={ showFavourites }
                                        onAppNavigate={ onAppNavigate }
                                    />
                                </Grid.Column>
                            </Fragment>
                            )
                        )
                        : !loading && (
                            <Grid.Column width={ 16 }>
                                { showPlaceholders() }
                            </Grid.Column>
                        )
                }
            </Grid.Row>
        </Grid>
    );
};

/**
 * Default proptypes for the application list component.
 */
ApplicationList.defaultProps = {
    showFavourites: true
};
