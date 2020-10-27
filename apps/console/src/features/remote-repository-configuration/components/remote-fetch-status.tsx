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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Hint, LinkButton } from "@wso2is/react-components/src";
import { AxiosResponse } from "axios";
import moment from "moment";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
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

type RemoteFetchStatusProps = TestableComponentInterface;

export const RemoteFetchStatus: FunctionComponent<RemoteFetchStatusProps> = (
    props: RemoteFetchStatusProps
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    const [ remoteConfigDetails, setRemoteConfigDetails ] = useState<InterfaceRemoteConfigDetails>(undefined);
    const [ openRemoteFetchDetails, setOpenRemoteFetchDetails ] = useState<boolean>(false);
    const [ remoteConfig, setRemoteConfig ] = useState<InterfaceRemoteRepoConfig>(undefined);

    const dispatch = useDispatch();

    useEffect(() => {
        getRemoteConfigList();
    }, [ remoteConfig != undefined ]);

    const getHumanizedDeployment = (date: any): string => {
        const now = moment(new Date());
        const receivedDate = moment(date);
        return "Last deployed " +   moment.duration(now.diff(receivedDate)).humanize() + " ago";
    }

    /**
     * Util method to get remote configuration list 
     */
    const getRemoteConfigList = () => {
        getRemoteRepoConfigList().then((remoteRepoList: AxiosResponse<InterfaceRemoteRepoListResponse>) => {
            if (remoteRepoList.status == 200 && remoteRepoList.data.count > 0 ) {
                setRemoteConfig(remoteRepoList.data.remotefetchConfigurations[0]);
                getRemoteRepoConfig(remoteRepoList.data.remotefetchConfigurations[0].id).then((
                    response: AxiosResponse<InterfaceRemoteConfigDetails>
                ) => {
                    setRemoteConfigDetails(response.data);
                }).catch(() => {
                    dispatch(addAlert({
                        description: "Error while retrieving remote configuration details",
                        level: AlertLevels.ERROR,
                        message: "There was an error while fetching the remote configuration details."
                    }));
                })
            }
        }).catch(() => {
            dispatch(addAlert({
                description: "Error while retrieving remote configuration details",
                level: AlertLevels.ERROR,
                message: "There was an error while fetching the remote configuration details."
            }));
        })
    }

    return (
        <>
            {
                openRemoteFetchDetails &&
                    <RemoteFetchDetails 
                        isOpen={ openRemoteFetchDetails }
                        onClose={ ()=> {
                            setOpenRemoteFetchDetails(false);
                        } }
                        remoteDeployment={ remoteConfigDetails }
                    />
            }
            {
                remoteConfig &&
                <Menu data-testid={ `${ testId }-status` } size="small" borderless className="mb-6">
                    <Menu.Item  active header>Remote Configurations</Menu.Item>
                    {
                        remoteConfigDetails?.status?.count === 0 &&
                        <Menu.Item>
                            <Hint icon="info circle" className="mt-1 mb-1">
                                No applications deployed currently.
                            </Hint>
                        </Menu.Item>
                    }
                    {
                        remoteConfigDetails?.status?.failedDeployments &&
                        <>
                            <Menu.Item data-testid={ `${ testId }-success` } className="pr-3">
                                <Icon.Group className="mr-2" size="large">
                                    <Icon name="fork" />
                                    <Icon 
                                        color="green" 
                                        corner="bottom right" 
                                        name="checkmark" 
                                    />
                                </Icon.Group>
                                {
                                    remoteConfigDetails?.status?.successfulDeployments > 0 ?
                                    <strong className="mr-1">{ 
                                        remoteConfigDetails?.status?.successfulDeployments 
                                    }</strong>
                                    :
                                    remoteConfigDetails?.status?.successfulDeployments
                                } Successful
                            </Menu.Item>
                            <Menu.Item data-testid={ `${ testId }-failed` } className="pl-1 pr-3">
                                <Icon.Group className="mr-2" size="large">
                                    <Icon name="fork" />
                                    <Icon 
                                        color="red" 
                                        corner="bottom right" 
                                        name="cancel" 
                                    />
                                </Icon.Group>
                                {
                                    remoteConfigDetails?.status?.failedDeployments > 0 ?
                                    <strong className="mr-1">{ 
                                        remoteConfigDetails?.status?.failedDeployments 
                                    }</strong>
                                    :
                                    remoteConfigDetails?.status?.failedDeployments
                                } Failed
                                {
                                    remoteConfigDetails?.status?.lastSynchronizedTime  &&
                                    <LinkButton 
                                        className="ml-2" 
                                        compact
                                        onClick={ () => {
                                            setOpenRemoteFetchDetails(true);
                                        } }
                                    >
                                        Details
                                    </LinkButton>
                                }
                            </Menu.Item>
                            <Menu.Item data-testid={ `${ testId }-last-deplyed` } className="pl-1">
                                <Icon.Group className="mr-2" size="large">
                                    <Icon name="calendar alternate outline" />
                                </Icon.Group>
                                { getHumanizedDeployment(remoteConfigDetails?.status?.lastSynchronizedTime) }
                            </Menu.Item>
                        </>
                    }
                    <Menu.Item compact position="right">
                        <Popup
                            content={ remoteConfigDetails?.repositoryManagerAttributes?.uri }
                            header="Github Repository URL"
                            on="click"
                            pinned
                            offset={ "35%" }
                            position="top right"
                            trigger={
                                <Icon.Group className="mr-3 p-1 link">
                                    <Icon name="linkify"></Icon>
                                </Icon.Group>
                            }
                        />
                        <Button 
                            basic 
                            icon 
                            labelPosition="left"
                            data-testid={ `${ testId }-trigger-config` }
                            onClick={ ()=> {
                                triggerConfigDeployment(remoteConfigDetails.id).then((response: AxiosResponse<any>) => {
                                    if (response.status === 202) {
                                        dispatch(addAlert({
                                            description: "The applications were successfully refetched.",
                                            level: AlertLevels.SUCCESS,
                                            message: "Successfully fetched applications."
                                        }));
    
                                        setTimeout(()=> {
                                            getRemoteConfigList();
                                        }, 3000)
                                    }
                                }).catch(() => {
                                    dispatch(addAlert({
                                        description: "There was an error while fetching the applications",
                                        level: AlertLevels.ERROR,
                                        message: "Error while refetching applications"
                                    }));
                                })
                            } }
                        >
                            <Icon name="retweet" />
                            Refetch
                        </Button>
                    </Menu.Item>
                </Menu>
            }
        </>
    )

}


