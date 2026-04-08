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
import Divider from "@oxygen-ui/react/Divider";
import Typography from "@oxygen-ui/react/Typography";
import updateAction from "@wso2is/admin.actions.v1/api/update-action";
import {
    AccessConfigInterface,
    EncryptionInterface,
    InFlowExtensionActionResponseInterface,
    InFlowExtensionActionUpdateInterface
} from "@wso2is/admin.actions.v1/models/actions";
import { AlertLevels, HttpErrorResponseDataInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AccessConfigOutput,
    ContextTreeNodeMetadata,
    EncryptionOutput,
    FlowContextTree,
    InitialAccessConfig
} from "@wso2is/common.ui.shared-access.v1/components/flow-context-tree";
import { ContentLoader, EmphasizedSegment, Heading } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import defaultContextTreeData from "../../../meta/default-flow-context-tree.json";

const ACTION_TYPE: string = "inFlowExtension";

export interface InFlowExtensionAccessConfigSettingsPropsInterface extends IdentifiableComponentInterface {
    "data-componentid"?: string;
    action: InFlowExtensionActionResponseInterface;
    isLoading: boolean;
    isReadOnly: boolean;
    onUpdate: () => void;
    loader: () => ReactElement;
}

export const InFlowExtensionAccessConfigSettings: FunctionComponent<
    InFlowExtensionAccessConfigSettingsPropsInterface
> = ({
    action,
    isLoading,
    isReadOnly,
    onUpdate,
    loader: Loader,
    ["data-componentid"]: componentId = "in-flow-extension-access-config-settings"
}: InFlowExtensionAccessConfigSettingsPropsInterface): ReactElement => {

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const contextTreeMetadata: ContextTreeNodeMetadata[] =
        defaultContextTreeData.contextTree as ContextTreeNodeMetadata[];

    const [ accessConfig, setAccessConfig ] = useState<AccessConfigInterface>({
        expose: [],
        modify: []
    });
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const initialAccessConfig: InitialAccessConfig | undefined = useMemo(() => {
        if (action?.accessConfig) {
            return {
                expose: action.accessConfig.expose ?? [],
                modify: action.accessConfig.modify ?? []
            };
        }

        return undefined;
    }, [ action ]);

    const hasCertificate: boolean = !!action?.encryption?.certificate;

    const handleAccessConfigChange = (
        newAccessConfig: AccessConfigOutput,
        _newEncryption: EncryptionOutput
    ): void => {
        setAccessConfig(newAccessConfig as AccessConfigInterface);
    };

    const handleUpdate = (): void => {
        setIsSubmitting(true);

        const updateBody: InFlowExtensionActionUpdateInterface = {
            accessConfig
        };

        updateAction<InFlowExtensionActionUpdateInterface>(ACTION_TYPE, action.id, updateBody)
            .then(() => {
                dispatch(addAlert({
                    description: t("authenticationProvider:notifications.updateIDP.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("authenticationProvider:notifications.updateIDP.success.message")
                }));
                onUpdate();
            })
            .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
                dispatch(addAlert({
                    description: error?.response?.data?.description
                        ?? t("authenticationProvider:notifications.updateIDP.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("authenticationProvider:notifications.updateIDP.genericError.message")
                }));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    if (isLoading || !action) {
        return <Loader />;
    }

    return (
        <Box className="in-flow-extension-access-config-tab">
            <EmphasizedSegment
                padded="very"
                data-componentid={ `${componentId}-section` }
            >
                { !hasCertificate && (
                    <Alert
                        severity="warning"
                        sx={ { mb: 2 } }
                        data-componentid={ `${componentId}-cert-warning` }
                    >
                        No encryption certificate provided. Fields marked for encryption will be
                        sent unencrypted. You can upload a certificate in the Settings tab.
                    </Alert>
                ) }
                <Box sx={ { display: "flex", gap: 3 } }>
                    { /* ── Left column: Tree + Update button ── */ }
                    <Box sx={ { flex: "1 1 65%", minWidth: 0 } }>
                        <FlowContextTree
                            contextTree={ contextTreeMetadata }
                            onChange={ handleAccessConfigChange }
                            initialAccessConfig={ initialAccessConfig }
                            hasCertificate={ hasCertificate }
                            readOnly={ isReadOnly }
                            data-componentid={ `${componentId}-tree` }
                        />
                        { !isReadOnly && (
                            <Button
                                size="medium"
                                variant="contained"
                                onClick={ handleUpdate }
                                loading={ isSubmitting }
                                sx={ { mt: 3 } }
                                data-componentid={ `${componentId}-update-button` }
                            >
                                { t("actions:buttons.update") }
                            </Button>
                        ) }
                    </Box>
                    { /* ── Right column: Instructions ── */ }
                    <Box sx={ { flex: "0 0 35%", maxWidth: "35%" } }>
                        <Heading as="h5">
                            { t("inFlowExtension:createWizard.helpPanel.whatIsContext.heading") }
                        </Heading>
                        <Typography variant="body2" color="text.secondary" sx={ { mb: 1 } }>
                            { t("inFlowExtension:createWizard.helpPanel.whatIsContext.description") }
                        </Typography>
                        <Divider sx={ { mb: 2, mt: 2 } } />
                        <Heading as="h6">
                            { t("inFlowExtension:createWizard.helpPanel.howToUse.heading") }
                        </Heading>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            component="div"
                            sx={ { mb: 2 } }
                        >
                            <ul style={ { lineHeight: 1.8, paddingLeft: "18px" } }>
                                <li>
                                    { t("inFlowExtension:createWizard.helpPanel.howToUse.step1") }
                                </li>
                                <li>
                                    { t("inFlowExtension:createWizard.helpPanel.howToUse.step2") }
                                </li>
                                <li>
                                    { t("inFlowExtension:createWizard.helpPanel.howToUse.step3") }
                                </li>
                                <li>
                                    { t("inFlowExtension:createWizard.helpPanel.howToUse.step4") }
                                </li>
                                <li>
                                    { t("inFlowExtension:createWizard.helpPanel.howToUse.step5") }
                                </li>
                                <li>
                                    { t("inFlowExtension:createWizard.helpPanel.howToUse.step6") }
                                </li>
                            </ul>
                        </Typography>
                    </Box>
                </Box>
            </EmphasizedSegment>
        </Box>
    );
};
