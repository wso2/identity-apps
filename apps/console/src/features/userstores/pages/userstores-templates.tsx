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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmptyPlaceholder, PageLayout, TemplateGrid } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { userstoresConfig } from "../../../extensions";
import { AppConstants, getEmptyPlaceholderIllustrations, history } from "../../core";
import { getAType, getUserstoreTypes } from "../api";
import { AddUserStore } from "../components";
import { getUserstoreTemplateIllustrations } from "../configs";
import {
    DEFAULT_DESCRIPTION_CUSTOM_USERSTORE,
    DEFAULT_USERSTORE_TYPE_IMAGE,
    USERSTORE_TYPE_DISPLAY_NAMES,
    USERSTORE_TYPE_IMAGES,
    USER_STORE_TYPE_DESCRIPTIONS
} from "../constants";
import { TypeResponse, UserstoreType } from "../models";

/**
 * Props for the Userstore templates page.
 */
type UserstoresTemplatesPageInterface = TestableComponentInterface;

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
 * @param {UserstoresTemplatesPageInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const UserstoresTemplates: FunctionComponent<UserstoresTemplatesPageInterface> = (
    props: UserstoresTemplatesPageInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

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
    }, [ openModal ]);

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
                        description: error?.description
                            || t("console:manage.features.userstores.notifications." +
                                "fetchUserstoreTemplates.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: error?.message
                            || t("console:manage.features.userstores.notifications." +
                                "fetchUserstoreTemplates.genericError.message")
                    }));
                }))
            );

            const userstoreTypes: UserstoreTypeListItem[] = [];
            const uniqueUserstoreTypes: UserstoreTypeListItem[] = [];
            const rawUserstoreTypes: UserstoreType[] = [];

            results.forEach((type: UserstoreType) => {
                if (type && !userstoresConfig.shouldShowUserstore(type.typeName)) {
                    rawUserstoreTypes.push(type);
                    if (type.typeName.toLowerCase().includes("unique")) {
                        uniqueUserstoreTypes.push(
                            {
                                description: type.description
                                    ?? USER_STORE_TYPE_DESCRIPTIONS[ type.typeName ],
                                id: type.typeId,
                                image: USERSTORE_TYPE_IMAGES[ type.typeName ],
                                name: USERSTORE_TYPE_DISPLAY_NAMES[ type.typeName ]
                            }
                        );
                    } else {
                        userstoreTypes.push(
                            {
                                description: USER_STORE_TYPE_DESCRIPTIONS[ type.typeName ] 
                                    ?? DEFAULT_DESCRIPTION_CUSTOM_USERSTORE,
                                id: type.typeId,
                                image: USERSTORE_TYPE_IMAGES[ type.typeName ] ?? DEFAULT_USERSTORE_TYPE_IMAGE,
                                name: USERSTORE_TYPE_DISPLAY_NAMES[ type.typeName ] ?? type.typeName
                            }
                        );
                    }
                }
            });
            setUserstoreTypes(uniqueUserstoreTypes.concat(userstoreTypes));
            setRawUserstoreTypes(rawUserstoreTypes);
        }).catch(error => {
            dispatch(addAlert({
                description: error?.description || t("console:manage.features.userstores.notifications." +
                    "fetchUserstoreTypes.genericError.description"),
                level: AlertLevels.ERROR,
                message: error?.message || t("console:manage.features.userstores.notifications." +
                    "fetchUserstoreTypes.genericError.message")
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
                        data-testid={ `${ testId }-add-userstore-wizard` }
                    />
                )
            }
            <PageLayout
                isLoading={ isLoading }
                title={ t("console:manage.features.userstores.pageLayout.templates.title") }
                description={ t("console:manage.features.userstores.pageLayout.templates.description") }
                contentTopMargin={ true }
                backButton={ {
                    onClick: () => {
                        history.push(AppConstants.getPaths().get("USERSTORES"));
                    },
                    text: t("console:manage.features.userstores.pageLayout.templates.back")
                }
                }
                titleTextAlign="left"
                bottomMargin={ false }
                showBottomDivider
                data-testid={ `${ testId }-page-layout` }
            >
                {
                    userstoreTypes && (
                        <div className="quick-start-templates">
                            <TemplateGrid<UserstoreTypeListItem>
                                type="userstore"
                                templates={ userstoreTypes }
                                heading={ t("console:manage.features.userstores.pageLayout.templates.templateHeading") }
                                subHeading={ t("console:manage.features.userstores.pageLayout." +
                                    "templates.templateSubHeading") }
                                onTemplateSelect={ (e: SyntheticEvent, { id }: { id: string }) => {
                                    setSelectedType(rawUserstoreTypes.find((type) => type.typeId === id));
                                } }
                                templateIcons={ getUserstoreTemplateIllustrations() as any }
                                templateIconOptions={ {
                                    fill: "primary"
                                } }
                                templateIconSize="tiny"
                                paginate={ true }
                                paginationLimit={ 4 }
                                paginationOptions={ {
                                    showLessButtonLabel: t("common:showLess"),
                                    showMoreButtonLabel: t("common:showMore")
                                } }
                                emptyPlaceholder={ (
                                    !isLoading && (
                                        <EmptyPlaceholder
                                            image={ getEmptyPlaceholderIllustrations().newList }
                                            imageSize="tiny"
                                            title={ t("console:manage.features.templates.emptyPlaceholder.title") }
                                            subtitle={
                                                [ t("console:manage.features.templates.emptyPlaceholder.subtitles") ]
                                            }
                                            data-testid={ `${ testId }-grid-empty-placeholder` }
                                        />
                                    )
                                ) }
                                data-testid={ `${ testId }-grid` }
                            />
                        </div>
                    )
                }
            </PageLayout>
        </>
    );
};

/**
 * Default props for the component.
 */
UserstoresTemplates.defaultProps = {
    "data-testid": "userstore-templates"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default UserstoresTemplates;
