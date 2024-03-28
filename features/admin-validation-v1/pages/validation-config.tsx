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
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { AppConstants, history } from "../../core";
import { getSettingsSectionIcons } from "../../admin-server-configurations-v1";
import { SettingsSection } from "../../admin-server-configurations-v1/settings/settings-section";

/**
 * Props for my account settings page.
 */
type MyAccountSettingsPageInterface = IdentifiableComponentInterface;

/**
 * Governance connector listing page.
 *
 * @param props - Props injected to the component.
 * @returns Governance connector listing page component.
 */
export const ValidationConfigPage: FunctionComponent<MyAccountSettingsPageInterface> = (
    props: MyAccountSettingsPageInterface
): ReactElement => {
    const { [ "data-componentid" ]: componentId } = props;

    const { t } = useTranslation();

    /**
     * Handle connector advance setting selection.
     */
    const handleSelection = () => {
        history.push(AppConstants.getPaths().get("VALIDATION_CONFIG_EDIT"));
    };

    return (
        <SettingsSection
            data-componentid={ `${componentId}-settings-section` }
            data-testid={ `${componentId}-settings-section` }
            description={ "Customize password validation rules for your users." }
            icon={ getSettingsSectionIcons().passwordValidation }
            header={ "Password Validation" }
            onPrimaryActionClick={ handleSelection }
            primaryAction={ t("common:configure") }
        />
    );
};

/**
 * Default props for the component.
 */
ValidationConfigPage.defaultProps = {
    "data-componentid": "validation-config-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ValidationConfigPage;
