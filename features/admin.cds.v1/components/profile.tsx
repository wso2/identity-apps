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

import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import {
    AlertInterface,
    AlertLevels,
    IdentifiableComponentInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
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
import React, {
    FunctionComponent,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { Divider, Form, Image, TabProps, Table } from "semantic-ui-react";
import { deleteCDSProfile, fetchCDSProfileDetails } from "../api/profiles";
import type { ProfileModel } from "../models/profiles";

/**
 * i18n (keep these keys aligned with your CDS i18n namespace).
 * Replace the path with your actual hook if different.
 */

type Props =
    IdentifiableComponentInterface &
    TestableComponentInterface &
    RouteComponentProps<{ id: string }>;

const ProfileDetailsPage: FunctionComponent<Props> = (props: Props): ReactElement => {

    const {
        match,
        history,
        [ "data-testid" ]: testId = "cds-profile-details",
        [ "data-componentid" ]: componentId = "cds-profile-details"
    } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch<any> = useDispatch();
    const profileId: string = match?.params?.id;

    const [ profile, setProfile ] = useState<ProfileModel | null>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ activeTabIndex, setActiveTabIndex ] = useState<number>(0);

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ isDeleting, setIsDeleting ] = useState<boolean>(false);

    const [ isProfileDataViewOpen, setIsProfileDataViewOpen ] = useState<boolean>(false);

    const [ modalAlert, setModalAlert, modalAlertComponent ] = useConfirmationModalAlert();

    const handleAlerts = (alert: AlertInterface): void => {
        dispatch(addAlert(alert));
    };

    const getErrorMessage = (error: any, fallback: string): string => {
        const description =
            error?.response?.data?.description
            || error?.response?.data?.detail
            || error?.response?.data?.message;

        if (description) {
            return String(description);
        }

        const firstError = error?.response?.data?.errors?.[0]?.description;

        if (firstError) {
            return String(firstError);
        }

        return fallback;
    };

    const fetchProfile = async (): Promise<void> => {
        setIsLoading(true);

        try {
            const data: ProfileModel = await fetchCDSProfileDetails(profileId);

            setProfile(data ?? null);
        } catch (error: any) {
            setProfile(null);

            handleAlerts({
                description: getErrorMessage(error, t("customerDataService:profiles.details.notifications." +
                    "fetchProfile.error.description")),
                level: AlertLevels.ERROR,
                message: t("customerDataService:common.notifications.error")
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (profileId) {
            fetchProfile();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ profileId ]);

    const userId: string | null = useMemo(() => {
        if (profile?.user_id) {
            return String(profile.user_id);
        }

        const fromIdentity = profile?.identity_attributes?.["user_id"];

        return fromIdentity ? String(fromIdentity) : null;
    }, [ profile ]);

    const showDangerZone: boolean = useMemo(() => {
        return Boolean(profile) && !userId;
    }, [ profile, userId ]);

    const handleTabChange = (_: SyntheticEvent, data: TabProps): void => {
        setActiveTabIndex(data.activeIndex as number);
        setModalAlert(null);
    };

    const profileJsonString: string = useMemo(() => {
        return JSON.stringify(profile ?? {}, null, 2);
    }, [ profile ]);

    const copyProfileJson = (): void => {
        navigator.clipboard.writeText(profileJsonString);

        setModalAlert({
            description: t("customerDataService:profiles.details.profileData.copy.success.description"),
            level: AlertLevels.SUCCESS,
            message: t("customerDataService:profiles.details.profileData.copy.success.message")
        });
    };

    const exportProfileJson = (): void => {
        const blob: Blob = new Blob([ profileJsonString ], { type: "application/json;charset=utf-8" });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `profile_${profile?.profile_id ?? "data"}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);

        setModalAlert({
            description: t("customerDataService:profiles.details.profileData.export.success.description"),
            level: AlertLevels.SUCCESS,
            message: t("customerDataService:profiles.details.profileData.export.success.message")
        });
    };

    const renderField = (label: string, value?: string | null): ReactElement | null => {
        if (value === null || value === undefined || String(value).trim().length === 0) {
            return null;
        }

        return (
            <Form.Field>
                <label>{ label }</label>
                <Form.Input readOnly value={ String(value) } />
            </Form.Field>
        );
    };

    const renderProfileDataField = (): ReactElement | null => {
        if (!profile) {
            return null;
        }

        return (
            <Form.Field>
                <label>{ t("customerDataService:profiles.details.form.profileData.label") }</label>

                <div style={ { display: "flex", alignItems: "center", gap: 12 } }>
                    <a
                        role="button"
                        style={ { cursor: "pointer" } }
                        onClick={ (): void => {
                            setModalAlert(null);
                            setIsProfileDataViewOpen(true);
                        } }
                    >
                        { t("customerDataService:profiles.details.profileData.actions.view") }
                    </a>
                    <a role="button" style={ { cursor: "pointer" } } onClick={ copyProfileJson }>
                        { t("customerDataService:profiles.details.profileData.actions.copy") }
                    </a>
                    <a role="button" style={ { cursor: "pointer" } } onClick={ exportProfileJson }>
                        { t("customerDataService:profiles.details.profileData.actions.export") }
                    </a>
                </div>
            </Form.Field>
        );
    };

    const renderMergedTable = (): ReactElement => {
        const merged = profile?.merged_from ?? [];

        return (
            <Form.Field>
                <label>{ t("customerDataService:profiles.details.unifiedProfiles.title") }</label>

                { !merged.length ? (
                    <div style={ { opacity: 0.7 } }>
                        { t("customerDataService:profiles.details.unifiedProfiles.empty") }
                    </div>
                ) : (
                    <Table compact="very" basic="very" celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>
                                    { t("customerDataService:profiles.details.unifiedProfiles.columns.profileId") }
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    { t("customerDataService:profiles.details.unifiedProfiles.columns.reason") }
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            { merged.map((m) => (
                                <Table.Row key={ m.profile_id }>
                                    <Table.Cell>{ m.profile_id }</Table.Cell>
                                    <Table.Cell>{ m.reason ?? "-" }</Table.Cell>
                                </Table.Row>
                            )) }
                        </Table.Body>
                    </Table>
                ) }
            </Form.Field>
        );
    };

    const renderGeneralTab = (): ReactElement | null => {
        if (!profile) {
            return null;
        }

        return (
            <>
                <EmphasizedSegment padded="very">
                    <Form>
                        { renderField(t("customerDataService:profiles.details.form.profileId.label"), profile.profile_id) }
                        { renderField(t("customerDataService:profiles.details.form.userId.label"), userId) }
                        { renderField(
                            t("customerDataService:profiles.details.form.createdDate.label"),
                            profile.meta?.created_at ? profile.meta.created_at.split("T")[0] : null
                        ) }
                        { renderField(
                            t("customerDataService:profiles.details.form.updatedDate.label"),
                            profile.meta?.updated_at ? profile.meta.updated_at.split("T")[0] : null
                        ) }
                        { renderField(t("customerDataService:profiles.details.form.location.label"), profile.meta?.location ?? null) }

                        <Divider />

                        { renderProfileDataField() }
                    </Form>
                </EmphasizedSegment>

                { showDangerZone && (
                    <DangerZoneGroup sectionHeader={ t("customerDataService:common.dangerZone.header") }>
                        <DangerZone
                            actionTitle={ t("customerDataService:profiles.details.dangerZone.delete.actionTitle") }
                            header={ t("customerDataService:profiles.details.dangerZone.delete.header") }
                            subheader={ t("customerDataService:profiles.details.dangerZone.delete.subheader") }
                            onActionClick={ (): void => {
                                setModalAlert(null);
                                setShowDeleteConfirmationModal(true);
                            } }
                            isButtonDisabled={ isDeleting }
                        />
                    </DangerZoneGroup>
                ) }
            </>
        );
    };

    const renderUnifiedProfilesTab = (): ReactElement | null => {
        if (!profile) {
            return null;
        }

        return (
            <EmphasizedSegment padded="very">
                <Form>
                    { renderMergedTable() }
                </Form>
            </EmphasizedSegment>
        );
    };

    const panes: ResourceTabPaneInterface[] = [
        { componentId: "general", menuItem: t("customerDataService:profiles.details.tabs.general"), render: renderGeneralTab },
        { componentId: "unified-profiles", menuItem: t("customerDataService:profiles.details.tabs.unifiedProfiles"), render: renderUnifiedProfilesTab }
    ];

    const handleProfileDelete = (): void => {
        if (userId) {
            setModalAlert({
                description: t("customerDataService:profiles.details.notifications.deleteProfile.notAllowed.description"),
                level: AlertLevels.WARNING,
                message: t("customerDataService:common.notifications.notAllowed")
            });

            return;
        }

        setIsDeleting(true);

        deleteCDSProfile(profileId)
            .then(() => {
                handleAlerts({
                    description: t("customerDataService:profiles.details.notifications.deleteProfile.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("customerDataService:profiles.details.notifications.deleteProfile.success.message")
                });

                history.push(AppConstants.getPaths().get("PROFILES"));
            })
            .catch((error: any) => {
                setModalAlert({
                    description: getErrorMessage(error, t("customerDataService:profiles.details.notifications.deleteProfile.error.description")),
                    level: AlertLevels.ERROR,
                    message: t("customerDataService:common.notifications.error")
                });
            })
            .finally(() => {
                setIsDeleting(false);
            });
    };

    return (
        <TabPageLayout
            isLoading={ isLoading }
            image={ (
                <Image floated="left" size="tiny" rounded>
                    <AnimatedAvatar />
                    <span className="claims-letter">
                        { profile?.profile_id?.charAt(0)?.toUpperCase() }
                    </span>
                </Image>
            ) }
            title={ profile?.profile_id || t("customerDataService:profiles.details.page.fallbackTitle") }
            pageTitle={ t("customerDataService:profiles.details.page.pageTitle") }
            description={
                userId
                    ? t("customerDataService:profiles.details.page.descriptionLinkedUser", { userId })
                    : t("customerDataService:profiles.details.page.description")
            }
            backButton={ {
                onClick: () => history.push(AppConstants.getPaths().get("PROFILES")),
                text: t("customerDataService:profiles.details.page.backButton")
            } }
            data-testid={ testId }
            data-componentid={ componentId }
        >
            <ResourceTab
                panes={ panes }
                activeIndex={ activeTabIndex }
                onTabChange={ handleTabChange }
            />

            {/* Profile Data Viewer Modal */}
            { profile && (
                <ConfirmationModal
                    data-componentid={ `${componentId}-profile-data-viewer-modal` }
                    open={ isProfileDataViewOpen }
                    onClose={ (): void => {
                        setIsProfileDataViewOpen(false);
                        setModalAlert(null);
                    } }
                    type="info"
                    primaryAction={ t("customerDataService:common.buttons.close") }
                    secondaryAction={ t("customerDataService:profiles.details.profileData.actions.export") }
                    onPrimaryActionClick={ (): void => {
                        setIsProfileDataViewOpen(false);
                        setModalAlert(null);
                    } }
                    onSecondaryActionClick={ exportProfileJson }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header>
                        { t("customerDataService:profiles.details.profileData.modal.title") }
                    </ConfirmationModal.Header>

                    <ConfirmationModal.Content>
                        <div className="modal-alert-wrapper">{ modalAlert && modalAlertComponent }</div>

                        <div style={ { display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 10 } }>
                            <button
                                type="button"
                                className="ui button basic mini"
                                onClick={ copyProfileJson }
                            >
                                { t("customerDataService:profiles.details.profileData.actions.copy") }
                            </button>

                            <button
                                type="button"
                                className="ui button primary mini"
                                onClick={ exportProfileJson }
                            >
                                { t("customerDataService:profiles.details.profileData.actions.export") }
                            </button>
                        </div>

                        <div
                            className="form-container with-max-width"
                            style={ {
                                borderRadius: 8,
                                border: "1px solid var(--oxygen-palette-divider, #e0e1e2)"
                            } }
                        >
                            <pre
                                data-testid={ `${testId}-profile-json-modal` }
                                style={ {
                                    margin: 0,
                                    padding: "1rem",
                                    overflow: "auto",
                                    maxHeight: 520,
                                    fontSize: 12
                                } }
                            >
                                { profileJsonString }
                            </pre>
                        </div>
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }

            {/* Delete modal - only mount when danger zone is relevant */}
            { showDangerZone && (
                <ConfirmationModal
                    data-componentid={ `${componentId}-confirmation-modal` }
                    onClose={ (): void => {
                        setShowDeleteConfirmationModal(false);
                        setModalAlert(null);
                    } }
                    type="negative"
                    open={ showDeleteConfirmationModal }
                    assertionHint={ t("customerDataService:profiles.details.confirmations.deleteProfile.assertionHint") }
                    assertionType="checkbox"
                    primaryAction={ t("customerDataService:common.buttons.confirm") }
                    secondaryAction={ t("customerDataService:common.buttons.cancel") }
                    onSecondaryActionClick={ (): void => {
                        setShowDeleteConfirmationModal(false);
                        setModalAlert(null);
                    } }
                    onPrimaryActionClick={ handleProfileDelete }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header data-componentid={ `${componentId}-confirmation-modal-header` }>
                        { t("customerDataService:profiles.details.confirmations.deleteProfile.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        data-componentid={ `${componentId}-confirmation-modal-message` }
                        attached
                        negative
                    >
                        { t("customerDataService:profiles.details.confirmations.deleteProfile.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        <div className="modal-alert-wrapper">{ modalAlert && modalAlertComponent }</div>

                        <div style={ { display: "grid", gap: 8 } }>
                            <div>
                                <strong>{ t("customerDataService:profiles.details.confirmations.deleteProfile.profileIdLabel") }</strong>
                                { " " }
                                { profile?.profile_id }
                            </div>
                        </div>
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </TabPageLayout>
    );
};

export default ProfileDetailsPage;
