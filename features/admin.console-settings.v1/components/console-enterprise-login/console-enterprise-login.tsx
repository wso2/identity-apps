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

import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import Grid from "@oxygen-ui/react/Grid";
import IconButton from "@oxygen-ui/react/IconButton";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { ChevronRightIcon, PlusIcon, TrashIcon } from "@oxygen-ui/react-icons";
import { updateConnectionGroup, useGetConnections } from "@wso2is/admin.connections.v1/api/connections";
import { useGetConnectionGroupList } from "@wso2is/admin.connections.v1/api/use-get-connection-groups-list";
import {
    ConnectionGroupInterface,
    ConnectionListResponseInterface,
    FederatedAuthenticatorListItemInterface,
    StrictConnectionInterface
} from "@wso2is/admin.connections.v1/models/connection";
import {
    AlertInterface,
    AlertLevels,
    IdentifiableComponentInterface,
    RolesInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment,
    Heading
} from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    SyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import useEnterpriseLoginConfig from "../../hooks/use-enterprise-login-config";
import {
    EnterpriseLoginConfigInterface,
    EnterpriseLoginConstants,
    GroupRoleMappingInterface
} from "../../models/enterprise-login";

/**
 * Sentinel prefix used internally to identify a "create new group" option
 * in the connection-group combobox. This value is never persisted.
 */
const CREATE_GROUP_SENTINEL: string = "__CREATE_GROUP__:";

/**
 * Props interface of {@link ConsoleEnterpriseLogin}
 */
type ConsoleEnterpriseLoginPropsInterface = IdentifiableComponentInterface;

/**
 * Console Enterprise Login tab component.
 *
 * @param props - Props injected to the component.
 * @returns Console enterprise login component.
 */
const ConsoleEnterpriseLogin: FunctionComponent<ConsoleEnterpriseLoginPropsInterface> = (
    props: ConsoleEnterpriseLoginPropsInterface
): ReactElement => {
    const {
        ["data-componentid"]: componentId = "console-enterprise-login"
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const {
        existingConfig,
        isLoading,
        consoleRoles,
        isConsoleRolesLoading,
        saveConfiguration,
        removeConfiguration
    } = useEnterpriseLoginConfig();

    // Fetch connections for selection.
    const {
        data: connectionsData,
        isLoading: isConnectionsLoading
    } = useGetConnections(
        100,
        0,
        undefined,
        "federatedAuthenticators",
        true
    );

    const availableConnections: StrictConnectionInterface[] = useMemo(() => {
        const idps: StrictConnectionInterface[] =
            (connectionsData as ConnectionListResponseInterface)?.identityProviders ?? [];

        return idps.filter((idp: StrictConnectionInterface) =>
            !EnterpriseLoginConstants.PRESERVED_IDP_NAMES.has(idp.name) &&
            idp.isEnabled
        );
    }, [ connectionsData ]);

    const [ selectedIdp, setSelectedIdp ] = useState<StrictConnectionInterface | null>(null);
    const [ mappings, setMappings ] = useState<GroupRoleMappingInterface[]>([]);
    const [ isSaving, setIsSaving ] = useState<boolean>(false);
    const [ isRemoving, setIsRemoving ] = useState<boolean>(false);
    const [ isCreatingGroup, setIsCreatingGroup ] = useState<boolean>(false);
    const [ showRemoveConfirmation, setShowRemoveConfirmation ] = useState<boolean>(false);

    const lastSyncedConfigRef: React.MutableRefObject<EnterpriseLoginConfigInterface | null> =
        useRef<EnterpriseLoginConfigInterface | null>(null);

    const {
        data: idpGroupsData,
        isLoading: isIdpGroupsLoading,
        mutate: mutateIdpGroups
    } = useGetConnectionGroupList(
        selectedIdp?.id ?? "",
        !!selectedIdp?.id
    );

    const idpGroups: ConnectionGroupInterface[] = useMemo(() => {
        return (idpGroupsData as ConnectionGroupInterface[]) ?? [];
    }, [ idpGroupsData ]);

    useEffect(() => {
        if (!existingConfig) {
            lastSyncedConfigRef.current = null;

            return;
        }

        const matchingIdp: StrictConnectionInterface | undefined = availableConnections.find(
            (idp: StrictConnectionInterface) => idp.id === existingConfig.idpId
        );

        if (!matchingIdp) {
            return;
        }

        const lastSynced: EnterpriseLoginConfigInterface | null = lastSyncedConfigRef.current;
        const isNewIdp: boolean = lastSynced?.idpId !== existingConfig.idpId;
        const mappingsJustPopulated: boolean =
            (lastSynced?.mappings.length ?? 0) === 0 && existingConfig.mappings.length > 0;

        if (!isNewIdp && !mappingsJustPopulated) {
            return;
        }

        setSelectedIdp(matchingIdp);
        setMappings([ ...existingConfig.mappings ]);
        lastSyncedConfigRef.current = existingConfig;
    }, [ existingConfig, availableConnections ]);

    /**
     * Handle connection selection change.
     */
    const handleIdpChange: (_event: SyntheticEvent, value: StrictConnectionInterface | null) => void = useCallback((
        _event: SyntheticEvent,
        value: StrictConnectionInterface | null
    ): void => {
        setSelectedIdp(value);

        if (!value) {
            setMappings([]);
        } else if (existingConfig && value.id === existingConfig.idpId) {
            setMappings([ ...existingConfig.mappings ]);
        } else {
            setMappings([]);
        }
    }, [ existingConfig ]);

    /**
     * Add a new empty mapping row.
     */
    const handleAddMapping: () => void = useCallback((): void => {
        setMappings((prev: GroupRoleMappingInterface[]) => [
            ...prev,
            { idpGroup: "", idpGroupId: "", roleId: "", roleName: "" }
        ]);
    }, []);

    /**
     * Remove a mapping row by index.
     */
    const handleRemoveMapping: (index: number) => void = useCallback((index: number): void => {
        setMappings((prev: GroupRoleMappingInterface[]) =>
            prev.filter((_: GroupRoleMappingInterface, i: number) => i !== index)
        );
    }, []);

    /**
     * Create a new connection group on the IDP immediately and update the mapping row.
     */
    const handleCreateGroup: (index: number, groupName: string) => Promise<void> = useCallback(async (
        index: number,
        groupName: string
    ): Promise<void> => {
        if (!selectedIdp?.id || !groupName) {
            return;
        }

        setIsCreatingGroup(true);

        try {
            const updatedGroups: ConnectionGroupInterface[] = [
                ...idpGroups,
                { id: "", name: groupName }
            ];

            const result: ConnectionGroupInterface[] =
                await updateConnectionGroup(selectedIdp.id, updatedGroups);

            const newGroup: ConnectionGroupInterface | undefined = result.find(
                (g: ConnectionGroupInterface) => g.name === groupName
            );

            setMappings((prev: GroupRoleMappingInterface[]) => {
                const updated: GroupRoleMappingInterface[] = [ ...prev ];

                updated[index] = {
                    ...updated[index],
                    idpGroup: groupName,
                    idpGroupId: newGroup?.id ?? ""
                };

                return updated;
            });

            mutateIdpGroups();
            dispatch(addAlert<AlertInterface>({
                description: t(
                    "consoleSettings:enterpriseLogin.notifications" +
                    ".createGroup.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "consoleSettings:enterpriseLogin.notifications" +
                    ".createGroup.success.message"
                )
            }));
        } catch {
            dispatch(addAlert<AlertInterface>({
                description: t(
                    "consoleSettings:enterpriseLogin.notifications" +
                    ".createGroup.error.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "consoleSettings:enterpriseLogin.notifications" +
                    ".createGroup.error.message"
                )
            }));
        } finally {
            setIsCreatingGroup(false);
        }
    }, [ selectedIdp, idpGroups, mutateIdpGroups, dispatch, t ]);

    /**
     * Update the connection group of a mapping row.
     */
    const handleIdpGroupChange: (
        index: number, value: string
    ) => void = useCallback((index: number, value: string): void => {
        setMappings((prev: GroupRoleMappingInterface[]) => {
            const updated: GroupRoleMappingInterface[] = [ ...prev ];
            const matchingGroup: ConnectionGroupInterface | undefined = idpGroups.find(
                (g: ConnectionGroupInterface) => g.name === value
            );

            updated[index] = {
                ...updated[index],
                idpGroup: value,
                idpGroupId: matchingGroup?.id ?? ""
            };

            return updated;
        });
    }, [ idpGroups ]);

    /**
     * Update the console role of a mapping row.
     */
    const handleRoleChange: (index: number, role: RolesInterface | null) => void = useCallback((
        index: number,
        role: RolesInterface | null
    ): void => {
        setMappings((prev: GroupRoleMappingInterface[]) => {
            const updated: GroupRoleMappingInterface[] = [ ...prev ];

            updated[index] = {
                ...updated[index],
                roleId: role?.id ?? "",
                roleName: role?.displayName ?? ""
            };

            return updated;
        });
    }, []);

    /**
     * Validate the form before saving.
     */
    const validateForm: () => string | null = useCallback((): string | null => {
        if (!selectedIdp) {
            return t("consoleSettings:enterpriseLogin.validations.connectionRequired");
        }

        if (mappings.length === 0) {
            return t("consoleSettings:enterpriseLogin.validations.atLeastOneMapping");
        }

        const hasIncomplete: boolean = mappings.some(
            (m: GroupRoleMappingInterface) => !m.idpGroup || !m.roleId
        );

        if (hasIncomplete) {
            return t("consoleSettings:enterpriseLogin.validations.incompleteMapping");
        }

        const seen: Set<string> = new Set();

        for (const m of mappings) {
            const key: string = `${m.idpGroup}:${m.roleId}`;

            if (seen.has(key)) {
                return t("consoleSettings:enterpriseLogin.validations.duplicateMapping");
            }
            seen.add(key);
        }

        return null;
    }, [ selectedIdp, mappings, t ]);

    /**
     * Handle save / update action.
     */
    const handleSave: () => Promise<void> = useCallback(async (): Promise<void> => {
        const validationError: string | null = validateForm();

        if (validationError) {
            dispatch(addAlert<AlertInterface>({
                description: validationError,
                level: AlertLevels.ERROR,
                message: t(
                    "consoleSettings:enterpriseLogin.notifications" +
                    ".updateConfiguration.error.message"
                )
            }));

            return;
        }

        setIsSaving(true);

        try {
            const defaultAuthId: string =
                selectedIdp?.federatedAuthenticators?.defaultAuthenticatorId ?? "";
            const defaultAuth: FederatedAuthenticatorListItemInterface | undefined =
                selectedIdp?.federatedAuthenticators?.authenticators?.find(
                    (auth: FederatedAuthenticatorListItemInterface) =>
                        auth.authenticatorId === defaultAuthId
                );

            const config: EnterpriseLoginConfigInterface = {
                authenticatorId: defaultAuthId,
                authenticatorName: defaultAuth?.name ?? "OpenIDConnectAuthenticator",
                idpId: selectedIdp.id,
                idpName: selectedIdp.name,
                mappings
            };

            await saveConfiguration(config);
            dispatch(addAlert<AlertInterface>({
                description: t(
                    "consoleSettings:enterpriseLogin.notifications" +
                    ".updateConfiguration.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "consoleSettings:enterpriseLogin.notifications" +
                    ".updateConfiguration.success.message"
                )
            }));
        } catch {
            dispatch(addAlert<AlertInterface>({
                description: t(
                    "consoleSettings:enterpriseLogin.notifications" +
                    ".updateConfiguration.error.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "consoleSettings:enterpriseLogin.notifications" +
                    ".updateConfiguration.error.message"
                )
            }));
        } finally {
            setIsSaving(false);
        }
    }, [ selectedIdp, mappings, saveConfiguration, validateForm, t, dispatch ]);

    /**
     * Handle remove configuration action.
     */
    const handleRemoveConfiguration: () => Promise<void> = useCallback(async (): Promise<void> => {
        setIsRemoving(true);
        setShowRemoveConfirmation(false);

        try {
            await removeConfiguration();
            dispatch(addAlert<AlertInterface>({
                description: t(
                    "consoleSettings:enterpriseLogin.notifications" +
                    ".deleteConfiguration.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "consoleSettings:enterpriseLogin.notifications" +
                    ".deleteConfiguration.success.message"
                )
            }));
            setSelectedIdp(null);
            setMappings([]);
        } catch {
            dispatch(addAlert<AlertInterface>({
                description: t(
                    "consoleSettings:enterpriseLogin.notifications" +
                    ".deleteConfiguration.error.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "consoleSettings:enterpriseLogin.notifications" +
                    ".deleteConfiguration.error.message"
                )
            }));
        } finally {
            setIsRemoving(false);
        }
    }, [ removeConfiguration, t, dispatch ]);

    if (isLoading || isConnectionsLoading || isConsoleRolesLoading) {
        return (
            <Box
                data-componentid={ componentId }
                sx={ { display: "flex", justifyContent: "center", p: 4 } }
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box data-componentid={ componentId }>
            <EmphasizedSegment padded="very">
                <div className="section-heading">
                    <Heading as="h4">
                        { t("consoleSettings:enterpriseLogin.form.sectionHeading") }
                    </Heading>
                    <Heading as="h6" color="grey" subHeading>
                        { t("consoleSettings:enterpriseLogin.form.sectionDescription") }
                    </Heading>
                </div>

                <Box sx={ { mb: 5, mt: 4 } }>
                    <Autocomplete
                        fullWidth
                        options={ availableConnections }
                        value={ selectedIdp }
                        onChange={ handleIdpChange }
                        getOptionLabel={ (option: StrictConnectionInterface) =>
                            option?.name ?? "" }
                        isOptionEqualToValue={ (
                            option: StrictConnectionInterface,
                            value: StrictConnectionInterface
                        ) => option?.id === value?.id }
                        loading={ isConnectionsLoading }
                        renderInput={ (params: AutocompleteRenderInputParams) => (
                            <TextField
                                { ...params }
                                label={
                                    t("consoleSettings:enterpriseLogin.form.connectionLabel")
                                }
                                placeholder={
                                    t("consoleSettings:enterpriseLogin" +
                                        ".form.connectionPlaceholder")
                                }
                                required
                            />
                        ) }
                        data-componentid={ `${componentId}-connection-select` }
                    />
                </Box>

                { selectedIdp && (
                    <>
                        <Heading as="h5">
                            { t("consoleSettings:enterpriseLogin" +
                                ".configured.mappingsHeading") }
                        </Heading>
                        <Heading as="h6" color="grey" subHeading>
                            { t("consoleSettings:enterpriseLogin.form.mappingDescription") }
                        </Heading>

                        <Box sx={ { mt: 4 } }>
                            { mappings.length > 0 && (
                                <Grid
                                    container
                                    spacing={ 1 }
                                    sx={ { mb: 0.75 } }
                                    alignItems="center"
                                >
                                    <Grid xs={ 5 }>
                                        <Typography
                                            variant="body2"
                                            color="text.primary"
                                            sx={ { fontSize: "1rem", fontWeight: 500 } }
                                        >
                                            { t("consoleSettings:enterpriseLogin.form.roleLabel") }
                                        </Typography>
                                    </Grid>
                                    <Grid xs={ 1 } />
                                    <Grid xs={ 5 }>
                                        <Typography
                                            variant="body2"
                                            color="text.primary"
                                            sx={ { fontSize: "1rem", fontWeight: 500 } }
                                        >
                                            { t("consoleSettings:enterpriseLogin.form.idpGroupLabel") }
                                        </Typography>
                                    </Grid>
                                    <Grid xs={ 1 } />
                                </Grid>
                            ) }

                            { mappings.map(
                                (mapping: GroupRoleMappingInterface, index: number) => {
                                    const usedRoleIds: Set<string> = new Set(
                                        mappings
                                            .filter(
                                                (_: GroupRoleMappingInterface, i: number) =>
                                                    i !== index
                                            )
                                            .map(
                                                (m: GroupRoleMappingInterface) => m.roleId
                                            )
                                            .filter((id: string) => id !== "")
                                    );
                                    const availableRoles: RolesInterface[] = consoleRoles.filter(
                                        (r: RolesInterface) => !usedRoleIds.has(r.id)
                                    );

                                    return (
                                        <Grid
                                            container
                                            spacing={ 1 }
                                            key={ `mapping-row-${index}` }
                                            sx={ { mb: 1 } }
                                            alignItems="center"
                                        >
                                            <Grid xs={ 5 }>
                                                <Autocomplete
                                                    fullWidth
                                                    options={ availableRoles }
                                                    value={
                                                        consoleRoles.find(
                                                            (r: RolesInterface) =>
                                                                r.id === mapping.roleId
                                                        ) ?? null
                                                    }
                                                    onChange={ (
                                                        _event: SyntheticEvent,
                                                        value: RolesInterface | null
                                                    ) => {
                                                        handleRoleChange(index, value);
                                                    } }
                                                    getOptionLabel={
                                                        (option: RolesInterface) =>
                                                            option?.displayName ?? ""
                                                    }
                                                    isOptionEqualToValue={ (
                                                        option: RolesInterface,
                                                        value: RolesInterface
                                                    ) => option?.id === value?.id }
                                                    renderInput={ (params: AutocompleteRenderInputParams) => (
                                                        <TextField
                                                            { ...params }
                                                            placeholder={
                                                                t("consoleSettings:" +
                                                                    "enterpriseLogin" +
                                                                    ".form.rolePlaceholder")
                                                            }
                                                            size="small"
                                                            required
                                                        />
                                                    ) }
                                                    data-componentid={
                                                        `${componentId}-role-${index}`
                                                    }
                                                />
                                            </Grid>

                                            <Grid
                                                xs={ 1 }
                                                sx={ {
                                                    alignItems: "center",
                                                    display: "flex",
                                                    justifyContent: "center"
                                                } }
                                            >
                                                <ChevronRightIcon/>
                                            </Grid>

                                            <Grid xs={ 5 }>
                                                <Autocomplete
                                                    freeSolo
                                                    fullWidth
                                                    options={
                                                        idpGroups.map(
                                                            (g: ConnectionGroupInterface) =>
                                                                g.name
                                                        )
                                                    }
                                                    getOptionLabel={ (option: string) =>
                                                        option.startsWith(CREATE_GROUP_SENTINEL)
                                                            ? option.slice(
                                                                CREATE_GROUP_SENTINEL.length
                                                            )
                                                            : option
                                                    }

                                                    filterOptions={ (
                                                        options: string[],
                                                        params: { inputValue: string }
                                                    ) => {
                                                        const filtered: string[] = options.filter(
                                                            (opt: string) =>
                                                                opt.toLowerCase().includes(
                                                                    params.inputValue.toLowerCase()
                                                                )
                                                        );
                                                        const isExisting: boolean = options.some(
                                                            (opt: string) =>
                                                                opt === params.inputValue
                                                        );

                                                        if (
                                                            params.inputValue !== "" &&
                                                            !isExisting
                                                        ) {
                                                            filtered.push(
                                                                `${CREATE_GROUP_SENTINEL}` +
                                                                `${params.inputValue}`
                                                            );
                                                        }

                                                        return filtered;
                                                    } }
                                                    renderOption={ (
                                                        optProps: React.HTMLAttributes<HTMLLIElement>,
                                                        option: string
                                                    ) => {
                                                        if (option.startsWith(
                                                            CREATE_GROUP_SENTINEL
                                                        )) {
                                                            const newName: string = option.slice(
                                                                CREATE_GROUP_SENTINEL.length
                                                            );

                                                            return (
                                                                <li { ...optProps }>
                                                                    <Button
                                                                        variant="text"
                                                                        color="primary"
                                                                        size="small"
                                                                        disabled={
                                                                            isCreatingGroup
                                                                        }
                                                                        startIcon={
                                                                            isCreatingGroup
                                                                                ? (
                                                                                    <CircularProgress
                                                                                        size={ 14 }
                                                                                    />
                                                                                )
                                                                                : <PlusIcon />
                                                                        }
                                                                        sx={ {
                                                                            textTransform: "none"
                                                                        } }
                                                                    >
                                                                        { t(
                                                                            "consoleSettings:" +
                                                                            "enterpriseLogin" +
                                                                            ".form.createGroup",
                                                                            { name: newName }
                                                                        ) }
                                                                    </Button>
                                                                </li>
                                                            );
                                                        }

                                                        return (
                                                            <li { ...optProps }>
                                                                { option }
                                                            </li>
                                                        );
                                                    } }
                                                    value={ mapping.idpGroup }
                                                    onChange={ (
                                                        _event: SyntheticEvent,
                                                        value: string | null
                                                    ) => {
                                                        if (
                                                            typeof value === "string" &&
                                                            value.startsWith(
                                                                CREATE_GROUP_SENTINEL
                                                            )
                                                        ) {
                                                            const newName: string = value.slice(
                                                                CREATE_GROUP_SENTINEL.length
                                                            );

                                                            handleIdpGroupChange(
                                                                index, newName
                                                            );
                                                            handleCreateGroup(index, newName);
                                                        } else {
                                                            handleIdpGroupChange(
                                                                index, value ?? ""
                                                            );
                                                        }
                                                    } }
                                                    onInputChange={ (
                                                        _event: SyntheticEvent,
                                                        value: string,
                                                        reason: string
                                                    ) => {
                                                        if (reason === "input") {
                                                            handleIdpGroupChange(
                                                                index, value
                                                            );
                                                        }
                                                    } }
                                                    loading={ isIdpGroupsLoading }
                                                    renderInput={ (params: AutocompleteRenderInputParams) => (
                                                        <TextField
                                                            { ...params }
                                                            placeholder={
                                                                t("consoleSettings:" +
                                                                    "enterpriseLogin.form" +
                                                                    ".idpGroupPlaceholder")
                                                            }
                                                            size="small"
                                                            required
                                                        />
                                                    ) }
                                                    data-componentid={
                                                        `${componentId}-group-${index}`
                                                    }
                                                />
                                            </Grid>

                                            <Grid xs={ 1 }>
                                                <IconButton
                                                    size="small"
                                                    onClick={
                                                        () => handleRemoveMapping(index)
                                                    }
                                                    aria-label="Remove mapping"
                                                    data-componentid={
                                                        `${componentId}-remove-mapping-${index}`
                                                    }
                                                >
                                                    <TrashIcon />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    );
                                })
                            }
                        </Box>

                        <Box sx={ { mb: 4, ml: 0 } }>
                            <Button
                                variant="text"
                                size="small"
                                startIcon={ <PlusIcon /> }
                                onClick={ handleAddMapping }
                                sx={ {
                                    "& .MuiButton-startIcon": {
                                        marginLeft: 0,
                                        marginRight: "4px"
                                    },
                                    "&:hover": {
                                        background: "none",
                                        color: "primary.dark"
                                    },
                                    fontSize: "0.9rem",
                                    minWidth: "auto",
                                    ml: "-12px",
                                    p: 0,
                                    textTransform: "none"
                                } }
                                data-componentid= { `${componentId}-add-mapping-btn` }
                            >
                                { t("consoleSettings:enterpriseLogin.form.addMapping") }
                            </Button>
                        </Box>
                    </>

                ) }

                <Box sx={ { display: "flex", gap: 1, mt: 2 } }>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={ handleSave }
                        disabled={
                            isSaving || !selectedIdp || mappings.length === 0
                        }
                        data-componentid={ `${componentId}-save-btn` }
                    >
                        { isSaving
                            ? <CircularProgress size={ 16 } />
                            : existingConfig
                                ? t("common:update")
                                : t("consoleSettings:enterpriseLogin.actions.save")
                        }
                    </Button>

                </Box>
            </EmphasizedSegment>

            { existingConfig && (
                <DangerZoneGroup
                    sectionHeader={
                        t("consoleSettings:enterpriseLogin.confirmations" +
                            ".removeConfiguration.header")
                    }
                >
                    <DangerZone
                        actionTitle={
                            t("consoleSettings:enterpriseLogin.actions.remove")
                        }
                        header={
                            t("consoleSettings:enterpriseLogin.confirmations" +
                                ".removeConfiguration.header")
                        }
                        subheader={
                            t("consoleSettings:enterpriseLogin.confirmations" +
                                ".removeConfiguration.content")
                        }
                        onActionClick={ (): void => setShowRemoveConfirmation(true) }
                        isButtonDisabled={ isRemoving }
                        data-componentid={ `${componentId}-danger-zone` }
                    />
                </DangerZoneGroup>
            ) }

            <ConfirmationModal
                open={ showRemoveConfirmation }
                onClose={ () => setShowRemoveConfirmation(false) }
                type="negative"
                primaryAction={
                    t("consoleSettings:enterpriseLogin.confirmations" +
                        ".removeConfiguration.primaryAction")
                }
                secondaryAction={
                    t("consoleSettings:enterpriseLogin.confirmations" +
                        ".removeConfiguration.secondaryAction")
                }
                onPrimaryActionClick={ handleRemoveConfiguration }
                onSecondaryActionClick={ () => setShowRemoveConfirmation(false) }
                data-componentid={ `${componentId}-remove-confirmation` }
            >
                <ConfirmationModal.Header>
                    { t("consoleSettings:enterpriseLogin.confirmations" +
                        ".removeConfiguration.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message attached negative>
                    { t("consoleSettings:enterpriseLogin.confirmations" +
                        ".removeConfiguration.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    { t("consoleSettings:enterpriseLogin.confirmations" +
                        ".removeConfiguration.content") }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </Box>
    );
};

export default ConsoleEnterpriseLogin;
