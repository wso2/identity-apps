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

import { SupportedLanguagesMeta } from "@wso2is/i18n";
import React,
{ FunctionComponent,
    PropsWithChildren,
    ReactElement,
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { AppState } from "../../core/store";
import { useGetCurrentOrganizationType } from "../../organizations/hooks/use-get-organization-type";
import { OrganizationResponseInterface } from "../../organizations/models/organizations";
import generateBrandingPreference from "../api/generate-branding-preference";
import AIFeatureContext from "../context/ai-feature-context";
import { BannerState } from "../models/types";

type AIContextProviderProps = PropsWithChildren;


const AIContextProvider: FunctionComponent<AIContextProviderProps> = (
    props: AIContextProviderProps
): ReactElement => {
    const { children } = props;

    const { t } = useTranslation();
    const [ bannerState, setBannerState ] = useState<BannerState>(BannerState.Full);
    const [ currentStatus, setCurrentStatus ] = useState("Initializing...");
    const [ progress, setProgress ] = useState(0);

    return (
        <AIFeatureContext.Provider
            value={ {
                bannerState,
                setBannerState,
                currentStatus,
                setCurrentStatus,
                progress,
                setProgress
            } }
        >
            { children }
        </AIFeatureContext.Provider>
    );
};

export default AIContextProvider;
