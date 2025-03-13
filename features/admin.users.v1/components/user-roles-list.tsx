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

import {  getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppState } from "@wso2is/admin.core.v1/store";
import { ReadOnlyRoleList } from "@wso2is/admin.roles.v2/components/readonly-role-list";
import { APPLICATION_DOMAIN, DOMAIN_SEPARATOR, INTERNAL_DOMAIN } from "@wso2is/admin.roles.v2/constants";
import {
    IdentifiableComponentInterface,
    ProfileInfoInterface,
    RoleGroupsInterface,
    RolesMemberInterface
} from "@wso2is/core/models";
import { EmphasizedSegment, EmptyPlaceholder, Heading, Message } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider } from "semantic-ui-react";
import "./user-roles-list.scss";

interface UserRoleEditPropsInterface extends IdentifiableComponentInterface {
    /**
     * User profile
     */
    user: ProfileInfoInterface;
}

export const UserRolesList: FunctionComponent<UserRoleEditPropsInterface> = (
    props: UserRoleEditPropsInterface
): ReactElement => {

    const { user } = props;

    const { t } = useTranslation();

    const [ initialSelectedRolesOptions, setInitialSelectedRolesOptions ] = useState<RolesMemberInterface[]>([]);
    const isGroupAndRoleSeparationEnabled: boolean = useSelector((state: AppState) =>
        state?.config?.ui?.isGroupAndRoleSeparationEnabled);

    /**
     * Set initial selected roles options
     */
    useEffect(() => {
        let userRoles: RolesMemberInterface[];

        if (isGroupAndRoleSeparationEnabled && user?.roles?.length > 0) {
            userRoles = user.roles;
        } else {
            userRoles = extractUserRolesFromGroups(user?.groups);
        }

        if (userRoles?.length > 0) {
            console.log(userRoles)
            setInitialSelectedRolesOptions(userRoles);
        }
    }, [ user ]);

    /**
     * When Group and Role Separation is enabled, the groups section of the user will contain both roles and groups.
     * This method can be used to extract roles from the groups section.
     *
     * @param groups - Groups of the user
     * @returns Roles of the user
     */
    const extractUserRolesFromGroups = (groups: RoleGroupsInterface[]): RolesMemberInterface[] => {

        const userRoles: RolesMemberInterface[] = [];

        groups?.forEach((group: RoleGroupsInterface) => {
            const [ domain, displayName ]: string[] = group?.display?.split(DOMAIN_SEPARATOR);

            if (domain && displayName && [ APPLICATION_DOMAIN, INTERNAL_DOMAIN ].includes(domain)) {
                userRoles.push({
                    $ref: group.$ref,
                    display: displayName,
                    orgId: undefined,
                    orgName: undefined,
                    value: group.value
                });
            }
        });

        return userRoles;
    };

    /**
     * Get the placeholder components.
     *
     * @returns place holder components
     */
    const getPlaceholders = () => {
        return (
            <EmptyPlaceholder
                subtitle={
                    [ t("user:updateUser.roles.editRoles.placeholders.emptyPlaceholder" +
                        ".subtitles") ]
                }
                title={ t("user:updateUser.roles.editRoles.placeholders.emptyPlaceholder" +
                    ".title") }
                image={ getEmptyPlaceholderIllustrations().emptyList }
                imageSize="tiny"
            />
        );
    };

    return (
        <EmphasizedSegment padded="very" className="list-user-roles-section">
            <Heading as="h4">
                { t("user:updateUser.roles.editRoles.heading") }
            </Heading>
            <Heading subHeading ellipsis as="h6">
                { t("user:updateUser.roles.editRoles.subHeading") }
            </Heading>
            <Message
                type="info"
                content={ t("user:updateUser.roles.editRoles.infoMessage") }
            />
            <Divider hidden/>
            <ReadOnlyRoleList
                totalRoleList={ initialSelectedRolesOptions }
                emptyRolesListPlaceholder={ getPlaceholders() }
            />
        </EmphasizedSegment>
    );
};

/**
 * Default props for application roles tab component.
 */
UserRolesList.defaultProps = {
    "data-componentid": "edit-user-roles"
};
