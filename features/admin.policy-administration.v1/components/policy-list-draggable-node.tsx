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
import { AppConstants, history } from "@wso2is/admin.core.v1";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import kebabCase from "lodash-es/kebabCase";
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
    mutateActivePolicyList?: () => void;
    mutateInactivePolicyList?: () => void;
    setActivePolicies?: React.Dispatch<React.SetStateAction<PolicyInterface[]>>;
    setPageActive: React.Dispatch<React.SetStateAction<number>>;
    setHasMoreActivePolicies: React.Dispatch<React.SetStateAction<boolean>>;
}

const PolicyListDraggableNode: FunctionComponent<PolicyListDraggableNodePropsInterface> = ({
    "data-componentid": componentId = "policy-list-draggable-node",
    policy,
    mutateActivePolicyList,
    mutateInactivePolicyList,
    setActivePolicies,
    setPageActive,
    setHasMoreActivePolicies
}: PolicyListDraggableNodePropsInterface): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const handleEdit = (policyId: string) => {
        history.push(`${AppConstants.getPaths().get("EDIT_POLICY").replace(":id", kebabCase(policyId))}`);
    };

    const handleDelete = async (): Promise<void> => {
        try {
            await publishPolicy({
                action: "DELETE",
                enable: true,
                order: 0,
                policyIds: [ `${policy.policyId}` ],
                subscriberIds: [ "PDP Subscriber" ]
            });
            await deletePolicy(policy.policyId);

            dispatch(addAlert({
                description: t("policyAdministration:alerts.deleteSuccess.description"),
                level: AlertLevels.SUCCESS,
                message: t("policyAdministration:alerts.deleteSuccess.message")
            }));

            setActivePolicies([]);
            setPageActive(0);
            setHasMoreActivePolicies(true);

            mutateActivePolicyList();
            mutateInactivePolicyList();

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

            mutateActivePolicyList();
            mutateInactivePolicyList();

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
                <Stack direction={ "row" } justifyContent={ "space-between" }>
                    <Typography className="ellipsis-text">{ policy.policyId }</Typography>
                    <Stack direction={ "row" } marginTop={ "3px" }>
                        <Popup
                            trigger={ (
                                <Icon
                                    link={ true }
                                    onClick={ () => handleEdit(policy.policyId) }
                                    data-componentid={ `${componentId}-edit-button` }
                                    className="list-icon"
                                    size="small"
                                    color="grey"
                                    name="pencil alternate"
                                />
                            ) }
                            position="top center"
                            content={ "Edit" }
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
                            content={ "Delete" }
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
                            content={ "Deactivate" }
                            inverted
                        />
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default PolicyListDraggableNode;
