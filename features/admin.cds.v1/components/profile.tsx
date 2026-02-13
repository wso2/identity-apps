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
    UserAvatar,
    ConfirmationModal,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment,
    Heading,
    Hint,
    Popup,
    ResourceTab,
    ResourceTabPaneInterface,
    TabPageLayout,
    useConfirmationModalAlert
} from "@wso2is/react-components";
import Button from "@oxygen-ui/react/Button";
import React, {
    FunctionComponent,
    ReactElement,
    LazyExoticComponent,
    lazy,
    SyntheticEvent,
    Suspense,
    useEffect,
    useMemo,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { Divider, Form, Grid, Image, TabProps, Table } from "semantic-ui-react";
import { deleteCDSProfile, fetchCDSProfileDetails } from "../api/profiles";
import type { ProfileModel } from "../models/profiles";
import { CopyIcon, DownloadIcon, EyeIcon, XMarkIcon } from "@oxygen-ui/react-icons";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import IconButton from "@oxygen-ui/react/IconButton";
import Modal from "@mui/material/Modal";
import Box from "@oxygen-ui/react/Box";
import Toolbar from "@oxygen-ui/react/Toolbar";
import Typography from "@oxygen-ui/react/Typography";
import { DynamicField } from "@wso2is/forms";
import { Property } from "@wso2is/core/models";


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

        const firstError:any = error?.response?.data?.errors?.[0]?.description;

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

     // Lazy load Monaco Editor
     const MonacoEditor: LazyExoticComponent<any> = lazy(() =>
        import("@monaco-editor/react" /* webpackChunkName: "MDMonacoEditor" */)
    );

    useEffect(() => {
        if (profileId) {
            fetchProfile();
        }
    }, [ profileId ]);

    const userId: string | null = useMemo(() => {
        if (profile?.user_id) {
            return String(profile.user_id);
        }

        const fromIdentity:any = profile?.identity_attributes?.["user_id"];

        return fromIdentity ? String(fromIdentity) : null;
    }, [ profile ]);

    const showDangerZone: boolean = useMemo(() => {
        return Boolean(profile) && !userId;
    }, [ profile, userId ]);

    const firstName: string = useMemo(() => {
        const v: any =
            (profile?.identity_attributes as any)?.givenname

        return v ? String(v).trim() : "";
    }, [ profile ]);

    const lastName: string = useMemo(() => {
        const v: any =
            (profile?.identity_attributes as any)?.lastname

        return v ? String(v).trim() : "";
    }, [ profile ]);

    const displayName: string = useMemo(() => {
        return `${firstName} ${lastName}`.trim();
    }, [ firstName, lastName ]);


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
        const url:string = window.URL.createObjectURL(blob);

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
            <>
                <Divider hidden />
                <Heading as="h5">
                    { t("customerDataService:profiles.details.form.profileData.label") }
                </Heading>
                <p>
                    { t("customerDataService:profiles.details.sections.profileData.description") }
                </p>
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                    <Button
                        size="small"
                        onClick={ (): void => {
                            setModalAlert(null);
                            setIsProfileDataViewOpen(true);
                        } }
                        data-componentid={ `${componentId}-profile-data-view-button` }
                        startIcon={ <EyeIcon /> }
                    >
                        { t("customerDataService:profiles.details.profileData.actions.view") }
                    </Button>
                    <Button
                        size="small"
                        onClick={ exportProfileJson }
                        data-componentid={ `${componentId}-profile-data-export-button` }
                        startIcon={ <DownloadIcon /> }
                    >
                        { t("customerDataService:profiles.details.profileData.actions.export") }
                    </Button>
                </div>
            </>
        );
    };

    const renderMergedTable = (): ReactElement => {
        const merged = profile?.merged_from ?? [];
    
        return (
            <>
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
            </>
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
                        <Grid>
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
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
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
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

    const merged: Array<{ profile_id: string; reason?: string }> = useMemo(() => {
        return (profile?.merged_from ?? []) as any;
    }, [ profile ]);

    const renderUnifiedProfilesTab = (): ReactElement | null => {
        if (!profile || merged.length === 0) {
            return null;
        }
    
        return (
            <EmphasizedSegment padded="very">
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                            <p style={{ marginBottom: "1rem", color: "rgba(0, 0, 0, 0.6)" }}>
                                { t("customerDataService:profiles.details.unifiedProfiles.description") }
                            </p>
                            { merged.map((m) => (
                                <EmphasizedSegment key={ m.profile_id } basic style={{ marginBottom: "1rem" }}>
                                    <Grid>
                                        <Grid.Row style={{ paddingBottom: "8px" }}>
                                            <Grid.Column width={ 5 }>
                                                <strong style={{ fontSize: "13px", color: "#666" }}>
                                                    { t("customerDataService:profiles.details.unifiedProfiles.columns.profileId") }
                                                </strong>
                                            </Grid.Column>
                                            <Grid.Column width={ 11 }>
                                                <code style={{ 
                                                    background: "#f5f5f5", 
                                                    padding: "4px 8px", 
                                                    borderRadius: "4px",
                                                    fontSize: "13px"
                                                }}>
                                                    { m.profile_id }
                                                </code>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row style={{ paddingTop: "8px" }}>
                                            <Grid.Column width={ 5 }>
                                                <strong style={{ fontSize: "13px", color: "#666" }}>
                                                    { t("customerDataService:profiles.details.unifiedProfiles.columns.reason") }
                                                </strong>
                                            </Grid.Column>
                                            <Grid.Column width={ 11 }>
                                                { m.reason ?? "-" }
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </EmphasizedSegment>
                            )) }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </EmphasizedSegment>
        );
    };

    const panes: ResourceTabPaneInterface[] = useMemo(() => {
        const base: ResourceTabPaneInterface[] = [
            {
                componentId: "general",
                menuItem: t("customerDataService:profiles.details.tabs.general"),
                render: renderGeneralTab
            }
        ];

        if (merged.length > 0) {
            base.push({
                componentId: "unified-profiles",
                menuItem: t("customerDataService:profiles.details.tabs.unifiedProfiles"),
                render: renderUnifiedProfilesTab
            });
        }

        return base;
    }, [ t, merged.length, profile ]);

    const handleProfileDataViewClose = (): void => {
        setIsProfileDataViewOpen(false);
        setModalAlert(null);
    };

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
                <UserAvatar
                        data-componentid="profile-item-image"
                        name={ profile?.profile_id?.charAt(0)?.toUpperCase() }
                        size="tiny"
                        spaced="right"
                        data-suppress=""
                    />
            ) }
            title={ profile?.profile_id || t("customerDataService:profiles.details.page.fallbackTitle") }
            pageTitle={ t("customerDataService:profiles.details.page.pageTitle") }
            description={ displayName || undefined }
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

            { profile && isProfileDataViewOpen && (
                <Suspense fallback={ <CircularProgress /> }>
                    <Modal
                        aria-labelledby="profile-data-viewer-title"
                        aria-describedby="profile-data-viewer-description"
                        open={ isProfileDataViewOpen }
                        onClose={ handleProfileDataViewClose }
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '90%',
                                height: '90%',
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 2,
                                overflow: 'hidden'
                            }}
                        >
                            {/* Toolbar */}
                            <Box
                                sx={{
                                    backgroundColor: '#f5f5f5',
                                    borderBottom: '1px solid #e0e0e0'
                                }}
                                data-componentid={ `${ componentId }-toolbar-container` }
                            >
                                <Toolbar variant="dense" sx={{ justifyContent: 'space-between', px: 2 }}>
                                    <Typography variant="h6">
                                        { t("customerDataService:profiles.details.profileData.modal.title") }
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <Button
                                            size="small"
                                            data-componentid={ `${ componentId }-profile-data-viewer-download-button` }
                                            onClick={ exportProfileJson }
                                            startIcon={ <DownloadIcon /> }
                                            sx={{ textTransform: 'none' }}
                                        >
                                            { t("customerDataService:profiles.details.profileData.actions.export") }
                                        </Button>
                                        <Button
                                            size="small"
                                            data-componentid={ `${ componentId }-profile-data-viewer-copy-button` }
                                            onClick={ copyProfileJson }
                                            startIcon={ <CopyIcon /> }
                                            sx={{ textTransform: 'none' }}
                                        >
                                            { t("customerDataService:profiles.details.profileData.actions.copy") }
                                        </Button>
                                        <IconButton
                                            data-componentid={ `${ componentId }-profile-data-viewer-close-button` }
                                            size="small"
                                            onClick={ handleProfileDataViewClose }
                                        >
                                            <XMarkIcon />
                                        </IconButton>
                                    </Box>
                                </Toolbar>
                            </Box>

                            {/* Monaco Editor */}
                            <Box sx={{ flex: 1, overflow: 'hidden' }}>
                                <MonacoEditor
                                    loading={ <CircularProgress /> }
                                    width="100%"
                                    height="100%"
                                    language="json"
                                    theme="vs"
                                    value={ profileJsonString }
                                    options={{
                                        automaticLayout: true,
                                        readOnly: true,
                                        minimap: { enabled: false },
                                        scrollBeyondLastLine: false,
                                        fontSize: 13,
                                        lineNumbers: "on",
                                        renderWhitespace: "selection",
                                        wordWrap: "on"
                                    }}
                                    data-componentid={ `${ componentId }-profile-data-viewer` }
                                />
                            </Box>
                        </Box>
                    </Modal>
                </Suspense>
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
                        <Trans
                            i18nKey="customerDataService:profiles.list.confirmations.deleteProfile.content"
                            values={{ profileId: profileId }}
                            components={[null, <strong />]}
                        />
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </TabPageLayout>
    );
};

export default ProfileDetailsPage;
