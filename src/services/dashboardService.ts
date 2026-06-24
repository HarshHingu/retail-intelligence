import dbConnect from "@/lib/mongodb";
import Customer from "@/models/Customer";
import Transaction from "@/models/Transaction";
import Campaign from "@/models/Campaign";

export async function getDashboardStats() {
  await dbConnect();

  const [revenueResult, totalCustomers, totalTransactions, repeatCustomersCount] = await Promise.all([
    Transaction.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]),
    Customer.countDocuments(),
    Transaction.countDocuments(),
    Customer.countDocuments({ totalOrders: { $gt: 1 } }),
  ]);

  const totalRevenue = revenueResult[0]?.total || 0;
  const averageOrderValue =
    totalTransactions > 0 ? Math.round((totalRevenue / totalTransactions) * 100) / 100 : 0;
  const repeatPurchaseRate =
    totalCustomers > 0 ? Math.round((repeatCustomersCount / totalCustomers) * 10000) / 100 : 0;

  return {
    totalRevenue,
    totalCustomers,
    totalTransactions,
    averageOrderValue,
    repeatPurchaseRate,
  };
}

export async function getChartsData() {
  await dbConnect();

  const [revenueTrend, categoryDistribution, topCustomers, paymentMethods] = await Promise.all([
    Transaction.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$purchaseDate" } },
          revenue: { $sum: "$amount" },
          transactions: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: "$_id",
          revenue: 1,
          transactions: 1,
          _id: 0,
        },
      },
    ]),

    Transaction.aggregate([
      {
        $group: {
          _id: "$category",
          value: { $sum: "$amount" },
        },
      },
      {
        $project: {
          name: "$_id",
          value: 1,
          _id: 0,
        },
      },
    ]),

    Customer.find({}, { name: 1, totalSpend: 1, totalOrders: 1, segment: 1 })
      .sort({ totalSpend: -1 })
      .limit(5)
      .lean(),

    Transaction.aggregate([
      {
        $group: {
          _id: "$paymentMethod",
          value: { $sum: 1 },
        },
      },
      {
        $project: {
          name: "$_id",
          value: 1,
          _id: 0,
        },
      },
    ]),
  ]);

  return {
    revenueTrend,
    categoryDistribution,
    topCustomers: topCustomers.map((c: any) => ({
      _id: c._id.toString(),
      name: c.name,
      totalSpend: c.totalSpend,
      totalOrders: c.totalOrders,
      segment: c.segment,
    })),
    paymentMethods,
  };
}

export async function getCustomerSegments() {
  await dbConnect();

  const [vip, loyal, newCustomers, atRisk, dormant] = await Promise.all([
    Customer.find({ segment: "VIP" }).lean(),
    Customer.find({ segment: "Loyal" }).lean(),
    Customer.find({ segment: "New" }).lean(),
    Customer.find({ segment: "AtRisk" }).lean(),
    Customer.find({ segment: "Dormant" }).lean(),
  ]);

  const mapCustomer = (c: any) => ({
    _id: c._id.toString(),
    name: c.name,
    email: c.email,
    phone: c.phone,
    totalSpend: c.totalSpend,
    totalOrders: c.totalOrders,
    lastPurchaseDate: c.lastPurchaseDate.toISOString(),
    firstPurchaseDate: c.firstPurchaseDate.toISOString(),
    segment: c.segment,
    preferredCategory: c.preferredCategory,
  });

  return {
    vip: vip.map(mapCustomer),
    loyal: loyal.map(mapCustomer),
    new: newCustomers.map(mapCustomer),
    atRisk: atRisk.map(mapCustomer),
    dormant: dormant.map(mapCustomer),
  };
}

export async function getCampaignsList() {
  await dbConnect();
  const campaigns = await Campaign.find({}).sort({ createdAt: -1 }).lean();
  return campaigns.map((c: any) => ({
    _id: c._id.toString(),
    name: c.name,
    targetSegment: c.targetSegment,
    channel: c.channel,
    offer: c.offer,
    message: c.message,
    whatsappMessage: c.whatsappMessage,
    pushMessage: c.pushMessage,
    expectedImpact: c.expectedImpact,
    goal: c.goal,
    status: c.status,
    createdAt: c.createdAt ? c.createdAt.toISOString() : undefined,
  }));
}
