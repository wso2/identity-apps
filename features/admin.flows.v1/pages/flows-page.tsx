/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import { PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import FlowList from "../components/flow-list";

/**
 * Props interface of {@link FlowsPage}
 */
type FlowsPageProps = IdentifiableComponentInterface;

/**
 * Landing page for the flows feature.
 *
 * @param props - Props injected to the component.
 * @returns Flows listing page component.
 */
const FlowsPage: FunctionComponent<FlowsPageProps> = ({
    ["data-componentid"]: componentId = "flows-page"
}: FlowsPageProps): ReactElement => {

    const { t } = useTranslation();

    return (
        <PageLayout
            pageTitle="Flows"
            title="Flows"
            description="Design and customize your user journeys with a no-code flow composer."
            data-componentid={ `${ componentId }-page-layout` }
        >
            <FlowList/>
        </PageLayout>
    );
};

export default FlowsPage;
