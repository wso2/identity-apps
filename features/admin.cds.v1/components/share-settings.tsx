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
import { useRequiredScopes } from "@wso2is/access-control";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal, ContentLoader, Heading, Hint } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { ChangeEvent, FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import {
    createSharePolicy,
    deleteSharePolicy,
    updateSharePolicy
} from "../api/organization-management";
import { OrganizationManagementScopes } from "../constants/organization-management-constants";
import useSharePolicies from "../hooks/use-share-policy";
import {
    ChildOrganizationInterface,
    ChildOrganizationReach,
    ChildOrganizationsInterface,
    ChildOrganizationsMode,
    PolicyFormMode,
    SharePolicyRequestInterface,
    ShareableResource,
    ShareableResourceType
} from "../models/organization-management";
import { getErrorDetail, toPolicyFormMode } from "../utils/organization-management-utils";
import OrganizationSelection from "./organization-selection";

interface ShareSettingsPropsInterface extends IdentifiableComponentInterface {
    /**
     * The attribute or the rule to share.
     */
    resource: ShareableResource;
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
    ["data-componentid"]: componentId = "cds-share-settings"
}: ShareSettingsPropsInterface): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const resourceLabel: string = t(`customerDataService:sharing.resource.${ resource.type }`);
    const hasShareUpdateScope: boolean = useRequiredScopes([
        resource.type === ShareableResourceType.RULE
            ? OrganizationManagementScopes.UNIFICATION_RULE_SHARE_UPDATE
            : OrganizationManagementScopes.PROFILE_SCHEMA_SHARE_UPDATE
    ]);
    // Without the share update scope, the form shows the policy and cannot change it.
    const isReadOnly: boolean = !hasShareUpdateScope;

    const {
        data: policies,
        isLoading: isPoliciesLoading,
        mutate: mutatePolicies
    } = useSharePolicies(resource, true);
    // The list has a maximum of one policy: the policy of the current organization.
    const policyId: string = policies?.policies?.[0]?.id;

    const hasPolicy: boolean = Boolean(policyId);

    const [ mode, setMode ] = useState<PolicyFormMode>(PolicyFormMode.NONE);
    const [ selected, setSelected ] = useState<Record<string, ChildOrganizationReach>>({});
    const [ isSaving, setIsSaving ] = useState<boolean>(false);
    const [ problem, setProblem ] = useState<string>(null);
    const [ showSwitchConfirmation, setShowSwitchConfirmation ] = useState<boolean>(false);
    const [ showShareAllConfirmation, setShowShareAllConfirmation ] = useState<boolean>(false);

    const childOrgs: ChildOrganizationsInterface = policies?.policies?.[0]?.child_orgs;
    const storedMode: PolicyFormMode = toPolicyFormMode(childOrgs?.mode);

    // Load the form from the stored policy. "selected" maps each selected child to its reach.
    useEffect(() => {
        if (isPoliciesLoading) return;
        if (!childOrgs) {
            setMode(PolicyFormMode.NONE);
            setSelected({});

            return;
        }
        const picked: Record<string, ChildOrganizationReach> = {};

        childOrgs.orgs?.forEach((child: ChildOrganizationInterface) => {
            picked[child.org_id] = child.reach;
        });
        setMode(toPolicyFormMode(childOrgs.mode));
        setSelected(picked);
    }, [ childOrgs, isPoliciesLoading ]);

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

    // A change from all organizations to selected organizations asks for a confirmation.
    const handleModeChange = (next: PolicyFormMode): void => {
        if (storedMode === PolicyFormMode.ALL && next === PolicyFormMode.SELECTED) {
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
            const existing: string = (await mutatePolicies())?.data?.policies?.[0]?.id;

            if (!existing) throw error;
            await updateSharePolicy(resource, existing, payload);
        }
    };

    const handleSave = (): void => {
        if (mode === PolicyFormMode.SELECTED && Object.keys(selected).length === 0) {
            dispatch(addAlert({
                description: t("customerDataService:sharing.notifications.noOrganizationsSelected.description",
                    { resource: resourceLabel }),
                level: AlertLevels.ERROR,
                message: t("customerDataService:sharing.notifications.noOrganizationsSelected.message")
            }));

            return;
        }
        if (mode === PolicyFormMode.ALL && storedMode !== PolicyFormMode.ALL) {
            setShowShareAllConfirmation(true);

            return;
        }
        saveShareSettings();
    };

    const saveShareSettings = async (): Promise<void> => {
        setProblem(null);
        setIsSaving(true);

        try {
            if (mode === PolicyFormMode.NONE) {
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
        } catch (error) {
            mutatePolicies();
            const detail: string = getErrorDetail(error,
                t("customerDataService:sharing.notifications.error.description"));

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
                                handleModeChange(event.target.value as PolicyFormMode) }
                            data-componentid={ `${ componentId }-radio-group` }
                        >
                            <FormControlLabel
                                value={ PolicyFormMode.NONE }
                                label={ t("customerDataService:sharing.options.none", { resource: resourceLabel }) }
                                control={ <Radio /> }
                                disabled={ isReadOnly }
                                data-componentid={ `${ componentId }-mode-none` }
                            />
                            <FormControlLabel
                                value={ PolicyFormMode.ALL }
                                label={ (
                                    <>
                                        { t("customerDataService:sharing.options.all", { resource: resourceLabel }) }
                                        <Hint inline popup>
                                            { t("customerDataService:sharing.options.allHint") }
                                        </Hint>
                                    </>
                                ) }
                                control={ <Radio /> }
                                disabled={ isReadOnly }
                                data-componentid={ `${ componentId }-mode-all` }
                            />
                            <FormControlLabel
                                value={ PolicyFormMode.SELECTED }
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
                                disabled={ isReadOnly }
                                data-componentid={ `${ componentId }-mode-selected` }
                            />
                            { mode === PolicyFormMode.SELECTED && (
                                <Grid xs={ 12 } sx={ { ml: 4 } }>
                                    <OrganizationSelection
                                        selected={ selected }
                                        onChange={ setSelected }
                                        readOnly={ isReadOnly }
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
                    <Grid xs={ 12 } sx={ { mt: 2 } }>
                        <Alert severity="error" data-componentid={ `${ componentId }-problem` }>
                            { problem }
                        </Alert>
                    </Grid>
                ) }
                { !isReadOnly && (
                    <Grid xs={ 8 }>
                        <OxygenButton
                            sx={ { mt: 4 } }
                            variant="contained"
                            size="small"
                            disabled={ isSaving || (mode === PolicyFormMode.NONE && !hasPolicy) }
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
                    setMode(PolicyFormMode.SELECTED);
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
