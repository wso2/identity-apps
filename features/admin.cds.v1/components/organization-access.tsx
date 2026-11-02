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

import Alert from "@oxygen-ui/react/Alert";
import Button from "@oxygen-ui/react/Button";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import FormControl from "@oxygen-ui/react/FormControl";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Grid from "@oxygen-ui/react/Grid";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal, ContentLoader, EmphasizedSegment, Heading, Hint } from "@wso2is/react-components";
import React, { ChangeEvent, FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import {
    createOrganizationAccess,
    deleteOrganizationAccess,
    startOrganizationTreeSync,
    updateOrganizationAccess
} from "../api/organization-management";
import useOrganizationAccess from "../hooks/use-org-access";
import {
    ChildOrganizationInterface,
    ChildOrganizationReach,
    ChildOrganizationsMode,
    OrganizationAccessPolicyInterface,
    PolicyFormMode,
    SharePolicyRequestInterface,
    TreeSyncState,
    TreeSyncStatusInterface
} from "../models/organization-management";
import { getErrorDetail, toPolicyFormMode } from "../utils/organization-management-utils";
import OrganizationSelection from "./organization-selection";

interface OrganizationAccessPropsInterface extends IdentifiableComponentInterface {
    /**
     * Whether the user can change the organization access.
     */
    canUpdate: boolean;
    /**
     * The state of the organization tree sync. CDS refuses the organization access until a sync
     * completed.
     */
    syncStatus: TreeSyncStatusInterface;
    /**
     * Reads the sync state again after a sync starts.
     */
    onSyncStarted: () => void;
}

/**
 * Organization access of the root organization: the organizations that can use CDS, in the
 * layout of the shared access of applications and users. With no selection, only the root uses
 * CDS. The root allows all organizations, or selected child organizations with or without the
 * organizations below them. Before the first completed sync, it shows only the sync of the
 * organization tree.
 */
const OrganizationAccess: FunctionComponent<OrganizationAccessPropsInterface> = ({
    canUpdate,
    syncStatus,
    onSyncStarted,
    ["data-componentid"]: componentId = "cds-organization-access"
}: OrganizationAccessPropsInterface): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const isTreeSynced: boolean = Boolean(syncStatus?.last_synced_at);
    const syncState: TreeSyncState = syncStatus?.state ?? TreeSyncState.NOT_SYNCED;
    const isSyncing: boolean = syncState === TreeSyncState.SYNCING;

    const { data: access, isLoading: isAccessLoading, mutate: mutateAccess } =
        useOrganizationAccess(isTreeSynced);

    // The list has a maximum of one policy.
    const policy: OrganizationAccessPolicyInterface = access?.policies?.[0];
    const storedMode: PolicyFormMode = toPolicyFormMode(policy?.child_orgs?.mode);

    const [ mode, setMode ] = useState<PolicyFormMode>(PolicyFormMode.NONE);
    const [ selected, setSelected ] = useState<Record<string, ChildOrganizationReach>>({});
    const [ isSaving, setIsSaving ] = useState<boolean>(false);
    const [ problem, setProblem ] = useState<string>(null);
    const [ pendingMode, setPendingMode ] = useState<PolicyFormMode>(null);
    const [ showAllConfirmation, setShowAllConfirmation ] = useState<boolean>(false);
    const [ isSyncStarting, setIsSyncStarting ] = useState<boolean>(false);

    // Load the form from the stored policy. "selected" maps each selected organization to its reach.
    useEffect(() => {
        if (isAccessLoading) return;
        const picked: Record<string, ChildOrganizationReach> = {};

        policy?.child_orgs?.orgs?.forEach((child: ChildOrganizationInterface) => {
            picked[child.org_id] = child.reach;
        });
        setMode(storedMode);
        setSelected(picked);
    }, [ policy, isAccessLoading ]);

    const payload: SharePolicyRequestInterface = useMemo((): SharePolicyRequestInterface => {
        if (mode === PolicyFormMode.ALL) return { child_orgs: { mode: ChildOrganizationsMode.ALL } };

        return {
            child_orgs: {
                mode: ChildOrganizationsMode.SELECTED,
                orgs: Object.entries(selected).map(([ orgId, reach ]: [ string, ChildOrganizationReach ]) =>
                    ({ org_id: orgId, reach }))
            }
        };
    }, [ mode, selected ]);

    // A change between all and selected organizations is a DELETE and a POST.
    const isModeChange = (next: PolicyFormMode): boolean =>
        Boolean(policy) && next !== PolicyFormMode.NONE && storedMode !== PolicyFormMode.NONE && next !== storedMode;

    const handleModeChange = (next: PolicyFormMode): void => {
        if (isModeChange(next)) {
            setPendingMode(next);

            return;
        }
        setMode(next);
    };

    const saveAccess = async (): Promise<void> => {
        setProblem(null);
        setIsSaving(true);

        try {
            if (mode === PolicyFormMode.NONE) {
                await deleteOrganizationAccess(policy.id);
            } else if (!policy) {
                await createOrganizationAccess(payload);
            } else if (isModeChange(mode)) {
                await deleteOrganizationAccess(policy.id);
                await createOrganizationAccess(payload);
            } else {
                await updateOrganizationAccess(policy.id, payload);
            }
            dispatch(addAlert({
                description: t("customerDataService:organizationAccess.notifications.success.description"),
                level: AlertLevels.SUCCESS,
                message: t("customerDataService:organizationAccess.notifications.success.message")
            }));
            await mutateAccess();
        } catch (error) {
            const detail: string = getErrorDetail(error,
                t("customerDataService:organizationAccess.notifications.error.description"));

            setProblem(detail);
            dispatch(addAlert({
                description: detail,
                level: AlertLevels.ERROR,
                message: t("customerDataService:organizationAccess.notifications.error.message")
            }));
            await mutateAccess();
        } finally {
            setIsSaving(false);
        }
    };

    const handleSave = (): void => {
        if (mode === PolicyFormMode.SELECTED && Object.keys(selected).length === 0) {
            dispatch(addAlert({
                description: t("customerDataService:organizationAccess.notifications.noOrganizationsSelected" +
                    ".description"),
                level: AlertLevels.ERROR,
                message: t("customerDataService:organizationAccess.notifications.noOrganizationsSelected.message")
            }));

            return;
        }
        if (mode === PolicyFormMode.ALL && storedMode !== PolicyFormMode.ALL) {
            setShowAllConfirmation(true);

            return;
        }
        saveAccess();
    };

    const formatTime = (value?: string): string => value ? new Date(value).toLocaleString() : "-";

    const handleSync = async (): Promise<void> => {
        setIsSyncStarting(true);

        try {
            await startOrganizationTreeSync();
        } catch (error) {
            dispatch(addAlert({
                description: getErrorDetail(error,
                    t("customerDataService:organizationSync.notifications.error.description")),
                level: AlertLevels.ERROR,
                message: t("customerDataService:organizationSync.notifications.error.message")
            }));
        } finally {
            setIsSyncStarting(false);
            onSyncStarted();
        }
    };

    const renderHeading = (): ReactElement => (
        <>
            <Heading as="h4">{ t("customerDataService:organizationAccess.heading") }</Heading>
            <Heading as="h6">{ t("customerDataService:organizationAccess.description") }</Heading>
        </>
    );

    if (isAccessLoading) {
        return <ContentLoader inline="centered" active />;
    }

    if (!isTreeSynced) {
        return (
            <EmphasizedSegment padded data-componentid={ componentId }>
                { renderHeading() }
                <Alert severity="info" data-componentid={ `${ componentId }-not-synced` }>
                    { t("customerDataService:organizationAccess.notSynced") }
                </Alert>
                { syncState === TreeSyncState.FAILED && (
                    <Alert severity="error" sx={ { mt: 2 } } data-componentid={ `${ componentId }-sync-error` }>
                        { t("customerDataService:organizationSync.failed", {
                            error: syncStatus?.error ?? "-",
                            time: formatTime(syncStatus?.finished_at)
                        }) }
                    </Alert>
                ) }
                { canUpdate && (
                    <Button
                        sx={ { mt: 4 } }
                        variant="contained"
                        size="small"
                        disabled={ isSyncStarting || isSyncing }
                        startIcon={ (isSyncStarting || isSyncing) ? <CircularProgress size={ 14 } /> : null }
                        onClick={ handleSync }
                        data-componentid={ `${ componentId }-sync-button` }
                    >
                        { t("customerDataService:organizationSync.sync") }
                    </Button>
                ) }
                { isSyncing && (
                    <Hint data-componentid={ `${ componentId }-syncing` }>
                        { t("customerDataService:organizationSync.syncing", {
                            time: formatTime(syncStatus?.started_at)
                        }) }
                    </Hint>
                ) }
            </EmphasizedSegment>
        );
    }

    return (
        <EmphasizedSegment padded data-componentid={ componentId }>
            <Grid container>
                <Grid xs={ 12 }>
                    { renderHeading() }
                    <FormControl fullWidth>
                        <RadioGroup
                            value={ mode }
                            onChange={ (event: ChangeEvent<HTMLInputElement>) =>
                                handleModeChange(event.target.value as PolicyFormMode) }
                            data-componentid={ `${ componentId }-radio-group` }
                        >
                            <FormControlLabel
                                value={ PolicyFormMode.NONE }
                                label={ t("customerDataService:organizationAccess.options.none") }
                                control={ <Radio /> }
                                disabled={ !canUpdate }
                                data-componentid={ `${ componentId }-mode-none` }
                            />
                            <FormControlLabel
                                value={ PolicyFormMode.ALL }
                                label={ t("customerDataService:organizationAccess.options.all") }
                                control={ <Radio /> }
                                disabled={ !canUpdate }
                                data-componentid={ `${ componentId }-mode-all` }
                            />
                            <FormControlLabel
                                value={ PolicyFormMode.SELECTED }
                                label={ (
                                    <>
                                        { t("customerDataService:organizationAccess.options.selected") }
                                        <Hint inline popup>
                                            { t("customerDataService:organizationAccess.options.selectedHint") }
                                        </Hint>
                                    </>
                                ) }
                                control={ <Radio /> }
                                disabled={ !canUpdate }
                                data-componentid={ `${ componentId }-mode-selected` }
                            />
                            { mode === PolicyFormMode.SELECTED && (
                                <Grid xs={ 12 } sx={ { ml: 4 } }>
                                    <OrganizationSelection
                                        selected={ selected }
                                        onChange={ setSelected }
                                        readOnly={ !canUpdate }
                                        includeChildOrganizationsLabel={
                                            t("customerDataService:organizationAccess.includeChildOrganizations") }
                                        data-componentid={ `${ componentId }-selection` }
                                    />
                                </Grid>
                            ) }
                        </RadioGroup>
                    </FormControl>
                </Grid>
                { problem && (
                    <Grid xs={ 12 } sx={ { mt: 2 } }>
                        <Alert severity="error" data-componentid={ `${ componentId }-problem` }>
                            { problem }
                        </Alert>
                    </Grid>
                ) }
                { canUpdate && (
                    <Grid xs={ 8 }>
                        <Button
                            sx={ { mt: 4 } }
                            variant="contained"
                            size="small"
                            disabled={ isSaving || (mode === PolicyFormMode.NONE && !policy) }
                            onClick={ handleSave }
                            data-componentid={ `${ componentId }-save-button` }
                        >
                            { t("common:save") }
                        </Button>
                    </Grid>
                ) }
            </Grid>
            <ConfirmationModal
                data-componentid={ `${ componentId }-mode-change-modal` }
                onClose={ () => setPendingMode(null) }
                type="negative"
                open={ Boolean(pendingMode) }
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onPrimaryActionClick={ () => {
                    setMode(pendingMode);
                    setPendingMode(null);
                } }
                onSecondaryActionClick={ () => setPendingMode(null) }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header>
                    { t("customerDataService:organizationAccess.confirmations.modeChange.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message attached negative>
                    { t("customerDataService:organizationAccess.confirmations.modeChange.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    { t("customerDataService:organizationAccess.confirmations.modeChange.content") }
                </ConfirmationModal.Content>
            </ConfirmationModal>
            <ConfirmationModal
                data-componentid={ `${ componentId }-all-organizations-modal` }
                onClose={ () => setShowAllConfirmation(false) }
                type="warning"
                open={ showAllConfirmation }
                assertionHint={ t("customerDataService:organizationAccess.confirmations.allOrganizations" +
                    ".assertionHint") }
                assertionType="checkbox"
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onPrimaryActionClick={ () => {
                    setShowAllConfirmation(false);
                    saveAccess();
                } }
                onSecondaryActionClick={ () => setShowAllConfirmation(false) }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header>
                    { t("customerDataService:organizationAccess.confirmations.allOrganizations.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message attached warning>
                    { t("customerDataService:organizationAccess.confirmations.allOrganizations.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    { t("customerDataService:organizationAccess.confirmations.allOrganizations.content") }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </EmphasizedSegment>
    );
};

export default OrganizationAccess;
