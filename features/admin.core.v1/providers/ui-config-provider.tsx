/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { PropsWithChildren, ReactElement, useReducer } from "react";
import { UIConfigInterface } from "../models/config";
import { UIConfigContext } from "../context/ui-config-context";
import { UIConfigReducer } from "../reducers/ui-config-reducer";
import { UIConfigActionTypes } from "../actions/ui-config";

// eslint-disable-next-line @typescript-eslint/ban-types
type UIConfigProviderPropsInterface = {};

/**
 * UI Configuration Provider.
 *
 * @param {React.PropsWithChildren<UIConfigProviderPropsInterface>} props - Props injected to the component.
 * @returns {React.ReactElement}
 */
const UIConfigProvider = (props: PropsWithChildren<UIConfigProviderPropsInterface>): ReactElement => {

    const { children } = props;

    const [ state, dispatch ] = useReducer(UIConfigReducer, { UIConfig: null });

    const setUIConfig = (config: UIConfigInterface) => {
        dispatch({ type: UIConfigActionTypes.SET_UI_CONFIG, payload: config });
    };

    return (
        <UIConfigContext.Provider
            value={ {
                UIConfig: state.UIConfig,
                setUIConfig
            } }
        >
            { children }
        </UIConfigContext.Provider>
    );
};

export default UIConfigProvider;
