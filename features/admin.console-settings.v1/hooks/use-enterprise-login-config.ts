/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import {
    AuthenticationSequenceInterface,
    AuthenticationSequenceType,
    AuthenticationStepInterface,
    AuthenticatorInterface
} from "@wso2is/admin.applications.v1/models/application";
import {
    getConnectionDetails,
    getConnections,
    updateConnectionGroup
} from "@wso2is/admin.connections.v1/api/connections";
import {
    ConnectionGroupInterface,
    ConnectionListResponseInterface,
    FederatedAuthenticatorListItemInterface,
    StrictConnectionInterface
} from "@wso2is/admin.connections.v1/models/connection";
import { AppState } from "@wso2is/admin.core.v1/store";
import {
    getRoleById,
    getRoleByIdV3,
    updateRoleDetails,
    updateRoleDetailsUsingV3Api
} from "@wso2is/admin.roles.v2/api/roles";
import { Schemas } from "@wso2is/admin.roles.v2/constants/role-constants";
import { PatchRoleDataInterface } from "@wso2is/admin.roles.v2/models/roles";
import { RoleGroupsInterface, RolesInterface } from "@wso2is/core/models";
import { AxiosResponse } from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useConsoleRoles from "./use-console-roles";
import useConsoleSettings from "./use-console-settings";
import {
    EnterpriseLoginConfigInterface,
    EnterpriseLoginConstants,
    GroupRoleMappingInterface
} from "../models/enterprise-login";

/**
 * Return type of {@link useEnterpriseLoginConfig}.
 */
export interface UseEnterpriseLoginConfigInterface {
    /**
     * The existing enterprise login configuration (null if not configured).
     */
    existingConfig: EnterpriseLoginConfigInterface | null;
    /**
     * Whether the existing configuration is still loading.
     */
    isLoading: boolean;
    /**
     * IDP groups already defined on the selected IDP.
     */
    existingIdpGroups: ConnectionGroupInterface[];
    /**
     * Available console roles.
     */
    consoleRoles: RolesInterface[];
    /**
     * Whether console roles are loading.
     */
    isConsoleRolesLoading: boolean;
    /**
     * Save or update the enterprise login configuration.
     *
     * @param config - The configuration to save.
     * @returns Promise resolving when save is complete.
     */
    saveConfiguration: (config: EnterpriseLoginConfigInterface) => Promise<void>;
    /**
     * Remove the enterprise login configuration.
     *
     * @returns Promise resolving when removal is complete.
     */
    removeConfiguration: () => Promise<void>;
    /**
     * Reload configuration from server.
     */
    reloadConfiguration: () => void;
}

/**
 * Hook that manages enterprise login configuration for the Console.
 *
 * Detects existing enterprise IDP from the Console auth sequence,
 * resolves group-role mappings, and provides save/remove orchestration.
 *
 * @returns Enterprise login configuration state and actions.
 */
const useEnterpriseLoginConfig = (): UseEnterpriseLoginConfigInterface => {
    const userRolesV3FeatureEnabled: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userRolesV3?.enabled
    );

    const {
        consoleAuthenticationSequence,
        updateConsoleLoginFlow,
        mutateConsoleConfigurations
    } = useConsoleSettings();

    const {
        consoleRoles: consoleRolesData,
        isConsoleRolesFetchRequestLoading,
        mutateConsoleRolesFetchRequest
    } = useConsoleRoles(true, 100, null, null);

    const consoleRoles: RolesInterface[] = useMemo(() => {
        return consoleRolesData?.Resources ?? [];
    }, [ consoleRolesData ]);

    const detectedFederatedIdp: AuthenticatorInterface | null = useMemo(() => {
        const steps: AuthenticationStepInterface[] = consoleAuthenticationSequence?.steps ?? [];

        if (steps.length === 0) {
            return null;
        }

        const step1Options: AuthenticatorInterface[] = steps[0]?.options ?? [];

        const federated: AuthenticatorInterface | undefined = step1Options.find(
            (option: AuthenticatorInterface) =>
                !EnterpriseLoginConstants.PRESERVED_IDP_NAMES.has(option.idp)
        );

        return federated ?? null;
    }, [ consoleAuthenticationSequence ]);

    const [ existingConfig, setExistingConfig ] = useState<EnterpriseLoginConfigInterface | null>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ reloadTrigger, setReloadTrigger ] = useState<number>(0);
    const [ fetchedIdpGroups, setFetchedIdpGroups ] = useState<ConnectionGroupInterface[]>([]);

    const existingConfigRef: React.MutableRefObject<EnterpriseLoginConfigInterface | null> =
        useRef<EnterpriseLoginConfigInterface | null>(null);

    existingConfigRef.current = existingConfig;

    const removedRef: React.MutableRefObject<boolean> = useRef<boolean>(false);

    /**
     * Load the existing configuration when a federated IDP is detected.
     * Resolves IDP details, fetches IDP groups, and cross-references them
     * with Console role groups to build the mapping table.
     */
    useEffect(() => {
        if (removedRef.current) {
            if (!detectedFederatedIdp) {
                removedRef.current = false;
            }
            setExistingConfig(null);
            setIsLoading(false);

            return;
        }

        if (!detectedFederatedIdp) {
            setExistingConfig(null);
            setIsLoading(false);

            return;
        }

        setIsLoading(true);

        const loadConfig = async (): Promise<void> => {
            try {
                const connectionsResponse: ConnectionListResponseInterface = await getConnections(
                    undefined,
                    undefined,
                    `name eq ${detectedFederatedIdp.idp}`,
                    "federatedAuthenticators"
                );

                const matchingIdp: StrictConnectionInterface | undefined =
                    connectionsResponse?.identityProviders?.find(
                        (idp: StrictConnectionInterface) =>
                            idp.name === detectedFederatedIdp.idp
                    );

                if (!matchingIdp) {
                    setExistingConfig(null);
                    setIsLoading(false);

                    return;
                }

                const idpId: string = matchingIdp.id;

                const idpDetails: Record<string, unknown> =
                    await getConnectionDetails(idpId);
                const idpGroupsList: ConnectionGroupInterface[] =
                    (idpDetails?.groups as ConnectionGroupInterface[]) ?? [];

                setFetchedIdpGroups(idpGroupsList);

                const idpGroupIdSet: Set<string> = new Set(
                    idpGroupsList.map((g: ConnectionGroupInterface) => g.id)
                );
                const idpGroupIdToName: Map<string, string> = new Map(
                    idpGroupsList.map((g: ConnectionGroupInterface) => [ g.id, g.name ])
                );

                const mappings: GroupRoleMappingInterface[] = [];

                const getRoleByIdFunction: (roleId: string) => Promise<AxiosResponse> =
                    userRolesV3FeatureEnabled ? getRoleByIdV3 : getRoleById;

                const roleDetailPromises: Promise<void>[] = (consoleRoles ?? []).map(
                    async (role: RolesInterface): Promise<void> => {
                        try {
                            const roleResponse: AxiosResponse =
                                await getRoleByIdFunction(role.id);
                            const roleData: RolesInterface =
                                roleResponse?.data ?? roleResponse;
                            const roleGroups: RoleGroupsInterface[] = roleData?.groups ?? [];

                            for (const roleGroup of roleGroups) {
                                if (idpGroupIdSet.has(roleGroup.value)) {
                                    mappings.push({
                                        idpGroup: idpGroupIdToName.get(roleGroup.value) ?? "",
                                        idpGroupId: roleGroup.value,
                                        roleId: role.id,
                                        roleName: role.displayName
                                    });
                                }
                            }
                        } catch {
                            // Skip roles that fail to fetch.
                        }
                    }
                );

                await Promise.all(roleDetailPromises);

                const defaultAuthenticatorId: string =
                    matchingIdp.federatedAuthenticators?.defaultAuthenticatorId ?? "";

                const defaultAuthenticator: FederatedAuthenticatorListItemInterface
                    | undefined = matchingIdp.federatedAuthenticators
                        ?.authenticators?.find(
                            (auth: FederatedAuthenticatorListItemInterface) =>
                                auth.authenticatorId === defaultAuthenticatorId
                        );

                const currentConfig: EnterpriseLoginConfigInterface | null =
                    existingConfigRef.current;

                if (
                    currentConfig?.idpName === detectedFederatedIdp.idp &&
                    currentConfig.mappings.length > 0 &&
                    mappings.length === 0
                ) {
                    setIsLoading(false);

                    return;
                }

                setExistingConfig({
                    authenticatorId: defaultAuthenticatorId,
                    authenticatorName: defaultAuthenticator?.name
                        ?? detectedFederatedIdp.authenticator,
                    idpId,
                    idpName: detectedFederatedIdp.idp,
                    mappings
                });
            } catch {
                setExistingConfig(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (consoleRoles?.length >= 0) {
            loadConfig();
        }
    }, [ detectedFederatedIdp, consoleRoles, reloadTrigger, userRolesV3FeatureEnabled ]);

    /**
     * Save or update the enterprise login configuration.
     *
     * 1. Ensure IDP groups exist on the selected IDP (PUT /identity-providers/\{id\}/groups).
     * 2. For each mapping, SCIM PATCH the Console role to add the IDP group.
     * 3. Update the Console auth sequence to include the selected IDP in step 1
     *    (removing any previously configured federated IDP that is not preserved).
     */
    const saveConfiguration: (
        config: EnterpriseLoginConfigInterface
    ) => Promise<void> = useCallback(async (
        config: EnterpriseLoginConfigInterface
    ): Promise<void> => {
        // Step 1: Collect all unique IDP group names from mappings
        const uniqueGroupNames: Set<string> = new Set(
            config.mappings.map((m: GroupRoleMappingInterface) => m.idpGroup)
        );

        let currentGroups: ConnectionGroupInterface[] = [];

        try {
            const idpDetails: Record<string, unknown> =
                await getConnectionDetails(config.idpId);

            currentGroups = (idpDetails?.groups as ConnectionGroupInterface[]) ?? [];
        } catch {
            currentGroups = [];
        }

        const existingGroupNames: Set<string> = new Set(
            currentGroups.map((g: ConnectionGroupInterface) => g.name)
        );
        const groupsToSet: ConnectionGroupInterface[] = [ ...currentGroups ];

        for (const groupName of uniqueGroupNames) {
            if (!existingGroupNames.has(groupName)) {
                groupsToSet.push({ id: "", name: groupName });
            }
        }

        const updatedGroups: ConnectionGroupInterface[] = await updateConnectionGroup(
            config.idpId,
            groupsToSet
        );

        const groupNameToId: Map<string, string> = new Map();

        for (const group of updatedGroups) {
            groupNameToId.set(group.name, group.id);
        }

        const previousMappings: GroupRoleMappingInterface[] = existingConfig?.mappings ?? [];

        const newMappingsByRole: Map<string, string[]> = new Map();
        const previousMappingsByRole: Map<string, string[]> = new Map();

        for (const mapping of config.mappings) {
            const groupId: string = groupNameToId.get(mapping.idpGroup) ?? "";

            if (groupId) {
                const existing: string[] = newMappingsByRole.get(mapping.roleId) ?? [];

                existing.push(groupId);
                newMappingsByRole.set(mapping.roleId, existing);
            }
        }

        for (const mapping of previousMappings) {
            const groupId: string = mapping.idpGroupId ?? "";

            if (groupId) {
                const existing: string[] = previousMappingsByRole.get(mapping.roleId) ?? [];

                existing.push(groupId);
                previousMappingsByRole.set(mapping.roleId, existing);
            }
        }

        const allRoleIds: Set<string> = new Set([
            ...newMappingsByRole.keys(),
            ...previousMappingsByRole.keys()
        ]);

        const patchPromises: Promise<void>[] = [];

        for (const roleId of allRoleIds) {
            const newGroupIds: string[] = newMappingsByRole.get(roleId) ?? [];
            const prevGroupIds: string[] = previousMappingsByRole.get(roleId) ?? [];

            const toAdd: string[] = newGroupIds.filter(
                (id: string) => !prevGroupIds.includes(id)
            );
            const toRemove: string[] = prevGroupIds.filter(
                (id: string) => !newGroupIds.includes(id)
            );

            if (toAdd.length === 0 && toRemove.length === 0) {
                continue;
            }

            const operations: { op: string; value?: unknown; path?: string }[] = [];

            if (toAdd.length > 0) {
                operations.push({
                    op: "add",
                    value: {
                        groups: toAdd.map((id: string) => ({ value: id }))
                    }
                });
            }

            for (const groupId of toRemove) {
                operations.push({
                    op: "remove",
                    path: `groups[value eq ${groupId}]`
                });
            }

            const patchData: PatchRoleDataInterface = {
                Operations: operations,
                schemas: [ Schemas.PATCH_OP ]
            };

            const updateRoleFunction: (
                roleId: string, roleData: PatchRoleDataInterface
            ) => Promise<unknown> = userRolesV3FeatureEnabled
                ? updateRoleDetailsUsingV3Api
                : updateRoleDetails;

            patchPromises.push(
                updateRoleFunction(roleId, patchData).then(() => undefined)
            );
        }

        await Promise.all(patchPromises);

        const currentSteps: AuthenticationStepInterface[] =
            consoleAuthenticationSequence?.steps ?? [];

        let step1Options: AuthenticatorInterface[] = currentSteps.length > 0
            ? [ ...(currentSteps[0]?.options ?? []) ]
            : [ { authenticator: "BasicAuthenticator", idp: "LOCAL" } ];

        step1Options = step1Options.filter(
            (option: AuthenticatorInterface) =>
                EnterpriseLoginConstants.PRESERVED_IDP_NAMES.has(option.idp)
        );

        step1Options.push({
            authenticator: config.authenticatorName,
            idp: config.idpName
        });

        const updatedSteps: AuthenticationStepInterface[] = [
            { id: 1, options: step1Options },
            ...(currentSteps.length > 1 ? currentSteps.slice(1) : [])
        ];

        const updatedSequence: AuthenticationSequenceInterface = {
            ...consoleAuthenticationSequence,
            steps: updatedSteps,
            type: AuthenticationSequenceType.USER_DEFINED
        };

        await updateConsoleLoginFlow(updatedSequence);

        const resolvedMappings: GroupRoleMappingInterface[] = config.mappings.map(
            (m: GroupRoleMappingInterface) => ({
                ...m,
                idpGroupId: groupNameToId.get(m.idpGroup) ?? m.idpGroupId ?? ""
            })
        );

        setExistingConfig({
            ...config,
            mappings: resolvedMappings
        });

        mutateConsoleConfigurations();
        mutateConsoleRolesFetchRequest();
    }, [
        existingConfig,
        consoleAuthenticationSequence,
        updateConsoleLoginFlow,
        mutateConsoleConfigurations,
        mutateConsoleRolesFetchRequest,
        userRolesV3FeatureEnabled
    ]);

    /**
     * Remove the enterprise login configuration.
     *
     * 1. Remove the federated IDP option from Console auth sequence step 1.
     * 2. SCIM PATCH each Console role to remove the IDP groups.
     */
    const removeConfiguration: () => Promise<void> = useCallback(async (): Promise<void> => {
        if (!existingConfig) {
            return;
        }

        let idpGroupIds: Set<string> = new Set();

        try {
            const idpDetails: Record<string, unknown> =
                await getConnectionDetails(existingConfig.idpId);
            const idpGroupsList: ConnectionGroupInterface[] =
                (idpDetails?.groups as ConnectionGroupInterface[]) ?? [];

            idpGroupIds = new Set(
                idpGroupsList.map((g: ConnectionGroupInterface) => g.id)
            );
        } catch {
            for (const mapping of existingConfig.mappings) {
                if (mapping.idpGroupId) {
                    idpGroupIds.add(mapping.idpGroupId);
                }
            }
        }

        const patchPromises: Promise<void>[] = [];

        const getRoleByIdFunction: (roleId: string) => Promise<AxiosResponse> =
            userRolesV3FeatureEnabled ? getRoleByIdV3 : getRoleById;

        const updateRoleFunction: (
            roleId: string, roleData: PatchRoleDataInterface
        ) => Promise<unknown> = userRolesV3FeatureEnabled
            ? updateRoleDetailsUsingV3Api
            : updateRoleDetails;

        for (const role of (consoleRoles ?? [])) {
            try {
                const roleResponse: AxiosResponse =
                    await getRoleByIdFunction(role.id);
                const roleData: RolesInterface =
                    roleResponse?.data ?? roleResponse;
                const roleGroups: RoleGroupsInterface[] = roleData?.groups ?? [];

                const groupIdsToRemove: string[] = roleGroups
                    .filter(
                        (rg: RoleGroupsInterface) => idpGroupIds.has(rg.value)
                    )
                    .map((rg: RoleGroupsInterface) => rg.value);

                if (groupIdsToRemove.length === 0) {
                    continue;
                }

                const operations: { op: string; path: string }[] = groupIdsToRemove.map(
                    (groupId: string) => ({
                        op: "remove",
                        path: `groups[value eq ${groupId}]`
                    })
                );

                const patchData: PatchRoleDataInterface = {
                    Operations: operations,
                    schemas: [ Schemas.PATCH_OP ]
                };

                patchPromises.push(
                    updateRoleFunction(role.id, patchData).then(() => undefined)
                );
            } catch {
                // Skip roles that fail to fetch.
            }
        }

        await Promise.all(patchPromises);

        const currentSteps: AuthenticationStepInterface[] =
            consoleAuthenticationSequence?.steps ?? [];

        if (currentSteps.length > 0) {
            const step1Options: AuthenticatorInterface[] = (currentSteps[0]?.options ?? []).filter(
                (option: AuthenticatorInterface) =>
                    EnterpriseLoginConstants.PRESERVED_IDP_NAMES.has(option.idp)
            );

            const updatedSteps: AuthenticationStepInterface[] = [
                { id: 1, options: step1Options },
                ...(currentSteps.length > 1 ? currentSteps.slice(1) : [])
            ];

            const updatedSequence: AuthenticationSequenceInterface = {
                ...consoleAuthenticationSequence,
                steps: updatedSteps,
                type: step1Options.length === 1 &&
                    step1Options[0].authenticator === "BasicAuthenticator"
                    ? AuthenticationSequenceType.DEFAULT
                    : AuthenticationSequenceType.USER_DEFINED
            };

            await updateConsoleLoginFlow(updatedSequence);
        }

        removedRef.current = true;

        // Reload everything
        mutateConsoleConfigurations();
        mutateConsoleRolesFetchRequest();
        setExistingConfig(null);
        setFetchedIdpGroups([]);
    }, [
        existingConfig,
        consoleRoles,
        consoleAuthenticationSequence,
        updateConsoleLoginFlow,
        mutateConsoleConfigurations,
        mutateConsoleRolesFetchRequest,
        userRolesV3FeatureEnabled
    ]);

    /**
     * Reload configuration from server.
     */
    const reloadConfiguration: () => void = useCallback((): void => {
        mutateConsoleConfigurations();
        mutateConsoleRolesFetchRequest();
        setReloadTrigger((prev: number) => prev + 1);
    }, [ mutateConsoleConfigurations, mutateConsoleRolesFetchRequest ]);

    return {
        consoleRoles,
        existingConfig,
        existingIdpGroups: fetchedIdpGroups,
        isConsoleRolesLoading: isConsoleRolesFetchRequestLoading,
        isLoading,
        reloadConfiguration,
        removeConfiguration,
        saveConfiguration
    };
};

export default useEnterpriseLoginConfig;
