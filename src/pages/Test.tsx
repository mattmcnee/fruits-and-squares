import { useState, useEffect } from "react";
import BarChart from "@components/graphs/BarChart";
import dummyData from "@components/graphs/dummy-scores.json";

const Test = () => {


  return (
    <div style={{padding: "20px"}}>
      <div style={{maxWidth: "300px", margin: "0 auto"}}>
        <BarChart scoresData={dummyData} userId="kLmNoPqRsT"/>
      </div>
    </div>
  );
};

export default Test;