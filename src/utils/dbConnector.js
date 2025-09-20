import { Sequelize, DataTypes } from "sequelize";
import { join } from "path";
import { app } from "electron";

// Use Electron userData path for DB storage
console.log(app.getPath("userData"));
const dbPath = join(app.getPath("userData"), "kaaryaTender.sqlite");

// Initialize Sequelize ORM for SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
  logging: false,
});

// Example: Tender model
const Tender = sequelize.define(
  "Tender",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    duration: { type: DataTypes.STRING },
    district: { type: DataTypes.STRING },
    taluka: { type: DataTypes.STRING },
    village: { type: DataTypes.STRING },
    account: { type: DataTypes.STRING },
    adminAmount: { type: DataTypes.STRING },
    techAmount: { type: DataTypes.STRING },
    pubDate: { type: DataTypes.STRING },
    endDate: { type: DataTypes.STRING },
    openDate: { type: DataTypes.STRING },
    startOrderDate: { type: DataTypes.STRING },
    adminOrder: { type: DataTypes.STRING },
    adminOrderDate: { type: DataTypes.STRING },
    techOrder: { type: DataTypes.STRING },
    techOrderDate: { type: DataTypes.STRING },
    newspaper: { type: DataTypes.STRING },
    sarpanch: { type: DataTypes.STRING },
    upsarpanch: { type: DataTypes.STRING },
    officer: { type: DataTypes.STRING },
    contractors: { type: DataTypes.TEXT }, // store as JSON string
  },
  {
    tableName: "tenders",
    timestamps: false,
  }
);

// Example: Contractor model
const Contractor = sequelize.define(
  "Contractor",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING },
    contactNo: { type: DataTypes.STRING },
    document: { type: DataTypes.STRING }, // store single document path as string
    originalFileName: { type: DataTypes.STRING }, // store original filename for display
  },
  {
    tableName: "contractors",
    timestamps: false,
  }
);

// Sync models (create tables if not exist)
async function initDb() {
  await sequelize.sync();
}

export default {
  sequelize,
  Tender,
  Contractor,
  initDb,
};
