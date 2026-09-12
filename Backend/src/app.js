const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const lostItemRoutes = require("./routes/lost-item.routes");
const foundItemRoutes = require("./routes/found-item.routes");
const matchRoutes = require("./routes/match.routes");
const claimRoutes = require("./routes/claim.routes");
const recoveryRoutes = require("./routes/recovery.routes");


const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/lost-items", lostItemRoutes);
app.use("/api/found-items", foundItemRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/recoveries", recoveryRoutes);

module.exports = app;