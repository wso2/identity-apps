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
import Button from "@oxygen-ui/react/Button";
import Dialog from "@oxygen-ui/react/Dialog";
import DialogActions from "@oxygen-ui/react/DialogActions";
import DialogContent from "@oxygen-ui/react/DialogContent";
import DialogTitle from "@oxygen-ui/react/DialogTitle";
import Divider from "@oxygen-ui/react/Divider";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { getAllLocalClaims } from "@wso2is/admin.claims.v1/api";
import { AlertLevels, Claim, ClaimsGetParams } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, {
    FunctionComponent,
    HTMLAttributes,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { TreeNodeStateInterface } from "./models";

interface AddClaimModalProps {
    open: boolean;
    parentNode: TreeNodeStateInterface | null;
    existingClaimURIs: string[];
    externalClaims?: Claim[];
    /**
     * Whether the active flow type permits MODIFY on read-only claims. Drives the
     * informational badge per claim row. Defaults to true.
     */
    allowReadOnlyClaimsModification?: boolean;
    onClose: () => void;
    onSubmit: (claims: Claim[]) => void;
    "data-componentid"?: string;
}

/**
 * Claim picker for the claims container of the context tree. Renders the available local claims
 * in a searchable multi-select dropdown so an admin selects claims instead of typing claim URIs
 * by hand.
 *
 * @param props - Props injected to the component.
 * @returns The add-claim modal.
 */
const AddClaimModal: FunctionComponent<AddClaimModalProps> = ({
    open,
    parentNode: _parentNode,
    existingClaimURIs,
    externalClaims,
    allowReadOnlyClaimsModification = true,
    onClose,
    onSubmit,
    "data-componentid": componentId = "add-claim-modal"
}: AddClaimModalProps): ReactElement => {

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const [ allClaims, setAllClaims ] = useState<Claim[]>([]);
    const [ selectedClaims, setSelectedClaims ] = useState<Claim[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    // Load claims when the dialog opens — prefer the claims already fetched by the tree
    // (passed via `externalClaims`) and only fall back to the API when none were supplied.
    useEffect(() => {
        if (!open) {
            return;
        }

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
            .catch(() => {
                dispatch(addAlert({
                    description: t("flowExtension:contextTree.addClaimModal.fetchError.description"),
                    level: AlertLevels.ERROR,
                    message: t("flowExtension:contextTree.addClaimModal.fetchError.message")
                }));
            })
            .finally(() => setIsLoading(false));
    }, [ open, externalClaims ]);

    // Reset the selection whenever the dialog opens.
    useEffect(() => {
        if (open) {
            setSelectedClaims([]);
        }
    }, [ open ]);

    const availableClaims: Claim[] = useMemo(
        () => allClaims.filter((c: Claim) => !existingClaimURIs.includes(c.claimURI)),
        [ allClaims, existingClaimURIs ]
    );

    const handleClose = (): void => {
        setSelectedClaims([]);
        onClose();
    };

    const handleSubmit = (): void => {
        if (selectedClaims.length === 0) {
            return;
        }
        onSubmit(selectedClaims);
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
            sx={ {
                filter: "none !important"
            } }
        >
            <DialogTitle sx={ { pb: 0.5 } }>
                <Typography variant="subtitle2" sx={ { fontWeight: 600 } }>
                    { t("flowExtension:contextTree.addClaimModal.title") }
                </Typography>
                <Typography variant="caption" color="text.disabled">
                    { t("flowExtension:contextTree.addClaimModal.subtitle") }
                </Typography>
            </DialogTitle>
            <DialogContent sx={ { pt: "12px !important" } }>
                <Autocomplete
                    multiple
                    fullWidth
                    disableCloseOnSelect
                    loading={ isLoading }
                    options={ availableClaims }
                    value={ selectedClaims }
                    onChange={ (_event: SyntheticEvent, value: Claim[]) => setSelectedClaims(value) }
                    getOptionLabel={ (claim: Claim) => claim?.displayName || claim?.claimURI || "" }
                    isOptionEqualToValue={ (option: Claim, value: Claim) =>
                        option?.claimURI === value?.claimURI
                    }
                    noOptionsText={ t("flowExtension:contextTree.addClaimModal.noOptions") }
                    renderOption={ (props: HTMLAttributes<HTMLLIElement>, claim: Claim) => (
                        <li { ...props } key={ claim.id || claim.claimURI }>
                            <Box sx={ { minWidth: 0, overflow: "hidden", width: "100%" } }>
                                <Box sx={ { alignItems: "center", display: "flex", gap: 0.8 } }>
                                    <Typography variant="body2" sx={ { fontWeight: 500 } }>
                                        { claim.displayName }
                                    </Typography>
                                    { claim.readOnly && !allowReadOnlyClaimsModification && (
                                        <Typography
                                            variant="caption"
                                            sx={ {
                                                bgcolor: "grey.100",
                                                borderRadius: "3px",
                                                color: "text.disabled",
                                                fontWeight: 600,
                                                lineHeight: 1,
                                                px: "4px",
                                                py: "2px"
                                            } }
                                        >
                                            { t("flowExtension:contextTree.addClaimModal.readOnlyBadge") }
                                        </Typography>
                                    ) }
                                </Box>
                                <Typography
                                    variant="caption"
                                    color="text.disabled"
                                    sx={ {
                                        display: "block",
                                        fontFamily: "monospace",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap"
                                    } }
                                >
                                    { claim.claimURI }
                                </Typography>
                            </Box>
                        </li>
                    ) }
                    renderInput={ (params: AutocompleteRenderInputParams) => (
                        <TextField
                            { ...params }
                            size="small"
                            placeholder={ t("flowExtension:contextTree.addClaimModal.searchPlaceholder") }
                            data-componentid={ `${componentId}-search` }
                        />
                    ) }
                    data-componentid={ `${componentId}-select` }
                />
            </DialogContent>
            <Divider sx={ { borderColor: "grey.100" } } />
            <DialogActions sx={ { gap: 1, px: 2.5, py: 1.5 } }>
                <Button
                    onClick={ handleClose }
                    variant="outlined"
                    size="small"
                    data-componentid={ `${componentId}-cancel-button` }
                >
                    { t("flowExtension:contextTree.addClaimModal.cancelButton") }
                </Button>
                <Button
                    onClick={ handleSubmit }
                    variant="contained"
                    size="small"
                    disabled={ selectedClaims.length === 0 }
                    data-componentid={ `${componentId}-submit-button` }
                >
                    { t("flowExtension:contextTree.addClaimModal.addButton") }
                    { selectedClaims.length > 0 ? ` (${selectedClaims.length})` : "" }
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddClaimModal;
