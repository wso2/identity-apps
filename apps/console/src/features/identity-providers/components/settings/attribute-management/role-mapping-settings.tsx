/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { RoleListInterface, RolesInterface, TestableComponentInterface } from "@wso2is/core/models";
import { DynamicField, Heading, Hint, KeyValue } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Grid } from "semantic-ui-react";
import { AppState } from "../../../../core";
import { getOrganizationRoles } from "../../../../organizations/api";
import {
    OrganizationResponseInterface,
    OrganizationRoleListItemInterface,
    OrganizationRoleListResponseInterface
} from "../../../../organizations/models";
import { OrganizationUtils } from "../../../../organizations/utils";
import { getRolesList } from "../../../../roles/api/roles";
import { IdentityProviderConstants } from "../../../constants";
import { IdentityProviderRoleMappingInterface } from "../../../models";
import { handleGetRoleListError } from "../../utils";

/**
 * Proptypes for the identity providers settings component.
 */
interface RoleMappingSettingsPropsInterface extends TestableComponentInterface {

    /**
     * Trigger submission.
     */
    triggerSubmit: boolean;

    /**
     *  Handle submission.
     */
    onSubmit?: (roleMappings: IdentityProviderRoleMappingInterface[]) => void;

    /**
     * Roles of the IDP
     */
    initialRoleMappings?: IdentityProviderRoleMappingInterface[];
    /**
     * Specifies if the component should only be read-only.
     */
    isReadOnly: boolean;
}

/**
 *  Identity Provider and advance settings component.
 *
 * @param props - Props injected to the component.
 * @returns Role mapping settings component.
 */
export const RoleMappingSettings: FunctionComponent<RoleMappingSettingsPropsInterface> = (
    props: RoleMappingSettingsPropsInterface
): ReactElement => {

    const currentOrganization: OrganizationResponseInterface = useSelector(
        (state: AppState) => state.organization.organization);
    const [ roleList, setRoleList ] = useState<RolesInterface[] | OrganizationRoleListItemInterface[]>();

    const {
        onSubmit,
        triggerSubmit,
        initialRoleMappings,
        isReadOnly,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    /**
     * Filter out Application related and Internal roles
     */
    const getFilteredRoles = () => {
        const filterRole: RolesInterface[] | OrganizationRoleListItemInterface[] = roleList.filter(
            (role: RolesInterface) => {
                return !(role.displayName.includes("Application/") || role.displayName.includes("Internal/"));
            });

        return filterRole.map((role: OrganizationRoleListItemInterface) => {
            return {
                id: role.displayName,
                value: role.displayName
            };
        });
    };

    useEffect(() => {
        if (OrganizationUtils.isCurrentOrganizationRoot()) {
            getRolesList(null)
                .then((response: AxiosResponse) => {
                    if (response.status === 200) {
                        const allRole: RoleListInterface = response.data;

                        setRoleList(allRole.Resources);
                    }
                })
                .catch((error: AxiosError) => {
                    handleGetRoleListError(error);
                });
        } else {
            getOrganizationRoles(currentOrganization.id, null, null, null)
                .then((response: OrganizationRoleListResponseInterface) => {
                    setRoleList(response.Resources);
                });
        }
    }, [ initialRoleMappings ]);


    /**
     * Prepends `Internal/` to the role name if it does not have a domain prepended already.
     *
     * @param role - The role name as received from the API response.
     *
     * @returns Resolved role name.
     */
    const resolveRoleName = (role: string): string => {
        if (role.split("/").length === 1) {
            return `${ IdentityProviderConstants.INTERNAL_DOMAIN }${ role }`;
        }

        return role;
    };

    /**
     * Removes `Internal/` part from the role name if it is present.
     *
     * @param role - The role name as received from the API response.
     *
     * @returns Resolved role display name.
     */
    const resolveRoleDisplayName = (role: string): string => {
        const roleParts: string[] = role.split("/");

        if (roleParts.length > 1) {
            if (roleParts[ 0 ] === IdentityProviderConstants.INTERNAL_DOMAIN.slice(0, -1)) {
                return roleParts[ 1 ];
            }
        }

        return role;
    };

    return (
        <>
            <Grid.Row>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                    <Heading as="h4">
                        { t("console:develop.features.authenticationProvider.forms.roleMapping.heading") }
                    </Heading>
                    <DynamicField
                        bottomMargin={ false }
                        data={
                            initialRoleMappings ?
                                initialRoleMappings.map((mapping: IdentityProviderRoleMappingInterface) => {
                                    return {
                                        key: resolveRoleDisplayName(mapping.localRole),
                                        value: mapping.idpRole
                                    };
                                }) : []
                        }
                        keyType="dropdown"
                        keyData={ roleList ? getFilteredRoles() : [] }
                        keyName={ t("console:develop.features.authenticationProvider.forms.roleMapping.keyName") }
                        valueName={ t("console:develop.features.authenticationProvider.forms.roleMapping.valueName") }
                        keyRequiredMessage={ t("console:develop.features.authenticationProvider.forms.roleMapping." +
                            "validation.keyRequiredMessage") }
                        valueRequiredErrorMessage={ t("console:develop.features.authenticationProvider.forms." +
                            "roleMapping.validation.valueRequiredErrorMessage") }
                        duplicateKeyErrorMsg={ t("console:develop.features.authenticationProvider.forms.roleMapping." +
                            "validation.duplicateKeyErrorMsg") }
                        submit={ triggerSubmit }
                        listen={ (data: KeyValue[]) => {
                            if (data.length > 0) {
                                const finalData: IdentityProviderRoleMappingInterface[] = data.map(
                                    (mapping: KeyValue) => {
                                        return {
                                            idpRole: mapping.value,
                                            localRole: resolveRoleName(mapping.key)
                                        };
                                    });

                                onSubmit(finalData);
                            } else {
                                onSubmit([]);
                            }
                        } }
                        data-testid={ testId }
                        readOnly={ isReadOnly }
                    />
                    <Hint>{ t("console:develop.features.authenticationProvider.forms.roleMapping.hint") }</Hint>
                </Grid.Column>
            </Grid.Row>
        </>
    );
};

/**
 * Default proptypes for the role mapping settings component.
 */
RoleMappingSettings.defaultProps = {
    "data-testid": "idp-edit-attribute-settings-role-mapping"
};
