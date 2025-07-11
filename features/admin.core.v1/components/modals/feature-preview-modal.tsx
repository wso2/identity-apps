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

import FlashOnOutlinedIcon from "@mui/icons-material/FlashOnOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import Alert from "@oxygen-ui/react/Alert";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
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
import { AGENT_USERSTORE } from "@wso2is/admin.userstores.v1/constants";
import useUserStores from "@wso2is/admin.userstores.v1/hooks/use-user-stores";
import { UserStoreListItem } from "@wso2is/admin.userstores.v1/models";
import { FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ChangeEvent, FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import NewSelfRegistrationImage from "../../assets/illustrations/preview-features/new-self-registration.png";
import { AppConstants } from "../../constants/app-constants";
import "./feature-preview-modal.scss";

import { history } from "../../helpers/history";
import { AppState } from "../../store";

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
     * Feature message.
     */
    message?: {
        type: "info" | "warning" | "error";
        content: string;
    };
}

const AgentFeatureAnnouncement = () => {
    const features: any = [
        {
            icon: <ShieldOutlinedIcon fontSize="medium" />,
            subtitle: "Control what each agent can access and do",
            title: "Secure your agents with role-based access control"
        },
        {
            icon: <VpnKeyOutlinedIcon fontSize="medium" />,
            subtitle: "Minimize risk with seamless secret lifecycle management.",
            title: "Credential management and rotation"
        },
        {
            icon: <FlashOnOutlinedIcon fontSize="medium" />,
            subtitle: "Connect to APIs, resources, and MCP servers",
            title: "Integrate with your existing applications seamlessly"
        },
        {
            icon: <GroupsOutlinedIcon fontSize="medium" />,
            subtitle: "Secure interaction patterns for any use case",
            title: "Enable human-in-the-loop and multi-agent workflows"
        }
    ];

    return (
        <Box sx={ { flexGrow: 1, pb: 4, pt: 4 } }>
            <Grid container spacing={ 2 }>
                { features.map((feature: any, index: number) => (
                    <Grid xs={ 12 } md={ 6 } key={ index }>
                        <Card variant="outlined" sx={ { display: "flex", gap: 2, p: 2 } }>
                            <Box sx={ { color: "secondary.main", pt: 1 } }>{ feature.icon }</Box>
                            <CardContent sx={ { p: 0 } }>
                                <Typography variant="subtitle1" fontWeight={ 600 }>
                                    { feature.title }
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    { feature.subtitle }
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                )) }
            </Grid>
        </Box>
    );
};

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
        isLoading: isUserStoresListFetchRequestLoading,
        userStoresList
    } = useUserStores();

    const { data: connectorDetails, mutate: connectorDetailsMutate } = useGetGovernanceConnectorById(
        ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID,
        ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID
    );

    const [ isEnableDynamicSelfRegistrationPortal, setIsEnableDynamicSelfRegistrationPortal ] = useState(false);

    const agentsFeatureConfig: FeatureAccessConfigInterface =
        useSelector((state: AppState) => state?.config?.ui?.features?.agents);

    const isAgentManagementFeatureEnabledForOrganization: boolean = useMemo(() => {
        const agentUserStore: UserStoreListItem =
                userStoresList?.find((userStore: UserStoreListItem) => userStore?.name === AGENT_USERSTORE);

        if (agentUserStore) {
            return true;
        }

        return false;
    }, [ isUserStoresListFetchRequestLoading, userStoresList ]);

    {/* TODO: Get this from an Organization Preferences API */}
    const previewFeaturesList: PreviewFeaturesListInterface[] = useMemo(() => ([
        agentsFeatureConfig?.enabled && {
            action: "Try out",
            component: <AgentFeatureAnnouncement />,
            description: "Extend your identity management to autonomous agents with secure, dynamic authorization",
            enabled: isAgentManagementFeatureEnabledForOrganization,
            id: "agents",
            message: {
                content: isAgentManagementFeatureEnabledForOrganization
                    ? "This feature is experimental and still under active development. " +
                    "It may be unstable, change without notice, or have limited functionality and " +
                    "support. Use in production environments is not recommended."
                    : "Agent management is not currently available for this organization. To access " +
                    "this feature, please create a new organization.",
                type: isAgentManagementFeatureEnabledForOrganization ? "warning" as const : "info" as const
            },
            name: "Identity for AI Agents",
            value: null
        },
        {
            action: "Try Flow Composer",
            description: "This feature enables you to customize the user self-registration flow and " +
                "secure your user onboarding experience with multiple authentication methods and verification steps.",
            enabled: isEnableDynamicSelfRegistrationPortal,
            id: "self-registration-orchestration",
            image: NewSelfRegistrationImage,
            message: {
                content: "Once this feature is enabled, existing self-registration flow configurations will be " +
                    "changed. So, update your settings accordingly.",
                type: "warning" as const
            },
            name: "Self-Registration Orchestration",
            value: "SelfRegistration.EnableDynamicPortal"
        }
    ].filter(Boolean)), [ isAgentManagementFeatureEnabledForOrganization, isEnableDynamicSelfRegistrationPortal ]);

    const [ selected, setSelected ] = useState(previewFeaturesList[0]);

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
            case "agents":
                return history.push(AppConstants.getPaths().get("AGENTS"));
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
                                        { selected?.id !== "agents" && (
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
                                                label={ selected?.enabled ?
                                                    t("common:enabled") : t("common:disabled") }
                                                labelPlacement="start"
                                            />
                                        ) }
                                    </Stack>
                                )
                            }
                            <div>
                                <p>{ selected?.description }</p>
                            </div>
                            { selected?.message?.type && selected?.message?.content && (
                                <Alert severity={ selected?.message?.type } sx={ { marginTop: "10px" } }>
                                    { selected?.message?.content }
                                </Alert>
                            ) }

                            { selected?.image &&
                                (
                                    <img
                                        src={ selected.image }
                                        style={ { marginBottom: "20px", marginTop: "20px", width: "100%" } }
                                    />
                                )
                            }
                            { selected?.component && selected?.component }
                            {
                                previewFeaturesList?.length > 1 && selected?.enabled &&
                                 (
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
