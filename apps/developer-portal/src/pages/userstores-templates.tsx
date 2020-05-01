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

import { addAlert } from "@wso2is/core/store";
import { EmptyPlaceholder, TemplateGrid } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getAType, getUserstoreTypes } from "../api";
import { AddUserStore } from "../components";
import { ApplicationTemplateIllustrations, EmptyPlaceholderIllustrations } from "../configs";
import { USERSTORE_TYPE_DISPLAY_NAMES, USER_STORES_PATH, USER_STORE_TYPE_DESCRIPTIONS } from "../constants";
import { history } from "../helpers";
import { PageLayout } from "../layouts";
import { AlertLevels, TypeResponse, UserstoreType } from "../models";

/**
 * Interface to be passed as the type into the `TemplateGrid` component.
 */
interface UserstoreTypeListItem {
    id: string;
    name: string;
    description?: string;
    image?: string;
}

/**
 * This renders the userstore templates page.
 * 
 * @returns {ReactElement} Userstore templates page.
 */
export const UserstoresTemplates: FunctionComponent<{}> = (): ReactElement => {

    const [ userstoreTypes, setUserstoreTypes ] = useState<UserstoreTypeListItem[]>([]);
    const [ rawUserstoreTypes, setRawUserstoreTypes ] = useState<UserstoreType[]>([]);
    const [ openModal, setOpenModal ] = useState(false);
    const [ selectedType, setSelectedType ] = useState<UserstoreType>(null);
    const [ isLoading, setIsLoading ] = useState(true);

    const dispatch = useDispatch();

    const { t } = useTranslation();

    useEffect(() => {
        selectedType && setOpenModal(true);
    }, [ selectedType ]);

    useEffect(() => {
        !openModal && setSelectedType(null);
    }, [ openModal ])

    /**
     * Fetches the list of userstore types.
     */
    useEffect(() => {
        getUserstoreTypes().then(async (response: TypeResponse[]) => {
            setIsLoading(true);
            const typeRequests: Promise<any>[] = response.map((type: TypeResponse) => {
                return getAType(type.typeId, null);
            });

            const results: UserstoreType[] = await Promise.all(
                typeRequests.map(response => response.catch(error => {
                    dispatch(addAlert({
                        description: error?.description || "An error occurred while fetching the " +
                            "userstore type details.",
                        level: AlertLevels.ERROR,
                        message: error?.message || "Something went wrong"
                    }));
                }))
            );

            const userstoreTypes: UserstoreTypeListItem[] = [];
            const uniqueUserstoreTypes: UserstoreTypeListItem[] = [];
            const rawUserstoreTypes: UserstoreType[] = [];
            results.forEach((type: UserstoreType) => {
                if (type) {
                    rawUserstoreTypes.push(type);
                    if (type.typeName.toLowerCase().includes("unique")) {
                        uniqueUserstoreTypes.push(
                            {
                                description: type.description
                                    ?? USER_STORE_TYPE_DESCRIPTIONS[ type.typeName ],
                                id: type.typeId,
                                image: "customApp",
                                name: USERSTORE_TYPE_DISPLAY_NAMES[ type.typeName ]
                            }
                        )
                    } else {
                        userstoreTypes.push(
                            {
                                description: type.description
                                    ?? USER_STORE_TYPE_DESCRIPTIONS[ type.typeName ],
                                id: type.typeId,
                                image: "customApp",
                                name: USERSTORE_TYPE_DISPLAY_NAMES[ type.typeName ]
                            }
                        )
                    }
                }
            });
            setUserstoreTypes(uniqueUserstoreTypes.concat(userstoreTypes));
            setRawUserstoreTypes(rawUserstoreTypes);
        }).catch(error => {
            dispatch(addAlert({
                description: error?.description || "An error occurred while fetching the userstore types.",
                level: AlertLevels.ERROR,
                message: error?.message || "Something went wrong"
            }));
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    return (
        <>
            {
                openModal
                && (
                    <AddUserStore
                        open={ openModal }
                        onClose={ () => {
                            setOpenModal(false);
                        } }
                        type={ selectedType }
                    />
                )
            }
            <PageLayout
                title="Userstores"
                description="Please choose one of the following userstore types."
                contentTopMargin={ true }
                backButton={ {
                    onClick: () => {
                        history.push(USER_STORES_PATH);
                    },
                    text: "Select Userstore Type"
                } }
                titleTextAlign="left"
                bottomMargin={ false }
                showBottomDivider
            >
                {
                    userstoreTypes && (
                        <div className="quick-start-templates">
                            <TemplateGrid<UserstoreTypeListItem>
                                type="userstore"
                                templates={ userstoreTypes }
                                heading="Quick Setup"
                                subHeading="Predefined set of templates to speed up your userstore creation."
                                onTemplateSelect={ (e: SyntheticEvent, { id }: { id: string }) => {
                                    setSelectedType(rawUserstoreTypes.find((type) => type.typeId === id));
                                } }
                                templateIcons={ ApplicationTemplateIllustrations }
                                paginate={ true }
                                paginationLimit={ 4 }
                                paginationOptions={ {
                                    showLessButtonLabel: t("common:showLess"),
                                    showMoreButtonLabel: t("common:showMore")
                                } }
                                emptyPlaceholder={ (
                                    !isLoading && (
                                        <EmptyPlaceholder
                                            image={ EmptyPlaceholderIllustrations.newList }
                                            imageSize="tiny"
                                            title={ t("devPortal:components.templates.emptyPlaceholder.title") }
                                            subtitle={
                                                [ t("devPortal:components.templates.emptyPlaceholder.subtitles") ]
                                            }
                                        />
                                    )
                                ) }
                            />
                        </div>
                    )
                }
            </PageLayout>
        </>
    )
};
