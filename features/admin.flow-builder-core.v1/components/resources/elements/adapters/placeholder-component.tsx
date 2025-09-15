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
import React, { FunctionComponent, PropsWithChildren, ReactElement, useMemo } from "react";
import "./placeholder-component.scss";

/**
 * Props interface of {@link PlaceholderComponent}
 */
export interface PlaceholderComponentProps extends IdentifiableComponentInterface {
    value: string;
}

/**
 * Placeholder component for displaying a placeholder text.
 *
 * @param props - Props injected to the component.
 * @returns The PlaceholderComponent component.
 */
const PlaceholderComponent: FunctionComponent<PropsWithChildren<PlaceholderComponentProps>> = ({
    value,
    children
}: PropsWithChildren<PlaceholderComponentProps>): ReactElement => {
    /**
     * Check if the value matches the i18n pattern.
     */
    const isI18nPattern: boolean = useMemo(() => {
        if (!value) return false;

        const i18nPattern: RegExp = /^\{\{[^}]+\}\}$/;

        return i18nPattern.test(value.trim());
    }, [ value ]);

    if (isI18nPattern) {
        return (
            <span className="flow-builder-display-field-i18n-placeholder">
                <span className="flow-builder-display-field-i18n-placeholder-key">
                    { value }
                </span>
            </span>
        );
    }

    if (children) {
        return <>{ children }</>;
    }

    return <>{ value }</>;
};

export default PlaceholderComponent;
