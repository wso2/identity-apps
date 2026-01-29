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
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal } from "@wso2is/react-components";
import classNames from "classnames";
import React, { FC, HTMLAttributes, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import deleteFlow from "../../api/delete-flow";
import useGetFlowConfig from "../../api/use-get-flow-config";
import useAuthenticationFlowBuilderCore from "../../hooks/use-authentication-flow-builder-core-context";
import "./floating-revert-button.scss";

/**
 * Props interface of {@link FloatingRevertButton}
 */
export interface FloatingRevertButtonProps extends IdentifiableComponentInterface, HTMLAttributes<HTMLDivElement>  {
    flowType: any;
    flowTypeDisplayName: string;
    onRevert?: () => void;
}

/**
 * Revert button for the for the flow builder page.
 *
 * @param props - Props injected to the component.
 * @returns FloatingRevertButton component.
 */
const FloatingRevertButton: FC<FloatingRevertButtonProps> = ({
    ["data-componentid"]: componentId = "flow-builder-page-revert-button",
    className,
    flowType,
    flowTypeDisplayName,
    onRevert
}: FloatingRevertButtonProps): ReactElement => {
    const { t } = useTranslation();
    const { isResourcePropertiesPanelOpen } = useAuthenticationFlowBuilderCore();
    const dispatch: Dispatch = useDispatch();
    const { data: flowConfig, error: flowConfigError } = useGetFlowConfig(flowType);

    const [ isReverting, setIsReverting ] = useState<boolean>(false);
    const [ showConfirmationModal, setShowConfirmationModal ] = useState<boolean>(false);

    useEffect(() => {
        if (flowConfigError) {
            dispatch(
                addAlert<AlertInterface>({
                    description: t("flows:core.notifications.fetchFlowConfig.genericError.description", {
                        flowType: flowTypeDisplayName
                    }),
                    level: AlertLevels.ERROR,
                    message: t("flows:core.notifications.fetchFlowConfig.genericError.message", {
                        flowType: flowTypeDisplayName
                    })
                })
            );
        }
    }, [ flowConfigError ]);

    /**
     * Handle the revert action
     */
    const handleRevert = async (): Promise<void> => {
        setIsReverting(true);
        setShowConfirmationModal(false);

        try {
            await deleteFlow(flowType);

            dispatch(
                addAlert<AlertInterface>({
                    description: t("flows:core.notifications.revertFlow.success.description", {
                        flowType: flowTypeDisplayName
                    }),
                    level: AlertLevels.SUCCESS,
                    message: t("flows:core.notifications.revertFlow.success.message", {
                        flowType: flowTypeDisplayName
                    })
                })
            );

            onRevert?.();
        } catch (error) {
            dispatch(
                addAlert<AlertInterface>({
                    description: t("flows:core.notifications.revertFlow.genericError.description", {
                        flowType: flowTypeDisplayName
                    }),
                    level: AlertLevels.ERROR,
                    message: t("flows:core.notifications.revertFlow.genericError.message", {
                        flowType: flowTypeDisplayName
                    })
                })
            );
        } finally {
            setIsReverting(false);
        }
    };

    /**
     * Handle the revert button click
     */
    const handleRevertClick = (): void => {
        setShowConfirmationModal(true);
    };

    /**
     * Handle the confirmation modal close
     */
    const handleConfirmationModalClose = (): void => {
        setShowConfirmationModal(false);
    };

    return (
        <>
            <Button
                className={ classNames("floating-revert-button", {
                    "save-draft-button": !flowConfig?.isEnabled,
                    transition: isResourcePropertiesPanelOpen
                }, className) }
                variant="outlined"
                loading={ isReverting }
                onClick={ handleRevertClick }
                data-componentid={ componentId }
            >
                { t("common:revert") }
            </Button>

            <ConfirmationModal
                data-componentid={ `${ componentId }-confirmation-modal` }
                onClose={ handleConfirmationModalClose }
                type="negative"
                open={ showConfirmationModal }
                assertionHint={ t("flows:core.modals.revertFlow.assertionHint") }
                assertionType="checkbox"
                primaryAction={ t("common:revert") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ handleConfirmationModalClose }
                primaryActionLoading={ isReverting }
                onPrimaryActionClick={ handleRevert }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header data-componentid={ `${ componentId }-confirmation-modal-header` }>
                    { t("flows:core.modals.revertFlow.title", { flowType: flowTypeDisplayName }) }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    data-componentid={ `${ componentId }-confirmation-modal-message` }
                    attached
                    negative
                >
                    { t("flows:core.modals.revertFlow.warning") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content data-componentid={ `${ componentId }-confirmation-modal-content` }>
                    { t("flows:core.modals.revertFlow.description", { flowType: flowTypeDisplayName }) }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </>
    );
};

export default FloatingRevertButton;
