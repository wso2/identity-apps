/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import Grid from "@oxygen-ui/react/Grid";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    CopyInputField,
    DocumentationLink,
    EmphasizedSegment,
    Heading,
    Link,
    Popup,
    Text
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { AppConstants, AppState, history } from "@wso2is/admin.core.v1";

export const MyAccountOverview: FunctionComponent<IdentifiableComponentInterface> = (
    props: IdentifiableComponentInterface
): ReactElement => {
    const {
        ["data-componentid"]: componentId
    } = props;

    const consumerAccountURL: string = useSelector((state: AppState) =>
        state?.config?.deployment?.accountApp?.tenantQualifiedPath);
    const { t } = useTranslation();

    return (
        <EmphasizedSegment padded="very">
            <div data-componentid={ componentId } className="form-container">
                <Heading data-componentid={ componentId } bold as="h4">
                    { t("applications:myaccount.overview.heading") }
                </Heading>
                <Text>
                    { t("applications:myaccount.overview.contentIntro") }
                    <DocumentationLink
                        link={ "develop.applications.myaccount.overview.learnMore" }
                        isLinkRef
                    >
                        <Trans
                            i18nKey={ "extensions:common.learnMore" }
                        >
                            Learn More
                        </Trans>
                    </DocumentationLink>
                </Text>
                <Text>
                    <Trans
                        i18nKey={ "applications:myaccount.overview.contentDescription" }
                    >
                        You can configure the login flow of the My Account, apply custom
                        <Link
                            external={ false }
                            onClick={ () => {
                                history.push(
                                    AppConstants.getPaths().get("BRANDING")
                                );
                            } }
                        > Branding configurations
                        </Link>
                        and share access to it with B2B organizations.
                    </Trans>
                </Text>
                <Grid container alignItems="center">
                    <Grid xs={ 6 }>
                        <Heading as="h6" compact>
                            { t("applications:myaccount.overview.shareApplication") }
                        </Heading>
                    </Grid>
                    <Popup
                        trigger={ (
                            <Grid xs={ 6 } className="pr-0">
                                <CopyInputField
                                    value={ consumerAccountURL }
                                    data-componentid={ "application-consumer-account-link-copy-field" }
                                />
                            </Grid>
                        ) }
                        content={ t("applications:myaccount.popup") }
                        position="top center"
                        size="mini"
                        hideOnScroll
                        inverted
                    />
                </Grid>
            </div>
        </EmphasizedSegment>
    );
};

/**
 * Default proptypes for the my account overview component.
 */
MyAccountOverview.defaultProps = {
    "data-componentid": "my-account-overview"
};
