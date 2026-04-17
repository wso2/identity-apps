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
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import updateAction from "@wso2is/admin.actions.v1/api/update-action";
import {
    AccessConfigInterface,
    InFlowExtensionActionResponseInterface,
    InFlowExtensionActionUpdateInterface
} from "@wso2is/admin.actions.v1/models/actions";
import {
    FlowContextTree,
    AccessConfigOutput,
    ContextTreeNodeMetadata,
    EncryptionOutput
} from "@wso2is/common.ui.shared-access.v1/components/flow-context-tree";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { FunctionComponent, ReactElement, useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import defaultContextTreeData from
    "@wso2is/admin.connections.v1/meta/default-flow-context-tree.json";

/**
 * Props interface of {@link AccessConfigOverrideDialog}
 */
export interface AccessConfigOverrideDialogPropsInterface extends IdentifiableComponentInterface {
    actionId: string;
    actionResponse?: InFlowExtensionActionResponseInterface;
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
    const [ isHelpOpen, setIsHelpOpen ] = useState<boolean>(false);
    const [ overrideAccessConfig, setOverrideAccessConfig ] =
        useState<AccessConfigInterface | null>(null);
    const accessConfigRef: React.MutableRefObject<AccessConfigInterface | null> =
        useRef<AccessConfigInterface | null>(null);
    const encryptionRef: React.MutableRefObject<{ certificate?: string } | null> =
        useRef<{ certificate?: string } | null>(null);

    const contextTreeMetadata: ContextTreeNodeMetadata[] =
        defaultContextTreeData.contextTree as ContextTreeNodeMetadata[];

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
    };

    const handleClearAll = (): void => {
        // Clear all annotations — set empty access config.
        const emptyConfig: AccessConfigInterface = { expose: [], modify: [] };

        setOverrideAccessConfig(emptyConfig);
        accessConfigRef.current = emptyConfig;
        setResetKey((prev: number) => prev + 1);
        handleResetClose();
    };

    const handleResetToDefault = (): void => {
        // Reset to the action's default access config.
        const defaultConfig: AccessConfigInterface | undefined = actionResponse?.accessConfig;

        setOverrideAccessConfig(defaultConfig ?? { expose: [], modify: [] });
        accessConfigRef.current = defaultConfig ?? null;
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
            const updateBody: InFlowExtensionActionUpdateInterface = {
                flowTypeOverrides: {
                    [flowType]: accessConfigRef.current
                }
            };

            if (encryptionRef.current?.certificate !== undefined) {
                updateBody.encryption = encryptionRef.current;
            }

            await updateAction<InFlowExtensionActionUpdateInterface>(
                "inFlowExtension",
                actionId,
                updateBody
            );

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

    const hasCertificate: boolean = !!actionResponse?.encryption?.certificate;

    return (
        <>
        <Dialog
            open={ open }
            onClose={ onClose }
            maxWidth={ false }
            data-componentid={ componentId }
            sx={ {
                "& .MuiDialog-paper": {
                    transition: "width 200ms ease",
                    width: isHelpOpen ? 1100 : 700
                }
            } }
        >
            <Box sx={ { display: "flex", minHeight: 0 } }>
                <Box sx={ { display: "flex", flexDirection: "column", flex: "0 0 700px", minHeight: 0 } }>
                    <DialogTitle>
                        Configure Access
                        <IconButton
                            size="small"
                            onClick={ () => setIsHelpOpen((prev: boolean) => !prev) }
                            sx={ { float: "right", fontSize: "0.85rem" } }
                            title={ isHelpOpen ? "Collapse help panel" : "Expand help panel" }
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                { isHelpOpen
                                    ? <><polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" /></>
                                    : <><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></>
                                }
                            </svg>
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        { isActionLoading ? (
                            <Stack alignItems="center" py={ 4 }>
                                <CircularProgress />
                            </Stack>
                        ) : (
                            <Stack gap={ 2 } pt={ 1 }>
                                <Typography variant="body2" color="text.secondary">
                                    Configure which data is exposed to and modifiable by the in-flow extension
                                    for the { flowType?.toLowerCase()?.replace("_", " ") } flow.
                                    This sets the flow-type-specific override for the access configuration.
                                </Typography>
                                { !hasCertificate && (
                                    <Typography
                                        variant="caption"
                                        color="warning.main"
                                        sx={ { display: "block" } }
                                    >
                                        No certificate configured. Encryption toggles are disabled.
                                        Add a certificate from the connection settings to enable encryption.
                                    </Typography>
                                ) }
                                <FlowContextTree
                                    key={ resetKey }
                                    contextTree={ contextTreeMetadata }
                                    initialAccessConfig={ effectiveAccessConfig }
                                    hasCertificate={ hasCertificate }
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
                </Box>
                { isHelpOpen && (
                    <Box
                        sx={ {
                            borderLeft: "1px solid #f5f5f5",
                            boxShadow: "-4px 0px 15px -8px #d6d6d6",
                            display: "flex",
                            flex: "1 1 auto",
                            flexDirection: "column",
                            minWidth: 0,
                            overflow: "auto"
                        } }
                    >
                        <Box
                            sx={ {
                                alignItems: "center",
                                backgroundColor: "#f1f1f1",
                                display: "flex",
                                height: 75,
                                px: 3
                            } }
                        >
                            <Typography variant="subtitle1" sx={ { fontWeight: 600 } }>
                                What is the Flow Execution Context?
                            </Typography>
                        </Box>
                        <Box sx={ { p: 3 } }>
                            <Typography variant="body2" color="text.secondary" sx={ { mb: 2 } }>
                                { t("inFlowExtension:createWizard.helpPanel.whatIsContext.description",
                                    { defaultValue: "The context tree represents data available during "
                                        + "flow execution. Select which fields to expose or allow "
                                        + "modifications on." }) }
                            </Typography>
                            <Divider sx={ { mb: 2 } } />
                            <Typography variant="subtitle2" sx={ { mb: 1 } }>
                                { t("inFlowExtension:createWizard.helpPanel.howToUse.heading",
                                    { defaultValue: "How to Use" }) }
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                component="div"
                            >
                                <ul style={ { lineHeight: 1.8, paddingLeft: "18px" } }>
                                    <li>
                                        { t("inFlowExtension:createWizard.helpPanel.howToUse.step1",
                                            { defaultValue: "Click EXPOSE to share a field with "
                                                + "the external service." }) }
                                    </li>
                                    <li>
                                        { t("inFlowExtension:createWizard.helpPanel.howToUse.step2",
                                            { defaultValue: "Click MODIFY to allow the external service "
                                                + "to change a field." }) }
                                    </li>
                                    <li>
                                        { t("inFlowExtension:createWizard.helpPanel.howToUse.step3",
                                            { defaultValue: "Toggle encryption for sensitive fields "
                                                + "when a certificate is available." }) }
                                    </li>
                                    <li>
                                        Complex objects (maps, nested structures) can have
                                        dynamic entries added via the + ADD ENTRY button.
                                    </li>
                                </ul>
                            </Typography>
                            <Divider sx={ { mb: 2, mt: 1 } } />
                            <Typography variant="body2" color="text.secondary">
                                Changes here override the connection&apos;s default access
                                configuration for this specific flow type only.
                            </Typography>
                        </Box>
                    </Box>
                ) }
            </Box>
        </Dialog>
        <Dialog
            open={ isResetDialogOpen }
            onClose={ handleResetClose }
            maxWidth="xs"
            fullWidth
            data-componentid={ `${componentId}-reset-dialog` }
        >
            <DialogTitle sx={ { color: "error.main", fontWeight: 600 } }>
                Reset Configuration
            </DialogTitle>
            <DialogContent>
                <Stack direction="row" spacing={ 2 } sx={ { pt: 1 } }>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={ handleClearAll }
                        fullWidth
                    >
                        Clear All
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={ handleResetToDefault }
                        fullWidth
                    >
                        Reset to Default
                    </Button>
                </Stack>
            </DialogContent>
            <DialogActions sx={ { px: 3, pb: 2 } }>
                <Button onClick={ handleResetClose }>Cancel</Button>
            </DialogActions>
        </Dialog>
        </>
    );
};

export default AccessConfigOverrideDialog;
