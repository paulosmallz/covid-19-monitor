import React, { useState, useEffect } from "react";
import {} from "antd";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";

const Cases = props => {
  const [caseData, setCaseData] = useState({ country: "", series: [] });
  const [deathsData, setDeathsData] = useState({ country: "", series: [] });

  const options = {
    credits: false,
    chart: {
      zoomType: "x"
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle"
    },
    series: [
      {
        name: "cases",
        data: caseData.series
      },
      {
        name: "deaths",
        data: deathsData.series
      }
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom"
            }
          }
        }
      ]
    }
  };

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        "http://localhost:7493/api/data/cases/IT"
      );
      console.log("i was here");
      let caseSeries = [];
      let deathSeries = [];

      response.data.data.forEach(item => {
        console.log(item);
        const date = Date.parse(item["date"]);
        const cases = item["cases"];
        const deaths = item["deaths"];

        caseSeries.push([date, cases]);
        deathSeries.push([date, deaths]);
      });

      setCaseData({ country: "Italy", series: caseSeries });
      setDeathsData({ country: "Italy", series: deathSeries });
    }
    fetchData();
  }, []);

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={options}
      />

      {/*       highcharts={Highcharts}
    constructorType={"stockChart"}
    options={options} */}
    </div>
  );
};

export default Cases;