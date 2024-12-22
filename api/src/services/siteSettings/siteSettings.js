import { db } from 'src/lib/db'

export const siteSettings = () => {
  return db.siteSetting.findMany()
}

export const siteSetting = ({ id }) => {
  return db.siteSetting.findUnique({
    where: { id },
  })
}

export const createSiteSetting = ({ input }) => {
  return db.siteSetting.create({
    data: input,
  })
}

export const updateSiteSetting = ({ id, input }) => {
  return db.siteSetting.update({
    data: input,
    where: { id },
  })
}

export const deleteSiteSetting = ({ id }) => {
  return db.siteSetting.delete({
    where: { id },
  })
}
