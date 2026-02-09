import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useMemo, useState } from "react";
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
    ConfirmationModal,
    ContentLoader,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment,
    PageLayout,
    ResourceTab,
    ResourceTabPaneInterface,
    useConfirmationModalAlert
} from "@wso2is/react-components";
import { Divider, TabProps } from "semantic-ui-react";
import Chip from "@oxygen-ui/react/Chip";

import { fetchUserDetails, deleteUserProfile } from "../api"; // <-- your existing functions

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
        [key: string]: unknown;
    };
    identity_attributes?: Record<string, unknown>;
    application_data?: Record<string, unknown>;
    merged_from?: MergedFromItem[];
    [key: string]: unknown;
};

type ProfileDetailsPageProps =
    IdentifiableComponentInterface &
    TestableComponentInterface &
    RouteComponentProps<{ profileId: string }>;

const ProfileDetailsPage: FunctionComponent<ProfileDetailsPageProps> = (
    props: ProfileDetailsPageProps
): ReactElement => {

    const {
        match,
        [ "data-testid" ]: testId = "cdm-profile-details",
        [ "data-componentid" ]: componentId = "cdm-profile-details"
    } = props;

    const dispatch: Dispatch<any> = useDispatch();
    const profileId: string = match?.params?.profileId;

    const [ activeTabIndex, setActiveTabIndex ] = useState<number>(0);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ profile, setProfile ] = useState<CDSProfile | null>(null);

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ isDeleting, setIsDeleting ] = useState<boolean>(false);

    const [ alert, setAlert, alertComponent ] = useConfirmationModalAlert();

    const handleAlerts = (alert: AlertInterface): void => {
        dispatch(addAlert(alert));
    };

    const fetchProfile = async (): Promise<void> => {
        setIsLoading(true);

        try {
            const data: CDSProfile = await fetchUserDetails(profileId);

            setProfile(data);
        } catch (e) {
            // fetchUserDetails returns null already, so this is just a safety net.
            setProfile(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!profileId) {
            return;
        }
        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ profileId ]);

    const handleTabChange = (_e: SyntheticEvent, data: TabProps): void => {
        setActiveTabIndex(data.activeIndex as number);
        setAlert(null);
    };

    /**
     * Decide where "userId" lives.
     * Your sample doesn't include it. If in future you store it as:
     * - profile.user_id => return profile.user_id
     * - profile.identity_attributes.user_id => return that
     */
    const resolveUserId = (): string => {
        const direct: unknown = (profile as any)?.user_id;
        if (direct && String(direct).trim().length > 0) {
            return String(direct).trim();
        }

        const fromIdentity: unknown = profile?.identity_attributes?.["user_id"];
        if (fromIdentity && String(fromIdentity).trim().length > 0) {
            return String(fromIdentity).trim();
        }

        return "";
    };

    const canDeleteProfile: boolean = useMemo(() => {
        return Boolean(profile) && resolveUserId().length === 0;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ profile ]);

    const renderKeyValue = (label: string, value: ReactElement | string): ReactElement => (
        <div style={ { display: "grid", gap: 4 } }>
            <strong>{ label }</strong>
            <div>{ value }</div>
        </div>
    );

    const renderJsonBlock = (value: unknown, dataTestId?: string): ReactElement => (
        <pre
            data-testid={ dataTestId }
            style={ {
                margin: 0,
                padding: "1rem",
                borderRadius: 8,
                overflow: "auto",
                maxHeight: 520,
                fontSize: 12
            } }
        >
            { JSON.stringify(value ?? {}, null, 2) }
        </pre>
    );

    const renderMergedFrom = (): ReactElement => {
        const mergedFrom: MergedFromItem[] = profile?.merged_from ?? [];

        if (!mergedFrom || mergedFrom.length === 0) {
            return (
                <div>-</div>
            );
        }

        // Keep it “console-like”: simple, compact chips.
        return (
            <div style={ { display: "flex", flexWrap: "wrap", gap: 8 } }>
                { mergedFrom.map((item: MergedFromItem) => (
                    <Chip
                        key={ item.profile_id }
                        size="small"
                        label={ item.reason ? `${item.profile_id} (${item.reason})` : item.profile_id }
                    />
                )) }
            </div>
        );
    };

    const renderGeneralTab = (): ReactElement => {
        if (!profile) {
            return null;
        }

        return (
            <>
                <EmphasizedSegment padded="very">
                    <div className="form-container with-max-width">
                        <div style={ { display: "grid", gap: 16 } }>
                            { renderKeyValue("Profile ID", profile.profile_id ?? "-") }
                            { renderKeyValue("User ID", resolveUserId() || "-") }

                            <Divider />

                            { renderKeyValue("Created at", profile?.meta?.created_at ?? "-") }
                            { renderKeyValue("Updated at", profile?.meta?.updated_at ?? "-") }
                            { renderKeyValue("Location", profile?.meta?.location ?? "-") }

                            <Divider />

                            { renderKeyValue("Merged From", renderMergedFrom()) }
                        </div>
                    </div>
                </EmphasizedSegment>

                <Divider hidden />

                <DangerZoneGroup sectionHeader="Danger Zone">
                    <DangerZone
                        data-testid={ `${testId}-delete-profile-danger-zone` }
                        actionTitle="Delete profile"
                        header="Delete this profile"
                        subheader={
                            canDeleteProfile
                                ? "This profile is not linked to a user ID, so it can be deleted."
                                : "Deletion is disabled because this profile is linked to a user ID."
                        }
                        onActionClick={ (): void => {
                            setAlert(null);
                            setShowDeleteConfirmationModal(true);
                        } }
                        isButtonDisabled={ !canDeleteProfile || isDeleting }
                        buttonDisableHint="Profiles linked to a user ID cannot be deleted."
                    />
                </DangerZoneGroup>
            </>
        );
    };

    const renderDataTab = (): ReactElement => {
        if (!profile) {
            return null;
        }

        // If you want only data scopes:
        // const dataOnly = {
        //     identity_attributes: profile.identity_attributes ?? {},
        //     application_data: profile.application_data ?? {}
        // };
        // return renderJsonBlock(dataOnly, `${testId}-profile-data-json`);

        return (
            <EmphasizedSegment padded="very">
                <div className="form-container with-max-width">
                    { renderJsonBlock(profile, `${testId}-profile-json`) }
                </div>
            </EmphasizedSegment>
        );
    };

    const panes: ResourceTabPaneInterface[] = [
        { componentId: "general", menuItem: "General", render: renderGeneralTab },
        { componentId: "data", menuItem: "Data", render: renderDataTab }
    ];

    const handleConfirmDelete = async (): Promise<void> => {
        if (!canDeleteProfile) {
            setAlert({
                description: "Cannot delete a profile that is linked to a user ID.",
                level: AlertLevels.WARNING,
                message: "Not allowed"
            });

            return;
        }

        setIsDeleting(true);

        try {
            await deleteUserProfile(profileId);

            handleAlerts({
                description: "Profile deleted successfully.",
                level: AlertLevels.SUCCESS,
                message: "Success"
            });

            setShowDeleteConfirmationModal(false);

            // TODO: navigate back to profiles list (use your route helper if you have one)
            // history.push(AppConstants.getPaths().get("PROFILES"));
        } catch (e: any) {
            setAlert({
                description: e?.response?.data?.description ?? "Failed to delete profile.",
                level: AlertLevels.ERROR,
                message: "Error"
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <PageLayout
            title="Profile"
            pageTitle="Profile"
            description="View and manage a single customer profile."
            data-componentid={ componentId }
            data-testid={ testId }
        >
            { isLoading ? (
                <ContentLoader dimmer />
            ) : (
                <ResourceTab
                    activeIndex={ activeTabIndex }
                    defaultActiveIndex={ 0 }
                    onTabChange={ handleTabChange }
                    panes={ panes }
                    data-testid={ `${testId}-tabs` }
                />
            ) }

            { profile && (
                <ConfirmationModal
                    data-testid={ `${testId}-delete-confirmation-modal` }
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
                    onPrimaryActionClick={ handleConfirmDelete }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header>
                        Delete profile
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached negative>
                        This action cannot be undone.
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        <div className="modal-alert-wrapper">
                            { alert && alertComponent }
                        </div>

                        <div style={ { display: "grid", gap: 8 } }>
                            <div><strong>Profile ID:</strong> { profile.profile_id }</div>
                            <div><strong>User ID:</strong> { resolveUserId() || "-" }</div>
                        </div>
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </PageLayout>
    );
};

ProfileDetailsPage.defaultProps = {
    "data-componentid": "cdm-profile-details",
    "data-testid": "cdm-profile-details"
};

export default ProfileDetailsPage;
