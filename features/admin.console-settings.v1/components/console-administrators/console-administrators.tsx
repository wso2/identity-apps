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
import { UserStoreProperty, getAUserStore } from "@wso2is/admin.core.v1";
import { userstoresConfig } from "@wso2is/admin.extensions.v1";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { useUserStores } from "@wso2is/admin.userstores.v1/api";
import { UserStoreDropdownItem, UserStoreListItem, UserStorePostData } from "@wso2is/admin.userstores.v1/models";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, {
    ChangeEvent,
    FunctionComponent,
    ReactElement,
    useEffect,
    useState
} from "react";
import AdministratorsList from "./administrators-list/administrators-list";
import InvitedAdministratorsList from "./invited-administrators/invited-administrators-list";

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
    const [ availableUserStores, setAvailableUserStores ] = useState<UserStoreDropdownItem[]>([]);

    const {
        data: userStoreList,
        isLoading: isUserStoreListFetchRequestLoading
    } = useUserStores(null);

    useEffect(() => {
        if (userStoreList && !isUserStoreListFetchRequestLoading) {
            const storeOptions: UserStoreDropdownItem[] = [
                {
                    key: -1,
                    text: userstoresConfig?.primaryUserstoreName,
                    value: userstoresConfig?.primaryUserstoreName
                }
            ];

            let storeOption: UserStoreDropdownItem = {
                key: null,
                text: "",
                value: ""
            };

            userStoreList?.forEach((store: UserStoreListItem, index: number) => {
                if (store?.name?.toUpperCase() !== userstoresConfig?.primaryUserstoreName) {
                    getAUserStore(store.id).then((response: UserStorePostData) => {
                        const isDisabled: boolean = response.properties.find(
                            (property: UserStoreProperty) => property.name === "Disabled")?.value === "true";

                        if (!isDisabled) {
                            storeOption = {
                                key: index,
                                text: store.name,
                                value: store.name
                            };
                            storeOptions.push(storeOption);
                        }
                    });
                }
            });

            setAvailableUserStores(storeOptions);
        }
    }, [ userStoreList, isUserStoreListFetchRequestLoading ]);

    const renderSelectedAdministratorGroup = (): ReactElement => {
        switch (activeAdministratorGroup) {
            case "activeUsers":
                return (
                    <AdministratorsList
                        availableUserStores={ availableUserStores }
                    />
                );
            case "pendingInvitations":
                return (
                    <InvitedAdministratorsList
                        availableUserStores={ availableUserStores }
                    />
                );
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
        <div className="console-administrators" data-componentid={ componentId }>
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
