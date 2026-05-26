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

import Alert from "@oxygen-ui/react/Alert";
import Button from "@oxygen-ui/react/Button";
import Checkbox from "@oxygen-ui/react/Checkbox";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import Dialog from "@oxygen-ui/react/Dialog";
import DialogActions from "@oxygen-ui/react/DialogActions";
import DialogContent from "@oxygen-ui/react/DialogContent";
import DialogTitle from "@oxygen-ui/react/DialogTitle";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import {
    AccessConfigInterface,
    InFlowExtensionResponseInterface,
    InFlowExtensionUpdateRequestInterface
} from "../../models/in-flow-extension";
import updateInFlowExtension from "../../api/update-in-flow-extension";
import {
    FlowContextTree,
    AccessConfigOutput,
    EncryptionOutput,
    InFlowExtensionContextTreeResponse
} from "@wso2is/common.ui.shared-access.v1/components/flow-context-tree";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { FunctionComponent, ReactElement, useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import useInFlowExtensionContextTree from "../../api/use-in-flow-extension-context-tree";

/**
 * Props interface of {@link AccessConfigOverrideDialog}
 */
interface AccessConfigOverrideDialogPropsInterface extends IdentifiableComponentInterface {
    actionId: string;
    actionResponse?: InFlowExtensionResponseInterface;
    isActionLoading?: boolean;
    mutateAction?: () => void;
    flowType: string;
    open: boolean;
    onClose: () => void;
}

/**
 * Dialog for configuring per-flow-type access config overrides for an in-flow extension action.
 * Provides Reset, Save, and Cancel controls.
 *
 * @param props - Props injected to the component.
 * @returns AccessConfigOverrideDialog component.
 */
const AccessConfigOverrideDialog: FunctionComponent<AccessConfigOverrideDialogPropsInterface> = ({
    actionId,
    actionResponse,
    isActionLoading = false,
    mutateAction,
    flowType,
    open,
    onClose,
    "data-componentid": componentId = "access-config-override-dialog"
}: AccessConfigOverrideDialogPropsInterface): ReactElement => {
    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const [ isSaving, setIsSaving ] = useState<boolean>(false);
    const [ resetKey, setResetKey ] = useState<number>(0);
    const [ isResetDialogOpen, setIsResetDialogOpen ] = useState<boolean>(false);
    const [ resetOption, setResetOption ] = useState<"clear" | "default" | null>(null);
    const [ overrideAccessConfig, setOverrideAccessConfig ] =
        useState<AccessConfigInterface | null>(null);
    const accessConfigRef: React.MutableRefObject<AccessConfigInterface | null> =
        useRef<AccessConfigInterface | null>(null);
    const encryptionRef: React.MutableRefObject<{ certificate?: string } | null> =
        useRef<{ certificate?: string } | null>(null);

    // Tree is fetched server-side per the active flow type so the deployment.toml whitelist
    // and the per-flow-type policy flags (redirectionEnabled, allowReadOnlyClaimsModification)
    // apply automatically.
    const {
        data: contextTreeData,
        error: contextTreeError,
        isLoading: isContextTreeLoading
    } = useInFlowExtensionContextTree<InFlowExtensionContextTreeResponse>(flowType, open);

    const effectiveAccessConfig: AccessConfigInterface | undefined = useMemo(() => {
        if (overrideAccessConfig) {
            return overrideAccessConfig;
        }

        if (!actionResponse) {
            return undefined;
        }

        // Use flow-type override if available, otherwise fall back to default.
        return actionResponse.flowTypeOverrides?.[flowType] ?? actionResponse.accessConfig;
    }, [ actionResponse, flowType, overrideAccessConfig ]);

    const handleTreeChange = useCallback((accessConfig: AccessConfigOutput, encryption: EncryptionOutput) => {
        accessConfigRef.current = accessConfig;
        encryptionRef.current = encryption;
    }, []);

    const handleResetClick = (): void => {
        setIsResetDialogOpen(true);
    };

    const handleResetClose = (): void => {
        setIsResetDialogOpen(false);
        setResetOption(null);
    };

    const handleResetConfirm = (): void => {
        if (resetOption === "clear") {
            const emptyConfig: AccessConfigInterface = { expose: [], modify: [] };

            setOverrideAccessConfig(emptyConfig);
            accessConfigRef.current = emptyConfig;
        } else if (resetOption === "default") {
            const defaultConfig: AccessConfigInterface | undefined = actionResponse?.accessConfig;

            setOverrideAccessConfig(defaultConfig ?? { expose: [], modify: [] });
            accessConfigRef.current = defaultConfig ?? null;
        }
        setResetKey((prev: number) => prev + 1);
        handleResetClose();
    };

    const handleSave = useCallback(async () => {
        if (!accessConfigRef.current) {
            onClose();

            return;
        }

        setIsSaving(true);

        try {
            const updateBody: InFlowExtensionUpdateRequestInterface = {
                flowTypeOverrides: {
                    [flowType]: accessConfigRef.current
                }
            };

            if (encryptionRef.current?.certificate !== undefined) {
                updateBody.encryption = encryptionRef.current;
            }

            await updateInFlowExtension(actionId, updateBody);

            dispatch(
                addAlert({
                    description: "Access configuration updated successfully.",
                    level: AlertLevels.SUCCESS,
                    message: "Access config updated"
                })
            );

            mutateAction?.();
            onClose();
        } catch (error) {
            dispatch(
                addAlert({
                    description: "An error occurred while updating the access configuration.",
                    level: AlertLevels.ERROR,
                    message: "Update failed"
                })
            );
        } finally {
            setIsSaving(false);
        }
    }, [ actionId, flowType, onClose, dispatch, mutateAction ]);

    const hasCertificate: boolean = !!actionResponse?.encryption;

    return (
        <>
        <Dialog
            open={ open }
            onClose={ onClose }
            maxWidth={ false }
            data-componentid={ componentId }
            sx={ {
                "& .MuiDialog-paper": {
                    width: 1100
                }
            } }
        >
            <DialogTitle>Configure Access</DialogTitle>
            <DialogContent>
                { (isActionLoading || isContextTreeLoading) ? (
                    <Stack alignItems="center" py={ 4 }>
                        <CircularProgress />
                    </Stack>
                ) : contextTreeError || !contextTreeData ? (
                    <Stack alignItems="center" py={ 4 }>
                        <Typography color="error" variant="body2">
                            Failed to load the In-Flow Extension context tree for this
                            flow. Refresh and retry; check that the flow-management API
                            is reachable.
                        </Typography>
                    </Stack>
                ) : (
                    <Stack gap={ 2 } pt={ 1 }>
                        <Typography variant="body2" color="text.secondary">
                            Configure which data is exposed to and modifiable by the in-flow extension
                            for the { flowType?.toLowerCase()?.replace("_", " ") } flow.
                            This sets the flow-type-specific override for the access configuration.
                        </Typography>
                        { !hasCertificate && (
                            <Alert
                                severity="warning"
                                data-componentid={ `${componentId}-cert-warning` }
                            >
                                No certificate configured. Encryption toggles are disabled.
                                Add a certificate from the connection settings to enable encryption.
                            </Alert>
                        ) }
                        <FlowContextTree
                            key={ resetKey }
                            contextTree={ contextTreeData.contextTree }
                            initialAccessConfig={ effectiveAccessConfig }
                            hasCertificate={ hasCertificate }
                            allowReadOnlyClaimsModification={ contextTreeData.allowReadOnlyClaimsModification }
                            redirectionEnabled={ contextTreeData.redirectionEnabled }
                            onChange={ handleTreeChange }
                            data-componentid={ `${componentId}-flow-context-tree` }
                        />
                    </Stack>
                ) }
            </DialogContent>
            <DialogActions sx={ { justifyContent: "space-between" } }>
                <Button
                    onClick={ handleResetClick }
                    disabled={ isSaving || isActionLoading }
                    color="error"
                    size="small"
                >
                    Reset
                </Button>
                <Stack direction="row" spacing={ 1 }>
                    <Button onClick={ onClose } disabled={ isSaving }>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={ handleSave }
                        disabled={ isSaving || isActionLoading }
                    >
                        { isSaving ? "Saving..." : "Save" }
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
        <Dialog
            open={ isResetDialogOpen }
            onClose={ handleResetClose }
            maxWidth="sm"
            fullWidth
            data-componentid={ `${componentId}-reset-dialog` }
        >
            <DialogTitle
                data-componentid={ `${componentId}-reset-dialog-header` }
                sx={ { fontWeight: 600 } }
            >
                Reset Access Configuration
            </DialogTitle>
            <Alert
                severity="warning"
                sx={ { borderRadius: 0, mx: 0 } }
                data-componentid={ `${componentId}-reset-dialog-message` }
            >
                This action will overwrite the current access configuration for this flow type.
            </Alert>
            <DialogContent data-componentid={ `${componentId}-reset-dialog-content` }>
                <Typography variant="body2" sx={ { mb: 2, mt: 1 } }>
                    If clear all, every annotation done in the UI will be removed, and reset to the default will 
                    overwrite current state with default configuration from the connections. This action
                    will not take effect unless you save the changes.
                </Typography>
                <Stack spacing={ 1 }>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={ resetOption === "clear" }
                                onChange={ () => setResetOption("clear") }
                                size="small"
                            />
                        }
                        label={
                            <>
                                <Typography variant="body2" component="span" fontWeight={ 500 }>
                                    Clear All
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={ { display: "block" } }
                                >
                                    Remove all expose and modify paths for this flow type.
                                </Typography>
                            </>
                        }
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={ resetOption === "default" }
                                onChange={ () => setResetOption("default") }
                                size="small"
                            />
                        }
                        label={
                            <>
                                <Typography variant="body2" component="span" fontWeight={ 500 }>
                                    Reset to Default
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={ { display: "block" } }
                                >
                                    Restore the action&apos;s default access configuration.
                                </Typography>
                            </>
                        }
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={ { px: 3, pb: 2 } }>
                <Button onClick={ handleResetClose }>
                    { t("common:cancel") }
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    disabled={ !resetOption }
                    onClick={ handleResetConfirm }
                >
                    { t("common:confirm") }
                </Button>
            </DialogActions>
        </Dialog>
        </>
    );
};

export default AccessConfigOverrideDialog;
