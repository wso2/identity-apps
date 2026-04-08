/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import Button from "@oxygen-ui/react/Button";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import Dialog from "@oxygen-ui/react/Dialog";
import DialogActions from "@oxygen-ui/react/DialogActions";
import DialogContent from "@oxygen-ui/react/DialogContent";
import DialogTitle from "@oxygen-ui/react/DialogTitle";
import Divider from "@oxygen-ui/react/Divider";
import IconButton from "@oxygen-ui/react/IconButton";
import InputAdornment from "@oxygen-ui/react/InputAdornment";
import TextField from "@oxygen-ui/react/TextField";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { getAllLocalClaims } from "@wso2is/admin.claims.v1/api";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, Claim, ClaimsGetParams } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useMemo,
    useState
} from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { TreeNodeState } from "./models";

const EXPOSE_COLOR: string = "var(--tree-expose, #ff7300)";

/* ── Inline SVG icons ── */

const PlusIcon = (): ReactElement => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const MinusIcon = (): ReactElement => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const CloseIcon = (): ReactElement => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

export interface AddClaimModalProps {
    open: boolean;
    parentNode: TreeNodeState | null;
    existingClaimURIs: string[];
    externalClaims?: Claim[];
    onClose: () => void;
    onSubmit: (claims: Claim[]) => void;
    "data-componentid"?: string;
}

/**
 * Modal for bulk-selecting claims to add to the claims MAP node.
 * Shows a filterable scrollable list with +/- toggle selection and a bulk area below.
 */
const AddClaimModal: FunctionComponent<AddClaimModalProps> = ({
    open,
    parentNode,
    existingClaimURIs,
    externalClaims,
    onClose,
    onSubmit,
    "data-componentid": componentId = "add-claim-modal"
}: AddClaimModalProps): ReactElement => {

    const [ allClaims, setAllClaims ] = useState<Claim[]>([]);
    const [ selectedClaims, setSelectedClaims ] = useState<Claim[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ searchTerm, setSearchTerm ] = useState<string>("");

    const dispatch: Dispatch = useDispatch();

    // Fetch all local claims when modal opens (skip if external claims are provided).
    useEffect(() => {
        if (!open) return;

        if (externalClaims && externalClaims.length > 0) {
            setAllClaims(externalClaims);

            return;
        }

        const params: ClaimsGetParams = {
            "exclude-hidden-claims": true,
            "exclude-identity-claims": true,
            filter: null,
            limit: null,
            offset: null,
            sort: null
        };

        setIsLoading(true);
        getAllLocalClaims(params)
            .then((response: Claim[]) => {
                const sorted: Claim[] = (response || []).sort((a: Claim, b: Claim) =>
                    (a.displayName || "").localeCompare(b.displayName || "")
                );

                setAllClaims(sorted);
            })
            .catch((error: IdentityAppsApiException) => {
                dispatch(addAlert({
                    description: error?.response?.data?.description
                        || "Failed to retrieve local claims.",
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message
                        || "Error fetching claims"
                }));
            })
            .finally(() => setIsLoading(false));
    }, [ open ]);

    // Reset when modal opens.
    useEffect(() => {
        if (open) {
            setSelectedClaims([]);
            setSearchTerm("");
        }
    }, [ open ]);

    const selectedURIs: Set<string> = useMemo(
        () => new Set(selectedClaims.map((c: Claim) => c.claimURI)),
        [ selectedClaims ]
    );

    // Claims available to pick (not already in the tree).
    const availableClaims: Claim[] = useMemo(
        () => allClaims.filter((c: Claim) => !existingClaimURIs.includes(c.claimURI)),
        [ allClaims, existingClaimURIs ]
    );

    // Apply search filter on displayName + claimURI.
    const filteredClaims: Claim[] = useMemo(() => {
        if (!searchTerm.trim()) return availableClaims;

        const term: string = searchTerm.toLowerCase();

        return availableClaims.filter(
            (c: Claim) =>
                (c.displayName || "").toLowerCase().includes(term) ||
                (c.claimURI || "").toLowerCase().includes(term)
        );
    }, [ availableClaims, searchTerm ]);

    const handleToggleClaim = (claim: Claim): void => {
        if (selectedURIs.has(claim.claimURI)) {
            setSelectedClaims((prev: Claim[]) =>
                prev.filter((c: Claim) => c.claimURI !== claim.claimURI)
            );
        } else {
            setSelectedClaims((prev: Claim[]) => [ ...prev, claim ]);
        }
    };

    const handleRemoveFromBulk = (claimURI: string): void => {
        setSelectedClaims((prev: Claim[]) =>
            prev.filter((c: Claim) => c.claimURI !== claimURI)
        );
    };

    const handleSubmit = (): void => {
        if (selectedClaims.length === 0) return;
        onSubmit(selectedClaims);
    };

    const handleClose = (): void => {
        setSelectedClaims([]);
        setSearchTerm("");
        onClose();
    };

    return (
        <Dialog
            open={ open }
            onClose={ handleClose }
            maxWidth="sm"
            fullWidth
            data-componentid={ componentId }
            PaperProps={ {
                sx: { border: "1px solid", borderColor: "grey.200", borderRadius: "10px" }
            } }
        >
            <DialogTitle sx={ { color: "text.secondary", fontSize: 13, fontWeight: 600, pb: 0.5 } }>
                Add Claims
                <Typography sx={ { color: "text.disabled", fontSize: 11, fontWeight: 400, mt: 0.3 } }>
                    Search and select claims to add to the claims map.
                    Read-only claims will only support expose.
                </Typography>
            </DialogTitle>
            <DialogContent sx={ { pt: "12px !important" } }>
                { /* ── Search field ── */ }
                <TextField
                    fullWidth
                    size="small"
                    value={ searchTerm }
                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                        setSearchTerm(e.target.value)
                    }
                    placeholder="Search claims by name or URI..."
                    InputProps={ {
                        startAdornment: (
                            <InputAdornment position="start" sx={ { ml: 0.5, opacity: 0.45 } }>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            </InputAdornment>
                        )
                    } }
                    sx={ {
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "7px",
                            fontSize: 12
                        }
                    } }
                    data-componentid={ `${componentId}-search` }
                />

                { /* ── Scrollable claim list ── */ }
                <Box sx={ {
                    border: "1px solid",
                    borderColor: "grey.200",
                    borderRadius: "8px",
                    maxHeight: 260,
                    minHeight: 100,
                    mt: 1.5,
                    overflowY: "auto",
                    scrollbarColor: "#adb2b6 #f1f1f1",
                    scrollbarWidth: "thin"
                } }>
                    { isLoading && (
                        <Box sx={ { display: "flex", justifyContent: "center", py: 4 } }>
                            <CircularProgress size={ 24 } />
                        </Box>
                    ) }
                    { !isLoading && filteredClaims.length === 0 && (
                        <Typography sx={ {
                            color: "text.disabled",
                            fontSize: 11,
                            py: 4,
                            textAlign: "center"
                        } }>
                            { searchTerm ? "No claims match your search." : "No claims available." }
                        </Typography>
                    ) }
                    { !isLoading && filteredClaims.map((claim: Claim) => {
                        const isSelected: boolean = selectedURIs.has(claim.claimURI);

                        return (
                            <Box
                                key={ claim.id || claim.claimURI }
                                sx={ {
                                    "&:hover": { bgcolor: isSelected ? "rgba(255,115,0,0.06)" : "grey.50" },
                                    alignItems: "center",
                                    bgcolor: isSelected ? "rgba(255,115,0,0.04)" : "transparent",
                                    borderBottom: "1px solid",
                                    borderColor: "grey.100",
                                    display: "flex",
                                    gap: 1,
                                    justifyContent: "space-between",
                                    px: 1.5,
                                    py: 0.7
                                } }
                            >
                                <Box sx={ { minWidth: 0, overflow: "hidden" } }>
                                    <Box sx={ { alignItems: "center", display: "flex", gap: 0.8 } }>
                                        <Typography sx={ {
                                            fontSize: 12,
                                            fontWeight: isSelected ? 600 : 500,
                                            lineHeight: 1.3
                                        } }>
                                            { claim.displayName }
                                        </Typography>
                                        { claim.readOnly && (
                                            <Typography sx={ {
                                                bgcolor: "grey.100",
                                                borderRadius: "3px",
                                                color: "text.disabled",
                                                fontSize: 8,
                                                fontWeight: 600,
                                                lineHeight: 1,
                                                px: "4px",
                                                py: "2px"
                                            } }>
                                                READ-ONLY
                                            </Typography>
                                        ) }
                                    </Box>
                                    <Typography sx={ {
                                        color: "text.disabled",
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: 9,
                                        lineHeight: 1.3,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap"
                                    } }>
                                        { claim.claimURI }
                                    </Typography>
                                </Box>
                                <Tooltip title={ isSelected ? "Remove" : "Add" } placement="top">
                                    <IconButton
                                        size="small"
                                        onClick={ () => handleToggleClaim(claim) }
                                        sx={ {
                                            "&:hover": {
                                                bgcolor: isSelected
                                                    ? "rgba(192,57,43,0.08)" : "rgba(255,115,0,0.1)",
                                                color: isSelected ? "error.main" : EXPOSE_COLOR
                                            },
                                            color: isSelected ? "error.light" : "grey.400",
                                            flexShrink: 0,
                                            p: "4px"
                                        } }
                                    >
                                        { isSelected ? <MinusIcon /> : <PlusIcon /> }
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        );
                    }) }
                </Box>

                { /* ── Bulk area: selected claims ── */ }
                { selectedClaims.length > 0 && (
                    <Box sx={ { mt: 2 } }>
                        <Box sx={ {
                            alignItems: "center",
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 0.8
                        } }>
                            <Typography sx={ {
                                color: "text.secondary",
                                fontSize: 10,
                                fontWeight: 600,
                                letterSpacing: "0.07em",
                                textTransform: "uppercase"
                            } }>
                                To be added ({ selectedClaims.length })
                            </Typography>
                            <Button
                                size="small"
                                variant="text"
                                onClick={ () => setSelectedClaims([]) }
                                sx={ { color: "text.disabled", fontSize: 10, minWidth: 0 } }
                            >
                                Clear All
                            </Button>
                        </Box>
                        <Box sx={ {
                            border: "1px solid",
                            borderColor: "grey.200",
                            borderRadius: "8px",
                            maxHeight: 150,
                            overflowY: "auto",
                            scrollbarColor: "#adb2b6 #f1f1f1",
                            scrollbarWidth: "thin"
                        } }>
                            { selectedClaims.map((claim: Claim) => (
                                <Box
                                    key={ claim.claimURI }
                                    sx={ {
                                        "&:hover": { bgcolor: "grey.50" },
                                        alignItems: "center",
                                        borderBottom: "1px solid",
                                        borderColor: "grey.100",
                                        display: "flex",
                                        gap: 1,
                                        justifyContent: "space-between",
                                        px: 1.5,
                                        py: 0.6
                                    } }
                                >
                                    <Box sx={ { minWidth: 0, overflow: "hidden" } }>
                                        <Typography sx={ { fontSize: 11, fontWeight: 500, lineHeight: 1.3 } }>
                                            { claim.displayName }
                                        </Typography>
                                        <Typography sx={ {
                                            color: "text.disabled",
                                            fontFamily: "'JetBrains Mono', monospace",
                                            fontSize: 8.5,
                                            lineHeight: 1.3,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap"
                                        } }>
                                            { claim.claimURI }
                                        </Typography>
                                    </Box>
                                    <Tooltip title="Remove" placement="top">
                                        <IconButton
                                            size="small"
                                            onClick={ () => handleRemoveFromBulk(claim.claimURI) }
                                            sx={ {
                                                "&:hover": { color: "error.main" },
                                                color: "grey.400",
                                                flexShrink: 0,
                                                p: "3px"
                                            } }
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            )) }
                        </Box>
                    </Box>
                ) }
            </DialogContent>
            <Divider sx={ { borderColor: "grey.100" } } />
            <DialogActions sx={ { gap: 1, px: 2.5, py: 1.5 } }>
                <Button
                    onClick={ handleClose }
                    variant="outlined"
                    size="small"
                    sx={ {
                        "&:hover": { bgcolor: "grey.50" },
                        border: "1px solid",
                        borderColor: "grey.200",
                        borderRadius: "6px",
                        color: "text.secondary",
                        fontSize: 12,
                        fontWeight: 500,
                        px: 2
                    } }
                    data-componentid={ `${componentId}-cancel-button` }
                >
                    Cancel
                </Button>
                <Button
                    onClick={ handleSubmit }
                    variant="contained"
                    size="small"
                    disabled={ selectedClaims.length === 0 }
                    sx={ {
                        "&:hover": { bgcolor: "#E05E00" },
                        bgcolor: EXPOSE_COLOR,
                        borderRadius: "6px",
                        boxShadow: "0 1px 6px rgba(255,107,0,0.3)",
                        fontSize: 12,
                        fontWeight: 600,
                        px: 2
                    } }
                    data-componentid={ `${componentId}-submit-button` }
                >
                    Add Claims{ selectedClaims.length > 0 ? ` (${selectedClaims.length})` : "" }
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddClaimModal;
