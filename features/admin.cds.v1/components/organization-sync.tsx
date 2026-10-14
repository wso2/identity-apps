/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmphasizedSegment, PrimaryButton } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Header, Icon, Label, Message } from "semantic-ui-react";
import { startOrganizationTreeSync } from "../api/organization-management";
import { TreeSyncState, TreeSyncStatus } from "../models/organization-management";

interface OrganizationSyncPropsInterface extends IdentifiableComponentInterface {
    /**
     * The state of the sync. Undefined while it loads.
     */
    status: TreeSyncStatus;
    /**
     * Whether the user can start a sync.
     */
    canUpdate: boolean;
    /**
     * Reads the state again after a sync starts.
     */
    onStarted: () => void;
}

const STATE_COLORS: Record<TreeSyncState, "grey" | "blue" | "green" | "red"> = {
    FAILED: "red",
    NOT_SYNCED: "grey",
    SYNCED: "green",
    SYNCING: "blue"
};

/**
 * Organization sync of the root organization. CDS reads the organization tree from the
 * identity provider in the background. The organization access needs a sync that completed.
 * The root admin can sync again, for example after an organization event was lost.
 */
const OrganizationSync: FunctionComponent<OrganizationSyncPropsInterface> = ({
    status,
    canUpdate,
    onStarted,
    ["data-componentid"]: componentId = "cds-organization-sync"
}: OrganizationSyncPropsInterface): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const [ isStarting, setIsStarting ] = useState<boolean>(false);

    const state: TreeSyncState = status?.state ?? "NOT_SYNCED";
    const isSyncing: boolean = state === "SYNCING";

    const formatTime = (value?: string): string => value ? new Date(value).toLocaleString() : "-";

    const handleSync = async (): Promise<void> => {
        setIsStarting(true);

        try {
            await startOrganizationTreeSync();
        } catch (error) {
            const data: { code?: string; description?: string } =
                (error as AxiosError<{ code?: string; description?: string }>)?.response?.data;

            dispatch(addAlert({
                description: data?.description
                    ? `${ data.code ? `[${ data.code }] ` : "" }${ data.description }`
                    : t("customerDataService:organizationSync.notifications.error.description"),
                level: AlertLevels.ERROR,
                message: t("customerDataService:organizationSync.notifications.error.message")
            }));
        } finally {
            setIsStarting(false);
            onStarted();
        }
    };

    return (
        <EmphasizedSegment padded data-componentid={ componentId }>
            <Header as="h5">
                <Icon name="sync alternate" />
                <Header.Content>
                    { t("customerDataService:organizationSync.heading") }
                    <Label
                        size="tiny"
                        color={ STATE_COLORS[ state ] }
                        basic
                        style={ { marginLeft: "8px" } }
                        data-componentid={ `${ componentId }-state` }
                    >
                        { isSyncing && <Icon loading name="spinner" /> }
                        { t(`customerDataService:organizationSync.states.${ state }`) }
                    </Label>
                    <Header.Subheader>
                        { t("customerDataService:organizationSync.description") }
                    </Header.Subheader>
                </Header.Content>
            </Header>
            { status?.last_synced_at && (
                <p data-componentid={ `${ componentId }-last-synced` }>
                    { t("customerDataService:organizationSync.lastSynced", {
                        count: status.org_count ?? 0,
                        time: formatTime(status.last_synced_at)
                    }) }
                </p>
            ) }
            { isSyncing && (
                <Message info size="small" data-componentid={ `${ componentId }-syncing` }>
                    { t("customerDataService:organizationSync.syncing", {
                        time: formatTime(status?.started_at)
                    }) }
                </Message>
            ) }
            { state === "FAILED" && (
                <Message negative size="small" data-componentid={ `${ componentId }-error` }>
                    { t("customerDataService:organizationSync.failed", {
                        error: status?.error ?? "-",
                        time: formatTime(status?.finished_at)
                    }) }
                </Message>
            ) }
            { canUpdate && (
                <PrimaryButton
                    size="small"
                    loading={ isStarting || isSyncing }
                    disabled={ isStarting || isSyncing }
                    onClick={ handleSync }
                    data-componentid={ `${ componentId }-button` }
                >
                    { status?.last_synced_at
                        ? t("customerDataService:organizationSync.syncAgain")
                        : t("customerDataService:organizationSync.sync") }
                </PrimaryButton>
            ) }
        </EmphasizedSegment>
    );
};

export default OrganizationSync;
