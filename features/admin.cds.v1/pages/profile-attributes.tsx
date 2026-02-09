/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { getSidePanelIcons } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { TestableComponentInterface } from "@wso2is/core/models";
import {
    EmphasizedSegment,
    GenericIcon,
    GridLayout,
    PageLayout
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid, Header, Icon, List, Placeholder, Popup } from "semantic-ui-react";

/**
 * Props for the Profile Schema page.
 */
type ProfileSchemaPageInterface = TestableComponentInterface;

/**
 * Profile Schema Page Component.
 *
 * @param props - Props injected to the component.
 * @returns ReactElement
 */
const ProfileSchemaPage: FunctionComponent<ProfileSchemaPageInterface> = (
    props: ProfileSchemaPageInterface
): ReactElement => {

    const { [ "data-testid" ]: testId } = props;

    const { t } = useTranslation();

    const [ isLoading, setIsLoading ] = useState(true);
    const cdmEnabled = true; // TODO: make this dynamic later

    useEffect(() => {
        // Simulate immediate load completion; replace with API call if needed
        setIsLoading(false);
    }, []);

    const renderHeaderPlaceholder = (): ReactElement => (
        <Placeholder>
            <Placeholder.Header>
                <Placeholder.Line />
            </Placeholder.Header>
        </Placeholder>
    );

    const renderSegmentPlaceholder = (): ReactElement => (
        <EmphasizedSegment>
            <Placeholder fluid>
                <Placeholder.Header image>
                    <Placeholder.Line length="very short" />
                    <Placeholder.Line />
                </Placeholder.Header>
            </Placeholder>
        </EmphasizedSegment>
    );

    const renderSegmentItem = (
        pathKey: string,
        icon: any,
        title: string,
        description: string
    ): ReactElement => (
        <EmphasizedSegment
            className="clickable"
            data-testid={ `${ testId }-${ pathKey.toLowerCase() }-container` }
            onClick={ () => history.push(AppConstants.getPaths().get(pathKey)) }
        >
            <List>
                <List.Item>
                    <Grid>
                        <Grid.Row columns={ 2 }>
                            <Grid.Column width={ 12 }>
                                <GenericIcon
                                    verticalAlign="middle"
                                    fill="primary"
                                    transparent
                                    icon={ icon }
                                    spaced="right"
                                    size="mini"
                                    floated="left"
                                />
                                <List.Header>{ title }</List.Header>
                                <List.Description>{ description }</List.Description>
                            </Grid.Column>
                            <Grid.Column
                                width={ 4 }
                                verticalAlign="middle"
                                textAlign="right"
                            >
                                <Popup
                                    content={ t("common:edit") }
                                    trigger={ <Icon color="grey" name="pencil" /> }
                                    inverted
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </List.Item>
            </List>
        </EmphasizedSegment>
    );

    return (
        <PageLayout
            pageTitle="Profile Schema"
            title="Profile Schema"
            description="View and manage attributes of profile schema"
            data-testid={ `${ testId }-page-layout` }
        >
            <GridLayout showTopActionPanel={ false }>
                {
                    isLoading ? (
                        <>
                            { renderHeaderPlaceholder() }
                            <Divider hidden />
                            { renderSegmentPlaceholder() }
                        </>
                    ) : (
                        <>
                            {/* <Header as="h4">Profile Schema</Header> */}
                            <Divider hidden />
                            { cdmEnabled && (
                                <>
                                    { renderSegmentItem("APPLICATION_DATA", getSidePanelIcons().applications, "Application Data", "Update application data in profile") }
                                    {/* { renderSegmentItem("APPLICATION_DATA", getSidePanelIcons().appData, "Application Data", "Update application data in profile") } */}
                                    { renderSegmentItem("TRAITS", getSidePanelIcons().traits, "Traits", "Update custom traits in profile") }
                                </>
                            )}
                        </>
                    )
                }
                <Divider hidden />
                <Divider hidden />
            </GridLayout>
        </PageLayout>
    );
};

ProfileSchemaPage.defaultProps = {
    "data-testid": "profile-schema"
};

export default ProfileSchemaPage;
