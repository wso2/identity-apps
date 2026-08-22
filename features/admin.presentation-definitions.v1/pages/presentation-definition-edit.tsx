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

import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import Box from "@oxygen-ui/react/Box";
import Checkbox from "@oxygen-ui/react/Checkbox";
import Chip from "@oxygen-ui/react/Chip";
import FormControl from "@oxygen-ui/react/FormControl";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import MuiGrid from "@oxygen-ui/react/Grid";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import Switch from "@oxygen-ui/react/Switch";
import MuiTextField from "@oxygen-ui/react/TextField";
import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { getCertificateIllustrations, getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { CertificateManagementConstants } from "@wso2is/core/constants";
import {
    AlertInterface,
    AlertLevels,
    CertificateValidity,
    DisplayCertificate,
    HttpErrorResponseDataInterface,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CertificateManagementUtils } from "@wso2is/core/utils";
import {
    AnimatedAvatar,
    AppAvatar,
    Certificate as CertificateDisplay,
    Code,
    ConfirmationModal,
    ContentLoader,
    CopyInputField,
    DangerZone,
    DangerZoneGroup,
    DataTable,
    EmptyPlaceholder,
    EmphasizedSegment,
    GenericIcon,
    Heading,
    Hint,
    LinkButton,
    PageLayout,
    PrimaryButton,
    ResourceTab,
    TableActionsInterface,
    TableColumnInterface,
    UserAvatar
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import dayjs, { Dayjs } from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import React, {
    FunctionComponent,
    KeyboardEvent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useCallback,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { Dispatch } from "redux";
import {
    Divider,
    Grid,
    Header,
    Icon,
    List,
    Modal,
    Popup,
    Segment,
    SemanticCOLORS,
    SemanticICONS
} from "semantic-ui-react";
import {
    deletePresentationDefinition,
    fetchConnectionClaimMappings,
    getConnectedIdps,
    updatePresentationDefinition
} from "../api/presentation-definitions";
import { useGetPresentationDefinition } from "../hooks/use-get-presentation-definition";
import {
    ClaimConstraintModelInterface,
    ConnectedIdpItemInterface,
    ConnectedIdpsResponseInterface,
    PresentationDefinitionInterface,
    PresentationDefinitionUpdateModelInterface,
    RequestedCredentialModelInterface
} from "../models/presentation-definitions";
import { AddIssuerCertificateModal } from "../components/add-issuer-certificate-modal";
import { AddTrustedCaModal } from "../components/add-trusted-ca-modal";
import { TrustedCaCertificatesList } from "../components/trusted-ca-certificates-list";

interface RouteParams {
    id: string;
}

type PresentationDefinitionEditPagePropsInterface = IdentifiableComponentInterface & RouteComponentProps<RouteParams>;

/**
 * Presentation Definition edit page with four tabs:
 * General, Settings, Claims, and Issuer Trust.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
const PresentationDefinitionEditPage: FunctionComponent<PresentationDefinitionEditPagePropsInterface> = ({
    match,
    "data-componentid": componentId = "presentation-definition-edit"
}: PresentationDefinitionEditPagePropsInterface): ReactElement => {

    const definitionId: string = match?.params?.id;
    const { t, i18n } = useTranslation();
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
    const [ connectedConnectionNames, setConnectedConnectionNames ] = useState<string[]>(undefined);
    const [ isConnectionsLoading, setIsConnectionsLoading ] = useState<boolean>(false);

    // General tab state
    const [ displayName, setDisplayName ] = useState<string>("");
    const [ description, setDescription ] = useState<string>("");

    const [ credentialId, setCredentialId ] = useState<string>("");

    // Settings tab state
    const [ credentialType, setCredentialType ] = useState<string>("");

    // Claims tab state
    const [ claims, setClaims ] = useState<ClaimConstraintModelInterface[]>([]);
    const [ showClaimModal, setShowClaimModal ] = useState<boolean>(false);
    const [ claimModalIndex, setClaimModalIndex ] = useState<number | null>(null);
    const [ modalPath, setModalPath ] = useState<string>("");
    const [ modalMandatory, setModalMandatory ] = useState<boolean>(true);
    const [ modalAllowedValues, setModalAllowedValues ] = useState<string[]>([]);

    // Claim-blocked-by-mapping modal state
    const [ claimMappingConnections, setClaimMappingConnections ] =
        useState<Map<string, string[]>>(new Map());
    const [ showClaimMappedModal, setShowClaimMappedModal ] = useState<boolean>(false);
    const [ blockedClaimAction, setBlockedClaimAction ] = useState<"delete" | "edit">("edit");
    const [ blockedClaimConnections, setBlockedClaimConnections ] = useState<string[]>([]);
    const [ blockedClaimPath, setBlockedClaimPath ] = useState<string>("");

    // Issuer Trust tab state
    const [ keyResolutionMethod, setKeyResolutionMethod ] = useState<string>("x5c");
    const [ enforceTrustedIssuer, setEnforceTrustedIssuer ] = useState<boolean>(false);
    const [ jwksUri, setJwksUri ] = useState<string>("");
    const [ issuerPem, setIssuerPem ] = useState<string>("");
    const [ trustedCaPems, setTrustedCaPems ] = useState<string[]>([]);
    const [ showAddCertModal, setShowAddCertModal ] = useState<boolean>(false);
    const [ showAddIssuerCertModal, setShowAddIssuerCertModal ] = useState<boolean>(false);
    const [ issuerCertDisplay, setIssuerCertDisplay ] = useState<DisplayCertificate>(null);
    const [ showIssuerCertModal, setShowIssuerCertModal ] = useState<boolean>(false);

    const [ isFormReady, setIsFormReady ] = useState<boolean>(false);

    const { data: definition, isLoading, error } = useGetPresentationDefinition(definitionId, true);

    useEffect(() => {
        if (error) {
            dispatch(addAlert<AlertInterface>({
                description: t("presentationDefinitions:notifications.fetchDefinition.error.description"),
                level: AlertLevels.ERROR,
                message: t("presentationDefinitions:notifications.fetchDefinition.error.message")
            }));
        }
    }, [ error ]);

    useEffect(() => {
        if (!definition) return;

        const cred: RequestedCredentialModelInterface | undefined = definition.credentials?.[0];

        setDisplayName(definition.displayName ?? "");
        setDescription(definition.description ?? "");
        setCredentialId(cred?.id ?? "");
        setCredentialType(cred?.type ?? "");
        setClaims(
            (cred?.claims ?? []).map((c: ClaimConstraintModelInterface) => ({
                ...c,
                path: c.path ?? (c.name ? [ c.name ] : [ "" ])
            }))
        );
        setEnforceTrustedIssuer(cred?.enforceTrustedIssuer ?? false);
        setKeyResolutionMethod(cred?.keyResolutionMethod ?? "x5c");
        setJwksUri(cred?.jwksUri ?? "");
        setIssuerPem(cred?.issuerPem ?? "");
        setTrustedCaPems(cred?.trustedCaPems ?? []);
        setIsFormReady(true);
    }, [ definition ]);

    useEffect(() => {
        if (!definitionId) return;

        getConnectedIdps(definitionId)
            .then((response: ConnectedIdpsResponseInterface) => {
                const idps: ConnectedIdpItemInterface[] = response?.connectedIdps ?? [];

                if (idps.length === 0) {
                    setClaimMappingConnections(new Map());
                    return;
                }

                Promise.all(
                    idps.map((idp: ConnectedIdpItemInterface) =>
                        fetchConnectionClaimMappings(idp.idpId)
                            .then((data) => ({ idp, mappings: data?.mappings ?? [] }))
                            .catch(() => ({ idp, mappings: [] }))
                    )
                ).then((results) => {
                    const map: Map<string, string[]> = new Map();

                    for (const { idp, mappings } of results) {
                        for (const mapping of mappings) {
                            if (mapping.idpClaim) {
                                const existing: string[] = map.get(mapping.idpClaim) ?? [];

                                map.set(mapping.idpClaim, [ ...existing, idp.name ]);
                            }
                        }
                    }
                    setClaimMappingConnections(map);
                });
            })
            .catch(() => setClaimMappingConnections(new Map()));
    }, [ definitionId ]);

    const buildUpdatePayload = useCallback((claimsOverride?: ClaimConstraintModelInterface[]): PresentationDefinitionUpdateModelInterface => {
        const validClaims: ClaimConstraintModelInterface[] = (claimsOverride ?? claims)
            .map((c: ClaimConstraintModelInterface) => ({
                ...c,
                path: (c.path ?? []).map((s: string) => s.trim()).filter(Boolean)
            }))
            .filter((c: ClaimConstraintModelInterface) => (c.path ?? []).length > 0)
            .map((c: ClaimConstraintModelInterface) => ({
                allowedValues: (c.allowedValues ?? []).length > 0 ? c.allowedValues : undefined,
                id: c.id,
                mandatory: c.mandatory ?? true,
                path: c.path ?? []
            }));

        const credential: RequestedCredentialModelInterface = {
            claims: validClaims,
            enforceTrustedIssuer: keyResolutionMethod === "x5c" ? enforceTrustedIssuer : false,
            id: credentialId,
            issuerPem: keyResolutionMethod === "pem" ? (issuerPem.trim() || undefined) : undefined,
            jwksUri: keyResolutionMethod === "jwks_uri" ? (jwksUri.trim() || undefined) : undefined,
            keyResolutionMethod: keyResolutionMethod,
            trustedCaPems: keyResolutionMethod === "x5c"
                ? (trustedCaPems.length > 0 ? trustedCaPems : undefined)
                : undefined,
            type: credentialType
        };

        return {
            credentials: [ credential ],
            description: description.trim() || undefined,
            displayName: displayName.trim()
        };
    }, [ displayName, description, credentialId, credentialType, claims, enforceTrustedIssuer,
        keyResolutionMethod, jwksUri, issuerPem, trustedCaPems ]);

    const handleUpdate = useCallback((): void => {
        if (!displayName.trim()) return;
        setIsSubmitting(true);

        updatePresentationDefinition(definitionId, buildUpdatePayload())
            .then((updated: PresentationDefinitionInterface) => {
                const updatedCred: RequestedCredentialModelInterface | undefined =
                    updated.credentials?.find((c: RequestedCredentialModelInterface) => c.id === credentialId);

                setTrustedCaPems(updatedCred?.trustedCaPems ?? []);
                dispatch(addAlert<AlertInterface>({
                    description: t("presentationDefinitions:notifications.updateDefinition.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("presentationDefinitions:notifications.updateDefinition.success.message")
                }));
            })
            .catch((_error: AxiosError<HttpErrorResponseDataInterface>) => {
                dispatch(addAlert<AlertInterface>({
                    description: t("presentationDefinitions:notifications.updateDefinition.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("presentationDefinitions:notifications.updateDefinition.error.message")
                }));
            })
            .finally(() => setIsSubmitting(false));
    }, [ buildUpdatePayload, displayName ]);

    const handleAddCert = useCallback((pem: string): void => {
        setTrustedCaPems((prev: string[]) => [ ...prev, pem ]);
    }, []);

    const handleRemoveCert = useCallback((index: number): void => {
        setTrustedCaPems((prev: string[]) => prev.filter((_: string, i: number) => i !== index));
    }, []);

    const handleReplaceCert = useCallback((index: number, newPem: string): void => {
        setTrustedCaPems((prev: string[]) => prev.map((p: string, i: number) => i === index ? newPem : p));
    }, []);

    const handleDeleteInitiation = useCallback((): void => {
        setIsConnectionsLoading(true);
        getConnectedIdps(definitionId)
            .then((response: ConnectedIdpsResponseInterface) => {
                if (response?.count === 0) {
                    setShowDeleteModal(true);
                } else {
                    setConnectedConnectionNames(
                        (response?.connectedIdps ?? []).map((c) => c.name)
                    );
                    setShowDeleteBlockedModal(true);
                }
            })
            .catch(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t(
                        "presentationDefinitions:notifications.deleteDefinition.error.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t("presentationDefinitions:notifications.deleteDefinition.error.message")
                }));
            })
            .finally(() => setIsConnectionsLoading(false));
    }, [ definitionId ]);

    const getClaimMappingBlock = useCallback(
        (claimPath: string[]): string[] | null => {
            const names: string[] | undefined = claimMappingConnections.get((claimPath ?? []).join("."));

            return names && names.length > 0 ? names : null;
        },
        [ claimMappingConnections ]
    );

    const handleDeleteDefinition = useCallback((): void => {
        deletePresentationDefinition(definitionId)
            .then(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("presentationDefinitions:notifications.deleteDefinition.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("presentationDefinitions:notifications.deleteDefinition.success.message")
                }));
                history.push(AppConstants.getPaths().get("VP_DEFINITIONS"));
            })
            .catch(() => {
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
        setModalAllowedValues([]);
        setShowClaimModal(true);
    };

    const openEditClaimModal = (index: number): void => {
        const claim: ClaimConstraintModelInterface = claims[index];
        const claimPath: string = (claim.path ?? []).join(".");
        const mapped: string[] | null = getClaimMappingBlock(claim.path ?? []);

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
        setModalAllowedValues(claim.allowedValues ?? []);
        setShowClaimModal(true);
    };

    const saveClaimModal = (): void => {
        if (!modalPath.trim()) return;
        const updatedClaim: ClaimConstraintModelInterface = {
            allowedValues: modalAllowedValues.length > 0 ? modalAllowedValues : undefined,
            mandatory: modalMandatory,
            path: modalPath.trim().split(".")
        };

        const newClaims: ClaimConstraintModelInterface[] = claimModalIndex === null
            ? [ ...claims, updatedClaim ]
            : claims.map((c: ClaimConstraintModelInterface, i: number) =>
                i === claimModalIndex ? { ...c, ...updatedClaim } : c
            );

        setIsSubmitting(true);

        updatePresentationDefinition(definitionId, buildUpdatePayload(newClaims))
            .then((savedDefinition: PresentationDefinitionInterface) => {
                const savedCred: RequestedCredentialModelInterface | undefined =
                    savedDefinition.credentials?.find(
                        (c: RequestedCredentialModelInterface) => c.id === credentialId
                    );

                setClaims(newClaims);
                setTrustedCaPems(savedCred?.trustedCaPems ?? []);
                setShowClaimModal(false);
                dispatch(addAlert<AlertInterface>({
                    description: t("presentationDefinitions:notifications.updateDefinition.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("presentationDefinitions:notifications.updateDefinition.success.message")
                }));
            })
            .catch((_error: AxiosError<HttpErrorResponseDataInterface>) => {
                dispatch(addAlert<AlertInterface>({
                    description: t("presentationDefinitions:notifications.updateDefinition.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("presentationDefinitions:notifications.updateDefinition.error.message")
                }));
            })
            .finally(() => setIsSubmitting(false));
    };

    const removeClaim = (index: number): void => {
        const claim: ClaimConstraintModelInterface = claims[index];
        const mapped: string[] | null = getClaimMappingBlock(claim.path ?? []);

        if (mapped) {
            setBlockedClaimAction("delete");
            setBlockedClaimConnections(mapped);
            setBlockedClaimPath((claim.path ?? []).join("."));
            setShowClaimMappedModal(true);
            return;
        }

        const newClaims: ClaimConstraintModelInterface[] = claims.filter(
            (_: ClaimConstraintModelInterface, i: number) => i !== index
        );

        setClaims(newClaims);
        setIsSubmitting(true);

        updatePresentationDefinition(definitionId, buildUpdatePayload(newClaims))
            .then((savedDefinition: PresentationDefinitionInterface) => {
                const savedCred: RequestedCredentialModelInterface | undefined =
                    savedDefinition.credentials?.find(
                        (c: RequestedCredentialModelInterface) => c.id === credentialId
                    );

                setTrustedCaPems(savedCred?.trustedCaPems ?? []);
                dispatch(addAlert<AlertInterface>({
                    description: t("presentationDefinitions:notifications.updateDefinition.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("presentationDefinitions:notifications.updateDefinition.success.message")
                }));
            })
            .catch((_error: AxiosError<HttpErrorResponseDataInterface>) => {
                dispatch(addAlert<AlertInterface>({
                    description: t("presentationDefinitions:notifications.updateDefinition.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("presentationDefinitions:notifications.updateDefinition.error.message")
                }));
            })
            .finally(() => setIsSubmitting(false));
    };

    // ── Tab pane renderers ────────────────────────────────────────────────────

    const renderGeneralTab = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation attached={ false }>
            <EmphasizedSegment padded="very">
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                            <label className="form-label">
                                { t("presentationDefinitions:editPage.quickCopy.identifier.label") }
                            </label>
                            <div style={ { marginTop: "4px", marginBottom: "16px" } }>
                                <CopyInputField
                                    value={ definition?.identifier ?? "" }
                                    data-componentid={ `${componentId}-identifier-copy` }
                                />
                            </div>

                            <MuiTextField
                                fullWidth
                                required
                                size="small"
                                margin="dense"
                                label={ t("presentationDefinitions:editPage.form.displayName.label") }
                                placeholder={ t("presentationDefinitions:editPage.form.displayName.placeholder") }
                                value={ displayName }
                                onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                    setDisplayName(e.target.value)
                                }
                                InputProps={ { readOnly: isReadOnly } }
                                InputLabelProps={ { required: true } }
                                sx={ { mb: 2 } }
                                data-componentid={ `${componentId}-display-name-input` }
                            />
                            <MuiTextField
                                fullWidth
                                multiline
                                rows={ 3 }
                                size="small"
                                margin="dense"
                                label={ t("presentationDefinitions:editPage.form.description.label") }
                                placeholder={ t("presentationDefinitions:editPage.form.description.placeholder") }
                                value={ description }
                                onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                    setDescription(e.target.value)
                                }
                                InputProps={ { readOnly: isReadOnly } }
                                sx={ { mb: 2 } }
                                data-componentid={ `${componentId}-description-input` }
                            />
                            <MuiTextField
                                fullWidth
                                required
                                size="small"
                                margin="dense"
                                label={ t("presentationDefinitions:editPage.form.credentials.type.label") }
                                placeholder={ t(
                                    "presentationDefinitions:editPage.form.credentials.type.placeholder"
                                ) }
                                value={ credentialType }
                                onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                    setCredentialType(e.target.value)
                                }
                                InputProps={ { readOnly: isReadOnly } }
                                InputLabelProps={ { required: true } }
                                sx={ { mb: 2 } }
                                data-componentid={ `${componentId}-credential-type-input` }
                            />
                            <Divider hidden />

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

            <Divider hidden />

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
                    const pathLabel: string = (claim.path ?? []).join(".") || "—";

                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
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
                            <Header.Content>
                                { pathLabel }
                            </Header.Content>
                        </Header>
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
                    <Header as="h6" data-componentid={ `${componentId}-claim-mandatory-heading` }>
                        <Header.Content>
                            { claim.mandatory !== false
                                ? <Icon name="check" color="green" />
                                : <Icon name="minus" color="grey" />
                            }
                        </Header.Content>
                    </Header>
                ),
                title: t("presentationDefinitions:editPage.form.credentials.claims.required.label")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "allowedValues",
                id: "allowedValues",
                key: "allowedValues",
                render: (claim: ClaimConstraintModelInterface): ReactNode => (
                    <div style={ { display: "flex", flexWrap: "wrap", gap: "4px" } }>
                        { (claim.allowedValues ?? []).length > 0
                            ? (claim.allowedValues ?? []).map((v: string, vi: number) => (
                                <Chip key={ vi } label={ v } size="small" />
                            ))
                            : <span style={ { color: "#aaa" } }>—</span>
                        }
                    </div>
                ),
                title: t("presentationDefinitions:editPage.form.credentials.claims.allowedValues.label")
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
                        <div style={ { alignItems: "center", display: "flex", justifyContent: "space-between" } }>
                            <Heading as="h4" style={ { marginBottom: 0 } }>
                                { t("presentationDefinitions:editPage.form.credentials.claims.label") }
                            </Heading>
                            { !isReadOnly && (
                                <PrimaryButton
                                    size="small"
                                    onClick={ openAddClaimModal }
                                    data-componentid={ `${componentId}-add-claim-button` }
                                >
                                    <Icon name="add" />
                                    { t("presentationDefinitions:editPage.form.credentials.claims.addClaim") }
                                </PrimaryButton>
                            ) }
                        </div>
                    ) : (
                        <Heading as="h4">
                            { t("presentationDefinitions:editPage.form.credentials.claims.label") }
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
                                        <Icon name="add" />
                                        { t(
                                            "presentationDefinitions:editPage.form.credentials.claims.addClaim"
                                        ) }
                                    </PrimaryButton>
                                )
                                : undefined
                        }
                        subtitle={ [
                            t(
                                "presentationDefinitions:editPage.form.credentials.claims.emptyPlaceholder"
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

            <Modal
                open={ showClaimModal }
                size="tiny"
                dimmer="blurring"
                onClose={ () => setShowClaimModal(false) }
                data-componentid={ `${componentId}-claim-modal` }
            >
                <Modal.Header>
                    { claimModalIndex === null
                        ? t(
                            "presentationDefinitions:editPage.form.credentials.claims.addClaim"
                        )
                        : t(
                            "presentationDefinitions:editPage.form.credentials.claims.editClaim"
                        )
                    }
                </Modal.Header>
                <Modal.Content>
                    <Box sx={ { mb: 2 } }>
                        <MuiTextField
                            required
                            size="small"
                            autoFocus
                            margin="dense"
                            sx={ { width: "90%" } }
                            InputLabelProps={ { required: true } }
                            label={ t(
                                "presentationDefinitions:editPage.form.credentials.claims.claimPath.label"
                            ) }
                            placeholder={ t(
                                "presentationDefinitions:editPage.form.credentials.claims.claimPath.placeholder"
                            ) }
                            value={ modalPath }
                            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setModalPath(e.target.value) }
                            data-componentid={ `${componentId}-modal-claim-path` }
                        />
                        <div style={ { marginTop: "6px" } }>
                            <Hint compact>
                                { t(
                                    "presentationDefinitions:editPage.form.credentials.claims.claimPath.hint"
                                ) }
                            </Hint>
                        </div>
                    </Box>
                    <Box sx={ { mb: 2 } }>
                        <FormControlLabel
                            sx={ { ml: "-4px" } }
                            control={ (
                                <Checkbox
                                    checked={ modalMandatory }
                                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                        setModalMandatory(e.target.checked)
                                    }
                                    sx={ { p: "2px" } }
                                    data-componentid={ `${componentId}-modal-claim-mandatory` }
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
                    <Box>
                        <Autocomplete
                            multiple
                            freeSolo
                            size="small"
                            sx={ { width: "90%" } }
                            options={ [] }
                            value={ modalAllowedValues }
                            onChange={ (
                                _e: React.SyntheticEvent,
                                newValue: string[]
                            ) => setModalAllowedValues(newValue) }
                            renderTags={ (value: string[], getTagProps) =>
                                value.map((option: string, index: number) => (
                                    <Chip
                                        { ...getTagProps({ index }) }
                                        key={ index }
                                        label={ option }
                                        size="small"
                                    />
                                ))
                            }
                            renderInput={ (params: AutocompleteRenderInputParams) => (
                                <MuiTextField
                                    { ...params }
                                    size="small"
                                    margin="dense"
                                    label={ t(
                                        "presentationDefinitions:editPage.form.credentials.claims.allowedValues.label"
                                    ) }
                                    placeholder={ modalAllowedValues.length === 0
                                        ? t(
                                            "presentationDefinitions:editPage.form.credentials.claims.allowedValues.placeholder"
                                        )
                                        : undefined
                                    }
                                    data-componentid={ `${componentId}-modal-allowed-value-input` }
                                />
                            ) }
                            data-componentid={ `${componentId}-modal-allowed-values` }
                        />
                        <div style={ { marginTop: "6px" } }>
                            <Hint compact>
                                { t(
                                    "presentationDefinitions:editPage.form.credentials.claims.allowedValues.hint"
                                ) }
                            </Hint>
                        </div>
                    </Box>
                </Modal.Content>
                <Modal.Actions>
                    <Grid>
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 } textAlign="left">
                                <LinkButton
                                    floated="left"
                                    onClick={ () => setShowClaimModal(false) }
                                    data-componentid={ `${componentId}-modal-cancel-button` }
                                >
                                    { t("common:cancel") }
                                </LinkButton>
                            </Grid.Column>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 } textAlign="right">
                                <PrimaryButton
                                    floated="right"
                                    disabled={ !modalPath.trim() || isSubmitting }
                                    loading={ isSubmitting }
                                    onClick={ saveClaimModal }
                                    data-componentid={ `${componentId}-modal-save-button` }
                                >
                                    { claimModalIndex === null ? t("common:add") : t("common:update") }
                                </PrimaryButton>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Actions>
            </Modal>
        </ResourceTab.Pane>
        );
    };

    const renderIssuerTrustTab = (): ReactElement => {

        const x5cSubSection: ReactNode = (
            <>
                <FormControlLabel
                    control={ (
                        <Switch
                            checked={ enforceTrustedIssuer }
                            onChange={ (
                                _event: React.ChangeEvent<HTMLInputElement>,
                                checked: boolean
                            ) => setEnforceTrustedIssuer(checked) }
                            data-componentid={ `${componentId}-enforce-trusted-issuer-toggle` }
                        />
                    ) }
                    label={ t(
                        "presentationDefinitions:editPage.issuerTrust.enforceTrustedIssuer.label"
                    ) }
                />
                <div style={ { marginTop: "6px" } }>
                    <Hint compact>
                        { t(
                            "presentationDefinitions:editPage.issuerTrust.enforceTrustedIssuer.hint"
                        ) }
                    </Hint>
                </div>

                <AnimatePresence>
                { enforceTrustedIssuer && (
                <motion.div
                    key="trusted-ca-block"
                    initial={ { height: 0, opacity: 0 } }
                    animate={ { height: "auto", opacity: 1 } }
                    exit={ { height: 0, opacity: 0 } }
                    transition={ { duration: 0.3 } }
                    style={ { overflow: "hidden" } }
                >
                <Divider hidden />

                { trustedCaPems.length === 0 ? (
                    <Segment>
                        <EmptyPlaceholder
                            image={ getEmptyPlaceholderIllustrations().emptyList }
                            imageSize="tiny"
                            title={ t(
                                "presentationDefinitions:editPage.issuerTrust.trustedCas.emptyPlaceholder.title"
                            ) }
                            subtitle={ [
                                t(
                                    "presentationDefinitions:editPage.issuerTrust.trustedCas.emptyPlaceholder.subtitle0"
                                ),
                                t(
                                    "presentationDefinitions:editPage.issuerTrust.trustedCas.emptyPlaceholder.subtitle1"
                                )
                            ] }
                            action={ !isReadOnly && (
                                <PrimaryButton
                                    size="small"
                                    onClick={ () => setShowAddCertModal(true) }
                                    type="button"
                                    data-componentid={ `${componentId}-empty-add-cert-button` }
                                >
                                    <Icon name="add" />
                                    { t(
                                        "presentationDefinitions:editPage.issuerTrust.trustedCas.addButton"
                                    ) }
                                </PrimaryButton>
                            ) }
                            data-componentid={ `${componentId}-trusted-ca-empty-placeholder` }
                        />
                    </Segment>
                ) : (
                    <Segment>
                        <MuiGrid direction="column" container spacing={ 2 }>
                            { !isReadOnly && (
                                <MuiGrid xs={ 12 }>
                                    <PrimaryButton
                                        floated="right"
                                        disabled={ !enforceTrustedIssuer }
                                        onClick={ () => setShowAddCertModal(true) }
                                        data-componentid={ `${componentId}-add-cert-button` }
                                    >
                                        <Icon name="add" />
                                        { t(
                                            "presentationDefinitions:editPage.issuerTrust.trustedCas.addButton"
                                        ) }
                                    </PrimaryButton>
                                </MuiGrid>
                            ) }
                            <MuiGrid xs={ 12 }>
                                <TrustedCaCertificatesList
                                    trustedCaPems={ trustedCaPems }
                                    onRemove={ handleRemoveCert }
                                    onReplace={ handleReplaceCert }
                                    isReadOnly={ !enforceTrustedIssuer || isReadOnly }
                                    data-componentid={ `${componentId}-trusted-ca-list` }
                                />
                            </MuiGrid>
                        </MuiGrid>
                    </Segment>
                ) }
                </motion.div>
                ) }
                </AnimatePresence>
            </>
        );

        const jwksUriSubSection: ReactNode = (
            <>
                <MuiTextField
                    fullWidth
                    size="small"
                    placeholder={ t(
                        "presentationDefinitions:editPage.issuerTrust.jwksUri.placeholder"
                    ) }
                    value={ jwksUri }
                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setJwksUri(e.target.value) }
                    sx={ { mb: 0.5 } }
                    data-componentid={ `${componentId}-jwks-uri-input` }
                />
                <Hint compact>
                    { t(
                        "presentationDefinitions:editPage.issuerTrust.jwksUri.hint"
                    ) }
                </Hint>
            </>
        );

        const parsedIssuerCert: DisplayCertificate | null = issuerPem
            ? (CertificateManagementUtils.canSafelyParseCertificate(issuerPem)
                ? CertificateManagementUtils.displayCertificate(null, issuerPem)
                : CertificateManagementConstants.DUMMY_DISPLAY_CERTIFICATE)
            : null;

        const issuerCertValidityLabel = (): ReactElement => {
            if (!parsedIssuerCert || parsedIssuerCert.infoUnavailable) {
                return (
                    <span className="with-muted-list-item-header">
                        { t("presentationDefinitions:editPage.issuerTrust.certificate.infoUnavailable") }
                    </span>
                );
            }
            let icon: SemanticICONS;
            let iconColor: SemanticCOLORS;
            const expiryDate: Dayjs = dayjs(parsedIssuerCert.validTill);
            const validity: CertificateValidity = CertificateManagementUtils.determineCertificateValidityState({
                from: parsedIssuerCert.validFrom,
                to: parsedIssuerCert.validTill
            });

            switch (validity) {
                case CertificateValidity.VALID:
                    icon = "check circle";
                    iconColor = "green";
                    break;
                case CertificateValidity.WILL_EXPIRE_SOON:
                    icon = "exclamation circle";
                    iconColor = "yellow";
                    break;
                default:
                    icon = "times circle";
                    iconColor = "red";
            }

            return (
                <>
                    { CertificateManagementUtils.searchIssuerDNAlias(parsedIssuerCert.issuerDN) }
                    { " " }
                    <Popup
                        trigger={ <Icon name={ icon } color={ iconColor } /> }
                        content={ t("presentationDefinitions:editPage.issuerTrust.certificate.expiryDate", {
                            date: expiryDate.toDate().toLocaleDateString(i18n.language)
                        }) }
                        inverted
                        position="top left"
                        size="mini"
                    />
                </>
            );
        };

        const pemSubSection: ReactNode = (
            <>
                { parsedIssuerCert ? (
                    <EmphasizedSegment>
                        <div style={ { alignItems: "center", display: "flex", gap: "1em" } }>
                            <UserAvatar
                                name={
                                    parsedIssuerCert.infoUnavailable
                                        ? CertificateManagementConstants.QUESTION_MARK
                                        : CertificateManagementUtils.searchIssuerDNAlias(
                                            parsedIssuerCert.issuerDN)
                                }
                                size="mini"
                                floated="left"
                            />
                            <div style={ { flex: 1 } }>
                                <div>{ issuerCertValidityLabel() }</div>
                                { !parsedIssuerCert.infoUnavailable && (
                                    <div style={ { color: "grey", fontSize: "13px" } }>
                                        { CertificateManagementUtils.getValidityPeriodInHumanReadableFormat(
                                            parsedIssuerCert.validFrom,
                                            parsedIssuerCert.validTill
                                        ) }
                                    </div>
                                ) }
                            </div>
                            <div style={ { display: "flex", gap: "8px", marginLeft: "1em" } }>
                                { !isReadOnly && (
                                    <Popup
                                        trigger={
                                            <Icon
                                                link
                                                name="pencil"
                                                size="small"
                                                color="grey"
                                                className="list-icon"
                                                onClick={ () => setShowAddIssuerCertModal(true) }
                                                data-componentid={ `${componentId}-change-cert-button` }
                                            />
                                        }
                                        content={ t("presentationDefinitions:editPage.issuerTrust.certificate.actions.change") }
                                        inverted
                                        position="top center"
                                        size="mini"
                                    />
                                ) }
                                { !parsedIssuerCert.infoUnavailable && (
                                    <Popup
                                        trigger={
                                            <Icon
                                                link
                                                name="eye"
                                                size="small"
                                                color="grey"
                                                className="list-icon"
                                                onClick={ () => {
                                                    setIssuerCertDisplay(parsedIssuerCert);
                                                    setShowIssuerCertModal(true);
                                                } }
                                                data-componentid={ `${componentId}-view-cert-button` }
                                            />
                                        }
                                        content={ t("presentationDefinitions:editPage.issuerTrust.certificate.actions.view") }
                                        inverted
                                        position="top center"
                                        size="mini"
                                    />
                                ) }
                                { !isReadOnly && (
                                    <Popup
                                        trigger={
                                            <Icon
                                                link
                                                name="trash alternate"
                                                size="small"
                                                color="grey"
                                                className="list-icon"
                                                onClick={ () => setIssuerPem("") }
                                                data-componentid={ `${componentId}-delete-cert-button` }
                                            />
                                        }
                                        content={ t("presentationDefinitions:editPage.issuerTrust.certificate.actions.delete") }
                                        inverted
                                        position="top center"
                                        size="mini"
                                    />
                                ) }
                            </div>
                        </div>
                    </EmphasizedSegment>
                ) : (
                    <Segment>
                        <EmptyPlaceholder
                            image={ getEmptyPlaceholderIllustrations().emptyList }
                            imageSize="tiny"
                            title={ t(
                                "presentationDefinitions:editPage.issuerTrust." +
                                "issuerPem.emptyPlaceholder.title"
                            ) }
                            subtitle={ [
                                t(
                                    "presentationDefinitions:editPage.issuerTrust." +
                                    "issuerPem.emptyPlaceholder.subtitle"
                                )
                            ] }
                            action={ !isReadOnly && (
                                <PrimaryButton
                                    size="small"
                                    onClick={ () => setShowAddIssuerCertModal(true) }
                                    data-componentid={
                                        `${componentId}-add-pem-button`
                                    }
                                >
                                    <Icon name="add" />
                                    { t(
                                        "presentationDefinitions:editPage.issuerTrust." +
                                        "issuerPem.addButton"
                                    ) }
                                </PrimaryButton>
                            ) }
                            data-componentid={
                                `${componentId}-issuer-pem-empty-placeholder`
                            }
                        />
                    </Segment>
                ) }
                { showIssuerCertModal && issuerCertDisplay && (
                    <Modal
                        closeOnDimmerClick
                        className="certificate-display"
                        dimmer="blurring"
                        size="tiny"
                        open={ showIssuerCertModal }
                        onClose={ () => setShowIssuerCertModal(false) }
                        data-componentid={ `${componentId}-view-cert-modal` }
                    >
                        <Modal.Header>
                            <div className="certificate-ribbon">
                                <GenericIcon
                                    inline
                                    transparent
                                    size="auto"
                                    icon={ getCertificateIllustrations().ribbon }
                                />
                                <div className="certificate-alias">
                                    { t(
                                        "presentationDefinitions:editPage.issuerTrust.certificate.modal.title",
                                        {
                                            alias: issuerCertDisplay.alias
                                                ? issuerCertDisplay.alias
                                                : issuerCertDisplay.issuerDN
                                                    ? CertificateManagementUtils.searchIssuerDNAlias(
                                                        issuerCertDisplay.issuerDN)
                                                    : CertificateManagementConstants.QUESTION_MARK
                                        }
                                    ) }
                                </div>
                                <br/>
                                <div className="certificate-serial">
                                    { t(
                                        "presentationDefinitions:editPage.issuerTrust.certificate.modal.serialNumber",
                                        { serialNumber: issuerCertDisplay.serialNumber }
                                    ) }
                                </div>
                            </div>
                        </Modal.Header>
                        <Modal.Content className="certificate-content">
                            { issuerCertDisplay.infoUnavailable ? (
                                <Segment className="certificate">
                                    <p className="certificate-field">
                                        { t(
                                            "presentationDefinitions:editPage.issuerTrust.certificate.modal.unsupportedPrefix"
                                        ) }{ " " }
                                        { CertificateManagementConstants.SUPPORTED_KEY_ALGORITHMS.map(
                                            (algo: string, idx: number) => (
                                                <span key={ `${algo}+${idx}` }>
                                                    <Code>{ algo }</Code>&nbsp;
                                                </span>
                                            ))
                                        }{ " " }
                                        { t(
                                            "presentationDefinitions:editPage.issuerTrust.certificate.modal.unsupportedSuffix"
                                        ) }
                                    </p>
                                </Segment>
                            ) : (
                                <CertificateDisplay
                                    certificate={ issuerCertDisplay }
                                    labels={ {
                                        issuerDN: t("certificates:keystore.summary.issuerDN"),
                                        subjectDN: t("certificates:keystore.summary.subjectDN"),
                                        validFrom: t("certificates:keystore.summary.validFrom"),
                                        validTill: t("certificates:keystore.summary.validTill"),
                                        version: t("certificates:keystore.summary.version")
                                    } }
                                />
                            ) }
                        </Modal.Content>
                    </Modal>
                ) }
                { showAddIssuerCertModal && (
                    <AddIssuerCertificateModal
                        isOpen={ showAddIssuerCertModal }
                        onClose={ () => setShowAddIssuerCertModal(false) }
                        onAdd={ (pem: string) => setIssuerPem(pem) }
                        data-componentid={ `${componentId}-add-issuer-cert-modal` }
                    />
                ) }
            </>
        );

        return (
            <ResourceTab.Pane controlledSegmentation attached={ false }>
                <EmphasizedSegment padded="very">
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Heading as="h4">
                                    { t("presentationDefinitions:editPage.issuerTrust.heading") }
                                </Heading>
                                <Heading subHeading ellipsis as="h6">
                                    { t("presentationDefinitions:editPage.issuerTrust.hint") }
                                </Heading>

                                <Divider hidden />

                                <FormControl fullWidth>
                                    <RadioGroup
                                        name="key-resolution-method"
                                        value={ keyResolutionMethod }
                                        onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                            setKeyResolutionMethod(e.target.value)
                                        }
                                        data-componentid={ `${componentId}-key-resolution-method-group` }
                                    >
                                        <FormControlLabel
                                            value="x5c"
                                            control={ <Radio /> }
                                            label={ t(
                                                "presentationDefinitions:editPage.issuerTrust" +
                                                ".keyResolutionMethod.options.x5c"
                                            ) }
                                            data-componentid={ `${componentId}-krm-x5c` }
                                        />
                                        <AnimatePresence mode="wait">
                                            { keyResolutionMethod === "x5c" && (
                                                <motion.div
                                                    key="x5c-block"
                                                    initial={ { height: 0, opacity: 0 } }
                                                    animate={ { height: "auto", opacity: 1 } }
                                                    exit={ { height: 0, opacity: 0 } }
                                                    transition={ { duration: 0.3 } }
                                                    style={ { marginLeft: "2rem", overflow: "hidden" } }
                                                >
                                                    { x5cSubSection }
                                                </motion.div>
                                            ) }
                                        </AnimatePresence>
                                        <FormControlLabel
                                            value="jwks_uri"
                                            control={ <Radio /> }
                                            label={ t(
                                                "presentationDefinitions:editPage.issuerTrust" +
                                                ".keyResolutionMethod.options.jwks_uri"
                                            ) }
                                            data-componentid={ `${componentId}-krm-jwks-uri` }
                                        />
                                        <AnimatePresence mode="wait">
                                            { keyResolutionMethod === "jwks_uri" && (
                                                <motion.div
                                                    key="jwks-block"
                                                    initial={ { height: 0, opacity: 0 } }
                                                    animate={ { height: "auto", opacity: 1 } }
                                                    exit={ { height: 0, opacity: 0 } }
                                                    transition={ { duration: 0.3 } }
                                                    style={ { marginLeft: "2rem", overflow: "hidden" } }
                                                >
                                                    { jwksUriSubSection }
                                                </motion.div>
                                            ) }
                                        </AnimatePresence>
                                        <FormControlLabel
                                            value="pem"
                                            control={ <Radio /> }
                                            label={ t(
                                                "presentationDefinitions:editPage.issuerTrust" +
                                                ".keyResolutionMethod.options.pem"
                                            ) }
                                            data-componentid={ `${componentId}-krm-pem` }
                                        />
                                        <AnimatePresence mode="wait">
                                            { keyResolutionMethod === "pem" && (
                                                <motion.div
                                                    key="pem-block"
                                                    initial={ { height: 0, opacity: 0 } }
                                                    animate={ { height: "auto", opacity: 1 } }
                                                    exit={ { height: 0, opacity: 0 } }
                                                    transition={ { duration: 0.3 } }
                                                    style={ { marginLeft: "2rem", overflow: "hidden" } }
                                                >
                                                    { pemSubSection }
                                                </motion.div>
                                            ) }
                                        </AnimatePresence>
                                    </RadioGroup>
                                </FormControl>

                                <Divider hidden />
                                { !isReadOnly && (
                                    <PrimaryButton
                                        size="small"
                                        disabled={ isSubmitting }
                                        loading={ isSubmitting }
                                        onClick={ handleUpdate }
                                        data-componentid={ `${componentId}-issuer-trust-update-button` }
                                    >
                                        { t("common:update") }
                                    </PrimaryButton>
                                ) }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </EmphasizedSegment>

                { showAddCertModal && (
                    <AddTrustedCaModal
                        existingCertPems={ trustedCaPems }
                        onAdd={ handleAddCert }
                        isOpen={ showAddCertModal }
                        onClose={ () => setShowAddCertModal(false) }
                        data-componentid={ `${componentId}-add-cert-modal` }
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
                defaultActiveIndex={ 0 }
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
                        <Divider hidden />
                        <List ordered className="ml-6">
                            { blockedClaimConnections.map((name: string, index: number) => (
                                <List.Item key={ index }>{ name }</List.Item>
                            )) }
                        </List>
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
                    <ConfirmationModal.Header data-componentid={ `${componentId}-delete-blocked-modal-header` }>
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
                        <Divider hidden />
                        <List ordered className="ml-6">
                            { isConnectionsLoading ? (
                                <ContentLoader />
                            ) : (
                                connectedConnectionNames?.map((name: string, index: number) => (
                                    <List.Item key={ index }>{ name }</List.Item>
                                ))
                            ) }
                        </List>
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }
        </PageLayout>
    );
};

export default PresentationDefinitionEditPage;
