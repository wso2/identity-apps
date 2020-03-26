/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the 'License'); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import React, { useEffect, useState } from "react"
import { PageLayout } from "../layouts"
import { getAUserStore, getAType } from "../api";
import { AlertLevels, UserStore, Type } from "../models";
import { ResourceTab } from "@wso2is/react-components";
import {
    EditBasicDetailsUserStore,
    MemoEditConnectionDetails,
    MemoEditAdvancedProperties,
    MemoEditOptionalProperties
} from "../components";
import { history } from "../helpers";
import { useDispatch } from "react-redux";
import { addAlert } from "../store/actions";

/**
 * This renders the user store edit page
 * @param props 
 * @return {React.ReactElement}
 */
export const UserStoresEditPage = (props): React.ReactElement => {

    const userStoreId = props.match.params.id;

    const [userStore, setUserStore] = useState<UserStore>(null);
    const [type, setType] = useState<Type>(null);

    const dispatch = useDispatch();

    /**
     * Fetches the suer store by its id
     */
    const getUserStore = () => {
        getAUserStore(userStoreId).then(response => {
            setUserStore(response);
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description,
                    level: AlertLevels.ERROR,
                    message: error?.message
                }
            ));
        })
    }

    useEffect(() => {
        getUserStore();
    }, []);

    useEffect(() => {
        if (userStore) {
            getAType(userStore?.typeId, null).then((response) => {
                setType(response);
            }).catch(error => {
                dispatch(addAlert({
                    message: error?.message || "Something went wrong",
                    description: error?.description || "An error occurred while fetching the type meta data.",
                    level: AlertLevels.ERROR
                }));
            });
        }
    }, [userStore]);

    /**
     * The tab panes
     */
    const panes = [
        {
            menuItem: "Basic Details",
            render: () => (
                <EditBasicDetailsUserStore
                    userStore={ userStore }
                    update={ getUserStore }
                    id={ userStoreId }
                />
            )
        },
        {
            menuItem: "Connection Details",
            render: () => (
                <MemoEditConnectionDetails
                    userStore={ userStore }
                    update={ getUserStore }
                    type={ type }
                    id={ userStoreId }
                />
            )
        },
        {
            menuItem: "Advanced Properties",
            render: () => (
                <MemoEditAdvancedProperties
                    userStore={ userStore }
                    update={ getUserStore }
                    type={ type }
                    id={ userStoreId }
                />
            )
        },
        {
            menuItem: "Optional Properties",
            render: () => (
                <MemoEditOptionalProperties
                    userStore={ userStore }
                    update={ getUserStore }
                    type={ type }
                    id={ userStoreId }
                />
            )
        }
    ];

    return (
        <PageLayout
            title={ userStore?.name }
            description={ "Edit User Store" }
            backButton={ {
                onClick: () => {
                    history.push("/user-stores");
                },
                text: "Go back to User Stores"
            } }
            titleTextAlign="left"
            bottomMargin={ false }
        >
            <ResourceTab panes={ panes } />
        </PageLayout>
    )
}
