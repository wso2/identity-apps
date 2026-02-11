import React, {
    FunctionComponent,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useMemo,
    useState
} from "react";
import { RouteComponentProps } from "react-router";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";

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

import { Divider, Form, TabProps, Table, Image } from "semantic-ui-react";

import { fetchUserDetails, deleteUserProfile } from "../api/profiles";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";

type MergedFromItem = {
    profile_id: string;
    reason?: string;
};

type CDSProfile = {
    profile_id: string;
    meta?: {
        created_at?: string;
        updated_at?: string;
        location?: string;
    };
    identity_attributes?: Record<string, unknown>;
    merged_from?: MergedFromItem[];
};

type Props =
    IdentifiableComponentInterface &
    TestableComponentInterface &
    RouteComponentProps<{ id: string }>;

const ProfileDetailsPage: FunctionComponent<Props> = (props: Props): ReactElement => {

    const {
        match,
        history,
        [ "data-testid" ]: testId = "cdm-profile-details",
        [ "data-componentid" ]: componentId = "cdm-profile-details"
    } = props;

    const dispatch: Dispatch<any> = useDispatch();
    const profileId: string = match?.params?.id;

    const [ profile, setProfile ] = useState<CDSProfile | null>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ activeTabIndex, setActiveTabIndex ] = useState<number>(0);

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ isDeleting, setIsDeleting ] = useState<boolean>(false);

    // Profile data viewer modal
    const [ isProfileDataViewOpen, setIsProfileDataViewOpen ] = useState<boolean>(false);

    const [ alert, setAlert, alertComponent ] = useConfirmationModalAlert();

    const handleAlerts = (alert: AlertInterface): void => {
        dispatch(addAlert(alert));
    };

    const fetchProfile = async (): Promise<void> => {
        setIsLoading(true);

        try {
            const data = await fetchUserDetails(profileId);

            if (!data) {
                setProfile(null);
                return;
            }

            setProfile(data);
        } catch {
            setProfile(null);
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
        const direct = (profile as any)?.user_id;
        if (direct) {
            return String(direct);
        }

        const fromIdentity = profile?.identity_attributes?.["user_id"];
        return fromIdentity ? String(fromIdentity) : null;
    }, [ profile ]);

    /** Hide Danger Zone if userId exists */
    const showDangerZone: boolean = useMemo(() => {
        return Boolean(profile) && !userId;
    }, [ profile, userId ]);

    const handleTabChange = (_: SyntheticEvent, data: TabProps): void => {
        setActiveTabIndex(data.activeIndex as number);
        setAlert(null);
    };

    const profileJsonString: string = useMemo(() => {
        return JSON.stringify(profile ?? {}, null, 2);
    }, [ profile ]);

    const copyProfileJson = (): void => {
        navigator.clipboard.writeText(profileJsonString);

        setAlert({
            description: "Profile data copied to clipboard.",
            level: AlertLevels.SUCCESS,
            message: "Copied"
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

        setAlert({
            description: "Profile data exported.",
            level: AlertLevels.SUCCESS,
            message: "Exported"
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
                <label>Profile Data</label>

                <div style={ { display: "flex", alignItems: "center", gap: 12 } }>
                    <a
                        role="button"
                        style={ { cursor: "pointer" } }
                        onClick={ (): void => {
                            setAlert(null);
                            setIsProfileDataViewOpen(true);
                        } }
                    >
                        View
                    </a>
                    <a
                        role="button"
                        style={ { cursor: "pointer" } }
                        onClick={ (): void => {
                            copyProfileJson();
                        } }
                    >
                        Copy
                    </a>
                    <a
                        role="button"
                        style={ { cursor: "pointer" } }
                        onClick={ (): void => {
                            exportProfileJson();
                        } }
                    >
                        Export
                    </a>
                </div>
            </Form.Field>
        );
    };

    const renderMergedTable = (): ReactElement => {
        const merged = profile?.merged_from ?? [];

        return (
            <Form.Field>
                <label>Merged From</label>

                { !merged.length ? (
                    <div style={ { opacity: 0.7 } }>
                        No unified profiles found for this profile.
                    </div>
                ) : (
                    <Table compact="very" basic="very" celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Profile ID</Table.HeaderCell>
                                <Table.HeaderCell>Reason</Table.HeaderCell>
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
                        { renderField("Profile ID", profile.profile_id) }
                        { renderField("User ID", userId) }
                        { renderField("Created Date", profile.meta?.created_at ? profile.meta.created_at.split("T")[0] : null) } 
                        { renderField("Updated Date", profile.meta?.updated_at ? profile.meta.updated_at.split("T")[0] : null) }
                        { renderField("Location", profile.meta?.location ?? null) }

                        <Divider />

                        { renderProfileDataField() }
                    </Form>
                </EmphasizedSegment>

                { showDangerZone && (
                    <DangerZoneGroup sectionHeader="Danger Zone">
                        <DangerZone
                            actionTitle="Delete profile"
                            header="Delete this profile"
                            subheader="This profile is not linked to a user ID and can be deleted."
                            onActionClick={ (): void => {
                                setAlert(null);
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
        { componentId: "general", menuItem: "General", render: renderGeneralTab },
        { componentId: "unified-profiles", menuItem: "Unified Profiles", render: renderUnifiedProfilesTab }
    ];

    const handleProfileDelete = (): void => {
        if (userId) {
            setAlert({
                description: "Profiles linked to a user ID cannot be deleted.",
                level: AlertLevels.WARNING,
                message: "Not allowed"
            });
            return;
        }

        setIsDeleting(true);

        deleteUserProfile(profileId)
            .then(() => {
                handleAlerts({
                    description: "Profile deleted successfully.",
                    level: AlertLevels.SUCCESS,
                    message: "Success"
                });

                history.push(AppConstants.getPaths().get("PROFILES"));
            })
            .catch((error: any) => {
                if (error?.response?.data?.description) {
                    setAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Error"
                    });
                    return;
                }

                setAlert({
                    description: "Failed to delete profile.",
                    level: AlertLevels.ERROR,
                    message: "Error"
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
            title={ profile?.profile_id || "Profile" }
            pageTitle="Profile"
            description={ userId ? `Linked User ID: ${ userId }` : "Customer profile" }
            backButton={ {
                onClick: () => history.push(AppConstants.getPaths().get("PROFILES")),
                text: "Go back to Profiles"
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
                        setAlert(null);
                    } }
                    type="info"
                    primaryAction="Close"
                    secondaryAction="Export"
                    onPrimaryActionClick={ (): void => {
                        setIsProfileDataViewOpen(false);
                        setAlert(null);
                    } }
                    onSecondaryActionClick={ exportProfileJson }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header>
                        Profile Data
                    </ConfirmationModal.Header>

                    <ConfirmationModal.Content>
                        <div className="modal-alert-wrapper">{ alert && alertComponent }</div>

                        <div style={ { display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 10 } }>
                            <button
                                type="button"
                                className="ui button basic mini"
                                onClick={ copyProfileJson }
                            >
                                Copy
                            </button>

                            <button
                                type="button"
                                className="ui button primary mini"
                                onClick={ exportProfileJson }
                            >
                                Export
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
                        setAlert(null);
                    } }
                    type="negative"
                    open={ showDeleteConfirmationModal }
                    assertionHint="I confirm that I want to delete this profile."
                    assertionType="checkbox"
                    primaryAction="Confirm"
                    secondaryAction="Cancel"
                    onSecondaryActionClick={ (): void => {
                        setShowDeleteConfirmationModal(false);
                        setAlert(null);
                    } }
                    onPrimaryActionClick={ handleProfileDelete }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header data-componentid={ `${componentId}-confirmation-modal-header` }>
                        Delete profile
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        data-componentid={ `${componentId}-confirmation-modal-message` }
                        attached
                        negative
                    >
                        This action cannot be undone.
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        <div className="modal-alert-wrapper">{ alert && alertComponent }</div>

                        <div style={ { display: "grid", gap: 8 } }>
                            <div><strong>Profile ID:</strong> { profile?.profile_id }</div>
                        </div>
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </TabPageLayout>
    );
};

export default ProfileDetailsPage;
