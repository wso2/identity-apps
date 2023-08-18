/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { Forms } from "@wso2is/forms";
import {
    EmphasizedSegment,
    Text
} from "@wso2is/react-components";
import { store } from "apps/console/src/features/core/store";
import { IdentifiableComponentInterface } from "modules/core/src/models";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Button, Icon } from "semantic-ui-react";

const REDIRECT_FORM_ID: string = "event-configuration-choreo-redirect-form";

export const ChoreoButton: FunctionComponent<IdentifiableComponentInterface> = (
    props: IdentifiableComponentInterface
): ReactElement => {

    const {
        ["data-componentid"]: componentId
    } = props;

    //External link to redirect user to Choreo
    const choreoEventingUrl: string = window["AppUtils"].getConfig().extensions?.choreoEventingEndpoint;
    const tenantName: string = store.getState().auth.tenantDomain;
    
    const { t } = useTranslation();
    
    const onClickNavigateToChoreo = () : void => {
        window.open(`${ choreoEventingUrl }organizations/${ tenantName }`, "_blank", "noopener,noreferrer");
    };

    if (!choreoEventingUrl) {
        return (null); 
    }

    return (
        <div>
            <EmphasizedSegment 
                className="form-wrapper" 
                padded={ "very" } 
                style={ { marginTop: "50px" } }
            >
                <Forms
                    id={ REDIRECT_FORM_ID }
                    uncontrolledForm={ false }
                >
                    <Text className="mb-1"> 
                        { 
                            t("extensions:develop.eventPublishing." +
                                "eventsConfiguration.navigateToChoreo.description")
                        }
                    </Text>
                    <Button
                        style={ { marginTop: "20px" } }
                        primary
                        size="small"
                        className="form-button navigate-to-choreo-button"
                        onClick= { () => onClickNavigateToChoreo() } 
                        data-componentid = { `${ componentId }-redirect-button` }
                        disabled={ false }
                        loading={ false }
                    >
                        <Icon className="ml-1" name="external alternate" />
                        { 
                            t("extensions:develop.eventPublishing." + 
                                "eventsConfiguration.navigateToChoreo.navigateButton") 
                        }
                    </Button>
                </Forms>
            </EmphasizedSegment>
        </div>        
    ); 
};

ChoreoButton.defaultProps = {
    ["data-componentid"]: "choreo-navigation-button"
};
