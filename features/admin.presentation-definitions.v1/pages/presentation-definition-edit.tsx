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
import Checkbox from "@oxygen-ui/react/Checkbox";
import Chip from "@oxygen-ui/react/Chip";
import Dialog from "@oxygen-ui/react/Dialog";
import DialogActions from "@oxygen-ui/react/DialogActions";
import DialogContent from "@oxygen-ui/react/DialogContent";
import DialogTitle from "@oxygen-ui/react/DialogTitle";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { PlusIcon } from "@oxygen-ui/react-icons";
import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { CertificateViewModal } from "@wso2is/admin.core.v1/components/certificate-view-modal";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import {
    AlertInterface,
    AlertLevels,
    DisplayCertificate,
    HttpErrorResponseDataInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CertificateManagementUtils } from "@wso2is/core/utils";
import {
    AnimatedAvatar,
    AppAvatar,
    ConfirmationModal,
    ContentLoader,
    CopyInputField,
    DangerZone,
    DangerZoneGroup,
    DataTable,
    EmptyPlaceholder,
    EmphasizedSegment,
    Heading,
    Hint,
    Link,
    LinkButton,
    PageLayout,
    PrimaryButton,
    ResourceTab,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, {
    FunctionComponent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Icon, SemanticICONS } from "semantic-ui-react";
import {
    deletePresentationDefinition,
    getConnectedIdps,
    replaceIssuerConfigs,
    updatePresentationDefinition
} from "../api/presentation-definitions";
import { IssuerConfigModal } from "../components/issuer-config-modal";
import { useGetClaimMappingConnections } from "../hooks/use-get-claim-mapping-connections";
import { useGetIssuerConfigs } from "../hooks/use-get-issuer-configs";
import { useGetPresentationDefinition } from "../hooks/use-get-presentation-definition";
import {
    ClaimConstraintModelInterface,
    ConnectedIdpItemInterface,
    ConnectedIdpsResponseInterface,
    IssuerConfigInterface,
    IssuerConfigListResponseInterface,
    PresentationDefinitionEditPagePropsInterface,
    PresentationDefinitionUpdateModelInterface,
    RequestedCredentialModelInterface
} from "../models/presentation-definitions";

/**
 * Presentation Definition edit page with tabs for General, Claims, and Issuer Trust.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
const PresentationDefinitionEditPage: FunctionComponent<PresentationDefinitionEditPagePropsInterface> = ({
    match,
    location,
    "data-componentid": componentId = "presentation-definition-edit"
}: PresentationDefinitionEditPagePropsInterface): ReactElement => {

    const definitionId: string = match?.params?.id;
    const { t } = useTranslation();

    const defaultTabIndex: number = useMemo((): number => {
        const params: URLSearchParams = new URLSearchParams(location?.search);
        const tab: string | null = params.get("tab");

        return tab !== null ? parseInt(tab, 10) : 0;
    }, [ location?.search ]);
    const dispatch: Dispatch = useDispatch();

    const presentationDefinitionsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.presentationDefinitions
    );
    const hasUpdatePermission: boolean = useRequiredScopes(
        presentationDefinitionsFeatureConfig?.scopes?.update
    );
    const hasDeletePermission: boolean = useRequiredScopes(
        presentationDefinitionsFeatureConfig?.scopes?.delete
    );
    const isReadOnly: boolean = !hasUpdatePermission;

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ showDeleteModal, setShowDeleteModal ] = useState<boolean>(false);
    const [ showDeleteBlockedModal, setShowDeleteBlockedModal ] = useState<boolean>(false);
    const [ connectedIdpNames, setConnectedIdpNames ] = useState<string[]>(undefined);
    const [ isConnectionsLoading, setIsConnectionsLoading ] = useState<boolean>(false);

    // General tab state
    const [ displayName, setDisplayName ] = useState<string>("");
    const [ description, setDescription ] = useState<string>("");

    // Settings tab state
    const [ credentialType, setCredentialType ] = useState<string>("");
    const [ credentialFormat, setCredentialFormat ] = useState<string>("dc+sd-jwt");

    // Claims tab state
    const [ claims, setClaims ] = useState<ClaimConstraintModelInterface[]>([]);
    const [ showClaimModal, setShowClaimModal ] = useState<boolean>(false);
    const [ claimModalIndex, setClaimModalIndex ] = useState<number | null>(null);
    const [ modalPath, setModalPath ] = useState<string>("");
    const [ modalMandatory, setModalMandatory ] = useState<boolean>(true);

    // Claim-blocked-by-mapping modal state
    const [ showClaimMappedModal, setShowClaimMappedModal ] = useState<boolean>(false);
    const [ blockedClaimAction, setBlockedClaimAction ] = useState<"delete" | "edit">("edit");
    const [ blockedClaimConnections, setBlockedClaimConnections ] = useState<string[]>([]);
    const [ blockedClaimPath, setBlockedClaimPath ] = useState<string>("");

    // Issuer Trust tab state
    const [ issuerConfigs, setIssuerConfigs ] = useState<IssuerConfigInterface[]>([]);
    const [ showIssuerConfigModal, setShowIssuerConfigModal ] = useState<boolean>(false);
    const [ editingIssuerConfig, setEditingIssuerConfig ] =
        useState<IssuerConfigInterface | null>(null);
    const [ editingIssuerConfigIndex, setEditingIssuerConfigIndex ] = useState<number | null>(null);
    const [ viewingCert, setViewingCert ] = useState<DisplayCertificate | null>(null);

    const [ isFormReady, setIsFormReady ] = useState<boolean>(false);

    const { data: definition, isLoading, error, mutate } = useGetPresentationDefinition(definitionId, true);

    const credentialId: string | undefined = definition?.credentials?.[0]?.id;
    const {
        data: issuerConfigsData,
        isLoading: isIssuerConfigsLoading
    } = useGetIssuerConfigs(definitionId, credentialId);
    const { claimMappingConnections } = useGetClaimMappingConnections(definitionId);

    useEffect((): void => {
        if (error) {
            dispatch(addAlert<AlertInterface>({
                description: t("presentationDefinitions:notifications.fetchDefinition.error.description"),
                level: AlertLevels.ERROR,
                message: t("presentationDefinitions:notifications.fetchDefinition.error.message")
            }));
        }
    }, [ error ]);

    useEffect((): void => {
        if (!definition) return;

        const credential: RequestedCredentialModelInterface | undefined = definition.credentials?.[0];

        setDisplayName(definition.displayName ?? "");
        setDescription(definition.description ?? "");
        setCredentialType(credential?.type ?? "");
        setCredentialFormat(credential?.format ?? "dc+sd-jwt");
        setClaims(
            (credential?.claims ?? []).map((claim: ClaimConstraintModelInterface) => ({
                ...claim,
                path: claim.path ?? ""
            }))
        );
        setIsFormReady(true);
    }, [ definition ]);

    useEffect((): void => {
        if (issuerConfigsData) {
            setIssuerConfigs(issuerConfigsData.issuerConfigs ?? []);
        }
    }, [ issuerConfigsData ]);

    const buildUpdatePayload = useCallback(
        (claimsOverride?: ClaimConstraintModelInterface[]): PresentationDefinitionUpdateModelInterface => {
            const validClaims: ClaimConstraintModelInterface[] = (claimsOverride ?? claims)
                .map((claim: ClaimConstraintModelInterface) => ({
                    mandatory: claim.mandatory ?? true,
                    path: (claim.path ?? "").trim()
                }))
                .filter((claim: ClaimConstraintModelInterface) => (claim.path ?? "").length > 0);

            const credential: RequestedCredentialModelInterface = {
                claims: validClaims,
                format: credentialFormat,
                id: definition.credentials[0].id,
                type: credentialType
            };

            return {
                credentials: [ credential ],
                description: description.trim() || undefined,
                displayName: displayName.trim()
            };
        },
        [ displayName, description, credentialType, credentialFormat, claims, definition ]
    );

    const handleUpdate = useCallback((): void => {
        if (!displayName.trim()) return;
        setIsSubmitting(true);

        updatePresentationDefinition(definitionId, buildUpdatePayload())
            .then((): void => {
                dispatch(addAlert<AlertInterface>({
                    description: t("presentationDefinitions:notifications.updateDefinition.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("presentationDefinitions:notifications.updateDefinition.success.message")
                }));
                mutate();
            })
            .catch((_error: AxiosError<HttpErrorResponseDataInterface>): void => {
                dispatch(addAlert<AlertInterface>({
                    description: t("presentationDefinitions:notifications.updateDefinition.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("presentationDefinitions:notifications.updateDefinition.error.message")
                }));
            })
            .finally((): void => setIsSubmitting(false));
    }, [ buildUpdatePayload, displayName ]);

    const handleSaveIssuerConfig = useCallback((config: IssuerConfigInterface): void => {
        if (!credentialId) return;

        const newConfigs: IssuerConfigInterface[] = editingIssuerConfigIndex === null
            ? [ ...issuerConfigs, config ]
            : issuerConfigs.map((existingConfig: IssuerConfigInterface, index: number) =>
                index === editingIssuerConfigIndex ? config : existingConfig
            );

        setIsSubmitting(true);
        replaceIssuerConfigs(definitionId, credentialId, { issuerConfigs: newConfigs })
            .then((response: IssuerConfigListResponseInterface): void => {
                setIssuerConfigs(response?.issuerConfigs ?? newConfigs);
                setShowIssuerConfigModal(false);
                dispatch(addAlert<AlertInterface>({
                    description: t(
                        "presentationDefinitions:notifications.saveIssuerConfig.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "presentationDefinitions:notifications.saveIssuerConfig.success.message"
                    )
                }));
            })
            .catch((_error: AxiosError<HttpErrorResponseDataInterface>): void => {
                dispatch(addAlert<AlertInterface>({
                    description: t(
                        "presentationDefinitions:notifications.saveIssuerConfig.error.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "presentationDefinitions:notifications.saveIssuerConfig.error.message"
                    )
                }));
            })
            .finally((): void => setIsSubmitting(false));
    }, [
        credentialId, definitionId, editingIssuerConfigIndex, issuerConfigs, dispatch, t
    ]);

    const handleDeleteIssuerConfig = useCallback((index: number): void => {
        if (!credentialId) return;

        const newConfigs: IssuerConfigInterface[] = issuerConfigs.filter(
            (_: IssuerConfigInterface, i: number) => i !== index
        );

        setIsSubmitting(true);
        replaceIssuerConfigs(definitionId, credentialId, { issuerConfigs: newConfigs })
            .then((response: IssuerConfigListResponseInterface): void => {
                setIssuerConfigs(response?.issuerConfigs ?? newConfigs);
                dispatch(addAlert<AlertInterface>({
                    description: t(
                        "presentationDefinitions:notifications.deleteIssuerConfig.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "presentationDefinitions:notifications.deleteIssuerConfig.success.message"
                    )
                }));
            })
            .catch((_error: AxiosError<HttpErrorResponseDataInterface>): void => {
                dispatch(addAlert<AlertInterface>({
                    description: t(
                        "presentationDefinitions:notifications.deleteIssuerConfig.error.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "presentationDefinitions:notifications.deleteIssuerConfig.error.message"
                    )
                }));
            })
            .finally((): void => setIsSubmitting(false));
    }, [ credentialId, definitionId, issuerConfigs, dispatch, t ]);

    const handleDeleteInitiation = useCallback((): void => {
        setIsConnectionsLoading(true);
        getConnectedIdps(definitionId)
            .then((response: ConnectedIdpsResponseInterface): void => {
                if (response?.count === 0) {
                    setShowDeleteModal(true);
                } else {
                    setConnectedIdpNames(
                        (response?.connectedIdps ?? []).map((idp: ConnectedIdpItemInterface) => idp.name)
                    );
                    setShowDeleteBlockedModal(true);
                }
            })
            .catch((): void => {
                dispatch(addAlert<AlertInterface>({
                    description: t(
                        "presentationDefinitions:notifications.deleteDefinition.error.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t("presentationDefinitions:notifications.deleteDefinition.error.message")
                }));
            })
            .finally((): void => setIsConnectionsLoading(false));
    }, [ definitionId ]);

    const getClaimMappingBlock = useCallback(
        (claimPath: string): string[] | null => {
            const names: string[] | undefined = claimMappingConnections.get(claimPath ?? "");

            return names && names.length > 0 ? names : null;
        },
        [ claimMappingConnections ]
    );

    const handleDeleteDefinition = useCallback((): void => {
        deletePresentationDefinition(definitionId)
            .then((): void => {
                dispatch(addAlert<AlertInterface>({
                    description: t("presentationDefinitions:notifications.deleteDefinition.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("presentationDefinitions:notifications.deleteDefinition.success.message")
                }));
                history.push(AppConstants.getPaths().get("VP_DEFINITIONS"));
            })
            .catch((): void => {
                dispatch(addAlert<AlertInterface>({
                    description: t("presentationDefinitions:notifications.deleteDefinition.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("presentationDefinitions:notifications.deleteDefinition.error.message")
                }));
            });
    }, [ definitionId ]);

    // ── Claims helpers ────────────────────────────────────────────────────────

    const openAddClaimModal = (): void => {
        setClaimModalIndex(null);
        setModalPath("");
        setModalMandatory(true);
        setShowClaimModal(true);
    };

    const openEditClaimModal = (index: number): void => {
        const claim: ClaimConstraintModelInterface = claims[index];
        const claimPath: string = claim.path ?? "";
        const mapped: string[] | null = getClaimMappingBlock(claimPath);

        if (mapped) {
            setBlockedClaimAction("edit");
            setBlockedClaimConnections(mapped);
            setBlockedClaimPath(claimPath);
            setShowClaimMappedModal(true);
            return;
        }

        setClaimModalIndex(index);
        setModalPath(claimPath);
        setModalMandatory(claim.mandatory ?? true);
        setShowClaimModal(true);
    };

    const saveClaimModal = (): void => {
        if (!modalPath.trim()) return;
        const updatedClaim: ClaimConstraintModelInterface = {
            mandatory: modalMandatory,
            path: modalPath.trim()
        };

        const newClaims: ClaimConstraintModelInterface[] = claimModalIndex === null
            ? [ ...claims, updatedClaim ]
            : claims.map((claim: ClaimConstraintModelInterface, i: number) =>
                i === claimModalIndex ? { ...claim, ...updatedClaim } : claim
            );

        setIsSubmitting(true);

        updatePresentationDefinition(definitionId, buildUpdatePayload(newClaims))
            .then((): void => {
                setClaims(newClaims);
                setShowClaimModal(false);
                dispatch(addAlert<AlertInterface>({
                    description: t("presentationDefinitions:notifications.updateDefinition.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("presentationDefinitions:notifications.updateDefinition.success.message")
                }));
            })
            .catch((_error: AxiosError<HttpErrorResponseDataInterface>): void => {
                dispatch(addAlert<AlertInterface>({
                    description: t("presentationDefinitions:notifications.updateDefinition.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("presentationDefinitions:notifications.updateDefinition.error.message")
                }));
            })
            .finally((): void => setIsSubmitting(false));
    };

    const removeClaim = (index: number): void => {
        const claim: ClaimConstraintModelInterface = claims[index];
        const mapped: string[] | null = getClaimMappingBlock(claim.path ?? "");

        if (mapped) {
            setBlockedClaimAction("delete");
            setBlockedClaimConnections(mapped);
            setBlockedClaimPath(claim.path ?? "");
            setShowClaimMappedModal(true);
            return;
        }

        const newClaims: ClaimConstraintModelInterface[] = claims.filter(
            (_: ClaimConstraintModelInterface, i: number) => i !== index
        );

        setClaims(newClaims);
        setIsSubmitting(true);

        updatePresentationDefinition(definitionId, buildUpdatePayload(newClaims))
            .then((): void => {
                dispatch(addAlert<AlertInterface>({
                    description: t("presentationDefinitions:notifications.updateDefinition.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("presentationDefinitions:notifications.updateDefinition.success.message")
                }));
            })
            .catch((_error: AxiosError<HttpErrorResponseDataInterface>): void => {
                dispatch(addAlert<AlertInterface>({
                    description: t("presentationDefinitions:notifications.updateDefinition.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("presentationDefinitions:notifications.updateDefinition.error.message")
                }));
            })
            .finally((): void => setIsSubmitting(false));
    };

    // ── Tab pane renderers ────────────────────────────────────────────────────

    const renderGeneralTab = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation attached={ false }>
            <Alert severity="info" icon={ false } sx={ { mb: 2, "& .MuiAlert-message": { fontSize: "1rem" } } }>
                <Trans i18nKey="presentationDefinitions:editPage.digitalWalletHint">
                    { "Create a " }
                    <Link
                        external={ false }
                        link="#"
                        onClick={ (): void => {
                            history.push(AppConstants.getPaths().get("CONNECTION_TEMPLATES"));
                        } }
                        data-componentid={ `${componentId}-digital-wallet-hint-link` }
                    >
                        Digital Wallet
                    </Link>
                    { " connection to allow users to sign in or register using this presentation definition." }
                </Trans>
            </Alert>
            <EmphasizedSegment padded="very">
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                            <label className="form-label">
                                { t("presentationDefinitions:editPage.quickCopy.identifier.label") }
                            </label>
                            <div style={ { marginBottom: "16px", marginTop: "4px" } }>
                                <CopyInputField
                                    value={ definition?.identifier ?? "" }
                                    data-componentid={ `${componentId}-identifier-copy` }
                                />
                            </div>

                            <TextField
                                fullWidth
                                required
                                size="small"
                                margin="dense"
                                label={ t("presentationDefinitions:editPage.form.displayName.label") }
                                placeholder={ t(
                                    "presentationDefinitions:editPage.form.displayName.placeholder"
                                ) }
                                value={ displayName }
                                onChange={ (e: React.ChangeEvent<HTMLInputElement>): void =>
                                    setDisplayName(e.target.value)
                                }
                                InputProps={ { readOnly: isReadOnly } }
                                InputLabelProps={ { required: true } }
                                sx={ { mb: 2 } }
                                data-componentid={ `${componentId}-display-name-input` }
                            />
                            <TextField
                                fullWidth
                                multiline
                                rows={ 3 }
                                size="small"
                                margin="dense"
                                label={ t("presentationDefinitions:editPage.form.description.label") }
                                placeholder={ t(
                                    "presentationDefinitions:editPage.form.description.placeholder"
                                ) }
                                value={ description }
                                onChange={ (e: React.ChangeEvent<HTMLInputElement>): void =>
                                    setDescription(e.target.value)
                                }
                                InputProps={ { readOnly: isReadOnly } }
                                sx={ { mb: 2 } }
                                data-componentid={ `${componentId}-description-input` }
                            />
                            <TextField
                                fullWidth
                                required
                                size="small"
                                margin="dense"
                                label={ t("presentationDefinitions:editPage.form.credentials.type.label") }
                                placeholder={ t(
                                    "presentationDefinitions:editPage.form.credentials.type.placeholder"
                                ) }
                                value={ credentialType }
                                onChange={ (e: React.ChangeEvent<HTMLInputElement>): void =>
                                    setCredentialType(e.target.value)
                                }
                                InputProps={ { readOnly: isReadOnly } }
                                InputLabelProps={ { required: true } }
                                sx={ { mb: 2 } }
                                data-componentid={ `${componentId}-credential-type-input` }
                            />
                            <Box sx={ { mb: 2 } } />

                            { !isReadOnly && (
                                <PrimaryButton
                                    size="small"
                                    disabled={ isSubmitting || !displayName.trim() || !credentialType.trim() }
                                    loading={ isSubmitting }
                                    onClick={ handleUpdate }
                                    data-componentid={ `${componentId}-general-update-button` }
                                >
                                    { t("common:update") }
                                </PrimaryButton>
                            ) }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </EmphasizedSegment>

            <Box sx={ { mb: 2 } } />

            { hasDeletePermission && (
                <DangerZoneGroup sectionHeader={ t("presentationDefinitions:editPage.dangerZone.header") }>
                    <DangerZone
                        actionTitle={ t("presentationDefinitions:editPage.dangerZone.delete.actionTitle") }
                        header={ t("presentationDefinitions:editPage.dangerZone.delete.header") }
                        subheader={ t("presentationDefinitions:editPage.dangerZone.delete.subheader") }
                        onActionClick={ handleDeleteInitiation }
                        data-componentid={ `${componentId}-danger-zone` }
                    />
                </DangerZoneGroup>
            ) }
        </ResourceTab.Pane>
    );

    const renderClaimsTab = (): ReactElement => {
        const claimTableColumns: TableColumnInterface[] = [
            {
                allowToggleVisibility: false,
                dataIndex: "path",
                id: "path",
                key: "path",
                render: (claim: ClaimConstraintModelInterface): ReactNode => {
                    const pathLabel: string = claim.path || "—";

                    return (
                        <div
                            style={ { alignItems: "center", display: "flex" } }
                            data-componentid={ `${componentId}-claim-item-heading` }
                        >
                            <AppAvatar
                                image={ (
                                    <AnimatedAvatar
                                        name={ pathLabel }
                                        size="mini"
                                        data-componentid={ `${componentId}-claim-item-image-inner` }
                                    />
                                ) }
                                size="mini"
                                spaced="right"
                                data-componentid={ `${componentId}-claim-item-image` }
                            />
                            <span>{ pathLabel }</span>
                        </div>
                    );
                },
                title: t("presentationDefinitions:editPage.form.credentials.claims.claimPath.label")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "mandatory",
                id: "mandatory",
                key: "mandatory",
                render: (claim: ClaimConstraintModelInterface): ReactNode => (
                    <span data-componentid={ `${componentId}-claim-mandatory-heading` }>
                        { claim.mandatory !== false
                            ? <Icon name="check" color="green" />
                            : <Icon name="minus" color="grey" />
                        }
                    </span>
                ),
                title: t("presentationDefinitions:editPage.form.credentials.claims.required.label")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: null
            }
        ];

        const claimTableActions: TableActionsInterface[] = [
            {
                hidden: (): boolean => isReadOnly,
                icon: (): SemanticICONS => "pencil alternate",
                onClick: (_e: SyntheticEvent, claim: ClaimConstraintModelInterface): void => {
                    openEditClaimModal(claims.indexOf(claim));
                },
                popupText: (): string => t("common:edit"),
                renderer: "semantic-icon"
            },
            {
                hidden: (): boolean => isReadOnly,
                icon: (): SemanticICONS => "trash alternate",
                onClick: (_e: SyntheticEvent, claim: ClaimConstraintModelInterface): void => {
                    removeClaim(claims.indexOf(claim));
                },
                popupText: (): string => t("common:remove"),
                renderer: "semantic-icon"
            }
        ];

        return (
            <ResourceTab.Pane controlledSegmentation attached={ false }>
                <EmphasizedSegment padded="very">
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                                { claims.length > 0
                                    ? (
                                        <div style={ {
                                            alignItems: "center",
                                            display: "flex",
                                            justifyContent: "space-between"
                                        } }>
                                            <Heading as="h4" style={ { marginBottom: 0 } }>
                                                { t(
                                                    "presentationDefinitions:editPage.form.credentials.claims.label"
                                                ) }
                                            </Heading>
                                            { !isReadOnly && (
                                                <PrimaryButton
                                                    size="small"
                                                    onClick={ openAddClaimModal }
                                                    data-componentid={ `${componentId}-add-claim-button` }
                                                >
                                                    <PlusIcon />
                                                    { t(
                                                        "presentationDefinitions:editPage.form.credentials" +
                                                        ".claims.addClaim"
                                                    ) }
                                                </PrimaryButton>
                                            ) }
                                        </div>
                                    ) : (
                                        <Heading as="h4">
                                            { t(
                                                "presentationDefinitions:editPage.form.credentials.claims.label"
                                            ) }
                                        </Heading>
                                    )
                                }
                                <Heading subHeading ellipsis as="h6">
                                    { t("presentationDefinitions:editPage.form.credentials.claims.hint") }
                                </Heading>
                                { claims.length === 0 ? (
                                    <EmptyPlaceholder
                                        image={ getEmptyPlaceholderIllustrations().newList }
                                        imageSize="tiny"
                                        action={
                                            !isReadOnly
                                                ? (
                                                    <PrimaryButton
                                                        size="small"
                                                        onClick={ openAddClaimModal }
                                                        data-componentid={ `${componentId}-add-claim-button` }
                                                    >
                                                        <PlusIcon />
                                                        { t(
                                                            "presentationDefinitions:editPage.form.credentials" +
                                                            ".claims.addClaim"
                                                        ) }
                                                    </PrimaryButton>
                                                )
                                                : undefined
                                        }
                                        subtitle={ [
                                            t(
                                                "presentationDefinitions:editPage.form.credentials" +
                                                ".claims.emptyPlaceholder"
                                            )
                                        ] }
                                        data-componentid={ `${componentId}-claims-empty-placeholder` }
                                    />
                                ) : (
                                    <>
                                        <style>{ `
                                            .pd-claims-table.ui.table thead th {
                                                background: none;
                                                border-bottom: 1px solid rgba(34,36,38,.15);
                                                padding: 13px 8px !important;
                                            }
                                            .pd-claims-table.ui.table.data-table .data-table-row:hover {
                                                background: transparent !important;
                                                box-shadow: none !important;
                                                cursor: default !important;
                                            }
                                            .pd-claims-table.ui.table.data-table .data-table-row:hover .data-table-cell {
                                                border-color: transparent !important;
                                                transition: none !important;
                                            }
                                        ` }</style>
                                        <DataTable<ClaimConstraintModelInterface>
                                            className="pd-claims-table"
                                            columns={ claimTableColumns }
                                            data={ claims }
                                            actions={ claimTableActions }
                                            selectable={ false }
                                            showHeader={ true }
                                            isRowSelectable={ () => false }
                                            onRowClick={ () => undefined }
                                            data-componentid={ `${componentId}-claims-table` }
                                        />
                                    </>
                                ) }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </EmphasizedSegment>

                <Dialog
                    open={ showClaimModal }
                    fullWidth
                    maxWidth="xs"
                    onClose={ (_: unknown, reason: string): void => {
                        if (reason !== "backdropClick") {
                            setShowClaimModal(false);
                        }
                    } }
                    data-componentid={ `${ componentId }-claim-modal` }
                >
                    <DialogTitle>
                        { claimModalIndex === null
                            ? t("presentationDefinitions:editPage.form.credentials.claims.addClaim")
                            : t("presentationDefinitions:editPage.form.credentials.claims.editClaim")
                        }
                        <Typography variant="body2" color="text.secondary" sx={ { mt: 0.5 } }>
                            { t(
                                "presentationDefinitions:editPage.form.credentials.claims.modalSubtitle"
                            ) }
                        </Typography>
                    </DialogTitle>
                    <DialogContent dividers sx={ { paddingY: 2 } }>
                        <Box sx={ { mb: 2 } }>
                            <TextField
                                fullWidth
                                required
                                size="small"
                                autoFocus
                                margin="dense"
                                InputLabelProps={ { required: true } }
                                label={ t(
                                    "presentationDefinitions:editPage.form.credentials.claims.claimPath.label"
                                ) }
                                placeholder={ t(
                                    "presentationDefinitions:editPage.form.credentials.claims.claimPath.placeholder"
                                ) }
                                value={ modalPath }
                                onChange={ (e: React.ChangeEvent<HTMLInputElement>): void =>
                                    setModalPath(e.target.value)
                                }
                                data-componentid={ `${ componentId }-modal-claim-path` }
                            />
                            <div style={ { marginTop: "6px" } }>
                                <Hint compact>
                                    { t(
                                        "presentationDefinitions:editPage.form.credentials.claims.claimPath.hint"
                                    ) }
                                </Hint>
                            </div>
                        </Box>
                        <Box sx={ { mb: 1 } }>
                            <FormControlLabel
                                sx={ { ml: "-4px" } }
                                control={ (
                                    <Checkbox
                                        checked={ modalMandatory }
                                        onChange={ (e: React.ChangeEvent<HTMLInputElement>): void =>
                                            setModalMandatory(e.target.checked)
                                        }
                                        sx={ { p: "2px" } }
                                        data-componentid={ `${ componentId }-modal-claim-mandatory` }
                                    />
                                ) }
                                label={ t(
                                    "presentationDefinitions:editPage.form.credentials.claims.required.label"
                                ) }
                            />
                            <div style={ { marginTop: "6px" } }>
                                <Hint compact>
                                    { t(
                                        "presentationDefinitions:editPage.form.credentials.claims.required.hint"
                                    ) }
                                </Hint>
                            </div>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={ { paddingX: 2, paddingY: 1.5 } }>
                        <LinkButton
                            onClick={ (): void => setShowClaimModal(false) }
                            data-componentid={ `${ componentId }-modal-cancel-button` }
                        >
                            { t("common:cancel") }
                        </LinkButton>
                        <PrimaryButton
                            disabled={ !modalPath.trim() || isSubmitting }
                            loading={ isSubmitting }
                            onClick={ saveClaimModal }
                            data-componentid={ `${ componentId }-modal-save-button` }
                        >
                            { claimModalIndex === null ? t("common:add") : t("common:update") }
                        </PrimaryButton>
                    </DialogActions>
                </Dialog>
            </ResourceTab.Pane>
        );
    };

    const renderIssuerTrustTab = (): ReactElement => {

        const parseCertForDisplay = (issuerCert: string): DisplayCertificate | null => {
            if (!issuerCert || !CertificateManagementUtils.canSafelyParseCertificate(issuerCert)) {
                return null;
            }

            return CertificateManagementUtils.displayCertificate(null, issuerCert);
        };

        const resolvePrimaryText = (issuerConfig: IssuerConfigInterface): string => {
            if (issuerConfig.keyResolutionMethod === "x5c") {
                const displayCert: DisplayCertificate | null = parseCertForDisplay(issuerConfig.issuerCert);

                if (displayCert && !displayCert.infoUnavailable && displayCert.subjectDN) {
                    const commonName: string = CertificateManagementUtils.searchIssuerDNAlias(
                        displayCert.subjectDN
                    );

                    return commonName || t(
                        "presentationDefinitions:editPage.issuerTrust.issuerConfig.issuerCert.x5cLabel"
                    );
                }

                return t(
                    "presentationDefinitions:editPage.issuerTrust.issuerConfig.issuerCert.x5cLabel"
                );
            }

            return issuerConfig.issuerUrl || "—";
        };

        const renderCertSubheader = (issuerConfig: IssuerConfigInterface): ReactNode => {
            const displayCert: DisplayCertificate | null = parseCertForDisplay(issuerConfig.issuerCert);

            if (!displayCert || displayCert.infoUnavailable) {
                return null;
            }
            const expiry: string = CertificateManagementUtils.getValidityPeriodInHumanReadableFormat(
                displayCert.validFrom, displayCert.validTill
            );

            return (
                <>
                    { expiry }{ " · " }
                    <button
                        type="button"
                        style={ {
                            background: "none",
                            border: "none",
                            color: "#F07000",
                            cursor: "pointer",
                            fontSize: "inherit",
                            padding: 0
                        } }
                        onClick={ (e: React.MouseEvent<HTMLButtonElement>): void => {
                            e.stopPropagation();
                            setViewingCert(displayCert);
                        } }
                    >
                        { t("presentationDefinitions:editPage.issuerTrust.certificate.actions.view") }
                    </button>
                </>
            );
        };

        const issuerConfigColumns: TableColumnInterface[] = [
            {
                allowToggleVisibility: false,
                dataIndex: "issuerUrl",
                id: "issuerUrl",
                key: "issuerUrl",
                render: (issuerConfig: IssuerConfigInterface): ReactNode => {
                    const primaryText: string = resolvePrimaryText(issuerConfig);
                    const hasCert: boolean = issuerConfig.keyResolutionMethod === "pem"
                        || issuerConfig.keyResolutionMethod === "x5c";

                    return (
                        <div
                            style={ { alignItems: "center", display: "flex" } }
                            data-componentid={ `${componentId}-issuer-config-url-heading` }
                        >
                            <AppAvatar
                                image={ (
                                    <AnimatedAvatar
                                        name={ primaryText }
                                        size="mini"
                                        data-componentid={ `${componentId}-issuer-config-avatar-inner` }
                                    />
                                ) }
                                size="mini"
                                spaced="right"
                                data-componentid={ `${componentId}-issuer-config-avatar` }
                            />
                            <div>
                                <div>{ primaryText }</div>
                                <div style={ { fontSize: "0.85em", opacity: 0.7 } }>
                                    { hasCert
                                        ? renderCertSubheader(issuerConfig)
                                        : (issuerConfig.jwksUri || "—")
                                    }
                                </div>
                            </div>
                        </div>
                    );
                },
                title: null
            },
            {
                allowToggleVisibility: false,
                dataIndex: "keyResolutionMethod",
                id: "method",
                key: "method",
                textAlign: "right",
                render: (issuerConfig: IssuerConfigInterface): ReactNode => (
                    <Chip
                        size="small"
                        label={ t(
                            `presentationDefinitions:editPage.issuerTrust.keyResolutionMethod` +
                            `.shortLabels.${issuerConfig.keyResolutionMethod}`
                        ) }
                        sx={ { fontSize: "0.7em" } }
                    />
                ),
                title: null
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: null
            }
        ];

        const issuerConfigActions: TableActionsInterface[] = [
            {
                hidden: (): boolean => isReadOnly,
                icon: (): SemanticICONS => "pencil alternate",
                onClick: (_e: SyntheticEvent, issuerConfig: IssuerConfigInterface): void => {
                    const index: number = issuerConfigs.indexOf(issuerConfig);

                    setEditingIssuerConfig(issuerConfig);
                    setEditingIssuerConfigIndex(index);
                    setShowIssuerConfigModal(true);
                },
                popupText: (): string => t("common:edit"),
                renderer: "semantic-icon"
            },
            {
                hidden: (): boolean => isReadOnly || issuerConfigs.length <= 1,
                icon: (): SemanticICONS => "trash alternate",
                onClick: (_e: SyntheticEvent, issuerConfig: IssuerConfigInterface): void => {
                    handleDeleteIssuerConfig(issuerConfigs.indexOf(issuerConfig));
                },
                popupText: (): string => t("common:remove"),
                renderer: "semantic-icon"
            }
        ];

        const openAddModal = (): void => {
            setEditingIssuerConfig(null);
            setEditingIssuerConfigIndex(null);
            setShowIssuerConfigModal(true);
        };

        return (
            <ResourceTab.Pane controlledSegmentation attached={ false }>
                <EmphasizedSegment padded="very">
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                                { issuerConfigs.length > 0 ? (
                                    <div style={ {
                                        alignItems: "center",
                                        display: "flex",
                                        justifyContent: "space-between"
                                    } }>
                                        <Heading as="h4" style={ { marginBottom: 0 } }>
                                            { t(
                                                "presentationDefinitions:editPage.issuerTrust.heading"
                                            ) }
                                        </Heading>
                                        { !isReadOnly && (
                                            <PrimaryButton
                                                size="small"
                                                onClick={ openAddModal }
                                                data-componentid={
                                                    `${componentId}-add-issuer-config-button`
                                                }
                                            >
                                                <PlusIcon />
                                                { t(
                                                    "presentationDefinitions:editPage.issuerTrust" +
                                                    ".issuerConfig.addButton"
                                                ) }
                                            </PrimaryButton>
                                        ) }
                                    </div>
                                ) : (
                                    <Heading as="h4">
                                        { t(
                                            "presentationDefinitions:editPage.issuerTrust.heading"
                                        ) }
                                    </Heading>
                                ) }
                                <Heading subHeading ellipsis as="h6">
                                    { t("presentationDefinitions:editPage.issuerTrust.hint") }
                                </Heading>

                                { isIssuerConfigsLoading ? (
                                    <ContentLoader />
                                ) : issuerConfigs.length === 0 ? (
                                    <EmptyPlaceholder
                                        image={ getEmptyPlaceholderIllustrations().newList }
                                        imageSize="tiny"
                                        action={
                                            !isReadOnly
                                                ? (
                                                    <PrimaryButton
                                                        size="small"
                                                        onClick={ openAddModal }
                                                        data-componentid={
                                                            `${componentId}-empty-add-issuer-config-button`
                                                        }
                                                    >
                                                        <PlusIcon />
                                                        { t(
                                                            "presentationDefinitions:editPage" +
                                                            ".issuerTrust.issuerConfig.addButton"
                                                        ) }
                                                    </PrimaryButton>
                                                )
                                                : undefined
                                        }
                                        subtitle={ [
                                            t(
                                                "presentationDefinitions:editPage.issuerTrust" +
                                                ".issuerConfig.emptyPlaceholder"
                                            )
                                        ] }
                                        data-componentid={
                                            `${componentId}-issuer-configs-empty-placeholder`
                                        }
                                    />
                                ) : (
                                    <>
                                        <style>{ `
                                            .pd-issuer-config-table.ui.table.data-table
                                                .data-table-row:hover {
                                                background: transparent !important;
                                                box-shadow: none !important;
                                                cursor: default !important;
                                            }
                                            .pd-issuer-config-table.ui.table.data-table
                                                .data-table-row:hover .data-table-cell {
                                                border-color: transparent !important;
                                                transition: none !important;
                                            }
                                        ` }</style>
                                        <DataTable<IssuerConfigInterface>
                                            className="pd-issuer-config-table"
                                            columns={ issuerConfigColumns }
                                            data={ issuerConfigs }
                                            actions={ issuerConfigActions }
                                            selectable={ false }
                                            showHeader={ false }
                                            isRowSelectable={ () => false }
                                            onRowClick={ () => undefined }
                                            data-componentid={
                                                `${componentId}-issuer-configs-table`
                                            }
                                        />
                                    </>
                                ) }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </EmphasizedSegment>

                { showIssuerConfigModal && (
                    <IssuerConfigModal
                        isOpen={ showIssuerConfigModal }
                        onClose={ (): void => setShowIssuerConfigModal(false) }
                        onSave={ handleSaveIssuerConfig }
                        existingConfig={ editingIssuerConfig }
                        isSaving={ isSubmitting }
                        data-componentid={ `${componentId}-issuer-config-modal` }
                    />
                ) }
                { viewingCert && (
                    <CertificateViewModal
                        open={ viewingCert !== null }
                        onClose={ (): void => setViewingCert(null) }
                        certificate={ viewingCert }
                        data-componentid={ `${componentId}-cert-view-modal` }
                    />
                ) }
            </ResourceTab.Pane>
        );
    };

    if (error) {
        return (
            <EmptyPlaceholder
                image={ getEmptyPlaceholderIllustrations().genericError }
                imageSize="tiny"
                subtitle={ [ t("presentationDefinitions:notifications.fetchDefinition.error.description") ] }
                title={ t("presentationDefinitions:notifications.fetchDefinition.error.message") }
                data-componentid={ `${ componentId }-error-placeholder` }
            />
        );
    }

    if (isLoading || !isFormReady) {
        return <ContentLoader />;
    }

    const panes = [
        {
            "data-tabid": "general",
            menuItem: t("presentationDefinitions:editPage.tabs.general"),
            render: renderGeneralTab
        },
        {
            "data-tabid": "claims",
            menuItem: t("presentationDefinitions:editPage.tabs.claims"),
            render: renderClaimsTab
        },
        {
            "data-tabid": "issuer-trust",
            menuItem: t("presentationDefinitions:editPage.tabs.issuerTrust"),
            render: renderIssuerTrustTab
        }
    ];

    return (
        <PageLayout
            pageTitle={ t("presentationDefinitions:editPage.title") }
            title={ definition?.displayName ?? t("presentationDefinitions:editPage.title") }
            description={ definition?.description }
            image={
                <AnimatedAvatar
                    name={ definition?.displayName ?? "P" }
                    size="tiny"
                    floated="left"
                />
            }
            data-componentid={ `${componentId}-page-layout` }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ true }
            backButton={ {
                "data-componentid": `${componentId}-page-back-button`,
                onClick: () => history.push(AppConstants.getPaths().get("VP_DEFINITIONS")),
                text: t("presentationDefinitions:editPage.backButton")
            } }
        >
            <ResourceTab
                panes={ panes }
                defaultActiveIndex={ defaultTabIndex }
                data-componentid={ `${componentId}-tabs` }
            />

            { showDeleteModal && (
                <ConfirmationModal
                    data-componentid={ `${componentId}-delete-definition-modal` }
                    onClose={ () => setShowDeleteModal(false) }
                    type="negative"
                    open={ showDeleteModal }
                    assertionHint={ t(
                        "presentationDefinitions:editPage.confirmations.deleteDefinition.assertionHint"
                    ) }
                    assertionType="checkbox"
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ () => setShowDeleteModal(false) }
                    onPrimaryActionClick={ handleDeleteDefinition }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header>
                        { t("presentationDefinitions:editPage.confirmations.deleteDefinition.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached negative>
                        { t("presentationDefinitions:editPage.confirmations.deleteDefinition.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        { t("presentationDefinitions:editPage.confirmations.deleteDefinition.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
            { showClaimMappedModal && (
                <ConfirmationModal
                    data-componentid={ `${componentId}-claim-mapped-modal` }
                    onClose={ () => setShowClaimMappedModal(false) }
                    type="negative"
                    open={ showClaimMappedModal }
                    secondaryAction={ t("common:close") }
                    onSecondaryActionClick={ () => setShowClaimMappedModal(false) }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header
                        data-componentid={ `${componentId}-claim-mapped-modal-header` }
                    >
                        { blockedClaimAction === "edit"
                            ? t("presentationDefinitions:editPage.confirmations" +
                                ".claimMappedInConnection.editHeader")
                            : t("presentationDefinitions:editPage.confirmations" +
                                ".claimMappedInConnection.deleteHeader")
                        }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        negative
                        data-componentid={ `${componentId}-claim-mapped-modal-message` }
                    >
                        { t("presentationDefinitions:editPage.confirmations" +
                            ".claimMappedInConnection.message"
                        ) }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content
                        data-componentid={ `${componentId}-claim-mapped-modal-content` }
                    >
                        { t("presentationDefinitions:editPage.confirmations" +
                            ".claimMappedInConnection.content",
                            {
                                action: blockedClaimAction === "edit" ? "editing" : "deleting"
                            }
                        ) }
                        <Box sx={ { mb: 1 } } />
                        <ol style={ { paddingLeft: "1.5em" } }>
                            { blockedClaimConnections.map((name: string, index: number) => (
                                <li key={ index }>{ name }</li>
                            )) }
                        </ol>
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
            { showDeleteBlockedModal && (
                <ConfirmationModal
                    data-componentid={ `${componentId}-delete-blocked-modal` }
                    onClose={ () => setShowDeleteBlockedModal(false) }
                    type="negative"
                    open={ showDeleteBlockedModal }
                    secondaryAction={ t("common:close") }
                    onSecondaryActionClick={ () => setShowDeleteBlockedModal(false) }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header
                        data-componentid={ `${componentId}-delete-blocked-modal-header` }
                    >
                        { t(
                            "presentationDefinitions:editPage.confirmations.deleteBlockedByConnections.header"
                        ) }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message
                        attached
                        negative
                        data-componentid={ `${componentId}-delete-blocked-modal-message` }
                    >
                        { t(
                            "presentationDefinitions:editPage.confirmations.deleteBlockedByConnections.message"
                        ) }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content
                        data-componentid={ `${componentId}-delete-blocked-modal-content` }
                    >
                        { t(
                            "presentationDefinitions:editPage.confirmations.deleteBlockedByConnections.content"
                        ) }
                        <Box sx={ { mb: 1 } } />
                        <ol style={ { paddingLeft: "1.5em" } }>
                            { isConnectionsLoading ? (
                                <ContentLoader />
                            ) : (
                                connectedIdpNames?.map((name: string, index: number) => (
                                    <li key={ index }>{ name }</li>
                                ))
                            ) }
                        </ol>
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </PageLayout>
    );
};

export default PresentationDefinitionEditPage;
