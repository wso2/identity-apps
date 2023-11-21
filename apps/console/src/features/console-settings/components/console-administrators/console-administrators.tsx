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

import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, {
    ChangeEvent,
    FunctionComponent,
    ReactElement,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import AdministratorsList from "./administrators-list/administrators-list";
import InvitedAdministratorsList from "./invited-administrators/invited-administrators-list";
import { useGetCurrentOrganizationType } from "../../../organizations/hooks/use-get-organization-type";

/**
 * Props interface of {@link ConsoleAdministrators}
 */
type ConsoleAdministratorsInterface = IdentifiableComponentInterface;

/**
 * Component to render the login and security settings.
 *
 * @param props - Props injected to the component.
 * @returns Console login and security component.
 */
const ConsoleAdministrators: FunctionComponent<ConsoleAdministratorsInterface> = (
    props: ConsoleAdministratorsInterface
): ReactElement => {
    const { [ "data-componentid" ]: componentId } = props;

    const { isSubOrganization } = useGetCurrentOrganizationType();

    const [ activeAdministratorGroup, setActiveAdministratorGroup ] = useState("activeUsers");

    const { t } = useTranslation();

    const renderSelectedAdministratorGroup = (): ReactElement => {
        switch (activeAdministratorGroup) {
            case "activeUsers":
                return <AdministratorsList />;
            case "pendingInvitations":
                return <InvitedAdministratorsList />;
            default:
                return null;
        }
    };

    const renderActiveAdministratorGroups = (): ReactElement => {
        if (!isSubOrganization()) {
            return null;
        }

        return (
            <RadioGroup
                row
                aria-labelledby="console-administrators-radio-group"
                className="multi-option-radio-group"
                defaultValue="login"
                name="console-administrators-radio-group"
                value={ activeAdministratorGroup }
                onChange={ (_: ChangeEvent<HTMLInputElement>, value: string) => setActiveAdministratorGroup(value) }
            >
                <FormControlLabel value="activeUsers" control={ <Radio /> } label="Active Members" />
                <FormControlLabel value="pendingInvitations" control={ <Radio /> } label="Pending Invitations" />
            </RadioGroup>
        );
    };

    return (
        <div className="console-administrators">
            { renderActiveAdministratorGroups() }
            { renderSelectedAdministratorGroup() }
        </div>
    );
};

/**
 * Default props for the component.
 */
ConsoleAdministrators.defaultProps = {
    "data-componentid": "console-administrators"
};

export default ConsoleAdministrators;
