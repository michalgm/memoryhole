import { useState } from 'react'

import { Close, Help, Settings } from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Popover,
  Typography,
} from '@mui/material'
import { Stack } from '@mui/system'

import { routes } from '@redwoodjs/router'
import { useQuery } from '@redwoodjs/web'

import DataTable from 'src/components/DataTable/DataTable'
import { BaseField } from 'src/components/utils/BaseField'
import Link from 'src/components/utils/Link'
import { duplicateArrestSchema } from 'src/lib/FieldSchemas'

export const QUERY = gql`
  query ArrestDuplicatesQuery(
    $maxArrestDateDifferenceSeconds: Int
    $strictCityMatch: Boolean
    $strictDOBMatch: Boolean
    $includeIgnored: Boolean
  ) {
    duplicateArrests: duplicateArrests(
      maxArrestDateDifferenceSeconds: $maxArrestDateDifferenceSeconds
      strictCityMatch: $strictCityMatch
      strictDOBMatch: $strictDOBMatch
      includeIgnored: $includeIgnored
    ) {
      matchScore
      nameScore
      dobScore
      emailScore
      phoneScore
      dateProximityScore
      arrest1 {
        id
        ...ArrestFields
      }
      arrest2 {
        id
        ...ArrestFields
      }
    }
  }
`

const DATE_OPTIONS = [
  { id: 60 * 60 * 4, label: '4 hours' },
  { id: 60 * 60 * 12, label: '12 hours' },
  { id: 60 * 60 * 24, label: '24 hours' },
  { id: 60 * 60 * 48, label: '2 days' },
  { id: 60 * 60 * 24 * 7, label: '1 week' },
]

const ArrestDuplicatesPage = () => {
  const [maxArrestDateIndex, setMaxArrestDateIndex] = useState(1)
  const [strictCityMatch, setStrictCityMatch] = useState(true)
  const [strictDOBMatch, setStrictDOBMatch] = useState(true)
  const [includeIgnored, setIncludeIgnored] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const {
    data: responseData,
    loading,
    refetch,
  } = useQuery(QUERY, {
    variables: {
      maxArrestDateDifferenceSeconds: DATE_OPTIONS[maxArrestDateIndex].id,
      strictCityMatch,
      strictDOBMatch,
      includeIgnored,
    },
  })

  const displayColumns = [
    // 'matchScore',
    'arrest1.arrestee.display_field',
    'arrest2.arrestee.display_field',
    'arrest1.arrest_city',
    'arrest1.date',
    'arrest2.date',
    // 'nameScore',
    // 'dobScore',
    // 'emailScore',
    // 'phoneScore',
    // 'dateProximityScore',
  ]

  const preColumns = [
    {
      accessorKey: 'matchScore',
      id: 'matchScore',
      header: 'Match Score',
      Cell: ({ row, renderedCellValue }) => {
        const [id, compareId] = row.id.split('-')
        return (
          <Link
            color="secondary"
            to={routes.findDuplicateArrestsCompare({
              id,
              compareId,
            })}
          >
            {renderedCellValue}
          </Link>
        )
      },
    },
  ]

  const data =
    responseData?.duplicateArrests.map((row) => ({
      ...row,
      id: `${row.arrest1.id}-${row.arrest2.id}`,
    })) || []

  const schema = duplicateArrestSchema

  const tableProps = {
    enableColumnOrdering: true,
    enableColumnPinning: true,
    enableColumnFilterModes: true,
    initialState: {
      showGlobalFilter: true,
      sorting: [{ id: 'matchScore', desc: true }],
      columnPinning: {
        left: ['matchScore'],
      },
    },
  }

  const closeHelp = () => setShowHelp(false)
  // const schema = {
  //   matchScore: { type: 'number', props: { required: true } },
  // }

  return (
    <Stack spacing={2} direction="column">
      {/* <Paper sx={{ p: 2 }}>
        Compare the current record in the left column with the record values in
        the right column. Use the button to replace values in the left column
        with those from the right. For multi-line text fields, the value will be
        appended.
      </Paper> */}
      <DataTable
        data={data}
        schema={schema}
        displayColumns={displayColumns}
        tableProps={tableProps}
        refetch={refetch}
        preColumns={preColumns}
        disableDownload={true}
        actionButtons={() => [
          <Stack spacing={1} direction="row" key="settings">
            <Button
              id="match-settings-button"
              variant="outlined"
              startIcon={<Settings />}
              onClick={() => setSettingsOpen(!settingsOpen)}
            >
              Match Settings
            </Button>
            <Button
              id="help-button"
              variant="outlined"
              startIcon={<Help />}
              onClick={() => setShowHelp(!showHelp)}
            >
              How does this work?
            </Button>
            <Popover
              open={settingsOpen}
              key="menu-list"
              anchorEl={document.getElementById('match-settings-button')}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              onClose={() => setSettingsOpen(false)}
            >
              <Paper sx={{ p: 2 }}>
                <BaseField
                  key="maxArrestDateDifferenceSeconds"
                  name="maxArrestDateDifferenceSeconds"
                  label="Max Difference Between Arrest Dates"
                  field_type="select"
                  options={DATE_OPTIONS}
                  value={DATE_OPTIONS[maxArrestDateIndex]}
                  storeFullObject={true}
                  onChange={(value) =>
                    setMaxArrestDateIndex(DATE_OPTIONS.indexOf(value))
                  }
                  helperText="Maximum time between arrest dates to be considered a match."
                  disableClearable={true}
                />
                <BaseField
                  key="strictCityMatch"
                  name="strictCityMatch"
                  label="Strictly Match Arrest City"
                  field_type="checkbox"
                  checked={strictCityMatch}
                  onChange={() => setStrictCityMatch(!strictCityMatch)}
                  helperText="Arrest city must match exactly."
                />
                <BaseField
                  key="strictDOBMatch"
                  name="strictDOBMatch"
                  label="Strictly Match Date of Birth"
                  field_type="checkbox"
                  checked={strictDOBMatch}
                  onChange={() => setStrictDOBMatch(!strictDOBMatch)}
                  helperText="If both records have date of birth defined, they must match exactly."
                />
                <BaseField
                  key="includeIgnored"
                  name="includeIgnored"
                  label="Include Ignored Duplicates"
                  field_type="checkbox"
                  checked={includeIgnored}
                  onChange={() => setIncludeIgnored(!includeIgnored)}
                  helperText="Whether to include arrest pairs that have been marked as ignored duplicates."
                />
              </Paper>
            </Popover>
          </Stack>,
        ]}
        // bulkUpdate={bulkUpdate}
        // bulkDelete={bulkDelete}
        // manageViews
        loading={loading}
        type="duplicate_arrest"
        // name="arrest"
        // persistState
        // footerNotes={
        //   <Stack spacing={0} direction="column">
        //     <Typography variant="caption">
        //       If a preferred name is provided, the legal first name appears in
        //       parentheses.
        //     </Typography>
        //     <Typography variant="caption">
        //       * indicates the displayed name is the preferred name, and the
        //       legal name is confidential.
        //     </Typography>
        //   </Stack>
        // }
      />
      <Dialog
        open={0 || showHelp}
        onClose={closeHelp}
        aria-labelledby="help-dialog-title"
        aria-describedby="help-dialog-description"
      >
        <DialogTitle id="help-dialog-title">
          How Duplicate Arrest Detection Works
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={closeHelp}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <Close />
        </IconButton>
        <DialogContent>
          <DialogContentText id="help-dialog-description">
            <Typography variant="h6" gutterBottom>
              Purpose
            </Typography>
            This tools scans all arrest records to find pairs that likely
            represent the same arrest event (one person being arrested) entered
            twice. Duplicate entries could be the result of multiple calls about
            the same arrest, or from online outtake import vs other sources. The
            tool can be used to merge potential duplicates into a single record.
            <Typography variant="h6" gutterBottom>
              How it works
            </Typography>
            It compares the following data points and assigns each arrest pair a
            similarity score from 0-100. The higher the match score, the more
            likely the two entries are the same arrest.
            <ul>
              <li>
                <b>Names:</b> First names, last names, and preferred names. Last
                name matches gives a higher score. Matches are determined using
                fuzzy text and phonetic matching algorithms.
              </li>
              <li>
                <b>Date of Birth:</b> Exact matches when available
              </li>
              <li>
                <b>Contact Info:</b> Email addresses and phone numbers
              </li>
              <li>
                <b>Arrest Timing:</b> How close in time the arrests occurred.
              </li>
            </ul>
            <Typography variant="h6" gutterBottom>
              <b>Filtering Options</b>
            </Typography>
            <ul>
              <li>
                <b>Max Difference Between Arrest Dates:</b> Matches where the
                time between arrest dates exceeds this limit will be ignored.
              </li>
              <li>
                <b>Strictly Match Arrest City:</b> By default, match pairs are
                ignored if the arrest cities are different. When this is
                disabled, arrest city has no impact on the match score
              </li>
              <li>
                <b>Exact DOB Required:</b> By default, match pairs are ignored
                if both entries have a date of birth and they go not match
                exactly. When this is disabled, date of birth has no impact on
                the match score.
              </li>
              <li>
                <b>Include Ignored Duplicates:</b> Disable the option to include
                pairs that have been marked as ignored.
              </li>
            </ul>
            <Typography variant="h6" gutterBottom>
              How to Use
            </Typography>
            <ul>
              <li>
                <b>Review high-scoring pairs first:</b> Focus on the pairs with
                the highest similarity scores.
              </li>
              <li>
                <b>Compare the arrests:</b> Clicking the match score will open a
                view that will allow you to compare the two records
                side-by-side. By default, only fields that differ will be shown.
              </li>
              <li>
                <b>Determine if they are the same arrest:</b> Note that the same
                person may have multiple arrests for separate incidents. We are
                only looking for the same person AND the same incident.
              </li>
              <li>
                <b>If they are the same arrest: </b> Use the arrow buttons to
                merge individual fields from the record on the right side to
                that on the left side. You can flip the direction of the pairs
                using the button near the top. When have merged all relevant
                info into the left-side record, use the &apos;Save Arrest And
                Delete Comparison&apos; to complete the merge process.
              </li>
              <li>
                <b>If they are not the same arrest:</b> Use the &apos;Mark These
                Arrests as Not Duplicates&apos; button to hide the arrest pair
                from future duplicate searches.
              </li>
            </ul>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHelp} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

export default ArrestDuplicatesPage
