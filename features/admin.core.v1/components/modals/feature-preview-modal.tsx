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
import { useRequiredScopes } from "@wso2is/access-control";
import { updateCDSConfig } from "@wso2is/admin.cds.v1/api/config";
import useCDSConfig from "@wso2is/admin.cds.v1/hooks/use-config";
import useFeatureGate from "@wso2is/admin.feature-gate.v1/hooks/use-feature-gate";
import updateFlowConfig from "@wso2is/admin.flow-builder-core.v1/api/update-flow-config";
import useGetFlowConfig from "@wso2is/admin.flow-builder-core.v1/api/use-get-flow-config";
import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";
import { AlertLevels, FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { ChangeEvent, FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import NewCDSFeatureImage from "../../assets/illustrations/preview-features/new-cds-feature.png";
import NewSelfRegistrationImage from "../../assets/illustrations/preview-features/new-self-registration.png";
import { AppConstants } from "../../constants/app-constants";
import { history } from "../../helpers/history";
import { AppState } from "../../store";
import "./feature-preview-modal.scss";

/** Added or removed as a system application when CDS is toggled. */
const CDS_CONSOLE_APP:string = "CONSOLE";

interface FeaturePreviewModalPropsInterface extends IdentifiableComponentInterface {
    open: boolean;
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
     * React component to be rendered
     */
    component?: ReactElement;

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
     * Whether the feature is enabled
     */
    enabled?: boolean;

    /**
     * Feature value.
     */
    value: string;

    /**
     * Required scopes to access the feature. If not provided, the feature will be accessible to all users.
     */
    requiredScopes?: string[];

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
    const dispatch: any = useDispatch();
    const { selectedPreviewFeatureToShow } = useFeatureGate();

    const loginAndRegistrationFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.loginAndRegistration
    );
    const cdsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.customerDataService
    );

    const {
        data: registrationFlowConfig,
        mutate: mutateRegistrationFlowConfig
    } = useGetFlowConfig(FlowTypes.REGISTRATION);

    const {
        data: cdsConfig,
        mutate: mutateCDSConfig
    } = useCDSConfig(open && (cdsFeatureConfig?.enabled ?? false));

    const hasSelfRegScopes: boolean = useRequiredScopes(
        loginAndRegistrationFeatureConfig?.scopes?.update
    );

    const hasCDSScopes: boolean = useRequiredScopes(
        cdsFeatureConfig?.scopes?.update
    );


    const previewFeaturesList: PreviewFeaturesListInterface[] = useMemo(() => ([
        {
            action: "Try Flow Composer",
            description:
                "This feature enables you to customize the user self-registration flow and " +
                "secure your user onboarding experience with multiple authentication methods and verification steps.",
            enabled: registrationFlowConfig?.isEnabled,
            id: "self-registration-orchestration",
            image: NewSelfRegistrationImage,
            message: {
                content:
                    "Once this feature is enabled, existing self-registration flow configurations will be " +
                    "changed. So, update your settings accordingly.",
                type: "warning" as const
            },
            name: "Self-Registration Orchestration",
            requiredScopes: loginAndRegistrationFeatureConfig?.scopes?.update,
            value: "SelfRegistration.EnableDynamicPortal"
        },
        {
            action: t("customerDataService:common.featurePreview.action"),
            description: t("customerDataService:common.featurePreview.description"),
            enabled: cdsConfig?.cds_enabled,
            id: "customer-data-service",
            image: NewCDSFeatureImage,
            message: {
                content: t("customerDataService:common.featurePreview.message"),
                type: "warning" as const
            },
            name: t("customerDataService:common.featurePreview.name"),
            requiredScopes: cdsFeatureConfig?.scopes?.update,
            value: "CDS.Enable"
        }
    ].filter(Boolean)), [ registrationFlowConfig, cdsConfig, loginAndRegistrationFeatureConfig, cdsFeatureConfig, t ]);

    const accessibleFeatures: PreviewFeaturesListInterface[] = useMemo(() => (
        previewFeaturesList.filter((feature: PreviewFeaturesListInterface) => {
            if (feature.id === "self-registration-orchestration") return hasSelfRegScopes;
            if (feature.id === "customer-data-service") {
                return hasCDSScopes && !!cdsFeatureConfig?.enabled;
            }

            return true;
        })
    ), [ previewFeaturesList, hasSelfRegScopes, hasCDSScopes ]);

    const [ selectedFeatureIndex, setSelectedFeatureIndex ] = useState(0);

    const selected: PreviewFeaturesListInterface = useMemo(
        () => accessibleFeatures[selectedFeatureIndex],
        [ selectedFeatureIndex, accessibleFeatures ]
    );

    useEffect(() => {
        const activePreviewFeatureIndex: number = accessibleFeatures.findIndex(
            (feature: PreviewFeaturesListInterface) => feature?.id === selectedPreviewFeatureToShow
        );

        setSelectedFeatureIndex(activePreviewFeatureIndex > 0 ? activePreviewFeatureIndex : 0);
    }, [ selectedPreviewFeatureToShow ]);

    const handleClose = () => {
        onClose();
    };

    const handlePageRedirection = (actionId: string) => {
        switch (actionId) {
            case "self-registration-orchestration":
                return history.push(AppConstants.getPaths().get("REGISTRATION_FLOW_BUILDER"));
            case "customer-data-service":
                return history.push(AppConstants.getPaths().get("PROFILES"));
            default:
                return;
        }
    };

    const handleToggleChange = async (e: ChangeEvent<HTMLInputElement>, actionId: string) => {
        const isChecked: boolean = e.target.checked;

        switch (actionId) {
            case "self-registration-orchestration":
                await updateFlowConfig({
                    flowType: FlowTypes.REGISTRATION,
                    isEnabled: isChecked
                });
                mutateRegistrationFlowConfig();

                break;
            case "customer-data-service":
                await handleCDSToggle(isChecked);

                break;

            default:
                break;
        }
    };

    /**
     * Handles CDS enable/disable via PATCH.
     *
     * Enabling  → set cds_enabled: true; if system_applications is empty, seed it with ["CONSOLE"].
     * Disabling → set cds_enabled: false; remove "CONSOLE" from system_applications (leave others intact).
     */
    const handleCDSToggle = async (enable: boolean): Promise<void> => {
        const currentApps: string[] = cdsConfig?.system_applications ?? [];

        let nextApps: string[];

        if (enable) {
            nextApps = currentApps.length === 0
                ? [ CDS_CONSOLE_APP ]
                : currentApps;
        } else {
            nextApps = currentApps.filter((app: string) => app !== CDS_CONSOLE_APP);
        }

        try {
            await updateCDSConfig({
                cds_enabled: enable,
                system_applications: nextApps
            });

            mutateCDSConfig();
        } catch (error) {
            dispatch(addAlert({
                description: t("customerDataService:common.featurePreview.updateError"),
                level: AlertLevels.ERROR,
                message: t("common:error")
            }));
        }
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
