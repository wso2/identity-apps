/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com).
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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, Claim, ClaimsGetParams, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { LinkButton, Media, Popup, Text, useMediaContext } from "@wso2is/react-components";
import moment from "moment";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import {
    Button,
    Divider,
    Grid,
    Header,
    Label,
    List,
    ListItem,
    Modal,
    SemanticCOLORS,
    Table
} from "semantic-ui-react";
import { getAllLocalClaims } from "../../admin.claims.v1/api";
import { ApprovalStatus, ApprovalTaskDetails } from "../models";

/**
 * Prop-types for the approvals edit page component.
 */
interface ApprovalTaskComponentPropsInterface extends TestableComponentInterface {
    /**
     * The selected approval task.
     */
    approval: ApprovalTaskDetails;
    /**
     * Open the approval task modal.
     */
    openApprovalTaskModal: boolean;
    /**
     * Function to handle closing the modal.
     */
    onCloseApprovalTaskModal: () => void;
    /**
     * Function to update the approval task status.
     * @param id - Id of the approval.
     * @param status - Status of the approval.
     */
    updateApprovalStatus: (
        id: string,
        status: ApprovalStatus.CLAIM | ApprovalStatus.RELEASE | ApprovalStatus.APPROVE | ApprovalStatus.REJECT
    ) => void;
    /**
     * Resolve the label color of the task.
     * @param status - Status of the approval.
     */
    resolveApprovalTagColor?: (
        status: ApprovalStatus.READY | ApprovalStatus.RESERVED | ApprovalStatus.COMPLETED | ApprovalStatus.BLOCKED
    ) => SemanticCOLORS;
    /**
     * Specifies if the form is submitting
     */
    isSubmitting?: boolean;
}

/**
 * Approvals task component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Approval Task component.
 */
export const ApprovalTaskComponent: FunctionComponent<ApprovalTaskComponentPropsInterface> = (
    props: ApprovalTaskComponentPropsInterface
): ReactElement => {

    const {
        approval,
        resolveApprovalTagColor,
        updateApprovalStatus,
        openApprovalTaskModal,
        onCloseApprovalTaskModal,
        isSubmitting,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const { isMobileViewport } = useMediaContext();
    const dispatch: Dispatch = useDispatch();
    const [ localClaims, setLocalClaims ] = useState<Claim[]>([]);


    const getLocalClaims = () => {
        const params: ClaimsGetParams = {
            "exclude-hidden-claims": true,
            filter: null,
            limit: null,
            offset: null,
            sort: null
        };

        getAllLocalClaims(params).then((response: Claim[]) => {
            setLocalClaims(response);
        }).catch((error: IdentityAppsApiException) => {
            dispatch(addAlert(
                {
                    description: error?.response?.data?.description
                        || t("actions:notifications.genericError.userAttributes.getAttributes.description"),
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message
                        || t("actions:notifications.genericError.userAttributes.getAttributes.message")
                }
            ));
            throw error;
        });
    };

    const getClaimDisplayName: (claim: string) => string = useMemo(() => {

        const claimMap: Map<string, string> = new Map();

        localClaims.forEach((claim: Claim) => {
            if (claim.claimURI && claim.displayName) {
                claimMap.set(claim.claimURI, claim.displayName);
            }
        });

        return (claim: string): string => {

            const equalIndex: number = claim.indexOf("=");

            if (equalIndex === -1) {
                return claimMap.get(claim.trim()) ?? claim;
            }

            const claimUri: string = claim.substring(0, equalIndex).trim();

            if (!claimUri) {
                return claim;
            }

            const displayName: string | undefined = claimMap.get(claimUri);

            return displayName ? displayName : claimUri;
        };

    }, [ localClaims ]);

    useEffect(() => {
        getLocalClaims();
    }, []);


    /**
     * Removes unnecessary commas at the end of property values and splits
     * up the claim values.
     *
     * @remarks
     * The API returns properties as key value pairs and these values often contains
     * unnecessary commas at the end. This function will cleanup the values and it can
     * be removed once the API is fixed.
     *
     * @param key - Property key.
     * @param value - Property value.
     * @returns A cleaned up string.
     */
    const populateProperties = (key: string, value: string): string | JSX.Element => {
        if (key === "Claims") {
            value = value.replace(/^\{|\}$/g, "").trim();
            const claims: string[] = value.split(",");

            return (
                <>
                    { claims.map((claim: string, index: number) => {
                        const claimValue: string = claim.split("=")[1]?.trim();

                        return (
                            <Table.Row key={ `${key}-${index}` }>
                                <Table.Cell className="key-cell">
                                    { getClaimDisplayName(claim) }
                                </Table.Cell>
                                <Table.Cell collapsing className="values-cell">
                                    <Popup
                                        content={ claimValue }
                                        trigger={ (
                                            <Text truncate>
                                                { claimValue }
                                            </Text>
                                        ) }
                                        position="top left"
                                        inverted
                                    />
                                </Table.Cell>
                            </Table.Row>
                        );
                    }) }
                </>
            );
        }

        if (key === "Roles" || key == "Permissions" || key === "Groups" || key === "Users" ||
            key === "Users to be Added" || key === "Users to be Deleted") {
            value = value.replace(/^\[|\]$/g, "").trim();

            try {
                const valueList: string[] = value.split(",");

                return (
                    <Table.Row key={ key }>
                        <Table.Cell className="key-cell">
                            { t("console:manage.features.approvals.modals.approvalProperties." +`${ key }`) }
                        </Table.Cell>
                        <Table.Cell collapsing className="values-cell">
                            <List className="values-list">
                                { valueList.map((item: string, index: number) => (
                                    <ListItem key={ index }>
                                        <Text truncate>{ item.trim() }</Text>
                                    </ListItem>
                                )) }
                            </List>
                        </Table.Cell>
                    </Table.Row>
                );
            } catch(e) {
                // Let it pass through and use the default behavior.
                // Add debug logs here one a logger is added.
                // Tracked here https://github.com/wso2/product-is/issues/11650.
            }
        }

        // Handle other properties that don't need special formatting.
        return (
            <Table.Row key={ key }>
                <Table.Cell className="key-cell">
                    { t("console:manage.features.approvals.modals.approvalProperties." +`${ key }`) }
                </Table.Cell>
                <Table.Cell collapsing className="values-cell">
                    <Text truncate>{ value.endsWith(",") ? value.slice(0, -1) : value }</Text>
                </Table.Cell>
            </Table.Row>
        );
    };

    /**
     * Properties table sub component.
     *
     * @param properties - List of properties.
     * @returns A table containing the list of properties.
     */
    const propertiesTable = (properties: { key: string, value: string }[]): JSX.Element => (
        <Table celled compact className="approval-tasks-table" verticalAlign="top">
            <Table.Body>
                {
                    properties.map((property: { key: string, value: string }) => (
                        property.key && property.value
                            ? (
                                populateProperties(property.key, property.value)
                            )
                            : null
                    )
                    )
                }
            </Table.Body>
        </Table>
    );

    /**
     * Button panel sub component to perform approval status changes.
     *
     * @param editingApproval - The editing approval.
     * @returns A panel containing all the possible action buttons.
     */
    const approvalActions = (editingApproval: ApprovalTaskDetails): JSX.Element => (
        <>
            {
                editingApproval?.taskStatus === ApprovalStatus.READY
                    ? (
                        <Button
                            default
                            className="mb-1x"
                            fluid={ isMobileViewport }
                            onClick={ () => {
                                updateApprovalStatus(editingApproval.id, ApprovalStatus.CLAIM);
                                onCloseApprovalTaskModal();
                            } }
                        >
                            { t("common:claim") }
                        </Button>
                    )
                    : editingApproval?.taskStatus === ApprovalStatus.RESERVED
                        ? (
                            <Button
                                default
                                className="mb-1x"
                                fluid={ isMobileViewport }
                                onClick={ () => {
                                    updateApprovalStatus(editingApproval.id, ApprovalStatus.RELEASE);
                                    onCloseApprovalTaskModal();
                                } }
                            >
                                { t("common:release") }
                            </Button>
                        )
                        : null
            }
            {
                editingApproval?.taskStatus != ApprovalStatus.BLOCKED
                    ? (
                        <Button
                            primary
                            className="mb-1x"
                            fluid={ isMobileViewport }
                            onClick={ () => {
                                updateApprovalStatus(editingApproval.id, ApprovalStatus.APPROVE);
                                onCloseApprovalTaskModal();
                            } }
                            loading={ isSubmitting }
                            disabled={ isSubmitting }
                        >
                            { t("common:approve") }
                        </Button>
                    )
                    : null
            }
            <Button
                negative
                className="mb-1x"
                fluid={ isMobileViewport }
                onClick={ () => {
                    updateApprovalStatus(editingApproval.id, ApprovalStatus.REJECT);
                    onCloseApprovalTaskModal();
                } }
            >
                { t("common:reject") }
            </Button>
        </>
    );

    return (
        <Modal
            open={ openApprovalTaskModal }
            closeOnDimmerClick={ true }
            dimmer
        >
            <Modal.Header>
                <Header as="h4" image data-testid={ `${ testId }-item-heading` }>
                    <Header.Content>
                        { t("console:manage.features.approvals.modals.taskDetails.header") }
                        <Header.Subheader>
                            <Label
                                circular
                                size="mini"
                                className="micro spaced-right"
                                color={ resolveApprovalTagColor(approval?.taskStatus) }
                            />

                            { "Your approval is needed to proceed with the request."
                            }
                        </Header.Subheader>
                    </Header.Content>
                </Header>
            </Modal.Header>
            <Modal.Content>
                <Grid.Row>
                    <Grid.Column>
                        <List.Content>
                            <Grid padded>
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column width={ 3 }>
                                        { t("common:createdOn") }
                                    </Grid.Column>
                                    <Grid.Column width={ 12 }>
                                        <List.Description>
                                            {
                                                moment(parseInt(approval?.createdTimeInMillis,
                                                    10)).format("lll")
                                            }
                                        </List.Description>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </List.Content>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <List.Content>
                            <Grid padded>
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column width={ 3 }>
                                        { t("common:description") }
                                    </Grid.Column>
                                    <Grid.Column width={ 12 }>
                                        <List.Description>
                                            {
                                                approval?.description
                                                    ? approval?.description
                                                    : t("console:manage.features.approvals.modals." +
                                                    "taskDetails.description")
                                            }
                                        </List.Description>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </List.Content>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <List.Content>
                            <Grid padded>
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column width={ 3 }>
                                        { t("common:priority") }
                                    </Grid.Column>
                                    <Grid.Column width={ 12 }>
                                        <List.Description>
                                            { approval?.priority }
                                        </List.Description>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </List.Content>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <List.Content>
                            <Grid padded>
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column width={ 3 }>
                                        { t("common:initiator") }
                                    </Grid.Column>
                                    <Grid.Column width={ 12 }>
                                        <List.Description>
                                            { approval?.initiator }
                                        </List.Description>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </List.Content>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <List.Content>
                            <Grid padded>
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column width={ 3 }>
                                        { t("common:approvalStatus") }
                                    </Grid.Column>
                                    <Grid.Column width={ 12 }>
                                        <List.Description>
                                            { approval?.approvalStatus }
                                        </List.Description>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </List.Content>
                    </Grid.Column>
                </Grid.Row>
                {
                    approval?.properties
                        ? (
                            <Grid.Row>
                                <Grid.Column>
                                    <List.Content>
                                        <Grid padded>
                                            <Grid.Row columns={ 2 }>
                                                <Grid.Column width={ 3 }>
                                                    { t("common:properties") }
                                                </Grid.Column>
                                                <Grid.Column mobile={ 16 } computer={ 12 }>
                                                    <Media lessThan="tablet">
                                                        <Divider hidden />
                                                    </Media>
                                                    { propertiesTable(approval?.properties) }
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </List.Content>
                                </Grid.Column>
                            </Grid.Row>
                        )
                        : null
                }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <LinkButton
                                floated="left"
                                onClick={ onCloseApprovalTaskModal }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                            {
                                approval?.taskStatus !== ApprovalStatus.COMPLETED
                                    ? (
                                        <>{ approvalActions(approval) }</>
                                    )
                                    : null
                            }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};
