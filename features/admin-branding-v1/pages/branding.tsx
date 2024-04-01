/**
 * Copyright (c) 2021-2024, WSO2 LLC. (https://www.wso2.com).
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
import { DocumentationLink, PageLayout, useDocumentation } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import BrandingCore from "../components/branding-core";
import BrandingPreferenceProvider from "../providers/branding-preference-provider";

/**
 * Prop-types for the branding page component.
 */
type BrandingPageInterface = IdentifiableComponentInterface;

/**
 * Branding page.
 *
 * @param props - Props injected to the component.
 * @returns Branding page component.
 */
const BrandingPage: FunctionComponent<BrandingPageInterface> = (
    props: BrandingPageInterface
): ReactElement => {

    const { getLink } = useDocumentation();

    const {
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    return (
        <BrandingPreferenceProvider>
            <PageLayout
                pageTitle="Branding"
                bottomMargin={ false }
                title={ (
                    <div className="title-container">
                        <div className="title-container-heading">
                            { t("extensions:develop.branding.pageHeader.title") }
                        </div>
                    </div>
                ) }
                description={ (
                    <div className="with-label">
                        { t("extensions:develop.branding.pageHeader.description") }
                        <DocumentationLink
                            link={ getLink("develop.branding.learnMore") }
                        >
                            { t("common:learnMore") }
                        </DocumentationLink>
                    </div>
                ) }
                data-componentid={ `${ componentId }-layout` }
                className="branding-page"
            >
                <BrandingCore />
            </PageLayout>
        </BrandingPreferenceProvider>
    );
};

/**
 * Default props for the component.
 */
BrandingPage.defaultProps = {
    "data-componentid": "branding-page"
};

export default BrandingPage;
