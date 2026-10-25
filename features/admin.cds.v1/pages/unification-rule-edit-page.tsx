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

import Box from "@oxygen-ui/react/Box";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertLevels, HttpErrorResponseDataInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/forms";
import {
    AnimatedAvatar,
    ConfirmationModal,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment,
    Hint,
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
import { Grid, Icon, Label, Message, TabProps } from "semantic-ui-react";
import { deleteUnificationRule, updateUnificationRule } from "../api/unification-rules";
import ShareSettings from "../components/share-settings";
import SharedChip from "../components/shared-chip";
import { useUnificationRule } from "../hooks/use-unification-rules";
import { UnificationRuleModel, UpdateUnificationRulePayload } from "../models/unification-rules";
import { useIsOrganizationManagementEnabled, useIsSubOrganization } from "../utils/organization-management-utils";
import { getPropertyScope } from "../utils/profile-attribute-utils";

const FORM_ID: string = "unification-rule-edit-form";

interface RouteParams {
    id: string;
}

interface RuleFormValues {
    rule_name: string;
    is_active: boolean;
}

const getPropertySuffix = (propertyName: string): string =>
    (propertyName ?? "").replace(/^(identity_attributes|application_data|traits)\./, "");

const UnificationRuleEditPage: FunctionComponent<RouteComponentProps<RouteParams>> = (
    props: RouteComponentProps<RouteParams>
): ReactElement => {

    const { match } = props;
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const componentId: string = "unification-rule-edit";
    const id: string = match.params.id;

    const { data: rule, isLoading, error, mutate } = useUnificationRule<UnificationRuleModel>(id);

    const [ isUpdating, setIsUpdating ] = useState<boolean>(false);
    const [ isDeleting, setIsDeleting ] = useState<boolean>(false);
    const [ showDeleteModal, setShowDeleteModal ] = useState<boolean>(false);
    const [ activeTabIndex, setActiveTabIndex ] = useState<number>(0);
    const [ _modalAlert, setModalAlert, modalAlertComponent ] = useConfirmationModalAlert();

    // Organization management: a rule that an ancestor organization shares is read-only here.
    const isShared: boolean = rule?.origin === "SHARED";
    const isSubOrganization: boolean = useIsSubOrganization();
    const isReadOnly: boolean = isShared || isSubOrganization;
    // Organization management: the owner organization shares the rule with its child organizations.
    const isOrganizationManagementEnabled: boolean = useIsOrganizationManagementEnabled();
    const canShare: boolean = Boolean(rule) && !isShared && !isSubOrganization && isOrganizationManagementEnabled;

    useEffect((): void => {
        if (!error) return;

        dispatch(addAlert({
            description: t("customerDataService:unificationRules.edit.notifications.fetchRule.error.description"),
            level: AlertLevels.ERROR,
            message: t("customerDataService:unificationRules.edit.notifications.fetchRule.error.message")
        }));
    }, [ error ]);

    const handleTabChange = (_: SyntheticEvent, data: TabProps): void => {
        setActiveTabIndex(data.activeIndex as number);
        setModalAlert(null);
    };

    const handleUpdate = (values: RuleFormValues): void => {
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

    const renderNotice = (content: string, noticeId: string): ReactElement => (
        <Grid.Row columns={ 1 }>
            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                <Message
                    className="display-flex"
                    size="small"
                    info
                    data-componentid={ `${componentId}-${noticeId}` }
                >
                    <Icon name="share alternate" />
                    <Message.Content className="tiny">{ content }</Message.Content>
                </Message>
            </Grid.Column>
        </Grid.Row>
    );

    const renderGeneralTab = (): ReactElement | null => {
        if (!rule) return null;

        return (
            <>
                <EmphasizedSegment padded="very">
                    <Form
                        id={ FORM_ID }
                        key={ `${rule.rule_id}-${rule.rule_name}-${rule.is_active}` }
                        uncontrolledForm={ true }
                        onSubmit={ (values: RuleFormValues) => handleUpdate(values) }
                        initialValues={ {
                            is_active: rule.is_active,
                            rule_name: rule.rule_name
                        } }
                    >
                        <Grid>
                            { isShared && renderNotice(
                                t("customerDataService:sharing.sharedNotice.ruleOwner",
                                    { org: rule.owner_org_handle }),
                                "shared-notice"
                            ) }

                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <Field.Input
                                        ariaLabel="Rule name"
                                        inputType="default"
                                        name="rule_name"
                                        label={ t("customerDataService:unificationRules.edit.fields.ruleName.label") }
                                        placeholder={ t("customerDataService:unificationRules.create.fields" +
                                            ".ruleName.placeholder") }
                                        required={ !isReadOnly }
                                        requiredErrorMessage={ t("customerDataService:unificationRules.create" +
                                            ".fields.ruleName.errors.required") }
                                        readOnly={ isReadOnly }
                                        maxLength={ 255 }
                                        minLength={ 1 }
                                        data-componentid={ `${componentId}-rule-name-input` }
                                        width={ 16 }
                                    />
                                    <Hint>
                                        { t("customerDataService:unificationRules.edit.fields.ruleName.hint") }
                                    </Hint>
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <Field.Input
                                        ariaLabel="Attribute"
                                        inputType="default"
                                        name="property_name_display"
                                        label={ t("customerDataService:unificationRules.edit.fields.attribute.label") }
                                        value={ getPropertySuffix(rule.property_name) }
                                        readOnly
                                        maxLength={ 255 }
                                        minLength={ 1 }
                                        data-componentid={ `${componentId}-attribute-input` }
                                        width={ 16 }
                                    />
                                    <Hint>
                                        { t("customerDataService:unificationRules.edit.fields.attribute.hint") }
                                    </Hint>
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <Field.Input
                                        ariaLabel="Priority"
                                        inputType="default"
                                        name="priority_display"
                                        label={ t("customerDataService:unificationRules.edit.fields.priority.label") }
                                        value={ String(rule.priority) }
                                        readOnly
                                        maxLength={ 10 }
                                        minLength={ 1 }
                                        data-componentid={ `${componentId}-priority-input` }
                                        width={ 16 }
                                    />
                                    <Hint>
                                        { t("customerDataService:unificationRules.edit.fields.priority.hint") }
                                    </Hint>
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <Field.Checkbox
                                        ariaLabel="Enabled"
                                        name="is_active"
                                        label={ t("customerDataService:unificationRules.edit.fields.isActive.label") }
                                        readOnly={ isReadOnly }
                                        disabled={ isReadOnly }
                                        data-componentid={ `${componentId}-is-active-checkbox` }
                                        width={ 16 }
                                    />
                                    <Hint>
                                        { t("customerDataService:unificationRules.edit.fields.isActive.hint") }
                                    </Hint>
                                </Grid.Column>
                            </Grid.Row>

                            { !isReadOnly && (
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                        <Field.Button
                                            form={ FORM_ID }
                                            size="small"
                                            buttonType="primary_btn"
                                            ariaLabel="Update button"
                                            name="update-button"
                                            label={ t("common:update") }
                                            loading={ isUpdating }
                                            disabled={ isUpdating }
                                            data-componentid={ `${componentId}-update-button` }
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            ) }
                        </Grid>
                    </Form>
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
                    resource={ { id: rule.rule_id, type: "rule" } }
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
                description={ rule && scope !== "Default"
                    ? (
                        <div className="with-label ellipsis">
                            <Label size="small">{ scope }</Label>
                        </div>
                    )
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
