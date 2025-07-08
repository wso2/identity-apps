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
import {
    ConnectorPropertyInterface,
    ServerConfigurationsConstants,
    updateGovernanceConnector,
    useGetGovernanceConnectorById
} from "@wso2is/admin.server-configurations.v1";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ChangeEvent, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import NewSelfRegistrationImage from "../../assets/illustrations/preview-features/new-self-registration.png";
import { AppConstants } from "../../constants/app-constants";
import "./feature-preview-modal.scss";
import { history } from "../../helpers/history";

/**
 * Feature preview modal component props interface. {@link FeaturePreviewModal}
 */
interface FeaturePreviewModalPropsInterface extends IdentifiableComponentInterface {
    /**
     * Modal open state.
     */
    open: boolean;

    /**
     * Modal close callback
     */
    onClose: () => void;
}

/**
 * Preview features list interface.
 */
interface PreviewFeaturesListInterface {
    /**
     * Feature action.
     */
    action?: string;

    /**
     * Feature name.
     */
    name: string;

    /**
     * Feature description.
     */
    description: string;

    /**
     * Feature id.
     */
    id: string;

    /**
     * Feature image.
     */
    image?: string;

    /**
     * Feature value.
     */
    value: string;
    /**
     * Feature message.
     */
    message?: {
        type: "info" | "warning" | "error";
        content: string;
    };
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

    const { data: connectorDetails, mutate: connectorDetailsMutate } = useGetGovernanceConnectorById(
        ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID,
        ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID
    );

    {/* TODO: Get this from an Organization Preferences API */}
    const previewFeaturesList: PreviewFeaturesListInterface[] = [
        {
            action: "Try Flow Composer",
            description: "This feature enables you to customize the user self-registration flow and " +
                "secure your user onboarding experience with multiple authentication methods and verification steps.",
            id: "self-registration-orchestration",
            image: NewSelfRegistrationImage,
            message: {
                content: "Once this feature is enabled, existing self-registration flow configurations will be " +
                    "changed. So, update your settings accordingly.",
                type: "warning"
            },
            name: "Self-Registration Orchestration",
            value: "SelfRegistration.EnableDynamicPortal"
        }
    ];

    const [ selected, setSelected ] = useState(previewFeaturesList[0]);
    const [ isEnableDynamicSelfRegistrationPortal, setIsEnableDynamicSelfRegistrationPortal ] = useState(false);

    useEffect(() => {
        if (connectorDetails) {
            const SelfRegistrationEnableDynamicPortal: string = connectorDetails?.properties?.find(
                (item: ConnectorPropertyInterface) =>
                    item.name === "SelfRegistration.EnableDynamicPortal")?.value || "false";

            setIsEnableDynamicSelfRegistrationPortal(JSON.parse(SelfRegistrationEnableDynamicPortal));
        }
    }, [ connectorDetails, selected ]);

    const handleClose = () => {
        onClose();
    };

    const handlePageRedirection = (actionId: string) => {
        switch (actionId) {
            case "self-registration-orchestration":
                return history.push(AppConstants.getPaths().get("REGISTRATION_FLOW_BUILDER"));
            default:
                return;
        }
    };

    const handleToggleChange = async (e: ChangeEvent<HTMLInputElement>, actionId: string) => {
        switch (actionId) {
            case "self-registration-orchestration":
                setIsEnableDynamicSelfRegistrationPortal(e.target.checked);
                await updateGovernanceConnector(
                    {
                        operation: "UPDATE",
                        properties:[ {
                            name: e.target.value,
                            value: e.target.checked
                        } ]
                    },
                    ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID,
                    ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID
                );
                connectorDetailsMutate();

                break;
            default:
                break;
        }
    };

    return (
        <Dialog
            onClose={ handleClose }
            open={ open }
            data-componentid={ componentId }
            maxWidth={ (previewFeaturesList?.length) > 1 ? "lg" : "md" }
            className="preview-features-modal"
        >
            { (previewFeaturesList?.length > 1)
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
                                        checked={ isEnableDynamicSelfRegistrationPortal }
                                    />
                                ) }
                                label={ isEnableDynamicSelfRegistrationPortal ?
                                    t("common:enabled") : t("common:disabled") }
                                labelPlacement="start"
                            />
                        </Stack>
                    </DialogTitle>
                )
            }
            <DialogContent className="add-feature-preview-modal-content" dividers>
                <Container sx={ { mt: 4 } }>
                    <Grid container spacing={ 2 }>
                        { (previewFeaturesList?.length > 1) && (
                            <Grid xs={ 4 }>
                                <List style={ { padding: "0" } }>
                                    { previewFeaturesList?.map((item: PreviewFeaturesListInterface) => (
                                        <ListItem key={ item.name } disablePadding>
                                            <Card className="preview-feature-menu-card">
                                                <ListItemButton
                                                    selected={ selected === item }
                                                    onClick={ () => setSelected(item) }
                                                >
                                                    <ListItemText primary={ item.name } />
                                                </ListItemButton>
                                            </Card>
                                        </ListItem>
                                    )) }
                                </List>
                            </Grid>
                        ) }

                        <Grid xs={ (previewFeaturesList?.length) > 1 ? 8 : 12 }>
                            {
                                (previewFeaturesList?.length > 1) && (
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
                                                    checked={ isEnableDynamicSelfRegistrationPortal }
                                                />
                                            ) }
                                            label={ isEnableDynamicSelfRegistrationPortal ?
                                                t("common:enabled") : t("common:disabled") }
                                            labelPlacement="start"
                                        />
                                    </Stack>
                                )
                            }
                            <div>
                                <p>{ selected?.description }</p>
                            </div>
                            <Alert severity={ selected?.message?.type } sx={ { marginTop: "10px" } }>
                                { selected?.message?.content }
                            </Alert>
                            { selected?.image &&
                                (
                                    <img
                                        src={ selected.image }
                                        style={ { marginBottom: "20px", marginTop: "20px", width: "100%" } }
                                    />
                                )
                            }
                            {
                                previewFeaturesList?.length > 1 && isEnableDynamicSelfRegistrationPortal && (
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
                                )
                            }
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
                        {
                            previewFeaturesList?.length === 1 && isEnableDynamicSelfRegistrationPortal && (
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
                            )
                        }
                    </Stack>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default FeaturePreviewModal;
