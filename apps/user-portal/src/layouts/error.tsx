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

import React, { PropsWithChildren } from "react";
import { Container, Divider } from "semantic-ui-react";

/**
 * Error page layout.
 *
 * @param {React.PropsWithChildren<{}>} props - Props injected to the error page layout component.
 * @return {JSX.Element}
 * @constructor
 */
export const ErrorPageLayout: React.FunctionComponent<PropsWithChildren<{}>> = (
    props: PropsWithChildren<{}>
): JSX.Element => {
    const { children } = props;

    return (
        <Container className="layout-content error-page-layout">
            <Divider className="x4" hidden/>
            { children }
            <Divider className="x3" hidden/>
        </Container>
    );
};
