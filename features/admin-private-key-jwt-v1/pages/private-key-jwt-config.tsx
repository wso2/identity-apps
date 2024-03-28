/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
import React, { FunctionComponent, ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppConstants, history } from "../../admin-core-v1";
import { getSettingsSectionIcons } from "../../server-configurations";
import { SettingsSection } from "../../server-configurations/settings/settings-section";
import { useTokenReuseConfigData } from "../api";

/**
 * Props for PrivateKey JWT Config Interface settings page.
 */
type PrivateKeyJWTConfigPageInterface = IdentifiableComponentInterface;

/**
 * PrivateKey JWT connector listing page.
 *
 * @param props - Props injected to the component.
 * @returns PrivateKey JWT connector listing page component.
 */
export const PrivateKeyJWTConfig: FunctionComponent<PrivateKeyJWTConfigPageInterface> = (
    props: PrivateKeyJWTConfigPageInterface
): ReactElement => {
    const { [ "data-componentid" ]: componentId } = props;
    const { t } = useTranslation();

    const {
        data: tokenReuseData,
        isLoading: isLoading
    } = useTokenReuseConfigData();

    useEffect(() => {
        if (isLoading) {
            return;
        }
    }, [ isLoading ]);

    /**
     * Handle connector advance setting selection.
     */
    const handleSelection = () => {
        history.push(AppConstants.getPaths().get("PRIVATE_KEY_JWT_CONFIG_EDIT"));
    };

    return ( tokenReuseData
        ? (
            <SettingsSection
                data-componentid={ `${componentId}-settings-section` }
                data-testid={ `${componentId}-settings-section` }
                description={ t("jwtPrivateKeyConfiguration:description") }
                icon={ getSettingsSectionIcons().jwtPrivateKeyValidation }
                header={ t(
                    "jwtPrivateKeyConfiguration:pageTitle" 
                ) }
                onPrimaryActionClick={ handleSelection }
                primaryAction={ t("common:configure") }
            />
        )
        : null
    );
};

/**
 * Default props for the component.
 */
PrivateKeyJWTConfig.defaultProps = {
    "data-componentid": "private-key-jwt-config-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default PrivateKeyJWTConfig;
