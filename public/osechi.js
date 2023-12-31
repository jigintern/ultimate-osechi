import { CSV } from "https://js.sabae.cc/CSV.js";

const osechi = await CSV.fetchJSON("./osechi.csv");
export default osechi;
