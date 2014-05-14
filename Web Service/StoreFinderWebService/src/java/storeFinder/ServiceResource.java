/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package storeFinder;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.QueryParam;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PUT;
import javax.ws.rs.core.Response;

/**
 * REST Web Service
 *
 * @author Ian
 */
@Path("/")
public class ServiceResource {

    @Context
    private UriInfo context;
    
    private Connection con;
    
    /**
     * Creates a new instance of GenericResource
     */
    public ServiceResource() {
        try {
            con = DriverManager.getConnection("jdbc:derby://localhost:1527/Stores");
        }
        catch (Exception e) 
        {
            System.out.println(e.getMessage());
        }
    }

    /**
     * Retrieves list of countries in the world
     * @return a json object containing a list of countries
     */
    @GET
    @Path("countries")
    @Produces("application/json")
    public Response getCountries() {
        ResultSet rs = null;
        String responseText = ""; 
        try 
        {
            String query = "SELECT id,name FROM countries";

            PreparedStatement st = con.prepareStatement(query);
            rs = st.executeQuery();

            responseText = "{\"countries\":["; 
            while (rs.next()) 
            {
                responseText += "{\"id\":\"" + rs.getInt("ID") + "\"," +
                          "\"name\":\"" + rs.getString("NAME") + "\"},";
            }
            if(responseText.endsWith(","))
                responseText = responseText.substring(0, responseText.length()-1);
            responseText += "]}"; 
        } 
        catch (Exception e) 
        {
            responseText = "{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}";
            return Response.status(500).type("application/json").entity(responseText).build();
        }   
        
        return Response.status(200).type("application/json").entity(responseText).build();
    }

    /**
     * Retrieves list of provinces in a country
     * @param id = the country_id associated with the provinces to return
     * @return a json object containing a list of provinces
     */
    @GET
    @Path("provinces/{id}")
    @Produces("application/json")
    public Response getProvinces(@PathParam("id") String id) {
        ResultSet rs = null;
        String responseText = ""; 
        try 
        {
            String query = "SELECT id,name FROM provinces WHERE country_id = " + id;

            PreparedStatement st = con.prepareStatement(query);
            rs = st.executeQuery();

            responseText = "{\"provinces\":["; 
            while (rs.next()) 
            {
                responseText += "{\"id\":\"" + rs.getInt("ID") + "\"," +
                          "\"name\":\"" + rs.getString("NAME") + "\"},";
            }
            if(responseText.endsWith(","))
                responseText = responseText.substring(0, responseText.length()-1);
            responseText += "]}"; 
        } 
        catch (Exception e) 
        {
            responseText = "{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\", \"id\":\"" + id + "\"}";
            return Response.status(500).type("application/json").entity(responseText).build();
        }   
        
        return Response.status(200).type("application/json").entity(responseText).build();
    }

    /**
     * Retrieves list of cities in a province
     * @param id = the province_id associated with the cities to return
     * @return a json object containing a list of cities
     */
    @GET
    @Path("cities/{id}")
    @Produces("application/json")
    public Response getCities(@PathParam("id") String id) {
        ResultSet rs = null;
        String responseText = ""; 
        try 
        {
            String query = "SELECT id,name FROM cities WHERE province_id = " + id;

            PreparedStatement st = con.prepareStatement(query);
            rs = st.executeQuery();

            responseText = "{\"cities\":["; 
            while (rs.next()) 
            {
                responseText += "{\"id\":\"" + rs.getInt("ID") + "\"," +
                          "\"name\":\"" + rs.getString("NAME") + "\"},";
            }
            if(responseText.endsWith(","))
                responseText = responseText.substring(0, responseText.length()-1);
            responseText += "]}"; 
        } 
        catch (Exception e) 
        {
            responseText = "{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\", \"id\":\"" + id + "\"}";
            return Response.status(500).type("application/json").entity(responseText).build();
        }   
        
        return Response.status(200).type("application/json").entity(responseText).build();
    }

    /**
     * Retrieves list of stores in a city
     * @param id = the city_id associated with the cities to return
     * @return a json object containing a list of stores that match the specified city_id
     */
    @GET
    @Path("stores")
    @Produces("application/json")
    public Response getStores(@QueryParam("countryid") String countryId,
                              @QueryParam("provinceid") String provinceId,
                              @QueryParam("cityid") String cityId) {
        ResultSet rs = null;
        String responseText = ""; 
        
        if(countryId == null || countryId.isEmpty()) {
            responseText = "{\"status\":\"error\", \"message\":\"CountryId is a required query parameter.\"}";
            return Response.status(500).type("application/json").entity(responseText).build();
        }
        
        try 
        {
            String query = "SELECT s.id, s.name, ci.name AS city, pr.name AS province, co.name AS country FROM stores s " +
                           "JOIN cities ci ON s.city_id = ci.id " +
                           "JOIN provinces pr ON ci.province_id = pr.id " +
                           "JOIN countries co ON pr.country_id = co.id " +
                           "WHERE country_id = " + countryId;
            if(provinceId != null && !provinceId.isEmpty())
                query += " AND province_id = " + provinceId;
            if(cityId != null && !cityId.isEmpty())
                query += " AND city_id = " + cityId;

            PreparedStatement st = con.prepareStatement(query);
            rs = st.executeQuery();

            responseText = "{\"stores\":["; 
            while (rs.next()) 
            {
                responseText += "{\"id\":\"" + rs.getInt("ID") + "\"," +
                          "\"name\":\"" + rs.getString("NAME") + "\"," +
                          "\"city\":\"" + rs.getString("CITY") + "\"," +
                          "\"province\":\"" + rs.getString("PROVINCE") + "\"," +
                          "\"country\":\"" + rs.getString("COUNTRY") + "\"},";
            }
            if(responseText.endsWith(","))
                responseText = responseText.substring(0, responseText.length()-1);
            responseText += "]}"; 
        } 
        catch (Exception e) 
        {
            responseText = "{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}";
            return Response.status(500).type("application/json").entity(responseText).build();
        }   
        
        return Response.status(200).type("application/json").entity(responseText).build();
    }    
    
}
