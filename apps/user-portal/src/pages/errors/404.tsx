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

import * as React from "react";
import { Link } from "react-router-dom";
import { Button, Container, Divider } from "semantic-ui-react";
import { InnerPageLayout } from "../../layouts";

export const PageNotFound = () => (
    <InnerPageLayout
        pageTitle="It looks like you're lost. :("
        pageTitleTextAlign="center"
        pageDescription="The page you're looking for isn't here.">
        <Container text textAlign="center">
            <Button as={Link} to={APP_HOME_PATH} primary>Go back home</Button>
        </Container>
    </InnerPageLayout>
);
