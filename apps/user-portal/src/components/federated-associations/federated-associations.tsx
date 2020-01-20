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

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getFederatedAssociations } from "../../api/federated-associations";
import { SettingsSectionIcons } from "../../configs";
import { AlertInterface, AlertLevels } from "../../models";
import { FederatedAssociation } from "../../models/federated-associations";
import { SettingsSection } from "../shared";

/**
 * Prop types for `FederatedAssociations` component
 */
interface FederatedAssociationsProps {
    onAlertFired: (alert: AlertInterface) => void;
}
/**
 * This renders the federated associations component
 * @param props
 */
export const FederatedAssociations = (props: FederatedAssociationsProps): JSX.Element => {
    const { onAlertFired } = props;
    const { t } = useTranslation();

    const [federatedAssociations, setFederatedAssociations] = useState<FederatedAssociation[]>();

    useEffect(() => {
        getFederatedAssociations()
            .then((response) => {
                setFederatedAssociations(response);
            })
            .catch((error) => {
                onAlertFired({
                    description: "",
                    level: AlertLevels.ERROR,
                    message: ""
                });
            });
    }, []);

    return (
        <SettingsSection
            description={ t("views:sections.linkedAccounts.description") }
            header={ "External Logins" }
            icon={ SettingsSectionIcons.federatedAssociations }
            iconMini={ SettingsSectionIcons.federatedAssociationsMini }
            iconSize="auto"
            iconStyle="colored"
            iconFloated="right"
            onPrimaryActionClick={ () => {} }
            showActionBar={ true }
        />
    );
};
