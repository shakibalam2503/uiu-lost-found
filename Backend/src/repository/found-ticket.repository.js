const { db } = require("../config/firebase");

const collection = db.collection("found_tickets");

const createFoundTicket = async (data) => {
  const docRef = collection.doc();

  const ticket = {
    id: docRef.id,
    ...data,
  };

  await docRef.set(ticket);

  return ticket;
};

const getFoundTicketById = async (ticketId) => {
  const doc = await collection.doc(ticketId).get();

  if (!doc.exists) {
    return null;
  }

  return doc.data();
};

const getFoundTickets = async () => {
  const snapshot = await collection
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => doc.data());
};

const getMyFoundTickets = async (userId) => {
  const snapshot = await collection
    .where("submittedBy", "==", userId)
    .get();

  const tickets = snapshot.docs.map((doc) => doc.data());

  tickets.sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() || 0;
    const bTime = b.createdAt?.toMillis?.() || 0;

    return bTime - aTime;
  });

  return tickets;
};

const updateFoundTicket = async (ticketId, data) => {
  await collection.doc(ticketId).update(data);

  return getFoundTicketById(ticketId);
};

module.exports = {
  createFoundTicket,
  getFoundTicketById,
  getFoundTickets,
  getMyFoundTickets,
  updateFoundTicket,
};