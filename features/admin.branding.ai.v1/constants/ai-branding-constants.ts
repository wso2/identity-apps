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
import { AppState } from "@wso2is/admin.core.v1";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export const useGetFacts = (): string[] => {
    const { t } = useTranslation();
    const productName: string = useSelector((state: AppState) => state?.config?.ui?.productName);

    return [
        t("branding:ai.screens.loading.facts.0", { productName }),
        t("branding:ai.screens.loading.facts.1", { productName }),
        t("branding:ai.screens.loading.facts.2", { productName })
    ];
};

export const useGetStatusLabels = (): Record<string, string> => {
    const { t } = useTranslation();

    return {
        branding_generation_completed: t("branding:ai.screens.loading.states.8"),
        color_palette: t("branding:ai.screens.loading.states.5"),
        create_branding_theme: t("branding:ai.screens.loading.states.7"),
        extract_webpage_content: t("branding:ai.screens.loading.states.2"),
        generate_branding: t("branding:ai.screens.loading.states.4"),
        render_webpage: t("branding:ai.screens.loading.states.1"),
        style_properties: t("branding:ai.screens.loading.states.6"),
        webpage_extraction_completed: t("branding:ai.screens.loading.states.3")
    };
};

export const FACTS_ROTATION_DELAY: number = 8000;
export const PROGRESS_UPDATE_INTERVAL: number = 100;

export const STATUS_PROGRESS_MAP: Record<string, number> = {
    branding_generation_completed: 100,
    color_palette: 95,
    create_branding_theme: 99,
    extract_webpage_content: 15,
    generate_branding: 94,
    render_webpage: 10,
    style_properties: 98,
    webpage_extraction_completed: 20
};
