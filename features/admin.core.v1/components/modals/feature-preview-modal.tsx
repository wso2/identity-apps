/**
 * Copyright (c) 2025-2026, WSO2 LLC. (https://www.wso2.com).
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
import Button from "@oxygen-ui/react/Button";
import Card from "@oxygen-ui/react/Card";
import Container from "@oxygen-ui/react/Container";
import Dialog from "@oxygen-ui/react/Dialog";
import DialogActions from "@oxygen-ui/react/DialogActions";
import DialogContent from "@oxygen-ui/react/DialogContent";
import DialogTitle from "@oxygen-ui/react/DialogTitle";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Grid from "@oxygen-ui/react/Grid";
import List from "@oxygen-ui/react/List";
import ListItem from "@oxygen-ui/react/ListItem";
import ListItemButton from "@oxygen-ui/react/ListItemButton";
import ListItemText from "@oxygen-ui/react/ListItemText";
import Stack from "@oxygen-ui/react/Stack";
import Switch from "@oxygen-ui/react/Switch";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ChangeEvent, FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { PreviewFeaturesListInterface, usePreviewFeatures } from "../../hooks/use-preview-features";

interface FeaturePreviewModalPropsInterface extends IdentifiableComponentInterface {
    open: boolean;
    onClose: () => void;
}

/**
 * Feature preview modal component.
 *
 * @param FeaturePreviewModalPropsInterface - props - Props injected to the component.
 * @returns Feature preview modal component.
 */
const FeaturePreviewModal: FunctionComponent<FeaturePreviewModalPropsInterface> = ({
    ["data-componentid"]: componentId = "feature-preview-modal",
    onClose,
    open
}: FeaturePreviewModalPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const {
        accessibleFeatures,
        handlePageRedirection,
        handleToggleChange,
        selected,
        setSelectedFeatureIndex
    } = usePreviewFeatures();

    const handleClose: () => void = (): void => {
        onClose();
    };

    return (
        <Dialog
            onClose={ handleClose }
            open={ open }
            data-componentid={ componentId }
            maxWidth={ accessibleFeatures?.length > 1 ? "lg" : "md" }
            className="preview-features-modal"
        >
            { accessibleFeatures?.length > 1
                ? <DialogTitle>{ t("Feature Preview") }</DialogTitle>
                : (
                    <DialogTitle>
                        <Stack direction="row" justifyContent="space-between" sx={ { alignItems: "center" } }>
                            <Typography variant="h6">{ selected?.name }</Typography>
                            <FormControlLabel
                                control={ (
                                    <Switch
                                        onChange={
                                            (e: ChangeEvent<HTMLInputElement>) => handleToggleChange(e, selected?.id)
                                        }
                                        value={ selected?.value }
                                        checked={ selected?.enabled }
                                    />
                                ) }
                                label={ selected?.enabled ? t("common:enabled") : t("common:disabled") }
                                labelPlacement="start"
                            />
                        </Stack>
                    </DialogTitle>
                )
            }

            <DialogContent className="add-feature-preview-modal-content" dividers>
                <Container sx={ { mt: 4 } }>
                    <Grid container spacing={ 2 }>

                        { accessibleFeatures?.length > 1 && (
                            <Grid xs={ 4 }>
                                <List style={ { padding: "0" } }>
                                    { accessibleFeatures?.map((item: PreviewFeaturesListInterface, index: number) => (
                                        <ListItem key={ item.name } disablePadding>
                                            <Card className="preview-feature-menu-card">
                                                <ListItemButton
                                                    selected={ selected === item }
                                                    onClick={ () => setSelectedFeatureIndex(index) }
                                                >
                                                    <ListItemText primary={ item.name } />
                                                </ListItemButton>
                                            </Card>
                                        </ListItem>
                                    )) }
                                </List>
                            </Grid>
                        ) }

                        <Grid xs={ accessibleFeatures?.length > 1 ? 8 : 12 }>
                            { accessibleFeatures?.length > 1 && (
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    sx={ { alignItems: "center", marginBottom: "20px" } }
                                >
                                    <Typography variant="h6">{ selected?.name }</Typography>
                                    <FormControlLabel
                                        control={ (
                                            <Switch
                                                onChange={
                                                    (e: ChangeEvent<HTMLInputElement>) =>
                                                        handleToggleChange(e, selected?.id)
                                                }
                                                value={ selected?.value }
                                                checked={ selected?.enabled }
                                            />
                                        ) }
                                        label={ selected?.enabled ? t("common:enabled") : t("common:disabled") }
                                        labelPlacement="start"
                                    />
                                </Stack>
                            ) }

                            <div>
                                <p>{ selected?.description }</p>
                            </div>

                            { selected?.message?.type && selected?.message?.content && (
                                <Alert severity={ selected?.message?.type } sx={ { marginTop: "10px" } }>
                                    { selected?.message?.content }
                                </Alert>
                            ) }

                            { selected?.image && (
                                <img
                                    src={ selected.image }
                                    style={ { marginBottom: "20px", marginTop: "20px", width: "100%" } }
                                />
                            ) }

                            { selected?.component && selected?.component }

                            { accessibleFeatures?.length > 1 && selected?.enabled && (
                                <Stack direction="row" justifyContent="flex-end">
                                    <Button
                                        onClick={ () => {
                                            handleClose();
                                            handlePageRedirection(selected?.id);
                                        } }
                                        color="primary"
                                        variant="contained"
                                    >
                                        { selected?.action || "Try it out" }
                                    </Button>
                                </Stack>
                            ) }
                        </Grid>
                    </Grid>
                </Container>
            </DialogContent>
            <DialogActions>
                <Box className="preview-features-modal-actions">
                    <Stack direction="row" justifyContent="space-between">
                        <Button onClick={ handleClose } color="primary">
                            { t("common:close") }
                        </Button>
                        { accessibleFeatures?.length === 1 && selected?.enabled && (
                            <Button
                                onClick={ () => {
                                    handleClose();
                                    handlePageRedirection(selected?.id);
                                } }
                                color="primary"
                                variant="contained"
                            >
                                { selected?.action || "Try it out" }
                            </Button>
                        ) }
                    </Stack>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default FeaturePreviewModal;
