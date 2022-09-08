/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
import { Hint, LinkButton } from "@wso2is/react-components/src";
import { AxiosResponse } from "axios";
import moment from "moment";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button, Icon, Menu, Popup } from "semantic-ui-react";
import { RemoteFetchDetails } from "./remote-fetch-details";
import {
    InterfaceRemoteConfigDetails,
    InterfaceRemoteRepoConfig,
    InterfaceRemoteRepoListResponse,
    getRemoteRepoConfig,
    getRemoteRepoConfigList,
    triggerConfigDeployment
} from "..";

/**
 * Remote fetch status props interface.
 */
type RemoteFetchStatusProps = IdentifiableComponentInterface;

/**
 * Remote fetch details component.
 *
 * @param props - Props injected to the component.
 * @returns Remote Fetch Status component.
 */
export const RemoteFetchStatus: FunctionComponent<RemoteFetchStatusProps> = (
    props: RemoteFetchStatusProps
): ReactElement => {

    const {
        [ "data-componentid" ]: componentId
    } = props;

    const [ remoteConfigDetails, setRemoteConfigDetails ] = useState<InterfaceRemoteConfigDetails>(undefined);
    const [ openRemoteFetchDetails, setOpenRemoteFetchDetails ] = useState<boolean>(false);
    const [ remoteConfig, setRemoteConfig ] = useState<InterfaceRemoteRepoConfig>(undefined);

    const dispatch = useDispatch();

    const { t } = useTranslation();

    useEffect(() => {
        getRemoteConfigList();
    }, [ remoteConfig != undefined ]);

    const getHumanizedDeployment = (date: any): string => {
        const now = moment(new Date());
        const receivedDate = moment(date);

        return "Last deployed " +   moment.duration(now.diff(receivedDate)).humanize() + " ago";
    };

    /**
     * Util method to get remote configuration list
     */
    const getRemoteConfigList = () => {

        getRemoteRepoConfigList()
            .then((remoteRepoList: AxiosResponse<InterfaceRemoteRepoListResponse>) => {
                if (!(remoteRepoList?.data?.remotefetchConfigurations
                    && Array.isArray(remoteRepoList.data.remotefetchConfigurations)
                    && remoteRepoList.data.remotefetchConfigurations[ 0 ])) {

                    return;
                }

                const config: InterfaceRemoteRepoConfig = remoteRepoList.data.remotefetchConfigurations[ 0 ];

                if (remoteRepoList.data.count > 0) {
                    setRemoteConfig(config);
                    getRemoteRepoConfig(config.id)
                        .then((response: AxiosResponse<InterfaceRemoteConfigDetails>) => {
                            setRemoteConfigDetails(response.data);
                        })
                        .catch(() => {
                            dispatch(addAlert({
                                description: t("console:manage.features.remoteFetch.notifications." +
                                    "getConfigDeploymentDetails.genericError.description"),
                                level: AlertLevels.ERROR,
                                message: t("console:manage.features.remoteFetch.notifications." +
                                    "getConfigDeploymentDetails.genericError.message")
                            }));
                        });
                }
            })
            .catch(() => {
                dispatch(addAlert({
                    description: t("console:manage.features.remoteFetch.notifications." +
                        "getConfigList.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.remoteFetch.notifications." +
                        "getConfigList.genericError.message")
                }));
            });
    };

    return (
        <>
            {
                openRemoteFetchDetails && (
                    <RemoteFetchDetails
                        isOpen={ openRemoteFetchDetails }
                        onClose={ ()=> {
                            setOpenRemoteFetchDetails(false);
                        } }
                        remoteDeployment={ remoteConfigDetails }
                    />
                )
            }
            {
                remoteConfig && (
                    <Menu data-componentid={ `${ componentId }-status` } size="small" borderless className="mb-6">
                        <Menu.Item  active header>
                            { t("console:manage.features.remoteFetch.components.status.header") }
                        </Menu.Item>
                        {
                            remoteConfigDetails?.status?.count === 0 && (
                                <Menu.Item>
                                    <Hint icon="info circle" className="mt-1 mb-1">
                                        { t("console:manage.features.remoteFetch.components.status.hint") }
                                    </Hint>
                                </Menu.Item>
                            )
                        }
                        {
                            remoteConfigDetails?.status?.failedDeployments && (
                                <>
                                    <Menu.Item data-componentid={ `${ componentId }-success` } className="pr-3">
                                        <Icon.Group className="mr-2" size="large">
                                            <Icon name="fork" />
                                            <Icon
                                                color="green"
                                                corner="bottom right"
                                                name="checkmark"
                                            />
                                        </Icon.Group>
                                        {
                                            (remoteConfigDetails?.status?.successfulDeployments > 0)
                                                ? (
                                                    <strong className="mr-1">
                                                        { remoteConfigDetails?.status?.successfulDeployments }
                                                    </strong>
                                                )
                                                : remoteConfigDetails?.status?.successfulDeployments
                                        } Successful
                                    </Menu.Item>
                                    <Menu.Item data-componentid={ `${ componentId }-failed` } className="pl-1 pr-3">
                                        <Icon.Group className="mr-2" size="large">
                                            <Icon name="fork" />
                                            <Icon
                                                color="red"
                                                corner="bottom right"
                                                name="cancel"
                                            />
                                        </Icon.Group>
                                        {
                                            (remoteConfigDetails?.status?.failedDeployments > 0)
                                                ? (
                                                    <strong className="mr-1">{
                                                        remoteConfigDetails?.status?.failedDeployments
                                                    }</strong>
                                                )
                                                : remoteConfigDetails?.status?.failedDeployments
                                        } Failed
                                        {
                                            remoteConfigDetails?.status?.lastSynchronizedTime  && (
                                                <LinkButton
                                                    className="ml-2"
                                                    compact
                                                    onClick={ () => {
                                                        setOpenRemoteFetchDetails(true);
                                                    } }
                                                >
                                                    {
                                                        t("console:manage.features.remoteFetch.components" +
                                                            ".status.details")
                                                    }
                                                </LinkButton>
                                            )
                                        }
                                    </Menu.Item>
                                    <Menu.Item data-componentid={ `${ componentId }-last-deplyed` } className="pl-1">
                                        <Icon.Group className="mr-2" size="large">
                                            <Icon name="calendar alternate outline" />
                                        </Icon.Group>
                                        { getHumanizedDeployment(remoteConfigDetails?.status?.lastSynchronizedTime) }
                                    </Menu.Item>
                                </>
                            )
                        }
                        <Menu.Item position="right">
                            <Popup
                                content={ remoteConfigDetails?.repositoryManagerAttributes?.uri }
                                header={ t("console:manage.features.remoteFetch.components.status.linkPopup.header") }
                                on="click"
                                pinned
                                position="top right"
                                trigger={ (
                                    <Icon.Group className="mr-3 p-1 link">
                                        <Icon name="linkify" />
                                    </Icon.Group>
                                ) }
                            />
                            <Button
                                basic
                                icon
                                labelPosition="left"
                                data-componentid={ `${ componentId }-trigger-config` }
                                onClick={ () => {
                                    triggerConfigDeployment(remoteConfigDetails.id)
                                        .then(() => {
                                            dispatch(addAlert({
                                                description: t("console:manage.features.remoteFetch.notifications" +
                                                    ".triggerConfigDeployment.success.description"),
                                                level: AlertLevels.SUCCESS,
                                                message: t("console:manage.features.remoteFetch.notifications" +
                                                    ".triggerConfigDeployment.success.message")
                                            }));

                                            setTimeout(() => {
                                                getRemoteConfigList();
                                            }, 3000);
                                        })
                                        .catch(() => {
                                            dispatch(addAlert({
                                                description: t("console:manage.features.remoteFetch.notifications" +
                                                    ".triggerConfigDeployment.genericError.description"),
                                                level: AlertLevels.ERROR,
                                                message: t("console:manage.features.remoteFetch.notifications" +
                                                    ".triggerConfigDeployment.genericError.message")
                                            }));
                                        });
                                } }
                            >
                                <Icon name="retweet" />
                                { t("console:manage.features.remoteFetch.components.status.refetch") }
                            </Button>
                        </Menu.Item>
                    </Menu>
                )
            }
        </>
    );
};
