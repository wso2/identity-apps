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

import Button from "@oxygen-ui/react/Button";
import Card from "@oxygen-ui/react/Card";
import Container from "@oxygen-ui/react/Container";
import Dialog from "@oxygen-ui/react/Dialog";
import DialogActions from "@oxygen-ui/react/DialogActions";
import DialogTitle from "@oxygen-ui/react/DialogTitle";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Grid from "@oxygen-ui/react/Grid";
import List from "@oxygen-ui/react/List";
import ListItem from "@oxygen-ui/react/ListItem";
import ListItemButton from "@oxygen-ui/react/ListItemButton";
import ListItemText from "@oxygen-ui/react/ListItemText";
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

/**
 * Feature preview modal component props interface. {@link FeaturePreviewModal}
 */
interface FeaturePreviewModalPropsInterface extends IdentifiableComponentInterface {
    open: boolean;
    onClose: () => void;
}

/**
 * Preview features list interface.
 */
interface PreviewFeaturesListInterface {
    name: string;
    description: string;
    image?: string;
    value: string;
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
            description: `This feature enables you to customize the user self-registration pages and the flow.
                Once this feature is enabled, existing self-registration configurations will be changed.
                So, make sure to update the "Self-registration Flow" configurations.`,
            image: NewSelfRegistrationImage,
            name: "New Self-Registration",
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

    const handleToggleChange = async (e: ChangeEvent<HTMLInputElement>) => {
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
    };

    return (
        <Dialog
            onClose={ handleClose }
            open={ open }
            data-componentid={ componentId }
            maxWidth={ (previewFeaturesList?.length) > 1 ? "lg" : "md" }
            className="preview-features-modal"
        >
            { (previewFeaturesList?.length > 1) && <DialogTitle>Feature Preview</DialogTitle> }
            <Container sx={ { mt: 4 } }>
                <Grid container spacing={ 2 }>
                    { (previewFeaturesList?.length > 1) && (
                        <Grid xs={ 4 }>
                            <List style={ { padding: "0" } }>
                                { previewFeaturesList?.map((item: PreviewFeaturesListInterface) => (
                                    <ListItem key={ item.name } disablePadding>
                                        <Card style={ { marginBottom: "10px", padding: "0", width: "100%" } }>
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
                        <Grid
                            container
                            component="div"
                            justifyContent="space-between"
                            alignItems="center"
                            flexDirection={ { sm: "row", xs: "column" } }
                        >
                            <Grid sx={ { order: { sm: 1, xs: 2 } } }>
                                <Typography variant="h6">{ selected?.name }</Typography>
                            </Grid>
                            <Grid container columnSpacing={ 1 } sx={ { order: { sm: 2, xs: 1 } } }>
                                <FormControlLabel
                                    control={ (
                                        <Switch
                                            onChange={ handleToggleChange }
                                            value={ selected?.value }
                                            checked={ isEnableDynamicSelfRegistrationPortal }
                                        />
                                    ) }
                                    label={ isEnableDynamicSelfRegistrationPortal ?
                                        t("common:enabled") : t("common:disabled") }
                                    labelPlacement="start"
                                />
                            </Grid>
                        </Grid>
                        <hr style={ { marginBottom: "20px", opacity: "0.4" } } />
                        <div>
                            <p>{ selected?.description }</p>
                        </div>
                        { selected?.image &&
                            <img src={ selected.image } style={ { marginTop: "20px", width: "100%" } } />
                        }
                    </Grid>
                </Grid>
            </Container>
            <DialogActions>
                <Button onClick={ handleClose } color="primary">
                    { t("common:cancel") }
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FeaturePreviewModal;
