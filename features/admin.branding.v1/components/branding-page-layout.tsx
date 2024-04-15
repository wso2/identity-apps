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
import { BrandingAIBanner, LoadingScreen } from "features/admin.ai.v1/components";
import useAIBrandingPreference from "features/admin.ai.v1/hooks/use-ai-branding-preference";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import BrandingCore from "./branding-core";
import { AppState } from "../../admin.core.v1/store";
import { ExtendedFeatureConfigInterface } from "../../admin.extensions.v1/configs/models";

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
    const disabledFeatures: string[] = useMemo(() => {
        return featureConfig?.branding?.disabledFeatures;
    }, [ featureConfig ]);
    const [ traceId, setTraceId ] = useState<string>("");
    const {
        handleGenerate,
        isGeneratingBranding,
        mergedBrandingPreference,
    } = useAIBrandingPreference();

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
                !disabledFeatures.includes("branding.ai1") && (
                    <BrandingAIBanner/>
                )
            }
            { isGeneratingBranding ? (
                <div>
                    <LoadingScreen/>
                </div>
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
