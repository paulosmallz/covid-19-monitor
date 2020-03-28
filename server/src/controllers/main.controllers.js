const { Client } = require("pg");
const fs = require("fs");

const {
  StatusInternalServerError,
  StatusOK
} = require("../helpers/httpErrors");

const { fetchAndFormatData } = require("../helpers/covidDataFetcher");

// queries
const {
  getAllCountriesQuery,
  getCasesAndDeathsPerCountryQuery,
  quickStatsQuery,
  totalCasesGroupedByCountryQuery,
  totalDeathsGroupedByCountryQuery,
  insertDataQuery
} = require("../helpers/dataQueries");

const client = new Client();
client.connect();

module.exports = {

  // refresh daily data
  async refreshData(req, res) {
    try {
      const data = await fetchAndFormatData();

      console.log(data.slice(0, 3));

      for (let i = 0; i < data.length; i++) {
        await client.query(insertDataQuery, [
          data[i].country,
          data[i].date,
          data[i].cases,
          data[i].deaths,
          data[i].name,
          data[i].countryterritorycode,
          data[i].population
        ]);
      }
      res.status(StatusOK).json({ message: "data updated" });
    } catch (error) {
      console.log(error);
      res.status(StatusInternalServerError).json({ error });
    }
  },


  //  get all countries affected (name, country code)
  async getAllCountries(req, res) {
    try {
      const response = await client.query(getAllCountriesQuery);
      res.status(StatusOK).json({ data: response.rows, error: false });
    } catch (error) {
      res.status(StatusInternalServerError).json({ error });
    }
  },

  //  get all countries cases and deaths
  async getAllCasesandDeathsByCountries(req, res) {
    const { country } = req.params;
    try {
      const response = await client.query(getCasesAndDeathsPerCountryQuery, [
        country
      ]);
      res.status(StatusOK).json({ data: response.rows, error: false });
    } catch (error) {
      res.status(StatusInternalServerError).json({ error });
    }
  },

  async totalCasesGroupedByCountry(req, res) {
    try {
      const response = await client.query(totalCasesGroupedByCountryQuery);
      res.status(StatusOK).json({ data: response.rows, error: false });
    } catch (error) {
      res.status(StatusInternalServerError).json({ error });
    }
  },

  async totalDeathsGroupedByCountry(req, res) {
    try {
      const response = await client.query(totalDeathsGroupedByCountryQuery);
      res.status(StatusOK).json({ data: response.rows, error: false });
    } catch (error) {
      res.status(StatusInternalServerError).json({ error });
    }
  },

  // quick stats about the number of countries affetced and total cases
  async quickStats(req, res) {
    try {
      const response = await client.query(quickStatsQuery);
      res.status(StatusOK).json({ data: response.rows, error: false });
    } catch (error) {
      res.status(StatusInternalServerError).json({ error });
    }
  }
};
