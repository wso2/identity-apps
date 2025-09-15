/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import Box from "@oxygen-ui/react/Box";
import Code from "@oxygen-ui/react/Code";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ReactElement, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import useRequiredFields, { RequiredFieldInterface } from "../../../../../hooks/use-required-fields";
import { CommonStepFactoryPropsInterface } from "../../common-step-factory";

/**
 * Props interface of {@link FacebookExecution}.
 */
export type FacebookExecutionPropsInterface = Pick<CommonStepFactoryPropsInterface, "resource">
    & IdentifiableComponentInterface;

const FacebookExecution = ({
    resource,
    "data-componentid": componentId = "facebook-execution"
}: FacebookExecutionPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const generalMessage: ReactElement = useMemo(() => {
        return (
            <Trans
                i18nKey="flows:core.validation.fields.input.general"
                values={ { id: resource?.id } }
            >
                Required fields are not properly configured for the input field with ID <Code>{ resource?.id }</Code>.
            </Trans>
        );
    }, [ resource?.id ]);

    const fields: RequiredFieldInterface[] = useMemo(() => {
        return [
            {
                errorMessage: t("flows:core.validation.fields.input.idpName"),
                name: "data.action.executor.meta.idpName"
            }
        ];
    }, []);

    useRequiredFields(
        resource,
        generalMessage,
        fields
    );

    return (
        <Box display="flex" gap={ 1 } data-componentid={ componentId }>
            <img src="https://www.svgrepo.com/show/448224/facebook.svg" height="20" />
            <Typography variant="body1">{ t("flows:core.executions.names.facebook") }</Typography>
        </Box>
    );
};

export default FacebookExecution;
