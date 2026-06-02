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

import Button from "@oxygen-ui/react/Button";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import Dialog from "@oxygen-ui/react/Dialog";
import DialogActions from "@oxygen-ui/react/DialogActions";
import DialogContent from "@oxygen-ui/react/DialogContent";
import DialogTitle from "@oxygen-ui/react/DialogTitle";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { ChangeEvent, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { getMoesifPublisher } from "../api/get-moesif-publisher";
import { updateMoesifPublisher } from "../api/update-moesif-publisher";
import { MoesifPublisherInterface } from "../models/moesif-analytics";

/**
 * Props for the MoesifCollectorKeySettings component.
 */
interface MoesifCollectorKeySettingsProps {
    /**
     * Unique identifier for the component (for testing).
     */
    "data-componentid"?: string;
    /**
     * Whether the settings dialog is open.
     */
    open: boolean;
    /**
     * Callback to close the dialog.
     */
    onClose: () => void;
}

/**
 * Dialog to configure the Moesif collector API key.
 * Only shown when `extensions.analytics.collectorKey.settingsEnabled` is `true`.
 */
const MoesifCollectorKeySettings: FunctionComponent<MoesifCollectorKeySettingsProps> = (
    props: MoesifCollectorKeySettingsProps
): ReactElement => {
    const {
        "data-componentid": componentId = "moesif-collector-key-settings",
        open,
        onClose
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ collectorKey, setCollectorKey ] = useState<string>("");
    const [ isSaving, setIsSaving ] = useState<boolean>(false);
    const [ publisherEnablement, setPublisherEnablement ] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (open) {
            getMoesifPublisher().then((publisher: MoesifPublisherInterface | null) => {
                setPublisherEnablement(publisher?.eventPublisherEnablement ?? {});
            }).catch(() => {
                // Use defaults if fetch fails.
            });
        }
    }, [ open ]);

    const handleSave = async (): Promise<void> => {
        if (!collectorKey.trim()) {
            return;
        }

        setIsSaving(true);

        try {
            await updateMoesifPublisher({
                apiKeyValue: collectorKey.trim(),
                eventPublisherEnablement: publisherEnablement
            });

            dispatch(
                addAlert({
                    description: t(
                        "extensions:develop.moesifAnalytics.collectorKeySettings.notifications." +
                        "updateSuccess.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "extensions:develop.moesifAnalytics.collectorKeySettings.notifications.updateSuccess.message"
                    )
                })
            );

            setCollectorKey("");
            onClose();
        } catch (_error: unknown) {
            dispatch(
                addAlert({
                    description: t(
                        "extensions:develop.moesifAnalytics.collectorKeySettings.notifications.updateError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "extensions:develop.moesifAnalytics.collectorKeySettings.notifications.updateError.message"
                    )
                })
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = (): void => {
        if (isSaving) {
            return;
        }
        setCollectorKey("");
        onClose();
    };

    return (
        <Dialog
            data-componentid={ componentId }
            open={ open }
            onClose={ handleClose }
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle data-componentid={ `${ componentId }-title` }>
                { t("extensions:develop.moesifAnalytics.collectorKeySettings.title") }
            </DialogTitle>
            <DialogContent data-componentid={ `${ componentId }-content` }>
                <Typography variant="body2" gutterBottom>
                    { t("extensions:develop.moesifAnalytics.collectorKeySettings.description") }
                </Typography>
                <TextField
                    data-componentid={ `${ componentId }-key-input` }
                    fullWidth
                    label={ t("extensions:develop.moesifAnalytics.collectorKeySettings.keyField.label") }
                    placeholder={ t(
                        "extensions:develop.moesifAnalytics.collectorKeySettings.keyField.placeholder"
                    ) }
                    type="password"
                    value={ collectorKey }
                    onChange={ (e: ChangeEvent<HTMLInputElement>) => setCollectorKey(e.target.value) }
                    disabled={ isSaving }
                    margin="normal"
                    autoComplete="new-password"
                />
            </DialogContent>
            <DialogActions data-componentid={ `${ componentId }-actions` }>
                <Button
                    data-componentid={ `${ componentId }-cancel-btn` }
                    onClick={ handleClose }
                    disabled={ isSaving }
                    variant="outlined"
                >
                    { t("extensions:develop.moesifAnalytics.collectorKeySettings.cancelButton") }
                </Button>
                <Button
                    data-componentid={ `${ componentId }-save-btn` }
                    onClick={ handleSave }
                    disabled={ isSaving || !collectorKey.trim() }
                    variant="contained"
                    startIcon={ isSaving ? <CircularProgress size={ 16 } /> : null }
                >
                    { t("extensions:develop.moesifAnalytics.collectorKeySettings.saveButton") }
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MoesifCollectorKeySettings;
