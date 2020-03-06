/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import React, { FunctionComponent, ReactElement, useEffect, useState, SyntheticEvent, Children } from "react";
import { getPermissionList } from "../../../../src/api";
import { Permission, PermissionObject } from "../../../models/permission";
import SuperTreeview from 'react-super-treeview';

/**
 * Interface to capture permission list props
 */
interface PermissionListProp {
    triggerSubmit: boolean;
    onSubmit: (permissions: any) => void;
}

/**
 * Component to create the permission tree structure from the give permission list.
 * 
 * @param props props containing event handlers for permission component
 */
export const PermissionList: FunctionComponent<PermissionListProp> = (props: PermissionListProp): ReactElement => {

    const [ permissionTree, setPermissionTree ] = useState([]);
    const [ selectedPermissions, setSelectedPermissions ] = useState([]);
    const [ listOffset ] = useState<number>(0);
    const [ listItemLimit ] = useState<number>(0);

    const {
        triggerSubmit,
        onSubmit
    } = props;

    /**
     * A Util method to create an array of permission object with heirarchy.
     * 
     * @param permObj - Permission Object
     * @param pathcomponents - Permission path array
     * @param arr - Empty array to start with
     * 
     * @returns {Permission[]} - Permission arra with tree structure
     */
    const addPath = (permObj: PermissionObject, pathcomponents: string[], arr: Permission[]): Permission[] => {
        const component = pathcomponents.shift()
        let comp = arr.find(item => item.name === component)
        if (!comp) {
            comp =  {
                label: permObj.displayName,
                fullPath: permObj.resourcePath,
                isExpanded: true,
                name: component
            }
            arr.push(comp)
        }
        if(pathcomponents.length){
           addPath(permObj, pathcomponents, comp.children || (comp.children = []))
        }
        return arr;
    }

    //Submits the form programmatically if triggered from outside.
    useEffect(() => {
        if (!triggerSubmit) {
            return;
        }

        onSubmit(selectedPermissions);
    }, [ triggerSubmit ]);

    useEffect(() => {
        getPermissionList().then((response)=> {
            if (response.status === 200) {
                const permList = response.data;
                let permTree: Permission[] = [];

                permTree = permList.reduce((arr, path) => addPath(
                    path, path.resourcePath.replace(/^\/|\/$/g, "").split('/'), arr
                    ),
                []);

                setPermissionTree(permTree);
            }
        }).catch();
    },[ listOffset, listItemLimit ]);

    /**
     * Util function to check all child elements of the tree.
     * 
     * @param nodes - node list which will need to be checked
     */
    const applyCheckStateTo = (nodes: any): void => {
        const checkState = nodes[0].isChecked;

        nodes.forEach((node)=>{
            node.isChecked = checkState
            if(node.children){
                applyCheckStateTo(node.children);
            }
        })
    }

    /**
     * Click event handler for the permission tree checkboxes.
     * 
     * @param nodeData - array of checked elements returned.
     */
    const handlePermssionCheck = (nodeData): void => {
        const checkState = nodeData[0].isChecked;

        /**
         * A util method which will check all the child elements.
         * 
         * @param nodes child nodes need to be checked.
         */
        const applyCheckStateTo = (nodes: any): void => {
            nodes.forEach((node)=>{
                node.isChecked = checkState
                if(node.children){
                    applyCheckStateTo(node.children);
                }
            })
        }

        applyCheckStateTo(nodeData);

        if (nodeData[0].isChecked) {
            setSelectedPermissions([...selectedPermissions, nodeData[0].fullPath]);
        } else {
            setSelectedPermissions(selectedPermissions.filter(item => item.name !== nodeData[0].fullPath));
        }
    }

    return (
        permissionTree && permissionTree.length != 0 ? <SuperTreeview
            data={ permissionTree }
            keywordLabel= "label"
            isDeletable= { () => { return false } }
            noChildrenAvailableMessage= ""
            onUpdateCb={ updatedData => setPermissionTree(updatedData) }
            onCheckToggleCb={ handlePermssionCheck }
        /> :  <p>Loading Permissions</p>
    );
}
