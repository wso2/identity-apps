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

import React from "react";
import { Grid, Icon, Input } from "semantic-ui-react";
import { ApplicationTemplate } from "../components";
import { history } from "../helpers/history";
import { PageLayout } from "../layouts";

/**
 * Choose the application template from this page.
 *
 * @return {JSX.Element}
 */
export const ApplicationTemplateSelectPage = (): JSX.Element => {

    // TODO Remove this hard coded list and retrieve the template list from an endpoint.
    // Template list
    const Templates = {
        SPA: {
            data: "SPApplication",
            description: "Front end applications which uses API. Mostly written using script languages.",
            example: "eg ReactJs, Nodejs apps",
            logo: "",
            name: "Single Page Application",
            protocol: "OIDC"
        },
        oauthWeb: {
            data: "OAuthWebApplication",
            description: "Regular web applications that use redirections inside browsers.",
            example: "eg JAVA, .Net apps",
            logo: "",
            name: "Web APP",
            protocol: "OIDC"
        }
    };

    // Create template object
    const readTemplates = Object.keys(Templates).map((template) => {
        return (
            <Grid.Column width={ 5 } key={ template }>
                <ApplicationTemplate
                    name={ Templates[template].name }
                    description={ Templates[template].description }
                    example={ Templates[template].example }
                    webApp={ false }
                    templateID={ Templates[template].data }
                    protocol={ Templates[template].protocol }
                />
            </Grid.Column>
        );
    });

    const navigate = (): void => {
        history.push("/applications");
    };
    return (
        <PageLayout
            title={ "Create Application" }
            description={ " Please choose one of the types to build the application " }
        >
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <Icon
                            link
                            size="large"
                            onClick={ navigate }
                            color="grey"
                            name="arrow left"
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <Input style={ { width: "100%" } } icon="search" placeholder="Search Template..."/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    { readTemplates }
                </Grid.Row>
            </Grid>
        </PageLayout>
    );
};

export default ApplicationTemplateSelectPage;
