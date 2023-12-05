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

import Autocomplete, {  
    AutocompleteRenderGetTagProps, 
    AutocompleteRenderInputParams 
} from "@oxygen-ui/react/Autocomplete";
import TextField from "@oxygen-ui/react/TextField";
import { IdentifiableComponentInterface, RolesMemberInterface } from "@wso2is/core/models";
import { EmphasizedSegment, EmptyPlaceholder, Heading } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    HTMLAttributes,
    ReactElement,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { getEmptyPlaceholderIllustrations } from "../../../core/configs/ui";
import { GroupsInterface } from "../../models/groups";
import { AutoCompleteRenderOption } from "../group-common-components/auto-complete-render-option";
import { RenderChipRolesInGroups } from "../group-common-components/render-chip";
import { ReadOnlyRoleList } from "../../../roles/components/readonly-role-list";

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
    const [ activeOption, setActiveOption ] = useState<RolesMemberInterface>(undefined);

    /**
     * Set initial selected roles options
     */
    useEffect(() => {
        if ( group?.roles?.length > 0 ) {
            setInitialSelectedRolesOptions(group.roles);
        }
    }, [ group ]);

    /**
     * Get the place holder components.
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
        <ReadOnlyRoleList
            totalRoleList={ initialSelectedRolesOptions }
            emptyRolesListPlaceholder={ getPlaceholders() }
        />
    );
};

/**
 * Default props for application roles tab component.
 */
EditGroupRoles.defaultProps = {
    "data-componentid": "edit-group-roles"
};
