const router = require("express").Router();
const authRoutes = require("./routes/auth");

// User
const userRoutes = require("./routes/user");
const transferRoutes = require("./routes/transfer");
const topupRoutes = require("./routes/topup");
const acceptedRoutes = require("./routes/accepted");

// Admin
// const adminRoutes = require('./admin/routes-admin/admin')
// const transferadmRoutes = require('./admin/routes-admin/transfer')
// const topupadmRoutes = require('./admin/routes-admin/topup')

router
  .use("/auth", authRoutes)
  .use("/users", userRoutes)
  .use("/transfer", transferRoutes)
  .use("/topup", topupRoutes)
  .use("/accepted",acceptedRoutes);
// .use('/admin', adminRoutes)
// .use('/topup', topupadmRoutes)
// .use('/transfer', transferadmRoutes)
module.exports = router;
