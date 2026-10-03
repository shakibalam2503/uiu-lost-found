const foundTicketRepository = require("../repository/found-ticket.repository");

const createFoundTicket = async (data) => {
  return foundTicketRepository.createFoundTicket(data);
};

const getFoundTicketById = async (ticketId) => {
  return foundTicketRepository.getFoundTicketById(ticketId);
};

const getFoundTickets = async () => {
  return foundTicketRepository.getFoundTickets();
};

const getMyFoundTickets = async (userId) => {
  return foundTicketRepository.getMyFoundTickets(userId);
};

const updateFoundTicket = async (ticketId, data) => {
  return foundTicketRepository.updateFoundTicket(ticketId, data);
};

module.exports = {
  createFoundTicket,
  getFoundTicketById,
  getFoundTickets,
  getMyFoundTickets,
  updateFoundTicket,
};