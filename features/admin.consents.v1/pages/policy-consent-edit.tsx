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

import { useRequiredScopes } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { deletePurpose, useGetPurpose } from "@wso2is/common.consents.v1";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    ConfirmationModal,
    DangerZone,
    DangerZoneGroup,
    PageLayout
} from "@wso2is/react-components";
import Tab from "@oxygen-ui/react/Tab";
import TabPanel from "@oxygen-ui/react/TabPanel";
import Tabs from "@oxygen-ui/react/Tabs";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { Label } from "semantic-ui-react";
import { EditPolicyConsent } from "../components/edit-policy-consent";
import { PolicyConsentApplications } from "../components/policy-consent-applications";
import { DEFAULT_POLICY_PATH_MAP } from "../constants/default-policies";

/**
 * Props interface for the Policy Consent edit page component.
 */
interface PolicyConsentEditPageProps extends IdentifiableComponentInterface, RouteComponentProps<{ id: string }> { }

/**
 * Policy Consent edit page.
 *
 * @param props - Props injected to the component.
 * @returns Policy Consent edit page component.
 */
const PolicyConsentEditPage: FunctionComponent<PolicyConsentEditPageProps> = (
    props: PolicyConsentEditPageProps
): ReactElement => {
    const {
        match,
        ["data-componentid"]: componentId = "policy-consent-edit-page"
    } = props;

    const id: string = match?.params?.id;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const consentsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.consents
    );
    const currentTenantDomain: string = useSelector((state: AppState) => state?.auth?.tenantDomain);
    const hasDeletePermission: boolean = useRequiredScopes(consentsFeatureConfig?.scopes?.delete);

    // Check if the route param is a known default policy slug (not a UUID).
    const defaultPolicyName: string | null = DEFAULT_POLICY_PATH_MAP[id] ?? null;
    const isDefaultPolicy: boolean = defaultPolicyName !== null;

    const [ showDeleteConfirmation, setShowDeleteConfirmation ] = useState<boolean>(false);
    const [ isDeleting, setIsDeleting ] = useState<boolean>(false);
    const [ activeTab, setActiveTab ] = useState<number>(0);

    const handleTabChange = (_: SyntheticEvent, newValue: number): void => {
        setActiveTab(newValue);
    };

    // Only fetch from the API when the id is a real UUID, not a default-policy slug.
    const { data: consent, isLoading: isConsentLoading } = useGetPurpose(isDefaultPolicy ? "" : id);

    const isCrossTenant: boolean = !!consent?.tenantDomain && consent.tenantDomain !== currentTenantDomain;

    const handleBackButtonClick = (): void => {
        window.history.back();
    };

    const handleDeleteConsent = (): void => {
        if (!consent?.id) {
            return;
        }

        setIsDeleting(true);

        deletePurpose(consent.id)
            .then((): void => {
                dispatch(addAlert({
                    description: t("consents:policyConsents.notifications.delete.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("consents:policyConsents.notifications.delete.success.message")
                }));
                history.replace(AppConstants.getPaths().get("POLICY_CONSENTS"));
            })
            .catch((error: IdentityAppsApiException): void => {
                const status: number = error?.response?.status;
                let description: string;
                let message: string;

                switch (status) {
                    case 404:
                        description = t("consents:policyConsents.notifications.delete.error.notFound.description");
                        message = t("consents:policyConsents.notifications.delete.error.notFound.message");

                        break;
                    case 409:
                        description = t("consents:policyConsents.notifications.delete.error.conflict.description");
                        message = t("consents:policyConsents.notifications.delete.error.conflict.message");

                        break;
                    default:
                        if (status >= 500) {
                            description = t(
                                "consents:policyConsents.notifications.delete.error.serverError.description"
                            );
                            message = t("consents:policyConsents.notifications.delete.error.serverError.message");
                        } else {
                            description = t("consents:policyConsents.notifications.delete.error.description");
                            message = t("consents:policyConsents.notifications.delete.error.message");
                        }
                }

                dispatch(addAlert({
                    description,
                    level: AlertLevels.ERROR,
                    message
                }));
            })
            .finally((): void => {
                setIsDeleting(false);
                setShowDeleteConfirmation(false);
            });
    };

    const pageTitle: string = isDefaultPolicy
        ? defaultPolicyName
        : (consent?.displayName || "");

    const descriptionLabel: ReactElement | undefined = (() => {
        if (isCrossTenant) {
            return (
                <Label size="mini" className=" ml-0" style={ { fontSize: "11px" } }>
                    { t("consents:policyConsents.list.labels.sharedPolicy") }
                </Label>
            );
        }
        if (isDefaultPolicy) {
            return (
                <Label size="mini" className=" ml-0" style={ { fontSize: "11px" } }>
                    { t("consents:policyConsents.list.labels.defaultPolicy") }
                </Label>
            );
        }

        return undefined;
    })();

    return (
        <PageLayout
            pageTitle={ t("consents:policyConsents.pages.edit.title") }
            title={ pageTitle }
            description={ descriptionLabel }
            image={ (
                <AnimatedAvatar
                    name={ pageTitle }
                    size="tiny"
                    floated="left"
                />
            ) }
            loadingStateOptions={ {
                count: 5,
                imageType: "square"
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            data-componentid={ `${componentId}-layout` }
            isLoading={ isConsentLoading }
            backButton={ {
                "data-componentid": `${componentId}-page-back-button`,
                onClick: handleBackButtonClick,
                text: t("consents:policyConsents.pages.edit.backButton")
            } }
        >
            { (isDefaultPolicy || consent) && (
                <>
                    <Tabs value={ activeTab } onChange={ handleTabChange }>
                        <Tab label={ t("consents:tabs.general.label") } />
                        { !isDefaultPolicy && (
                            <Tab label={ t("consents:tabs.applications.label") } />
                        ) }
                    </Tabs>
                    <TabPanel value={ activeTab } index={ 0 }>
                        <EditPolicyConsent
                            purposeId={ isDefaultPolicy ? undefined : consent?.id }
                            readOnly={ isCrossTenant }
                            isDefault={ isDefaultPolicy }
                            defaultName={ isDefaultPolicy ? defaultPolicyName : undefined }
                        />
                        { hasDeletePermission && !isCrossTenant && !isDefaultPolicy && (
                            <DangerZoneGroup
                                sectionHeader={ t("common:dangerZone") }
                            >
                                <DangerZone
                                    actionTitle={ t("consents:policyConsents.pages.edit.dangerZone.actionTitle") }
                                    header={ t("consents:policyConsents.pages.edit.dangerZone.header") }
                                    subheader={ t("consents:policyConsents.pages.edit.dangerZone.subheader") }
                                    onActionClick={ () => setShowDeleteConfirmation(true) }
                                />
                            </DangerZoneGroup>
                        ) }
                    </TabPanel>
                    { !isDefaultPolicy && (
                        <TabPanel value={ activeTab } index={ 1 }>
                            <PolicyConsentApplications
                                purposeId={ consent?.id }
                                data-componentid={ `${componentId}-prompt-scope` }
                            />
                        </TabPanel>
                    ) }
                    <ConfirmationModal
                        onClose={ () => setShowDeleteConfirmation(false) }
                        type="negative"
                        open={ showDeleteConfirmation }
                        assertionHint={ t("consents:policyConsents.pages.deleteConfirmation.assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("consents:policyConsents.pages.deleteConfirmation.primaryAction") }
                        secondaryAction={ t("consents:policyConsents.pages.deleteConfirmation.secondaryAction") }
                        onSecondaryActionClick={ () => setShowDeleteConfirmation(false) }
                        onPrimaryActionClick={ () => handleDeleteConsent() }
                        data-componentid={ `${componentId}-delete-confirmation-modal` }
                        closeOnDimmerClick={ false }
                        primaryActionLoading={ isDeleting }
                    >
                        <ConfirmationModal.Header
                            data-componentid={ `${componentId}-delete-confirmation-modal-header` }
                        >
                            { t("consents:policyConsents.pages.deleteConfirmation.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            negative
                            data-componentid={ `${componentId}-delete-confirmation-modal-message` }
                        >
                            { t("consents:policyConsents.pages.deleteConfirmation.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content
                            data-componentid={ `${componentId}-delete-confirmation-modal-content` }
                        >
                            { t("consents:policyConsents.pages.deleteConfirmation.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                </>
            ) }
        </PageLayout>
    );
};

export default PolicyConsentEditPage;
