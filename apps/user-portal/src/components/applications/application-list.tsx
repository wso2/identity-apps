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

import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { Button, Grid } from "semantic-ui-react";
import { EmptyPlaceholderIllustrations } from "../../configs";
import { Application } from "../../models";
import { EmptyPlaceholder } from "../shared";
import { ApplicationListItem } from "./application-list-item";

/**
 * Proptypes for the application list component.
 */
interface ApplicationListProps {
    apps: Application[];
    loading: boolean;
    onAppNavigate: (id: string, url: string) => void;
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
    const { apps, onAppNavigate, onSearchQueryClear, loading, searchQuery, showFavourites } = props;
    const { t } = useTranslation();

    return (
        <Grid>
            <Grid.Row>
                {
                    (apps && apps.length && apps.length > 0)
                        ? apps.map((app) => (
                            <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 5 } key={ app.id }>
                                <ApplicationListItem
                                    app={ app }
                                    showFavouriteIcon={ showFavourites }
                                    onAppNavigate={ onAppNavigate }
                                />
                            </Grid.Column>
                        ))
                        : !loading && (
                        <Grid.Column width={ 16 }>
                            <EmptyPlaceholder
                                action={ (
                                    <Button
                                        className="link-button"
                                        onClick={ onSearchQueryClear }
                                    >
                                        { t("views:placeholders.emptySearchResult.action") }
                                    </Button>
                                ) }
                                image={ EmptyPlaceholderIllustrations.search }
                                title={ t("views:placeholders.emptySearchResult.title") }
                                subtitle={ [
                                    t("views:placeholders.emptySearchResult.subtitles.0",
                                        { query: searchQuery }),
                                    t("views:placeholders.emptySearchResult.subtitles.1"),
                                ] }
                            />
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
