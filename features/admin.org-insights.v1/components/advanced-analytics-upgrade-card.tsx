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

const ASGARDEO_TOS_URL: string = "https://wso2.com/asgardeo/terms-of-service/";
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

const StyledDialogActions: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    gap: theme.spacing(1),
    justifyContent: "flex-end",
    padding: theme.spacing(2, 3)
}));

interface AdvancedAnalyticsUpgradeCardPropsInterface extends IdentifiableComponentInterface {
    isEnabling: boolean;
    onEnable: () => void;
}

/**
 * Upgrade prompt shown in the legacy Insights page.
 *
 * Renders a simple card with an "Enable Advanced Analytics" button. Clicking the button
 * opens a confirmation dialog that presents the data-privacy disclaimer, ToS links, and
 * irreversibility warning. The user must tick an agreement checkbox before the dialog's
 * enable action becomes available.
 */
const AdvancedAnalyticsUpgradeCard: FunctionComponent<AdvancedAnalyticsUpgradeCardPropsInterface> = (
    { "data-componentid": componentId = "advanced-analytics-upgrade-card", isEnabling, onEnable }
    : AdvancedAnalyticsUpgradeCardPropsInterface
): ReactElement => {
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
                            Upgrade to Advanced Analytics
                        </Typography>
                        <Chip
                            label="New"
                            size="small"
                            color="primary"
                            sx={ { fontSize: "0.65rem", height: 18 } }
                        />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        Unlock richer, real-time insights into authentication events, token usage,
                        and user flows across your organisation.
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
                    Enable Advanced Analytics
                </Button>
            </StyledWrapper>

            <Dialog
                data-componentid={ `${ componentId }-dialog` }
                open={ dialogOpen }
                onClose={ handleCloseDialog }
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Enable Advanced Analytics</DialogTitle>

                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={ { mb: 2 } }>
                        Before you proceed, please read the following carefully.
                    </Typography>

                    <Box component="ul" sx={ { m: 0, pl: 2.5 } }>
                        <Typography variant="body2" component="li" sx={ { mb: 1 } }>
                            This feature is powered by{" "}
                            <strong>Moesif</strong>, a WSO2-owned entity. Your end
                            users&apos; personally identifiable information (PII) — such as user
                            identifiers and IP addresses — may be shared with Moesif for analytics
                            processing. Review the{" "}
                            <a href={ ASGARDEO_TOS_URL } target="_blank" rel="noopener noreferrer">
                                Asgardeo Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href={ MOESIF_TOS_URL } target="_blank" rel="noopener noreferrer">
                                Moesif Terms of Service
                            </a>{" "}
                            for details.
                        </Typography>
                        <Typography variant="body2" component="li" sx={ { mb: 1 } }>
                            Your previous analytical data will <strong>not</strong> be carried over.
                            Your analytics journey begins from the day you enable this feature.
                        </Typography>
                        <Typography variant="body2" component="li">
                            This action <strong>cannot be undone</strong>. Once enabled, you will
                            not be able to revert to the previous analytics model.
                        </Typography>
                    </Box>

                    <Alert
                        data-componentid={ `${ componentId }-warning-alert` }
                        severity="warning"
                        sx={ { mt: 2.5 } }
                    >
                        Enabling this feature is permanent and affects all users in your organisation.
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
                                I have read and understood the above, and I agree to enable advanced
                                analytics for my organisation.
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
                        Cancel
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
                        Enable
                    </Button>
                </StyledDialogActions>
            </Dialog>
        </>
    );
};

export default AdvancedAnalyticsUpgradeCard;
