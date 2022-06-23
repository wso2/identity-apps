/*
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com).
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.wso2.identity.apps.taglibs.layout.controller.cache;

import org.ehcache.config.builders.CacheConfigurationBuilder;
import org.ehcache.config.builders.ResourcePoolsBuilder;
import org.ehcache.config.units.EntryUnit;
import org.ehcache.config.units.MemoryUnit;
import org.ehcache.core.config.DefaultConfiguration;
import org.ehcache.impl.config.persistence.DefaultPersistenceConfiguration;
import org.ehcache.jsr107.Eh107Configuration;
import org.ehcache.jsr107.EhcacheCachingProvider;
import org.wso2.identity.apps.taglibs.layout.controller.Constant;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.identifiers.ExecutableIdentifier;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.parsers.DefaultParser;
import org.wso2.identity.apps.taglibs.layout.controller.compiler.parsers.Parser;

import java.io.File;
import java.net.URL;
import java.util.UUID;

import javax.cache.Cache;
import javax.cache.CacheManager;
import javax.cache.Caching;
import javax.cache.spi.CachingProvider;

/**
 * Class wrapper to control the JCache + Ehcache
 */
public class LayoutCache {

    private static volatile LayoutCache instance;

    private final CachingProvider cachingProvider;
    private final EhcacheCachingProvider ehcacheProvider;
    private final CacheManager cacheManager;
    private Cache<String, ExecutableIdentifier> cache;

    /**
     * Initialize the layout cache, Other classes can't initialize this class
     */
    private LayoutCache() {

        cachingProvider =
                Caching.getCachingProvider("org.ehcache.jsr107.EhcacheCachingProvider");

        ehcacheProvider = (EhcacheCachingProvider) cachingProvider;

        DefaultConfiguration configuration = new DefaultConfiguration(
                ehcacheProvider.getDefaultClassLoader(),
                new DefaultPersistenceConfiguration(
                        new File(
                                System.getProperty("java.io.tmpdir"),
                                Constant.LAYOUT_CACHE_STORE_DIRECTORY_NAME + "-" + UUID.randomUUID()
                        )
                )
        );

        cacheManager = ehcacheProvider.getCacheManager(ehcacheProvider.getDefaultURI(), configuration);

        cache = cacheManager.getCache(
                Constant.LAYOUT_CACHE_NAME,
                String.class,
                ExecutableIdentifier.class
                                     );

        if (cache == null) {
            cache = cacheManager.createCache("layouts",
                    Eh107Configuration.fromEhcacheCacheConfiguration(
                            CacheConfigurationBuilder.newCacheConfigurationBuilder(
                                    String.class,
                                    ExecutableIdentifier.class,
                                    ResourcePoolsBuilder.newResourcePoolsBuilder()
                                            .heap(Constant.LAYOUT_CACHE_HEAP_ENTRIES, EntryUnit.ENTRIES)
                                            .offheap(Constant.LAYOUT_CACHE_OFF_HEAP_SIZE, MemoryUnit.MB)
                                            .disk(Constant.LAYOUT_CACHE_DISK_SIZE, MemoryUnit.GB, true)
                                            .build()
                                                                                  )
                                                                    )
                                            );
        }
    }

    /**
     * Get the instance of the LayoutCache using singleton method
     */
    public static LayoutCache getInstance() {

        if (instance == null) {
            synchronized (LayoutCache.class) {
                if (instance == null) {
                    instance = new LayoutCache();
                }
            }
        }

        return instance;
    }

    /**
     * Get the layout from the layout cache
     *
     * @param layoutName Name of the layout
     * @param layoutFile Layout file path as a URL object
     */
    public ExecutableIdentifier getLayout(String layoutName, URL layoutFile) {

        ExecutableIdentifier compiledLayout;

        if (!cache.containsKey(layoutName)) {
            Parser parser = new DefaultParser();
            compiledLayout = parser.compile(layoutFile);
            cache.put(layoutName, compiledLayout);
        } else {
            compiledLayout = cache.get(layoutName);
        }

        return compiledLayout;
    }

    /**
     * Close all resources
     */
    public void close() {

        cache.close();
        cacheManager.close();
        ehcacheProvider.close();
        cachingProvider.close();
    }

}
