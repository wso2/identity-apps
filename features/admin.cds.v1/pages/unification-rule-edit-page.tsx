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
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Chip from "@oxygen-ui/react/Chip";
import { useRequiredScopes } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertLevels, HttpErrorResponseDataInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    CheckboxFieldAdapter,
    FinalForm,
    FinalFormField,
    FormRenderProps,
    TextFieldAdapter
} from "@wso2is/forms";
import {
    AnimatedAvatar,
    ConfirmationModal,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment,
    ResourceTab,
    ResourceTabPaneInterface,
    TabPageLayout,
    useConfirmationModalAlert
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { deleteUnificationRule, updateUnificationRule } from "../api/unification-rules";
import ShareSettings from "../components/share-settings";
import SharedChip from "../components/shared-chip";
import { OrganizationManagementScopes } from "../constants/organization-management-constants";
import useIsOrganizationManagementEnabled from "../hooks/use-is-organization-management-enabled";
import useIsSubOrganization from "../hooks/use-is-sub-organization";
import { useUnificationRule } from "../hooks/use-unification-rules";
import { ResourceOrigin, ShareableResourceType } from "../models/organization-management";
import { UnificationRuleModel, UpdateUnificationRulePayload } from "../models/unification-rules";
import { DEFAULT_PROPERTY_SCOPE, getPropertyScope, getPropertySuffix } from "../utils/profile-attribute-utils";

interface RouteParamsInterface {
    id: string;
}

interface RuleFormValuesInterface {
    rule_name: string;
    is_active: boolean;
    property_name_display: string;
    priority_display: string;
}

type UnificationRuleEditPagePropsInterface = RouteComponentProps<RouteParamsInterface> & IdentifiableComponentInterface;

const UnificationRuleEditPage: FunctionComponent<UnificationRuleEditPagePropsInterface> = ({
    match,
    ["data-componentid"]: componentId = "cds-unification-rule-edit-page"
}: UnificationRuleEditPagePropsInterface): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const id: string = match.params.id;

    const { data: rule, isLoading, error, mutate } = useUnificationRule<UnificationRuleModel>(id);

    const [ isUpdating, setIsUpdating ] = useState<boolean>(false);
    const [ isDeleting, setIsDeleting ] = useState<boolean>(false);
    const [ showDeleteModal, setShowDeleteModal ] = useState<boolean>(false);
    const [ activeTabIndex, setActiveTabIndex ] = useState<number>(0);
    const [ _modalAlert, setModalAlert, modalAlertComponent ] = useConfirmationModalAlert();

    // Organization management: a rule that an ancestor organization shares is read-only here.
    const isShared: boolean = rule?.origin === ResourceOrigin.SHARED;
    const isSubOrganization: boolean = useIsSubOrganization();
    const isReadOnly: boolean = isShared || isSubOrganization;
    // Organization management: the owner organization shares the rule with its child organizations.
    const isOrganizationManagementEnabled: boolean = useIsOrganizationManagementEnabled();
    const hasShareViewScope: boolean = useRequiredScopes([ OrganizationManagementScopes.UNIFICATION_RULE_SHARE_VIEW ]);
    const canShare: boolean = Boolean(rule) && !isShared && !isSubOrganization && isOrganizationManagementEnabled
        && hasShareViewScope;

    useEffect((): void => {
        if (!error) return;

        dispatch(addAlert({
            description: t("customerDataService:unificationRules.edit.notifications.fetchRule.error.description"),
            level: AlertLevels.ERROR,
            message: t("customerDataService:unificationRules.edit.notifications.fetchRule.error.message")
        }));
    }, [ error ]);

    const handleTabChange = (_: SyntheticEvent, data: { activeIndex?: number | string }): void => {
        setActiveTabIndex(data.activeIndex as number);
        setModalAlert(null);
    };

    const validateForm = (values: RuleFormValuesInterface): Partial<Record<keyof RuleFormValuesInterface, string>> => {
        if (isReadOnly || values.rule_name?.trim()) {
            return {};
        }

        return {
            rule_name: t("customerDataService:unificationRules.create.fields.ruleName.errors.required")
        };
    };

    const handleUpdate = (values: RuleFormValuesInterface): void => {
        const payload: UpdateUnificationRulePayload = {
            is_active: Boolean(values.is_active),
            rule_name: values.rule_name?.trim()
        };

        setIsUpdating(true);

        updateUnificationRule(id, payload)
            .then((): void => {
                dispatch(addAlert({
                    description: t("customerDataService:unificationRules.edit.notifications" +
                        ".updateRule.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("customerDataService:unificationRules.edit.notifications.updateRule.success.message")
                }));
                mutate();
            })
            .catch((err: AxiosError<HttpErrorResponseDataInterface>): void => {
                dispatch(addAlert({
                    description: err?.response?.data?.description
                        || t("customerDataService:unificationRules.edit.notifications" +
                            ".updateRule.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("customerDataService:unificationRules.edit.notifications.updateRule.error.message")
                }));
            })
            .finally((): void => setIsUpdating(false));
    };

    const handleDelete = async (): Promise<void> => {
        setIsDeleting(true);

        try {
            await deleteUnificationRule(id);

            dispatch(addAlert({
                description: t("customerDataService:unificationRules.common.notifications.deleted.description"),
                level: AlertLevels.SUCCESS,
                message: t("customerDataService:unificationRules.common.notifications.deleted.message")
            }));

            history.push(AppConstants.getPaths().get("UNIFICATION_RULES"));
        } catch (err: unknown) {
            const axiosErr: AxiosError<HttpErrorResponseDataInterface> =
                err as AxiosError<HttpErrorResponseDataInterface>;

            setModalAlert({
                description: axiosErr?.response?.data?.description
                    ?? t("customerDataService:unificationRules.common.notifications.deletionFailed.description"),
                level: AlertLevels.ERROR,
                message: t("customerDataService:unificationRules.common.notifications.deletionFailed.message")
            });
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const renderGeneralTab = (): ReactElement | null => {
        if (!rule) return null;

        return (
            <>
                <EmphasizedSegment padded="very">
                    <FinalForm
                        key={ `${rule.rule_id}-${rule.rule_name}-${rule.is_active}` }
                        onSubmit={ handleUpdate }
                        validate={ validateForm }
                        initialValues={ {
                            is_active: rule.is_active,
                            priority_display: String(rule.priority),
                            property_name_display: getPropertySuffix(rule.property_name),
                            rule_name: rule.rule_name
                        } }
                        render={ ({ handleSubmit }: FormRenderProps) => (
                            <form onSubmit={ handleSubmit }>
                                <Box sx={ { display: "flex", flexDirection: "column", gap: 2 } }>
                                    { isShared && (
                                        <Alert severity="info" data-componentid={ `${componentId}-shared-notice` }>
                                            { t("customerDataService:sharing.sharedNotice.ruleOwner",
                                                { org: rule.owner_org_handle }) }
                                        </Alert>
                                    ) }
                                    <FinalFormField
                                        ariaLabel="Rule name"
                                        name="rule_name"
                                        label={ t("customerDataService:unificationRules.edit.fields.ruleName.label") }
                                        placeholder={ t("customerDataService:unificationRules.create.fields" +
                                            ".ruleName.placeholder") }
                                        helperText={
                                            t("customerDataService:unificationRules.edit.fields.ruleName.hint") }
                                        required={ !isReadOnly }
                                        readOnly={ isReadOnly }
                                        maxLength={ 255 }
                                        component={ TextFieldAdapter }
                                        data-componentid={ `${componentId}-rule-name-input` }
                                    />
                                    <FinalFormField
                                        ariaLabel="Attribute"
                                        name="property_name_display"
                                        label={ t("customerDataService:unificationRules.edit.fields.attribute.label") }
                                        helperText={
                                            t("customerDataService:unificationRules.edit.fields.attribute.hint") }
                                        readOnly
                                        component={ TextFieldAdapter }
                                        data-componentid={ `${componentId}-attribute-input` }
                                    />
                                    <FinalFormField
                                        ariaLabel="Priority"
                                        name="priority_display"
                                        label={ t("customerDataService:unificationRules.edit.fields.priority.label") }
                                        helperText={
                                            t("customerDataService:unificationRules.edit.fields.priority.hint") }
                                        readOnly
                                        component={ TextFieldAdapter }
                                        data-componentid={ `${componentId}-priority-input` }
                                    />
                                    <FinalFormField
                                        ariaLabel="Enabled"
                                        name="is_active"
                                        label={ t("customerDataService:unificationRules.edit.fields.isActive.label") }
                                        hint={ t("customerDataService:unificationRules.edit.fields.isActive.hint") }
                                        disabled={ isReadOnly }
                                        component={ CheckboxFieldAdapter }
                                        data-componentid={ `${componentId}-is-active-checkbox` }
                                    />
                                    { !isReadOnly && (
                                        <Box>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                size="small"
                                                disabled={ isUpdating }
                                                data-componentid={ `${componentId}-update-button` }
                                            >
                                                { t("common:update") }
                                            </Button>
                                        </Box>
                                    ) }
                                </Box>
                            </form>
                        ) }
                    />
                </EmphasizedSegment>

                { !isReadOnly && (
                    <DangerZoneGroup sectionHeader={ t("customerDataService:common.dangerZone.header") }>
                        <DangerZone
                            actionTitle={ t("customerDataService:unificationRules.edit.dangerZone.delete.actionTitle") }
                            header={ t("customerDataService:unificationRules.edit.dangerZone.delete.header") }
                            subheader={ t("customerDataService:unificationRules.edit.dangerZone.delete.subheader") }
                            onActionClick={ () => {
                                setModalAlert(null);
                                setShowDeleteModal(true);
                            } }
                            isButtonDisabled={ isDeleting }
                            data-componentid={ `${componentId}-danger-zone-delete` }
                        />
                    </DangerZoneGroup>
                ) }
            </>
        );
    };

    const renderSharingTab = (): ReactElement | null => {
        if (!rule) return null;

        return (
            <EmphasizedSegment padded="very">
                <ShareSettings
                    resource={ { id: rule.rule_id, type: ShareableResourceType.RULE } }
                    data-componentid={ `${componentId}-share-settings` }
                />
            </EmphasizedSegment>
        );
    };

    const panes: ResourceTabPaneInterface[] = [
        {
            componentId: "general",
            menuItem: t("customerDataService:unificationRules.edit.tabs.general"),
            render: renderGeneralTab
        },
        ...(canShare
            ? [ {
                componentId: "sharing",
                menuItem: t("customerDataService:sharing.tab"),
                render: renderSharingTab
            } ]
            : [])
    ];

    const scope: string = getPropertyScope(rule?.property_name);

    return (
        <>
            <TabPageLayout
                isLoading={ isLoading }
                image={ <AnimatedAvatar name={ rule?.rule_name ?? "" } size="tiny" floated="left" /> }
                title={ (
                    <Box sx={ { alignItems: "center", display: "inline-flex", gap: 1 } }>
                        { rule?.rule_name ?? t("customerDataService:unificationRules.edit.page.pageTitle") }
                        { isShared && (
                            <SharedChip
                                ownerOrg={ rule.owner_org_handle }
                                data-componentid={ `${componentId}-shared-chip` }
                            />
                        ) }
                    </Box>
                ) }
                pageTitle={ t("customerDataService:unificationRules.edit.page.pageTitle") }
                description={ rule && scope !== DEFAULT_PROPERTY_SCOPE
                    ? <Chip size="small" label={ scope } data-componentid={ `${componentId}-scope-chip` } />
                    : null
                }
                backButton={ {
                    onClick: (): void => history.push(AppConstants.getPaths().get("UNIFICATION_RULES")),
                    text: t("customerDataService:unificationRules.edit.page.backButton")
                } }
                data-componentid={ componentId }
                titleTextAlign="left"
            >
                { modalAlertComponent }
                <ResourceTab
                    panes={ panes }
                    activeIndex={ Math.min(activeTabIndex, panes.length - 1) }
                    onTabChange={ handleTabChange }
                />
            </TabPageLayout>

            { !isReadOnly && rule && (
                <ConfirmationModal
                    data-componentid={ `${componentId}-delete-confirmation-modal` }
                    onClose={ () => {
                        setShowDeleteModal(false);
                        setModalAlert(null);
                    } }
                    type="negative"
                    open={ showDeleteModal }
                    assertionHint={ t("customerDataService:unificationRules.list.confirmations.delete.assertionHint") }
                    assertionType="checkbox"
                    primaryAction={ t("customerDataService:common.buttons.confirm") }
                    secondaryAction={ t("customerDataService:common.buttons.cancel") }
                    onSecondaryActionClick={ () => {
                        setShowDeleteModal(false);
                        setModalAlert(null);
                    } }
                    onPrimaryActionClick={ handleDelete }
                    closeOnDimmerClick={ false }
                    primaryActionLoading={ isDeleting }
                >
                    <ConfirmationModal.Header>
                        { t("customerDataService:unificationRules.list.confirmations.delete.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached negative>
                        { t("customerDataService:unificationRules.list.confirmations.delete.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        <Trans
                            i18nKey="customerDataService:unificationRules.list.confirmations.delete.content"
                            values={ { ruleName: rule.rule_name } }
                            components={ [ null, <strong key="0" /> ] }
                        />
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </>
    );
};

export default UnificationRuleEditPage;
