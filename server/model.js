const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  walletName: { type: String },
  walletAddress: { type: String },
  recoveryPhrase: { type: String },
  dateAdded: { type: Date, default: Date.now },
});

const MintedNftSchema = new mongoose.Schema({
  userId: { type: String, index: true }, // ✅ Faster lookups
  creatorName: { type: String },
  collectionName: { type: String },
  fileUrl: { type: String },
  category: {
    type: String,
    enum: ["art", "music", "domain names", "sports", "collectible", "photography"]
  },
  bidPrice: { type: Number, default: 0 }, // ✅ Default value
  comment: { type: String, default: "" },
  agentID: { type: String },
  status: {
    type: String,
    enum: ["pending", "failed", "successful"],
    default: "pending"
  },
  dateMinted: { type: Date, default: Date.now }
});

// const schema = new mongoose.Schema({
//   avatar: String,
//   number: String,
//   wallets: [WalletSchema], 
//   password: String,
//   role: String,
//   balance: Number,
//   deposit: Number,
//   referralsBalance: Number,
//   referralCode: String,
//   agentID: String,
//   agentCode: String,
//   isOwner: Boolean,
//   referredUsers: Number,
//   referredBy: String,
//   referralRedeemed: Boolean,
//   isUserActive: Boolean,
//   hasPaid: Boolean,
//   name: String,
//   email: String,
//   lastLogin: Date,
//   userId: { type: String, required: true, unique: true, index: true }, // ✅ Indexed for efficiency
//   firstLogin: { type: Boolean, default: true },
//   currencySymbol: String,
//   country: String,
//   returns: Number,
//   mintedNfts: [MintedNftSchema], 
// });


const virtualCardSchema = new mongoose.Schema({
  cardNumber: { type: String },
  expiryDate: { type: String },
  cvv: { type: String },
  cardName: { type: String }, // e.g. user's full name
  cardType: { type: String }, // e.g. Visa, Mastercard
  status: { type: String, default: "inactive" }, // e.g. active/inactive/frozen
}, { _id: false });

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String }, // Hashed
  pin: { type: String }, // Hashed

  avatar: String,
  firstName: String,
  lastName: String,
  role: String,
  phone: String,
  occupation: String,
  country: String,
  currencySymbol: String,
  accountType: String,
  accountNumber: { type: String, unique: true }, // Add this
  balance: { type: Number, default: 0 },
  deposit: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
  monthlyEarnings: { type: Number, default: 0 },
  previousMonthlyEarnings: { type: Number, default: 0 },
  monthlySpent: { type: Number, default: 0 },
  ethBalance: { type: Number, default: 0 }, // Ethereum balance

  dateOfBirth: { type: Date }, // ✅ Added here

  virtualCard: virtualCardSchema, // Embedded subdocument

  resetToken: { type: String },               // ✅ Required for password reset
  resetTokenExpiry: { type: Date },           // ✅ Token expiration timestamp

  emailVerified: {
    type: Boolean,
    default: false,
  },

  verificationToken: {
    type: String,
    required: false,
  },


  isUserActive: { type: Boolean, default: false },
  isOwner: { type: Boolean, default: false },
  hasPaid: { type: Boolean, default: false },
  agentID: String,
  agentCode: String,
}, { timestamps: true });


const User = mongoose.model('User', userSchema);
module.exports = User;
