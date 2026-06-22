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

import { Theme, styled } from "@mui/material/styles";
import Alert from "@oxygen-ui/react/Alert";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Checkbox from "@oxygen-ui/react/Checkbox";
import Chip from "@oxygen-ui/react/Chip";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import Dialog from "@oxygen-ui/react/Dialog";
import DialogActions from "@oxygen-ui/react/DialogActions";
import DialogContent from "@oxygen-ui/react/DialogContent";
import DialogTitle from "@oxygen-ui/react/DialogTitle";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Paper from "@oxygen-ui/react/Paper";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ChangeEvent, FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import analyticsPreview from "../assets/preview/analytics_preview.png";

/**
 * Plain white announcement banner: title and description on the left, enable action on the right.
 */
const StyledBanner: typeof Paper = styled(Paper)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${ theme.palette.divider }`,
    display: "flex",
    flexDirection: "row",
    gap: theme.spacing(3),
    justifyContent: "space-between",
    marginBottom: theme.spacing(3),
    padding: theme.spacing(3),
    width: "100%"
}));

const StyledDialogActions: typeof DialogActions = styled(DialogActions)(({ theme }: { theme: Theme }) => ({
    padding: theme.spacing(2, 3)
}));

interface AdvancedAnalyticsUpgradeCardPropsInterface extends IdentifiableComponentInterface {
    isEnabling: boolean;
    moesifTermsOfServiceUrl?: string;
    onEnable: () => void;
    termsOfServiceUrl?: string;
}

/**
 * Feature-announcement-style banner card. Clicking the enable button opens a compact
 * confirmation dialog with the ToS bullets and an agreement checkbox.
 */
const AdvancedAnalyticsUpgradeCard: FunctionComponent<AdvancedAnalyticsUpgradeCardPropsInterface> = (
    {
        "data-componentid": componentId = "advanced-analytics-upgrade-card",
        isEnabling,
        moesifTermsOfServiceUrl = "",
        onEnable,
        termsOfServiceUrl = ""
    }: AdvancedAnalyticsUpgradeCardPropsInterface
): ReactElement => {
    const { t } = useTranslation();
    const [ dialogOpen, setDialogOpen ] = useState<boolean>(false);
    const [ agreed, setAgreed ] = useState<boolean>(false);

    const handleOpenDialog: () => void = (): void => {
        setAgreed(false);
        setDialogOpen(true);
    };

    const handleCloseDialog: () => void = (): void => {
        setDialogOpen(false);
    };

    const handleConfirm: () => void = (): void => {
        setDialogOpen(false);
        onEnable();
    };

    return (
        <>
            { /* ── Banner ── */ }
            <StyledBanner data-componentid={ componentId } elevation={ 0 }>
                <Box>
                    <Stack direction="row" alignItems="center" sx={ { mb: 1 } }>
                        <Typography variant="h6">
                            { t("insights:advancedAnalytics.card.title") }
                        </Typography>
                        <Chip
                            size="small"
                            label={ t("common:new") }
                            className="oxygen-chip-new"
                            sx={ { ml: 1 } }
                        />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                        { t("insights:advancedAnalytics.card.description") }
                    </Typography>
                </Box>
                <Button
                    data-componentid={ `${ componentId }-open-dialog-btn` }
                    variant="contained"
                    color="primary"
                    onClick={ handleOpenDialog }
                    disabled={ isEnabling }
                    startIcon={ isEnabling ? <CircularProgress size={ 16 } color="inherit" /> : null }
                    sx={ { flexShrink: 0 } }
                >
                    { t("insights:advancedAnalytics.card.enableButton") }
                </Button>
            </StyledBanner>

            { /* ── Confirmation dialog ── */ }
            <Dialog
                data-componentid={ `${ componentId }-dialog` }
                open={ dialogOpen }
                onClose={ handleCloseDialog }
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>{ t("insights:advancedAnalytics.dialog.title") }</DialogTitle>

                <DialogContent dividers>
                    <Typography variant="body2" color="text.secondary" sx={ { mb: 2 } }>
                        { t("insights:advancedAnalytics.dialog.intro") }
                    </Typography>

                    <Box component="ul" sx={ { m: 0, pl: 2.5 } }>
                        <Typography variant="body2" component="li" sx={ { mb: 1 } }>
                            <Trans
                                i18nKey="insights:advancedAnalytics.dialog.privacyPoint"
                                components={ {
                                    1: <strong />,
                                    3: <a href={ termsOfServiceUrl }
                                        target="_blank" rel="noopener noreferrer" />,
                                    5: <a href={ moesifTermsOfServiceUrl }
                                        target="_blank" rel="noopener noreferrer" />
                                } }
                            />
                        </Typography>
                        <Typography variant="body2" component="li" sx={ { mb: 1 } }>
                            <Trans
                                i18nKey="insights:advancedAnalytics.dialog.dataRetentionPoint"
                                components={ { 1: <strong /> } }
                            />
                        </Typography>
                        <Typography variant="body2" component="li">
                            <Trans
                                i18nKey="insights:advancedAnalytics.dialog.irreversiblePoint"
                                components={ { 1: <strong /> } }
                            />
                        </Typography>
                    </Box>

                    <Alert severity="warning" sx={ { mt: 2 } }>
                        { t("insights:advancedAnalytics.dialog.warning") }
                    </Alert>

                    <Box
                        component="img"
                        src={ analyticsPreview }
                        alt="Advanced analytics preview"
                        sx={ {
                            borderRadius: 1,
                            display: "block",
                            mt: 2.5,
                            width: "100%"
                        } }
                    />

                    <FormControlLabel
                        data-componentid={ `${ componentId }-agreement-checkbox` }
                        sx={ { alignItems: "flex-start", mt: 2 } }
                        control={
                            <Checkbox
                                sx={ { pt: 0 } }
                                checked={ agreed }
                                onChange={ (e: ChangeEvent<HTMLInputElement>) => setAgreed(e.target.checked) }
                            />
                        }
                        label={
                            <Typography variant="body2">
                                { t("insights:advancedAnalytics.dialog.agreement") }
                            </Typography>
                        }
                    />
                </DialogContent>

                <StyledDialogActions>
                    <Stack direction="row" justifyContent="space-between" sx={ { width: "100%" } }>
                        <Button
                            data-componentid={ `${ componentId }-cancel-btn` }
                            color="primary"
                            onClick={ handleCloseDialog }
                        >
                            { t("common:cancel") }
                        </Button>
                        <Button
                            data-componentid={ `${ componentId }-confirm-btn` }
                            variant="contained"
                            color="primary"
                            onClick={ handleConfirm }
                            disabled={ !agreed || isEnabling }
                            startIcon={ isEnabling ? <CircularProgress size={ 16 } color="inherit" /> : null }
                        >
                            { t("insights:advancedAnalytics.dialog.enableButton") }
                        </Button>
                    </Stack>
                </StyledDialogActions>
            </Dialog>
        </>
    );
};

export default AdvancedAnalyticsUpgradeCard;
