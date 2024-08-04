/**
 * Copyright (c) 2022-2024, WSO2 LLC. (https://www.wso2.com).
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
    ApplicationTemplateInterface,
    URLFragmentTypes
} from "@wso2is/admin.applications.v1/models";
import { history } from "@wso2is/admin.core.v1";
import { getTechnologyLogos } from "@wso2is/admin.core.v1/configs";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Heading, useDocumentation } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useLayoutEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid } from "semantic-ui-react";
import { IntegrateSDKs } from "./integrate-sdks";
import { SDKMeta } from "./meta";
import { SupportedTraditionalOIDCAppTechnologyTypes } from "./models";
import { TryoutSamples } from "./tryout-samples";
import JavaLogo from "../../../assets/images/icons/java-logo.svg";
import DotNetLogo from "../../../assets/images/icons/net-logo.svg";
import NextJSLogo from "../../../assets/images/icons/next-js-logo.svg";
import NodeJSLogo from "../../../assets/images/icons/nodejs-logo.svg";
import PythonLogo from "../../../assets/images/icons/python-logo.svg";
import { QuickStartModes } from "../../shared";
import {
    QuickStartPanelOverview,
    SPATechnologySelection,
    TraditionalOIDCWebApplicationCustomConfiguration
} from "../../shared/components";

/**
 * Prop types of the component.
 */
interface TraditionalOIDCWebApplicationQuickStartPropsInterface extends IdentifiableComponentInterface {
    application: ApplicationInterface;
    inboundProtocolConfig: any;
    template: ApplicationTemplateInterface;
    onApplicationUpdate: () => void;
    onTriggerTabUpdate: (tabIndex: number) => void;
    defaultTabIndex: number;
}

const INFO_TAB_INDEX: number = 9;
const PROTOCOL_TAB_INDEX: number = 2;
const QUICK_START_TAB_INDEX: number = 0;

/**
 * Quick start content for the Traditional OIDC Web Application template.
 *
 * @param props - Props injected into the component.
 * @returns traditional OIDC web application quick start.
 */
const TraditionalOIDCWebApplicationQuickStart:
FunctionComponent<TraditionalOIDCWebApplicationQuickStartPropsInterface> = (
    props: TraditionalOIDCWebApplicationQuickStartPropsInterface
): ReactElement => {

    const {
        application,
        defaultTabIndex,
        inboundProtocolConfig,
        onApplicationUpdate,
        onTriggerTabUpdate,
        template,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const { getLink } = useDocumentation();

    const dispatch: Dispatch = useDispatch();

    const [ selectedIntegration, setSelectedIntegration ] = useState<QuickStartModes>(undefined);
    const [
        selectedTechnology,
        setSelectedTechnology
    ] = useState<SupportedTraditionalOIDCAppTechnologyTypes>(undefined);
    const [ appList, setAppList ] = useState<ApplicationListInterface>(undefined);
    const [ addedCallBackUrls ] = useState<string[]>([]);
    const [ addedOrigins ] = useState<string[]>([]);

    /**
     * Update the application only if any new callback urls are added.
     */
    useLayoutEffect(() => {
        return () => {
            if (addedCallBackUrls?.length > 0) {
                onApplicationUpdate();
            }
        };
    }, []);

    useEffect(() => {
        getApplicationList(null, null, null)
            .then((response: ApplicationListInterface) => {
                setAppList(response);

            })
            .catch((error: AxiosError) => {
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

        if (!(window.location.hash).includes(URLFragmentTypes.VIEW)) {
            if (appList?.applications?.length > 1) {
                setSelectedIntegration(QuickStartModes.INTEGRATE);

                return;
            }
            setSelectedIntegration(QuickStartModes.SAMPLES);
        }
    }, [ appList ]);

    const handleIntegrateSelection = (selection: QuickStartModes): void => {
        setSelectedIntegration(selection);
    };

    /**
     * Called when the URL fragment updates
     */
    useEffect(() => {

        if (!(window.location.hash).includes(URLFragmentTypes.VIEW)) {
            return;
        }

        const technologyType: string = (window.location.hash).split("&" + URLFragmentTypes.VIEW)[1].split("_")[1];

        if (SupportedTraditionalOIDCAppTechnologyTypes.JAVA_EE.toLowerCase() == unescape(technologyType)) {
            setSelectedTechnology(SupportedTraditionalOIDCAppTechnologyTypes.JAVA_EE);
        } else if (SupportedTraditionalOIDCAppTechnologyTypes.DOT_NET.toLowerCase() == technologyType) {
            setSelectedTechnology(SupportedTraditionalOIDCAppTechnologyTypes.DOT_NET);
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

        setSelectedTechnology(undefined);
    };

    const resolveQuickStartMode = (): ReactElement => {

        switch (selectedIntegration) {
            case QuickStartModes.INTEGRATE:
                return (
                    <IntegrateSDKs
                        application={ application }
                        template={ template }
                        technology={ selectedTechnology }
                        onApplicationUpdate={ onApplicationUpdate }
                        inboundProtocolConfig={ inboundProtocolConfig }
                        addedCallBackUrls={ addedCallBackUrls }
                        addedOrigins={ addedOrigins }
                    />
                );
            case QuickStartModes.SAMPLES:
                return (
                    <TryoutSamples
                        application={ application }
                        template={ template }
                        technology={ selectedTechnology }
                        onApplicationUpdate={ onApplicationUpdate }
                        inboundProtocolConfig={ inboundProtocolConfig }
                        addedCallBackUrls={ addedCallBackUrls }
                        addedOrigins={ addedOrigins }
                    />
                );
            default:
                return null;
        }
    };

    const resetTabState = () => {

        history.push({
            hash: `${ URLFragmentTypes.TAB_INDEX }${ QUICK_START_TAB_INDEX }`,
            pathname: window.location.pathname
        });

        setSelectedTechnology(undefined);
    };

    const resolveTechnologyLogo = (technology: SupportedTraditionalOIDCAppTechnologyTypes) => {

        if (technology === SupportedTraditionalOIDCAppTechnologyTypes.JAVA_EE) {
            return getTechnologyLogos().java;
        }

        if (technology === SupportedTraditionalOIDCAppTechnologyTypes.DOT_NET) {
            return getTechnologyLogos().dotNet;
        }

        return null;
    };

    const resolveCustomConfiguration = (): ReactElement => {
        return (
            <Grid.Row data-componentid={ `${ componentId }-custom-configuration-container` }>
                <TraditionalOIDCWebApplicationCustomConfiguration
                    onTriggerTabUpdate={ onTriggerTabUpdate }
                    infoTabIndex={ INFO_TAB_INDEX }
                    protocolTabIndex={ PROTOCOL_TAB_INDEX }
                    inboundProtocolConfig={ inboundProtocolConfig }
                    icons={ [
                        { techIcon: NodeJSLogo, techIconTitle: "Node JS" },
                        { techIcon: DotNetLogo, techIconTitle: "DotNet" },
                        { techIcon: PythonLogo, techIconTitle: "Python" },
                        { techIcon: NextJSLogo, techIconTitle: "Next JS" },
                        { techIcon: JavaLogo, techIconTitle: "Java EE" }
                    ] }
                    data-componentid={ `${ componentId }-custom-configuration` }
                    documentationLink={
                        getLink(
                            "develop.applications.editApplication." +
                            "oidcApplication.quickStart." +
                            "customConfig.learnMore"
                        )
                    }
                />
            </Grid.Row>
        );
    };

    const resolveTechnologySelection = (): ReactElement => {
        return (
            <Grid.Row data-componentid={ `${ componentId }-technology-selection-container` }>
                <SPATechnologySelection<SupportedTraditionalOIDCAppTechnologyTypes>
                    technologies={ [
                        {
                            "data-componentid": "java-ee",
                            displayName: SupportedTraditionalOIDCAppTechnologyTypes.JAVA_EE,
                            logo: JavaLogo,
                            sampleAppURL: SDKMeta.tomcatOIDCAgent.sample.artifact,
                            type: SupportedTraditionalOIDCAppTechnologyTypes.JAVA_EE
                        }
                    ] }
                    data-componentid={ `${ componentId }-technology-selection` }
                    onSelectedTechnologyChange={
                        (technology: SupportedTraditionalOIDCAppTechnologyTypes) =>
                            setSelectedTechnology(technology)
                    }
                />
            </Grid.Row>
        );
    };

    return (
        <Grid data-componentid={ componentId } className="ml-0 mr-0">
            {
                !(selectedTechnology || (window.location.hash).includes(URLFragmentTypes.VIEW))
                    ? (
                        <>
                            <Grid.Row className="technology-selection-wrapper single-page-qsg">
                                <Grid.Column width={ 8 } className="custom-config-container p-5">
                                    { resolveCustomConfiguration() }
                                </Grid.Column>
                                <Grid.Column width={ 8 } className="p-5">
                                    { resolveTechnologySelection() }
                                </Grid.Column>
                            </Grid.Row>
                            <Divider className="or" vertical>
                                <Heading as="h5">OR</Heading>
                            </Divider>
                        </>
                    )
                    : (
                        <>
                            <Grid.Row>
                                <Grid.Column width={ 13 }>
                                    <QuickStartPanelOverview
                                        technology={ selectedTechnology }
                                        applicationType={ template.id }
                                        application={ application }
                                        inboundProtocols={ application?.inboundProtocols }
                                        onBackButtonClick={ () => resetTabState() }
                                        handleIntegrateSelection={ handleIntegrateSelection }
                                        technologyLogo={ resolveTechnologyLogo(selectedTechnology) }
                                        defaultTabIndex={ defaultTabIndex }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={ 13 }>
                                    { resolveQuickStartMode() }
                                </Grid.Column>
                            </Grid.Row>
                        </>
                    )
            }
        </Grid>
    );
};

/**
 * Default props for the component
 */
TraditionalOIDCWebApplicationQuickStart.defaultProps = {
    "data-componentid": "traditional-oidc-web-app-quick-start"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default TraditionalOIDCWebApplicationQuickStart;
