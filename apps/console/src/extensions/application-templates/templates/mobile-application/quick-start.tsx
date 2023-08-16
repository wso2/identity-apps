/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { 
    ResourceTab,
    useDocumentation
} from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement
} from "react";
import { Grid } from "semantic-ui-react";
import AndroidLogo from "./assets/android-logo.svg";
import FlutterLogo from "./assets/flutter-logo.svg";
import IonicLogo from "./assets/ionic-logo.svg";
import ReactNativeLogo from "./assets/react-native-logo.svg";
import SwiftLogo from "./assets/swift-logo.svg";
import {
    ApplicationInterface,
    ApplicationTemplateInterface
} from "../../../../features/applications/models";
import { MobileCustomConfiguration } from "../../shared/components";

/**
 * Prop types of the Mobile Application Quickstart component.
 */
interface MobileApplicationQuickStartPropsInterface extends IdentifiableComponentInterface {
    application: ApplicationInterface;
    inboundProtocolConfig: any;
    template: ApplicationTemplateInterface;
    onApplicationUpdate: () => void;
    onTriggerTabUpdate: (tabIndex: number) => void;
    defaultTabIndex: number;
}

const PROTOCOL_TAB_INDEX: number = 2;
const INFO_TAB_INDEX: number = 9;

/**
 * Mobile App Quick start content.
 *
 * @param  props - Props injected into the component.
 * @returns Mobile App QuickStart.
 */
const MobileApplicationQuickStart:
    FunctionComponent<MobileApplicationQuickStartPropsInterface> = (
        props:MobileApplicationQuickStartPropsInterface
    ): ReactElement => {

        const {
            inboundProtocolConfig,
            onTriggerTabUpdate,
            [ "data-componentid" ]: componentId
        } = props;

        const { getLink } = useDocumentation();

        return (
            <ResourceTab.Pane controlledSegmentation>
                <Grid data-componentid={ componentId } className="ml-0 mr-0">
                    <Grid.Row className="technology-selection-wrapper single-page-qsg">
                        <Grid.Column computer={ 10 } widescreen={ 8 } className="custom-config-container p-0">
                            <MobileCustomConfiguration
                                onTriggerTabUpdate={ onTriggerTabUpdate }
                                protocolTabIndex={ PROTOCOL_TAB_INDEX }
                                infoTabIndex={ INFO_TAB_INDEX }
                                inboundProtocolConfig={ inboundProtocolConfig }
                                icons={ [
                                    { techIcon: FlutterLogo, techIconTitle: "Flutter" },
                                    { techIcon: AndroidLogo, techIconTitle: "Android" },
                                    { techIcon: SwiftLogo, techIconTitle: "Swift" },
                                    { techIcon: ReactNativeLogo, techIconTitle: "React Native" },
                                    { techIcon: IonicLogo, techIconTitle: "Ionic" }
                                ] }
                                data-componentid={ `${ componentId }-custom-configuration` }
                                documentationLink={
                                    getLink(
                                        "develop.applications.editApplication." +
                                        "oidcApplication.quickStart.mobileApp." +
                                        "learnMore"
                                    )
                                }
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </ResourceTab.Pane>
        );
    };

/**
 * Default props for the component
 */
MobileApplicationQuickStart.defaultProps = {
    "data-componentid": "mobile-app-quick-start"
};

export default MobileApplicationQuickStart;
