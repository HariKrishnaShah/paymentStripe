const router = require("express").Router();
const authRouter = require("../modules/auth/auth.route");
const categoryRouter = require("../modules/categories/category.routes");
const orderRouter = require("../modules/orders/order.routes");
const productRouter = require("../modules/products/product.routes");
const userRouter = require("../modules/users/user.route");
const paymentRouter = require("../modules/payment/payment.js");

router.get("/", (req, res, next) => {
  res.json({ data: "", msg: "API Routes are working" });
});

router.use("/auth", authRouter);
router.use("/categories", categoryRouter);
router.use("/orders", orderRouter);
router.use("/products", productRouter);
router.use("/users", userRouter);
router.use("/payment", paymentRouter);

router.all("*", (req, res, next) => {
  try {
    res.json({ data: "", msg: "Routes are not defined" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
