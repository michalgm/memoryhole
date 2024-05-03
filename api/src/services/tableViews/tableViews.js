import { db } from 'src/lib/db'

export const tableViews = () => {
  return db.tableView.findMany({ orderBy: { name: 'asc' } })
}

export const tableView = ({ id }) => {
  return db.tableView.findUnique({
    where: { id },
  })
}

export const createTableView = ({ input }) => {
  return db.tableView.create({
    data: input,
  })
}

export const updateTableView = ({ id, input }) => {
  return db.tableView.update({
    data: input,
    where: { id },
  })
}

export const deleteTableView = ({ id }) => {
  return db.tableView.delete({
    where: { id },
  })
}

export const TableView = {
  created_by: (_obj, { root }) => {
    return db.tableView.findUnique({ where: { id: root?.id } }).created_by()
  },
  updated_by: (_obj, { root }) => {
    return db.tableView.findUnique({ where: { id: root?.id } }).updated_by()
  },
}
