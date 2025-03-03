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

import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { FunctionComponent, HTMLAttributes, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Icon } from "semantic-ui-react";
import "./policy-list-draggable-node.scss";
import { Popup } from "../../../modules/react-components/src";
import { deletePolicy, publishPolicy } from "../api/entitlement-policies";
import { PolicyInterface } from "../models/policies";

/**
 * Props interface of {@link PolicyListDraggableNode}
 */
export interface PolicyListDraggableNodePropsInterface
    extends IdentifiableComponentInterface,
        HTMLAttributes<HTMLDivElement> {
    /**
     * The node that is being dragged.
     */
    policy: PolicyInterface;
    /**
     * Delete an active policy.
     *
     * @param policyId - The policy ID.
     */
    onDelete: (policyId: string) => void;
    /**
     * Callback to deactivate a policy.
     *
     * @param policyId - The policy ID.
     */
    onDeactivate: (policyId: string) => void;
}

const PolicyListDraggableNode: FunctionComponent<PolicyListDraggableNodePropsInterface> = ({
    "data-componentid": componentId = "policy-list-draggable-node",
    policy,
    onDelete,
    onDeactivate
}: PolicyListDraggableNodePropsInterface): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const handleDelete = async (): Promise<void> => {
        try {
            await publishPolicy({
                action: "DELETE",
                enable: true,
                order: 0,
                policyIds: [ `${policy.policyId}` ],
                subscriberIds: [ "PDP Subscriber" ]
            });
            await deletePolicy(btoa(policy.policyId));

            dispatch(addAlert({
                description: t("policyAdministration:alerts.deleteSuccess.description"),
                level: AlertLevels.SUCCESS,
                message: t("policyAdministration:alerts.deleteSuccess.message")
            }));

            onDelete(policy.policyId);
        } catch (error) {
            // Dispatch the error alert.
            dispatch(addAlert({
                description: t("policyAdministration:alerts.deleteFailure.description"),
                level: AlertLevels.ERROR,
                message: t("policyAdministration:alerts.deleteFailure.message")
            }));
        }
    };

    const handleDeactivate = async (): Promise<void> => {
        try {
            await publishPolicy({
                action: "DELETE",
                enable: true,
                order: 0,
                policyIds: [ `${policy.policyId}` ],
                subscriberIds: [ "PDP Subscriber" ]
            });

            dispatch(addAlert({
                description: t("policyAdministration:alerts.deactivateSuccess.description"),
                level: AlertLevels.SUCCESS,
                message: t("policyAdministration:alerts.deactivateSuccess.message")
            }));

            onDeactivate(policy.policyId);
        } catch (error) {
            dispatch(addAlert({
                description:  t("policyAdministration:alerts.deactivateFailure.description"),
                level: AlertLevels.ERROR,
                message: t("policyAdministration:alerts.deactivateFailure.message")
            }));
        }
    };

    return (

        <Card variant="outlined" className="policy-list-node">
            <CardContent>
                <Stack direction={ "row" } justifyContent={ "space-between" } className="policy-action-container">
                    <Typography className="ellipsis-text">{ policy.policyId }</Typography>
                    <Stack direction={ "row" } marginTop={ "3px" }>
                        <Popup
                            trigger={ (
                                <Icon
                                    link={ false }
                                    data-componentid={ `${componentId}-edit-button` }
                                    className="list-icon"
                                    size="small"
                                    color="grey"
                                    name="pencil alternate"
                                    disabled={ true }
                                />
                            ) }
                            position="top center"
                            content={ t("Deactivate Policy to Edit") }
                            inverted
                        />
                        <Popup
                            trigger={ (
                                <Icon
                                    onClick={ handleDelete }
                                    data-componentid={ `${componentId}-edit-button` }
                                    className="list-icon"
                                    size="small"
                                    color="grey"
                                    name="trash alternate"
                                />
                            ) }
                            position="top center"
                            content={ t("common:delete") }
                            inverted
                        />
                        <Popup
                            trigger={ (
                                <Icon
                                    onClick={ handleDeactivate }
                                    data-componentid={ `${componentId}-edit-button` }
                                    className="list-icon"
                                    size="massive"
                                    color="grey"
                                    name="chevron right"
                                />
                            ) }
                            position="top center"
                            content={ t("policyAdministration:popup.deactivate") }
                            inverted
                        />
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default PolicyListDraggableNode;
