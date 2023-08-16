/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
