/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.URI;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.junit.Test;
import javax.ws.rs.client.Client;
import javax.ws.rs.core.UriBuilder;
import javax.ws.rs.ext.RuntimeDelegate;
import javax.ws.rs.client.ClientBuilder;
import static org.junit.Assert.assertEquals;
import storeFinder.ApplicationConfig;

/**
 *
 * @author Ian
 */
@RunWith(Suite.class)
@Suite.SuiteClasses({})
public class TestSuite {

    @BeforeClass
    public static void setUpClass() throws Exception {
    }

    @AfterClass
    public static void tearDownClass() throws Exception {
    }

    @Before
    public void setUp() throws Exception {
    }

    @After
    public void tearDown() throws Exception {
    }
    
    @Test
    public void ApiIntegrationTests() throws IOException {
 
        URI uri = UriBuilder.fromUri("http://localhost/").port(8282).build();
 
        // Create an HTTP server listening at port 8282
        HttpServer server = HttpServer.create(new InetSocketAddress(uri.getPort()), 0);
        // Create a handler wrapping the JAX-RS application
        HttpHandler handler = RuntimeDelegate.getInstance().createEndpoint(new ApplicationConfig(), HttpHandler.class);
        // Map JAX-RS handler to the server root
        server.createContext(uri.getPath(), handler);
        // Start the server
        server.start();
 
        Client client = ClientBuilder.newClient();
 
        // Valid URIs
        assertEquals(200, client.target("http://localhost:8282/countries").request().get().getStatus());
        assertEquals(200, client.target("http://localhost:8282/provinces/1").request().get().getStatus());
        assertEquals(200, client.target("http://localhost:8282/cities/1").request().get().getStatus());
        assertEquals(200, client.target("http://localhost:8282/stores?countryid=1&provinceid=1&cityid=1").request().get().getStatus());
 
        // Invalid URIs
        assertEquals(404, client.target("http://localhost:8282/provinces").request().get().getStatus());
        assertEquals(404, client.target("http://localhost:8282/cities").request().get().getStatus());
        assertEquals(404, client.target("http://localhost:8282/stores").request().get().getStatus());
 
        // Stop HTTP server
        server.stop(0);
    }
    
}
