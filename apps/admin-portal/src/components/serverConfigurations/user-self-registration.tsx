/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import React, { FunctionComponent } from "react";
import { SettingsSectionIcons } from "../../configs";
import { AlertInterface } from "../../models";
import { Section } from "@wso2is/react-components";
import { useTranslation } from "react-i18next";

/**
 * Prop types for the change password component.
 */
interface UserSelfRegistrationProps {
	onAlertFired: (alert: AlertInterface) => void;
}

/**
 * User Self Registration component.
 *
 * @param {UserSelfRegistrationProps} props - Props injected to the change password component.
 * @return {JSX.Element}
 */
export const UserSelfRegistration: FunctionComponent<UserSelfRegistrationProps> = (props: UserSelfRegistrationProps): JSX.Element => {

	const {t} = useTranslation();

	return (
		<Section
			description={ t("views:components.governance.selfRegistration.description") }
			header={ t("views:components.governance.selfRegistration.heading") }
			icon={ SettingsSectionIcons.federatedAssociations }
			iconMini={ SettingsSectionIcons.federatedAssociationsMini }
			iconSize="auto"
			iconStyle="colored"
			iconFloated="right"
			onPrimaryActionClick={ () => console.log("Clicked") }
			primaryAction={ t("views:components.governance.selfRegistration.actionTitles.config") }
			primaryActionIcon="key"
		>

		</Section>
	);
};
