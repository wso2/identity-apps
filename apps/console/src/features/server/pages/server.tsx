/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { 
    ArrowLoopRightUserIcon
} from "@oxygen-ui/react-icons";
import Grid from "@oxygen-ui/react/Grid";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, MutableRefObject, ReactElement, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Placeholder, Ref } from "semantic-ui-react";
import RemoteLoggingIcon from "../../../themes/default/assets/images/icons/outline-icons/remote-logging.svg";
import { AppConstants, history } from "../../core";
import AdminAdvisoryBannerSection from "../components/admin-advisory-banner-section";
import { SettingsSection } from "../components/settings-section";


/**
 * Props for the Server Configurations page.
 */
type ServerSettingsListingPageInterface = IdentifiableComponentInterface;

/**
 * Governance connector listing page.
 *
 * @param props - Props injected to the component.
 * @returns Governance connector listing page component.
 */
export const ServerSettingsListingPage: FunctionComponent<ServerSettingsListingPageInterface> = (
    props: ServerSettingsListingPageInterface
): ReactElement => {
    const { [ "data-componentid" ]: componentId } = props;

    const pageContextRef: MutableRefObject<any> = useRef(null);

    const { t } = useTranslation();

    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    /**
     * This function returns loading placeholders.
     */
    const renderLoadingPlaceholder = (): ReactElement => {
        const placeholders: ReactElement[] = [];

        for (let loadedPlaceholders: number = 0; loadedPlaceholders <= 1; loadedPlaceholders++) {
            placeholders.push(
                <Grid xs={ 12 } lg={ 6 } key={ loadedPlaceholders }>
                    <div
                        className="ui card fluid settings-card"
                        data-testid={ `${ componentId }-loading-card` }
                    >
                        <div className="content no-padding">
                            <div className="header-section placeholder">
                                <Placeholder>
                                    <Placeholder.Header>
                                        <Placeholder.Line length="medium" />
                                        <Placeholder.Line length="full" />
                                    </Placeholder.Header>
                                </Placeholder>
                            </div>
                        </div>
                        <div className="content extra extra-content">
                            <div className="action-button">
                                <Placeholder>
                                    <Placeholder.Line length="very short" />
                                </Placeholder>
                            </div>
                        </div>
                    </div>
                </Grid>
            );
        }

        return (
            <Grid container rowSpacing={ 2 } columnSpacing={ { md: 3, sm: 2, xs: 1 } }>
                { placeholders }
            </Grid>
        );
    };

    return (
        <PageLayout
            pageTitle={ "Server" }
            title={ "Server" }
            description={ "Configure server settings" }
            data-componentid={ `${ componentId }-page-layout` }
        >
            <Ref innerRef={ pageContextRef }>
                {
                    isLoading
                        ? renderLoadingPlaceholder()
                        : (
                            <Grid container rowSpacing={ 2 } columnSpacing={ 3 }>
                                <Grid xs={ 12 }>
                                    <AdminAdvisoryBannerSection />
                                </Grid>
                                <Grid xs={ 12 }>
                                    <SettingsSection
                                        data-componentid={ "remote-logging-page-section" }
                                        data-testid={ "remote-logging-page-section" }
                                        description={ 
                                            t("console:manage.features.serverConfigs.remoteLogPublishing.description") 
                                        }
                                        icon={ RemoteLoggingIcon }
                                        header={ 
                                            t("console:manage.features.serverConfigs.remoteLogPublishing.title") 
                                        }
                                        onPrimaryActionClick={ () => 
                                            history.push(AppConstants.getPaths().get("REMOTE_LOGGING")) }
                                        primaryAction={ t("common:configure") }
                                    />
                                </Grid>
                                <Grid xs={ 12 }>
                                    <SettingsSection
                                        data-componentid={
                                            "manage-notifications-sending-" +
                                            "internally-section"
                                        }
                                        data-testid={
                                            "manage-notifications-sending-" +
                                            "internally-section"
                                        }
                                        description={ "Manage Notifications Sending Internally" }
                                        icon={ <ArrowLoopRightUserIcon className="icon" /> }
                                        header={ "Manage Notifications Sending Internally" }
                                        onPrimaryActionClick={
                                            null
                                        }
                                        primaryAction={ t("common:configure") }
                                    />
                                </Grid>
                            </Grid>
                        )
                }
            </Ref>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
ServerSettingsListingPage.defaultProps = {
    "data-componentid": "governance-connectors-listing-page"
};

export default ServerSettingsListingPage;
