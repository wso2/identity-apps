/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com).
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

import { getApplicationList } from "@wso2is/admin.applications.v1/api";
import {
    ApplicationInterface,
    ApplicationListInterface,
    InboundProtocolListItemInterface,
    URLFragmentTypes
} from "@wso2is/admin.applications.v1/models";
import { EventPublisher, history } from "@wso2is/admin.core.v1";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { GenericIcon, GenericIconProps, Heading, PageHeader } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Card, Grid, Radio } from "semantic-ui-react";
import { QuickStartModes } from "../models";

/**
 * Proptypes for the applications help panel overview component.
 */
interface QuickStartPanelOverviewPropsInterface extends TestableComponentInterface {
    inboundProtocols?: InboundProtocolListItemInterface[];
    application?: ApplicationInterface;
    applicationType: string;
    handleIntegrateSelection?: (selection: string) => void;
    onBackButtonClick?: () => void;
    technology: string;
    technologyLogo: GenericIconProps["icon"];
    defaultTabIndex: number;
}

const QUICK_START_TAB_INDEX: number = 0;

/**
 * Quick start pane overview Component.
 * TODO: Add localization support. (https://github.com/wso2-enterprise/asgardeo-product/issues/209)
 *
 * @param {QuickStartPanelOverviewPropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const QuickStartPanelOverview: FunctionComponent<QuickStartPanelOverviewPropsInterface> = (
    props: QuickStartPanelOverviewPropsInterface
): ReactElement => {

    const {
        applicationType,
        defaultTabIndex,
        handleIntegrateSelection,
        onBackButtonClick,
        technology,
        technologyLogo
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [ appList, setAppList ] = useState<ApplicationListInterface>(undefined);

    const [ selectedIntegration, setSelectedIntegration ] = useState<QuickStartModes>(undefined);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    useEffect(() => {
        getApplicationList(null, null, null)
            .then((response) => {
                setAppList(response);

            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications.fetchApplications." +
                            "error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("applications:notifications.fetchApplications" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:notifications.fetchApplications." +
                        "genericError.message")
                }));
            });
    }, []);

    useEffect(() => {
        if (appList === undefined) {
            return;
        }
        /**
         * TODO: QuickStartModes.SAMPLES should be selected if there are no applications with the current
         * 'applicationType'. Use the template ID of the applications in the appList and set selectedIntegration
         * accordingly.
         */
        if(!(window.location.hash).includes(URLFragmentTypes.VIEW)) {

            if (appList?.applications?.length > 1) {
                setSelectedIntegration(QuickStartModes.INTEGRATE);
                handleIntegrateSelection(QuickStartModes.INTEGRATE);

                return;
            }
            setSelectedIntegration(QuickStartModes.SAMPLES);
            handleIntegrateSelection(QuickStartModes.SAMPLES);
        }
    }, [ appList ]);

    /**
     * Called when the integration type changes
     */
    useEffect(() => {

        if(!technology || !selectedIntegration){
            return;
        }

        eventPublisher.compute(() => {
            if (selectedIntegration === QuickStartModes.INTEGRATE) {
                eventPublisher.publish("application-quick-start-switch-integration-path", {
                    type: "integrate-own-application"
                });
            } else if (selectedIntegration === QuickStartModes.SAMPLES) {
                eventPublisher.publish("application-quick-start-switch-integration-path", {
                    type: "try-out-sample"
                });
            }
        });

        history.push({
            hash: `${ URLFragmentTypes.TAB_INDEX }${ QUICK_START_TAB_INDEX }&${ URLFragmentTypes.VIEW }`+
                `${ selectedIntegration.toLowerCase() }_${ technology.toLowerCase() }`,
            pathname: window.location.pathname
        });
    }, [ selectedIntegration ]);

    /**
     * Called when the URL fragment updates
     */
    useEffect(() => {

        if(!(window.location.hash).includes(URLFragmentTypes.VIEW)) {
            return;
        }

        const urlFragment: string[] = (window.location.hash).split("&" + URLFragmentTypes.VIEW);

        if(urlFragment[0] !== ("#"+URLFragmentTypes.TAB_INDEX+QUICK_START_TAB_INDEX.toString())) {
            handleInvalidURL();

            return;
        }

        const integrationType: string = urlFragment[1].split("_")[0].toUpperCase();

        if (QuickStartModes.SAMPLES == integrationType) {
            setSelectedIntegration(QuickStartModes.SAMPLES);
            handleIntegrateSelection(QuickStartModes.SAMPLES);
        } else if (QuickStartModes.INTEGRATE == integrationType) {
            setSelectedIntegration(QuickStartModes.INTEGRATE);
            handleIntegrateSelection(QuickStartModes.INTEGRATE);
        } else {
            handleInvalidURL();
        }
    }, [ window.location.hash ]);

    /**
     * Handles invalid URL fragments
     */
    const handleInvalidURL = (): void => {

        history.push({
            hash: `${ URLFragmentTypes.TAB_INDEX }${ defaultTabIndex }`,
            pathname: window.location.pathname
        });
    };

    return (
        <>
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <PageHeader
                            image={ (
                                <GenericIcon
                                    inline
                                    transparent
                                    className="display-flex"
                                    icon={ technologyLogo }
                                    size="mini"
                                />
                            ) }
                            className="mb-2"
                            title={ technology }
                            backButton={ {
                                onClick: () => onBackButtonClick(),
                                text: "Go back to selection"
                            } }
                            imageSpaced={ false }
                            bottomMargin={ false }
                        />
                        <Heading subHeading as="h6">
                            Select one of the following paths to get started.
                        </Heading>
                    </Grid.Column>
                </Grid.Row>
                {
                    applicationType
                        ? (
                            <>
                                <Grid.Row stretched>
                                    <Grid.Column width={ 8 }>
                                        <Card
                                            fluid
                                            className={
                                                `selection-card radio-selection-card quickstart-mode-card ${
                                                    selectedIntegration === QuickStartModes.INTEGRATE
                                                        ? "card-selected"
                                                        : ""
                                                }`
                                            }
                                            data-testid="integration-mode-selection-card"
                                        >
                                            <Card.Content
                                                onClick={ () => {
                                                    eventPublisher.publish(
                                                        "application-quick-start-click-integration-path-radio", {
                                                            type: "integrate-own-application"
                                                        }
                                                    );
                                                    setSelectedIntegration(QuickStartModes.INTEGRATE);
                                                    handleIntegrateSelection(QuickStartModes.INTEGRATE);
                                                } }
                                                className="selection-card-content"
                                                data-testid="integration-mode-selection-card-content"
                                            >
                                                <div className="integrate-radio">
                                                    <Radio
                                                        checked={ selectedIntegration === QuickStartModes.INTEGRATE }
                                                        data-testid="integration-mode-selection-card-radio"
                                                    />
                                                </div>
                                                <div className="card-content">
                                                    <Card.Header
                                                        className="mb-2"
                                                        data-testid="integration-mode-selection-card-header"
                                                    >
                                                        <span>Integrate</span> your application
                                                    </Card.Header>
                                                    <Card.Meta>
                                                        <span>
                                                            Follow the steps below to integrate your own application
                                                        </span>
                                                    </Card.Meta>
                                                </div>
                                            </Card.Content>
                                        </Card>
                                    </Grid.Column>
                                    <Grid.Column width={ 8 }>
                                        <Card
                                            fluid
                                            className={
                                                `selection-card radio-selection-card quickstart-mode-card ${
                                                    selectedIntegration === QuickStartModes.SAMPLES
                                                        ? "card-selected"
                                                        : ""
                                                }`
                                            }
                                            data-testid="try-out-mode-selection-card"
                                        >
                                            <Card.Content
                                                onClick={ () => {
                                                    eventPublisher.publish(
                                                        "application-quick-start-click-integration-path-radio", {
                                                            type: "try-out-sample"
                                                        }
                                                    );
                                                    setSelectedIntegration(QuickStartModes.SAMPLES);
                                                    handleIntegrateSelection(QuickStartModes.SAMPLES);
                                                } }
                                                className="selection-card-content"
                                                data-testid="try-out-mode-selection-card-content"
                                            >
                                                <div className="integrate-radio">
                                                    <Radio
                                                        checked={ selectedIntegration === QuickStartModes.SAMPLES }
                                                        data-testid="try-out-mode-selection-card-radio"
                                                    />
                                                </div>
                                                <div className="card-content">
                                                    <Card.Header
                                                        className="mb-2"
                                                        data-testid="try-out-mode-selection-card-header"
                                                    >
                                                        <span>Try out </span>a sample
                                                    </Card.Header>
                                                    <Card.Meta>
                                                        <span>
                                                            Use our preconfigured sample to try out the login flow
                                                        </span>
                                                    </Card.Meta>
                                                </div>
                                            </Card.Content>
                                        </Card>
                                    </Grid.Column>
                                </Grid.Row>
                            </>
                        )
                        : null
                }
            </Grid>
        </>
    );
};
