/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import BrandingCore from "./branding-core";
import { BrandingAIBanner } from "../../admin.ai.v1/components/branding-ai-banner";
import { LoadingScreen } from "../../admin.ai.v1/components/branding-ai-loading-screen";
import useAIBrandingPreference from "../../admin.ai.v1/hooks/use-ai-branding-preference";
import { AppState } from "../../admin.core.v1/store";
import { ExtendedFeatureConfigInterface } from "../../admin.extensions.v1/configs/models";
import { useGetCurrentOrganizationType } from "../../admin.organizations.v1/hooks/use-get-organization-type";
import { AI_BRANDING_FEATURE_ID } from "../constants/ai-branding-constants";

type BrandingPageLayoutInterface = IdentifiableComponentInterface;

const BrandingPageLayout: FunctionComponent<BrandingPageLayoutInterface> = (
    props: BrandingPageLayoutInterface
): ReactElement => {

    const { getLink } = useDocumentation();
    const { t } = useTranslation();
    const {
        ["data-componentid"]: componentId
    } = props;

    const featureConfig: ExtendedFeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const disabledFeatures: string[] = useMemo(() =>
        featureConfig?.branding?.disabledFeatures, [ featureConfig ]);
    const {
        isGeneratingBranding,
        mergedBrandingPreference
    } = useAIBrandingPreference();

    const { isSubOrganization } = useGetCurrentOrganizationType();

    return (
        <PageLayout
            pageTitle={ t("extensions:develop.branding.pageHeader.title") }
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
            {
                !disabledFeatures.includes(AI_BRANDING_FEATURE_ID) && !isSubOrganization() && (
                    <BrandingAIBanner/>
                )
            }
            {
                isGeneratingBranding ? (
                    <LoadingScreen/>
                )
                    : <BrandingCore brandingPreference={ mergedBrandingPreference }/>
            }
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
BrandingPageLayout.defaultProps = {
    "data-componentid": "branding-page"
};

export default BrandingPageLayout;
