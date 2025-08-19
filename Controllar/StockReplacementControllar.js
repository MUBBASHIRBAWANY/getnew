import DamageProductModal from "../modal/DamageProductModal.js";
import StockReplacementModal from "../modal/StockReplacementModal.js";
import TotalProductModal from "../modal/TotalProductModal.js";

export const createStockReplacement = async (req, res) => {
  const { ReplacementDate, Customer, SalesFlowRef, ReplacementData, Store, Location } = req.body;
  console.log(Location, Store)
  try {
    const lastDoc = await StockReplacementModal.findOne().sort({ _id: -1 });
    let nextCode;
    if (!lastDoc || !lastDoc.ReplacementNumber) {
      nextCode = "000001";
    } else {
      const currentNumber = parseInt(lastDoc.ReplacementNumber, 10) || 0;
      nextCode = (currentNumber + 1).toString().padStart(6, '0');
    }

    const stockChecks = await Promise.all(
      ReplacementData.map(async item => {
        const product = await TotalProductModal.findOne({
          ProductName: item.productTo,
          Location,
          Store
        });
        return { product, item };
      })
    );

    const errors = stockChecks.filter(({ product, item }) =>
      !product || product.TotalQuantity < (item.totalBox || 0)
    );

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: errors.map(({ product, item }) =>
          !product
            ? { product: item.productTo, message: "Product not found" }
            : {
              product: product.ProductName,
              qty: product.TotalQuantity,
              required: item.totalBox
            }
        )
      });
    }

    const data = await StockReplacementModal.create({
      ReplacementNumber: nextCode,
      ReplacementData,
      Customer,
      ReplacementDate,
      SalesFlowRef,
      PostStatus: false,
      Store,
      Location
    });

    res.status(200).send(data);

  } catch (err) {
    console.error("Create stock replacement error:", err);
    res.status(400).json({ success: false, message: "Something went wrong", error: err.message });
  }
};


export const UpdateStockReplacement = async (req, res) => {
  const { id } = req.params
  const { ReplacementDate, Customer, SalesFlowRef, ReplacementData, Store, Location } = req.body
  try {
    const stockChecks = await Promise.all(
      ReplacementData.map(async item => {
        const product = await TotalProductModal.findOne({
          ProductName: item.productTo,
          Location: Location,
          Store: Store
        });
        return { product, item };
      })
    );

    const errors = stockChecks.filter(({ product, item }) =>
      !product || product.TotalQuantity < (item.totalBox || 0)
    );

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: errors.map(({ product, item }) =>
          !product
            ? [`${item.product}`]
            : {
              product: product.ProductName,
              qty: product.TotalQuantity,
              required: item.totalBox
            }
        )
      });
    }

    else {
      const data = await StockReplacementModal.findByIdAndUpdate(id, {
        ReplacementData: ReplacementData,
        Customer,
        ReplacementDate: ReplacementDate,
        SalesFlowRef,
        Store,
        Location

      })

      res.status(200).send(data)
    }

  }
  catch (err) {
    console.log(err)
    res.status(400).send("some thing went wrong")
  }
}

export const getAllStockReplacement = async (req, res) => {
  try {
    const returns = await StockReplacementModal.find().sort({ ReplacementNumber: -1 });
    res.status(200).json({ status: true, data: returns });
  } catch (err) {
    console.log(err)
    res.send("Some Thing Wnent Gone Wronge")
  }
}

export const deleteStockReplacement = async (req, res) => {
  const { id } = req.params;
  try {
    const existingReturn = await StockReplacementModal.findById(id);

    if (existingReturn.PostStatus == true) {
      return res.status(400).send("Posted returns cannot be deleted");
    }

    await StockReplacementModal.findByIdAndDelete(id);
    res.status(200).send("Return deleted successfully");
  } catch (err) {
    res.status(500).send("Deletion failed");
  }
}
export const postStockReplacement = async (req, res) => {
  const { ReplacementData, Store, Location, status  } = req.body;
  const {id} = req.params
  
  if (!id || !Array.isArray(ReplacementData)) {
    return res.status(400).json({
      success: false,
      message: "Missing or invalid 'id' or 'ReplacementData'",
    });
  }

  try {
    const replacementRecord = await StockReplacementModal.findById(id);
    console.log(id)
    if (!replacementRecord) {
      return res.status(404).json({
        success: false,
        message: "Replacement record not found",
      });
    }

    if (status === true) {
      // ✅ POSTING
      const stockChecks = await Promise.all(
        ReplacementData.map(async (item) => {
          const product = await TotalProductModal.findOne({
            ProductName: item.productTo,
            Location,
            Store,
          });
          return { product, item };
        })
      );

      const insufficientStock = stockChecks.filter(
        ({ product, item }) =>
          !product || (Number(product.TotalQuantity) || 0) < (Number(item.totalBoxesTo) || 0)
      );

      if (insufficientStock.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock to post replacement",
          errors: insufficientStock.map(({ product, item }) =>
            !product
              ? { product: item.productTo, message: "Product not found" }
              : {
                product: product.ProductName,
                available: product.TotalQuantity,
                tryingToDeduct: item.totalBoxesTo,
              }
          ),
        });
      }

      // Deduct from good stock
      try {
        const bulkDeduct = ReplacementData.map((item) => ({
          updateOne: {
            filter: {
              ProductName: item.productTo,
              Location,
              Store,
              TotalQuantity: { $gte: Number(item.totalBoxesTo) || 0 },
            },
            update: {
              $inc: {
                TotalQuantity: -(Number(item.totalBoxesTo) || 0),
                Amount: -(Number(item.ToValue) || 0),
              },
            },
          },
        }));
        await TotalProductModal.bulkWrite(bulkDeduct);
      } catch (err) {
        console.error("Error deducting stock:", err);
      }
      // Update PostStatus = true
      
      // Add to damage stock
      try {
        const bulkDamage = ReplacementData.map((item) => ({
          updateOne: {
            filter: { ProductName: item.productFrom, Location, Store },
            update: {
              $inc: {
                TotalQuantity: Number(item.totalBoxesFrom) || 0,
                Amount: Number(item.fromValue) || 0,
              },
              $setOnInsert: {
                ProductName: item.productFrom,
                Location,
                Store,
              },
            },
            upsert: true,
          },
        }));
        await DamageProductModal.bulkWrite(bulkDamage);
      } catch (err) {
        console.error("Error adding damage stock:", err);
      }

      // Update Damage AvgRate
      for (const item of ReplacementData) {
        const damageProduct = await DamageProductModal.findOne({
          ProductName: item.productFrom,
          Location,
          Store,
        });
        if (damageProduct && damageProduct.TotalQuantity > 0) {
          const avgRate = damageProduct.Amount / damageProduct.TotalQuantity;
          await DamageProductModal.updateOne(
            { _id: damageProduct._id },
            { $set: { AvgRate: avgRate } }
          );
        }
      }

await StockReplacementModal.findByIdAndUpdate(id, {PostStatus: true });
      console.log("status update")

      return res.status(200).json({
        success: true,
        message: "Replacement posted successfully",
      });
    } else {
      // ✅ UNPOSTING
      const damageChecks = await Promise.all(
        ReplacementData.map(async (item) => {
          const damageProduct = await DamageProductModal.findOne({
            ProductName: item.productTo,
            Location,
            Store,
          });
          return { damageProduct, item };
        })
      );

      const insufficientDamage = damageChecks.filter(
        ({ damageProduct, item }) =>
          !damageProduct ||
          (Number(damageProduct.TotalQuantity) || 0) < (Number(item.totalBoxesFrom) || 0)
      );

     

      // Remove from damage stock
      try {
        const bulkRemove = ReplacementData.map((item) => ({
          updateOne: {
            filter: {
              ProductName: item.productFrom,
              Location,
              Store,
              TotalQuantity: { $gte: Number(item.totalBoxesFrom) || 0 },
            },
            update: {
              $inc: {
                TotalQuantity: -(Number(item.totalBoxesFrom) || 0),
                Amount: -(Number(item.fromValue) || 0),
              },
            },
          },
        }));
        await DamageProductModal.bulkWrite(bulkRemove);
      } catch (err) {
        console.error("Error removing from damage stock:", err);
      }

      // Add back to good stock
      try {
        const bulkAdd = ReplacementData.map((item) => ({
          updateOne: {
            filter: { ProductName: item.productTo, Location, Store },
            update: {
              $inc: {
                TotalQuantity: Number(item.totalBoxesTo) || 0,
                Amount: Number(item.ToValue) || 0,
              },
              $setOnInsert: {
                ProductName: item.productTo,
                Location,
                Store,
              },
            },
            upsert: true,
          },
        }));
        await TotalProductModal.bulkWrite(bulkAdd);
      } catch (err) {
        console.error("Error restoring good stock:", err);
      }

      // Update both avg rates
      for (const item of ReplacementData) {
        const damageProduct = await DamageProductModal.findOne({
          ProductName: item.productFrom,
          Location,
          Store,
        });
        if (damageProduct && damageProduct.TotalQuantity > 0) {
          const avgRate = damageProduct.Amount / damageProduct.TotalQuantity;
          await DamageProductModal.updateOne(
            { _id: damageProduct._id },
            { $set: { AvgRate: avgRate } }
          );
        }

        const totalProduct = await TotalProductModal.findOne({
          ProductName: item.productTo,
          Location,
          Store,
        });
        if (totalProduct && totalProduct.TotalQuantity > 0) {
          const avgRate = totalProduct.Amount / totalProduct.TotalQuantity;
          await TotalProductModal.updateOne(
            { _id: totalProduct._id },
            { $set: { AvgRate: avgRate } }
          );
        }
      }

      // Update PostStatus = false
      await StockReplacementModal.findByIdAndUpdate(id, { PostStatus: false });

      return res.status(200).json({
        success: true,
        message: "Replacement unposted successfully",
      });
    }
  } catch (error) {
    console.error("Stock Replacement Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing stock replacement",
      error: error.message,
    });
  }
};


export const createStockReplacementBulk = async (req, res) => {
  const { replacements } = req.body;

  try {
    // Get last ReplacementNumber
    const lastRecord = await StockReplacementModal.findOne().sort({ _id: -1 });
    let nextNumber = lastRecord ? parseInt(lastRecord.ReplacementNumber, 10) + 1 : 1;

    const replacementPromises = replacements.map(async (invoice) => {
      const code = nextNumber.toString().padStart(6, '0');
      nextNumber++;



      return {
        ReplacementNumber: code,
        ReplacementData: invoice.ReplacementData,
        Customer: invoice.Customer,
        ReplacementDate: invoice.ReplacementDate,
        SalesFlowRef: invoice.SalesFlowRef,
        PostStatus: false,
        Store: invoice.Store,
        Location: invoice.Location
      };
    });

    const results = await Promise.allSettled(replacementPromises);

    const failedReplacements = results.filter(r => r.status === 'rejected');
    if (failedReplacements.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'One or more replacements failed validation.',
        errors: failedReplacements.map(f => ({
          code: f.reason.code,
          issues: f.reason.errors
        }))
      });
    }

    const validReplacements = results.map(r => r.value);
    const created = await StockReplacementModal.insertMany(validReplacements);

    res.status(200).json({
      success: true,
      data: created,
      message: `${created.length} stock replacement(s) created successfully`
    });

  } catch (err) {
    console.error("Bulk stock replacement error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to process bulk stock replacements",
      error: err.message
    });
  }
};




