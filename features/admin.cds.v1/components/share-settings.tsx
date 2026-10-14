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
import OxygenButton from "@oxygen-ui/react/Button";
import FormControl from "@oxygen-ui/react/FormControl";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Grid from "@oxygen-ui/react/Grid";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal, ContentLoader, Heading, Hint } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { ChangeEvent, FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import OrganizationSelection from "./organization-selection";
import {
    createSharePolicy,
    deleteSharePolicy,
    listSharePolicies,
    updateSharePolicy
} from "../api/organization-management";
import { useSharePolicies } from "../hooks/use-share-policy";
import {
    ChildOrg,
    ChildOrgReach,
    ChildOrgs,
    ChildOrgsMode,
    SharePolicyRequest,
    ShareableResource
} from "../models/organization-management";

type ShareMode = "none" | ChildOrgsMode;

interface ShareSettingsPropsInterface extends IdentifiableComponentInterface {
    /**
     * The attribute or the rule to share.
     */
    resource: ShareableResource;
    /**
     * Whether the user can change the share settings.
     */
    readOnly?: boolean;
    /**
     * Called after the share settings change.
     */
    onUpdate?: () => void;
}

// CDS returns this code for a second policy of the same organization.
const POLICY_EXISTS_CODE: string = "CDS-17008";

/**
 * Share settings of a profile attribute or a unification rule, in the layout of the shared access
 * of applications and users. The admin shares with all organizations, or with selected child
 * organizations (with or without their existing and future child organizations).
 */
const ShareSettings: FunctionComponent<ShareSettingsPropsInterface> = ({
    resource,
    readOnly = false,
    onUpdate,
    ["data-componentid"]: componentId = "cds-share-settings"
}: ShareSettingsPropsInterface): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const resourceLabel: string = t(`customerDataService:sharing.resource.${ resource.type }`);

    const {
        data: policies,
        isLoading: isPoliciesLoading,
        mutate: mutatePolicies
    } = useSharePolicies(resource, true);
    // The list has a maximum of one policy: the policy of the current organization.
    const policyId: string = policies?.policies?.[0]?.id;

    const hasPolicy: boolean = Boolean(policyId);

    const [ mode, setMode ] = useState<ShareMode>("none");
    const [ selected, setSelected ] = useState<Record<string, ChildOrgReach>>({});
    const [ isSaving, setIsSaving ] = useState<boolean>(false);
    const [ problem, setProblem ] = useState<string>(null);
    const [ showSwitchConfirmation, setShowSwitchConfirmation ] = useState<boolean>(false);
    const [ showShareAllConfirmation, setShowShareAllConfirmation ] = useState<boolean>(false);

    const childOrgs: ChildOrgs = policies?.policies?.[0]?.child_orgs;
    const storedMode: ShareMode = childOrgs?.mode ?? "none";

    // Load the form from the stored policy. "selected" maps each selected child to its reach.
    useEffect(() => {
        if (isPoliciesLoading) return;
        if (!childOrgs) {
            setMode("none");
            setSelected({});

            return;
        }
        const picked: Record<string, ChildOrgReach> = {};

        childOrgs.orgs?.forEach((child: ChildOrg) => {
            picked[child.org_id] = child.reach;
        });
        setMode(childOrgs.mode);
        setSelected(picked);
    }, [ childOrgs, isPoliciesLoading ]);

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

    // A change from all organizations to selected organizations asks for a confirmation.
    const handleModeChange = (next: ShareMode): void => {
        if (storedMode === "all" && next === "selected") {
            setShowSwitchConfirmation(true);

            return;
        }
        setMode(next);
    };

    // Creates the policy, or replaces its targets. When another tab created the policy first, CDS
    // returns HTTP 409, and the targets of that policy are replaced.
    const saveSharePolicy = async (): Promise<void> => {
        if (hasPolicy) {
            await updateSharePolicy(resource, policyId, payload);

            return;
        }

        try {
            await createSharePolicy(resource, payload);
        } catch (error) {
            if ((error as AxiosError<{ code?: string }>)?.response?.data?.code !== POLICY_EXISTS_CODE) {
                throw error;
            }
            const existing: string = (await listSharePolicies(resource))?.policies?.[0]?.id;

            if (!existing) throw error;
            await updateSharePolicy(resource, existing, payload);
        }
    };

    const handleSave = (): void => {
        if (mode === "selected" && Object.keys(selected).length === 0) {
            dispatch(addAlert({
                description: t("customerDataService:sharing.notifications.noOrganizationsSelected.description",
                    { resource: resourceLabel }),
                level: AlertLevels.ERROR,
                message: t("customerDataService:sharing.notifications.noOrganizationsSelected.message")
            }));

            return;
        }
        if (mode === "all" && storedMode !== "all") {
            setShowShareAllConfirmation(true);

            return;
        }
        saveShareSettings();
    };

    const saveShareSettings = async (): Promise<void> => {
        setProblem(null);
        setIsSaving(true);

        try {
            if (mode === "none") {
                if (hasPolicy) {
                    await deleteSharePolicy(resource, policyId);
                }
                dispatch(addAlert({
                    description: t("customerDataService:sharing.notifications.stopped.description",
                        { resource: resourceLabel }),
                    level: AlertLevels.SUCCESS,
                    message: t("customerDataService:sharing.notifications.stopped.message")
                }));
            } else {
                await saveSharePolicy();
                dispatch(addAlert({
                    description: t("customerDataService:sharing.notifications.success.description",
                        { resource: resourceLabel }),
                    level: AlertLevels.SUCCESS,
                    message: t("customerDataService:sharing.notifications.success.message")
                }));
            }
            await mutatePolicies();
            onUpdate?.();
        } catch (error) {
            const data: { code?: string; description?: string; message?: string } =
                (error as AxiosError<{ code?: string; description?: string; message?: string }>)?.response?.data;
            const detail: string = data?.description
                ? `${ data.code ? `[${ data.code }] ` : "" }${ data.description }`
                : t("customerDataService:sharing.notifications.error.description");

            setProblem(detail);
            dispatch(addAlert({
                description: detail,
                level: AlertLevels.ERROR,
                message: t("customerDataService:sharing.notifications.error.message")
            }));
        } finally {
            setIsSaving(false);
        }
    };

    if (isPoliciesLoading) {
        return <ContentLoader inline="centered" active />;
    }

    return (
        <div data-componentid={ componentId }>
            <Grid container>
                <Grid xs={ 12 }>
                    <Heading as="h4">{ t("customerDataService:sharing.heading") }</Heading>
                    <Heading as="h6">
                        { t("customerDataService:sharing.description", { resource: resourceLabel }) }
                    </Heading>
                    <FormControl fullWidth>
                        <RadioGroup
                            value={ mode }
                            onChange={ (event: ChangeEvent<HTMLInputElement>) =>
                                handleModeChange(event.target.value as ShareMode) }
                            data-componentid={ `${ componentId }-radio-group` }
                        >
                            <FormControlLabel
                                value="none"
                                label={ t("customerDataService:sharing.options.none", { resource: resourceLabel }) }
                                control={ <Radio /> }
                                disabled={ readOnly }
                                data-componentid={ `${ componentId }-mode-none` }
                            />
                            <FormControlLabel
                                value="all"
                                label={ (
                                    <>
                                        { t("customerDataService:sharing.options.all", { resource: resourceLabel }) }
                                        <Hint inline popup>
                                            { t("customerDataService:sharing.options.allHint") }
                                        </Hint>
                                    </>
                                ) }
                                control={ <Radio /> }
                                disabled={ readOnly }
                                data-componentid={ `${ componentId }-mode-all` }
                            />
                            <FormControlLabel
                                value="selected"
                                label={ (
                                    <>
                                        { t("customerDataService:sharing.options.selected",
                                            { resource: resourceLabel }) }
                                        <Hint inline popup>
                                            { t("customerDataService:sharing.options.selectedHint") }
                                        </Hint>
                                    </>
                                ) }
                                control={ <Radio /> }
                                disabled={ readOnly }
                                data-componentid={ `${ componentId }-mode-selected` }
                            />
                            { mode === "selected" && (
                                <Grid xs={ 12 } className="ml-5">
                                    <OrganizationSelection
                                        selected={ selected }
                                        onChange={ setSelected }
                                        isTree={ false }
                                        readOnly={ readOnly }
                                        includeChildOrganizationsLabel={
                                            t("customerDataService:sharing.includeChildOrganizations") }
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
                { !readOnly && (
                    <Grid xs={ 8 }>
                        <OxygenButton
                            className="mt-5"
                            variant="contained"
                            size="small"
                            disabled={ isSaving || (mode === "none" && !hasPolicy) }
                            onClick={ handleSave }
                            data-componentid={ `${ componentId }-save-button` }
                        >
                            { t("common:save") }
                        </OxygenButton>
                    </Grid>
                ) }
            </Grid>
            <ConfirmationModal
                data-componentid={ `${ componentId }-switch-modal` }
                onClose={ () => setShowSwitchConfirmation(false) }
                type="negative"
                open={ showSwitchConfirmation }
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onPrimaryActionClick={ () => {
                    setMode("selected");
                    setShowSwitchConfirmation(false);
                } }
                onSecondaryActionClick={ () => setShowSwitchConfirmation(false) }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header>
                    { t("customerDataService:sharing.confirmations.switchToSelected.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message attached negative>
                    { t("customerDataService:sharing.confirmations.switchToSelected.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    { t("customerDataService:sharing.confirmations.switchToSelected.content",
                        { resource: resourceLabel }) }
                </ConfirmationModal.Content>
            </ConfirmationModal>
            <ConfirmationModal
                data-componentid={ `${ componentId }-share-all-modal` }
                onClose={ () => setShowShareAllConfirmation(false) }
                type="warning"
                open={ showShareAllConfirmation }
                assertionHint={ t("customerDataService:sharing.confirmations.shareAll.assertionHint") }
                assertionType="checkbox"
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onPrimaryActionClick={ () => {
                    setShowShareAllConfirmation(false);
                    saveShareSettings();
                } }
                onSecondaryActionClick={ () => setShowShareAllConfirmation(false) }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header>
                    { t("customerDataService:sharing.confirmations.shareAll.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message attached warning>
                    { t("customerDataService:sharing.confirmations.shareAll.message", { resource: resourceLabel }) }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    { t("customerDataService:sharing.confirmations.shareAll.content", { resource: resourceLabel }) }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </div>
    );
};

export default ShareSettings;
