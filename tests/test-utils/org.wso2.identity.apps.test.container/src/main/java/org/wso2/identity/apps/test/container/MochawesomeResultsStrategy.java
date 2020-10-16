/*
 *Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *WSO2 Inc. licenses this file to you under the Apache License,
 *Version 2.0 (the "License"); you may not use this file except
 *in compliance with the License.
 *You may obtain a copy of the License at
 *
 *http://www.apache.org/licenses/LICENSE-2.0
 *
 *Unless required by applicable law or agreed to in writing,
 *software distributed under the License is distributed on an
 *"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *KIND, either express or implied.  See the License for the
 *specific language governing permissions and limitations
 *under the License.
 */

package org.wso2.identity.apps.test.container;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

/**
 * Mochaawsome results strategy class
 */
public class MochawesomeResultsStrategy implements TestResultsStrategy {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final Path jsonReportsPath;

    MochawesomeResultsStrategy(Path jsonReportsPath) {

        this.jsonReportsPath = jsonReportsPath;
    }

    MochawesomeResultsStrategy() {

        jsonReportsPath = FileSystems.getDefault().getPath("target", "test-classes", "test-utils",
                "output", "results", "mochawesome");
    }

    @Override
    public CypressTestResults gatherTestResults() throws IOException {

        CypressTestResults results = new CypressTestResults();
        objectMapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);

        try (DirectoryStream<Path> paths = Files.newDirectoryStream(jsonReportsPath, "*.json")) {
            for (Path path : paths) {
                MochawesomeSpecRunReport specRunReport = objectMapper.readValue(path.toFile(),
                        MochawesomeSpecRunReport.class);
                specRunReport.fillInTestResults(results);
            }

            return results;
        }
    }

    @Override
    public Path getReportsPath() {

        return jsonReportsPath;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class MochawesomeSpecRunReport {

        private Stats stats;

        private List<Result> results;

        Stats getStats() {

            return stats;
        }

        void setStats(Stats stats) {

            this.stats = stats;
        }

        List<Result> getResults() {

            return results;
        }

        void setResults(List<Result> results) {

            this.results = results;
        }

        void fillInTestResults(CypressTestResults results) {
            results.addNumberOfTests(stats.getTests());
            results.addNumberOfPassingTests(stats.getPasses());
            results.addNumberOfFailingTests(stats.getFailures());

            for (Result result : getResults()) {
                List<Suite> suites = result.getSuites();

                List<CypressTestSuite> cypressTestSuites = new ArrayList<>();
                for (Suite suite : suites) {
                    CypressTestSuite cypressTestSuite = new CypressTestSuite(suite.getTitle());
                    List<SuiteTest> tests = suite.getTests();
                    for (SuiteTest test : tests) {
                        cypressTestSuite.add(new CypressTestSuite.CypressTest(test.getTitle(), !test.isFail()));
                    }

                    cypressTestSuites.add(cypressTestSuite);
                }

                results.addSuites(cypressTestSuites);
            }
        }

        @JsonIgnoreProperties(ignoreUnknown = true)
        private static class Stats {

            private int tests;

            private int passes;

            private int failures;

            int getTests() {

                return tests;
            }

            void setTests(int tests) {

                this.tests = tests;
            }

            int getPasses() {

                return passes;
            }

            void setPasses(int passes) {

                this.passes = passes;
            }

            int getFailures() {

                return failures;
            }

            void setFailures(int failures) {

                this.failures = failures;
            }
        }

        @JsonIgnoreProperties(ignoreUnknown = true)
        private static class Result {

            private List<Suite> suites;

            List<Suite> getSuites() {

                return suites;
            }

            void setSuites(List<Suite> suites) {

                this.suites = suites;
            }
        }

        @JsonIgnoreProperties(ignoreUnknown = true)
        private static class Suite {

            private String title;

            private List<SuiteTest> tests;

            String getTitle() {

                return title;
            }

            void setTitle(String title) {

                this.title = title;
            }

            List<SuiteTest> getTests() {

                return tests;
            }

            void setTests(List<SuiteTest> tests) {

                this.tests = tests;
            }
        }

        @JsonIgnoreProperties(ignoreUnknown = true)
        private static class SuiteTest {

            private String title;

            private boolean fail;

            String getTitle() {

                return title;
            }

            void setTitle(String title) {

                this.title = title;
            }

            boolean isFail() {

                return fail;
            }

            void setFail(boolean fail) {

                this.fail = fail;
            }
        }
    }
}
