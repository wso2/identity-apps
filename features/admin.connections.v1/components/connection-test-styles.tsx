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

import Box from "@oxygen-ui/react/Box";
import Card from "@oxygen-ui/react/Card";
import { Theme, styled } from "@mui/material/styles";

export const StyledCodeBlockContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
    background: theme.palette.background.paper,
    border: `1px solid ${ theme.palette.divider }`,
    borderRadius: theme.shape.borderRadius,
    overflowX: "auto"
}));

export const StyledCodeBlock = styled(Box)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.primary,
    fontFamily: "monospace",
    fontSize: 13,
    margin: 0,
    padding: theme.spacing(1.5),
    whiteSpace: "pre-wrap",
    wordBreak: "break-word"
}));

export const StyledResultCard = styled(Card)(({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(3)
}));

export const StyledTableWrapper = styled(Box)(({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${ theme.palette.divider }`,
    borderRadius: theme.shape.borderRadius,
    overflow: "hidden"
}));

export const StyledTableHeaderRow = styled(Box)(({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.action.hover,
    borderBottom: `1px solid ${ theme.palette.divider }`
}));

export const StyledTableRow = styled(Box)(({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${ theme.palette.divider }`
}));

export const StyledHeaderCell = styled(Box)(({ theme }: { theme: Theme }) => ({
    borderRight: `1px solid ${ theme.palette.divider }`,
    fontSize: 15,
    fontWeight: 600,
    padding: theme.spacing(1.25, 1),
    textAlign: "left"
}));

export const StyledMonoCell = styled(Box)(({ theme }: { theme: Theme }) => ({
    borderRight: `1px solid ${ theme.palette.divider }`,
    fontFamily: "monospace",
    fontSize: 13,
    padding: theme.spacing(1)
}));

export const StyledValueCell = styled(StyledMonoCell)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.secondary
}));

export const StyledDiagnosticValueBlock = styled(Box)(({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.action.hover,
    border: `1px solid ${ theme.palette.divider }`,
    borderRadius: theme.shape.borderRadius,
    fontFamily: "monospace",
    fontSize: 12,
    margin: 0,
    overflowX: "auto",
    padding: theme.spacing(1),
    whiteSpace: "pre-wrap",
    wordBreak: "break-word"
}));

export const StyledDiagnosticsScroller = styled(Box)(({ theme }: { theme: Theme }) => ({
    maxHeight: theme.spacing(65),
    overflowY: "auto",
    scrollbarColor: `${ theme.palette.grey[400] } ${ theme.palette.action.hover }`,
    scrollbarWidth: "thin",
    "&::-webkit-scrollbar": {
        width: 10
    },
    "&::-webkit-scrollbar-thumb": {
        backgroundColor: theme.palette.grey[400],
        border: `2px solid ${ theme.palette.action.hover }`,
        borderRadius: 999
    },
    "&::-webkit-scrollbar-track": {
        backgroundColor: theme.palette.action.hover,
        borderRadius: 999
    }
}));

export const StyledDiagnosticAccordionRow = styled(Box)(({ theme }: { theme: Theme }) => ({
    borderBottom: `1px solid ${ theme.palette.divider }`
}));

export const StyledDiagnosticAccordionTitle = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    flexDirection: "row",
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.75, 1.5)
}));

export const StyledExpandedDetailsTable = styled(Box)(({ theme }: { theme: Theme }) => ({
    borderCollapse: "collapse",
    width: "100%",
    "& td": {
        borderTop: `1px solid ${ theme.palette.divider }`,
        padding: theme.spacing(1, 1.5),
        verticalAlign: "top"
    }
}));

export const StyledExpandedLabelCell = styled(Box)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.secondary,
    fontFamily: "monospace",
    fontSize: 12,
    width: 160
}));

export const StyledExpandedValueCell = styled(Box)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.primary,
    fontSize: 13
}));
