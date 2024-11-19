import { db } from 'src/lib/db'

export const dynamicQuery = async (model, params) => {
  const { where, orderBy, select, take, skip } = params

  return db[model].findMany({
    where,
    orderBy,
    select,
    take,
    skip,
  })
}

export const dynamicModelQuery = async ({ model, params }) => {
  // await new Promise((resolve) => setTimeout(resolve, 4000))

  return dynamicQuery(model, params)
}
