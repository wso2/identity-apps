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

import { Theme, alpha, styled } from "@mui/material/styles";
import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";

export const CustomTreeItem: typeof TreeItem = styled(TreeItem)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.grey[200],
    [`& .${treeItemClasses.content}`]: {
        "&.Mui-focused": {
            backgroundColor: alpha(theme.palette.primary.main, 0.2)
        },
        "&.Mui-selected .Mui-focused": {
            backgroundColor: alpha(theme.palette.primary.main, 0.2)
        },
        "&.Mui-selected:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.2)
        },
        "&[data-selected]": {
            backgroundColor: "transparent"
        },
        "&[data-selected][data-focused]": {
            backgroundColor: alpha(theme.palette.primary.main, 0.2)
        },
        borderRadius: theme.spacing(0.5),
        margin: theme.spacing(0.2, 0),
        padding: theme.spacing(0.5, 1),
        position: "relative"
    },
    [`& .${treeItemClasses.iconContainer}`]: {
        backgroundColor: theme.palette.primary.dark,
        borderRadius: "50%",
        padding: theme.spacing(0, 1.2),
        ...theme.applyStyles("light", {
            backgroundColor: alpha(theme.palette.primary.main, 0.25)
        }),
        ...theme.applyStyles("dark", {
            color: theme.palette.primary.contrastText
        })
    },
    [`& .${treeItemClasses.groupTransition}`]: {
        borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
        marginLeft: 16,
        paddingLeft: 18,
        position: "relative"
    },
    // Hide horizontal connector for items that have expand icons (have children)
    [`&:has(.${treeItemClasses.iconContainer}) .${treeItemClasses.content}::before`]: {
        display: "none"
    },
    ...theme.applyStyles("light", {
        color: theme.palette.grey[800]
    })
}));
