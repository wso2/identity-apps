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

import * as getConfig from "./config";
import { EmptyPlaceholder, ErrorBoundary  } from "@wso2is/react-components";
import React, { lazy, Suspense, ReactElement } from "react";
import { EmptyPlaceholderIllustrations } from "../configs";
import { Placeholder } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
interface ExtensionInterface {
    section: "account-subscription" | "account-status";
    type: "component";
}

export const ComponentPlaceholder = (props: ExtensionInterface): ReactElement => {

    const { section, type } = props;
    
    const { t } = useTranslation();

    const fragment = getConfig()?.sections[type + "s"]?.[section];

    let DynamicLoader;

    if (fragment) {
        DynamicLoader = lazy(() => {
            return new Promise(resolve => setTimeout(resolve, 5 * 1000)).then(
                () => import(`${fragment}`)
            );
        });
    } else {
        DynamicLoader = () => <></>;
    }

    return (
        <ErrorBoundary
                fallback={ (
                    <EmptyPlaceholder
                        image={ EmptyPlaceholderIllustrations.genericError }
                        imageSize="tiny"
                        subtitle={ [
                            t("views:placeholders.genericError.subtitles.0"),
                            t("views:placeholders.genericError.subtitles.1")
                        ] }
                        title={ t("views:placeholders.genericError.title") }
                    />
                ) }
            >
            <Suspense
                fallback={ (
                    <Placeholder>
                        <Placeholder.Header>
                        <Placeholder.Line />
                        <Placeholder.Line />
                        </Placeholder.Header>
                    </Placeholder>
                ) }>
                <DynamicLoader />
            </Suspense>
        </ErrorBoundary>
    )
};
