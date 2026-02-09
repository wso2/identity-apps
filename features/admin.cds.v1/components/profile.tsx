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
    ContentLoader,
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

    const { match, history, ["data-testid"]: testId = "cdm-profile-details", ["data-componentid"]: componentId } = props;

    const dispatch: Dispatch<any> = useDispatch();
    const profileId: string = match?.params?.id;

    const [ profile, setProfile ] = useState<CDSProfile | null>(null);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ activeTabIndex, setActiveTabIndex ] = useState<number>(0);

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ isDeleting, setIsDeleting ] = useState<boolean>(false);

    const [ alert, setAlert, alertComponent ] = useConfirmationModalAlert();

    const handleAlerts = (alert: AlertInterface): void => dispatch(addAlert(alert));

    const fetchProfile = async (): Promise<void> => {
        setIsLoading(true);

        try {
            const data = await fetchUserDetails(profileId);

            if (!data) {
                setProfile(null);
                handleAlerts({
                    description: "Profile not found.",
                    level: AlertLevels.ERROR,
                    message: "Error"
                });
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
    }, [ profileId ]);

    const userId = useMemo(() => {
        const direct = (profile as any)?.user_id;
        if (direct) {
            return String(direct);
        }
        const fromIdentity = profile?.identity_attributes?.["user_id"];
        return fromIdentity ? String(fromIdentity) : null;
    }, [ profile ]);

    /** Hide Danger Zone if userId exists */
    const showDangerZone = useMemo(() => {
        return Boolean(profile) && !userId;
    }, [ profile, userId ]);

    const handleTabChange = (_: SyntheticEvent, data: TabProps): void => {
        setActiveTabIndex(data.activeIndex as number);
        setAlert(null);
    };

    const renderField = (label: string, value?: string | null): ReactElement | null => {
        if (!value) {
            return null;
        }

        return (
            <Form.Field>
                <label>{ label }</label>
                <Form.Input readOnly value={ value } />
            </Form.Field>
        );
    };

    const renderMergedTable = (): ReactElement | null => {
        const merged = profile?.merged_from ?? [];
        if (!merged.length) {
            return null;
        }

        return (
            <Form.Field>
                <label>Merged From</label>
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
                        { renderField("Created", profile.meta?.created_at ?? null) }
                        { renderField("Updated", profile.meta?.updated_at ?? null) }
                        { renderField("Location", profile.meta?.location ?? null) }
                        { renderMergedTable() }
                    </Form>
                </EmphasizedSegment>

                { showDangerZone && (
                    <DangerZoneGroup sectionHeader="Danger Zone">
                        <DangerZone
                            actionTitle="Delete profile"
                            header="Delete this profile"
                            subheader="This profile is not linked to a user ID and can be deleted."
                            onActionClick={ () => setShowDeleteConfirmationModal(true) }
                            isButtonDisabled={ isDeleting }
                        />
                    </DangerZoneGroup>
                ) }
            </>
        );
    };

    const panes: ResourceTabPaneInterface[] = [
        { componentId: "general", menuItem: "General", render: renderGeneralTab }
    ];

    const handleDelete = async (): Promise<void> => {
        if (userId) {
            return;
        }

        setIsDeleting(true);

        try {
            await deleteUserProfile(profileId);

            handleAlerts({
                description: "Profile deleted.",
                level: AlertLevels.SUCCESS,
                message: "Success"
            });

            history.push(AppConstants.getPaths().get("PROFILES"));
        } finally {
            setIsDeleting(false);
        }
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

            { showDangerZone && (
                <ConfirmationModal
                    open={ showDeleteConfirmationModal }
                    onClose={ () => setShowDeleteConfirmationModal(false) }
                    primaryAction="Confirm"
                    secondaryAction="Cancel"
                    assertionType="checkbox"
                    assertionHint="I confirm delete"
                    onPrimaryActionClick={ handleDelete }
                >
                    <ConfirmationModal.Header>Delete profile</ConfirmationModal.Header>
                    <ConfirmationModal.Message attached negative>
                        This action cannot be undone.
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        { alert && alertComponent }
                        <strong>Profile ID:</strong> { profile?.profile_id }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            )}
        </TabPageLayout>
    );
};

export default ProfileDetailsPage;
