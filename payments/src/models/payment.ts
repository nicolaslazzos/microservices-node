import mongoose from "mongoose";

// typescript types

interface PaymentAttrs {
  orderId: string;
  paymentId: string;
}

interface PaymentDoc extends mongoose.Document {
  orderId: string;
  paymentId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {}

// mongoose types

const orderSchema = new mongoose.Schema<PaymentDoc>(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order"
    },
    paymentId: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);

const PaymentModel = mongoose.model<PaymentDoc, PaymentModel>("Payment", orderSchema);

// extending the original model to enforce type validation with typescript
export class Payment extends PaymentModel {
  constructor(attrs: PaymentAttrs) {
    super(attrs);
  }
}
