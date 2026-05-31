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

import { ReactNode } from "react";

interface TranslationOptionsInterface {
    [ key: string ]: unknown;
}

interface TransPropsInterface {
    children?: ReactNode;
    i18nKey?: string;
    values?: TranslationOptionsInterface;
}

export const t = (key: string, object?: TranslationOptionsInterface): string => {
    const placeholders: string = object ? Object.values(object).map((val: unknown) => val).join(".") : "";

    return key + placeholders;
};

export const Trans = ({
    children,
    i18nKey,
    values
}: TransPropsInterface): ReactNode => children ?? t(i18nKey ?? "", values);

export const useTranslation = (): { i18n: { changeLanguage: () => Promise<void> }; t: typeof t } => ({
    i18n: {
        changeLanguage: () => Promise.resolve()
    },
    t
});

export const initReactI18next: { init: () => void; type: string } = {
    init: () => undefined,
    type: "3rdParty"
};

export const withTranslation = (): ((Component: unknown) => unknown) => (Component: unknown): unknown => Component;
