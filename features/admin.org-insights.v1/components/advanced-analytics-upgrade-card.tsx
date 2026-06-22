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
import DialogContent from "@oxygen-ui/react/DialogContent";
import DialogTitle from "@oxygen-ui/react/DialogTitle";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Paper from "@oxygen-ui/react/Paper";
import Typography from "@oxygen-ui/react/Typography";
import { StarIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ChangeEvent, FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

const MOESIF_TOS_URL: string = "https://www.moesif.com/terms/";

const StyledWrapper: typeof Paper = styled(Paper)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    borderLeft: `4px solid ${ theme.palette.primary.main }`,
    display: "flex",
    flexDirection: "row",
    gap: theme.spacing(2),
    justifyContent: "space-between",
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2.5, 3)
}));

const StyledIconBox: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    backgroundColor: theme.palette.primary.main + "14",
    borderRadius: "50%",
    color: theme.palette.primary.main,
    display: "flex",
    flexShrink: 0,
    height: theme.spacing(6),
    justifyContent: "center",
    width: theme.spacing(6)
}));

const StyledBadge: typeof Chip = styled(Chip)(({ theme }: { theme: Theme }) => ({
    fontSize: theme.typography.caption.fontSize,
    height: theme.spacing(2.25)
}));

const StyledDialogActions: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    gap: theme.spacing(1),
    justifyContent: "flex-end",
    padding: theme.spacing(2, 3)
}));

interface AdvancedAnalyticsUpgradeCardPropsInterface extends IdentifiableComponentInterface {
    isEnabling: boolean;
    onEnable: () => void;
    termsOfServiceUrl?: string;
}

/**
 * Upgrade prompt card that opens a confirmation dialog before enabling advanced analytics.
 */
const AdvancedAnalyticsUpgradeCard: FunctionComponent<AdvancedAnalyticsUpgradeCardPropsInterface> = (
    {
        "data-componentid": componentId = "advanced-analytics-upgrade-card",
        isEnabling,
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
            <StyledWrapper
                data-componentid={ componentId }
                variant="outlined"
                elevation={ 0 }
            >
                <StyledIconBox>
                    <StarIcon />
                </StyledIconBox>

                <Box sx={ { flex: 1, minWidth: 0 } }>
                    <Box sx={ { alignItems: "center", display: "flex", gap: 1, mb: 0.5 } }>
                        <Typography variant="subtitle1" fontWeight={ 600 }>
                            { t("insights:advancedAnalytics.card.title") }
                        </Typography>
                        <StyledBadge
                            label={ t("insights:advancedAnalytics.card.badge") }
                            size="small"
                            color="primary"
                        />
                    </Box>
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
            </StyledWrapper>

            <Dialog
                data-componentid={ `${ componentId }-dialog` }
                open={ dialogOpen }
                onClose={ handleCloseDialog }
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>{ t("insights:advancedAnalytics.dialog.title") }</DialogTitle>

                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={ { mb: 2 } }>
                        { t("insights:advancedAnalytics.dialog.intro") }
                    </Typography>

                    <Box component="ul" sx={ { m: 0, pl: 2.5 } }>
                        <Typography variant="body2" component="li" sx={ { mb: 1 } }>
                            <Trans
                                i18nKey="insights:advancedAnalytics.dialog.privacyPoint"
                                components={ {
                                    1: <strong />,
                                    3: (
                                        <a
                                            href={ termsOfServiceUrl }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        />
                                    ),
                                    5: (
                                        <a
                                            href={ MOESIF_TOS_URL }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        />
                                    )
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

                    <Alert
                        data-componentid={ `${ componentId }-warning-alert` }
                        severity="warning"
                        sx={ { mt: 2.5 } }
                    >
                        { t("insights:advancedAnalytics.dialog.warning") }
                    </Alert>

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
                    <Button
                        data-componentid={ `${ componentId }-cancel-btn` }
                        variant="outlined"
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
                        sx={ { ml: 1 } }
                    >
                        { t("insights:advancedAnalytics.dialog.enableButton") }
                    </Button>
                </StyledDialogActions>
            </Dialog>
        </>
    );
};

export default AdvancedAnalyticsUpgradeCard;
