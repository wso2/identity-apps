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

import { TestableComponentInterface } from "@wso2is/core/models";
import { SettingsSection } from "@wso2is/selfcare.core.v1/components";
import { AlertInterface } from "@wso2is/selfcare.core.v1/models";
import { AppState } from "@wso2is/selfcare.core.v1/store";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

/**
 * Prop types for the change password component.
 * Also see {@link CreatePassword.defaultProps}
 */
interface CreatePasswordPropsInterface extends TestableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
}

/**
 * Change password component.
 *
 * @param props - Props injected to the change password component.
 * @returns create password component
 */
export const CreatePassword: FunctionComponent<CreatePasswordPropsInterface> = (
    props: CreatePasswordPropsInterface
): ReactElement => {

    const {
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();
    const productName: string = useSelector((state: AppState) => state?.config?.ui?.productName);

    return (
        <SettingsSection
            data-testid={ `${testId}-settings-section` }
            description={ t("myAccount:sections.createPassword.description", { productName }) }
            header={ t("myAccount:sections.createPassword.heading") }
            primaryAction={ t("myAccount:sections.createPassword.actionTitles.create") }
            primaryActionIcon="key"
            showActionBar={ true }
            disabled={ true }
        >
        </SettingsSection>
    );
};

/**
 * Default props for the #CreatePassword component.
 * See type definitions in {@link CreatePasswordProps}
 */
CreatePassword.defaultProps = {
    "data-testid": "create-password"
};
