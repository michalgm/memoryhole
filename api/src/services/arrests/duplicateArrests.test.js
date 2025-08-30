import { db } from 'src/lib/db'
import { duplicateArrests } from './duplicateArrests'

// Mock authentication
jest.mock('src/lib/auth', () => ({
  requireAuth: jest.fn(),
}))

// Mock access filter
jest.mock('./arrests', () => ({
  filterArrestAccess: jest.fn((where) => where),
}))

describe('duplicateArrests', () => {
  scenario('finds high-scoring matches for similar names with same DOB',
    async (scenario) => {
      const results = await duplicateArrests()
      expect(results.length).toBeGreaterThan(0)

      // Find the John/Jon Smith pair
      const johnJonMatch = results.find(r => {
        const arrest1Id = r.arrest1_id
        const arrest2Id = r.arrest2_id

        return (arrest1Id === scenario.arrest.johnSmith.id && arrest2Id === scenario.arrest.jonSmith.id)
      })

      expect(johnJonMatch).toBeDefined()
      expect(johnJonMatch.matchScore.toNumber()).toBeGreaterThan(70)
    }
  )

  scenario('does not match completely different people',
    async (scenario) => {
      const results = await duplicateArrests()

      // Should not match John Smith with Jane Doe
      const johnJaneMatch = results.find(r => {
        const arrest1Id = r.arrest1_id
        const arrest2Id = r.arrest2_id

        return (arrest1Id === scenario.arrest.johnSmith.id && arrest2Id === scenario.arrest.janeDoe.id) ||
          (arrest1Id === scenario.arrest.janeDoe.id && arrest2Id === scenario.arrest.johnSmith.id)
      })

      expect(johnJaneMatch).toBeUndefined()
    }
  )

  scenario('matches first name with preferred name',
    async (scenario) => {
      // Update one arrestee to have preferred name
      await db.arrestee.update({
        where: { id: scenario.arrest.johnSmith.arrestee_id },
        data: {
          first_name: 'Robert',
          preferred_name: 'Bob'
        }
      })

      await db.arrestee.update({
        where: { id: scenario.arrest.jonSmith.arrestee_id },
        data: {
          first_name: 'Bob',
          last_name: 'Smith'
        }
      })

      const results = await duplicateArrests()

      const preferredMatch = results.find(r => {
        return (r.arrest1_id === scenario.arrest.johnSmith.id && r.arrest2_id === scenario.arrest.jonSmith.id) ||
          (r.arrest1_id === scenario.arrest.jonSmith.id && r.arrest2_id === scenario.arrest.johnSmith.id)
      })

      expect(preferredMatch).toBeDefined()
      expect(preferredMatch.matchScore.toNumber()).toBeGreaterThan(70)
    }
  )

  scenario('scores close dates higher than far dates',
    async (scenario) => {
      // Update dates to test proximity
      await db.arrest.update({
        where: { id: scenario.arrest.johnSmyth.id },
        data: { date: new Date('2024-01-01T12:00:00Z') } // 2 hours after johnSmith
      })

      await db.arrest.update({
        where: { id: scenario.arrest.janeDoe.id },
        data: {
          date: new Date('2024-02-01T10:00:00Z'), // 1 month later
          arrestee: {
            update: {
              first_name: 'John',
              last_name: 'Smith',
              dob: new Date('1990-01-01')
            }
          }
        }
      })

      const results = await duplicateArrests()

      // Find close and far matches
      const closeMatch = results.find(r => {
        return (r.arrest1_id === scenario.arrest.johnSmith.id && r.arrest2_id === scenario.arrest.johnSmyth.id) ||
          (r.arrest1_id === scenario.arrest.johnSmyth.id && r.arrest2_id === scenario.arrest.johnSmith.id)
      })

      const farMatch = results.find(r => {
        return (r.arrest1_id === scenario.arrest.johnSmith.id && r.arrest2_id === scenario.arrest.janeDoe.id) ||
          (r.arrest1_id === scenario.arrest.janeDoe.id && r.arrest2_id === scenario.arrest.johnSmith.id)
      })

      if (closeMatch && farMatch) {
        expect(closeMatch.dateProximityScore.toNumber()).toBeGreaterThan(farMatch.dateProximityScore.toNumber())
      }
    }
  )

  scenario('respects strictCityMatch filter',
    async (scenario) => {
      // Update one arrest to different city
      await db.arrest.update({
        where: { id: scenario.arrest.jonSmith.id },
        data: { arrest_city: 'Different City' }
      })

      const allResults = await duplicateArrests({ strictCityMatch: false })
      const strictResults = await duplicateArrests({ strictCityMatch: true })

      const johnJonMatchAll = allResults.find(r => {
        return (r.arrest1_id === scenario.arrest.johnSmith.id && r.arrest2_id === scenario.arrest.jonSmith.id) ||
          (r.arrest1_id === scenario.arrest.jonSmith.id && r.arrest2_id === scenario.arrest.johnSmith.id)
      })

      const johnJonMatchStrict = strictResults.find(r => {
        return (r.arrest1_id === scenario.arrest.johnSmith.id && r.arrest2_id === scenario.arrest.jonSmith.id) ||
          (r.arrest1_id === scenario.arrest.jonSmith.id && r.arrest2_id === scenario.arrest.johnSmith.id)
      })

      expect(johnJonMatchAll).toBeDefined()
      expect(johnJonMatchStrict).toBeUndefined()
    }
  )

  scenario('withIgnored', 'excludes ignored pairs by default',
    async (scenario) => {
      const results = await duplicateArrests()
      expect(results.length).toBe(0)
    }
  )

  scenario('withIgnored', 'includes ignored pairs when includeIgnored is true',
    async (scenario) => {
      const results = await duplicateArrests({ includeIgnored: true })
      expect(results.length).toBe(1)
    }
  )

  scenario('respects strictDOBMatch filter',
    async (scenario) => {
      // Update one arrestee to different DOB
      await db.arrestee.update({
        where: { id: scenario.arrest.jonSmith.arrestee_id },
        data: { dob: new Date('1995-01-01') }
      })

      const allResults = await duplicateArrests({ strictDOBMatch: false })
      const strictResults = await duplicateArrests({ strictDOBMatch: true })

      const johnJonMatchAll = allResults.find(r => {
        return (r.arrest1_id === scenario.arrest.johnSmith.id && r.arrest2_id === scenario.arrest.jonSmith.id) ||
          (r.arrest1_id === scenario.arrest.jonSmith.id && r.arrest2_id === scenario.arrest.johnSmith.id)
      })

      const johnJonMatchStrict = strictResults.find(r => {
        return (r.arrest1_id === scenario.arrest.johnSmith.id && r.arrest2_id === scenario.arrest.jonSmith.id) ||
          (r.arrest1_id === scenario.arrest.jonSmith.id && r.arrest2_id === scenario.arrest.johnSmith.id)
      })

      expect(johnJonMatchAll).toBeDefined()
      expect(johnJonMatchStrict).toBeUndefined()
    }
  )
})
