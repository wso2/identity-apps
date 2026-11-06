/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import Divider from "@oxygen-ui/react/Divider";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import FlowExtensionAccessRows from "./flow-extension-access-rows";
import useFlowExtensionAccessRows, {
    UseFlowExtensionAccessRowsReturnInterface
} from "../../../hooks/use-flow-extension-access-rows";

/**
 * Props interface of {@link FlowExtensionAccessConfig}
 */
interface FlowExtensionAccessConfigPropsInterface extends IdentifiableComponentInterface {
    /**
     * ID of the flow extension the step runs.
     */
    extensionId: string;
}

/**
 * Access the flow extension of a step has to the runtime values and request headers of this flow, and in a
 * registration flow to the organization it onboards. When the flow extension cannot be fetched, nothing is shown.
 *
 * @param props - Props injected to the component.
 * @returns FlowExtensionAccessConfig component.
 */
const FlowExtensionAccessConfig: FunctionComponent<FlowExtensionAccessConfigPropsInterface> = ({
    extensionId,
    ["data-componentid"]: componentId = "flow-extension-access-config"
}: FlowExtensionAccessConfigPropsInterface): ReactElement => {
    const { t } = useTranslation();

    const {
        isShown,
        isVariablesShown,
        isSubjectOrganizationShown,
        isLocked,
        runtimeValueRows,
        headerRows,
        subjectOrganizationRows,
        organizationAttributeRows,
        isRead,
        isWritten,
        toggleRead,
        toggleWrite
    }: UseFlowExtensionAccessRowsReturnInterface = useFlowExtensionAccessRows(extensionId);

    if (!isShown) {
        return null;
    }

    return (
        <>
            <Divider />
            <Stack gap={ 2 } data-componentid={ componentId }>
                <Stack gap={ 0.5 }>
                    <Typography variant="body1" sx={ { fontWeight: 500 } }>
                        { t("flowExtension:properties.accessConfig.title") }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        { t("flowExtension:properties.accessConfig.description") }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        { t("flowExtension:properties.accessConfig.advancedHint") }
                    </Typography>
                </Stack>
                { isVariablesShown && (
                    <>
                        <FlowExtensionAccessRows
                            title={ t("flowExtension:properties.accessConfig.runtimeValues") }
                            emptyText={ t("flowExtension:properties.accessConfig.noRuntimeValues") }
                            rows={ runtimeValueRows }
                            disabled={ isLocked }
                            isRead={ isRead }
                            isWritten={ isWritten }
                            onToggleRead={ toggleRead }
                            onToggleWrite={ toggleWrite }
                            data-componentid={ `${ componentId }-runtime-values` }
                        />
                        <FlowExtensionAccessRows
                            title={ t("flowExtension:properties.accessConfig.headers") }
                            emptyText={ t("flowExtension:properties.accessConfig.noHeaders") }
                            rows={ headerRows }
                            disabled={ isLocked }
                            isRead={ isRead }
                            onToggleRead={ toggleRead }
                            data-componentid={ `${ componentId }-headers` }
                        />
                    </>
                ) }
                { isSubjectOrganizationShown && (
                    <FlowExtensionAccessRows
                        title={ t("flowExtension:properties.accessConfig.subjectOrganization") }
                        emptyText=""
                        rows={ subjectOrganizationRows }
                        disabled={ isLocked }
                        groups={ [ {
                            emptyText: t("flowExtension:properties.accessConfig.noOrganizationAttributes"),
                            id: "attributes",
                            rows: organizationAttributeRows,
                            title: t("flowExtension:properties.accessConfig.organizationAttributes")
                        } ] }
                        isRead={ isRead }
                        onToggleRead={ toggleRead }
                        data-componentid={ `${ componentId }-subject-organization` }
                    />
                ) }
            </Stack>
        </>
    );
};

export default FlowExtensionAccessConfig;
