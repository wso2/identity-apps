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
import FormControl from "@oxygen-ui/react/FormControl";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Grid from "@oxygen-ui/react/Grid";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal, ContentLoader, EmphasizedSegment, Heading, Hint } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { ChangeEvent, FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import OrganizationSelection from "./organization-selection";
import {
    createOrganizationAccess,
    deleteOrganizationAccess,
    updateOrganizationAccess
} from "../api/organization-management";
import useOrganizationAccess from "../hooks/use-org-access";
import {
    ChildOrg,
    ChildOrgReach,
    ChildOrgsMode,
    OrgAccessPolicy,
    SharePolicyRequest
} from "../models/organization-management";

type AccessMode = "none" | ChildOrgsMode;

interface OrganizationAccessPropsInterface extends IdentifiableComponentInterface {
    /**
     * Whether the user can change the organization access.
     */
    canUpdate: boolean;
    /**
     * Whether a sync of the organization tree completed. CDS refuses the organization access
     * until then.
     */
    isTreeSynced: boolean;
}

/**
 * Organization access of the root organization: the organizations that can use CDS, in the
 * layout of the shared access of applications and users. With no selection, only the root uses
 * CDS. The root allows all organizations, or selected ones. Each organization between the root and
 * a selected organization must also be selected.
 */
const OrganizationAccess: FunctionComponent<OrganizationAccessPropsInterface> = ({
    canUpdate,
    isTreeSynced,
    ["data-componentid"]: componentId = "cds-organization-access"
}: OrganizationAccessPropsInterface): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const { data: access, isLoading: isAccessLoading, mutate: mutateAccess } = useOrganizationAccess(true);

    // The list has a maximum of one policy.
    const policy: OrgAccessPolicy = access?.policies?.[0];
    const storedMode: AccessMode = policy?.child_orgs?.mode ?? "none";

    const [ mode, setMode ] = useState<AccessMode>("none");
    const [ selected, setSelected ] = useState<Record<string, ChildOrgReach>>({});
    const [ isSaving, setIsSaving ] = useState<boolean>(false);
    const [ problem, setProblem ] = useState<string>(null);
    const [ pendingMode, setPendingMode ] = useState<ChildOrgsMode>(null);
    const [ showAllConfirmation, setShowAllConfirmation ] = useState<boolean>(false);

    // Load the form from the stored policy. "selected" maps each selected organization to its reach.
    useEffect(() => {
        if (isAccessLoading) return;
        const picked: Record<string, ChildOrgReach> = {};

        policy?.child_orgs?.orgs?.forEach((child: ChildOrg) => {
            picked[child.org_id] = child.reach;
        });
        setMode(storedMode);
        setSelected(picked);
    }, [ policy, isAccessLoading ]);

    const payload: SharePolicyRequest = useMemo((): SharePolicyRequest => {
        if (mode === "all") return { child_orgs: { mode: "all" } };

        return {
            child_orgs: {
                mode: "selected",
                orgs: Object.entries(selected).map(([ orgId, reach ]: [ string, ChildOrgReach ]) =>
                    ({ org_id: orgId, reach }))
            }
        };
    }, [ mode, selected ]);

    // A change between all and selected organizations is a DELETE and a POST.
    const isModeChange = (next: AccessMode): boolean =>
        Boolean(policy) && next !== "none" && storedMode !== "none" && next !== storedMode;

    const handleModeChange = (next: AccessMode): void => {
        if (isModeChange(next)) {
            setPendingMode(next as ChildOrgsMode);

            return;
        }
        setMode(next);
    };

    const saveAccess = async (): Promise<void> => {
        setProblem(null);
        setIsSaving(true);

        try {
            if (mode === "none") {
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
            const data: { code?: string; description?: string } =
                (error as AxiosError<{ code?: string; description?: string }>)?.response?.data;
            const detail: string = data?.description
                ? `${ data.code ? `[${ data.code }] ` : "" }${ data.description }`
                : t("customerDataService:organizationAccess.notifications.error.description");

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
        if (mode === "selected" && Object.keys(selected).length === 0) {
            dispatch(addAlert({
                description: t("customerDataService:organizationAccess.notifications.noOrganizationsSelected" +
                    ".description"),
                level: AlertLevels.ERROR,
                message: t("customerDataService:organizationAccess.notifications.noOrganizationsSelected.message")
            }));

            return;
        }
        if (mode === "all" && storedMode !== "all") {
            setShowAllConfirmation(true);

            return;
        }
        saveAccess();
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
                                handleModeChange(event.target.value as AccessMode) }
                            data-componentid={ `${ componentId }-radio-group` }
                        >
                            <FormControlLabel
                                value="none"
                                label={ t("customerDataService:organizationAccess.options.none") }
                                control={ <Radio /> }
                                disabled={ !canUpdate }
                                data-componentid={ `${ componentId }-mode-none` }
                            />
                            <FormControlLabel
                                value="all"
                                label={ t("customerDataService:organizationAccess.options.all") }
                                control={ <Radio /> }
                                disabled={ !canUpdate }
                                data-componentid={ `${ componentId }-mode-all` }
                            />
                            <FormControlLabel
                                value="selected"
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
                            { mode === "selected" && (
                                <Grid xs={ 12 } className="ml-5">
                                    <OrganizationSelection
                                        selected={ selected }
                                        onChange={ setSelected }
                                        isTree
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
                    <Grid xs={ 12 } className="mt-3">
                        <Alert severity="error" data-componentid={ `${ componentId }-problem` }>
                            { problem }
                        </Alert>
                    </Grid>
                ) }
                { canUpdate && (
                    <Grid xs={ 8 }>
                        <Button
                            className="mt-5"
                            variant="contained"
                            size="small"
                            disabled={ isSaving || (mode === "none" && !policy) }
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
