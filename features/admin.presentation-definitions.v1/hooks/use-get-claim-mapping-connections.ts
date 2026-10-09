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

import { useEffect, useState } from "react";
import { fetchConnectionClaimMappings, getConnectedIdps } from "../api/presentation-definitions";
import {
    ConnectedIdpItemInterface,
    ConnectedIdpsResponseInterface,
    ConnectionClaimMappingItemInterface,
    ConnectionClaimMappingsResponseInterface
} from "../models/presentation-definitions";

interface UseGetClaimMappingConnectionsReturn {
    /** Map from claim path to the names of connected IDPs that have mapped that claim. */
    claimMappingConnections: Map<string, string[]>;
    /** Whether the initial fetch is in progress. */
    isLoading: boolean;
}

/**
 * Hook to build a map of claim paths to the connected IDP names that have that claim mapped.
 * Used to block editing or deletion of claims that are actively in use by a connection.
 *
 * @param definitionId - The ID of the presentation definition.
 * @returns claimMappingConnections map and loading state.
 */
export const useGetClaimMappingConnections = (
    definitionId: string
): UseGetClaimMappingConnectionsReturn => {
    const [ claimMappingConnections, setClaimMappingConnections ] =
        useState<Map<string, string[]>>(new Map());
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    useEffect((): void => {
        if (!definitionId) return;

        setIsLoading(true);
        getConnectedIdps(definitionId)
            .then((response: ConnectedIdpsResponseInterface): Promise<void> => {
                const idps: ConnectedIdpItemInterface[] = response?.connectedIdps ?? [];

                if (idps.length === 0) {
                    setClaimMappingConnections(new Map());

                    return Promise.resolve();
                }

                return Promise.all(
                    idps.map((idp: ConnectedIdpItemInterface) =>
                        fetchConnectionClaimMappings(idp.idpId)
                            .then((data: ConnectionClaimMappingsResponseInterface) =>
                                ({ idp, mappings: data?.mappings ?? [] }))
                            .catch(() => ({
                                idp,
                                mappings: [] as ConnectionClaimMappingItemInterface[]
                            }))
                    )
                ).then((results: Array<{
                    idp: ConnectedIdpItemInterface;
                    mappings: ConnectionClaimMappingItemInterface[];
                }>): void => {
                    const claimMap: Map<string, string[]> = new Map();

                    for (const { idp, mappings } of results) {
                        for (const mapping of mappings) {
                            if (mapping.idpClaim) {
                                const existing: string[] = claimMap.get(mapping.idpClaim) ?? [];

                                claimMap.set(mapping.idpClaim, [ ...existing, idp.name ]);
                            }
                        }
                    }
                    setClaimMappingConnections(claimMap);
                });
            })
            .catch((): void => {
                setClaimMappingConnections(new Map());
            })
            .finally((): void => setIsLoading(false));
    }, [ definitionId ]);

    return { claimMappingConnections, isLoading };
};
