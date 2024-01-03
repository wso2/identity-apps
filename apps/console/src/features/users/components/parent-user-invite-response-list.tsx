/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
import AlertTitle from "@oxygen-ui/react/AlertTitle";
import Typography from "@oxygen-ui/react/Typography";
import {
    DataTable,
    EmptyPlaceholder,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
    Grid,
    Header,
    Label
} from "semantic-ui-react";
import { UIConstants, getEmptyPlaceholderIllustrations } from "../../core";
import {
    ParentOrgUserInvitationResult,
    ParentOrgUserInviteErrorCode,
    ParentOrgUserInviteResultStatus
} from "../components/guests/models/invite";

interface ParentInviteResponseListProps {
    response: ParentOrgUserInvitationResult[];
    isLoading?: boolean;
    hasError?: boolean;
    ["data-componentid"]?: string;
}

interface ParentUserInviteResponseListItem {
    username: string;
    status: string;
    message: string;
}

interface ParentUserInviteSummaryResponse {
    successCount: number;
    failedCount: number;
    totalCount: number;
}

/**
 * Parent user invite response list component.
 *
 * @param props - Props injected to the component.
 * @returns Users list component.
 */
export const ParentInviteResponseList: React.FunctionComponent<ParentInviteResponseListProps> = (
    props: ParentInviteResponseListProps
): ReactElement => {

    const {
        response,
        isLoading,
        hasError,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const [ responseList, setResponseList ] = useState<ParentUserInviteResponseListItem[]>([]);
    const [ responseSummary, setResponseSummary ] = useState<ParentUserInviteSummaryResponse>({
        failedCount: 0,
        successCount: 0,
        totalCount: 0
    });

    useEffect(() => {
        if (response && response?.length > 0) {
            response.map((item: ParentOrgUserInvitationResult) => {
                let message: string = t("console:manage.features.invite.notifications.sendInvite.success.message");

                if (item.result.errorCode) {
                    switch (item.result.errorCode) {
                        case ParentOrgUserInviteErrorCode.ERROR_CODE_USER_NOT_FOUND:
                            message = t("console:manage.features.user.modals.inviteParentUserWizard." +
                            "tableMessages.userNotFound");

                            break;
                        case ParentOrgUserInviteErrorCode.ERROR_CODE_ACTIVE_INVITATION_EXISTS:
                            message = t("console:manage.features.user.modals.inviteParentUserWizard." +
                            "tableMessages.activeInvitationExists");

                            break;
                        case ParentOrgUserInviteErrorCode.ERROR_CODE_INVITED_USER_EMAIL_NOT_FOUND:
                            message = t("console:manage.features.user.modals.inviteParentUserWizard." +
                            "tableMessages.userEmailNotFound");

                            break;
                        case ParentOrgUserInviteErrorCode.ERROR_CODE_USER_ALREADY_EXISTS_INVITED_ORGANIZATION:
                            message = t("console:manage.features.user.modals.inviteParentUserWizard." +
                            "tableMessages.userAlreadyExist");

                            break;
                    }
                }
                setResponseList((prevState: ParentUserInviteResponseListItem[]) => [
                    ...prevState,
                    {
                        message: message,
                        status: item.result.status,
                        username: item.username
                    }
                ]);
                if (item.result.status === ParentOrgUserInviteResultStatus.SUCCESS ) {
                    setResponseSummary((prevState: ParentUserInviteSummaryResponse) => ({
                        ...prevState,
                        successCount: prevState.successCount + 1,
                        totalCount: prevState.totalCount + 1
                    }));
                } else {
                    setResponseSummary((prevState: ParentUserInviteSummaryResponse) => ({
                        ...prevState,
                        failedCount: prevState.failedCount + 1,
                        totalCount: prevState.totalCount + 1
                    }));
                }
            });
        }
    }, [ response ]);

    /**
     * Resolves data table columns.
     *
     * @returns Table columns.
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        const defaultColumns: TableColumnInterface[] = [
            {
                allowToggleVisibility: false,
                dataIndex: "resourceIdentifier",
                id: "resourceIdentifier",
                key: "resourceIdentifier",
                render: (item: ParentUserInviteResponseListItem): ReactNode => {
                    return (
                        <Header as="h6" data-componentid={ `${componentId}-username-item-heading` }>
                            <Header.Content>
                                { item.username }
                            </Header.Content>
                        </Header>
                    );
                },
                title: t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableHeaders.username")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "status",
                id: "status",
                key: "status",
                render: (item: ParentUserInviteResponseListItem): ReactNode => {
                    return (
                        <Header as="h6" data-componentid={ `${componentId}-status-item-heading` } >
                            <Header.Content>
                                <Label
                                    data-componentid={ `${componentId}-bulk-label` }
                                    content={ item.status }
                                    size="small"
                                    color={ item.status === ParentOrgUserInviteResultStatus.SUCCESS ? "green" : "red" }
                                    className="group-label"
                                />
                            </Header.Content>
                        </Header>
                    );
                },
                title: t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableHeaders.status")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "message",
                id: "message",
                key: "message",
                render: (item: ParentUserInviteResponseListItem): ReactNode => {
                    return (
                        <Header as="h6" data-componentid={ `${componentId}-status-item-heading` }>
                            <Header.Content>
                                { item.message }
                            </Header.Content>
                        </Header>
                    );
                },
                title: t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableHeaders.message")
            }
        ];

        return defaultColumns;
    };

    /**
     * Shows list placeholders.
     *
     * @returns Placeholders.
     */
    const showPlaceholders = (): ReactElement => {
        return (
            <EmptyPlaceholder
                data-testid={ `${componentId}-empty-search-result` }
                data-componentid={ `${componentId}-empty-search-result` }
                image={ getEmptyPlaceholderIllustrations().emptySearch }
                imageSize="tiny"
                title={ t("console:manage.features.users.usersList.search.emptyResultPlaceholder.title") }
                subtitle=""
            />
        );
    };

    return (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                    {
                        isLoading || hasError
                            ? null
                            : responseSummary?.failedCount === 0
                                ? ((
                                    <Alert severity="success" data-componentid={ `${componentId}-success-alert` }>
                                        <AlertTitle data-componentid={ `${componentId}-success-alert-title` }>
                                            {
                                                t("console:manage.features.user.modals.inviteParentUserWizard." +
                                                "successAlert.message")
                                            }
                                        </AlertTitle>
                                        {
                                            t("console:manage.features.user.modals.inviteParentUserWizard." +
                                            "successAlert.description")
                                        }
                                    </Alert>
                                )) : (
                                    <Alert severity="error" data-componentid={ `${componentId}-error-alert` }>
                                        <AlertTitle data-componentid={ `${componentId}-error-alert-title` }>
                                            {
                                                t("console:manage.features.user.modals.inviteParentUserWizard." +
                                                "errorAlert.message")
                                            }
                                        </AlertTitle>
                                        <Trans
                                            i18nKey={
                                                "console:manage.features.user.modals.inviteParentUserWizard." +
                                                "errorAlert.description"
                                            }
                                            tOptions={ {
                                                failedCount: responseSummary?.failedCount
                                            } }
                                        >
                                            An error occurred while inviting { responseSummary?.failedCount } user(s)..
                                        </Trans>
                                    </Alert>
                                )
                    }
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                    <Typography variant="body2" style={ { textAlign: "right" } }>
                        {
                            t("console:manage.features.user.modals.inviteParentUserWizard.totalInvitations") +
                            " : " +  responseSummary?.totalCount
                        }
                    </Typography>
                    <DataTable<ParentUserInviteResponseListItem[]>
                        className="addon-field-wrapper"
                        isLoading={ isLoading }
                        actions={ [] }
                        columns={ resolveTableColumns() }
                        data={ responseList }
                        onColumnSelectionChange={ () => null }
                        onRowClick={ () => null }
                        placeholders={ showPlaceholders() }
                        transparent={ true }
                        selectable={ false }
                        showHeader={ false }
                        data-testid={ `${componentId}-data-table` }
                        data-componentid={ `${componentId}-data-table` }
                        loadingStateOptions={ {
                            count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                            imageType: "circular"
                        } }
                    />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

/**
 * Default props for the component.
 */
ParentInviteResponseList.defaultProps = {
    "data-componentid": "parent-invite-response-list",
    hasError: false,
    isLoading: false,
    response: []
};
