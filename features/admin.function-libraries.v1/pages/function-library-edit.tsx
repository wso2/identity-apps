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
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getFunctionLibrary, getFunctionLibraryContent } from "../api/function-library";
import EditFunctionLibrary from "../components/edit-function-library";
import { FUNCTION_LIBRARY_EDIT_PAGE } from "../constants/component-ids";
import { FunctionLibraryResponseInterface } from "../models/function-library";

/**
 * Props interface of {@link FunctionLibraryEditPage}.
 */
type FunctionLibraryEditPagePropsInterface = IdentifiableComponentInterface;

/**
 * Extract the function library name from the current route path.
 * The route is registered as `.../function-libraries/:name`.
 */
const extractFunctionLibraryNameFromPath: () => string = (): string => {
    const path: string[] = history.location.pathname.split("/");

    return decodeURIComponent(path[ path.length - 1 ]);
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
    const { ["data-componentid"]: componentId } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    const [ resourceNotFound, setResourceNotFound ] = useState<boolean>(false);
    const [ functionLibrary, setFunctionLibrary ] = useState<FunctionLibraryResponseInterface>(undefined);
    const [ content, setContent ] = useState<string>("");
    const [ functionLibraryName, setFunctionLibraryName ] = useState<string>("");

    useEffect(() => {
        const name: string = extractFunctionLibraryNameFromPath();

        setFunctionLibraryName(name);

        Promise.all([ getFunctionLibrary(name), getFunctionLibraryContent(name) ])
            .then(([ functionLibraryResponse, contentResponse ]) => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleBackButtonClick: () => void = (): void => {
        history.push(AppConstants.getPaths().get("APPLICATIONS_SETTINGS_FUNCTION_LIBRARIES"));
    };

    if (resourceNotFound) {
        return (
            <EmptyPlaceholder
                image={ getEmptyPlaceholderIllustrations().pageNotFound }
                imageSize="tiny"
                title={ t("functionLibraries:notFound.title") }
                subtitle={ [ t("functionLibraries:notFound.subtitle", { name: functionLibraryName }) ] }
                data-componentid={ `${ componentId }-not-found-placeholder` }
            />
        );
    }

    return (
        <PageLayout
            isLoading={ isLoading }
            title={ functionLibraryName }
            pageTitle={ functionLibraryName }
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
                        data-componentid={ `${ componentId }-form` }
                    />
                )
            }
        </PageLayout>
    );
};

FunctionLibraryEditPage.defaultProps = {
    "data-componentid": FUNCTION_LIBRARY_EDIT_PAGE
};

export default FunctionLibraryEditPage;
