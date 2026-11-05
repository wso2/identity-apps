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

import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertLevels, HttpErrorResponseDataInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ContentLoader, EmptyPlaceholder, PageLayout } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { getFunctionLibrary, getFunctionLibraryContent } from "../api/function-library";
import EditFunctionLibrary from "../components/edit-function-library";
import { FUNCTION_LIBRARY_EDIT_PAGE } from "../constants";
import { FunctionLibraryResponseInterface } from "../models/function-library";

/**
 * Props interface of {@link FunctionLibraryEditPage}.
 */
type FunctionLibraryEditPagePropsInterface = IdentifiableComponentInterface;

/**
 * Extract the function library id from the current route path.
 * The route is registered as `.../function-libraries/:id`.
 */
const extractFunctionLibraryIdFromPath: () => string = (): string => {
    const path: string[] = history.location.pathname.split("/");

    return path[ path.length - 1 ];
};

/**
 * Page used to view/edit a single function library.
 *
 * @param props - Props injected to the component.
 * @returns Function library edit page.
 */
const FunctionLibraryEditPage: FunctionComponent<FunctionLibraryEditPagePropsInterface> = (
    props: FunctionLibraryEditPagePropsInterface
): ReactElement => {
    const { ["data-componentid"]: componentId = FUNCTION_LIBRARY_EDIT_PAGE } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ resourceNotFound, setResourceNotFound ] = useState<boolean>(false);
    const [ functionLibrary, setFunctionLibrary ] = useState<FunctionLibraryResponseInterface>(undefined);
    const [ content, setContent ] = useState<string>("");

    useEffect(() => {
        const id: string = extractFunctionLibraryIdFromPath();

        Promise.all([ getFunctionLibrary(id), getFunctionLibraryContent(id) ])
            .then(([ functionLibraryResponse, contentResponse ]: [
                AxiosResponse<FunctionLibraryResponseInterface>,
                AxiosResponse<string>
            ]) => {
                setFunctionLibrary(functionLibraryResponse.data);
                setContent(contentResponse.data);
                setResourceNotFound(false);
            })
            .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
                setResourceNotFound(true);
                dispatch(addAlert({
                    description: error?.response?.data?.description
                        ?? t("functionLibraries:notifications.fetch.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message
                        ?? t("functionLibraries:notifications.fetch.genericError.message")
                }));
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const handleFunctionLibraryUpdate: (updatedFunctionLibrary: FunctionLibraryResponseInterface) => void = (
        updatedFunctionLibrary: FunctionLibraryResponseInterface
    ): void => {
        if (updatedFunctionLibrary.id !== functionLibrary?.id) {
            history.replace(
                AppConstants.getPaths().get("FUNCTION_LIBRARY_EDIT").replace(":id", updatedFunctionLibrary.id)
            );
        }
        setFunctionLibrary(updatedFunctionLibrary);
    };

    const handleBackButtonClick: () => void = (): void => {
        history.push(AppConstants.getPaths().get("FUNCTION_LIBRARIES"));
    };

    if (resourceNotFound) {
        return (
            <EmptyPlaceholder
                image={ getEmptyPlaceholderIllustrations().pageNotFound }
                imageSize="tiny"
                title={ t("functionLibraries:notFound.title") }
                subtitle={ [ t("functionLibraries:notFound.subtitle") ] }
                data-componentid={ `${ componentId }-not-found-placeholder` }
            />
        );
    }

    return (
        <PageLayout
            isLoading={ isLoading }
            title={ functionLibrary?.name }
            pageTitle={ functionLibrary?.name }
            description={ t("functionLibraries:editPage.description") }
            backButton={ {
                "data-componentid": `${ componentId }-back-button`,
                onClick: handleBackButtonClick,
                text: t("functionLibraries:editPage.backButton")
            } }
            data-componentid={ `${ componentId }-layout` }
        >
            { isLoading
                ? <ContentLoader />
                : (
                    <EditFunctionLibrary
                        functionLibrary={ functionLibrary }
                        content={ content }
                        onUpdate={ handleFunctionLibraryUpdate }
                        data-componentid={ `${ componentId }-form` }
                    />
                )
            }
        </PageLayout>
    );
};

export default FunctionLibraryEditPage;
