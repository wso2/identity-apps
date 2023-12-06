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

import { IdentifiableComponentInterface, RolesMemberInterface } from "@wso2is/core/models";
import { EmphasizedSegment, EmptyPlaceholder, Heading } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { Divider } from "semantic-ui-react";
import { getEmptyPlaceholderIllustrations } from "../../../core";
import { ReadOnlyRoleList } from "../../../roles/components/readonly-role-list";
import { GroupsInterface } from "../../models";
import "./edit-group-roles.scss";

interface EditGroupRolesPropsInterface extends IdentifiableComponentInterface {
    /**
     * Group profile
     */
    group: GroupsInterface;
}

export const EditGroupRoles: FunctionComponent<EditGroupRolesPropsInterface> = (
    props: EditGroupRolesPropsInterface
): ReactElement => {

    const { group } = props;

    const { t } = useTranslation();

    const [ initialSelectedRolesOptions, setInitialSelectedRolesOptions ] = useState<RolesMemberInterface[]>([]);

    /**
     * Set initial selected roles options
     */
    useEffect(() => {
        if ( group?.roles?.length > 0 ) {
            setInitialSelectedRolesOptions(group.roles);
        }
    }, [ group ]);

    /**
     * Get the placeholder components.
     *
     * @returns place holder components
     */
    const getPlaceholders = () => {
        return (
            <EmptyPlaceholder
                subtitle={
                    [ t("console:manage.features.groups.edit.roles.placeHolders.emptyListPlaceholder.subtitles") ]
                }
                title={ t("console:manage.features.groups.edit.roles.placeHolders.emptyListPlaceholder.title") }
                image={ getEmptyPlaceholderIllustrations().emptyList }
                imageSize="tiny"
            />
        );
    };

    return (
        <EmphasizedSegment padded="very" className="list-group-roles-section">
            <Heading as="h4">
                { t("console:manage.features.groups.edit.roles.heading") }
            </Heading>
            <Heading subHeading ellipsis as="h6">
                { t("console:manage.features.groups.edit.roles.subHeading") }
            </Heading>
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
EditGroupRoles.defaultProps = {
    "data-componentid": "edit-group-roles"
};
