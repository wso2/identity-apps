package org.wso2.identity.apps.test.utils;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.simple.parser.JSONParser;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;

import java.io.*;
import java.lang.InterruptedException;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;

/**
 * Test Utils
 */
public class IntegrationTestUtils {

    private static final IntegrationTestUtils INSTANCE = new IntegrationTestUtils();
    private static final Log LOG = LogFactory.getLog(IntegrationTestUtils.class);

    private static JSONParser jsonParser = new JSONParser();
    private static File cypressEnvConfigFile = new File("cypress.env.json");
    private BufferedReader reader;

    private IntegrationTestUtils() { }

    /**
     * Get instance
     *
     * @return instance
     */
    public static IntegrationTestUtils getInstance() {

        return INSTANCE;
    }

    /**
     * Overwrite the server origin for the cypress test suite.
     *
     * @param serverOrigin Origin of the server.
     */
    public void overwriteServerURL(String serverOrigin) throws IOException, ParseException {

        if (cypressEnvConfigFile.exists()) {
            FileReader reader = new FileReader(cypressEnvConfigFile.getAbsolutePath());
            FileWriter fileWriter = new FileWriter(cypressEnvConfigFile.getAbsolutePath(), false);

            JSONObject cypressEnvConfig = (JSONObject) jsonParser.parse(reader);
            cypressEnvConfig.put("SERVER_URL", serverOrigin);

            fileWriter.write(cypressEnvConfig.toJSONString());
        }
    }

    /**
     * Initialise the cypress test suite.
     *
     * @throws IOException
     * @throws InterruptedException
     */
    public void initTestSuite() throws IOException, InterruptedException {

        Process process;
        String line;
        final ClassLoader classLoader = getClass().getClassLoader();

        String filePath = Objects.requireNonNull(classLoader.getResource("test-suite-runner.sh")).getFile();
        File file = new File(filePath);

        if (!file.isFile()) {
            throw new IllegalArgumentException("The file" + filePath + " does not exist");
        }

        process = Runtime.getRuntime().exec(new String[]{"sh", filePath}, null);
        process.waitFor();
        BufferedReader reader = new BufferedReader(new InputStreamReader(
                process.getInputStream()));
        while ((line = reader.readLine()) != null) {
            LOG.info(line);
        }
    }

    public void runTestSuite(String scriptPath) throws IOException, URISyntaxException {

        Path path = Paths
                .get(new File(getClass().getProtectionDomain().getCodeSource().getLocation().toURI()).getPath());

        Path child = path.resolve("test-suite-runner.sh");

        if (!Files.exists(path)) {
            throw new RuntimeException("Script `" + scriptPath + "`  does not exists!");
        }

        Process process;
        if (System.getProperty("os.name").startsWith("Windows")) {
            // TODO run bat file.
            LOG.warn("Skipped the cypress integration test run.");
            return;
        } else {
            process = new ProcessBuilder("/bin/bash", child.toAbsolutePath().toString()).start();
        }

        try (BufferedReader r = new BufferedReader(
                new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8.name()))) {
            String line;
            if ((line = r.readLine()) != null) {
                LOG.info(line);
            }
        }
    }
}
